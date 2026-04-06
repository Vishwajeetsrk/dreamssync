import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // In production, sync this to Supabase, Redis, or an analytics db
    console.log(`[USAGE LOG] User: ${data.userId || 'anon'} | Tokens: ${data.tokens || 0} | Tool: ${data.tool || 'chat'}`);
    
    return NextResponse.json({ success: true, logged: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log usage' }, { status: 400 });
  }
}
