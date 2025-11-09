# 🔄 Serviço BFF - Plataforma ClickDelivery

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Express](https://img.shields.io/badge/Express-4.18-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**Backend For Frontend (BFF)** - Camada unificada de API Gateway e agregação da plataforma ClickDelivery, fornecendo uma interface única e estável entre o frontend e todos os microsserviços.

Desenvolvido por: **[@iYoNuttxD](https://github.com/iYoNuttxD)**

---

## 🎯 Visão Geral

O serviço BFF atua como a principal fachada da plataforma ClickDelivery, orquestrando chamadas para múltiplos microsserviços, agregando dados e fornecendo uma API consistente para as aplicações frontend.

### Principais Funcionalidades

✅ **API Gateway Unificado** - Ponto único de entrada para todos os microsserviços  
✅ **Agregação de Dados** - Painel e resumo do cliente com dados de múltiplos serviços  
✅ **Autenticação JWT** - Integração com Auth0 e validação via JWKS  
✅ **Autorização OPA** (Opcional) - Controle de acesso baseado em políticas  
✅ **Proxy de Requisições** - Encaminhamento inteligente para os microsserviços apropriados  
✅ **Health Checks Consolidados** - Monitoramento de todas as dependências  
✅ **Cache de Resposta** - Cache em memória com TTL para endpoints agregados  
✅ **Rastreamento de Correlation ID** - Rastreamento de requisições entre serviços  
✅ **Logs Estruturados** - Logging em JSON com Winston  
✅ **Clean Architecture** - Separação de camadas e responsabilidades  
✅ **Compatível com Docker** - Container com health check  
✅ **CI/CD** - Pipeline automatizado de testes e publicação Docker

---

## 🏗️ Arquitetura

```
┌──────────────────┐
│   Frontend Web   │
└────────┬─────────┘
         │
         ▼
┌────────────────────────────────────────────────┐
│              Serviço BFF                       │
│  ┌──────────────────────────────────────────┐ │
│  │  Camada API (Rotas e Controladores)     │ │
│  └──────────────┬───────────────────────────┘ │
│                 │                               │
│  ┌──────────────▼───────────────────────────┐ │
│  │  Camada Core (Serviços e Agregadores)   │ │
│  └──────────────┬───────────────────────────┘ │
│                 │                               │
│  ┌──────────────▼───────────────────────────┐ │
│  │  Infraestrutura (HTTP, Auth, Cache)     │ │
│  └──────────────────────────────────────────┘ │
└───┬────┬────┬────┬────┬────┬────────────────┘
    │    │    │    │    │    │
    ▼    ▼    ▼    ▼    ▼    ▼
┌───────┬───────┬────────┬────────┬──────────┬────────┐
│ Usuário │Pedidos│Entrega│ Aluguel│Notifica.│ Relatórios│
│ Service │Service│Service│ Service│ Service │ Service  │
└───────┴───────┴────────┴────────┴──────────┴────────┘
```

---

## 🔗 Microsserviços Integrados

| Serviço | Função | URL |
|----------|--------|-----|
| **User Service** | Gerenciamento e autenticação de usuários | `https://clickdelivery-user-service.azurewebsites.net/api/v1` |
| **Orders Service** | Gestão de pedidos, restaurantes e cardápios | `https://delivery-service-api.azurewebsites.net/api/v1` |
| **Delivery Service** | Rastreamento e gestão de entregas | `https://delivery-service-microservice.azurewebsites.net/api/v1` |
| **Rental Service** | Gestão de locação de veículos | `https://clickdelivery-rental-service.azurewebsites.net/api/v1` |
| **Notification Service** | Envio de notificações e alertas | `https://clickdelivery-notification-service.azurewebsites.net/api/v1` |
| **Report Service** | Relatórios e análises | `https://clickdelivery-report-service.azurewebsites.net/api/v1` |

---

## 🚀 Primeiros Passos

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker (opcional)

### 1. Clonar o Repositório

```bash
git clone https://github.com/iYoNuttxD/bff-service.git
cd bff-service
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# URLs dos Microsserviços
USER_SERVICE_URL=https://clickdelivery-user-service.azurewebsites.net/api/v1
ORDERS_SERVICE_URL=https://delivery-service-api.azurewebsites.net/api/v1
DELIVERY_SERVICE_URL=https://delivery-service-microservice.azurewebsites.net/api/v1
RENTAL_SERVICE_URL=https://clickdelivery-rental-service.azurewebsites.net/api/v1
NOTIFICATION_SERVICE_URL=https://clickdelivery-notification-service.azurewebsites.net/api/v1
REPORT_SERVICE_URL=https://clickdelivery-report-service.azurewebsites.net/api/v1

SERVICE_TIMEOUT=30000

# Configuração Auth0
AUTH_JWKS_URI=https://dev-zr81bdbz643gzhom.us.auth0.com/.well-known/jwks.json
AUTH_ISSUER=https://dev-zr81bdbz643gzhom.us.auth0.com
AUTH_AUDIENCE=clickdelivery-api
AUTH_JWT_REQUIRED=true
```

### 4. Rodar em Desenvolvimento

```bash
npm run dev
```

Servidor disponível em: **http://localhost:3000**

### 5. Rodar em Produção

```bash
npm start
```

---

## 🐳 Docker

### Build e Execução

```bash
docker build -t iyonuttxd/bff-service:latest .
docker run -p 3000:3000 --env-file .env iyonuttxd/bff-service:latest
```

### Pull do Docker Hub

```bash
docker pull iyonuttxd/bff-service:latest
```

---

## 📡 Endpoints Principais

### Health e Informações

#### Info do Serviço
```http
GET /
```

#### Health Check Consolidado
```http
GET /api/v1/health
```

Retorna o status do BFF e de todos os microsserviços.

---

### Endpoints Agregados

#### Visão Geral do Dashboard
```http
GET /api/v1/dashboard/overview
Authorization: Bearer <token>
```

Retorna dados agregados de todos os serviços.

#### Resumo do Usuário
```http
GET /api/v1/me/summary
Authorization: Bearer <token>
```

Retorna o resumo agregado do usuário com contadores.

---

### Endpoints Proxy

Todas as requisições para os endpoints abaixo são encaminhadas aos respectivos microsserviços:

- `/api/v1/users/**` → User Service  
- `/api/v1/orders/**` → Orders Service  
- `/api/v1/deliveries/**` → Delivery Service  
- `/api/v1/rentals/**` → Rental Service  
- `/api/v1/notifications/**` → Notification Service  
- `/api/v1/reports/**` → Report Service  

**Cabeçalhos Propagados:**
- `Authorization: Bearer <token>`  
- `x-correlation-id`

---

## 🔐 Autenticação

Autenticação JWT via Auth0:

```http
Authorization: Bearer <seu-token-jwt>
```

Configurar via variáveis de ambiente:
- `AUTH_JWKS_URI`
- `AUTH_ISSUER`
- `AUTH_AUDIENCE`
- `AUTH_JWT_REQUIRED`

---

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Modo watch
npm run test:watch

# Com cobertura
npm test -- --coverage
```

---

## 📚 Documentação

Documentação interativa da API disponível em:

```
http://localhost:3000/api/v1/api-docs
```

---

## 📂 Estrutura do Projeto

```
src/
  config/           # Arquivos de configuração
  infra/            # Camada de infraestrutura
    http/           # Cliente HTTP
    logger/         # Logging
    auth/           # Autenticação e autorização
    cache/          # Cache
  core/             # Lógica de negócio
    services/       # Clientes dos microsserviços
    aggregators/    # Agregação de dados
  api/              # Camada de API
    routes/         # Manipuladores de rota
  app.js            # Aplicação Express
  server.js         # Inicialização do servidor
```

---

## 🎯 Padrões de Design

- ✅ **BFF Pattern** - Backend for Frontend  
- ✅ **API Gateway Pattern** - Ponto único de entrada  
- ✅ **Aggregation Pattern** - Combina múltiplas fontes  
- ✅ **Clean Architecture** - Separação de camadas  
- ✅ **Correlation ID** - Rastreamento de requisições

---

## 🔗 Repositórios Relacionados

- **User Service**: https://github.com/iYoNuttxD/user-service  
- **Orders Service**: https://github.com/iYoNuttxD/orders-service-microservice  
- **Delivery Service**: https://github.com/iYoNuttxD/delivery-service-microservice  
- **Rental Service**: https://github.com/iYoNuttxD/rental-service  
- **Notification Service**: https://github.com/iYoNuttxD/notification-service  
- **Report Service**: https://github.com/iYoNuttxD/report-service  

---

## 📄 Licença

Licença MIT - consulte o arquivo LICENSE para mais detalhes.

---

## 👤 Autor

**iYoNuttxD**

- GitHub: [@iYoNuttxD](https://github.com/iYoNuttxD)
- Repositório: https://github.com/iYoNuttxD/bff-service

---

## 📅 Versão

**v2.0.0** - Refatoração completa com Clean Architecture

---

**⭐ Se este projeto te ajudou, considere deixar uma estrela no GitHub!**
