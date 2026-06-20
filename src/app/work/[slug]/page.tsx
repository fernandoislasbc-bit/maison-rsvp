'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getWork, WORKS } from '@/lib/works';

export default function WorkStory() {
  const { slug }  = useParams<{ slug: string }>();
  const work      = getWork(slug);

  const [entered,    setEntered]    = useState(false);
  const [imgLoaded,  setImgLoaded]  = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, []);

  /* Parallax on hero image */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onScroll = () => {
      const y = window.scrollY;
      hero.style.transform = `scale(1.08) translateY(${y * 0.22}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Nav glass */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => {
      const past = window.scrollY > 60;
      nav.style.background     = past ? 'rgba(248,245,240,.92)' : 'transparent';
      nav.style.backdropFilter = past ? 'blur(18px)' : 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Not found */
  if (!work) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ivory)' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>
            Commission not found
          </p>
          <Link href="/work" style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', color: 'var(--ink)' }}>
            Return to all works
          </Link>
        </div>
      </div>
    );
  }

  /* Next work for the end-of-page navigation */
  const currentIdx = WORKS.findIndex(w => w.slug === slug);
  const nextWork   = WORKS[(currentIdx + 1) % WORKS.length];

  return (
    <>
      {/* Global grain */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 9990, pointerEvents: 'none',
        opacity: .028,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '220px', mixBlendMode: 'multiply',
      }} />

      <Cursor />

      {/* Nav */}
      <nav ref={navRef} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 800,
        padding: 'clamp(1.5rem,3vw,2.5rem) clamp(2rem,5vw,5rem)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'background .4s ease',
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-garamond), Georgia, serif',
          fontSize: '.82rem', letterSpacing: '.22em', textTransform: 'uppercase',
          color: 'var(--ivory)', mixBlendMode: 'difference',
        }}>
          Maison RSVP
        </Link>
        <Link href="/work" style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase',
          color: 'var(--ivory)', mixBlendMode: 'difference',
          display: 'inline-flex', alignItems: 'center', gap: '.5rem',
        }}>
          ← All works
        </Link>
      </nav>

      <main style={{ background: 'var(--ivory)' }}>

        {/* ── Hero ──────────────────────────────── */}
        <section style={{
          position: 'relative', height: '100svh', overflow: 'hidden',
          background: 'var(--deep)',
        }}>
          <div
            ref={heroRef}
            style={{
              position: 'absolute', inset: '-8%',
              transform: 'scale(1.08)',
              transition: 'opacity .8s ease',
              opacity: imgLoaded ? 1 : 0,
            }}
          >
            <Image
              src={work.cover}
              alt={work.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="100vw"
              priority
              onLoad={() => setImgLoaded(true)}
            />
          </div>

          {/* Cinematic overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              linear-gradient(to bottom,
                rgba(14,13,11,.45) 0%,
                rgba(14,13,11,.15) 35%,
                rgba(14,13,11,.15) 60%,
                rgba(14,13,11,.85) 100%
              )
            `,
          }} />

          {/* grain on hero */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .05,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px', mixBlendMode: 'screen',
          }} />

          {/* Hero text */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: 'clamp(3rem,6vw,6rem) clamp(2rem,5vw,5rem)',
            opacity: entered ? 1 : 0,
            transform: entered ? 'none' : 'translateY(16px)',
            transition: 'opacity 1s ease .2s, transform 1s ease .2s',
          }}>
            <p style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase',
              color: 'rgba(201,168,130,.7)', marginBottom: 'clamp(1rem,2vw,1.5rem)',
            }}>
              {work.category} &nbsp;·&nbsp; {work.location} &nbsp;·&nbsp; {work.season} {work.year}
            </p>
            <h1 style={{
              fontFamily: 'var(--font-prata), Georgia, serif',
              fontSize: 'clamp(3.5rem,9vw,10rem)',
              lineHeight: .92, letterSpacing: '-.03em',
              color: 'var(--ivory)',
              marginBottom: 'clamp(1.5rem,3vw,2.5rem)',
            }}>
              {work.title}
            </h1>
            <p style={{
              fontFamily: 'var(--font-garamond), Georgia, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(1rem,1.6vw,1.3rem)',
              color: 'rgba(248,245,240,.5)',
              maxWidth: '40ch', lineHeight: 1.6,
            }}>
              {work.tagline}
            </p>
          </div>

          {/* Scroll hint */}
          <div style={{
            position: 'absolute', bottom: 'clamp(2.5rem,4vw,4rem)', right: 'clamp(2rem,5vw,5rem)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem',
            opacity: entered ? .5 : 0, transition: 'opacity 1s ease .8s',
          }}>
            <span style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.5rem', letterSpacing: '.35em', textTransform: 'uppercase',
              color: 'var(--ivory)', writingMode: 'vertical-rl',
            }}>
              Scroll
            </span>
            <div style={{ width: 1, height: 40, background: 'rgba(248,245,240,.2)', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '100%',
                background: 'rgba(162,129,90,.7)',
                animation: 'scroll-line 2s linear infinite',
              }} />
            </div>
            <style>{`
              @keyframes scroll-line {
                0%   { transform: translateY(-100%); }
                100% { transform: translateY(100%); }
              }
            `}</style>
          </div>
        </section>

        {/* ── Details strip ─────────────────────── */}
        <div style={{
          background: 'var(--deep)', color: 'var(--ivory)',
          padding: 'clamp(3rem,5vw,5rem) clamp(2rem,5vw,5rem)',
          display: 'flex', flexWrap: 'wrap',
          gap: 'clamp(2rem,5vw,5rem)',
          borderBottom: '1px solid rgba(248,245,240,.05)',
        }}>
          {Object.entries(work.details).map(([key, val]) => (
            <div key={key}>
              <p style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '.52rem', letterSpacing: '.35em', textTransform: 'uppercase',
                color: 'rgba(162,129,90,.6)', marginBottom: '.4rem',
              }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </p>
              <p style={{
                fontFamily: 'var(--font-prata), Georgia, serif',
                fontSize: 'clamp(1.1rem,2vw,1.6rem)',
                color: 'var(--ivory)',
              }}>
                {val}
              </p>
            </div>
          ))}
        </div>

        {/* ── Story ─────────────────────────────── */}
        <article style={{
          padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)',
          background: `
            radial-gradient(ellipse 80% 40% at 50% 0%, #F2EBE0 0%, transparent 50%),
            var(--ivory)
          `,
        }}>
          {/* Intro — large */}
          <div style={{
            maxWidth: 860,
            margin: '0 auto clamp(5rem,8vw,8rem)',
          }}>
            <p style={{
              fontFamily: 'var(--font-prata), Georgia, serif',
              fontSize: 'clamp(1.5rem,3vw,2.8rem)',
              lineHeight: 1.35, letterSpacing: '-.01em',
              color: 'var(--ink)',
            }}>
              {work.intro}
            </p>
          </div>

          {/* First image — full bleed */}
          {work.images[0] && (
            <div style={{ position: 'relative', height: 'clamp(400px,65vh,780px)', overflow: 'hidden', marginBottom: 'clamp(5rem,8vw,8rem)' }}>
              <Image
                src={work.images[0]}
                alt=""
                fill
                style={{ objectFit: 'cover', transform: 'scale(1.04)' }}
                sizes="100vw"
              />
              <div aria-hidden style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .035,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: '180px', mixBlendMode: 'multiply',
              }} />
            </div>
          )}

          {/* Body paragraphs — editorial 2 col */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,420px),1fr))',
            gap: 'clamp(3rem,6vw,6rem)',
            maxWidth: 1100, margin: '0 auto',
          }}>
            {work.body.map((para, i) => (
              <p key={i} style={{
                fontFamily: 'var(--font-garamond), Georgia, serif',
                fontSize: 'clamp(1rem,1.35vw,1.25rem)',
                lineHeight: 1.85, color: 'var(--mist)',
              }}>
                {para}
              </p>
            ))}
          </div>

          {/* Gold rule */}
          <div style={{
            width: 30, height: 1, background: 'var(--gold)', opacity: .4,
            margin: 'clamp(5rem,8vw,8rem) auto',
          }} />

          {/* Second + third images — side by side */}
          {work.images.length >= 3 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,280px), 1fr))',
              gap: 2, marginBottom: 'clamp(5rem,8vw,8rem)',
            }}>
              {work.images.slice(1, 3).map((img, i) => (
                <div key={i} style={{ position: 'relative', height: 'clamp(300px,55vh,700px)', overflow: 'hidden' }}>
                  <Image
                    src={img}
                    alt=""
                    fill
                    style={{ objectFit: 'cover', transform: 'scale(1.04)' }}
                    sizes="50vw"
                  />
                  <div aria-hidden style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .04,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: '180px', mixBlendMode: 'multiply',
                  }} />
                </div>
              ))}
            </div>
          )}

          {/* Pull quote */}
          <div style={{
            maxWidth: 700, margin: '0 auto',
            padding: 'clamp(3rem,5vw,5rem) 0',
            textAlign: 'center',
          }}>
            <span style={{
              fontFamily: 'var(--font-prata), Georgia, serif',
              fontSize: 'clamp(3rem,6vw,6rem)',
              color: 'var(--gold)', opacity: .2, lineHeight: 1,
              display: 'block', marginBottom: '1rem',
            }}>
              &ldquo;
            </span>
            <p style={{
              fontFamily: 'var(--font-prata), Georgia, serif',
              fontSize: 'clamp(1.3rem,2.5vw,2.2rem)',
              lineHeight: 1.3, letterSpacing: '-.01em',
              color: 'var(--ink)',
            }}>
              {work.tagline}
            </p>
          </div>
        </article>

        {/* ── Next commission ───────────────────── */}
        <Link href={`/work/${nextWork.slug}`} style={{
          display: 'block', textDecoration: 'none', color: 'inherit',
        }}>
          <section style={{
            position: 'relative', height: 'clamp(380px,60vh,700px)',
            overflow: 'hidden', background: 'var(--deep)',
          }}>
            <Image
              src={nextWork.cover}
              alt={nextWork.title}
              fill
              style={{ objectFit: 'cover', transform: 'scale(1.04)', transition: 'transform .8s ease' }}
              sizes="100vw"
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(14,13,11,.8) 0%, rgba(14,13,11,.4) 100%)',
            }} />
            <div aria-hidden style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .05,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px', mixBlendMode: 'screen',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              textAlign: 'center',
            }}>
              <p style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '.56rem', letterSpacing: '.4em', textTransform: 'uppercase',
                color: 'rgba(201,168,130,.6)', marginBottom: '1.5rem',
              }}>
                Next commission
              </p>
              <h2 style={{
                fontFamily: 'var(--font-prata), Georgia, serif',
                fontSize: 'clamp(2rem,5vw,5rem)',
                lineHeight: .95, letterSpacing: '-.02em',
                color: 'var(--ivory)', marginBottom: '.8rem',
              }}>
                {nextWork.title}
              </h2>
              <p style={{
                fontFamily: 'var(--font-garamond), Georgia, serif',
                fontStyle: 'italic', fontSize: 'clamp(.85rem,1.1vw,1rem)',
                color: 'rgba(248,245,240,.4)',
              }}>
                {nextWork.tagline}
              </p>
            </div>
          </section>
        </Link>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid var(--dust)',
          padding: 'clamp(3rem,5vw,4.5rem) clamp(2rem,5vw,5rem)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1rem', background: 'var(--ivory)',
        }}>
          <Link href="/work" style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.58rem', letterSpacing: '.3em', textTransform: 'uppercase',
            color: 'var(--mist)', textDecoration: 'none',
          }}>
            ← All works
          </Link>
          <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontSize: '.82rem', letterSpacing: '.2em', textTransform: 'uppercase' }}>
            Maison RSVP
          </p>
          <a href="mailto:commissions@maisonrsvp.com" style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontStyle: 'italic', fontSize: '.85rem', color: 'var(--gold)',
          }}>
            Begin a commission
          </a>
        </footer>
      </main>
    </>
  );
}

/* ─── Cursor ─────────────────────────────────────── */
function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    let mx = -100, my = -100, rx = -100, ry = -100;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMove);
    let raf: number;
    const tick = () => {
      rx += (mx - rx) * .1; ry += (my - ry) * .1;
      dot.style.transform  = `translate(${mx - 4}px,${my - 4}px)`;
      ring.style.transform = `translate(${rx - 18}px,${ry - 18}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dotRef} aria-hidden style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', pointerEvents: 'none', mixBlendMode: 'multiply' }} />
      <div ref={ringRef} aria-hidden style={{ position: 'fixed', top: 0, left: 0, zIndex: 9998, width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(162,129,90,.35)', pointerEvents: 'none' }} />
    </>
  );
}
