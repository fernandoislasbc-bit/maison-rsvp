'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Work } from '@/lib/works';

interface Props {
  works: Work[];
}

export function WorksVerticalStack({ works }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastNavTime = useRef(0);
  const isDragging = useRef(false);
  const router = useRouter();
  const total = works.length;

  const navigate = useCallback((dir: number) => {
    const now = Date.now();
    if (now - lastNavTime.current < 420) return;
    lastNavTime.current = now;
    setCurrentIndex(prev => {
      if (dir > 0) return prev === total - 1 ? 0 : prev + 1;
      return prev === 0 ? total - 1 : prev - 1;
    });
  }, [total]);

  const handleDragStart = () => { isDragging.current = true; };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setTimeout(() => { isDragging.current = false; }, 100);
    if (info.offset.y < -50) navigate(1);
    else if (info.offset.y > 50) navigate(-1);
  };

  const handleCardClick = (index: number) => {
    if (isDragging.current) return;
    const diff = getDiff(index);
    if (diff === 0) {
      const work = works[index];
      router.push(work.experienceUrl ?? `/work/${work.slug}`);
    } else {
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 30) navigate(e.deltaY > 0 ? 1 : -1);
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [navigate]);

  const getDiff = (index: number) => {
    let d = index - currentIndex;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  };

  const getStyle = (index: number) => {
    const d = getDiff(index);
    if (d === 0)  return { y: 0,    scale: 1,    opacity: 1,   zIndex: 5, rotateX: 0  };
    if (d === -1) return { y: -170, scale: 0.84, opacity: 0.55, zIndex: 4, rotateX: 9  };
    if (d === -2) return { y: -290, scale: 0.72, opacity: 0.25, zIndex: 3, rotateX: 16 };
    if (d === 1)  return { y: 170,  scale: 0.84, opacity: 0.55, zIndex: 4, rotateX: -9 };
    if (d === 2)  return { y: 290,  scale: 0.72, opacity: 0.25, zIndex: 3, rotateX: -16};
    return { y: d > 0 ? 420 : -420, scale: 0.6, opacity: 0, zIndex: 0, rotateX: 0 };
  };

  const isVisible = (index: number) => Math.abs(getDiff(index)) <= 2;
  const active = works[currentIndex];

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      minHeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'var(--deep)',
    }}>

      {/* Left counter */}
      <div style={{
        position: 'absolute', left: 'clamp(1.5rem,4vw,4rem)', top: '50%',
        transform: 'translateY(-50%)', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem',
      }}>
        <span style={{
          fontFamily: 'var(--font-prata), Georgia, serif',
          fontSize: 'clamp(2rem,4vw,3.5rem)',
          color: 'var(--ivory)', lineHeight: 1, fontWeight: 300,
        }}>
          {String(currentIndex + 1).padStart(2, '0')}
        </span>
        <div style={{ width: 1, height: 28, background: 'rgba(248,245,240,.2)' }} />
        <span style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '.65rem', color: 'rgba(248,245,240,.35)', letterSpacing: '.08em',
        }}>
          {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* Right nav dots */}
      <div style={{
        position: 'absolute', right: 'clamp(1.5rem,4vw,4rem)', top: '50%',
        transform: 'translateY(-50%)', zIndex: 10,
        display: 'flex', flexDirection: 'column', gap: '.6rem',
      }}>
        {works.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to ${works[i].title}`}
            style={{
              width: 6,
              height: i === currentIndex ? 24 : 6,
              borderRadius: 3,
              background: i === currentIndex ? 'var(--gold)' : 'rgba(248,245,240,.2)',
              border: 'none', cursor: 'pointer',
              transition: 'all .35s ease',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Card stack */}
      <div style={{
        position: 'relative',
        width: 'clamp(240px,32vw,320px)',
        height: 'clamp(360px,52vh,480px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        perspective: '1200px',
      }}>
        {works.map((work, index) => {
          if (!isVisible(index)) return null;
          const s = getStyle(index);
          const isCurrent = index === currentIndex;

          return (
            <motion.div
              key={work.slug}
              animate={{ y: s.y, scale: s.scale, opacity: s.opacity, rotateX: s.rotateX, zIndex: s.zIndex }}
              transition={{ type: 'spring', stiffness: 280, damping: 28, mass: 1 }}
              drag={isCurrent ? 'y' : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.18}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onClick={() => handleCardClick(index)}
              style={{
                position: 'absolute',
                transformStyle: 'preserve-3d',
                zIndex: s.zIndex,
                cursor: isCurrent ? 'pointer' : 'default',
                width: '100%', height: '100%',
              }}
            >
              {/* Card */}
              <div style={{
                position: 'relative',
                width: '100%', height: '100%',
                overflow: 'hidden',
                borderRadius: 2,
                boxShadow: isCurrent
                  ? '0 32px 64px -12px rgba(14,13,11,.65), 0 0 0 1px rgba(201,168,130,.1)'
                  : '0 12px 32px -8px rgba(14,13,11,.4)',
              }}>
                <Image
                  src={work.cover}
                  alt={work.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  draggable={false}
                  priority={isCurrent}
                  sizes="(max-width: 768px) 240px, 320px"
                />

                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(14,13,11,.78) 0%, rgba(14,13,11,.15) 45%, transparent 100%)',
                }} />

                {/* Card text */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: 'clamp(1.2rem,2.5vw,1.8rem)',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '.5rem', letterSpacing: '.28em', textTransform: 'uppercase',
                    color: 'rgba(201,168,130,.75)', marginBottom: '.4rem',
                  }}>
                    {work.category} · {work.year}
                  </p>
                  <h3 style={{
                    fontFamily: 'var(--font-prata), Georgia, serif',
                    fontSize: 'clamp(1.1rem,2.2vw,1.4rem)',
                    color: 'var(--ivory)', lineHeight: 1.1,
                    marginBottom: '.35rem',
                  }}>
                    {work.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-garamond), Georgia, serif',
                    fontStyle: 'italic', fontSize: '.82rem',
                    color: 'rgba(248,245,240,.45)',
                  }}>
                    {work.location}
                  </p>

                  {/* CTA — only on active card */}
                  {isCurrent && (
                    <div style={{
                      marginTop: '1rem',
                      display: 'flex', alignItems: 'center', gap: '.5rem',
                    }}>
                      <div style={{ height: 1, width: 20, background: 'var(--gold)', opacity: .6 }} />
                      <span style={{
                        fontFamily: 'var(--font-manrope), sans-serif',
                        fontSize: '.52rem', letterSpacing: '.28em', textTransform: 'uppercase',
                        color: 'var(--gold)',
                      }}>
                        Enter experience
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Active work info — right side on desktop */}
      <div style={{
        position: 'absolute',
        right: 'clamp(5rem,12vw,14rem)',
        top: '50%',
        transform: 'translateY(-50%)',
        maxWidth: '22ch',
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        <motion.div
          key={active.slug}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .5, ease: [.16,1,.3,1] }}
        >
          <p style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.52rem', letterSpacing: '.32em', textTransform: 'uppercase',
            color: 'rgba(201,168,130,.55)', marginBottom: '1rem',
          }}>
            {active.season} {active.year}
          </p>
          <h2 style={{
            fontFamily: 'var(--font-prata), Georgia, serif',
            fontSize: 'clamp(1.4rem,2.5vw,2.2rem)',
            color: 'var(--ivory)', lineHeight: 1.05,
            letterSpacing: '-.015em', marginBottom: '.8rem',
          }}>
            {active.title}
          </h2>
          <p style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(.82rem,1.1vw,1rem)',
            color: 'rgba(248,245,240,.4)',
            lineHeight: 1.7,
          }}>
            {active.tagline}
          </p>
        </motion.div>
      </div>

      {/* Bottom hint */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: .6 }}
        style={{
          position: 'absolute', bottom: 'clamp(2rem,5vh,3.5rem)',
          left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.6rem',
          zIndex: 10,
        }}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(248,245,240,.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7-7 7 7" />
          </svg>
        </motion.div>
        <span style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '.48rem', letterSpacing: '.3em', textTransform: 'uppercase',
          color: 'rgba(248,245,240,.2)',
        }}>Scroll or drag</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(248,245,240,.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>

    </section>
  );
}
