'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Abril_Fatface } from 'next/font/google';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

/* Bold poster-serif for lotería card titles & the couple's name —
   matches the hand-lettered title bars on real lotería decks; Prata reads too refined/French for this. */
const abril = Abril_Fatface({ subsets: ['latin'], weight: '400', display: 'swap' });

/* ─── Palette — pulled directly from the real artwork, not a generic luxury ramp ─── */
const PARCHMENT = '#F3E3C2'; // aged lotería card border
const MIDNIGHT   = '#162A3D'; // La Ceremonia night sky
const PALM       = '#2F6E3B'; // palm frond green
const CANDLE     = '#E3A435'; // candlelight gold
const OCHRE      = '#C77B2E'; // sun, mustard
const TERRACOTTA = '#B5602E';
const ROSE_RED   = '#A6342C'; // deep rose accent
const TALAVERA   = '#2B5F86'; // wax seal / talavera tile blue
const EMBROIDERY = '#7A4FA0'; // ribbon embroidery violet, from the doors+bow art
const INK        = '#241B12'; // warm near-black

const PARTICLE_COLORS = [CANDLE, TERRACOTTA, TALAVERA, ROSE_RED, EMBROIDERY];

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ─── Ambient floating particles — pure CSS, cinematic, cheap on mobile ─── */
function AmbientParticles({ count = 22 }: { count?: number }) {
  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 30, overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 4.37 * 7) % 100;
        const size = 3 + (i % 4) * 2;
        const duration = 16 + (i % 7) * 3;
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

function ChapterLabel({ children, color = CANDLE }: { children: React.ReactNode; color?: string }) {
  return (
    <p style={{
      fontFamily: 'var(--font-manrope), sans-serif',
      fontSize: '.56rem', letterSpacing: '.4em', textTransform: 'uppercase',
      color, marginBottom: 'clamp(1.5rem,3vw,2.5rem)',
    }}>
      {children}
    </p>
  );
}

/* ─── A card in the couple's custom lotería deck ─────────────────────── */
function LoteriaCard({
  number, title, image, video, painted, flip = false,
}: {
  number: string;
  title: string;
  image?: string;
  video?: string;
  painted?: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div data-reveal style={{
      background: PARCHMENT,
      border: `1px solid ${INK}22`,
      padding: '10px',
      boxShadow: '0 24px 60px rgba(36,27,18,.28)',
      maxWidth: 360, margin: '0 auto',
      transform: flip ? 'rotate(1.2deg)' : 'rotate(-1.2deg)',
    }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '2/3', border: `1px solid ${INK}33`, overflow: 'hidden' }}>
        {video ? (
          <video src={video} autoPlay muted loop playsInline
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : image ? (
          <Image src={image} alt={title} fill style={{ objectFit: 'cover' }} sizes="360px" />
        ) : (
          <div style={{ position: 'absolute', inset: 0 }}>{painted}</div>
        )}
        {/* number badge */}
        <span className={abril.className} style={{
          position: 'absolute', top: 10, left: 12,
          fontSize: '1.3rem', color: PARCHMENT, textShadow: '0 1px 4px rgba(0,0,0,.6)',
        }}>
          {number}
        </span>
      </div>
      <p className={abril.className} style={{
        fontSize: 'clamp(1.1rem,1.8vw,1.5rem)',
        letterSpacing: '.04em', textAlign: 'center', color: INK,
        marginTop: '10px', textTransform: 'uppercase',
      }}>
        {title}
      </p>
    </div>
  );
}

function BirdOrnament({ src, side = 'left' }: { src: string; side?: 'left' | 'right' }) {
  return (
    <div aria-hidden style={{
      position: 'absolute', top: '8%', [side]: 'clamp(1rem,4vw,4rem)',
      width: 'clamp(56px,9vw,110px)', height: 'clamp(56px,9vw,110px)',
      opacity: .9, transform: side === 'left' ? 'rotate(-8deg)' : 'rotate(10deg) scaleX(-1)',
      filter: 'drop-shadow(0 8px 16px rgba(36,27,18,.25))',
    }}>
      <Image src={src} alt="" fill style={{ objectFit: 'contain' }} sizes="110px" />
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
    /* Video plays once, then advances straight into the site — no extra click required. */
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
          trigger: el, start: 'top 90%',
          onEnter: () => gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, delay: (j % 3) * 0.1, ease: 'power3.out' }),
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
      {/* ═══ LETTER-OPENING VIDEO INTRO — plays once, then advances directly into the site ═══ */}
      {!introDone && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: INK }}>
          <video
            ref={videoRef}
            src="/assets/sl/sl-letter-opening-v2.mp4"
            muted
            playsInline
            autoPlay
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: videoReady ? 1 : 0, transition: 'opacity .5s ease',
            }}
          />
          {/* skip — for return visits */}
          <button
            onClick={() => setIntroDone(true)}
            style={{
              position: 'absolute', top: 'clamp(1.5rem,4vw,2.5rem)', right: 'clamp(1.5rem,4vw,2.5rem)',
              fontFamily: manrope, fontSize: '.5rem', letterSpacing: '.3em', textTransform: 'uppercase',
              color: `${PARCHMENT}aa`, background: 'transparent', border: `1px solid ${PARCHMENT}33`,
              padding: '.6em 1em', cursor: 'pointer',
            }}
          >
            Skip
          </button>
        </div>
      )}

      <Nav light />

      <main style={{ background: PARCHMENT, color: INK, overflowX: 'hidden' }}>

        {/* ── OPENING — the wax seal, just-opened ── */}
        <section style={{ position: 'relative', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <Image src="/assets/sl/sl-doors-bow.png" alt="Santiago & Luna — talavera doors, tied with an embroidered ribbon" fill priority
            style={{ objectFit: 'cover' }} sizes="100vw" />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(22,26,18,.1) 0%, rgba(22,26,18,.6) 100%)` }} />
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 2rem' }}>
            <p data-reveal style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(1.1rem,2.2vw,1.6rem)', color: PARCHMENT, marginBottom: '.75rem' }}>
              A letter, for you.
            </p>
            <h1 data-reveal className={abril.className} style={{ fontSize: 'clamp(2.8rem,8vw,6.5rem)', color: PARCHMENT, letterSpacing: '.02em', textShadow: '0 4px 24px rgba(0,0,0,.35)' }}>
              Santiago &amp; Luna
            </h1>
          </div>
        </section>

        {/* ── THE LOTERÍA DECK — title ── */}
        <section style={{ padding: 'clamp(5rem,10vw,8rem) clamp(2rem,5vw,5rem) clamp(2rem,4vw,3rem)', textAlign: 'center' }}>
          <ChapterLabel color={ROSE_RED}>Their Story, As a Lotería</ChapterLabel>
          <h2 data-reveal style={{ fontFamily: prata, fontSize: 'clamp(2.2rem,5.5vw,4.5rem)', lineHeight: 1.05, letterSpacing: '-.01em', maxWidth: '20ch', margin: '0 auto' }}>
            Every great Mexican story<br />is told one card at a time.
          </h2>
        </section>

        {/* ── CARD 20 — EL SALÓN DE CLASE (real art) ── */}
        <section style={{ position: 'relative', padding: 'clamp(2rem,4vw,3rem) clamp(2rem,5vw,5rem) clamp(5rem,10vw,8rem)', overflow: 'hidden' }}>
          <BirdOrnament src="/assets/sl/sl-bird-01.png" side="left" />
          <ChapterLabel color={TERRACOTTA}>Card Twenty</ChapterLabel>
          <LoteriaCard number="20" title="El Salón de Clase" image="/assets/sl/sl-el-salon-de-clase.png" />
          <p data-reveal style={{ textAlign: 'center', fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(1rem,1.6vw,1.25rem)', color: '#4A3A24', maxWidth: '36ch', margin: 'clamp(2rem,4vw,3rem) auto 0' }}>
            Some stories begin with a glance. Ours began in a classroom — Sueña, Estudia y Trabaja, the chalkboard said. Neither of us knew the lesson that mattered most was each other.
          </p>
        </section>

        {/* ── CARD 2 — LOS ENAMORADOS (real art) ── */}
        <section style={{ background: MIDNIGHT, padding: 'clamp(5rem,10vw,8rem) clamp(2rem,5vw,5rem)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: .08, backgroundImage: GRAIN, backgroundSize: '200px', mixBlendMode: 'screen' }} />
          <BirdOrnament src="/assets/sl/sl-bird-02.png" side="right" />
          <ChapterLabel color={CANDLE}>Card Twenty-Five</ChapterLabel>
          <LoteriaCard number="25" title="Los Enamorados" image="/assets/sl/sl-los-enamorados.png" />
          <p data-reveal style={{ textAlign: 'center', fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(1rem,1.6vw,1.25rem)', color: `${PARCHMENT}cc`, maxWidth: '36ch', margin: 'clamp(2rem,4vw,3rem) auto 0' }}>
            What began as friendship became a life we could no longer imagine apart.
          </p>
        </section>

        {/* ── CARD 4 — LOS NOVIOS (real art) ── */}
        <section style={{ background: PALM, padding: 'clamp(5rem,10vw,8rem) clamp(2rem,5vw,5rem)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: .08, backgroundImage: GRAIN, backgroundSize: '200px', mixBlendMode: 'multiply' }} />
          <ChapterLabel color={PARCHMENT}>Card Twenty-Two</ChapterLabel>
          <LoteriaCard number="22" title="Los Novios" image="/assets/sl/sl-los-novios.png" />
          <p data-reveal style={{ textAlign: 'center', fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(1rem,1.6vw,1.25rem)', color: `${PARCHMENT}dd`, maxWidth: '36ch', margin: 'clamp(2rem,4vw,3rem) auto 0' }}>
            Two families, one celebration, a love the whole village will remember.
          </p>
        </section>

        {/* ── CARD 5 — LA CEREMONIA (real art) ── */}
        <section style={{ background: MIDNIGHT, padding: 'clamp(5rem,10vw,8rem) clamp(2rem,5vw,5rem)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: .08, backgroundImage: GRAIN, backgroundSize: '200px', mixBlendMode: 'screen' }} />
          <ChapterLabel color={CANDLE}>Card Fifty-Eight</ChapterLabel>
          <LoteriaCard number="58" title="La Ceremonia" image="/assets/sl/sl-la-ceremonia.png" />
          <p data-reveal style={{ textAlign: 'center', fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(1rem,1.6vw,1.25rem)', color: `${PARCHMENT}cc`, maxWidth: '36ch', margin: 'clamp(2rem,4vw,3rem) auto 0' }}>
            Candlelight, palm leaves, and a path that leads to forever.
          </p>
        </section>

        {/* ── A MOVING MEMORY — real video from the celebration ── */}
        <section style={{ background: PALM, padding: 'clamp(5rem,10vw,8rem) clamp(2rem,5vw,5rem)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: .08, backgroundImage: GRAIN, backgroundSize: '200px', mixBlendMode: 'multiply' }} />
          <ChapterLabel color={PARCHMENT}>A Living Memory</ChapterLabel>
          <LoteriaCard number="∞" title="La Celebración" video="/assets/sl/sl-celebration-clip.mp4" />
          <p data-reveal style={{ textAlign: 'center', fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(1rem,1.6vw,1.25rem)', color: `${PARCHMENT}dd`, maxWidth: '36ch', margin: 'clamp(2rem,4vw,3rem) auto 0' }}>
            Some moments cannot be painted. They can only be lived, and watched again.
          </p>
        </section>

        {/* ── LA BODA — the formal invitation, in full ── */}
        <section style={{ background: MIDNIGHT, padding: 'clamp(5rem,10vw,8rem) clamp(2rem,5vw,5rem)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: .08, backgroundImage: GRAIN, backgroundSize: '200px', mixBlendMode: 'screen' }} />
          <ChapterLabel color={CANDLE}>The Formal Invitation</ChapterLabel>
          <div data-reveal style={{
            position: 'relative', width: '100%', maxWidth: 440, aspectRatio: '2/3',
            boxShadow: '0 30px 80px rgba(0,0,0,.45)', border: `1px solid ${CANDLE}33`,
          }}>
            <Image src="/assets/sl/sl-la-boda-invitation.png" alt="La Boda — Santiago & Luna, July 26 2026, Tulum México" fill
              style={{ objectFit: 'cover' }} sizes="440px" />
          </div>
        </section>

        {/* ── RSVP — "Your Reply Is Awaited" ── */}
        <section style={{ background: TALAVERA, color: PARCHMENT, padding: 'clamp(6rem,12vw,10rem) clamp(2rem,5vw,5rem)', position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
            <ChapterLabel color={CANDLE}>Your Reply Is Awaited</ChapterLabel>
            <h2 data-reveal style={{ fontFamily: prata, fontSize: 'clamp(2.2rem,5vw,4rem)', lineHeight: 1.05, letterSpacing: '-.02em', marginBottom: '1.25rem' }}>
              Will you join us<br />in Tulum?
            </h2>
            <p data-reveal style={{ fontFamily: manrope, fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase', color: CANDLE, marginBottom: 'clamp(2.5rem,5vw,4rem)' }}>
              26 · July · 2026 — Tulum, Quintana Roo
            </p>

            {!rsvpSent ? (
              <div data-reveal>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
                  <button onClick={() => setRsvpChoice('accept')} style={{
                    fontFamily: garamond, fontStyle: 'italic', fontSize: '1rem', padding: '.9em 1.8em', cursor: 'pointer',
                    background: rsvpChoice === 'accept' ? CANDLE : 'transparent',
                    color: rsvpChoice === 'accept' ? INK : PARCHMENT,
                    border: `1px solid ${CANDLE}`, transition: 'all .3s',
                  }}>
                    Joyfully Accept
                  </button>
                  <button onClick={() => setRsvpChoice('decline')} style={{
                    fontFamily: garamond, fontStyle: 'italic', fontSize: '1rem', padding: '.9em 1.8em', cursor: 'pointer',
                    background: rsvpChoice === 'decline' ? ROSE_RED : 'transparent',
                    color: rsvpChoice === 'decline' ? PARCHMENT : ROSE_RED,
                    border: `1px solid ${ROSE_RED}`, transition: 'all .3s',
                  }}>
                    Regretfully Decline
                  </button>
                </div>

                {rsvpChoice === 'accept' && (
                  <div style={{ marginBottom: 'clamp(2rem,4vw,3rem)' }}>
                    <p style={{ fontFamily: manrope, fontSize: '.55rem', letterSpacing: '.3em', textTransform: 'uppercase', color: `${PARCHMENT}99`, marginBottom: '1rem' }}>
                      A small detail, for the table
                    </p>
                    <select value={meal} onChange={e => setMeal(e.target.value)} style={{
                      fontFamily: garamond, fontStyle: 'italic', fontSize: '1rem', padding: '.7em 1.2em',
                      border: `1px solid ${PARCHMENT}55`, background: 'transparent', color: PARCHMENT, cursor: 'pointer',
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
                    fontFamily: manrope, fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase',
                    color: INK, background: CANDLE, border: 'none', padding: '1.1em 2.8em', cursor: 'pointer',
                  }}>
                    Send My Reply
                  </button>
                )}
              </div>
            ) : (
              <p data-reveal style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: '1.2rem', lineHeight: 1.7 }}>
                {rsvpChoice === 'accept'
                  ? 'Your reply has been received with joy. We cannot wait to celebrate with you in Tulum.'
                  : 'Your reply has been received with understanding. You will be with us in spirit.'}
              </p>
            )}
          </div>
        </section>

        {/* ── MEMORY VAULT ── */}
        <section style={{ background: PARCHMENT, padding: 'clamp(6rem,12vw,10rem) clamp(2rem,5vw,5rem)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: .06, backgroundImage: GRAIN, backgroundSize: '180px', mixBlendMode: 'multiply' }} />
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <ChapterLabel color={ROSE_RED}>The Memory Vault</ChapterLabel>
            <h2 data-reveal style={{ fontFamily: prata, fontSize: 'clamp(2.2rem,5vw,4rem)', lineHeight: 1.05, letterSpacing: '-.02em', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
              We invite you to leave<br />a piece of your story<br />within ours.
            </h2>

            {!vaultSent ? (
              <div data-reveal style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {['A photograph', 'A video', 'A voice message'].map(label => (
                    <label key={label} style={{
                      fontFamily: manrope, fontSize: '.58rem', letterSpacing: '.15em', textTransform: 'uppercase',
                      color: TERRACOTTA, border: `1px solid ${TERRACOTTA}66`, padding: '.8em 1.3em', cursor: 'pointer',
                    }}>
                      {label}
                      <input type="file" accept={label.includes('voice') ? 'audio/*' : label.includes('video') ? 'video/*' : 'image/*'} style={{ display: 'none' }} />
                    </label>
                  ))}
                </div>
                <textarea
                  value={vaultNote}
                  onChange={e => setVaultNote(e.target.value)}
                  placeholder="Or simply, leave us a written note..."
                  rows={4}
                  style={{
                    width: '100%', maxWidth: 480, padding: '1rem',
                    fontFamily: garamond, fontStyle: 'italic', fontSize: '.95rem',
                    background: '#FFFDF8', border: `1px solid ${TERRACOTTA}44`, color: INK, resize: 'none',
                  }}
                />
                <button onClick={() => setVaultSent(true)} style={{
                  fontFamily: manrope, fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase',
                  color: PARCHMENT, background: INK, border: 'none', padding: '1.1em 2.8em', cursor: 'pointer', marginTop: '.5rem',
                }}>
                  Add to the Archive
                </button>
              </div>
            ) : (
              <p data-reveal style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: '1.1rem', color: TERRACOTTA, lineHeight: 1.7 }}>
                Your page has been added to our archive. Thank you for becoming part of our story.
              </p>
            )}
          </div>
        </section>

        {/* ── CLOSING ── */}
        <section style={{ background: INK, color: PARCHMENT, padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(2rem,4vw,3rem)' }}>
          <p style={{ fontFamily: manrope, fontSize: '.5rem', letterSpacing: '.35em', textTransform: 'uppercase', color: CANDLE }}>
            Maison RSVP · The Archive
          </p>
          <h2 style={{ fontFamily: prata, fontSize: 'clamp(2.2rem,5vw,5.5rem)', lineHeight: .98, letterSpacing: '-.02em', maxWidth: '16ch' }}>
            A heirloom, not a website.
          </h2>
          <p style={{ fontFamily: garamond, fontStyle: 'italic', fontSize: 'clamp(.9rem,1.3vw,1.1rem)', color: `${PARCHMENT}99`, maxWidth: '38ch', lineHeight: 1.75 }}>
            This experience was created for Santiago and Luna. We create each commission once, and only once.
          </p>
          <div style={{ display: 'flex', gap: 'clamp(1.5rem,3vw,3rem)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/work" style={{ fontFamily: manrope, fontSize: '.58rem', letterSpacing: '.28em', textTransform: 'uppercase', color: CANDLE, textDecoration: 'none', borderBottom: `1px solid ${CANDLE}55`, paddingBottom: '.2em' }}>
              View all commissions →
            </Link>
            <Link href="/contact" style={{ fontFamily: manrope, fontSize: '.58rem', letterSpacing: '.28em', textTransform: 'uppercase', color: `${PARCHMENT}99`, textDecoration: 'none', borderBottom: `1px solid ${PARCHMENT}22`, paddingBottom: '.2em' }}>
              Begin your commission →
            </Link>
          </div>
        </section>
      </main>

      {introDone && <AmbientParticles />}

      <Footer />

      <style>{`
        @keyframes sl-particle-rise {
          0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          8%   { opacity: .55; }
          92%  { opacity: .35; }
          100% { transform: translateY(-110vh) translateX(var(--drift,20px)) rotate(180deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="sl-particle-rise"] { animation: none !important; }
        }
      `}</style>
    </>
  );
}
