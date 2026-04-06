/**
 * /api/linkedin
 * LinkedIn Profile Optimizer
 * Stack: Groq → OpenRouter → Gemini fallback
 * Features: Zod validation, rate limiting, Redis caching
 */

import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { callAI, parseJSON } from '@/lib/ai';
import { rateLimit, makeCacheKey, getCached, setCached, sanitize } from '@/lib/rateLimit';

// ── Schema ────────────────────────────────────────────────────────
const BodySchema = z.object({
  targetRole: z.string().min(2, 'Target role is required').max(300),
  currentRole: z.string().max(500).optional(),
  currentHeadline: z.string().max(1000).optional(),
  currentAbout: z.string().max(10000).optional(),
  skills: z.string().max(10000).optional(),
  experience: z.string().max(20000).optional(),
  education: z.string().max(2000).optional(),
  achievements: z.string().max(5000).optional(),
  tone: z.enum(['professional', 'creative', 'technical', 'friendly']).default('professional'),
});

// ── System Prompt ─────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a world-class LinkedIn profile coach and personal branding expert.
You have helped thousands of professionals land jobs at FAANG, top Indian IT companies, and funded startups.
You MUST output ONLY valid JSON matching the exact schema. No markdown, no explanation, no extra keys.`;

function buildUserPrompt(data: z.infer<typeof BodySchema>): string {
  const toneGuide: Record<string, string> = {
    professional: 'authoritative, polished, corporate — suitable for MNCs and large companies',
    creative: 'expressive, engaging, storytelling-style — suitable for design, marketing, startups',
    technical: 'precise, data-driven, keyword-rich — suitable for engineering, data science, DevOps',
    friendly: 'warm, approachable, conversational — suitable for community, HR, customer success',
  };

  return `Optimize this LinkedIn profile for: "${data.targetRole}" — Tone: ${data.tone} (${toneGuide[data.tone]}).

CURRENT DATA:
- Headline: ${data.currentHeadline || 'Not provided'}
- About: ${data.currentAbout || 'Not provided'}
- Current Role: ${data.currentRole || 'Not specified'}
- Skills: ${data.skills || 'Not specified'}
- Experience: ${data.experience || 'Not specified'}
- Education: ${data.education || 'Not specified'}
- Achievements: ${data.achievements || 'Not specified'}

Return EXACTLY this JSON structure:
{
  "profileScore": <0-100>,
  "scoreBreakdown": {
    "headline": <0-20>,
    "about": <0-20>,
    "skills": <0-20>,
    "experience": <0-20>,
    "completeness": <0-20>
  },
  "headlines": [
    {"text": "<max 220 chars>", "focus": "<what this emphasizes>"},
    {"text": "<max 220 chars>", "focus": "<what this emphasizes>"},
    {"text": "<max 220 chars>", "focus": "<what this emphasizes>"}
  ],
  "about": {
    "optimized": "<300-2600 chars, compelling, keyword-rich, first-person>",
    "tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
  },
  "skills": {
    "recommended": ["<skill 1>", "<skill 2>", "<skill 3>", "<skill 4>", "<skill 5>", "<skill 6>", "<skill 7>", "<skill 8>", "<skill 9>", "<skill 10>"],
    "toRemove": ["<skill to remove or empty>"],
    "reason": "<why these skills matter for the target role>"
  },
  "connectionMessages": [
    {"occasion": "Cold Connect to Recruiter", "message": "<50-word personalized message>"},
    {"occasion": "Connect after Interview", "message": "<50-word thank you message>"},
    {"occasion": "Connect with Peer", "message": "<50-word peer networking message>"}
  ],
  "keyImprovements": [
    {"area": "<area name>", "priority": "high|medium|low", "action": "<specific action>"}
  ],
  "seoKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"]
}`;
}

// ── Handler ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Rate limit — 5 req/min (expensive operation)
  const limited = await rateLimit(req, { prefix: 'linkedin', max: 5, window: 60 });
  if (limited) return limited;

  // 2. Validate
  let body: z.infer<typeof BodySchema>;
  try {
    const raw = await req.json();
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }
    body = parsed.data;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // 3. Sanitize all string fields
  const sanitized: z.infer<typeof BodySchema> = {
    targetRole: sanitize(body.targetRole, 300),
    currentRole: sanitize(body.currentRole, 500),
    currentHeadline: sanitize(body.currentHeadline, 1000),
    currentAbout: sanitize(body.currentAbout, 10000),
    skills: sanitize(body.skills, 10000),
    experience: sanitize(body.experience, 20000),
    education: sanitize(body.education, 2000),
    achievements: sanitize(body.achievements, 5000),
    tone: body.tone,
  };

  // 4. Cache — based on full input hash
  const cacheKey = makeCacheKey('linkedin', sanitized);
  const cached = await getCached<object>(cacheKey);
  if (cached) {
    return NextResponse.json({ ...cached, _cache: true });
  }

  // 5. Build AI messages
  const aiMessages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    { role: 'user' as const, content: buildUserPrompt(sanitized) },
  ];

  // 6. Call AI
  try {
    const { content, provider } = await callAI(aiMessages, {
      jsonMode: true,
      maxTokens: 3500,
      temperature: 0.75,
    });

    const result = parseJSON<object>(content);
    await setCached(cacheKey, result, 60 * 60 * 4); // 4 hours

    return NextResponse.json({ ...result, _provider: provider });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'AI error';
    console.error('[linkedin] All providers failed:', msg);
    return NextResponse.json(
      { error: 'AI service temporarily unavailable. Please try again in a minute.' },
      { status: 503 }
    );
  }
}
