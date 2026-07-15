import { NextRequest, NextResponse } from 'next/server';
import { nrRead, nrWrite, nrReset, newCode, NR_EVENT, type NrGuest } from '@/lib/nr-db';
import { NR_COOKIE, verifySession, passToken } from '@/lib/nr-auth';

const unauthorized = () => NextResponse.json({ error: 'Please sign in.' }, { status: 401 });

const isCouple = (req: NextRequest) =>
  verifySession(req.cookies.get(NR_COOKIE.couple)?.value, 'couple');

/* GET → everything the dashboard needs. */
export async function GET(req: NextRequest) {
  if (!isCouple(req)) return unauthorized();
  const db = await nrRead();
  return NextResponse.json({
    event: NR_EVENT,
    guests: db.guests.map(g => ({ ...g, pass: g.passActive && g.rsvp?.attending ? passToken(g.id, g.passVersion) : null })),
    memories: [...db.memories].sort((a, b) => b.at - a.at),
  });
}

/* POST { action, ... } — every couple-side mutation. */
export async function POST(req: NextRequest) {
  if (!isCouple(req)) return unauthorized();
  const b = await req.json().catch(() => ({}));

  try {
    switch (b.action) {
      case 'addGuest': {
        const name = String(b.name ?? '').trim().slice(0, 80);
        const seats = Math.max(1, Math.min(10, Number(b.seats) || 1));
        const message = String(b.message ?? '').trim().slice(0, 400);
        if (!name) return NextResponse.json({ error: 'The guest needs a name.' }, { status: 400 });
        const guest = await nrWrite(db => {
          const g: NrGuest = {
            id: `n${Date.now().toString(36)}`, code: newCode(db),
            name, seats, message,
            rsvp: null, passVersion: 1, passActive: false, checkedInAt: null,
          };
          db.guests.push(g);
          return g;
        });
        return NextResponse.json({ ok: true, guest });
      }

      case 'editGuest': {
        const ok = await nrWrite(db => {
          const g = db.guests.find(x => x.id === b.id);
          if (!g) return false;
          if (typeof b.name === 'string' && b.name.trim()) g.name = b.name.trim().slice(0, 80);
          if (b.seats != null) g.seats = Math.max(1, Math.min(10, Number(b.seats) || g.seats));
          if (typeof b.message === 'string') g.message = b.message.trim().slice(0, 400);
          return true;
        });
        return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Guest not found.' }, { status: 404 });
      }

      case 'deleteGuest': {
        await nrWrite(db => { db.guests = db.guests.filter(x => x.id !== b.id); });
        return NextResponse.json({ ok: true });
      }

      case 'togglePass': {
        // Deactivate = void every issued QR; reactivate issues a fresh pass.
        const out = await nrWrite(db => {
          const g = db.guests.find(x => x.id === b.id);
          if (!g) return null;
          g.passVersion += 1;
          g.passActive = !g.passActive && !!g.rsvp?.attending;
          if (!g.passActive) g.checkedInAt = null;
          return { passActive: g.passActive };
        });
        return out ? NextResponse.json({ ok: true, ...out }) : NextResponse.json({ error: 'Guest not found.' }, { status: 404 });
      }

      case 'undoCheckin': {
        await nrWrite(db => {
          const g = db.guests.find(x => x.id === b.id);
          if (g) g.checkedInAt = null;
        });
        return NextResponse.json({ ok: true });
      }

      case 'moderateMemory': {
        const status = ['approved', 'hidden', 'pending'].includes(b.status) ? b.status : 'pending';
        await nrWrite(db => {
          const m = db.memories.find(x => x.id === b.id);
          if (m) m.status = status;
        });
        return NextResponse.json({ ok: true });
      }

      case 'removeMemory': {
        await nrWrite(db => { db.memories = db.memories.filter(x => x.id !== b.id); });
        return NextResponse.json({ ok: true });
      }

      case 'reset': {
        await nrReset();
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
