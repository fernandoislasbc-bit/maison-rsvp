'use client';

import { useState } from 'react';

/* RSVP block rendered inside an Edition invitation. */

export function EditionRsvp({ token, dark }: { token: string; dark?: boolean }) {
  const [guest, setGuest]         = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [note, setNote]           = useState('');
  const [state, setState]         = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError]         = useState('');

  const ink   = dark ? '#F8F5F0' : '#3A362E';
  const soft  = dark ? 'rgba(248,245,240,.55)' : 'rgba(58,54,46,.55)';
  const gold  = '#A2815A';
  const rule  = dark ? 'rgba(162,129,90,.35)' : 'rgba(162,129,90,.4)';

  const submit = async () => {
    if (!guest.trim()) { setError('Please add your name.'); return; }
    if (attending === null) { setError('Please choose a reply.'); return; }
    setError(''); setState('sending');
    try {
      const res = await fetch('/api/editions/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, guest: guest.trim(), attending, note: note.trim() }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'failed');
      setState('done');
    } catch (e) {
      setState('error');
      setError(e instanceof Error && e.message !== 'failed' ? e.message : 'The reply could not be sent — please try again.');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '.7rem 0', background: 'transparent',
    border: 'none', borderBottom: `1px solid ${rule}`, outline: 'none',
    fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic',
    fontSize: 16, color: ink, textAlign: 'center',
  };

  if (state === 'done') {
    return (
      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: `1px solid ${rule}` }}>
        <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.32em', textTransform: 'uppercase', color: gold, marginBottom: '.8rem' }}>
          Reply received
        </p>
        <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '1.05rem', color: soft }}>
          Thank you, {guest.trim().split(' ')[0]} — your reply is on its way to the hosts.
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: `1px solid ${rule}`, maxWidth: 380, marginLeft: 'auto', marginRight: 'auto' }}>
      <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.32em', textTransform: 'uppercase', color: gold, marginBottom: '1.4rem' }}>
        Kindly reply
      </p>

      <label htmlFor="ed-guest" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Your name</label>
      <input
        id="ed-guest" name="guest" autoComplete="name"
        value={guest} onChange={e => setGuest(e.target.value)}
        placeholder="Your name" style={inputStyle}
      />

      <div style={{ display: 'flex', justifyContent: 'center', gap: '.75rem', margin: '1.4rem 0' }}>
        {[{ v: true, label: 'Joyfully attending' }, { v: false, label: 'Regretfully declining' }].map(opt => {
          const active = attending === opt.v;
          return (
            <button
              key={opt.label} type="button" aria-pressed={active}
              onClick={() => setAttending(opt.v)}
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '.55rem', letterSpacing: '.18em', textTransform: 'uppercase',
                padding: '.9em 1.4em', minHeight: 42, cursor: 'pointer',
                borderRadius: 999, transition: 'all .2s ease',
                border: `1px solid ${active ? gold : rule}`,
                background: active ? gold : 'transparent',
                color: active ? '#F8F5F0' : soft,
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <label htmlFor="ed-note" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>A note for the hosts</label>
      <input
        id="ed-note" name="note"
        value={note} onChange={e => setNote(e.target.value)}
        placeholder="A note for the hosts (optional)" style={inputStyle}
      />

      {error && (
        <p role="alert" style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.9rem', color: '#C0564C', marginTop: '1rem' }}>
          {error}
        </p>
      )}

      <button
        type="button" onClick={submit} disabled={state === 'sending'}
        style={{
          marginTop: '1.6rem',
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase',
          color: '#F8F5F0', background: state === 'sending' ? 'rgba(162,129,90,.5)' : '#A2815A',
          border: 'none', padding: '1.1em 2.6em', minHeight: 44,
          cursor: state === 'sending' ? 'default' : 'pointer',
          transition: 'background .25s',
        }}
      >
        {state === 'sending' ? 'Sending…' : 'Send reply'}
      </button>
    </div>
  );
}
