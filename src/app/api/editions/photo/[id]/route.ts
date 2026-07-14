import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { PHOTO_DIR } from '@/lib/photo-dir';

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params;
  if (!/^[a-f0-9]{24}$/.test(id)) return new NextResponse(null, { status: 404 });
  try {
    const buf = await readFile(path.join(PHOTO_DIR, `${id}.jpg`));
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
