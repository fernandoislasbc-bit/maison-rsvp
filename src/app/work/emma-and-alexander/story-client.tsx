'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

/* ═══════════════════════════════════════════════════════
   EMMA & EMMANUEL — A LETTER FROM UMBRIA
   Forest Green · Dusty Rose · Antique Bronze
   Cormorant Garamond · Pinyon Script · Jost
═══════════════════════════════════════════════════════ */

// ── Design Tokens ──────────────────────────────────────
const C = {
  forest: '#1E3028',
  rose: '#BF8A7A',
  bronze: '#B87348',
  sage: '#8FA88A',
  cream: '#F0E8D8',
  parchment: '#EAE0CC',
  ink: '#2C1A0E',
};

// ── Google Fonts loader ───────────────────────────────
function FontLoader() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Pinyon+Script&family=Jost:wght@200;300;400&display=swap';
    document.head.appendChild(link);
  }, []);
  return null;
}

// ── Falling petals video overlay ──────────────────────
function PetalsVideo({ opacity = 0.18 }: { opacity?: number }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity }}>
      <video
        autoPlay muted loop playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        src="/assets/ee/ea-petals-loop.mp4"
      />
    </div>
  );
}

// ── Grain overlay ─────────────────────────────────────
function Grain() {
  return (
    <div aria-hidden style={{
      position: 'fixed', inset: 0, zIndex: 9990, pointerEvents: 'none', opacity: 0.025,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: '180px',
    }} />
  );
}

// ── Divider rose ──────────────────────────────────────
function RoseDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '32px 0', opacity: 0.65 }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${C.bronze})` }} />
      <Image src="/assets/ee/ea-botanical-rose.png" alt="" width={36} height={36}
        style={{ objectFit: 'contain', mixBlendMode: 'multiply', opacity: 0.75 }} />
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${C.bronze})` }} />
    </div>
  );
}

// ── Monogram header ───────────────────────────────────
function Monogram({ size = 72 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
      <Image src="/assets/ee/ea-monogram.png" alt="E·E" width={size} height={size}
        style={{ objectFit: 'contain', mixBlendMode: 'multiply', opacity: 0.85 }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PHASE 1 — ENVELOPE ENTRANCE
// ═══════════════════════════════════════════════════════
function EnvelopeEntrance({ onOpen }: { onOpen: () => void }) {
  const [sealState, setSealState] = useState<'intact' | 'cracking' | 'cracked'>('intact');
  const [hovered, setHovered] = useState(false);

  const handleClick = useCallback(() => {
    if (sealState !== 'intact') return;
    setSealState('cracking');
    setTimeout(() => {
      setSealState('cracked');
      setTimeout(onOpen, 900);
    }, 600);
  }, [sealState, onOpen]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: C.forest,
        cursor: sealState === 'intact' ? 'pointer' : 'default',
        overflow: 'hidden',
      }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hero background image — full bleed */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image
          src="/assets/ee/ea-hero.png"
          alt=""
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
        {/* Darken overlay so text is readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom, rgba(30,48,40,0.35) 0%, rgba(30,48,40,0.55) 100%)`,
        }} />
      </div>

      {/* Petals floating over hero */}
      <PetalsVideo opacity={0.22} />

      {/* Wax seal — centred over the envelope image */}
      <div
        style={{
          position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 28,
          transform: hovered && sealState === 'intact' ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'transform 0.4s ease',
        }}
      >
        {/* Seal image stack */}
        <div style={{ position: 'relative', width: 120, height: 120 }}>
          {/* Intact seal */}
          <Image
            src="/assets/ee/ea-seal-intact.png"
            alt="Wax seal"
            fill
            style={{
              objectFit: 'contain',
              mixBlendMode: 'multiply',
              opacity: sealState === 'intact' ? 1 : 0,
              transition: 'opacity 0.3s ease',
              filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.5))',
            }}
          />
          {/* Cracked seal */}
          <Image
            src="/assets/ee/ea-seal-cracked.png"
            alt=""
            fill
            style={{
              objectFit: 'contain',
              mixBlendMode: 'multiply',
              opacity: sealState !== 'intact' ? 1 : 0,
              transition: 'opacity 0.3s ease',
              filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.6))',
              transform: sealState === 'cracking' ? 'scale(1.08)' : 'scale(1)',
            }}
          />
        </div>

        {/* Hint text */}
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontWeight: 200,
          fontSize: 11,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: C.cream,
          opacity: sealState === 'intact' ? (hovered ? 0.9 : 0.55) : 0,
          transition: 'opacity 0.4s ease',
          userSelect: 'none',
        }}>
          Break the seal to open
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PHASE 2 — ENVELOPE OPENING ANIMATION
// ═══════════════════════════════════════════════════════
function EnvelopeOpening({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 400);    // flap begins — slow, deliberate
    const t2 = setTimeout(() => setStep(2), 1800);   // envelope glides down after flap opens
    const t3 = setTimeout(() => setStep(3), 2900);   // letter rises softly
    const t4 = setTimeout(onComplete, 6800);         // 3.9s reading time before transition
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: C.forest,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      perspective: '1300px',
    }}>
      {/* Candle ambient light bg */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image src="/assets/ee/ea-candle-bg.png" alt="" fill
          style={{ objectFit: 'cover', opacity: 0.55 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(30,48,40,0.5)' }} />
      </div>

      <PetalsVideo opacity={0.15} />

      {/* Envelope container */}
      <div style={{
        position: 'relative',
        width: 340,
        height: 240,
        transformStyle: 'preserve-3d',
        transform: step >= 2 ? 'translateY(180px)' : 'translateY(0)',
        transition: step >= 2 ? 'transform 1.4s cubic-bezier(0.16,1,0.3,1)' : undefined,
        zIndex: 10,
      }}>
        {/* Envelope body */}
        <Image
          src="/assets/ee/ea-envelope.png"
          alt="Envelope"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />

        {/* Flap — rotates open */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '50%',
          transformOrigin: 'top center',
          transform: step >= 1 ? 'rotateX(-184deg)' : 'rotateX(0deg)',
          transition: 'transform 1.3s cubic-bezier(0.16,1,0.3,1)',
          backfaceVisibility: 'hidden',
          overflow: 'hidden',
          borderRadius: '0 0 50% 50% / 0 0 40% 40%',
          background: `linear-gradient(to bottom, ${C.sage}33, transparent)`,
        }} />
      </div>

      {/* Letter rising from envelope */}
      <div style={{
        position: 'absolute',
        width: 300,
        padding: '32px 28px',
        background: C.cream,
        borderRadius: 2,
        boxShadow: '0 20px 80px rgba(0,0,0,0.5)',
        transform: step >= 3 ? 'translateY(-80px)' : 'translateY(120px)',
        opacity: step >= 3 ? 1 : 0,
        transition: 'all 1.4s cubic-bezier(0.16,1,0.3,1)',
        zIndex: 20,
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 15,
          color: C.ink,
          lineHeight: 1.7,
          opacity: 0.75,
          letterSpacing: '0.02em',
        }}>
          You are cordially invited…
        </p>
        <p style={{
          fontFamily: "'Pinyon Script', cursive",
          fontSize: 36,
          color: C.bronze,
          margin: '8px 0',
        }}>
          Emma & Emmanuel
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PHASE 3 — THE FULL INVITATION
// ═══════════════════════════════════════════════════════

// ── Chapter I: The Letter ─────────────────────────────
function ChapterLetter() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      background: C.cream,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      overflow: 'hidden',
    }}>
      {/* Paper texture background */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
        <Image src="/assets/ee/ea-paper-texture.png" alt="" fill
          style={{ objectFit: 'cover', mixBlendMode: 'multiply' }} />
      </div>

      <div style={{ position: 'relative', maxWidth: 600, width: '100%' }}>
        <Monogram size={80} />

        {/* Couple names */}
        <h1 style={{
          fontFamily: "'Pinyon Script', cursive",
          fontSize: 'clamp(52px, 8vw, 80px)',
          color: C.bronze,
          textAlign: 'center',
          lineHeight: 1.1,
          margin: '0 0 8px',
        }}>
          Emma & Emmanuel
        </h1>

        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontWeight: 200,
          fontSize: 11,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: C.sage,
          textAlign: 'center',
          margin: '0 0 40px',
        }}>
          September 14, 2027 · Umbria, Italy
        </p>

        <RoseDivider />

        {/* Letter body */}
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 18,
          lineHeight: 1.85,
          color: C.ink,
          textAlign: 'center',
        }}>
          <p style={{ margin: '0 0 24px' }}>
            With hearts full of joy and gratitude,<br />
            we invite you to witness<br />
            the beginning of our forever.
          </p>
          <p style={{ margin: '0 0 24px', opacity: 0.8, fontSize: 16 }}>
            Together with their families,
          </p>
          <p style={{
            fontFamily: "'Pinyon Script', cursive",
            fontSize: 42,
            fontStyle: 'normal',
            color: C.bronze,
            margin: '0 0 24px',
            lineHeight: 1.2,
          }}>
            Emma Valentina Moretti<br />
            <span style={{ fontSize: 22, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: C.sage }}>
              &amp;
            </span><br />
            Emmanuel Jean-Pierre Laurent
          </p>
          <p style={{ margin: '0 0 8px', opacity: 0.8 }}>
            request the honour of your presence<br />
            at their wedding celebration
          </p>
        </div>

        <RoseDivider />

        {/* Date / time block */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 200,
            fontSize: 11,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: C.sage,
            margin: '0 0 8px',
          }}>
            Saturday
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 42,
            fontWeight: 300,
            color: C.bronze,
            margin: '0 0 4px',
          }}>
            14 · IX · MMXXVII
          </p>
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 200,
            fontSize: 13,
            letterSpacing: '0.25em',
            color: C.ink,
            opacity: 0.65,
          }}>
            Four o'clock in the afternoon
          </p>
        </div>

        {/* RSVP call-to-action */}
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <button
            onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'transparent',
              border: `1px solid ${C.bronze}`,
              color: C.forest,
              padding: '16px 48px',
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              fontSize: 11,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'inline-block',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = C.forest;
              e.currentTarget.style.color = C.cream;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = C.forest;
            }}
          >
            ✦ &nbsp; Reply to our Invitation
          </button>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 13,
            color: C.ink,
            opacity: 0.5,
            margin: '12px 0 0',
            letterSpacing: '0.05em',
          }}>
            Kindly reply before August 1, 2027
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Chapter II: Our Story — Polaroid Timeline ─────────
function ChapterStory() {
  const polaroids = [
    {
      src: '/assets/ee/ea-polaroid-01.png',
      caption: 'How We Met',
      note: 'A rainy afternoon, two cups of espresso, one conversation that never ended.',
      rotate: '-2.5deg',
    },
    {
      src: '/assets/ee/ea-polaroid-02.png',
      caption: 'Our First Trip',
      note: 'We got lost in the cobblestone streets of Rome and found each other instead.',
      rotate: '1.8deg',
    },
    {
      src: '/assets/ee/ea-polaroid-04.png',
      caption: 'The Proposal',
      note: 'Under Umbrian stars, Emmanuel asked the question that changed everything.',
      rotate: '-1.2deg',
    },
  ];

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      background: C.forest,
      padding: '100px 24px',
      overflow: 'hidden',
    }}>
      {/* Ambient candle bg */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image src="/assets/ee/ea-petals-bg.png" alt="" fill
          style={{ objectFit: 'cover', opacity: 0.18 }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom, ${C.forest}99, ${C.forest}CC)`,
        }} />
      </div>

      <PetalsVideo opacity={0.12} />

      <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto' }}>
        {/* Section heading */}
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 200,
            fontSize: 10,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: C.sage,
            margin: '0 0 12px',
          }}>Chapter II</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(36px, 6vw, 54px)',
            fontWeight: 300,
            color: C.cream,
            margin: 0,
          }}>
            Our Story
          </h2>
          <div style={{
            width: 48, height: 1,
            background: C.bronze,
            margin: '20px auto 0',
            opacity: 0.6,
          }} />
        </div>

        {/* Polaroids */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 40,
        }}>
          {polaroids.map((p, i) => (
            <div key={i} style={{
              transform: `rotate(${p.rotate})`,
              transition: 'transform 0.3s ease',
              cursor: 'default',
            }}>
              <div style={{
                background: '#FAFAF5',
                padding: '14px 14px 48px',
                boxShadow: '0 12px 48px rgba(0,0,0,0.45)',
                width: 220,
              }}>
                <div style={{ position: 'relative', width: '100%', paddingBottom: '120%', overflow: 'hidden' }}>
                  <Image
                    src={p.src}
                    alt={p.caption}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic',
                    fontSize: 15,
                    color: C.ink,
                    margin: '0 0 6px',
                    fontWeight: 400,
                  }}>
                    {p.caption}
                  </p>
                  <p style={{
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 300,
                    fontSize: 10,
                    color: '#666',
                    lineHeight: 1.5,
                    margin: 0,
                  }}>
                    {p.note}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Chapter III: The Venue ────────────────────────────
function ChapterVenue() {
  return (
    <section style={{
      position: 'relative',
      background: C.cream,
      overflow: 'hidden',
    }}>
      {/* Paper texture */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.12 }}>
        <Image src="/assets/ee/ea-paper-texture.png" alt="" fill
          style={{ objectFit: 'cover', mixBlendMode: 'multiply' }} />
      </div>

      {/* Venue hero image */}
      <div style={{ position: 'relative', width: '100%', height: '70vh', overflow: 'hidden' }}>
        <Image
          src="/assets/ee/ea-venue.png"
          alt="Villa Umbria at dusk"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 40%, rgba(240,232,216,0.9) 100%)',
        }} />
        {/* Venue name badge */}
        <div style={{
          position: 'absolute', bottom: 40, left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          background: 'rgba(240,232,216,0.92)',
          backdropFilter: 'blur(8px)',
          padding: '20px 40px',
          borderTop: `1px solid ${C.bronze}55`,
          borderBottom: `1px solid ${C.bronze}55`,
        }}>
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 200,
            fontSize: 10,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: C.sage,
            margin: '0 0 6px',
          }}>The Venue</p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 28,
            fontWeight: 300,
            color: C.forest,
            margin: 0,
          }}>
            Villa Romantica, Umbria
          </p>
        </div>
      </div>

      {/* Venue details + map */}
      <div style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 0,
        maxWidth: 960,
        margin: '0 auto',
        padding: '72px 32px',
      }}>
        {/* Details column */}
        <div style={{ padding: '0 24px' }}>
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 200,
            fontSize: 10,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: C.sage,
            margin: '0 0 24px',
          }}>Chapter III</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 42,
            fontWeight: 300,
            color: C.forest,
            margin: '0 0 24px',
            lineHeight: 1.2,
          }}>
            Where We<br />Celebrate
          </h2>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 16,
            lineHeight: 1.8,
            color: C.ink,
            opacity: 0.8,
            margin: '0 0 32px',
          }}>
            Nestled in the rolling hills of Umbria, Villa Romantica has sheltered centuries of
            celebrations beneath its ancient stone archways. As the sun sets over the olive groves,
            it becomes the most romantic place on earth.
          </p>
          <div style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 300,
            fontSize: 13,
            lineHeight: 2,
            color: C.forest,
            opacity: 0.75,
            letterSpacing: '0.05em',
          }}>
            <p style={{ margin: 0 }}>Via della Rosa 14</p>
            <p style={{ margin: 0 }}>Montefalco, Umbria 06036</p>
            <p style={{ margin: 0 }}>Italia</p>
          </div>
        </div>

        {/* Map illustration */}
        <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '75%',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: `0 8px 40px rgba(30,48,40,0.2)`,
            border: `1px solid ${C.bronze}44`,
          }}>
            <Image
              src="/assets/ee/ea-map.png"
              alt="Illustrated map of Umbria"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Chapter IV: The Programme ──────────────────────────
function ChapterProgramme() {
  const events = [
    { time: '4:00 PM', name: 'Ceremony', note: 'In the chapel garden beneath the olive trees' },
    { time: '5:30 PM', name: 'Aperitivo', note: 'Prosecco & cicchetti on the terrace' },
    { time: '7:00 PM', name: 'Dinner', note: 'A ten-course Umbrian feast in the great hall' },
    { time: '9:30 PM', name: 'Dancing', note: 'Until the stars say goodnight' },
    { time: '11:59 PM', name: 'Fireworks', note: 'Over the valley — our gift to you' },
  ];

  return (
    <section style={{
      position: 'relative',
      background: C.forest,
      padding: '100px 24px',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image src="/assets/ee/ea-candle-bg.png" alt="" fill
          style={{ objectFit: 'cover', opacity: 0.22 }} />
        <div style={{ position: 'absolute', inset: 0, background: `${C.forest}CC` }} />
      </div>

      <PetalsVideo opacity={0.10} />

      <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 200,
            fontSize: 10,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: C.sage,
            margin: '0 0 12px',
          }}>Chapter IV</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 48,
            fontWeight: 300,
            color: C.cream,
            margin: 0,
          }}>
            The Programme
          </h2>
        </div>

        <div style={{ borderLeft: `1px solid ${C.bronze}44`, paddingLeft: 32 }}>
          {events.map((e, i) => (
            <div key={i} style={{
              position: 'relative',
              marginBottom: 40,
              paddingBottom: 40,
              borderBottom: i < events.length - 1 ? `1px solid ${C.bronze}22` : 'none',
            }}>
              {/* Timeline dot */}
              <div style={{
                position: 'absolute', left: -37, top: 8,
                width: 10, height: 10,
                borderRadius: '50%',
                background: C.bronze,
                boxShadow: `0 0 0 4px ${C.forest}, 0 0 0 5px ${C.bronze}55`,
              }} />
              <p style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 200,
                fontSize: 10,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: C.bronze,
                margin: '0 0 6px',
              }}>
                {e.time}
              </p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 24,
                fontWeight: 400,
                color: C.cream,
                margin: '0 0 6px',
              }}>
                {e.name}
              </p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 15,
                color: C.sage,
                margin: 0,
                lineHeight: 1.5,
              }}>
                {e.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Chapter V: Details ────────────────────────────────
function ChapterDetails() {
  return (
    <section style={{
      position: 'relative',
      background: C.cream,
      padding: '100px 24px',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.12 }}>
        <Image src="/assets/ee/ea-paper-texture.png" alt="" fill
          style={{ objectFit: 'cover', mixBlendMode: 'multiply' }} />
      </div>

      <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <Monogram size={56} />
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 200,
            fontSize: 10,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: C.sage,
            margin: '0 0 12px',
          }}>Chapter V</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 48,
            fontWeight: 300,
            color: C.forest,
            margin: 0,
          }}>
            The Details
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 40,
        }}>
          {[
            {
              label: 'Dress Code',
              detail: 'Black Tie',
              note: 'Gentlemen are encouraged to wear a white rose buttonhole. Ladies, garden florals are welcome.',
            },
            {
              label: 'Accommodation',
              detail: 'Il Borghetto Estate',
              note: 'A block of rooms has been reserved for our guests. Please mention "Emma & Emmanuel" when booking.',
            },
            {
              label: 'Gifts',
              detail: 'Your presence is our gift',
              note: 'If you wish to contribute, a honeymoon fund has been arranged. Details enclosed.',
            },
            {
              label: 'Languages',
              detail: 'English · Français · Italiano',
              note: 'The ceremony will be conducted in English with readings in French and Italian.',
            },
          ].map((item, i) => (
            <div key={i} style={{
              borderTop: `1px solid ${C.bronze}44`,
              paddingTop: 24,
            }}>
              <p style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 200,
                fontSize: 10,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: C.sage,
                margin: '0 0 8px',
              }}>
                {item.label}
              </p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 20,
                fontWeight: 400,
                color: C.forest,
                margin: '0 0 10px',
              }}>
                {item.detail}
              </p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 14,
                color: C.ink,
                opacity: 0.7,
                lineHeight: 1.6,
                margin: 0,
              }}>
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Floating RSVP Button ──────────────────────────────
function FloatingRSVP() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  const scrollToRSVP = () => {
    document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToRSVP}
      aria-label="RSVP now"
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '14px 26px',
        background: C.bronze,
        color: C.cream,
        border: 'none',
        borderRadius: 0,
        fontFamily: "'Jost', sans-serif",
        fontWeight: 300,
        fontSize: 11,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease, background 0.25s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = C.forest)}
      onMouseLeave={e => (e.currentTarget.style.background = C.bronze)}
    >
      {/* Wax seal mini icon */}
      <span style={{ fontSize: 14, lineHeight: 1 }}>✦</span>
      RSVP Now
    </button>
  );
}

// ── Chapter VI: RSVP ──────────────────────────────────
// ── Shared input styles (defined once, passed as props) ─
const inputSx: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: `1px solid ${C.bronze}66`,
  padding: '10px 0',
  fontFamily: "'Cormorant Garamond', serif",
  fontStyle: 'italic',
  fontSize: 17,
  color: C.ink,
  outline: 'none',
  boxSizing: 'border-box',
};

const labelSx: React.CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontWeight: 200,
  fontSize: 10,
  letterSpacing: '0.35em',
  textTransform: 'uppercase' as const,
  color: C.sage,
  display: 'block',
  marginBottom: 4,
};

const COUPLE_SLUG = 'emma-and-emmanuel';

type RSVPStep = 'lookup' | 'form' | 'done';

function ChapterRSVP() {
  const [step, setStep]               = useState<RSVPStep>('lookup');
  const [lookupData, setLookupData]   = useState<Record<string, unknown> | null>(null);

  // Lookup fields
  const [code, setCode]               = useState('');
  const [lookupName, setLookupName]   = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  // RSVP form fields
  const [guestName, setGuestName]     = useState('');
  const [email, setEmail]             = useState('');
  const [attending, setAttending]     = useState<'attending' | 'declined' | null>(null);
  const [mealChoiceId, setMealChoiceId] = useState('');
  const [dietary, setDietary]         = useState('');
  const [message, setMessage]         = useState('');
  const [hasPlusOne, setHasPlusOne]   = useState(false);
  const [plusOneName, setPlusOneName] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // ── Lookup guest ────────────────────────────────────
  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() && !lookupName.trim()) {
      setLookupError('Please enter your invitation code or full name.');
      return;
    }
    setLookupLoading(true);
    setLookupError('');
    try {
      const res  = await fetch('/api/rsvp/lookup', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          coupleSlug:     COUPLE_SLUG,
          invitationCode: code.trim()      || undefined,
          guestName:      !code.trim() ? lookupName.trim() : undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? 'Not found');
      if (!data.couple) throw new Error('Event not found. Please contact the couple.');

      setLookupData(data);

      // Pre-fill from guest record or existing RSVP
      const g = data.guest as Record<string,string> | undefined;
      const r = data.existingRsvp as Record<string,string> | undefined;
      if (g) {
        setGuestName(`${g.first_name ?? ''} ${g.last_name ?? ''}`.trim());
        if (g.email) setEmail(g.email);
      } else if (lookupName.trim()) {
        setGuestName(lookupName.trim());
      }
      if (r) {
        setAttending(r.status === 'attending' ? 'attending' : 'declined');
        setDietary(r.dietary_notes ?? '');
        setMessage(r.message ?? '');
        if (r.meal_choice_id) setMealChoiceId(r.meal_choice_id);
      }
      setStep('form');
    } catch (err) {
      setLookupError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLookupLoading(false);
    }
  };

  // ── Submit RSVP ─────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attending) { setSubmitError('Please select whether you will attend.'); return; }
    setSubmitLoading(true);
    setSubmitError('');
    try {
      const plusOneParts = plusOneName.trim().split(' ');
      const body = {
        coupleSlug:     COUPLE_SLUG,
        invitationCode: code.trim() || undefined,
        guestName:      guestName.trim() || undefined,
        email:          email.trim()  || undefined,
        status:         attending,
        mealChoiceId:   mealChoiceId  || undefined,
        dietaryNotes:   dietary.trim()  || undefined,
        message:        message.trim()  || undefined,
        plusOne: hasPlusOne && plusOneName.trim() ? {
          firstName: plusOneParts[0],
          lastName:  plusOneParts.slice(1).join(' '),
        } : null,
      };
      const res = await fetch('/api/rsvp/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Submission failed');
      setStep('done');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // ── Meal choices from lookup ─────────────────────────
  const mealChoices = (lookupData?.mealChoices ?? []) as Array<{ id: string; name: string }>;

  // ── Shared section wrapper ───────────────────────────
  return (
    <section id="rsvp" style={{
      position: 'relative',
      minHeight: '100vh',
      background: C.forest,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image src="/assets/ee/ea-petals-bg.png" alt="" fill
          style={{ objectFit: 'cover', opacity: 0.15 }} />
        <div style={{ position: 'absolute', inset: 0, background: `${C.forest}CC` }} />
      </div>

      <PetalsVideo opacity={0.12} />

      <div style={{ position: 'relative', width: '100%', maxWidth: 520 }}>
        {/* Paper card */}
        <div style={{
          position: 'relative',
          background: C.cream,
          padding: '56px 48px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
          border: `1px solid ${C.bronze}33`,
          overflow: 'hidden',
        }}>
          {/* Paper texture overlay */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none' }}>
            <Image src="/assets/ee/ea-paper-texture.png" alt="" fill
              style={{ objectFit: 'cover', mixBlendMode: 'multiply' }} />
          </div>

          {/* ── STEP 1: Lookup ── */}
          {step === 'lookup' && (
            <div style={{ position: 'relative' }}>
              <Monogram size={52} />
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 36,
                fontWeight: 300,
                color: C.forest,
                textAlign: 'center',
                margin: '0 0 8px',
              }}>
                Your Reply
              </h2>
              <p style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 200,
                fontSize: 10,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: C.sage,
                textAlign: 'center',
                margin: '0 0 40px',
              }}>
                Kindly reply before August 1, 2027
              </p>

              <form onSubmit={handleLookup} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <label htmlFor="ee-code" style={labelSx}>Invitation code</label>
                  <input
                    id="ee-code"
                    type="text"
                    value={code}
                    onChange={e => { setCode(e.target.value.toUpperCase()); setLookupError(''); }}
                    placeholder="e.g. EE-2027"
                    style={inputSx}
                    autoComplete="off"
                  />
                </div>

                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic',
                    fontSize: 14,
                    color: C.ink,
                    opacity: 0.45,
                    letterSpacing: '0.1em',
                  }}>
                    — or —
                  </span>
                </div>

                <div>
                  <label htmlFor="ee-lookup-name" style={labelSx}>Your full name</label>
                  <input
                    id="ee-lookup-name"
                    type="text"
                    value={lookupName}
                    onChange={e => { setLookupName(e.target.value); setLookupError(''); }}
                    placeholder="As it appears on your invitation"
                    style={inputSx}
                    autoComplete="name"
                  />
                </div>

                {lookupError && (
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic',
                    fontSize: 14,
                    color: '#9B2335',
                    margin: 0,
                    textAlign: 'center',
                  }}>
                    {lookupError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={lookupLoading}
                  style={{
                    background: lookupLoading ? C.sage : C.forest,
                    color: C.cream,
                    border: 'none',
                    padding: '16px 40px',
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 300,
                    fontSize: 11,
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    cursor: lookupLoading ? 'wait' : 'pointer',
                    marginTop: 8,
                    transition: 'background 0.25s ease',
                  }}
                >
                  {lookupLoading ? 'Looking up…' : 'Find My Invitation'}
                </button>
              </form>
            </div>
          )}

          {/* ── STEP 2: RSVP Form ── */}
          {step === 'form' && (
            <div style={{ position: 'relative' }}>
              <Monogram size={52} />
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 36,
                fontWeight: 300,
                color: C.forest,
                textAlign: 'center',
                margin: '0 0 6px',
              }}>
                {guestName
                  ? <>Welcome, <em style={{ color: C.bronze }}>{guestName.split(' ')[0]}</em></>
                  : 'Your Reply'}
              </h2>
              {!(lookupData?.found) && (
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontSize: 13,
                  color: C.bronze,
                  textAlign: 'center',
                  margin: '0 0 8px',
                  opacity: 0.75,
                }}>
                  You're not on our guest list yet — you may still reply below.
                </p>
              )}
              <p style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 200,
                fontSize: 10,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: C.sage,
                textAlign: 'center',
                margin: '0 0 36px',
              }}>
                Kindly reply before August 1, 2027
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>

                {/* Name + email — shown for anonymous guests */}
                {!lookupData?.guest && (
                  <div>
                    <label htmlFor="ee-gname" style={labelSx}>Your Name</label>
                    <input
                      id="ee-gname"
                      type="text"
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                      placeholder="Full name"
                      style={inputSx}
                      required
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="ee-email" style={labelSx}>Email for confirmation</label>
                  <input
                    id="ee-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={inputSx}
                  />
                </div>

                {/* Attending toggle */}
                <div>
                  <label style={labelSx}>Will you attend?</label>
                  <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                    {(['attending', 'declined'] as const).map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAttending(val)}
                        style={{
                          flex: 1,
                          padding: '12px 0',
                          background: attending === val ? C.forest : 'transparent',
                          border: `1px solid ${attending === val ? C.forest : C.bronze}66`,
                          color: attending === val ? C.cream : C.forest,
                          fontFamily: "'Jost', sans-serif",
                          fontWeight: 300,
                          fontSize: 11,
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          transition: 'all 0.25s ease',
                        }}
                      >
                        {val === 'attending' ? 'Joyfully Accepts' : 'Regretfully Declines'}
                      </button>
                    ))}
                  </div>
                </div>

                {attending === 'attending' && (
                  <>
                    {/* Meal choice */}
                    {mealChoices.length > 0 && (
                      <div>
                        <label htmlFor="ee-meal" style={labelSx}>Meal preference</label>
                        <select
                          id="ee-meal"
                          value={mealChoiceId}
                          onChange={e => setMealChoiceId(e.target.value)}
                          style={{
                            ...inputSx,
                            fontStyle: 'normal',
                            appearance: 'none',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23B87348' strokeWidth='1.5' fill='none'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 4px center',
                          }}
                        >
                          <option value="">Select…</option>
                          {mealChoices.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Dietary */}
                    <div>
                      <label htmlFor="ee-dietary" style={labelSx}>Dietary requirements</label>
                      <input
                        id="ee-dietary"
                        type="text"
                        value={dietary}
                        onChange={e => setDietary(e.target.value)}
                        placeholder="Any allergies or preferences"
                        style={inputSx}
                      />
                    </div>

                    {/* Plus one */}
                    <div>
                      <label style={labelSx}>Will you bring a guest?</label>
                      <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                        {([true, false] as const).map(val => (
                          <button
                            key={String(val)}
                            type="button"
                            onClick={() => setHasPlusOne(val)}
                            style={{
                              flex: 1,
                              padding: '10px 0',
                              background: hasPlusOne === val ? C.bronze : 'transparent',
                              border: `1px solid ${hasPlusOne === val ? C.bronze : C.bronze}55`,
                              color: hasPlusOne === val ? C.cream : C.forest,
                              fontFamily: "'Jost', sans-serif",
                              fontWeight: 300,
                              fontSize: 11,
                              letterSpacing: '0.15em',
                              textTransform: 'uppercase',
                              cursor: 'pointer',
                              transition: 'all 0.25s ease',
                            }}
                          >
                            {val ? 'Yes, plus one' : 'No, just me'}
                          </button>
                        ))}
                      </div>
                      {hasPlusOne && (
                        <input
                          type="text"
                          value={plusOneName}
                          onChange={e => setPlusOneName(e.target.value)}
                          placeholder="Guest's full name"
                          style={{ ...inputSx, marginTop: 16 }}
                        />
                      )}
                    </div>
                  </>
                )}

                {/* Message */}
                <div>
                  <label htmlFor="ee-message" style={labelSx}>A note for Emma & Emmanuel</label>
                  <textarea
                    id="ee-message"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Share your wishes…"
                    rows={3}
                    style={{
                      ...inputSx,
                      resize: 'none',
                      borderBottom: 'none',
                      border: `1px solid ${C.bronze}44`,
                      padding: '12px',
                    }}
                  />
                </div>

                {submitError && (
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic',
                    fontSize: 14,
                    color: '#9B2335',
                    margin: 0,
                    textAlign: 'center',
                  }}>
                    {submitError}
                  </p>
                )}

                <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => setStep('lookup')}
                    style={{
                      background: 'transparent',
                      color: C.sage,
                      border: `1px solid ${C.sage}55`,
                      padding: '14px 20px',
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 300,
                      fontSize: 10,
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading || !attending}
                    style={{
                      flex: 1,
                      background: submitLoading || !attending ? C.sage : C.forest,
                      color: C.cream,
                      border: 'none',
                      padding: '14px 24px',
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 300,
                      fontSize: 11,
                      letterSpacing: '0.3em',
                      textTransform: 'uppercase',
                      cursor: submitLoading || !attending ? 'not-allowed' : 'pointer',
                      transition: 'background 0.25s ease',
                    }}
                  >
                    {submitLoading ? 'Sending…' : 'Send My Reply'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── STEP 3: Confirmation ── */}
          {step === 'done' && (
            <div style={{ position: 'relative', textAlign: 'center', padding: '20px 0' }}>
              <Monogram size={64} />
              <p style={{
                fontFamily: "'Pinyon Script', cursive",
                fontSize: 56,
                color: C.bronze,
                margin: '8px 0 4px',
              }}>
                {attending === 'attending' ? 'Merci' : 'À bientôt'}
              </p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 18,
                color: C.forest,
                lineHeight: 1.75,
                margin: '20px 0 0',
                opacity: 0.85,
              }}>
                {guestName ? `${guestName.split(' ')[0]}, your reply` : 'Your reply'} has been received with joy.
              </p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 16,
                color: C.ink,
                opacity: 0.6,
                lineHeight: 1.65,
                margin: '12px 0 0',
              }}>
                {attending === 'attending'
                  ? 'We cannot wait to celebrate with you in Umbria.\nA confirmation has been sent to your email.'
                  : 'You will be missed dearly, and held in our hearts throughout the celebration.'}
              </p>
              {attending === 'attending' && email && (
                <p style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 200,
                  fontSize: 10,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: C.sage,
                  margin: '28px 0 0',
                }}>
                  Confirmation sent to {email}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Chapter VII: Closing ──────────────────────────────
function ChapterClosing() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '60vh',
      background: C.cream,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.14 }}>
        <Image src="/assets/ee/ea-paper-texture.png" alt="" fill
          style={{ objectFit: 'cover', mixBlendMode: 'multiply' }} />
      </div>

      {/* Botanical rose decorative */}
      <div style={{
        position: 'absolute', right: 40, bottom: 40,
        opacity: 0.12,
        width: 200, height: 200,
      }}>
        <Image src="/assets/ee/ea-botanical-rose.png" alt="" fill
          style={{ objectFit: 'contain', mixBlendMode: 'multiply' }} />
      </div>
      <div style={{
        position: 'absolute', left: 40, top: 40,
        opacity: 0.10,
        width: 160, height: 160,
        transform: 'scaleX(-1)',
      }}>
        <Image src="/assets/ee/ea-botanical-rose.png" alt="" fill
          style={{ objectFit: 'contain', mixBlendMode: 'multiply' }} />
      </div>

      <div style={{ position: 'relative', textAlign: 'center', maxWidth: 480 }}>
        <Monogram size={88} />
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 20,
          color: C.ink,
          lineHeight: 1.8,
          opacity: 0.75,
          margin: '0 0 28px',
        }}>
          "In all the world, there is no heart for me like yours.<br />
          In all the world, there is no love for you like mine."
        </p>
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontWeight: 200,
          fontSize: 10,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: C.sage,
          margin: '0 0 32px',
        }}>
          — Maya Angelou
        </p>

        <RoseDivider />

        <p style={{
          fontFamily: "'Pinyon Script', cursive",
          fontSize: 44,
          color: C.bronze,
          margin: '24px 0 8px',
        }}>
          Emma & Emmanuel
        </p>
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontWeight: 200,
          fontSize: 10,
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: C.sage,
        }}>
          14 · IX · MMXXVII · Umbria
        </p>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
// ROOT PAGE — STATE MACHINE
// ═══════════════════════════════════════════════════════
type Phase = 'entrance' | 'opening' | 'invitation';

export default function EmmaAndEmmanuel() {
  const [phase, setPhase] = useState<Phase>('entrance');

  const handleSealBroken = useCallback(() => {
    setPhase('opening');
  }, []);

  const handleOpeningComplete = useCallback(() => {
    setPhase('invitation');
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <FontLoader />
      <Grain />

      {/* Phase: Entrance */}
      {phase === 'entrance' && (
        <EnvelopeEntrance onOpen={handleSealBroken} />
      )}

      {/* Phase: Opening animation */}
      {phase === 'opening' && (
        <EnvelopeOpening onComplete={handleOpeningComplete} />
      )}

      {/* Phase: Full invitation */}
      {phase === 'invitation' && (
        <main style={{ overflowX: 'hidden' }}>
          <FloatingRSVP />
          <ChapterLetter />
          <ChapterStory />
          <ChapterVenue />
          <ChapterProgramme />
          <ChapterDetails />
          <ChapterRSVP />
          <ChapterClosing />
        </main>
      )}
    </>
  );
}
