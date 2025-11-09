const request = require('supertest');
const app = require('../../src/app');

describe('Health Check', () => {
  it('should return health status with all dependencies', async () => {
    const response = await request(app)
      .get('/api/v1/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('service', 'bff-service');
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('dependencies');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body.dependencies).toHaveProperty('userService');
    expect(response.body.dependencies).toHaveProperty('ordersService');
    expect(response.body.dependencies).toHaveProperty('deliveryService');
    expect(response.body.dependencies).toHaveProperty('rentalService');
    expect(response.body.dependencies).toHaveProperty('notificationService');
    expect(response.body.dependencies).toHaveProperty('reportService');
  });

  it('should handle health check errors gracefully', async () => {
    const response = await request(app)
      .get('/api/v1/health')
      .expect('Content-Type', /json/);

    // Should return either 200 (ok/degraded) or 503 (error)
    expect([200, 503]).toContain(response.status);
    expect(response.body).toHaveProperty('service', 'bff-service');
  });
});

describe('Root Endpoint', () => {
  it('should return service information', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('service', 'bff-service');
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('endpoints');
    expect(response.body).toHaveProperty('microservices');
  });
});

describe('404 Handler', () => {
  it('should return 404 for non-existent routes', async () => {
    const response = await request(app)
      .get('/api/v1/non-existent-route')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Endpoint not found');
  });
});
