require('dotenv').config();

const DEFAULT_TIMEOUT = parseInt(process.env.SERVICE_TIMEOUT, 10) || 30000;
const ENV = process.env.NODE_ENV || 'development';
const isTest = ENV === 'test';

function resolveBase(newEnvName, legacyEnvName, localDefault, azureDefault) {
  // 1. Check new env var name first (e.g., *_BASE_URL)
  if (process.env[newEnvName]) {
    return process.env[newEnvName];
  }

  // 2. Fallback to legacy env var name (e.g., *_URL)
  if (process.env[legacyEnvName]) {
    return process.env[legacyEnvName];
  }

  // 3. Em teste, nunca chama Azure: fica no localhost (mais previsível/mocável)
  if (isTest) {
    return localDefault;
  }

  // 4. Em dev/prod, se não tiver env, cai pro default Azure (ajuda no teu cenário)
  return azureDefault;
}

module.exports = {
  userService: {
    baseURL: resolveBase(
      'USER_SERVICE_BASE_URL',
      'USER_SERVICE_URL',
      'http://localhost:3001',
      'https://clickdelivery-user-service.azurewebsites.net'
    ),
    timeout: DEFAULT_TIMEOUT,
    endpoints: {
      register: '/api/v1/users/register',
      login: '/api/v1/users/login',
      users: '/api/v1/users',
      me: '/api/v1/users/me',
      password: '/api/v1/users/me/password',
      health: '/api/v1/health',
      metrics: '/api/v1/metrics'
    }
  },

  ordersService: {
    baseURL: resolveBase(
      'ORDERS_SERVICE_BASE_URL',
      'ORDERS_SERVICE_URL',
      'http://localhost:3002',
      'https://delivery-service-api.azurewebsites.net'
    ),
    timeout: DEFAULT_TIMEOUT,
    endpoints: {
      clientes: '/api/v1/clientes',
      restaurantes: '/api/v1/restaurantes',
      cardapios: '/api/v1/cardapios',
      pedidos: '/api/v1/pedidos',
      avaliacoes: '/api/v1/avaliacoes',
      pagamentos: '/api/v1/pagamentos',
      dashboard: '/api/v1/pedidos/dashboard',
      health: '/api/v1/health',
      metrics: '/api/v1/metrics'
    }
  },

  deliveryService: {
    baseURL: resolveBase(
      'DELIVERY_SERVICE_BASE_URL',
      'DELIVERY_SERVICE_URL',
      'http://localhost:3003',
      'https://delivery-service-microservice.azurewebsites.net'
    ),
    timeout: DEFAULT_TIMEOUT,
    endpoints: {
      entregadores: '/api/v1/entregadores',
      veiculos: '/api/v1/veiculos',
      alugueis: '/api/v1/alugueis',
      entregas: '/api/v1/entregas',
      tracking: '/api/v1/tracking/deliveries',
      health: '/api/v1/health',
      metrics: '/api/v1/metrics'
    }
  },

  rentalService: {
    baseURL: resolveBase(
      'RENTAL_SERVICE_BASE_URL',
      'RENTAL_SERVICE_URL',
      'http://localhost:3004',
      'https://clickdelivery-rental-service.azurewebsites.net'
    ),
    timeout: DEFAULT_TIMEOUT,
    endpoints: {
      rentals: '/api/v1/rentals',
      vehicles: '/api/v1/vehicles/availability',
      health: '/api/v1/health',
      metrics: '/api/v1/metrics'
    }
  },

  notificationService: {
    baseURL: resolveBase(
      'NOTIFICATION_SERVICE_BASE_URL',
      'NOTIFICATION_SERVICE_URL',
      'http://localhost:3005',
      'https://clickdelivery-notification-service.azurewebsites.net'
    ),
    timeout: DEFAULT_TIMEOUT,
    endpoints: {
      notifications: '/api/v1/notifications',
      preferences: '/api/v1/preferences',
      health: '/api/v1/health',
      metrics: '/api/v1/metrics'
    }
  },

  reportService: {
    baseURL: resolveBase(
      'REPORT_SERVICE_BASE_URL',
      'REPORT_SERVICE_URL',
      'http://localhost:3006',
      'https://clickdelivery-report-service.azurewebsites.net'
    ),
    timeout: DEFAULT_TIMEOUT,
    endpoints: {
      reports: '/api/v1/reports',
      metricsEndpoint: '/api/v1/reports/metrics',
      health: '/api/v1/health',
      metrics: '/api/v1/metrics'
    }
  }
};

