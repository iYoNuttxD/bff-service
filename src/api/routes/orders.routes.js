const express = require('express');
const router = express.Router();
const orderService = require('../../core/services/orderService');
const bffController = require('../bffController');
const { optionalJwtMiddleware } = require('../../infra/auth/jwtMiddleware');
const servicesConfig = require('../../config/services');

// Apply optional JWT middleware to all routes
router.use(optionalJwtMiddleware);

// Generic proxy handler for all orders service endpoints
router.all('/*', bffController.asyncHandler(async (req, res) => {
  const path = req.params[0] || '';
  const fullPath = `/${path}`;
  
  const result = await orderService.proxyRequest(
    req.method,
    fullPath,
    req.body,
    req.headers,
    req.query
  );
  
  return bffController.success(res, result);
}));

module.exports = router;
