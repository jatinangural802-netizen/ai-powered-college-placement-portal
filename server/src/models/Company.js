import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String },
    website: { type: String, trim: true },
    industry: { type: String, trim: true },
    location: { type: String, trim: true },
    description: { type: String },
    companyType: { type: String, enum: ['Product', 'Service', 'Startup', 'MNC', 'Other'], default: 'Product' },
    minimumCGPA: { type: Number, min: 0, max: 10, default: 0 },
    eligibleDepartments: [{ type: String, trim: true }],
    package: { type: String, trim: true },
    jobRoles: [{ type: String, trim: true }],
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

companySchema.index({ name: 1 });
companySchema.index({ status: 1 });
companySchema.index({ industry: 1 });

export const Company = mongoose.model('Company', companySchema);
