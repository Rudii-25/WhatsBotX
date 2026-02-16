#!/bin/bash

echo "🚀 Starting WhatsBotX GUI..."
echo "📱 Launching in 3 seconds..."
sleep 1
echo "⏳ 2..."  
sleep 1
echo "⏳ 1..."
sleep 1

# Kill any existing processes on port 3001-3003
echo "🧹 Cleaning up existing processes..."
lsof -ti:3001,3002,3003 | xargs kill -9 2>/dev/null || true

# Start the GUI
echo "🎉 Launching WhatsBotX GUI!"
npm run gui
