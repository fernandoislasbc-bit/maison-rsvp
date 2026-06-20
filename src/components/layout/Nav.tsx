'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/work',         label: 'Works' },
  { href: '/collection',   label: 'The Collection' },
  { href: '/experiences',  label: 'Experiences' },
  { href: '/process',      label: 'Our Process' },
  { href: '/journal',      label: 'Journal' },
  { href: '/about',        label: 'About' },
];

export default function Nav({ light = false, delayMs = 0 }: { light?: boolean; delayMs?: number }) {
  const [visible, setVisible] = useState(delayMs === 0);
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    if (delayMs === 0) return;
    const t = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* close menu on route change */
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const fg = light || scrolled ? 'var(--ink)' : 'var(--ivory)';
  const fgMuted = light || scrolled ? 'var(--mist)' : 'rgba(248,245,240,.5)';

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Main navigation"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 700,
          padding: 'clamp(1.2rem,2.5vw,2rem) clamp(2rem,5vw,5rem)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: scrolled ? 'rgba(248,245,240,.93)' : 'transparent',
          backdropFilter: scrolled ? 'blur(18px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(162,129,90,.1)' : 'none',
          opacity: visible ? 1 : 0,
          transition: 'background .4s ease, backdrop-filter .4s ease, border-color .4s, opacity .9s ease',
        }}
      >
        {/* Wordmark */}
        <Link
          href="/"
          aria-label="Maison RSVP — Home"
          style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontSize: '.82rem', letterSpacing: '.24em', textTransform: 'uppercase',
            color: fg, transition: 'color .3s',
            textDecoration: 'none',
          }}
        >
          Maison RSVP
        </Link>

        {/* Desktop links */}
        <ul
          role="list"
          style={{
            display: 'flex', alignItems: 'center',
            gap: 'clamp(1.5rem,2.5vw,2.8rem)',
            listStyle: 'none', margin: 0, padding: 0,
          }}
          className="hidden-mobile"
        >
          {LINKS.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '.6rem', fontWeight: 400,
                  letterSpacing: '.22em', textTransform: 'uppercase',
                  color: pathname.startsWith(link.href) ? (scrolled ? 'var(--gold)' : 'rgba(201,168,130,.9)') : fgMuted,
                  transition: 'color .3s',
                  textDecoration: 'none',
                  borderBottom: pathname.startsWith(link.href) ? '1px solid currentColor' : '1px solid transparent',
                  paddingBottom: '.1em',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = scrolled ? 'var(--ink)' : 'var(--ivory)')}
                onMouseLeave={e => (e.currentTarget.style.color = pathname.startsWith(link.href) ? (scrolled ? 'var(--gold)' : 'rgba(201,168,130,.9)') : fgMuted)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href="/contact"
          style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontStyle: 'italic', fontSize: '.88rem', letterSpacing: '.06em',
            color: scrolled ? 'var(--gold)' : 'rgba(201,168,130,.85)',
            borderBottom: '1px solid transparent',
            transition: 'color .3s, border-color .3s',
            textDecoration: 'none',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderBottomColor = 'currentColor';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderBottomColor = 'transparent';
          }}
          className="hidden-mobile"
        >
          Begin a commission
        </Link>

        {/* Hamburger — mobile */}
        <button
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
          style={{
            background: 'none', border: 'none',
            minWidth: 44, minHeight: 44,
            display: 'none', flexDirection: 'column', gap: 5,
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
          className="show-mobile"
        >
          <span style={{ display: 'block', width: 22, height: 1, background: fg, transition: 'all .3s', transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none' }} />
          <span style={{ display: 'block', width: 22, height: 1, background: fg, transition: 'all .3s', opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: 'block', width: 22, height: 1, background: fg, transition: 'all .3s', transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        aria-hidden={!menuOpen}
        // inert prevents keyboard focus reaching hidden menu items
        {...(!menuOpen ? { inert: true } : {})}
        style={{
          position: 'fixed', inset: 0, zIndex: 690,
          background: 'var(--ivory)',
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden',
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity .4s ease, visibility .4s',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 'clamp(1.5rem,4vw,3rem)',
        }}
      >
        {/* grain */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .028,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '220px', mixBlendMode: 'multiply',
        }} />
        {LINKS.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              fontFamily: 'var(--font-prata), Georgia, serif',
              fontSize: 'clamp(1.8rem,6vw,3.5rem)',
              letterSpacing: '-.015em',
              color: pathname.startsWith(link.href) ? 'var(--gold)' : 'var(--ink)',
              textDecoration: 'none',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'none' : 'translateY(12px)',
              transition: `opacity .5s ease ${i * 60}ms, transform .5s ease ${i * 60}ms`,
            }}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/contact"
          style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontStyle: 'italic', fontSize: 'clamp(1rem,2.5vw,1.4rem)',
            color: 'var(--gold)', textDecoration: 'none',
            marginTop: '1rem',
            opacity: menuOpen ? 1 : 0,
            transition: `opacity .5s ease ${LINKS.length * 60 + 60}ms`,
          }}
        >
          Begin a commission →
        </Link>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
        @media (min-width: 1024px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
