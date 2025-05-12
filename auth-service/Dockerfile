# Utiliser une image officielle Node.js
FROM node:18

# Créer le dossier de l'app dans le conteneur
WORKDIR /app

# Copier les fichiers package.json + lock
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du code
COPY . .

# Exposer le port (doit correspondre à .env / docker-compose)
EXPOSE 3001

# Commande pour démarrer le serveur
CMD ["node", "index.js"]
