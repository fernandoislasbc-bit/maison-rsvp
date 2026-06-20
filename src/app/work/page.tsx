'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { WORKS } from '@/lib/works';

const CATEGORIES = ['All', ...Array.from(new Set(WORKS.map(w => w.category)))];

export default function WorkIndex() {
  const [active, setActive]     = useState('All');
  const [hovered, setHovered]   = useState<string | null>(null);
  const [entered, setEntered]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  const filtered = active === 'All' ? WORKS : WORKS.filter(w => w.category === active);

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
          {/* eyebrow */}
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
              fontSize: 'clamp(4rem,10vw,11rem)',
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

        {/* ── Filter tabs ─────────────────────────── */}
        <div style={{
          padding: 'clamp(2.5rem,4vw,4rem) clamp(2rem,5vw,5rem)',
          display: 'flex', gap: 'clamp(1rem,2vw,2rem)',
          flexWrap: 'wrap', alignItems: 'center',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase',
                color: active === cat ? 'var(--ink)' : 'var(--mist)',
                borderBottom: active === cat ? '1px solid var(--gold)' : '1px solid transparent',
                paddingBottom: '.25em',
                background: 'none', border: 'none',
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
                borderBottomColor: active === cat ? 'var(--gold)' : 'transparent',
                transition: 'color .3s, border-color .3s',
                cursor: 'none',
              }}
            >
              {cat}
            </button>
          ))}
          <span style={{
            marginLeft: 'auto',
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.58rem', letterSpacing: '.2em',
            color: 'var(--mist)',
          }}>
            {filtered.length} commission{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Work grid ───────────────────────────── */}
        <section style={{
          padding: '0 clamp(2rem,5vw,5rem) clamp(8rem,12vw,12rem)',
        }}>
          {/* Full-width featured — first item */}
          {filtered.length > 0 && (
            <FeaturedCard
              work={filtered[0]}
              hovered={hovered === filtered[0].slug}
              onEnter={() => setHovered(filtered[0].slug)}
              onLeave={() => setHovered(null)}
            />
          )}

          {/* Remaining as 2-col grid */}
          {filtered.length > 1 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,420px),1fr))',
              gap: 'clamp(1px,0.1vw,2px)',
              marginTop: 'clamp(1px,0.1vw,2px)',
            }}>
              {filtered.slice(1).map(work => (
                <GridCard
                  key={work.slug}
                  work={work}
                  hovered={hovered === work.slug}
                  onEnter={() => setHovered(work.slug)}
                  onLeave={() => setHovered(null)}
                />
              ))}
            </div>
          )}
        </section>

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
            Three commissions remaining this season.
          </p>
          <a
            href="mailto:commissions@maisonrsvp.com"
            style={{
              fontFamily: 'var(--font-garamond), Georgia, serif',
              fontSize: 'clamp(1rem,1.5vw,1.25rem)', letterSpacing: '.04em',
              color: 'var(--gold)', borderBottom: '1px solid rgba(162,129,90,.3)',
              paddingBottom: '.2em', transition: 'color .4s, border-color .4s',
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
            commissions@maisonrsvp.com
          </a>
        </section>

      </main>
      <Footer />
    </>
  );
}

/* ─── Featured card (full width) ─────────────────── */
function FeaturedCard({ work, hovered, onEnter, onLeave }: {
  work: typeof WORKS[0];
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <Link
      href={`/work/${work.slug}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
    >
      <article style={{
        position: 'relative', overflow: 'hidden',
        height: 'clamp(460px,72vh,820px)',
        marginBottom: 'clamp(1px,0.1vw,2px)',
      }}>
        <Image
          src={work.cover}
          alt={work.title}
          fill
          style={{
            objectFit: 'cover',
            transform: hovered ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 1.4s cubic-bezier(0.16,1,0.3,1)',
          }}
          sizes="100vw"
          priority
        />
        {/* dark gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to top, rgba(14,13,11,${hovered ? .72 : .55}) 0%, transparent 55%)`,
          transition: 'background .6s ease',
        }} />
        {/* grain */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px', mixBlendMode: 'multiply',
        }} />

        {/* Featured label */}
        <span style={{
          position: 'absolute', top: '2rem', left: '2rem',
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '.56rem', letterSpacing: '.4em', textTransform: 'uppercase',
          color: 'rgba(201,168,130,.7)',
          border: '1px solid rgba(201,168,130,.25)',
          padding: '.35em .8em',
        }}>
          {work.slug === 'the-crossing' ? 'Signature Experience' : 'Featured'}
        </span>

        {/* Text */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: 'clamp(2rem,4vw,4rem)',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem',
        }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.58rem', letterSpacing: '.35em', textTransform: 'uppercase',
              color: 'rgba(201,168,130,.7)', marginBottom: '.8rem',
            }}>
              {work.season} {work.year} &nbsp;·&nbsp; {work.location}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-prata), Georgia, serif',
              fontSize: 'clamp(2.2rem,5vw,5.5rem)',
              lineHeight: .95, letterSpacing: '-.02em',
              color: 'var(--ivory)',
            }}>
              {work.title}
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{
              fontFamily: 'var(--font-garamond), Georgia, serif',
              fontStyle: 'italic', fontSize: 'clamp(.85rem,1.1vw,1rem)',
              color: 'rgba(248,245,240,.45)', maxWidth: '28ch', lineHeight: 1.6,
              marginBottom: '1rem',
            }}>
              {work.tagline}
            </p>
            <span style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.58rem', letterSpacing: '.3em', textTransform: 'uppercase',
              color: 'rgba(201,168,130,.6)',
              display: 'inline-flex', alignItems: 'center', gap: '.5rem',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateX(0)' : 'translateX(-8px)',
              transition: 'opacity .4s, transform .4s',
            }}>
              Read the story &nbsp;→
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ─── Grid card ───────────────────────────────────── */
function GridCard({ work, hovered, onEnter, onLeave }: {
  work: typeof WORKS[0];
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <Link
      href={`/work/${work.slug}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
    >
      <article style={{ position: 'relative', overflow: 'hidden', height: 'clamp(380px,55vh,600px)' }}>
        <Image
          src={work.cover}
          alt={work.title}
          fill
          style={{
            objectFit: 'cover',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1)',
          }}
          sizes="50vw"
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to top, rgba(14,13,11,${hovered ? .78 : .52}) 0%, rgba(14,13,11,.05) 50%, transparent 100%)`,
          transition: 'background .5s ease',
        }} />
        {/* grain */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px', mixBlendMode: 'multiply',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: 'clamp(1.5rem,3vw,3rem)',
        }}>
          <p style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.56rem', letterSpacing: '.32em', textTransform: 'uppercase',
            color: 'rgba(201,168,130,.65)', marginBottom: '.6rem',
          }}>
            {work.category} &nbsp;·&nbsp; {work.year}
          </p>
          <h3 style={{
            fontFamily: 'var(--font-prata), Georgia, serif',
            fontSize: 'clamp(1.4rem,2.5vw,2.2rem)',
            lineHeight: 1.1, color: 'var(--ivory)', marginBottom: '.6rem',
          }}>
            {work.title}
          </h3>
          <p style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontStyle: 'italic', fontSize: 'clamp(.82rem,1vw,.95rem)',
            color: 'rgba(248,245,240,.4)', lineHeight: 1.6,
            maxHeight: hovered ? '4rem' : '0',
            overflow: 'hidden',
            transition: 'max-height .5s cubic-bezier(0.16,1,0.3,1)',
          }}>
            {work.tagline}
          </p>
        </div>
        {/* arrow hint */}
        <div style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem',
          width: 36, height: 36, borderRadius: '50%',
          border: '1px solid rgba(201,168,130,.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'scale(1)' : 'scale(.8)',
          transition: 'opacity .4s, transform .4s',
        }}>
          <span style={{ color: 'rgba(201,168,130,.8)', fontSize: '.7rem' }}>→</span>
        </div>
      </article>
    </Link>
  );
}

