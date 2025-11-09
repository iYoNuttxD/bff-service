const dashboardAggregator = require('../../src/core/aggregators/dashboardAggregator');
const userService = require('../../src/core/services/userService');
const orderService = require('../../src/core/services/orderService');
const deliveryService = require('../../src/core/services/deliveryService');
const rentalService = require('../../src/core/services/rentalService');
const notificationService = require('../../src/core/services/notificationService');
const reportService = require('../../src/core/services/reportService');

// Mock all services
jest.mock('../../src/core/services/userService');
jest.mock('../../src/core/services/orderService');
jest.mock('../../src/core/services/deliveryService');
jest.mock('../../src/core/services/rentalService');
jest.mock('../../src/core/services/notificationService');
jest.mock('../../src/core/services/reportService');

describe('Dashboard Aggregator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should aggregate data from all services successfully', async () => {
    // Mock successful responses
    userService.getUserProfile.mockResolvedValue({ id: 1, name: 'Test User' });
    orderService.getDashboard.mockResolvedValue({ total: 10 });
    orderService.getPedidos.mockResolvedValue({ data: [], total: 10 });
    deliveryService.getEntregas.mockResolvedValue({ data: [], total: 5 });
    rentalService.getAlugueis.mockResolvedValue({ data: [], total: 3 });
    notificationService.getNotifications.mockResolvedValue({ data: [], unreadCount: 2 });
    reportService.getReportMetrics.mockResolvedValue({ totalRevenue: 1000 });

    const result = await dashboardAggregator.getOverview({});

    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('orders');
    expect(result).toHaveProperty('deliveries');
    expect(result).toHaveProperty('rentals');
    expect(result).toHaveProperty('notifications');
    expect(result).toHaveProperty('reports');
    expect(result).toHaveProperty('status', 'ok');
    expect(result).toHaveProperty('timestamp');
    expect(result.user.available).toBe(true);
    expect(result.orders.available).toBe(true);
  });

  it('should handle service failures gracefully', async () => {
    // Mock some failures - services handle errors internally so they don't reject
    userService.getUserProfile.mockRejectedValue(new Error('Service unavailable'));
    orderService.getDashboard.mockRejectedValue(new Error('Service unavailable'));
    orderService.getPedidos.mockRejectedValue(new Error('Service unavailable'));
    deliveryService.getEntregas.mockResolvedValue({ data: [], total: 5 });
    rentalService.getAlugueis.mockResolvedValue({ data: [], total: 3 });
    notificationService.getNotifications.mockResolvedValue({ data: [], unreadCount: 2 });
    reportService.getReportMetrics.mockResolvedValue({ totalRevenue: 1000 });

    const result = await dashboardAggregator.getOverview({});

    // Services that failed should have available: false
    expect(result.user).toHaveProperty('available', false);
    expect(result.orders).toHaveProperty('available', false);
    expect(result.deliveries).toHaveProperty('available', true);
  });

  it('should return data even when all services fail', async () => {
    // Mock all services failing
    userService.getUserProfile.mockRejectedValue(new Error('Service down'));
    orderService.getDashboard.mockRejectedValue(new Error('Service down'));
    orderService.getPedidos.mockRejectedValue(new Error('Service down'));
    deliveryService.getEntregas.mockRejectedValue(new Error('Service down'));
    rentalService.getAlugueis.mockRejectedValue(new Error('Service down'));
    notificationService.getNotifications.mockRejectedValue(new Error('Service down'));
    reportService.getReportMetrics.mockRejectedValue(new Error('Service down'));

    const result = await dashboardAggregator.getOverview({});

    expect(result).toHaveProperty('status', 'ok');
    expect(result.user).toHaveProperty('available', false);
    expect(result.orders).toHaveProperty('available', false);
    expect(result.deliveries).toHaveProperty('available', false);
    expect(result.rentals).toHaveProperty('available', false);
    expect(result.notifications).toHaveProperty('available', false);
    expect(result.reports).toHaveProperty('available', false);
  });
});
