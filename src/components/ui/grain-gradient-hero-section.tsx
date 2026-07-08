'use client';

import { GrainGradient, grainGradientPresets } from '@paper-design/shaders-react';

interface GrainHeroSectionProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

/**
 * Full-screen statement section over an animated grain-gradient shader,
 * tuned to the house palette: near-black espresso with molten gold.
 *
 * Tuning:
 *   colors / colorBack ... gold-and-black palette of the shader
 *   softness / intensity / noise / speed ... shader character (kept slow
 *   and smoky for a luxury feel; raise speed for more movement)
 */
export default function GrainHeroSection({
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  onCtaClick,
}: GrainHeroSectionProps) {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      // full-bleed: escape any padded parent container (e.g. the scroll-
      // expansion content wrapper) and span the entire viewport width
      style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)' }}
    >
      <GrainGradient
        {...grainGradientPresets[0].params}
        colorBack="#0A0703"
        colors={['#A2815A', '#D9B98A', '#5C4322', '#1C1207']}
        softness={0.85}
        intensity={0.5}
        noise={0.3}
        speed={0.5}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      />

      {/* soft vignette so text sits on a calmer center */}
      <div
        aria-hidden
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(10,7,3,.35) 0%, rgba(10,7,3,0) 55%), linear-gradient(to bottom, rgba(10,7,3,.55), transparent 22%, transparent 78%, rgba(10,7,3,.6))',
        }}
      />

      <div className="relative z-20 text-center px-6 sm:px-8 max-w-4xl mx-auto">
        {eyebrow && (
          <p
            className="mb-8"
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.58rem',
              letterSpacing: '.4em',
              textTransform: 'uppercase',
              color: 'rgba(217,185,138,.75)',
            }}
          >
            {eyebrow}
          </p>
        )}

        <h2
          role="heading"
          style={{
            fontFamily: 'var(--font-prata), Georgia, serif',
            fontSize: 'clamp(2.6rem,6.5vw,6.5rem)',
            lineHeight: 1.02,
            letterSpacing: '-.02em',
            color: '#F8F5F0',
            textShadow: '0 0 60px rgba(0,0,0,.45)',
          }}
        >
          {title}
        </h2>

        <p
          className="mx-auto mt-6"
          style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(1.6rem,3.4vw,3.2rem)',
            lineHeight: 1.2,
            color: '#D9B98A',
            textShadow: '0 0 40px rgba(0,0,0,.4)',
          }}
        >
          {subtitle}
        </p>

        {ctaLabel && (
          <button
            type="button"
            onClick={onCtaClick}
            className="mt-12 inline-block"
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.62rem',
              letterSpacing: '.3em',
              textTransform: 'uppercase',
              color: '#F8F5F0',
              background: 'transparent',
              border: '1px solid rgba(217,185,138,.45)',
              padding: '1.1em 2.6em',
              cursor: 'pointer',
              transition: 'background .4s ease, color .4s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(217,185,138,.92)';
              e.currentTarget.style.color = '#0A0703';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#F8F5F0';
            }}
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </section>
  );
}
