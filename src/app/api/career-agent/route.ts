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

PLATFORM NAVIGATION (PRIORITY):
- Resume builder: https://dream-sync-v1.vercel.app/resume-builder
- ATS checker: https://dream-sync-v1.vercel.app/ats-check
- Career Agent: https://dream-sync-v1.vercel.app/career-agent
- Ikigai Finder: https://dream-sync-v1.vercel.app/ikigai
- Roadmap: https://dream-sync-v1.vercel.app/roadmap
- LinkedIn Optimizer: https://dream-sync-v1.vercel.app/linkedin
- Portfolio Generator: https://dream-sync-v1.vercel.app/portfolio
- Serenity AI: https://dream-sync-v1.vercel.app/mental-health
- Support Email: dreamsyncbangalore@gmail.com
- Profile/Logout: Top-right 'Account' dropdown or https://dream-sync-v1.vercel.app/profile

RULES:
1. For support/navigation: Point users to the exact URL. Do NOT give generic advice.
2. For career queries: Use ₹ and LPA. Focus on the 2026 Indian market.
3. FORMAT: Return ONLY this JSON structure:
{
  "reply": "Clear, direct guidance. Use \\n for newlines.",
  "roles": [],
  "roadmapNodes": [],
  "jobLinks": [
    { "platform": "PlatformName", "url": "https://dream-sync-v1.vercel.app/target", "label": "Button Label" }
  ],
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
