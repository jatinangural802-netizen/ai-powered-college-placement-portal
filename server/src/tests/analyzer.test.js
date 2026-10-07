import { calculateAtsScore, analyzeJobMatch } from '../services/atsAnalyzer.js';
import { normalizeSkill, matchSkills } from '../utils/skillNormalizer.js';

describe('Skill Normalizer', () => {
  test('normalizes JavaScript aliases', () => {
    expect(normalizeSkill('JS')).toBe('javascript');
    expect(normalizeSkill('ReactJS')).toBe('react');
    expect(normalizeSkill('Node.js')).toBe('node.js');
  });

  test('matches skills correctly', () => {
    const result = matchSkills(['Java', 'SQL', 'Git'], ['Java', 'SQL', 'DSA', 'React'], ['REST API']);
    expect(result.matchedSkills).toContain('java');
    expect(result.missingSkills).toContain('dsa');
    expect(result.matchScore).toBeGreaterThan(0);
  });
});

describe('ATS Analyzer', () => {
  const sampleData = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    skills: ['Java', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Git', 'SQL'],
    projects: ['Project 1', 'Project 2', 'Project 3'],
    experience: ['Intern at TechCorp'],
    education: ['B.Tech CSE'],
    certifications: ['AWS Certified'],
    links: ['github.com/john', 'linkedin.com/in/john'],
  };

  const sampleText = `
    John Doe john@example.com +91 9876543210
    SUMMARY Experienced developer
    EDUCATION B.Tech CGPA 8.5
    SKILLS Java JavaScript React Node.js MongoDB Git SQL
    PROJECTS Built e-commerce platform with 30% improvement
    EXPERIENCE Intern at TechCorp for 3 months
    CERTIFICATIONS AWS Certified
    github.com/john linkedin.com/in/john
  `;

  test('calculates deterministic ATS score', () => {
    const result = calculateAtsScore(sampleData, sampleText);
    expect(result.score).toBeGreaterThan(50);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.sectionScores.contactInformation).toBeGreaterThan(0);
    expect(result.strengths.length).toBeGreaterThan(0);
  });

  test('same input produces same score', () => {
    const r1 = calculateAtsScore(sampleData, sampleText);
    const r2 = calculateAtsScore(sampleData, sampleText);
    expect(r1.score).toBe(r2.score);
  });

  test('job match analysis', () => {
    const job = {
      requiredSkills: ['Java', 'SQL', 'DSA', 'React'],
      preferredSkills: ['REST API'],
    };
    const result = analyzeJobMatch(['Java', 'SQL', 'Git'], job);
    expect(result.jobMatchScore).toBeDefined();
    expect(result.matchedSkills).toContain('java');
    expect(result.missingSkills).toContain('dsa');
  });
});
