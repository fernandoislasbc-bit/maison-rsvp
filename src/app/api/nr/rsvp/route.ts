import { NextResponse } from 'next/server';
import { nrWrite, findByCode, publicGuest, NR_EVENT } from '@/lib/nr-db';
import { passToken } from '@/lib/nr-auth';

/* POST { code, attending, seats, meals[], dietary, note }
   Accepting activates a fresh entrance pass; declining deactivates it. */
export async function POST(req: Request) {
  try {
    const b = await req.json();
    const code = String(b.code ?? '');
    const attending = b.attending === true;

    const out = await nrWrite(db => {
      const guest = findByCode(db, code);
      if (!guest) return null;

      const seats = attending
        ? Math.max(1, Math.min(guest.seats, Number(b.seats) || 1))
        : 0;
      const meals = attending
        ? (Array.isArray(b.meals) ? b.meals : [])
            .slice(0, seats)
            .map((m: unknown) => NR_EVENT.meals.includes(String(m)) ? String(m) : NR_EVENT.meals[0])
        : [];

      guest.rsvp = {
        attending,
        seatsConfirmed: seats,
        meals,
        dietary: String(b.dietary ?? '').slice(0, 160),
        note: String(b.note ?? '').slice(0, 400),
        at: Date.now(),
      };
      // A new answer supersedes any earlier pass.
      guest.passVersion += 1;
      guest.passActive = attending;
      guest.checkedInAt = null;

      return {
        guest: publicGuest(guest),
        pass: attending ? passToken(guest.id, guest.passVersion) : null,
      };
    });

    if (!out) return NextResponse.json({ error: 'Invitation not found.' }, { status: 404 });
    return NextResponse.json(out);
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
