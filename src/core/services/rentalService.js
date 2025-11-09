const HttpClient = require('../../infra/http/httpClient');
const servicesConfig = require('../../config/services');
const logger = require('../../infra/logger/logger');

class RentalService {
  constructor() {
    this.client = new HttpClient(
      servicesConfig.rentalService.baseURL,
      servicesConfig.rentalService.timeout
    );
  }

  async getAlugueis(headers = {}, params = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.rentalService.endpoints.alugueis, {
        headers: propagatedHeaders,
        params
      });
    } catch (error) {
      logger.error('Error fetching alugueis', { error: error.message });
      throw error;
    }
  }

  async getAluguelById(id, headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(`${servicesConfig.rentalService.endpoints.alugueis}/${id}`, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error fetching aluguel by ID', { id, error: error.message });
      throw error;
    }
  }

  async createAluguel(data, headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.post(servicesConfig.rentalService.endpoints.alugueis, data, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error creating aluguel', { error: error.message });
      throw error;
    }
  }

  async getVeiculos(headers = {}, params = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.rentalService.endpoints.veiculos, {
        headers: propagatedHeaders,
        params
      });
    } catch (error) {
      logger.error('Error fetching rental veiculos', { error: error.message });
      throw error;
    }
  }

  async checkHealth() {
    try {
      return await this.client.get(servicesConfig.rentalService.endpoints.health);
    } catch (error) {
      logger.error('Rental service health check failed', { error: error.message });
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
      logger.error('Error in rental proxy request', { method, path, error: error.message });
      throw error;
    }
  }
}

module.exports = new RentalService();
