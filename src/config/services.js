require('dotenv').config();

module.exports = {
  userService: {
    baseURL: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    timeout: parseInt(process.env.SERVICE_TIMEOUT, 10) || 30000,
    endpoints: {
      users: '/users',
      profile: '/users/me',
      health: '/health'
    }
  },
  
  ordersService: {
    baseURL: process.env.ORDERS_SERVICE_URL || 'http://localhost:3002',
    timeout: parseInt(process.env.SERVICE_TIMEOUT, 10) || 30000,
    endpoints: {
      clientes: '/clientes',
      restaurantes: '/restaurantes',
      cardapios: '/cardapios',
      pedidos: '/pedidos',
      avaliacoes: '/avaliacoes',
      pagamentos: '/pagamentos',
      health: '/health',
      dashboard: '/pedidos/dashboard'
    }
  },
  
  deliveryService: {
    baseURL: process.env.DELIVERY_SERVICE_URL || 'http://localhost:3003',
    timeout: parseInt(process.env.SERVICE_TIMEOUT, 10) || 30000,
    endpoints: {
      entregadores: '/entregadores',
      veiculos: '/veiculos',
      entregas: '/entregas',
      health: '/health'
    }
  },
  
  rentalService: {
    baseURL: process.env.RENTAL_SERVICE_URL || 'http://localhost:3004',
    timeout: parseInt(process.env.SERVICE_TIMEOUT, 10) || 30000,
    endpoints: {
      alugueis: '/alugueis',
      veiculos: '/veiculos',
      health: '/health'
    }
  },
  
  notificationService: {
    baseURL: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005',
    timeout: parseInt(process.env.SERVICE_TIMEOUT, 10) || 30000,
    endpoints: {
      notifications: '/notifications',
      send: '/notifications/send',
      health: '/health'
    }
  },
  
  reportService: {
    baseURL: process.env.REPORT_SERVICE_URL || 'http://localhost:3006',
    timeout: parseInt(process.env.SERVICE_TIMEOUT, 10) || 30000,
    endpoints: {
      reports: '/reports',
      metrics: '/metrics',
      health: '/health'
    }
  }
};