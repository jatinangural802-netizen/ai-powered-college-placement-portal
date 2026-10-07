import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema(
  {
    resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    score: { type: Number, required: true, min: 0, max: 100 },
    sectionScores: {
      contactInformation: { type: Number, default: 0 },
      summary: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      skills: { type: Number, default: 0 },
      projects: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      certifications: { type: Number, default: 0 },
      links: { type: Number, default: 0 },
      formatting: { type: Number, default: 0 },
    },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    missingSections: [{ type: String }],
    suggestions: [{ type: String }],
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    jobMatchScore: { type: Number },
    aiEnhanced: { type: Boolean, default: false },
    aiSuggestions: {
      summary: String,
      strengths: [String],
      weaknesses: [String],
      missingSkills: [String],
      suggestions: [String],
      bulletImprovements: [String],
      jobMatchExplanation: String,
    },
    analyzedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

resumeAnalysisSchema.index({ resume: 1, analyzedAt: -1 });
resumeAnalysisSchema.index({ student: 1 });

export const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
