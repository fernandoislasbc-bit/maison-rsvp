'use client';

import { useRef, useEffect } from 'react';

export default function Cursor() {
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
      rx += (mx - rx) * .1;
      ry += (my - ry) * .1;
      dot.style.transform  = `translate(${mx - 4}px,${my - 4}px)`;
      ring.style.transform = `translate(${rx - 18}px,${ry - 18}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} aria-hidden style={{
        position: 'fixed', top: 0, left: 0, zIndex: 9999,
        width: 8, height: 8, borderRadius: '50%',
        background: 'var(--gold)', pointerEvents: 'none', mixBlendMode: 'multiply',
      }} />
      <div ref={ringRef} aria-hidden style={{
        position: 'fixed', top: 0, left: 0, zIndex: 9998,
        width: 36, height: 36, borderRadius: '50%',
        border: '1px solid rgba(162,129,90,.35)', pointerEvents: 'none',
      }} />
    </>
  );
}
