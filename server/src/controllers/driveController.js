import * as driveService from '../services/driveService.js';
import { asyncHandler, sendSuccess, getPagination, buildPaginationMeta } from '../utils/helpers.js';

export const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { data, total } = await driveService.listDrives({ ...req.query, page, limit, skip });
  sendSuccess(res, { data, meta: buildPaginationMeta(total, page, limit) });
});

export const getOne = asyncHandler(async (req, res) => {
  const data = await driveService.getDrive(req.params.id);
  sendSuccess(res, { data });
});

export const create = asyncHandler(async (req, res) => {
  const data = await driveService.createDrive(req.body, req.user._id);
  sendSuccess(res, { statusCode: 201, message: 'Placement drive created', data });
});

export const update = asyncHandler(async (req, res) => {
  const data = await driveService.updateDrive(req.params.id, req.body);
  sendSuccess(res, { message: 'Placement drive updated', data });
});

export const remove = asyncHandler(async (req, res) => {
  const data = await driveService.deleteDrive(req.params.id);
  sendSuccess(res, { message: 'Placement drive closed', data });
});
