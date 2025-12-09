@echo off
cd /d "%~dp0"
echo === INICIANDO BACKEND ===
cd backend
python -m pip install -r requirements.txt -q
python -m uvicorn main:app --host 0.0.0.0 --port 8000
pause
