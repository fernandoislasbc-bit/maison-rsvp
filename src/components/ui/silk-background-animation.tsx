'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/**
 * Silk background hero — opening section of the site.
 * Animated gold-brown velvet canvas with the Maison RSVP wordmark.
 *
 * Tuning:
 *   speed / scale / noiseIntensity ... silk pattern motion + density
 *   SILK_R/G/B ....................... velvet tint (gold-brown luxury)
 *   RENDER_SCALE ..................... internal resolution (lower = faster,
 *                                      softer velvet; CSS stretches to fill)
 */
const SILK_R = 168;
const SILK_G = 124;
const SILK_B = 76;
const RENDER_SCALE = 0.4;

export const Component = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const speed = 0.02;
    const scale = 2;
    const noiseIntensity = 0.8;

    const resizeCanvas = () => {
      // Render at reduced internal resolution; CSS stretches the canvas to
      // the full viewport. Filling EVERY pixel of a smaller buffer is both
      // much cheaper per frame and smoother-looking than skip-writing every
      // other pixel of a full-size buffer (which reads as a dotted grid).
      canvas.width = Math.max(1, Math.floor(window.innerWidth * RENDER_SCALE));
      canvas.height = Math.max(1, Math.floor(window.innerHeight * RENDER_SCALE));
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Simple noise function
    const noise = (x: number, y: number) => {
      const G = 2.71828;
      const rx = G * Math.sin(G * x);
      const ry = G * Math.sin(G * y);
      return (rx * ry * (1 + x)) % 1;
    };

    const animate = () => {
      const { width, height } = canvas;

      // Canvas can be 0-sized on the very first frame (before layout) —
      // createImageData throws IndexSizeError on a zero dimension.
      if (width === 0 || height === 0) {
        resizeCanvas();
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Create silk-like pattern (fills every pixel of the small buffer)
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const u = (x / width) * scale;
          const v = (y / height) * scale;

          const tOffset = speed * time;
          const tex_x = u;
          const tex_y = v + 0.03 * Math.sin(8.0 * tex_x - tOffset);

          const pattern =
            0.6 +
            0.4 *
              Math.sin(
                5.0 *
                  (tex_x +
                    tex_y +
                    Math.cos(3.0 * tex_x + 5.0 * tex_y) +
                    0.02 * tOffset) +
                  Math.sin(20.0 * (tex_x + tex_y - 0.1 * tOffset))
              );

          const rnd = noise(x, y);
          const intensity = Math.max(0, pattern - (rnd / 15.0) * noiseIntensity);

          // Gold-brown luxury velvet: dark espresso base + champagne-bronze highlights
          const r = Math.floor(24 + SILK_R * intensity);
          const g = Math.floor(15 + SILK_G * intensity);
          const b = Math.floor(8 + SILK_B * intensity);
          const a = 255;

          const index = (y * width + x) * 4;
          data[index] = r;
          data[index + 1] = g;
          data[index + 2] = b;
          data[index + 3] = a;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Add subtle overlay for depth
      const overlayGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) / 2
      );
      overlayGradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
      overlayGradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');

      ctx.fillStyle = overlayGradient;
      ctx.fillRect(0, 0, width, height);

      time += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    if (!reducedMotion) {
      animate();
    } else {
      // Static fallback: fill once, no rAF loop
      resizeCanvas();
      animate();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [reducedMotion]);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(2rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUpDelay {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInCorner {
          from {
            opacity: 0;
            transform: translateY(-1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }

        .animate-fade-in-up-delay {
          animation: fadeInUpDelay 1s ease-out 0.3s forwards;
        }

        .animate-fade-in-corner {
          animation: fadeInCorner 1s ease-out 0.9s forwards;
        }

        .silk-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }
      `}</style>

      <div className="relative h-screen w-full overflow-hidden bg-black">
        {/* Animated Silk Background */}
        <canvas ref={canvasRef} className="silk-canvas" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

        {/* Content */}
        <div className="relative z-20 flex h-full items-center justify-center">
          <div className="text-center px-8">
            {/* Main Title */}
            <h1
              className={`
                text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem] xl:text-[10rem]
                font-light tracking-[-0.04em] leading-none
                text-white mix-blend-difference
                opacity-0
                ${isLoaded ? 'animate-fade-in-up' : ''}
              `}
              style={{
                fontFamily: 'var(--font-prata), ui-serif, Georgia, serif',
                textShadow: '0 0 40px rgba(255, 255, 255, 0.1)',
              }}
            >
              Maison&nbsp;RSVP
            </h1>

            {/* Subtitle */}
            <div
              className={`
                mt-8 text-sm md:text-base lg:text-lg
                font-extralight tracking-[0.3em] uppercase
                text-gray-300/80 mix-blend-overlay
                opacity-0
                ${isLoaded ? 'animate-fade-in-up-delay' : ''}
              `}
              style={{ fontFamily: 'var(--font-manrope), ui-sans-serif, sans-serif' }}
            >
              <span className="inline-block">Weddings</span>
              <span className="mx-4 text-gray-500">•</span>
              <span className="inline-block">Celebrations</span>
              <span className="mx-4 text-gray-500">•</span>
              <span className="inline-block">Legacies</span>
            </div>

            {/* Clarifying tagline — what we actually do */}
            <p
              className={`mt-6 opacity-0 ${isLoaded ? 'animate-fade-in-corner' : ''}`}
              style={{
                fontFamily: 'var(--font-garamond), Georgia, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(.85rem, 1.1vw, 1rem)',
                color: 'rgba(248,245,240,0.52)',
                letterSpacing: '.04em',
                lineHeight: 1.6,
              }}
            >
              Bespoke cinematic digital invitations&nbsp;&mdash;&nbsp;composed once, for one occasion.
            </p>

            {/* Hero CTAs */}
            <div
              className={`mt-10 opacity-0 ${isLoaded ? 'animate-fade-in-corner' : ''}`}
              style={{ display: 'flex', gap: 'clamp(1.5rem,3vw,2.5rem)', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}
            >
              {/* Primary CTA opens a real cinematic invitation directly —
                  the product itself, not a marketing page about it. */}
              <Link
                href="/experiences/neil-and-riley/index.html?code=BMONT1"
                style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '.6rem', letterSpacing: '.28em', textTransform: 'uppercase',
                  color: 'var(--ivory)',
                  background: 'rgba(162,129,90,.85)',
                  padding: '.85em 1.8em',
                  borderRadius: '1px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  minHeight: 44, display: 'inline-flex', alignItems: 'center',
                  transition: 'background .3s',
                }}
              >
                See a live invitation
              </Link>
              {/* Secondary CTA moves the visitor from "feel" to "understand"
                  — the whole platform in two minutes. Committing (Begin a
                  commission) lives in the persistent top bar and the closing
                  chapter, where a warmed visitor actually converts. */}
              <Link
                href="/nr/demo"
                style={{
                  fontFamily: 'var(--font-garamond), Georgia, serif',
                  fontStyle: 'italic',
                  fontSize: 'clamp(.9rem, 1.1vw, 1rem)',
                  color: 'rgba(248,245,240,0.65)',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(248,245,240,0.25)',
                  paddingBottom: '.15em',
                  minHeight: 44, display: 'inline-flex', alignItems: 'flex-end',
                }}
              >
                See how it works &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-30 opacity-0 ${isLoaded ? 'animate-fade-in-corner' : ''}`}
          aria-hidden
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
        >
          <span style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.5rem', letterSpacing: '.35em', textTransform: 'uppercase',
            color: 'rgba(248,245,240,0.3)',
          }}>
            Scroll
          </span>
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none" style={{ opacity: 0.35 }}>
            <rect x="4.5" y="0" width="3" height="10" rx="1.5" fill="white" style={{
              animation: 'scrollDot 1.8s ease-in-out infinite',
            }} />
            <line x1="6" y1="14" x2="6" y2="20" stroke="white" strokeWidth="1" />
          </svg>
        </div>
        <style>{`
          @keyframes scrollDot {
            0%, 100% { transform: translateY(0); opacity: 0.35; }
            50% { transform: translateY(6px); opacity: 0.7; }
          }
        `}</style>

        {/* Corner Accent */}
        <div
          className={`
            absolute top-8 left-8 z-30
            text-xs font-light tracking-widest uppercase
            text-gray-500/40 mix-blend-overlay
            opacity-0
            ${isLoaded ? 'animate-fade-in-corner' : ''}
          `}
        >
          MMXXV
        </div>
      </div>
    </>
  );
};

export default Component;
