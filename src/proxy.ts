import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * DreamSync Production Proxy (v5 - SHIELD RE-ENABLED)
 * - Restoring full 2026 CSP protection for Cloudflare/Firebase
 */

const BANNED_BOTS = ['dotbot', 'rogerbot', 'showyoubot', 'baiduspider', 'ahrefsbot', 'petalbot'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

  // 1. Bot Blocking
  if (BANNED_BOTS.some(bot => userAgent.includes(bot))) {
    return new NextResponse('Crawler protection active.', { status: 403 });
  }

  // 2. Security Headers (Restored CSP)
  const cspHeader = `
    default-src 'self';
    connect-src 'self' 
      https://*.googleapis.com 
      https://*.firebaseio.com 
      https://*.firebase.com 
      https://*.cloudflare.com 
      https://*.cloudflareinsights.com
      https://vitals.vercel-insights.com;
    script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:
      https://va.vercel-scripts.com 
      https://*.cloudflare.com 
      https://*.cloudflareinsights.com
      https://apis.google.com 
      https://www.gstatic.com 
      https://*.firebaseapp.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.cloudflare.com;
    img-src 'self' blob: data: https://*.googleusercontent.com https://*.vercel.app https://*.gstatic.com https://*.cloudflare.com;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self' https://*.firebaseapp.com;
    frame-ancestors 'none';
    frame-src 'self' https://*.cloudflare.com https://*.firebaseapp.com;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  const response = NextResponse.next();

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // 3. Auth Guard (Production Only)
  const protectedPaths = ['/dashboard', '/career-agent', '/roadmap', '/linkedin', '/portfolio', '/ikigai'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  const hasAuthHint = request.cookies.has('__session') || request.cookies.has('sb-access-token') || request.headers.has('Authorization');

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
