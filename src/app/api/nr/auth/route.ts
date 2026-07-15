import { NextResponse } from 'next/server';
import { NR_ADMIN_PASSWORD, NR_STAFF_CODE, NR_COOKIE, signSession, type NrRole } from '@/lib/nr-auth';

const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string, max = 12, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > windowMs) { hits.set(ip, { n: 1, t: now }); return false; }
  h.n += 1;
  return h.n > max;
}

/* POST { role: 'couple'|'staff', secret } → sets the role cookie. */
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (limited(ip)) return NextResponse.json({ error: 'Too many attempts — try again shortly.' }, { status: 429 });

  const b = await req.json().catch(() => ({}));
  const role = b.role as NrRole;
  const secret = String(b.secret ?? '');

  const ok =
    (role === 'couple' && secret === NR_ADMIN_PASSWORD) ||
    (role === 'staff' && secret.toUpperCase() === NR_STAFF_CODE.toUpperCase());

  if (!ok) return NextResponse.json({ error: 'That’s not quite right.' }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(NR_COOKIE[role], signSession(role), {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production',
    path: '/', maxAge: 30 * 24 * 60 * 60,
  });
  return res;
}

/* DELETE → sign out both roles. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(NR_COOKIE.couple, '', { path: '/', maxAge: 0 });
  res.cookies.set(NR_COOKIE.staff, '', { path: '/', maxAge: 0 });
  return res;
}
