import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    studentId: z.string().min(1, 'Student ID is required'),
    department: z.string().min(1, 'Department is required'),
    graduationYear: z.coerce.number().int().min(2020).max(2035),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const profileUpdateSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    phone: z.string().optional(),
    course: z.string().optional(),
    cgpa: z.coerce.number().min(0).max(10).optional(),
    skills: z.array(z.string()).optional(),
    certifications: z.array(z.string()).optional(),
    projects: z.array(z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      technologies: z.array(z.string()).optional(),
      link: z.string().optional(),
    })).optional(),
    internships: z.array(z.object({
      company: z.string().optional(),
      role: z.string().optional(),
      duration: z.string().optional(),
      description: z.string().optional(),
    })).optional(),
    education: z.array(z.object({
      institution: z.string().optional(),
      degree: z.string().optional(),
      field: z.string().optional(),
      startYear: z.coerce.number().optional(),
      endYear: z.coerce.number().optional(),
      cgpa: z.coerce.number().optional(),
    })).optional(),
    githubUrl: z.string().url().optional().or(z.literal('')),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    portfolioUrl: z.string().url().optional().or(z.literal('')),
    department: z.string().optional(),
    graduationYear: z.coerce.number().optional(),
  }),
});

export const companySchema = z.object({
  body: z.object({
    name: z.string().min(1),
    logo: z.string().optional(),
    website: z.string().optional(),
    industry: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    companyType: z.enum(['Product', 'Service', 'Startup', 'MNC', 'Other']).optional(),
    minimumCGPA: z.coerce.number().min(0).max(10).optional(),
    eligibleDepartments: z.array(z.string()).optional(),
    package: z.string().optional(),
    jobRoles: z.array(z.string()).optional(),
    status: z.enum(['Active', 'Inactive']).optional(),
  }),
});

export const jobSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    company: z.string().min(1),
    placementDrive: z.string().optional(),
    description: z.string().min(1),
    responsibilities: z.array(z.string()).optional(),
    requiredSkills: z.array(z.string()).optional(),
    preferredSkills: z.array(z.string()).optional(),
    minimumCGPA: z.coerce.number().min(0).max(10).optional(),
    eligibleDepartments: z.array(z.string()).optional(),
    graduationYears: z.array(z.coerce.number()).optional(),
    salary: z.string().optional(),
    location: z.string().optional(),
    employmentType: z.enum(['Full Time', 'Internship', 'Internship + Full Time']).optional(),
    deadline: z.string().or(z.date()),
    openings: z.coerce.number().min(0).optional(),
    status: z.enum(['Open', 'Closed', 'Draft']).optional(),
  }),
});

export const applicationSchema = z.object({
  body: z.object({
    jobId: z.string().min(1),
  }),
});

export const applicationStatusSchema = z.object({
  body: z.object({
    status: z.enum(['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'Withdrawn']),
    notes: z.string().optional(),
  }),
});

export const interviewSchema = z.object({
  body: z.object({
    application: z.string().min(1),
    round: z.enum(['Aptitude', 'Technical', 'HR', 'Managerial', 'Final']),
    date: z.string().or(z.date()),
    startTime: z.string().min(1),
    endTime: z.string().min(1),
    mode: z.enum(['Online', 'Offline', 'Hybrid']).optional(),
    meetingLink: z.string().optional(),
    location: z.string().optional(),
    interviewer: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const announcementSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    priority: z.enum(['Normal', 'Important', 'Urgent']).optional(),
    expiresAt: z.string().optional(),
  }),
});

export const resultSchema = z.object({
  body: z.object({
    student: z.string().min(1),
    application: z.string().optional(),
    company: z.string().min(1),
    job: z.string().optional(),
    role: z.string().optional(),
    status: z.enum(['Selected', 'Rejected', 'Waitlisted', 'Pending']),
    package: z.string().optional(),
    joiningDate: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const analyzeSchema = z.object({
  body: z.object({
    resumeId: z.string().min(1),
    jobId: z.string().optional(),
  }),
});

export const passwordChangeSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6),
  }),
});

export const driveSchema = z.object({
  body: z.object({
    company: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional(),
    driveDate: z.string().or(z.date()),
    applicationDeadline: z.string().or(z.date()),
    location: z.string().optional(),
    mode: z.enum(['On-Campus', 'Off-Campus', 'Hybrid', 'Virtual']).optional(),
    eligibility: z.object({
      minimumCGPA: z.coerce.number().optional(),
      eligibleDepartments: z.array(z.string()).optional(),
      graduationYears: z.array(z.coerce.number()).optional(),
    }).optional(),
    status: z.enum(['upcoming', 'open', 'closed', 'completed']).optional(),
    jobs: z.array(z.string()).optional(),
  }),
});
