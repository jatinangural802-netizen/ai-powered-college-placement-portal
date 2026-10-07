import { Result } from '../models/Result.js';
import { Application } from '../models/Application.js';
import { ApiError } from '../utils/helpers.js';
import { createNotification } from './notificationService.js';

export const getMyResults = async (studentId) => {
  return Result.find({ student: studentId })
    .populate('company', 'name logo')
    .populate('job', 'title salary')
    .sort({ createdAt: -1 });
};

export const createResult = async (data, adminId) => {
  const result = await Result.create({
    ...data,
    createdBy: adminId,
    publishedAt: data.status !== 'Pending' ? new Date() : null,
  });

  if (data.application) {
    const app = await Application.findById(data.application);
    if (app) {
      app.status = data.status === 'Selected' ? 'Selected' : data.status === 'Rejected' ? 'Rejected' : app.status;
      app.statusHistory.push({ status: app.status, changedBy: adminId });
      await app.save();
    }
  }

  if (data.status === 'Selected') {
    await createNotification({
      user: data.student,
      title: 'Congratulations!',
      message: `You have been selected! Check your results for details.`,
      type: 'result',
      link: '/student/results',
    });
  }

  return result.populate(['company', 'job', 'student']);
};

export const updateResult = async (id, data, adminId) => {
  const result = await Result.findByIdAndUpdate(
    id,
    { ...data, publishedAt: data.status !== 'Pending' ? new Date() : undefined },
    { new: true }
  ).populate(['company', 'job', 'student']);
  if (!result) throw new ApiError(404, 'Result not found');
  return result;
};

export const listResults = async ({ page, limit, skip, status, company }) => {
  const filter = {};
  if (status) filter.status = status;
  if (company) filter.company = company;

  const [data, total] = await Promise.all([
    Result.find(filter)
      .populate('student', 'fullName email studentId department')
      .populate('company', 'name')
      .populate('job', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Result.countDocuments(filter),
  ]);
  return { data, total };
};
