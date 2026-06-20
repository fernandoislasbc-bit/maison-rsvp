'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';

/* ─── Data ─────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    text:  'We had seen every wedding website. Every template. What Maison RSVP created felt like nothing we had ever encountered. Our guests called to tell us they had held their breath.',
    by:    'C. & A. Worthington',
    when:  'Château de la Marquise, Bordeaux — 2024',
  },
  {
    text:  'Our members expect a certain quality of experience. The invitation Maison RSVP built for our founders’ evening was the finest piece of digital design our club has ever presented.',
    by:    'E. Laroche',
    when:  'The Corinthian Club, London — 2024',
  },
  {
    text:  'We brief the finest hotels, the finest florists. The invitation is the first impression. Working with Maison RSVP is simply the correct choice for events at this level.',
    by:    'I. Fontaine',
    when:  'Private Client Services, Geneva — 2023',
  },
  {
    text:  "My mother’s eighty-fifth birthday. My father’s gift to her was commissioning this. She has never stopped speaking about it. Neither has anyone who received it.",
    by:    'T. Blackwood',
    when:  'Private — 2023',
  },
];

const WORKS = [
  {
    img:      '/assets/editorial-1.jpg',
    date:     'Bordeaux — Autumn 2024',
    title:    'The Bellmont',
    note:     'A wedding invitation composed as a nocturne. Candlelight on stone. The sound of quiet ceremony. Received in forty-two countries.',
    location: 'Private Wedding',
  },
  {
    img:      '/assets/editorial-2.jpg',
    date:     'Paris — Spring 2024',
    title:    'Hôtel Particulier',
    note:     "An annual founders’ dinner for a private members’ house. The invitation arrived as a document of silence. Three hundred guests. One evening. No second commission.",
    location: "Private Members’ Club",
  },
  {
    img:      '/assets/editorial-3.jpg',
    date:     'Geneva — Winter 2023',
    title:    'A Golden Anniversary',
    note:     'Fifty years. A gift from a husband to his wife. Built to feel like the memory of their first morning together.',
    location: 'Private Anniversary',
  },
];

/* ═══════════════════════════════════════════════════ */
export default function Home() {
  const [celIdx, setCelIdx] = useState(0);

  return (
    <>
      {/* Global paper grain */}
      <div
        aria-hidden
        style={{
          position: 'fixed', inset: 0, zIndex: 9990, pointerEvents: 'none',
          opacity: .028,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '220px',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Shared navigation — fades in after hero loads */}
      <Nav />

      {/* CHAPTER I — THE INVITATION */}
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="/assets/hero.mp4"
        title="An invitation. Yours."
        subtitle="A world of its own."
        scrollToExpand="Scroll to enter"
      >
        <PostHeroContent celIdx={celIdx} setCelIdx={setCelIdx} />
      </ScrollExpandMedia>
    </>
  );
}

/* ─── All chapters that follow the hero ─── */
function PostHeroContent({
  celIdx, setCelIdx,
}: {
  celIdx: number;
  setCelIdx: (i: number) => void;
}) {
  return (
    <div style={{ background: 'var(--ivory)', color: 'var(--ink)' }}>

      <GoldRule />

      {/* II — THE STORY */}
      <section
        id="story"
        style={{
          position: 'relative', overflow: 'hidden',
          padding: 'clamp(6rem,12vw,12rem) clamp(2rem,5vw,5rem)',
          background: `
            radial-gradient(ellipse 100% 50% at 50% 0%, #F3EDE2 0%, transparent 60%),
            radial-gradient(ellipse 80%  60% at 20% 80%, #F0E9DC 0%, transparent 55%),
            #F8F5F0
          `,
        }}
      >
        <ChapterLabel>Chapter II — The Story</ChapterLabel>
        <h2 style={{
          fontFamily: 'var(--font-prata), Georgia, serif',
          fontSize: 'clamp(3.2rem,8.5vw,9.5rem)',
          lineHeight: .96, letterSpacing: '-.03em',
          maxWidth: '12ch', marginBottom: 'clamp(4rem,8vw,8rem)',
        }}>
          Before<br />a guest<br />arrives.
        </h2>

        <div style={{ position: 'relative', height: 'clamp(400px,70vh,800px)', overflow: 'hidden', marginBottom: 'clamp(3rem,6vw,6rem)' }}>
          <Image
            src="/assets/editorial-4.jpg"
            alt="Bespoke invitation detail"
            fill style={{ objectFit: 'cover', transform: 'scale(1.05)' }}
            sizes="100vw"
          />
          <div aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px', mixBlendMode: 'multiply',
          }} />
          <span style={{
            position: 'absolute', bottom: '2rem', right: 'clamp(2rem,5vw,5rem)',
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.58rem', letterSpacing: '.25em', textTransform: 'uppercase',
            color: 'rgba(14,13,11,.35)',
          }}>
            Atelier detail — Paris, 2024
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <p style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontSize: 'clamp(1.1rem,1.5vw,1.35rem)',
            lineHeight: 1.85, color: 'var(--mist)', maxWidth: '42ch',
          }}>
            Maison RSVP was founded on a singular belief: that the digital
            experience of being invited to something extraordinary should feel
            as considered, as crafted, and as unforgettable as the event itself.
            We work with those who understand that the invitation is not a
            formality. It is the first chapter of the story they are asking
            their guests to enter.
          </p>
        </div>
        <div style={{ marginTop: 'clamp(2.5rem,5vw,4.5rem)', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/collection" style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid rgba(14,13,11,.2)', paddingBottom: '.15em' }}>The Collection →</Link>
          <Link href="/about" style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.88rem', color: 'var(--mist)', textDecoration: 'none' }}>Our story</Link>
        </div>
        <p style={{
          marginTop: 'clamp(2rem,4vw,4rem)',
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '.6rem', letterSpacing: '.4em', textTransform: 'uppercase',
          color: 'var(--gold)',
        }}>
          By private commission only
        </p>
      </section>

      <GoldRule />

      {/* II.5 — WHAT YOU RECEIVE */}
      <section
        id="what-you-receive"
        style={{
          background: '#F8F5F0',
          padding: 'clamp(6rem,12vw,12rem) clamp(2rem,5vw,5rem)',
        }}
      >
        <ChapterLabel>What You Receive</ChapterLabel>
        <h2 style={{
          fontFamily: 'var(--font-prata), Georgia, serif',
          fontSize: 'clamp(2.6rem,6vw,6.5rem)',
          lineHeight: .98, letterSpacing: '-.025em',
          maxWidth: '20ch', marginBottom: 'clamp(3rem,6vw,5rem)',
        }}>
          Not a wedding website.<br />
          <em style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', color: 'var(--gold)' }}>
            A living invitation.
          </em>
        </h2>

        {/* Deliverables grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,260px),1fr))',
          gap: 'clamp(2.5rem,5vw,4rem)',
          marginBottom: 'clamp(5rem,9vw,8rem)',
          maxWidth: 1100,
        }}>
          {[
            { n: '01', title: 'A cinematic scroll story', desc: 'Built once, for your event — motion, narrative, and pacing designed around your story, not a drag-and-drop template.' },
            { n: '02', title: 'RSVP & guest management', desc: 'Guests respond directly inside the experience. You see replies, meal choices, and details in one private dashboard.' },
            { n: '03', title: 'One link, every device', desc: 'Sent by text, email, or printed card. Opens flawlessly on a phone in a taxi or a desktop at home.' },
            { n: '04', title: 'Sound, motion, and detail', desc: 'Original music or atmosphere, GSAP-driven animation, and typography composed specifically for your occasion.' },
          ].map(item => (
            <div key={item.n}>
              <span style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '.6rem', letterSpacing: '.3em',
                color: 'var(--gold)', display: 'block', marginBottom: '1rem',
              }}>
                {item.n}
              </span>
              <h3 style={{
                fontFamily: 'var(--font-prata), Georgia, serif',
                fontSize: 'clamp(1.15rem,1.8vw,1.5rem)',
                lineHeight: 1.25, marginBottom: '.75rem',
              }}>
                {item.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-garamond), Georgia, serif',
                fontStyle: 'italic', fontSize: '.92rem',
                color: 'var(--mist)', lineHeight: 1.7,
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Tiers strip */}
        <div style={{
          borderTop: '1px solid var(--dust)',
          paddingTop: 'clamp(3rem,6vw,5rem)',
        }}>
          <p style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.58rem', letterSpacing: '.35em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: 'clamp(2rem,4vw,3rem)',
          }}>
            Three Collections
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,240px),1fr))',
            gap: 'clamp(2rem,4vw,3rem)',
            marginBottom: 'clamp(3rem,5vw,4rem)',
          }}>
            {[
              { name: 'Prelude',   price: 'From $2,400',    desc: 'Intimate weddings & private dinners.' },
              { name: 'Signature', price: 'From $5,800',    desc: 'Destination weddings, 100–300 guests.' },
              { name: 'Maison',    price: 'By consultation', desc: 'Ultra-luxury, 300+ guests, full creative direction.' },
            ].map(tier => (
              <div key={tier.name} style={{ borderLeft: '1px solid rgba(162,129,90,.25)', paddingLeft: '1.5rem' }}>
                <h4 style={{
                  fontFamily: 'var(--font-prata), Georgia, serif',
                  fontSize: 'clamp(1.3rem,2vw,1.7rem)', marginBottom: '.4rem',
                }}>
                  {tier.name}
                </h4>
                <p style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '.7rem', letterSpacing: '.05em',
                  color: 'var(--gold)', marginBottom: '.6rem',
                }}>
                  {tier.price}
                </p>
                <p style={{
                  fontFamily: 'var(--font-garamond), Georgia, serif',
                  fontStyle: 'italic', fontSize: '.85rem',
                  color: 'var(--mist)', lineHeight: 1.6,
                }}>
                  {tier.desc}
                </p>
              </div>
            ))}
          </div>
          <Link href="/collection" style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase',
            color: 'var(--ink)', textDecoration: 'none',
            borderBottom: '1px solid rgba(14,13,11,.2)', paddingBottom: '.15em',
          }}>
            See full collection & pricing →
          </Link>
        </div>
      </section>

      <GoldRule />

      {/* III — THE EXPERIENCE */}
      <section
        id="experience"
        style={{
          background: 'var(--deep)', color: 'var(--ivory)',
          padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: .055,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px', mixBlendMode: 'screen',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <ChapterLabel muted>Chapter III — The Experience</ChapterLabel>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,280px),1fr))',
            gap: '1px', marginTop: 'clamp(3rem,6vw,6rem)',
            background: 'rgba(248,245,240,.05)',
          }}>
            {[
              { n: '01', title: 'Weddings',            desc: 'A digital experience as singular as your union — motion, narrative, and music woven into one extraordinary moment.' },
              { n: '02', title: 'Private Celebrations', desc: 'The anniversary, the milestone, the gathering of those who matter most. Intimate. Considered. Yours alone.' },
              { n: '03', title: 'Luxury Hospitality',   desc: "For hotels, private members’ clubs, and destination events that require an invitation worthy of the address." },
              { n: '04', title: 'Brand Moments',        desc: 'For maisons and ateliers for whom even the invitation must carry the full weight of house values.' },
              { n: '05', title: 'Legacy Events',        desc: 'Once-in-a-generation occasions treated with the gravity and tenderness they deserve.' },
              { n: '06', title: 'Curated Gatherings',   desc: 'Art openings, cultural evenings, intimate suppers. When the invitation must announce: this evening will be unlike any other.' },
            ].map(item => (
              <ExpPanel key={item.n} num={item.n} title={item.title} desc={item.desc} />
            ))}
          </div>
        </div>
      </section>

      {/* IV — THE COLLECTION */}
      <section
        id="collection"
        style={{
          background: `radial-gradient(ellipse 60% 20% at 50% 0%, #F2EBE0 0%, transparent 50%), #F8F5F0`,
          paddingTop: 'clamp(6rem,12vw,12rem)',
        }}
      >
        <div style={{
          padding: '0 clamp(2rem,5vw,5rem) clamp(4rem,8vw,8rem)',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', gap: '2rem', flexWrap: 'wrap',
        }}>
          <div>
            <ChapterLabel>Chapter IV — Selected Works</ChapterLabel>
            <h2 style={{
              fontFamily: 'var(--font-prata), Georgia, serif',
              fontSize: 'clamp(2.8rem,6vw,7rem)',
              lineHeight: .95, letterSpacing: '-.02em',
            }}>
              Three<br />works.
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{
              fontFamily: 'var(--font-garamond), Georgia, serif',
              fontStyle: 'italic', fontSize: 'clamp(.9rem,1.1vw,1rem)',
              color: 'var(--mist)', maxWidth: '28ch', lineHeight: 1.7, marginBottom: '1.25rem',
            }}>
              Each one existed once.<br />None were made again.
            </p>
            <Link href="/work" style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.58rem', letterSpacing: '.3em', textTransform: 'uppercase',
              color: 'var(--gold)', textDecoration: 'none',
              borderBottom: '1px solid rgba(162,129,90,.3)', paddingBottom: '.15em',
            }}>
              View all commissions →
            </Link>
          </div>
        </div>
        {WORKS.map((work, i) => (
          <WorkSpread key={work.title} work={work} flip={i % 2 === 1} />
        ))}
      </section>

      {/* V — THE PHILOSOPHY */}
      <section
        id="philosophy"
        style={{
          minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(7rem,12vw,12rem) clamp(2rem,5vw,5rem)',
          position: 'relative', overflow: 'hidden', textAlign: 'center',
          background: `radial-gradient(ellipse 70% 80% at 50% 50%, #F2EBE0 0%, #F8F5F0 65%), #F8F5F0`,
        }}
      >
        <span aria-hidden style={{
          position: 'absolute',
          fontFamily: 'var(--font-prata), Georgia, serif',
          fontSize: 'clamp(14rem,30vw,32rem)', lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(162,129,90,.045)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none',
        }}>
          RSVP
        </span>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900 }}>
          <ChapterLabel>Chapter V — The Philosophy</ChapterLabel>
          <blockquote>
            <p style={{
              fontFamily: 'var(--font-prata), Georgia, serif',
              fontSize: 'clamp(2rem,4.5vw,5rem)',
              lineHeight: 1.18, letterSpacing: '-.015em',
              marginBottom: 'clamp(2.5rem,5vw,4rem)',
            }}>
              We do not design websites. We compose the{' '}
              <em style={{
                fontFamily: 'var(--font-garamond), Georgia, serif',
                fontStyle: 'italic', color: 'var(--gold)', fontSize: '1.12em',
              }}>
                first act
              </em>{' '}
              of your story.
            </p>
          </blockquote>
          <p style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.58rem', letterSpacing: '.35em', textTransform: 'uppercase',
            color: 'var(--mist)',
          }}>
            — Maison RSVP, Founding Principle
          </p>
        </div>
      </section>

      <GoldRule />

      {/* VI — THE CELEBRATION */}
      <section
        id="celebration"
        style={{
          background: 'var(--deep)', color: 'var(--ivory)',
          padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)',
          position: 'relative', overflow: 'hidden', minHeight: '80vh',
        }}
      >
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: .06,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.62' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px', mixBlendMode: 'screen',
        }} />
        <div aria-hidden style={{
          position: 'absolute', left: 'clamp(2rem,5vw,5rem)', top: 0, bottom: 0, width: 1, zIndex: 1,
          background: 'linear-gradient(to bottom, transparent, rgba(162,129,90,.4) 30%, rgba(162,129,90,.6) 50%, rgba(162,129,90,.4) 70%, transparent)',
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <ChapterLabel muted>Chapter VI — Words from Those Who Know</ChapterLabel>
          <div style={{ maxWidth: 900, marginTop: 'clamp(3rem,6vw,6rem)' }}>
            <span style={{
              fontFamily: 'var(--font-prata), Georgia, serif',
              fontSize: 'clamp(4rem,8vw,8rem)', color: 'var(--gold)',
              opacity: .18, lineHeight: 1, display: 'block', marginBottom: '1.5rem',
            }}>
              &ldquo;
            </span>
            <p style={{
              fontFamily: 'var(--font-prata), Georgia, serif',
              fontSize: 'clamp(1.4rem,2.8vw,3rem)',
              lineHeight: 1.35, letterSpacing: '-.01em', color: 'var(--ivory)',
              marginBottom: 'clamp(2rem,4vw,3.5rem)',
            }}>
              {TESTIMONIALS[celIdx].text}
            </p>
            <p style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase',
              color: 'var(--gold)',
            }}>
              {TESTIMONIALS[celIdx].by}
            </p>
            <p style={{
              fontFamily: 'var(--font-garamond), Georgia, serif',
              fontStyle: 'italic', fontSize: '.85rem', letterSpacing: '.05em',
              color: 'rgba(248,245,240,.28)', marginTop: '.4rem',
            }}>
              {TESTIMONIALS[celIdx].when}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '.75rem', marginTop: 'clamp(3rem,5vw,5rem)', alignItems: 'center' }}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                aria-label={`Testimony ${i + 1}`}
                aria-current={i === celIdx}
                onClick={() => setCelIdx(i)}
                style={{
                  /* 44px hit area around a 4px visual dot */
                  width: 44, height: 44,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'transparent', border: 'none', padding: 0,
                  margin: '0 -14px', cursor: 'none',
                }}
              >
                <span aria-hidden style={{
                  width: i === celIdx ? 20 : 4, height: 4,
                  borderRadius: i === celIdx ? 2 : '50%',
                  background: i === celIdx ? 'var(--gold)' : 'rgba(248,245,240,.2)',
                  transition: 'all .3s ease', display: 'block',
                }} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* VII — BEGIN */}
      <section
        id="begin"
        style={{
          minHeight: '100svh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(7rem,12vw,12rem) clamp(2rem,5vw,5rem)',
          position: 'relative', overflow: 'hidden', textAlign: 'center',
          background: `
            radial-gradient(ellipse 80% 70% at 50% 50%, #F2EBE0 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 30% 20%, #EDE4D5 0%, transparent 50%),
            #F8F5F0
          `,
        }}
      >
        <div aria-hidden style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '50vw', height: '50vw', maxWidth: 700, maxHeight: 700,
          background: 'radial-gradient(circle, rgba(162,129,90,.08) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <style>{`
          @keyframes ring-pulse {
            0%   { transform: translate(-50%,-50%) scale(.85); opacity: .7; }
            100% { transform: translate(-50%,-50%) scale(1.1); opacity: 0; }
          }
        `}</style>
        {([420, 620, 820] as number[]).map((s, i) => (
          <div key={s} aria-hidden style={{
            position: 'absolute', top: '50%', left: '50%',
            width: `min(${s}px, ${55 + i * 20}vw)`, height: `min(${s}px, ${55 + i * 20}vw)`,
            borderRadius: '50%',
            border: `1px solid rgba(162,129,90,${.08 - i * .025})`,
            transform: 'translate(-50%,-50%)', pointerEvents: 'none',
            animation: `ring-pulse ${5 + i * 1.5}s ease-out ${i * 1.6}s infinite`,
          }} />
        ))}

        <ChapterLabel>Chapter VII — Begin</ChapterLabel>
        <h2 style={{
          position: 'relative', zIndex: 1,
          fontFamily: 'var(--font-prata), Georgia, serif',
          fontSize: 'clamp(2.8rem,7vw,8rem)',
          lineHeight: 1, letterSpacing: '-.025em',
          marginBottom: 'clamp(3rem,6vw,5rem)',
        }}>
          Your event<br />
          deserves<br />
          its own<br />
          world.
        </h2>
        <p style={{
          position: 'relative', zIndex: 1,
          fontFamily: 'var(--font-garamond), Georgia, serif',
          fontStyle: 'italic', fontSize: 'clamp(1rem,1.5vw,1.2rem)',
          color: 'var(--mist)', lineHeight: 1.6,
          marginBottom: 'clamp(2.5rem,5vw,4rem)',
        }}>
          We accept a limited number of commissions each season.<br />
          <strong style={{ fontStyle: 'normal', color: 'var(--ink)', fontWeight: 400 }}>
            Three remain.
          </strong>
        </p>
        <Link
          href="/contact"
          style={{
            position: 'relative', zIndex: 1,
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontSize: 'clamp(1rem,1.8vw,1.35rem)', letterSpacing: '.04em',
            color: 'var(--gold)', borderBottom: '1px solid rgba(162,129,90,.3)',
            paddingBottom: '.2em', transition: 'color .4s, border-color .4s',
            display: 'inline-block', textDecoration: 'none',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--ink)';
            e.currentTarget.style.borderBottomColor = 'var(--ink)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--gold)';
            e.currentTarget.style.borderBottomColor = 'rgba(162,129,90,.3)';
          }}
        >
          Begin a commission →
        </Link>
        <p style={{
          position: 'relative', zIndex: 1,
          marginTop: '1rem',
          fontFamily: 'var(--font-garamond), Georgia, serif',
          fontStyle: 'italic', fontSize: '.85rem', color: 'var(--mist)',
        }}>
          or write to us at{' '}
          <a href="mailto:commissions@maisonrsvp.com" style={{ color: 'var(--gold)', textDecoration: 'none' }}>
            commissions@maisonrsvp.com
          </a>
        </p>
        <p style={{
          position: 'absolute', bottom: 'clamp(2rem,4vw,3.5rem)',
          left: 0, right: 0, textAlign: 'center', zIndex: 1,
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase',
          color: 'rgba(14,13,11,0.28)',
        }}>
          Vancouver &nbsp;&middot;&nbsp; London &nbsp;&middot;&nbsp; Lake Como
        </p>
      </section>

      <Footer />
    </div>
  );
}

/* ─── Sub-components ────────────────────────────────── */

function ChapterLabel({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <p style={{
      fontFamily: 'var(--font-manrope), sans-serif',
      fontSize: '.58rem', fontWeight: 400,
      letterSpacing: '.4em', textTransform: 'uppercase',
      color: muted ? 'rgba(162,129,90,.5)' : 'var(--gold)',
      marginBottom: 'clamp(1.5rem,3vw,2.5rem)',
    }}>
      {children}
    </p>
  );
}

function GoldRule() {
  return (
    <div aria-hidden style={{
      width: 30, height: 1, background: 'var(--gold)', opacity: .4,
      margin: 'clamp(4rem,8vw,8rem) auto',
    }} />
  );
}

function ExpPanel({ num, title, desc }: { num: string; title: string; desc: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: 'clamp(2rem,4vw,4rem)',
        background: hovered ? 'rgba(162,129,90,.07)' : 'var(--deep)',
        position: 'relative', overflow: 'hidden',
        transition: 'background .6s cubic-bezier(0.16,1,0.3,1)',
        borderTop: '1px solid rgba(248,245,240,.05)',
      }}
    >
      <span aria-hidden style={{
        position: 'absolute', top: '2rem', left: '2rem',
        fontFamily: 'var(--font-prata), Georgia, serif',
        fontSize: 'clamp(6rem,12vw,12rem)', lineHeight: 1,
        color: 'transparent',
        WebkitTextStroke: `1px rgba(248,245,240,${hovered ? .12 : .06})`,
        userSelect: 'none', transition: 'all .5s ease',
        textShadow: hovered ? '0 0 80px rgba(162,129,90,.3)' : 'none',
      }}>
        {num}
      </span>
      <h3 style={{
        fontFamily: 'var(--font-prata), Georgia, serif',
        fontSize: 'clamp(1.1rem,2vw,1.6rem)',
        color: 'var(--ivory)', marginBottom: '.8rem',
        lineHeight: 1.2, position: 'relative', zIndex: 1,
      }}>
        {title}
      </h3>
      <p style={{
        fontFamily: 'var(--font-garamond), Georgia, serif',
        fontStyle: 'italic', fontSize: 'clamp(.85rem,1.1vw,1rem)',
        color: 'rgba(248,245,240,.35)',
        lineHeight: 1.75, maxWidth: '26ch',
        position: 'relative', zIndex: 1,
      }}>
        {desc}
      </p>
    </article>
  );
}

function WorkSpread({ work, flip }: { work: typeof WORKS[0]; flip: boolean }) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const [hovered, setHovered] = useState(false);

  return (
    <article style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : flip ? 'row-reverse' : 'row',
        minHeight: isMobile ? 'auto' : '85vh',
      }}>
        <div
          style={{ flex: isMobile ? 'none' : '0 0 62%', position: 'relative', overflow: 'hidden', height: isMobile ? '56vw' : undefined }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Image
            src={work.img}
            alt={`${work.title} — ${work.location}, ${work.date}`}
            fill style={{
              objectFit: 'cover',
              transform: hovered ? 'scale(1.07)' : 'scale(1.04)',
              transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1)',
            }}
            sizes={isMobile ? '100vw' : '62vw'}
          />
          <div aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '160px', mixBlendMode: 'multiply',
          }} />
        </div>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: isMobile
            ? 'clamp(2.5rem,7vw,4rem) clamp(2rem,5vw,5rem)'
            : 'clamp(5rem,9vw,9rem) clamp(2rem,5vw,5rem)',
        }}>
          <p style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.58rem', letterSpacing: '.35em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: '1.5rem',
          }}>{work.date}</p>
          <h3 style={{
            fontFamily: 'var(--font-prata), Georgia, serif',
            fontSize: 'clamp(1.6rem,3vw,2.8rem)',
            lineHeight: 1.1, letterSpacing: '-.01em', marginBottom: '1.5rem',
          }}>{work.title}</h3>
          <p style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontStyle: 'italic', fontSize: 'clamp(.9rem,1.2vw,1.05rem)',
            color: 'var(--mist)', lineHeight: 1.75, maxWidth: '26ch',
          }}>{work.note}</p>
          <p style={{
            marginTop: '2.5rem',
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.58rem', letterSpacing: '.25em', textTransform: 'uppercase',
            color: 'rgba(14,13,11,0.28)',
          }}>{work.location}</p>
        </div>
      </div>
    </article>
  );
}
