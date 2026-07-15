'use client';

/* The personal invitation: their name on the envelope, the couple's
   note, the day itself, the RSVP — and, on acceptance, a signed QR
   entrance pass rendered on the spot. */

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { NR, nrSerif, nrItalic, nrSans, nrMicro, nrButton, nrInput, nrLabel } from '../../nr-theme';

type Guest = {
  id: string; name: string; seats: number; message: string;
  rsvp: null | { attending: boolean; seatsConfirmed: number; meals: string[]; dietary: string; note: string; at: number };
  passActive: boolean; checkedInAt: number | null;
};
type EventInfo = {
  couple: string; date: string; time: string; venue: string; city: string; dress: string;
  schedule: { t: string; title: string; line: string }[];
  meals: string[];
};

export default function InvitationClient({ code }: { code: string }) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [event, setEvent] = useState<EventInfo | null>(null);
  const [pass, setPass] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionStorage.setItem('nr-code', code.toUpperCase());
    fetch('/api/nr/guest', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then(async res => { const j = await res.json(); if (!res.ok) throw new Error(j.error); return j; })
      .then(j => { setGuest(j.guest); setEvent(j.event); setPass(j.pass); })
      .catch(err => setError(err instanceof Error ? err.message : 'Something went wrong.'));
  }, [code]);

  /* gentle reveal */
  useEffect(() => {
    if (!guest || !rootRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.visibilityState !== 'visible') return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.nr-reveal', { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 1, stagger: .12, ease: 'power3.out' });
    }, rootRef);
    return () => ctx.revert();
  }, [guest]);

  const onRsvped = useCallback((g: Guest, p: string | null) => {
    setGuest(g); setPass(p); setEditing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (error) {
    return (
      <Shell>
        <p style={{ ...nrItalic, color: NR.mist, fontSize: '1.05rem' }}>{error}</p>
        <Link href="/nr" style={{ ...nrButton(false), display: 'inline-block', textDecoration: 'none', marginTop: '2rem' }}>Enter your code</Link>
      </Shell>
    );
  }
  if (!guest || !event) {
    return <Shell><p style={{ ...nrItalic, color: NR.mist }}>Opening your invitation…</p></Shell>;
  }

  const answered = !!guest.rsvp && !editing;

  return (
    <div ref={rootRef} style={{ background: NR.velvetDeep, color: NR.ivory, minHeight: '100svh' }}>
      {/* ═══ Envelope hero ═══ */}
      <header style={{
        minHeight: '92svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: 'clamp(4rem,10vw,7rem) 1.5rem 3rem', position: 'relative', overflow: 'hidden',
        background: `radial-gradient(ellipse 100% 75% at 50% 25%, ${NR.burgundy} 0%, ${NR.velvet} 52%, ${NR.velvetDeep} 100%)`,
      }}>
        <p className="nr-reveal" style={{ ...nrMicro, color: NR.gold, marginBottom: '1.8rem' }}>
          {event.couple} · {event.city}
        </p>
        <p className="nr-reveal" style={{ ...nrItalic, fontSize: '1rem', color: NR.mist, marginBottom: '.9rem' }}>
          An invitation addressed to
        </p>
        <h1 className="nr-reveal" style={{ ...nrSerif, fontSize: 'clamp(2.1rem,7.5vw,4.2rem)', lineHeight: 1.1, maxWidth: '16ch' }}>
          {guest.name}
        </h1>
        <div className="nr-reveal" style={{ width: 68, height: 1, background: `linear-gradient(90deg, transparent, ${NR.gold}, transparent)`, margin: '2.2rem 0' }} />
        <p className="nr-reveal" style={{ ...nrSerif, fontSize: 'clamp(1rem,2.6vw,1.3rem)', color: NR.ivory }}>
          {event.date}
        </p>
        <p className="nr-reveal" style={{ ...nrItalic, fontSize: '.98rem', color: NR.mist, marginTop: '.6rem' }}>
          {event.time} — {event.venue}, {event.city}
        </p>

        {answered && (
          <div className="nr-reveal" style={{ marginTop: '2.4rem' }}>
            <span style={{
              ...nrMicro, fontSize: '.5rem', padding: '.7em 1.4em',
              color: guest.rsvp!.attending ? '#B8D4A8' : '#E0B4AC',
              border: `1px solid ${guest.rsvp!.attending ? 'rgba(184,212,168,.4)' : 'rgba(224,180,172,.4)'}`,
            }}>
              {guest.rsvp!.attending ? `Attending — ${guest.rsvp!.seatsConfirmed} ${guest.rsvp!.seatsConfirmed === 1 ? 'seat' : 'seats'}` : 'Regretfully declined'}
            </span>
          </div>
        )}
      </header>

      <main style={{ maxWidth: 620, margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        {/* ═══ Personal note ═══ */}
        <section style={{ padding: 'clamp(3rem,7vw,4.5rem) 0', borderBottom: `1px solid ${NR.line}`, textAlign: 'center' }}>
          <p style={{ ...nrMicro, color: NR.gold, marginBottom: '1.6rem' }}>A note for you</p>
          <p style={{ ...nrItalic, fontSize: 'clamp(1.05rem,2.6vw,1.25rem)', lineHeight: 1.9, color: 'rgba(244,235,221,.85)' }}>
            &ldquo;{guest.message}&rdquo;
          </p>
          <p style={{ ...nrSerif, fontSize: '.95rem', color: NR.gold, marginTop: '1.4rem' }}>— Neil &amp; Riley</p>
        </section>

        {/* ═══ The day ═══ */}
        <section style={{ padding: 'clamp(3rem,7vw,4.5rem) 0', borderBottom: `1px solid ${NR.line}` }}>
          <p style={{ ...nrMicro, color: NR.gold, marginBottom: '2rem', textAlign: 'center' }}>The day</p>
          {event.schedule.map(s => (
            <div key={s.t} style={{ display: 'flex', gap: '1.4rem', padding: '1rem 0', borderBottom: '1px solid rgba(201,163,90,.12)' }}>
              <span style={{ ...nrSans, fontSize: '.68rem', letterSpacing: '.18em', color: NR.gold, minWidth: 74, paddingTop: '.3em', fontVariantNumeric: 'tabular-nums' }}>{s.t}</span>
              <div>
                <p style={{ ...nrSerif, fontSize: '1.05rem' }}>{s.title}</p>
                <p style={{ ...nrItalic, fontSize: '.9rem', color: NR.mist, marginTop: '.25rem' }}>{s.line}</p>
              </div>
            </div>
          ))}
          <p style={{ ...nrItalic, fontSize: '.92rem', color: NR.mist, marginTop: '1.8rem', lineHeight: 1.8 }}>
            <strong style={{ ...nrMicro, fontSize: '.5rem', color: NR.gold, fontStyle: 'normal', display: 'block', marginBottom: '.5rem' }}>Dress</strong>
            {event.dress}
          </p>
        </section>

        {/* ═══ RSVP or pass ═══ */}
        {answered ? (
          <AnsweredSection guest={guest} pass={pass} onEdit={() => setEditing(true)} />
        ) : (
          <RsvpForm code={code} guest={guest} event={event} onDone={onRsvped} />
        )}
      </main>

      <footer style={{ borderTop: `1px solid ${NR.line}`, textAlign: 'center', padding: '1.6rem' }}>
        <span style={{ ...nrMicro, fontSize: '.48rem', color: 'rgba(244,235,221,.35)' }}>
          Crafted by Maison RSVP
        </span>
      </footer>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main style={{
      minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: NR.velvetDeep, color: NR.ivory, padding: '2rem', textAlign: 'center',
    }}>{children}</main>
  );
}

/* ═══ After answering: pass + memories link, or a graceful decline ═══ */
function AnsweredSection({ guest, pass, onEdit }: { guest: Guest; pass: string | null; onEdit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!pass || !canvasRef.current) return;
    import('qrcode').then(({ default: QRCode }) => {
      QRCode.toCanvas(canvasRef.current!, pass, {
        width: 220, margin: 1,
        color: { dark: '#1C0608', light: '#F4EBDD' },
      }).catch(() => {});
    });
  }, [pass]);

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/png');
    a.download = 'neil-riley-entrance-pass.png';
    a.click();
  };

  return (
    <section style={{ padding: 'clamp(3rem,7vw,4.5rem) 0', textAlign: 'center' }}>
      {guest.rsvp!.attending && pass ? (
        <>
          <p style={{ ...nrMicro, color: NR.gold, marginBottom: '1.2rem' }}>Your entrance pass</p>
          <p style={{ ...nrItalic, fontSize: '.95rem', color: NR.mist, maxWidth: '42ch', margin: '0 auto 2rem', lineHeight: 1.8 }}>
            Present this at the door on the evening — it admits {guest.rsvp!.seatsConfirmed}{' '}
            {guest.rsvp!.seatsConfirmed === 1 ? 'guest' : 'guests'}. Save it to your photos; it works offline.
          </p>
          <div style={{
            display: 'inline-block', padding: '1.4rem',
            background: NR.ivory, border: `1px solid ${NR.gold}`,
          }}>
            <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%' }} aria-label="Entrance pass QR code" />
            <p style={{ ...nrSerif, color: NR.velvetDeep, fontSize: '.9rem', marginTop: '.9rem' }}>{guest.name}</p>
            <p style={{ ...nrSans, color: '#6B6455', fontSize: '.62rem', letterSpacing: '.2em', textTransform: 'uppercase', marginTop: '.3rem' }}>
              October 9th · {guest.rsvp!.seatsConfirmed} {guest.rsvp!.seatsConfirmed === 1 ? 'seat' : 'seats'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '.8rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <button style={nrButton(true)} onClick={download}>Save my pass</button>
            <Link href="/nr/memories" style={{ ...nrButton(false), textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              Leave a memory →
            </Link>
          </div>
        </>
      ) : (
        <>
          <p style={{ ...nrSerif, fontSize: '1.3rem', marginBottom: '1rem' }}>You will be missed.</p>
          <p style={{ ...nrItalic, fontSize: '.98rem', color: NR.mist, maxWidth: '44ch', margin: '0 auto', lineHeight: 1.8 }}>
            Thank you for letting us know. If you’d still like to leave the couple a few words or a photograph,
            the <Link href="/nr/memories" style={{ color: NR.gold }}>memories page</Link> is open to you.
          </p>
        </>
      )}
      <div style={{ marginTop: '2.4rem' }}>
        <button onClick={onEdit} style={{ ...nrMicro, fontSize: '.5rem', color: NR.mist, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, padding: '.8em' }}>
          Change my reply
        </button>
      </div>
    </section>
  );
}

/* ═══ The RSVP form ═══ */
function RsvpForm({ code, guest, event, onDone }: {
  code: string; guest: Guest; event: EventInfo;
  onDone: (g: Guest, pass: string | null) => void;
}) {
  const [attending, setAttending] = useState<boolean | null>(guest.rsvp ? guest.rsvp.attending : null);
  const [seats, setSeats] = useState(guest.rsvp?.seatsConfirmed || guest.seats);
  const [meals, setMeals] = useState<string[]>(guest.rsvp?.meals ?? []);
  const [dietary, setDietary] = useState(guest.rsvp?.dietary ?? '');
  const [note, setNote] = useState(guest.rsvp?.note ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attending === null) { setError('Please choose whether you can join us.'); return; }
    setBusy(true); setError('');
    try {
      const res = await fetch('/api/nr/rsvp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code, attending, seats,
          meals: Array.from({ length: seats }, (_, i) => meals[i] ?? event.meals[0]),
          dietary, note,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Please try again.');
      onDone(j.guest, j.pass);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please try again.');
      setBusy(false);
    }
  };

  return (
    <section style={{ padding: 'clamp(3rem,7vw,4.5rem) 0' }}>
      <p style={{ ...nrMicro, color: NR.gold, marginBottom: '.9rem', textAlign: 'center' }}>Kindly reply</p>
      <p style={{ ...nrItalic, fontSize: '.92rem', color: NR.mist, textAlign: 'center', marginBottom: '2.4rem' }}>
        Your invitation is for up to {guest.seats} {guest.seats === 1 ? 'guest' : 'guests'}.
      </p>

      <form onSubmit={submit}>
        {/* attending? */}
        <div role="radiogroup" aria-label="Will you attend?" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.8rem', marginBottom: '2rem' }}>
          {([true, false] as const).map(v => (
            <button key={String(v)} type="button" role="radio" aria-checked={attending === v}
              onClick={() => setAttending(v)}
              style={{
                ...nrMicro, fontSize: '.52rem', cursor: 'pointer', minHeight: 52, padding: '1.1em',
                color: attending === v ? NR.velvetDeep : NR.ivory,
                background: attending === v ? NR.gold : 'transparent',
                border: `1px solid ${attending === v ? NR.gold : NR.goldSoft}`,
                transition: 'background .3s, color .3s',
              }}
            >{v ? 'Accepts with pleasure' : 'Regretfully declines'}</button>
          ))}
        </div>

        {attending && (
          <>
            {guest.seats > 1 && (
              <div style={{ marginBottom: '1.8rem' }}>
                <label htmlFor="nr-seats" style={nrLabel}>How many of you will join us?</label>
                <select id="nr-seats" value={seats} onChange={e => setSeats(Number(e.target.value))}
                  style={{ ...nrInput, appearance: 'none', cursor: 'pointer' }}>
                  {Array.from({ length: guest.seats }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n} style={{ background: NR.velvet }}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                  ))}
                </select>
              </div>
            )}

            {/* meal per seat */}
            {Array.from({ length: seats }, (_, i) => (
              <div key={i} style={{ marginBottom: '1.8rem' }}>
                <label htmlFor={`nr-meal-${i}`} style={nrLabel}>
                  {seats === 1 ? 'Dinner selection' : `Dinner — guest ${i + 1}`}
                </label>
                <select id={`nr-meal-${i}`} value={meals[i] ?? event.meals[0]}
                  onChange={e => setMeals(m => { const c = [...m]; c[i] = e.target.value; return c; })}
                  style={{ ...nrInput, appearance: 'none', cursor: 'pointer' }}>
                  {event.meals.map(m => <option key={m} value={m} style={{ background: NR.velvet }}>{m}</option>)}
                </select>
              </div>
            ))}

            <div style={{ marginBottom: '1.8rem' }}>
              <label htmlFor="nr-diet" style={nrLabel}>Dietary notes (optional)</label>
              <input id="nr-diet" value={dietary} onChange={e => setDietary(e.target.value)} style={nrInput} maxLength={160} />
            </div>
          </>
        )}

        {attending !== null && (
          <div style={{ marginBottom: '2.2rem' }}>
            <label htmlFor="nr-note" style={nrLabel}>A few words for the couple (optional)</label>
            <textarea id="nr-note" value={note} onChange={e => setNote(e.target.value)} rows={3} maxLength={400}
              style={{ ...nrInput, resize: 'none', lineHeight: 1.7 }} />
          </div>
        )}

        {error && <p role="alert" style={{ ...nrItalic, color: '#E08A80', marginBottom: '1.2rem' }}>{error}</p>}

        <button type="submit" disabled={busy || attending === null} style={{
          ...nrButton(true), width: '100%',
          opacity: busy || attending === null ? .55 : 1,
        }}>
          {busy ? 'Sending…' : 'Send my reply'}
        </button>
        {attending && (
          <p style={{ ...nrItalic, fontSize: '.82rem', color: 'rgba(244,235,221,.45)', textAlign: 'center', marginTop: '1rem' }}>
            Your personal entrance pass is created the moment you reply.
          </p>
        )}
      </form>
    </section>
  );
}
