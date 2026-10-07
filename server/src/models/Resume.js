import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalFilename: { type: String, required: true },
    storedFilename: { type: String, required: true },
    filePath: { type: String, required: true },
    fileUrl: { type: String, required: true },
    mimeType: { type: String, default: 'application/pdf' },
    fileSize: { type: Number },
    uploadedAt: { type: Date, default: Date.now },
    extractedText: { type: String },
    extractedData: {
      name: String,
      email: String,
      phone: String,
      education: [String],
      skills: [String],
      projects: [String],
      experience: [String],
      certifications: [String],
      links: [String],
    },
    isActive: { type: Boolean, default: true },
    latestScore: { type: Number },
  },
  { timestamps: true }
);

resumeSchema.index({ student: 1 });
resumeSchema.index({ uploadedAt: -1 });

export const Resume = mongoose.model('Resume', resumeSchema);
