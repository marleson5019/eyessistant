# run_backend_foreground.ps1
# Inicia o backend em foreground e grava saída em logs/server_last.log

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptPath

# Garante diretório de logs
$logDir = Join-Path $scriptPath "logs"
if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }
$logFile = Join-Path $logDir "server_last.log"

# Força encoding UTF-8 para evitar problemas de saída
$env:PYTHONIOENCODING = "utf-8"

Write-Host "Iniciando backend (foreground). Logs serão salvos em: $logFile" -ForegroundColor Cyan

# Executa uvicorn em foreground e usa Tee-Object para gravar stdout+stderr no arquivo
python -m uvicorn main:app --host 0.0.0.0 --port 8000 2>&1 | Tee-Object -FilePath $logFile

Write-Host "Processo finalizado. Verifique o log em: $logFile" -ForegroundColor Yellow
