#!/bin/bash

# Navigate to the script's directory
cd "$(dirname "$0")"

# Navigate to the wtp-survey-app directory
cd wtp-survey-app

echo "=========================================="
echo "WTP Survey App - Development Server"
echo "=========================================="
echo ""

# Kill any existing server on port 5173
echo "🛑 Checking for existing server on port 5173..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
echo ""

# Clean install dependencies
echo "📦 Installing dependencies..."
npm install

# Clean build
echo ""
echo "🧹 Cleaning previous builds..."
rm -rf dist

echo ""
echo "🔨 Building application..."
npm run build

# Start dev server in background
echo ""
echo "🚀 Starting development server..."
npm run dev &
DEV_SERVER_PID=$!

# Wait for server to be ready
echo ""
echo "⏳ Waiting for server to start..."
sleep 3

# Open Chrome to the dev server (via clear-storage page to reset localStorage)
echo ""
echo "🌐 Opening Chrome (clearing localStorage)..."
open -a "Google Chrome" http://localhost:5173/clear-storage.html

echo ""
echo "=========================================="
echo "✅ Development server is running!"
echo "Server PID: $DEV_SERVER_PID"
echo "URL: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=========================================="
echo ""

# Wait for the dev server process
wait $DEV_SERVER_PID
