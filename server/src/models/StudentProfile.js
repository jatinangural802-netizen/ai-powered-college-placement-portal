import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    institution: String,
    degree: String,
    field: String,
    startYear: Number,
    endYear: Number,
    cgpa: Number,
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    technologies: [String],
    link: String,
  },
  { _id: false }
);

const internshipSchema = new mongoose.Schema(
  {
    company: String,
    role: String,
    duration: String,
    description: String,
  },
  { _id: false }
);

const studentProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    phone: { type: String, trim: true },
    course: { type: String, trim: true, default: 'B.Tech' },
    cgpa: { type: Number, min: 0, max: 10 },
    skills: [{ type: String, trim: true }],
    certifications: [{ type: String, trim: true }],
    projects: [projectSchema],
    internships: [internshipSchema],
    education: [educationSchema],
    githubUrl: { type: String, trim: true },
    linkedinUrl: { type: String, trim: true },
    portfolioUrl: { type: String, trim: true },
    profileImage: { type: String },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    profileCompletion: { type: Number, default: 0 },
    missingFields: [{ type: String }],
  },
  { timestamps: true }
);

studentProfileSchema.index({ skills: 1 });

export const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);

export const PROFILE_FIELDS = [
  'fullName', 'email', 'phone', 'studentId', 'department', 'course',
  'graduationYear', 'cgpa', 'skills', 'certifications', 'projects',
  'internships', 'education', 'githubUrl', 'linkedinUrl', 'portfolioUrl', 'resume',
];

export const calculateProfileCompletion = (user, profile) => {
  const missing = [];
  let filled = 0;
  const total = PROFILE_FIELDS.length;

  const checks = {
    fullName: user?.fullName,
    email: user?.email,
    phone: profile?.phone,
    studentId: user?.studentId,
    department: user?.department,
    course: profile?.course,
    graduationYear: user?.graduationYear,
    cgpa: profile?.cgpa != null ? profile.cgpa : null,
    skills: profile?.skills?.length > 0,
    certifications: profile?.certifications?.length > 0,
    projects: profile?.projects?.length > 0,
    internships: profile?.internships?.length > 0,
    education: profile?.education?.length > 0,
    githubUrl: profile?.githubUrl,
    linkedinUrl: profile?.linkedinUrl,
    portfolioUrl: profile?.portfolioUrl,
    resume: profile?.resume,
  };

  PROFILE_FIELDS.forEach((field) => {
    const val = checks[field];
    const isFilled = val === true || (val != null && val !== '' && val !== false);
    if (isFilled) filled += 1;
    else missing.push(field);
  });

  return {
    profileCompletion: Math.round((filled / total) * 100),
    missingFields: missing,
  };
};
