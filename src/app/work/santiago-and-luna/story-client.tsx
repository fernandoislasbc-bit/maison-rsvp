'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Abril_Fatface } from 'next/font/google';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

const abril = Abril_Fatface({ subsets: ['latin'], weight: '400', display: 'swap' });

/* ─── Palette — pulled from the real artwork ─── */
const PARCHMENT  = '#F3E3C2';
const CREAM      = '#FBF5E8';
const MIDNIGHT   = '#0F1F2E';
const PALM       = '#264D2A';
const CANDLE     = '#E3A435';
const TERRACOTTA = '#B5602E';
const ROSE_RED   = '#A6342C';
const TALAVERA   = '#1E4D6B';
const EMBROIDERY = '#7A4FA0';
const INK        = '#1A1208';

const PARTICLE_COLORS = [CANDLE, TERRACOTTA, TALAVERA, ROSE_RED, EMBROIDERY];

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ── Particles ──────────────────────────────────── */
function AmbientParticles({ count = 26 }: { count?: number }) {
  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 30, overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 4.37 * 7) % 100;
        const size = 2 + (i % 4) * 2;
        const duration = 18 + (i % 7) * 3;
        const delay = -(i * 1.7);
        const drift = ((i % 2 === 0 ? 1 : -1) * (20 + (i % 5) * 10));
        const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
        return (
          <span key={i} style={{
            position: 'absolute', left: `${left}%`, bottom: '-5%',
            width: size, height: size, borderRadius: i % 3 === 0 ? '2px' : '50%',
            background: color, opacity: 0,
            transform: i % 3 === 0 ? 'rotate(45deg)' : 'none',
            animation: `sl-particle-rise ${duration}s linear ${delay}s infinite`,
            '--drift': `${drift}px`,
          } as React.CSSProperties} />
        );
      })}
    </div>
  );
}

/* ── Ornamental diamond divider ─────────────────── */
function Ornament({ color = CANDLE, my = '0' }: { color?: string; my?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', margin: `${my} 0` }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${color}55)` }} />
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 0 L18 9 L9 18 L0 9 Z" fill={color} opacity=".5" />
        <path d="M9 4 L14 9 L9 14 L4 9 Z" fill="none" stroke={color} strokeWidth=".6" opacity=".4" />
      </svg>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${color}55)` }} />
    </div>
  );
}

/* ── Wax seal SVG ───────────────────────────────── */
function WaxSeal() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" aria-hidden>
      <path d="M45 5 C53 4,65 10,72 18 C82 28,85 40,82 52 C79 64,68 76,55 81 C44 85,32 83,22 76 C11 68,4 55,4 43 C4 29,12 16,24 10 C31 6,37 5,45 5Z" fill={ROSE_RED} opacity=".88"/>
      <circle cx="45" cy="45" r="32" fill="none" stroke={PARCHMENT} strokeWidth=".7" opacity=".35"/>
      <circle cx="45" cy="45" r="28" fill="none" stroke={PARCHMENT} strokeWidth=".4" opacity=".25"/>
      <text x="45" y="52" textAnchor="middle" fontFamily="Georgia, serif" fontSize="19" fill={PARCHMENT} letterSpacing="4" opacity=".92">S·L</text>
    </svg>
  );
}

/* ── Chapter label ──────────────────────────────── */
function Label({ children, color = CANDLE }: { children: React.ReactNode; color?: string }) {
  return (
    <p style={{
      fontFamily: 'var(--font-manrope), sans-serif',
      fontSize: '.54rem', letterSpacing: '.45em', textTransform: 'uppercase',
      color, marginBottom: 'clamp(1.2rem,2.5vw,2rem)',
    }}>
      {children}
    </p>
  );
}

/* ── Lotería card ───────────────────────────────── */
function LoteriaCard({
  number, title, image, video, flip = false,
}: {
  number: string; title: string; image?: string; video?: string; flip?: boolean;
}) {
  return (
    <div data-reveal style={{
      background: PARCHMENT,
      border: `2px solid ${INK}18`,
      padding: '10px',
      boxShadow: '0 32px 80px rgba(20,12,4,.35), 0 4px 16px rgba(20,12,4,.15)',
      maxWidth: 340, margin: '0 auto',
      transform: flip ? 'rotate(1.4deg)' : 'rotate(-1.4deg)',
    }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '2/3', border: `1px solid ${INK}22`, overflow: 'hidden' }}>
        {video ? (
          <video src={video} autoPlay muted loop playsInline
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : image ? (
          <Image src={image} alt={title} fill style={{ objectFit: 'cover' }} sizes="340px" priority={false} />
        ) : null}
        <span className={abril.className} style={{
          position: 'absolute', top: 10, left: 12,
          fontSize: '1.4rem', color: PARCHMENT, textShadow: '0 2px 8px rgba(0,0,0,.7)',
        }}>
          {number}
        </span>
      </div>
      {/* bottom border rule */}
      <div style={{ height: 1, background: `${INK}18`, margin: '10px 0 6px' }} />
      <p className={abril.className} style={{
        fontSize: 'clamp(1rem,1.6vw,1.35rem)',
        letterSpacing: '.06em', textAlign: 'center', color: INK,
        marginBottom: '4px', textTransform: 'uppercase',
      }}>
        {title}
      </p>
      {/* decorative dots */}
      <p style={{ textAlign: 'center', fontSize: '.55rem', letterSpacing: '.3em', color: `${INK}55`, marginBottom: 2 }}>· · ·</p>
    </div>
  );
}

/* ── Bird ornament ──────────────────────────────── */
function BirdOrnament({ src, side = 'left' }: { src: string; side?: 'left' | 'right' }) {
  return (
    <div aria-hidden style={{
      position: 'absolute', top: '6%', [side]: 'clamp(.75rem,3vw,3rem)',
      width: 'clamp(48px,8vw,100px)', height: 'clamp(48px,8vw,100px)',
      opacity: .85, transform: side === 'left' ? 'rotate(-8deg)' : 'rotate(10deg) scaleX(-1)',
      filter: 'drop-shadow(0 8px 20px rgba(36,27,18,.3))',
    }}>
      <Image src={src} alt="" fill style={{ objectFit: 'contain' }} sizes="100px" />
    </div>
  );
}

/* ── Ghost number behind section ────────────────── */
function GhostNumber({ children, color = INK, side = 'right' }: {
  children: React.ReactNode; color?: string; side?: 'left' | 'right';
}) {
  return (
    <div aria-hidden className={abril.className} style={{
      position: 'absolute',
      [side]: '-1vw',
      top: '50%', transform: 'translateY(-50%)',
      fontSize: 'clamp(8rem,22vw,18rem)',
      lineHeight: 1, color,
      opacity: .055, userSelect: 'none', pointerEvents: 'none',
      letterSpacing: '-.04em',
    }}>
      {children}
    </div>
  );
}

export default function SantiagoLunaPage() {
  const [introDone, setIntroDone] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [rsvpChoice, setRsvpChoice] = useState<null | 'accept' | 'decline'>(null);
  const [meal, setMeal] = useState('');
  const [rsvpSent, setRsvpSent] = useState(false);
  const [vaultSent, setVaultSent] = useState(false);
  const [vaultNote, setVaultNote] = useState('');

  useEffect(() => {
    if (introDone) return;
    const v = videoRef.current;
    if (!v) return;
    const onEnded = () => setIntroDone(true);
    const onCanPlay = () => setVideoReady(true);
    v.addEventListener('ended', onEnded);
    v.addEventListener('canplay', onCanPlay);
    v.play().catch(() => setIntroDone(true));
    return () => {
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('canplay', onCanPlay);
    };
  }, [introDone]);

  useEffect(() => {
    if (!introDone) return;
    let cleanup: (() => void) | undefined;
    Promise.all([
      import('gsap').then(m => m.gsap),
      import('gsap/ScrollTrigger').then(m => m.ScrollTrigger),
    ]).then(([gsap, ScrollTrigger]) => {
      gsap.registerPlugin(ScrollTrigger);
      const triggers: ReturnType<typeof ScrollTrigger.create>[] = [];
      document.querySelectorAll('[data-reveal]').forEach((el, j) => {
        triggers.push(ScrollTrigger.create({
          trigger: el, start: 'top 88%',
          onEnter: () => gsap.fromTo(el,
            { opacity: 0, y: 36 },
            { opacity: 1, y: 0, duration: 1.1, delay: (j % 3) * 0.08, ease: 'power3.out' }),
          once: true,
        }));
      });
      cleanup = () => { triggers.forEach(t => t.kill()); ScrollTrigger.getAll().forEach(t => t.kill()); };
    });
    return () => cleanup?.();
  }, [introDone]);

  const prata    = 'var(--font-prata), Georgia, serif';
  const garamond = 'var(--font-garamond), Georgia, serif';
  const manrope  = 'var(--font-manrope), sans-serif';

  return (
    <>
      <style>{`
        @keyframes sl-particle-rise {
          0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          8%   { opacity: .5; }
          92%  { opacity: .3; }
          100% { transform: translateY(-110vh) translateX(var(--drift,20px)) rotate(180deg); opacity: 0; }
        }
        @keyframes sl-pulse {
          0%,100% { opacity: .6; } 50% { opacity: 1; }
        }
        @keyframes sl-scroll {
          0%,100% { transform: translateY(0); opacity: .5; }
          50%     { transform: translateY(8px); opacity: .9; }
        }
        .sl-split {
          display: flex; flex-direction: column; gap: clamp(3rem,6vw,5rem); align-items: center;
        }
        @media (min-width: 768px) {
          .sl-split { flex-direction: row; align-items: center; }
          .sl-split.rev { flex-direction: row-reverse; }
          .sl-split > * { flex: 1; }
        }
        .sl-detail-grid {
          display: grid; grid-template-columns: 1fr;
          gap: clamp(2rem,4vw,3.5rem);
        }
        @media (min-width: 640px) {
          .sl-detail-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .sl-detail-grid { grid-template-columns: repeat(4,1fr); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="sl-particle-rise"] { animation: none !important; }
        }
      `}</style>

      {/* ═══ INTRO VIDEO ═══ */}
      {!introDone && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: INK }}>
          <video
            ref={videoRef}
            src="/assets/sl/sl-letter-opening-v2.mp4"
            muted playsInline autoPlay
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: videoReady ? 1 : 0, transition: 'opacity .6s ease' }}
          />
          <button
            onClick={() => setIntroDone(true)}
            style={{
              position: 'absolute', top: 'clamp(1.5rem,4vw,2.5rem)', right: 'clamp(1.5rem,4vw,2.5rem)',
              fontFamily: manrope, fontSize: '.5rem', letterSpacing: '.3em', textTransform: 'uppercase',
              color: `${PARCHMENT}99`, background: 'transparent', border: `1px solid ${PARCHMENT}28`,
              padding: '.65em 1.1em', cursor: 'pointer',
            }}
          >Skip</button>
        </div>
      )}

      <Nav light />

      <main style={{ background: CREAM, color: INK, overflowX: 'hidden' }}>

        {/* ── HERO ───────────────────────────────────────────────────── */}
        <section style={{ position: 'relative', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <Image src="/assets/sl/sl-doors-bow.png"
            alt="Santiago & Luna — talavera doors with embroidered ribbon"
            fill priority style={{ objectFit: 'cover' }} sizes="100vw" />

          {/* layered overlays */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(15,20,12,.22) 0%, rgba(15,20,12,.72) 100%)` }} />
          <div style={{ position: 'absolute', inset: 0, opacity: .06, backgroundImage: GRAIN, backgroundSize: '200px' }} />

          {/* vertical date text — left edge */}
          <div aria-hidden style={{
            position: 'absolute', left: 'clamp(1.5rem,3vw,3rem)', top: '50%', transform: 'translateY(-50%) rotate(-90deg)',
            transformOrigin: 'center center',
            fontFamily: manrope, fontSize: '.46rem', letterSpacing: '.55em', textTransform: 'uppercase',
            color: `${PARCHMENT}77`, whiteSpace: 'nowrap',
          }}>
            XXVI · Julio · MMXXVI
          </div>

          {/* vertical location text — right edge */}
          <div aria-hidden style={{
            position: 'absolute', right: 'clamp(1.5rem,3vw,3rem)', top: '50%', transform: 'translateY(-50%) rotate(90deg)',
            transformOrigin: 'center center',
            fontFamily: manrope, fontSize: '.46rem', letterSpacing: '.55em', textTransform: 'uppercase',
            color: `${PARCHMENT}77`, whiteSpace: 'nowrap',
          }}>
            Tulum · Quintana Roo · México
          </div>

          {/* center content */}
          <div data-reveal style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 clamp(2rem,6vw,8rem)' }}>
            {/* wax seal */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'clamp(1.5rem,3vw,2.5rem)' }}>
              <WaxSeal />
            </div>

            <p style={{
              fontFamily: garamond, fontStyle: 'italic',
              fontSize: 'clamp(.95rem,1.8vw,1.4rem)',
              color: `${PARCHMENT}cc`, marginBottom: '.75rem', letterSpacing: '.04em',
            }}>
              A letter, composed especially for you.
            </p>

            <h1 className={abril.className} style={{
              fontSize: 'clamp(3rem,9vw,7.5rem)', color: PARCHMENT,
              letterSpacing: '.02em', lineHeight: .96,
              textShadow: '0 4px 40px rgba(0,0,0,.45)',
              marginBottom: 'clamp(1.5rem,3vw,2.5rem)',
            }}>
              Santiago<br />&amp; Luna
            </h1>

            <Ornament color={PARCHMENT} />

            <p style={{
              fontFamily: manrope, fontSize: '.52rem', letterSpacing: '.4em', textTransform: 'uppercase',
              color: `${CANDLE}cc`, marginTop: 'clamp(1.5rem,3vw,2rem)',
            }}>
              Tulum · 26 de Julio · 2026
            </p>

            {/* scroll indicator */}
            <div style={{
              position: 'absolute', bottom: '-clamp(4rem,8vw,8rem)', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.6rem',
            }}>
              <div style={{ width: 1, height: 36, background: `${PARCHMENT}44`, animation: 'sl-scroll 2s ease-in-out infinite' }} />
              <span style={{ fontFamily: manrope, fontSize: '.44rem', letterSpacing: '.4em', textTransform: 'uppercase', color: `${PARCHMENT}55` }}>Scroll</span>
            </div>
          </div>
        </section>

        {/* ── STORY PREFACE ──────────────────────────────────────────── */}
        <section style={{ padding: 'clamp(6rem,12vw,10rem) clamp(2rem,5vw,5rem)', textAlign: 'center', background: CREAM }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <Label color={ROSE_RED}>Their Story, As a Lotería</Label>
            <Ornament color={TERRACOTTA} my="0" />
            <h2 data-reveal style={{
              fontFamily: prata, fontSize: 'clamp(2rem,5vw,4.2rem)',
              lineHeight: 1.04, letterSpacing: '-.02em',
              margin: 'clamp(2rem,4vw,3rem) 0',
            }}>
              Every great Mexican story<br />is told one card at a time.
            </h2>
            <p data-reveal style={{
              fontFamily: garamond, fontStyle: 'italic',
              fontSize: 'clamp(.95rem,1.4vw,1.15rem)',
              color: `${INK}99`, lineHeight: 1.85, maxWidth: '52ch', margin: '0 auto',
            }}>
              In the tradition of La Lotería, we have commissioned a deck for Santiago and Luna — eight cards, each one a moment from their story. Turn the cards slowly. Some of them you will recognise. Some of them, only they know.
            </p>
          </div>
        </section>

        {/* ── CARD 20 — EL SALÓN DE CLASE ────────────────────────────── */}
        <section style={{ position: 'relative', padding: 'clamp(5rem,10vw,9rem) clamp(2rem,5vw,5rem)', background: CREAM, overflow: 'hidden' }}>
          <GhostNumber color={INK} side="right">XX</GhostNumber>
          <BirdOrnament src="/assets/sl/sl-bird-01.png" side="left" />
          <Label color={TERRACOTTA}>Card Twenty</Label>

          <div className="sl-split">
            <div style={{ flex: '0 0 auto', width: 'min(100%, 320px)' }}>
              <LoteriaCard number="20" title="El Salón de Clase" image="/assets/sl/sl-el-salon-de-clase.png" />
            </div>
            <div data-reveal style={{ maxWidth: '42ch' }}>
              <p style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(1.5rem,2.8vw,2.2rem)', lineHeight: 1.2, color: INK, marginBottom: 'clamp(1.5rem,3vw,2rem)' }}>
                "Sueña, Estudia y Trabaja," the chalkboard said. Neither of us knew the lesson that mattered most was sitting two rows over.
              </p>
              <p style={{ fontFamily: garamond, fontSize: 'clamp(.9rem,1.3vw,1.05rem)', color: `${INK}88`, lineHeight: 1.8, marginBottom: '1.5rem' }}>
                It began not with a word but with the particular silence of two people pretending not to notice each other. Santiago noticed the way Luna held her pen — like someone who believed every sentence deserved to be written carefully. Luna noticed that Santiago underlined things in green.
              </p>
              <p style={{ fontFamily: garamond, fontSize: 'clamp(.9rem,1.3vw,1.05rem)', color: `${INK}88`, lineHeight: 1.8 }}>
                Some stories begin with a glance. Theirs began in a classroom, and it has never stopped.
              </p>
              <Ornament color={TERRACOTTA} my="clamp(1.5rem,3vw,2rem)" />
              <p style={{ fontFamily: manrope, fontSize: '.5rem', letterSpacing: '.35em', textTransform: 'uppercase', color: `${TERRACOTTA}99` }}>
                Ciudad de México · 2019
              </p>
            </div>
          </div>
        </section>

        {/* ── PULL QUOTE ─────────────────────────────────────────────── */}
        <section style={{ background: MIDNIGHT, padding: 'clamp(5rem,10vw,9rem) clamp(2rem,5vw,5rem)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: .1, backgroundImage: GRAIN, backgroundSize: '200px', mixBlendMode: 'screen' }} />
          <div data-reveal style={{ maxWidth: '26ch', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <p style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(1.8rem,4.5vw,3.8rem)', color: PARCHMENT, lineHeight: 1.18, letterSpacing: '-.01em' }}>
              "Some loves are so inevitable they feel like memory."
            </p>
            <div style={{ marginTop: 'clamp(2rem,4vw,3rem)' }}>
              <Ornament color={CANDLE} />
            </div>
          </div>
        </section>

        {/* ── CARD 25 — LOS ENAMORADOS ───────────────────────────────── */}
        <section style={{ background: MIDNIGHT, padding: 'clamp(5rem,10vw,9rem) clamp(2rem,5vw,5rem)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: .08, backgroundImage: GRAIN, backgroundSize: '200px', mixBlendMode: 'screen' }} />
          <GhostNumber color={PARCHMENT} side="left">XXV</GhostNumber>
          <BirdOrnament src="/assets/sl/sl-bird-02.png" side="right" />
          <Label color={CANDLE}>Card Twenty-Five</Label>

          <div className="sl-split rev">
            <div style={{ flex: '0 0 auto', width: 'min(100%, 320px)' }}>
              <LoteriaCard number="25" title="Los Enamorados" image="/assets/sl/sl-los-enamorados.png" flip />
            </div>
            <div data-reveal style={{ maxWidth: '42ch' }}>
              <p style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(1.5rem,2.8vw,2.2rem)', lineHeight: 1.2, color: PARCHMENT, marginBottom: 'clamp(1.5rem,3vw,2rem)' }}>
                What began as friendship became a life they could no longer imagine apart.
              </p>
              <p style={{ fontFamily: garamond, fontSize: 'clamp(.9rem,1.3vw,1.05rem)', color: `${PARCHMENT}99`, lineHeight: 1.8, marginBottom: '1.5rem' }}>
                There is a particular moment in every love story — not the first meeting, not the first kiss, but the quiet afternoon when you realise you have stopped imagining the future without this person. For Santiago and Luna, that moment happened in a garden in Coyoacán, watching a hummingbird, saying almost nothing.
              </p>
              <p style={{ fontFamily: garamond, fontSize: 'clamp(.9rem,1.3vw,1.05rem)', color: `${PARCHMENT}99`, lineHeight: 1.8 }}>
                Friendship, as it turned out, was only the first chapter.
              </p>
              <Ornament color={CANDLE} my="clamp(1.5rem,3vw,2rem)" />
              <p style={{ fontFamily: manrope, fontSize: '.5rem', letterSpacing: '.35em', textTransform: 'uppercase', color: `${CANDLE}99` }}>
                Coyoacán · 2021
              </p>
            </div>
          </div>
        </section>

        {/* ── CARD 22 — LOS NOVIOS ───────────────────────────────────── */}
        <section style={{ background: PALM, padding: 'clamp(5rem,10vw,9rem) clamp(2rem,5vw,5rem)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: .09, backgroundImage: GRAIN, backgroundSize: '200px', mixBlendMode: 'multiply' }} />
          <GhostNumber color={PARCHMENT} side="right">XXII</GhostNumber>
          <Label color={PARCHMENT}>Card Twenty-Two</Label>

          <div className="sl-split">
            <div style={{ flex: '0 0 auto', width: 'min(100%, 320px)' }}>
              <LoteriaCard number="22" title="Los Novios" image="/assets/sl/sl-los-novios.png" />
            </div>
            <div data-reveal style={{ maxWidth: '42ch' }}>
              <p style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(1.5rem,2.8vw,2.2rem)', lineHeight: 1.2, color: PARCHMENT, marginBottom: 'clamp(1.5rem,3vw,2rem)' }}>
                Two families. One celebration. A love the whole village will carry for a generation.
              </p>
              <p style={{ fontFamily: garamond, fontSize: 'clamp(.9rem,1.3vw,1.05rem)', color: `${PARCHMENT}cc`, lineHeight: 1.8, marginBottom: '1.5rem' }}>
                When Santiago proposed, he did not choose a restaurant or a rooftop or a ring box tied with a ribbon. He chose a Sunday morning, his grandmother's kitchen, and a sentence he had been practising for six months. Luna said yes before he finished it.
              </p>
              <p style={{ fontFamily: garamond, fontSize: 'clamp(.9rem,1.3vw,1.05rem)', color: `${PARCHMENT}cc`, lineHeight: 1.8 }}>
                The entire family heard it through the walls. Nobody pretended they hadn't.
              </p>
              <Ornament color={PARCHMENT} my="clamp(1.5rem,3vw,2rem)" />
              <p style={{ fontFamily: manrope, fontSize: '.5rem', letterSpacing: '.35em', textTransform: 'uppercase', color: `${PARCHMENT}88` }}>
                Ciudad de México · Enero 2025
              </p>
            </div>
          </div>
        </section>

        {/* ── CARD 58 — LA CEREMONIA ─────────────────────────────────── */}
        <section style={{ background: MIDNIGHT, padding: 'clamp(5rem,10vw,9rem) clamp(2rem,5vw,5rem)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: .08, backgroundImage: GRAIN, backgroundSize: '200px', mixBlendMode: 'screen' }} />
          <GhostNumber color={PARCHMENT} side="left">LVIII</GhostNumber>
          <Label color={CANDLE}>Card Fifty-Eight</Label>

          <div className="sl-split rev">
            <div style={{ flex: '0 0 auto', width: 'min(100%, 320px)' }}>
              <LoteriaCard number="58" title="La Ceremonia" image="/assets/sl/sl-la-ceremonia.png" flip />
            </div>
            <div data-reveal style={{ maxWidth: '42ch' }}>
              <p style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(1.5rem,2.8vw,2.2rem)', lineHeight: 1.2, color: PARCHMENT, marginBottom: 'clamp(1.5rem,3vw,2rem)' }}>
                Candlelight, palm fronds, and a path of marigolds that leads to forever.
              </p>
              <p style={{ fontFamily: garamond, fontSize: 'clamp(.9rem,1.3vw,1.05rem)', color: `${PARCHMENT}99`, lineHeight: 1.8, marginBottom: '1.5rem' }}>
                In the traditions of their grandmothers, they will exchange arras — thirteen coins, a promise of shared abundance. They will be lassoed together in a floral lasso, a symbol of unity their families have honoured for generations. The cenote will hold the light. The palms will hold the silence.
              </p>
              <p style={{ fontFamily: garamond, fontSize: 'clamp(.9rem,1.3vw,1.05rem)', color: `${PARCHMENT}99`, lineHeight: 1.8 }}>
                You have been chosen to witness it.
              </p>
              <Ornament color={CANDLE} my="clamp(1.5rem,3vw,2rem)" />
              <p style={{ fontFamily: manrope, fontSize: '.5rem', letterSpacing: '.35em', textTransform: 'uppercase', color: `${CANDLE}99` }}>
                Tulum · 26 de Julio · 2026
              </p>
            </div>
          </div>
        </section>

        {/* ── VIDEO — LA CELEBRACIÓN ─────────────────────────────────── */}
        <section style={{ background: PALM, padding: 'clamp(5rem,10vw,9rem) clamp(2rem,5vw,5rem)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: .09, backgroundImage: GRAIN, backgroundSize: '200px', mixBlendMode: 'multiply' }} />
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
            <Label color={PARCHMENT}>A Living Memory</Label>
            <LoteriaCard number="∞" title="La Celebración" video="/assets/sl/sl-celebration-clip.mp4" />
            <p data-reveal style={{
              fontFamily: garamond, fontStyle: 'italic',
              fontSize: 'clamp(1rem,1.6vw,1.2rem)',
              color: `${PARCHMENT}dd`, maxWidth: '38ch', margin: 'clamp(2rem,4vw,3rem) auto 0', lineHeight: 1.8,
            }}>
              Some moments cannot be painted. They can only be lived, played back, and lived again.
            </p>
          </div>
        </section>

        {/* ── LA BODA — FORMAL INVITATION ────────────────────────────── */}
        <section style={{
          background: MIDNIGHT, padding: 'clamp(5rem,10vw,9rem) clamp(2rem,5vw,5rem)',
          position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: .08, backgroundImage: GRAIN, backgroundSize: '200px', mixBlendMode: 'screen' }} />
          <Label color={CANDLE}>The Formal Invitation</Label>
          <p data-reveal style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(.9rem,1.3vw,1.1rem)', color: `${PARCHMENT}77`, maxWidth: '44ch', textAlign: 'center', lineHeight: 1.8, marginBottom: 'clamp(2.5rem,5vw,4rem)' }}>
            What follows is the official invitation — designed once, for them alone, and sealed with the mark of Maison.
          </p>
          <div data-reveal style={{
            position: 'relative', width: '100%', maxWidth: 420, aspectRatio: '2/3',
            boxShadow: '0 40px 100px rgba(0,0,0,.55), 0 0 0 1px rgba(227,164,53,.15)',
            border: `1px solid ${CANDLE}28`,
          }}>
            <Image src="/assets/sl/sl-la-boda-invitation.png"
              alt="La Boda — Santiago &amp; Luna, 26 de Julio 2026, Tulum México"
              fill style={{ objectFit: 'cover' }} sizes="420px" />
          </div>
        </section>

        {/* ── EVENT DETAILS ──────────────────────────────────────────── */}
        <section style={{ background: INK, padding: 'clamp(5rem,10vw,9rem) clamp(2rem,5vw,5rem)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: .06, backgroundImage: GRAIN, backgroundSize: '200px', mixBlendMode: 'screen' }} />
          <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem,6vw,5rem)' }}>
              <Label color={CANDLE}>The Details</Label>
              <h2 data-reveal style={{ fontFamily: prata, fontSize: 'clamp(2rem,5vw,4rem)', color: PARCHMENT, lineHeight: 1.05, letterSpacing: '-.02em' }}>
                Everything you need to know.
              </h2>
            </div>

            <div className="sl-detail-grid">
              {/* Date */}
              <div data-reveal style={{ textAlign: 'center', padding: 'clamp(1.5rem,3vw,2.5rem)', border: `1px solid ${CANDLE}22`, position: 'relative' }}>
                <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', background: INK, padding: '0 .8rem' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 0 L16 8 L8 16 L0 8 Z" fill={CANDLE} opacity=".5"/></svg>
                </div>
                <p style={{ fontFamily: manrope, fontSize: '.48rem', letterSpacing: '.4em', textTransform: 'uppercase', color: `${CANDLE}88`, marginBottom: '1rem' }}>Fecha</p>
                <p className={abril.className} style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: PARCHMENT, lineHeight: 1 }}>26</p>
                <p style={{ fontFamily: manrope, fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase', color: `${PARCHMENT}77`, marginTop: '.4rem' }}>Julio · 2026</p>
                <p style={{ fontFamily: manrope, fontSize: '.54rem', letterSpacing: '.2em', textTransform: 'uppercase', color: `${PARCHMENT}44`, marginTop: '.3rem' }}>Sábado</p>
              </div>

              {/* Time */}
              <div data-reveal style={{ textAlign: 'center', padding: 'clamp(1.5rem,3vw,2.5rem)', border: `1px solid ${CANDLE}22`, position: 'relative' }}>
                <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', background: INK, padding: '0 .8rem' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 0 L16 8 L8 16 L0 8 Z" fill={CANDLE} opacity=".5"/></svg>
                </div>
                <p style={{ fontFamily: manrope, fontSize: '.48rem', letterSpacing: '.4em', textTransform: 'uppercase', color: `${CANDLE}88`, marginBottom: '1rem' }}>Horario</p>
                <p style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(1rem,1.8vw,1.3rem)', color: PARCHMENT, lineHeight: 1.6 }}>
                  Ceremonia<br />
                  <span className={abril.className} style={{ fontSize: 'clamp(1.4rem,2.5vw,1.9rem)' }}>17:00</span>
                </p>
                <p style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(.85rem,1.3vw,1rem)', color: `${PARCHMENT}77`, lineHeight: 1.6, marginTop: '.6rem' }}>
                  Recepción a las 19:30
                </p>
              </div>

              {/* Venue */}
              <div data-reveal style={{ textAlign: 'center', padding: 'clamp(1.5rem,3vw,2.5rem)', border: `1px solid ${CANDLE}22`, position: 'relative' }}>
                <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', background: INK, padding: '0 .8rem' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 0 L16 8 L8 16 L0 8 Z" fill={CANDLE} opacity=".5"/></svg>
                </div>
                <p style={{ fontFamily: manrope, fontSize: '.48rem', letterSpacing: '.4em', textTransform: 'uppercase', color: `${CANDLE}88`, marginBottom: '1rem' }}>Lugar</p>
                <p style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(1.1rem,1.8vw,1.35rem)', color: PARCHMENT, lineHeight: 1.5 }}>
                  Casa Jaguar
                </p>
                <p style={{ fontFamily: manrope, fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase', color: `${PARCHMENT}66`, marginTop: '.5rem', lineHeight: 1.7 }}>
                  Tulum, Quintana Roo<br />México
                </p>
                <p style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: '.82rem', color: `${PARCHMENT}44`, marginTop: '.6rem' }}>
                  Orilla del cenote
                </p>
              </div>

              {/* Dress code */}
              <div data-reveal style={{ textAlign: 'center', padding: 'clamp(1.5rem,3vw,2.5rem)', border: `1px solid ${CANDLE}22`, position: 'relative' }}>
                <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', background: INK, padding: '0 .8rem' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 0 L16 8 L8 16 L0 8 Z" fill={CANDLE} opacity=".5"/></svg>
                </div>
                <p style={{ fontFamily: manrope, fontSize: '.48rem', letterSpacing: '.4em', textTransform: 'uppercase', color: `${CANDLE}88`, marginBottom: '1rem' }}>Vestimenta</p>
                <p style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(1rem,1.6vw,1.2rem)', color: PARCHMENT, lineHeight: 1.55 }}>
                  Elegancia festiva mexicana
                </p>
                <p style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(.82rem,1.2vw,.95rem)', color: `${PARCHMENT}66`, marginTop: '.6rem', lineHeight: 1.7 }}>
                  Guayabera, huipil y colores de fiesta son bienvenidos.<br />Zapatos cómodos recomendados.
                </p>
              </div>
            </div>

            <div data-reveal style={{ textAlign: 'center', marginTop: 'clamp(3rem,6vw,5rem)' }}>
              <Ornament color={CANDLE} />
              <p style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(.9rem,1.3vw,1.05rem)', color: `${PARCHMENT}55`, marginTop: 'clamp(1.5rem,3vw,2rem)', lineHeight: 1.8, maxWidth: '48ch', margin: 'clamp(1.5rem,3vw,2rem) auto 0' }}>
                The ceremony will take place beside the cenote, beneath an open sky. Please arrive ten minutes early. The jungle will take care of the rest.
              </p>
            </div>
          </div>
        </section>

        {/* ── RSVP ───────────────────────────────────────────────────── */}
        <section style={{ background: TALAVERA, color: PARCHMENT, padding: 'clamp(6rem,12vw,11rem) clamp(2rem,5vw,5rem)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: .07, backgroundImage: GRAIN, backgroundSize: '200px', mixBlendMode: 'screen' }} />

          {/* Decorative corner ornaments */}
          {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h]) => (
            <div key={`${v}${h}`} aria-hidden style={{
              position: 'absolute', [v]: 'clamp(1.5rem,3vw,3rem)', [h]: 'clamp(1.5rem,3vw,3rem)',
              width: 40, height: 40,
              borderTop: v === 'top' ? `1px solid ${CANDLE}55` : 'none',
              borderBottom: v === 'bottom' ? `1px solid ${CANDLE}55` : 'none',
              borderLeft: h === 'left' ? `1px solid ${CANDLE}55` : 'none',
              borderRight: h === 'right' ? `1px solid ${CANDLE}55` : 'none',
            }} />
          ))}

          <div style={{ maxWidth: 560, width: '100%', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'clamp(1.5rem,3vw,2.5rem)' }}>
              <WaxSeal />
            </div>
            <Label color={CANDLE}>Su Respuesta Es Esperada</Label>
            <h2 data-reveal style={{ fontFamily: prata, fontSize: 'clamp(2.2rem,5vw,4.2rem)', lineHeight: 1.04, letterSpacing: '-.02em', marginBottom: '1rem' }}>
              Will you join us<br />in Tulum?
            </h2>
            <p data-reveal style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(.9rem,1.3vw,1.05rem)', color: `${PARCHMENT}aa`, lineHeight: 1.75, maxWidth: '38ch', margin: '0 auto clamp(2.5rem,5vw,4rem)' }}>
              A place at the table has been reserved in your name. Your reply, whatever it may be, will be received with grace.
            </p>
            <p data-reveal style={{ fontFamily: manrope, fontSize: '.54rem', letterSpacing: '.35em', textTransform: 'uppercase', color: CANDLE, marginBottom: 'clamp(2.5rem,5vw,4rem)' }}>
              26 · Julio · 2026 — Tulum, Quintana Roo
            </p>

            {!rsvpSent ? (
              <div data-reveal>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
                  <button onClick={() => setRsvpChoice('accept')} style={{
                    fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(.95rem,1.4vw,1.1rem)', padding: '1em 2em', cursor: 'pointer',
                    background: rsvpChoice === 'accept' ? CANDLE : 'transparent',
                    color: rsvpChoice === 'accept' ? INK : PARCHMENT,
                    border: `1px solid ${CANDLE}`, transition: 'all .35s', letterSpacing: '.02em',
                  }}>
                    Joyfully Accept
                  </button>
                  <button onClick={() => setRsvpChoice('decline')} style={{
                    fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(.95rem,1.4vw,1.1rem)', padding: '1em 2em', cursor: 'pointer',
                    background: rsvpChoice === 'decline' ? ROSE_RED : 'transparent',
                    color: rsvpChoice === 'decline' ? PARCHMENT : `${PARCHMENT}88`,
                    border: `1px solid ${PARCHMENT}33`, transition: 'all .35s', letterSpacing: '.02em',
                  }}>
                    Regretfully Decline
                  </button>
                </div>

                {rsvpChoice === 'accept' && (
                  <div data-reveal style={{ marginBottom: 'clamp(2rem,4vw,3rem)' }}>
                    <p style={{ fontFamily: manrope, fontSize: '.5rem', letterSpacing: '.3em', textTransform: 'uppercase', color: `${PARCHMENT}66`, marginBottom: '1rem' }}>
                      A detail for the table
                    </p>
                    <select value={meal} onChange={e => setMeal(e.target.value)} style={{
                      fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(.95rem,1.3vw,1.05rem)', padding: '.8em 1.4em',
                      border: `1px solid ${PARCHMENT}44`, background: 'transparent', color: PARCHMENT, cursor: 'pointer',
                      appearance: 'none' as const,
                    }}>
                      <option value="" style={{ color: INK }}>Choose a course</option>
                      <option value="cochinita" style={{ color: INK }}>Cochinita pibil, slow-roasted</option>
                      <option value="pescado" style={{ color: INK }}>Pescado a la talla, citrus &amp; chile</option>
                      <option value="vegetal" style={{ color: INK }}>Garden vegetables, heirloom corn</option>
                    </select>
                  </div>
                )}

                {rsvpChoice && (
                  <button onClick={() => setRsvpSent(true)} style={{
                    fontFamily: manrope, fontSize: '.56rem', letterSpacing: '.32em', textTransform: 'uppercase',
                    color: INK, background: CANDLE, border: 'none', padding: '1.15em 3em', cursor: 'pointer',
                  }}>
                    Send My Reply
                  </button>
                )}
              </div>
            ) : (
              <div data-reveal>
                <Ornament color={CANDLE} />
                <p style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(1rem,1.6vw,1.25rem)', lineHeight: 1.75, marginTop: 'clamp(1.5rem,3vw,2rem)', color: PARCHMENT }}>
                  {rsvpChoice === 'accept'
                    ? 'Your reply has been received with great joy. We cannot wait to celebrate with you in Tulum, under an open sky and beside the cenote.'
                    : 'Your reply has been received with warmth and understanding. You will be with us in spirit — and always in our story.'}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── MEMORY VAULT ───────────────────────────────────────────── */}
        <section style={{ background: CREAM, padding: 'clamp(6rem,12vw,11rem) clamp(2rem,5vw,5rem)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: .06, backgroundImage: GRAIN, backgroundSize: '180px', mixBlendMode: 'multiply' }} />
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <Label color={ROSE_RED}>The Memory Vault</Label>
            <Ornament color={TERRACOTTA} my="0" />
            <h2 data-reveal style={{ fontFamily: prata, fontSize: 'clamp(2rem,5vw,4rem)', lineHeight: 1.04, letterSpacing: '-.02em', margin: 'clamp(2rem,4vw,3rem) 0' }}>
              We invite you to leave<br />a piece of your story<br />within ours.
            </h2>
            <p data-reveal style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(.9rem,1.3vw,1.05rem)', color: `${INK}88`, lineHeight: 1.85, maxWidth: '44ch', margin: '0 auto clamp(2.5rem,5vw,4rem)' }}>
              Every archive deserves witnesses. Leave us a photograph, a voice, or a few words — and we will keep them here, alongside everything else that made this day.
            </p>

            {!vaultSent ? (
              <div data-reveal style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {['A photograph', 'A video', 'A voice message'].map(label => (
                    <label key={label} style={{
                      fontFamily: manrope, fontSize: '.54rem', letterSpacing: '.15em', textTransform: 'uppercase',
                      color: TERRACOTTA, border: `1px solid ${TERRACOTTA}55`, padding: '.9em 1.4em', cursor: 'pointer',
                      transition: 'all .3s',
                    }}>
                      {label}
                      <input type="file" accept={label.includes('voice') ? 'audio/*' : label.includes('video') ? 'video/*' : 'image/*'} style={{ display: 'none' }} />
                    </label>
                  ))}
                </div>
                <textarea
                  value={vaultNote}
                  onChange={e => setVaultNote(e.target.value)}
                  placeholder="Or simply leave us a written note…"
                  rows={4}
                  style={{
                    width: '100%', maxWidth: 500, padding: '1.1rem',
                    fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(.9rem,1.2vw,1rem)',
                    background: '#FFF9F0', border: `1px solid ${TERRACOTTA}33`, color: INK, resize: 'none',
                    lineHeight: 1.75,
                  }}
                />
                <button onClick={() => setVaultSent(true)} style={{
                  fontFamily: manrope, fontSize: '.56rem', letterSpacing: '.3em', textTransform: 'uppercase',
                  color: PARCHMENT, background: INK, border: 'none', padding: '1.15em 3em', cursor: 'pointer',
                }}>
                  Add to the Archive
                </button>
              </div>
            ) : (
              <div data-reveal>
                <Ornament color={TERRACOTTA} />
                <p style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(1rem,1.5vw,1.2rem)', color: TERRACOTTA, lineHeight: 1.75, marginTop: 'clamp(1.5rem,3vw,2rem)' }}>
                  Your page has been added to the archive. Thank you for becoming part of their story.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── CLOSING ────────────────────────────────────────────────── */}
        <section style={{ background: INK, color: PARCHMENT, padding: 'clamp(7rem,13vw,12rem) clamp(2rem,5vw,5rem)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(2rem,4vw,3.5rem)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: .06, backgroundImage: GRAIN, backgroundSize: '200px' }} />

          {/* Large ghost text */}
          <div aria-hidden className={abril.className} style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            fontSize: 'clamp(8rem,30vw,24rem)', color: PARCHMENT, opacity: .035,
            lineHeight: 1, userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
          }}>S·L</div>

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(1.5rem,3vw,2.5rem)' }}>
            <WaxSeal />
            <p style={{ fontFamily: manrope, fontSize: '.5rem', letterSpacing: '.38em', textTransform: 'uppercase', color: CANDLE }}>
              Maison RSVP · The Archive
            </p>
            <Ornament color={CANDLE} />
            <h2 style={{ fontFamily: prata, fontSize: 'clamp(2.4rem,6vw,6rem)', lineHeight: .95, letterSpacing: '-.025em', maxWidth: '14ch' }}>
              A heirloom, not a website.
            </h2>
            <p style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(.92rem,1.3vw,1.1rem)', color: `${PARCHMENT}77`, maxWidth: '42ch', lineHeight: 1.85 }}>
              This experience was composed for Santiago and Luna alone. Every commission at Maison is created once, for one occasion — and then retired. What you have witnessed will not be repeated.
            </p>
            <Ornament color={CANDLE} />
            <div style={{ display: 'flex', gap: 'clamp(2rem,4vw,4rem)', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/work" style={{ fontFamily: manrope, fontSize: '.56rem', letterSpacing: '.28em', textTransform: 'uppercase', color: CANDLE, textDecoration: 'none', borderBottom: `1px solid ${CANDLE}44`, paddingBottom: '.25em' }}>
                View all commissions →
              </Link>
              <Link href="/contact" style={{ fontFamily: manrope, fontSize: '.56rem', letterSpacing: '.28em', textTransform: 'uppercase', color: `${PARCHMENT}66`, textDecoration: 'none', borderBottom: `1px solid ${PARCHMENT}1A`, paddingBottom: '.25em' }}>
                Begin your commission →
              </Link>
            </div>
          </div>
        </section>

      </main>

      {introDone && <AmbientParticles />}

      <Footer />
    </>
  );
}
