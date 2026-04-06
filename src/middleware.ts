import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * DreamSync Production Middleware
 * - Injects Security Headers (CSP, HSTS, etc.)
 * - Auth Guards for protected routes
 * - Bot/Crawler Blocking
 */

// Common malicious bot user-agents to block
const BANNED_BOTS = [
  'dotbot', 'rogerbot', 'showyoubot', 'baiduspider', 'ahrefsbot',
  'petalbot', 'mj12bot', 'semanticscholarbot', 'grapeshotcrawler',
  'exabot', 'semrushbot', 'yandexbot', 'megaindex', 'blexbot'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

  // 1. Bot Blocking
  if (BANNED_BOTS.some(bot => userAgent.includes(bot))) {
    return new NextResponse('Crawler protection active.', { status: 403 });
  }

  // 2. Security Headers
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  // CSP: Production-hardened with Google/Firebase support
  const cspHeader = `
    default-src 'self';
    connect-src 'self' 
      https://identitytoolkit.googleapis.com 
      https://securetoken.googleapis.com 
      https://*.googleapis.com 
      https://*.firebaseio.com 
      https://*.firebase.com 
      https://vitals.vercel-insights.com;
    script-src 'self' 'unsafe-eval' 'unsafe-inline' 
      https://va.vercel-scripts.com 
      https://challenges.cloudflare.com 
      https://apis.google.com 
      https://www.gstatic.com 
      https://*.firebaseapp.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*.googleusercontent.com https://*.vercel.app https://*.gstatic.com;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' 
      https://challenges.cloudflare.com 
      https://dreamsync-d153d.firebaseapp.com 
      https://*.firebaseapp.com;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Apply security headers to response
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');

  // 3. Auth Guard (Active for Production)
  const protectedPaths = ['/dashboard', '/career-agent', '/roadmap', '/linkedin', '/portfolio', '/ikigai'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  // Firebase/Supabase auth hints
  const hasAuthHint = request.cookies.has('__session') || request.cookies.has('sb-access-token') || request.headers.has('Authorization');

  // Activate redirect only if we are in production or have been explicitly told to enable full security
  if (isProtected && !hasAuthHint && process.env.NODE_ENV === 'production') {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (handled individually in routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (images, logos)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};
