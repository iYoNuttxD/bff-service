require('dotenv').config();

const DEFAULT_TIMEOUT = parseInt(process.env.SERVICE_TIMEOUT, 10) || 30000;
const ENV = process.env.NODE_ENV || 'development';
const isTest = ENV === 'test';

function resolveBase(envName, localDefault, azureDefault) {
  // 1. Se veio por variável de ambiente, usa ela (tanto local quanto Azure)
  if (process.env[envName]) {
    return process.env[envName];
  }

  // 2. Em teste, nunca chama Azure: fica no localhost (mais previsível/mocável)
  if (isTest) {
    return localDefault;
  }

  // 3. Em dev/prod, se não tiver env, cai pro default Azure (ajuda no teu cenário)
  return azureDefault;
}

module.exports = {
  userService: {
    baseURL: resolveBase(
      'USER_SERVICE_URL',
      'http://localhost:3001',
      'https://clickdelivery-user-service.azurewebsites.net'
    ),
    timeout: DEFAULT_TIMEOUT,
    endpoints: {
      users: '/api/v1/users',
      profile: '/api/v1/users/me',
      health: '/api/v1/health'
    }
  },

  ordersService: {
    baseURL: resolveBase(
      'ORDERS_SERVICE_URL',
      'http://localhost:3002',
      'https://delivery-service-api.azurewebsites.net'
    ),
    timeout: DEFAULT_TIMEOUT,
    endpoints: {
      clientes: '/api/v1/customers',
      restaurantes: '/api/v1/restaurants',
      cardapios: '/api/v1/menus',
      pedidos: '/api/v1/orders',
      avaliacoes: '/api/v1/reviews',
      pagamentos: '/api/v1/payments',
      dashboard: '/api/v1/orders/dashboard',
      health: '/api/v1/health'
    }
  },

  deliveryService: {
    baseURL: resolveBase(
      'DELIVERY_SERVICE_URL',
      'http://localhost:3003',
      'https://delivery-service-microservice.azurewebsites.net'
    ),
    timeout: DEFAULT_TIMEOUT,
    endpoints: {
      entregadores: '/api/v1/couriers',
      veiculos: '/api/v1/vehicles',
      entregas: '/api/v1/deliveries',
      health: '/api/v1/health'
    }
  },

  rentalService: {
    baseURL: resolveBase(
      'RENTAL_SERVICE_URL',
      'http://localhost:3004',
      'https://clickdelivery-rental-service.azurewebsites.net'
    ),
    timeout: DEFAULT_TIMEOUT,
    endpoints: {
      alugueis: '/api/v1/rentals',
      veiculos: '/api/v1/vehicles',
      health: '/api/v1/health'
    }
  },

  notificationService: {
    baseURL: resolveBase(
      'NOTIFICATION_SERVICE_URL',
      'http://localhost:3005',
      'https://clickdelivery-notification-service.azurewebsites.net'
    ),
    timeout: DEFAULT_TIMEOUT,
    endpoints: {
      notifications: '/api/v1/notifications',
      send: '/api/v1/notifications/send',
      health: '/api/v1/health'
    }
  },

  reportService: {
    baseURL: resolveBase(
      'REPORT_SERVICE_URL',
      'http://localhost:3006',
      'https://clickdelivery-report-service.azurewebsites.net'
    ),
    timeout: DEFAULT_TIMEOUT,
    endpoints: {
      reports: '/api/v1/reports',
      metrics: '/api/v1/reports/metrics',
      health: '/api/v1/health'
    }
  }
};
