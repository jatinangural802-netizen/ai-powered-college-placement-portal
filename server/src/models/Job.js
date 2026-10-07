import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    placementDrive: { type: mongoose.Schema.Types.ObjectId, ref: 'PlacementDrive' },
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    requiredSkills: [{ type: String, trim: true }],
    preferredSkills: [{ type: String, trim: true }],
    minimumCGPA: { type: Number, min: 0, max: 10, default: 0 },
    eligibleDepartments: [{ type: String, trim: true }],
    graduationYears: [{ type: Number }],
    salary: { type: String, trim: true },
    location: { type: String, trim: true },
    employmentType: {
      type: String,
      enum: ['Full Time', 'Internship', 'Internship + Full Time'],
      default: 'Full Time',
    },
    deadline: { type: Date, required: true },
    openings: { type: Number, default: 1, min: 0 },
    status: { type: String, enum: ['Open', 'Closed', 'Draft'], default: 'Open' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

jobSchema.index({ company: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ deadline: 1 });
jobSchema.index({ title: 'text', description: 'text' });

export const Job = mongoose.model('Job', jobSchema);
