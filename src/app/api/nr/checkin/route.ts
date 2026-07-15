import { NextRequest, NextResponse } from 'next/server';
import { nrRead, nrWrite } from '@/lib/nr-db';
import { NR_COOKIE, verifySession, parsePass } from '@/lib/nr-auth';

const canScan = (req: NextRequest) =>
  verifySession(req.cookies.get(NR_COOKIE.staff)?.value, 'staff') ||
  verifySession(req.cookies.get(NR_COOKIE.couple)?.value, 'couple');

type Verdict = {
  ok: boolean;
  state: 'valid' | 'already' | 'revoked' | 'declined' | 'invalid';
  guest?: { id: string; name: string; seats: number; dietary: string; checkedInAt: number | null };
  detail: string;
};

async function evaluate(raw: string): Promise<Verdict> {
  const parsed = parsePass(raw);
  if (!parsed) return { ok: false, state: 'invalid', detail: 'This code is not a valid entrance pass.' };
  const db = await nrRead();
  const g = db.guests.find(x => x.id === parsed.guestId);
  if (!g) return { ok: false, state: 'invalid', detail: 'No guest matches this pass.' };
  const guest = { id: g.id, name: g.name, seats: g.rsvp?.seatsConfirmed ?? 0, dietary: g.rsvp?.dietary ?? '', checkedInAt: g.checkedInAt };
  if (!g.rsvp?.attending) return { ok: false, state: 'declined', guest, detail: 'This guest declined the invitation.' };
  if (g.passVersion !== parsed.passVersion || !g.passActive)
    return { ok: false, state: 'revoked', guest, detail: 'This pass has been cancelled or replaced.' };
  if (g.checkedInAt) return { ok: false, state: 'already', guest, detail: 'Already checked in.' };
  return { ok: true, state: 'valid', guest, detail: 'Pass verified.' };
}

/* POST { pass } → validate (no side effects). */
export async function POST(req: NextRequest) {
  if (!canScan(req)) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  return NextResponse.json(await evaluate(String(b.pass ?? '')));
}

/* PUT { pass } → admit (validates again, then marks arrival). */
export async function PUT(req: NextRequest) {
  if (!canScan(req)) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const raw = String(b.pass ?? '');

  const verdict = await nrWrite(async db => {
    const v = await evaluate(raw);
    if (!v.ok || !v.guest) return v;
    const g = db.guests.find(x => x.id === v.guest!.id);
    if (!g) return { ...v, ok: false as const, state: 'invalid' as const, detail: 'No guest matches this pass.' };
    if (g.checkedInAt) return { ...v, ok: false as const, state: 'already' as const, detail: 'Already checked in.' };
    g.checkedInAt = Date.now();
    return { ...v, guest: { ...v.guest, checkedInAt: g.checkedInAt }, detail: 'Admitted.' };
  });

  return NextResponse.json(verdict);
}
