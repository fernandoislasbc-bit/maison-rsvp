'use client';

/* The guided tour of the Neil & Riley platform — one link, four
   capabilities, experienced first-hand. Each step opens the real
   surface with its credential already carried in, so the visitor
   never has to copy, type, or get lost. */

import { useState } from 'react';
import Link from 'next/link';
import { NR, nrSerif, nrItalic, nrSans, nrMicro, nrButton } from '../nr-theme';

/* A credential shown plainly, with an obvious tap-to-copy affordance
   for anyone who prefers to type it in themselves. */
function CopyCode({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => { try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch { /* ignore */ } }}
      aria-label={`Copy ${value}`}
      style={{
        ...nrSans, fontSize: '.78rem', letterSpacing: '.18em', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '.5em',
        color: NR.gold, background: 'rgba(201,163,90,.08)',
        border: `1px solid ${NR.goldSoft}`, padding: '.5em .9em', minHeight: 34,
      }}
    >
      <span style={{ letterSpacing: '.22em' }}>{value}</span>
      <span aria-hidden style={{ fontSize: '.6rem', opacity: .8, letterSpacing: '.12em', textTransform: 'uppercase' }}>
        {copied ? '✓ copied' : 'copy'}
      </span>
    </button>
  );
}

type Step = {
  n: number;
  title: string;
  lead: string;                 // one plain, readable sentence
  detail?: string;              // optional second line
  credLabel?: string;
  credValue?: string;           // shown as tap-to-copy; also carried in the link
  href: string;
  cta: string;
  tip?: string;
};

const STEPS: Step[] = [
  {
    n: 1,
    title: 'Open a guest invitation',
    lead: 'Become a real guest — Claire Beaumont. Tapping below opens her full cinematic invitation: the velvet envelope, their story, the venue.',
    detail: 'Scroll to the end and the reply is addressed to her by name. Accept, and a personal QR entrance pass appears on the spot.',
    credLabel: 'Her access code',
    credValue: 'BMONT1',
    href: '/experiences/neil-and-riley/index.html?code=BMONT1',
    cta: 'Open Claire’s invitation',
    tip: 'Screenshot the QR pass when it appears — you’ll scan it in step 4.',
  },
  {
    n: 2,
    title: 'Leave a memory for the couple',
    lead: 'Guests share photos, short videos, and written wishes — before, during, and after the day.',
    detail: 'Leave one now. It goes privately to the couple for approval before it can appear in the shared gallery.',
    href: '/nr/memories?code=BMONT1',
    cta: 'Leave a memory',
  },
  {
    n: 3,
    title: 'See it from the couple’s side',
    lead: 'Now switch seats and sign in as Neil & Riley. Your reply from step 1 is already waiting, with every meal choice and note.',
    detail: 'Approve the memory you just left, copy invitation links, watch arrivals, export the guest list.',
    credLabel: 'Dashboard password',
    credValue: 'rosewood2026',
    href: '/nr/admin?demo=1',
    cta: 'Open the dashboard',
    tip: 'The password is filled in for you — just tap Enter.',
  },
  {
    n: 4,
    title: 'Check a guest in at the door',
    lead: 'On the night, the entrance team points a phone at each guest’s QR pass. Open the scanner and scan Claire’s pass from step 1.',
    detail: 'One green tap admits her, and the dashboard’s arrivals update live. Scan the same pass twice — a used pass is refused.',
    credLabel: 'Staff entrance code',
    credValue: 'ENTRANCE26',
    href: '/nr/checkin?demo=1',
    cta: 'Open the scanner',
    tip: 'Easiest with two devices: the pass on one screen, the scanner on the other. No second screen? Use the “look up by code” option inside the scanner.',
  },
];

export default function GuideClient() {
  const [done, setDone] = useState<Set<number>>(new Set());
  const mark = (n: number) => setDone(prev => new Set(prev).add(n));

  return (
    <main style={{ minHeight: '100svh', background: NR.velvetDeep, color: NR.ivory }}>
      {/* ── Hero ── */}
      <header style={{
        textAlign: 'center', padding: 'clamp(4rem,10vw,6.5rem) 1.4rem clamp(2.4rem,6vw,3.5rem)',
        background: `radial-gradient(ellipse 100% 80% at 50% 0%, ${NR.burgundy} 0%, ${NR.velvetDeep} 70%)`,
      }}>
        <p style={{ ...nrMicro, color: NR.gold, marginBottom: '1.4rem' }}>Maison RSVP — live demonstration</p>
        <h1 style={{ ...nrSerif, fontSize: 'clamp(1.9rem,6.5vw,3.4rem)', lineHeight: 1.12, maxWidth: '17ch', margin: '0 auto 1.2rem' }}>
          One link. Four capabilities. Try every one of them.
        </h1>
        <p style={{ ...nrSans, fontWeight: 300, fontSize: 'clamp(.95rem,2vw,1.05rem)', color: NR.ivory, opacity: .85, maxWidth: '46ch', margin: '0 auto', lineHeight: 1.75 }}>
          This is the real platform behind every commission, running live for a
          demonstration wedding. Walk the whole journey yourself — guest, couple,
          and the door. Everything here actually works.
        </p>
        {/* orientation */}
        <p style={{ ...nrMicro, fontSize: '.5rem', color: NR.mist, marginTop: '2rem', lineHeight: 2 }}>
          Four quick steps · about two minutes<br />
          <span style={{ textTransform: 'none', letterSpacing: '.04em', fontStyle: 'italic', fontFamily: 'var(--font-garamond), Georgia, serif', fontSize: '.9rem' }}>
            Each step opens in a new tab — return here to continue.
          </span>
        </p>
      </header>

      {/* ── Steps ── */}
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '0 1.2rem clamp(3rem,7vw,5rem)' }}>
        {STEPS.map(s => {
          const isDone = done.has(s.n);
          return (
            <section key={s.n} style={{
              border: `1px solid ${isDone ? 'rgba(126,176,105,.4)' : NR.line}`,
              background: isDone ? 'rgba(126,176,105,.06)' : 'rgba(201,163,90,.03)',
              padding: 'clamp(1.4rem,4vw,2rem)',
              marginTop: '1rem',
              transition: 'border-color .3s, background .3s',
            }}>
              {/* header row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '.85rem', marginBottom: '1rem' }}>
                <span aria-hidden style={{
                  flexShrink: 0, width: 34, height: 34, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${isDone ? 'rgba(126,176,105,.7)' : NR.goldSoft}`,
                  color: isDone ? '#9ED17F' : NR.gold,
                  ...nrSans, fontSize: '.85rem',
                }}>{isDone ? '✓' : s.n}</span>
                <h2 style={{ ...nrSerif, fontSize: 'clamp(1.2rem,3.4vw,1.5rem)', lineHeight: 1.2 }}>{s.title}</h2>
              </div>

              {/* readable body */}
              <p style={{ ...nrSans, fontWeight: 300, fontSize: '.98rem', color: NR.ivory, opacity: .9, lineHeight: 1.7 }}>{s.lead}</p>
              {s.detail && <p style={{ ...nrSans, fontWeight: 300, fontSize: '.92rem', color: NR.mist, lineHeight: 1.7, marginTop: '.7rem' }}>{s.detail}</p>}

              {/* credential */}
              {s.credValue && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem', flexWrap: 'wrap', marginTop: '1.2rem' }}>
                  <span style={{ ...nrMicro, fontSize: '.46rem', color: NR.mist }}>{s.credLabel}</span>
                  <CopyCode value={s.credValue} />
                </div>
              )}

              {/* action */}
              <a
                href={s.href} target="_blank" rel="noreferrer"
                onClick={() => mark(s.n)}
                style={{
                  ...nrButton(true), textDecoration: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: '1.3rem', width: '100%',
                }}
              >
                {isDone ? `${s.cta} again` : s.cta} →
              </a>

              {s.tip && (
                <p style={{ ...nrItalic, fontSize: '.86rem', color: 'rgba(244,235,221,.5)', marginTop: '1rem', lineHeight: 1.6 }}>{s.tip}</p>
              )}
            </section>
          );
        })}

        {/* progress line */}
        <p style={{ ...nrMicro, fontSize: '.5rem', color: NR.mist, textAlign: 'center', marginTop: '1.8rem' }}>
          {done.size === 0 ? 'Start with step one above' :
           done.size < 4 ? `${done.size} of 4 explored — keep going` :
           'All four explored — you’ve seen the whole platform'}
        </p>

        {/* ── Closing ── */}
        <section style={{ borderTop: `1px solid ${NR.line}`, marginTop: '2.4rem', padding: 'clamp(2.5rem,6vw,3.5rem) 0 0', textAlign: 'center' }}>
          <p style={{ ...nrSans, fontWeight: 300, fontSize: '1rem', color: NR.ivory, opacity: .88, maxWidth: '46ch', margin: '0 auto 2rem', lineHeight: 1.75 }}>
            Everything you just touched — the invitation, the passes, the dashboard, the door —
            arrives with every commission, composed around your own story.
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
            A demonstration shared by every visitor, reset from time to time — nothing you enter here is real or kept.
          </p>
        </section>
      </div>
    </main>
  );
}
