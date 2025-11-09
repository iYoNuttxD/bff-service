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

  async getRentals(headers = {}, params = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.rentalService.endpoints.rentals, {
        headers: propagatedHeaders,
        params
      });
    } catch (error) {
      logger.error('Error fetching rentals', { error: error.message });
      throw error;
    }
  }

  async getRentalById(id, headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(`${servicesConfig.rentalService.endpoints.rentals}/${id}`, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error fetching rental by ID', { id, error: error.message });
      throw error;
    }
  }

  async createRental(data, headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.post(servicesConfig.rentalService.endpoints.rentals, data, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error creating rental', { error: error.message });
      throw error;
    }
  }

  async renewRental(id, data, headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.post(`${servicesConfig.rentalService.endpoints.rentals}/${id}/renew`, data, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error renewing rental', { id, error: error.message });
      throw error;
    }
  }

  async endRental(id, data, headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.post(`${servicesConfig.rentalService.endpoints.rentals}/${id}/end`, data, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error ending rental', { id, error: error.message });
      throw error;
    }
  }

  async returnRental(id, data, headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.post(`${servicesConfig.rentalService.endpoints.rentals}/${id}/return`, data, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error returning rental', { id, error: error.message });
      throw error;
    }
  }

  async getVehiclesAvailability(headers = {}, params = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.rentalService.endpoints.vehicles, {
        headers: propagatedHeaders,
        params
      });
    } catch (error) {
      logger.error('Error fetching vehicles availability', { error: error.message });
      throw error;
    }
  }

  // Legacy methods for backward compatibility
  async getAlugueis(headers = {}, params = {}) {
    return this.getRentals(headers, params);
  }

  async getAluguelById(id, headers = {}) {
    return this.getRentalById(id, headers);
  }

  async createAluguel(data, headers = {}) {
    return this.createRental(data, headers);
  }

  async getVeiculos(headers = {}, params = {}) {
    return this.getVehiclesAvailability(headers, params);
  }

  async getMetrics(headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.rentalService.endpoints.metrics, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error fetching rental service metrics', { error: error.message });
      return null;
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
      logger.error('Error in rental proxy request', { method, path, error: error.message });
      throw error;
    }
  }
}

module.exports = new RentalService();
