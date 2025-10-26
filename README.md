# 🔄 BFF Service - Backend For Frontend

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Express](https://img.shields.io/badge/Express-4.18-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**Backend For Frontend (BFF)** - Camada de agregação e proxy entre frontend e microservices.

Desenvolvido por: **[@iYoNuttxD](https://github.com/iYoNuttxD)**

---

## 🎯 Funcionalidades

✅ **Agregação de Dados** - Combina dados de múltiplos microservices  
✅ **Proxy CRUD** - Encaminha requisições para Delivery e Orders Services  
✅ **Integração com Azure Functions** - CREATE via eventos HTTP Trigger  
✅ **Health Check** - Monitora status de todos os serviços  
✅ **Error Handling** - Tratamento robusto de erros  
✅ **Logging** - Winston para rastreamento completo  
✅ **Docker** - Container pronto para deploy  

---

## 🛠️ Tecnologias

- **Node.js 18+**
- **Express.js** - Framework web
- **Axios** - Cliente HTTP para chamadas aos microservices
- **Winston** - Logging estruturado
- **Helmet** - Segurança HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Docker** - Containerização

---

## 🏗️ Arquitetura

┌──────────────┐
│  Frontend    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ BFF Service  │ ◄─── Você está aqui
└──┬───────┬───┘
   │       │
   ▼       ▼
┌────────┐ ┌────────┐ ┌─────────────┐
│Delivery│ │ Orders │ │   Azure     │
│Service │ │Service │ │  Functions  │
│(Azure  │ │(MongoDB│ │(HTTP Trigger│
│  SQL)  │ │ Atlas) │ │   Events)   │
└────────┘ └────────┘ └─────────────┘

---

## 📂 Estrutura do Projeto

bff-service/
├── src/
│   ├── config/
│   │   └── services.js
│   ├── services/
│   │   ├── deliveryService.js
│   │   ├── ordersService.js
│   │   └── functionService.js
│   ├── controllers/
│   │   ├── aggregationController.js
│   │   ├── eventController.js
│   │   ├── deliveryController.js
│   │   └── ordersController.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── aggregation.routes.js
│   │   ├── events.routes.js
│   │   ├── delivery.routes.js
│   │   └── orders.routes.js
│   ├── middlewares/
│   │   └── errorHandler.js
│   ├── utils/
│   │   └── logger.js
│   └── app.js
├── logs/
├── .env
├── Dockerfile
├── docker-compose.yml
├── openapi.yaml
└── README.md

---

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- Docker (opcional)
- Delivery Service rodando (porta 3001)
- Orders Service rodando (porta 3002)

---

### 1. Clonar Repositório

git clone https://github.com/iYoNuttxD/bff-service.git
cd bff-service

---

### 2. Instalar Dependências

npm install

---

### 3. Configurar Variáveis de Ambiente

cp .env.example .env

Edite o arquivo .env:

NODE_ENV=development
PORT=3000

DELIVERY_SERVICE_URL=http://localhost:3001
ORDERS_SERVICE_URL=http://localhost:3002

FUNCTION_CREATE_URL=https://your-function-app.azurewebsites.net/api/CreateFunction
FUNCTION_GET_URL=https://your-function-app.azurewebsites.net/api/GetFunction

SERVICE_TIMEOUT=30000
LOG_LEVEL=info

---

### 4. Executar em Desenvolvimento

npm run dev

Servidor disponível em: http://localhost:3000

---

### 5. Executar em Produção

npm start

---

## 🐳 Docker

### Build da imagem

docker build -t bff-service:latest .

### Executar container

docker run -p 3000:3000 --env-file .env bff-service:latest

### Docker Compose

docker-compose up

### Docker Compose com todos os serviços

docker-compose --profile full-stack up

---

## 📡 API Endpoints

### Health Check

GET /api/v1/health

Retorna o status do BFF.

---

### Agregação de Dados

#### Dashboard Agregado
GET /api/v1/aggregation/dashboard

Retorna dados agregados de Orders Service, Delivery Service e Azure Function.

#### Pedido Completo com Entrega
GET /api/v1/aggregation/pedido-completo/:pedidoId

Combina dados do pedido (Orders) com dados da entrega (Delivery).

#### Dados Completos
GET /api/v1/aggregation/dados-completos

Retorna dados de microservices + Azure Function.

#### Health Check de Todos os Serviços
GET /api/v1/aggregation/health

Verifica o status de BFF, Delivery Service e Orders Service.

---

### Eventos (Azure Functions)

#### Criar via Evento
POST /api/v1/events/create
Content-Type: application/json

Body:
{
  "type": "PEDIDO_CRIADO",
  "data": {
    "pedidoId": "123",
    "clienteId": "456",
    "valor": 100.00
  }
}

Envia evento para Azure Function via HTTP Trigger.
A Function persiste os dados no banco.

#### Buscar Dados da Function
GET /api/v1/events/data
GET /api/v1/events/data/:id

---

### Proxy - Delivery Service

#### Entregadores
GET    /api/v1/delivery/entregadores
GET    /api/v1/delivery/entregadores/:id
POST   /api/v1/delivery/entregadores
PUT    /api/v1/delivery/entregadores/:id
DELETE /api/v1/delivery/entregadores/:id

#### Veículos
GET    /api/v1/delivery/veiculos
GET    /api/v1/delivery/veiculos/:id
POST   /api/v1/delivery/veiculos
PUT    /api/v1/delivery/veiculos/:id
DELETE /api/v1/delivery/veiculos/:id

#### Aluguéis
GET    /api/v1/delivery/alugueis
GET    /api/v1/delivery/alugueis/:id
POST   /api/v1/delivery/alugueis
PATCH  /api/v1/delivery/alugueis/:id/finalizar
PATCH  /api/v1/delivery/alugueis/:id/cancelar

#### Entregas
GET    /api/v1/delivery/entregas
GET    /api/v1/delivery/entregas/:id
POST   /api/v1/delivery/entregas
PATCH  /api/v1/delivery/entregas/:id/status

---

### Proxy - Orders Service

#### Clientes
GET    /api/v1/orders/clientes
GET    /api/v1/orders/clientes/:id
POST   /api/v1/orders/clientes
PUT    /api/v1/orders/clientes/:id
DELETE /api/v1/orders/clientes/:id

#### Restaurantes
GET    /api/v1/orders/restaurantes
GET    /api/v1/orders/restaurantes/:id
POST   /api/v1/orders/restaurantes
PUT    /api/v1/orders/restaurantes/:id
DELETE /api/v1/orders/restaurantes/:id

#### Cardápios
GET    /api/v1/orders/cardapios
GET    /api/v1/orders/cardapios/:id
POST   /api/v1/orders/cardapios
PUT    /api/v1/orders/cardapios/:id
DELETE /api/v1/orders/cardapios/:id

#### Pedidos
GET    /api/v1/orders/pedidos
GET    /api/v1/orders/pedidos/:id
POST   /api/v1/orders/pedidos
PATCH  /api/v1/orders/pedidos/:id/status
PATCH  /api/v1/orders/pedidos/:id/cancelar

#### Avaliações
GET    /api/v1/orders/avaliacoes
GET    /api/v1/orders/avaliacoes/:id
POST   /api/v1/orders/avaliacoes
PUT    /api/v1/orders/avaliacoes/:id
DELETE /api/v1/orders/avaliacoes/:id

#### Pagamentos
GET    /api/v1/orders/pagamentos
GET    /api/v1/orders/pagamentos/:id
POST   /api/v1/orders/pagamentos
PATCH  /api/v1/orders/pagamentos/:id/status
PATCH  /api/v1/orders/pagamentos/:id/processar
PATCH  /api/v1/orders/pagamentos/:id/cancelar

---

## 🧪 Testar Endpoints

### Verificar Health

curl http://localhost:3000/api/v1/health

### Testar Agregação

curl http://localhost:3000/api/v1/aggregation/health
curl http://localhost:3000/api/v1/aggregation/dashboard

### Testar Proxy Delivery

curl http://localhost:3000/api/v1/delivery/entregadores

### Testar Proxy Orders

curl http://localhost:3000/api/v1/orders/clientes

---

## 🐳 Docker Hub

### Pull da imagem

docker pull iyonuttxd/bff-service:latest

### Executar

docker run -p 3000:3000 \
  -e DELIVERY_SERVICE_URL=http://delivery-service:3001 \
  -e ORDERS_SERVICE_URL=http://orders-service:3002 \
  iyonuttxd/bff-service:latest

---

## 🔗 Repositórios Relacionados

- **Delivery Service**: https://github.com/iYoNuttxD/delivery-service-microservice
- **Orders Service**: https://github.com/iYoNuttxD/orders-service-microservice

---

## 📚 Documentação

- **OpenAPI Spec**: openapi.yaml

---

## 📄 Licença

MIT License - veja LICENSE para mais detalhes.

---

## 👤 Autor

**iYoNuttxD**

- GitHub: [@iYoNuttxD](https://github.com/iYoNuttxD)
- Repositório: https://github.com/iYoNuttxD/bff-service

---

## 📅 Versão

**v1.0.0** - 26/10/2025

---

**⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!**