import { User } from '../models/User.js';
import { StudentProfile, calculateProfileCompletion } from '../models/StudentProfile.js';
import { Application } from '../models/Application.js';
import { Interview } from '../models/Interview.js';
import { ResumeAnalysis } from '../models/ResumeAnalysis.js';
import { Result } from '../models/Result.js';
import { Job } from '../models/Job.js';
import { Company } from '../models/Company.js';
import { Announcement } from '../models/Announcement.js';
import { ApiError } from '../utils/helpers.js';
import { normalizeSkills, matchSkills } from '../utils/skillNormalizer.js';

export const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  let profile = await StudentProfile.findOne({ user: userId }).populate('resume');
  if (!profile) {
    profile = await StudentProfile.create({ user: userId });
  }

  const completion = calculateProfileCompletion(user, profile);
  profile.profileCompletion = completion.profileCompletion;
  profile.missingFields = completion.missingFields;
  await profile.save();

  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      studentId: user.studentId,
      department: user.department,
      graduationYear: user.graduationYear,
      role: user.role,
    },
    profile,
  };
};

export const updateProfile = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  const { fullName, department, graduationYear, ...profileData } = data;
  if (fullName) user.fullName = fullName;
  if (department) user.department = department;
  if (graduationYear) user.graduationYear = graduationYear;
  await user.save();

  let profile = await StudentProfile.findOne({ user: userId });
  if (!profile) profile = await StudentProfile.create({ user: userId });

  Object.assign(profile, profileData);
  if (profileData.skills) profile.skills = normalizeSkills(profileData.skills);

  const completion = calculateProfileCompletion(user, profile);
  profile.profileCompletion = completion.profileCompletion;
  profile.missingFields = completion.missingFields;
  await profile.save();

  return getProfile(userId);
};

const calculateRecommendationScore = (job, profile, user) => {
  const studentSkills = [...(profile.skills || []), ...(profile.extractedSkills || [])];
  const skillMatch = matchSkills(studentSkills, job.requiredSkills, job.preferredSkills);
  const skillScore = skillMatch.matchScore * 0.6;

  let eligibilityScore = 0;
  const cgpa = profile.cgpa ?? 0;
  if (cgpa >= (job.minimumCGPA || 0)) eligibilityScore += 10;
  if (!job.eligibleDepartments?.length || job.eligibleDepartments.includes(user.department)) eligibilityScore += 5;
  if (!job.graduationYears?.length || job.graduationYears.includes(user.graduationYear)) eligibilityScore += 5;

  const profileScore = (profile.profileCompletion || 0) * 0.1;
  return Math.min(100, Math.round(skillScore + eligibilityScore + profileScore));
};

export const getDashboard = async (userId) => {
  const { user, profile } = await getProfile(userId);

  const applications = await Application.find({ student: userId })
    .populate('job', 'title salary location')
    .populate('company', 'name logo')
    .sort({ appliedAt: -1 });

  const stats = {
    totalApplications: applications.length,
    shortlisted: applications.filter((a) => ['Shortlisted', 'Interview Scheduled'].includes(a.status)).length,
    interviews: applications.filter((a) => a.status === 'Interview Scheduled').length,
    selected: applications.filter((a) => a.status === 'Selected').length,
    atsScore: profile?.resume?.latestScore || 0,
  };

  const upcomingInterviews = await Interview.find({
    student: userId,
    date: { $gte: new Date() },
    status: 'Scheduled',
  })
    .populate('company', 'name')
    .populate({ path: 'application', populate: { path: 'job', select: 'title' } })
    .sort({ date: 1 })
    .limit(5);

  const recentApplications = applications.slice(0, 5);

  const openJobs = await Job.find({ status: 'Open', deadline: { $gte: new Date() } })
    .populate({ path: 'company', match: { status: 'Active' }, select: 'name logo status' })
    .limit(20);

  const recommendedJobs = openJobs
    .filter((j) => j.company)
    .map((job) => ({
      ...job.toObject(),
      matchScore: calculateRecommendationScore(job, profile, user),
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);

  const latestAnalysis = await ResumeAnalysis.findOne({ student: userId }).sort({ analyzedAt: -1 });
  if (latestAnalysis) stats.atsScore = latestAnalysis.score;

  const selection = await Result.findOne({ student: userId, status: 'Selected' })
    .populate('company', 'name')
    .populate('job', 'title');

  const announcements = await Announcement.find({
    isActive: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gte: new Date() } }],
  })
    .sort({ priority: -1, createdAt: -1 })
    .limit(5);

  const statusDistribution = {};
  applications.forEach((a) => {
    statusDistribution[a.status] = (statusDistribution[a.status] || 0) + 1;
  });

  const applicationsOverTime = {};
  applications.forEach((a) => {
    const month = new Date(a.appliedAt).toLocaleString('default', { month: 'short', year: 'numeric' });
    applicationsOverTime[month] = (applicationsOverTime[month] || 0) + 1;
  });

  return {
    user,
    profile,
    stats,
    upcomingInterviews,
    recentApplications,
    recommendedJobs,
    selection,
    announcements,
    charts: {
      statusDistribution: Object.entries(statusDistribution).map(([name, value]) => ({ name, value })),
      applicationsOverTime: Object.entries(applicationsOverTime).map(([name, value]) => ({ name, value })),
      funnel: [
        { name: 'Applied', value: stats.totalApplications },
        { name: 'Shortlisted', value: stats.shortlisted },
        { name: 'Interviews', value: stats.interviews },
        { name: 'Selected', value: stats.selected },
      ],
      skillsMatched: latestAnalysis?.matchedSkills?.slice(0, 8).map((s) => ({ name: s, value: 1 })) || [],
    },
  };
};

export const listStudents = async ({ page, limit, skip, search, department, graduationYear }) => {
  const filter = { role: 'STUDENT' };
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } },
    ];
  }
  if (department) filter.department = department;
  if (graduationYear) filter.graduationYear = parseInt(graduationYear, 10);

  const [students, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  const profiles = await StudentProfile.find({ user: { $in: students.map((s) => s._id) } }).populate('resume');
  const profileMap = Object.fromEntries(profiles.map((p) => [p.user.toString(), p]));

  const data = students.map((s) => ({
    id: s._id,
    fullName: s.fullName,
    email: s.email,
    studentId: s.studentId,
    department: s.department,
    graduationYear: s.graduationYear,
    profile: profileMap[s._id.toString()] || null,
  }));

  return { data, total };
};

export const getStudentById = async (studentId) => {
  const user = await User.findOne({ _id: studentId, role: 'STUDENT' });
  if (!user) throw new ApiError(404, 'Student not found');

  const profile = await StudentProfile.findOne({ user: studentId }).populate('resume');
  const applications = await Application.find({ student: studentId })
    .populate('job', 'title')
    .populate('company', 'name');
  const results = await Result.find({ student: studentId }).populate('company', 'name');

  return { user, profile, applications, results };
};
