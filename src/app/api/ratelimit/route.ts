import { NextResponse, NextRequest } from 'next/server';

const ipCache = new Map<string, { count: number, resetTime: number }>();

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'localhost';
  const now = Date.now();
  
  if (!ipCache.has(ip)) {
    ipCache.set(ip, { count: 1, resetTime: now + 60000 }); // 1 min window
    return NextResponse.json({ rateLimited: false, count: 1 });
  }

  const record = ipCache.get(ip)!;
  if (now > record.resetTime) {
    ipCache.set(ip, { count: 1, resetTime: now + 60000 });
    return NextResponse.json({ rateLimited: false, count: 1 });
  }

  // Allow 50 requests per minute
  if (record.count >= 50) {
    return NextResponse.json({ rateLimited: true, message: 'Too many requests' }, { status: 429 });
  }

  record.count += 1;
  return NextResponse.json({ rateLimited: false, count: record.count });
}
