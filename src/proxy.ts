import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * DreamSync Production Proxy (v4 - Troubleshoot Mode)
 * - CSP SHIELD: DISABLED TEMPORARILY to resolve network handshakes
 */

const BANNED_BOTS = ['dotbot', 'rogerbot', 'showyoubot', 'baiduspider', 'ahrefsbot', 'petalbot'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

  // 1. Bot Blocking
  if (BANNED_BOTS.some(bot => userAgent.includes(bot))) {
    return new NextResponse('Crawler protection active.', { status: 403 });
  }

  const response = NextResponse.next();

  // 2. Production Security Headers (Minimal for Debug)
  // We are NOT SETTING Content-Security-Policy right now to prove if external verification loads
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // 3. Auth Guard (Forced for Manual Testing)
  const protectedPaths = ['/dashboard', '/career-agent', '/roadmap', '/linkedin', '/portfolio', '/ikigai'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  const hasAuthHint = request.cookies.has('__session') || request.cookies.has('sb-access-token') || request.headers.has('Authorization');

  // Enable redirect for local testing if requested (Disabled by default to prevent loops)
  if (isProtected && !hasAuthHint && process.env.NODE_ENV === 'production') {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)'],
};
