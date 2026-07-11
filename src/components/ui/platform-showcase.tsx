'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const GOLD   = '#A2815A';
const IVORY  = '#F8F5F0';
const INK    = '#0E0D0B';
const CREAM  = '#F2EBE0';

/* ── Phone mockup UI data ───────────────────────────── */
const GUESTS = [
  { initials: 'AW', name: 'A. Worthington',    status: 'attending', color: '#264D2A' },
  { initials: 'EL', name: 'E. Laroche',         status: 'attending', color: '#264D2A' },
  { initials: 'IF', name: 'I. Fontaine',         status: 'attending', color: '#264D2A' },
  { initials: 'TB', name: 'T. Blackwood',        status: 'pending',   color: '#5C4A1E' },
  { initials: 'MR', name: 'M. Renaud',           status: 'attending', color: '#264D2A' },
];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    label: 'The Invitation',
    desc: 'A living world delivered by one link — no app required.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <path d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    label: 'RSVP Portal',
    desc: 'Guests reply in seconds. Dietary, plus-ones, and notes — captured.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    label: 'Live Dashboard',
    desc: 'Real-time attendance, messages, and exports — all yours.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <path d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
        <path d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
      </svg>
    ),
    label: 'Entrance Control',
    desc: 'QR scan at the door. No lists, no confusion, no uninvited guests.',
  },
];

export function PlatformShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef      = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);

  /* mouse parallax on card */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const xVal = (e.clientX / window.innerWidth  - 0.5) * 2;
        const yVal = (e.clientY / window.innerHeight - 0.5) * 2;
        cardRef.current!.style.setProperty('--mouse-x', `${e.clientX - cardRef.current!.getBoundingClientRect().left}px`);
        cardRef.current!.style.setProperty('--mouse-y', `${e.clientY - cardRef.current!.getBoundingClientRect().top}px`);
        gsap.to('.ps-mockup', { rotationY: xVal * 8, rotationX: -yVal * 8, ease: 'power3.out', duration: 1.4 });
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current); };
  }, []);

  /* cinematic scroll timeline */
  useEffect(() => {
    const mob = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      /* initial states */
      gsap.set('.ps-bg-text',   { autoAlpha: 1,  y: 0 });
      gsap.set('.ps-card',      { y: window.innerHeight + 300, autoAlpha: 1 });
      gsap.set('.ps-left',      { autoAlpha: 0, x: -60 });
      gsap.set('.ps-right',     { autoAlpha: 0, x:  60 });
      gsap.set('.ps-mockup',    { autoAlpha: 0, y: 80, rotationX: 30 });
      gsap.set('.ps-badge',     { autoAlpha: 0, y: 50, scale: .8 });
      gsap.set('.ps-feat-item', { autoAlpha: 0, y: 30 });
      gsap.set('.ps-cta',       { autoAlpha: 0, scale: .85, filter: 'blur(20px)' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end:   '+=6000',
          pin:   true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      tl
        /* card slides up */
        .to('.ps-bg-text', { scale: 1.1, filter: 'blur(16px)', opacity: .15, duration: 2 }, 0)
        .to('.ps-card',    { y: 0, ease: 'power3.inOut', duration: 2 }, 0)
        /* card expands to full screen */
        .to('.ps-card', { width: '100%', height: '100%', borderRadius: '0px', ease: 'power3.inOut', duration: 1.5 })
        /* content appears */
        .fromTo('.ps-mockup',
          { y: 200, z: -400, rotationX: 40, autoAlpha: 0, scale: .7 },
          { y: 0,   z: 0,    rotationX: 0,  autoAlpha: 1, scale: 1, ease: 'expo.out', duration: 2.2 },
          '-=.6'
        )
        .fromTo('.ps-feat-item',
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0,  stagger: .18, ease: 'power3.out', duration: 1.2 },
          '-=1.6'
        )
        .fromTo('.ps-left',
          { autoAlpha: 0, x: -50 },
          { autoAlpha: 1, x: 0, ease: 'power4.out', duration: 1.4 },
          '-=1.4'
        )
        .fromTo('.ps-right',
          { autoAlpha: 0, x: 50 },
          { autoAlpha: 1, x: 0, ease: 'power4.out', duration: 1.4 },
          '<'
        )
        .fromTo('.ps-badge',
          { autoAlpha: 0, y: 40, scale: .8 },
          { autoAlpha: 1, y: 0, scale: 1, stagger: .2, ease: 'back.out(1.4)', duration: 1.2 },
          '-=1.0'
        )
        /* hold */
        .to({}, { duration: 2.5 })
        /* exit */
        .set('.ps-bg-text', { autoAlpha: 0 })
        .set('.ps-cta',     { autoAlpha: 1 })
        .to(['.ps-left', '.ps-right', '.ps-mockup', '.ps-badge', '.ps-feat-item'],
          { scale: .88, y: -50, autoAlpha: 0, ease: 'power2.in', duration: 1.2, stagger: .04 }
        )
        .to('.ps-card',
          { width: mob ? '92vw' : '80vw', height: mob ? '90vh' : '82vh', borderRadius: mob ? '28px' : '36px', ease: 'expo.inOut', duration: 1.8 },
          'pullback'
        )
        .to('.ps-cta', { scale: 1, filter: 'blur(0px)', ease: 'expo.inOut', duration: 1.8 }, 'pullback')
        .to('.ps-card', { y: -window.innerHeight - 400, ease: 'power3.in', duration: 1.4 });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      aria-label="Platform capabilities"
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: CREAM,
      }}
    >
      {/* bg text layer */}
      <div className="ps-bg-text" style={{
        position: 'absolute', zIndex: 5,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
        padding: '0 2rem', pointerEvents: 'none',
      }}>
        <p style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase',
          color: GOLD, marginBottom: '1.5rem',
        }}>
          Beyond the Invitation
        </p>
        <h2 style={{
          fontFamily: 'var(--font-prata), Georgia, serif',
          fontSize: 'clamp(2.8rem,7vw,8rem)',
          lineHeight: .94, letterSpacing: '-.03em',
          color: INK, marginBottom: '1.5rem',
        }}>
          Everything in<br />
          <em style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', color: GOLD }}>
            one place.
          </em>
        </h2>
        <p style={{
          fontFamily: 'var(--font-garamond), Georgia, serif',
          fontStyle: 'italic',
          fontSize: 'clamp(.9rem,1.2vw,1.1rem)',
          color: 'rgba(14,13,11,.45)',
          maxWidth: '36ch', lineHeight: 1.8,
        }}>
          One link. Four capabilities. From the invitation to the entrance — Maison RSVP orchestrates the entire guest experience.
        </p>
      </div>

      {/* CTA layer (visible after card collapses) */}
      <div className="ps-cta" style={{
        position: 'absolute', zIndex: 5,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
        padding: '0 2rem', pointerEvents: 'auto',
      }}>
        <p style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase',
          color: GOLD, marginBottom: '2rem',
        }}>
          Begin your commission
        </p>
        <h2 style={{
          fontFamily: 'var(--font-prata), Georgia, serif',
          fontSize: 'clamp(2.5rem,5.5vw,6rem)',
          lineHeight: .96, letterSpacing: '-.03em',
          color: INK, marginBottom: '2rem',
        }}>
          Your event,<br />completely covered.
        </h2>
        <a
          href="/contact"
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontSize: 'clamp(1rem,1.4vw,1.2rem)',
            color: GOLD,
            textDecoration: 'none',
            borderBottom: `1px solid rgba(162,129,90,.35)`,
            paddingBottom: '.2em',
            letterSpacing: '.03em',
          }}
        >
          Commission your suite →
        </a>
      </div>

      {/* The dark expanding card */}
      <div
        ref={cardRef}
        className="ps-card"
        style={{
          position: 'absolute',
          zIndex: 20,
          width: 'clamp(80vw, 85vw, 90vw)',
          height: 'clamp(80vh, 85vh, 90vh)',
          borderRadius: 36,
          background: `linear-gradient(145deg, #1A1208 0%, #0E0D0B 100%)`,
          boxShadow: '0 60px 120px -30px rgba(0,0,0,.85), 0 20px 40px -20px rgba(0,0,0,.7), inset 0 1px 2px rgba(162,129,90,.15)',
          border: '1px solid rgba(162,129,90,.08)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* sheen */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, zIndex: 50, pointerEvents: 'none',
          background: 'radial-gradient(700px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(162,129,90,.07) 0%, transparent 45%)',
        }} />

        {/* grain */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, zIndex: 51, pointerEvents: 'none',
          opacity: .04, mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '220px',
        }} />

        {/* grid content */}
        <div style={{
          position: 'relative', zIndex: 10,
          width: '100%', height: '100%',
          maxWidth: 1280,
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: 'clamp(1.5rem,3vw,3rem)',
          padding: 'clamp(2rem,4vw,4rem)',
        }}>

          {/* ── LEFT: feature list ── */}
          <div className="ps-left" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '.52rem', letterSpacing: '.35em', textTransform: 'uppercase',
                color: GOLD, marginBottom: '.75rem',
              }}>
                The complete suite
              </p>
              <h3 style={{
                fontFamily: 'var(--font-prata), Georgia, serif',
                fontSize: 'clamp(1.6rem,2.5vw,2.8rem)',
                lineHeight: 1.05, letterSpacing: '-.02em',
                color: IVORY,
              }}>
                One link.<br />Four capabilities.
              </h3>
            </div>

            {FEATURES.map((f, i) => (
              <div
                key={f.label}
                className="ps-feat-item"
                style={{
                  display: 'flex', gap: '1rem', alignItems: 'flex-start',
                  borderTop: '1px solid rgba(162,129,90,.12)',
                  paddingTop: '1rem',
                }}
              >
                <span style={{ color: GOLD, marginTop: 2, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase',
                    color: IVORY, marginBottom: '.35rem',
                  }}>
                    {f.label}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-garamond), Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: 'clamp(.82rem,1vw,.95rem)',
                    color: 'rgba(248,245,240,.45)', lineHeight: 1.65,
                  }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── CENTER: phone mockup ── */}
          <div
            className="ps-mockup"
            style={{
              position: 'relative',
              width: 'clamp(200px,22vw,280px)',
              height: 'clamp(420px,46vw,580px)',
              perspective: 1000,
            }}
          >
            {/* bezel */}
            <div style={{
              width: '100%', height: '100%',
              borderRadius: '3rem',
              background: '#111',
              boxShadow: 'inset 0 0 0 2px #3F3F46, inset 0 0 0 7px #000, 0 40px 80px -15px rgba(0,0,0,.9), 0 15px 30px -5px rgba(0,0,0,.6)',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* screen */}
              <div style={{
                position: 'absolute', inset: 7,
                borderRadius: '2.5rem',
                background: '#080808',
                overflow: 'hidden',
                color: IVORY,
              }}>
                {/* screen glare */}
                <div aria-hidden style={{
                  position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none',
                  background: 'linear-gradient(110deg, rgba(255,255,255,.07) 0%, transparent 45%)',
                }} />
                {/* dynamic island */}
                <div aria-hidden style={{
                  position: 'absolute', top: 5, left: '50%', transform: 'translateX(-50%)',
                  width: 100, height: 28, background: '#000',
                  borderRadius: 999, zIndex: 50,
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 12px',
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#22c55e',
                    boxShadow: '0 0 8px rgba(34,197,94,.8)',
                  }} />
                </div>

                {/* app content */}
                <div style={{
                  position: 'relative', height: '100%',
                  paddingTop: 52, paddingLeft: 16, paddingRight: 16, paddingBottom: 24,
                  display: 'flex', flexDirection: 'column', gap: 12,
                }}>
                  {/* header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(248,245,240,.35)', marginBottom: 2, fontFamily: 'var(--font-manrope), sans-serif' }}>Dashboard</p>
                      <p style={{ fontSize: 15, fontFamily: 'var(--font-prata), Georgia, serif', color: IVORY }}>Guest List</p>
                    </div>
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: 'rgba(162,129,90,.15)',
                      border: '1px solid rgba(162,129,90,.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: 10, color: GOLD, fontFamily: 'var(--font-manrope), sans-serif' }}>MR</span>
                    </div>
                  </div>

                  {/* stats row */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { val: '47', label: 'Attending' },
                      { val: '12', label: 'Pending'   },
                      { val: '3',  label: 'Declined'  },
                    ].map(s => (
                      <div key={s.label} style={{
                        flex: 1, borderRadius: 10,
                        background: 'rgba(162,129,90,.07)',
                        border: '1px solid rgba(162,129,90,.12)',
                        padding: '8px 6px', textAlign: 'center',
                      }}>
                        <p style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 16, color: IVORY, lineHeight: 1 }}>{s.val}</p>
                        <p style={{ fontSize: 7.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(248,245,240,.35)', marginTop: 3, fontFamily: 'var(--font-manrope), sans-serif' }}>{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* guest rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                    {GUESTS.map(g => (
                      <div key={g.initials} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        borderRadius: 10,
                        background: 'rgba(255,255,255,.03)',
                        border: '1px solid rgba(255,255,255,.05)',
                        padding: '8px 10px',
                      }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                          background: 'rgba(162,129,90,.18)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span style={{ fontSize: 8, color: GOLD, fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 600 }}>{g.initials}</span>
                        </div>
                        <p style={{ flex: 1, fontSize: 10, color: 'rgba(248,245,240,.7)', fontFamily: 'var(--font-manrope), sans-serif' }}>{g.name}</p>
                        <span style={{
                          fontSize: 7, letterSpacing: '.1em', textTransform: 'uppercase',
                          padding: '2px 7px', borderRadius: 999,
                          background: g.status === 'attending' ? 'rgba(38,77,42,.5)' : 'rgba(92,74,30,.5)',
                          color: g.status === 'attending' ? '#6EE7A0' : '#D4A94E',
                          fontFamily: 'var(--font-manrope), sans-serif',
                        }}>
                          {g.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* QR scan bar at bottom */}
                  <div style={{
                    borderRadius: 12,
                    background: `linear-gradient(135deg, rgba(162,129,90,.15) 0%, rgba(162,129,90,.06) 100%)`,
                    border: '1px solid rgba(162,129,90,.25)',
                    padding: '10px 14px',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" style={{ width: 16, height: 16, flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                    </svg>
                    <div>
                      <p style={{ fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: GOLD, fontFamily: 'var(--font-manrope), sans-serif' }}>Entrance Control</p>
                      <p style={{ fontSize: 8, color: 'rgba(248,245,240,.35)', fontFamily: 'var(--font-manrope), sans-serif' }}>Scan QR at door · 44 checked in</p>
                    </div>
                  </div>

                  {/* home indicator */}
                  <div aria-hidden style={{
                    position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
                    width: 100, height: 4, borderRadius: 999,
                    background: 'rgba(255,255,255,.18)',
                  }} />
                </div>
              </div>

              {/* hardware buttons */}
              {[
                { top: 120, side: -3, h: 25, left: true },
                { top: 160, side: -3, h: 45, left: true },
                { top: 220, side: -3, h: 45, left: true },
                { top: 170, side: -3, h: 70, left: false },
              ].map((b, i) => (
                <div key={i} aria-hidden style={{
                  position: 'absolute',
                  top: b.top,
                  [b.left ? 'left' : 'right']: b.side,
                  width: 3, height: b.h,
                  background: 'linear-gradient(90deg, #404040 0%, #171717 100%)',
                  boxShadow: 'inset 1px 0 1px rgba(255,255,255,.1)',
                  borderRadius: b.left ? '2px 0 0 2px' : '0 2px 2px 0',
                }} />
              ))}
            </div>

            {/* floating badges */}
            <div className="ps-badge" style={{
              position: 'absolute',
              top: 40, left: -100,
              borderRadius: 16,
              padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(162,129,90,.12)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(162,129,90,.2)',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,.7)',
              whiteSpace: 'nowrap',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(38,77,42,.4)',
                border: '1px solid rgba(110,231,160,.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#6EE7A0" strokeWidth="2" style={{ width: 14, height: 14 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: 11, fontWeight: 600, color: IVORY }}>47 RSVPs confirmed</p>
                <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: 9, color: 'rgba(248,245,240,.4)' }}>Live · Updated just now</p>
              </div>
            </div>

            <div className="ps-badge" style={{
              position: 'absolute',
              bottom: 60, right: -110,
              borderRadius: 16,
              padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(162,129,90,.12)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(162,129,90,.2)',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,.7)',
              whiteSpace: 'nowrap',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(162,129,90,.2)',
                border: `1px solid rgba(162,129,90,.3)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" style={{ width: 14, height: 14 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: 11, fontWeight: 600, color: IVORY }}>QR scan active</p>
                <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: 9, color: 'rgba(248,245,240,.4)' }}>44 guests checked in at door</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: brand + headline ── */}
          <div className="ps-right" style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'flex-end', textAlign: 'right',
          }}>
            <p style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.52rem', letterSpacing: '.35em', textTransform: 'uppercase',
              color: GOLD, marginBottom: '1.5rem',
            }}>
              Maison RSVP
            </p>
            <h3 style={{
              fontFamily: 'var(--font-prata), Georgia, serif',
              fontSize: 'clamp(2rem,4vw,5rem)',
              lineHeight: .96, letterSpacing: '-.03em',
              color: IVORY, marginBottom: '2rem',
            }}>
              Invitation.<br />
              <em style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', color: GOLD }}>RSVP.</em><br />
              Dashboard.<br />
              <em style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', color: GOLD }}>Entrance.</em>
            </h3>
            <p style={{
              fontFamily: 'var(--font-garamond), Georgia, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(.82rem,1vw,.95rem)',
              color: 'rgba(248,245,240,.4)',
              lineHeight: 1.8, maxWidth: '28ch',
            }}>
              We hand you a single link. Your guests open a world. You track every reply, message, and arrival from one private dashboard.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
