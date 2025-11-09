const userService = require('../services/userService');
const orderService = require('../services/orderService');
const deliveryService = require('../services/deliveryService');
const rentalService = require('../services/rentalService');
const notificationService = require('../services/notificationService');
const reportService = require('../services/reportService');
const logger = require('../../infra/logger/logger');

class DashboardAggregator {
  async getOverview(headers = {}) {
    logger.info('Aggregating dashboard overview');

    const results = await Promise.allSettled([
      this.getUserData(headers),
      this.getOrdersData(headers),
      this.getDeliveriesData(headers),
      this.getRentalsData(headers),
      this.getNotificationsData(headers),
      this.getReportsData(headers)
    ]);

    const [userData, ordersData, deliveriesData, rentalsData, notificationsData, reportsData] = results;

    const degraded = results.some(r => r.status === 'rejected');

    const dashboard = {
      user: this.extractData(userData),
      orders: this.extractData(ordersData),
      deliveries: this.extractData(deliveriesData),
      rentals: this.extractData(rentalsData),
      notifications: this.extractData(notificationsData),
      reports: this.extractData(reportsData),
      status: degraded ? 'degraded' : 'ok',
      timestamp: new Date().toISOString()
    };

    logger.info('Dashboard overview aggregated', { degraded });
    return dashboard;
  }

  async getUserData(headers) {
    try {
      const profile = await userService.getUserProfile(headers);
      return {
        profile: profile || {},
        available: true
      };
    } catch (error) {
      logger.warn('Failed to fetch user data for dashboard', { error: error.message });
      return {
        profile: {},
        available: false
      };
    }
  }

  async getOrdersData(headers) {
    try {
      const dashboard = await orderService.getDashboard(headers);
      const pedidos = await orderService.getPedidos(headers, { limit: 5, sort: '-createdAt' });
      
      return {
        summary: dashboard || {},
        recent: pedidos?.data || pedidos || [],
        available: true
      };
    } catch (error) {
      logger.warn('Failed to fetch orders data for dashboard', { error: error.message });
      return {
        summary: {},
        recent: [],
        available: false
      };
    }
  }

  async getDeliveriesData(headers) {
    try {
      const entregas = await deliveryService.getEntregas(headers, { limit: 5, status: 'active' });
      
      return {
        active: entregas?.data || entregas || [],
        total: entregas?.total || entregas?.length || 0,
        available: true
      };
    } catch (error) {
      logger.warn('Failed to fetch deliveries data for dashboard', { error: error.message });
      return {
        active: [],
        total: 0,
        available: false
      };
    }
  }

  async getRentalsData(headers) {
    try {
      const alugueis = await rentalService.getAlugueis(headers, { limit: 5, status: 'active' });
      
      return {
        active: alugueis?.data || alugueis || [],
        total: alugueis?.total || alugueis?.length || 0,
        available: true
      };
    } catch (error) {
      logger.warn('Failed to fetch rentals data for dashboard', { error: error.message });
      return {
        active: [],
        total: 0,
        available: false
      };
    }
  }

  async getNotificationsData(headers) {
    try {
      const notifications = await notificationService.getNotifications(headers, { 
        limit: 5, 
        unread: true 
      });
      
      return {
        recent: notifications?.data || notifications || [],
        unreadCount: notifications?.unreadCount || 0,
        available: true
      };
    } catch (error) {
      logger.warn('Failed to fetch notifications data for dashboard', { error: error.message });
      return {
        recent: [],
        unreadCount: 0,
        available: false
      };
    }
  }

  async getReportsData(headers) {
    try {
      const metrics = await reportService.getMetrics(headers);
      
      return {
        metrics: metrics || {},
        available: true
      };
    } catch (error) {
      logger.warn('Failed to fetch reports data for dashboard', { error: error.message });
      return {
        metrics: {},
        available: false
      };
    }
  }

  extractData(result) {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    logger.error('Failed promise in dashboard aggregation', { 
      reason: result.reason?.message 
    });
    return { available: false, error: result.reason?.message };
  }
}

module.exports = new DashboardAggregator();
