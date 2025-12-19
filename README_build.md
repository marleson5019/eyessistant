# Build APK do Eyessistant sem Android Studio

Este guia usa o EAS Build (nuvem) para gerar APK sem instalar Android Studio/SDK localmente.

## Pré-requisitos
- Conta Expo (gratuita)
- `eas-cli` instalado
- Backend rodando e acessível pela rede/internet

## 1) Subir o backend
No PowerShell:

```powershell
cd backend
python -m venv .venv
./.venv/Scripts/Activate.ps1
pip install -r requirements.txt
python ./main.py
```

Teste: abra `http://SEU_IP_LOCAL:8000/health` e verifique `healthy`.

### Opcional: expor com ngrok (HTTPS)
Há um script pronto:

```powershell
./expose-ngrok.bat
```

Copie a URL gerada (ex.: `https://xxxx-...ngrok-free.app`).

### Alternativa: Hospedar no Render (recomendado para APK)
1. Garanta que o arquivo `backend/models/catarata.onnx` está versionado.
2. No painel do Render, escolha "New +" → "Blueprint" → aponte para este repositório.
3. Confirme o serviço `eyessistant-backend` (ele usa `render.yaml`, plano free, porta 10000).
4. Espere o deploy finalizar e pegue a URL pública (ex.: `https://eyessistant-backend.onrender.com`).
5. Use essa URL em `EXPO_PUBLIC_API_URL` no build do APK.

## 2) Definir a URL da API no app
O app lê `EXPO_PUBLIC_API_URL`.

Você pode:
- Editar `eas.json` e ajustar o valor em `env.EXPO_PUBLIC_API_URL` para seu IP ou URL ngrok.
- Ou passar via CLI: `--env EXPO_PUBLIC_API_URL=...`.

Exemplos:

```powershell
# IP local da sua máquina na mesma rede do celular
eas build -p android --profile preview --env EXPO_PUBLIC_API_URL="http://192.168.0.100:8000"

# Usando ngrok (HTTPS)
eas build -p android --profile preview --env EXPO_PUBLIC_API_URL="https://seu-subdominio.ngrok-free.app"
```

> Em `eas.json` já existe um perfil `preview` com `buildType: apk`. Ajuste o IP conforme sua rede.

## 3) Instalar EAS CLI e fazer login

```powershell
npm install -g eas-cli
eas login
eas build:configure
```

## 4) Gerar o APK (nuvem)

```powershell
# Usando a env via linha de comando
eas build -p android --profile preview --env EXPO_PUBLIC_API_URL="http://192.168.0.100:8000"

# Ou com a env definida no eas.json
eas build -p android --profile preview
```

Ao final, o EAS mostrará um link para baixar o APK.

## 5) Instalar o APK no celular
- Transfira o arquivo para o dispositivo e instale.
- Certifique-se de que o celular e o backend estão na mesma rede (se usar IP local).
- Se usar ngrok, a conexão é HTTPS e funciona de qualquer rede.

## Dicas
- Se o app não receber resposta, verifique firewall do Windows (libere porta 8000).
- Em dispositivo físico, **não use** `10.0.2.2` (válido só para emulador). Use IP local ou ngrok.
- Rotas/overlays de dev somem no APK (modo produção). Para simular sem build: `npx expo start --no-dev --minify`.
