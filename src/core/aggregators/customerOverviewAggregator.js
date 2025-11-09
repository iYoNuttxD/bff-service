const userService = require('../services/userService');
const orderService = require('../services/orderService');
const deliveryService = require('../services/deliveryService');
const rentalService = require('../services/rentalService');
const notificationService = require('../services/notificationService');
const logger = require('../../infra/logger/logger');

class CustomerOverviewAggregator {
  async getSummary(headers = {}) {
    logger.info('Aggregating customer overview summary');

    const results = await Promise.allSettled([
      this.getProfile(headers),
      this.getOrdersCounts(headers),
      this.getDeliveriesCounts(headers),
      this.getRentalsCounts(headers),
      this.getNotificationsCounts(headers)
    ]);

    const [profile, ordersCounts, deliveriesCounts, rentalsCounts, notificationsCounts] = results;

    const degraded = results.some(r => r.status === 'rejected');

    const summary = {
      profile: this.extractData(profile),
      counters: {
        orders: this.extractData(ordersCounts),
        deliveries: this.extractData(deliveriesCounts),
        rentals: this.extractData(rentalsCounts),
        notifications: this.extractData(notificationsCounts)
      },
      status: degraded ? 'degraded' : 'ok',
      timestamp: new Date().toISOString()
    };

    logger.info('Customer overview summary aggregated', { degraded });
    return summary;
  }

  async getProfile(headers) {
    try {
      const profile = await userService.getUserProfile(headers);
      return {
        data: profile,
        available: true
      };
    } catch (error) {
      logger.warn('Failed to fetch user profile', { error: error.message });
      return {
        data: {},
        available: false
      };
    }
  }

  async getOrdersCounts(headers) {
    try {
      const pedidos = await orderService.getPedidos(headers);
      const data = pedidos?.data || pedidos || [];
      
      return {
        total: pedidos?.total || data.length || 0,
        pending: data.filter(p => p.status === 'pending' || p.status === 'PENDENTE').length,
        completed: data.filter(p => p.status === 'completed' || p.status === 'ENTREGUE').length,
        available: true
      };
    } catch (error) {
      logger.warn('Failed to fetch orders counts', { error: error.message });
      return {
        total: 0,
        pending: 0,
        completed: 0,
        available: false
      };
    }
  }

  async getDeliveriesCounts(headers) {
    try {
      const entregas = await deliveryService.getEntregas(headers);
      const data = entregas?.data || entregas || [];
      
      return {
        total: entregas?.total || data.length || 0,
        active: data.filter(e => e.status === 'active' || e.status === 'EM_ANDAMENTO').length,
        completed: data.filter(e => e.status === 'completed' || e.status === 'CONCLUIDA').length,
        available: true
      };
    } catch (error) {
      logger.warn('Failed to fetch deliveries counts', { error: error.message });
      return {
        total: 0,
        active: 0,
        completed: 0,
        available: false
      };
    }
  }

  async getRentalsCounts(headers) {
    try {
      const alugueis = await rentalService.getAlugueis(headers);
      const data = alugueis?.data || alugueis || [];
      
      return {
        total: alugueis?.total || data.length || 0,
        active: data.filter(a => a.status === 'active' || a.status === 'ATIVO').length,
        completed: data.filter(a => a.status === 'completed' || a.status === 'FINALIZADO').length,
        available: true
      };
    } catch (error) {
      logger.warn('Failed to fetch rentals counts', { error: error.message });
      return {
        total: 0,
        active: 0,
        completed: 0,
        available: false
      };
    }
  }

  async getNotificationsCounts(headers) {
    try {
      const notifications = await notificationService.getNotifications(headers);
      const data = notifications?.data || notifications || [];
      
      return {
        total: notifications?.total || data.length || 0,
        unread: data.filter(n => !n.read).length,
        available: true
      };
    } catch (error) {
      logger.warn('Failed to fetch notifications counts', { error: error.message });
      return {
        total: 0,
        unread: 0,
        available: false
      };
    }
  }

  extractData(result) {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    logger.error('Failed promise in customer overview aggregation', { 
      reason: result.reason?.message 
    });
    return { available: false, error: result.reason?.message };
  }
}

module.exports = new CustomerOverviewAggregator();
