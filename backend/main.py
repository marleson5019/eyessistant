import os
import logging
from logging.handlers import RotatingFileHandler
import numpy as np
try:
    import onnxruntime as ort
except Exception:
    ort = None
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import io
import json
from typing import Optional

# Google Drive
try:
    from google.oauth2 import service_account
    from googleapiclient.discovery import build
except Exception:
    service_account = None
    build = None

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

# Mapear índices para classes
CLASS_NAMES = {
    from fastapi import FastAPI, UploadFile, File, HTTPException, Request
    1: "catarata"
}

# Carrega o modelo ONNX
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "catarata.onnx")

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

session = None
try:
    if ort is None:
    # Mapear índices para classes (novo modelo)
    CLASS_NAMES = {
        0: "imature",
        1: "mature",
        2: "normal",
    }
    session = None

# Config Drive
GOOGLE_DRIVE_FOLDER_ID = os.environ.get("GOOGLE_DRIVE_FOLDER_ID", "1xP89zBKl8AFXTOpGBNroCiBacUMR4HeA")
GOOGLE_CREDENTIALS_PATH_DEFAULT = os.path.join(os.path.dirname(__file__), "credentials", "service_account.json")

def get_drive_service() -> Optional[object]:
    """Inicializa cliente do Google Drive usando Service Account.

    Requer variáveis/arquivo:
      - GOOGLE_APPLICATION_CREDENTIALS (opcional): caminho para JSON
      - ou backend/credentials/service_account.json
    """
    try:
        if service_account is None or build is None:
            logger.warning("Drive API não disponível (pacotes ausentes)")
            return None

        creds_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", GOOGLE_CREDENTIALS_PATH_DEFAULT)
        if not os.path.isfile(creds_path):
            logger.error(f"Credenciais do Google não encontradas em: {creds_path}")
            return None

        scopes = ["https://www.googleapis.com/auth/drive.file"]
        creds = service_account.Credentials.from_service_account_file(creds_path, scopes=scopes)
        service = build("drive", "v3", credentials=creds)
        return service
    except Exception as e:
      {
        "image": "base64_string",
        "filename": "opcional_nome.jpg"
      }
    Retorno:
      { "fileId": "...", "webViewLink": "..." }
    """
    try:
        body = await request.json()
        image_b64 = body.get("image")
        filename = body.get("filename") or f"eyessistant_{int(np.random.randint(1_000_000))}.jpg"

        if not image_b64:
            raise HTTPException(status_code=400, detail="Campo 'image' (base64) é obrigatório")

        import base64
        image_bytes = base64.b64decode(image_b64)

        # valida imagem
    
            "class_index": 0,
            "message": "Modelo não disponível — resultado de fallback"
        })
    
    try:
        # Lê a imagem do upload
        image_data = await file.read()
        img = Image.open(io.BytesIO(image_data)).convert("RGB")
        
        # Redimensiona para 224x224 (tamanho esperado pelo modelo)
        img = img.resize((224, 224))
        
        # Normaliza pixel para [0, 1]
        img_array = np.array(img).astype("float32") / 255.0

        # Converte de HWC (Height, Width, Channels) para CHW (Channels, Height, Width)
        img_array = np.transpose(img_array, (2, 0, 1))

        # Adiciona batch dimension: (1, 3, 224, 224)
        img_array = np.expand_dims(img_array, axis=0)
        
        # Executa inferência ONNX
        input_name = session.get_inputs()[0].name
        output_name = session.get_outputs()[0].name
        
        output = session.run([output_name], {input_name: img_array})
        
        # Processa output
        logits = output[0][0]  # Shape: (n_classes,)
        # Softmax estável numericamente
        exps = np.exp(logits - np.max(logits))
        probs = exps / np.sum(exps)
        # garantir que escolhemos o índice da maior probabilidade
        pred_index = int(np.argmax(probs))
        # confidence da classe predita
        confidence = float(probs[pred_index])

        # Mapeamento seguro: se o índice não existir em CLASS_NAMES, forçar entre 0 e 1
        if pred_index not in CLASS_NAMES:
            logger.warning(f"Índice de classe inesperado: {pred_index}. Forçando mapa entre 0/1.")
            # se houver pelo menos 2 classes, escolher entre as duas primeiras
            if probs.shape[0] >= 2:
                pred_index = 0 if float(probs[0]) >= float(probs[1]) else 1
            else:
                pred_index = 0

        pred_label = CLASS_NAMES.get(pred_index, "normal")

        # Log para depuração: logits e probs
        logger.info(f"logits={logits.tolist() if hasattr(logits, 'tolist') else str(logits)} probs={probs.tolist()}")

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
    """
    Realiza predição recebendo imagem em base64.
    Útil para integração com React Native.
    
    Body JSON:
        {
            "image": "base64_string"
        }
    """
    if session is None:
        logger.warning("predict_base64: modelo não carregado")
        return JSONResponse({
            "prediction": "normal",
            "confidence": 0.5,
            "class_index": 0,
            "message": "Modelo não disponível"
        })
    
    try:
        import base64
        
        # Ler JSON do body
        try:
            body = await request.json()
            image_base64 = body.get("image", "")
        except:
            image_base64 = ""
        
        if not image_base64:
            raise ValueError("Campo 'image' (base64) é obrigatório")
        
        # Decodifica base64 para bytes
        image_data = base64.b64decode(image_base64)
        img = Image.open(io.BytesIO(image_data)).convert("RGB")
        
        # Redimensiona para 224x224
        img = img.resize((224, 224))
        
        # Normaliza
        img_array = np.array(img).astype("float32") / 255.0
        img_array = np.transpose(img_array, (2, 0, 1))
        img_array = np.expand_dims(img_array, axis=0)
        
        # Inferência
        input_name = session.get_inputs()[0].name
        output_name = session.get_outputs()[0].name
        output = session.run([output_name], {input_name: img_array})
        
        logits = output[0][0]
        exps = np.exp(logits - np.max(logits))
        probs = exps / np.sum(exps)
        pred_index = int(np.argmax(probs))
        confidence = float(probs[pred_index])

        if pred_index not in CLASS_NAMES:
            logger.warning(f"predict-base64: índice inesperado {pred_index}, ajustando para 0/1")
            if probs.shape[0] >= 2:
                pred_index = 0 if float(probs[0]) >= float(probs[1]) else 1
            else:
                pred_index = 0

        pred_label = CLASS_NAMES.get(pred_index, "normal")
        logger.info(f"Predição: {pred_label} (confiança: {confidence:.4f}) logits={logits.tolist() if hasattr(logits, 'tolist') else str(logits)} probs={probs.tolist()}")
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
