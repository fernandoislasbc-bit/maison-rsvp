'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import {
  type InvitationDesign, type ThemeId, type TreatmentId, type TypographyId,
  OCCASIONS_B, THEMES, TYPE_PAIRINGS, SCALES, BUILDER_LIMITS,
  recommendedTreatments, orderedTypography, getTheme, themeAccent,
} from '@/lib/builder-config';
import { compressPhoto, rememberPhoto, forgetPhoto } from './photo-store';

/* Shared step building blocks — real buttons, real labels. */

type Patch = (p: Partial<InvitationDesign>) => void;
type StepProps = { design: InvitationDesign; patch: Patch };

const GOLD = '#A2815A';

const label: React.CSSProperties = {
  fontFamily: 'var(--font-manrope), sans-serif',
  fontSize: '.55rem', letterSpacing: '.28em', textTransform: 'uppercase',
  color: 'var(--mist)', display: 'block', marginBottom: '.45rem',
};

const cardBase = (active: boolean): React.CSSProperties => ({
  display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '.4rem',
  padding: '1.1rem 1.15rem', minHeight: 44, cursor: 'pointer', textAlign: 'left',
  background: active ? 'rgba(162,129,90,.09)' : 'var(--ivory)',
  border: `1px solid ${active ? GOLD : 'rgba(162,129,90,.25)'}`,
  boxShadow: active ? 'inset 0 0 0 1px rgba(162,129,90,.4)' : 'none',
  transition: 'border-color .2s ease, background .2s ease, box-shadow .2s ease, transform .2s ease',
  width: '100%',
});

function CardTitle({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span style={{
      fontFamily: 'var(--font-prata), Georgia, serif', fontSize: '.95rem',
      color: active ? 'var(--ink)' : 'var(--ink)',
    }}>{children}</span>
  );
}

function CardLine({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic',
      fontSize: '.85rem', color: 'var(--mist)', lineHeight: 1.5,
    }}>{children}</span>
  );
}

/* ─── Step 1 — Occasion ─── */

export function OccasionStep({ design, patch }: StepProps) {
  return (
    <div role="radiogroup" aria-label="Occasion" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '.7rem' }}>
      {OCCASIONS_B.map(o => {
        const active = design.occasion === o.id;
        return (
          <button key={o.id} type="button" role="radio" aria-checked={active}
            className="bld-card"
            onClick={() => patch({ occasion: o.id })}
            style={{ ...cardBase(active), alignItems: 'center', textAlign: 'center', padding: '1.4rem .9rem' }}
          >
            <span aria-hidden style={{
              fontFamily: 'var(--font-prata), Georgia, serif', fontSize: '1.3rem',
              color: active ? GOLD : 'rgba(162,129,90,.55)', lineHeight: 1,
            }}>{o.glyph}</span>
            <CardTitle active={active}>{o.label}</CardTitle>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Step 2 — Theme ─── */

export function ThemeStep({ design, patch }: StepProps) {
  const occ = OCCASIONS_B.find(o => o.id === design.occasion);
  return (
    <div>
      {occ && (
        <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.9rem', color: 'var(--mist)', marginBottom: '1.1rem' }}>
          For {occ.label.toLowerCase() === 'other' ? 'your celebration' : `a ${occ.label.toLowerCase()}`}, we often suggest{' '}
          {occ.suggestedThemes.map(t => getTheme(t).name).join(' or ')}.
        </p>
      )}
      <div role="radiogroup" aria-label="Visual style" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))', gap: '.7rem' }}>
        {THEMES.map(t => {
          const active = design.theme === t.id;
          const recommended = occ?.suggestedThemes.includes(t.id);
          return (
            <button key={t.id} type="button" role="radio" aria-checked={active}
              className="bld-card"
              onClick={() => patch({ theme: t.id as ThemeId, imageEffect: design.imageEffect || t.recommendedTreatments[0] })}
              style={cardBase(active)}
            >
              <span aria-hidden style={{ display: 'flex', gap: 4, marginBottom: '.2rem' }}>
                {t.swatch.map(c => (
                  <span key={c} style={{ width: 22, height: 22, borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,.1)' }} />
                ))}
              </span>
              <CardTitle active={active}>{t.name}</CardTitle>
              <CardLine>{t.line}</CardLine>
              {recommended && (
                <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.48rem', letterSpacing: '.22em', textTransform: 'uppercase', color: GOLD }}>
                  Suggested
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step 3 — Photograph ─── */

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

export function ImageStep({ design, patch }: StepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const dragging = useRef<{ startX: number; startY: number; px: number; py: number } | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const setFile = useCallback(async (file: File | undefined | null) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) { setError('Please choose a JPG, PNG, or WebP photograph.'); return; }
    if (file.size > BUILDER_LIMITS.imageBytes) { setError('That photograph is over 10 MB — a smaller version will look just as beautiful.'); return; }
    setError('');
    try {
      const blob = await compressPhoto(file);
      if (design.image) forgetPhoto(design.image);
      const url = URL.createObjectURL(blob);
      rememberPhoto(url, blob);
      patch({ image: url, imageRef: null, imagePosition: { x: 50, y: 50, zoom: 1 } });
    } catch {
      setError('That photograph could not be read — please try another.');
    }
  }, [design.image, patch]);

  const remove = () => {
    if (design.image) forgetPhoto(design.image);
    patch({ image: null, imageRef: null, imagePosition: { x: 50, y: 50, zoom: 1 } });
  };

  // drag to reposition
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = { startX: e.clientX, startY: e.clientY, px: design.imagePosition.x, py: design.imagePosition.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !frameRef.current) return;
    const r = frameRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragging.current.startX) / r.width) * 100;
    const dy = ((e.clientY - dragging.current.startY) / r.height) * 100;
    patch({ imagePosition: {
      ...design.imagePosition,
      x: Math.min(100, Math.max(0, dragging.current.px - dx)),
      y: Math.min(100, Math.max(0, dragging.current.py - dy)),
    } });
  };
  const onPointerUp = () => { dragging.current = null; };

  useEffect(() => () => { /* object URL cleaned on remove/replace; final cleanup on leave page */ }, []);

  if (!design.image) {
    return (
      <div>
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); setFile(e.dataTransfer.files?.[0]); }}
          style={{
            border: `1px dashed ${dragOver ? GOLD : 'rgba(162,129,90,.45)'}`,
            background: dragOver ? 'rgba(162,129,90,.07)' : 'transparent',
            padding: 'clamp(2.5rem,6vw,4rem) 1.5rem', textAlign: 'center',
            transition: 'all .2s ease',
          }}
        >
          <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '1rem', color: 'var(--mist)', marginBottom: '1.4rem' }}>
            Drop a photograph here, or
          </p>
          <button type="button" onClick={() => inputRef.current?.click()}
            style={{
              fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem',
              letterSpacing: '.28em', textTransform: 'uppercase',
              color: 'var(--ivory)', background: 'var(--ink)', border: 'none',
              padding: '1.1em 2.4em', minHeight: 44, cursor: 'pointer',
            }}>
            Choose a photograph
          </button>
          <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.15em', color: 'var(--mist)', marginTop: '1.4rem', textTransform: 'uppercase' }}>
            JPG · PNG · WebP · up to 10 MB
          </p>
        </div>
        <input ref={inputRef} type="file" accept={ACCEPTED.join(',')} capture={undefined}
          onChange={e => setFile(e.target.files?.[0])}
          aria-label="Upload a photograph"
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0, overflow: 'hidden' }} />
        {error && <p role="alert" style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', color: '#C0564C', fontSize: '.9rem', marginTop: '1rem' }}>{error}</p>}
        <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.85rem', color: 'var(--mist)', marginTop: '1.25rem' }}>
          Your photograph is prepared privately in your browser and only saved when you create the invitation. You can also continue without one.
        </p>
      </div>
    );
  }

  const pos = design.imagePosition;
  return (
    <div>
      <span style={label}>Position your photograph — drag to move</span>
      <div
        ref={frameRef}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
        style={{
          position: 'relative', width: 'min(300px, 80%)', aspectRatio: '4 / 5',
          overflow: 'hidden', border: '1px solid rgba(162,129,90,.4)',
          cursor: 'grab', touchAction: 'none', userSelect: 'none',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={design.image} alt="Your uploaded photograph" draggable={false}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: `${pos.x}% ${pos.y}%`,
            transform: `scale(${pos.zoom})`, transformOrigin: `${pos.x}% ${pos.y}%`,
            pointerEvents: 'none',
          }} />
      </div>

      <div style={{ marginTop: '1.25rem', maxWidth: 300 }}>
        <label style={label} htmlFor="bld-zoom">Zoom</label>
        <input id="bld-zoom" type="range" min={1} max={2.2} step={0.02} value={pos.zoom}
          onChange={e => patch({ imagePosition: { ...pos, zoom: Number(e.target.value) } })}
          style={{ width: '100%', accentColor: GOLD }} />
      </div>

      <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
        {[
          { t: 'Replace', fn: () => inputRef.current?.click() },
          { t: 'Reset position', fn: () => patch({ imagePosition: { x: 50, y: 50, zoom: 1 } }) },
          { t: 'Remove', fn: remove },
        ].map(b => (
          <button key={b.t} type="button" onClick={b.fn}
            style={{
              fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem',
              letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)',
              background: 'transparent', border: '1px solid rgba(162,129,90,.3)',
              padding: '.8em 1.4em', minHeight: 40, cursor: 'pointer',
            }}>
            {b.t}
          </button>
        ))}
      </div>
      <input ref={inputRef} type="file" accept={ACCEPTED.join(',')}
        onChange={e => setFile(e.target.files?.[0])}
        aria-label="Replace photograph"
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0, overflow: 'hidden' }} />
      {error && <p role="alert" style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', color: '#C0564C', fontSize: '.9rem', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}

/* ─── Step 4 — Treatment ─── */

export function TreatmentStep({ design, patch }: StepProps) {
  const [showAll, setShowAll] = useState(false);
  const ordered = recommendedTreatments(design.theme);
  const shown = showAll ? ordered : ordered.slice(0, 2);

  if (!design.image) {
    return (
      <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.95rem', color: 'var(--mist)', lineHeight: 1.7 }}>
        No photograph this time — your invitation will carry the design alone, which is every bit as elegant. Continue when ready.
      </p>
    );
  }

  return (
    <div>
      <p style={{ ...label, marginBottom: '1rem' }}>Recommended for your design</p>
      <div role="radiogroup" aria-label="Image treatment" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '.7rem' }}>
        {shown.map(t => {
          const active = design.imageEffect === t.id;
          return (
            <button key={t.id} type="button" role="radio" aria-checked={active}
              className="bld-card"
              onClick={() => patch({ imageEffect: t.id as TreatmentId })}
              style={cardBase(active)}
            >
              <span aria-hidden style={{ width: '100%', aspectRatio: '3/2', overflow: 'hidden', display: 'block', position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={design.image!} alt="" style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  objectPosition: `${design.imagePosition.x}% ${design.imagePosition.y}%`,
                  filter: t.filter,
                }} />
                <span style={{ position: 'absolute', inset: 0, background: t.overlay, mixBlendMode: t.overlayBlend }} />
              </span>
              <CardTitle active={active}>{t.name}</CardTitle>
              <CardLine>{t.line}</CardLine>
            </button>
          );
        })}
      </div>
      {!showAll && (
        <button type="button" onClick={() => setShowAll(true)}
          style={{
            marginTop: '1rem', fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.55rem', letterSpacing: '.22em', textTransform: 'uppercase',
            color: GOLD, background: 'none', border: 'none', borderBottom: '1px solid rgba(162,129,90,.35)',
            paddingBottom: '.3em', cursor: 'pointer', minHeight: 40,
          }}>
          Show all treatments
        </button>
      )}
    </div>
  );
}

/* ─── Step 5 — Typography ─── */

export function TypographyStep({ design, patch }: StepProps) {
  const ordered = orderedTypography(design.theme);
  const sampleDate = design.details.date || 'June 12th, 2027';
  const sampleNames = design.details.names || 'Isabella & Alexander';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div role="radiogroup" aria-label="Typography pairing" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '.7rem' }}>
        {ordered.map((t, i) => {
          const active = design.typography === t.id;
          return (
            <button key={t.id} type="button" role="radio" aria-checked={active}
              className="bld-card"
              onClick={() => patch({ typography: t.id as TypographyId })}
              style={cardBase(active)}
            >
              <span style={{ ...t.heading, fontSize: '1.25rem', color: 'var(--ink)', display: 'block' }}>{sampleNames}</span>
              <span style={{ ...t.body, fontSize: '.8rem', color: 'var(--mist)', display: 'block' }}>{sampleDate}</span>
              <span style={{ display: 'flex', gap: '.6rem', alignItems: 'baseline', marginTop: '.35rem' }}>
                <CardTitle active={active}>{t.name}</CardTitle>
                {i === 0 && <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.48rem', letterSpacing: '.22em', textTransform: 'uppercase', color: GOLD }}>Suggested</span>}
              </span>
              <CardLine>{t.line}</CardLine>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          <span style={label}>Alignment</span>
          <div role="radiogroup" aria-label="Text alignment" style={{ display: 'flex', gap: '.5rem' }}>
            {(['center', 'left'] as const).map(a => (
              <button key={a} type="button" role="radio" aria-checked={design.alignment === a}
                onClick={() => patch({ alignment: a })}
                style={{
                  fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem',
                  letterSpacing: '.2em', textTransform: 'uppercase', minHeight: 40,
                  padding: '.7em 1.3em', cursor: 'pointer',
                  border: `1px solid ${design.alignment === a ? GOLD : 'rgba(162,129,90,.3)'}`,
                  background: design.alignment === a ? 'rgba(162,129,90,.09)' : 'transparent',
                  color: design.alignment === a ? 'var(--ink)' : 'var(--mist)',
                }}>
                {a === 'center' ? 'Centred' : 'Left'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span style={label}>Presence</span>
          <div role="radiogroup" aria-label="Type size" style={{ display: 'flex', gap: '.5rem' }}>
            {(Object.keys(SCALES) as (keyof typeof SCALES)[]).map(s => (
              <button key={s} type="button" role="radio" aria-checked={design.scale === s}
                onClick={() => patch({ scale: s })}
                style={{
                  fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem',
                  letterSpacing: '.2em', textTransform: 'uppercase', minHeight: 40,
                  padding: '.7em 1.3em', cursor: 'pointer',
                  border: `1px solid ${design.scale === s ? GOLD : 'rgba(162,129,90,.3)'}`,
                  background: design.scale === s ? 'rgba(162,129,90,.09)' : 'transparent',
                  color: design.scale === s ? 'var(--ink)' : 'var(--mist)',
                }}>
                {SCALES[s].label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 6 — Details ─── */

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '.6rem 0', background: 'transparent',
  border: 'none', borderBottom: '1px solid rgba(162,129,90,.35)', outline: 'none',
  fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic',
  fontSize: 16, color: 'var(--ink)',
};

export function DetailsStep({ design, patch }: StepProps) {
  const d = design.details;
  const set = (k: keyof InvitationDesign['details'], max: number) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      patch({ details: { ...d, [k]: e.target.value.slice(0, max) } });
  const L = BUILDER_LIMITS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '1.25rem' }}>
        <div>
          <label style={label} htmlFor="bd-names">Names or hosts *</label>
          <input id="bd-names" style={inputStyle} value={d.names} onChange={set('names', L.names)} placeholder="Isabella & Alexander" autoComplete="off" />
        </div>
        <div>
          <label style={label} htmlFor="bd-title">Event title (optional)</label>
          <input id="bd-title" style={inputStyle} value={d.title} onChange={set('title', L.title)} placeholder="An Evening in the Garden" />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '1.25rem' }}>
        <div>
          <label style={label} htmlFor="bd-date">Date *</label>
          <input id="bd-date" style={inputStyle} value={d.date} onChange={set('date', L.date)} placeholder="Saturday, June 12th 2027" />
        </div>
        <div>
          <label style={label} htmlFor="bd-time">Time (optional)</label>
          <input id="bd-time" style={inputStyle} value={d.time} onChange={set('time', L.time)} placeholder="Half past four" />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '1.25rem' }}>
        <div>
          <label style={label} htmlFor="bd-venue">Venue *</label>
          <input id="bd-venue" style={inputStyle} value={d.venue} onChange={set('venue', L.venue)} placeholder="The Orchard House" />
        </div>
        <div>
          <label style={label} htmlFor="bd-loc">City or region</label>
          <input id="bd-loc" style={inputStyle} value={d.location} onChange={set('location', L.location)} placeholder="Vancouver" />
        </div>
      </div>
      <div>
        <label style={label} htmlFor="bd-msg">A short message (optional)</label>
        <textarea id="bd-msg" rows={3} style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
          value={d.message} onChange={set('message', L.message)}
          placeholder="Dinner and dancing to follow. We can't wait to celebrate with you." />
        <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.5rem', letterSpacing: '.15em', color: 'var(--mist)', marginTop: '.35rem', textAlign: 'right' }}>
          {d.message.length}/{L.message}
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '1.25rem' }}>
        <div>
          <label style={label} htmlFor="bd-rl">Reply button reads</label>
          <input id="bd-rl" style={inputStyle} value={d.rsvpLabel} onChange={set('rsvpLabel', L.rsvpLabel)} placeholder="Kindly reply" />
        </div>
        <div>
          <label style={label} htmlFor="bd-ru">Your own RSVP link (optional)</label>
          <input id="bd-ru" style={inputStyle} type="url" value={d.rsvpUrl} onChange={set('rsvpUrl', L.rsvpUrl)} placeholder="https://…" />
        </div>
      </div>
      <div>
        <label style={label} htmlFor="bd-em">Where replies arrive — your email {d.rsvpUrl ? '(optional)' : '*'}</label>
        <input id="bd-em" style={inputStyle} type="email" autoComplete="email" value={d.email} onChange={set('email', 120)} placeholder="you@example.com" />
        <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.8rem', color: 'var(--mist)', marginTop: '.45rem' }}>
          Never shown to guests. Never used for marketing.
        </p>
      </div>
    </div>
  );
}

/* ─── Step 7 — Review ─── */

export function ReviewStep({ design, summaryOnly }: { design: InvitationDesign; summaryOnly?: boolean }) {
  const theme = getTheme(design.theme);
  const rows = [
    { k: 'Occasion',   v: OCCASIONS_B.find(o => o.id === design.occasion)?.label ?? '—' },
    { k: 'Style',      v: theme.name },
    { k: 'Typography', v: TYPE_PAIRINGS.find(t => t.id === design.typography)?.name ?? 'Classic Serif' },
    { k: 'Treatment',  v: design.image ? (recommendedTreatments(design.theme).find(t => t.id === design.imageEffect)?.name ?? 'Natural Editorial') : 'No photograph' },
    { k: 'When',       v: [design.details.date, design.details.time].filter(Boolean).join(' · ') || '—' },
    { k: 'Where',      v: [design.details.venue, design.details.location].filter(Boolean).join(', ') || '—' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.9rem' }}>
      {rows.map(r => (
        <div key={r.k} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(162,129,90,.15)', paddingBottom: '.7rem' }}>
          <span style={{ ...label, marginBottom: 0, width: 92, flexShrink: 0, paddingTop: '.15rem' }}>{r.k}</span>
          <span style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontSize: '.95rem', color: 'var(--ink)' }}>{r.v}</span>
        </div>
      ))}
      {!summaryOnly && design.image && (
        <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.85rem', color: 'var(--mist)', lineHeight: 1.7 }}>
          Your photograph will appear on the shared invitation. It is stored privately, never made public beyond your link, and removed twelve months after creation.
        </p>
      )}
      <span aria-hidden style={{ color: themeAccent(theme), display: 'none' }} />
    </div>
  );
}
