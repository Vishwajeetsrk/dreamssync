/**
 * /api/career-agent
 * AI Career Guidance Agent — India-focused
 * Stack: Groq → OpenRouter → Gemini fallback
 * Features: Zod validation, rate limiting, Redis caching
 */

import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { callAI, parseJSON } from '@/lib/ai';
import { rateLimit, checkBodySize, makeCacheKey, getCached, setCached, sanitize } from '@/lib/rateLimit';
import { checkForInjection, extractUserIdHint, SECURITY_HEADERS } from '@/lib/security';

// ── Schema ────────────────────────────────────────────────────────
const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(10000),
});

const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(20),
  context: z.string().max(2000).optional(),
});

// ── System Prompt ─────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are DreamSync's AI Career Guidance Agent — a knowledgeable, friendly career counselor specializing in the Indian job market (2026).

EXPERTISE:
- Indian IT companies: TCS, Infosys, Wipro, HCL, Cognizant, Tech Mahindra
- Product startups: Razorpay, Zepto, Swiggy, Zomato, PhonePe, CRED, Meesho, Groww
- FAANG India: Google, Microsoft, Amazon, Meta, Apple hiring in India
- Salary benchmarks (realistic LPA for freshers → 5 years, Tier 1/2 cities)
- College: on-campus AMCAT/CoCubes drives, off-campus, CGPA cutoffs
- In-demand skills 2026: GenAI, LLMs, agentic workflows, full-stack, cloud, DSA
- Certifications: AWS, Google Cloud, Meta, Microsoft, NPTEL
- ATS systems: Naukri, LinkedIn, Shine, Indeed India
- Work culture: service vs product vs startup vs government

RULES:
- Always use ₹ and LPA for Indian salaries.
- Keep roles to 3-4 max, roadmapNodes to 5-6 max.
- Generate REAL job search URLs (not placeholders).
- PRIORITY RESOURCES:
    - FreeCodeCamp Data Science: https://www.youtube.com/watch?v=LHc6W2K7U8A
    - IBM Data Science Professional Cert: https://www.coursera.org/professional-certificates/ibm-data-science
    - MDN Web Docs: https://developer.mozilla.org/

RESPONSE FORMAT — Return ONLY this JSON, no markdown, no extra text:
{
  "reply": "Detailed, warm, helpful response. Use \\n for newlines.",
  "roles": [
    {
      "title": "Role name",
      "salary": "₹X LPA – ₹Y LPA",
      "demand": "High | Medium | Low",
      "skills": ["skill1", "skill2", "skill3"],
      "companies": ["Company1", "Company2", "Company3"],
      "prerequisites": "Education and skills required"
    }
  ],
  "roadmapNodes": [
    { "id": 1, "label": "Step Title", "sublabel": "Month 0-1", "next": [2], "summary": "What you'll achieve" }
  ],
  "jobLinks": [
    { "platform": "Naukri", "url": "https://www.naukri.com/ROLE-jobs", "label": "Search on Naukri", "summary": "Direct link to apply for ROLE in India" }
  ],
  "quickTips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

// ── Handler ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Body size guard (50KB max)
  const tooBig = checkBodySize(req, 50_000);
  if (tooBig) return tooBig;

  // 2. Rate limit — 8 req/min, fingerprinted by IP + userId
  const userId = extractUserIdHint(req);
  const limited = await rateLimit(req, { prefix: 'career-agent', max: 8, window: 60, userId });
  if (limited) return limited;

  // 2. Validate body
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

  // 3. Sanitize + injection check
  const messages = body.messages.map((m) => ({
    role: m.role,
    content: sanitize(m.content, 10000),
  }));

  const injectionBlock = checkForInjection(messages);
  if (injectionBlock) return injectionBlock;

  // 4. Cache lookup — use last user message as cache key
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
  const cacheKey = makeCacheKey('career-agent', lastUserMsg?.content ?? messages);
  const cached = await getCached<object>(cacheKey);
  if (cached) {
    return NextResponse.json({ ...cached, _cache: true });
  }

  // 5. Build messages for AI
  const aiMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...(body.context ? [{ role: 'user' as const, content: `Context: ${sanitize(body.context, 400)}` }] : []),
    ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
  ];

  // 6. Call AI with fallback chain
  try {
    const { content, provider } = await callAI(aiMessages, {
      jsonMode: true,
      maxTokens: 1500,
      temperature: 0.7,
    });

    const result = parseJSON<object>(content);

    // 7. Cache the result (6 hours)
    await setCached(cacheKey, result);

    return NextResponse.json({ ...result, _provider: provider }, { headers: SECURITY_HEADERS });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'AI service error';
    console.error('[career-agent] All providers failed:', msg);

    // Safe fallback response
    return NextResponse.json({
      reply: "I'm having trouble connecting right now. Please try again in a moment! In the meantime, check out Naukri.com or LinkedIn Jobs for opportunities.",
      roles: [],
      roadmapNodes: [],
      jobLinks: [
        { platform: 'Naukri', url: 'https://www.naukri.com/', label: 'Browse Naukri' },
        { platform: 'LinkedIn', url: 'https://www.linkedin.com/jobs/', label: 'Browse LinkedIn Jobs' },
      ],
      quickTips: ['Keep your resume updated', 'Practice DSA daily', 'Build projects to showcase skills'],
    }, { status: 200, headers: SECURITY_HEADERS });
  }
}
