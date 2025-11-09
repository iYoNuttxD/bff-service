const HttpClient = require('../../infra/http/httpClient');
const servicesConfig = require('../../config/services');
const logger = require('../../infra/logger/logger');

class DeliveryService {
  constructor() {
    this.client = new HttpClient(
      servicesConfig.deliveryService.baseURL,
      servicesConfig.deliveryService.timeout
    );
  }

  // Entregas
  async getEntregas(headers = {}, params = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.deliveryService.endpoints.entregas, {
        headers: propagatedHeaders,
        params
      });
    } catch (error) {
      logger.error('Error fetching entregas', { error: error.message });
      throw error;
    }
  }

  async getEntregaById(id, headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(`${servicesConfig.deliveryService.endpoints.entregas}/${id}`, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error fetching entrega by ID', { id, error: error.message });
      throw error;
    }
  }

  async createEntrega(data, headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.post(servicesConfig.deliveryService.endpoints.entregas, data, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error creating entrega', { error: error.message });
      throw error;
    }
  }

  async updateEntregaStatus(id, data, headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.patch(`${servicesConfig.deliveryService.endpoints.entregas}/${id}/status`, data, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error updating entrega status', { id, error: error.message });
      throw error;
    }
  }

  // Entregadores
  async getEntregadores(headers = {}, params = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.deliveryService.endpoints.entregadores, {
        headers: propagatedHeaders,
        params
      });
    } catch (error) {
      logger.error('Error fetching entregadores', { error: error.message });
      throw error;
    }
  }

  // Veículos
  async getVeiculos(headers = {}, params = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.deliveryService.endpoints.veiculos, {
        headers: propagatedHeaders,
        params
      });
    } catch (error) {
      logger.error('Error fetching veiculos', { error: error.message });
      throw error;
    }
  }

  // Aluguéis
  async getAlugueis(headers = {}, params = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.deliveryService.endpoints.alugueis, {
        headers: propagatedHeaders,
        params
      });
    } catch (error) {
      logger.error('Error fetching alugueis', { error: error.message });
      throw error;
    }
  }

  // Tracking
  async getTrackingDeliveries(headers = {}, params = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.deliveryService.endpoints.tracking, {
        headers: propagatedHeaders,
        params
      });
    } catch (error) {
      logger.error('Error fetching tracking deliveries', { error: error.message });
      throw error;
    }
  }

  async getTrackingDeliveryById(deliveryId, headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(`${servicesConfig.deliveryService.endpoints.tracking}/${deliveryId}`, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error fetching tracking delivery by ID', { deliveryId, error: error.message });
      throw error;
    }
  }

  async getMetrics(headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.deliveryService.endpoints.metrics, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error fetching delivery service metrics', { error: error.message });
      return null;
    }
  }

  async checkHealth() {
    try {
      return await this.client.get(servicesConfig.deliveryService.endpoints.health);
    } catch (error) {
      logger.error('Delivery service health check failed', { error: error.message });
      return { status: 'down', error: error.message };
    }
  }

  // Proxy generic method for all endpoints
  async proxyRequest(method, path, data, headers = {}, params = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      const config = {
        headers: propagatedHeaders,
        params
      };

      // Prepend /api/v1 if path doesn't start with it
      const fullPath = path.startsWith('/api/v1') ? path : `/api/v1${path}`;

      switch (method.toLowerCase()) {
        case 'get':
          return await this.client.get(fullPath, config);
        case 'post':
          return await this.client.post(fullPath, data, config);
        case 'put':
          return await this.client.put(fullPath, data, config);
        case 'patch':
          return await this.client.patch(fullPath, data, config);
        case 'delete':
          return await this.client.delete(fullPath, config);
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    } catch (error) {
      logger.error('Error in delivery proxy request', { method, path, error: error.message });
      throw error;
    }
  }
}

module.exports = new DeliveryService();
