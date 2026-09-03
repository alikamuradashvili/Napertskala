import { env } from 'cloudflare:workers';
import { randomToken } from '@/lib/server';

export async function GET(request: Request) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return Response.redirect(new URL('/login?error=google_unavailable', request.url), 302);
  const state = randomToken(24); const origin = env.SITE_ORIGIN || new URL(request.url).origin; const redirectUri = `${origin}/api/auth/google/callback`;
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', env.GOOGLE_CLIENT_ID); url.searchParams.set('redirect_uri', redirectUri); url.searchParams.set('response_type','code'); url.searchParams.set('scope','openid email profile'); url.searchParams.set('state',state); url.searchParams.set('prompt','select_account');
  return new Response(null, { status:302, headers:{ Location:url.toString(), 'Set-Cookie':`napertskala_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600` } });
}
