const logger = require('../logger/logger');

class ResponseCache {
  constructor() {
    this.cache = new Map();
    this.enabled = true;
  }

  generateKey(userId, endpoint) {
    return `${userId}:${endpoint}`;
  }

  set(userId, endpoint, data, ttl = 5000) {
    if (!this.enabled) return;

    const key = this.generateKey(userId, endpoint);
    const expiresAt = Date.now() + ttl;
    
    this.cache.set(key, {
      data,
      expiresAt
    });

    logger.debug('Cache set', { key, ttl });

    // Auto cleanup after TTL
    setTimeout(() => {
      this.delete(userId, endpoint);
    }, ttl);
  }

  get(userId, endpoint) {
    if (!this.enabled) return null;

    const key = this.generateKey(userId, endpoint);
    const cached = this.cache.get(key);

    if (!cached) {
      logger.debug('Cache miss', { key });
      return null;
    }

    if (Date.now() > cached.expiresAt) {
      logger.debug('Cache expired', { key });
      this.cache.delete(key);
      return null;
    }

    logger.debug('Cache hit', { key });
    return cached.data;
  }

  delete(userId, endpoint) {
    const key = this.generateKey(userId, endpoint);
    this.cache.delete(key);
    logger.debug('Cache deleted', { key });
  }

  clear() {
    this.cache.clear();
    logger.info('Cache cleared');
  }

  disable() {
    this.enabled = false;
    this.clear();
  }

  enable() {
    this.enabled = true;
  }

  getStats() {
    return {
      size: this.cache.size,
      enabled: this.enabled
    };
  }
}

module.exports = new ResponseCache();
