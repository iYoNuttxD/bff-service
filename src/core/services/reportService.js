const HttpClient = require('../../infra/http/httpClient');
const servicesConfig = require('../../config/services');
const logger = require('../../infra/logger/logger');

class ReportService {
  constructor() {
    this.client = new HttpClient(
      servicesConfig.reportService.baseURL,
      servicesConfig.reportService.timeout
    );
  }

  async getReports(headers = {}, params = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.reportService.endpoints.reports, {
        headers: propagatedHeaders,
        params
      });
    } catch (error) {
      logger.error('Error fetching reports', { error: error.message });
      throw error;
    }
  }

  async getReportById(id, headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(`${servicesConfig.reportService.endpoints.reports}/${id}`, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error fetching report by ID', { id, error: error.message });
      throw error;
    }
  }

  async getReportMetrics(headers = {}, params = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.reportService.endpoints.metricsEndpoint, {
        headers: propagatedHeaders,
        params
      });
    } catch (error) {
      logger.error('Error fetching report metrics', { error: error.message });
      return null;
    }
  }

  async getMetrics(headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.reportService.endpoints.metrics, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error fetching report service metrics', { error: error.message });
      return null;
    }
  }

  async checkHealth() {
    try {
      return await this.client.get(servicesConfig.reportService.endpoints.health);
    } catch (error) {
      logger.error('Report service health check failed', { error: error.message });
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
      logger.error('Error in report proxy request', { method, path, error: error.message });
      throw error;
    }
  }
}

module.exports = new ReportService();
