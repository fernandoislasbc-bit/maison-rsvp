import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { decodeEdition } from '@/lib/editions';

const resend = new Resend(process.env.MAISON_EMAIL_KEY);

const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string, max = 15, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > windowMs) { hits.set(ip, { n: 1, t: now }); return false; }
  h.n += 1;
  return h.n > max;
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function POST(req: Request) {
  if (!process.env.MAISON_EMAIL_KEY) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
  }
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (limited(ip)) {
    return NextResponse.json({ error: 'Too many replies — please try again later.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const token = String(body.token ?? '');
    const guest = String(body.guest ?? '').trim().slice(0, 80);
    const attending = body.attending === true;
    const note = String(body.note ?? '').trim().slice(0, 400);

    if (!guest) return NextResponse.json({ error: 'Please add your name.' }, { status: 400 });

    const edition = await decodeEdition(token);
    if (!edition) return NextResponse.json({ error: 'This invitation link is not valid.' }, { status: 400 });

    const hosts = [edition.n1, edition.n2].filter(Boolean).join(' & ');

    const { error } = await resend.emails.send({
      from:    'Maison Editions <concierge@maisonrsvp.ca>',
      to:      edition.e,
      subject: `RSVP — ${guest} ${attending ? 'is attending' : 'sends regrets'} · ${hosts}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
          <div style="border-bottom: 1px solid #c9a882; padding-bottom: 20px; margin-bottom: 20px;">
            <p style="font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: #a2815a; margin: 0 0 6px;">Maison Editions — RSVP</p>
            <h1 style="font-size: 20px; font-weight: 400; margin: 0;">${esc(guest)} ${attending ? 'is attending' : 'is unable to attend'}</h1>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 15px; line-height: 1.8;">
            <tr><td style="color: #888; width: 140px; padding: 4px 0;">Invitation</td><td>${esc(hosts)} — ${esc(edition.d)}</td></tr>
            <tr><td style="color: #888; padding: 4px 0;">Guest</td><td><strong>${esc(guest)}</strong></td></tr>
            <tr><td style="color: #888; padding: 4px 0;">Reply</td><td>${attending ? 'Attending' : 'Regrets'}</td></tr>
            ${note ? `<tr><td style="color: #888; padding: 4px 0; vertical-align: top;">Note</td><td style="font-style: italic;">${esc(note)}</td></tr>` : ''}
          </table>
          <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #aaa;">
            Sent by your free Maison Editions invitation · <a href="https://maisonrsvp.ca/invitation-maker" style="color: #a2815a;">maisonrsvp.ca</a>
          </div>
        </div>
      `,
    });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'The reply could not be delivered. Please try again.' }, { status: 500 });
  }
}
