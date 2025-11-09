const express = require('express');
const router = express.Router();
const dashboardAggregator = require('../../core/aggregators/dashboardAggregator');
const customerOverviewAggregator = require('../../core/aggregators/customerOverviewAggregator');
const bffController = require('../bffController');
const { jwtMiddleware } = require('../../infra/auth/jwtMiddleware');
const responseCache = require('../../infra/cache/responseCache');
const config = require('../../config');

// GET /api/v1/dashboard/overview - Dashboard with aggregated data from all services
router.get('/overview', jwtMiddleware, bffController.asyncHandler(async (req, res) => {
  const user = bffController.getUserFromToken(req);
  const userId = user?.sub || 'anonymous';

  // Check cache
  if (config.cache.enabled) {
    const cached = responseCache.get(userId, 'dashboard-overview');
    if (cached) {
      return bffController.success(res, cached, 'Dashboard overview (cached)');
    }
  }

  const dashboard = await dashboardAggregator.getOverview(req.headers);

  // Cache the result
  if (config.cache.enabled) {
    responseCache.set(userId, 'dashboard-overview', dashboard, config.cache.ttl);
  }

  return bffController.success(res, dashboard, 'Dashboard overview retrieved');
}));

// GET /api/v1/me/summary - Customer summary with aggregated counts
router.get('/me/summary', jwtMiddleware, bffController.asyncHandler(async (req, res) => {
  const user = bffController.getUserFromToken(req);
  const userId = user?.sub || 'anonymous';

  // Check cache
  if (config.cache.enabled) {
    const cached = responseCache.get(userId, 'me-summary');
    if (cached) {
      return bffController.success(res, cached, 'User summary (cached)');
    }
  }

  const summary = await customerOverviewAggregator.getSummary(req.headers);

  // Cache the result
  if (config.cache.enabled) {
    responseCache.set(userId, 'me-summary', summary, config.cache.ttl);
  }

  return bffController.success(res, summary, 'User summary retrieved');
}));

module.exports = router;
