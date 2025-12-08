# Dockerfile para Eyessistant backend (FastAPI + ONNXRuntime)
FROM python:3.11-slim

# Instala dependências do SO para pillow/onnxruntime
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libglib2.0-0 \
    libstdc++6 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Diretório de trabalho
WORKDIR /app

# Copia arquivos de requirements e instala
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código da aplicação
COPY . /app

# Exponha porta padrão
EXPOSE 8000

# Variáveis de ambiente
ENV PYTHONUNBUFFERED=1
ENV UVICORN_HOST=0.0.0.0
ENV UVICORN_PORT=8000

# Comando padrão para iniciar o servidor
CMD ["python", "main.py"]
