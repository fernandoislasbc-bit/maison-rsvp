import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { writeFile } from 'fs/promises';
import path from 'path';
import { nrRead, nrWrite, findByCode, NR_MEDIA_DIR, type NrMemory } from '@/lib/nr-db';

const MAX_PHOTO = 1.5 * 1024 * 1024;   // client compresses to JPEG first
const MAX_VIDEO = 25 * 1024 * 1024;

/* GET → approved memories (the shared gallery). */
export async function GET() {
  const db = await nrRead();
  const approved = db.memories
    .filter(m => m.status === 'approved')
    .sort((a, b) => b.at - a.at)
    .map(m => ({ id: m.id, guestName: m.guestName, type: m.type, caption: m.caption, mediaId: m.mediaId, mime: m.mime, at: m.at }));
  return NextResponse.json({ memories: approved });
}

/* POST — a guest contribution.
   Written message: JSON { code, type:'message', caption }.
   Photo/video:     binary body + headers x-nr-code, x-nr-type, x-nr-caption, content-type. */
export async function POST(req: Request) {
  try {
    const ct = req.headers.get('content-type') ?? '';

    if (ct.includes('application/json')) {
      const b = await req.json();
      const caption = String(b.caption ?? '').trim().slice(0, 600);
      if (!caption) return NextResponse.json({ error: 'Write a few words first.' }, { status: 400 });
      const out = await nrWrite(db => {
        const guest = findByCode(db, String(b.code ?? ''));
        if (!guest) return null;
        const mem: NrMemory = {
          id: randomBytes(8).toString('hex'), guestId: guest.id, guestName: guest.name,
          type: 'message', caption, status: 'pending', at: Date.now(),
        };
        db.memories.push(mem);
        return mem.id;
      });
      if (!out) return NextResponse.json({ error: 'We couldn’t verify your invitation code.' }, { status: 403 });
      return NextResponse.json({ ok: true, id: out });
    }

    /* Binary upload */
    const code = req.headers.get('x-nr-code') ?? '';
    const type = req.headers.get('x-nr-type') === 'video' ? 'video' : 'photo';
    const caption = decodeURIComponent(req.headers.get('x-nr-caption') ?? '').slice(0, 300);
    const buf = Buffer.from(await req.arrayBuffer());

    if (buf.length === 0) return NextResponse.json({ error: 'Nothing was received.' }, { status: 400 });
    if (type === 'photo' && buf.length > MAX_PHOTO) return NextResponse.json({ error: 'That photograph is too large.' }, { status: 413 });
    if (type === 'video' && buf.length > MAX_VIDEO) return NextResponse.json({ error: 'Videos are limited to 25 MB — a shorter clip will be perfect.' }, { status: 413 });
    if (type === 'photo' && !(buf[0] === 0xff && buf[1] === 0xd8)) {
      return NextResponse.json({ error: 'Unsupported image format.' }, { status: 415 });
    }

    const mediaId = randomBytes(12).toString('hex');
    const mime = type === 'photo' ? 'image/jpeg' : (ct || 'video/mp4');

    const out = await nrWrite(async db => {
      const guest = findByCode(db, code);
      if (!guest) return null;
      await writeFile(path.join(NR_MEDIA_DIR, mediaId), buf);
      const mem: NrMemory = {
        id: randomBytes(8).toString('hex'), guestId: guest.id, guestName: guest.name,
        type, caption, mediaId, mime, status: 'pending', at: Date.now(),
      };
      db.memories.push(mem);
      return mem.id;
    });
    if (!out) return NextResponse.json({ error: 'We couldn’t verify your invitation code.' }, { status: 403 });
    return NextResponse.json({ ok: true, id: out });
  } catch {
    return NextResponse.json({ error: 'The upload didn’t make it — please try again.' }, { status: 500 });
  }
}
