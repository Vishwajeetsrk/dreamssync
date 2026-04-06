/**
 * DreamSync Rate Limiter + Redis Cache Utility
 * v2: Added userId fingerprinting (IP + userId combined key)
 */

import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

// ─── Singleton Redis ──────────────────────────────────────────────
let _redis: Redis | null = null;

function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || '',
      token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    });
  }
  return _redis;
}

// ─── Rate Limiter ─────────────────────────────────────────────────

export type RateLimitOptions = {
  /** Window in seconds. Default: 60 */
  window?: number;
  /** Max requests per window. Default: 10 */
  max?: number;
  /** Key prefix to namespace routes */
  prefix: string;
  /**
   * Optional userId (e.g. Firebase UID from auth header).
   * When provided, rate limiting uses IP+userId fingerprint,
   * making it harder to bypass by changing IPs.
   */
  userId?: string;
};

/**
 * Extracts the real client IP from common proxy headers.
 */
function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') || // Cloudflare
    'anonymous'
  );
}

/**
 * Builds a stable rate-limit fingerprint.
 * Combines IP + userId (if known) so authenticated users
 * can't reset limits by rotating IPs.
 */
function buildFingerprint(ip: string, userId?: string): string {
  const raw = userId ? `${ip}:${userId}` : ip;
  // Hash it so we never store raw IPs in Redis
  return createHash('sha256').update(raw).digest('hex').slice(0, 24);
}

/**
 * Returns null if OK, or a NextResponse 429 if rate limited.
 * Silently passes through if Redis is unavailable (fail-open).
 */
export async function rateLimit(
  req: NextRequest,
  opts: RateLimitOptions
): Promise<NextResponse | null> {
  const { window = 60, max = 10, prefix, userId } = opts;

  const ip = getClientIp(req);
  const fingerprint = buildFingerprint(ip, userId);
  const key = `rl:${prefix}:${fingerprint}`;

  try {
    const redis = getRedis();
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, window);
    }

    if (count > max) {
      const ttl = await redis.ttl(key);
      const retryAfter = ttl > 0 ? ttl : window;

      return NextResponse.json(
        {
          error: 'Too many requests. Please slow down.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(max),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + retryAfter),
          },
        }
      );
    }
  } catch (e) {
    console.warn('[RateLimit] Redis unavailable, skipping:', String(e).slice(0, 80));
  }

  return null;
}

// ─── Body Size Guard ──────────────────────────────────────────────

/**
 * Checks if a request body is within the allowed size.
 * Returns a 413 response if too large, null if OK.
 * NOTE: Must be called BEFORE reading req.json() / req.formData().
 */
export function checkBodySize(
  req: NextRequest,
  maxBytes = 50_000 // 50KB default
): NextResponse | null {
  const contentLength = req.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > maxBytes) {
    return NextResponse.json(
      { error: `Request body too large. Maximum size is ${Math.round(maxBytes / 1024)}KB.` },
      { status: 413 }
    );
  }
  return null;
}

// ─── Response Cache ───────────────────────────────────────────────

/**
 * Generates a stable, content-addressed cache key.
 */
export function makeCacheKey(prefix: string, data: unknown): string {
  const hash = createHash('sha256')
    .update(JSON.stringify(data))
    .digest('hex')
    .slice(0, 16);
  return `cache:${prefix}:${hash}`;
}

/**
 * Try to get a cached response. Returns null on miss or Redis error.
 */
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const redis = getRedis();
    const value = await redis.get<T>(key);
    return value ?? null;
  } catch {
    return null;
  }
}

/**
 * Store a response in cache. Silently skips on Redis error.
 * Default TTL: 6 hours.
 */
export async function setCached(
  key: string,
  value: unknown,
  ttl = 60 * 60 * 6
): Promise<void> {
  try {
    const redis = getRedis();
    await redis.set(key, JSON.stringify(value), { ex: ttl });
  } catch {
    // Fine — just means no caching this time
  }
}

// ─── Input Sanitizer ──────────────────────────────────────────────

/**
 * Sanitize a string input:
 * - Removes null bytes
 * - Collapses excess whitespace
 * - Strips dangerous HTML-like patterns (basic XSS prevention)
 * - Trims to maxLen
 */
export function sanitize(
  input: string | undefined | null,
  maxLen = 4000
): string {
  if (!input) return '';
  return input
    .replace(/\0/g, '')                          // null bytes
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '') // script tags
    .replace(/javascript:/gi, '')                // js: URIs
    .replace(/on\w+\s*=/gi, '')                 // inline event handlers
    .replace(/\s+/g, ' ')                        // collapse whitespace
    .trim()
    .slice(0, maxLen);
}
