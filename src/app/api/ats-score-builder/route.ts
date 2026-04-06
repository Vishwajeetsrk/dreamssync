import { NextResponse, NextRequest } from 'next/server';
import { callAI, parseJSON } from '@/lib/ai';

const SYSTEM_PROMPT = `You are an ATS Scoring Engine. Analyze the following resume DATA and provide an ATS Score (0-100), Keyword Match level, and actionable feedback.

RETURN ONLY A JSON OBJECT:
{
  "score": <number>,
  "keyword_match": <number>,
  "feedback": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "missing_keywords": ["string"]
  }
}`;

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const resumeText = JSON.stringify(data);

    const { content } = await callAI([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Analyze this resume data:\n\n${resumeText.slice(0, 8000)}` }
    ], { jsonMode: true, temperature: 0.2 });

    const result = parseJSON<object>(content);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[ats-builder] Error:', error);
    return NextResponse.json({ error: 'Failed to scan resume.' }, { status: 500 });
  }
}
