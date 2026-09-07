import { env } from 'cloudflare:workers';
import { createSession, getDb, normalizeEmail } from '@/lib/server';
import { canAccessAdmin, canSignIn } from '@/lib/access';

export async function GET(request: Request) {
  const url = new URL(request.url); const origin = env.SITE_ORIGIN || url.origin; const state = url.searchParams.get('state'); const code = url.searchParams.get('code');
  const cookieState = request.headers.get('cookie')?.match(/(?:^|;\s*)napertskala_oauth_state=([^;]+)/)?.[1];
  const fail = (message:string) => Response.redirect(`${origin}/login?error=${encodeURIComponent(message)}`,302);
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !state || !code || state !== cookieState) return fail('Google sign-in could not be verified.');
  const redirectUri = `${origin}/api/auth/google/callback`;
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({code,client_id:env.GOOGLE_CLIENT_ID,client_secret:env.GOOGLE_CLIENT_SECRET,redirect_uri:redirectUri,grant_type:'authorization_code'})});
  if (!tokenResponse.ok) return fail('Google sign-in failed.');
  const tokens = await tokenResponse.json() as {id_token?:string}; if (!tokens.id_token) return fail('Google did not return an identity.');
  const infoResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(tokens.id_token)}`); if (!infoResponse.ok) return fail('Google identity validation failed.');
  const profile = await infoResponse.json() as {sub:string;email:string;name?:string;email_verified?:string;aud?:string};
  if (profile.aud !== env.GOOGLE_CLIENT_ID || profile.email_verified !== 'true') return fail('A verified Google account is required.');
  const email = normalizeEmail(profile.email); const db = await getDb();
  const user = await db.prepare(`SELECT id,email,name,role,status,google_sub,created_at FROM users WHERE google_sub=? OR email=? LIMIT 1`).bind(profile.sub,email).first<{id:string;status:string;role:string;google_sub:string|null}>();
  if (!user || !canSignIn(user) || (user.google_sub && user.google_sub !== profile.sub)) return fail('This Google account is not authorized. Ask the site owner to add it first.');
  if (!user.google_sub) await db.prepare('UPDATE users SET google_sub=?,updated_at=? WHERE id=?').bind(profile.sub,Date.now(),user.id).run();
  const session = await createSession(user.id);
  const secure = origin.startsWith('https://') ? '; Secure' : '';
  const headers = new Headers({ Location:`${origin}${canAccessAdmin(user)?'/admin':'/'}`, 'Cache-Control':'no-store', 'Referrer-Policy':'no-referrer' });
  headers.append('Set-Cookie',session.cookie);
  headers.append('Set-Cookie',`napertskala_oauth_state=; Path=/; HttpOnly${secure}; SameSite=Lax; Max-Age=0`);
  return new Response(null,{status:302,headers});
}
