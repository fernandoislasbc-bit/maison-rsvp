import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { mkdir, writeFile, readdir, stat, unlink } from 'fs/promises';
import path from 'path';
import { PHOTO_DIR } from '@/lib/photo-dir';

/* Photograph storage for designed Editions.
   Compressed JPEGs only, stored on disk outside the repo tree,
   removed automatically ~12 months after creation. */
const MAX_BYTES = 1.2 * 1024 * 1024;
const RETENTION_MS = 370 * 24 * 60 * 60 * 1000;

const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string, max = 12, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > windowMs) { hits.set(ip, { n: 1, t: now }); return false; }
  h.n += 1;
  return h.n > max;
}

async function sweepOld() {
  try {
    const files = await readdir(PHOTO_DIR);
    const now = Date.now();
    for (const f of files) {
      const p = path.join(PHOTO_DIR, f);
      const s = await stat(p).catch(() => null);
      if (s && now - s.mtimeMs > RETENTION_MS) await unlink(p).catch(() => {});
    }
  } catch { /* dir may not exist yet */ }
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (limited(ip)) {
    return NextResponse.json({ error: 'Too many photographs uploaded — please try again later.' }, { status: 429 });
  }

  try {
    const buf = Buffer.from(await req.arrayBuffer());
    if (buf.length === 0) return NextResponse.json({ error: 'No photograph received.' }, { status: 400 });
    if (buf.length > MAX_BYTES) return NextResponse.json({ error: 'The photograph is too large.' }, { status: 413 });
    // JPEG magic bytes — the studio always uploads re-encoded JPEG
    if (!(buf[0] === 0xff && buf[1] === 0xd8)) {
      return NextResponse.json({ error: 'Unsupported image format.' }, { status: 415 });
    }

    const id = randomBytes(12).toString('hex');
    await mkdir(PHOTO_DIR, { recursive: true });
    await writeFile(path.join(PHOTO_DIR, `${id}.jpg`), buf);
    void sweepOld();
    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: 'The photograph could not be saved.' }, { status: 500 });
  }
}
