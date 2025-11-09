const app = require('./app');
const config = require('./config');
const logger = require('./infra/logger/logger');

const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info('BFF Service started', {
    port: PORT,
    env: config.env,
    version: '2.0.0'
  });

  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   🚀 BFF SERVICE - CLICKDELIVERY PLATFORM             ║');
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log(`║   📡 Port: ${PORT}                                        ║`);
  console.log(`║   🌍 URL: http://localhost:${PORT}                        ║`);
  console.log(`║   📝 Environment: ${config.env}                          ║`);
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log('║   📋 Main Endpoints:                                   ║');
  console.log('║   • GET  /                              (Info)         ║');
  console.log('║   • GET  /api/v1/health                 (Health)       ║');
  console.log('║   • GET  /api/v1/dashboard/overview     (Dashboard)    ║');
  console.log('║   • GET  /api/v1/me/summary             (User Summary) ║');
  console.log('║   • *    /api/v1/users                  (User Proxy)   ║');
  console.log('║   • *    /api/v1/orders                 (Orders Proxy) ║');
  console.log('║   • *    /api/v1/deliveries             (Delivery)     ║');
  console.log('║   • *    /api/v1/rentals                (Rentals)      ║');
  console.log('║   • *    /api/v1/notifications          (Notify)       ║');
  console.log('║   • *    /api/v1/reports                (Reports)      ║');
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log('║   🔗 Integrated Microservices:                         ║');
  console.log(`║   • User Service:         ${config.services.user.baseURL.substring(0, 35).padEnd(35)} ║`);
  console.log(`║   • Orders Service:       ${config.services.orders.baseURL.substring(0, 35).padEnd(35)} ║`);
  console.log(`║   • Delivery Service:     ${config.services.delivery.baseURL.substring(0, 35).padEnd(35)} ║`);
  console.log(`║   • Rental Service:       ${config.services.rental.baseURL.substring(0, 35).padEnd(35)} ║`);
  console.log(`║   • Notification Service: ${config.services.notification.baseURL.substring(0, 35).padEnd(35)} ║`);
  console.log(`║   • Report Service:       ${config.services.report.baseURL.substring(0, 35).padEnd(35)} ║`);
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

module.exports = server;
