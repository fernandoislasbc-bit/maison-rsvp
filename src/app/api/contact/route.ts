import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Contact submission received:', body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact submission error:', err);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
