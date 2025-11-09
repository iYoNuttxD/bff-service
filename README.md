# 🔄 BFF Service - ClickDelivery Platform

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Express](https://img.shields.io/badge/Express-4.18-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**Backend For Frontend (BFF)** - Unified API gateway and aggregation layer for the ClickDelivery platform, providing a single, stable interface between the frontend and all microservices.

Desenvolvido por: **[@iYoNuttxD](https://github.com/iYoNuttxD)**

---

## 🎯 Overview

The BFF Service acts as the main facade for the ClickDelivery platform, orchestrating calls to multiple microservices, aggregating data, and providing a consistent API for frontend applications.

### Key Features

✅ **Unified API Gateway** - Single entry point for all microservices  
✅ **Data Aggregation** - Dashboard and customer overview with data from multiple services  
✅ **JWT Authentication** - Auth0 integration with JWKS validation  
✅ **OPA Authorization** (Optional) - Policy-based access control  
✅ **Request Proxying** - Intelligent forwarding to appropriate microservices  
✅ **Consolidated Health Checks** - Monitor all dependencies  
✅ **Response Caching** - In-memory cache with TTL for aggregated endpoints  
✅ **Correlation ID Tracking** - Request tracing across all services  
✅ **Structured Logging** - Winston-based JSON logging  
✅ **Clean Architecture** - Separation of concerns with clear layers  
✅ **Docker Ready** - Containerized with health checks  
✅ **CI/CD Pipeline** - Automated testing and Docker publishing

---

## 🏗️ Architecture

```
┌──────────────────┐
│   Frontend Web   │
└────────┬─────────┘
         │
         ▼
┌────────────────────────────────────────────────┐
│              BFF Service                       │
│  ┌──────────────────────────────────────────┐ │
│  │  API Layer (Routes & Controllers)       │ │
│  └──────────────┬───────────────────────────┘ │
│                 │                               │
│  ┌──────────────▼───────────────────────────┐ │
│  │  Core Layer (Services & Aggregators)    │ │
│  └──────────────┬───────────────────────────┘ │
│                 │                               │
│  ┌──────────────▼───────────────────────────┐ │
│  │  Infrastructure (HTTP, Auth, Cache)     │ │
│  └──────────────────────────────────────────┘ │
└───┬────┬────┬────┬────┬────┬────────────────┘
    │    │    │    │    │    │
    ▼    ▼    ▼    ▼    ▼    ▼
┌───────┬───────┬────────┬────────┬──────────┬────────┐
│ User  │Orders │Delivery│ Rental │Notifica- │ Report │
│Service│Service│Service │Service │tion Svc  │Service │
└───────┴───────┴────────┴────────┴──────────┴────────┘
```

---

## 🔗 Integrated Microservices

The BFF integrates with the following microservices:

| Service | Purpose | URL |
|---------|---------|-----|
| **User Service** | User management and authentication | `https://clickdelivery-user-service.azurewebsites.net/api/v1` |
| **Orders Service** | Order management, restaurants, menus | `https://delivery-service-api.azurewebsites.net/api/v1` |
| **Delivery Service** | Delivery tracking and management | `https://delivery-service-microservice.azurewebsites.net/api/v1` |
| **Rental Service** | Vehicle rental management | `https://clickdelivery-rental-service.azurewebsites.net/api/v1` |
| **Notification Service** | Notifications and alerts | `https://clickdelivery-notification-service.azurewebsites.net/api/v1` |
| **Report Service** | Analytics and reporting | `https://clickdelivery-report-service.azurewebsites.net/api/v1` |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker (optional)

### 1. Clone Repository

```bash
git clone https://github.com/iYoNuttxD/bff-service.git
cd bff-service
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Microservices URLs
USER_SERVICE_URL=https://clickdelivery-user-service.azurewebsites.net/api/v1
ORDERS_SERVICE_URL=https://delivery-service-api.azurewebsites.net/api/v1
DELIVERY_SERVICE_URL=https://delivery-service-microservice.azurewebsites.net/api/v1
RENTAL_SERVICE_URL=https://clickdelivery-rental-service.azurewebsites.net/api/v1
NOTIFICATION_SERVICE_URL=https://clickdelivery-notification-service.azurewebsites.net/api/v1
REPORT_SERVICE_URL=https://clickdelivery-report-service.azurewebsites.net/api/v1

SERVICE_TIMEOUT=30000

# Auth0 Configuration
AUTH_JWKS_URI=https://dev-zr81bdbz643gzhom.us.auth0.com/.well-known/jwks.json
AUTH_ISSUER=https://dev-zr81bdbz643gzhom.us.auth0.com
AUTH_AUDIENCE=clickdelivery-api
AUTH_JWT_REQUIRED=true
```

### 4. Run in Development

```bash
npm run dev
```

Server available at: **http://localhost:3000**

### 5. Run in Production

```bash
npm start
```

---

## 🐳 Docker

### Build & Run

```bash
docker build -t iyonuttxd/bff-service:latest .
docker run -p 3000:3000 --env-file .env iyonuttxd/bff-service:latest
```

### Pull from Docker Hub

```bash
docker pull iyonuttxd/bff-service:latest
```

---

## 📡 API Endpoints

### Health & Information

#### Service Info
```http
GET /
```

#### Consolidated Health Check
```http
GET /api/v1/health
```

Returns health status of BFF and all integrated microservices.

---

### Aggregated Endpoints

#### Dashboard Overview
```http
GET /api/v1/dashboard/overview
Authorization: Bearer <token>
```

Returns aggregated dashboard data from all services.

#### User Summary
```http
GET /api/v1/me/summary
Authorization: Bearer <token>
```

Returns aggregated user summary with counters.

---

### Proxy Endpoints

All requests to these endpoints are forwarded to the respective microservices:

- `/api/v1/users/**` → User Service
- `/api/v1/orders/**` → Orders Service
- `/api/v1/deliveries/**` → Delivery Service
- `/api/v1/rentals/**` → Rental Service
- `/api/v1/notifications/**` → Notification Service
- `/api/v1/reports/**` → Report Service

**Headers Propagated:**
- `Authorization: Bearer <token>`
- `x-correlation-id`

---

## 🔐 Authentication

JWT authentication via Auth0:

```http
Authorization: Bearer <your-jwt-token>
```

Configure via environment variables:
- `AUTH_JWKS_URI`
- `AUTH_ISSUER`
- `AUTH_AUDIENCE`
- `AUTH_JWT_REQUIRED` (true/false)

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

---

## 📚 Documentation

Interactive API documentation available at:

```
http://localhost:3000/api/v1/api-docs
```

---

## 🛠️ Development

```bash
# Linting
npm run lint
npm run lint:fix

# Development server with auto-reload
npm run dev
```

---

## 📂 Project Structure

```
src/
  config/           # Configuration files
  infra/            # Infrastructure layer
    http/           # HTTP client
    logger/         # Logging
    auth/           # Authentication & authorization
    cache/          # Caching
  core/             # Business logic
    services/       # Microservice clients
    aggregators/    # Data aggregation
  api/              # API layer
    routes/         # Route handlers
  app.js            # Express app
  server.js         # Server startup
```

---

## 🎯 Design Patterns

- ✅ **BFF Pattern** - Backend for Frontend
- ✅ **API Gateway Pattern** - Single entry point
- ✅ **Aggregation Pattern** - Combine multiple sources
- ✅ **Clean Architecture** - Layer separation
- ✅ **Correlation ID** - Request tracing

---

## 🔗 Related Repositories

- **User Service**: https://github.com/iYoNuttxD/user-service
- **Orders Service**: https://github.com/iYoNuttxD/orders-service-microservice
- **Delivery Service**: https://github.com/iYoNuttxD/delivery-service-microservice
- **Rental Service**: https://github.com/iYoNuttxD/rental-service
- **Notification Service**: https://github.com/iYoNuttxD/notification-service
- **Report Service**: https://github.com/iYoNuttxD/report-service

---

## 📄 License

MIT License - see LICENSE for more details.

---

## 👤 Author

**iYoNuttxD**

- GitHub: [@iYoNuttxD](https://github.com/iYoNuttxD)
- Repository: https://github.com/iYoNuttxD/bff-service

---

## 📅 Version

**v2.0.0** - Complete refactoring with Clean Architecture

---

**⭐ If this project helped you, consider giving it a star on GitHub!**
