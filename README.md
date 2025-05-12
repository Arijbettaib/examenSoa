
# 📦 – Projet PharmaExpress

## 🗂️ 1. Vue d’ensemble du projet

PharmaExpress est une application web distribuée en microservices permettant :
- la gestion des utilisateurs et de leur authentification,
- la passation de commandes de médicaments,
- la gestion du stock côté pharmacie,
- la notification automatique des utilisateurs à chaque changement de statut de commande,
- un API Gateway centralisé via GraphQL,


---

## 🧩 2. Architecture générale

**Microservices principaux :**
- `auth-service` (REST) → gestion des utilisateurs, JWT
- `order-service` (REST + gRPC + Kafka + WebSocket) → gestion des commandes
- `pharma-service` (gRPC) → validation/traitement commandes
- `notification-service` (Kafka + Nodemailer) → envoi de mails
- `gateway` (GraphQL/Apollo Server) → point d’entrée unique

---
## Services

- **Auth Service**: User authentication and authorization (Port 3001)
- **Order Service**: Order management (Port 3002)
- **Pharma Service**: Pharmacy management using gRPC (Port 50051)
- **Notification Service**: Notifications via Kafka (Port 3003)
- **API Gateway**: Entry point for client applications (Port 3000)

## 🔗 3. Communication interservices

| Type                | Depuis             | Vers                   | Protocole   |
|---------------------|--------------------|-------------------------|-------------|
| Auth                | Client ↔ auth-service | JWT REST API         | HTTP/REST   |
| Commandes           | Client ↔ order-service |                      | HTTP/REST   |
| gRPC Validation     | order-service       | pharma-service         | gRPC        |
| Notifications       | order-service       | notification-service   | Kafka       |
| Suivi temps réel    | order-service       | Frontend (Socket.IO)   | WebSocket   |
| Intégration globale | Frontend ↔ gateway  | Tous (via GraphQL)     | GraphQL     |

---

## 🧪 4. Détails techniques par service

### ✅ auth-service
- JWT Auth avec `jsonwebtoken`
- Bcrypt pour hachage de mot de passe
- MongoDB pour stockage des utilisateurs

### 🛒 order-service
- REST API pour les clients
- gRPC client vers `pharma-service`
- Kafka producer vers `notification-service`
- WebSocket avec Socket.IO pour MAJ temps réel

### 💊 pharma-service
- gRPC Server
- Simule la validation de commande
- Peut être enrichi par la suite (stock, pharmacie réelle)

### ✉️ notification-service
- Kafka consumer
- Nodemailer (via Mailtrap)
- Notification mail sur changement de statut de commande

### 🌐 gateway
- Apollo Server
- GraphQL Schema unifié pour `auth-service`, `order-service`, etc.
- Point d’entrée unique pour le frontend

---
## Environment Variables

Each service uses the following environment variables:

- **Auth Service**:
  - PORT=3001
  - MONGO_URI=mongodb://mongodb:27017/auth-service
  - JWT_SECRET=secure_jwt_secret_for_production

- **Order Service**:
  - PORT=3002
  - MONGO_URI=mongodb://mongodb:27017/order-service
  - JWT_SECRET=secure_jwt_secret_for_production

- **Pharma Service**:
  - PORT=50051

- **Notification Service**:
  - PORT=3003
  - KAFKA_BROKERS=kafka:9092

- **Gateway**:
  - PORT=3000
  - AUTH_SERVICE_URL=http://auth-service:3001
  - ORDER_SERVICE_URL=http://order-service:3002

## API Endpoints

### Auth Service
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login and get JWT token
- GET /api/auth/profile - Get user profile (requires authentication)

### Order Service
- POST /api/orders - Create a new order (requires authentication)
- GET /api/orders - Get all orders (requires authentication)
- GET /api/orders/:id - Get order by ID (requires authentication)

## Architecture

The system uses:
- MongoDB for data storage
- Kafka for event-driven communication
- gRPC for high-performance service-to-service communication
- JWT for authentication

## 🧱 5. Technologies utilisées

- **Node.js**, **Express** : cœur des services
- **MongoDB** : base de données NoSQL
- **gRPC** : pour la communication directe et performante entre order ↔ pharma
- **Kafka (kafkajs)** : pour la transmission asynchrone de messages (notifications)
- **Socket.IO** : pour des MAJ temps réel des statuts de commande
- **Apollo Server** : Gateway GraphQL
- **Docker + Docker Compose** : orchestration des microservices
- **Mailtrap** : test d’envoi de mail sécurisé en environnement de développement

---

## ⚠️ 6. Défis rencontrés

- Problèmes d’authentification SMTP résolus avec Mailtrap
- Connexion Kafka en local (noms des services Docker et variables KAFKA_BROKER)
- Synchronisation gRPC dans un cluster Docker (montage des fichiers .proto)
- Traitement des erreurs (restarts Kafka Consumer, erreurs réseau)
- Tests des notifications via Kafka/Email
