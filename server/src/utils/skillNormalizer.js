const SKILL_ALIASES = {
  javascript: ['js', 'javascript', 'ecmascript', 'es6', 'es2015'],
  typescript: ['ts', 'typescript'],
  react: ['react', 'reactjs', 'react.js', 'react js'],
  'node.js': ['node', 'nodejs', 'node.js', 'node js'],
  express: ['express', 'express.js', 'expressjs'],
  mongodb: ['mongodb', 'mongo', 'mongo db'],
  sql: ['sql', 'mysql', 'postgresql', 'postgres', 'mssql'],
  python: ['python', 'py'],
  java: ['java', 'core java'],
  'c++': ['c++', 'cpp', 'c plus plus'],
  git: ['git', 'github', 'gitlab', 'bitbucket'],
  dsa: ['dsa', 'data structures', 'data structures and algorithms', 'algorithms'],
  'rest api': ['rest', 'rest api', 'restful', 'restful api', 'apis'],
  aws: ['aws', 'amazon web services'],
  docker: ['docker', 'containers'],
  kubernetes: ['kubernetes', 'k8s'],
  reactnative: ['react native', 'react-native'],
  html: ['html', 'html5'],
  css: ['css', 'css3'],
  tailwind: ['tailwind', 'tailwindcss', 'tailwind css'],
  redux: ['redux', 'redux toolkit'],
  nextjs: ['next.js', 'nextjs', 'next js'],
  vue: ['vue', 'vuejs', 'vue.js'],
  angular: ['angular', 'angularjs'],
  spring: ['spring', 'spring boot', 'springboot'],
  django: ['django'],
  flask: ['flask'],
  fastapi: ['fastapi', 'fast api'],
  redis: ['redis'],
  graphql: ['graphql', 'graph ql'],
  jest: ['jest'],
  cypress: ['cypress'],
  selenium: ['selenium'],
  figma: ['figma'],
  linux: ['linux', 'unix'],
  agile: ['agile', 'scrum'],
};

const CATEGORY_MAP = {
  javascript: 'Programming Languages',
  typescript: 'Programming Languages',
  python: 'Programming Languages',
  java: 'Programming Languages',
  'c++': 'Programming Languages',
  react: 'Frontend',
  html: 'Frontend',
  css: 'Frontend',
  tailwind: 'Frontend',
  redux: 'Frontend',
  nextjs: 'Frontend',
  vue: 'Frontend',
  angular: 'Frontend',
  'node.js': 'Backend',
  express: 'Backend',
  spring: 'Backend',
  django: 'Backend',
  flask: 'Backend',
  fastapi: 'Backend',
  mongodb: 'Database',
  sql: 'Database',
  redis: 'Database',
  graphql: 'Backend',
  aws: 'Cloud',
  docker: 'DevOps',
  kubernetes: 'DevOps',
  git: 'Tools',
  dsa: 'Data Structures',
  'rest api': 'Backend',
  jest: 'Testing',
  cypress: 'Testing',
  selenium: 'Testing',
};

const aliasToCanonical = {};
Object.entries(SKILL_ALIASES).forEach(([canonical, aliases]) => {
  aliases.forEach((alias) => {
    aliasToCanonical[alias.toLowerCase().trim()] = canonical;
  });
  aliasToCanonical[canonical.toLowerCase()] = canonical;
});

export const normalizeSkill = (skill) => {
  if (!skill || typeof skill !== 'string') return null;
  const key = skill.toLowerCase().trim().replace(/\s+/g, ' ');
  return aliasToCanonical[key] || key;
};

export const normalizeSkills = (skills = []) => {
  const seen = new Set();
  const result = [];
  skills.forEach((skill) => {
    const normalized = normalizeSkill(skill);
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  });
  return result;
};

export const getSkillCategory = (skill) => {
  const normalized = normalizeSkill(skill);
  return CATEGORY_MAP[normalized] || 'Other';
};

export const matchSkills = (resumeSkills = [], requiredSkills = [], preferredSkills = []) => {
  const normalizedResume = normalizeSkills(resumeSkills);
  const normalizedRequired = normalizeSkills(requiredSkills);
  const normalizedPreferred = normalizeSkills(preferredSkills);

  const resumeSet = new Set(normalizedResume);
  const matched = normalizedRequired.filter((s) => resumeSet.has(s));
  const missing = normalizedRequired.filter((s) => !resumeSet.has(s));
  const preferredMatched = normalizedPreferred.filter((s) => resumeSet.has(s));
  const preferredMissing = normalizedPreferred.filter((s) => !resumeSet.has(s));

  const requiredScore = normalizedRequired.length
    ? (matched.length / normalizedRequired.length) * 100
    : 100;
  const preferredScore = normalizedPreferred.length
    ? (preferredMatched.length / normalizedPreferred.length) * 100
    : 100;
  const matchScore = Math.round(requiredScore * 0.8 + preferredScore * 0.2);

  return {
    matchScore,
    matchedSkills: matched,
    missingSkills: missing,
    preferredMatched,
    preferredMissing,
    normalizedResume,
    normalizedRequired,
    normalizedPreferred,
  };
};

export const categorizeSkills = (skills = []) => {
  const categories = {};
  normalizeSkills(skills).forEach((skill) => {
    const cat = getSkillCategory(skill);
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(skill);
  });
  return categories;
};
