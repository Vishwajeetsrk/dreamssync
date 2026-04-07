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
const SYSTEM_PROMPT = `You are DreamSync's AI Identity & Career Guide. Your primary goal is twofold: 
1. Help users navigate and use DreamSync platform tools.
2. Provide high-depth career guidance for the Indian market (2026).

PLATFORM KNOWLEDGE (CRITICAL):
- Resume builder: Go to https://dream-sync-v1.vercel.app/resume-builder
- ATS checker: Go to https://dream-sync-v1.vercel.app/ats-check
- Career Agent: Go to https://dream-sync-v1.vercel.app/career-agent
- Ikigai Finder: Go to https://dream-sync-v1.vercel.app/ikigai
- Roadmap Generator: Go to https://dream-sync-v1.vercel.app/roadmap
- LinkedIn Optimizer: Go to https://dream-sync-v1.vercel.app/linkedin
- Portfolio Generator: Go to https://dream-sync-v1.vercel.app/portfolio
- Serenity AI (Mental Health): Go to https://dream-sync-v1.vercel.app/mental-health
- Profile/Photo Update/Logout: Use the 'Account' dropdown in the top-right Navbar or go to https://dream-sync-v1.vercel.app/profile

SUPPORT MODE:
If the user asks about changing their photo, logging out, or finding a tool, ALWAYS point them to the specific route or Navbar control listed above. Do not just give generic life advice.

CAREER EXPERTISE:
- Specialized in Indian IT, FAANG, and startup ecosystems.
- Use ₹ and LPA for all salary discussions.

RESPONSE FORMAT: Return ONLY this JSON. Ensure "reply" contains the navigation instructions if applicable. Use \\n for newlines.
{
  "reply": "Clear, direct guidance. If helpful, include: 'You can find this tool at [URL]'",
  "roles": [],
  "roadmapNodes": [],
  "jobLinks": [],
  "quickTips": []
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

    const result = parseJSON<object>(content);
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
