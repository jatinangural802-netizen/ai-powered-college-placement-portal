import * as resultService from '../services/resultService.js';
import { asyncHandler, sendSuccess, getPagination, buildPaginationMeta } from '../utils/helpers.js';

export const getMy = asyncHandler(async (req, res) => {
  const data = await resultService.getMyResults(req.user._id);
  sendSuccess(res, { data });
});

export const create = asyncHandler(async (req, res) => {
  const data = await resultService.createResult(req.body, req.user._id);
  sendSuccess(res, { statusCode: 201, message: 'Result published', data });
});

export const update = asyncHandler(async (req, res) => {
  const data = await resultService.updateResult(req.params.id, req.body, req.user._id);
  sendSuccess(res, { message: 'Result updated', data });
});

export const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { data, total } = await resultService.listResults({ ...req.query, page, limit, skip });
  sendSuccess(res, { data, meta: buildPaginationMeta(total, page, limit) });
});
