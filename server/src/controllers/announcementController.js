import * as announcementService from '../services/announcementService.js';
import { asyncHandler, sendSuccess, getPagination, buildPaginationMeta } from '../utils/helpers.js';

export const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const activeOnly = req.user?.role !== 'ADMIN';
  const { data, total } = await announcementService.listAnnouncements({ ...req.query, page, limit, skip, activeOnly });
  sendSuccess(res, { data, meta: buildPaginationMeta(total, page, limit) });
});

export const create = asyncHandler(async (req, res) => {
  const data = await announcementService.createAnnouncement(req.body, req.user._id);
  sendSuccess(res, { statusCode: 201, message: 'Announcement created', data });
});

export const update = asyncHandler(async (req, res) => {
  const data = await announcementService.updateAnnouncement(req.params.id, req.body);
  sendSuccess(res, { message: 'Announcement updated', data });
});

export const remove = asyncHandler(async (req, res) => {
  const data = await announcementService.deleteAnnouncement(req.params.id);
  sendSuccess(res, { message: 'Announcement removed', data });
});
