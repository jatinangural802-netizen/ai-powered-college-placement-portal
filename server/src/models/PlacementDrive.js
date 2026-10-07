import mongoose from 'mongoose';

const placementDriveSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    driveDate: { type: Date, required: true },
    applicationDeadline: { type: Date, required: true },
    location: { type: String, trim: true },
    mode: { type: String, enum: ['On-Campus', 'Off-Campus', 'Hybrid', 'Virtual'], default: 'On-Campus' },
    eligibility: {
      minimumCGPA: { type: Number, min: 0, max: 10 },
      eligibleDepartments: [{ type: String }],
      graduationYears: [{ type: Number }],
    },
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    status: { type: String, enum: ['upcoming', 'open', 'closed', 'completed'], default: 'upcoming' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

placementDriveSchema.index({ company: 1 });
placementDriveSchema.index({ status: 1 });
placementDriveSchema.index({ applicationDeadline: 1 });

export const PlacementDrive = mongoose.model('PlacementDrive', placementDriveSchema);
