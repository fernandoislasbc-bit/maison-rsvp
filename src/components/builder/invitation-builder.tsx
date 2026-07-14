'use client';

import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import Nav from '@/components/layout/Nav';
import {
  type InvitationDesign, DEFAULT_DESIGN,
  BUILDER_STORAGE_KEY, STEP_TITLES, STEP_SHORT,
} from '@/lib/builder-config';
import { InvitationPreview } from './invitation-preview';
import { getPhoto } from './photo-store';
import {
  OccasionStep, ThemeStep, ImageStep, TreatmentStep,
  TypographyStep, DetailsStep, ReviewStep,
} from './steps';

const GOLD = '#A2815A';
const TOTAL = 7;

const CSS = `
  .bld-shell { display: grid; grid-template-columns: minmax(0, 42%) minmax(0, 58%); min-height: 100svh; }
  .bld-preview-col { position: sticky; top: 0; height: 100svh; overflow: hidden; border-left: 1px solid rgba(162,129,90,.15); background: #EDE9E1; display: flex; align-items: center; justify-content: center; padding: clamp(1.5rem,3vw,3rem); }
  .bld-preview-card { width: min(430px, 100%); aspect-ratio: 3 / 4.4; box-shadow: 0 40px 80px -24px rgba(20,16,10,.35); overflow-y: auto; scrollbar-width: none; }
  .bld-mob-bar, .bld-drawer { display: none; }
  @media (max-width: 940px) {
    .bld-shell { grid-template-columns: 1fr; }
    .bld-preview-col { display: none; }
    .bld-mob-bar { display: flex; }
    .bld-drawer { display: block; }
  }
  .bld-focus:focus-visible, .bld-card:focus-visible, button:focus-visible { outline: 2px solid ${GOLD}; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .bld-anim { transition: none !important; } }
`;

const reduced = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    // rAF doesn't run in hidden/background pages — entrance tweens would freeze
    document.visibilityState !== 'visible');

type Saved = Omit<InvitationDesign, 'image'> & { image: null };

export default function InvitationBuilder() {
  const [design, setDesign] = useState<InvitationDesign>(DEFAULT_DESIGN);
  const [step, setStep] = useState(0);
  const [maxVisited, setMaxVisited] = useState(0);
  const [error, setError] = useState('');
  const [restored, setRestored] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const stepRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);

  /* ── persistence (image excluded — object URLs don't survive reloads) ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(BUILDER_STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Saved;
        if (saved && saved.theme) {
          setDesign({ ...DEFAULT_DESIGN, ...saved, image: null });
          setRestored(true);
        }
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const { image: _image, ...rest } = design;
        localStorage.setItem(BUILDER_STORAGE_KEY, JSON.stringify({ ...rest, image: null }));
      } catch { /* ignore */ }
    }, 400);
    return () => clearTimeout(t);
  }, [design]);

  const patch = useCallback((p: Partial<InvitationDesign>) => {
    setDesign(d => ({ ...d, ...p }));
    setError('');
  }, []);

  /* ── GSAP: step transitions + card stagger + progress ── */
  useLayoutEffect(() => {
    if (!stepRef.current) return;
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(stepRef.current, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'power3.out' });
      gsap.fromTo('.bld-card', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .05, ease: 'power3.out', delay: .08 });
    }, stepRef);
    return () => ctx.revert();
  }, [step]);

  useEffect(() => {
    if (!barRef.current) return;
    const w = `${((step + 1) / TOTAL) * 100}%`;
    if (reduced()) { barRef.current.style.width = w; return; }
    gsap.to(barRef.current, { width: w, duration: .6, ease: 'power3.inOut' });
  }, [step]);

  useEffect(() => {
    if (liveRef.current) liveRef.current.textContent = `Step ${step + 1} of ${TOTAL} — ${STEP_SHORT[step]}`;
  }, [step]);

  /* ── drawer animation ── */
  useEffect(() => {
    if (!drawerRef.current) return;
    if (reduced()) return;
    if (drawer) gsap.fromTo(drawerRef.current, { yPercent: 100 }, { yPercent: 0, duration: .45, ease: 'power3.out' });
  }, [drawer]);

  /* ── validation ── */
  const validate = (s: number): string => {
    if (s === 0 && !design.occasion) return 'Choose your occasion to continue.';
    if (s === 1 && !design.theme) return 'Choose the style that feels right.';
    if (s === 5) {
      const d = design.details;
      if (!d.names.trim()) return 'Please add the names or hosts.';
      if (!d.date.trim()) return 'Please add the date.';
      if (!d.venue.trim()) return 'Please add the venue.';
      if (d.rsvpUrl && !/^https?:\/\/.+\..+/.test(d.rsvpUrl)) return 'The RSVP link should start with https://';
      if (!d.rsvpUrl && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) return 'Add a valid email so replies can reach you — or provide your own RSVP link.';
    }
    return '';
  };

  const go = (target: number) => {
    if (target > step) {
      for (let s = step; s < target; s++) {
        const e = validate(s);
        if (e) { setError(e); return; }
      }
    }
    setError('');
    setStep(target);
    setMaxVisited(m => Math.max(m, target));
    window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
  };

  const reset = () => {
    if (design.image) URL.revokeObjectURL(design.image);
    try { localStorage.removeItem(BUILDER_STORAGE_KEY); } catch { /* ignore */ }
    setDesign(DEFAULT_DESIGN);
    setStep(0); setMaxVisited(0); setShareUrl(''); setError(''); setRestored(false);
  };

  /* ── finish: create the real shareable invitation ── */
  const finish = async () => {
    const e = validate(5);
    if (e) { setError(e); setStep(5); return; }
    setFinishing(true); setError('');
    try {
      // Photograph first: compressed in the browser, saved privately, referenced by id
      let imageRef: string | null = design.imageRef ?? null;
      if (design.image && !imageRef) {
        const blob = getPhoto(design.image);
        if (blob) {
          const up = await fetch('/api/editions/photo', { method: 'POST', body: blob });
          const uj = await up.json();
          if (!up.ok) throw new Error(uj.error || 'Your photograph could not be saved — please try again.');
          imageRef = uj.id;
        }
      }
      const { image: _image, ...shareable } = design;
      const res = await fetch('/api/editions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ k: 'd', design: { ...shareable, image: null, imageRef } }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'failed');
      setShareUrl(`${window.location.origin}${j.url}`);
      if (!reduced() && stepRef.current) {
        gsap.fromTo(stepRef.current, { autoAlpha: 0, scale: .98 }, { autoAlpha: 1, scale: 1, duration: .6, ease: 'power3.out' });
      }
    } catch (err) {
      setError(err instanceof Error && err.message !== 'failed' ? err.message : 'Something went wrong — please try again.');
    } finally {
      setFinishing(false);
    }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { /* ignore */ }
  };

  const steps = [
    <OccasionStep key="s0" design={design} patch={patch} />,
    <ThemeStep key="s1" design={design} patch={patch} />,
    <ImageStep key="s2" design={design} patch={patch} />,
    <TreatmentStep key="s3" design={design} patch={patch} />,
    <TypographyStep key="s4" design={design} patch={patch} />,
    <DetailsStep key="s5" design={design} patch={patch} />,
    <ReviewStep key="s6" design={design} />,
  ];

  const last = step === TOTAL - 1;

  return (
    <>
      <Nav light />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <p ref={liveRef} aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }} />

      <div className="bld-shell" style={{ background: 'var(--ivory)', paddingTop: 76 }}>

        {/* ── controls column ── */}
        <div style={{ padding: 'clamp(1.5rem,3vw,2.75rem)', paddingBottom: 'clamp(6rem,12vw,3rem)', display: 'flex', flexDirection: 'column' }}>

          {/* progress */}
          <div style={{ marginBottom: 'clamp(1.75rem,3vw,2.5rem)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '.7rem', gap: '1rem' }}>
              <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.52rem', letterSpacing: '.3em', textTransform: 'uppercase', color: GOLD }}>
                Step {step + 1} of {TOTAL} — {STEP_SHORT[step]}
              </p>
              <button type="button" onClick={reset} style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', background: 'none', border: 'none', cursor: 'pointer', padding: '.4em', minHeight: 32 }}>
                Start over
              </button>
            </div>
            <div style={{ position: 'relative', height: 2, background: 'rgba(162,129,90,.18)' }}>
              <div ref={barRef} style={{ position: 'absolute', inset: '0 auto 0 0', width: `${((step + 1) / TOTAL) * 100}%`, background: GOLD }} />
            </div>
            {/* revisit dots */}
            <div style={{ display: 'flex', gap: '.4rem', marginTop: '.8rem', flexWrap: 'wrap' }}>
              {STEP_SHORT.map((s, i) => {
                const visitable = i <= maxVisited;
                return (
                  <button key={s} type="button" disabled={!visitable}
                    onClick={() => visitable && go(i)}
                    aria-label={`Go to step ${i + 1}: ${s}`}
                    aria-current={i === step ? 'step' : undefined}
                    style={{
                      fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.48rem',
                      letterSpacing: '.14em', textTransform: 'uppercase',
                      padding: '.5em .8em', minHeight: 28, cursor: visitable ? 'pointer' : 'default',
                      border: 'none', background: 'transparent',
                      color: i === step ? 'var(--ink)' : visitable ? GOLD : 'rgba(139,133,120,.4)',
                      borderBottom: i === step ? `1px solid ${GOLD}` : '1px solid transparent',
                    }}>
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {restored && step === 0 && (
            <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.85rem', color: 'var(--mist)', marginBottom: '1.25rem', borderLeft: `2px solid ${GOLD}`, paddingLeft: '.8rem' }}>
              Welcome back — your design was waiting for you. Photographs aren&apos;t kept between visits, so add yours again if you&apos;d like one.
            </p>
          )}

          {/* step title */}
          <h1 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(1.5rem,2.6vw,2rem)', lineHeight: 1.1, color: 'var(--ink)', marginBottom: 'clamp(1.25rem,2.5vw,1.75rem)', letterSpacing: '-.015em' }}>
            {STEP_TITLES[step]}
          </h1>

          {/* step body */}
          <div ref={stepRef} style={{ flex: 1 }}>
            {shareUrl && last ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--mist)', lineHeight: 1.7 }}>
                  Your invitation is ready. Share this link with your guests{design.details.rsvpUrl ? '.' : <> — replies will arrive at <strong style={{ color: 'var(--ink)' }}>{design.details.email}</strong>.</>}
                </p>
                <div style={{ border: '1px solid rgba(162,129,90,.35)', padding: '1rem', wordBreak: 'break-all', fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.72rem', color: 'var(--ink)', background: 'rgba(162,129,90,.05)' }}>
                  {shareUrl}
                </div>
                <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
                  <button onClick={copy} style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--ivory)', background: 'var(--ink)', border: 'none', padding: '1em 2.2em', minHeight: 44, cursor: 'pointer' }}>
                    {copied ? 'Copied ✓' : 'Copy link'}
                  </button>
                  <a href={shareUrl} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.25em', textTransform: 'uppercase', color: GOLD, border: '1px solid rgba(162,129,90,.4)', padding: '1em 2.2em', minHeight: 44, display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
                    Open invitation
                  </a>
                </div>
                <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontSize: '.95rem', color: 'var(--mist)', lineHeight: 1.7, borderTop: '1px solid rgba(162,129,90,.15)', paddingTop: '1.25rem' }}>
                  For an invitation composed entirely around your story — cinematic motion, photography, guest dashboard —{' '}
                  <Link href="/collection" style={{ color: GOLD }}>explore commissions →</Link>
                </p>
              </div>
            ) : steps[step]}
          </div>

          {error && (
            <p role="alert" style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.92rem', color: '#C0564C', marginTop: '1.25rem' }}>
              {error}
            </p>
          )}

          {/* navigation */}
          {!(shareUrl && last) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: 'clamp(1.75rem,3vw,2.5rem)', paddingTop: '1.25rem', borderTop: '1px solid rgba(162,129,90,.15)' }}>
              {step > 0 && (
                <button type="button" onClick={() => go(step - 1)}
                  style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--mist)', background: 'none', border: 'none', cursor: 'pointer', minHeight: 44, padding: '.5em 0' }}>
                  ← Back
                </button>
              )}
              <button type="button" onClick={last ? finish : () => go(step + 1)} disabled={finishing}
                style={{
                  fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase',
                  color: 'var(--ivory)', background: finishing ? 'var(--mist)' : 'var(--ink)',
                  border: 'none', padding: '1.15em 2.6em', minHeight: 48,
                  cursor: finishing ? 'default' : 'pointer', marginLeft: 'auto',
                }}>
                {last ? (finishing ? 'Composing…' : 'Create my invitation') : 'Continue'}
              </button>
            </div>
          )}
        </div>

        {/* ── desktop preview column ── */}
        <div className="bld-preview-col" aria-label="Live preview of your invitation">
          <div className="bld-preview-card">
            <InvitationPreview design={design} />
          </div>
        </div>
      </div>

      {/* ── mobile preview bar + drawer ── */}
      <div className="bld-mob-bar" style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 1200,
        padding: '.8rem 1rem calc(.8rem + env(safe-area-inset-bottom))',
        background: 'rgba(248,245,240,.94)', backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(162,129,90,.2)',
        justifyContent: 'center',
      }}>
        <button type="button" onClick={() => setDrawer(true)}
          style={{
            fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem',
            letterSpacing: '.26em', textTransform: 'uppercase',
            color: GOLD, background: 'transparent',
            border: '1px solid rgba(162,129,90,.45)',
            padding: '1em 2.4em', minHeight: 44, cursor: 'pointer', width: '100%', maxWidth: 420,
          }}>
          Preview my invitation
        </button>
      </div>

      {drawer && (
        <div className="bld-drawer" role="dialog" aria-modal="true" aria-label="Invitation preview"
          style={{ position: 'fixed', inset: 0, zIndex: 1300 }}>
          <div onClick={() => setDrawer(false)} aria-hidden style={{ position: 'absolute', inset: 0, background: 'rgba(14,13,11,.55)' }} />
          <div ref={drawerRef} style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, top: '8svh',
            background: '#EDE9E1', borderRadius: '18px 18px 0 0', overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.9rem 1.2rem', borderBottom: '1px solid rgba(162,129,90,.2)' }}>
              <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.52rem', letterSpacing: '.3em', textTransform: 'uppercase', color: GOLD }}>Preview</p>
              <button type="button" onClick={() => setDrawer(false)} aria-label="Close preview"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mist)', minWidth: 44, minHeight: 44, fontSize: '1rem' }}>
                ✕
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <InvitationPreview design={design} full />
            </div>
            <div style={{ padding: '.8rem 1.2rem calc(.8rem + env(safe-area-inset-bottom))', borderTop: '1px solid rgba(162,129,90,.2)', background: 'rgba(248,245,240,.9)' }}>
              <button type="button" onClick={() => setDrawer(false)}
                style={{ width: '100%', fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.26em', textTransform: 'uppercase', color: 'var(--ivory)', background: 'var(--ink)', border: 'none', padding: '1em', minHeight: 44, cursor: 'pointer' }}>
                Keep editing
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
