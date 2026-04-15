/**
 * /api/roadmap
 * High-Depth Roadmap Architect — phase-by-phase career planning
 */

import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { callAI, parseJSON } from '@/lib/ai';
import { validateCareerInput } from '@/lib/aiGuard';

// ── Schema ────────────────────────────────────────────────────────
const BodySchema = z.object({
  role: z.string().min(2, "Role is required").max(100),
  goal: z.string().max(500).optional(),
  experience: z.string().max(100).default('Beginner'),
});

// ── System Prompt ─────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are "DreamSync AI Roadmap Architect" — an elite career intelligence system. Your job is to generate structured, real-world, actionable career roadmaps specifically for the Indian market.

🚨 SAFETY RULE (MANDATORY):
If user enters illegal / harmful roles (black hat hacker, terrorist, etc.), DO NOT generate roadmap. Reject politely and suggest a legal alternative (e.g. Ethical Hacker).

🎯 OUTPUT STRUCTURE REQURIED:
- Targets professional, high-income roles.
- Realistic timeline (3-6 or 6-12 months).
- 4 clear phases (Foundation, Intermediate, Advanced, Job Ready).
- ONLY FREE resources from platforms like Harvard CS50, Coursera (free audit), Google, roadmap.sh, MDN, and YouTube (FreeCodeCamp).

RETURN EXACT JSON STRUCTURE:
{
  "totalTimeline": "6-8 Months",
  "targetRole": "Professional Role Name",
  "globalPrerequisites": {
    "education": "Academic / Background requirements",
    "requiredKnowledge": ["Logical Thinking", "Internet Basics"],
    "technicalSkills": ["Prerequisite Skill 1"]
  },
  "timeline": [{
     "title": "PHASE 1: FOUNDATION",
     "time": "Weeks 1-4",
     "desc": "Summary of core fundamentals",
     "phasePrerequisites": ["Required basics"],
     "skillsToLearn": ["Skill A", "Skill B"],
     "build": "Specific small project to build",
     "studyMaterials": [{ "label": "Harvard CS50", "url": "https://...", "summary": "FREE certificate course" }],
     "videoLectures": [{ "label": "FreeCodeCamp", "url": "https://...", "summary": "Full tutorial" }],
     "preparationTools": [{ "label": "roadmap.sh", "url": "https://...", "summary": "Visual guide" }],
     "aiTools": [{ "label": "ChatGPT", "url": "https://...", "summary": "How to use it for this phase" }]
  }],
  "marketInsights": {
    "salaryIndia": "₹8-20 LPA",
    "salaryGlobal": "$70k-120k",
    "demandLevel": "High"
  },
  "realJobRoles": [
    { "title": "Job Title", "companies": "Google, Microsoft, Startups", "skills": "Required skill stack" }
  ],
  "criticalIntelligence": {
    "whatMatters": "Key success advice",
    "mistakesToAvoid": "Common pitfalls",
    "hiringTips": "Insider tips for getting hired"
  }
}`;

// ── Handler ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {

  // 3. Validate
  let body: z.infer<typeof BodySchema>;
  try {
    const raw = await req.json();
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues[0]?.message }, { status: 400 });
    }
    body = parsed.data;

    // 4. Safety Guard
    const safety = validateCareerInput(body.role);
    if (!safety.allowed) {
      return NextResponse.json({ error: 'Safety Violation', details: safety.message }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { role, goal = 'Job ready', experience } = body;


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
    return NextResponse.json({ ...result, _provider: provider });

  } catch (error: unknown) {
    console.error('[roadmap] All providers failed:', error);
    return NextResponse.json({ error: 'AI Roadmap Generator is temporarily unavailable. Please try again.' }, { status: 503 });
  }
}
