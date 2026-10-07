import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    role: { type: String, trim: true },
    status: { type: String, enum: ['Selected', 'Rejected', 'Waitlisted', 'Pending'], default: 'Pending' },
    package: { type: String },
    joiningDate: { type: Date },
    notes: { type: String },
    publishedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

resultSchema.index({ student: 1 });
resultSchema.index({ company: 1 });
resultSchema.index({ status: 1 });

export const Result = mongoose.model('Result', resultSchema);
