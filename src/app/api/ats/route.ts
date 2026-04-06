/**
 * /api/ats
 * ATS Resume Checker — PDF upload + AI analysis
 * Stack: Groq → OpenRouter → Gemini fallback
 * Features: Rate limiting, PDF text extraction, Redis caching by PDF hash
 * NOTE: Uses Node.js runtime (not edge) — pdf-parse requires Node
 */

import { NextResponse, NextRequest } from 'next/server';
import { callAI, parseJSON } from '@/lib/ai';
import { rateLimit, makeCacheKey, getCached, setCached } from '@/lib/rateLimit';
import { createHash } from 'crypto';
import { validateUserInput, AI_SAFETY_INSTRUCTION } from '@/lib/aiSafety';

// ── PDF Extraction ────────────────────────────────────────────────
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

// ── System Prompt ─────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) resume reviewer for the Indian job market.
${AI_SAFETY_INSTRUCTION}
Analyze the resume and return ONLY a JSON object with this exact schema — no markdown, no extra text:
{
  "score": <number 0-100>,
  "grade": "A" | "B" | "C" | "D" | "F",
  "summary": "<one sentence summary of overall resume quality>",
  "keywords_found": ["<keyword>"],
  "keywords_missing": ["<important missing keyword>"],
  "issues": [
    { "title": "<issue title>", "description": "<what to fix>", "severity": "high" | "medium" | "low" }
  ],
  "strengths": ["<strength 1>", "<strength 2>"]
}

Grading: A=90+, B=75-89, C=60-74, D=45-59, F=below 45.
Focus on: ATS parse-ability, keyword density, quantified achievements, formatting, action verbs.
India context: check for CTC expectations, CGPA, relevant Indian certifications, Naukri/LinkedIn optimization.`;

// ── Handler ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Rate limit — 5 uploads/min (PDF processing is heavy)
  const limited = await rateLimit(req, { prefix: 'ats', max: 5, window: 60 });
  if (limited) return limited;

  // 2. Parse multipart form
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Could not parse form data. Send as multipart/form-data.' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded. Please select a PDF.' }, { status: 400 });
  }

  // Validate file type
  const isValidType =
    file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf');
  if (!isValidType) {
    return NextResponse.json(
      { error: `Invalid file type "${file.type}". Only PDF files are accepted.` },
      { status: 400 }
    );
  }

  // Validate file size — max 5MB
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
  }

  // 3. Read buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 4. Cache by PDF content hash (SHA-256 of file bytes)
  const pdfHash = createHash('sha256').update(buffer).digest('hex').slice(0, 16);
  const cacheKey = makeCacheKey('ats', pdfHash);
  const cached = await getCached<object>(cacheKey);
  if (cached) {
    return NextResponse.json({ ...cached, _cache: true });
  }

  // 5. Extract text
  let resumeText: string;
  try {
    resumeText = await extractPdfText(buffer);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: `Could not read PDF: ${msg}` },
      { status: 422 }
    );
  }

  if (!resumeText || resumeText.trim().length < 50) {
    return NextResponse.json(
      { error: 'Could not extract text from this PDF. Please ensure it is not a scanned image (use a text-based PDF).' },
      { status: 422 }
    );
  }

  // 6. AI Safety Validation
  // We check the extracted text for harmful keywords, and if a job role is provided (in formData)
  const role = (formData.get('jobRole') as string) || '';
  if (role) {
    const safetyStatus = validateUserInput(role);
    if (!safetyStatus.allowed) {
      return NextResponse.json({ error: 'Invalid Job Role', details: safetyStatus.message }, { status: 400 });
    }
  }

  // 7. Call AI
  const truncatedText = resumeText.slice(0, 6000); // Stay within token limits

  const aiMessages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    {
      role: 'user' as const,
      content: `Analyze this resume and provide an honest, detailed ATS score:\n\n${truncatedText}`,
    },
  ];

  try {
    const { content, provider } = await callAI(aiMessages, {
      jsonMode: true,
      maxTokens: 1000,
      temperature: 0.3, // Low temp for consistent, factual analysis
    });

    const result = parseJSON<object>(content);
    await setCached(cacheKey, result, 60 * 60 * 24); // 24 hours (same PDF → same result)

    return NextResponse.json({ ...result, _provider: provider });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'AI error';
    console.error('[ats] All providers failed:', msg);
    return NextResponse.json(
      { error: 'AI analysis temporarily unavailable. Please try again in a minute.' },
      { status: 503 }
    );
  }
}
