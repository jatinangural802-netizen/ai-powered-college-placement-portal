export const STATUS_COLORS = {
  Applied: 'bg-blue-100 text-blue-800',
  'Under Review': 'bg-yellow-100 text-yellow-800',
  Shortlisted: 'bg-purple-100 text-purple-800',
  'Interview Scheduled': 'bg-indigo-100 text-indigo-800',
  Selected: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  Withdrawn: 'bg-slate-100 text-slate-800',
  Open: 'bg-green-100 text-green-800',
  Closed: 'bg-red-100 text-red-800',
  Active: 'bg-green-100 text-green-800',
  Inactive: 'bg-slate-100 text-slate-800',
  Normal: 'bg-slate-100 text-slate-700',
  Important: 'bg-amber-100 text-amber-800',
  Urgent: 'bg-red-100 text-red-800',
};

export const APPLICATION_STEPS = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected'];

export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatDateTime = (date, time) => {
  const d = formatDate(date);
  return time ? `${d} at ${time}` : d;
};

export const FIELD_LABELS = {
  fullName: 'Full Name', email: 'Email', phone: 'Phone', studentId: 'Student ID',
  department: 'Department', course: 'Course', graduationYear: 'Graduation Year',
  cgpa: 'CGPA', skills: 'Skills', certifications: 'Certifications', projects: 'Projects',
  internships: 'Internships', education: 'Education', githubUrl: 'GitHub URL',
  linkedinUrl: 'LinkedIn URL', portfolioUrl: 'Portfolio URL', resume: 'Resume',
};

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-600';
};

export const getScoreBg = (score) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-red-500';
};
