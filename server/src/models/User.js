import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['STUDENT', 'ADMIN'], default: 'STUDENT' },
    studentId: { type: String, sparse: true, unique: true, trim: true },
    department: { type: String, trim: true },
    graduationYear: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });

export const User = mongoose.model('User', userSchema);
