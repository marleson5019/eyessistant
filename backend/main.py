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
from urllib.parse import urlparse, urlunparse
import socket
import bcrypt
from typing import Optional, List

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
    allow_origin_regex=".*",
    allow_credentials=False,
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

# Tenta conectar com PostgreSQL (IPv4 + ssl + pgbouncer), fallback para SQLite se falhar
def create_engine_with_fallback():
    # SQLite connect args
    if DATABASE_URL.startswith("sqlite"):
        try:
            engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})
            with engine.connect() as conn:
                conn.exec_driver_sql("SELECT 1")
            logger.info("✅ Banco SQLite conectado")
            return engine
        except Exception as e:
            logger.exception("Falha ao conectar SQLite")
            raise

    # Postgres: preparar connect_args e resolver IPv4
    parsed = urlparse(DATABASE_URL)
    connect_args = {"sslmode": "require"}
    host = parsed.hostname or ""
    port = parsed.port or 5432

    ipv4 = None
    try:
        addrs = socket.getaddrinfo(host, port, family=socket.AF_INET)
        if addrs:
            ipv4 = addrs[0][4][0]
            connect_args["hostaddr"] = ipv4
    except Exception:
        pass

    def try_connect(url_str: str, label: str):
        try:
            eng = create_engine(url_str, echo=False, connect_args=connect_args)
            with eng.connect() as conn:
                conn.exec_driver_sql("SELECT 1")
            logger.info(f"✅ Conectado a Postgres ({label}) host={host} ip={ipv4 or 'n/a'}")
            return eng
        except Exception as e:
            logger.warning(f"❌ Falha Postgres ({label}) {url_str[:60]}...: {e}")
            return None

    # Tenta porta informada (normalmente 5432)
    # Se tivermos IPv4 resolvido, reescreve netloc para usar IP diretamente
    url_primary = DATABASE_URL
    if ipv4:
        userinfo = ''
        if parsed.username:
            userinfo = parsed.username
            if parsed.password:
                userinfo += f":{parsed.password}"
            userinfo += "@"
        netloc_ip = f"{userinfo}{ipv4}:{port}"
        url_primary = urlunparse(parsed._replace(netloc=netloc_ip))

    engine_pg = try_connect(url_primary, f"{port}")
    if engine_pg:
        return engine_pg

    # Tenta pgbouncer (6543)
    if port != 6543:
        # Reescreve netloc para 6543, preferindo IP se disponível
        userinfo = ''
        if parsed.username:
            userinfo = parsed.username
            if parsed.password:
                userinfo += f":{parsed.password}"
            userinfo += "@"
        host_for_netloc = ipv4 or parsed.hostname or ''
        new_netloc = f"{userinfo}{host_for_netloc}:6543"
        alt_url = urlunparse(parsed._replace(netloc=new_netloc))
        engine_pg = try_connect(alt_url, "6543")
        if engine_pg:
            return engine_pg

    # Fallback SQLite
    logger.info("🔄 Usando SQLite como fallback...")
    sqlite_url = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'eyessistant.db')}"
    engine = create_engine(sqlite_url, echo=False, connect_args={"check_same_thread": False})
    return engine

engine = create_engine_with_fallback()


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: EmailStr = Field(index=True, sa_column_kwargs={"unique": True})
    password_hash: str
    token: Optional[str] = Field(default=None, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    name: Optional[str] = Field(default=None, max_length=255)
    phone: Optional[str] = Field(default=None, max_length=50)
    birthdate: Optional[str] = Field(default=None, max_length=50)
    cpf: Optional[str] = Field(default=None, max_length=50)
    photo_base64: Optional[str] = Field(default=None)


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


def ensure_user_columns():
    """Adiciona colunas novas na tabela user se ainda não existirem (Postgres/SQLite)."""
    statements: List[str] = [
        'ALTER TABLE "user" ADD COLUMN IF NOT EXISTS name VARCHAR(255)',
        'ALTER TABLE "user" ADD COLUMN IF NOT EXISTS phone VARCHAR(50)',
        'ALTER TABLE "user" ADD COLUMN IF NOT EXISTS birthdate VARCHAR(50)',
        'ALTER TABLE "user" ADD COLUMN IF NOT EXISTS cpf VARCHAR(50)',
        'ALTER TABLE "user" ADD COLUMN IF NOT EXISTS photo_base64 TEXT',
    ]
    try:
        with engine.begin() as conn:
            for stmt in statements:
                try:
                    conn.exec_driver_sql(stmt)
                except Exception as e:
                    logger.warning(f"Ignorando erro ao aplicar migration: {stmt} -> {e}")
    except Exception:
        logger.exception("Falha ao garantir colunas novas em user")


def get_session() -> Session:
    return Session(engine)


def hash_password(password: str) -> str:
    # Bcrypt tem limite de 72 bytes - truncar se necessário
    raw_bytes = password.encode('utf-8')
    if len(raw_bytes) > 72:
        logger.warning(f"[AUTH] Senha maior que 72 bytes, truncando. bytes={len(raw_bytes)}")
    password_bytes = raw_bytes[:72]
    # Hash usando bcrypt diretamente para evitar erros de backend
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    # Truncar da mesma forma para verificação
    password_bytes = password.encode('utf-8')[:72]
    try:
        return bcrypt.checkpw(password_bytes, hashed.encode('utf-8'))
    except Exception:
        # Fallback para passlib caso necessário
        try:
            return pwd_context.verify(password_bytes.decode('utf-8', errors='ignore'), hashed)
        except Exception:
            return False


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


# Inicializa tabelas e garante colunas novas
create_db_and_tables()
ensure_user_columns()

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


@app.get("/db/health")
def db_health():
    """Verifica conectividade com o banco executando SELECT 1.
    Em ambientes com Postgres, também retorna os IPs resolvidos do host (sem expor segredos).
    """
    try:
        with engine.connect() as conn:
            # Usa driver SQL direto para independência de ORM
            conn.exec_driver_sql("SELECT 1")
        status = "ok"
    except Exception as e:
        logger.exception("Falha /db/health")
        return JSONResponse(status_code=500, content={"status": "error", "detail": str(e)})

    # Informações adicionais úteis para diagnóstico
    info = {"status": status}
    try:
        from urllib.parse import urlparse
        import socket
        parsed = urlparse(DATABASE_URL)
        if parsed.scheme.startswith("postgres") and parsed.hostname:
            # Resolve IPs (IPv4/IPv6) do host
            addrs = socket.getaddrinfo(parsed.hostname, parsed.port or 5432)
            resolved = []
            for a in addrs:
                ip = a[4][0]
                fam = "IPv6" if a[0] == socket.AF_INET6 else "IPv4"
                resolved.append({"ip": ip, "family": fam})
            info["resolved"] = resolved
            info["host"] = parsed.hostname
            info["port"] = parsed.port or 5432
            info["driver"] = "psycopg2"
        else:
            info["driver"] = "sqlite"
    except Exception:
        pass

    return info


class RegisterPayload(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None
    phone: Optional[str] = None
    birthdate: Optional[str] = None
    cpf: Optional[str] = None
    photo_base64: Optional[str] = None


class LoginPayload(BaseModel):
    email: EmailStr
    password: str


class UpdateProfilePayload(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    birthdate: Optional[str] = None
    cpf: Optional[str] = None
    photo_base64: Optional[str] = None
    new_password: Optional[str] = None


def sanitize_user(user: User):
    return {
        "id": user.id,
        "email": user.email,
        "created_at": user.created_at,
        "token": user.token,
        "name": user.name,
        "phone": user.phone,
        "birthdate": user.birthdate,
        "cpf": user.cpf,
        "photo_base64": user.photo_base64,
    }


def require_user(request: Request) -> User:
    token = extract_token(request)
    if not token:
        raise HTTPException(status_code=401, detail="Token não enviado")
    user = get_user_by_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Token inválido")
    return user


@app.post("/auth/register")
def register(payload: RegisterPayload):
    try:
        logger.info(f"[AUTH] Tentativa de registro: {payload.email}")
        with get_session() as db:
            exists = db.exec(select(User).where(User.email == payload.email)).first()
            if exists:
                logger.warning(f"[AUTH] Email já registrado: {payload.email}")
                raise HTTPException(status_code=400, detail="Email já registrado")
            user = User(
                email=payload.email,
                password_hash=hash_password(payload.password),
                token=secrets.token_hex(32),
                name=payload.name,
                phone=payload.phone,
                birthdate=payload.birthdate,
                cpf=payload.cpf,
                photo_base64=payload.photo_base64,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info(f"[AUTH] Usuário registrado com sucesso: {payload.email}")
            return sanitize_user(user)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"[AUTH] Erro ao registrar usuário: {payload.email}")
        raise HTTPException(status_code=500, detail=f"Erro ao criar usuário: {str(e)}")


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
    user = require_user(request)
    return sanitize_user(user)


@app.get("/profile")
def get_profile(request: Request):
    user = require_user(request)
    return sanitize_user(user)


@app.put("/profile")
def update_profile(request: Request, payload: UpdateProfilePayload):
    user = require_user(request)
    with get_session() as db:
        # Recarrega do banco para lock
        db_user = db.exec(select(User).where(User.id == user.id)).first()
        if payload.email and payload.email != db_user.email:
            exists = db.exec(select(User).where(User.email == payload.email)).first()
            if exists:
                raise HTTPException(status_code=400, detail="Email já registrado por outro usuário")
            db_user.email = payload.email

        if payload.name is not None:
            db_user.name = payload.name
        if payload.phone is not None:
            db_user.phone = payload.phone
        if payload.birthdate is not None:
            db_user.birthdate = payload.birthdate
        if payload.cpf is not None:
            db_user.cpf = payload.cpf
        if payload.photo_base64 is not None:
            db_user.photo_base64 = payload.photo_base64
        if payload.new_password:
            db_user.password_hash = hash_password(payload.new_password)

        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return sanitize_user(db_user)


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

        # Se vier no formato data URL, remover o prefixo
        if "," in image_base64 and image_base64.strip().lower().startswith("data:image"):
            image_base64 = image_base64.split(",", 1)[1]

        # Normaliza quebras de linha que podem quebrar o base64
        image_base64 = image_base64.replace("\n", "").replace("\r", "")
        
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

        # Diferença de luminância entre borda e centro
        diff = float(border_mean - center_mean)
        ratio = float(center_mean / (border_mean + 1e-6))

        # Regras mais rígidas: exige contraste mínimo e razão centro/borda mais escura
        contrast_ok = diff > 25.0
        ratio_ok = ratio < 0.9
        is_eye = bool(contrast_ok and ratio_ok)

        # Confiança baseada no contraste normalizado
        confidence = float(max(min(diff / 60.0, 1.0), 0.0))
        
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
