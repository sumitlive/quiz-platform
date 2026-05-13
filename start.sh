#!/bin/bash

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║            QUIZR - Timed Quiz Platform                        ║"
echo "║            Starting Backend and Frontend...                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Download from: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo ""

# Install backend dependencies if needed
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd server
    npm install
    cd ..
    echo "✓ Backend dependencies installed"
    echo ""
fi

# Install frontend dependencies if needed
if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd client
    npm install
    cd ..
    echo "✓ Frontend dependencies installed"
    echo ""
fi

echo "🚀 Starting servers..."
echo ""
echo "┌─ BACKEND (port 3001) ────────────────────────────────────────┐"
echo "│ Starting Express server...                                    │"

# Start backend server in background
cd server
npm start &
BACKEND_PID=$!
cd ..

sleep 2

echo "│ ✓ Backend started (PID: $BACKEND_PID)                       │"
echo "└──────────────────────────────────────────────────────────────┘"
echo ""

echo "┌─ FRONTEND (port 3000) ────────────────────────────────────────┐"
echo "│ Starting React development server...                          │"

# Start frontend server
cd client
npm start
cd ..

echo "│ ✓ Frontend started                                           │"
echo "└──────────────────────────────────────────────────────────────┘"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  Both servers are running                                     ║"
echo "║                                                                ║"
echo "║  Frontend:  http://localhost:3000                            ║"
echo "║  Backend:   http://localhost:3001                            ║"
echo "║                                                                ║"
echo "║  💡 Tip: Click gear icon (⚙️) to access admin panel         ║"
echo "║                                                                ║"
echo "║  To stop all servers, press CTRL+C                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

wait
