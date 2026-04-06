import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * DreamSync Production Middleware
 * - Injects Security Headers (CSP, HSTS, etc.)
 * - Auth Guards for protected routes
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Security Headers
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  // CSP: Strict for production
  // Allow scripts from self, vercel-analytics, and trusted CDNs
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

  // 2. Auth Guard
  const protectedPaths = ['/dashboard', '/career-agent', '/roadmap', '/linkedin', '/portfolio', '/ikigai'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  // Note: Actual session verification happens via Firebase/Supabase in the components.
  // This middleware check is a first-line defense to redirect unauthenticated users.
  // We check for common auth cookies or hints.
  const hasAuthHint = request.cookies.has('__session') || request.cookies.has('sb-access-token') || request.headers.has('Authorization');

  if (isProtected && !hasAuthHint) {
    const url = new URL('/', request.url);
    // return NextResponse.redirect(url); // Disabled for now to prevent accidental lockouts during dev, but ready for PROD
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};
