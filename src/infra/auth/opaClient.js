const axios = require('axios');
const config = require('../../config');
const logger = require('../logger/logger');

class OpaClient {
  constructor() {
    this.enabled = !!config.opa.url;
    this.client = this.enabled ? axios.create({
      baseURL: config.opa.url,
      timeout: config.opa.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    }) : null;
  }

  async authorize(req) {
    if (!this.enabled) {
      logger.debug('OPA authorization disabled');
      return true;
    }

    try {
      const input = this.buildInput(req);
      const response = await this.client.post(config.opa.policyPath, { input });
      
      const allowed = response.data?.result || false;
      
      logger.info('OPA authorization result', {
        path: req.path,
        method: req.method,
        allowed,
        user: req.auth?.sub
      });
      
      return allowed;
    } catch (error) {
      logger.error('OPA authorization error', {
        error: error.message,
        path: req.path
      });
      
      // Fail open if configured
      if (config.opa.failOpen) {
        logger.warn('OPA authorization failed, allowing due to fail-open policy');
        return true;
      }
      
      return false;
    }
  }

  buildInput(req) {
    return {
      method: req.method,
      path: req.path,
      user: {
        sub: req.auth?.sub,
        permissions: req.auth?.permissions || [],
        roles: req.auth?.roles || []
      },
      headers: {
        authorization: !!req.headers.authorization
      }
    };
  }

  middleware() {
    return async (req, res, next) => {
      if (!this.enabled) {
        return next();
      }

      const allowed = await this.authorize(req);
      
      if (!allowed) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to access this resource'
        });
      }
      
      next();
    };
  }
}

module.exports = new OpaClient();
