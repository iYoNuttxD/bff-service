const express = require('express');
const router = express.Router();
const userService = require('../../core/services/userService');
const bffController = require('../bffController');
const { optionalJwtMiddleware } = require('../../infra/auth/jwtMiddleware');

/**
 * PUBLIC ROUTES
 */

// POST /api/v1/users/register - Register new user
router.post(
  '/register',
  bffController.asyncHandler(async (req, res) => {
    const result = await userService.register(req.body, req.headers);
    return bffController.success(res, result, 'User registered', 201);
  })
);

// POST /api/v1/users/login - Login user
router.post(
  '/login',
  bffController.asyncHandler(async (req, res) => {
    const result = await userService.login(req.body, req.headers);
    return bffController.success(res, result, 'Login successful');
  })
);

// Apply optional JWT middleware to all other routes
router.use(optionalJwtMiddleware);

/**
 * AUTHENTICATED USER ROUTES
 */

// GET /api/v1/users/me - Get current user profile
router.get(
  '/me',
  bffController.asyncHandler(async (req, res) => {
    const result = await userService.getUserProfile(req.headers);
    return bffController.success(res, result);
  })
);

// PUT /api/v1/users/me - Update user profile
router.put(
  '/me',
  bffController.asyncHandler(async (req, res) => {
    const result = await userService.updateMe(req.body, req.headers);
    return bffController.success(res, result, 'User updated');
  })
);

// PUT /api/v1/users/me/password - Update password
router.put(
  '/me/password',
  bffController.asyncHandler(async (req, res) => {
    const result = await userService.updatePassword(req.body, req.headers);
    return bffController.success(res, result, 'Password updated');
  })
);

/**
 * ADMIN / LEGACY ROUTES
 */

// GET /api/v1/users - Get all users
router.get(
  '/',
  bffController.asyncHandler(async (req, res) => {
    const result = await userService.getUsers(req.headers, req.query);
    return bffController.success(res, result);
  })
);

// GET /api/v1/users/:id - Get user by ID
router.get(
  '/:id',
  bffController.asyncHandler(async (req, res) => {
    const result = await userService.getUserById(req.params.id, req.headers);
    return bffController.success(res, result);
  })
);

// PUT /api/v1/users/:id - Update user by ID
router.put(
  '/:id',
  bffController.asyncHandler(async (req, res) => {
    const result = await userService.updateUser(req.params.id, req.body, req.headers);
    return bffController.success(res, result, 'User updated');
  })
);

// DELETE /api/v1/users/:id - Delete user
router.delete(
  '/:id',
  bffController.asyncHandler(async (req, res) => {
    const result = await userService.deleteUser(req.params.id, req.headers);
    return bffController.success(res, result, 'User deleted');
  })
);

module.exports = router;
