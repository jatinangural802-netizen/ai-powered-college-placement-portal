import * as authService from '../services/authService.js';
import { asyncHandler, sendSuccess } from '../utils/helpers.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  sendSuccess(res, { statusCode: 201, message: 'Registration successful', data: result });
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  sendSuccess(res, { message: 'Login successful', data: result });
});

export const logout = asyncHandler(async (req, res) => {
  sendSuccess(res, { message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req, res) => {
  const result = await authService.getMe(req.user._id);
  sendSuccess(res, { data: result });
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user._id, req.body.currentPassword, req.body.newPassword);
  sendSuccess(res, { message: 'Password updated successfully' });
});
