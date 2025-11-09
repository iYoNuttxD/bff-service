const HttpClient = require('../../infra/http/httpClient');
const servicesConfig = require('../../config/services');
const logger = require('../../infra/logger/logger');

class NotificationService {
  constructor() {
    this.client = new HttpClient(
      servicesConfig.notificationService.baseURL,
      servicesConfig.notificationService.timeout
    );
  }

  async getNotifications(headers = {}, params = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.notificationService.endpoints.notifications, {
        headers: propagatedHeaders,
        params
      });
    } catch (error) {
      logger.error('Error fetching notifications', { error: error.message });
      throw error;
    }
  }

  async getNotificationById(id, headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(`${servicesConfig.notificationService.endpoints.notifications}/${id}`, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error fetching notification by ID', { id, error: error.message });
      throw error;
    }
  }

  async sendNotification(data, headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.post(servicesConfig.notificationService.endpoints.send, data, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error sending notification', { error: error.message });
      throw error;
    }
  }

  async checkHealth() {
    try {
      return await this.client.get(servicesConfig.notificationService.endpoints.health);
    } catch (error) {
      logger.error('Notification service health check failed', { error: error.message });
      return { status: 'down', error: error.message };
    }
  }

  async proxyRequest(method, path, data, headers = {}, params = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      const config = {
        headers: propagatedHeaders,
        params
      };

      switch (method.toLowerCase()) {
        case 'get':
          return await this.client.get(path, config);
        case 'post':
          return await this.client.post(path, data, config);
        case 'put':
          return await this.client.put(path, data, config);
        case 'patch':
          return await this.client.patch(path, data, config);
        case 'delete':
          return await this.client.delete(path, config);
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    } catch (error) {
      logger.error('Error in notification proxy request', { method, path, error: error.message });
      throw error;
    }
  }
}

module.exports = new NotificationService();
