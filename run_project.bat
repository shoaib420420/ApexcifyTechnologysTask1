@echo off
SETLOCAL EnableExtensions

REM ==========================================
REM Full Stack Project Launcher
REM ==========================================

REM Move to the script's directory
cd /d "%~dp0"

REM 1. Check and Install Dependencies
if not exist "node_modules\" (
    echo [INFO] node_modules not found. Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b %errorlevel%
    )
    echo [SUCCESS] Dependencies installed.
) else (
    echo [INFO] Dependencies already installed.
)

REM 2. Start Backend Server
REM The backend (server.js) is configured to serve the frontend static files.
echo [INFO] Starting Backend Server...
start "Backend Server" cmd /k "npm start"

REM 3. Start Frontend (Browser)
REM Waiting briefly for the backend to initialize...
echo [INFO] Waiting for server to launch...
timeout /t 5 >nul

echo [INFO] Opening Frontend in default browser...
start http://localhost:3000

echo [SUCCESS] Project launched!
pause
