import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const studentService = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
  getDashboard: () => api.get('/students/dashboard'),
  listStudents: (params) => api.get('/students', { params }),
  getStudent: (id) => api.get(`/students/${id}`),
};

export const companyService = {
  list: (params) => api.get('/companies', { params }),
  get: (id) => api.get(`/companies/${id}`),
  create: (data) => api.post('/companies', data),
  update: (id, data) => api.put(`/companies/${id}`, data),
  remove: (id) => api.delete(`/companies/${id}`),
};

export const jobService = {
  list: (params) => api.get('/jobs', { params }),
  get: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  remove: (id) => api.delete(`/jobs/${id}`),
  recommended: () => api.get('/jobs/recommended'),
};

export const applicationService = {
  apply: (jobId) => api.post('/applications', { jobId }),
  getMy: () => api.get('/applications/my'),
  get: (id) => api.get(`/applications/${id}`),
  list: (params) => api.get('/applications', { params }),
  updateStatus: (id, data) => api.patch(`/applications/${id}/status`, data),
  withdraw: (id) => api.patch(`/applications/${id}/withdraw`),
};

export const interviewService = {
  getMy: () => api.get('/interviews/my'),
  list: (params) => api.get('/interviews', { params }),
  schedule: (data) => api.post('/interviews', data),
  update: (id, data) => api.put(`/interviews/${id}`, data),
};

export const resumeService = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/resumes/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  getMy: () => api.get('/resumes/my'),
  get: (id) => api.get(`/resumes/${id}`),
};

export const resumeAnalysisService = {
  analyze: (resumeId, jobId) => api.post('/resume-analysis/analyze', { resumeId, jobId }),
  jobMatch: (resumeId, jobId) => api.post('/resume-analysis/job-match', { resumeId, jobId }),
  history: (resumeId) => api.get(resumeId ? `/resume-analysis/history/${resumeId}` : '/resume-analysis/history'),
  get: (id) => api.get(`/resume-analysis/${id}`),
  aiStatus: () => api.get('/resume-analysis/ai-status'),
};

export const announcementService = {
  list: (params) => api.get('/announcements', { params }),
  create: (data) => api.post('/announcements', data),
  update: (id, data) => api.put(`/announcements/${id}`, data),
  remove: (id) => api.delete(`/announcements/${id}`),
};

export const resultService = {
  getMy: () => api.get('/results/my'),
  list: (params) => api.get('/results', { params }),
  create: (data) => api.post('/results', data),
  update: (id, data) => api.put(`/results/${id}`, data),
};

export const driveService = {
  list: (params) => api.get('/placement-drives', { params }),
  get: (id) => api.get(`/placement-drives/${id}`),
  create: (data) => api.post('/placement-drives', data),
  update: (id, data) => api.put(`/placement-drives/${id}`, data),
  remove: (id) => api.delete(`/placement-drives/${id}`),
};

export const analyticsService = {
  student: () => api.get('/analytics/student'),
  admin: () => api.get('/analytics/admin'),
};

export const notificationService = {
  getMy: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};
