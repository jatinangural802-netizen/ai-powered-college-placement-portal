import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { Company } from '../models/Company.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { User } from '../models/User.js';
import { Resume } from '../models/Resume.js';
import { ApiError } from '../utils/helpers.js';
import { checkEligibility } from './jobService.js';
import { createNotification } from './notificationService.js';

export const applyToJob = async (studentId, jobId) => {
  const user = await User.findById(studentId);
  const profile = await StudentProfile.findOne({ user: studentId }).populate('resume');
  const job = await Job.findById(jobId).populate('company');

  if (!job) throw new ApiError(404, 'Job not found');
  if (!profile?.resume) throw new ApiError(400, 'Please upload a resume before applying');

  const { eligible, reasons } = checkEligibility(job, user, profile);
  if (!eligible) {
    throw new ApiError(400, 'You are not eligible for this job', reasons);
  }

  if ((profile.profileCompletion || 0) < 50) {
    throw new ApiError(400, 'Please complete at least 50% of your profile before applying');
  }

  const existing = await Application.findOne({ student: studentId, job: jobId });
  if (existing) throw new ApiError(409, 'You have already applied to this job');

  const application = await Application.create({
    student: studentId,
    job: jobId,
    company: job.company._id,
    resume: profile.resume._id || profile.resume,
    statusHistory: [{ status: 'Applied', changedBy: studentId }],
  });

  await createNotification({
    user: studentId,
    title: 'Application Submitted',
    message: `Your application for ${job.title} at ${job.company.name} was submitted successfully.`,
    type: 'application',
    link: '/student/applications',
  });

  return application.populate(['job', 'company']);
};

export const getMyApplications = async (studentId) => {
  return Application.find({ student: studentId })
    .populate('job', 'title salary location employmentType deadline')
    .populate('company', 'name logo')
    .sort({ appliedAt: -1 });
};

export const getApplication = async (id, userId, role) => {
  const application = await Application.findById(id)
    .populate('job')
    .populate('company')
    .populate('student', 'fullName email studentId department graduationYear')
    .populate('resume');

  if (!application) throw new ApiError(404, 'Application not found');
  if (role === 'STUDENT' && application.student._id.toString() !== userId.toString()) {
    throw new ApiError(403, 'Access denied');
  }

  let profile = null;
  if (role === 'ADMIN') {
    profile = await StudentProfile.findOne({ user: application.student._id });
  }

  return { application, profile };
};

export const updateApplicationStatus = async (id, status, notes, adminId) => {
  const application = await Application.findById(id).populate('job').populate('company');
  if (!application) throw new ApiError(404, 'Application not found');

  application.status = status;
  if (notes) application.notes = notes;
  application.statusHistory.push({ status, changedBy: adminId });
  await application.save();

  const messages = {
    'Under Review': 'Your application is under review.',
    Shortlisted: `You have been shortlisted for ${application.job.title}!`,
    'Interview Scheduled': `Interview scheduled for ${application.job.title}.`,
    Selected: `Congratulations! You have been selected for ${application.job.title}!`,
    Rejected: `Your application for ${application.job.title} was not selected.`,
  };

  if (messages[status]) {
    await createNotification({
      user: application.student,
      title: 'Application Status Updated',
      message: messages[status],
      type: 'application',
      link: '/student/applications',
    });
  }

  return application;
};

export const listApplications = async ({ page, limit, skip, search, status, company, job }) => {
  const filter = {};
  if (status) filter.status = status;
  if (company) filter.company = company;
  if (job) filter.job = job;

  let studentIds = null;
  if (search) {
    const students = await User.find({
      role: 'STUDENT',
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    }).select('_id');
    studentIds = students.map((s) => s._id);
    filter.student = { $in: studentIds };
  }

  const [applications, total] = await Promise.all([
    Application.find(filter)
      .populate('student', 'fullName email studentId department graduationYear')
      .populate('job', 'title')
      .populate('company', 'name')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit),
    Application.countDocuments(filter),
  ]);

  const profiles = await StudentProfile.find({
    user: { $in: applications.map((a) => a.student._id) },
  }).select('user cgpa');
  const cgpaMap = Object.fromEntries(profiles.map((p) => [p.user.toString(), p.cgpa]));

  const data = applications.map((a) => ({
    ...a.toObject(),
    studentCgpa: cgpaMap[a.student._id.toString()],
  }));

  return { data, total };
};

export const withdrawApplication = async (id, studentId) => {
  const application = await Application.findOne({ _id: id, student: studentId });
  if (!application) throw new ApiError(404, 'Application not found');
  if (['Selected', 'Rejected'].includes(application.status)) {
    throw new ApiError(400, 'Cannot withdraw application in current status');
  }
  application.status = 'Withdrawn';
  application.statusHistory.push({ status: 'Withdrawn', changedBy: studentId });
  await application.save();
  return application;
};
