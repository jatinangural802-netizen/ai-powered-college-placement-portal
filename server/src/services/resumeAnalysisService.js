import { Resume } from '../models/Resume.js';
import { ResumeAnalysis } from '../models/ResumeAnalysis.js';
import { Job } from '../models/Job.js';
import { ApiError } from '../utils/helpers.js';
import { calculateAtsScore, analyzeJobMatch } from './atsAnalyzer.js';
import { getAiEnhancements, isAiAvailable } from './aiService.js';
import { normalizeSkills } from '../utils/skillNormalizer.js';

export const analyzeResume = async (studentId, resumeId, jobId = null) => {
  const resume = await Resume.findOne({ _id: resumeId, student: studentId });
  if (!resume) throw new ApiError(404, 'Resume not found');

  const analysis = calculateAtsScore(resume.extractedData, resume.extractedText);
  let job = null;
  let jobMatch = null;

  if (jobId) {
    job = await Job.findById(jobId).populate('company');
    if (!job) throw new ApiError(404, 'Job not found');
    const skills = normalizeSkills([
      ...(resume.extractedData?.skills || []),
    ]);
    jobMatch = analyzeJobMatch(skills, job);
    analysis.jobMatchScore = jobMatch.jobMatchScore;
    analysis.matchedSkills = jobMatch.matchedSkills;
    analysis.missingSkills = jobMatch.missingSkills;
    analysis.suggestions = [...analysis.suggestions, ...jobMatch.suggestions].slice(0, 12);
  }

  const aiResult = await getAiEnhancements({
    resumeText: resume.extractedText,
    skills: resume.extractedData?.skills,
    jobTitle: job?.title,
    requiredSkills: job?.requiredSkills,
    preferredSkills: job?.preferredSkills,
  });

  const record = await ResumeAnalysis.create({
    resume: resumeId,
    student: studentId,
    job: jobId || undefined,
    score: analysis.score,
    sectionScores: analysis.sectionScores,
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
    missingSections: analysis.missingSections,
    suggestions: analysis.suggestions,
    matchedSkills: analysis.matchedSkills,
    missingSkills: analysis.missingSkills,
    jobMatchScore: jobMatch?.jobMatchScore,
    aiEnhanced: aiResult.available,
    aiSuggestions: aiResult.data,
  });

  resume.latestScore = analysis.score;
  await resume.save();

  return {
    analysis: record,
    jobMatch,
    ai: {
      available: aiResult.available,
      message: aiResult.message,
      isConfigured: isAiAvailable(),
      suggestions: aiResult.data,
    },
    extractedData: resume.extractedData,
    partialExtraction: resume.extractedData?.partialExtraction,
  };
};

export const getAnalysisHistory = async (studentId, resumeId) => {
  const resume = await Resume.findOne({ _id: resumeId, student: studentId });
  if (!resume) throw new ApiError(404, 'Resume not found');

  return ResumeAnalysis.find({ resume: resumeId, student: studentId })
    .populate('job', 'title')
    .sort({ analyzedAt: -1 });
};

export const getStudentAnalysisHistory = async (studentId) => {
  const analyses = await ResumeAnalysis.find({ student: studentId })
    .populate('resume', 'originalFilename uploadedAt')
    .populate('job', 'title')
    .sort({ analyzedAt: -1 });

  const scoreTimeline = analyses.map((a, i) => ({
    version: analyses.length - i,
    score: a.score,
    date: a.analyzedAt,
    resumeId: a.resume?._id,
    jobTitle: a.job?.title,
  }));

  return { analyses, scoreTimeline };
};

export const getAnalysisById = async (id, studentId) => {
  const analysis = await ResumeAnalysis.findOne({ _id: id, student: studentId })
    .populate('job')
    .populate('resume');
  if (!analysis) throw new ApiError(404, 'Analysis not found');
  return analysis;
};

export const jobMatchAnalysis = async (studentId, resumeId, jobId) => {
  return analyzeResume(studentId, resumeId, jobId);
};
