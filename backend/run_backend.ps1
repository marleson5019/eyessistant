# run_backend.ps1 — Inicia o backend em background e grava logs
# Uso: abra PowerShell como administrador (se necessário)
# ./run_backend.ps1

$env:PYTHONIOENCODING = "utf-8"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptPath

$logDir = Join-Path $scriptPath "logs"
if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }
$logFile = Join-Path $logDir ("backend_{0}.log" -f (Get-Date -Format "yyyyMMdd_HHmmss"))

Write-Host "Starting Eyessistant backend..." -ForegroundColor Green
Start-Process -FilePath "python" -ArgumentList "main.py" -WorkingDirectory $scriptPath -RedirectStandardOutput $logFile -RedirectStandardError $logFile -WindowStyle Hidden
Write-Host "Backend iniciado — logs em: $logFile" -ForegroundColor Green
Write-Host "Acesse: http://localhost:8000/docs para testar via Swagger UI"
