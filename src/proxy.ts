import { NextRequest, NextResponse } from 'next/server';
import { globalRateLimit, authRateLimit, toolRateLimit } from './lib/ratelimit';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Next.js 16 Type Fix: access IP via casting or headers
  const ip = (request as any).ip ?? request.headers.get('x-forwarded-for') ?? '127.0.0.1';

  // 1. RATE LIMITING FOR ALL API ROUTES
  if (pathname.startsWith('/api/')) {
    // Specialized Tool Rate Limiting (Roadmap, ATS, LinkedIn, Career Agent, Mental Health)
    if (
      pathname.includes('/roadmap') || 
      pathname.includes('/ats-check') || 
      pathname.includes('/linkedin') ||
      pathname.includes('/career-agent') ||
      pathname.includes('/mental-health')
    ) {
      const { success, limit, remaining, reset } = await toolRateLimit.limit(`tool_${ip}`);
      if (!success) return rateLimitResponse(limit, remaining, reset, 'AI Tool rate limit exceeded.');
    } else {
      // Standard Global Rate Limit (Global API)
      const { success, limit, remaining, reset } = await globalRateLimit.limit(`global_${ip}`);
      if (!success) return rateLimitResponse(limit, remaining, reset, 'Global rate limit exceeded.');
    }
  }

  // 2. SPECIFIC RATE LIMITING FOR LOGIN/SIGNUP PAGES (Max 5 attempts / 15 min as requested)
  if (pathname === '/login' || pathname === '/signup') {
    const { success, limit, remaining, reset } = await authRateLimit.limit(`auth_page_${ip}`);
    if (!success) return rateLimitResponse(limit, remaining, reset, 'Login attempt limit exceeded. Please try again in 15 minutes.');
  }

  return NextResponse.next();
}

function rateLimitResponse(limit: number, remaining: number, reset: number, customMessage: string) {
  return new NextResponse(
    JSON.stringify({ error: 'Too Many Requests', message: customMessage }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      },
    }
  );
}

export const config = {
  matcher: ['/api/:path*', '/login', '/signup'],
};
