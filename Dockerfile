# Stage 1: Build de l'application Vue.js
FROM node:20-alpine as builder

WORKDIR /app

# Arguments de build pour les variables d'environnement
ARG VITE_API_URL
ARG VITE_HOST_URL

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm ci --silent

# Copie le code source
COPY . .

# Crée le fichier .env avec les bonnes variables
RUN echo "VITE_API_URL=${VITE_API_URL}" > .env && \
    echo "VITE_HOST_URL=${VITE_HOST_URL}" >> .env

# Build l'application pour la production (sans type-check pour éviter les erreurs)
RUN npm run build-only

# Stage 2: Servir avec Nginx
FROM docker.io/nginx:alpine

# Copie les fichiers buildés
COPY --from=builder /app/dist /usr/share/nginx/html

# Copie la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose le port 80
EXPOSE 80

# Démarre nginx
CMD ["nginx", "-g", "daemon off;"]