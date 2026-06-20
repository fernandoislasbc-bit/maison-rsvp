'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{
        borderTop: '1px solid var(--dust)',
        background: `
          radial-gradient(ellipse 80% 100% at 50% 100%, #F0E9DE 0%, transparent 60%),
          var(--ivory)
        `,
      }}
    >
      {/* Main footer content */}
      <div style={{
        padding: 'clamp(5rem,8vw,8rem) clamp(2rem,5vw,5rem) clamp(3rem,5vw,4rem)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,200px),1fr))',
        gap: 'clamp(3rem,5vw,5rem)',
      }}>
        {/* Brand */}
        <div>
          <p style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontSize: '1rem', letterSpacing: '.22em', textTransform: 'uppercase',
            color: 'var(--ink)', marginBottom: '1.2rem',
          }}>
            Maison RSVP
          </p>
          <p style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontStyle: 'italic', fontSize: '.88rem',
            color: 'var(--mist)', lineHeight: 1.75, maxWidth: '24ch',
          }}>
            The invitation is the first act of the story. We compose it by private commission only.
          </p>
          <p style={{
            marginTop: '1.5rem',
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.56rem', letterSpacing: '.3em', textTransform: 'uppercase',
            color: 'var(--gold)',
          }}>
            Vancouver · London · Lake Como
          </p>
        </div>

        {/* Commissions */}
        <div>
          <p style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.56rem', letterSpacing: '.35em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: '1.5rem',
          }}>
            Commissions
          </p>
          <nav aria-label="Commission links">
            {[
              { href: '/collection',  label: 'The Collection' },
              { href: '/experiences', label: 'Experiences' },
              { href: '/process',     label: 'Our Process' },
              { href: '/contact',     label: 'Begin a Commission' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{
                display: 'block',
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '.62rem', letterSpacing: '.1em',
                color: 'var(--mist)', marginBottom: '.8rem',
                textDecoration: 'none', transition: 'color .3s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--mist)')}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Studio */}
        <div>
          <p style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.56rem', letterSpacing: '.35em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: '1.5rem',
          }}>
            Studio
          </p>
          <nav aria-label="Studio links">
            {[
              { href: '/work',          label: 'Portfolio' },
              { href: '/about',         label: 'About Maison RSVP' },
              { href: '/journal',       label: 'Journal' },
              { href: '/partnerships',  label: 'Planner Partnerships' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{
                display: 'block',
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '.62rem', letterSpacing: '.1em',
                color: 'var(--mist)', marginBottom: '.8rem',
                textDecoration: 'none', transition: 'color .3s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--mist)')}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <p style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.56rem', letterSpacing: '.35em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: '1.5rem',
          }}>
            Contact
          </p>
          <a href="mailto:commissions@maisonrsvp.com" style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontStyle: 'italic', fontSize: '.9rem',
            color: 'var(--ink)', display: 'block',
            marginBottom: '1rem', textDecoration: 'none',
            transition: 'color .3s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink)')}>
            commissions@maisonrsvp.com
          </a>
          <p style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.58rem', letterSpacing: '.1em',
            color: 'var(--mist)', lineHeight: 1.7,
          }}>
            New commissions open quarterly.<br />
            Three remain this season.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid var(--dust)',
        padding: 'clamp(1.5rem,3vw,2rem) clamp(2rem,5vw,5rem)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem',
      }}>
        <p style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '.54rem', letterSpacing: '.15em',
          color: 'rgba(14,13,11,0.45)',
        }}>
          © {new Date().getFullYear()} Maison RSVP. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { href: '/privacy', label: 'Privacy' },
            { href: '/terms',   label: 'Terms' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.54rem', letterSpacing: '.15em',
              color: 'rgba(14,13,11,0.45)', textDecoration: 'none', transition: 'color .3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--mist)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(14,13,11,0.45)')}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
