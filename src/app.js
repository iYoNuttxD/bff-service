const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de segurança e parsing
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging HTTP
app.use(morgan('combined', { 
  stream: { 
    write: message => logger.info(message.trim()) 
  } 
}));

// Rotas principais
app.use('/api/v1', routes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'BFF Service - Backend For Frontend',
    version: '1.0.0',
    description: 'Agregação e proxy entre Delivery Service e Orders Service',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/v1/health',
      aggregation: {
        dashboard: '/api/v1/aggregation/dashboard',
        pedidoCompleto: '/api/v1/aggregation/pedido-completo/:pedidoId',
        dadosCompletos: '/api/v1/aggregation/dados-completos',
        healthAll: '/api/v1/aggregation/health'
      },
      events: {
        create: '/api/v1/events/create',
        getData: '/api/v1/events/data',
        getDataById: '/api/v1/events/data/:id'
      },
      delivery: {
        entregadores: '/api/v1/delivery/entregadores',
        veiculos: '/api/v1/delivery/veiculos',
        alugueis: '/api/v1/delivery/alugueis',
        entregas: '/api/v1/delivery/entregas'
      },
      orders: {
        clientes: '/api/v1/orders/clientes',
        restaurantes: '/api/v1/orders/restaurantes',
        cardapios: '/api/v1/orders/cardapios',
        pedidos: '/api/v1/orders/pedidos',
        avaliacoes: '/api/v1/orders/avaliacoes',
        pagamentos: '/api/v1/orders/pagamentos'
      }
    }
  });
});

// Middleware de erro (deve ser o último)
app.use(errorHandler);

// Exportar app SEM iniciar o servidor
module.exports = app;

// Só iniciar servidor se não for em modo de teste
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`🚀 BFF Service rodando na porta ${PORT}`);
    console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Delivery Service: ${process.env.DELIVERY_SERVICE_URL}`);
    console.log(`🔗 Orders Service: ${process.env.ORDERS_SERVICE_URL}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('⚠️  SIGTERM recebido, fechando servidor...');
    server.close(() => {
      console.log('✅ Servidor encerrado');
      process.exit(0);
    });
  });
}