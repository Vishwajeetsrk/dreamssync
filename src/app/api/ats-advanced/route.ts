/**
 * /api/ats-advanced
 * Advanced Smart ATS + Company Eligibility Analyzer
 * - Google, Microsoft, Amazon, Meta, Startups evaluation.
 * - AI Analysis of Resume vs Job Role.
 * - Improved Resume generation.
 */

import { NextResponse, NextRequest } from 'next/server';
import { callAI, parseJSON } from '@/lib/ai';
import { rateLimit, checkBodySize, sanitize } from '@/lib/rateLimit';
import { validateUserInput, AI_SAFETY_INSTRUCTION } from '@/lib/aiSafety';

async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse/lib/pdf-parse.js');
    const data = await pdfParse(buffer);
    return (data.text as string) || '';
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`PDF parsing failed: ${msg}`);
  }
}

const SYSTEM_PROMPT = `You are a Senior Technical Recruiter with experience from top-tier firms like Google, Microsoft, and Amazon.
${AI_SAFETY_INSTRUCTION}

Analyze the provided resume against a specific job role and description. 
Provide a comprehensive ATS analysis and a simulated "Company Eligibility" report for: Google, Microsoft, Amazon, Meta, and Startups.

RETURN ONLY A JSON OBJECT (MUST MATCH THIS SCHEMA):
{
  "ats_score": <number 0-100>,
  "keyword_match": <number 0-100>,
  "strengths": ["string"],
  "weaknesses": ["string"],
  "missing_keywords": ["string"],
  "improvement_suggestions": ["string"],
  "company_eligibility": [
    {
      "company": "Google",
      "eligibility": "Eligible" | "Partially Eligible" | "Not Eligible",
      "score": 0-100,
      "reasons": ["string"],
      "missing_skills": ["string"],
      "suggestions": ["string"]
    }
    // ... repeat for all companies
  ],
  "improved_resume_markdown": "string (optimized full resume content in markdown)"
}`;

export async function POST(req: NextRequest) {
  // 1. Rate Limit
  const limited = await rateLimit(req, { prefix: 'ats-adv', max: 3, window: 60 });
  if (limited) return limited;

  // 2. Parse Multipart
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  const jobRole = sanitize(formData.get('jobRole') as string || '', 100);
  const jobDescription = sanitize(formData.get('jobDescription') as string || '', 2000);
  const experienceLevel = sanitize(formData.get('experienceLevel') as string || 'Fresher', 50);

  if (!file || !jobRole) {
    return NextResponse.json({ error: 'Missing resume or job role' }, { status: 400 });
  }

  // 3. AI Safety Validation
  const safetyStatus = validateUserInput(jobRole + " " + jobDescription);
  if (!safetyStatus.allowed) {
    return NextResponse.json({ error: 'Invalid Input', details: safetyStatus.message }, { status: 400 });
  }

  // 4. PDF Extraction
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  let resumeText: string;
  try {
    resumeText = await extractPdfText(buffer);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to parse PDF content' }, { status: 422 });
  }

  // 5. Call AI
  const userPrompt = `
    Job Role: ${jobRole}
    Experience Level: ${experienceLevel}
    Job Description: ${jobDescription}
    
    Resume Content:
    ${resumeText.slice(0, 6000)}
  `;

  try {
    const { content, provider } = await callAI([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ], { jsonMode: true, temperature: 0.3, maxTokens: 4000 });

    const result = parseJSON<object>(content);
    return NextResponse.json({ ...result, _provider: provider });

  } catch (error: unknown) {
    console.error('[ats-adv] Error:', error);
    return NextResponse.json({ error: 'Analysis failed. Please try again later.' }, { status: 500 });
  }
}
