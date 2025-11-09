require('dotenv').config();

const DEFAULT_TIMEOUT = parseInt(process.env.SERVICE_TIMEOUT, 10) || 30000;

module.exports = {
  userService: {
    baseURL:
      process.env.USER_SERVICE_URL ||
      'https://clickdelivery-user-service.azurewebsites.net',
    timeout: DEFAULT_TIMEOUT,
    endpoints: {
      users: '/api/v1/users',
      profile: '/api/v1/users/me',
      health: '/api/v1/health'
    }
  },

  ordersService: {
    baseURL:
      process.env.ORDERS_SERVICE_URL ||
      'https://delivery-service-api.azurewebsites.net',
    timeout: DEFAULT_TIMEOUT,
    endpoints: {
      // ajusta os paths aqui conforme o swagger do orders-service
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
    baseURL:
      process.env.DELIVERY_SERVICE_URL ||
      'https://delivery-service-microservice.azurewebsites.net',
    timeout: DEFAULT_TIMEOUT,
    endpoints: {
      entregadores: '/api/v1/couriers',
      veiculos: '/api/v1/vehicles',
      entregas: '/api/v1/deliveries',
      health: '/api/v1/health'
    }
  },

  rentalService: {
    baseURL:
      process.env.RENTAL_SERVICE_URL ||
      'https://clickdelivery-rental-service.azurewebsites.net',
    timeout: DEFAULT_TIMEOUT,
    endpoints: {
      alugueis: '/api/v1/rentals',
      veiculos: '/api/v1/vehicles',
      health: '/api/v1/health'
    }
  },

  notificationService: {
    baseURL:
      process.env.NOTIFICATION_SERVICE_URL ||
      'https://clickdelivery-notification-service.azurewebsites.net',
    timeout: DEFAULT_TIMEOUT,
    endpoints: {
      notifications: '/api/v1/notifications',
      send: '/api/v1/notifications/send',
      health: '/api/v1/health'
    }
  },

  reportService: {
    baseURL:
      process.env.REPORT_SERVICE_URL ||
      'https://clickdelivery-report-service.azurewebsites.net',
    timeout: DEFAULT_TIMEOUT,
    endpoints: {
      reports: '/api/v1/reports',
      metrics: '/api/v1/reports/metrics',
      health: '/api/v1/health'
    }
  }
};
