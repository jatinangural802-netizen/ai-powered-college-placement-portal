import { Job } from '../models/Job.js';
import { Company } from '../models/Company.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/helpers.js';
import { normalizeSkills, matchSkills } from '../utils/skillNormalizer.js';

export const checkEligibility = (job, user, profile) => {
  const reasons = [];
  const cgpa = profile?.cgpa ?? 0;

  if (job.minimumCGPA && cgpa < job.minimumCGPA) {
    reasons.push({ field: 'CGPA', required: job.minimumCGPA, actual: cgpa });
  }
  if (job.eligibleDepartments?.length && !job.eligibleDepartments.includes(user.department)) {
    reasons.push({ field: 'Department', required: job.eligibleDepartments.join(', '), actual: user.department });
  }
  if (job.graduationYears?.length && !job.graduationYears.includes(user.graduationYear)) {
    reasons.push({ field: 'Graduation Year', required: job.graduationYears.join(', '), actual: user.graduationYear });
  }
  if (new Date(job.deadline) < new Date()) {
    reasons.push({ field: 'Deadline', required: 'Open', actual: 'Deadline passed' });
  }
  if (job.status !== 'Open') {
    reasons.push({ field: 'Status', required: 'Open', actual: job.status });
  }

  return { eligible: reasons.length === 0, reasons };
};

export const listJobs = async ({ page, limit, skip, search, company, location, department, employmentType, skill, sort }) => {
  const filter = { status: 'Open', deadline: { $gte: new Date() } };
  if (search) filter.$text = { $search: search };
  if (company) filter.company = company;
  if (location) filter.location = { $regex: location, $options: 'i' };
  if (department) filter.eligibleDepartments = department;
  if (employmentType) filter.employmentType = employmentType;
  if (skill) filter.requiredSkills = { $regex: skill, $options: 'i' };

  let sortOption = { createdAt: -1 };
  if (sort === 'deadline') sortOption = { deadline: 1 };
  if (sort === 'salary') sortOption = { salary: -1 };
  if (sort === 'company') sortOption = { company: 1 };

  const activeCompanies = await Company.find({ status: 'Active' }).select('_id');
  if (!company) {
    filter.company = { $in: activeCompanies.map((c) => c._id) };
  }

  const [data, total] = await Promise.all([
    Job.find(filter).populate('company', 'name logo location industry status package').sort(sortOption).skip(skip).limit(limit),
    Job.countDocuments(filter),
  ]);

  const filtered = data.filter((j) => j.company?.status === 'Active');
  return { data: filtered, total };
};

export const getJob = async (id, userId = null) => {
  const job = await Job.findById(id).populate('company').populate('placementDrive');
  if (!job) throw new ApiError(404, 'Job not found');

  let eligibility = null;
  let matchInfo = null;
  if (userId) {
    const user = await User.findById(userId);
    const profile = await StudentProfile.findOne({ user: userId });
    eligibility = checkEligibility(job, user, profile);
    if (profile) {
      matchInfo = matchSkills(profile.skills, job.requiredSkills, job.preferredSkills);
    }
  }

  return { job, eligibility, matchInfo };
};

export const createJob = async (data, userId) => {
  const company = await Company.findById(data.company);
  if (!company) throw new ApiError(404, 'Company not found');
  if (company.status === 'Inactive') throw new ApiError(400, 'Cannot create job for inactive company');

  return Job.create({
    ...data,
    requiredSkills: normalizeSkills(data.requiredSkills || []),
    preferredSkills: normalizeSkills(data.preferredSkills || []),
    createdBy: userId,
  });
};

export const updateJob = async (id, data) => {
  if (data.requiredSkills) data.requiredSkills = normalizeSkills(data.requiredSkills);
  if (data.preferredSkills) data.preferredSkills = normalizeSkills(data.preferredSkills);

  const job = await Job.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('company');
  if (!job) throw new ApiError(404, 'Job not found');
  return job;
};

export const deleteJob = async (id) => {
  const job = await Job.findByIdAndUpdate(id, { status: 'Closed' }, { new: true });
  if (!job) throw new ApiError(404, 'Job not found');
  return job;
};

export const adminListJobs = async ({ page, limit, skip, search, status, company }) => {
  const filter = {};
  if (search) filter.title = { $regex: search, $options: 'i' };
  if (status) filter.status = status;
  if (company) filter.company = company;

  const [data, total] = await Promise.all([
    Job.find(filter).populate('company', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Job.countDocuments(filter),
  ]);
  return { data, total };
};

export const getRecommendedJobs = async (userId, limit = 10) => {
  const user = await User.findById(userId);
  const profile = await StudentProfile.findOne({ user: userId });
  const jobs = await Job.find({ status: 'Open', deadline: { $gte: new Date() } })
    .populate({ path: 'company', match: { status: 'Active' } });

  return jobs
    .filter((j) => j.company)
    .map((job) => {
      const { eligible } = checkEligibility(job, user, profile);
      const skillMatch = matchSkills(profile?.skills || [], job.requiredSkills, job.preferredSkills);
      let score = skillMatch.matchScore * 0.6;
      if (eligible) score += 20;
      score += (profile?.profileCompletion || 0) * 0.1;
      if (skillMatch.preferredMatched.length) score += 10;
      return { ...job.toObject(), matchScore: Math.min(100, Math.round(score)), skillMatch };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
};
