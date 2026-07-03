'use client';

import { useEffect, useRef, useState } from 'react';
import { Cormorant_Garamond, Playfair_Display, Montserrat } from 'next/font/google';
import Link from 'next/link';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
});

const C = {
  cream:   '#FAF3E0',
  gold:    '#C8A84B',
  goldLt:  '#E8C96A',
  goldDk:  '#9A7A2E',
  navy:    '#1A2744',
  blue:    '#6B9EC9',
  blueLt:  '#A8CCE8',
  ink:     '#0D1520',
};

/* ══════════════════════════════════════
   OIL PAINT DAB ENGINE
══════════════════════════════════════ */
class PaintDabEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  particles: {
    x:number; y:number; w:number; h:number; angle:number;
    alpha:number; vx:number; vy:number; life:number; decay:number; color:string;
  }[] = [];
  intensity = 0;
  running = false;
  _rafId = 0;
  _palette = [
    'rgba(200,168,75,',  'rgba(232,201,106,',
    'rgba(107,158,201,', 'rgba(168,204,232,',
    'rgba(250,243,224,', 'rgba(154,122,46,',
  ];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    const r = this.canvas.parentElement?.getBoundingClientRect();
    this.canvas.width  = r?.width  ?? window.innerWidth;
    this.canvas.height = r?.height ?? window.innerHeight;
  }

  _spawn() {
    const w = this.canvas.width, h = this.canvas.height;
    const color = this._palette[Math.floor(Math.random() * this._palette.length)];
    this.particles.push({
      x: Math.random() * w, y: Math.random() * h,
      w: Math.random() * 14 + 4,
      h: Math.random() * 5 + 2,
      angle: Math.random() * Math.PI,
      alpha: Math.random() * 0.7 + 0.1,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(Math.random() * 0.6 + 0.2),
      life: 1, decay: Math.random() * 0.01 + 0.005,
      color,
    });
  }

  _tick() {
    if (!this.running) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const count = Math.floor(this.intensity * 15);
    for (let i = 0; i < count; i++) this._spawn();
    this.particles = this.particles.filter(p => p.life > 0);
    for (const p of this.particles) {
      const al = p.life * p.alpha;
      ctx.save();
      ctx.globalAlpha = al;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color + al + ')';
      ctx.beginPath();
      ctx.ellipse(0, 0, p.w, p.h, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      p.x += p.vx; p.y += p.vy; p.life -= p.decay;
    }
    this._rafId = requestAnimationFrame(() => this._tick());
  }

  start()  { if (!this.running) { this.running = true; this._tick(); } }
  stop()   { this.running = false; cancelAnimationFrame(this._rafId); }
  setIntensity(v: number) { this.intensity = Math.max(0, Math.min(1, v)); }
}

/* ══════════════════════════════════════
   PAGE
══════════════════════════════════════ */
export default function OliverAndDanielaPage() {
  const [introDone, setIntroDone] = useState(false);
  const [rsvpSent,  setRsvpSent]  = useState(false);

  const introVideoRef  = useRef<HTMLVideoElement>(null);
  const introCanvasRef = useRef<HTMLCanvasElement>(null);
  const heroCanvasRef  = useRef<HTMLCanvasElement>(null);
  const closingCanvasRef = useRef<HTMLCanvasElement>(null);
  const introEngineRef = useRef<PaintDabEngine | null>(null);

  /* Intro dabs start immediately */
  useEffect(() => {
    if (!introCanvasRef.current) return;
    const eng = new PaintDabEngine(introCanvasRef.current);
    introEngineRef.current = eng;
    eng.start();
    eng.setIntensity(0.15);
    const t = setTimeout(() => eng.setIntensity(0.4), 2000);
    return () => { clearTimeout(t); eng.stop(); };
  }, []);

  /* GSAP after intro */
  useEffect(() => {
    if (!introDone) return;

    import('gsap').then(({ gsap: g }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger: ST }) => {
        g.registerPlugin(ST);

        /* Hero entrance */
        g.timeline({ defaults: { ease: 'power3.out' } })
          .to('.od-hero-eyebrow', { opacity: 1, y: 0, duration: 1.2 })
          .to('.od-hero-names',   { opacity: 1, y: 0, duration: 1.5 }, '-=0.8')
          .to('.od-hero-sub',     { opacity: 1, y: 0, duration: 1.2 }, '-=0.9')
          .to('.od-hero-divider', { width: 80, opacity: 1, duration: 1 }, '-=0.7')
          .to('#od-open-btn',     { opacity: 1, duration: 0.8 }, '-=0.4')
          .to('#od-scroll-hint',  { opacity: 1, duration: 0.8 }, '-=0.4');

        g.to('#od-hero-overlay', {
          opacity: 0.92,
          scrollTrigger: { trigger: '#od-hero', start: 'top top', end: 'bottom top', scrub: true }
        });
        g.to('#od-hero-content', {
          opacity: 0, y: -40,
          scrollTrigger: { trigger: '#od-hero', start: '20% top', end: '60% top', scrub: true }
        });

        /* Paint dab engines */
        if (heroCanvasRef.current) {
          const hEng = new PaintDabEngine(heroCanvasRef.current);
          hEng.start(); hEng.setIntensity(0);
          ST.create({
            trigger: '#od-hero', start: 'top top', end: 'bottom top',
            onUpdate: (s) => hEng.setIntensity(s.progress * 0.5),
          });
        }
        if (closingCanvasRef.current) {
          const cEng = new PaintDabEngine(closingCanvasRef.current);
          cEng.start(); cEng.setIntensity(0);
          ST.create({
            trigger: '#od-closing', start: 'top 80%', end: 'bottom top',
            onUpdate: (s) => cEng.setIntensity(s.progress * 0.6),
          });
        }

        /* Gold lines */
        ['#od-story','#od-details','#od-venue','#od-timeline','#od-rsvp','#od-closing'].forEach(sel => {
          ST.create({
            trigger: sel, start: 'top 70%',
            onEnter: () => g.to(`${sel} .od-gold-line`, { width: 80, duration: 1.2, ease: 'power2.out' }),
          });
        });

        /* Story painting */
        g.to('.od-painting', {
          opacity: 1, scale: 1,
          scrollTrigger: { trigger: '.od-painting', start: 'top 85%', end: 'top 40%', scrub: 0.8 }
        });

        /* Venue image */
        g.to('.od-venue-box', {
          clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power3.out',
          scrollTrigger: { trigger: '.od-venue-box', start: 'top 80%', toggleActions: 'play none none none' }
        });

        /* Detail rows */
        g.utils.toArray<HTMLElement>('.od-detail-row').forEach((row, i) => {
          g.to(row, { opacity: 1, y: 0, duration: 0.8, delay: i * 0.08, scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play none none none' } });
        });

        /* Timeline */
        ST.create({
          trigger: '#od-timeline', start: 'top 80%', end: 'bottom 20%', scrub: 0.8,
          onUpdate: (s) => {
            const fill  = document.getElementById('od-rail-fill');
            const track = document.querySelector('.od-timeline-track') as HTMLElement;
            if (fill && track) fill.style.height = (s.progress * track.offsetHeight) + 'px';
          }
        });
        g.utils.toArray<HTMLElement>('.od-timeline-event').forEach((ev, i) => {
          g.to(ev, { opacity: 1, x: 0, duration: 0.8, delay: i * 0.1, scrollTrigger: { trigger: ev, start: 'top 85%', toggleActions: 'play none none none' } });
        });

        /* RSVP form */
        g.utils.toArray<HTMLElement>('.od-form-group').forEach((grp, i) => {
          g.to(grp, { opacity: 1, y: 0, duration: 0.7, delay: i * 0.07, scrollTrigger: { trigger: grp, start: 'top 90%', toggleActions: 'play none none none' } });
        });
        g.to('#od-rsvp-btn', { opacity: 1, duration: 0.8, scrollTrigger: { trigger: '#od-rsvp-btn', start: 'top 90%', toggleActions: 'play none none none' } });

        /* Closing */
        g.to('.od-closing-content', { opacity: 1, duration: 1.4, ease: 'power2.out', scrollTrigger: { trigger: '#od-closing', start: 'top 70%', toggleActions: 'play none none none' } });

        /* Story text */
        g.utils.toArray<HTMLElement>('.od-story-para').forEach((p, i) => {
          g.to(p, { opacity: 1, y: 0, duration: 0.9, delay: i * 0.1, scrollTrigger: { trigger: p, start: 'top 90%', toggleActions: 'play none none none' } });
        });
      });
    });

    return () => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.killAll());
    };
  }, [introDone]);

  function revealPage() {
    introEngineRef.current?.stop();
    setIntroDone(true);
  }

  function submitRSVP(e: React.FormEvent) {
    e.preventDefault();
    setTimeout(() => setRsvpSent(true), 1200);
  }

  return (
    <div style={{ background: C.ink, color: C.cream, overflowX: 'hidden', fontFamily: cormorant.style.fontFamily }}>

      {/* ══ CINEMATIC BOOK INTRO ══ */}
      {!introDone && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <video
            ref={introVideoRef}
            autoPlay muted playsInline
            onEnded={revealPage}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src="/assets/od/intro.mp4" type="video/mp4" />
          </video>

          <canvas ref={introCanvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(13,21,32,0.65) 100%)', pointerEvents: 'none', zIndex: 1 }} />

          {/* Names reveal at end of video */}
          <div style={{ position: 'absolute', zIndex: 3, textAlign: 'center', pointerEvents: 'none' }}>
            <span style={{ fontFamily: montserrat.style.fontFamily, fontSize: 'clamp(0.55rem,1.5vw,0.65rem)', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.gold, display: 'block', marginBottom: 16 }}>
              You Are Invited
            </span>
            <div style={{ fontFamily: playfair.style.fontFamily, fontSize: 'clamp(3rem,10vw,7rem)', fontWeight: 400, color: C.cream, lineHeight: 0.88 }}>
              Oliver
              <span style={{ display: 'block', fontStyle: 'italic', color: C.gold, fontSize: '0.55em' }}>&amp;</span>
              Daniela
            </div>
          </div>

          <button onClick={revealPage} style={{
            position: 'absolute', top: 28, right: 28, zIndex: 4,
            fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.3em',
            textTransform: 'uppercase', color: 'rgba(250,243,224,0.5)',
            background: 'transparent', border: 'none', cursor: 'pointer',
          }}>Skip →</button>
        </div>
      )}

      {/* ══ MAIN PAGE ══ */}
      <div style={{ opacity: introDone ? 1 : 0, transition: 'opacity 0.8s ease', pointerEvents: introDone ? 'auto' : 'none' }}>

        {/* Back link */}
        <div style={{ position: 'fixed', top: 28, left: 28, zIndex: 100 }}>
          <Link href="/collection" style={{
            fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem',
            letterSpacing: '0.35em', textTransform: 'uppercase',
            color: 'rgba(250,243,224,0.6)', textDecoration: 'none',
          }}>← Collection</Link>
        </div>

        {/* ── HERO ── */}
        <section id="od-hero" style={{ position: 'relative', width: '100%', height: '100svh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/od/couple-painting.png" alt="Oliver & Daniela — Van Gogh Starry Night Proposal" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <video autoPlay muted playsInline loop style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18, mixBlendMode: 'screen' }}>
            <source src="/assets/od/swirl.mp4" type="video/mp4" />
          </video>
          <canvas ref={heroCanvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }} />
          <div id="od-hero-overlay" style={{ position: 'absolute', inset: 0, zIndex: 1, background: `linear-gradient(to bottom, rgba(13,21,32,0.5) 0%, rgba(26,39,68,0.4) 50%, rgba(13,21,32,0.92) 100%)` }} />
          <div id="od-hero-content" style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '0 24px' }}>
            <p className="od-hero-eyebrow" style={{ fontFamily: montserrat.style.fontFamily, fontSize: 'clamp(0.6rem,1.5vw,0.7rem)', letterSpacing: '0.5em', color: C.gold, textTransform: 'uppercase', opacity: 0, transform: 'translateY(12px)' }}>You Are Invited</p>
            <h1 className="od-hero-names" style={{ fontFamily: playfair.style.fontFamily, fontSize: 'clamp(4rem,14vw,9rem)', fontWeight: 400, color: C.cream, lineHeight: 0.85, opacity: 0, transform: 'translateY(24px)', margin: '20px 0 24px' }}>
              Oliver
              <span style={{ color: C.gold, fontStyle: 'italic', display: 'block', fontSize: '0.6em' }}>&amp;</span>
              Daniela
            </h1>
            <p className="od-hero-sub" style={{ fontSize: 'clamp(0.85rem,2vw,1rem)', letterSpacing: '0.2em', color: C.blueLt, fontWeight: 300, opacity: 0, transform: 'translateY(12px)', fontFamily: cormorant.style.fontFamily }}>
              A Wedding in the Vines &nbsp;·&nbsp; Kelowna, British Columbia
            </p>
            <div className="od-hero-divider" style={{ width: 0, height: 1, background: C.gold, margin: '32px auto', opacity: 0 }} />
            <button id="od-open-btn"
              onClick={() => document.getElementById('od-story')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ opacity: 0, border: `1px solid ${C.gold}`, color: C.cream, fontFamily: montserrat.style.fontFamily, fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', padding: '16px 40px', background: 'transparent', cursor: 'pointer', marginTop: 32 }}>
              Enter Invitation
            </button>
          </div>
          <div id="od-scroll-hint" style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 3, opacity: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 1, height: 48, background: `linear-gradient(to bottom, ${C.gold}, transparent)`, animation: 'odPulse 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.35em', color: C.blueLt, textTransform: 'uppercase' }}>Scroll</span>
          </div>
        </section>

        {/* ── OUR STORY ── */}
        <section id="od-story" style={{ position: 'relative', padding: '120px 24px', background: C.cream }}>
          {/* SVG impasto texture overlay */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
            <filter id="od-paint">
              <feTurbulence type="turbulence" baseFrequency="0.65" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <rect width="100%" height="100%" fill={C.navy} filter="url(#od-paint)" />
          </svg>

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 64, alignItems: 'center' }}>
            {/* Van Gogh painting portrait */}
            <div className="od-painting" style={{ width: '100%', maxWidth: 380, opacity: 0, transform: 'scale(0.92)', border: `3px solid ${C.gold}`, boxShadow: `0 24px 80px rgba(200,168,75,0.25)` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/od/couple-painting.png" alt="Oliver & Daniela — The Proposal" style={{ width: '100%', display: 'block' }} />
            </div>
            <div style={{ textAlign: 'center', maxWidth: 680 }}>
              <p style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.goldDk }}>Our Story</p>
              <div className="od-gold-line" style={{ width: 0, height: 1, background: C.gold, margin: '16px auto' }} />
              <h2 style={{ fontFamily: playfair.style.fontFamily, fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 400, color: C.navy, lineHeight: 1.1, marginBottom: 32 }}>
                A Love Story<br /><em style={{ color: C.goldDk }}>Painted in Golden Light</em>
              </h2>
              {[
                'A love story painted in golden light, quiet moments, and memories that feel timeless. Oliver and Daniela invite you to celebrate the beginning of their forever surrounded by vineyards, family, and the beauty of Kelowna.',
                'Like brush strokes on a canvas, their story was written in layers — each day adding depth, colour, and warmth to something already beautiful. Now, beneath a Kelowna sky, they invite you to witness the masterpiece become complete.',
              ].map((p, i) => (
                <p key={i} className="od-story-para" style={{ fontSize: 'clamp(0.95rem,2vw,1.1rem)', lineHeight: 1.9, color: C.navy, fontWeight: 300, marginBottom: 20, opacity: 0, transform: 'translateY(16px)' }}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* ── WEDDING DETAILS ── */}
        <section id="od-details" style={{ padding: '120px 24px', background: C.ink }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <p style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.gold }}>The Celebration</p>
              <div className="od-gold-line" style={{ width: 0, height: 1, background: C.gold, margin: '16px auto', maxWidth: 80 }} />
              <h2 style={{ fontFamily: playfair.style.fontFamily, fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 400, fontStyle: 'italic', color: C.cream, marginTop: 16 }}>Wedding Details</h2>
            </div>
            {[
              { label: 'Date',       value: 'Saturday, August 15', sub: '2026' },
              { label: 'Ceremony',   value: '4:30 PM',             sub: 'Reception to follow' },
              { label: 'Location',   value: 'A Winery in Kelowna', sub: 'British Columbia, Canada' },
              { label: 'Dress Code', value: 'Elegant Garden Formal', sub: 'Black tie welcome' },
              { label: 'RSVP By',   value: 'July 1, 2026',         sub: 'Your presence would be our greatest gift' },
            ].map((row, i) => (
              <div key={i} className="od-detail-row" style={{ display: 'flex', alignItems: 'flex-start', gap: 32, padding: '40px 0', borderBottom: i < 4 ? `1px solid rgba(200,168,75,0.12)` : 'none', opacity: 0, transform: 'translateY(24px)' }}>
                <span style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: C.gold, flex: '0 0 120px', paddingTop: 4 }}>{row.label}</span>
                <div style={{ flex: '0 0 1px', background: C.gold, alignSelf: 'stretch', opacity: 0.3 }} />
                <div style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 300, color: C.cream, lineHeight: 1.3, fontFamily: cormorant.style.fontFamily }}>
                  {row.value}
                  <small style={{ display: 'block', fontSize: '0.65em', color: C.blueLt, letterSpacing: '0.1em', marginTop: 4, fontFamily: montserrat.style.fontFamily, fontWeight: 300 }}>{row.sub}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── THE VENUE ── */}
        <section id="od-venue" style={{ position: 'relative', padding: '120px 24px', background: C.navy }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.08 }}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <filter id="od-swirl">
                <feTurbulence type="turbulence" baseFrequency="0.35" numOctaves="4" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
              </filter>
              <rect width="100%" height="100%" fill={C.blue} filter="url(#od-swirl)" />
            </svg>
          </div>
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 64, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.goldLt }}>The Venue</p>
              <div className="od-gold-line" style={{ width: 0, height: 1, background: C.gold, margin: '16px auto', maxWidth: 80 }} />
              <h2 style={{ fontFamily: playfair.style.fontFamily, fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 400, color: C.cream, marginTop: 16, lineHeight: 1.1 }}>
                Among the<br /><em style={{ color: C.gold }}>Kelowna Vineyards</em>
              </h2>
              <p style={{ fontSize: 'clamp(0.9rem,1.8vw,1rem)', lineHeight: 1.9, color: C.blueLt, fontWeight: 300, maxWidth: 540, margin: '24px auto 0', fontFamily: cormorant.style.fontFamily }}>
                Set among the vineyards of Kelowna, our celebration will unfold in a romantic winery surrounded by golden light, rolling hills, and unforgettable views.
              </p>
            </div>
            <div className="od-venue-box" style={{ width: '100%', maxWidth: 560, clipPath: 'inset(0 100% 0 0)', border: `2px solid rgba(200,168,75,0.4)`, boxShadow: `0 32px 100px rgba(0,0,0,0.5)` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/od/venue.png" alt="Kelowna Winery Venue" style={{ width: '100%', display: 'block' }} />
            </div>
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section id="od-timeline" style={{ position: 'relative', padding: '120px 24px', background: C.cream }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
            <filter id="od-paint2">
              <feTurbulence type="turbulence" baseFrequency="0.5" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <rect width="100%" height="100%" fill={C.blue} filter="url(#od-paint2)" />
          </svg>
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <p style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.goldDk }}>The Day</p>
              <div className="od-gold-line" style={{ width: 0, height: 1, background: C.gold, margin: '16px auto', maxWidth: 80 }} />
              <h2 style={{ fontFamily: playfair.style.fontFamily, fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 400, fontStyle: 'italic', color: C.navy, marginTop: 16 }}>August 15, 2026</h2>
            </div>
            <div className="od-timeline-track" style={{ position: 'relative', paddingLeft: 40 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: 'rgba(200,168,75,0.2)' }}>
                <div id="od-rail-fill" style={{ position: 'absolute', top: 0, width: 1, background: C.gold, height: 0 }} />
              </div>
              {[
                { time: '4:30 pm', name: 'Ceremony',      desc: 'The vows that begin forever', first: true },
                { time: '5:15 pm', name: 'Cocktail Hour', desc: 'Wine, canapés & golden hour' },
                { time: '6:30 pm', name: 'Dinner',        desc: 'A harvest feast in the vineyard' },
                { time: '8:00 pm', name: 'First Dance',   desc: 'Beneath the Kelowna stars' },
                { time: '9:00 pm', name: 'Celebration',   desc: 'Dance, joy & memories forever' },
              ].map((ev, i) => (
                <div key={i} className="od-timeline-event" style={{ display: 'flex', alignItems: 'flex-start', gap: 24, marginBottom: i < 4 ? 56 : 0, opacity: 0, transform: 'translateX(-16px)', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: -45, top: 6, width: 10, height: 10, borderRadius: '50%', border: `1px solid ${C.gold}`, background: ev.first ? C.gold : C.cream }} />
                  <div style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.6rem', letterSpacing: '0.3em', color: C.goldDk, textTransform: 'uppercase', flex: '0 0 80px', paddingTop: 4 }}>{ev.time}</div>
                  <div>
                    <div style={{ fontFamily: playfair.style.fontFamily, fontSize: 'clamp(1.2rem,3vw,1.6rem)', fontStyle: 'italic', fontWeight: 400, color: C.navy, lineHeight: 1.3 }}>{ev.name}</div>
                    <div style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.65rem', letterSpacing: '0.1em', color: C.blue, marginTop: 6, fontWeight: 300 }}>{ev.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RSVP ── */}
        <section id="od-rsvp" style={{ position: 'relative', padding: '120px 24px', background: C.navy, overflow: 'hidden' }}>
          <video autoPlay muted playsInline loop style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.22 }}>
            <source src="/assets/od/swirl.mp4" type="video/mp4" />
          </video>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,21,32,0.55)' }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <p style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.gold }}>Your Reply</p>
              <div className="od-gold-line" style={{ width: 0, height: 1, background: C.gold, margin: '16px auto', maxWidth: 80 }} />
              <h2 style={{ fontFamily: playfair.style.fontFamily, fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 400, color: C.cream, margin: '16px 0 12px' }}>Will You Join Us?</h2>
              <p style={{ fontSize: 'clamp(0.85rem,1.8vw,0.95rem)', color: C.blueLt, fontWeight: 300, lineHeight: 1.8, fontFamily: cormorant.style.fontFamily, fontStyle: 'italic' }}>Kindly reply by July 1, 2026.<br />Your presence would be our greatest gift.</p>
            </div>
            {rsvpSent ? (
              <div style={{ textAlign: 'center', padding: 40, border: `1px solid rgba(200,168,75,0.3)` }}>
                <h3 style={{ fontFamily: playfair.style.fontFamily, fontSize: '2rem', fontStyle: 'italic', color: C.cream, marginBottom: 12 }}>Thank You</h3>
                <p style={{ color: C.blueLt, fontWeight: 300, lineHeight: 1.8, fontFamily: cormorant.style.fontFamily }}>We have received your reply and cannot wait to celebrate with you.<br />Oliver &amp; Daniela</p>
              </div>
            ) : (
              <form onSubmit={submitRSVP} style={{ background: 'rgba(250,243,224,0.06)', backdropFilter: 'blur(8px)', padding: '48px 32px', border: `1px solid rgba(200,168,75,0.2)` }}>
                {[
                  { label: 'Full Name', id: 'od-name',  type: 'text',  placeholder: 'Your name' },
                  { label: 'Email',     id: 'od-email', type: 'email', placeholder: 'your@email.com' },
                ].map((f) => (
                  <div key={f.id} className="od-form-group" style={{ marginBottom: 32, opacity: 0, transform: 'translateY(16px)' }}>
                    <label style={{ display: 'block', fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.gold, marginBottom: 12 }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} required
                      style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid rgba(200,168,75,0.4)`, color: C.cream, fontFamily: cormorant.style.fontFamily, fontSize: '1.1rem', padding: '12px 0', outline: 'none' }} />
                  </div>
                ))}
                <div className="od-form-group" style={{ marginBottom: 32, opacity: 0, transform: 'translateY(16px)' }}>
                  <label style={{ display: 'block', fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.gold, marginBottom: 12 }}>Will You Attend?</label>
                  <select style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid rgba(200,168,75,0.4)`, color: C.cream, fontFamily: cormorant.style.fontFamily, fontSize: '1.1rem', padding: '12px 0', outline: 'none', cursor: 'pointer' }}>
                    <option value="yes" style={{ background: C.navy }}>Joyfully accepts</option>
                    <option value="no"  style={{ background: C.navy }}>Regretfully declines</option>
                  </select>
                </div>
                <div className="od-form-group" style={{ marginBottom: 32, opacity: 0, transform: 'translateY(16px)' }}>
                  <label style={{ display: 'block', fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.gold, marginBottom: 12 }}>A Message for Oliver &amp; Daniela</label>
                  <textarea placeholder="Share your warmth, your wishes, your love…" rows={4}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid rgba(200,168,75,0.4)`, color: C.cream, fontFamily: cormorant.style.fontFamily, fontSize: '1.1rem', padding: '12px 0', outline: 'none', resize: 'none' }} />
                </div>
                <button id="od-rsvp-btn" type="submit" style={{ width: '100%', background: C.gold, border: 'none', color: C.ink, fontFamily: montserrat.style.fontFamily, fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', padding: 20, cursor: 'pointer', marginTop: 8, opacity: 0, fontWeight: 500 }}>
                  Send RSVP
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ── CLOSING ── */}
        <section id="od-closing" style={{ position: 'relative', height: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/od/couple-painting.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2 }} />
          <canvas ref={closingCanvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: `linear-gradient(to bottom, ${C.ink} 0%, rgba(13,21,32,0.6) 50%, ${C.ink} 100%)` }} />
          <div className="od-closing-content" style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '0 24px', opacity: 0 }}>
            <p style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.gold }}>August 15, 2026</p>
            <div className="od-gold-line" style={{ width: 0, height: 1, background: C.gold, margin: '16px auto', maxWidth: 80 }} />
            <h2 style={{ fontFamily: playfair.style.fontFamily, fontStyle: 'italic', fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: 400, color: C.cream, lineHeight: 1.4, marginBottom: 48 }}>
              &ldquo;Paint the world the colour of love,<br />and every moment becomes a masterpiece.&rdquo;
            </h2>
            <span style={{ fontFamily: playfair.style.fontFamily, fontSize: 'clamp(3rem,10vw,7rem)', fontWeight: 400, color: C.cream, lineHeight: 0.9, display: 'block' }}>
              Oliver <span style={{ color: C.gold, fontStyle: 'italic', fontSize: '0.6em' }}>&amp;</span> Daniela
            </span>
            <p style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.65rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.blueLt, marginTop: 40 }}>Saturday, August 15, 2026 · Kelowna, British Columbia</p>
          </div>
        </section>

        <footer style={{ padding: '48px 24px', background: C.ink, textAlign: 'center', borderTop: `1px solid rgba(200,168,75,0.1)` }}>
          <p style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(250,243,224,0.3)' }}>Oliver &amp; Daniela &nbsp;·&nbsp; August 15, 2026 &nbsp;·&nbsp; Kelowna, British Columbia</p>
          <p style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(250,243,224,0.2)', marginTop: 12 }}>#OliverandDaniela2026</p>
        </footer>
      </div>

      <style>{`
        @keyframes odPulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
        #od-open-btn:hover { background: ${C.gold} !important; color: ${C.ink} !important; }
      `}</style>
    </div>
  );
}
