import * as applicationService from '../services/applicationService.js';
import { asyncHandler, sendSuccess, getPagination, buildPaginationMeta } from '../utils/helpers.js';

export const apply = asyncHandler(async (req, res) => {
  const data = await applicationService.applyToJob(req.user._id, req.body.jobId);
  sendSuccess(res, { statusCode: 201, message: 'Application submitted successfully', data });
});

export const getMy = asyncHandler(async (req, res) => {
  const data = await applicationService.getMyApplications(req.user._id);
  sendSuccess(res, { data });
});

export const getOne = asyncHandler(async (req, res) => {
  const data = await applicationService.getApplication(req.params.id, req.user._id, req.user.role);
  sendSuccess(res, { data });
});

export const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { data, total } = await applicationService.listApplications({ ...req.query, page, limit, skip });
  sendSuccess(res, { data, meta: buildPaginationMeta(total, page, limit) });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const data = await applicationService.updateApplicationStatus(
    req.params.id, req.body.status, req.body.notes, req.user._id
  );
  sendSuccess(res, { message: 'Application status updated', data });
});

export const withdraw = asyncHandler(async (req, res) => {
  const data = await applicationService.withdrawApplication(req.params.id, req.user._id);
  sendSuccess(res, { message: 'Application withdrawn', data });
});
