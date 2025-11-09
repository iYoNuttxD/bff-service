const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const config = require('./config');
const logger = require('./infra/logger/logger');
const { jwtErrorHandler } = require('./infra/auth/jwtMiddleware');

const app = express();

// ========================================
// MIDDLEWARES
// ========================================
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging with correlation ID
app.use((req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  req.headers['x-correlation-id'] = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    correlationId
  });
  
  next();
});

// ========================================
// SWAGGER DOCUMENTATION
// ========================================
try {
  const swaggerDocument = YAML.load(path.join(__dirname, '../openapi.yaml'));
  app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  logger.warn('Failed to load OpenAPI documentation', { error: error.message });
}

// ========================================
// IMPORT ROUTES
// ========================================
const healthRoutes = require('./api/routes/health.routes');
const dashboardRoutes = require('./api/routes/dashboard.routes');
const usersRoutes = require('./api/routes/users.routes');
const ordersRoutes = require('./api/routes/orders.routes');
const deliveriesRoutes = require('./api/routes/deliveries.routes');
const rentalsRoutes = require('./api/routes/rentals.routes');
const notificationsRoutes = require('./api/routes/notifications.routes');
const reportsRoutes = require('./api/routes/reports.routes');

// ========================================
// REGISTER ROUTES
// ========================================
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/me', dashboardRoutes); // /me/summary endpoint
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/deliveries', deliveriesRoutes);
app.use('/api/v1/rentals', rentalsRoutes);
app.use('/api/v1/notifications', notificationsRoutes);
app.use('/api/v1/reports', reportsRoutes);

// ========================================
// ROOT ENDPOINT
// ========================================
app.get('/', (req, res) => {
  res.json({
    service: 'bff-service',
    version: '2.0.0',
    description: 'Backend For Frontend - ClickDelivery Platform',
    author: '@iYoNuttxD',
    documentation: '/api/v1/api-docs',
    endpoints: {
      health: '/api/v1/health',
      dashboard: '/api/v1/dashboard/overview',
      userSummary: '/api/v1/me/summary',
      users: '/api/v1/users',
      orders: '/api/v1/orders',
      deliveries: '/api/v1/deliveries',
      rentals: '/api/v1/rentals',
      notifications: '/api/v1/notifications',
      reports: '/api/v1/reports'
    },
    microservices: {
      user: config.services.user.baseURL,
      orders: config.services.orders.baseURL,
      delivery: config.services.delivery.baseURL,
      rental: config.services.rental.baseURL,
      notification: config.services.notification.baseURL,
      report: config.services.report.baseURL
    }
  });
});

// Backward compatibility route
app.get('/health', (req, res) => {
  res.redirect(301, '/api/v1/health');
});

// ========================================
// ERROR HANDLERS
// ========================================
app.use(jwtErrorHandler);

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    correlationId: req.headers['x-correlation-id']
  });

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal server error',
    correlationId: req.headers['x-correlation-id'],
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
