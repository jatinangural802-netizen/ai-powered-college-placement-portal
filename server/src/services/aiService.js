import { isAiConfigured, env } from '../config/env.js';

const AI_PROMPT_TEMPLATE = `You are a professional resume coach. Analyze the following resume information and provide improvement suggestions.

IMPORTANT RULES:
- Do NOT invent experience, projects, internships, certifications, or achievements not present in the resume.
- Only improve wording based on information already provided.
- Return valid JSON only.

Resume Text (excerpt):
{resumeText}

Extracted Skills: {skills}
Target Job Title: {jobTitle}
Required Skills: {requiredSkills}
Preferred Skills: {preferredSkills}

Return JSON with this exact structure:
{
  "summary": "brief overall assessment",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1"],
  "missingSkills": ["skill1"],
  "suggestions": ["suggestion1"],
  "bulletImprovements": ["improve this bullet without adding unsupported achievements"],
  "jobMatchExplanation": "explanation of job fit"
}`;

const validateAiResponse = (data) => {
  const required = ['summary', 'strengths', 'weaknesses', 'missingSkills', 'suggestions', 'bulletImprovements', 'jobMatchExplanation'];
  if (!data || typeof data !== 'object') return null;
  for (const key of required) {
    if (!(key in data)) return null;
    if (['strengths', 'weaknesses', 'missingSkills', 'suggestions', 'bulletImprovements'].includes(key) && !Array.isArray(data[key])) {
      return null;
    }
  }
  return data;
};

const callOpenAI = async (prompt) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.aiApiKey}`,
    },
    body: JSON.stringify({
      model: env.aiModel,
      messages: [
        { role: 'system', content: 'You are a resume analysis assistant. Return only valid JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) throw new Error(`AI API error: ${response.status}`);
  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;
  return JSON.parse(content);
};

export const getAiEnhancements = async ({ resumeText, skills, jobTitle, requiredSkills, preferredSkills }) => {
  if (!isAiConfigured()) {
    return {
      available: false,
      message: 'AI enhancement is unavailable. Configure AI_PROVIDER and AI_API_KEY in environment variables.',
      data: null,
    };
  }

  try {
    const prompt = AI_PROMPT_TEMPLATE
      .replace('{resumeText}', (resumeText || '').slice(0, 3000))
      .replace('{skills}', (skills || []).join(', '))
      .replace('{jobTitle}', jobTitle || 'General')
      .replace('{requiredSkills}', (requiredSkills || []).join(', '))
      .replace('{preferredSkills}', (preferredSkills || []).join(', '));

    let parsed;
    if (env.aiProvider.toLowerCase() === 'openai') {
      parsed = await callOpenAI(prompt);
    } else {
      parsed = await callOpenAI(prompt);
    }

    const validated = validateAiResponse(parsed);
    if (!validated) {
      return {
        available: false,
        message: 'AI returned an invalid response. Basic analysis is still available.',
        data: null,
      };
    }

    return { available: true, message: null, data: validated };
  } catch (error) {
    console.error('AI service error:', error.message);
    return {
      available: false,
      message: 'AI suggestions are temporarily unavailable. Basic resume analysis is still available.',
      data: null,
    };
  }
};

export const isAiAvailable = () => isAiConfigured();
