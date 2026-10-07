import * as studentService from '../services/studentService.js';
import { asyncHandler, sendSuccess, getPagination, buildPaginationMeta } from '../utils/helpers.js';

export const getProfile = asyncHandler(async (req, res) => {
  const data = await studentService.getProfile(req.user._id);
  sendSuccess(res, { data });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const data = await studentService.updateProfile(req.user._id, req.body);
  sendSuccess(res, { message: 'Profile updated successfully', data });
});

export const getDashboard = asyncHandler(async (req, res) => {
  const data = await studentService.getDashboard(req.user._id);
  sendSuccess(res, { data });
});

export const listStudents = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { data, total } = await studentService.listStudents({ ...req.query, page, limit, skip });
  sendSuccess(res, { data, meta: buildPaginationMeta(total, page, limit) });
});

export const getStudent = asyncHandler(async (req, res) => {
  const data = await studentService.getStudentById(req.params.id);
  sendSuccess(res, { data });
});
