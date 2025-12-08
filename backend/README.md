# Eyessistant Backend

Backend FastAPI para integração do modelo de detecção de catarata (ONNX).

## Instalação

```bash
cd backend
pip install -r requirements.txt
```

## Executar localmente

```bash
python main.py
```

ou

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

A API estará disponível em `http://localhost:8000`

## Documentação Interativa

Acesse `http://localhost:8000/docs` para testar os endpoints com Swagger UI.

## Endpoints

### GET `/`
Status da API

### GET `/health`
Health check
## Executar localmente (PowerShell)

Recomendo usar o script `run_backend.ps1` que inicia o servidor em background e salva logs:

```powershell
cd "C:\Users\marly\OneDrive\Desktop\Eyessistant\backend"
./run_backend.ps1
```

Também é possível executar diretamente (modo foreground):

```powershell
cd "C:\Users\marly\OneDrive\Desktop\Eyessistant\backend"
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```


### POST `/predict`
Realiza predição com upload de arquivo
- **Body:** multipart/form-data com arquivo de imagem
- **Returns:** JSON com `prediction`, `confidence`, `class_index`, `message`

### POST `/predict-base64`
Realiza predição com imagem em base64 (ideal para React Native)
- **Body:** `{"image": "base64_string"}`
- **Returns:** JSON com resultado da predição

## Onde colocar o arquivo `.onnx`

Copie o arquivo `catarata.onnx` para:
```
backend/models/catarata.onnx
```

## Hospedagem Futura

### Opções gratuitas/baratas:

Exemplo de chamada cURL (base64):

```powershell
# supondo que você tenha test.png
$b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes('test.png'))
Invoke-RestMethod -Uri http://localhost:8000/predict-base64 -Method POST -ContentType 'application/json' -Body (@{{image=$b64}} | ConvertTo-Json)
```

Integração com o app (React Native / Expo): configure `EXPO_PUBLIC_API_URL` no ambiente ou `app.config` para apontar para `http://localhost:8000` (para emulador) ou para o IP da sua máquina quando em dispositivo físico.

Deploy com Docker:

```powershell
cd "backend"
docker build -t eyessistant-backend:latest .
docker run -p 8000:8000 --rm eyessistant-backend:latest
```

Observação: em produção, proteja CORS e configure HTTPS e autenticação.

## Teste rápido local (passo a passo)

1. Abra um PowerShell e instale dependências (se ainda não):

```powershell
cd "C:\Users\marly\OneDrive\Desktop\Eyessistant\backend"
python -m pip install -r requirements.txt
```

2. Inicie o backend (recomendado — usa o script que grava logs):

```powershell
cd "C:\Users\marly\OneDrive\Desktop\Eyessistant\backend"
./run_backend.ps1
# O script iniciará o backend em background e criará um arquivo em ./logs
```

3. Verifique health no navegador ou PowerShell:

```powershell
Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing
```

4. Teste com o script automatizado (após servidor ativo):

```powershell
python test_api.py
```

5. Teste via Swagger UI: abra `http://localhost:8000/docs` no navegador e use o `POST /predict-base64` para enviar uma imagem (em base64) ou `POST /predict` para upload multipart.

Observação para Android emulator: se estiver testando o app no emulador Android (Android Studio / AVD), use a URL `http://10.0.2.2:8000` como `API_BASE_URL`. O frontend já tenta detectar isso automaticamente.

## Integração no app (React Native / Expo)

- No frontend, o serviço `services/catarata-api.ts` já detecta `EXPO_PUBLIC_API_URL` e usa `http://10.0.2.2:8000` para emulador Android ou `http://localhost:8000` no iOS/simulador web.
- Para testar no dispositivo físico (celular), substitua por: `http://<SEU_IP_LOCAL>:8000` (o computador que roda o backend) e certifique-se que seu firewall permite conexões na porta 8000.

Exemplo rápido de chamada via fetch (React Native):

```ts
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
const res = await fetch(`${API_URL}/predict-base64`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ image: base64String }) });
```

## Build do app (APK) com Expo / EAS

Se você está usando Expo (como este projeto), a maneira mais simples de gerar um APK/AAB é usar o EAS Build.

1. Instale EAS CLI (se ainda não):

```bash
npm install -g eas-cli
eas login
```

2. Configure seu `app.json`/`app.config` com `expo.android.package` e outras infos necessárias.

3. Faça o build (Android):

```bash
# gera AAB (recomendado para Play Store)
eas build -p android --profile production

# ou gerar APK direta (opção legacy / testing)
eas build -p android --profile preview
```

4. Depois que o build terminar, baixe o artefato (APK/AAB) e instale no aparelho para testes. Para publicação, envie o AAB ao Google Play.

Observações:
- Se quiser distribuir um APK rápido, também é possível usar `expo run:android` para rodar diretamente no dispositivo conectado (requer Android Studio/ADB).
- Para uma app nativa com integração offline e instalações diretas, usar EAS/managed workflow é o caminho mais simples.


1. **Render** (render.com) - Deploy grátis, 512MB RAM
2. **Railway** (railway.app) - Free tier generoso
3. **Heroku** (heroku.com) - Ainda tem free tier limitado
4. **AWS Lambda** + API Gateway
5. **Google Cloud Run** - Pay per use

### Para hospedagem:
1. Crie repositório GitHub com todo o código
2. Conecte ao serviço de hosting
3. Defina variáveis de ambiente se necessário
4. Deploy automático a cada push

## Integração com React Native

No `app/analise.tsx`, use:

```typescript
const API_URL = "http://localhost:8000"; // Local
// const API_URL = "https://seu-backend.onrender.com"; // Produção

const response = await fetch(`${API_URL}/predict-base64`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ image: base64Image })
});
```
