const express = require('express');
const router = express.Router();
const userService = require('../../core/services/userService');
const orderService = require('../../core/services/orderService');
const deliveryService = require('../../core/services/deliveryService');
const rentalService = require('../../core/services/rentalService');
const notificationService = require('../../core/services/notificationService');
const reportService = require('../../core/services/reportService');
const logger = require('../../infra/logger/logger');

router.get('/', async (req, res) => {
  try {
    logger.info('Health check requested');

    const healthChecks = await Promise.allSettled([
      checkService('userService', userService),
      checkService('ordersService', orderService),
      checkService('deliveryService', deliveryService),
      checkService('rentalService', rentalService),
      checkService('notificationService', notificationService),
      checkService('reportService', reportService)
    ]);

    const [user, orders, delivery, rental, notification, report] = healthChecks;

    const dependencies = {
      userService: extractStatus(user),
      ordersService: extractStatus(orders),
      deliveryService: extractStatus(delivery),
      rentalService: extractStatus(rental),
      notificationService: extractStatus(notification),
      reportService: extractStatus(report)
    };

    const allUp = Object.values(dependencies).every(d => d.status === 'up');
    const status = allUp ? 'ok' : 'degraded';

    res.json({
      service: 'bff-service',
      status,
      dependencies,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({
      service: 'bff-service',
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

async function checkService(name, service) {
  try {
    const result = await service.checkHealth();
    return { 
      name, 
      status: result?.status === 'down' ? 'down' : 'up' 
    };
  } catch (error) {
    logger.warn(`Health check failed for ${name}`, { error: error.message });
    return { name, status: 'down', error: error.message };
  }
}

function extractStatus(result) {
  if (result.status === 'fulfilled') {
    return {
      status: result.value.status,
      error: result.value.error
    };
  }
  return {
    status: 'down',
    error: result.reason?.message
  };
}

module.exports = router;
