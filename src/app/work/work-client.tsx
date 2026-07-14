'use client';

import { useState, useEffect } from 'react';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { WORKS } from '@/lib/works';
import WorksCinematicCarousel from '@/components/ui/works-cinematic-carousel';
import { WorksVerticalStack } from '@/components/ui/works-vertical-stack';
import { TestimonialsMarquee } from '@/components/ui/testimonials-marquee';
import { ClientLogoCloud } from '@/components/ui/client-logo-cloud';

// Only show couples with a real built experience (page or experienceUrl)
const REAL_SLUGS = new Set([
  'oliver-and-charlotte',
  'thomas-and-grace',
  'oliver-and-daniela',
  'neil-and-riley',
  'santiago-and-luna',
  'noche-roja',
]);
const COUPLE_WORKS = WORKS.filter(w => REAL_SLUGS.has(w.slug) || !!w.experienceUrl);

export default function WorkIndex() {
  const [entered, setEntered]   = useState(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <>
      {/* Global grain */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 9990, pointerEvents: 'none',
        opacity: .028,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '220px', mixBlendMode: 'multiply',
      }} />

      <Nav light />

      <main style={{
        background: 'var(--ivory)', minHeight: '100vh',
        paddingTop: 'clamp(8rem,14vw,14rem)',
      }}>

        {/* ── Header ─────────────────────────────── */}
        <header style={{
          padding: '0 clamp(2rem,5vw,5rem) clamp(5rem,8vw,8rem)',
          opacity: entered ? 1 : 0,
          transform: entered ? 'none' : 'translateY(20px)',
          transition: 'opacity .9s ease, transform .9s ease',
        }}>
          <p style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: 'clamp(1.5rem,3vw,2.5rem)',
          }}>
            Selected Works
          </p>

          <div style={{
            display: 'flex', alignItems: 'flex-end',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem',
          }}>
            <h1 style={{
              fontFamily: 'var(--font-prata), Georgia, serif',
              fontSize: 'clamp(2.6rem,10vw,11rem)',
              lineHeight: .92, letterSpacing: '-.03em',
            }}>
              Every<br />commission<br />existed<br />
              <em style={{
                fontFamily: 'var(--font-garamond), Georgia, serif',
                fontStyle: 'italic', color: 'var(--gold)',
              }}>once.</em>
            </h1>

            <p style={{
              fontFamily: 'var(--font-garamond), Georgia, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(.9rem,1.2vw,1.1rem)',
              color: 'var(--mist)', maxWidth: '28ch', lineHeight: 1.75,
              paddingBottom: '.5rem',
            }}>
              We do not repeat our work. Each invitation
              is designed once, for one occasion,
              and retired.
            </p>
          </div>

          {/* gold rule */}
          <div style={{
            width: '100%', height: 1,
            background: 'linear-gradient(to right, var(--gold) 0%, rgba(162,129,90,.1) 40%, transparent 100%)',
            marginTop: 'clamp(4rem,7vw,7rem)',
            opacity: .5,
          }} />
        </header>

        {/* ── Cinematic commissions reel — desktop only ── */}
        {isMobile === false && <WorksCinematicCarousel works={COUPLE_WORKS} />}

        {/* ── Interactive vertical stack — mobile only ── */}
        {isMobile === true && <WorksVerticalStack works={COUPLE_WORKS} />}

        {/* ── Testimonials ────────────────────────── */}
        <div style={{ padding: '0 clamp(2rem,5vw,5rem)' }}>
          <TestimonialsMarquee />
        </div>

        {/* ── Trusted By ──────────────────────────── */}
        <ClientLogoCloud />

        {/* ── CTA ─────────────────────────────────── */}
        <section style={{
          borderTop: '1px solid var(--dust)',
          padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
          background: `radial-gradient(ellipse 70% 80% at 50% 50%, #F2EBE0 0%, transparent 65%), var(--ivory)`,
          position: 'relative', overflow: 'hidden',
        }}>
          <p style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: 'clamp(2rem,4vw,3rem)',
          }}>
            Begin Your Commission
          </p>
          <h2 style={{
            fontFamily: 'var(--font-prata), Georgia, serif',
            fontSize: 'clamp(2.2rem,5vw,5.5rem)',
            lineHeight: 1.05, letterSpacing: '-.02em',
            marginBottom: 'clamp(2rem,4vw,3rem)',
          }}>
            Your story<br />belongs here.
          </h2>
          <p style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(.9rem,1.2vw,1.1rem)',
            color: 'var(--mist)', lineHeight: 1.7,
            marginBottom: 'clamp(2.5rem,4vw,3.5rem)',
          }}>
            We accept a limited number of commissions each season.
          </p>
          <a
            href="/contact"
            style={{
              fontFamily: 'var(--font-garamond), Georgia, serif',
              fontSize: 'clamp(1rem,1.5vw,1.25rem)', letterSpacing: '.04em',
              color: 'var(--gold)', borderBottom: '1px solid rgba(162,129,90,.3)',
              paddingBottom: '.2em', transition: 'color .4s, border-color .4s',
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--ink)';
              e.currentTarget.style.borderBottomColor = 'var(--ink)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--gold)';
              e.currentTarget.style.borderBottomColor = 'rgba(162,129,90,.3)';
            }}
          >
            Begin a commission →
          </a>
        </section>

      </main>
      <Footer />
    </>
  );
}
