#!/usr/bin/env python
"""
Script para testar a API de predição
Cria uma imagem de teste e envia para o servidor
"""

import base64
import json
import requests
from PIL import Image
import numpy as np
import time

# Configuração
API_URL = "http://localhost:8000"
TIMEOUT = 10

def create_test_image():
    """Cria uma imagem de teste aleatória (224x224 RGB)"""
    # Cria uma imagem aleatória
    img_array = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
    img = Image.fromarray(img_array)
    return img

def image_to_base64(img):
    """Converte imagem PIL para base64"""
    import io
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    img_base64 = base64.b64encode(buffer.getvalue()).decode()
    return img_base64

def test_health():
    """Testa endpoint /health"""
    print("🔍 Testando /health...")
    try:
        response = requests.get(f"{API_URL}/health", timeout=TIMEOUT)
        print(f"✅ Status: {response.status_code}")
        print(f"   Resposta: {response.json()}\n")
        return True
    except Exception as e:
        print(f"❌ Erro: {e}\n")
        return False

def test_root():
    """Testa endpoint raiz"""
    print("🔍 Testando / (raiz)...")
    try:
        response = requests.get(f"{API_URL}/", timeout=TIMEOUT)
        print(f"✅ Status: {response.status_code}")
        print(f"   Resposta: {response.json()}\n")
        return True
    except Exception as e:
        print(f"❌ Erro: {e}\n")
        return False

def test_predict_base64():
    """Testa endpoint /predict-base64"""
    print("🔍 Testando /predict-base64...")
    try:
        # Cria imagem de teste
        img = create_test_image()
        img_base64 = image_to_base64(img)
        
        # Envia para API
        payload = {"image": img_base64}
        response = requests.post(
            f"{API_URL}/predict-base64",
            json=payload,
            timeout=TIMEOUT
        )
        
        print(f"✅ Status: {response.status_code}")
        result = response.json()
        print(f"   Prediction: {result.get('prediction')}")
        print(f"   Confidence: {result.get('confidence')}")
        print(f"   Class Index: {result.get('class_index')}")
        print(f"   Message: {result.get('message')}\n")
        return True
    except Exception as e:
        print(f"❌ Erro: {e}\n")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("🧪 TESTE DA API EYESSISTANT")
    print("=" * 60 + "\n")
    
    print("Aguardando servidor...")
    time.sleep(2)
    
    results = {
        "health": test_health(),
        "root": test_root(),
        "predict": test_predict_base64(),
    }
    
    print("=" * 60)
    print("📊 RESUMO DOS TESTES")
    print("=" * 60)
    for endpoint, passed in results.items():
        status = "✅ PASSOU" if passed else "❌ FALHOU"
        print(f"{endpoint}: {status}")
    
    total_passed = sum(results.values())
    total_tests = len(results)
    print(f"\nTotal: {total_passed}/{total_tests} testes passaram")
