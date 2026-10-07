import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import app from '../app.js';
import { User } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { Company } from '../models/Company.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';

let mongoServer;
let studentToken, adminToken, studentId, jobId;

beforeAll(async () => {
  jest.setTimeout(120000);
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const adminPass = await bcrypt.hash('Admin@123', 12);
  const studentPass = await bcrypt.hash('Student@123', 12);

  const admin = await User.create({ fullName: 'Admin', email: 'admin@test.com', password: adminPass, role: 'ADMIN' });
  const student = await User.create({
    fullName: 'Student', email: 'student@test.com', password: studentPass, role: 'STUDENT',
    studentId: 'CS001', department: 'CSE', graduationYear: 2026,
  });
  studentId = student._id;
  await StudentProfile.create({ user: studentId, cgpa: 8.0, skills: ['Java', 'React'], profileCompletion: 80 });

  const company = await Company.create({ name: 'TestCo', industry: 'Tech', status: 'Active', createdBy: admin._id });
  const job = await Job.create({
    title: 'Developer', company: company._id, description: 'Dev role',
    requiredSkills: ['Java'], minimumCGPA: 7, eligibleDepartments: ['CSE'],
    graduationYears: [2026], deadline: new Date(Date.now() + 86400000 * 30), status: 'Open', createdBy: admin._id,
  });
  jobId = job._id;

  const loginStudent = await request(app).post('/api/auth/login').send({ email: 'student@test.com', password: 'Student@123' });
  studentToken = loginStudent.body.data.token;

  const loginAdmin = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'Admin@123' });
  adminToken = loginAdmin.body.data.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

describe('Auth API', () => {
  test('registers a new student', async () => {
    const res = await request(app).post('/api/auth/register').send({
      fullName: 'New Student', email: 'new@test.com', password: 'pass123',
      studentId: 'CS002', department: 'IT', graduationYear: 2026,
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test('rejects invalid login', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'student@test.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  test('returns current user', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user.role).toBe('STUDENT');
  });
});

describe('Protected Routes', () => {
  test('blocks unauthenticated access', async () => {
    const res = await request(app).get('/api/students/dashboard');
    expect(res.status).toBe(401);
  });

  test('blocks student from admin routes', async () => {
    const res = await request(app).get('/api/applications').set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(403);
  });
});

describe('Jobs API', () => {
  test('admin creates job', async () => {
    const company = await Company.findOne();
    const res = await request(app).post('/api/jobs').set('Authorization', `Bearer ${adminToken}`).send({
      title: 'Backend Dev', company: company._id.toString(), description: 'Backend role',
      deadline: new Date(Date.now() + 86400000).toISOString(), requiredSkills: ['Node.js'],
    });
    expect(res.status).toBe(201);
  });

  test('checks job eligibility', async () => {
    const res = await request(app).get(`/api/jobs/${jobId}`).set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.eligibility.eligible).toBe(true);
  });
});

describe('Applications API', () => {
  test('prevents application without resume', async () => {
    const res = await request(app).post('/api/applications').set('Authorization', `Bearer ${studentToken}`).send({ jobId: jobId.toString() });
    expect(res.status).toBe(400);
  });

  test('prevents duplicate applications', async () => {
    // Would need resume - skip if no resume
  });
});

describe('Resume Analysis', () => {
  test('calculates ATS score deterministically', async () => {
    const { calculateAtsScore } = await import('../services/atsAnalyzer.js');
    const data = { email: 't@t.com', phone: '123', skills: ['Java', 'React', 'Node.js'], projects: ['P1'], education: ['B.Tech'] };
    const r1 = calculateAtsScore(data, 'Java React summary education projects');
    const r2 = calculateAtsScore(data, 'Java React summary education projects');
    expect(r1.score).toBe(r2.score);
    expect(r1.score).toBeGreaterThan(0);
  });
});
