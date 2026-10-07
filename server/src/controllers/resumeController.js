import * as resumeService from '../services/resumeService.js';
import { asyncHandler, sendSuccess, ApiError } from '../utils/helpers.js';

export const upload = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');
  const data = await resumeService.uploadResume(req.user._id, req.file);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Resume uploaded successfully',
    data,
  });
});

export const getMy = asyncHandler(async (req, res) => {
  const data = await resumeService.getMyResumes(req.user._id);
  sendSuccess(res, { data });
});

export const getOne = asyncHandler(async (req, res) => {
  const data = await resumeService.getResume(req.params.id, req.user._id, req.user.role);
  sendSuccess(res, { data });
});
