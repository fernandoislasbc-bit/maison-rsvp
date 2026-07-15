'use client';

/* The guided tour of the Neil & Riley platform — one link, four
   capabilities, experienced first-hand. Each step hands the visitor
   the exact code or password and opens the real surface. */

import { useState } from 'react';
import Link from 'next/link';
import { NR, nrSerif, nrItalic, nrSans, nrMicro, nrButton } from '../nr-theme';

function CredChip({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => { try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch { /* ignore */ } }}
      aria-label={`Copy ${value}`}
      style={{
        ...nrSans, fontSize: '.8rem', letterSpacing: '.22em', cursor: 'pointer',
        color: NR.velvetDeep, background: NR.gold, border: 'none',
        padding: '.55em 1.1em', minHeight: 36,
      }}
    >
      {copied ? 'Copied ✓' : value}
    </button>
  );
}

const STEPS: {
  n: string; title: string; body: string;
  cred?: { label: string; value: string };
  href: string; cta: string;
  tip?: string;
}[] = [
  {
    n: 'I',
    title: 'Open a guest invitation',
    body: 'Every guest receives a private access code. Enter this one and you become Claire Beaumont — the full cinematic invitation opens: the velvet envelope film, their story, the venue. At the end, the reply is addressed to you. Accept, and your personal QR entrance pass appears on the spot.',
    cred: { label: 'Guest access code', value: 'BMONT1' },
    href: '/nr', cta: 'Open the invitation',
    tip: 'Save or screenshot the QR pass — you’ll scan it in step IV.',
  },
  {
    n: 'II',
    title: 'Leave a memory for the couple',
    body: 'Guests contribute photographs, short videos, and written wishes — before the day, during the party, and after. Leave one now; it goes privately to the couple for approval before joining the shared gallery.',
    href: '/nr/memories', cta: 'Leave a memory',
  },
  {
    n: 'III',
    title: 'Step into the couple’s dashboard',
    body: 'Now switch sides. Sign in as Neil & Riley and find your RSVP from step I already waiting — alongside every reply, meal choice, and dietary note. Approve the memory you just left, copy invitation links, export the guest list.',
    cred: { label: 'Dashboard password', value: 'rosewood2026' },
    href: '/nr/admin', cta: 'Open the dashboard',
  },
  {
    n: 'IV',
    title: 'Scan the pass at the door',
    body: 'On the wedding evening, the entrance team checks guests in by pointing a phone at their QR pass. Open the scanner, scan the pass from step I — off another screen, or use the manual code lookup — and admit yourself. The dashboard’s arrivals update instantly. Try scanning twice: duplicates are refused.',
    cred: { label: 'Staff entrance code', value: 'ENTRANCE26' },
    href: '/nr/checkin', cta: 'Open the scanner',
    tip: 'Best with two devices: pass on one screen, scanner on the other.',
  },
];

export default function GuideClient() {
  return (
    <main style={{ minHeight: '100svh', background: NR.velvetDeep, color: NR.ivory }}>
      {/* ── Hero ── */}
      <header style={{
        textAlign: 'center', padding: 'clamp(4.5rem,10vw,7rem) 1.5rem clamp(3rem,6vw,4.5rem)',
        background: `radial-gradient(ellipse 100% 80% at 50% 0%, ${NR.burgundy} 0%, ${NR.velvetDeep} 70%)`,
      }}>
        <p style={{ ...nrMicro, color: NR.gold, marginBottom: '1.6rem' }}>Maison RSVP — live demonstration</p>
        <h1 style={{ ...nrSerif, fontSize: 'clamp(2rem,6.5vw,3.6rem)', lineHeight: 1.12, maxWidth: '17ch', margin: '0 auto 1.4rem' }}>
          One link. Four capabilities. Try every one of them.
        </h1>
        <p style={{ ...nrItalic, fontSize: 'clamp(.98rem,2vw,1.15rem)', color: NR.mist, maxWidth: '54ch', margin: '0 auto', lineHeight: 1.85 }}>
          This is the real platform behind every commission, running live for a demonstration wedding —
          Neil &amp; Riley, September 2026. Walk the whole journey yourself: guest, couple, and the door.
          Everything you do here actually works.
        </p>
      </header>

      {/* ── Steps ── */}
      <div style={{ maxWidth: 660, margin: '0 auto', padding: '0 1.5rem clamp(3rem,7vw,5rem)' }}>
        {STEPS.map(s => (
          <section key={s.n} style={{
            borderTop: `1px solid ${NR.line}`,
            padding: 'clamp(2.2rem,5vw,3rem) 0',
          }}>
            <div style={{ display: 'flex', gap: '1.4rem', alignItems: 'baseline' }}>
              <span aria-hidden style={{ ...nrSerif, fontSize: '1.4rem', color: NR.gold, minWidth: 38 }}>{s.n}</span>
              <div style={{ flex: 1 }}>
                <h2 style={{ ...nrSerif, fontSize: 'clamp(1.25rem,3vw,1.55rem)', marginBottom: '.8rem' }}>{s.title}</h2>
                <p style={{ ...nrItalic, fontSize: '.98rem', color: 'rgba(244,235,221,.75)', lineHeight: 1.85 }}>{s.body}</p>

                <div style={{ display: 'flex', gap: '.9rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                  {s.cred && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.7rem' }}>
                      <span style={{ ...nrMicro, fontSize: '.48rem', color: NR.mist }}>{s.cred.label}</span>
                      <CredChip value={s.cred.value} />
                    </span>
                  )}
                  <Link href={s.href} target="_blank" rel="noreferrer"
                    style={{ ...nrButton(false), textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                    {s.cta} →
                  </Link>
                </div>
                {s.tip && (
                  <p style={{ ...nrItalic, fontSize: '.84rem', color: 'rgba(244,235,221,.45)', marginTop: '1rem' }}>{s.tip}</p>
                )}
              </div>
            </div>
          </section>
        ))}

        {/* ── Closing ── */}
        <section style={{ borderTop: `1px solid ${NR.line}`, padding: 'clamp(2.5rem,6vw,3.5rem) 0', textAlign: 'center' }}>
          <p style={{ ...nrItalic, fontSize: '1.02rem', color: NR.mist, maxWidth: '48ch', margin: '0 auto 2rem', lineHeight: 1.85 }}>
            Everything you just touched — the invitation, the passes, the dashboard, the door — arrives
            with every commission, composed around your own story.
          </p>
          <div style={{ display: 'flex', gap: '.9rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" style={{ ...nrButton(true), textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              Begin a commission
            </Link>
            <Link href="/collection" style={{ ...nrButton(false), textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              Explore the Collection
            </Link>
          </div>
          <p style={{ ...nrItalic, fontSize: '.82rem', color: 'rgba(244,235,221,.4)', marginTop: '2.2rem', lineHeight: 1.7 }}>
            A demonstration is shared by every visitor and resets from time to time — nothing you enter here is real or kept.
          </p>
        </section>
      </div>
    </main>
  );
}
