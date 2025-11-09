const logger = require('../infra/logger/logger');

class BffController {
  // Success response formatter
  success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  // Error response formatter
  error(res, error, message = 'Error occurred', statusCode = 500) {
    logger.error(message, { 
      error: error.message, 
      stack: error.stack 
    });

    return res.status(statusCode).json({
      success: false,
      error: message,
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }

  // Handle service errors with appropriate status codes
  handleServiceError(res, error) {
    const statusCode = error.status || 500;
    const message = error.message || 'Service error';
    
    return this.error(res, error, message, statusCode);
  }

  // Async handler wrapper
  asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  // Extract user from JWT
  getUserFromToken(req) {
    return req.auth || null;
  }

  // Get correlation ID from headers or generate new one
  getCorrelationId(req) {
    return req.headers['x-correlation-id'] || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = new BffController();
