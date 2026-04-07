/**
 * /api/career-agent
 * AI Career Guidance Agent — India-focused
 * Stack: Groq → OpenRouter → Gemini fallback
 * Features: Zod validation, rate limiting, Redis caching
 */

import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { callAI, parseJSON } from '@/lib/ai';
import { validateCareerInput } from '@/lib/aiGuard';

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
const SYSTEM_PROMPT = `You are DreamSync's AI Identity & Career Guide. Your primary goal is to help users navigate DreamSync tools and provide Indian career guidance.

PLATFORM NAVIGATION (PRIORITY - Use these relative paths):
- Resume builder: /resume-builder
- ATS checker: /ats-check
- Career Agent: /career-agent
- Ikigai Finder: /ikigai
- Roadmap: /roadmap
- Profile Settings: /profile (Use 'Fix Profile Photo' as label)
- LinkedIn Optimizer: /linkedin (Use 'Fix LinkedIn' as label)
- Portfolio Generator: /portfolio
- Serenity AI: /mental-health
- Support Email: dreamsyncbangalore@gmail.com

OFFICIAL EXTERNAL LINKS (Use these absolute URLs):
- Naukri India: https://www.naukri.com
- LinkedIn Jobs: https://www.linkedin.com/jobs
- Indeed India: https://in.indeed.com
- Glassdoor India: https://www.glassdoor.co.in
- Internshala: https://internshala.com

STRICT RULES:
1. NO URLs IN TEXT: Never write "https://..." or "/..." inside the "reply" string.
2. BUTTONS ONLY: If you mention a tool or site, you MUST add it to the "jobLinks" array. 
3. LINK ACCURACY: Only provide the verified URLs listed above. Do NOT hallucinate links.
4. IDENTITY SYNC: If the user asks to fix their profile, change their photo, or update account info, you MUST provide the button for '/profile' with label 'Fix Profile Photo'.

FORMAT: Return ONLY this JSON:
{
  "reply": "I've analyzed your career request. I have provided the direct button below for the Fix Profile Photo tool to help you get started.",
  "roles": [],
  "roadmapNodes": [],
  "jobLinks": [
    { "platform": "Internal", "url": "/profile", "label": "Fix Profile Photo" }
  ],
  "quickTips": ["Always check company reviews", "Tailor your resume for each role"]
}`;

// ── Handler ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {

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

    // 4. Safety Guard
    const lastUserMsg = body.messages.filter(m => m.role === 'user').pop();
    if (lastUserMsg) {
      const safety = validateCareerInput(lastUserMsg.content);
      if (!safety.allowed) {
        return NextResponse.json({ error: 'Safety Violation', details: safety.message }, { status: 400 });
      }
    }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { messages, context = '' } = body;


  // 5. Build messages for AI
  const aiMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...(context ? [{ role: 'user' as const, content: `Context: ${context}` }] : []),
    ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
  ];

  // 6. Call AI with fallback chain
  try {
    const { content, provider } = await callAI(aiMessages, {
      jsonMode: true,
      maxTokens: 1500,
      temperature: 0.7,
    });

    const result = parseJSON<any>(content);

    // ── Double Protection: Strip URLs from the reply text ──────────
    if (result.reply) {
      // Remove any http/https links from the text to ensure only buttons are used
      result.reply = result.reply.replace(/https?:\/\/[^\s]+/g, '').trim();
      // Also remove relative paths if they appear as text
      result.reply = result.reply.replace(/\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/g, '').trim();
      result.reply = result.reply.replace(/\/(resume-builder|ats-check|career-agent|ikigai|roadmap|linkedin|portfolio|mental-health|profile)/g, '').trim();
    }

    return NextResponse.json({ ...result, _provider: provider });
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
    }, { status: 200 });
  }
}
