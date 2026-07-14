import { NextResponse } from 'next/server';
import { encodeEdition, validateEdition, EDITION_LIMITS, type Edition } from '@/lib/editions';

// Small in-memory rate limit — resets on restart, enough to deter abuse.
const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string, max = 20, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > windowMs) { hits.set(ip, { n: 1, t: now }); return false; }
  h.n += 1;
  return h.n > max;
}

const clip = (s: unknown, n: number) => String(s ?? '').trim().slice(0, n);

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (limited(ip)) {
    return NextResponse.json({ error: 'Too many invitations created — please try again later.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const L = EDITION_LIMITS;
    const data: Edition = {
      t:  body.t,
      n1: clip(body.n1, L.name),
      n2: clip(body.n2, L.name),
      o:  clip(body.o, L.occasion) || 'invite you to celebrate',
      d:  clip(body.d, L.date),
      h:  clip(body.h, L.time),
      v:  clip(body.v, L.venue),
      c:  clip(body.c, L.city),
      m:  clip(body.m, L.message),
      e:  clip(body.e, 120).toLowerCase(),
    };

    const problem = validateEdition(data);
    if (problem) return NextResponse.json({ error: problem }, { status: 400 });

    const token = await encodeEdition(data);
    return NextResponse.json({ url: `/e/${token}` });
  } catch {
    return NextResponse.json({ error: 'Something went wrong composing the invitation.' }, { status: 500 });
  }
}
