@echo off
title SpectrumSense — Starting All Services
color 0A
echo.
echo  ====================================================
echo    SpectrumSense ASD Platform — Starting Services
echo  ====================================================
echo.

REM ── 1. Python ML Service (port 5001) ─────────────────
echo  [1/3] Starting ML Service (Python Flask)...
cd /d "%~dp0ml-service"
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo  [WARNING] Python not found in PATH. ML service will not start.
    echo            The API will use rule-based fallback scoring.
) else (
    start "SpectrumSense ML" /min cmd /k "python app.py"
    timeout /t 3 /nobreak >nul
    echo  [OK] ML Service launching on http://localhost:5001
)

REM ── 2. Node.js API Server (port 3001) ────────────────
echo.
echo  [2/3] Starting API Server (Node.js/Express)...
cd /d "%~dp0server"
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)
if not exist node_modules (
    echo  [INFO] Installing server dependencies...
    call npm install
)
start "SpectrumSense API" /min cmd /k "node index.js"
timeout /t 2 /nobreak >nul
echo  [OK] API Server launching on http://localhost:3001

REM ── 3. React Frontend (port 5173) ────────────────────
echo.
echo  [3/3] Starting Frontend (React + Vite)...
cd /d "%~dp0client"
if not exist node_modules (
    echo  [INFO] Installing client dependencies...
    call npm install
)
echo  [OK] Frontend launching on http://localhost:5173
echo.
echo  ====================================================
echo    All services started! Opening browser...
echo  ====================================================
echo.
echo    Frontend : http://localhost:5173
echo    API      : http://localhost:3001/api/health
echo    ML       : http://localhost:5001/health
echo.
echo    Press Ctrl+C in each window to stop services.
echo.
timeout /t 3 /nobreak >nul
start "" "http://localhost:5173"
cmd /k "npm run dev"
