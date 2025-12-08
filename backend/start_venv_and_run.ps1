# start_venv_and_run.ps1
# Cria/ativa um virtualenv local e roda o backend em foreground

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptPath

# Cria venv se não existir
if (!(Test-Path "$scriptPath\.venv")) {
    Write-Host "Criando venv em ./.venv..." -ForegroundColor Cyan
    python -m venv .venv
}

# Ativa venv (PowerShell)
Write-Host "Ativando venv e instalando dependências..." -ForegroundColor Cyan
& "$scriptPath\.venv\Scripts\Activate.ps1"
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

# Roda o backend em foreground (vai gravar em logs/server_last.log)
.
Write-Host "Executando backend em foreground..." -ForegroundColor Cyan
& "$scriptPath\run_backend_foreground.ps1"
