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

# Mapear índices para classes (novo modelo)
CLASS_NAMES = {
    0: "imature",
    1: "mature",
    2: "normal",
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


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
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
        import base64
        
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
