import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
    appliedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'Withdrawn'],
      default: 'Applied',
    },
    notes: { type: String },
    statusHistory: [{
      status: String,
      changedAt: { type: Date, default: Date.now },
      changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }],
  },
  { timestamps: true }
);

applicationSchema.index({ student: 1, job: 1 }, { unique: true });
applicationSchema.index({ student: 1 });
applicationSchema.index({ job: 1 });
applicationSchema.index({ company: 1 });
applicationSchema.index({ status: 1 });

export const Application = mongoose.model('Application', applicationSchema);
