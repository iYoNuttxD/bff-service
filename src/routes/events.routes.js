const express = require('express');
const eventController = require('../controllers/eventController');

const router = express.Router();

// Criar via evento (Azure Function)
router.post('/create', eventController.createViaEvent);

// Buscar dados da function
router.get('/data', eventController.getFunctionData);
router.get('/data/:id', eventController.getFunctionDataById);

module.exports = router;