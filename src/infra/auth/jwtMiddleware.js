const { expressjwt: jwt } = require('express-jwt');
const logger = require('../logger/logger');
const config = require('../../config');

const secret = config.auth.secret || process.env.AUTH_JWT_SECRET;
const issuer = config.auth.issuer;
const audience = config.auth.audience;
const required = !!config.auth.required;

if (!secret) {
  logger.warn('AUTH_JWT_SECRET not configured. JWT auth will be disabled.');
}

const buildOptions = (credentialsRequired) => ({
  secret,
  algorithms: ['HS256'],
  issuer,
  audience,
  credentialsRequired
});

const jwtMiddleware = secret
  ? jwt(buildOptions(required))
  : (req, res, next) => next();

const optionalJwtMiddleware = secret
  ? jwt(buildOptions(false))
  : (req, res, next) => next();

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
  jwtMiddleware,
  optionalJwtMiddleware,
  jwtErrorHandler
};
