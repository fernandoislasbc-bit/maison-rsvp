'use client';

import type { Edition, EditionTemplateId } from '@/lib/editions';
import type { ReactNode } from 'react';

/* ─────────────────────────────────────────────────────────────
   Edition templates — pure presentational, CSS animation only.
   Used by the editor's live preview and the public /e/ page.
   `children` renders below the invitation body (the RSVP block).
   ───────────────────────────────────────────────────────────── */

type Props = { data: Edition; children?: ReactNode; preview?: boolean };

const BASE_CSS = `
  @keyframes ed-up { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
  @keyframes ed-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes ed-line { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  @keyframes ed-drift { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px) rotate(2deg); } }
  @keyframes ed-glow { 0%,100% { opacity: .5; } 50% { opacity: .85; } }
  .ed-a  { animation: ed-up 1s cubic-bezier(.16,1,.3,1) both; }
  .ed-a2 { animation: ed-up 1s .25s cubic-bezier(.16,1,.3,1) both; }
  .ed-a3 { animation: ed-up 1s .5s cubic-bezier(.16,1,.3,1) both; }
  .ed-a4 { animation: ed-up 1s .75s cubic-bezier(.16,1,.3,1) both; }
  .ed-a5 { animation: ed-up 1s 1s cubic-bezier(.16,1,.3,1) both; }
  .ed-line { transform-origin: center; animation: ed-line 1.2s .9s cubic-bezier(.16,1,.3,1) both; }
  .ed-drift { animation: ed-drift 7s ease-in-out infinite; }
  .ed-glow { animation: ed-glow 5s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) {
    .ed-a, .ed-a2, .ed-a3, .ed-a4, .ed-a5, .ed-line { animation: ed-fade .01s both; }
    .ed-drift, .ed-glow { animation: none; }
  }
`;

function Names({ data, color, accentColor, amp, preview }: { data: Edition; color: string; accentColor: string; amp?: string; preview?: boolean }) {
  // On the real invitation the names ARE the page's h1. In the maker's gallery
  // previews they must not be, so the landing page keeps a single h1.
  const Tag = preview ? 'p' : 'h1';
  return (
    <Tag className="ed-a2" style={{
      fontFamily: 'var(--font-prata), Georgia, serif',
      fontSize: 'clamp(2.4rem, 9vw, 4.6rem)',
      lineHeight: 1.08, letterSpacing: '-.02em',
      color, fontWeight: 400, textWrap: 'balance', margin: 0,
    }}>
      {data.n1}
      {data.n2 && (
        <>
          <em style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', color: amp ?? accentColor, padding: '0 .18em' }}>&amp;</em>
          {data.n2}
        </>
      )}
    </Tag>
  );
}

function Details({ data, labelColor, textColor, ruleColor }: { data: Edition; labelColor: string; textColor: string; ruleColor: string }) {
  const rows = [
    { k: 'When', v: [data.d, data.h].filter(Boolean).join(' · ') },
    { k: 'Where', v: [data.v, data.c].filter(Boolean).join(', ') },
  ];
  return (
    <div className="ed-a4" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', width: '100%', maxWidth: 420, margin: '0 auto' }}>
      {rows.map(r => (
        <div key={r.k} style={{ borderTop: `1px solid ${ruleColor}`, paddingTop: '.9rem' }}>
          <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.32em', textTransform: 'uppercase', color: labelColor, marginBottom: '.35rem' }}>{r.k}</p>
          <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontSize: 'clamp(1rem,2.6vw,1.15rem)', color: textColor, lineHeight: 1.5 }}>{r.v}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── The Garden — botanical ivory & sage ─── */

function Garden({ data, children, preview }: Props) {
  const SAGE = '#8A9B7C', BLUSH = '#C98F88', INK = '#3A362E', MIST = '#8B8578';
  const leaf = (flip = false) => (
    <svg className="ed-drift" viewBox="0 0 120 120" aria-hidden style={{
      position: 'absolute', width: 'clamp(90px,18vw,170px)', opacity: .5,
      ...(flip ? { right: '-2%', bottom: '-2%', transform: 'rotate(180deg)' } : { left: '-2%', top: '-2%' }),
    }}>
      <g fill="none" stroke={SAGE} strokeWidth="1.4">
        <path d="M10 110 C 30 70, 55 45, 100 15" />
        {[0.2, 0.4, 0.6, 0.8].map((p, i) => (
          <g key={i}>
            <path d={`M${10 + p * 80} ${108 - p * 88} q 14 -4 22 6`} />
            <path d={`M${10 + p * 80} ${108 - p * 88} q -4 -16 8 -24`} />
          </g>
        ))}
      </g>
      <circle cx="98" cy="18" r="4" fill={BLUSH} opacity=".8" />
      <circle cx="72" cy="42" r="3" fill={BLUSH} opacity=".55" />
    </svg>
  );

  return (
    <div style={{ minHeight: '100svh', background: 'radial-gradient(ellipse 90% 60% at 50% 0%, #F2EEE4 0%, #F8F5F0 60%)', position: 'relative', overflow: 'hidden', padding: 'clamp(4rem,10vw,7rem) 1.5rem' }}>
      <style dangerouslySetInnerHTML={{ __html: BASE_CSS }} />
      {leaf()}{leaf(true)}
      <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <p className="ed-a" style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.6rem', letterSpacing: '.42em', textTransform: 'uppercase', color: SAGE, marginBottom: '2rem' }}>
          Together with their families
        </p>
        <Names data={data} color={INK} accentColor={BLUSH} preview={preview} />
        <p className="ed-a3" style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1.05rem,3vw,1.3rem)', color: MIST, margin: '1.6rem 0 2.6rem' }}>
          {data.o}
        </p>
        <div className="ed-line" style={{ height: 1, width: 72, background: BLUSH, opacity: .6, margin: '0 auto 2.4rem' }} />
        <Details data={data} labelColor={SAGE} textColor={INK} ruleColor="rgba(138,155,124,.25)" />
        {data.m && (
          <p className="ed-a5" style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '1rem', color: MIST, lineHeight: 1.8, maxWidth: '44ch', margin: '2.6rem auto 0' }}>
            {data.m}
          </p>
        )}
        <div className="ed-a5">{children}</div>
      </div>
    </div>
  );
}

/* ─── The Nocturne — ink, gold & candlelight ─── */

function Nocturne({ data, children, preview }: Props) {
  const GOLD = '#A2815A', IVORY = '#F8F5F0', SOFT = 'rgba(248,245,240,.55)';
  return (
    <div style={{ minHeight: '100svh', background: 'linear-gradient(170deg,#15100A 0%,#0E0D0B 55%)', position: 'relative', overflow: 'hidden', padding: 'clamp(4rem,10vw,7rem) 1.5rem' }}>
      <style dangerouslySetInnerHTML={{ __html: BASE_CSS }} />
      <div className="ed-glow" aria-hidden style={{ position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)', width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle, rgba(162,129,90,.16) 0%, transparent 65%)' }} />
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', position: 'relative', border: '1px solid rgba(162,129,90,.25)', padding: 'clamp(2.5rem,7vw,4.5rem) clamp(1.25rem,5vw,3rem)' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 8, border: '1px solid rgba(162,129,90,.12)', pointerEvents: 'none' }} />
        <p className="ed-a" style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.48em', textTransform: 'uppercase', color: GOLD, marginBottom: '2.2rem' }}>
          You are invited
        </p>
        <Names data={data} color={IVORY} accentColor={GOLD} preview={preview} />
        <p className="ed-a3" style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1.05rem,3vw,1.3rem)', color: SOFT, margin: '1.6rem 0 2.6rem' }}>
          {data.o}
        </p>
        <div className="ed-line" style={{ height: 1, width: 88, background: GOLD, opacity: .5, margin: '0 auto 2.4rem' }} />
        <Details data={data} labelColor={GOLD} textColor={IVORY} ruleColor="rgba(162,129,90,.22)" />
        {data.m && (
          <p className="ed-a5" style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '1rem', color: SOFT, lineHeight: 1.8, maxWidth: '44ch', margin: '2.6rem auto 0' }}>
            {data.m}
          </p>
        )}
        <div className="ed-a5">{children}</div>
      </div>
    </div>
  );
}

/* ─── The Riviera — cobalt, citrus & sea light ─── */

function Riviera({ data, children, preview }: Props) {
  const COBALT = '#1F3F8F', CITRUS = '#E9B44C', SEA = '#6B88C4', PAPER = '#FDFCF9';
  return (
    <div style={{ minHeight: '100svh', background: PAPER, position: 'relative', overflow: 'hidden', padding: 'clamp(4rem,10vw,7rem) 1.5rem' }}>
      <style dangerouslySetInnerHTML={{ __html: BASE_CSS }} />
      {/* scalloped sea border */}
      <svg aria-hidden viewBox="0 0 1200 60" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 34, opacity: .9 }}>
        {[0, 1, 2].map(r => (
          <path key={r} d={`M0 ${14 + r * 12} ${Array.from({ length: 24 }, (_, i) => `Q ${i * 50 + 25} ${r * 12 - 8} ${(i + 1) * 50} ${14 + r * 12}`).join(' ')}`} fill="none" stroke={r === 1 ? SEA : COBALT} strokeWidth="1.4" opacity={1 - r * .3} />
        ))}
      </svg>
      <svg className="ed-drift" aria-hidden viewBox="0 0 100 100" style={{ position: 'absolute', right: '4%', top: '7%', width: 'clamp(54px,9vw,88px)' }}>
        <ellipse cx="50" cy="55" rx="26" ry="34" fill={CITRUS} opacity=".92" />
        <ellipse cx="42" cy="42" rx="7" ry="10" fill="#F5D488" opacity=".8" />
        <path d="M50 20 q 4 -14 18 -14 q -2 12 -14 16 z" fill={COBALT} opacity=".85" />
      </svg>
      <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <p className="ed-a" style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.6rem', letterSpacing: '.42em', textTransform: 'uppercase', color: SEA, marginBottom: '2rem' }}>
          With the sea as witness
        </p>
        <Names data={data} color={COBALT} accentColor={CITRUS} amp={CITRUS} preview={preview} />
        <p className="ed-a3" style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1.05rem,3vw,1.3rem)', color: SEA, margin: '1.6rem 0 2.6rem' }}>
          {data.o}
        </p>
        <div className="ed-line" style={{ height: 1, width: 72, background: CITRUS, margin: '0 auto 2.4rem' }} />
        <Details data={data} labelColor={SEA} textColor={COBALT} ruleColor="rgba(31,63,143,.18)" />
        {data.m && (
          <p className="ed-a5" style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '1rem', color: SEA, lineHeight: 1.8, maxWidth: '44ch', margin: '2.6rem auto 0' }}>
            {data.m}
          </p>
        )}
        <div className="ed-a5">{children}</div>
      </div>
    </div>
  );
}

export function EditionTemplate({ data, children, preview }: Props) {
  const map: Record<EditionTemplateId, (p: Props) => ReactNode> = {
    garden: Garden, nocturne: Nocturne, riviera: Riviera,
  };
  const Tpl = map[data.t] ?? Garden;
  return <Tpl data={data} preview={preview}>{children}</Tpl>;
}
