import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { Company } from '../models/Company.js';
import { Job } from '../models/Job.js';
import { PlacementDrive } from '../models/PlacementDrive.js';
import { Application } from '../models/Application.js';
import { Interview } from '../models/Interview.js';
import { Announcement } from '../models/Announcement.js';
import { Result } from '../models/Result.js';
import { Resume } from '../models/Resume.js';
import { ResumeAnalysis } from '../models/ResumeAnalysis.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const departments = ['CSE', 'IT', 'ECE', 'ME', 'CE'];
const skillsPool = ['Java', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'SQL', 'Git', 'DSA', 'Python', 'C++', 'REST API', 'TypeScript', 'AWS', 'Docker'];

const sampleResumeText = `
John Doe
john.doe@example.com | +91 9876543210
github.com/johndoe | linkedin.com/in/johndoe

SUMMARY
Motivated B.Tech Computer Science student with strong foundation in full-stack development.

EDUCATION
B.Tech Computer Science, ABC University, CGPA: 8.2, 2022-2026

SKILLS
Java, JavaScript, React, Node.js, Express, MongoDB, SQL, Git, DSA, Python, REST API

PROJECTS
E-Commerce Platform - Built full-stack app using React and Node.js, increased user engagement by 30%
Placement Portal - Developed college placement management system with MongoDB

EXPERIENCE
Software Intern at TechNova - Developed REST APIs and fixed 15+ bugs over 3 months

CERTIFICATIONS
AWS Cloud Practitioner, MongoDB Developer
`;

export const runSeed = async ({ disconnect = true } = {}) => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careerbridge';
  const connected = mongoose.connection.readyState === 1;

  if (!connected) {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  }

  await Promise.all([
    User.deleteMany({}),
    StudentProfile.deleteMany({}),
    Company.deleteMany({}),
    Job.deleteMany({}),
    PlacementDrive.deleteMany({}),
    Application.deleteMany({}),
    Interview.deleteMany({}),
    Announcement.deleteMany({}),
    Result.deleteMany({}),
    Resume.deleteMany({}),
    ResumeAnalysis.deleteMany({}),
  ]);

  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 12);
  const admin = await User.create({
    fullName: process.env.ADMIN_NAME || 'Placement Admin',
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: adminPassword,
    role: 'ADMIN',
  });

  const studentPassword = await bcrypt.hash('Student@123', 12);
  const students = [];
  for (let i = 1; i <= 10; i++) {
    const student = await User.create({
      fullName: i === 1 ? 'Demo Student' : `Student ${i}`,
      email: i === 1 ? 'student@example.com' : `student${i}@example.com`,
      password: studentPassword,
      role: 'STUDENT',
      studentId: `CS2026${String(i).padStart(3, '0')}`,
      department: departments[i % departments.length],
      graduationYear: 2026,
    });
    students.push(student);

    await StudentProfile.create({
      user: student._id,
      phone: `98765432${String(i).padStart(2, '0')}`,
      course: 'B.Tech',
      cgpa: 6.5 + (i % 4) * 0.5,
      skills: skillsPool.slice(0, 5 + (i % 6)),
      certifications: i % 2 === 0 ? ['AWS Cloud Practitioner'] : [],
      projects: [{
        title: 'College Project',
        description: 'Built a web application using MERN stack',
        technologies: ['React', 'Node.js', 'MongoDB'],
      }],
      internships: i % 3 === 0 ? [{
        company: 'TechNova',
        role: 'Software Intern',
        duration: '3 months',
        description: 'Worked on REST API development',
      }] : [],
      education: [{
        institution: 'ABC Engineering College',
        degree: 'B.Tech',
        field: student.department,
        endYear: 2026,
        cgpa: 6.5 + (i % 4) * 0.5,
      }],
      githubUrl: 'https://github.com/example',
      linkedinUrl: 'https://linkedin.com/in/example',
      profileCompletion: 70 + (i % 3) * 10,
    });
  }

  const companyData = [
    { name: 'TechNova', industry: 'Technology', location: 'Bangalore', package: '8-12 LPA', description: 'Leading software product company specializing in enterprise solutions.' },
    { name: 'CloudSphere', industry: 'Cloud Computing', location: 'Hyderabad', package: '10-15 LPA', description: 'Cloud infrastructure and DevOps solutions provider.' },
    { name: 'DataBridge', industry: 'Data Analytics', location: 'Pune', package: '7-10 LPA', description: 'Data analytics and business intelligence company.' },
    { name: 'FinEdge', industry: 'FinTech', location: 'Mumbai', package: '12-18 LPA', description: 'Financial technology and digital banking solutions.' },
    { name: 'CodeCraft', industry: 'Software Services', location: 'Chennai', package: '6-9 LPA', description: 'Custom software development and consulting firm.' },
  ];

  const companies = [];
  for (const c of companyData) {
    companies.push(await Company.create({
      ...c,
      website: `https://${c.name.toLowerCase()}.demo`,
      companyType: 'Product',
      minimumCGPA: 6.5,
      eligibleDepartments: ['CSE', 'IT', 'ECE'],
      jobRoles: ['Software Developer', 'Full Stack Developer'],
      status: 'Active',
      createdBy: admin._id,
    }));
  }

  const jobs = [];
  const jobTitles = [
    'Software Developer', 'Frontend Developer', 'Backend Developer',
    'Data Analyst', 'QA Engineer', 'Full Stack Developer',
    'DevOps Engineer', 'Mobile Developer',
  ];

  for (let i = 0; i < 8; i++) {
    const company = companies[i % companies.length];
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30 + i * 5);
    jobs.push(await Job.create({
      title: jobTitles[i],
      company: company._id,
      description: `${jobTitles[i]} role at ${company.name}. Join our engineering team to build scalable solutions.`,
      responsibilities: ['Write clean code', 'Collaborate with team', 'Participate in code reviews'],
      requiredSkills: skillsPool.slice(0, 4 + (i % 3)),
      preferredSkills: skillsPool.slice(4, 6 + (i % 2)),
      minimumCGPA: 6.5 + (i % 2) * 0.5,
      eligibleDepartments: ['CSE', 'IT', 'ECE'],
      graduationYears: [2026],
      salary: company.package,
      location: company.location,
      employmentType: i % 3 === 0 ? 'Internship' : 'Full Time',
      deadline,
      openings: 5 + i,
      status: 'Open',
      createdBy: admin._id,
    }));
  }

  const drives = [];
  for (let i = 0; i < 3; i++) {
    const driveDate = new Date();
    driveDate.setDate(driveDate.getDate() + 15 + i * 10);
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 10 + i * 5);
    drives.push(await PlacementDrive.create({
      company: companies[i]._id,
      title: `${companies[i].name} Campus Drive 2026`,
      description: `On-campus placement drive for ${companies[i].name}`,
      driveDate,
      applicationDeadline: deadline,
      location: companies[i].location,
      mode: i === 2 ? 'Virtual' : 'On-Campus',
      eligibility: { minimumCGPA: 6.5, eligibleDepartments: ['CSE', 'IT'], graduationYears: [2026] },
      jobs: [jobs[i]._id, jobs[i + 3]?._id].filter(Boolean),
      status: i === 0 ? 'open' : i === 1 ? 'upcoming' : 'closed',
      createdBy: admin._id,
    }));
  }

  const resumes = [];
  for (let i = 0; i < 5; i++) {
    resumes.push(await Resume.create({
      student: students[i]._id,
      originalFilename: `resume_${i + 1}.pdf`,
      storedFilename: `seed-resume-${i + 1}.pdf`,
      filePath: `uploads/seed-resume-${i + 1}.pdf`,
      fileUrl: `/uploads/seed-resume-${i + 1}.pdf`,
      fileSize: 102400,
      extractedText: sampleResumeText,
      extractedData: {
        name: students[i].fullName,
        email: students[i].email,
        phone: '+91 9876543210',
        skills: skillsPool.slice(0, 8),
        projects: ['E-Commerce Platform', 'Placement Portal'],
        experience: ['Software Intern at TechNova'],
        education: ['B.Tech Computer Science'],
        certifications: ['AWS Cloud Practitioner'],
        links: ['github.com/example', 'linkedin.com/in/example'],
      },
      isActive: true,
      latestScore: 72 + i * 3,
    }));

    await StudentProfile.findOneAndUpdate({ user: students[i]._id }, { resume: resumes[i]._id });
  }

  const statuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];
  const applications = [];
  for (let i = 0; i < 15; i++) {
    const student = students[i % students.length];
    const job = jobs[i % jobs.length];
    const resume = resumes.find((r) => r.student.toString() === student._id.toString()) || resumes[0];
    try {
      const app = await Application.create({
        student: student._id,
        job: job._id,
        company: job.company,
        resume: resume._id,
        status: statuses[i % statuses.length],
        statusHistory: [{ status: 'Applied' }, { status: statuses[i % statuses.length] }],
        appliedAt: new Date(Date.now() - i * 86400000 * 3),
      });
      applications.push(app);
    } catch (e) {
      // skip duplicate
    }
  }

  for (let i = 0; i < 5; i++) {
    const app = applications[i];
    if (!app) continue;
    await Interview.create({
      application: app._id,
      company: app.company,
      student: app.student,
      round: ['Aptitude', 'Technical', 'HR'][i % 3],
      date: new Date(Date.now() + (i + 1) * 86400000 * 2),
      startTime: '10:00',
      endTime: '11:00',
      mode: i % 2 === 0 ? 'Online' : 'Offline',
      meetingLink: i % 2 === 0 ? 'https://meet.example.com/interview' : undefined,
      location: i % 2 === 1 ? 'Campus Block A' : undefined,
      interviewer: 'HR Panel',
      createdBy: admin._id,
    });
  }

  const priorities = ['Normal', 'Important', 'Urgent'];
  for (let i = 0; i < 5; i++) {
    await Announcement.create({
      title: [`Placement Season 2026 Begins`, `Resume Workshop`, `TechNova Drive Registration`, `Mock Interview Schedule`, `Results Declaration`][i],
      content: `Important announcement for all final year students regarding placement activities. Please check the portal regularly for updates.`,
      priority: priorities[i % 3],
      expiresAt: new Date(Date.now() + 30 * 86400000),
      createdBy: admin._id,
    });
  }

  await Result.create({
    student: students[0]._id,
    company: companies[0]._id,
    job: jobs[0]._id,
    role: 'Software Developer',
    status: 'Selected',
    package: '10 LPA',
    joiningDate: new Date('2026-07-01'),
    publishedAt: new Date(),
    createdBy: admin._id,
  });

  for (let i = 0; i < 5; i++) {
    await ResumeAnalysis.create({
      resume: resumes[i % resumes.length]._id,
      student: students[i]._id,
      job: i % 2 === 0 ? jobs[i]._id : undefined,
      score: 61 + i * 5,
      sectionScores: {
        contactInformation: 10,
        summary: 3,
        education: 12,
        skills: 15 + i,
        projects: 14,
        experience: 10,
        certifications: 3,
        links: 4,
        formatting: 4,
      },
      strengths: ['Complete contact information', 'Good project portfolio'],
      weaknesses: ['Missing professional summary'],
      missingSections: i < 2 ? ['Summary/Objective'] : [],
      suggestions: ['Add a professional summary', 'Add measurable outcomes to projects', 'Include GitHub profile'],
      matchedSkills: skillsPool.slice(0, 4),
      missingSkills: skillsPool.slice(4, 6),
      jobMatchScore: i % 2 === 0 ? 72 : undefined,
      analyzedAt: new Date(Date.now() - i * 7 * 86400000),
    });
  }

  console.log('Seed completed successfully!');
  console.log('Demo credentials:');
  console.log('  Student: student@example.com / Student@123');
  console.log('  Admin: admin@example.com / Admin@123');

  if (disconnect) await mongoose.disconnect();
};

const isDirectRun = process.argv[1]?.replace(/\\/g, '/').includes('seed/seed.js');
if (isDirectRun) {
  runSeed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}
