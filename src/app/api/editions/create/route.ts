import { NextResponse } from 'next/server';
import { encodeEdition, validateEdition, EDITION_LIMITS, type Edition, type DesignedPayload } from '@/lib/editions';
import { DEFAULT_DESIGN, BUILDER_LIMITS, THEMES, TREATMENTS, TYPE_PAIRINGS, type InvitationDesign } from '@/lib/builder-config';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function sanitizeDesign(raw: unknown): InvitationDesign | string {
  const b = (raw ?? {}) as Partial<InvitationDesign> & { details?: Partial<InvitationDesign['details']> };
  const L = BUILDER_LIMITS;
  const c = (v: unknown, n: number) => String(v ?? '').trim().slice(0, n);
  const det: Partial<InvitationDesign['details']> = b.details ?? {};
  const design: InvitationDesign = {
    ...DEFAULT_DESIGN,
    occasion: c(b.occasion, 24),
    theme: THEMES.some(t => t.id === b.theme) ? b.theme! : 'timeless',
    image: null,
    imagePosition: { x: 50, y: 50, zoom: 1 },
    imageEffect: TREATMENTS.some(t => t.id === b.imageEffect) ? b.imageEffect! : '',
    typography: TYPE_PAIRINGS.some(t => t.id === b.typography) ? b.typography! : 'classic',
    alignment: b.alignment === 'left' ? 'left' : 'center',
    scale: b.scale === 'intimate' || b.scale === 'grand' ? b.scale : 'classic',
    details: {
      title: c(det.title, L.title), names: c(det.names, L.names),
      date: c(det.date, L.date), time: c(det.time, L.time),
      venue: c(det.venue, L.venue), location: c(det.location, L.location),
      message: c(det.message, L.message),
      rsvpLabel: c(det.rsvpLabel, L.rsvpLabel) || 'Kindly reply',
      rsvpUrl: c(det.rsvpUrl, L.rsvpUrl),
      email: c(det.email, 120).toLowerCase(),
    },
  };
  const d = design.details;
  if (!d.names) return 'Please add the names or hosts.';
  if (!d.date) return 'Please add the date.';
  if (!d.venue) return 'Please add the venue.';
  if (d.rsvpUrl && !/^https?:\/\/.+\..+/.test(d.rsvpUrl)) return 'The RSVP link should start with https://';
  if (!d.rsvpUrl && !EMAIL_RE.test(d.email)) return 'A valid email is needed to receive replies.';
  return design;
}

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

    // Designed invitation from the studio configurator
    if (body.k === 'd') {
      const design = sanitizeDesign(body.design);
      if (typeof design === 'string') return NextResponse.json({ error: design }, { status: 400 });
      const payload: DesignedPayload = { k: 'd', e: design.details.email, design };
      const token = await encodeEdition(payload);
      return NextResponse.json({ url: `/e/${token}` });
    }

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
