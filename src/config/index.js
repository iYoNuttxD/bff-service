require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  apiVersion: process.env.API_VERSION || 'v1',
  logLevel: process.env.LOG_LEVEL || 'info',
  
  services: {
    user: {
      baseURL: process.env.USER_SERVICE_URL || 'http://localhost:3001',
      timeout: parseInt(process.env.SERVICE_TIMEOUT, 10) || 30000
    },
    orders: {
      baseURL: process.env.ORDERS_SERVICE_URL || 'http://localhost:3002',
      timeout: parseInt(process.env.SERVICE_TIMEOUT, 10) || 30000
    },
    delivery: {
      baseURL: process.env.DELIVERY_SERVICE_URL || 'http://localhost:3003',
      timeout: parseInt(process.env.SERVICE_TIMEOUT, 10) || 30000
    },
    rental: {
      baseURL: process.env.RENTAL_SERVICE_URL || 'http://localhost:3004',
      timeout: parseInt(process.env.SERVICE_TIMEOUT, 10) || 30000
    },
    notification: {
      baseURL: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005',
      timeout: parseInt(process.env.SERVICE_TIMEOUT, 10) || 30000
    },
    report: {
      baseURL: process.env.REPORT_SERVICE_URL || 'http://localhost:3006',
      timeout: parseInt(process.env.SERVICE_TIMEOUT, 10) || 30000
    }
  },
  
  auth: {
    jwksUri: process.env.AUTH_JWKS_URI,
    issuer: process.env.AUTH_ISSUER,
    audience: process.env.AUTH_AUDIENCE,
    required: process.env.AUTH_JWT_REQUIRED === 'true',
    secret: process.env.AUTH_JWT_SECRET
  },
  
  opa: {
    url: process.env.OPA_URL,
    policyPath: process.env.OPA_POLICY_PATH || '/v1/data/bff/allow',
    timeout: parseInt(process.env.OPA_TIMEOUT_MS, 10) || 2000,
    failOpen: process.env.OPA_FAIL_OPEN === 'true'
  },
  
  cache: {
    ttl: parseInt(process.env.CACHE_TTL, 10) || 5000, // 5 seconds default
    enabled: process.env.CACHE_ENABLED !== 'false'
  }
};
