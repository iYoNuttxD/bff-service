const express = require('express');
const router = express.Router();
const customerOverviewAggregator = require('../../core/aggregators/customerOverviewAggregator');
const logger = require('../../infra/logger/logger');

router.get('/summary', async (req, res, next) => {
  try {
    // Em produção real: extrair userId do JWT
    const userId = req.user?.sub || req.query.userId || 'demo-user';

    logger.info('Requesting customer summary', { userId });

    const summary = await customerOverviewAggregator.getCustomerOverview(userId);

    return res.status(200).json({
      success: true,
      message: 'Customer summary retrieved',
      data: summary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
