#!/bin/bash
# Script de déploiement rapide sans type-check (pour debug)
set -e

# Charger NVM et Node
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "📦 Using Node version:"
nvm use v18.18 || { echo "❌ Failed to load Node v18.18"; exit 1; }
node --version
npm --version

echo "🚀 Quick deploying Admin dashboard (skipping type-check)..."

# Pull latest code
echo "📥 Pulling latest code..."
git fetch origin || { echo "❌ Git fetch failed"; exit 1; }
git reset --hard origin/main || { echo "❌ Git reset failed"; exit 1; }
git pull origin main || { echo "❌ Git pull failed"; exit 1; }

# Installer les dépendances
echo "📦 Installing dependencies..."
npm install || { echo "❌ npm install failed"; exit 1; }

# Build Vite/Vue admin (sans type-check)
echo "🛠️ Building Admin (skipping type-check)..."
npm run build-only || { echo "❌ Build failed"; exit 1; }

# Vérifier que le build a créé les fichiers
if [ ! -d "dist" ]; then
    echo "❌ Build directory 'dist' not found!"
    exit 1
fi

echo "✅ Admin deployed successfully!"
echo "📁 Build output:"
ls -la dist/

echo ""
echo "⚠️  Note: Type-check was skipped. Run 'npm run type-check' to verify types."
