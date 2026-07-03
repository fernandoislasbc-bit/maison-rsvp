'use client';

import { useEffect, useRef, useState } from 'react';
import { Cormorant_Garamond, Bodoni_Moda, Montserrat } from 'next/font/google';
import Link from 'next/link';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});
const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
});
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
});

/* ─── Colour tokens ─── */
const C = {
  burgundy:  '#4A0508',
  velvet:    '#7A0F12',
  wine:      '#250204',
  ivory:     '#F4E8D6',
  gold:      '#B08A4A',
  champagne: '#D8C3A5',
  black:     '#080505',
};

/* ══════════════════════════════════════════════
   SPARKLE ENGINE
══════════════════════════════════════════════ */
class SparkleEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  particles: {
    x:number; y:number; r:number; alpha:number; vx:number; vy:number;
    life:number; decay:number; color:string; twinkle:number; twinkleSpeed:number;
  }[] = [];
  intensity = 0;
  running = false;
  _rafId = 0;

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
    const palette = [
      'rgba(255,220,100,', 'rgba(200,160,60,',
      'rgba(240,200,120,', 'rgba(255,255,200,', 'rgba(176,138,74,',
    ];
    this.particles.push({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 2 + 0.5, alpha: Math.random() * 0.9 + 0.1,
      vx: (Math.random() - 0.5) * 0.6, vy: -(Math.random() * 0.8 + 0.3),
      life: 1, decay: Math.random() * 0.012 + 0.006,
      color: palette[Math.floor(Math.random() * palette.length)],
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.08 + 0.04,
    });
  }

  _tick() {
    if (!this.running) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const count = Math.floor(this.intensity * 20);
    for (let i = 0; i < count; i++) this._spawn();
    this.particles = this.particles.filter(p => p.life > 0);
    for (const p of this.particles) {
      p.twinkle += p.twinkleSpeed;
      const tw = 0.5 + 0.5 * Math.sin(p.twinkle);
      const al = p.life * p.alpha * tw;
      ctx.save();
      ctx.globalAlpha = al;
      const sz = p.r * (1 + tw * 0.5);
      ctx.fillStyle = p.color + al + ')';
      ctx.beginPath();
      for (let j = 0; j < 4; j++) {
        const a = (j / 4) * Math.PI * 2;
        const ox = p.x + Math.cos(a) * sz * 2;
        const oy = p.y + Math.sin(a) * sz * 2;
        const ix = p.x + Math.cos(a + Math.PI / 4) * sz * 0.4;
        const iy = p.y + Math.sin(a + Math.PI / 4) * sz * 0.4;
        if (j === 0) ctx.moveTo(ox, oy); else ctx.lineTo(ox, oy);
        ctx.lineTo(ix, iy);
      }
      ctx.closePath(); ctx.fill();
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sz * 5);
      g.addColorStop(0, p.color + (al * 0.4) + ')');
      g.addColorStop(1, p.color + '0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, sz * 5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      p.x += p.vx; p.y += p.vy; p.life -= p.decay;
    }
    this._rafId = requestAnimationFrame(() => this._tick());
  }

  start()  { if (!this.running) { this.running = true; this._tick(); } }
  stop()   { this.running = false; cancelAnimationFrame(this._rafId); }
  setIntensity(v: number) { this.intensity = Math.max(0, Math.min(1, v)); }
}

/* ══════════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════════ */
export default function NeilAndRileyPage() {
  const [introDone, setIntroDone] = useState(false);
  const [rsvpSent, setRsvpSent]   = useState(false);

  const introRef       = useRef<HTMLDivElement>(null);
  const letterVideoRef = useRef<HTMLVideoElement>(null);
  const taglineRef     = useRef<HTMLDivElement>(null);
  const introCanvasRef = useRef<HTMLCanvasElement>(null);
  const heroCanvasRef  = useRef<HTMLCanvasElement>(null);
  const closingCanvasRef = useRef<HTMLCanvasElement>(null);
  const introEngineRef = useRef<SparkleEngine | null>(null);

  /* ── Intro sparkle starts immediately ── */
  useEffect(() => {
    if (!introCanvasRef.current) return;
    const eng = new SparkleEngine(introCanvasRef.current);
    introEngineRef.current = eng;
    eng.start();
    eng.setIntensity(0.18);
    const t = setTimeout(() => eng.setIntensity(0.45), 2000);
    return () => { clearTimeout(t); eng.stop(); };
  }, []);

  /* ── Tagline fade-in mid-video ── */
  useEffect(() => {
    const vid = letterVideoRef.current;
    if (!vid || !taglineRef.current) return;
    const tag = taglineRef.current;
    const onTime = () => {
      const pct = vid.currentTime / (vid.duration || 10);
      if (pct > 0.38) tag.style.opacity = '1';
    };
    vid.addEventListener('timeupdate', onTime);
    return () => vid.removeEventListener('timeupdate', onTime);
  }, []);

  /* ── GSAP + scroll animations (after intro done) ── */
  useEffect(() => {
    if (!introDone) return;
    let gsap: typeof import('gsap').gsap;
    let ST: typeof import('gsap/ScrollTrigger').ScrollTrigger;

    import('gsap').then(({ gsap: g }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap = g;
        ST   = ScrollTrigger;
        gsap.registerPlugin(ST);

        /* Hero entrance */
        const htl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        htl.to('.nr-hero-eyebrow', { opacity: 1, y: 0, duration: 1.2 })
           .to('.nr-hero-names',   { opacity: 1, y: 0, duration: 1.4 }, '-=0.8')
           .to('.nr-hero-sub',     { opacity: 1, y: 0, duration: 1.2 }, '-=0.9')
           .to('.nr-hero-divider', { width: 80, opacity: 1, duration: 1 }, '-=0.7')
           .to('#nr-open-btn',     { opacity: 1, duration: 0.8 }, '-=0.4')
           .to('#nr-scroll-hint',  { opacity: 1, duration: 0.8 }, '-=0.4');

        gsap.to('#nr-hero-overlay', {
          opacity: 0.95,
          scrollTrigger: { trigger: '#nr-hero', start: 'top top', end: 'bottom top', scrub: true }
        });
        gsap.to('#nr-hero-content', {
          opacity: 0, y: -40,
          scrollTrigger: { trigger: '#nr-hero', start: '20% top', end: '60% top', scrub: true }
        });

        /* Sparkle engines */
        if (heroCanvasRef.current) {
          const hSp = new SparkleEngine(heroCanvasRef.current);
          hSp.start(); hSp.setIntensity(0);
          ST.create({
            trigger: '#nr-hero', start: 'top top', end: 'bottom top',
            onUpdate: (s) => hSp.setIntensity(s.progress * 0.6),
          });
        }
        if (closingCanvasRef.current) {
          const cSp = new SparkleEngine(closingCanvasRef.current);
          cSp.start(); cSp.setIntensity(0);
          ST.create({
            trigger: '#nr-closing', start: 'top 80%', end: 'bottom top',
            onUpdate: (s) => cSp.setIntensity(s.progress * 0.65),
          });
        }

        /* Gold lines */
        ['#nr-invitation','#nr-details','#nr-story','#nr-venue',
         '#nr-timeline','#nr-rsvp','#nr-closing'].forEach(sel => {
          ST.create({
            trigger: sel, start: 'top 70%',
            onEnter: () => gsap.to(`${sel} .nr-gold-line`, { width: 80, duration: 1.2, ease: 'power2.out' }),
          });
        });

        /* Invitation card scrub */
        gsap.to('.nr-inv-card', {
          rotation: 0, scale: 1, opacity: 1,
          scrollTrigger: { trigger: '#nr-invitation', start: 'top 80%', end: 'center center', scrub: 0.8 }
        });
        gsap.to('.nr-inv-text', {
          opacity: 1, y: 0, duration: 1,
          scrollTrigger: { trigger: '.nr-inv-text', start: 'top 80%', end: 'top 40%', scrub: 0.6 }
        });

        /* Details rows */
        gsap.utils.toArray<HTMLElement>('.nr-detail-row').forEach((row, i) => {
          gsap.to(row, {
            opacity: 1, y: 0, duration: 0.8, delay: i * 0.08,
            scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play none none none' }
          });
        });

        /* Portrait slide-in */
        gsap.to('.nr-portrait', {
          opacity: 1, x: 0,
          scrollTrigger: { trigger: '.nr-story-images', start: 'top 80%', end: 'top 30%', scrub: 0.7 }
        });

        /* Ring 1: from right, rotate to flat */
        gsap.to('.nr-ring-1', {
          opacity: 1, x: 0, rotation: 0, scale: 1,
          scrollTrigger: { trigger: '.nr-ring-stack', start: 'top 90%', end: 'top 40%', scrub: 0.9 }
        });
        /* Ring 2: from left, counter-rotate */
        gsap.to('.nr-ring-2', {
          opacity: 1, x: 0, rotation: -1, scale: 1,
          scrollTrigger: { trigger: '.nr-ring-stack', start: 'top 85%', end: 'top 35%', scrub: 1.1 }
        });
        /* Opposing parallax on rings */
        gsap.to('.nr-ring-1', {
          y: -60,
          scrollTrigger: { trigger: '.nr-ring-stack', start: 'top bottom', end: 'bottom top', scrub: true }
        });
        gsap.to('.nr-ring-2', {
          y: 40,
          scrollTrigger: { trigger: '.nr-ring-stack', start: 'top bottom', end: 'bottom top', scrub: true }
        });

        /* Story text */
        gsap.to('.nr-story-label', { opacity: 1, scrollTrigger: { trigger: '.nr-story-text', start: 'top 80%', toggleActions: 'play none none none' } });
        gsap.to('.nr-story-h2',    { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: '.nr-story-h2', start: 'top 85%', toggleActions: 'play none none none' } });
        gsap.utils.toArray<HTMLElement>('.nr-story-para').forEach((p, i) => {
          gsap.to(p, { opacity: 1, y: 0, duration: 0.9, delay: i * 0.1, scrollTrigger: { trigger: p, start: 'top 90%', toggleActions: 'play none none none' } });
        });

        /* Venue */
        gsap.to('.nr-venue-box', {
          clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power3.out',
          scrollTrigger: { trigger: '.nr-venue-box', start: 'top 80%', toggleActions: 'play none none none' }
        });
        gsap.to('.nr-venue-text', { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: '.nr-venue-text', start: 'top 80%', toggleActions: 'play none none none' } });

        /* Timeline rail draw */
        ST.create({
          trigger: '#nr-timeline', start: 'top 80%', end: 'bottom 20%', scrub: 0.8,
          onUpdate: (s) => {
            const fill  = document.getElementById('nr-rail-fill');
            const track = document.querySelector('.nr-timeline-track') as HTMLElement;
            if (fill && track) fill.style.height = (s.progress * track.offsetHeight) + 'px';
          }
        });
        gsap.utils.toArray<HTMLElement>('.nr-timeline-event').forEach((ev, i) => {
          gsap.to(ev, { opacity: 1, x: 0, duration: 0.8, delay: i * 0.1, scrollTrigger: { trigger: ev, start: 'top 85%', toggleActions: 'play none none none' } });
        });

        /* RSVP */
        gsap.utils.toArray<HTMLElement>('.nr-form-group').forEach((g, i) => {
          gsap.to(g, { opacity: 1, y: 0, duration: 0.7, delay: i * 0.07, scrollTrigger: { trigger: g, start: 'top 90%', toggleActions: 'play none none none' } });
        });
        gsap.to('#nr-rsvp-btn', { opacity: 1, duration: 0.8, scrollTrigger: { trigger: '#nr-rsvp-btn', start: 'top 90%', toggleActions: 'play none none none' } });

        /* Closing */
        gsap.to('.nr-closing-content', { opacity: 1, duration: 1.4, ease: 'power2.out', scrollTrigger: { trigger: '#nr-closing', start: 'top 70%', toggleActions: 'play none none none' } });
      });
    });

    return () => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.killAll());
    };
  }, [introDone]);

  /* ── Reveal main page ── */
  function revealPage() {
    introEngineRef.current?.stop();
    setIntroDone(true);
  }

  /* ── RSVP submit ── */
  function submitRSVP(e: React.FormEvent) {
    e.preventDefault();
    setTimeout(() => setRsvpSent(true), 1200);
  }

  return (
    <div style={{ background: C.black, color: C.ivory, overflowX: 'hidden', fontFamily: cormorant.style.fontFamily }}>

      {/* ══ CINEMATIC LETTER INTRO ══ */}
      {!introDone && (
        <div ref={introRef} style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: C.wine, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <video
            ref={letterVideoRef}
            autoPlay muted playsInline
            onEnded={revealPage}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src="/assets/nr/intro-main.mp4" type="video/mp4" />
            <source src="/assets/nr/intro-01.mp4" type="video/mp4" />
          </video>

          {/* Sparkle canvas on intro */}
          <canvas ref={introCanvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }} />

          {/* Vignette */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(8,5,5,0.7) 100%)', pointerEvents: 'none', zIndex: 1 }} />

          {/* Tagline */}
          <div ref={taglineRef} style={{
            position: 'absolute', zIndex: 3, textAlign: 'center',
            opacity: 0, transition: 'opacity 1.4s ease', pointerEvents: 'none',
          }}>
            <span style={{ fontFamily: montserrat.style.fontFamily, fontSize: 'clamp(0.55rem,1.5vw,0.65rem)', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.gold, display: 'block', marginBottom: 16 }}>
              You are invited
            </span>
            <div style={{ fontFamily: bodoni.style.fontFamily, fontSize: 'clamp(3rem,10vw,7rem)', fontWeight: 400, color: C.ivory, lineHeight: 0.88 }}>
              Neil
              <span style={{ display: 'block', fontStyle: 'italic', color: C.gold, fontSize: '0.55em' }}>&amp;</span>
              Riley
            </div>
          </div>

          {/* Skip */}
          <button onClick={revealPage} style={{
            position: 'absolute', top: 28, right: 28, zIndex: 4,
            fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.3em',
            textTransform: 'uppercase', color: 'rgba(244,232,214,0.5)',
            background: 'transparent', border: 'none', cursor: 'pointer',
          }}>Skip ↓</button>
        </div>
      )}

      {/* ══ MAIN PAGE ══ */}
      <div style={{ opacity: introDone ? 1 : 0, transition: 'opacity 0.8s ease', pointerEvents: introDone ? 'auto' : 'none' }}>

        {/* Back link */}
        <div style={{ position: 'fixed', top: 28, left: 28, zIndex: 100 }}>
          <Link href="/collection" style={{
            fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem',
            letterSpacing: '0.35em', textTransform: 'uppercase',
            color: 'rgba(244,232,214,0.6)', textDecoration: 'none',
            transition: 'color 0.3s',
          }}>← Collection</Link>
        </div>

        {/* ── HERO ── */}
        <section id="nr-hero" style={{ position: 'relative', width: '100%', height: '100svh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <video autoPlay muted playsInline loop poster="/assets/nr/invitation-box.png"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
            <source src="/assets/nr/intro-01.mp4" type="video/mp4" />
            <source src="/assets/nr/intro-main.mp4" type="video/mp4" />
          </video>
          <canvas ref={heroCanvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }} />
          <div id="nr-hero-overlay" style={{ position: 'absolute', inset: 0, zIndex: 1, background: `linear-gradient(to bottom, rgba(8,5,5,0.45) 0%, rgba(37,2,4,0.65) 60%, rgba(8,5,5,0.95) 100%)` }} />
          <div id="nr-hero-content" style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '0 24px' }}>
            <p className="nr-hero-eyebrow" style={{ fontFamily: montserrat.style.fontFamily, fontSize: 'clamp(0.6rem,1.5vw,0.7rem)', letterSpacing: '0.5em', color: C.gold, textTransform: 'uppercase', opacity: 0, transform: 'translateY(12px)' }}>You are invited</p>
            <h1 className="nr-hero-names" style={{ fontFamily: bodoni.style.fontFamily, fontSize: 'clamp(4rem,14vw,9rem)', fontWeight: 400, color: C.ivory, lineHeight: 0.85, opacity: 0, transform: 'translateY(24px)', margin: '20px 0 24px' }}>
              Neil
              <span style={{ color: C.gold, fontStyle: 'italic', display: 'block', fontSize: '0.65em' }}>&amp;</span>
              Riley
            </h1>
            <p className="nr-hero-sub" style={{ fontSize: 'clamp(0.85rem,2vw,1rem)', letterSpacing: '0.2em', color: C.champagne, fontWeight: 300, opacity: 0, transform: 'translateY(12px)' }}>
              A Wedding Celebration &nbsp;·&nbsp; Acquafarina, Vancouver
            </p>
            <div className="nr-hero-divider" style={{ width: 0, height: 1, background: C.gold, margin: '32px auto', opacity: 0 }} />
            <button id="nr-open-btn"
              onClick={() => document.getElementById('nr-invitation')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ opacity: 0, border: `1px solid ${C.gold}`, color: C.ivory, fontFamily: montserrat.style.fontFamily, fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', padding: '16px 40px', background: 'transparent', cursor: 'pointer', marginTop: 32 }}>
              Open Invitation
            </button>
          </div>
          <div id="nr-scroll-hint" style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 3, opacity: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 1, height: 48, background: `linear-gradient(to bottom, ${C.gold}, transparent)`, animation: 'nrScrollPulse 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.35em', color: C.champagne, textTransform: 'uppercase' }}>Scroll</span>
          </div>
        </section>

        {/* ── INVITATION REVEAL ── */}
        <section id="nr-invitation" style={{ position: 'relative', minHeight: '100vh', padding: '80px 24px', backgroundImage: "url('/assets/nr/velvet-texture.png')", backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,5,5,0.62)' }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48, maxWidth: 1100, width: '100%' }}>
            <div className="nr-inv-card" style={{ flex: '0 0 auto', transform: 'rotate(-4deg) scale(0.85)', opacity: 0, boxShadow: '0 40px 120px rgba(0,0,0,0.8)', maxWidth: 420, width: '100%' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/nr/newspaper-invitation.png" alt="Neil & Riley Wedding Invitation" style={{ width: '100%', display: 'block' }} />
            </div>
            <div className="nr-inv-text" style={{ flex: 1, opacity: 0, transform: 'translateY(32px)' }}>
              <p style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.gold }}>Special Edition</p>
              <div className="nr-gold-line" style={{ width: 0, height: 1, background: C.gold, margin: '16px 0' }} />
              <h2 style={{ fontFamily: bodoni.style.fontFamily, fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 400, lineHeight: 1.05, color: C.ivory, marginBottom: 24 }}>
                Breaking News<br /><em style={{ color: C.gold }}>A New Era Begins</em>
              </h2>
              <p style={{ fontSize: 'clamp(0.9rem,1.8vw,1.05rem)', lineHeight: 1.9, color: C.champagne, fontWeight: 300, maxWidth: 440 }}>
                Neil and Riley invite you to celebrate their wedding at Acquafarina in Vancouver — a celebration of love, laughter, and a lifetime of memories together.
              </p>
            </div>
          </div>
        </section>

        {/* ── DETAILS ── */}
        <section id="nr-details" style={{ padding: '120px 24px', background: C.black }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <p style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.gold }}>The Details</p>
              <div className="nr-gold-line" style={{ width: 0, height: 1, background: C.gold, margin: '16px auto', maxWidth: 80 }} />
              <h2 style={{ fontFamily: bodoni.style.fontFamily, fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 400, color: C.ivory, marginTop: 16 }}>An Evening to Remember</h2>
            </div>
            {[
              { label: 'Date',      value: 'Saturday, September 14', sub: '2026' },
              { label: 'Ceremony',  value: '4:00 PM',                sub: 'Doors open at 3:30 PM' },
              { label: 'Dinner',    value: '6:00 PM',                sub: 'Dinner & Celebration' },
              { label: 'Venue',     value: 'Acquafarina',            sub: 'Vancouver, British Columbia' },
              { label: 'Dress Code',value: 'Black Tie Optional',     sub: 'Formal attire encouraged' },
              { label: 'RSVP By',   value: 'August 15, 2026',        sub: 'Kindly reply by this date' },
            ].map((row, i) => (
              <div key={i} className="nr-detail-row" style={{ display: 'flex', alignItems: 'flex-start', gap: 32, padding: '40px 0', borderBottom: i < 5 ? `1px solid rgba(176,138,74,0.15)` : 'none', opacity: 0, transform: 'translateY(24px)' }}>
                <span style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: C.gold, flex: '0 0 120px', paddingTop: 4 }}>{row.label}</span>
                <div style={{ flex: '0 0 1px', background: C.gold, alignSelf: 'stretch', opacity: 0.4 }} />
                <div style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 300, color: C.ivory, lineHeight: 1.3 }}>
                  {row.value}
                  <small style={{ display: 'block', fontSize: '0.7em', color: C.champagne, letterSpacing: '0.1em', marginTop: 4, fontFamily: montserrat.style.fontFamily, fontWeight: 300 }}>{row.sub}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── THEIR STORY ── */}
        <section id="nr-story" style={{ position: 'relative', padding: '120px 24px', backgroundImage: "url('/assets/nr/velvet-texture.png')", backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,5,5,0.72)' }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 80 }}>
            <div className="nr-story-images" style={{ width: '100%', maxWidth: 340, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/nr/couple-portrait.png" alt="Neil & Riley" className="nr-portrait" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', opacity: 0, transform: 'translateX(-60px)', willChange: 'transform' }} />
              <div className="nr-ring-stack" style={{ position: 'relative', width: '100%', marginTop: -40 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/nr/ring-01.png" alt="The Ring" className="nr-ring-1" style={{ width: '80%', aspectRatio: '3/4', objectFit: 'cover', opacity: 0, marginLeft: 'auto', transform: 'translateX(60px) rotate(3deg)', willChange: 'transform', display: 'block' }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/nr/ring-02.png" alt="Together" className="nr-ring-2" style={{ width: '80%', aspectRatio: '3/4', objectFit: 'cover', opacity: 0, marginTop: -80, transform: 'translateX(-60px) rotate(-2deg)', willChange: 'transform', display: 'block' }} />
              </div>
            </div>
            <div className="nr-story-text">
              <p className="nr-story-label" style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.gold, opacity: 0, marginBottom: 32 }}>Their Story</p>
              <div className="nr-gold-line" style={{ width: 0, height: 1, background: C.gold, margin: '16px 0' }} />
              <h2 className="nr-story-h2" style={{ fontFamily: bodoni.style.fontFamily, fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400, color: C.ivory, marginBottom: 40, opacity: 0, transform: 'translateY(24px)' }}>
                A Moment That<br />Becomes Unforgettable
              </h2>
              {[
                'Neil and Riley\'s story began in Vancouver, in the kind of moment that feels simple at first but becomes unforgettable with time.',
                'What started as a casual meeting slowly became something deeper: shared conversations, familiar places, and the quiet feeling of finding someone who made every ordinary day feel warmer.',
                'Over time, Vancouver became part of their story. Its evenings, its restaurants, its ocean air, and its city lights became the backdrop to the memories they built together.',
                'Now, surrounded by the people they love most, Neil and Riley will begin their next chapter at Acquafarina.',
              ].map((p, i) => (
                <p key={i} className="nr-story-para" style={{ fontSize: 'clamp(0.9rem,1.8vw,1.05rem)', lineHeight: 2, color: C.champagne, fontWeight: 300, marginBottom: 24, opacity: 0, transform: 'translateY(16px)' }}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* ── VENUE ── */}
        <section id="nr-venue" style={{ padding: '120px 24px', background: C.black }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 64 }}>
            <div className="nr-venue-visual" style={{ width: '100%', maxWidth: 420, margin: '0 auto' }}>
              <div className="nr-venue-box" style={{ width: '100%', aspectRatio: '4/5', background: C.wine, position: 'relative', overflow: 'hidden', clipPath: 'inset(0 100% 0 0)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/nr/invitation-box.png" alt="Acquafarina Vancouver" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                <span style={{ position: 'absolute', bottom: 24, left: 24, fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.champagne, opacity: 0.8 }}>Acquafarina · Vancouver</span>
              </div>
            </div>
            <div className="nr-venue-text" style={{ flex: 1, opacity: 0, transform: 'translateY(32px)' }}>
              <p style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.gold }}>The Venue</p>
              <div className="nr-gold-line" style={{ width: 0, height: 1, background: C.gold, margin: '16px 0' }} />
              <h2 style={{ fontFamily: bodoni.style.fontFamily, fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 400, color: C.ivory, lineHeight: 1.05, marginBottom: 8 }}>Acquafarina</h2>
              <p style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: C.gold, marginBottom: 32 }}>Vancouver, British Columbia</p>
              <p style={{ fontSize: 'clamp(0.9rem,1.8vw,1rem)', lineHeight: 1.9, color: C.champagne, fontWeight: 300, marginBottom: 40 }}>
                Set in the heart of Vancouver, Acquafarina offers an elegant dining experience where refined cuisine, intimate atmosphere, and thoughtful hospitality come together. For Neil and Riley, it is the perfect setting for an unforgettable wedding celebration.
              </p>
            </div>
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section id="nr-timeline" style={{ position: 'relative', padding: '120px 24px', backgroundImage: "url('/assets/nr/velvet-texture.png')", backgroundSize: 'cover' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,5,5,0.78)' }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <p style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.gold }}>The Day</p>
              <div className="nr-gold-line" style={{ width: 0, height: 1, background: C.gold, margin: '16px auto', maxWidth: 80 }} />
              <h2 style={{ fontFamily: bodoni.style.fontFamily, fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 400, color: C.ivory, marginTop: 16 }}>September 14, 2026</h2>
            </div>
            <div className="nr-timeline-track" style={{ position: 'relative', paddingLeft: 40 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: 'rgba(176,138,74,0.2)' }}>
                <div id="nr-rail-fill" style={{ position: 'absolute', top: 0, width: 1, background: C.gold, height: 0 }} />
              </div>
              {[
                { time: '3:30 pm', name: 'Doors Open',    desc: 'Guests arrive & are welcomed', first: true },
                { time: '4:00 pm', name: 'Ceremony',      desc: 'The vows are exchanged' },
                { time: '5:00 pm', name: 'Cocktail Hour', desc: 'Champagne & canapés' },
                { time: '6:00 pm', name: 'Dinner',        desc: 'Fine dining at Acquafarina' },
                { time: '8:00 pm', name: 'Celebration',   desc: 'Dancing & festivities begin' },
                { time: 'Late',    name: 'Final Toast',   desc: 'An evening to remember, always' },
              ].map((ev, i) => (
                <div key={i} className="nr-timeline-event" style={{ display: 'flex', alignItems: 'flex-start', gap: 24, marginBottom: i < 5 ? 56 : 0, opacity: 0, transform: 'translateX(-16px)', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: -45, top: 6, width: 10, height: 10, borderRadius: '50%', border: `1px solid ${C.gold}`, background: ev.first ? C.gold : C.black }} />
                  <div style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.6rem', letterSpacing: '0.3em', color: C.gold, textTransform: 'uppercase', flex: '0 0 80px', paddingTop: 4 }}>{ev.time}</div>
                  <div>
                    <div style={{ fontSize: 'clamp(1.2rem,3vw,1.6rem)', fontWeight: 400, color: C.ivory, lineHeight: 1.3 }}>{ev.name}</div>
                    <div style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.65rem', letterSpacing: '0.1em', color: C.champagne, marginTop: 6, fontWeight: 300 }}>{ev.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RSVP ── */}
        <section id="nr-rsvp" style={{ padding: '120px 24px', background: C.burgundy }}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <p style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.gold }}>Your Reply Is Awaited</p>
              <div className="nr-gold-line" style={{ width: 0, height: 1, background: C.gold, margin: '16px auto', maxWidth: 80 }} />
              <h2 style={{ fontFamily: bodoni.style.fontFamily, fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 400, color: C.ivory, margin: '16px 0 12px' }}>Will You Join Us?</h2>
              <p style={{ fontSize: 'clamp(0.85rem,1.8vw,0.95rem)', color: C.champagne, fontWeight: 300, lineHeight: 1.8 }}>Kindly RSVP by August 15, 2026.<br />We would be honoured to celebrate with you.</p>
            </div>
            {rsvpSent ? (
              <div style={{ textAlign: 'center', padding: 40, border: `1px solid rgba(176,138,74,0.3)` }}>
                <h3 style={{ fontFamily: bodoni.style.fontFamily, fontSize: '2rem', color: C.ivory, marginBottom: 12 }}>Thank You</h3>
                <p style={{ color: C.champagne, fontWeight: 300, lineHeight: 1.8 }}>We have received your reply and cannot wait to celebrate with you.<br />Neil &amp; Riley</p>
              </div>
            ) : (
              <form onSubmit={submitRSVP}>
                {[
                  { label: 'Full Name',    id: 'nr-fname',   type: 'text',  placeholder: 'Your full name' },
                  { label: 'Email',        id: 'nr-email',   type: 'email', placeholder: 'your@email.com' },
                ].map((f) => (
                  <div key={f.id} className="nr-form-group" style={{ marginBottom: 32, opacity: 0, transform: 'translateY(16px)' }}>
                    <label style={{ display: 'block', fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.gold, marginBottom: 12 }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} required={f.id !== 'nr-dietary'}
                      style={{ width: '100%', background: 'rgba(244,232,214,0.06)', border: `1px solid rgba(176,138,74,0.3)`, color: C.ivory, fontFamily: cormorant.style.fontFamily, fontSize: '1rem', padding: '16px 20px', outline: 'none' }} />
                  </div>
                ))}
                <div className="nr-form-group" style={{ marginBottom: 32, opacity: 0, transform: 'translateY(16px)' }}>
                  <label style={{ display: 'block', fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.gold, marginBottom: 12 }}>Will You Attend?</label>
                  <select style={{ width: '100%', background: C.burgundy, border: `1px solid rgba(176,138,74,0.3)`, color: C.ivory, fontFamily: cormorant.style.fontFamily, fontSize: '1rem', padding: '16px 20px', outline: 'none', cursor: 'pointer' }}>
                    <option value="yes">Joyfully accepts</option>
                    <option value="no">Regretfully declines</option>
                  </select>
                </div>
                <div className="nr-form-group" style={{ marginBottom: 32, opacity: 0, transform: 'translateY(16px)' }}>
                  <label style={{ display: 'block', fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.gold, marginBottom: 12 }}>A Message for Neil &amp; Riley</label>
                  <textarea placeholder="Share a warm wish, a memory, or simply your love…" rows={4}
                    style={{ width: '100%', background: 'rgba(244,232,214,0.06)', border: `1px solid rgba(176,138,74,0.3)`, color: C.ivory, fontFamily: cormorant.style.fontFamily, fontSize: '1rem', padding: '16px 20px', outline: 'none', resize: 'vertical' }} />
                </div>
                <button id="nr-rsvp-btn" type="submit" style={{ width: '100%', background: 'transparent', border: `1px solid ${C.gold}`, color: C.ivory, fontFamily: montserrat.style.fontFamily, fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', padding: 20, cursor: 'pointer', marginTop: 16, opacity: 0 }}>
                  Send RSVP
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ── CLOSING ── */}
        <section id="nr-closing" style={{ position: 'relative', height: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <video autoPlay muted playsInline loop style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }}>
            <source src="/assets/nr/intro-02.mp4" type="video/mp4" />
            <source src="/assets/nr/intro-main.mp4" type="video/mp4" />
          </video>
          <canvas ref={closingCanvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, rgba(8,5,5,0.7) 0%, rgba(37,2,4,0.5) 50%, rgba(8,5,5,0.85) 100%)' }} />
          <div className="nr-closing-content" style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '0 24px', opacity: 0 }}>
            <p style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.gold }}>September 14, 2026</p>
            <div className="nr-gold-line" style={{ width: 0, height: 1, background: C.gold, margin: '16px auto', maxWidth: 80 }} />
            <h2 style={{ fontFamily: bodoni.style.fontFamily, fontSize: 'clamp(1.8rem,5vw,3.5rem)', fontWeight: 400, color: C.ivory, lineHeight: 1.3, marginBottom: 48 }}>We cannot wait to celebrate with you.</h2>
            <span style={{ fontFamily: bodoni.style.fontFamily, fontSize: 'clamp(3rem,10vw,7rem)', fontWeight: 400, color: C.ivory, lineHeight: 0.9, display: 'block' }}>
              Neil <span style={{ color: C.gold, fontStyle: 'italic', fontSize: '0.6em' }}>&amp;</span> Riley
            </span>
            <p style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.65rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.champagne, marginTop: 32 }}>Saturday, September 14, 2026</p>
            <p style={{ fontSize: 'clamp(0.9rem,2vw,1.1rem)', color: C.gold, marginTop: 8, fontStyle: 'italic' }}>Acquafarina, Vancouver</p>
          </div>
        </section>

        <footer style={{ padding: '48px 24px', background: C.black, textAlign: 'center', borderTop: `1px solid rgba(176,138,74,0.12)` }}>
          <p style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(244,232,214,0.3)' }}>Neil &amp; Riley &nbsp;·&nbsp; September 14, 2026 &nbsp;·&nbsp; Acquafarina, Vancouver</p>
          <p style={{ fontFamily: montserrat.style.fontFamily, fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(244,232,214,0.2)', marginTop: 12 }}>#NeilandRiley2026</p>
        </footer>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes nrScrollPulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
        #nr-open-btn:hover { background: ${C.gold} !important; color: ${C.black} !important; }
        .nr-ring-1:hover,.nr-ring-2:hover { transform: scale(1.04) !important; }
      `}</style>
    </div>
  );
}
