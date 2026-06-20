'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ─── Handwritten letter SVG paths ─────────────────────── */
const LETTER_LINES = [
  'M 30 40 Q 120 35 210 42',
  'M 30 62 Q 140 57 200 65',
  'M 30 84 Q 100 79 180 86',
  'M 30 106 Q 130 101 195 108',
  'M 30 128 Q 115 123 170 130',
  'M 30 150 Q 125 145 205 152',
  'M 30 172 Q 90 167 160 174',
  'M 30 200 Q 60 195 95 200',
];

/* ─── Wax seal SVG ──────────────────────────────────────── */
function WaxSeal() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden>
      <circle cx="36" cy="36" r="32" fill="#A2815A" opacity="0.9" />
      <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <text x="36" y="41" textAnchor="middle"
        style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fill: 'rgba(248,245,240,0.9)', fontStyle: 'italic' }}>
        EA
      </text>
    </svg>
  );
}

/* ─── Chapter label ─────────────────────────────────────── */
function ChapterLabel({ number, title }: { number: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
      <span style={{
        fontFamily: 'var(--font-manrope), sans-serif',
        fontSize: '.5rem', letterSpacing: '.4em', textTransform: 'uppercase',
        color: 'var(--gold)', opacity: .7,
      }}>{number}</span>
      <div style={{ width: 40, height: 1, background: 'var(--gold)', opacity: .3 }} />
      <span style={{
        fontFamily: 'var(--font-manrope), sans-serif',
        fontSize: '.5rem', letterSpacing: '.35em', textTransform: 'uppercase',
        color: 'var(--gold)', opacity: .7,
      }}>{title}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */

export default function TheCrossingPage() {
  const [audioOn, setAudioOn] = useState(false);
  const [chapter, setChapter] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseRef    = useRef<ScriptProcessorNode | null>(null);
  const gainRef     = useRef<GainNode | null>(null);

  /* ── Ambient sound (pink noise + low hum) ─────────────── */
  const startAmbient = useCallback(() => {
    if (audioCtxRef.current) return;
    const ctx = new AudioContext();
    const bufSize = 4096;
    const proc = ctx.createScriptProcessor(bufSize, 1, 1);
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0;
    proc.onaudioprocess = (e) => {
      const out = e.outputBuffer.getChannelData(0);
      for (let i=0; i<bufSize; i++) {
        const w = Math.random()*2-1;
        b0 = .99886*b0 + w*.0555179; b1 = .99332*b1 + w*.0750759;
        b2 = .96900*b2 + w*.1538520; b3 = .86650*b3 + w*.3104856;
        b4 = .55000*b4 + w*.5329522; b5 = -.7616*b5 - w*.0168980;
        out[i] = (b0+b1+b2+b3+b4+b5 + w*.5362) * 0.09;
      }
    };
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 3);
    proc.connect(gain); gain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.frequency.value = 46;
    const oscG = ctx.createGain(); oscG.gain.value = 0.018;
    osc.connect(oscG); oscG.connect(ctx.destination); osc.start();

    audioCtxRef.current = ctx;
    noiseRef.current    = proc;
    gainRef.current     = gain;
  }, []);

  const stopAmbient = useCallback(() => {
    if (!audioCtxRef.current || !gainRef.current) return;
    gainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 1.5);
    setTimeout(() => { audioCtxRef.current?.close(); audioCtxRef.current = null; }, 1600);
  }, []);

  useEffect(() => {
    if (audioOn) startAmbient(); else stopAmbient();
  }, [audioOn, startAmbient, stopAmbient]);

  /* ── GSAP scroll animations ────────────────────────────── */
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    Promise.all([
      import('gsap').then(m => m.gsap),
      import('gsap/ScrollTrigger').then(m => m.ScrollTrigger),
    ]).then(([gsap, ScrollTrigger]) => {
      gsap.registerPlugin(ScrollTrigger);

      const triggers: ReturnType<typeof ScrollTrigger.create>[] = [];

      /* Opening: paper rises */
      triggers.push(ScrollTrigger.create({
        trigger: '#s0',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        onUpdate: (self) => {
          const p = self.progress;
          const paper = document.getElementById('paper-layer');
          if (!paper) return;
          paper.style.opacity   = String(Math.min(1, p * 2.5));
          paper.style.transform = `translateY(${(1 - Math.min(1, p * 2)) * 60}px)`;
          const ea = document.getElementById('ea-mono');
          if (ea) ea.style.opacity = String(Math.max(0, (p - .3) * 3));
          const quote = document.getElementById('opening-quote');
          if (quote) quote.style.opacity = String(Math.max(0, (p - .55) * 4));
        },
      }));

      /* Chapter reveals: staggered text */
      ['s1','s2','s3','s4','s5','s6'].forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const texts = el.querySelectorAll('[data-reveal]');
        texts.forEach((t, j) => {
          triggers.push(ScrollTrigger.create({
            trigger: t,
            start: 'top 85%',
            onEnter: () => {
              gsap.fromTo(t,
                { opacity: 0, y: 22 },
                { opacity: 1, y: 0, duration: 1.1, delay: j * 0.12,
                  ease: 'power3.out' }
              );
            },
            once: true,
          }));
        });

        /* Track active chapter */
        triggers.push(ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter:      () => setChapter(i + 1),
          onEnterBack:  () => setChapter(i + 1),
        }));
      });

      /* Letter SVG draw-on */
      const paths = document.querySelectorAll('.letter-path');
      paths.forEach((path, i) => {
        const len = (path as SVGPathElement).getTotalLength?.() ?? 200;
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        triggers.push(ScrollTrigger.create({
          trigger: '#s3',
          start: 'top 70%',
          onEnter: () => {
            gsap.to(path, {
              strokeDashoffset: 0,
              duration: 0.6,
              delay: i * 0.15,
              ease: 'power2.out',
            });
          },
          once: true,
        }));
      });

      /* Parallax on chapter backgrounds */
      ['#ch1-bg','#ch2-bg','#ch5-bg'].forEach(sel => {
        const el = document.querySelector(sel) as HTMLElement;
        if (!el) return;
        triggers.push(ScrollTrigger.create({
          trigger: el.parentElement!,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            el.style.transform = `translateY(${(self.progress - .5) * 60}px)`;
          },
        }));
      });

      /* Invitation card rise */
      triggers.push(ScrollTrigger.create({
        trigger: '#s6',
        start: 'top 60%',
        onEnter: () => {
          gsap.fromTo('#invite-card',
            { opacity: 0, y: 60, scale: .97 },
            { opacity: 1, y: 0, scale: 1, duration: 1.8, ease: 'power4.out' }
          );
        },
        once: true,
      }));

      cleanup = () => {
        triggers.forEach(t => t.kill());
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    });

    return () => cleanup?.();
  }, []);

  /* ─── Styles shared ──────────────────────────────────────── */
  const prata   = 'var(--font-prata), Georgia, serif';
  const manrope = 'var(--font-manrope), sans-serif';
  const garamond= 'var(--font-garamond), Georgia, serif';

  return (
    <>
      {/* Global grain overlay */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 9990, pointerEvents: 'none',
        opacity: .025, backgroundImage: GRAIN, backgroundSize: '220px',
        mixBlendMode: 'multiply',
      }} />

      {/* Chapter progress indicator */}
      <div aria-hidden style={{
        position: 'fixed', right: 'clamp(1.5rem,3vw,3rem)', top: '50%',
        transform: 'translateY(-50%)', zIndex: 800,
        display: 'flex', flexDirection: 'column', gap: '10px',
      }}>
        {[0,1,2,3,4,5,6].map(i => (
          <div key={i} style={{
            width: i === chapter ? 16 : 4, height: 1,
            background: chapter > 0 && i <= chapter ? 'var(--gold)' : 'rgba(162,129,90,.3)',
            transition: 'all .5s ease',
          }} />
        ))}
      </div>

      {/* Sound toggle */}
      <button
        aria-label={audioOn ? 'Disable ambient sound' : 'Enable ambient sound'}
        onClick={() => setAudioOn(v => !v)}
        style={{
          position: 'fixed', bottom: 'clamp(1.5rem,3vw,3rem)',
          right: 'clamp(1.5rem,3vw,3rem)', zIndex: 800,
          background: 'rgba(248,245,240,.06)', border: '1px solid rgba(162,129,90,.25)',
          color: 'var(--gold)', cursor: 'pointer',
          padding: '.5rem .9rem',
          fontFamily: manrope, fontSize: '.45rem',
          letterSpacing: '.3em', textTransform: 'uppercase',
          transition: 'border-color .3s, background .3s',
          backdropFilter: 'blur(8px)',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(162,129,90,.6)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(162,129,90,.25)')}
      >
        {audioOn ? '◼ Silence' : '▶ Sound'}
      </button>

      <Nav light />

      <main style={{ background: '#0E0D0B', color: 'var(--ivory)', overflowX: 'hidden' }}>

        {/* ══════════════════════════════════════════════
            SECTION 0 — OPENING (paper reveal)
        ══════════════════════════════════════════════ */}
        <section id="s0" style={{ height: '220vh', position: 'relative' }}>
          <div style={{
            position: 'sticky', top: 0, height: '100dvh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {/* Base — black */}
            <div style={{ position: 'absolute', inset: 0, background: '#0E0D0B' }} />

            {/* Paper layer — rises in */}
            <div id="paper-layer" style={{
              position: 'absolute', inset: 0,
              background: '#F8F5F0', opacity: 0,
              backgroundImage: GRAIN, backgroundSize: '180px',
              transition: 'none',
            }}>
              {/* Fine linen texture overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: `repeating-linear-gradient(
                  0deg,
                  transparent, transparent 3px,
                  rgba(0,0,0,.008) 3px, rgba(0,0,0,.008) 4px
                )`,
              }} />
              {/* Warm vignette */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(14,13,11,.12) 100%)',
              }} />
            </div>

            {/* EA embossed monogram */}
            <div id="ea-mono" style={{
              position: 'absolute', opacity: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem',
            }}>
              <div style={{
                fontFamily: prata,
                fontSize: 'clamp(8rem,18vw,18rem)',
                letterSpacing: '-.02em',
                lineHeight: 1,
                color: '#EDE5D8',
                textShadow: `
                  0 2px 3px rgba(255,255,255,0.9),
                  0 -1px 0 rgba(0,0,0,0.09),
                  1px 0 0 rgba(255,255,255,0.6),
                  -1px 0 0 rgba(0,0,0,0.04)
                `,
                userSelect: 'none',
              }}>
                EA
              </div>
              {/* Thin rule */}
              <div style={{ width: 'clamp(60px,12vw,120px)', height: 1, background: 'rgba(162,129,90,.35)' }} />
            </div>

            {/* Opening quote */}
            <p id="opening-quote" style={{
              position: 'absolute', bottom: 'clamp(6rem,12vw,10rem)',
              left: '50%', transform: 'translateX(-50%)',
              opacity: 0, textAlign: 'center', whiteSpace: 'nowrap',
              fontFamily: garamond, fontStyle: 'italic',
              fontSize: 'clamp(1rem,1.8vw,1.5rem)',
              color: '#8A8278', letterSpacing: '.04em',
            }}>
              Some stories begin with a destination.
              <br />
              <span style={{ color: 'var(--gold)', opacity: .85 }}>Ours began with a crossing.</span>
            </p>

            {/* Scroll invitation */}
            <div style={{
              position: 'absolute', bottom: 'clamp(2rem,4vw,3rem)',
              left: '50%', transform: 'translateX(-50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.75rem',
            }}>
              <span style={{
                fontFamily: manrope, fontSize: '.44rem',
                letterSpacing: '.4em', textTransform: 'uppercase',
                color: 'rgba(162,129,90,.5)',
                animation: 'pulse-opacity 2.5s ease-in-out infinite',
              }}>Scroll</span>
              <div style={{ width: 1, height: 32, background: 'rgba(162,129,90,.3)' }} />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SECTION 1 — CHAPTER I: THE CROSSING
        ══════════════════════════════════════════════ */}
        <section id="s1" style={{ position: 'relative', minHeight: '100dvh', background: '#0E0D0B', overflow: 'hidden' }}>
          {/* Scene: Vancouver harbour dawn */}
          <div id="ch1-bg" style={{
            position: 'absolute', inset: '-10%',
            background: `
              radial-gradient(ellipse 60% 50% at 50% 80%, rgba(162,129,90,.18) 0%, transparent 60%),
              linear-gradient(180deg, #0a0d14 0%, #12182b 35%, #1a2040 55%, #2b3050 70%, #3d3525 85%, #0E0D0B 100%)
            `,
          }}>
            {/* Fog layers */}
            {[0,1,2].map(i => (
              <div key={i} aria-hidden style={{
                position: 'absolute',
                bottom: `${15 + i*12}%`, left: 0, right: 0,
                height: `${20 + i*8}%`,
                background: `rgba(200,195,185, ${0.04 - i*.01})`,
                filter: `blur(${20 + i*15}px)`,
                borderRadius: '50%',
                transform: `translateX(${i%2===0 ? '-5%' : '5%'})`,
              }} />
            ))}
            {/* Water line */}
            <div style={{
              position: 'absolute', bottom: '28%', left: '10%', right: '10%',
              height: 1, background: 'rgba(162,129,90,.2)',
            }} />
            {/* Horizon glow */}
            <div style={{
              position: 'absolute', bottom: '26%', left: '15%', right: '15%',
              height: 40, background: 'radial-gradient(ellipse 100% 100%, rgba(201,168,130,.15) 0%, transparent 70%)',
              filter: 'blur(8px)',
            }} />
          </div>

          <div style={{
            position: 'relative', zIndex: 10,
            padding: 'clamp(8rem,15vw,14rem) clamp(2rem,5vw,5rem)',
            display: 'flex', flexDirection: 'column',
            minHeight: '100dvh', justifyContent: 'center',
          }}>
            <ChapterLabel number="Chapter I" title="The Crossing" />

            <div data-reveal style={{ marginBottom: '1rem' }}>
              <p style={{
                fontFamily: manrope, fontSize: '.52rem',
                letterSpacing: '.35em', textTransform: 'uppercase',
                color: 'rgba(162,129,90,.65)', marginBottom: '.5rem',
              }}>
                October 14th · 7:42 AM
              </p>
              <p style={{
                fontFamily: manrope, fontSize: '.52rem',
                letterSpacing: '.35em', textTransform: 'uppercase',
                color: 'rgba(181,175,165,.4)',
              }}>
                Vancouver, British Columbia
              </p>
            </div>

            <h2 data-reveal style={{
              fontFamily: prata,
              fontSize: 'clamp(4.5rem,12vw,14rem)',
              lineHeight: .9, letterSpacing: '-.03em',
              color: 'var(--ivory)',
              maxWidth: '10ch',
              margin: 'clamp(2rem,4vw,4rem) 0',
            }}>
              The<br />
              <em style={{ fontFamily: garamond, fontStyle: 'italic', color: 'rgba(201,168,130,.8)' }}>crossing.</em>
            </h2>

            <p data-reveal style={{
              fontFamily: garamond, fontStyle: 'italic',
              fontSize: 'clamp(1.1rem,2vw,1.6rem)',
              color: 'rgba(181,175,165,.7)', lineHeight: 1.7,
              maxWidth: '32ch',
            }}>
              Two strangers.<br />
              A delayed crossing.<br />
              An empty seat.
            </p>

            {/* Seabus illustration — abstract */}
            <div aria-hidden style={{
              position: 'absolute', right: 'clamp(2rem,8vw,10rem)',
              top: '50%', transform: 'translateY(-50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1.5rem',
              opacity: .25,
            }}>
              {/* Ferry silhouette */}
              <svg width="180" height="60" viewBox="0 0 180 60" fill="none" style={{ opacity: .6 }}>
                <rect x="20" y="25" width="140" height="20" rx="3" fill="rgba(181,175,165,1)" />
                <rect x="40" y="10" width="80" height="15" rx="2" fill="rgba(181,175,165,.8)" />
                <rect x="75" y="4" width="12" height="10" rx="1" fill="rgba(162,129,90,.6)" />
                <ellipse cx="50" cy="45" rx="8" ry="4" fill="rgba(10,13,20,1)" />
                <ellipse cx="130" cy="45" rx="8" ry="4" fill="rgba(10,13,20,1)" />
                {/* Wake */}
                {[0,1,2].map(i => (
                  <line key={i} x1={20+i*50} y1={55} x2={60+i*50} y2={55}
                    stroke="rgba(181,175,165,.3)" strokeWidth="1" />
                ))}
              </svg>
              <div style={{
                fontFamily: manrope, fontSize: '.4rem',
                letterSpacing: '.4em', textTransform: 'uppercase',
                color: 'rgba(162,129,90,.4)', textAlign: 'right',
              }}>
                SeaBus · Burrard Inlet
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SECTION 2 — CHAPTER II: THE CONVERSATION
        ══════════════════════════════════════════════ */}
        <section id="s2" style={{
          minHeight: '100dvh', background: '#13110E',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,420px),1fr))',
          overflow: 'hidden', position: 'relative',
        }}>
          {/* Left: atmospheric scene */}
          <div id="ch2-bg" style={{
            position: 'relative', minHeight: '45dvh',
            background: `
              radial-gradient(ellipse 70% 70% at 30% 40%, rgba(60,45,30,.9) 0%, rgba(19,17,14,1) 70%)
            `,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {/* Rain on glass effect */}
            {Array.from({length: 22}).map((_, i) => (
              <div key={i} aria-hidden style={{
                position: 'absolute',
                left: `${(i * 4.5) % 100}%`,
                top: `${(i * 7) % 80}%`,
                width: 1,
                height: `${8 + (i%4)*12}px`,
                background: `rgba(162,129,90,${0.06 + (i%3)*.04})`,
                borderRadius: 1,
                filter: 'blur(.5px)',
              }} />
            ))}
            {/* Coffee cup top-down */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" opacity=".35">
                <ellipse cx="60" cy="60" rx="42" ry="42" stroke="rgba(162,129,90,.4)" strokeWidth="1.5" />
                <ellipse cx="60" cy="60" rx="30" ry="30" fill="rgba(50,35,20,.8)" stroke="rgba(162,129,90,.2)" strokeWidth="1" />
                <ellipse cx="60" cy="60" rx="20" ry="20" fill="rgba(80,55,30,.6)" />
                {/* Latte art spiral */}
                <path d="M 60 48 Q 68 54 60 60 Q 52 66 60 72" stroke="rgba(201,168,130,.3)" strokeWidth="1" fill="none" />
              </svg>
              <div style={{
                position: 'absolute', bottom: -40, left: '50%', transform: 'translateX(-50%)',
                fontFamily: manrope, fontSize: '.4rem', letterSpacing: '.3em',
                textTransform: 'uppercase', color: 'rgba(162,129,90,.3)',
                whiteSpace: 'nowrap',
              }}>
                Café au lait, black
              </div>
            </div>
          </div>

          {/* Right: conversation text */}
          <div style={{
            padding: 'clamp(5rem,10vw,10rem) clamp(2rem,5vw,5rem)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <ChapterLabel number="Chapter II" title="The Conversation" />

            <p data-reveal style={{
              fontFamily: prata,
              fontSize: 'clamp(2rem,4vw,4rem)',
              lineHeight: 1.15, letterSpacing: '-.02em',
              color: 'var(--ivory)',
              marginBottom: 'clamp(2rem,4vw,4rem)',
            }}>
              The crossing lasted<br />twenty minutes.
            </p>

            <p data-reveal style={{
              fontFamily: garamond, fontStyle: 'italic',
              fontSize: 'clamp(1.1rem,1.8vw,1.5rem)',
              color: 'rgba(181,175,165,.65)', lineHeight: 1.8,
              maxWidth: '34ch',
              marginBottom: 'clamp(2rem,4vw,3rem)',
            }}>
              The conversation lasted much longer.
            </p>

            <p data-reveal style={{
              fontFamily: garamond, fontStyle: 'italic',
              fontSize: 'clamp(.85rem,1.2vw,1rem)',
              color: 'rgba(162,129,90,.5)', lineHeight: 1.8,
              maxWidth: '36ch',
            }}>
              She was reading. He was watching the water.
              Neither noticed the other until the only
              empty seat was beside her.
            </p>

            {/* Rain audio note */}
            <div data-reveal style={{
              marginTop: 'clamp(3rem,5vw,5rem)',
              borderTop: '1px solid rgba(162,129,90,.12)',
              paddingTop: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(162,129,90,.4)' }} />
              <span style={{
                fontFamily: manrope, fontSize: '.42rem',
                letterSpacing: '.3em', textTransform: 'uppercase',
                color: 'rgba(162,129,90,.35)',
              }}>
                Enable sound for full experience
              </span>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SECTION 3 — CHAPTER III: THE LETTER
        ══════════════════════════════════════════════ */}
        <section id="s3" style={{
          minHeight: '100dvh',
          background: '#F8F5F0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
          padding: 'clamp(5rem,10vw,8rem) clamp(2rem,5vw,5rem)',
        }}>
          {/* Warm light vignette */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(201,168,130,.08) 0%, rgba(14,13,11,.05) 100%)',
          }} />

          <div style={{
            position: 'relative', zIndex: 2,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: 'clamp(4rem,8vw,10rem)',
            alignItems: 'center', maxWidth: '1100px', width: '100%',
          }}>
            {/* Letter card */}
            <div data-reveal style={{
              background: '#FDFAF6',
              border: '1px solid rgba(162,129,90,.15)',
              padding: 'clamp(2.5rem,5vw,4rem)',
              boxShadow: '0 20px 80px rgba(14,13,11,.08), 0 4px 20px rgba(14,13,11,.05)',
              position: 'relative',
            }}>
              {/* Date */}
              <p style={{
                fontFamily: garamond, fontStyle: 'italic',
                fontSize: '.9rem', color: 'rgba(162,129,90,.6)',
                marginBottom: '2rem',
              }}>
                November 2nd
              </p>

              {/* Handwritten SVG */}
              <svg
                width="240" height="220" viewBox="0 0 240 220"
                style={{ display: 'block', marginBottom: '2rem' }}
                aria-label="Handwritten letter excerpt"
              >
                {LETTER_LINES.map((d, i) => (
                  <path
                    key={i}
                    className="letter-path"
                    d={d}
                    stroke="rgba(30,25,20,.45)"
                    strokeWidth={i === 0 ? 1.4 : 1.1}
                    fill="none"
                    strokeLinecap="round"
                  />
                ))}
                {/* Signature line */}
                <path
                  className="letter-path"
                  d="M 30 200 Q 50 190 70 200 Q 90 210 110 198"
                  stroke="rgba(30,25,20,.6)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>

              {/* Wax seal */}
              <div style={{
                position: 'absolute', bottom: -24, right: 'clamp(1.5rem,4vw,3rem)',
                filter: 'drop-shadow(0 4px 12px rgba(162,129,90,.25))',
              }}>
                <WaxSeal />
              </div>
            </div>

            {/* Chapter text */}
            <div>
              <ChapterLabel number="Chapter III" title="The Letter" />

              <h2 data-reveal style={{
                fontFamily: prata,
                fontSize: 'clamp(2.5rem,5vw,5.5rem)',
                lineHeight: .95, letterSpacing: '-.025em',
                color: '#0E0D0B',
                marginBottom: 'clamp(2rem,4vw,3.5rem)',
              }}>
                Distance<br />teaches us<br />
                <em style={{ fontFamily: garamond, fontStyle: 'italic', color: 'var(--gold)' }}>to write.</em>
              </h2>

              <p data-reveal style={{
                fontFamily: garamond, fontStyle: 'italic',
                fontSize: 'clamp(1rem,1.5vw,1.25rem)',
                color: '#8A8278', lineHeight: 1.8,
                maxWidth: '36ch',
                marginBottom: '2rem',
              }}>
                Distance teaches us that some words
                are worth writing.
              </p>

              <p data-reveal style={{
                fontFamily: garamond, fontStyle: 'italic',
                fontSize: 'clamp(.85rem,1.1vw,1rem)',
                color: 'rgba(138,130,120,.65)', lineHeight: 1.8,
                maxWidth: '34ch',
              }}>
                She wrote six letters. She sent three.
                He kept all of them.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SECTION 4 — CHAPTER IV: THE JOURNEY
        ══════════════════════════════════════════════ */}
        <section id="s4" style={{
          minHeight: '100dvh', background: '#0E0D0B',
          padding: 'clamp(6rem,12vw,10rem) clamp(2rem,5vw,5rem)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Map grid background */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, opacity: .04,
            backgroundImage: `
              linear-gradient(rgba(162,129,90,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(162,129,90,1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }} />

          <ChapterLabel number="Chapter IV" title="The Journey" />

          <h2 data-reveal style={{
            fontFamily: prata,
            fontSize: 'clamp(3rem,8vw,10rem)',
            lineHeight: .9, letterSpacing: '-.03em',
            color: 'var(--ivory)',
            maxWidth: '14ch',
            marginBottom: 'clamp(4rem,8vw,8rem)',
          }}>
            Some collect souvenirs.
            <em style={{ display: 'block', fontFamily: garamond, fontStyle: 'italic', color: 'rgba(162,129,90,.8)' }}>
              We collected stories.
            </em>
          </h2>

          {/* Ephemera grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,200px),1fr))',
            gap: 'clamp(1.5rem,3vw,3rem)',
            maxWidth: '900px',
          }}>
            {[
              { label: 'Vancouver · October 2021', icon: '✦', sub: 'SeaBus ticket, stub 0441' },
              { label: 'London · March 2022', icon: '✦', sub: 'National Gallery, east wing' },
              { label: 'Florence · June 2022', icon: '✦', sub: 'Uffizi, room 15' },
              { label: 'Lake Como · August 2024', icon: '✦', sub: 'Villa del Balbianello' },
            ].map((item, i) => (
              <div key={i} data-reveal style={{
                borderTop: '1px solid rgba(162,129,90,.18)',
                paddingTop: '1.5rem',
              }}>
                {/* Stamp-style badge */}
                <div style={{
                  width: 48, height: 48, border: '1px solid rgba(162,129,90,.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1rem',
                  color: 'rgba(162,129,90,.5)',
                  fontFamily: garamond, fontStyle: 'italic', fontSize: '1.2rem',
                }}>
                  {item.icon}
                </div>
                <p style={{
                  fontFamily: manrope, fontSize: '.5rem',
                  letterSpacing: '.25em', textTransform: 'uppercase',
                  color: 'rgba(162,129,90,.7)', marginBottom: '.5rem',
                }}>
                  {item.label}
                </p>
                <p style={{
                  fontFamily: garamond, fontStyle: 'italic',
                  fontSize: '.85rem', color: 'rgba(181,175,165,.4)',
                  lineHeight: 1.6,
                }}>
                  {item.sub}
                </p>
              </div>
            ))}
          </div>

          {/* Route line */}
          <div aria-hidden style={{
            position: 'absolute', bottom: '8%', left: '10%', right: '10%',
            height: 1, background: 'linear-gradient(90deg, transparent, rgba(162,129,90,.15) 20%, rgba(162,129,90,.15) 80%, transparent)',
          }} />
        </section>

        {/* ══════════════════════════════════════════════
            SECTION 5 — CHAPTER V: THE QUESTION
        ══════════════════════════════════════════════ */}
        <section id="s5" style={{
          minHeight: '100dvh', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {/* Lake Como golden hour */}
          <div id="ch5-bg" style={{
            position: 'absolute', inset: '-10%',
            background: `
              radial-gradient(ellipse 70% 60% at 50% 60%, rgba(201,130,50,.35) 0%, rgba(162,90,30,.2) 30%, transparent 65%),
              radial-gradient(ellipse 100% 100% at 50% 100%, rgba(14,13,11,1) 0%, rgba(14,13,11,.4) 40%, transparent 70%),
              linear-gradient(180deg, #0a0808 0%, #1a0f08 25%, #2d1a0a 45%, #3d2510 60%, #1a0f08 80%, #0E0D0B 100%)
            `,
          }}>
            {/* Water shimmer */}
            {Array.from({length: 8}).map((_, i) => (
              <div key={i} aria-hidden style={{
                position: 'absolute',
                bottom: `${8 + i*4}%`,
                left: `${i*12}%`, right: `${(7-i)*12}%`,
                height: 1,
                background: `rgba(201,168,130,${0.04 + i*.02})`,
                filter: 'blur(.5px)',
              }} />
            ))}
            {/* Sun glow */}
            <div style={{
              position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
              width: 200, height: 200,
              background: 'radial-gradient(ellipse 100% 100%, rgba(201,130,50,.3) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }} />
          </div>

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: 'clamp(5rem,10vw,8rem) clamp(2rem,5vw,5rem)' }}>
            <ChapterLabel number="Chapter V" title="The Question" />

            <div data-reveal style={{ marginBottom: 'clamp(2rem,4vw,4rem)' }}>
              <div style={{ width: 1, height: 'clamp(40px,8vw,80px)', background: 'rgba(162,129,90,.3)', margin: '0 auto 3rem' }} />
            </div>

            <h2 data-reveal style={{
              fontFamily: prata,
              fontSize: 'clamp(3rem,8vw,10rem)',
              lineHeight: .9, letterSpacing: '-.03em',
              color: 'var(--ivory)',
              marginBottom: 'clamp(2rem,4vw,4rem)',
            }}>
              The question<br />was simple.
            </h2>

            <p data-reveal style={{
              fontFamily: garamond, fontStyle: 'italic',
              fontSize: 'clamp(1.2rem,2.5vw,2.2rem)',
              color: 'rgba(201,168,130,.8)', lineHeight: 1.6,
              maxWidth: '28ch', margin: '0 auto',
            }}>
              The answer changed everything.
            </p>

            {/* Location */}
            <p data-reveal style={{
              fontFamily: manrope, fontSize: '.48rem',
              letterSpacing: '.4em', textTransform: 'uppercase',
              color: 'rgba(162,129,90,.4)',
              marginTop: 'clamp(3rem,6vw,6rem)',
            }}>
              Villa del Balbianello · Lake Como · August 2024
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SECTION 6 — CHAPTER VI: THE INVITATION
        ══════════════════════════════════════════════ */}
        <section id="s6" style={{
          minHeight: '120dvh', background: '#F8F5F0', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(6rem,12vw,10rem) clamp(2rem,5vw,5rem)',
          overflow: 'hidden',
          color: '#0E0D0B',
        }}>
          {/* Paper texture */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0,
            backgroundImage: GRAIN, backgroundSize: '180px', opacity: .04,
          }} />
          {/* Linen lines */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0,
            background: `repeating-linear-gradient(
              0deg, transparent, transparent 3px,
              rgba(0,0,0,.007) 3px, rgba(0,0,0,.007) 4px
            )`,
          }} />
          {/* Warm radial */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(201,168,130,.06) 0%, transparent 70%)',
          }} />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem,6vw,6rem)' }} data-reveal>
              <ChapterLabel number="Chapter VI" title="The Invitation" />
            </div>

            {/* THE INVITATION CARD */}
            <div id="invite-card" style={{
              opacity: 0,
              margin: '0 auto',
              maxWidth: 580,
              background: '#FDFAF6',
              border: '1px solid rgba(162,129,90,.2)',
              padding: 'clamp(3rem,6vw,6rem) clamp(2.5rem,5vw,5rem)',
              textAlign: 'center',
              boxShadow: `
                0 40px 120px rgba(14,13,11,.1),
                0 8px 40px rgba(14,13,11,.07),
                inset 0 0 0 10px rgba(162,129,90,.04),
                inset 0 0 0 11px rgba(248,245,240,.5)
              `,
              position: 'relative',
            }}>
              {/* Corner ornaments */}
              {['top-left','top-right','bottom-left','bottom-right'].map((pos, i) => (
                <svg key={pos} width="20" height="20" viewBox="0 0 20 20" fill="none"
                  style={{
                    position: 'absolute',
                    top: i < 2 ? '1.2rem' : 'auto',
                    bottom: i >= 2 ? '1.2rem' : 'auto',
                    left: i%2===0 ? '1.2rem' : 'auto',
                    right: i%2===1 ? '1.2rem' : 'auto',
                    opacity: .35,
                    transform: `rotate(${i * 90}deg)`,
                  }}>
                  <path d="M0 0 L8 0 M0 0 L0 8" stroke="rgba(162,129,90,1)" strokeWidth="1" />
                </svg>
              ))}

              {/* EA Monogram */}
              <div style={{
                fontFamily: prata,
                fontSize: 'clamp(3rem,8vw,6rem)',
                letterSpacing: '.08em',
                color: '#0E0D0B',
                marginBottom: 'clamp(1rem,2vw,2rem)',
                textShadow: '0 1px 2px rgba(255,255,255,.8), 0 -1px 0 rgba(0,0,0,.06)',
              }}>
                EA
              </div>

              {/* Gold rule */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '1rem', marginBottom: 'clamp(2rem,4vw,4rem)',
              }}>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(162,129,90,.4))' }} />
                <div style={{ width: 4, height: 4, background: 'var(--gold)', opacity: .5, transform: 'rotate(45deg)' }} />
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(270deg, transparent, rgba(162,129,90,.4))' }} />
              </div>

              {/* Preamble */}
              <p style={{
                fontFamily: garamond, fontStyle: 'italic',
                fontSize: 'clamp(.8rem,1.2vw,1rem)',
                color: '#8A8278', letterSpacing: '.04em',
                marginBottom: 'clamp(1.5rem,3vw,3rem)', lineHeight: 1.8,
              }}>
                Together with their families
              </p>

              {/* Names */}
              <h3 style={{
                fontFamily: prata,
                fontSize: 'clamp(1.8rem,4vw,3.5rem)',
                lineHeight: 1.1, letterSpacing: '-.01em',
                color: '#0E0D0B',
                marginBottom: '.75rem',
              }}>
                Emma Alexandra<br />Bennett
              </h3>

              <p style={{
                fontFamily: garamond, fontStyle: 'italic',
                fontSize: 'clamp(.9rem,1.5vw,1.2rem)',
                color: '#8A8278', marginBottom: '1rem', letterSpacing: '.06em',
              }}>
                and
              </p>

              <h3 style={{
                fontFamily: prata,
                fontSize: 'clamp(1.8rem,4vw,3.5rem)',
                lineHeight: 1.1, letterSpacing: '-.01em',
                color: '#0E0D0B',
                marginBottom: 'clamp(2rem,4vw,4rem)',
              }}>
                Alexander James<br />Whitmore
              </h3>

              {/* Invitation text */}
              <p style={{
                fontFamily: garamond, fontStyle: 'italic',
                fontSize: 'clamp(.85rem,1.2vw,1.05rem)',
                color: '#8A8278', letterSpacing: '.04em',
                lineHeight: 1.9, marginBottom: 'clamp(2rem,4vw,4rem)',
              }}>
                request the pleasure of your company<br />
                to celebrate their marriage
              </p>

              {/* Divider */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '1rem', marginBottom: 'clamp(2rem,4vw,4rem)',
              }}>
                <div style={{ flex: 1, maxWidth: 60, height: 1, background: 'rgba(162,129,90,.25)' }} />
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 0 L12 6 L6 12 L0 6 Z" fill="rgba(162,129,90,.4)" />
                </svg>
                <div style={{ flex: 1, maxWidth: 60, height: 1, background: 'rgba(162,129,90,.25)' }} />
              </div>

              {/* Date & Location */}
              <p style={{
                fontFamily: manrope, fontSize: '.5rem',
                letterSpacing: '.35em', textTransform: 'uppercase',
                color: 'var(--gold)', marginBottom: '.75rem',
              }}>
                Saturday, the twenty-first of June
              </p>
              <p style={{
                fontFamily: prata,
                fontSize: 'clamp(1.1rem,2vw,1.6rem)',
                letterSpacing: '-.01em', color: '#0E0D0B',
                marginBottom: '.5rem',
              }}>
                Lake Como, Italy
              </p>
              <p style={{
                fontFamily: garamond, fontStyle: 'italic',
                fontSize: '.9rem', color: '#8A8278',
                marginBottom: 'clamp(2.5rem,5vw,5rem)',
              }}>
                Two thousand and twenty-seven
              </p>

              {/* Bottom rule */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '1rem',
              }}>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(162,129,90,.3))' }} />
                <div style={{ width: 3, height: 3, background: 'var(--gold)', opacity: .4, borderRadius: '50%' }} />
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(270deg, transparent, rgba(162,129,90,.3))' }} />
              </div>
            </div>

            {/* Closing line */}
            <p data-reveal style={{
              textAlign: 'center', marginTop: 'clamp(4rem,8vw,8rem)',
              fontFamily: garamond, fontStyle: 'italic',
              fontSize: 'clamp(1rem,1.8vw,1.4rem)',
              color: '#8A8278', letterSpacing: '.04em',
              lineHeight: 1.8,
            }}>
              It began on a ferry.<br />
              It will be celebrated at a villa on the lake.<br />
              <span style={{ color: 'var(--gold)', opacity: .7 }}>Some journeys know where they are going.</span>
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            BACK TO PORTFOLIO
        ══════════════════════════════════════════════ */}
        <section style={{
          background: '#0E0D0B', padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 'clamp(2rem,4vw,4rem)', textAlign: 'center',
        }}>
          <p style={{
            fontFamily: manrope, fontSize: '.48rem',
            letterSpacing: '.35em', textTransform: 'uppercase',
            color: 'rgba(162,129,90,.4)',
          }}>
            Maison RSVP · The Archive
          </p>
          <h2 style={{
            fontFamily: prata,
            fontSize: 'clamp(2.5rem,6vw,7rem)',
            lineHeight: .92, letterSpacing: '-.03em',
            color: 'var(--ivory)', maxWidth: '16ch',
          }}>
            Every commission is a story.
          </h2>
          <p style={{
            fontFamily: garamond, fontStyle: 'italic',
            fontSize: 'clamp(.9rem,1.4vw,1.15rem)',
            color: 'rgba(181,175,165,.5)', maxWidth: '38ch', lineHeight: 1.75,
          }}>
            This experience was created for Emma and Alexander.
            We create each commission once, and only once.
          </p>
          <div style={{ display: 'flex', gap: 'clamp(1.5rem,3vw,3rem)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              href="/work"
              style={{
                fontFamily: manrope, fontSize: '.58rem',
                letterSpacing: '.28em', textTransform: 'uppercase',
                color: 'var(--gold)', textDecoration: 'none',
                borderBottom: '1px solid rgba(162,129,90,.35)',
                paddingBottom: '.2em',
                transition: 'border-color .3s',
              }}
            >
              View all commissions →
            </Link>
            <Link
              href="/contact"
              style={{
                fontFamily: manrope, fontSize: '.58rem',
                letterSpacing: '.28em', textTransform: 'uppercase',
                color: 'rgba(248,245,240,.5)', textDecoration: 'none',
                borderBottom: '1px solid rgba(248,245,240,.15)',
                paddingBottom: '.2em',
                transition: 'color .3s, border-color .3s',
              }}
            >
              Begin your commission →
            </Link>
          </div>
        </section>

      </main>

      <Footer />

      <style>{`
        @keyframes pulse-opacity {
          0%, 100% { opacity: .3; }
          50% { opacity: .7; }
        }
        .letter-path {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
        }
      `}</style>
    </>
  );
}
