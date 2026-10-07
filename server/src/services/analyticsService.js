import { User } from '../models/User.js';
import { Company } from '../models/Company.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { Interview } from '../models/Interview.js';
import { Result } from '../models/Result.js';
import { PlacementDrive } from '../models/PlacementDrive.js';
import { ResumeAnalysis } from '../models/ResumeAnalysis.js';
import { StudentProfile } from '../models/StudentProfile.js';

export const getStudentAnalytics = async (studentId) => {
  const applications = await Application.find({ student: studentId });
  const interviews = await Interview.find({ student: studentId });
  const results = await Result.find({ student: studentId });
  const analyses = await ResumeAnalysis.find({ student: studentId }).sort({ analyzedAt: -1 });

  const total = applications.length;
  const shortlisted = applications.filter((a) =>
    ['Shortlisted', 'Interview Scheduled', 'Selected'].includes(a.status)
  ).length;
  const selected = applications.filter((a) => a.status === 'Selected').length;
  const rejected = applications.filter((a) => a.status === 'Rejected').length;

  const statusBreakdown = {};
  applications.forEach((a) => {
    statusBreakdown[a.status] = (statusBreakdown[a.status] || 0) + 1;
  });

  const latestScore = analyses[0]?.score || 0;
  const scoreHistory = analyses.slice(0, 10).map((a) => ({
    date: a.analyzedAt,
    score: a.score,
  }));

  const topSkills = analyses[0]?.matchedSkills?.slice(0, 10) || [];

  return {
    summary: {
      totalApplications: total,
      shortlisted,
      interviews: interviews.length,
      selected,
      rejectionRate: total ? Math.round((rejected / total) * 100) : 0,
      resumeScore: latestScore,
    },
    statusBreakdown: Object.entries(statusBreakdown).map(([name, value]) => ({ name, value })),
    scoreHistory,
    topMatchingSkills: topSkills.map((s) => ({ name: s, value: 1 })),
    results: results.filter((r) => r.status === 'Selected'),
  };
};

export const getAdminAnalytics = async () => {
  const [
    totalStudents,
    totalCompanies,
    activeCompanies,
    openJobs,
    totalApplications,
    shortlisted,
    totalInterviews,
    selections,
    activeDrives,
    results,
  ] = await Promise.all([
    User.countDocuments({ role: 'STUDENT' }),
    Company.countDocuments(),
    Company.countDocuments({ status: 'Active' }),
    Job.countDocuments({ status: 'Open' }),
    Application.countDocuments(),
    Application.countDocuments({ status: { $in: ['Shortlisted', 'Interview Scheduled'] } }),
    Interview.countDocuments(),
    Application.countDocuments({ status: 'Selected' }),
    PlacementDrive.countDocuments({ status: 'open' }),
    Result.find({ status: 'Selected' }).populate('company', 'name'),
  ]);

  const applicationsByStatus = await Application.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const deptPlacements = await Result.aggregate([
    { $match: { status: 'Selected' } },
    { $lookup: { from: 'users', localField: 'student', foreignField: '_id', as: 'student' } },
    { $unwind: '$student' },
    { $group: { _id: '$student.department', count: { $sum: 1 } } },
  ]);

  const companyParticipation = await Application.aggregate([
    { $group: { _id: '$company', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $lookup: { from: 'companies', localField: '_id', foreignField: '_id', as: 'company' } },
    { $unwind: '$company' },
    { $project: { name: '$company.name', count: 1 } },
  ]);

  const packages = results.map((r) => {
    const match = r.package?.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }).filter(Boolean);

  const placementTrend = await Application.aggregate([
    { $match: { status: 'Selected' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$updatedAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    summary: {
      totalStudents,
      totalCompanies,
      activeCompanies,
      openJobs,
      totalApplications,
      shortlisted,
      totalInterviews,
      selections,
      activeDrives,
      averagePackage: packages.length ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1) : 0,
      highestPackage: packages.length ? Math.max(...packages).toFixed(1) : 0,
    },
    applicationsByStatus: applicationsByStatus.map((s) => ({ name: s._id, value: s.count })),
    selectionsByDepartment: deptPlacements.map((d) => ({ name: d._id || 'Unknown', value: d.count })),
    companyParticipation,
    placementTrend: placementTrend.map((t) => ({ name: t._id, value: t.count })),
  };
};
