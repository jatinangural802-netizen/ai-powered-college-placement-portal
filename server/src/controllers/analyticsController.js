import * as analyticsService from '../services/analyticsService.js';
import { asyncHandler, sendSuccess } from '../utils/helpers.js';

export const student = asyncHandler(async (req, res) => {
  const data = await analyticsService.getStudentAnalytics(req.user._id);
  sendSuccess(res, { data });
});

export const admin = asyncHandler(async (req, res) => {
  const data = await analyticsService.getAdminAnalytics();
  sendSuccess(res, { data });
});
