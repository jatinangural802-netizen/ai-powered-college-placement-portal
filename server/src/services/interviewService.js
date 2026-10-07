import { Interview } from '../models/Interview.js';
import { Application } from '../models/Application.js';
import { ApiError } from '../utils/helpers.js';
import { createNotification } from './notificationService.js';

export const scheduleInterview = async (data, adminId) => {
  const application = await Application.findById(data.application).populate('job').populate('company');
  if (!application) throw new ApiError(404, 'Application not found');

  const interview = await Interview.create({
    ...data,
    company: application.company._id,
    student: application.student,
    createdBy: adminId,
  });

  if (application.status !== 'Interview Scheduled') {
    application.status = 'Interview Scheduled';
    application.statusHistory.push({ status: 'Interview Scheduled', changedBy: adminId });
    await application.save();
  }

  await createNotification({
    user: application.student,
    title: 'Interview Scheduled',
    message: `${data.round} interview scheduled for ${application.job.title} on ${new Date(data.date).toLocaleDateString()}.`,
    type: 'interview',
    link: '/student/interviews',
  });

  return interview.populate(['company', 'application']);
};

export const updateInterview = async (id, data, userId, role) => {
  if (role !== 'ADMIN') throw new ApiError(403, 'Only admins can modify interviews');

  const interview = await Interview.findByIdAndUpdate(id, data, { new: true })
    .populate('company')
    .populate({ path: 'application', populate: { path: 'job', select: 'title' } });
  if (!interview) throw new ApiError(404, 'Interview not found');
  return interview;
};

export const getMyInterviews = async (studentId) => {
  return Interview.find({ student: studentId })
    .populate('company', 'name logo')
    .populate({ path: 'application', populate: { path: 'job', select: 'title salary' } })
    .sort({ date: 1 });
};

export const listInterviews = async ({ page, limit, skip, status, company }) => {
  const filter = {};
  if (status) filter.status = status;
  if (company) filter.company = company;

  const [data, total] = await Promise.all([
    Interview.find(filter)
      .populate('student', 'fullName email studentId')
      .populate('company', 'name')
      .populate({ path: 'application', populate: { path: 'job', select: 'title' } })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit),
    Interview.countDocuments(filter),
  ]);
  return { data, total };
};

export const getInterview = async (id, userId, role) => {
  const interview = await Interview.findById(id)
    .populate('company')
    .populate('student', 'fullName email')
    .populate({ path: 'application', populate: { path: 'job' } });

  if (!interview) throw new ApiError(404, 'Interview not found');
  if (role === 'STUDENT' && interview.student._id.toString() !== userId.toString()) {
    throw new ApiError(403, 'Access denied');
  }
  return interview;
};
