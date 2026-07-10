'use client';

import { InfiniteSlider } from '@/components/ui/infinite-slider';

const LOGOS = [
  { src: '/logos/intercontinental.png', alt: 'InterContinental Hotels & Resorts' },
  { src: '/logos/marriott.png',         alt: 'Marriott Hotels & Resorts' },
  { src: '/logos/per-se.png',           alt: 'Per Se Hospitality Group' },
  { src: '/logos/acquafarina.png',      alt: 'Acquafarina' },
  { src: '/logos/social-corner.png',    alt: 'Social Corner' },
  { src: '/logos/ciclo.png',            alt: 'Ciclo Espresso & Cocktail' },
  { src: '/logos/boutique-hotels.png',  alt: 'Boutique Hotels & Resort' },
];

export function ClientLogoCloud() {
  return (
    <section
      aria-label="Clients and partners"
      style={{
        background: 'var(--ivory)',
        padding: 'clamp(3.5rem,6vw,5rem) 0',
        borderTop: '1px solid rgba(162,129,90,.08)',
        borderBottom: '1px solid rgba(162,129,90,.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Label */}
      <p style={{
        fontFamily: 'var(--font-manrope), sans-serif',
        fontSize: '.52rem',
        letterSpacing: '.42em',
        textTransform: 'uppercase',
        color: 'var(--mist)',
        opacity: .5,
        textAlign: 'center',
        marginBottom: 'clamp(2rem,4vw,3rem)',
      }}>
        Trusted by
      </p>

      {/* Fade edges */}
      <div style={{
        position: 'relative',
        maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
      }}>
        <InfiniteSlider gap={72} duration={55} durationOnHover={120}>
          {LOGOS.map(logo => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              loading="lazy"
              style={{
                height: 'clamp(18px, 2.2vw, 28px)',
                width: 'auto',
                filter: 'grayscale(1) brightness(0)',
                opacity: .28,
                userSelect: 'none',
                pointerEvents: 'none',
                flexShrink: 0,
              }}
            />
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}
