# ============================================
# EYESSISTANT - SETUP LOCAL COM NGROK
# ============================================
# Este script configura tudo para rodar localmente

param(
    [string]$NtId = $null
)

Write-Host "=== SETUP EYESSISTANT LOCAL ===" -ForegroundColor Cyan

# 1. Baixar ngrok se não existe
$ngrokhome = "$env:USERPROFILE\.ngrok2"
if (-not (Test-Path "$env:USERPROFILE\ngrok.exe")) {
    Write-Host "Baixando ngrok..." -ForegroundColor Yellow
    $url = "https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip"
    $output = "$env:TEMP\ngrok.zip"
    Invoke-WebRequest -Uri $url -OutFile $output -ErrorAction Stop
    Expand-Archive -Path $output -DestinationPath $env:USERPROFILE -Force
    Remove-Item $output
    Write-Host "ngrok instalado!" -ForegroundColor Green
}

# 2. Verificar se tem ngrok auth token
if ($NtId) {
    & "$env:USERPROFILE\ngrok.exe" config add-authtoken $NtId
    Write-Host "Token ngrok configurado!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE: Você precisa de um token ngrok" -ForegroundColor Yellow
    Write-Host "1. Vá a: https://dashboard.ngrok.com/auth/your-authtoken" -ForegroundColor Cyan
    Write-Host "2. Copie seu auth token" -ForegroundColor Cyan
    Write-Host "3. Execute: .\setup-local.ps1 -NtId 'seu_token_aqui'" -ForegroundColor Cyan
    Write-Host ""
}

# 3. Criar batch files para facilitar
$backendBat = @"
@echo off
cd /d "%~dp0"
echo === INICIANDO BACKEND ===
cd backend
python -m pip install -r requirements.txt -q
python -m uvicorn main:app --host 0.0.0.0 --port 8000
pause
"@

$frontendBat = @"
@echo off
cd /d "%~dp0"
echo === INICIANDO FRONTEND ===
npx expo start --web
pause
"@

$ngrokhostBat = @"
@echo off
echo === EXPONDO BACKEND COM NGROK ===
"%USERPROFILE%\ngrok.exe" http 8000
pause
"@

# Salvar em raiz do projeto
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Content -Path "$projectRoot\start-backend.bat" -Value $backendBat -Encoding ASCII
Set-Content -Path "$projectRoot\start-frontend.bat" -Value $frontendBat -Encoding ASCII
Set-Content -Path "$projectRoot\expose-ngrok.bat" -Value $ngrokhostBat -Encoding ASCII

Write-Host ""
Write-Host "PROXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Abra TRES janelas PowerShell/CMD" -ForegroundColor White
Write-Host ""
Write-Host "JANELA 1 - Backend:" -ForegroundColor Yellow
Write-Host "cd C:\Users\marly\OneDrive\Desktop\Eyessistant" -ForegroundColor Gray
Write-Host ".\start-backend.bat" -ForegroundColor Gray
Write-Host ""
Write-Host "JANELA 2 - Ngrok:" -ForegroundColor Yellow
Write-Host ".\expose-ngrok.bat" -ForegroundColor Gray
Write-Host "(Copie a URL gerada, ex: https://abc123.ngrok.io)" -ForegroundColor Gray
Write-Host ""
Write-Host "JANELA 3 - Frontend:" -ForegroundColor Yellow
Write-Host ".\start-frontend.bat" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Edite services\catarata-api.ts e substitua:" -ForegroundColor White
Write-Host "const API_BASE_URL = 'https://abc123.ngrok.io';" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Abra no navegador:" -ForegroundColor White
Write-Host "http://localhost:19006" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Para acessar de OUTRO DISPOSITIVO (mesmo WiFi):" -ForegroundColor White
Write-Host "Seu IP: " -ForegroundColor Gray -NoNewline
ipconfig | Select-String -Pattern "IPv4" | ForEach-Object { $_.ToString().Split(":")[1].Trim() }
Write-Host "URL: http://<seu-ip>:19006" -ForegroundColor Cyan
