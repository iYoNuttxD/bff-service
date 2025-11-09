const HttpClient = require('../../infra/http/httpClient');
const servicesConfig = require('../../config/services');
const logger = require('../../infra/logger/logger');

class OrderService {
  constructor() {
    this.client = new HttpClient(
      servicesConfig.ordersService.baseURL,
      servicesConfig.ordersService.timeout
    );
  }

  // Pedidos
  async getPedidos(headers = {}, params = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.ordersService.endpoints.pedidos, {
        headers: propagatedHeaders,
        params
      });
    } catch (error) {
      logger.error('Error fetching pedidos', { error: error.message });
      throw error;
    }
  }

  async getPedidoById(id, headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(`${servicesConfig.ordersService.endpoints.pedidos}/${id}`, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error fetching pedido by ID', { id, error: error.message });
      throw error;
    }
  }

  async createPedido(data, headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.post(servicesConfig.ordersService.endpoints.pedidos, data, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error creating pedido', { error: error.message });
      throw error;
    }
  }

  async updatePedidoStatus(id, data, headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.patch(`${servicesConfig.ordersService.endpoints.pedidos}/${id}/status`, data, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error updating pedido status', { id, error: error.message });
      throw error;
    }
  }

  async getDashboard(headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.ordersService.endpoints.dashboard, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error fetching orders dashboard', { error: error.message });
      return null;
    }
  }

  // Clientes
  async getClientes(headers = {}, params = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.ordersService.endpoints.clientes, {
        headers: propagatedHeaders,
        params
      });
    } catch (error) {
      logger.error('Error fetching clientes', { error: error.message });
      throw error;
    }
  }

  // Restaurantes
  async getRestaurantes(headers = {}, params = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.ordersService.endpoints.restaurantes, {
        headers: propagatedHeaders,
        params
      });
    } catch (error) {
      logger.error('Error fetching restaurantes', { error: error.message });
      throw error;
    }
  }

  // Pagamentos
  async getPagamentos(headers = {}, params = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.ordersService.endpoints.pagamentos, {
        headers: propagatedHeaders,
        params
      });
    } catch (error) {
      logger.error('Error fetching pagamentos', { error: error.message });
      throw error;
    }
  }

  async checkHealth() {
    try {
      return await this.client.get(servicesConfig.ordersService.endpoints.health);
    } catch (error) {
      logger.error('Orders service health check failed', { error: error.message });
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
      logger.error('Error in orders proxy request', { method, path, error: error.message });
      throw error;
    }
  }
}

module.exports = new OrderService();
