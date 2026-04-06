import { NextResponse } from 'next/server';

export async function GET() {
  // Simple rate-limiting & usage checking logic can go before generating the token.
  const apiKey = process.env.API_KEY_21ST;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'Agent SDK API Key is not configured on the server.' }, { status: 500 });
  }

  // In a real implementation with 21st SDK or similar, you'd exchange the long-lived API key
  // for a short-lived token meant to be safely sent to the client browser for streaming chat.
  // We mock a returned token here for the frontend integration.
  const shortLivedToken = 'tok_' + Math.random().toString(36).substring(2) + Date.now();

  return NextResponse.json({ token: shortLivedToken });
}
