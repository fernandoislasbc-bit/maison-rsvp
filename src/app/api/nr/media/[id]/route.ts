import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { nrRead, NR_MEDIA_DIR } from '@/lib/nr-db';

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params;
  if (!/^[a-f0-9]{24}$/.test(id)) return new NextResponse(null, { status: 404 });
  try {
    const db = await nrRead();
    const mem = db.memories.find(m => m.mediaId === id);
    if (!mem) return new NextResponse(null, { status: 404 });
    const buf = await readFile(path.join(NR_MEDIA_DIR, id));
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        'Content-Type': mem.mime ?? 'application/octet-stream',
        'Cache-Control': 'private, max-age=3600',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
