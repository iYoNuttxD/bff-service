const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const config = require('../../config');
const logger = require('../logger/logger');

const hasJwksConfig =
  !!config.auth.jwksUri &&
  !!config.auth.issuer &&
  !!config.auth.audience;

const hasHsSecret = !!(config.auth.secret || process.env.AUTH_JWT_SECRET);

function createRs256Middleware(required) {
  logger.info(`JWT auth using RS256 + JWKS (required=${required})`);

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
    credentialsRequired: required
  });
}

function createHs256Middleware(required) {
  const secret = config.auth.secret || process.env.AUTH_JWT_SECRET;

  if (!secret) {
    logger.warn('HS256 selected but AUTH_JWT_SECRET is missing. Auth disabled.');
    return (req, res, next) => next();
  }

  logger.info(`JWT auth using HS256 shared secret (required=${required})`);

  return jwt({
    secret,
    algorithms: ['HS256'],
    issuer: config.auth.issuer,
    audience: config.auth.audience,
    credentialsRequired: required
  });
}

// Middleware "forte" - usado onde auth é obrigatória
const createJwtMiddleware = () => {
  if (!config.auth.required) {
    logger.info('JWT authentication disabled by config (AUTH_JWT_REQUIRED=false)');
    return (req, res, next) => next();
  }

  if (hasJwksConfig) {
    return createRs256Middleware(true);
  }

  if (hasHsSecret) {
    return createHs256Middleware(true);
  }

  logger.warn('No valid JWT config found. Auth REQUIRED but no keys. Middleware will allow all.');
  return (req, res, next) => next();
};

// Middleware opcional - tenta validar se tiver token, mas não obriga
const createOptionalJwtMiddleware = () => {
  if (hasJwksConfig) {
    return createRs256Middleware(false);
  }

  if (hasHsSecret) {
    return createHs256Middleware(false);
  }

  return (req, res, next) => next();
};

// Error handler para erros de JWT
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
  optionalJwtMiddleware: createOptionalJwtMiddleware(),
  jwtErrorHandler
};
