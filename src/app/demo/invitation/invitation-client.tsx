'use client';

/* The demo invitation the dashboard QR points to.
   RSVPs submitted here are written to the same localStorage store
   the /demo dashboard reads — reply on this device and it appears
   there instantly. */

import { useState } from 'react';
import Link from 'next/link';
import { EditionTemplate } from '@/components/editions/templates';
import type { Edition } from '@/lib/editions';
import { DEMO_COUPLE, loadDemo, saveDemo } from '@/lib/demo-data';

const DEMO_EDITION: Edition = {
  t: 'garden',
  n1: 'Isabella', n2: 'Alexander',
  o: 'are getting married',
  d: DEMO_COUPLE.date,
  h: 'Four o’clock in the afternoon',
  v: DEMO_COUPLE.venue,
  c: DEMO_COUPLE.city,
  m: 'Join us beneath the orchard blossoms for an evening of dinner, dancing, and candlelight.',
  e: '',
};

export default function DemoInvitation() {
  const [name, setName] = useState('');
  const [attending, setAttending] = useState(true);
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Please add your name.'); return; }
    setError('');
    const store = loadDemo();
    store.rsvps.push({
      id: `local-${Date.now()}`,
      guest: name.trim().slice(0, 60),
      party: 1,
      attending,
      dietary: '',
      note: note.trim().slice(0, 200),
      when: 'Just now',
      channel: 'QR card',
    });
    saveDemo(store);
    setSent(true);
  };

  const label: React.CSSProperties = {
    fontFamily: 'var(--font-manrope), sans-serif',
    fontSize: '.55rem', letterSpacing: '.26em', textTransform: 'uppercase',
    color: '#8A9B7C', display: 'block', marginBottom: '.5rem',
  };
  const input: React.CSSProperties = {
    width: '100%', background: 'transparent',
    border: 'none', borderBottom: '1px solid rgba(138,155,124,.4)',
    fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic',
    fontSize: '1.05rem', color: '#3A4032', padding: '.55rem 0', outline: 'none',
    borderRadius: 0,
  };

  return (
    <main>
      <EditionTemplate data={DEMO_EDITION}>
        {sent ? (
          <div style={{ textAlign: 'center', maxWidth: 420, margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: '1.3rem', marginBottom: '.8rem' }}>
              Thank you, {name.split(' ')[0]}.
            </p>
            <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.95rem', color: '#6B6455', lineHeight: 1.8 }}>
              Your demo reply has been recorded — open the{' '}
              <Link href="/demo" style={{ color: '#8A9B7C' }}>couple dashboard</Link>{' '}
              on this device and you will find it waiting in the RSVP list.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} style={{ maxWidth: 420, margin: '0 auto', textAlign: 'left' }}>
            <div style={{ marginBottom: '1.4rem' }}>
              <label htmlFor="demo-name" style={label}>Your name</label>
              <input id="demo-name" value={name} onChange={e => setName(e.target.value)} style={input} autoComplete="name" />
            </div>
            <div role="radiogroup" aria-label="Will you attend?" style={{ display: 'flex', gap: '.7rem', marginBottom: '1.6rem' }}>
              {[true, false].map(v => (
                <button key={String(v)} type="button" role="radio" aria-checked={attending === v}
                  onClick={() => setAttending(v)}
                  style={{
                    flex: 1, minHeight: 44, cursor: 'pointer',
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '.58rem', letterSpacing: '.24em', textTransform: 'uppercase',
                    color: attending === v ? '#F8F5F0' : '#3A4032',
                    background: attending === v ? '#3A4032' : 'transparent',
                    border: '1px solid rgba(58,64,50,.4)',
                    padding: '1em',
                  }}
                >{v ? 'Accepts with pleasure' : 'Regretfully declines'}</button>
              ))}
            </div>
            <div style={{ marginBottom: '1.8rem' }}>
              <label htmlFor="demo-note" style={label}>A note for the couple (optional)</label>
              <input id="demo-note" value={note} onChange={e => setNote(e.target.value)} style={input} maxLength={200} />
            </div>
            {error && <p role="alert" style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', color: '#8C4A3F', marginBottom: '1rem' }}>{error}</p>}
            <button type="submit" style={{
              width: '100%', minHeight: 48, cursor: 'pointer',
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase',
              color: '#F8F5F0', background: '#3A4032', border: 'none', padding: '1.2em',
            }}>Send demo RSVP</button>
            <p style={{
              fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic',
              fontSize: '.8rem', color: '#8B8578', textAlign: 'center', marginTop: '1rem', lineHeight: 1.6,
            }}>
              This is a demonstration — nothing is sent or stored beyond this device.
            </p>
          </form>
        )}
      </EditionTemplate>

      <footer style={{ background: '#0E0D0B', textAlign: 'center', padding: '1.4rem 1.5rem' }}>
        <Link href="/demo" style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '.55rem', letterSpacing: '.28em', textTransform: 'uppercase',
          color: 'rgba(201,168,130,.75)', textDecoration: 'none',
        }}>
          ← Back to the platform demo dashboard
        </Link>
      </footer>
    </main>
  );
}
