'use client';

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc?: string;
  title?: string;
  subtitle?: string;
  scrollToExpand?: string;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  subtitle,
  scrollToExpand = 'Scroll to enter',
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress]       = useState(0);
  const [showContent, setShowContent]             = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY]             = useState(0);
  const [isMobile, setIsMobile]                   = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);

  /* Reset when mediaType changes */
  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, [mediaType]);

  /* Mobile detection */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* Wheel + touch scroll hijack */
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const delta = e.deltaY * 0.0009;
        const next  = Math.min(Math.max(scrollProgress + delta, 0), 1);
        setScrollProgress(next);
        if (next >= 1) { setMediaFullyExpanded(true); setShowContent(true); }
        else if (next < 0.75) setShowContent(false);
      }
    };

    const handleTouchStart = (e: TouchEvent) => setTouchStartY(e.touches[0].clientY);

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const factor = deltaY < 0 ? 0.008 : 0.005;
        const next = Math.min(Math.max(scrollProgress + deltaY * factor, 0), 1);
        setScrollProgress(next);
        if (next >= 1) { setMediaFullyExpanded(true); setShowContent(true); }
        else if (next < 0.75) setShowContent(false);
        setTouchStartY(e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => setTouchStartY(0);
    const handleScroll   = () => { if (!mediaFullyExpanded) window.scrollTo(0, 0); };

    window.addEventListener('wheel',      handleWheel      as EventListener, { passive: false });
    window.addEventListener('scroll',     handleScroll);
    window.addEventListener('touchstart', handleTouchStart as EventListener, { passive: false });
    window.addEventListener('touchmove',  handleTouchMove  as EventListener, { passive: false });
    window.addEventListener('touchend',   handleTouchEnd);

    return () => {
      window.removeEventListener('wheel',      handleWheel      as EventListener);
      window.removeEventListener('scroll',     handleScroll);
      window.removeEventListener('touchstart', handleTouchStart as EventListener);
      window.removeEventListener('touchmove',  handleTouchMove  as EventListener);
      window.removeEventListener('touchend',   handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  /* ── Derived values ──────────────────────────── */
  const p = scrollProgress;

  /* Media box: starts small-centred, expands to full viewport */
  const mediaW = isMobile
    ? `${Math.min(85 + p * 15, 100)}vw`
    : `${300 + p * 1250}px`;
  const mediaH = isMobile
    ? `${Math.min(50 + p * 50, 100)}dvh`
    : `${400 + p * 400}px`;

  /* Border-radius collapses to 0 as it goes full-screen */
  const radius = `${Math.max(16 - p * 16, 0)}px`;

  /* Text slides apart as media expands */
  const textShift = p * (isMobile ? 35 : 28);

  /* Overlay darkens as media expands (cinematic feel) */
  const overlayOpacity = 0.55 - p * 0.35;

  /* Warm gold tint on the background fades as we expand */
  const bgOpacity = 1 - p;

  /* ─── Title split ──────────────────────────── */
  const words      = title ? title.split(' ') : [];
  const half       = Math.ceil(words.length / 2);
  const titleTop   = words.slice(0, half).join(' ');
  const titleBottom= words.slice(half).join(' ');

  return (
    <div ref={sectionRef} className="overflow-x-hidden">
      <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh]">

          {/* ── Background atmosphere ─────────────── */}
          <motion.div
            className="absolute inset-0 z-0"
            animate={{ opacity: bgOpacity }}
            transition={{ duration: 0.08 }}
          >
            {bgImageSrc ? (
              <Image
                src={bgImageSrc}
                alt=""
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
              />
            ) : (
              /* Warm ivory atmosphere when no bg image */
              <div
                className="w-full h-full"
                style={{
                  background: `
                    radial-gradient(ellipse 120% 80% at 55% 40%, #EDE5D8 0%, transparent 55%),
                    radial-gradient(ellipse 70% 100% at 90% 80%, #E2D8C8 0%, transparent 50%),
                    linear-gradient(160deg, #F5F0E8 0%, #EDE3D4 60%, #F8F5F0 100%)
                  `,
                }}
              />
            )}
            {/* warm paper grain over background */}
            <div
              className="absolute inset-0"
              style={{
                opacity: 0.032,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: '220px',
                mixBlendMode: 'multiply',
              }}
            />
          </motion.div>

          {/* ── Main stage ───────────────────────── */}
          <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-[100dvh] relative">

              {/* ── Media box ─────────────────────── */}
              <div
                className="absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: mediaW,
                  height: mediaH,
                  maxWidth:  '100vw',
                  maxHeight: '100dvh',
                  borderRadius: radius,
                  overflow: 'hidden',
                  boxShadow: p < 0.95
                    ? `0 ${30 - p * 30}px ${80 - p * 80}px rgba(14,13,11,${0.35 - p * 0.35})`
                    : 'none',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                {mediaType === 'video' ? (
                  <div className="relative w-full h-full pointer-events-none">
                    <video
                      src={mediaSrc}
                      poster={posterSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                      disablePictureInPicture
                    />
                    {/* Cinematic overlay */}
                    <motion.div
                      className="absolute inset-0"
                      animate={{ opacity: overlayOpacity }}
                      transition={{ duration: 0.08 }}
                      style={{
                        background: `linear-gradient(
                          to bottom,
                          rgba(14,13,11,${overlayOpacity * 0.6}) 0%,
                          rgba(14,13,11,${overlayOpacity * 0.2}) 40%,
                          rgba(14,13,11,${overlayOpacity * 0.2}) 60%,
                          rgba(14,13,11,${overlayOpacity * 0.8}) 100%
                        )`,
                      }}
                    />
                    {/* Warm grain over video */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        opacity: 0.045,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        backgroundSize: '200px',
                        mixBlendMode: 'screen',
                      }}
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={mediaSrc}
                      alt={title ?? 'Media'}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                    <motion.div
                      className="absolute inset-0"
                      animate={{ opacity: overlayOpacity }}
                      transition={{ duration: 0.08 }}
                      style={{ background: `rgba(14,13,11,${overlayOpacity})` }}
                    />
                  </div>
                )}

                {/* ── Chapter label inside media ─── */}
                <motion.div
                  className="absolute top-0 left-0 right-0 flex justify-center pt-8 z-10"
                  animate={{ opacity: Math.max(0, 1 - p * 3) }}
                  transition={{ duration: 0.08 }}
                >
                  <span
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: '.58rem',
                      fontWeight: 400,
                      letterSpacing: '.4em',
                      textTransform: 'uppercase' as const,
                      color: 'rgba(201,168,130,.7)',
                    }}
                  >
                    Chapter I — The Invitation
                  </span>
                </motion.div>

                {/* ── Gold wax seal — appears at ~50% progress ── */}
                <motion.div
                  className="absolute bottom-8 right-8 z-10"
                  animate={{
                    opacity: Math.max(0, p * 2 - 0.5),
                    scale:   0.8 + p * 0.2,
                  }}
                  transition={{ duration: 0.1 }}
                >
                  <WaxSeal />
                </motion.div>

                {/* ── Scroll hint inside the media box ─── */}
                <motion.div
                  className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2 z-10"
                  animate={{ opacity: Math.max(0, 1 - p * 4) }}
                  transition={{ duration: 0.08 }}
                >
                  <span
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: '.58rem',
                      fontWeight: 400,
                      letterSpacing: '.35em',
                      textTransform: 'uppercase' as const,
                      color: 'rgba(248,245,240,.5)',
                    }}
                  >
                    {scrollToExpand}
                  </span>
                  <ScrollLine />
                </motion.div>
              </div>

              {/* ── Title — splits apart as media expands ── */}
              {title && (
                <div
                  className="flex flex-col items-center justify-center text-center gap-3 w-full relative z-10 pointer-events-none select-none"
                >
                  <h1 style={{ display: 'contents', margin: 0, fontWeight: 400 }}>
                    <span
                      style={{
                        display: 'block',
                        transform: `translateX(-${textShift}vw)`,
                        fontFamily: "'Prata', Georgia, serif",
                        fontSize: 'clamp(2.8rem, 7vw, 8rem)',
                        lineHeight: 1,
                        letterSpacing: '-.025em',
                        color: '#F8F5F0',
                        mixBlendMode: 'difference' as const,
                      }}
                    >
                      {titleTop}
                    </span>
                    {titleBottom && (
                      <span
                        style={{
                          display: 'block',
                          transform: `translateX(${textShift}vw)`,
                          fontFamily: "'Prata', Georgia, serif",
                          fontSize: 'clamp(2.8rem, 7vw, 8rem)',
                          lineHeight: 1,
                          letterSpacing: '-.025em',
                          color: '#F8F5F0',
                          mixBlendMode: 'difference' as const,
                        }}
                      >
                        {titleBottom}
                      </span>
                    )}
                  </h1>
                  {subtitle && (
                    <p
                      style={{
                        fontFamily: "'EB Garamond', Georgia, serif",
                        fontStyle: 'italic',
                        fontSize:  'clamp(1.2rem, 2.5vw, 2rem)',
                        color: 'rgba(162,129,90,.85)',
                        letterSpacing: '.02em',
                        marginTop: '-.15em',
                        mixBlendMode: 'normal' as const,
                        transform: `translateX(${(textShift * 0.4)}vw)`,
                      }}
                    >
                      {subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* ── Expanded content ──────────────── */}
            <AnimatePresence>
              {showContent && (
                <motion.section
                  className="flex flex-col w-full px-8 py-16 md:px-16 lg:py-24"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  {children}
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ── Wax seal SVG ──────────────────────────────── */
function WaxSeal() {
  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="26" cy="26" r="24" fill="#A2815A" opacity=".9" />
      <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,248,230,.3)" strokeWidth=".5" />
      {/* M monogram */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="Prata, Georgia, serif"
        fontSize="18"
        fill="rgba(248,245,240,.85)"
        letterSpacing="0"
      >
        M
      </text>
    </svg>
  );
}

/* ── Animated scroll line ──────────────────────── */
function ScrollLine() {
  return (
    <div
      style={{
        width: 1,
        height: 40,
        background: 'rgba(248,245,240,.2)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '100%',
          background: 'rgba(162,129,90,.7)',
        }}
        animate={{ y: ['−100%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

export default ScrollExpandMedia;
