import * as interviewService from '../services/interviewService.js';
import { asyncHandler, sendSuccess, getPagination, buildPaginationMeta } from '../utils/helpers.js';

export const schedule = asyncHandler(async (req, res) => {
  const data = await interviewService.scheduleInterview(req.body, req.user._id);
  sendSuccess(res, { statusCode: 201, message: 'Interview scheduled', data });
});

export const update = asyncHandler(async (req, res) => {
  const data = await interviewService.updateInterview(req.params.id, req.body, req.user._id, req.user.role);
  sendSuccess(res, { message: 'Interview updated', data });
});

export const getMy = asyncHandler(async (req, res) => {
  const data = await interviewService.getMyInterviews(req.user._id);
  sendSuccess(res, { data });
});

export const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { data, total } = await interviewService.listInterviews({ ...req.query, page, limit, skip });
  sendSuccess(res, { data, meta: buildPaginationMeta(total, page, limit) });
});

export const getOne = asyncHandler(async (req, res) => {
  const data = await interviewService.getInterview(req.params.id, req.user._id, req.user.role);
  sendSuccess(res, { data });
});
