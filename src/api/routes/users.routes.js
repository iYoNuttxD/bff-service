const express = require('express');
const router = express.Router();
const userService = require('../../core/services/userService');
const bffController = require('../bffController');
const { optionalJwtMiddleware } = require('../../infra/auth/jwtMiddleware');

// Apply optional JWT middleware to all routes
router.use(optionalJwtMiddleware);

// GET /api/v1/users - Get all users
router.get('/', bffController.asyncHandler(async (req, res) => {
  const result = await userService.getUsers(req.headers, req.query);
  return bffController.success(res, result);
}));

// GET /api/v1/users/me - Get current user profile
router.get('/me', bffController.asyncHandler(async (req, res) => {
  const result = await userService.getUserProfile(req.headers);
  return bffController.success(res, result);
}));

// GET /api/v1/users/:id - Get user by ID
router.get('/:id', bffController.asyncHandler(async (req, res) => {
  const result = await userService.getUserById(req.params.id, req.headers);
  return bffController.success(res, result);
}));

// POST /api/v1/users - Create new user
router.post('/', bffController.asyncHandler(async (req, res) => {
  const result = await userService.createUser(req.body, req.headers);
  return bffController.success(res, result, 'User created', 201);
}));

// PUT /api/v1/users/:id - Update user
router.put('/:id', bffController.asyncHandler(async (req, res) => {
  const result = await userService.updateUser(req.params.id, req.body, req.headers);
  return bffController.success(res, result, 'User updated');
}));

// DELETE /api/v1/users/:id - Delete user
router.delete('/:id', bffController.asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id, req.headers);
  return bffController.success(res, result, 'User deleted');
}));

module.exports = router;
