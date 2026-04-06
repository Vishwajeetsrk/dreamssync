/**
 * /api/roadmap
 * High-Depth Roadmap Architect — phase-by-phase career planning
 */

import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { callAI, parseJSON } from '@/lib/ai';
import { rateLimit, checkBodySize, sanitize } from '@/lib/rateLimit';
import { checkForInjection, extractUserIdHint, SECURITY_HEADERS } from '@/lib/security';
import { validateUserInput, AI_SAFETY_INSTRUCTION } from '@/lib/aiSafety';

// ── Schema ────────────────────────────────────────────────────────
const BodySchema = z.object({
  role: z.string().min(2, "Role is required").max(100),
  goal: z.string().max(500).optional(),
  experience: z.string().max(100).default('Beginner'),
});

// ── System Prompt ─────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an elite career counselor and technical architect. Generate a high-depth, practical roadmap for the requested role. 
${AI_SAFETY_INSTRUCTION}

PRIORITIZE THESE EXACT RESOURCES:
- FreeCodeCamp Data Science: https://www.youtube.com/watch?v=LHc6W2K7U8A
- IBM Data Science Professional Cert: https://www.coursera.org/professional-certificates/ibm-data-science
- CS50 Computer Science: https://cs50.harvard.edu/x/
- MDN Web Docs: https://developer.mozilla.org/

RETURN EXACT JSON STRUCTURE:
{
  "totalTimeline": "6-8 Months",
  "globalPrerequisites": {
    "education": "Required basic degree or background",
    "technicalSkills": ["Skill 1", "Skill 2"]
  },
  "timeline": [{
     "title": "Phase name",
     "time": "Weeks 1-4",
     "desc": "Summary of goals for this phase",
     "phasePrerequisites": ["Required before this phase"],
     "skillsToLearn": ["Skill A", "Skill B"],
     "studyMaterials": [{ "label": "Course/Doc", "url": "https://...", "summary": "Why this resource?" }],
     "videoLectures": [{ "label": "Video Name", "url": "https://...", "summary": "Key learning?" }],
     "certifications": [{ "label": "Cert Name", "url": "https://...", "summary": "Value?" }],
     "freeToolsAndProjects": [{ "label": "Tool/Project", "url": "https://...", "summary": "Practical use?" }]
  }]
}`;

// ── Handler ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Body size guard (20KB max — roadmap inputs are small)
  const tooBig = checkBodySize(req, 20_000);
  if (tooBig) return tooBig;

  // 2. Rate limit — 5 per minute per user/IP
  const userId = extractUserIdHint(req);
  const limited = await rateLimit(req, { prefix: 'roadmap', max: 5, window: 60, userId });
  if (limited) return limited;

  // 3. Validate
  let body: z.infer<typeof BodySchema>;
  try {
    const raw = await req.json();
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues[0]?.message }, { status: 400 });
    }
    body = parsed.data;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // 4. Sanitize + injection check
  const role = sanitize(body.role, 100);
  const goal = sanitize(body.goal, 500) || 'Job ready';
  const experience = sanitize(body.experience, 100);

  const injectionBlock = checkForInjection([
    { role: 'user', content: role },
    { role: 'user', content: goal },
    { role: 'user', content: experience }
  ]);
  if (injectionBlock) return injectionBlock;

  // 5. AI Safety Validation
  const safetyStatus = validateUserInput(role);
  if (!safetyStatus.allowed) {
    return NextResponse.json({ 
      error: 'Invalid role', 
      details: safetyStatus.message,
      alternatives: ['Software Developer', 'Data Analyst', 'Designer', 'Product Manager']
    }, { status: 400 });
  }

  // 6. Build AI messages
  const userPrompt = `Generate a high-grade career roadmap for: ${role}. 
Experience level: ${experience}. 
Target Goal: ${goal}.

REQUIREMENTS:
1. 4-6 phases max.
2. Every link MUST be REAL and ACTIVE.
3. For Data Science/AI roles, you MUST include the FreeCodeCamp link (https://www.youtube.com/watch?v=LHc6W2K7U8A).`;

  try {
    const { content, provider } = await callAI([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ], { jsonMode: true, maxTokens: 2500, temperature: 0.7 });

    const result = parseJSON<object>(content);
    return NextResponse.json({ ...result, _provider: provider }, { headers: SECURITY_HEADERS });

  } catch (error: unknown) {
    console.error('[roadmap] All providers failed:', error);
    return NextResponse.json({ error: 'AI Roadmap Generator is temporarily unavailable. Please try again.' }, { status: 503 });
  }
}
