'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Work } from '@/lib/works';

gsap.registerPlugin(ScrollTrigger);

/* ── Mobile fallback — simple horizontal scroll strip ── */
function MobileCarousel({ works }: { works: Work[] }) {
  return (
    <section style={{
      padding: 'clamp(3rem,6vw,5rem) 0',
      background: 'radial-gradient(ellipse 80% 60% at 50% 30%, #F2EBE0 0%, transparent 60%), var(--ivory)',
    }}>
      <p style={{
        fontFamily: 'var(--font-manrope), sans-serif',
        fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase',
        color: 'var(--gold)', textAlign: 'center',
        marginBottom: 'clamp(2rem,5vw,3rem)',
      }}>
        The Commissions
      </p>
      <div style={{
        display: 'flex', gap: '1.25rem',
        overflowX: 'auto', overflowY: 'hidden',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        padding: '0 clamp(2rem,5vw,5rem) 1.5rem',
        scrollbarWidth: 'none',
      }}>
        {works.map(w => (
          <Link key={w.slug} href={w.direct && w.experienceUrl ? w.experienceUrl : `/work/${w.slug}`} style={{
            flexShrink: 0, scrollSnapAlign: 'start',
            width: 'clamp(200px,60vw,280px)',
            display: 'block', textDecoration: 'none',
          }}>
            <div style={{
              position: 'relative', overflow: 'hidden', borderRadius: 2,
              height: 'clamp(280px,75vw,380px)',
            }}>
              <img
                src={w.cover} alt={w.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(14,13,11,.65) 0%, transparent 50%)',
              }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.2rem' }}>
                <p style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '.5rem', letterSpacing: '.28em', textTransform: 'uppercase',
                  color: 'rgba(201,168,130,.75)', marginBottom: '.4rem',
                }}>{w.category}</p>
                <h3 style={{
                  fontFamily: 'var(--font-prata), Georgia, serif',
                  fontSize: 'clamp(1rem,4vw,1.2rem)', lineHeight: 1.1,
                  color: 'var(--ivory)',
                }}>{w.title}</h3>
              </div>
            </div>
            <p style={{
              fontFamily: 'var(--font-garamond), Georgia, serif',
              fontStyle: 'italic', fontSize: '.85rem',
              color: 'var(--mist)', marginTop: '.75rem', lineHeight: 1.5,
            }}>{w.location} · {w.season} {w.year}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * WorksCinematicCarousel — pinned 3D poster reel of the portfolio.
 *
 * Every commission cover sits on an invisible 3D cylinder. As the guest
 * scrolls, the cylinder rotates one poster at a time to the front while the
 * couple's name sweeps in as a huge editorial headline behind/above the
 * posters. Clicking the front poster (or the circular CTA) opens the story.
 *
 * Tuning:
 *   radius / card size ......... getResponsiveConfig()
 *   scroll pacing .............. SCROLL_LENGTH_PER_CARD
 *   inertia .................... scrub value
 *   depth dimming .............. DEPTH_* constants
 */
const SCROLL_LENGTH_PER_CARD = 850;

const DEPTH_SCALE_MIN = 0.66;
const DEPTH_OPACITY_MIN = 0.22;
const DEPTH_BLUR_MAX = 2.5;
const DEPTH_BRIGHTNESS_MIN = 0.55;

/* ── Wrapper: picks mobile vs desktop carousel ────────── */
export default function WorksCinematicCarousel({ works }: { works: Work[] }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Hold a blank spacer until we know viewport size — prevents GSAP from
  // mounting on mobile only to be torn down immediately (causes removeChild errors)
  if (isMobile === null) {
    return <div style={{ height: '100vh', background: 'radial-gradient(ellipse 80% 60% at 50% 30%, #F2EBE0 0%, transparent 60%), var(--ivory)' }} />;
  }

  return isMobile
    ? <MobileCarousel works={works} />
    : <DesktopCarousel works={works} />;
}

/* ── Desktop: GSAP 3D cylinder (unchanged) ─────────────── */
function DesktopCarousel({ works }: { works: Work[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const nameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressFillRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  const total = works.length;
  const angleStep = 360 / total;

  const jitters = useMemo(
    () =>
      works.map(() => ({
        rotateZ: gsap.utils.random(-2, 2, 0.1),
        yOffset: gsap.utils.random(-8, 8, 1),
      })),
    [works]
  );

  useEffect(() => {
    const section = sectionRef.current;
    const scene = sceneRef.current;
    const cards = cardRefs.current;
    if (!section || !scene) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const getResponsiveConfig = () => {
      const w = window.innerWidth;
      if (w < 640) return { radius: 270, cardW: 165, cardH: 235 };
      if (w < 1024) return { radius: 420, cardW: 235, cardH: 330 };
      return { radius: 520, cardW: 270, cardH: 375 };
    };

    let config = getResponsiveConfig();
    let depthSetters: {
      scale: (v: number) => void;
      opacity: (v: number) => void;
      filter: (v: string) => void;
    }[] = [];

    const ctx = gsap.context(() => {
      const layout = () => {
        config = getResponsiveConfig();
        cards.forEach((card, i) => {
          if (!card) return;
          gsap.set(card, {
            width: config.cardW,
            height: config.cardH,
            xPercent: -50,
            yPercent: -50,
            rotationY: i * angleStep,
            rotation: prefersReducedMotion ? 0 : jitters[i].rotateZ,
            y: jitters[i].yOffset,
            z: config.radius,
            transformOrigin: `50% 50% ${-config.radius}px`,
          });
        });
        depthSetters = cards.map((card) => ({
          scale: gsap.quickSetter(card, 'scale') as (v: number) => void,
          opacity: gsap.quickSetter(card, 'opacity') as (v: number) => void,
          filter: gsap.quickSetter(card, 'filter') as unknown as (v: string) => void,
        }));
        updateDepth(Number(gsap.getProperty(scene, 'rotationY')));
      };

      const updateDepth = (sceneAngle: number) => {
        cards.forEach((card, i) => {
          if (!card || !depthSetters[i]) return;
          const net = ((i * angleStep + sceneAngle) * Math.PI) / 180;
          const t = gsap.utils.clamp(0, 1, (Math.cos(net) + 1) / 2);
          depthSetters[i].scale(gsap.utils.interpolate(DEPTH_SCALE_MIN, 1.06, t));
          depthSetters[i].opacity(gsap.utils.interpolate(DEPTH_OPACITY_MIN, 1, t));
          const blur = gsap.utils.interpolate(DEPTH_BLUR_MAX, 0, t);
          const bright = gsap.utils.interpolate(DEPTH_BRIGHTNESS_MIN, 1.02, t);
          depthSetters[i].filter(`blur(${blur.toFixed(2)}px) brightness(${bright.toFixed(2)})`);
        });
      };

      layout();

      gsap.to(scene, {
        rotationY: prefersReducedMotion ? 0 : -360,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${SCROLL_LENGTH_PER_CARD * total}`,
          scrub: prefersReducedMotion ? false : 1.3,
          pin: true,
          anticipatePin: 1,
          snap: prefersReducedMotion
            ? undefined
            : {
                snapTo: 1 / total,
                duration: { min: 0.3, max: 0.8 },
                ease: 'power2.inOut',
              },
          onUpdate: (self) => {
            const idx = Math.round(self.progress * total) % total;
            if (idx !== activeIndexRef.current) {
              activeIndexRef.current = idx;
              setActiveIndex(idx);
            }
            if (progressFillRef.current) {
              gsap.set(progressFillRef.current, { scaleX: self.progress });
            }
            updateDepth(Number(gsap.getProperty(scene, 'rotationY')));
          },
        },
      });

      window.addEventListener('resize', layout);
      return () => window.removeEventListener('resize', layout);
    }, section);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [works]);

  // Couple-name headline crossfade per active poster.
  useEffect(() => {
    nameRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        opacity: i === activeIndex ? 1 : 0,
        y: i === activeIndex ? 0 : 16,
        duration: 0.75,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    });
  }, [activeIndex]);

  const active = works[activeIndex];

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        background:
          'radial-gradient(ellipse 80% 60% at 50% 30%, #F2EBE0 0%, transparent 60%), var(--ivory)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: 1300,
          perspectiveOrigin: '50% 45%',
        }}
      >
        {/* eyebrow */}
        <p
          style={{
            position: 'absolute',
            top: '11%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.58rem',
            letterSpacing: '.4em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            zIndex: 4,
          }}
        >
          The Commissions
        </p>

        {/* Couple names — huge editorial headline behind the posters */}
        <div
          style={{
            position: 'absolute',
            top: '16%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(92vw, 1200px)',
            textAlign: 'center',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          {works.map((w, i) => (
            <div
              key={w.slug}
              ref={(el) => { nameRefs.current[i] = el; }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                opacity: i === 0 ? 1 : 0,
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-prata), Georgia, serif',
                  fontSize: 'clamp(2.2rem,6.5vw,6rem)',
                  lineHeight: 0.98,
                  letterSpacing: '-.02em',
                  color: 'var(--ink)',
                }}
              >
                {w.title}
              </h2>
              <p
                style={{
                  marginTop: '1.1rem',
                  fontFamily: 'var(--font-garamond), Georgia, serif',
                  fontStyle: 'italic',
                  fontSize: 'clamp(.9rem,1.3vw,1.15rem)',
                  color: 'var(--mist)',
                }}
              >
                {w.location} &nbsp;·&nbsp; {w.season} {w.year}
              </p>
            </div>
          ))}
        </div>

        {/* 3D cylinder of poster covers */}
        <div
          ref={sceneRef}
          style={{
            position: 'relative',
            width: 1,
            height: 1,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            zIndex: 2,
            marginTop: '9vh',
          }}
        >
          {works.map((w, i) => (
            <Link
              key={w.slug}
              href={w.direct && w.experienceUrl ? w.experienceUrl : `/work/${w.slug}`}
              ref={(el) => { cardRefs.current[i] = el; }}
              aria-label={`${w.title} — read the story`}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                display: 'block',
                overflow: 'hidden',
                borderRadius: 2,
                boxShadow: '0 50px 80px -28px rgba(14,13,11,.45)',
                background: 'var(--deep)',
                willChange: 'transform, filter, opacity',
                backfaceVisibility: 'hidden',
              }}
            >
              {/* plain img: Next/Image fill doesn't play well inside heavy 3D transforms */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.cover}
                alt={w.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(14,13,11,.62) 0%, transparent 45%)',
                }}
              />
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '1.2rem 1.2rem 1.1rem' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '.52rem',
                    letterSpacing: '.32em',
                    textTransform: 'uppercase',
                    color: 'rgba(201,168,130,.75)',
                    marginBottom: '.45rem',
                  }}
                >
                  {w.category}
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-prata), Georgia, serif',
                    fontSize: 'clamp(1rem,1.6vw,1.35rem)',
                    lineHeight: 1.12,
                    color: 'var(--ivory)',
                  }}
                >
                  {w.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA to the active story */}
        <Link
          href={active.direct && active.experienceUrl ? active.experienceUrl : `/work/${active.slug}`}
          style={{
            position: 'absolute',
            bottom: '11%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.58rem',
            letterSpacing: '.3em',
            textTransform: 'uppercase',
            color: 'var(--ink)',
            textDecoration: 'none',
            borderBottom: '1px solid rgba(162,129,90,.4)',
            paddingBottom: '.2em',
          }}
        >
          Read the story →
        </Link>

        {/* progress */}
        <div
          style={{
            position: 'absolute',
            bottom: '5.5%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            zIndex: 5,
          }}
        >
          <div style={{ width: 150, height: 1, background: 'rgba(14,13,11,.15)' }}>
            <div
              ref={progressFillRef}
              style={{
                height: '100%',
                width: '100%',
                background: 'var(--gold)',
                transform: 'scaleX(0)',
                transformOrigin: 'left',
              }}
            />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.58rem',
              letterSpacing: '.12em',
              color: 'var(--mist)',
              minWidth: 46,
            }}
          >
            {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  );
}
