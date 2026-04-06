/**
 * DreamSync Security Utilities
 * - Cloudflare Turnstile token verification (server-side only)
 * - Bot and abuse detection helpers
 */

import { NextRequest, NextResponse } from 'next/server';

// ─── Turnstile Verification ───────────────────────────────────────

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

/**
 * Verifies a Cloudflare Turnstile token server-side.
 * Returns null if valid, or a NextResponse 403 if invalid.
 *
 * Usage in API route:
 *   const blocked = await verifyTurnstile(req);
 *   if (blocked) return blocked;
 *
 * Frontend must send the token in the request body as `turnstileToken`.
 * The secret key must be set as TURNSTILE_SECRET_KEY (never NEXT_PUBLIC_).
 */
export async function verifyTurnstile(
  token: string | null | undefined
): Promise<NextResponse | null> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // If not configured, skip verification in development
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[Security] TURNSTILE_SECRET_KEY not set in production!');
      return NextResponse.json(
        { error: 'Security configuration error.' },
        { status: 500 }
      );
    }
    return null; // Skip in dev
  }

  if (!token || typeof token !== 'string' || token.length < 10) {
    return NextResponse.json(
      { error: 'Missing or invalid security token. Please refresh and try again.' },
      { status: 403 }
    );
  }

  try {
    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret, response: token }),
      }
    );

    if (!res.ok) {
      console.error('[Turnstile] Verification request failed:', res.status);
      return NextResponse.json(
        { error: 'Security verification failed. Please try again.' },
        { status: 403 }
      );
    }

    const data: TurnstileVerifyResponse = await res.json();

    if (!data.success) {
      console.warn('[Turnstile] Token rejected:', data['error-codes']);
      return NextResponse.json(
        { error: 'Security check failed. Please refresh the page and try again.' },
        { status: 403 }
      );
    }

    return null; // Verified OK
  } catch (e) {
    console.error('[Turnstile] Network error during verification:', e);
    // Fail open in case Turnstile itself is down — don't block real users
    return null;
  }
}

// ─── Suspicious Pattern Detection ────────────────────────────────

const BANNED_PATTERNS = [
  /ignore\s+(?:all\s+)?(?:previous\s+)?instructions/i,  // Prompt injection
  /system\s*:\s*you\s+are/i,                             // Role hijacking
  /\bDAN\b.*jailbreak/i,                                 // DAN attacks
  /act\s+as\s+(?:an?\s+)?(?:unrestricted|evil|DAN)/i,   // Role bypass
  /forget\s+(?:all\s+)?(?:your\s+)?(?:previous\s+)?(?:instructions|rules)/i,
];

/**
 * Checks if a string contains suspicious prompt injection patterns.
 * Returns true if the input looks like an abuse attempt.
 */
export function isSuspiciousInput(input: string): boolean {
  return BANNED_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Returns a 400 response if any message in a conversation
 * looks like a prompt injection attempt.
 */
export function checkForInjection(
  messages: Array<{ role: string; content: string }>
): NextResponse | null {
  for (const msg of messages) {
    if (msg.role === 'user' && isSuspiciousInput(msg.content)) {
      console.warn('[Security] Prompt injection attempt blocked');
      return NextResponse.json(
        { error: 'Your message was flagged as potentially harmful. Please try rephrasing.' },
        { status: 400 }
      );
    }
  }
  return null;
}

// ─── Common Security Headers ──────────────────────────────────────

/**
 * Standard security headers to add to API responses.
 * Prevents clickjacking, content sniffing, etc.
 */
export const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

/**
 * Extract user ID from the Authorization header (Bearer token).
 * Returns null if no auth header. Does NOT verify the token —
 * use Firebase Admin SDK for full verification.
 * Used here only as a fingerprinting hint for rate limiting.
 */
export function extractUserIdHint(req: NextRequest): string | undefined {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return undefined;
  // Use the token itself (hashed downstream) as a userId hint
  // This improves fingerprinting without needing full auth verification
  return auth.slice(7, 57); // First 50 chars of JWT — unique enough
}
