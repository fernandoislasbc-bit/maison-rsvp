'use client';

/* Door check-in — a phone-first scanner for the entrance team.
   Point the camera at a guest's QR pass; the server verifies the
   signature, the RSVP, and whether it was already used, then one
   green tap admits the party. Works for staff and for the couple. */

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { NR, nrSerif, nrItalic, nrSans, nrMicro, nrButton, nrInput, nrLabel } from '../nr-theme';

type Verdict = {
  ok: boolean;
  state: 'valid' | 'already' | 'revoked' | 'declined' | 'invalid';
  guest?: { id: string; name: string; seats: number; dietary: string; checkedInAt: number | null };
  detail: string;
};

const STATE_STYLE: Record<Verdict['state'], { color: string; label: string }> = {
  valid:    { color: '#7FB069', label: 'Pass verified' },
  already:  { color: '#D9A03C', label: 'Already checked in' },
  revoked:  { color: '#C25B4E', label: 'Pass cancelled' },
  declined: { color: '#C25B4E', label: 'Guest declined' },
  invalid:  { color: '#C25B4E', label: 'Not a valid pass' },
};

export default function CheckinClient() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    // Any scan-capable session? Probe with an empty validate call.
    fetch('/api/nr/checkin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      .then(r => setAuthed(r.status !== 401))
      .catch(() => setAuthed(false));
  }, []);

  if (authed === null) return <Shell><p style={{ ...nrItalic, color: NR.mist }}>One moment…</p></Shell>;
  if (!authed) return <StaffLogin onDone={() => setAuthed(true)} />;
  return <Scanner />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main style={{
      minHeight: '100svh', background: NR.velvetDeep, color: NR.ivory,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1.5rem', textAlign: 'center',
    }}>{children}</main>
  );
}

/* ═══ Staff login ═══ */
function StaffLogin({ onDone }: { onDone: () => void }) {
  const [codeStr, setCodeStr] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // From the guided tour (?demo=1): fill the public staff code so the visitor
  // just taps to begin, while still learning the door is gated.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('demo') === '1') setCodeStr('ENTRANCE26');
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    const res = await fetch('/api/nr/auth', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'staff', secret: codeStr }),
    });
    if (res.ok) { onDone(); return; }
    const j = await res.json().catch(() => ({}));
    setError(j.error || 'That’s not quite right.');
    setBusy(false);
  };

  return (
    <Shell>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: 340 }}>
        <p style={{ ...nrMicro, color: NR.gold, marginBottom: '1.6rem' }}>Neil &amp; Riley — entrance</p>
        <h1 style={{ ...nrSerif, fontSize: '1.6rem', marginBottom: '2rem' }}>Door check-in</h1>
        <label htmlFor="staff-code" style={nrLabel}>Staff code</label>
        <input id="staff-code" value={codeStr} onChange={e => setCodeStr(e.target.value.toUpperCase())}
          autoComplete="off" autoCapitalize="characters"
          style={{ ...nrInput, textAlign: 'center', letterSpacing: '.35em', fontStyle: 'normal', fontFamily: 'var(--font-manrope), sans-serif' }} />
        {error && <p role="alert" style={{ ...nrItalic, color: '#E08A80', marginTop: '1rem' }}>{error}</p>}
        <button type="submit" disabled={busy} style={{ ...nrButton(true), width: '100%', marginTop: '1.8rem', opacity: busy ? .6 : 1 }}>
          {busy ? 'Checking…' : 'Begin scanning'}
        </button>
        <p style={{ ...nrItalic, fontSize: '.8rem', color: 'rgba(244,235,221,.4)', marginTop: '1.8rem' }}>
          Demonstration staff code: <strong style={{ color: NR.gold, fontStyle: 'normal', letterSpacing: '.1em' }}>ENTRANCE26</strong>
        </p>
      </form>
    </Shell>
  );
}

/* ═══ Scanner ═══ */
function Scanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef(0);
  const busyRef = useRef(false);
  const [cameraState, setCameraState] = useState<'off' | 'starting' | 'on' | 'denied'>('off');
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [lastPass, setLastPass] = useState('');
  const [manual, setManual] = useState('');
  const [admitted, setAdmitted] = useState(false);

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraState('off');
  }, []);

  const validate = useCallback(async (pass: string) => {
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      const res = await fetch('/api/nr/checkin', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pass }),
      });
      const v = await res.json();
      if (v.state) { setVerdict(v); setLastPass(pass); setAdmitted(false); }
    } finally {
      setTimeout(() => { busyRef.current = false; }, 400);
    }
  }, []);

  const startCamera = useCallback(async () => {
    setCameraState('starting');
    setVerdict(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } }, audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();
      setCameraState('on');

      const { default: jsQR } = await import('jsqr');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

      const tick = () => {
        if (!streamRef.current) return;
        if (video.readyState === video.HAVE_ENOUGH_DATA && !busyRef.current) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);
          const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const found = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
          if (found?.data?.startsWith('NRPASS:') && found.data !== lastPass) {
            if (navigator.vibrate) navigator.vibrate(80);
            validate(found.data);
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setCameraState('denied');
    }
  }, [validate, lastPass]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const admit = async () => {
    const res = await fetch('/api/nr/checkin', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pass: lastPass }),
    });
    const v = await res.json();
    setVerdict(v);
    setAdmitted(v.ok !== false && v.state === 'valid');
    if (navigator.vibrate) navigator.vibrate(v.state === 'valid' ? [60, 40, 60] : 200);
  };

  const next = () => { setVerdict(null); setLastPass(''); setAdmitted(false); };

  return (
    <main style={{ minHeight: '100svh', background: NR.velvetDeep, color: NR.ivory, display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1.1rem 1.4rem', borderBottom: `1px solid ${NR.line}`, display: 'flex', alignItems: 'center', gap: '.8rem' }}>
        <div style={{ flex: 1 }}>
          <p style={{ ...nrMicro, fontSize: '.5rem', color: NR.gold }}>Neil &amp; Riley — door</p>
          <p style={{ ...nrSerif, fontSize: '1rem', marginTop: '.2rem' }}>Entrance check-in</p>
        </div>
        <Link href="/nr/admin" style={{ ...nrMicro, fontSize: '.46rem', color: NR.mist, textDecoration: 'none', padding: '.8em' }}>Dashboard</Link>
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.4rem', maxWidth: 520, width: '100%', margin: '0 auto' }}>
        {/* camera viewport */}
        <div style={{
          position: 'relative', width: '100%', aspectRatio: '1', overflow: 'hidden',
          border: `1px solid ${NR.line}`, background: '#000', marginBottom: '1.2rem',
        }}>
          <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: cameraState === 'on' ? 'block' : 'none' }} />
          {cameraState !== 'on' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.2rem', padding: '1.5rem', textAlign: 'center' }}>
              {cameraState === 'denied' ? (
                <p style={{ ...nrItalic, color: NR.mist, fontSize: '.92rem', lineHeight: 1.7 }}>
                  Camera unavailable — allow camera access in your browser, or enter the guest’s code below.
                </p>
              ) : (
                <p style={{ ...nrItalic, color: NR.mist, fontSize: '.95rem' }}>
                  {cameraState === 'starting' ? 'Opening camera…' : 'Scan each guest’s QR pass at the door.'}
                </p>
              )}
              {cameraState !== 'starting' && (
                <button onClick={startCamera} style={nrButton(true)}>
                  {cameraState === 'denied' ? 'Try again' : 'Start camera'}
                </button>
              )}
            </div>
          )}
          {cameraState === 'on' && (
            <div aria-hidden style={{
              position: 'absolute', inset: '14%', border: `1.5px solid ${NR.gold}`,
              borderRadius: 8, boxShadow: '0 0 0 100vmax rgba(0,0,0,.25)', pointerEvents: 'none',
            }} />
          )}
        </div>

        {cameraState === 'on' && (
          <button onClick={stopCamera} style={{ ...nrMicro, fontSize: '.48rem', color: NR.mist, background: 'none', border: 'none', cursor: 'pointer', padding: '.8em', marginBottom: '.6rem' }}>
            Stop camera
          </button>
        )}

        {/* verdict card */}
        {verdict && verdict.guest && (
          <section aria-live="polite" style={{
            border: `1.5px solid ${STATE_STYLE[verdict.state].color}`,
            background: 'rgba(0,0,0,.25)', padding: '1.4rem', marginBottom: '1.2rem', textAlign: 'center',
          }}>
            <p style={{ ...nrMicro, fontSize: '.5rem', color: STATE_STYLE[verdict.state].color, marginBottom: '.8rem' }}>
              {admitted ? '✓ Admitted' : STATE_STYLE[verdict.state].label}
            </p>
            <p style={{ ...nrSerif, fontSize: '1.35rem' }}>{verdict.guest.name}</p>
            <p style={{ ...nrItalic, fontSize: '.9rem', color: NR.mist, marginTop: '.5rem' }}>
              {verdict.guest.seats} {verdict.guest.seats === 1 ? 'guest' : 'guests'} approved
              {verdict.guest.dietary ? ` · ${verdict.guest.dietary}` : ''}
            </p>
            {verdict.state === 'already' && verdict.guest.checkedInAt && (
              <p style={{ ...nrItalic, fontSize: '.85rem', color: '#D9A03C', marginTop: '.6rem' }}>
                First admitted at {new Date(verdict.guest.checkedInAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}.
              </p>
            )}
            {!admitted && verdict.state === 'valid' && (
              <button onClick={admit} style={{
                ...nrMicro, cursor: 'pointer', width: '100%', marginTop: '1.2rem', minHeight: 54,
                color: '#0E1A0A', background: '#7FB069', border: 'none', fontSize: '.62rem',
              }}>
                Admit {verdict.guest.seats > 1 ? `party of ${verdict.guest.seats}` : 'guest'}
              </button>
            )}
            {(admitted || verdict.state !== 'valid') && (
              <button onClick={next} style={{ ...nrButton(false), width: '100%', marginTop: '1.2rem' }}>
                Scan the next guest
              </button>
            )}
          </section>
        )}
        {verdict && !verdict.guest && (
          <section aria-live="polite" style={{ border: '1.5px solid #C25B4E', padding: '1.2rem', marginBottom: '1.2rem', textAlign: 'center' }}>
            <p style={{ ...nrItalic, color: '#E08A80' }}>{verdict.detail}</p>
            <button onClick={next} style={{ ...nrButton(false), marginTop: '1rem' }}>Try again</button>
          </section>
        )}

        {/* manual fallback */}
        <details style={{ marginTop: 'auto' }}>
          <summary style={{ ...nrMicro, fontSize: '.48rem', color: NR.mist, cursor: 'pointer', padding: '.8em 0' }}>
            No QR? Look up by invitation code
          </summary>
          <form onSubmit={async e => {
            e.preventDefault();
            const res = await fetch('/api/nr/guest', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: manual }),
            });
            const j = await res.json();
            if (res.ok && j.pass) { validate(j.pass); }
            else if (res.ok) { setVerdict({ ok: false, state: j.guest?.rsvp ? 'declined' : 'invalid', guest: j.guest ? { id: j.guest.id, name: j.guest.name, seats: j.guest.rsvp?.seatsConfirmed ?? 0, dietary: '', checkedInAt: j.guest.checkedInAt } : undefined, detail: 'No active pass for this guest.' }); }
            else { setVerdict({ ok: false, state: 'invalid', detail: j.error || 'Not found.' }); }
          }} style={{ display: 'flex', gap: '.6rem', paddingTop: '.6rem' }}>
            <input value={manual} onChange={e => setManual(e.target.value.toUpperCase())} aria-label="Invitation code"
              placeholder="e.g. ROSSI4" maxLength={8}
              style={{ ...nrInput, flex: 1, fontStyle: 'normal', fontFamily: 'var(--font-manrope), sans-serif', letterSpacing: '.25em', textAlign: 'center' }} />
            <button type="submit" style={{ ...nrButton(true), padding: '1.1em 1.6em' }}>Find</button>
          </form>
        </details>
      </div>
    </main>
  );
}
