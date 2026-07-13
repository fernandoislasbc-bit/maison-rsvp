'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/* ═══════════════════════════════════════════════════════
   OLIVER & DANIELLA — AN EMBOSSED TROPICAL GARDEN
   Blush · Rose · Mauve · Ivory Cream · Sage Green
   Cormorant Garamond · Pinyon Script · Jost
═══════════════════════════════════════════════════════ */

const C = {
  cream:      '#FBF4EE',
  ivory:      '#F7EAE0',
  blush:      '#F0C2CC',
  rose:       '#C8708A',
  roseDark:   '#9E4F6A',
  mauve:      '#BFA8B8',
  mauveLight: '#E0D4E0',
  sage:       '#ACBCA0',
  sageDark:   '#7E8E72',
  peach:      '#F2C0A2',
  ink:        '#3A2530',
  inkSoft:    '#6A4555',
  gold:       '#C49040',
  goldLight:  '#DDAD60',
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

// ── Film grain ────────────────────────────────────────
function Grain() {
  return (
    <div aria-hidden style={{
      position: 'fixed', inset: 0, zIndex: 9990, pointerEvents: 'none', opacity: 0.016,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: '180px',
    }} />
  );
}

// ══════════════════════════════════════════════════════
// ROSE PETAL PARTICLE CANVAS
// Gentle falling petals in blush, rose & mauve
// ══════════════════════════════════════════════════════
function PetalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    type Petal = {
      x: number; y: number; rx: number; ry: number; opacity: number;
      vy: number; vx: number; angle: number; vAngle: number;
      sOff: number; sFreq: number; sAmp: number; color: string; t: number;
    };

    const COLORS = [C.blush, C.rose, C.mauve, C.peach, C.mauveLight, C.blush];
    const petals: Petal[] = Array.from({ length: 58 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      rx: Math.random() * 2.2 + 0.8,
      ry: Math.random() * 1.2 + 0.4,
      opacity: Math.random() * 0.10 + 0.03,
      vy: Math.random() * 0.28 + 0.08,
      vx: (Math.random() - 0.5) * 0.06,
      angle: Math.random() * Math.PI * 2,
      vAngle: (Math.random() - 0.5) * 0.012,
      sOff: Math.random() * Math.PI * 2,
      sFreq: Math.random() * 0.005 + 0.002,
      sAmp: Math.random() * 0.45 + 0.15,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      t: Math.random() * 800,
    }));

    let id: number;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of petals) {
        p.t++;
        p.y += p.vy;
        p.angle += p.vAngle;
        p.x += p.vx + Math.sin(p.t * p.sFreq + p.sOff) * p.sAmp * 0.022;
        if (p.y > canvas.height + 10) { p.y = -10; p.x = Math.random() * canvas.width; }
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      id = requestAnimationFrame(tick);
    };
    tick();

    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none' }} />;
}

// ── Ornamental crescent divider ───────────────────────
function CrescentDivider({ light = false }: { light?: boolean }) {
  const lineColor = light ? 'rgba(255,255,255,0.15)' : `${C.rose}33`;
  const fill      = light ? 'rgba(255,255,255,0.5)' : C.mauve;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '26px 0' }}>
      <div style={{ flex: 1, height: '0.5px', background: `linear-gradient(to right, transparent, ${lineColor})` }} />
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path d="M14 9A6.5 6.5 0 1 1 5.2 4.2a5 5 0 0 0 8.8 4.8z" fill={fill} opacity="0.6" />
        <circle cx="12.5" cy="5" r="1" fill={fill} opacity="0.4" />
      </svg>
      <div style={{ flex: 1, height: '0.5px', background: `linear-gradient(to left, transparent, ${lineColor})` }} />
    </div>
  );
}

// ── Thin rule ─────────────────────────────────────────
function Rule({ color = C.rose, opacity = 0.18 }: { color?: string; opacity?: number }) {
  return <div style={{ width: '100%', height: '0.5px', background: color, opacity, margin: '0' }} />;
}

// ── Corner marks ──────────────────────────────────────
function CornerMarks({ color = C.rose, size = 14 }: { color?: string; size?: number }) {
  const s = { position: 'absolute' as const };
  const l = { position: 'absolute' as const, background: color, opacity: 0.28 };
  return (
    <>
      <div style={{ ...s, top: 0, left: 0, width: size, height: size }}>
        <div style={{ ...l, top: 0, left: 0, width: size, height: 0.5 }} />
        <div style={{ ...l, top: 0, left: 0, width: 0.5, height: size }} />
      </div>
      <div style={{ ...s, top: 0, right: 0, width: size, height: size }}>
        <div style={{ ...l, top: 0, right: 0, width: size, height: 0.5 }} />
        <div style={{ ...l, top: 0, right: 0, width: 0.5, height: size }} />
      </div>
      <div style={{ ...s, bottom: 0, left: 0, width: size, height: size }}>
        <div style={{ ...l, bottom: 0, left: 0, width: size, height: 0.5 }} />
        <div style={{ ...l, bottom: 0, left: 0, width: 0.5, height: size }} />
      </div>
      <div style={{ ...s, bottom: 0, right: 0, width: size, height: size }}>
        <div style={{ ...l, bottom: 0, right: 0, width: size, height: 0.5 }} />
        <div style={{ ...l, bottom: 0, right: 0, width: 0.5, height: size }} />
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════
// VIDEO ENTRANCE
// ══════════════════════════════════════════════════════
function VideoEntrance({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fading, setFading]   = useState(false);
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
    const t2 = setTimeout(complete, 12000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [complete]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: C.ivory,
      opacity: fading ? 0 : 1,
      transition: 'opacity 1.4s cubic-bezier(0.4,0,0.2,1)',
      overflow: 'hidden',
    }}>
      <video
        ref={videoRef}
        autoPlay muted playsInline
        onEnded={complete}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        src="/assets/od/od-video-entrance.mp4"
      />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 80% 80% at 50% 50%, transparent 35%, ${C.ivory}60 100%)`,
      }} />

      <div style={{
        position: 'absolute', bottom: 52, left: 0, right: 0, textAlign: 'center',
        opacity: showHint ? 0.4 : 0, transition: 'opacity 2s ease', pointerEvents: 'none',
      }}>
        <p style={{
          fontFamily: "'Jost', sans-serif", fontWeight: 200,
          fontSize: 9, letterSpacing: '0.55em', textTransform: 'uppercase',
          color: C.ink, margin: 0,
        }}>
          Oliver &amp; Daniella · August 15, 2026
        </p>
      </div>

      <button
        onClick={complete}
        style={{
          position: 'absolute', bottom: 28, right: 28,
          background: 'none', border: `1px solid ${C.rose}44`,
          color: `${C.ink}66`, padding: '7px 16px',
          fontFamily: "'Jost', sans-serif", fontWeight: 200,
          fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase',
          cursor: 'pointer', opacity: showHint ? 1 : 0, transition: 'opacity 1.5s ease',
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
      position: 'relative', minHeight: '100vh',
      background: C.cream,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '100px 24px', overflow: 'hidden',
    }}>
      {/* Frame watermark */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image src="/assets/od/od-frame-landscape.png" alt="" fill
          style={{ objectFit: 'cover', opacity: 0.07 }} />
      </div>

      <div style={{
        position: 'relative', maxWidth: 520, width: '100%', textAlign: 'center',
        padding: '64px 48px', border: `0.5px solid ${C.rose}28`,
        background: `${C.ivory}EE`, backdropFilter: 'blur(6px)',
      }}>
        <CornerMarks color={C.rose} size={18} />

        <p style={{
          fontFamily: "'Jost', sans-serif", fontWeight: 200,
          fontSize: 9, letterSpacing: '0.55em', textTransform: 'uppercase',
          color: C.inkSoft, margin: '0 0 18px', opacity: 0.55,
        }}>
          Together With Their Families
        </p>

        <CrescentDivider />

        <h1 style={{
          fontFamily: "'Pinyon Script', cursive",
          fontSize: 'clamp(52px, 8vw, 80px)',
          fontWeight: 400, color: C.roseDark,
          margin: '0 0 12px', lineHeight: 1.1,
        }}>
          Oliver
        </h1>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
          fontSize: 20, fontWeight: 300, color: C.mauve, margin: '0 0 12px',
          letterSpacing: '0.15em',
        }}>
          &amp;
        </p>
        <h1 style={{
          fontFamily: "'Pinyon Script', cursive",
          fontSize: 'clamp(52px, 8vw, 80px)',
          fontWeight: 400, color: C.roseDark,
          margin: '0 0 32px', lineHeight: 1.1,
        }}>
          Daniella
        </h1>

        <Rule color={C.rose} opacity={0.2} />

        <div style={{ margin: '28px 0' }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 15, fontWeight: 300, color: C.ink,
            lineHeight: 1.85, opacity: 0.78, margin: '0 0 18px',
          }}>
            Request the honour of your presence<br />at the celebration of their marriage
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
            fontSize: 22, fontWeight: 300, color: C.roseDark,
            margin: '0 0 10px',
          }}>
            Saturday, August 15, 2026
          </p>
          <p style={{
            fontFamily: "'Jost', sans-serif", fontWeight: 200,
            fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase',
            color: C.inkSoft, opacity: 0.5, margin: 0,
          }}>
            Kelowna · British Columbia
          </p>
        </div>

        <CrescentDivider />

        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
          fontSize: 13, color: C.sage, opacity: 0.7, margin: 0,
          letterSpacing: '0.08em',
        }}>
          Scroll to begin
        </p>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// CHAPTER II — OUR STORY
// ══════════════════════════════════════════════════════
function ChapterStory() {
  return (
    <section style={{
      position: 'relative',
      background: C.ivory,
      overflow: 'hidden',
      padding: '120px 24px',
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05 }}>
        <Image src="/assets/od/od-frame-portrait.png" alt="" fill style={{ objectFit: 'cover', objectPosition: 'center' }} />
      </div>

      <div style={{
        position: 'relative', maxWidth: 980, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: 80, alignItems: 'center',
      }}>
        {/* Portrait */}
        <div style={{
          position: 'relative',
          border: `0.5px solid ${C.rose}30`,
          boxShadow: `0 24px 80px ${C.rose}18`,
          overflow: 'hidden',
        }}>
          <CornerMarks color={C.rose} size={14} />
          <Image src="/assets/od/od-couple.png" alt="Oliver & Daniella"
            width={480} height={640} style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>

        {/* Text */}
        <div>
          <p style={{
            fontFamily: "'Jost', sans-serif", fontWeight: 200,
            fontSize: 9, letterSpacing: '0.55em', textTransform: 'uppercase',
            color: C.rose, margin: '0 0 20px', opacity: 0.65,
          }}>
            Chapter II &nbsp;·&nbsp; How It Began
          </p>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
            fontSize: 'clamp(36px, 4.5vw, 52px)', fontWeight: 300,
            color: C.roseDark, margin: '0 0 22px', lineHeight: 1.18,
          }}>
            A Love Story<br />Written in Bloom
          </h2>

          <CrescentDivider />

          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
            fontSize: 18, lineHeight: 1.9, color: C.ink, opacity: 0.76,
            margin: '0 0 18px',
          }}>
            They found each other in the way that only the best stories begin —
            quietly, unexpectedly, in a moment that neither of them would
            have thought to describe as extraordinary.
          </p>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
            fontSize: 15, lineHeight: 1.85, color: C.ink, opacity: 0.5,
            margin: '0 0 32px',
          }}>
            Years later, beneath a Positano sunset, surrounded by roses and
            the soft light of the sea, Oliver asked the only question that
            has ever mattered. Daniella said yes among the flowers.
          </p>

          <Rule color={C.rose} opacity={0.15} />

          <div style={{ marginTop: 28 }}>
            <p style={{
              fontFamily: "'Pinyon Script', cursive",
              fontSize: 42, color: C.roseDark, margin: 0, lineHeight: 1.2,
            }}>
              Oliver &amp; Daniella
            </p>
            <p style={{
              fontFamily: "'Jost', sans-serif", fontWeight: 200,
              fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase',
              color: C.sage, opacity: 0.55, margin: '6px 0 0',
            }}>
              Engaged · Positano · 2025
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// CHAPTER III — THE PROPOSAL
// ══════════════════════════════════════════════════════
function ChapterProposal() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden' }}>
        <Image src="/assets/od/od-proposal.png" alt="The Proposal — Positano" fill
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom, transparent 20%, ${C.cream}E8 100%)`,
        }} />

        <div style={{
          position: 'absolute', bottom: 44, left: '50%',
          transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap',
        }}>
          <div style={{
            display: 'inline-block',
            background: `${C.ivory}EE`, backdropFilter: 'blur(12px)',
            padding: '18px 52px', border: `0.5px solid ${C.rose}22`,
            position: 'relative',
          }}>
            <CornerMarks color={C.rose} size={10} />
            <p style={{
              fontFamily: "'Jost', sans-serif", fontWeight: 200,
              fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase',
              color: C.rose, opacity: 0.55, margin: '0 0 6px',
            }}>The Proposal</p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24, fontWeight: 300, color: C.roseDark, margin: 0,
            }}>
              Positano, Italy · Summer 2025
            </p>
          </div>
        </div>
      </div>

      <div style={{ background: C.cream, padding: '72px 24px' }}>
        <div style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center' }}>
          <p style={{
            fontFamily: "'Jost', sans-serif", fontWeight: 200,
            fontSize: 9, letterSpacing: '0.55em', textTransform: 'uppercase',
            color: C.rose, margin: '0 0 18px', opacity: 0.55,
          }}>
            Chapter III &nbsp;·&nbsp; The Question
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
            fontSize: 20, lineHeight: 1.88, color: C.ink, opacity: 0.72,
            margin: '0 0 16px',
          }}>
            &ldquo;He had planned it for months. Roses, candles, the sea below —
            and still, when the moment arrived, he forgot every word he had rehearsed.
            She said yes before he could find them.&rdquo;
          </p>
          <div style={{ width: 40, height: '0.5px', background: C.rose, opacity: 0.3, margin: '0 auto' }} />
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
      background: C.ink,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', padding: '100px 24px',
    }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image src="/assets/od/od-frame-portrait.png" alt="" fill
          style={{ objectFit: 'cover', objectPosition: 'center', opacity: 0.3 }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, ${C.ink}F0 0%, ${C.roseDark}60 50%, ${C.ink}EE 100%)`,
        }} />
      </div>

      {/* Ambient video */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.08 }}>
        <video autoPlay muted loop playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          src="/assets/od/od-video-ambient.mp4"
        />
      </div>

      <div style={{
        position: 'absolute', top: 80, left: 0, right: 0,
        height: '0.5px', background: `${C.blush}18`,
      }} />
      <div style={{
        position: 'absolute', bottom: 80, left: 0, right: 0,
        height: '0.5px', background: `${C.blush}18`,
      }} />

      <div style={{ position: 'relative', maxWidth: 640, textAlign: 'center' }}>
        <p style={{
          fontFamily: "'Jost', sans-serif", fontWeight: 200,
          fontSize: 9, letterSpacing: '0.55em', textTransform: 'uppercase',
          color: C.blush, margin: '0 0 20px', opacity: 0.55,
        }}>
          Chapter IV &nbsp;·&nbsp; A World in Blush &amp; Rose
        </p>

        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
          fontSize: 'clamp(42px, 6vw, 62px)', fontWeight: 300,
          color: C.ivory, margin: '0 0 20px', lineHeight: 1.15,
        }}>
          The Tropical<br />Garden Made Visible
        </h2>

        <div style={{
          width: '0.5px', height: 56,
          background: `linear-gradient(to bottom, ${C.blush}AA, transparent)`,
          margin: '0 auto 28px',
        }} />

        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
          fontSize: 19, lineHeight: 1.85, color: C.ivory, opacity: 0.68,
          margin: '0 0 18px',
        }}>
          Their invitation was carved in the colours of a garden at golden hour —
          blush palms, rose parrots in flight, and butterflies above a crescent moon.
        </p>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
          fontSize: 15, lineHeight: 1.8, color: C.ivory, opacity: 0.38,
          margin: '0 0 48px',
        }}>
          An embossed world that feels carved from ivory and rose quartz.
        </p>

        <div style={{
          display: 'flex', justifyContent: 'center', gap: 0,
          borderTop: `0.5px solid ${C.blush}22`,
          borderBottom: `0.5px solid ${C.blush}22`,
          padding: '32px 0',
        }}>
          {[
            { number: '80',  label: 'Guests' },
            { number: '5',   label: 'Countries' },
            { number: '3',   label: 'Months' },
          ].map((stat, i) => (
            <div key={i} style={{
              flex: 1, textAlign: 'center',
              borderRight: i < 2 ? `0.5px solid ${C.blush}18` : 'none',
              padding: '0 16px',
            }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 48, fontWeight: 300, color: C.blush,
                margin: '0 0 4px', lineHeight: 1,
              }}>{stat.number}</p>
              <p style={{
                fontFamily: "'Jost', sans-serif", fontWeight: 200,
                fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase',
                color: C.ivory, opacity: 0.35, margin: 0,
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
    <section style={{ position: 'relative', background: C.cream, overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: '100%', height: '72vh', overflow: 'hidden' }}>
        <Image src="/assets/od/od-greenhouse.png" alt="The venue — botanical greenhouse"
          fill style={{ objectFit: 'cover', objectPosition: 'center 25%' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom, transparent 28%, ${C.cream}E8 100%)`,
        }} />
        <div style={{
          position: 'absolute', bottom: 44, left: '50%',
          transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap',
        }}>
          <div style={{
            display: 'inline-block',
            background: `${C.ivory}EE`, backdropFilter: 'blur(12px)',
            padding: '18px 52px', border: `0.5px solid ${C.rose}22`,
            position: 'relative',
          }}>
            <CornerMarks color={C.rose} size={10} />
            <p style={{
              fontFamily: "'Jost', sans-serif", fontWeight: 200,
              fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase',
              color: C.rose, opacity: 0.55, margin: '0 0 6px',
            }}>The Venue</p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24, fontWeight: 300, color: C.roseDark, margin: 0,
            }}>
              A Botanical Garden, Kelowna
            </p>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto', padding: '60px 40px' }}>
        <p style={{
          fontFamily: "'Jost', sans-serif", fontWeight: 200,
          fontSize: 9, letterSpacing: '0.55em', textTransform: 'uppercase',
          color: C.rose, margin: '0 0 14px', opacity: 0.5,
        }}>Chapter V &nbsp;·&nbsp; Where We Celebrate</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 40, marginTop: 24,
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
              fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 300,
              color: C.roseDark, margin: '0 0 20px', lineHeight: 1.2,
            }}>
              A Glass Garden<br />Among the Vines
            </h2>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
              fontSize: 16, lineHeight: 1.85, color: C.ink, opacity: 0.7, margin: 0,
            }}>
              Set within a sun-filled botanical greenhouse draped in climbing roses,
              our celebration will unfold in a space that feels like stepping inside
              a living, breathing garden.
            </p>
          </div>
          <div style={{ borderLeft: `0.5px solid ${C.rose}20`, paddingLeft: 40 }}>
            <div style={{ marginBottom: 28 }}>
              <p style={{
                fontFamily: "'Jost', sans-serif", fontWeight: 200,
                fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase',
                color: C.rose, opacity: 0.5, margin: '0 0 6px',
              }}>Ceremony</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: C.ink, margin: 0 }}>
                4:30 PM · August 15, 2026
              </p>
            </div>
            <div>
              <p style={{
                fontFamily: "'Jost', sans-serif", fontWeight: 200,
                fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase',
                color: C.rose, opacity: 0.5, margin: '0 0 6px',
              }}>Location</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: C.ink, margin: '0 0 4px' }}>
                Kelowna, British Columbia
              </p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                fontSize: 14, color: C.inkSoft, opacity: 0.55, margin: 0,
              }}>
                Details enclosed with your invitation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// CHAPTER VI — LE PROGRAMME
// ══════════════════════════════════════════════════════
function ChapterProgramme() {
  const events = [
    { time: '4:30 PM', name: 'Ceremony',      note: 'Beneath the rose arch of the greenhouse garden' },
    { time: '5:30 PM', name: 'Garden Hour',   note: 'Champagne & florals under the afternoon sky' },
    { time: '7:00 PM', name: 'Dinner',        note: 'A harvest table lit by candlelight and roses' },
    { time: '9:00 PM', name: 'First Dance',   note: 'The moment the garden holds its breath' },
    { time: '10:00 PM', name: 'Celebration',  note: 'Dancing until the stars say goodnight' },
  ];

  return (
    <section style={{
      position: 'relative',
      background: C.rose,
      padding: '100px 24px', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
        <Image src="/assets/od/od-frame-landscape.png" alt="" fill style={{ objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: C.rose, opacity: 0.9 }} />
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '0.5px', background: `${C.ivory}20` }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '0.5px', background: `${C.ivory}20` }} />

      <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{
            fontFamily: "'Jost', sans-serif", fontWeight: 200,
            fontSize: 9, letterSpacing: '0.55em', textTransform: 'uppercase',
            color: C.ivory, margin: '0 0 18px', opacity: 0.55,
          }}>Chapter VI &nbsp;·&nbsp; The Programme</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
            fontSize: 'clamp(42px, 6vw, 58px)', fontWeight: 300,
            color: C.ivory, margin: 0,
          }}>The Day</h2>
          <div style={{
            width: '0.5px', height: 48,
            background: `linear-gradient(to bottom, ${C.ivory}66, transparent)`,
            margin: '22px auto 0',
          }} />
        </div>

        <div style={{ borderLeft: `0.5px solid ${C.ivory}28`, paddingLeft: 36 }}>
          {events.map((e, i) => (
            <div key={i} style={{
              position: 'relative',
              marginBottom: i < events.length - 1 ? 44 : 0,
              paddingBottom: i < events.length - 1 ? 44 : 0,
              borderBottom: i < events.length - 1 ? `0.5px solid ${C.ivory}12` : 'none',
            }}>
              <div style={{
                position: 'absolute', left: -41, top: 9,
                width: 8, height: 8, borderRadius: '50%',
                background: C.ivory,
                boxShadow: `0 0 0 3px ${C.rose}, 0 0 0 4.5px ${C.ivory}44`,
              }} />
              <p style={{
                fontFamily: "'Jost', sans-serif", fontWeight: 200,
                fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase',
                color: C.ivory, opacity: 0.62, margin: '0 0 6px',
              }}>{e.time}</p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 26, fontWeight: 300, color: C.ivory, margin: '0 0 5px',
              }}>{e.name}</p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                fontSize: 14, color: C.ivory, opacity: 0.42, margin: 0, lineHeight: 1.6,
              }}>{e.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// CHAPTER VII — THE DETAILS
// ══════════════════════════════════════════════════════
function ChapterDetails() {
  const details = [
    {
      label: 'Dress Code',
      detail: 'Romantic Garden Formal',
      note: 'Florals, blush, and cream are welcome and encouraged. Linen for gentlemen in the summer warmth.',
    },
    {
      label: 'Accommodation',
      detail: 'The Cove Lakeside Resort',
      note: 'A block of rooms has been reserved for guests. Please mention "Oliver & Daniella" when booking.',
    },
    {
      label: 'Gifts',
      detail: 'Your presence is our gift',
      note: 'If you wish to contribute, a honeymoon fund has been created for our travels through Italy.',
    },
    {
      label: 'RSVP By',
      detail: 'July 1, 2026',
      note: 'Please reply via this invitation so we can prepare a place especially for you.',
    },
  ];

  return (
    <section style={{
      position: 'relative', background: C.ivory, padding: '100px 24px', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04 }}>
        <Image src="/assets/od/od-frame-portrait.png" alt="" fill style={{ objectFit: 'cover' }} />
      </div>

      <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{
            fontFamily: "'Jost', sans-serif", fontWeight: 200,
            fontSize: 9, letterSpacing: '0.55em', textTransform: 'uppercase',
            color: C.rose, margin: '0 0 16px', opacity: 0.5,
          }}>Chapter VII &nbsp;·&nbsp; The Details</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
            fontSize: 'clamp(40px, 5.5vw, 54px)', fontWeight: 300,
            color: C.roseDark, margin: 0,
          }}>
            Everything You Need
          </h2>
          <div style={{ width: 40, height: '0.5px', background: C.rose, opacity: 0.25, margin: '22px auto 0' }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 44,
        }}>
          {details.map((item, i) => (
            <div key={i} style={{
              borderTop: `0.5px solid ${C.rose}28`, paddingTop: 24, position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0,
                width: 24, height: '0.5px', background: C.rose, opacity: 0.5,
              }} />
              <p style={{
                fontFamily: "'Jost', sans-serif", fontWeight: 200,
                fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase',
                color: C.rose, opacity: 0.55, margin: '0 0 8px',
              }}>{item.label}</p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 22, fontWeight: 400, color: C.roseDark, margin: '0 0 10px',
              }}>{item.detail}</p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                fontSize: 14, color: C.ink, opacity: 0.62, lineHeight: 1.7, margin: 0,
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
    const t = setTimeout(() => setVisible(true), 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <button
      onClick={() => document.getElementById('od-rsvp')?.scrollIntoView({ behavior: 'smooth' })}
      aria-label="RSVP"
      style={{
        position: 'fixed', bottom: 32, right: 32, zIndex: 9000,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '13px 24px',
        background: C.rose,
        color: C.ivory,
        border: 'none',
        fontFamily: "'Jost', sans-serif", fontWeight: 200,
        fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase',
        cursor: 'pointer',
        boxShadow: `0 8px 36px ${C.rose}55`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease, background 0.3s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = C.roseDark; }}
      onMouseLeave={e => { e.currentTarget.style.background = C.rose; }}
    >
      <span style={{ fontSize: 11 }}>✦</span>
      RSVP
    </button>
  );
}

// ── Shared form input styles ──────────────────────────
const inputSx: React.CSSProperties = {
  width: '100%', background: 'transparent', border: 'none',
  borderBottom: `0.5px solid ${C.rose}44`, padding: '10px 0',
  fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
  fontSize: 17, color: C.ink, outline: 'none', boxSizing: 'border-box',
};
const labelSx: React.CSSProperties = {
  fontFamily: "'Jost', sans-serif", fontWeight: 200,
  fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase' as const,
  color: C.rose, display: 'block', marginBottom: 4, opacity: 0.65,
};

const COUPLE_SLUG = 'oliver-and-daniela';
type RSVPStep = 'lookup' | 'form' | 'done';

// ══════════════════════════════════════════════════════
// CHAPTER VIII — RSVP
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
          coupleSlug: COUPLE_SLUG,
          guestName, email,
          invitationCode: code.trim() || undefined,
          status: attending,
          dietaryNotes: dietary,
          message,
          mealChoiceId: mealChoiceId || undefined,
          plusOne: hasPlusOne && plusOneName.trim() ? {
            firstName: plusOneParts[0] ?? '',
            lastName: plusOneParts.slice(1).join(' ') || '',
          } : undefined,
          coupleId: (lookupData?.couple as Record<string, string>)?.id,
          guestId: (lookupData?.guest as Record<string, string>)?.id,
          existingRsvpId: (lookupData?.existingRsvp as Record<string, string>)?.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Submission failed');
      setStep('done');
    } catch (err) { setSubmitError(err instanceof Error ? err.message : 'Something went wrong.'); }
    finally { setSubmitLoading(false); }
  };

  const mealChoices = lookupData
    ? ((lookupData.mealChoices ?? []) as Record<string, string>[])
    : [];
  const guestHasPlusOne = lookupData
    ? !!(lookupData.guest as Record<string, unknown> | undefined)?.allows_plus_one
    : false;

  return (
    <section id="od-rsvp" style={{
      position: 'relative', padding: '120px 24px',
      background: C.ink, overflow: 'hidden',
    }}>
      {/* Ambient background video */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
        <video autoPlay muted loop playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          src="/assets/od/od-video-ambient.mp4"
        />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: `${C.ink}88` }} />

      {/* Frame watermark */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
        <Image src="/assets/od/od-frame-landscape.png" alt="" fill style={{ objectFit: 'cover' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{
            fontFamily: "'Jost', sans-serif", fontWeight: 200,
            fontSize: 9, letterSpacing: '0.55em', textTransform: 'uppercase',
            color: C.blush, margin: '0 0 20px', opacity: 0.55,
          }}>Chapter VIII &nbsp;·&nbsp; Your Reply</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
            fontSize: 'clamp(40px, 5.5vw, 58px)', fontWeight: 300,
            color: C.ivory, margin: '0 0 14px',
          }}>Will You Join Us?</h2>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
            fontSize: 17, color: C.ivory, opacity: 0.52, lineHeight: 1.8,
          }}>
            Kindly reply by July 1, 2026.<br />
            Your presence would be our greatest joy.
          </p>
          <div style={{ width: '0.5px', height: 48, background: `linear-gradient(to bottom, ${C.blush}88, transparent)`, margin: '22px auto 0' }} />
        </div>

        {step === 'lookup' && (
          <form onSubmit={handleLookup}
            style={{ background: `${C.ivory}08`, backdropFilter: 'blur(10px)', padding: '48px 40px', border: `0.5px solid ${C.rose}28`, position: 'relative' }}
          >
            <CornerMarks color={C.blush} size={12} />

            <div style={{ marginBottom: 32 }}>
              <label style={{ ...labelSx, color: C.blush }}>Your Invitation Code</label>
              <input
                type="text" value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="e.g. OD-1234"
                style={{ ...inputSx, color: C.ivory, borderBottomColor: `${C.blush}44` }}
              />
            </div>

            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
              fontSize: 13, color: C.ivory, opacity: 0.3, textAlign: 'center', margin: '0 0 24px',
            }}>or</p>

            <div style={{ marginBottom: 36 }}>
              <label style={{ ...labelSx, color: C.blush }}>Your Full Name</label>
              <input
                type="text" value={lookupName}
                onChange={e => setLookupName(e.target.value)}
                placeholder="As it appears on your invitation"
                style={{ ...inputSx, color: C.ivory, borderBottomColor: `${C.blush}44` }}
              />
            </div>

            {lookupError && (
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 14, color: '#F29', opacity: 0.8, marginBottom: 20 }}>
                {lookupError}
              </p>
            )}

            <button type="submit" disabled={lookupLoading}
              style={{
                width: '100%', background: C.rose, border: 'none',
                color: C.ivory, fontFamily: "'Jost', sans-serif", fontWeight: 200,
                fontSize: 10, letterSpacing: '0.42em', textTransform: 'uppercase',
                padding: '18px 0', cursor: lookupLoading ? 'wait' : 'pointer', opacity: lookupLoading ? 0.65 : 1,
              }}>
              {lookupLoading ? 'Searching…' : 'Find My Invitation'}
            </button>
          </form>
        )}

        {step === 'form' && (
          <form onSubmit={handleSubmit}
            style={{ background: `${C.ivory}08`, backdropFilter: 'blur(10px)', padding: '48px 40px', border: `0.5px solid ${C.rose}28`, position: 'relative' }}
          >
            <CornerMarks color={C.blush} size={12} />

            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
              fontSize: 18, color: C.ivory, opacity: 0.7, marginBottom: 36,
              textAlign: 'center',
            }}>
              Welcome, {guestName || 'dear guest'}
            </p>

            {[
              { label: 'Your Name', value: guestName, set: setGuestName, type: 'text', placeholder: 'Full name' },
              { label: 'Email',     value: email,     set: setEmail,     type: 'email', placeholder: 'your@email.com' },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 28 }}>
                <label style={{ ...labelSx, color: C.blush }}>{f.label}</label>
                <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)}
                  placeholder={f.placeholder} required
                  style={{ ...inputSx, color: C.ivory, borderBottomColor: `${C.blush}44` }} />
              </div>
            ))}

            <div style={{ marginBottom: 28 }}>
              <label style={{ ...labelSx, color: C.blush }}>Will You Attend?</label>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                {(['attending', 'declined'] as const).map(opt => (
                  <button key={opt} type="button"
                    onClick={() => setAttending(opt)}
                    style={{
                      flex: 1, padding: '12px 0',
                      background: attending === opt ? C.rose : 'transparent',
                      border: `0.5px solid ${C.rose}${attending === opt ? 'FF' : '44'}`,
                      color: attending === opt ? C.ivory : `${C.ivory}88`,
                      fontFamily: "'Jost', sans-serif", fontWeight: 200,
                      fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                    }}>
                    {opt === 'attending' ? 'Joyfully Accepts' : 'Regretfully Declines'}
                  </button>
                ))}
              </div>
            </div>

            {mealChoices.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <label style={{ ...labelSx, color: C.blush }}>Meal Preference</label>
                <select value={mealChoiceId} onChange={e => setMealChoiceId(e.target.value)}
                  style={{ ...inputSx, color: C.ivory, borderBottomColor: `${C.blush}44` }}>
                  <option value="" style={{ background: C.ink }}>Select your preference</option>
                  {mealChoices.map(m => (
                    <option key={m.id} value={m.id} style={{ background: C.ink }}>{m.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ marginBottom: 28 }}>
              <label style={{ ...labelSx, color: C.blush }}>Dietary Notes</label>
              <input type="text" value={dietary} onChange={e => setDietary(e.target.value)}
                placeholder="Allergies, restrictions…"
                style={{ ...inputSx, color: C.ivory, borderBottomColor: `${C.blush}44` }} />
            </div>

            {guestHasPlusOne && (
              <>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input type="checkbox" checked={hasPlusOne} onChange={e => setHasPlusOne(e.target.checked)}
                      style={{ accentColor: C.rose }} />
                    <span style={{ ...labelSx, margin: 0 }}>I am bringing a plus one</span>
                  </label>
                </div>
                {hasPlusOne && (
                  <div style={{ marginBottom: 28 }}>
                    <label style={{ ...labelSx, color: C.blush }}>Plus One&apos;s Full Name</label>
                    <input type="text" value={plusOneName} onChange={e => setPlusOneName(e.target.value)}
                      placeholder="Guest's full name"
                      style={{ ...inputSx, color: C.ivory, borderBottomColor: `${C.blush}44` }} />
                  </div>
                )}
              </>
            )}

            <div style={{ marginBottom: 36 }}>
              <label style={{ ...labelSx, color: C.blush }}>A Message for Oliver &amp; Daniella</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Share your warmth, your wishes, your love…" rows={4}
                style={{ ...inputSx, color: C.ivory, borderBottomColor: `${C.blush}44`, resize: 'none' }} />
            </div>

            {submitError && (
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 14, color: '#F29', opacity: 0.8, marginBottom: 20 }}>
                {submitError}
              </p>
            )}

            <button type="submit" disabled={submitLoading}
              style={{
                width: '100%', background: C.rose, border: 'none',
                color: C.ivory, fontFamily: "'Jost', sans-serif", fontWeight: 200,
                fontSize: 10, letterSpacing: '0.42em', textTransform: 'uppercase',
                padding: '18px 0', cursor: submitLoading ? 'wait' : 'pointer', opacity: submitLoading ? 0.65 : 1,
              }}>
              {submitLoading ? 'Sending…' : 'Send My Reply'}
            </button>
          </form>
        )}

        {step === 'done' && (
          <div style={{
            textAlign: 'center', padding: '64px 40px',
            border: `0.5px solid ${C.rose}30`, background: `${C.ivory}08`,
            backdropFilter: 'blur(10px)', position: 'relative',
          }}>
            <CornerMarks color={C.blush} size={14} />
            <p style={{
              fontFamily: "'Pinyon Script', cursive",
              fontSize: 60, color: C.blush, margin: '0 0 20px', lineHeight: 1,
            }}>Thank You</p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
              fontSize: 17, color: C.ivory, opacity: 0.62, lineHeight: 1.85, margin: 0,
            }}>
              We have received your reply and we cannot wait<br />
              to celebrate with you among the roses.<br />
              <br />
              — Oliver &amp; Daniella
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// CLOSING
// ══════════════════════════════════════════════════════
function ChapterClosing() {
  return (
    <section style={{
      position: 'relative', height: '100svh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <Image src="/assets/od/od-frame-landscape.png" alt="" fill
        style={{ objectFit: 'cover', opacity: 0.35 }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to bottom, ${C.cream} 0%, ${C.cream}88 40%, ${C.cream}AA 60%, ${C.cream} 100%)`,
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px' }}>
        <p style={{
          fontFamily: "'Jost', sans-serif", fontWeight: 200,
          fontSize: 9, letterSpacing: '0.55em', textTransform: 'uppercase',
          color: C.rose, margin: '0 0 18px', opacity: 0.55,
        }}>August 15, 2026</p>

        <div style={{ width: 40, height: '0.5px', background: C.rose, opacity: 0.3, margin: '0 auto 28px' }} />

        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
          fontSize: 'clamp(1.6rem, 4.5vw, 2.8rem)', fontWeight: 300,
          color: C.ink, lineHeight: 1.4, marginBottom: 52, maxWidth: 520, margin: '0 auto 52px',
        }}>
          &ldquo;Every garden is made beautiful<br />by the love that tends it.&rdquo;
        </h2>

        <div style={{ margin: '0 0 32px' }}>
          <span style={{
            fontFamily: "'Pinyon Script', cursive",
            fontSize: 'clamp(52px, 10vw, 84px)',
            fontWeight: 400, color: C.roseDark, lineHeight: 0.9, display: 'block',
          }}>
            Oliver <span style={{ color: C.mauve, fontSize: '0.7em', fontStyle: 'normal' }}>&amp;</span> Daniella
          </span>
        </div>

        <p style={{
          fontFamily: "'Jost', sans-serif", fontWeight: 200,
          fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase',
          color: C.inkSoft, opacity: 0.45, margin: 0,
        }}>
          Saturday, August 15, 2026 · Kelowna, British Columbia
        </p>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// ROOT PAGE
// ══════════════════════════════════════════════════════
export default function OliverAndDaniellaPage() {
  const [phase, setPhase] = useState<'video' | 'invitation'>('video');

  return (
    <div style={{ background: C.cream, color: C.ink, overflowX: 'hidden', fontFamily: "'Cormorant Garamond', serif" }}>
      <FontLoader />
      <Grain />

      {phase === 'video' && <VideoEntrance onComplete={() => setPhase('invitation')} />}

      {phase === 'invitation' && (
        <div style={{ position: 'relative' }}>
          <PetalCanvas />

          {/* Back link */}
          <div style={{ position: 'fixed', top: 28, left: 28, zIndex: 9000 }}>
            <Link href="/collection" style={{
              fontFamily: "'Jost', sans-serif", fontSize: 9,
              letterSpacing: '0.38em', textTransform: 'uppercase',
              color: `${C.inkSoft}88`, textDecoration: 'none',
            }}>← Collection</Link>
          </div>

          <ChapterInvitation />
          <ChapterStory />
          <ChapterProposal />
          <ChapterBotanical />
          <ChapterVenue />
          <ChapterProgramme />
          <ChapterDetails />
          <ChapterRSVP />
          <ChapterClosing />

          <footer style={{
            padding: '48px 24px', background: C.ink, textAlign: 'center',
            borderTop: `0.5px solid ${C.rose}18`,
          }}>
            <p style={{
              fontFamily: "'Jost', sans-serif", fontWeight: 200,
              fontSize: 9, letterSpacing: '0.32em', textTransform: 'uppercase',
              color: `${C.ivory}30`, margin: '0 0 12px',
            }}>Oliver &amp; Daniella · August 15, 2026 · Kelowna, British Columbia</p>
            <p style={{
              fontFamily: "'Jost', sans-serif", fontWeight: 200,
              fontSize: 9, letterSpacing: '0.32em', textTransform: 'uppercase',
              color: `${C.ivory}20`, margin: 0,
            }}>#OliverandDaniella2026</p>
          </footer>

          <FloatingRSVP />
        </div>
      )}
    </div>
  );
}
