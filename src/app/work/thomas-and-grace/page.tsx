'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

/* ═══════════════════════════════════════════════════════
   THOMAS & GRACE — A MEDITERRANEAN SUMMER
   Cobalt · Lemon Gold · Warm Cream · Toile de Jouy
   Cormorant Garamond · Pinyon Script · Jost
═══════════════════════════════════════════════════════ */

const C = {
  cobalt:     '#2456C4',
  cobaltDark: '#1A3E9E',
  navy:       '#0D1840',
  lemon:      '#F0D030',
  lemonGold:  '#C8A020',
  cream:      '#F5EDE0',
  porcelain:  '#FAFAF8',
  blue:       '#4470D0',
  ink:        '#0A1628',
};

// ── Google Fonts ──────────────────────────────────────
function FontLoader() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Pinyon+Script&family=Jost:wght@200;300;400&display=swap';
    document.head.appendChild(link);
  }, []);
  return null;
}

// ── Film grain overlay ────────────────────────────────
function Grain() {
  return (
    <div aria-hidden style={{
      position: 'fixed', inset: 0, zIndex: 9990, pointerEvents: 'none', opacity: 0.022,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: '180px',
    }} />
  );
}

// ══════════════════════════════════════════════════════
// LUXURY PARTICLE CANVAS
// Floating cobalt & gold dust — Mediterranean pollen
// ══════════════════════════════════════════════════════
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    type P = {
      x: number; y: number; size: number; opacity: number;
      vy: number; vx: number; sOff: number; sFreq: number; sAmp: number;
      color: string; t: number;
    };

    const COLORS = [C.cobalt, C.cobalt, C.lemonGold, C.cobalt, C.lemon];
    const particles: P[] = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.3 + 0.4,
      opacity: Math.random() * 0.11 + 0.03,
      vy: -(Math.random() * 0.20 + 0.05),
      vx: (Math.random() - 0.5) * 0.05,
      sOff: Math.random() * Math.PI * 2,
      sFreq: Math.random() * 0.006 + 0.002,
      sAmp: Math.random() * 0.4 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      t: Math.random() * 600,
    }));

    let id: number;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.t++;
        p.y += p.vy;
        p.x += p.vx + Math.sin(p.t * p.sFreq + p.sOff) * p.sAmp * 0.018;
        if (p.y < -8) { p.y = canvas.height + 8; p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      id = requestAnimationFrame(tick);
    };
    tick();

    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none' }} />;
}

// ── Ambient birds video loop ──────────────────────────
function BirdsVideo({ opacity = 0.09 }: { opacity?: number }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity }}>
      <video autoPlay muted loop playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        src="/assets/tg/tg-birds-fly.mp4"
      />
    </div>
  );
}

// ── Ornamental lemon divider ──────────────────────────
function LemonDivider({ light = false }: { light?: boolean }) {
  const lineColor = light ? 'rgba(255,255,255,0.2)' : `${C.lemonGold}55`;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '28px 0' }}>
      <div style={{ flex: 1, height: '0.5px', background: `linear-gradient(to right, transparent, ${lineColor})` }} />
      <svg width="26" height="18" viewBox="0 0 26 18" fill="none" aria-hidden>
        <ellipse cx="13" cy="10" rx="10" ry="7" fill={light ? 'rgba(240,208,48,0.6)' : C.lemon} />
        <ellipse cx="13" cy="10" rx="10" ry="7" stroke={light ? 'rgba(200,160,32,0.5)' : C.lemonGold} strokeWidth="0.5" />
        <path d="M13 3 C16 1 20 1 22 3.5" stroke={light ? 'rgba(36,86,196,0.5)' : C.cobalt} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </svg>
      <div style={{ flex: 1, height: '0.5px', background: `linear-gradient(to left, transparent, ${lineColor})` }} />
    </div>
  );
}

// ── Thin ornamental rule ──────────────────────────────
function Rule({ color = C.cobalt, opacity = 0.2 }: { color?: string; opacity?: number }) {
  return <div style={{ width: '100%', height: '0.5px', background: color, opacity, margin: '0' }} />;
}

// ── Corner marks (luxury detail) ─────────────────────
function CornerMarks({ color = C.cobalt, size = 16 }: { color?: string; size?: number }) {
  const s = { position: 'absolute' as const, width: size, height: size };
  const line = { position: 'absolute' as const, background: color, opacity: 0.3 };
  return (
    <>
      <div style={{ ...s, top: 0, left: 0 }}>
        <div style={{ ...line, top: 0, left: 0, width: size, height: 0.5 }} />
        <div style={{ ...line, top: 0, left: 0, width: 0.5, height: size }} />
      </div>
      <div style={{ ...s, top: 0, right: 0 }}>
        <div style={{ ...line, top: 0, right: 0, width: size, height: 0.5 }} />
        <div style={{ ...line, top: 0, right: 0, width: 0.5, height: size }} />
      </div>
      <div style={{ ...s, bottom: 0, left: 0 }}>
        <div style={{ ...line, bottom: 0, left: 0, width: size, height: 0.5 }} />
        <div style={{ ...line, bottom: 0, left: 0, width: 0.5, height: size }} />
      </div>
      <div style={{ ...s, bottom: 0, right: 0 }}>
        <div style={{ ...line, bottom: 0, right: 0, width: size, height: 0.5 }} />
        <div style={{ ...line, bottom: 0, right: 0, width: 0.5, height: size }} />
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════
// PHASE 1 — CINEMATIC VIDEO ENTRANCE
// The invitation video plays as the opening experience.
// It auto-advances after it ends or after 10 seconds.
// ══════════════════════════════════════════════════════
function VideoEntrance({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fading, setFading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const doneRef = useRef(false);

  const complete = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setFading(true);
    setTimeout(onComplete, 1400);
  }, [onComplete]);

  useEffect(() => {
    const t1 = setTimeout(() => setShowHint(true), 1800);
    const t2 = setTimeout(complete, 10000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [complete]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: C.navy,
      opacity: fading ? 0 : 1,
      transition: 'opacity 1.4s cubic-bezier(0.4,0,0.2,1)',
      overflow: 'hidden',
    }}>
      {/* Invitation video — full bleed */}
      <video
        ref={videoRef}
        autoPlay muted playsInline
        onEnded={complete}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        src="/assets/tg/tg-save-date.mp4"
      />

      {/* Vignette for depth */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, ${C.navy}50 100%)`,
      }} />

      {/* Bottom whisper text */}
      <div style={{
        position: 'absolute', bottom: 52, left: 0, right: 0,
        textAlign: 'center',
        opacity: showHint ? 0.38 : 0,
        transition: 'opacity 2s ease',
        pointerEvents: 'none',
      }}>
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontWeight: 200,
          fontSize: 9,
          letterSpacing: '0.55em',
          textTransform: 'uppercase',
          color: '#fff',
          margin: 0,
        }}>
          Thomas &amp; Grace · June 21, 2027
        </p>
      </div>

      {/* Skip — barely visible, appears after 3s */}
      <button
        onClick={complete}
        style={{
          position: 'absolute', bottom: 28, right: 28,
          background: 'none',
          border: '1px solid rgba(255,255,255,0.15)',
          color: 'rgba(255,255,255,0.28)',
          padding: '7px 16px',
          fontFamily: "'Jost', sans-serif",
          fontWeight: 200,
          fontSize: 9,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          opacity: showHint ? 1 : 0,
          transition: 'opacity 1.5s ease, border-color 0.3s ease, color 0.3s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.28)';
        }}
      >
        Skip
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// CHAPTER I — THE INVITATION
// ══════════════════════════════════════════════════════
function ChapterInvitation() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      background: C.porcelain,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '100px 24px',
      overflow: 'hidden',
    }}>
      {/* Botanical toile watermark */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image src="/assets/tg/tg-birds.png" alt="" fill
          style={{ objectFit: 'cover', opacity: 0.055 }} />
      </div>
      {/* Animated ambience */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
        <video autoPlay muted loop playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          src="/assets/tg/tg-birds-fly.mp4"
        />
      </div>

      <div style={{ position: 'relative', maxWidth: 560, width: '100%', textAlign: 'center' }}>
        {/* Outer frame */}
        <div style={{
          position: 'relative',
          border: `0.5px solid ${C.cobalt}18`,
          padding: '56px 40px',
        }}>
          <CornerMarks />

          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 200,
            fontSize: 9,
            letterSpacing: '0.55em',
            textTransform: 'uppercase',
            color: C.cobalt,
            margin: '0 0 28px',
            opacity: 0.55,
          }}>
            Chapter I &nbsp;·&nbsp; The Invitation
          </p>

          {/* Names */}
          <h1 style={{
            fontFamily: "'Pinyon Script', cursive",
            fontSize: 'clamp(62px, 9vw, 90px)',
            color: C.cobaltDark,
            margin: '0 0 6px',
            lineHeight: 1.0,
          }}>
            Thomas &amp; Grace
          </h1>

          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 200,
            fontSize: 10,
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: C.blue,
            opacity: 0.5,
            margin: '0 0 32px',
          }}>
            June 21, 2027 &nbsp;·&nbsp; Côte d'Azur, France
          </p>

          <LemonDivider />

          {/* Formal invitation text */}
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 19,
            lineHeight: 1.9,
            color: C.ink,
            margin: '0 0 8px',
          }}>
            <p style={{ margin: '0 0 20px', opacity: 0.7 }}>
              With hearts full of joy,<br />
              we invite you to celebrate<br />
              the beginning of our forever.
            </p>
            <p style={{ margin: '0 0 20px', opacity: 0.5, fontSize: 14 }}>
              Together with their families,
            </p>
            <p style={{
              fontFamily: "'Pinyon Script', cursive",
              fontSize: 38,
              fontStyle: 'normal',
              color: C.cobaltDark,
              margin: '0 0 20px',
              lineHeight: 1.3,
            }}>
              Thomas Laurent Beaumont<br />
              <span style={{ fontSize: 18, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: C.blue, opacity: 0.55 }}>&amp;</span><br />
              Grace Éloise Fontaine
            </p>
            <p style={{ opacity: 0.7, margin: '0 0 6px' }}>
              request the pleasure of your company<br />
              at their wedding celebration
            </p>
          </div>

          <LemonDivider />

          {/* Date */}
          <div style={{ margin: '20px 0 36px' }}>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 200,
              fontSize: 9,
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: C.blue,
              opacity: 0.5,
              margin: '0 0 10px',
            }}>Sunday</p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 46,
              fontWeight: 300,
              color: C.cobaltDark,
              margin: '0 0 6px',
              letterSpacing: '0.06em',
            }}>21 · VI · MMXXVII</p>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 200,
              fontSize: 11,
              letterSpacing: '0.2em',
              color: C.ink,
              opacity: 0.42,
            }}>
              Four o'clock in the afternoon
            </p>
          </div>

          <Rule />

          <div style={{ marginTop: 36 }}>
            <button
              onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'transparent',
                border: `0.5px solid ${C.cobalt}`,
                color: C.cobaltDark,
                padding: '15px 52px',
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300,
                fontSize: 10,
                letterSpacing: '0.45em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.35s ease',
                display: 'inline-block',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = C.cobalt;
                e.currentTarget.style.color = C.porcelain;
                e.currentTarget.style.letterSpacing = '0.5em';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = C.cobaltDark;
                e.currentTarget.style.letterSpacing = '0.45em';
              }}
            >
              ✦ &nbsp; Reply to our Invitation
            </button>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 12,
              color: C.ink,
              opacity: 0.35,
              margin: '14px 0 0',
              letterSpacing: '0.04em',
            }}>
              Kindly reply before May 1, 2027
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// CHAPTER II — THE ANIMATED WORLD (tg-animate.mp4)
// ══════════════════════════════════════════════════════
function ChapterAnimatedWorld() {
  return (
    <section style={{
      position: 'relative',
      background: C.cobaltDark,
      overflow: 'hidden',
      minHeight: '65vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Animated invite video as full background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <video autoPlay muted loop playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
          src="/assets/tg/tg-animate.mp4"
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom, ${C.cobaltDark}70, ${C.cobaltDark}B0)`,
        }} />
      </div>

      {/* Vertical lemon thread */}
      <div style={{
        position: 'absolute', top: 0, left: '50%',
        width: '0.5px', height: '100%',
        background: `linear-gradient(to bottom, transparent, ${C.lemon}33, transparent)`,
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', textAlign: 'center', padding: '80px 24px' }}>
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontWeight: 200,
          fontSize: 9,
          letterSpacing: '0.55em',
          textTransform: 'uppercase',
          color: C.lemon,
          margin: '0 0 20px',
          opacity: 0.6,
        }}>
          Chapter II &nbsp;·&nbsp; The World
        </p>

        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(38px, 5.5vw, 60px)',
          fontWeight: 300,
          color: C.porcelain,
          margin: '0 0 16px',
          lineHeight: 1.15,
        }}>
          A Garden in Motion
        </h2>

        <div style={{
          width: '0.5px', height: 52,
          background: `linear-gradient(to bottom, ${C.lemon}99, transparent)`,
          margin: '0 auto 22px',
        }} />

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 18,
          lineHeight: 1.85,
          color: C.porcelain,
          opacity: 0.65,
          maxWidth: 480,
          margin: '0 auto',
        }}>
          The world of Thomas &amp; Grace — painted in cobalt blue, lemon gold, and the
          wing-beat of hummingbirds — was built to move.
        </p>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// CHAPTER III — THEIR STORY
// ══════════════════════════════════════════════════════
function ChapterStory() {
  return (
    <section style={{
      position: 'relative',
      background: C.cream,
      overflow: 'hidden',
    }}>
      {/* Watermark */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04 }}>
        <Image src="/assets/tg/tg-birds.png" alt="" fill style={{ objectFit: 'cover' }} />
      </div>

      <div style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        maxWidth: 1100,
        margin: '0 auto',
      }}>
        {/* Image — full column height */}
        <div style={{ position: 'relative', minHeight: 580 }}>
          <Image src="/assets/tg/tg-proposal.png" alt="The proposal"
            fill style={{ objectFit: 'cover', objectPosition: 'center' }} />
          {/* Inner vignette */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to right, transparent 65%, ${C.cream}CC 100%)`,
          }} />
          {/* Pull quote overlay */}
          <div style={{
            position: 'absolute', bottom: 40, left: 32,
            maxWidth: 220,
          }}>
            <p style={{
              fontFamily: "'Pinyon Script', cursive",
              fontSize: 26,
              color: C.porcelain,
              margin: 0,
              lineHeight: 1.3,
              textShadow: `0 2px 12px ${C.cobaltDark}80`,
            }}>
              She said yes before he had finished asking.
            </p>
          </div>
        </div>

        {/* Text column */}
        <div style={{
          padding: '88px 56px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 200,
            fontSize: 9,
            letterSpacing: '0.55em',
            textTransform: 'uppercase',
            color: C.cobalt,
            margin: '0 0 20px',
            opacity: 0.55,
          }}>
            Chapter III &nbsp;·&nbsp; How It Began
          </p>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(38px, 5vw, 54px)',
            fontWeight: 300,
            color: C.cobaltDark,
            margin: '0 0 24px',
            lineHeight: 1.15,
          }}>
            Two Strangers<br />in a Lemon Grove
          </h2>

          <LemonDivider />

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 18,
            lineHeight: 1.9,
            color: C.ink,
            opacity: 0.78,
            margin: '0 0 20px',
          }}>
            They found each other beneath the lemon trees of the Côte d'Azur — two strangers
            who became inseparable before the afternoon turned golden.
          </p>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 16,
            lineHeight: 1.85,
            color: C.ink,
            opacity: 0.58,
            margin: '0 0 20px',
          }}>
            Seven years later, beneath the same sky, Thomas knelt in a courtyard of blue
            flowers and yellow citrus and asked Grace the only question that mattered.
          </p>

          <Rule color={C.cobalt} opacity={0.12} />

          <div style={{ marginTop: 28 }}>
            <p style={{
              fontFamily: "'Pinyon Script', cursive",
              fontSize: 40,
              color: C.cobaltDark,
              margin: 0,
              lineHeight: 1.2,
            }}>
              Thomas &amp; Grace
            </p>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 200,
              fontSize: 9,
              letterSpacing: '0.38em',
              textTransform: 'uppercase',
              color: C.blue,
              opacity: 0.45,
              margin: '6px 0 0',
            }}>
              Engaged · Côte d'Azur · 2025
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// CHAPTER IV — THE BOTANICAL WORLD
// ══════════════════════════════════════════════════════
function ChapterBotanical() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      background: C.navy,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      padding: '100px 24px',
    }}>
      {/* Full botanical pattern */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image src="/assets/tg/tg-birds.png" alt="" fill
          style={{ objectFit: 'cover', opacity: 0.28 }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, ${C.navy}EE 0%, ${C.cobaltDark}C8 50%, ${C.navy}EE 100%)`,
        }} />
      </div>
      {/* Animated birds pass */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.13 }}>
        <video autoPlay muted loop playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          src="/assets/tg/tg-birds-fly.mp4"
        />
      </div>

      {/* Thin horizontal rules */}
      <div style={{ position: 'absolute', top: 80, left: 0, right: 0, height: '0.5px', background: `${C.lemon}18` }} />
      <div style={{ position: 'absolute', bottom: 80, left: 0, right: 0, height: '0.5px', background: `${C.lemon}18` }} />

      <div style={{ position: 'relative', maxWidth: 660, textAlign: 'center' }}>
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontWeight: 200,
          fontSize: 9,
          letterSpacing: '0.55em',
          textTransform: 'uppercase',
          color: C.lemon,
          margin: '0 0 20px',
          opacity: 0.55,
        }}>
          Chapter IV &nbsp;·&nbsp; A World in Blue &amp; Gold
        </p>

        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(42px, 6vw, 62px)',
          fontWeight: 300,
          color: C.porcelain,
          margin: '0 0 20px',
          lineHeight: 1.15,
        }}>
          The Mediterranean<br />Made Visible
        </h2>

        <div style={{
          width: '0.5px', height: 60,
          background: `linear-gradient(to bottom, ${C.lemon}AA, transparent)`,
          margin: '0 auto 28px',
        }} />

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 19,
          lineHeight: 1.85,
          color: C.porcelain,
          opacity: 0.72,
          margin: '0 0 18px',
        }}>
          Their invitation was painted in the colours of the South of France —
          cobalt blue botanicals, hummingbirds in perpetual flight,
          and lemons heavy with summer.
        </p>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 16,
          lineHeight: 1.8,
          color: C.porcelain,
          opacity: 0.42,
          margin: '0 0 48px',
        }}>
          Wherever guests open the invitation in the world, they arrive in Provence.
        </p>

        {/* Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 0,
          borderTop: `0.5px solid ${C.lemon}22`,
          borderBottom: `0.5px solid ${C.lemon}22`,
          padding: '32px 0',
        }}>
          {[
            { number: '120', label: 'Guests' },
            { number: '9', label: 'Countries' },
            { number: '4', label: 'Months' },
          ].map((stat, i) => (
            <div key={i} style={{
              flex: 1, textAlign: 'center',
              borderRight: i < 2 ? `0.5px solid ${C.lemon}18` : 'none',
              padding: '0 16px',
            }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 48,
                fontWeight: 300,
                color: C.lemon,
                margin: '0 0 4px',
                lineHeight: 1,
              }}>{stat.number}</p>
              <p style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 200,
                fontSize: 9,
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: C.porcelain,
                opacity: 0.38,
                margin: 0,
              }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// CHAPTER V — THE VENUE
// ══════════════════════════════════════════════════════
function ChapterVenue() {
  return (
    <section style={{ position: 'relative', background: C.porcelain, overflow: 'hidden' }}>
      {/* Hero image */}
      <div style={{ position: 'relative', width: '100%', height: '75vh', overflow: 'hidden' }}>
        <Image src="/assets/tg/tg-vineyard.png" alt="The vineyard dinner"
          fill style={{ objectFit: 'cover', objectPosition: 'center 22%' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom, transparent 30%, ${C.porcelain}E0 100%)`,
        }} />
        {/* Venue badge */}
        <div style={{
          position: 'absolute', bottom: 44, left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(250,250,248,0.92)',
            backdropFilter: 'blur(12px)',
            padding: '18px 48px',
            border: `0.5px solid ${C.cobalt}22`,
            position: 'relative',
          }}>
            <CornerMarks color={C.cobalt} size={10} />
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 200,
              fontSize: 9,
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: C.blue,
              opacity: 0.55,
              margin: '0 0 6px',
            }}>The Venue</p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 26,
              fontWeight: 300,
              color: C.cobaltDark,
              margin: 0,
            }}>
              Domaine de Provence, Côte d'Azur
            </p>
          </div>
        </div>
      </div>

      {/* Details below image */}
      <div style={{
        position: 'relative',
        maxWidth: 820,
        margin: '0 auto',
        padding: '60px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 48,
        alignItems: 'start',
      }}>
        <div>
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 200,
            fontSize: 9,
            letterSpacing: '0.55em',
            textTransform: 'uppercase',
            color: C.cobalt,
            margin: '0 0 14px',
            opacity: 0.5,
          }}>Chapter V &nbsp;·&nbsp; Where We Celebrate</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 44,
            fontWeight: 300,
            color: C.cobaltDark,
            margin: '0 0 20px',
            lineHeight: 1.15,
          }}>
            The Garden<br />at Sunset
          </h2>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 17,
            lineHeight: 1.88,
            color: C.ink,
            opacity: 0.72,
            margin: 0,
          }}>
            Nestled among the vineyards of the Côte d'Azur, the Domaine de Provence
            has hosted summer celebrations for three centuries. As the sun sets over
            the terraces, the stone walls turn the colour of honey.
          </p>
        </div>
        <div style={{ paddingTop: 4 }}>
          <Rule color={C.cobalt} opacity={0.14} />
          <div style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 200,
            fontSize: 12,
            lineHeight: 2.2,
            color: C.cobaltDark,
            opacity: 0.55,
            letterSpacing: '0.04em',
            padding: '20px 0',
          }}>
            <p style={{ margin: 0 }}>Route des Vignes</p>
            <p style={{ margin: 0 }}>06400 Cannes</p>
            <p style={{ margin: 0 }}>Côte d'Azur, France</p>
          </div>
          <Rule color={C.cobalt} opacity={0.14} />
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// CHAPTER VI — THE COUPLE (Editorial Portrait)
// ══════════════════════════════════════════════════════
function ChapterCouple() {
  return (
    <section style={{
      position: 'relative',
      background: C.navy,
      overflow: 'hidden',
      minHeight: '95vh',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    }}>
      {/* Portrait — left */}
      <div style={{ position: 'relative', minHeight: 540 }}>
        <Image src="/assets/tg/tg-couple.png" alt="Thomas & Grace"
          fill style={{ objectFit: 'cover', objectPosition: 'center top' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to right, transparent 55%, ${C.navy} 100%)`,
        }} />
      </div>

      {/* Copy — right */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '80px 52px',
        position: 'relative',
      }}>
        {/* Thin vertical accent line */}
        <div style={{
          position: 'absolute', left: 0, top: '15%', bottom: '15%',
          width: '0.5px',
          background: `linear-gradient(to bottom, transparent, ${C.lemon}44, transparent)`,
        }} />

        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontWeight: 200,
          fontSize: 9,
          letterSpacing: '0.55em',
          textTransform: 'uppercase',
          color: C.lemon,
          margin: '0 0 20px',
          opacity: 0.55,
        }}>
          Chapter VI &nbsp;·&nbsp; The Couple
        </p>

        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(38px, 5vw, 56px)',
          fontWeight: 300,
          color: C.porcelain,
          margin: '0 0 28px',
          lineHeight: 1.15,
        }}>
          Bold. Beautiful.<br />Entirely Their Own.
        </h2>

        <div style={{ width: 40, height: '0.5px', background: C.lemon, opacity: 0.4, marginBottom: 28 }} />

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 18,
          lineHeight: 1.88,
          color: C.porcelain,
          opacity: 0.68,
          margin: '0 0 22px',
        }}>
          Thomas is an architect who builds houses he hopes will outlast him.
          Grace is a writer who gives words to the things people feel but cannot say.
        </p>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 15,
          lineHeight: 1.8,
          color: C.porcelain,
          opacity: 0.42,
          margin: '0 0 40px',
        }}>
          Together they wanted something that felt like them — a little bold,
          a little beautiful, entirely their own.
        </p>

        <Rule color={C.lemon} opacity={0.2} />

        <p style={{
          fontFamily: "'Pinyon Script', cursive",
          fontSize: 44,
          color: C.lemon,
          margin: '28px 0 4px',
          lineHeight: 1.1,
          opacity: 0.85,
        }}>
          Thomas &amp; Grace
        </p>
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontWeight: 200,
          fontSize: 9,
          letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color: C.porcelain,
          opacity: 0.3,
          margin: 0,
        }}>
          June 21, 2027
        </p>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// CHAPTER VII — LE PROGRAMME
// ══════════════════════════════════════════════════════
function ChapterProgramme() {
  const events = [
    { time: '4:00 PM', name: 'Cérémonie', note: 'Under the lemon trees of the estate garden' },
    { time: '5:30 PM', name: 'Apéritif', note: 'Rosé, pastis & Provençal bites on the terrace' },
    { time: '7:30 PM', name: 'Dîner', note: 'A long table beneath fairy lights in the vineyard' },
    { time: '10:00 PM', name: 'Dancing', note: 'Until the Mediterranean stars say goodnight' },
    { time: 'Minuit', name: 'Fireworks', note: 'Over the sea — midnight light for you' },
  ];

  return (
    <section style={{
      position: 'relative',
      background: C.cobalt,
      padding: '100px 24px',
      overflow: 'hidden',
    }}>
      {/* Subtle pattern */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.07 }}>
        <Image src="/assets/tg/tg-birds.png" alt="" fill style={{ objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: C.cobalt, opacity: 0.88 }} />
      </div>
      {/* Top + bottom rules */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '0.5px', background: `${C.lemon}18` }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '0.5px', background: `${C.lemon}18` }} />

      <div style={{ position: 'relative', maxWidth: 580, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 200,
            fontSize: 9,
            letterSpacing: '0.55em',
            textTransform: 'uppercase',
            color: C.lemon,
            margin: '0 0 18px',
            opacity: 0.55,
          }}>Chapter VII &nbsp;·&nbsp; Le Programme</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(42px, 6vw, 58px)',
            fontWeight: 300,
            color: C.porcelain,
            margin: 0,
          }}>
            The Day
          </h2>
          <div style={{ width: '0.5px', height: 48, background: `linear-gradient(to bottom, ${C.lemon}88, transparent)`, margin: '22px auto 0' }} />
        </div>

        <div style={{ borderLeft: `0.5px solid ${C.lemon}28`, paddingLeft: 36 }}>
          {events.map((e, i) => (
            <div key={i} style={{
              position: 'relative',
              marginBottom: i < events.length - 1 ? 44 : 0,
              paddingBottom: i < events.length - 1 ? 44 : 0,
              borderBottom: i < events.length - 1 ? `0.5px solid ${C.lemon}12` : 'none',
            }}>
              <div style={{
                position: 'absolute', left: -41, top: 9,
                width: 8, height: 8,
                borderRadius: '50%',
                background: C.lemon,
                boxShadow: `0 0 0 3px ${C.cobalt}, 0 0 0 4.5px ${C.lemon}44`,
              }} />
              <p style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 200,
                fontSize: 9,
                letterSpacing: '0.38em',
                textTransform: 'uppercase',
                color: C.lemon,
                opacity: 0.65,
                margin: '0 0 6px',
              }}>{e.time}</p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 26,
                fontWeight: 300,
                color: C.porcelain,
                margin: '0 0 5px',
              }}>{e.name}</p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 14,
                color: C.porcelain,
                opacity: 0.42,
                margin: 0,
                lineHeight: 1.6,
              }}>{e.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// CHAPTER VIII — THE DETAILS
// ══════════════════════════════════════════════════════
function ChapterDetails() {
  const details = [
    {
      label: 'Dress Code',
      detail: 'Garden Cocktail',
      note: 'Ladies are encouraged to wear florals or white. Gentlemen, linen suits are welcome in the summer heat.',
    },
    {
      label: 'Accommodation',
      detail: 'Hôtel Les Orangers',
      note: 'A block of rooms has been reserved in the village. Mention "Thomas & Grace" when booking.',
    },
    {
      label: 'Gifts',
      detail: 'Your presence is our gift',
      note: 'If you wish to contribute, a honeymoon fund has been created. Details enclosed with your invitation.',
    },
    {
      label: 'Languages',
      detail: 'English · Français',
      note: 'The ceremony will be held in both English and French, for all who have journeyed to join us.',
    },
  ];

  return (
    <section style={{
      position: 'relative',
      background: C.cream,
      padding: '100px 24px',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04 }}>
        <Image src="/assets/tg/tg-pattern.png" alt="" fill style={{ objectFit: 'cover' }} />
      </div>

      <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 200,
            fontSize: 9,
            letterSpacing: '0.55em',
            textTransform: 'uppercase',
            color: C.cobalt,
            margin: '0 0 16px',
            opacity: 0.5,
          }}>Chapter VIII &nbsp;·&nbsp; The Details</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(40px, 5.5vw, 54px)',
            fontWeight: 300,
            color: C.cobaltDark,
            margin: 0,
          }}>
            Everything You Need
          </h2>
          <div style={{ width: 40, height: '0.5px', background: C.cobalt, opacity: 0.25, margin: '22px auto 0' }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 44,
        }}>
          {details.map((item, i) => (
            <div key={i} style={{
              borderTop: `0.5px solid ${C.cobalt}28`,
              paddingTop: 24,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0,
                width: 24, height: '0.5px',
                background: C.cobalt,
                opacity: 0.5,
              }} />
              <p style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 200,
                fontSize: 9,
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: C.blue,
                opacity: 0.55,
                margin: '0 0 8px',
              }}>{item.label}</p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 22,
                fontWeight: 400,
                color: C.cobaltDark,
                margin: '0 0 10px',
              }}>{item.detail}</p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 14,
                color: C.ink,
                opacity: 0.62,
                lineHeight: 1.7,
                margin: 0,
              }}>{item.note}</p>
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
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);
  return (
    <button
      onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}
      aria-label="RSVP"
      style={{
        position: 'fixed', bottom: 32, right: 32, zIndex: 9000,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '13px 24px',
        background: C.cobalt,
        color: C.porcelain,
        border: 'none',
        fontFamily: "'Jost', sans-serif",
        fontWeight: 200,
        fontSize: 10,
        letterSpacing: '0.38em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        boxShadow: `0 8px 36px ${C.cobalt}55`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease, background 0.3s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = C.cobaltDark; }}
      onMouseLeave={e => { e.currentTarget.style.background = C.cobalt; }}
    >
      <span style={{ fontSize: 11 }}>✦</span>
      RSVP
    </button>
  );
}

// ── Shared RSVP input styles ──────────────────────────
const inputSx: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: `0.5px solid ${C.cobalt}44`,
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
  fontSize: 9,
  letterSpacing: '0.42em',
  textTransform: 'uppercase' as const,
  color: C.blue,
  display: 'block',
  marginBottom: 4,
  opacity: 0.65,
};

const COUPLE_SLUG = 'thomas-and-grace';
type RSVPStep = 'lookup' | 'form' | 'done';

// ══════════════════════════════════════════════════════
// CHAPTER IX — RSVP
// ══════════════════════════════════════════════════════
function ChapterRSVP() {
  const [step, setStep]                   = useState<RSVPStep>('lookup');
  const [lookupData, setLookupData]       = useState<Record<string, unknown> | null>(null);
  const [code, setCode]                   = useState('');
  const [lookupName, setLookupName]       = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError]     = useState('');
  const [guestName, setGuestName]         = useState('');
  const [email, setEmail]                 = useState('');
  const [attending, setAttending]         = useState<'attending' | 'declined' | null>(null);
  const [mealChoiceId, setMealChoiceId]   = useState('');
  const [dietary, setDietary]             = useState('');
  const [message, setMessage]             = useState('');
  const [hasPlusOne, setHasPlusOne]       = useState(false);
  const [plusOneName, setPlusOneName]     = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError]     = useState('');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() && !lookupName.trim()) { setLookupError('Please enter your invitation code or full name.'); return; }
    setLookupLoading(true); setLookupError('');
    try {
      const res = await fetch('/api/rsvp/lookup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coupleSlug: COUPLE_SLUG, invitationCode: code.trim() || undefined, guestName: !code.trim() ? lookupName.trim() : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Not found');
      if (!data.couple) throw new Error('Event not found. Please contact the couple.');
      setLookupData(data);
      const g = data.guest as Record<string, string> | undefined;
      const r = data.existingRsvp as Record<string, string> | undefined;
      if (g) { setGuestName(`${g.first_name ?? ''} ${g.last_name ?? ''}`.trim()); if (g.email) setEmail(g.email); }
      else if (lookupName.trim()) setGuestName(lookupName.trim());
      if (r) { setAttending(r.status === 'attending' ? 'attending' : 'declined'); setDietary(r.dietary_notes ?? ''); setMessage(r.message ?? ''); if (r.meal_choice_id) setMealChoiceId(r.meal_choice_id); }
      setStep('form');
    } catch (err) { setLookupError(err instanceof Error ? err.message : 'Something went wrong.'); }
    finally { setLookupLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attending) { setSubmitError('Please select whether you will attend.'); return; }
    setSubmitLoading(true); setSubmitError('');
    try {
      const plusOneParts = plusOneName.trim().split(' ');
      const res = await fetch('/api/rsvp/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coupleSlug: COUPLE_SLUG, invitationCode: code.trim() || undefined,
          guestName: guestName.trim() || undefined, email: email.trim() || undefined,
          status: attending, mealChoiceId: mealChoiceId || undefined,
          dietaryNotes: dietary.trim() || undefined, message: message.trim() || undefined,
          plusOne: hasPlusOne && plusOneName.trim() ? { firstName: plusOneParts[0], lastName: plusOneParts.slice(1).join(' ') } : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Submission failed');
      setStep('done');
    } catch (err) { setSubmitError(err instanceof Error ? err.message : 'Something went wrong.'); }
    finally { setSubmitLoading(false); }
  };

  const mealChoices = (lookupData?.mealChoices ?? []) as Array<{ id: string; name: string }>;

  return (
    <section id="rsvp" style={{
      position: 'relative',
      minHeight: '100vh',
      background: C.cobaltDark,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '80px 24px',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image src="/assets/tg/tg-birds.png" alt="" fill style={{ objectFit: 'cover', opacity: 0.11 }} />
        <div style={{ position: 'absolute', inset: 0, background: `${C.cobaltDark}CC` }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.07 }}>
        <video autoPlay muted loop playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          src="/assets/tg/tg-birds-fly.mp4"
        />
      </div>
      {/* Top rule */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '0.5px', background: `${C.lemon}18` }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: 520 }}>
        {/* Luxury card */}
        <div style={{
          background: C.porcelain,
          padding: '60px 52px',
          boxShadow: `0 32px 100px rgba(13,24,64,0.6)`,
          border: `0.5px solid ${C.cobalt}18`,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <CornerMarks color={C.cobalt} size={14} />

          {/* Birds watermark inside card */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none' }}>
            <Image src="/assets/tg/tg-birds.png" alt="" fill style={{ objectFit: 'cover' }} />
          </div>

          {/* STEP 1: Lookup */}
          {step === 'lookup' && (
            <div style={{ position: 'relative' }}>
              <p style={{
                fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9,
                letterSpacing: '0.5em', textTransform: 'uppercase',
                color: C.cobalt, opacity: 0.45, textAlign: 'center', margin: '0 0 10px',
              }}>Chapter IX</p>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                fontSize: 44, fontWeight: 300, color: C.cobaltDark, textAlign: 'center', margin: '0 0 8px',
              }}>Your Reply</h2>
              <p style={{
                fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9,
                letterSpacing: '0.35em', textTransform: 'uppercase',
                color: C.blue, opacity: 0.45, textAlign: 'center', margin: '0 0 40px',
              }}>Kindly reply before May 1, 2027</p>

              <form onSubmit={handleLookup} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <label htmlFor="tg-code" style={labelSx}>Invitation code</label>
                  <input id="tg-code" type="text" value={code}
                    onChange={e => { setCode(e.target.value.toUpperCase()); setLookupError(''); }}
                    placeholder="e.g. TG-2027" style={inputSx} autoComplete="off" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 13, color: C.ink, opacity: 0.32 }}>— or —</span>
                </div>
                <div>
                  <label htmlFor="tg-lname" style={labelSx}>Your full name</label>
                  <input id="tg-lname" type="text" value={lookupName}
                    onChange={e => { setLookupName(e.target.value); setLookupError(''); }}
                    placeholder="As it appears on your invitation" style={inputSx} autoComplete="name" />
                </div>
                {lookupError && (
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 14, color: '#9B2335', margin: 0, textAlign: 'center' }}>{lookupError}</p>
                )}
                <button type="submit" disabled={lookupLoading} style={{
                  background: lookupLoading ? C.blue : C.cobaltDark,
                  color: C.porcelain, border: 'none', padding: '15px 40px',
                  fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 10,
                  letterSpacing: '0.4em', textTransform: 'uppercase',
                  cursor: lookupLoading ? 'wait' : 'pointer', marginTop: 8,
                  transition: 'background 0.3s ease',
                }}>
                  {lookupLoading ? 'Looking up…' : 'Find My Invitation'}
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: Form */}
          {step === 'form' && (
            <div style={{ position: 'relative' }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                fontSize: 38, fontWeight: 300, color: C.cobaltDark, textAlign: 'center', margin: '0 0 6px',
              }}>
                {guestName ? <>Welcome, <em style={{ color: C.cobalt }}>{guestName.split(' ')[0]}</em></> : 'Your Reply'}
              </h2>
              {!(lookupData?.found) && (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 13, color: C.cobalt, textAlign: 'center', margin: '0 0 8px', opacity: 0.65 }}>
                  You may still reply below.
                </p>
              )}
              <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.blue, opacity: 0.45, textAlign: 'center', margin: '0 0 36px' }}>
                Kindly reply before May 1, 2027
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
                {!lookupData?.guest && (
                  <div>
                    <label htmlFor="tg-gname" style={labelSx}>Your Name</label>
                    <input id="tg-gname" type="text" value={guestName}
                      onChange={e => setGuestName(e.target.value)} placeholder="Full name" style={inputSx} required />
                  </div>
                )}
                <div>
                  <label htmlFor="tg-email" style={labelSx}>Email for confirmation</label>
                  <input id="tg-email" type="email" value={email}
                    onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputSx} />
                </div>
                <div>
                  <label style={labelSx}>Will you attend?</label>
                  <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                    {(['attending', 'declined'] as const).map(val => (
                      <button key={val} type="button" onClick={() => setAttending(val)} style={{
                        flex: 1, padding: '12px 0',
                        background: attending === val ? C.cobaltDark : 'transparent',
                        border: `0.5px solid ${attending === val ? C.cobaltDark : C.cobalt}55`,
                        color: attending === val ? C.porcelain : C.cobaltDark,
                        fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9,
                        letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer',
                        transition: 'all 0.25s ease',
                      }}>
                        {val === 'attending' ? 'Joyfully Accepts' : 'Regretfully Declines'}
                      </button>
                    ))}
                  </div>
                </div>
                {attending === 'attending' && (
                  <>
                    {mealChoices.length > 0 && (
                      <div>
                        <label htmlFor="tg-meal" style={labelSx}>Meal preference</label>
                        <select id="tg-meal" value={mealChoiceId} onChange={e => setMealChoiceId(e.target.value)} style={{ ...inputSx, cursor: 'pointer' }}>
                          <option value="">Select a menu</option>
                          {mealChoices.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                      </div>
                    )}
                    <div>
                      <label htmlFor="tg-dietary" style={labelSx}>Dietary requirements</label>
                      <input id="tg-dietary" type="text" value={dietary} onChange={e => setDietary(e.target.value)} placeholder="Allergies, vegan, etc." style={inputSx} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <input type="checkbox" id="tg-plusone" checked={hasPlusOne} onChange={e => setHasPlusOne(e.target.checked)}
                        style={{ width: 14, height: 14, accentColor: C.cobalt, cursor: 'pointer', flexShrink: 0 }} />
                      <label htmlFor="tg-plusone" style={{ ...labelSx, marginBottom: 0, cursor: 'pointer' }}>I will bring a guest</label>
                    </div>
                    {hasPlusOne && (
                      <div>
                        <label htmlFor="tg-plusone-name" style={labelSx}>Guest's full name</label>
                        <input id="tg-plusone-name" type="text" value={plusOneName} onChange={e => setPlusOneName(e.target.value)} placeholder="Full name" style={inputSx} />
                      </div>
                    )}
                  </>
                )}
                <div>
                  <label htmlFor="tg-msg" style={labelSx}>A note for Thomas &amp; Grace</label>
                  <textarea id="tg-msg" value={message} onChange={e => setMessage(e.target.value)}
                    placeholder="A word for the couple…" rows={3} style={{ ...inputSx, resize: 'vertical', borderBottom: 'none', border: `0.5px solid ${C.cobalt}33`, padding: '10px 12px' }} />
                </div>
                {submitError && (
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 14, color: '#9B2335', margin: 0, textAlign: 'center' }}>{submitError}</p>
                )}
                <button type="submit" disabled={submitLoading} style={{
                  background: submitLoading ? C.blue : C.cobaltDark,
                  color: C.porcelain, border: 'none', padding: '16px 40px',
                  fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 10,
                  letterSpacing: '0.4em', textTransform: 'uppercase',
                  cursor: submitLoading ? 'wait' : 'pointer', marginTop: 8,
                  transition: 'background 0.3s ease',
                }}>
                  {submitLoading ? 'Sending…' : 'Send My Reply'}
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: Done */}
          {step === 'done' && (
            <div style={{ position: 'relative', textAlign: 'center', padding: '24px 0' }}>
              <div style={{ marginBottom: 28 }}>
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
                  <circle cx="22" cy="22" r="20" stroke={C.cobalt} strokeWidth="0.5" />
                  <path d="M12 22 L19 29 L32 15" stroke={C.cobalt} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {attending === 'attending' ? (
                <>
                  <h3 style={{ fontFamily: "'Pinyon Script', cursive", fontSize: 56, color: C.cobaltDark, margin: '0 0 14px' }}>Merci</h3>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 17, color: C.ink, opacity: 0.7, lineHeight: 1.8, margin: '0 0 20px' }}>
                    We are overjoyed that you will join us in the garden. A confirmation will arrive in your inbox shortly.
                  </p>
                </>
              ) : (
                <>
                  <h3 style={{ fontFamily: "'Pinyon Script', cursive", fontSize: 56, color: C.cobaltDark, margin: '0 0 14px' }}>À bientôt</h3>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 17, color: C.ink, opacity: 0.7, lineHeight: 1.8, margin: '0 0 20px' }}>
                    We are sorry you cannot be with us. You will be in our hearts on the day, wherever you are.
                  </p>
                </>
              )}
              <LemonDivider />
              <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase', color: C.blue, opacity: 0.38, margin: 0 }}>
                Thomas &amp; Grace · June 21, 2027
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// ROOT — ORCHESTRATES ALL PHASES
// ══════════════════════════════════════════════════════
export default function ThomasAndGracePage() {
  const [phase, setPhase] = useState<'video' | 'invitation'>('video');

  return (
    <>
      <FontLoader />
      <Grain />

      {/* Phase 1 — Cinematic video entrance */}
      {phase === 'video' && (
        <VideoEntrance onComplete={() => setPhase('invitation')} />
      )}

      {/* Phase 2 — Full invitation experience */}
      {phase === 'invitation' && (
        <div style={{ position: 'relative' }}>
          <BirdsVideo opacity={0.07} />
          <ParticleCanvas />
          <ChapterInvitation />
          <ChapterAnimatedWorld />
          <ChapterStory />
          <ChapterBotanical />
          <ChapterVenue />
          <ChapterCouple />
          <ChapterProgramme />
          <ChapterDetails />
          <ChapterRSVP />
          <FloatingRSVP />
        </div>
      )}
    </>
  );
}
