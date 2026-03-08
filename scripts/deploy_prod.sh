#!/bin/bash
set -e

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

nvm use 18

echo "🚀 Deploy Admin..."

git fetch origin
git reset --hard origin/main

echo "📦 Install deps..."
npm install

echo "🛠 Build admin..."
npm run build

echo "✅ Admin deployed!"