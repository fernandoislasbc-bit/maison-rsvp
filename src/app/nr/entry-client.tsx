'use client';

/* The velvet door — guests enter the access code from their card. */

import { useState } from 'react';
import { NR, nrSerif, nrItalic, nrMicro, nrButton, nrInput, nrLabel } from './nr-theme';

export default function EntryClient() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setError('');
    try {
      const res = await fetch('/api/nr/guest', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Please try again.');
      const clean = code.trim().toUpperCase();
      sessionStorage.setItem('nr-code', clean);
      // The invitation IS the cinematic experience — enter the film.
      window.location.href = `/experiences/neil-and-riley/index.html?code=${encodeURIComponent(clean)}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please try again.');
      setBusy(false);
    }
  };

  return (
    <main style={{
      minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `radial-gradient(ellipse 90% 70% at 50% 30%, ${NR.burgundy} 0%, ${NR.velvet} 55%, ${NR.velvetDeep} 100%)`,
      color: NR.ivory, padding: '2rem 1.5rem', textAlign: 'center',
    }}>
      <div style={{ maxWidth: 460, width: '100%' }}>
        <p style={{ ...nrMicro, color: NR.gold, marginBottom: '2rem' }}>Neil &amp; Riley — September 14th, 2026</p>

        {/* the sealed envelope */}
        <div style={{
          width: 108, height: 108, margin: '0 auto 2.2rem', borderRadius: '50%',
          border: `1px solid ${NR.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(201,163,90,.05)',
        }}>
          <span style={{ ...nrSerif, fontSize: '2rem', color: NR.gold, letterSpacing: '.18em', paddingLeft: '.18em' }}>NR</span>
        </div>

        <h1 style={{ ...nrSerif, fontSize: 'clamp(1.9rem,6vw,2.7rem)', lineHeight: 1.15, marginBottom: '1rem' }}>
          You are invited.
        </h1>
        <p style={{ ...nrItalic, fontSize: '1rem', color: NR.mist, lineHeight: 1.8, marginBottom: '2.6rem' }}>
          Enter the access code from your invitation card to open your personal invitation.
        </p>

        <form onSubmit={submit}>
          <label htmlFor="nr-code" style={nrLabel}>Access code</label>
          <input
            id="nr-code" value={code} onChange={e => setCode(e.target.value.toUpperCase())}
            autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={8}
            style={{ ...nrInput, textAlign: 'center', letterSpacing: '.45em', fontStyle: 'normal', fontFamily: 'var(--font-manrope), sans-serif', fontSize: '1.15rem' }}
          />
          {error && <p role="alert" style={{ ...nrItalic, color: '#E08A80', marginTop: '1rem' }}>{error}</p>}
          <button type="submit" disabled={busy} style={{ ...nrButton(true), width: '100%', marginTop: '2rem', opacity: busy ? .6 : 1 }}>
            {busy ? 'Opening…' : 'Open my invitation'}
          </button>
        </form>

        <p style={{ ...nrItalic, fontSize: '.82rem', color: 'rgba(244,235,221,.4)', marginTop: '2.6rem', lineHeight: 1.7 }}>
          This is a demonstration wedding — try the code <strong style={{ color: NR.gold, fontStyle: 'normal', letterSpacing: '.12em' }}>BMONT1</strong>{' '}
          to experience a fresh invitation, or <strong style={{ color: NR.gold, fontStyle: 'normal', letterSpacing: '.12em' }}>ROSSI4</strong> for one already confirmed.
        </p>
      </div>
    </main>
  );
}
