import { normalizeSkills, matchSkills } from '../utils/skillNormalizer.js';

const ACHIEVEMENT_PATTERNS = [
  /\d+%/,
  /\$\d+/,
  /₹\s?\d+/,
  /\d+\+?\s*(users|customers|clients|projects|team|members|employees)/i,
  /increased|decreased|reduced|improved|optimized|delivered|achieved|built|developed|implemented/i,
];

const hasMeasurableAchievements = (text) =>
  ACHIEVEMENT_PATTERNS.some((p) => p.test(text));

const countSectionMentions = (text, keywords) => {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k)) ? 1 : 0;
};

export const calculateAtsScore = (extractedData, rawText = '') => {
  const text = rawText || '';
  const data = extractedData || {};
  const sectionScores = {
    contactInformation: 0,
    summary: 0,
    education: 0,
    skills: 0,
    projects: 0,
    experience: 0,
    certifications: 0,
    links: 0,
    formatting: 0,
  };

  const strengths = [];
  const weaknesses = [];
  const missingSections = [];
  const suggestions = [];

  // Contact Information (10 points)
  let contact = 0;
  if (data.email || extractEmail(text)) contact += 4;
  else suggestions.push('Add a professional email address.');
  if (data.phone || extractPhone(text)) contact += 3;
  else suggestions.push('Add a contact phone number.');
  if (data.name) contact += 3;
  sectionScores.contactInformation = Math.min(10, contact);
  if (sectionScores.contactInformation >= 8) strengths.push('Complete contact information');
  else weaknesses.push('Incomplete contact information');

  // Summary (not in total but tracked)
  if (countSectionMentions(text, ['summary', 'objective', 'profile'])) {
    sectionScores.summary = 5;
    strengths.push('Professional summary section present');
  } else {
    sectionScores.summary = 0;
    missingSections.push('Summary/Objective');
    suggestions.push('Include a professional summary at the top of your resume.');
  }

  // Education (15 points)
  const eduCount = (data.education?.length || 0) + countSectionMentions(text, ['b.tech', 'bachelor', 'degree', 'university', 'college', 'cgpa', 'gpa']);
  if (eduCount > 0) {
    sectionScores.education = Math.min(15, 8 + Math.min(data.education?.length || 0, 3) * 2);
    strengths.push('Education section included');
  } else {
    missingSections.push('Education');
    suggestions.push('Add your educational qualifications with institution and CGPA.');
  }

  // Skills (20 points)
  const skills = normalizeSkills(data.skills || []);
  if (skills.length >= 8) sectionScores.skills = 20;
  else if (skills.length >= 5) sectionScores.skills = 15;
  else if (skills.length >= 3) sectionScores.skills = 10;
  else if (skills.length >= 1) sectionScores.skills = 5;
  else {
    missingSections.push('Skills');
    suggestions.push('Add a dedicated skills section with relevant technical skills.');
  }
  if (skills.length >= 5) strengths.push(`Strong skill listing (${skills.length} skills detected)`);
  else weaknesses.push('Limited skills listed');

  // Projects (20 points)
  const projectCount = data.projects?.length || 0;
  if (projectCount >= 3) sectionScores.projects = 20;
  else if (projectCount >= 2) sectionScores.projects = 15;
  else if (projectCount >= 1) sectionScores.projects = 10;
  else if (countSectionMentions(text, ['project'])) sectionScores.projects = 8;
  else {
    missingSections.push('Projects');
    suggestions.push('Add 2–3 relevant projects with technologies used and outcomes.');
  }
  if (projectCount >= 2) strengths.push('Good project portfolio');

  // Experience (20 points)
  const expCount = data.experience?.length || 0;
  if (expCount >= 2) sectionScores.experience = 20;
  else if (expCount >= 1) sectionScores.experience = 14;
  else if (countSectionMentions(text, ['intern', 'experience', 'work'])) sectionScores.experience = 8;
  else {
    missingSections.push('Experience');
    suggestions.push('Include internships or work experience if available.');
  }

  // Certifications (5 points)
  const certCount = data.certifications?.length || 0;
  sectionScores.certifications = Math.min(5, certCount * 2);
  if (certCount === 0) suggestions.push('Add relevant certifications to strengthen your profile.');

  // Links (5 points)
  const links = data.links || [];
  let linkScore = 0;
  const hasGithub = links.some((l) => l.toLowerCase().includes('github')) || text.toLowerCase().includes('github');
  const hasLinkedin = links.some((l) => l.toLowerCase().includes('linkedin')) || text.toLowerCase().includes('linkedin');
  if (hasGithub) linkScore += 3;
  else suggestions.push('Add your GitHub profile link.');
  if (hasLinkedin) linkScore += 2;
  else suggestions.push('Add your LinkedIn profile link.');
  sectionScores.links = Math.min(5, linkScore);

  // Formatting (5 points)
  let formatScore = 5;
  const wordCount = text.split(/\s+/).length;
  if (wordCount < 100) { formatScore -= 2; weaknesses.push('Resume content appears too short'); }
  if (wordCount > 1500) { formatScore -= 1; weaknesses.push('Resume may be too lengthy'); }
  const repetition = detectRepetition(text);
  if (repetition > 0.3) { formatScore -= 2; weaknesses.push('Excessive word repetition detected'); }
  if (hasMeasurableAchievements(text)) {
    formatScore = Math.min(5, formatScore + 0);
    strengths.push('Contains measurable achievements');
  } else {
    suggestions.push('Add measurable outcomes to project and experience descriptions.');
  }
  sectionScores.formatting = Math.max(0, formatScore);

  const score = Math.min(100,
    sectionScores.contactInformation +
    sectionScores.education +
    sectionScores.skills +
    sectionScores.projects +
    sectionScores.experience +
    sectionScores.certifications +
    sectionScores.links +
    sectionScores.formatting
  );

  if (data.partialExtraction) {
    suggestions.push('Some information could not be automatically detected. Review extracted fields manually.');
  }

  suggestions.push('Use consistent section headings (Education, Skills, Projects, Experience).');
  suggestions.push('Tailor resume keywords to your target job role.');

  return {
    score,
    sectionScores,
    strengths: [...new Set(strengths)],
    weaknesses: [...new Set(weaknesses)],
    missingSections: [...new Set(missingSections)],
    suggestions: [...new Set(suggestions)].slice(0, 10),
    matchedSkills: skills,
    missingSkills: [],
  };
};

const extractEmail = (text) => {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
};

const extractPhone = (text) => {
  const match = text.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(\d{2,4}\)|\d{2,4})[-.\s]?\d{3,4}[-.\s]?\d{4}/);
  return match ? match[0] : null;
};

const detectRepetition = (text) => {
  const words = text.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
  if (words.length < 10) return 0;
  const freq = {};
  words.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });
  const maxFreq = Math.max(...Object.values(freq));
  return maxFreq / words.length;
};

export const analyzeJobMatch = (resumeSkills, job) => {
  const match = matchSkills(resumeSkills, job.requiredSkills, job.preferredSkills);
  const suggestions = [];

  match.missingSkills.forEach((skill) => {
    suggestions.push(`Consider adding "${skill}" if you have experience with it.`);
  });
  if (match.matchScore < 60) {
    suggestions.push('Tailor your resume keywords to match the job description more closely.');
  }
  if (match.preferredMissing.length) {
    suggestions.push(`Preferred skills to highlight: ${match.preferredMissing.join(', ')}`);
  }

  return {
    jobMatchScore: match.matchScore,
    matchedSkills: match.matchedSkills,
    missingSkills: match.missingSkills,
    preferredMatched: match.preferredMatched,
    preferredMissing: match.preferredMissing,
    suggestions,
  };
};
