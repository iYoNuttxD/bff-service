const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const config = require('../../config');
const logger = require('../logger/logger');

// JWT Middleware factory
const createJwtMiddleware = () => {
  if (!config.auth.required) {
    logger.info('JWT authentication is disabled');
    return (req, res, next) => next();
  }

  if (!config.auth.jwksUri || !config.auth.issuer || !config.auth.audience) {
    logger.warn('JWT configuration incomplete, authentication disabled');
    return (req, res, next) => next();
  }

  return jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: config.auth.jwksUri
    }),
    audience: config.auth.audience,
    issuer: config.auth.issuer,
    algorithms: ['RS256'],
    credentialsRequired: config.auth.required
  });
};

// Optional JWT middleware (doesn't fail if no token)
const optionalJwtMiddleware = () => {
  if (!config.auth.jwksUri || !config.auth.issuer || !config.auth.audience) {
    return (req, res, next) => next();
  }

  return jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: config.auth.jwksUri
    }),
    audience: config.auth.audience,
    issuer: config.auth.issuer,
    algorithms: ['RS256'],
    credentialsRequired: false
  });
};

// Error handler for JWT errors
const jwtErrorHandler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    logger.warn('JWT authentication failed', {
      path: req.path,
      error: err.message
    });
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing authentication token'
    });
  }
  next(err);
};

module.exports = {
  jwtMiddleware: createJwtMiddleware(),
  optionalJwtMiddleware: optionalJwtMiddleware(),
  jwtErrorHandler
};
