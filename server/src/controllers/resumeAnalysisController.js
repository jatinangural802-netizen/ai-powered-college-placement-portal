import * as analysisService from '../services/resumeAnalysisService.js';
import { isAiAvailable } from '../services/aiService.js';
import { asyncHandler, sendSuccess } from '../utils/helpers.js';

export const analyze = asyncHandler(async (req, res) => {
  const { resumeId, jobId } = req.body;
  const data = await analysisService.analyzeResume(req.user._id, resumeId, jobId);
  sendSuccess(res, { message: 'Resume analyzed successfully', data });
});

export const jobMatch = asyncHandler(async (req, res) => {
  const { resumeId, jobId } = req.body;
  const data = await analysisService.jobMatchAnalysis(req.user._id, resumeId, jobId);
  sendSuccess(res, { message: 'Job match analysis complete', data });
});

export const history = asyncHandler(async (req, res) => {
  const data = req.params.resumeId
    ? await analysisService.getAnalysisHistory(req.user._id, req.params.resumeId)
    : await analysisService.getStudentAnalysisHistory(req.user._id);
  sendSuccess(res, { data });
});

export const getOne = asyncHandler(async (req, res) => {
  const data = await analysisService.getAnalysisById(req.params.id, req.user._id);
  sendSuccess(res, { data });
});

export const aiStatus = asyncHandler(async (req, res) => {
  sendSuccess(res, { data: { available: isAiAvailable() } });
});
