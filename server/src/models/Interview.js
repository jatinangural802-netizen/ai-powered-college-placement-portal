import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    round: {
      type: String,
      enum: ['Aptitude', 'Technical', 'HR', 'Managerial', 'Final'],
      required: true,
    },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    mode: { type: String, enum: ['Online', 'Offline', 'Hybrid'], default: 'Online' },
    meetingLink: { type: String },
    location: { type: String },
    interviewer: { type: String },
    notes: { type: String },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'], default: 'Scheduled' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

interviewSchema.index({ student: 1 });
interviewSchema.index({ application: 1 });
interviewSchema.index({ date: 1 });

export const Interview = mongoose.model('Interview', interviewSchema);
