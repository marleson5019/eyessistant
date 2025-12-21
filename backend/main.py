import os
import logging
import secrets
from datetime import datetime
from logging.handlers import RotatingFileHandler
import numpy as np
try:
    import onnxruntime as ort
except Exception:
    ort = None
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlmodel import Field, Session, SQLModel, create_engine, select
from PIL import Image
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
import io
import json
from typing import Optional
import base64
from dotenv import load_dotenv

# Carrega variáveis do .env local (para desenvolvimento)
load_dotenv()

# Inicializa FastAPI
app = FastAPI(
    title="Eyessistant AI - Catarata Detector",
    description="API para detecção de catarata usando modelo ONNX",
    version="1.0.0"
)

# CORS - permite requisições do app React Native/web
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar domínios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware para adicionar headers extras de compatibilidade
@app.middleware("http")
async def add_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    return response

# Mapear índices para classes (novo modelo)
CLASS_NAMES = {
    0: "imature",
    1: "mature",
    2: "normal",
}

# Carrega o modelo ONNX
# __file__ aponta para backend/main.py, models está em backend/models
import urllib.request

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models", "catarata.onnx")
if not os.path.isfile(MODEL_PATH):
    # Fallback: checar diretório de trabalho (Render rootDir=backend)
    MODEL_PATH = os.path.join(os.getcwd(), "models", "catarata.onnx")

# Se não encontrar, tenta baixar (fallback para URL pública)
FALLBACK_MODEL_URL = os.environ.get("CATARATA_MODEL_URL", "")  # usuário pode fornecer URL
if not os.path.isfile(MODEL_PATH) and FALLBACK_MODEL_URL:
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    logger.info(f"Baixando modelo de {FALLBACK_MODEL_URL}...")
    try:
        urllib.request.urlretrieve(FALLBACK_MODEL_URL, MODEL_PATH)
        logger.info(f"Modelo baixado com sucesso: {MODEL_PATH}")
    except Exception as e:
        logger.warning(f"Falha ao baixar modelo: {e}")

# Garantir diretório de logs
LOG_DIR = os.path.join(os.path.dirname(__file__), "logs")
os.makedirs(LOG_DIR, exist_ok=True)
LOG_FILE = os.path.join(LOG_DIR, "server.log")

# Configura logging
logger = logging.getLogger("eyessistant.backend")
logger.setLevel(logging.INFO)
handler = RotatingFileHandler(LOG_FILE, maxBytes=5 * 1024 * 1024, backupCount=3, encoding='utf-8')
formatter = logging.Formatter("%(asctime)s %(levelname)s %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.addHandler(logging.StreamHandler())

# ---------- Banco de dados e autenticação ----------
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    f"sqlite:///{os.path.join(os.path.dirname(__file__), 'eyessistant.db')}"
)
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args)


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: EmailStr = Field(index=True, sa_column_kwargs={"unique": True})
    password_hash: str
    token: Optional[str] = Field(default=None, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Analysis(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    prediction: str
    confidence: float
    class_index: int
    created_at: datetime = Field(default_factory=datetime.utcnow)


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session() -> Session:
    return Session(engine)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


def extract_token(request: Request) -> Optional[str]:
    auth_header = request.headers.get("Authorization", "")
    if auth_header.lower().startswith("bearer "):
        return auth_header.split(" ", 1)[1].strip()
    return None


def get_user_by_token(token: str) -> Optional[User]:
    with get_session() as session:
        statement = select(User).where(User.token == token)
        result = session.exec(statement).first()
        return result


def record_analysis(user_id: Optional[int], prediction: str, confidence: float, class_index: int):
    try:
        with get_session() as session:
            analysis = Analysis(
                user_id=user_id,
                prediction=prediction,
                confidence=confidence,
                class_index=class_index,
            )
            session.add(analysis)
            session.commit()
    except Exception:
        logger.exception("Falha ao registrar análise no banco")


# Inicializa tabelas após definição dos modelos
create_db_and_tables()

session = None
try:
    if ort is None:
        raise RuntimeError("onnxruntime não disponível")
    session = ort.InferenceSession(MODEL_PATH)
    logger.info(f"[OK] Modelo carregado com sucesso de: {MODEL_PATH}")
except Exception as e:
    logger.exception(f"[ERRO] Erro ao carregar modelo: {e}")
    session = None


@app.get("/")
def root():
    """Endpoint raiz para verificar se API está ativa"""
    return {
        "status": "online",
        "message": "Eyessistant API está rodando",
        "model_loaded": session is not None
    }


@app.get("/health")
def health_check():
    """Health check para monitoramento"""
    return {
        "status": "healthy" if session is not None else "unhealthy",
        "model": "catarata_detection"
    }


class RegisterPayload(BaseModel):
    email: EmailStr
    password: str


class LoginPayload(BaseModel):
    email: EmailStr
    password: str


def sanitize_user(user: User):
    return {
        "id": user.id,
        "email": user.email,
        "created_at": user.created_at,
        "token": user.token,
    }


@app.post("/auth/register")
def register(payload: RegisterPayload):
    with get_session() as db:
        exists = db.exec(select(User).where(User.email == payload.email)).first()
        if exists:
            raise HTTPException(status_code=400, detail="Email já registrado")
        user = User(
            email=payload.email,
            password_hash=hash_password(payload.password),
            token=secrets.token_hex(32),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return sanitize_user(user)


@app.post("/auth/login")
def login(payload: LoginPayload):
    with get_session() as db:
        user = db.exec(select(User).where(User.email == payload.email)).first()
        if not user or not verify_password(payload.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Credenciais inválidas")
        user.token = secrets.token_hex(32)
        db.add(user)
        db.commit()
        db.refresh(user)
        return sanitize_user(user)


@app.get("/auth/me")
def me(request: Request):
    token = extract_token(request)
    if not token:
        raise HTTPException(status_code=401, detail="Token não enviado")
    user = get_user_by_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Token inválido")
    return sanitize_user(user)


@app.get("/stats/summary")
def stats_summary():
    with get_session() as db:
        analyses = db.exec(select(Analysis)).all()
        total = len(analyses)
        normal = sum(1 for a in analyses if a.prediction == "normal")
        imature = sum(1 for a in analyses if a.prediction == "imature")
        mature = sum(1 for a in analyses if a.prediction == "mature")

        by_month = {}
        for a in analyses:
            key = a.created_at.strftime("%Y-%m")
            by_month[key] = by_month.get(key, 0) + 1
        by_month_list = [
            {"month": k, "count": by_month[k]}
            for k in sorted(by_month.keys())
        ]

        return {
            "total": total,
            "normal": normal,
            "imature": imature,
            "mature": mature,
            "by_month": by_month_list,
        }


@app.post("/validate-eye")
async def validate_eye(request: Request):
    """
    Valida se a imagem contém um olho antes de analisar catarata.
    Usa heurísticas simples: detecta círculos (íris/pupila) ou regiões redondas.
    """
    try:
        body = await request.json()
        image_base64 = body.get("image", "")
        
        if not image_base64:
            raise ValueError("Campo 'image' (base64) é obrigatório")
        
        image_data = base64.b64decode(image_base64)
        img = Image.open(io.BytesIO(image_data)).convert("RGB")
        
        # Redimensiona para análise rápida
        img_small = img.resize((224, 224))
        img_array = np.array(img_small)
        
        # Heurística 1: Verifica se há região escura (pupila) circundada por região mais clara (íris)
        gray = np.mean(img_array, axis=2)
        center = gray[112-30:112+30, 112-30:112+30]
        center_mean = np.mean(center)
        
        # Heurística 2: Verifica contraste entre centro e bordas
        borders = np.concatenate([
            gray[:20, :].flatten(),
            gray[-20:, :].flatten(),
            gray[:, :20].flatten(),
            gray[:, -20:].flatten()
        ])
        border_mean = np.mean(borders)
        
        # Se centro é significativamente mais escuro que bordas, provavelmente é olho
        is_eye = (center_mean < border_mean * 0.85)
        confidence = min(abs(border_mean - center_mean) / 100.0, 1.0)
        
        logger.info(f"Validação de olho: is_eye={is_eye}, confidence={confidence:.2f}")
        
        return JSONResponse({
            "is_eye": is_eye,
            "confidence": round(confidence, 2),
            "message": "Imagem parece ser de um olho" if is_eye else "Imagem não parece ser de um olho"
        })
    
    except Exception as e:
        logger.exception("Erro no /validate-eye")
        raise HTTPException(status_code=400, detail=f"Erro ao validar imagem: {str(e)}")


@app.post("/predict")
async def predict(request: Request, file: UploadFile = File(...)):
    """
    Realiza predição de catarata em uma imagem.
    
    Args:
        file: Arquivo de imagem (jpg, png, etc.)
    
    Returns:
        {
            "prediction": "imature" | "mature" | "normal",
            "confidence": float (0-1),
            "class_index": int,
            "message": str
        }
    """
    
    if session is None:
        logger.warning("predict: modelo não carregado, retornando fallback 'normal'")
        return JSONResponse({
            "prediction": "normal",
            "confidence": 0.5,
            "class_index": 0,
            "message": "Modelo não disponível — resultado de fallback"
        })
    
    try:
        image_data = await file.read()
        img = Image.open(io.BytesIO(image_data)).convert("RGB")
        img = img.resize((224, 224))
        
        img_array = np.array(img).astype("float32") / 255.0
        img_array = np.transpose(img_array, (2, 0, 1))
        img_array = np.expand_dims(img_array, axis=0)
        
        input_name = session.get_inputs()[0].name
        output_name = session.get_outputs()[0].name
        output = session.run([output_name], {input_name: img_array})
        
        logits = output[0][0]
        exps = np.exp(logits - np.max(logits))
        probs = exps / np.sum(exps)
        pred_index = int(np.argmax(probs))
        confidence = float(probs[pred_index])

        if pred_index not in CLASS_NAMES:
            logger.warning(f"Índice inesperado: {pred_index}")
            pred_index = 0 if pred_index > 1 else pred_index

        pred_label = CLASS_NAMES.get(pred_index, "normal")
        logger.info(f"Predição: {pred_label} (confiança: {confidence:.4f})")

        token = extract_token(request)
        user = get_user_by_token(token) if token else None
        record_analysis(user.id if user else None, pred_label, confidence, pred_index)

        return JSONResponse({
            "prediction": pred_label,
            "confidence": round(confidence, 4),
            "class_index": pred_index,
            "message": f"Análise concluída com confiança de {confidence*100:.1f}%"
        })
    
    except Exception as e:
        logger.exception("Erro no /predict")
        raise HTTPException(status_code=400, detail=f"Erro ao processar imagem: {str(e)}")


@app.post("/predict-base64")
async def predict_base64(request: Request):
    """Realiza predição recebendo imagem em base64."""
    if session is None:
        logger.warning("predict_base64: modelo não carregado")
        return JSONResponse({
            "prediction": "normal",
            "confidence": 0.5,
            "class_index": 0,
            "message": "Modelo não disponível"
        })
    
    try:
        body = await request.json()
        image_base64 = body.get("image", "")
        
        if not image_base64:
            raise ValueError("Campo 'image' (base64) é obrigatório")
        
        image_data = base64.b64decode(image_base64)
        img = Image.open(io.BytesIO(image_data)).convert("RGB")
        img = img.resize((224, 224))
        
        img_array = np.array(img).astype("float32") / 255.0
        img_array = np.transpose(img_array, (2, 0, 1))
        img_array = np.expand_dims(img_array, axis=0)
        
        input_name = session.get_inputs()[0].name
        output_name = session.get_outputs()[0].name
        output = session.run([output_name], {input_name: img_array})
        
        logits = output[0][0]
        exps = np.exp(logits - np.max(logits))
        probs = exps / np.sum(exps)
        pred_index = int(np.argmax(probs))
        confidence = float(probs[pred_index])

        if pred_index not in CLASS_NAMES:
            logger.warning(f"predict-base64: índice inesperado {pred_index}")
            pred_index = 0 if pred_index > 1 else pred_index

        pred_label = CLASS_NAMES.get(pred_index, "normal")
        logger.info(f"Predição: {pred_label} (confiança: {confidence:.4f})")

        token = extract_token(request)
        user = get_user_by_token(token) if token else None
        record_analysis(user.id if user else None, pred_label, confidence, pred_index)
        
        return JSONResponse({
            "prediction": pred_label,
            "confidence": round(confidence, 4),
            "class_index": pred_index,
            "message": f"Análise concluída: {pred_label}"
        })
    
    except Exception as e:
        logger.exception("Erro no /predict-base64")
        raise HTTPException(status_code=400, detail=f"Erro ao processar imagem: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
