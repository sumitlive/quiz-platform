@echo off
setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║            QUIZR - Timed Quiz Platform                        ║
echo ║            Starting Backend and Frontend...                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js found
echo.

REM Install backend dependencies if needed
if not exist "server\node_modules" (
    echo 📦 Installing backend dependencies...
    cd server
    call npm install
    cd ..
    echo ✓ Backend dependencies installed
    echo.
)

REM Install frontend dependencies if needed
if not exist "client\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd client
    call npm install
    cd ..
    echo ✓ Frontend dependencies installed
    echo.
)

echo 🚀 Starting servers...
echo.
echo ┌─ BACKEND (port 3001) ────────────────────────────────────────┐
echo │ Starting Express server...                                    │
cd server
start cmd /k npm start
cd ..

timeout /t 2 /nobreak

echo │ ✓ Backend started in new window                              │
echo └──────────────────────────────────────────────────────────────┘
echo.

echo ┌─ FRONTEND (port 3000) ────────────────────────────────────────┐
echo │ Starting React development server...                          │
cd client
start cmd /k npm start
cd ..

echo │ ✓ Frontend will start in new window                          │
echo └──────────────────────────────────────────────────────────────┘
echo.

echo ╔════════════════════════════════════════════════════════════════╗
echo ║  Both servers are starting. Two new windows will open.        ║
echo ║                                                                ║
echo ║  Frontend:  http://localhost:3000  (will auto-open)          ║
echo ║  Backend:   http://localhost:3001                            ║
echo ║                                                                ║
echo ║  💡 Tip: Click gear icon (⚙️) to access admin panel         ║
echo ║                                                                ║
echo ║  Press CTRL+C in each window to stop servers                 ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

pause
