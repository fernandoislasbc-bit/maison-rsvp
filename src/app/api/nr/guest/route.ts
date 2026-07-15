import { NextResponse } from 'next/server';
import { nrRead, findByCode, publicGuest, NR_EVENT } from '@/lib/nr-db';
import { passToken } from '@/lib/nr-auth';

/* POST { code } → the guest's invitation data (their door key). */
export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    if (typeof code !== 'string' || code.trim().length < 4) {
      return NextResponse.json({ error: 'Please enter your access code.' }, { status: 400 });
    }
    const db = await nrRead();
    const guest = findByCode(db, code);
    if (!guest) {
      return NextResponse.json({ error: 'We couldn’t find that code — check your invitation card.' }, { status: 404 });
    }
    return NextResponse.json({
      guest: publicGuest(guest),
      event: NR_EVENT,
      pass: guest.passActive && guest.rsvp?.attending ? passToken(guest.id, guest.passVersion) : null,
    });
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
