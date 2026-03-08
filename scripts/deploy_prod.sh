#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm use v18.17

echo "🚀 Deploy Admin..."

git fetch origin
git reset --hard origin/main
git pull origin main

echo "📦 Install deps..."
npm install

echo "🛠 Build admin..."
npm run build

echo "📂 Deploy to nginx folder..."

echo "✅ Admin deployed!"

