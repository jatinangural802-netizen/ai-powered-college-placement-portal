import * as jobService from '../services/jobService.js';
import { asyncHandler, sendSuccess, getPagination, buildPaginationMeta } from '../utils/helpers.js';

export const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const listFn = req.user?.role === 'ADMIN' ? jobService.adminListJobs : jobService.listJobs;
  const { data, total } = await listFn({ ...req.query, page, limit, skip });
  sendSuccess(res, { data, meta: buildPaginationMeta(total, page, limit) });
});

export const getOne = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const data = await jobService.getJob(req.params.id, userId);
  sendSuccess(res, { data });
});

export const create = asyncHandler(async (req, res) => {
  const data = await jobService.createJob(req.body, req.user._id);
  sendSuccess(res, { statusCode: 201, message: 'Job created', data });
});

export const update = asyncHandler(async (req, res) => {
  const data = await jobService.updateJob(req.params.id, req.body);
  sendSuccess(res, { message: 'Job updated', data });
});

export const remove = asyncHandler(async (req, res) => {
  const data = await jobService.deleteJob(req.params.id);
  sendSuccess(res, { message: 'Job closed', data });
});

export const recommended = asyncHandler(async (req, res) => {
  const data = await jobService.getRecommendedJobs(req.user._id);
  sendSuccess(res, { data });
});
