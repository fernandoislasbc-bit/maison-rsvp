'use client';

import type { CSSProperties, ReactNode } from 'react';
import {
  type InvitationDesign, getTheme, getTreatment, getTypography,
  themeAccent, SCALES, OCCASIONS_B,
} from '@/lib/builder-config';

/* ─────────────────────────────────────────────────────────────
   The live invitation. Pure render of an InvitationDesign —
   used by the configurator preview AND the shared /e/ page,
   so what you compose is exactly what guests receive.
   ───────────────────────────────────────────────────────────── */

type Props = {
  design: InvitationDesign;
  /** children render where the RSVP button would be (public RSVP form) */
  children?: ReactNode;
  /** fills its container instead of simulating a card */
  full?: boolean;
};

const REVEAL_CSS = `
  @keyframes inv-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
  .inv-r1 { animation: inv-in .9s .1s cubic-bezier(.16,1,.3,1) both; }
  .inv-r2 { animation: inv-in .9s .28s cubic-bezier(.16,1,.3,1) both; }
  .inv-r3 { animation: inv-in .9s .46s cubic-bezier(.16,1,.3,1) both; }
  .inv-r4 { animation: inv-in .9s .64s cubic-bezier(.16,1,.3,1) both; }
  @media (prefers-reduced-motion: reduce) {
    .inv-r1, .inv-r2, .inv-r3, .inv-r4 { animation: none; }
  }
`;

export function InvitationPreview({ design, children, full }: Props) {
  const theme = getTheme(design.theme);
  const type = getTypography(design.typography);
  const treatment = getTreatment(design.imageEffect);
  const scale = SCALES[design.scale] ?? SCALES.classic;
  const accent = themeAccent(theme);
  const occasion = OCCASIONS_B.find(o => o.id === design.occasion);
  const align = design.alignment;
  const d = design.details;

  const names = d.names || 'Isabella & Alexander';
  const eyebrow = d.title || (occasion ? occasion.label : 'A celebration');
  const line = occasion?.line ?? 'invite you to celebrate';
  const dateLine = [d.date || 'Saturday, June 12th 2027', d.time].filter(Boolean).join(' · ');
  const placeLine = [d.venue, d.location].filter(Boolean).join(', ') || 'The Orchard House, Vancouver';

  const frame: CSSProperties =
    theme.frame === 'hairline' ? { border: `1px solid ${theme.rule}` } :
    theme.frame === 'double'   ? { border: `1px solid ${theme.rule}`, boxShadow: `inset 0 0 0 5px ${theme.bg}, inset 0 0 0 6px ${theme.rule}` } :
    {};

  const textAlign = align === 'left' ? 'left' as const : 'center' as const;
  const mx = align === 'left' ? '0' : 'auto';

  return (
    <div style={{
      position: 'relative',
      background: theme.bg,
      color: theme.ink,
      minHeight: full ? '100svh' : '100%',
      padding: 'clamp(2rem,7%,3.5rem) clamp(1.4rem,6%,3rem)',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      overflow: 'hidden',
      transition: 'background .5s ease, color .5s ease',
    }}>
      <style dangerouslySetInnerHTML={{ __html: REVEAL_CSS }} />

      {/* frame */}
      {theme.frame !== 'none' && (
        <div aria-hidden style={{ position: 'absolute', inset: 'clamp(.7rem,2.5%,1.1rem)', pointerEvents: 'none', ...frame }} />
      )}
      {theme.frame === 'corners' && (
        <>
          {[{ top: 14, left: 14, bt: 1, bl: 1 }, { top: 14, right: 14, bt: 1, br: 1 },
            { bottom: 14, left: 14, bb: 1, bl: 1 }, { bottom: 14, right: 14, bb: 1, br: 1 }].map((c, i) => (
            <div key={i} aria-hidden style={{
              position: 'absolute', width: 26, height: 26, pointerEvents: 'none',
              top: c.top, left: c.left, right: c.right, bottom: c.bottom,
              borderTop: c.bt ? `1px solid ${theme.rule}` : undefined,
              borderBottom: c.bb ? `1px solid ${theme.rule}` : undefined,
              borderLeft: c.bl ? `1px solid ${theme.rule}` : undefined,
              borderRight: c.br ? `1px solid ${theme.rule}` : undefined,
            }} />
          ))}
        </>
      )}

      <div style={{ position: 'relative', maxWidth: 460, margin: '0 auto', width: '100%', textAlign }}>

        {/* eyebrow */}
        <p className="inv-r1" style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '.56em', letterSpacing: '.42em', textTransform: 'uppercase',
          color: accent, marginBottom: '1.6em',
        }}>
          {eyebrow}
        </p>

        {/* photograph */}
        {design.image && (
          <div className="inv-r1" style={{
            position: 'relative',
            width: align === 'left' ? '78%' : '72%',
            aspectRatio: '4 / 5',
            margin: `0 ${mx} 1.8em ${align === 'left' ? '0' : 'auto'}`,
            overflow: 'hidden',
            border: `1px solid ${theme.rule}`,
            padding: 6, background: theme.bg,
          }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={design.image}
                alt=""
                draggable={false}
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover',
                  objectPosition: `${design.imagePosition.x}% ${design.imagePosition.y}%`,
                  transform: `scale(${design.imagePosition.zoom})`,
                  transformOrigin: `${design.imagePosition.x}% ${design.imagePosition.y}%`,
                  filter: treatment.filter,
                  transition: 'filter .45s ease',
                  userSelect: 'none',
                }}
              />
              <div aria-hidden style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: treatment.overlay, mixBlendMode: treatment.overlayBlend,
                transition: 'background .45s ease',
              }} />
            </div>
          </div>
        )}

        {/* names */}
        <h2 className="inv-r2" style={{
          ...type.heading,
          fontSize: `${2.35 * scale.names}em`,
          margin: 0, color: theme.ink, textWrap: 'balance',
        }}>
          {names}
        </h2>

        {/* occasion line */}
        <p className="inv-r2" style={{
          ...type.body, fontStyle: type.id === 'script' ? 'normal' : 'italic',
          fontSize: `${0.95 * scale.body}em`, color: theme.soft,
          margin: '1.1em 0 1.8em',
        }}>
          {line}
        </p>

        <div className="inv-r3" aria-hidden style={{
          height: 1, width: 64, background: accent, opacity: .55,
          margin: align === 'left' ? '0 0 1.8em' : '0 auto 1.8em',
        }} />

        {/* when / where */}
        <div className="inv-r3" style={{ display: 'flex', flexDirection: 'column', gap: '.4em', marginBottom: d.message ? '1.6em' : '2.2em' }}>
          <p style={{ ...type.body, fontSize: `${1.02 * scale.body}em`, color: theme.ink }}>{dateLine}</p>
          <p style={{ ...type.body, fontSize: `${0.92 * scale.body}em`, color: theme.soft }}>{placeLine}</p>
        </div>

        {/* message */}
        {d.message && (
          <p className="inv-r3" style={{
            ...type.body, fontStyle: 'italic',
            fontSize: `${0.9 * scale.body}em`, color: theme.soft,
            lineHeight: 1.75, maxWidth: '40ch',
            margin: align === 'left' ? '0 0 2.2em' : '0 auto 2.2em',
          }}>
            {d.message}
          </p>
        )}

        {/* RSVP */}
        <div className="inv-r4">
          {children ?? (
            <span style={{
              display: 'inline-block',
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.6em', letterSpacing: '.3em', textTransform: 'uppercase',
              color: theme.dark ? theme.ink : theme.bg,
              background: theme.dark ? accent : theme.ink,
              padding: '1.25em 2.6em',
              ...(theme.dark ? { background: accent, color: '#12100C' } : {}),
            }}>
              {d.rsvpLabel || 'Kindly reply'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
