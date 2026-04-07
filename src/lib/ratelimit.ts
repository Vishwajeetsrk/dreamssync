import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

/**
 * DreamSync Global Rate Limiting Engine
 * Powered by Upstash Redis (Edge-compatible)
 */

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn('[RATELIMIT] Upstash Redis credentials missing. Falling back to permissive mode.');
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// 1. Global Standard Rate Limit (10 requests per 10 seconds per IP)
export const globalRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
  prefix: 'ds:ratelimit:global',
});

// 2. High-Depth Tool Rate Limit (e.g. AI Roadmap/ATS) - 5 requests per minute
export const toolRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
  prefix: 'ds:ratelimit:tool',
});

// 3. Login/Auth Attempt Rate Limit (5 attempts per 15 minutes as requested)
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
  prefix: 'ds:ratelimit:auth',
});

export { redis };
