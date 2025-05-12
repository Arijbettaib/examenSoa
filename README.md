# Express Pharma Microservices

A microservices-based pharmacy management system built with Node.js, Express, MongoDB, and Kafka.

## Services

- **Auth Service**: User authentication and authorization (Port 3001)
- **Order Service**: Order management (Port 3002)
- **Pharma Service**: Pharmacy management using gRPC (Port 50051)
- **Notification Service**: Notifications via Kafka (Port 3003)
- **API Gateway**: Entry point for client applications (Port 3000)

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/expressPharma.git
   cd expressPharma
   ```

2. Start the services:
   ```
   docker-compose up
   ```

3. Access the API Gateway:
   ```
   http://localhost:3000
   ```

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
