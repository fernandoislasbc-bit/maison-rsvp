'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import InkReveal from '@/components/ui/ink-reveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Palette ─── */
const NAVY   = '#0A1628';
const TEAL   = '#1B5E7A';
const GOLD   = '#C9A870';
const IVORY  = '#F5F0E8';
const ROSE   = '#B8826F';
const CREAM  = '#FAF6F0';
const MIST   = 'rgba(245,240,232,.5)';

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ─── Ornament divider ─── */
function Ornament({ color = GOLD, my = '0' }: { color?: string; my?: string }) {
  return (
    <div className="oc-ornament" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', margin: `${my} 0`, opacity: 0 }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${color}55)` }} />
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 0 L22 11 L11 22 L0 11 Z" fill={color} opacity=".4" />
        <path d="M11 4 L18 11 L11 18 L4 11 Z" fill={color} opacity=".7" />
        <circle cx="11" cy="11" r="2" fill={color} />
      </svg>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${color}55)` }} />
    </div>
  );
}

/* ─── Chapter label ─── */
function ChapterLabel({ roman, label }: { roman: string; label: string }) {
  return (
    <div className="oc-label" style={{ opacity: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.6rem', marginBottom: '2rem' }}>
      <p style={{
        fontFamily: 'var(--font-manrope), sans-serif',
        fontSize: '.5rem', letterSpacing: '.45em', textTransform: 'uppercase',
        color: GOLD,
      }}>{roman} · {label}</p>
      <div style={{ width: 32, height: 1, background: GOLD, opacity: .4 }} />
    </div>
  );
}

/* ─── Global styles ─── */
const GLOBAL_CSS = `
  @keyframes oc-float {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: .06; }
    50% { transform: translateY(-24px) rotate(8deg); opacity: .1; }
  }
  @keyframes oc-shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes oc-cursor-pulse {
    0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: .7; }
    50% { transform: translate(-50%,-50%) scale(1.4); opacity: .3; }
  }
  @keyframes oc-title-in {
    from { opacity: 0; transform: translateY(60px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes oc-page-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes oc-intro-text {
    0%   { opacity: 0; letter-spacing: .6em; }
    40%  { opacity: 1; letter-spacing: .35em; }
    80%  { opacity: 1; letter-spacing: .35em; }
    100% { opacity: 0; letter-spacing: .35em; }
  }
  .oc-hero-title {
    will-change: transform, opacity;
    animation: oc-title-in 2s 0.3s both cubic-bezier(0.16, 1, 0.3, 1);
  }
  .oc-cursor {
    position: fixed; pointer-events: none; z-index: 9999;
    width: 10px; height: 10px; border-radius: 50%;
    background: ${GOLD}; mix-blend-mode: screen;
    animation: oc-cursor-pulse 2s ease-in-out infinite;
    transition: transform .15s ease;
  }
  .oc-cursor-ring {
    position: fixed; pointer-events: none; z-index: 9998;
    width: 40px; height: 40px; border-radius: 50%;
    border: 1px solid ${GOLD}44;
    transform: translate(-50%, -50%);
    transition: left .18s ease, top .18s ease;
  }
  .oc-reveal-hint {
    animation: oc-float 4s ease-in-out infinite;
  }
  .oc-gold-shimmer {
    background: linear-gradient(90deg, ${GOLD} 0%, #f0d9a8 40%, ${GOLD} 60%, #a07c45 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: oc-shimmer 6s linear infinite;
  }
  .oc-photo-frame {
    position: relative;
  }
  .oc-photo-frame::before {
    content: '';
    position: absolute;
    inset: -8px;
    border: 1px solid ${GOLD}22;
    pointer-events: none;
    z-index: 2;
  }
  .oc-photo-frame::after {
    content: '';
    position: absolute;
    inset: -14px;
    border: 1px solid ${GOLD}0F;
    pointer-events: none;
    z-index: 2;
  }
`;

export default function OliverAndCharlottePage() {
  const containerRef    = useRef<HTMLDivElement>(null);
  const heroRef         = useRef<HTMLDivElement>(null);
  const cursorRef       = useRef<HTMLDivElement>(null);
  const cursorRingRef   = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [rsvpForm, setRsvpForm] = useState({ name: '', attending: '', guests: '1', message: '' });
  const [rsvpSent, setRsvpSent] = useState(false);
  const [introPhase, setIntroPhase] = useState<'playing' | 'fading' | 'done'>('playing');
  const introTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Mobile detection */
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  /* Intro handlers */
  const triggerFade = React.useCallback(() => {
    setIntroPhase('fading');
    introTimerRef.current = setTimeout(() => setIntroPhase('done'), 1600);
  }, []);

  useEffect(() => {
    return () => { if (introTimerRef.current) clearTimeout(introTimerRef.current); };
  }, []);

  /* Custom cursor */
  useEffect(() => {
    const cursor = cursorRef.current;
    const ring   = cursorRingRef.current;
    if (!cursor || !ring) return;
    const onMove = (e: MouseEvent) => {
      gsap.set(cursor, { x: e.clientX - 5, y: e.clientY - 5 });
      gsap.to(ring, { left: e.clientX, top: e.clientY, duration: .18, ease: 'power2.out' });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  /* GSAP scroll animations */
  useEffect(() => {
    if (introPhase !== 'done') return;
    const ctx = gsap.context(() => {

      /* Ornaments */
      gsap.utils.toArray<HTMLElement>('.oc-ornament').forEach(el => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          onEnter: () => gsap.to(el, { opacity: 1, duration: 1.2, ease: 'power2.out' }),
        });
      });

      /* Chapter labels */
      gsap.utils.toArray<HTMLElement>('.oc-label').forEach(el => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          onEnter: () => gsap.fromTo(el,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
          ),
        });
      });

      /* Fade-up elements */
      gsap.utils.toArray<HTMLElement>('.oc-fade-up').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          onEnter: () => gsap.fromTo(el,
            { opacity: 0, y: 48 },
            { opacity: 1, y: 0, duration: 1.4, delay: i % 4 * 0.1, ease: 'power4.out' }
          ),
        });
      });

      /* Illustration cards slide in from sides */
      gsap.utils.toArray<HTMLElement>('.oc-slide-left').forEach(el => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 82%',
          onEnter: () => gsap.fromTo(el,
            { opacity: 0, x: -80 },
            { opacity: 1, x: 0, duration: 1.6, ease: 'power4.out' }
          ),
        });
      });

      gsap.utils.toArray<HTMLElement>('.oc-slide-right').forEach(el => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 82%',
          onEnter: () => gsap.fromTo(el,
            { opacity: 0, x: 80 },
            { opacity: 1, x: 0, duration: 1.6, ease: 'power4.out' }
          ),
        });
      });

      /* Parallax on illustration images */
      gsap.utils.toArray<HTMLElement>('.oc-parallax').forEach(el => {
        gsap.to(el, {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      });

      /* Gold line draw-in */
      gsap.utils.toArray<HTMLElement>('.oc-gold-line').forEach(el => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          onEnter: () => gsap.fromTo(el,
            { scaleX: 0 },
            { scaleX: 1, duration: 1.8, ease: 'expo.out', transformOrigin: 'left center' }
          ),
        });
      });

      /* Scale-in for centered cards */
      gsap.utils.toArray<HTMLElement>('.oc-scale-in').forEach(el => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          onEnter: () => gsap.fromTo(el,
            { opacity: 0, scale: .92 },
            { opacity: 1, scale: 1, duration: 1.6, ease: 'power4.out' }
          ),
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, [isMobile, introPhase]);

  if (isMobile === null) return null;

  /* ── Video intro overlay ── */
  if (introPhase !== 'done') {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }}></style>
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: NAVY,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          transition: 'opacity 1.6s cubic-bezier(0.4,0,0.2,1)',
          opacity: introPhase === 'fading' ? 0 : 1,
        }}>
          {/* Video */}
          <video
            autoPlay
            muted
            playsInline
            onEnded={triggerFade}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              filter: introPhase === 'fading' ? 'blur(24px) brightness(.6)' : 'blur(0px) brightness(1)',
              transition: 'filter 1.6s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            <source src="/assets/oc/oc-intro.mp4" type="video/mp4" />
          </video>

          {/* Vignette */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: `radial-gradient(ellipse at center, transparent 30%, ${NAVY}CC 100%)`,
          }} />

          {/* Bottom branding */}
          <div style={{
            position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
            zIndex: 2, textAlign: 'center', pointerEvents: 'none',
          }}>
            <p style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.42rem', letterSpacing: '.45em', textTransform: 'uppercase',
              color: `${GOLD}88`,
              animation: 'oc-intro-text 8s 0.5s both ease-in-out',
            }}>
              Maison RSVP · The Archive
            </p>
          </div>

          {/* Skip button */}
          <button
            onClick={triggerFade}
            style={{
              position: 'absolute', bottom: '2rem', right: '2rem', zIndex: 3,
              background: 'transparent', border: `1px solid ${GOLD}44`,
              color: `${IVORY}88`,
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.48rem', letterSpacing: '.3em', textTransform: 'uppercase',
              padding: '.6rem 1.4rem',
              cursor: 'pointer',
              transition: 'border-color .3s, color .3s',
            }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = GOLD; (e.target as HTMLButtonElement).style.color = IVORY; }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = `${GOLD}44`; (e.target as HTMLButtonElement).style.color = `${IVORY}88`; }}
          >
            Skip intro
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Global CSS */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }}></style>

      {/* Custom cursor */}
      <div ref={cursorRef} className="oc-cursor" style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9999, width: 10, height: 10, borderRadius: '50%', background: GOLD, mixBlendMode: 'screen', transform: 'translate(-50%,-50%)' }} />
      <div ref={cursorRingRef} className="oc-cursor-ring" />

      {/* Paper grain overlay */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 9990, pointerEvents: 'none',
        opacity: .025, backgroundImage: GRAIN, backgroundSize: '220px', mixBlendMode: 'multiply',
      }} />

      <Nav />

      <main ref={containerRef} style={{ background: NAVY, color: IVORY, overflowX: 'hidden', animation: 'oc-page-in .8s ease both' }}>

        {/* ══ HERO — Ink Reveal Envelope ══ */}
        <section
          ref={heroRef}
          style={{
            position: 'relative',
            height: '100vh',
            minHeight: 600,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Peacock botanical border (revealed by ink) */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <Image
              src="/assets/oc/oc-envelope.png"
              alt="Peacock botanical border"
              fill
              priority
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>

          {/* Dark navy overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to bottom, ${NAVY}CC 0%, ${NAVY}88 40%, ${NAVY}AA 70%, ${NAVY}EE 100%)`,
            zIndex: 1,
          }} />

          {/* InkReveal canvas — dark navy mask that's carved away by the cursor */}
          <InkReveal
            maskColor={[10, 22, 40]}
            brushSize={isMobile ? 80 : 160}
            lifetime={900}
            rStart={14}
            rVary={0.5}
            stampStep={8}
            maxStamps={250}
            gradientStops={[0.92, 0.82, 0]}
            style={{ zIndex: 2 }}
          />

          {/* Hero content */}
          <div style={{
            position: 'relative', zIndex: 10,
            textAlign: 'center',
            padding: '0 clamp(1.5rem, 5vw, 4rem)',
            pointerEvents: 'none',
          }}>
            <p style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.52rem', letterSpacing: '.55em', textTransform: 'uppercase',
              color: GOLD, marginBottom: '2rem', opacity: .9,
            }}>
              Maison RSVP · The Archive
            </p>

            <h1 className="oc-hero-title" style={{
              fontFamily: 'var(--font-prata), Georgia, serif',
              fontSize: 'clamp(3.5rem, 10vw, 10rem)',
              lineHeight: .92, letterSpacing: '-.025em',
              color: IVORY,
              marginBottom: '1.5rem',
            }}>
              Oliver &amp;<br />Charlotte
            </h1>

            <p style={{
              fontFamily: 'var(--font-garamond), Georgia, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 1.8vw, 1.35rem)',
              color: `${IVORY}99`,
              marginBottom: '2.5rem',
            }}>
              Saturday, the twenty-first of September · Two thousand and twenty-five
            </p>

            {/* Ornamental monogram */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
              <div style={{ width: 60, height: 1, background: `linear-gradient(to right, transparent, ${GOLD}66)` }} />
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="17" stroke={GOLD} strokeWidth=".5" opacity=".4" />
                <circle cx="18" cy="18" r="13" stroke={GOLD} strokeWidth=".5" opacity=".25" />
                <text x="18" y="23" textAnchor="middle" fontFamily="Georgia, serif" fontSize="14" fill={GOLD} opacity=".85">✦</text>
              </svg>
              <div style={{ width: 60, height: 1, background: `linear-gradient(to left, transparent, ${GOLD}66)` }} />
            </div>
          </div>

          {/* Reveal hint */}
          <p className="oc-reveal-hint" style={{
            position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.48rem', letterSpacing: '.4em', textTransform: 'uppercase',
            color: `${GOLD}77`, zIndex: 10, whiteSpace: 'nowrap', pointerEvents: 'none',
          }}>
            Move to reveal · Scroll to enter
          </p>

          {/* Bottom gradient */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, zIndex: 10,
            background: `linear-gradient(to bottom, transparent, ${NAVY})`,
          }} />
        </section>

        {/* ══ MONOGRAM CHAPTER OPENER ══ */}
        <section style={{
          padding: 'clamp(5rem, 10vw, 9rem) clamp(2rem, 5vw, 5rem)',
          textAlign: 'center',
          background: NAVY,
          position: 'relative',
        }}>
          {/* Floating teal glow */}
          <div aria-hidden style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60vw', height: '60vw', maxWidth: 600, maxHeight: 600,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${TEAL}18 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          <Ornament my="0" />

          <div style={{ marginTop: '3rem' }}>
            <p className="oc-fade-up" style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.5rem', letterSpacing: '.45em', textTransform: 'uppercase',
              color: GOLD, marginBottom: '1.5rem',
            }}>
              Together with their families
            </p>

            {/* O & C monogram */}
            <div className="oc-scale-in" style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
              <h2 style={{
                fontFamily: 'var(--font-prata), Georgia, serif',
                fontSize: 'clamp(5rem, 18vw, 16rem)',
                lineHeight: .85, letterSpacing: '-.04em',
              }}>
                <span className="oc-gold-shimmer">O</span>
                <span style={{ color: `${IVORY}22`, fontSize: '.45em', verticalAlign: 'middle', fontFamily: 'var(--font-garamond), serif', fontStyle: 'italic' }}> & </span>
                <span className="oc-gold-shimmer">C</span>
              </h2>
            </div>

            <p className="oc-fade-up" style={{
              fontFamily: 'var(--font-garamond), Georgia, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)',
              color: MIST, lineHeight: 1.7,
              maxWidth: '36ch', margin: '0 auto 2rem',
            }}>
              Request the honour of your presence as they exchange their vows and celebrate the beginning of a life written together.
            </p>

            <Ornament my="0" />
          </div>
        </section>

        {/* ══ CHAPTER I — THE BAR ══ */}
        <section style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(2rem, 5vw, 5rem)', background: `${NAVY}` }}>
          <ChapterLabel roman="I" label="The Beginning" />

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 'clamp(2rem, 5vw, 5rem)',
            alignItems: 'center',
            maxWidth: 1200,
            margin: '0 auto',
          }}>
            {/* Illustration */}
            <div className="oc-slide-left oc-photo-frame" style={{
              position: 'relative',
              aspectRatio: '2/3',
              borderRadius: '2px',
              overflow: 'hidden',
            }}>
              <div className="oc-parallax" style={{ position: 'absolute', inset: '-12%', width: '124%', height: '124%' }}>
                <Image
                  src="/assets/oc/oc-couple-bar.png"
                  alt="Oliver and Charlotte at the bar"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
              </div>
              {/* Art Nouveau teal overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(to top, ${NAVY}CC 0%, transparent 50%)`,
              }} />
              <p style={{
                position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem',
                fontFamily: 'var(--font-garamond), Georgia, serif',
                fontStyle: 'italic', fontSize: 'clamp(.8rem, 1vw, .95rem)',
                color: `${IVORY}88`, lineHeight: 1.6,
              }}>
                "The night we met, the champagne had barely touched the glass before everything changed."
              </p>
            </div>

            {/* Text */}
            <div className="oc-slide-right">
              <p className="oc-fade-up" style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '.48rem', letterSpacing: '.35em', textTransform: 'uppercase',
                color: GOLD, marginBottom: '1.5rem',
              }}>
                November · The Connaught Bar · London
              </p>

              <h2 className="oc-fade-up" style={{
                fontFamily: 'var(--font-prata), Georgia, serif',
                fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)',
                lineHeight: 1.05, letterSpacing: '-.02em',
                color: IVORY, marginBottom: '1.5rem',
              }}>
                He ordered<br />
                <em style={{ fontFamily: 'var(--font-garamond), serif', fontStyle: 'italic', color: GOLD }}>the Negroni.<br />She arrived.</em>
              </h2>

              <Ornament color={TEAL} my="1.5rem" />

              <p className="oc-fade-up" style={{
                fontFamily: 'var(--font-garamond), Georgia, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(.9rem, 1.2vw, 1.1rem)',
                color: MIST, lineHeight: 1.85, marginBottom: '1.25rem',
              }}>
                It was a rainy Thursday in November — the kind London reserves for beginnings. Oliver had arrived early, as he always did. Charlotte arrived fashionably late, laughing at something only she had heard. Their eyes met across the bar. The rest, they say, is a story worth telling.
              </p>

              <p className="oc-fade-up" style={{
                fontFamily: 'var(--font-garamond), Georgia, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(.9rem, 1.2vw, 1.1rem)',
                color: MIST, lineHeight: 1.85,
              }}>
                Two years of Sunday mornings, Amalfi sunsets, and choosing each other, every day, without question.
              </p>

              <div className="oc-fade-up" style={{ marginTop: '2rem' }}>
                <div className="oc-gold-line" style={{ height: 1, background: `linear-gradient(to right, ${GOLD}55, transparent)`, transformOrigin: 'left center' }} />
              </div>
            </div>
          </div>
        </section>

        {/* ══ PEACOCK WALLPAPER INTERLUDE ══ */}
        <div style={{ position: 'relative', height: 'clamp(300px, 50vh, 550px)', overflow: 'hidden' }}>
          <div className="oc-parallax" style={{ position: 'absolute', inset: '-15%', width: '130%', height: '130%' }}>
            <Image
              src="/assets/oc/oc-wallpaper.png"
              alt="Peacock chinoiserie"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to bottom, ${NAVY} 0%, ${NAVY}44 30%, ${NAVY}44 70%, ${NAVY} 100%)`,
          }} />
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '2rem',
          }}>
            <p className="oc-fade-up" style={{
              fontFamily: 'var(--font-prata), Georgia, serif',
              fontSize: 'clamp(1.4rem, 3vw, 2.8rem)',
              color: IVORY, lineHeight: 1.1, letterSpacing: '-.02em',
            }}>
              "In every garden, in every season,<br />
              <em style={{ fontFamily: 'var(--font-garamond), serif', fontStyle: 'italic', color: GOLD }}>she was the one he returned to."</em>
            </p>
          </div>
        </div>

        {/* ══ CHAPTER II — THE PROPOSAL ══ */}
        <section style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(2rem, 5vw, 5rem)', background: NAVY }}>
          <ChapterLabel roman="II" label="On Bended Knee" />

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 'clamp(2rem, 5vw, 5rem)',
            alignItems: 'center',
            maxWidth: 1200,
            margin: '0 auto',
          }}>
            {/* Text first on desktop */}
            <div className="oc-slide-left" style={{ order: isMobile ? 2 : 1 }}>
              <p className="oc-fade-up" style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '.48rem', letterSpacing: '.35em', textTransform: 'uppercase',
                color: GOLD, marginBottom: '1.5rem',
              }}>
                August · Amalfi Coast · Italy
              </p>

              <h2 className="oc-fade-up" style={{
                fontFamily: 'var(--font-prata), Georgia, serif',
                fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)',
                lineHeight: 1.05, letterSpacing: '-.02em',
                color: IVORY, marginBottom: '1.5rem',
              }}>
                The sun set<br />
                <em style={{ fontFamily: 'var(--font-garamond), serif', fontStyle: 'italic', color: GOLD }}>on one life,<br />and rose on another.</em>
              </h2>

              <Ornament color={ROSE} my="1.5rem" />

              <p className="oc-fade-up" style={{
                fontFamily: 'var(--font-garamond), Georgia, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(.9rem, 1.2vw, 1.1rem)',
                color: MIST, lineHeight: 1.85, marginBottom: '1.25rem',
              }}>
                He had carried the ring across three countries. She had suspected nothing — or so she claimed. The village of Ravello glowed amber as the sun descended into the Tyrrhenian. Oliver knelt.
              </p>

              <p className="oc-fade-up" style={{
                fontFamily: 'var(--font-garamond), Georgia, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(.9rem, 1.2vw, 1.1rem)',
                color: MIST, lineHeight: 1.85, marginBottom: '1.5rem',
              }}>
                Charlotte laughed first. Then cried. Then said yes — before he had finished the question.
              </p>

              {/* The ring detail */}
              <div className="oc-fade-up oc-photo-frame" style={{
                position: 'relative',
                width: isMobile ? '100%' : 240,
                aspectRatio: '3/4',
                borderRadius: '2px',
                overflow: 'hidden',
              }}>
                <Image
                  src="/assets/oc/oc-ring.png"
                  alt="The engagement ring"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
              </div>
            </div>

            {/* Proposal illustration */}
            <div className="oc-slide-right oc-photo-frame" style={{
              position: 'relative',
              aspectRatio: '2/3',
              borderRadius: '2px',
              overflow: 'hidden',
              order: isMobile ? 1 : 2,
            }}>
              <div className="oc-parallax" style={{ position: 'absolute', inset: '-12%', width: '124%', height: '124%' }}>
                <Image
                  src="/assets/oc/oc-proposal.png"
                  alt="The proposal"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(to top, ${NAVY}BB 0%, transparent 55%)`,
              }} />
              <div style={{
                position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem',
              }}>
                <p style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '.44rem', letterSpacing: '.3em', textTransform: 'uppercase',
                  color: GOLD, marginBottom: '.4rem',
                }}>Ravello · Amalfi Coast</p>
                <p style={{
                  fontFamily: 'var(--font-garamond), Georgia, serif',
                  fontStyle: 'italic', fontSize: '.9rem',
                  color: `${IVORY}88`,
                }}>August 2024</p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CHAPTER III — THE CELEBRATION / WINE CELLAR ══ */}
        <section style={{
          position: 'relative',
          overflow: 'hidden',
          padding: 'clamp(5rem, 10vw, 9rem) clamp(2rem, 5vw, 5rem)',
        }}>
          {/* Wine cellar background */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <Image
              src="/assets/oc/oc-cellar.png"
              alt="Wine cellar celebration"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
          <div style={{
            position: 'absolute', inset: 0,
            background: `${NAVY}D0`,
          }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <ChapterLabel roman="III" label="The Celebration" />

            <p className="oc-fade-up" style={{
              fontFamily: 'var(--font-prata), Georgia, serif',
              fontSize: 'clamp(.6rem, 1vw, .75rem)',
              letterSpacing: '.4em', textTransform: 'uppercase',
              color: GOLD, marginBottom: '1.5rem',
            }}>
              Vínum est poesia in bottiglia
            </p>

            <h2 className="oc-fade-up" style={{
              fontFamily: 'var(--font-prata), Georgia, serif',
              fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
              lineHeight: .95, letterSpacing: '-.03em',
              color: IVORY, marginBottom: '1rem',
            }}>
              A cellar of stories.<br />
              <em style={{ fontFamily: 'var(--font-garamond), serif', fontStyle: 'italic', color: GOLD }}>A table of friends.</em>
            </h2>

            <Ornament my="2rem" />

            <p className="oc-fade-up" style={{
              fontFamily: 'var(--font-garamond), Georgia, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(.95rem, 1.3vw, 1.15rem)',
              color: MIST, lineHeight: 1.8, marginBottom: '3rem',
            }}>
              Join us for an evening of champagne, candlelight, and the company of those who matter most. The reception will be held in the vaulted wine cellar of Château Bellecour — a space reserved for the most intimate of gatherings.
            </p>
          </div>
        </section>

        {/* ══ EVENT DETAILS CARD ══ */}
        <section style={{
          padding: 'clamp(4rem, 8vw, 7rem) clamp(2rem, 5vw, 5rem)',
          background: NAVY,
        }}>
          <div className="oc-scale-in" style={{
            maxWidth: 900,
            margin: '0 auto',
            border: `1px solid ${GOLD}22`,
            padding: 'clamp(2.5rem, 5vw, 5rem)',
            position: 'relative',
            background: `linear-gradient(145deg, ${TEAL}0A 0%, ${NAVY} 100%)`,
          }}>
            {/* Corner ornaments */}
            {['top left', 'top right', 'bottom left', 'bottom right'].map((pos) => {
              const [v, h] = pos.split(' ');
              return (
                <div key={pos} style={{
                  position: 'absolute',
                  [v]: 16, [h]: 16,
                  width: 28, height: 28,
                  borderTop: v === 'top' ? `1px solid ${GOLD}55` : 'none',
                  borderBottom: v === 'bottom' ? `1px solid ${GOLD}55` : 'none',
                  borderLeft: h === 'left' ? `1px solid ${GOLD}55` : 'none',
                  borderRight: h === 'right' ? `1px solid ${GOLD}55` : 'none',
                }} />
              );
            })}

            <p style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.48rem', letterSpacing: '.45em', textTransform: 'uppercase',
              color: GOLD, textAlign: 'center', marginBottom: '2.5rem',
            }}>
              The Wedding of Oliver & Charlotte
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1px 1fr',
              gap: 'clamp(2rem, 4vw, 3.5rem)',
              alignItems: 'start',
            }}>
              {/* Ceremony */}
              <div className="oc-fade-up" style={{ textAlign: 'center' }}>
                <p style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '.44rem', letterSpacing: '.35em', textTransform: 'uppercase',
                  color: GOLD, marginBottom: '1.2rem',
                }}>The Ceremony</p>

                <p style={{
                  fontFamily: 'var(--font-prata), Georgia, serif',
                  fontSize: 'clamp(1.3rem, 2.5vw, 2rem)',
                  color: IVORY, lineHeight: 1.1, marginBottom: '1rem',
                }}>Saturday<br />21 September 2025</p>

                <p style={{
                  fontFamily: 'var(--font-garamond), Georgia, serif',
                  fontStyle: 'italic', fontSize: 'clamp(.85rem, 1.1vw, 1rem)',
                  color: MIST, lineHeight: 1.7, marginBottom: '.5rem',
                }}>Half past three in the afternoon</p>

                <p style={{
                  fontFamily: 'var(--font-garamond), Georgia, serif',
                  fontStyle: 'italic', fontSize: 'clamp(.85rem, 1.1vw, 1rem)',
                  color: MIST, lineHeight: 1.7,
                }}>Château Bellecour<br />Saint-Émilion, Bordeaux, France</p>
              </div>

              {/* Gold divider */}
              {!isMobile && (
                <div style={{ width: 1, background: `linear-gradient(to bottom, transparent, ${GOLD}44, transparent)`, alignSelf: 'stretch' }} />
              )}
              {isMobile && <Ornament color={GOLD} />}

              {/* Reception */}
              <div className="oc-fade-up" style={{ textAlign: 'center' }}>
                <p style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '.44rem', letterSpacing: '.35em', textTransform: 'uppercase',
                  color: GOLD, marginBottom: '1.2rem',
                }}>The Reception</p>

                <p style={{
                  fontFamily: 'var(--font-prata), Georgia, serif',
                  fontSize: 'clamp(1.3rem, 2.5vw, 2rem)',
                  color: IVORY, lineHeight: 1.1, marginBottom: '1rem',
                }}>Dinner & Dancing<br />from Six O'clock</p>

                <p style={{
                  fontFamily: 'var(--font-garamond), Georgia, serif',
                  fontStyle: 'italic', fontSize: 'clamp(.85rem, 1.1vw, 1rem)',
                  color: MIST, lineHeight: 1.7, marginBottom: '.5rem',
                }}>The Vaulted Wine Cellar</p>

                <p style={{
                  fontFamily: 'var(--font-garamond), Georgia, serif',
                  fontStyle: 'italic', fontSize: 'clamp(.85rem, 1.1vw, 1rem)',
                  color: MIST, lineHeight: 1.7,
                }}>Black tie · Dancing encouraged<br />Fireworks at midnight</p>
              </div>
            </div>

            <Ornament my="2.5rem" />

            {/* Additional details */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '2rem',
              textAlign: 'center',
            }}>
              {[
                { label: 'Dress Code', value: 'Black Tie', sub: 'Peacock hues welcomed' },
                { label: 'Accommodation', value: 'Château Bellecour', sub: 'Rooms reserved for guests' },
                { label: 'RSVP By', value: '1 August 2025', sub: 'Kindly respond below' },
              ].map(item => (
                <div key={item.label} className="oc-fade-up">
                  <p style={{
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '.44rem', letterSpacing: '.3em', textTransform: 'uppercase',
                    color: `${GOLD}88`, marginBottom: '.5rem',
                  }}>{item.label}</p>
                  <p style={{
                    fontFamily: 'var(--font-prata), Georgia, serif',
                    fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                    color: IVORY, marginBottom: '.3rem',
                  }}>{item.value}</p>
                  <p style={{
                    fontFamily: 'var(--font-garamond), Georgia, serif',
                    fontStyle: 'italic', fontSize: '.9rem',
                    color: MIST,
                  }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ THE COUPLE — SECOND PORTRAIT ══ */}
        <section style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(2rem, 5vw, 5rem)', background: NAVY }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>

            {/* Full-bleed editorial illustration */}
            <div className="oc-scale-in oc-photo-frame" style={{
              position: 'relative',
              width: '100%',
              aspectRatio: isMobile ? '3/4' : '16/9',
              borderRadius: '2px',
              overflow: 'hidden',
              marginBottom: 'clamp(2rem, 4vw, 3rem)',
            }}>
              <div className="oc-parallax" style={{ position: 'absolute', inset: '-10%', width: '120%', height: '120%' }}>
                <Image
                  src="/assets/oc/oc-couple-2.png"
                  alt="Oliver and Charlotte"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
              </div>
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(to right, ${NAVY}88 0%, transparent 40%, transparent 60%, ${NAVY}88 100%)`,
              }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(to top, ${NAVY}CC 0%, transparent 50%)`,
              }} />
              <div style={{
                position: 'absolute', bottom: 'clamp(1.5rem, 3vw, 2.5rem)',
                left: '50%', transform: 'translateX(-50%)',
                textAlign: 'center', whiteSpace: 'nowrap',
              }}>
                <p style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '.44rem', letterSpacing: '.4em', textTransform: 'uppercase',
                  color: GOLD, marginBottom: '.5rem',
                }}>The Connaught Bar · London · 2022</p>
                <p style={{
                  fontFamily: 'var(--font-garamond), Georgia, serif',
                  fontStyle: 'italic', fontSize: 'clamp(.9rem, 1.2vw, 1.1rem)',
                  color: `${IVORY}77`,
                }}>Where it all began.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '3rem' }}>
              {[
                {
                  title: 'Oliver James Wentworth',
                  text: 'A sommelier by trade, a romantic by nature. He speaks three languages, collects first editions, and never misses a sunrise. He has been ready for Charlotte his whole life — he simply had not yet found her.',
                },
                {
                  title: 'Charlotte Elise Vautier',
                  text: 'A landscape architect who designs gardens for the world\'s most discerning clients, and who brings the same devotion to every corner of her own life. She arrived at The Connaught that Thursday and changed everything.',
                },
              ].map(person => (
                <div key={person.title} className="oc-fade-up">
                  <p style={{
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '.46rem', letterSpacing: '.3em', textTransform: 'uppercase',
                    color: GOLD, marginBottom: '.75rem',
                  }}>The</p>
                  <h3 style={{
                    fontFamily: 'var(--font-prata), Georgia, serif',
                    fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
                    color: IVORY, marginBottom: '1rem', letterSpacing: '-.01em',
                  }}>{person.title}</h3>
                  <p style={{
                    fontFamily: 'var(--font-garamond), Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: 'clamp(.88rem, 1.1vw, 1rem)',
                    color: MIST, lineHeight: 1.85,
                  }}>{person.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ RSVP SECTION ══ */}
        <section id="rsvp" style={{
          padding: 'clamp(5rem, 10vw, 9rem) clamp(2rem, 5vw, 5rem)',
          background: `linear-gradient(to bottom, ${NAVY}, ${TEAL}22, ${NAVY})`,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Envelope background */}
          <div style={{ position: 'absolute', inset: 0, opacity: .06 }}>
            <Image src="/assets/oc/oc-envelope.png" alt="" fill style={{ objectFit: 'cover' }} aria-hidden />
          </div>

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <ChapterLabel roman="IV" label="Your Reply" />

            <h2 className="oc-fade-up" style={{
              fontFamily: 'var(--font-prata), Georgia, serif',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              lineHeight: .96, letterSpacing: '-.03em',
              color: IVORY, marginBottom: '1rem',
            }}>
              Will you join us?
            </h2>

            <p className="oc-fade-up" style={{
              fontFamily: 'var(--font-garamond), Georgia, serif',
              fontStyle: 'italic', fontSize: 'clamp(.9rem, 1.2vw, 1.1rem)',
              color: MIST, lineHeight: 1.8, marginBottom: '3rem',
            }}>
              Kindly respond by the first of August, two thousand and twenty-five.
            </p>

            {rsvpSent ? (
              <div className="oc-scale-in" style={{
                border: `1px solid ${GOLD}33`,
                padding: '3rem 2rem',
                textAlign: 'center',
              }}>
                <p style={{
                  fontFamily: 'var(--font-prata), Georgia, serif',
                  fontSize: 'clamp(1.3rem, 2vw, 1.8rem)',
                  color: GOLD, marginBottom: '1rem',
                }}>With gratitude.</p>
                <p style={{
                  fontFamily: 'var(--font-garamond), Georgia, serif',
                  fontStyle: 'italic', fontSize: '1rem', color: MIST,
                }}>Your reply has been received. We look forward to celebrating with you.</p>
              </div>
            ) : (
              <form
                className="oc-scale-in"
                onSubmit={(e) => { e.preventDefault(); setRsvpSent(true); }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}
              >
                {/* Name */}
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '.44rem', letterSpacing: '.3em', textTransform: 'uppercase',
                    color: GOLD, marginBottom: '.6rem',
                  }}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={rsvpForm.name}
                    onChange={e => setRsvpForm(f => ({ ...f, name: e.target.value }))}
                    style={{
                      width: '100%', background: 'transparent',
                      border: `1px solid ${GOLD}33`,
                      padding: '1rem 1.2rem',
                      fontFamily: 'var(--font-garamond), Georgia, serif',
                      fontStyle: 'italic', fontSize: '1rem',
                      color: IVORY, outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    placeholder="Your full name"
                  />
                </div>

                {/* Attending */}
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '.44rem', letterSpacing: '.3em', textTransform: 'uppercase',
                    color: GOLD, marginBottom: '.6rem',
                  }}>Attending?</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {['Joyfully accepts', 'Regretfully declines'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setRsvpForm(f => ({ ...f, attending: opt }))}
                        style={{
                          flex: 1, padding: '.85rem 1rem',
                          border: `1px solid ${rsvpForm.attending === opt ? GOLD : `${GOLD}33`}`,
                          background: rsvpForm.attending === opt ? `${GOLD}18` : 'transparent',
                          fontFamily: 'var(--font-garamond), Georgia, serif',
                          fontStyle: 'italic', fontSize: '.95rem',
                          color: rsvpForm.attending === opt ? GOLD : MIST,
                          cursor: 'pointer',
                          transition: 'all .3s ease',
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of guests */}
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '.44rem', letterSpacing: '.3em', textTransform: 'uppercase',
                    color: GOLD, marginBottom: '.6rem',
                  }}>Number of Guests</label>
                  <select
                    value={rsvpForm.guests}
                    onChange={e => setRsvpForm(f => ({ ...f, guests: e.target.value }))}
                    style={{
                      width: '100%', background: NAVY,
                      border: `1px solid ${GOLD}33`,
                      padding: '1rem 1.2rem',
                      fontFamily: 'var(--font-garamond), Georgia, serif',
                      fontStyle: 'italic', fontSize: '1rem',
                      color: IVORY, outline: 'none',
                      cursor: 'pointer', appearance: 'none',
                    }}
                  >
                    {[1, 2, 3, 4].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '.44rem', letterSpacing: '.3em', textTransform: 'uppercase',
                    color: GOLD, marginBottom: '.6rem',
                  }}>A Message (Optional)</label>
                  <textarea
                    rows={4}
                    value={rsvpForm.message}
                    onChange={e => setRsvpForm(f => ({ ...f, message: e.target.value }))}
                    style={{
                      width: '100%', background: 'transparent',
                      border: `1px solid ${GOLD}33`,
                      padding: '1rem 1.2rem',
                      fontFamily: 'var(--font-garamond), Georgia, serif',
                      fontStyle: 'italic', fontSize: '1rem',
                      color: IVORY, outline: 'none', resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                    placeholder="Dietary requirements, a message for the couple…"
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '1.1rem 2rem',
                    border: `1px solid ${GOLD}`,
                    background: 'transparent',
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '.5rem', letterSpacing: '.35em', textTransform: 'uppercase',
                    color: GOLD, cursor: 'pointer',
                    transition: 'all .4s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = `${GOLD}18`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }}
                >
                  Send Reply
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ══ CLOSING SEAL ══ */}
        <section style={{
          padding: 'clamp(5rem, 10vw, 8rem) 2rem',
          textAlign: 'center',
          background: NAVY,
          borderTop: `1px solid ${GOLD}18`,
        }}>
          <Ornament />

          <div style={{ margin: '3rem 0' }}>
            {/* Wax seal SVG */}
            <svg viewBox="0 0 120 120" width="90" height="90" style={{ marginBottom: '1.5rem', opacity: .85 }}>
              <circle cx="60" cy="60" r="58" fill={TEAL} />
              <circle cx="60" cy="60" r="54" fill="none" stroke={GOLD} strokeWidth=".5" opacity=".5" />
              <circle cx="60" cy="60" r="48" fill="none" stroke={GOLD} strokeWidth=".25" opacity=".35" />
              {/* Peacock feather motif */}
              <ellipse cx="60" cy="38" rx="4" ry="18" fill={GOLD} opacity=".6" />
              <ellipse cx="60" cy="38" rx="8" ry="12" fill="none" stroke={GOLD} strokeWidth=".5" opacity=".4" />
              <circle cx="60" cy="38" r="4" fill={NAVY} opacity=".7" />
              {/* Letters */}
              <text x="42" y="76" fontFamily="Georgia, serif" fontSize="18" fill={IVORY} opacity=".9">O</text>
              <text x="63" y="76" fontFamily="Georgia, serif" fontSize="12" fill={GOLD} opacity=".7" fontStyle="italic">·</text>
              <text x="70" y="76" fontFamily="Georgia, serif" fontSize="18" fill={IVORY} opacity=".9">C</text>
            </svg>

            <p style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.48rem', letterSpacing: '.45em', textTransform: 'uppercase',
              color: GOLD, marginBottom: '1rem',
            }}>
              Oliver & Charlotte · September 2025
            </p>

            <p style={{
              fontFamily: 'var(--font-garamond), Georgia, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
              color: MIST, lineHeight: 1.75, maxWidth: '32ch', margin: '0 auto 2rem',
            }}>
              "Love does not consist in gazing at each other, but in looking outward together in the same direction."
            </p>

            <p style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.42rem', letterSpacing: '.3em', textTransform: 'uppercase',
              color: `${GOLD}55`,
            }}>
              — Antoine de Saint-Exupéry
            </p>
          </div>

          <Ornament />

          <div style={{ marginTop: '3rem' }}>
            <p style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.44rem', letterSpacing: '.35em', textTransform: 'uppercase',
              color: `${IVORY}33`, marginBottom: '.5rem',
            }}>
              Maison RSVP · The Archive
            </p>
            <Link
              href="/work"
              style={{
                fontFamily: 'var(--font-garamond), Georgia, serif',
                fontStyle: 'italic', fontSize: '.9rem',
                color: `${GOLD}66`, textDecoration: 'none',
                borderBottom: `1px solid ${GOLD}33`,
                paddingBottom: '.1em',
              }}
            >
              Return to The Archive
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
