import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { StudentProfile, calculateProfileCompletion } from '../models/StudentProfile.js';
import { ApiError } from '../utils/helpers.js';
import { signToken } from '../utils/jwt.js';

const sanitizeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  studentId: user.studentId,
  department: user.department,
  graduationYear: user.graduationYear,
});

export const register = async ({ fullName, email, password, studentId, department, graduationYear }) => {
  const existing = await User.findOne({ $or: [{ email }, { studentId }] });
  if (existing) throw new ApiError(409, 'Email or student ID already registered');

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({
    fullName,
    email,
    password: hashed,
    role: 'STUDENT',
    studentId,
    department,
    graduationYear,
  });

  await StudentProfile.create({ user: user._id, skills: [] });

  const token = signToken({ id: user._id, role: user.role });
  return { user: sanitizeUser(user), token };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.isActive) throw new ApiError(401, 'Invalid credentials');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new ApiError(401, 'Invalid credentials');

  const token = signToken({ id: user._id, role: user.role });
  return { user: sanitizeUser(user), token };
};

export const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  let profile = null;
  if (user.role === 'STUDENT') {
    profile = await StudentProfile.findOne({ user: userId }).populate('resume');
    if (profile) {
      const completion = calculateProfileCompletion(user, profile);
      profile.profileCompletion = completion.profileCompletion;
      profile.missingFields = completion.missingFields;
    }
  }

  return { user: sanitizeUser(user), profile };
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new ApiError(400, 'Current password is incorrect');

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
};

export const createAdminIfNotExists = async ({ email, password, fullName }) => {
  const existing = await User.findOne({ email, role: 'ADMIN' });
  if (existing) return existing;

  const hashed = await bcrypt.hash(password, 12);
  return User.create({ fullName, email, password: hashed, role: 'ADMIN' });
};
