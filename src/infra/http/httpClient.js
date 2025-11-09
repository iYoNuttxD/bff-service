const axios = require('axios');
const logger = require('../logger/logger');

class HttpClient {
  constructor(baseURL, timeout = 30000) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const correlationId = config.headers['x-correlation-id'] || this.generateCorrelationId();
        config.headers['x-correlation-id'] = correlationId;
        
        logger.info('HTTP Request', {
          method: config.method,
          url: config.url,
          baseURL: config.baseURL,
          correlationId
        });
        
        return config;
      },
      (error) => {
        logger.error('HTTP Request Error', { error: error.message });
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.info('HTTP Response', {
          status: response.status,
          url: response.config.url,
          correlationId: response.config.headers['x-correlation-id']
        });
        return response;
      },
      (error) => {
        const correlationId = error.config?.headers?.['x-correlation-id'];
        logger.error('HTTP Response Error', {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url,
          correlationId
        });
        return Promise.reject(error);
      }
    );
  }

  generateCorrelationId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async get(url, config = {}) {
    try {
      const response = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post(url, data, config = {}) {
    try {
      const response = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put(url, data, config = {}) {
    try {
      const response = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async patch(url, data, config = {}) {
    try {
      const response = await this.client.patch(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(url, config = {}) {
    try {
      const response = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const apiError = new Error(error.response.data?.message || error.message);
      apiError.status = error.response.status;
      apiError.data = error.response.data;
      throw apiError;
    } else if (error.request) {
      // Request was made but no response
      const timeoutError = new Error('Service unavailable or timeout');
      timeoutError.status = 503;
      throw timeoutError;
    } else {
      // Something else happened
      throw error;
    }
  }

  // Propagate headers from incoming request
  propagateHeaders(incomingHeaders) {
    const headersToPropagate = {};
    
    if (incomingHeaders.authorization) {
      headersToPropagate.authorization = incomingHeaders.authorization;
    }
    
    if (incomingHeaders['x-correlation-id']) {
      headersToPropagate['x-correlation-id'] = incomingHeaders['x-correlation-id'];
    }
    
    return headersToPropagate;
  }
}

module.exports = HttpClient;
