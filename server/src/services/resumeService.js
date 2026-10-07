import fs from 'fs';
import pdf from 'pdf-parse';
import { Resume } from '../models/Resume.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { ApiError } from '../utils/helpers.js';
import { normalizeSkills } from '../utils/skillNormalizer.js';

const extractEmail = (text) => {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
};

const extractPhone = (text) => {
  const match = text.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(\d{2,4}\)|\d{2,4})[-.\s]?\d{3,4}[-.\s]?\d{4}/);
  return match ? match[0].trim() : null;
};

const extractLinks = (text) => {
  const urlRegex = /https?:\/\/[^\s]+|(?:github|linkedin)\.com\/[^\s]+/gi;
  return [...new Set((text.match(urlRegex) || []).map((l) => l.replace(/[.,;)]+$/, '')))];
};

const extractSkillsFromText = (text) => {
  const knownSkills = [
    'Java', 'JavaScript', 'Python', 'C++', 'React', 'Node.js', 'Express', 'MongoDB',
    'SQL', 'Git', 'DSA', 'HTML', 'CSS', 'TypeScript', 'AWS', 'Docker', 'Kubernetes',
    'REST API', 'Spring', 'Django', 'Flask', 'Redis', 'GraphQL', 'Tailwind', 'Redux',
    'Next.js', 'Vue', 'Angular', 'Linux', 'Jest', 'Cypress', 'Selenium', 'Figma',
  ];
  const lower = text.toLowerCase();
  return knownSkills.filter((skill) => lower.includes(skill.toLowerCase()));
};

const extractSections = (text) => {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const sections = { education: [], projects: [], experience: [], certifications: [] };

  let current = null;
  lines.forEach((line) => {
    const lower = line.toLowerCase();
    if (/^(education|academic)/i.test(lower)) current = 'education';
    else if (/^(project)/i.test(lower)) current = 'projects';
    else if (/^(experience|work|employment|internship)/i.test(lower)) current = 'experience';
    else if (/^(certification|certificate)/i.test(lower)) current = 'certifications';
    else if (current && line.length > 3) sections[current].push(line);
  });

  return sections;
};

export const extractResumeData = (text) => {
  if (!text || text.length < 20) {
    return {
      name: null,
      email: null,
      phone: null,
      education: [],
      skills: [],
      projects: [],
      experience: [],
      certifications: [],
      links: [],
      partialExtraction: true,
    };
  }

  const sections = extractSections(text);
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const name = lines[0]?.length < 50 ? lines[0] : null;

  return {
    name,
    email: extractEmail(text),
    phone: extractPhone(text),
    education: sections.education.slice(0, 10),
    skills: normalizeSkills(extractSkillsFromText(text)),
    projects: sections.projects.slice(0, 10),
    experience: sections.experience.slice(0, 10),
    certifications: sections.certifications.slice(0, 10),
    links: extractLinks(text),
    partialExtraction: !extractEmail(text) || sections.skills?.length === 0,
  };
};

export const parsePdfFile = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdf(buffer);
    const cleaned = data.text.replace(/\s+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
    return cleaned;
  } catch (error) {
    console.error('PDF extraction error:', error.message);
    return '';
  }
};

export const uploadResume = async (studentId, file) => {
  const text = await parsePdfFile(file.path);
  const extractedData = extractResumeData(text);

  await Resume.updateMany({ student: studentId }, { isActive: false });

  const resume = await Resume.create({
    student: studentId,
    originalFilename: file.originalname,
    storedFilename: file.filename,
    filePath: file.path,
    fileUrl: `/uploads/${file.filename}`,
    fileSize: file.size,
    extractedText: text,
    extractedData,
    isActive: true,
  });

  const profile = await StudentProfile.findOne({ user: studentId });
  if (profile) {
    profile.resume = resume._id;
    if (extractedData.skills?.length) {
      profile.skills = normalizeSkills([...(profile.skills || []), ...extractedData.skills]);
    }
    await profile.save();
  }

  return resume;
};

export const getMyResumes = async (studentId) => {
  return Resume.find({ student: studentId }).sort({ uploadedAt: -1 });
};

export const getResume = async (id, studentId, role) => {
  const resume = await Resume.findById(id);
  if (!resume) throw new ApiError(404, 'Resume not found');
  if (role === 'STUDENT' && resume.student.toString() !== studentId.toString()) {
    throw new ApiError(403, 'Access denied');
  }
  return resume;
};

export const getActiveResume = async (studentId) => {
  return Resume.findOne({ student: studentId, isActive: true });
};
