const HttpClient = require('../../infra/http/httpClient');
const servicesConfig = require('../../config/services');
const logger = require('../../infra/logger/logger');

class UserService {
  constructor() {
    this.client = new HttpClient(
      servicesConfig.userService.baseURL,
      servicesConfig.userService.timeout
    );
  }

  async getUsers(headers = {}, params = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.userService.endpoints.users, {
        headers: propagatedHeaders,
        params
      });
    } catch (error) {
      logger.error('Error fetching users', { error: error.message });
      throw error;
    }
  }

  async getUserById(id, headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(`${servicesConfig.userService.endpoints.users}/${id}`, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error fetching user by ID', { id, error: error.message });
      throw error;
    }
  }

  async getUserProfile(headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.get(servicesConfig.userService.endpoints.profile, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error fetching user profile', { error: error.message });
      throw error;
    }
  }

  async createUser(data, headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.post(servicesConfig.userService.endpoints.users, data, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error creating user', { error: error.message });
      throw error;
    }
  }

  async updateUser(id, data, headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.put(`${servicesConfig.userService.endpoints.users}/${id}`, data, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error updating user', { id, error: error.message });
      throw error;
    }
  }

  async deleteUser(id, headers = {}) {
    try {
      const propagatedHeaders = this.client.propagateHeaders(headers);
      return await this.client.delete(`${servicesConfig.userService.endpoints.users}/${id}`, {
        headers: propagatedHeaders
      });
    } catch (error) {
      logger.error('Error deleting user', { id, error: error.message });
      throw error;
    }
  }

  async checkHealth() {
    try {
      return await this.client.get(servicesConfig.userService.endpoints.health);
    } catch (error) {
      logger.error('User service health check failed', { error: error.message });
      return { status: 'down', error: error.message };
    }
  }
}

module.exports = new UserService();
