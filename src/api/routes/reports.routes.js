const express = require('express');
const router = express.Router();
const reportService = require('../../core/services/reportService');
const bffController = require('../bffController');
const { optionalJwtMiddleware } = require('../../infra/auth/jwtMiddleware');

// Apply optional JWT middleware to all routes
router.use(optionalJwtMiddleware);

// Generic proxy handler for all report service endpoints
router.all('/*', bffController.asyncHandler(async (req, res) => {
  const path = req.params[0] || '';
  const fullPath = `/${path}`;
  
  const result = await reportService.proxyRequest(
    req.method,
    fullPath,
    req.body,
    req.headers,
    req.query
  );
  
  return bffController.success(res, result);
}));

module.exports = router;
