#!/bin/bash
set -e  # stoppe le script si une commande échoue

# Charger NVM et Node
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm use v18.18   # uniformisation Node

echo "🚀 Deploying Admin dashboard..."

# Pull latest code
git fetch origin
git reset --hard origin/main
git pull origin main

# Installer les dépendances
npm install

# Build Vite/React/Angular admin
echo "🛠️ Building Admin..."
npm run build

echo "✅ Admin deployed successfully!"