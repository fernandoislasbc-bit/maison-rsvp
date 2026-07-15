'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import SilkHero from '@/components/ui/silk-background-animation';
import GrainHeroSection from '@/components/ui/grain-gradient-hero-section';
import WorksCinematicCarousel from '@/components/ui/works-cinematic-carousel';
import { WORKS as ALL_WORKS } from '@/lib/works';
import { ClientLogoCloud } from '@/components/ui/client-logo-cloud';
import { TestimonialsMarquee } from '@/components/ui/testimonials-marquee';
import { PlatformShowcase } from '@/components/ui/platform-showcase';

/* ─── Data ─────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    text:  'We had seen every wedding website. Every template. What Maison RSVP created felt like nothing we had ever encountered. Our guests called to tell us they had held their breath.',
    by:    'C. & A. Worthington',
    when:  'Château de la Marquise, Bordeaux — 2024',
    short: 'Our guests called to tell us they had held their breath.',
  },
  {
    text:  "Our members expect a certain quality of experience. The invitation Maison RSVP built for our founders' evening was the finest piece of digital design our club has ever presented.",
    by:    'E. Laroche',
    when:  'The Corinthian Club, London — 2024',
    short: 'The finest piece of digital design our club has ever presented.',
  },
  {
    text:  'We brief the finest hotels, the finest florists. The invitation is the first impression. Working with Maison RSVP is simply the correct choice for events at this level.',
    by:    'I. Fontaine',
    when:  'Private Client Services, Geneva — 2023',
    short: 'Simply the correct choice for events at this level.',
  },
  {
    text:  "My mother's eighty-fifth birthday. My father's gift to her was commissioning this. She has never stopped speaking about it. Neither has anyone who received it.",
    by:    'T. Blackwood',
    when:  'Private — 2023',
    short: 'She has never stopped speaking about it.',
  },
];

const FEATURED_SLUGS = ['thomas-and-grace', 'oliver-and-daniela', 'neil-and-riley', 'santiago-and-luna', 'noche-roja'] as const;
const FEATURED_WORKS = FEATURED_SLUGS.map(s => ALL_WORKS.find(w => w.slug === s)!);

// Archive: only show works with a real built experience page
const REAL_ARCHIVE_SLUGS = new Set(['oliver-and-charlotte']);
const OTHER_WORKS = ALL_WORKS.filter(w =>
  !(FEATURED_SLUGS as readonly string[]).includes(w.slug) &&
  (REAL_ARCHIVE_SLUGS.has(w.slug) || !!w.experienceUrl)
);

/* ═══════════════════════════════════════════════════ */
export default function Home() {
  const [celIdx, setCelIdx] = useState(0);
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setStickyVisible(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

      {/* Sticky bottom CTA — appears after hero scroll */}
      <div
        aria-hidden={!stickyVisible}
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          zIndex: 800,
          background: 'var(--deep)',
          borderTop: '1px solid rgba(162,129,90,.2)',
          padding: 'clamp(.75rem,1.5vw,1rem) clamp(2rem,5vw,5rem)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '1.5rem', flexWrap: 'wrap',
          transform: stickyVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform .5s cubic-bezier(0.16,1,0.3,1)',
          pointerEvents: stickyVisible ? 'auto' : 'none',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-garamond), Georgia, serif',
          fontStyle: 'italic', fontSize: 'clamp(.82rem,1vw,.95rem)',
          color: 'rgba(248,245,240,.55)',
        }}>
          By private commission only.
        </p>
        <Link
          href="/contact"
          style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.58rem', letterSpacing: '.3em', textTransform: 'uppercase',
            color: 'var(--gold)',
            borderBottom: '1px solid rgba(162,129,90,.4)',
            paddingBottom: '.15em',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            minHeight: 44, display: 'inline-flex', alignItems: 'center',
          }}
        >
          Begin a commission &rarr;
        </Link>
      </div>

      {/* Shared navigation — fades in after hero loads */}
      <Nav />

      {/* OPENING — MAISON RSVP silk hero */}
      <SilkHero />

      <PostHeroContent celIdx={celIdx} setCelIdx={setCelIdx} />
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

      {/* TRUST STRIP — social proof above the story */}
      <section aria-label="Client proof" style={{
        background: 'var(--deep)',
        borderTop: '1px solid rgba(162,129,90,.15)',
        borderBottom: '1px solid rgba(162,129,90,.15)',
        padding: 'clamp(1.25rem,2.5vw,2rem) clamp(2rem,5vw,5rem)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 'clamp(2rem,5vw,6rem)', flexWrap: 'wrap',
      }}>
        {[
          { stat: 'One at a time', label: 'every commission, full attention' },
          { stat: 'Zero templates', label: 'each invitation designed from scratch' },
          { stat: 'One link', label: 'invitation, RSVP, dashboard, entrance' },
        ].map(item => (
          <div key={item.stat} style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: 'var(--font-prata), Georgia, serif',
              fontSize: 'clamp(1.2rem,2vw,1.8rem)',
              color: 'var(--ivory)', lineHeight: 1,
              marginBottom: '.4rem',
            }}>{item.stat}</p>
            <p style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.52rem', letterSpacing: '.28em', textTransform: 'uppercase',
              color: 'rgba(201,168,130,.55)',
            }}>{item.label}</p>
          </div>
        ))}
        <div style={{
          borderLeft: '1px solid rgba(162,129,90,.2)',
          paddingLeft: 'clamp(2rem,4vw,4rem)',
          maxWidth: '34ch',
        }}>
          <p style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontStyle: 'italic', fontSize: 'clamp(.9rem,1.1vw,1rem)',
            color: 'rgba(248,245,240,.5)', lineHeight: 1.65,
          }}>
            &ldquo;The finest piece of digital design our club has ever presented.&rdquo;
          </p>
          <p style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.5rem', letterSpacing: '.25em', textTransform: 'uppercase',
            color: 'rgba(201,168,130,.45)', marginTop: '.6rem',
          }}>
            E. Laroche, Member Relations Director &mdash; The Corinthian Club, London
          </p>
        </div>
      </section>

      {/* CLIENT LOGO CLOUD */}
      <ClientLogoCloud />

      {/* TESTIMONIALS */}
      <TestimonialsMarquee />

      {/* PLATFORM SHOWCASE — beyond just an invitation */}
      <PlatformShowcase />

      {/* HOW IT WORKS — 3 steps, credibility section */}
      <section
        aria-label="How a commission works"
        style={{
          background: 'var(--ivory)',
          padding: 'clamp(5rem,10vw,9rem) clamp(2rem,5vw,5rem)',
          borderTop: '1px solid rgba(162,129,90,.1)',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase',
          color: 'var(--gold)', marginBottom: 'clamp(3rem,6vw,5rem)',
        }}>
          How a Commission Works
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
          gap: 'clamp(3rem,6vw,5rem)',
        }}>
          {[
            {
              n: '01',
              title: 'Discovery call',
              time: 'Free · 30 minutes',
              desc: 'We begin with a private conversation — no forms, no templates. We listen to your event, your story, and what you want your guests to feel the moment they open the invitation.',
            },
            {
              n: '02',
              title: 'Design & build',
              time: '3 to 16 weeks depending on collection',
              desc: 'Our studio composes your experience from the ground up — motion, narrative, sound, and typography. You receive two or more rounds of revisions before anything is finalised.',
            },
            {
              n: '03',
              title: 'Launch & host',
              time: '60-day to 12-month hosting included',
              desc: 'Your guests receive one link — by text, email, WhatsApp, or QR card. They open a world. You track every RSVP and guest detail from your private dashboard, in real time.',
            },
          ].map(step => (
            <div key={step.n} style={{ borderTop: '1px solid rgba(162,129,90,.25)', paddingTop: '1.75rem' }}>
              <span style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '.55rem', letterSpacing: '.3em', color: 'var(--gold)',
                display: 'block', marginBottom: '1rem',
              }}>
                {step.n}
              </span>
              <h3 style={{
                fontFamily: 'var(--font-prata), Georgia, serif',
                fontSize: 'clamp(1.2rem,1.8vw,1.5rem)',
                lineHeight: 1.2, marginBottom: '.5rem',
              }}>
                {step.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase',
                color: 'var(--gold)', opacity: .7, marginBottom: '1rem',
              }}>
                {step.time}
              </p>
              <p style={{
                fontFamily: 'var(--font-garamond), Georgia, serif',
                fontStyle: 'italic', fontSize: 'clamp(.9rem,1.1vw,1rem)',
                color: 'var(--mist)', lineHeight: 1.75,
              }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'clamp(3rem,5vw,4rem)', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/process" style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.58rem', letterSpacing: '.3em', textTransform: 'uppercase',
            color: 'var(--ink)', textDecoration: 'none',
            borderBottom: '1px solid rgba(14,13,11,.2)', paddingBottom: '.15em',
          }}>
            Full process &rarr;
          </Link>
          <Link href="/experiences" style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontStyle: 'italic', fontSize: '.95rem',
            color: 'var(--mist)', textDecoration: 'none',
          }}>
            See a live invitation
          </Link>
        </div>
      </section>

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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'clamp(3rem,8vw,8rem)', flexWrap: 'wrap' }}>
          <p style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontSize: 'clamp(1.05rem,1.4vw,1.3rem)',
            lineHeight: 1.85, color: 'var(--mist)', maxWidth: '42ch',
          }}>
            Maison RSVP was founded on a singular belief: that the digital
            experience of being invited to something extraordinary should feel
            as considered, as crafted, and as unforgettable as the event itself.
            We work with those who understand that the invitation is not a
            formality. It is the first chapter of the story they are asking
            their guests to enter.
          </p>
          {/* Studio signal */}
          <div style={{
            borderLeft: '1px solid rgba(162,129,90,.2)',
            paddingLeft: 'clamp(1.5rem,3vw,2.5rem)',
            flexShrink: 0, maxWidth: '22ch',
          }}>
            <p style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.5rem', letterSpacing: '.35em', textTransform: 'uppercase',
              color: 'var(--gold)', marginBottom: '.8rem',
            }}>Studio</p>
            <p style={{
              fontFamily: 'var(--font-garamond), Georgia, serif',
              fontStyle: 'italic', fontSize: '.95rem',
              color: 'var(--mist)', lineHeight: 1.7,
            }}>
              A boutique creative studio specialising in bespoke digital invitation experiences for private clients worldwide.
            </p>
            <p style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.5rem', letterSpacing: '.25em', textTransform: 'uppercase',
              color: 'rgba(14,13,11,.35)', marginTop: '1rem',
            }}>
              Vancouver &middot; London &middot; Lake Como
            </p>
          </div>
        </div>
        <div style={{ marginTop: 'clamp(2.5rem,5vw,4.5rem)', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/collection" style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid rgba(14,13,11,.2)', paddingBottom: '.15em' }}>View Pricing &rarr;</Link>
          <Link href="/about" style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.95rem', color: 'var(--mist)', textDecoration: 'none' }}>Our story</Link>
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

      {/* II.5a — NOT A WEDDING WEBSITE (grain-gradient statement) */}
      <GrainHeroSection
        eyebrow="What You Receive"
        title="Not a wedding website."
        subtitle="A living invitation."
      />

      {/* II.5 — WHAT YOU RECEIVE */}
      <section
        id="what-you-receive"
        style={{
          background: '#F8F5F0',
          padding: 'clamp(6rem,12vw,12rem) clamp(2rem,5vw,5rem)',
        }}
      >
        {/* Deliverables grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,260px),1fr))',
          gap: 'clamp(2.5rem,5vw,4rem)',
          marginBottom: 'clamp(5rem,9vw,8rem)',
          maxWidth: 1100,
        }}>
          {[
            { n: '01', title: 'A cinematic scroll story', desc: 'Built once, for your event — motion, narrative, and pacing designed around your story, never from a template.' },
            { n: '02', title: 'RSVP & guest management', desc: 'Guests respond directly inside the experience. You see replies, meal choices, and every detail in one private dashboard.', href: '/demo', cta: 'Explore the live demo →' },
            { n: '03', title: 'One link, every device', desc: 'Sent by text, email, or printed card. Opens flawlessly on a phone in a taxi or a desktop at home.' },
            { n: '04', title: 'Sound, motion, and detail', desc: 'Original music or atmosphere, cinematic animation, and typography composed specifically for your occasion.' },
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
                fontStyle: 'italic', fontSize: '1rem',
                color: 'var(--mist)', lineHeight: 1.75,
              }}>
                {item.desc}
              </p>
              {item.href && (
                <Link href={item.href} style={{
                  fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic',
                  fontSize: '.95rem', color: 'var(--gold)', textDecoration: 'none',
                  display: 'inline-block', marginTop: '.9rem',
                  borderBottom: '1px solid rgba(201,168,130,.35)', paddingBottom: '.15em',
                }}>
                  {item.cta}
                </Link>
              )}
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
              { name: 'Prelude',   price: '3–4 weeks',          desc: 'Intimate weddings, private dinners, and milestone celebrations up to 100 guests. A complete cinematic invitation with RSVP.' },
              { name: 'Signature', price: '6–8 weeks',          desc: 'Destination weddings with 100–300 guests. Full narrative experience, custom animation, sound, and guest management dashboard.' },
              { name: 'Maison',    price: 'By consultation', desc: 'Ultra-luxury events, 300+ guests, full creative direction, bespoke musical composition, and white-glove delivery.' },
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
                  fontStyle: 'italic', fontSize: '.95rem',
                  color: 'var(--mist)', lineHeight: 1.7,
                }}>
                  {tier.desc}
                </p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(2rem,4vw,4rem)', flexWrap: 'wrap' }}>
            <Link href="/collection" style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase',
              color: 'var(--ink)', textDecoration: 'none',
              borderBottom: '1px solid rgba(14,13,11,.2)', paddingBottom: '.15em',
            }}>
              See full collection &amp; pricing &rarr;
            </Link>
            <Link
              href="/contact"
              style={{
                fontFamily: 'var(--font-garamond), Georgia, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(.95rem,1.2vw,1.1rem)',
                color: 'var(--gold)',
                borderBottom: '1px solid rgba(162,129,90,.3)',
                paddingBottom: '.2em',
                textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center',
                minHeight: 44,
              }}
            >
              Begin a commission &rarr;
            </Link>
          </div>
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
              { n: '03', title: 'Luxury Hospitality',   desc: "For hotels, private members' clubs, and destination events that require an invitation worthy of the address." },
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
          paddingBottom: 0,
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
              The<br />Commissions.
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{
              fontFamily: 'var(--font-garamond), Georgia, serif',
              fontStyle: 'italic', fontSize: 'clamp(.9rem,1.1vw,1rem)',
              color: 'var(--mist)', maxWidth: '28ch', lineHeight: 1.7, marginBottom: '1.25rem',
            }}>
              Four worlds. Four invitations.<br />Each one existed once.
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
      </section>

      {/* 3D carousel — 4 featured couples */}
      <WorksCinematicCarousel works={FEATURED_WORKS} />

      {/* Archive — all other commissions */}
      <section
        id="archive"
        style={{
          background: '#F8F5F0',
          padding: 'clamp(5rem,9vw,9rem) clamp(2rem,5vw,5rem)',
          borderTop: '1px solid rgba(162,129,90,.12)',
        }}
      >
        <div style={{ marginBottom: 'clamp(3rem,5vw,5rem)' }}>
          <ChapterLabel muted>Further Commissions</ChapterLabel>
          <p style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontStyle: 'italic', fontSize: 'clamp(.9rem,1.1vw,1rem)',
            color: 'var(--mist)', maxWidth: '38ch', lineHeight: 1.7,
          }}>
            A selection of commissions from our archive — private, bespoke, and each made only once.
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
          gap: '1px',
          background: 'rgba(162,129,90,.12)',
          border: '1px solid rgba(162,129,90,.12)',
        }}>
          {OTHER_WORKS.map(w => (
            <Link
              key={w.slug}
              href={`/work/${w.slug}`}
              style={{
                display: 'block', textDecoration: 'none',
                background: '#F8F5F0',
                padding: 'clamp(1.5rem,3vw,2.5rem)',
                transition: 'background .4s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F2EBE0'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#F8F5F0'; }}
            >
              <p style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '.52rem', letterSpacing: '.3em', textTransform: 'uppercase',
                color: 'var(--gold)', marginBottom: '.75rem',
              }}>
                {w.category}
              </p>
              <h3 style={{
                fontFamily: 'var(--font-prata), Georgia, serif',
                fontSize: 'clamp(1.1rem,1.6vw,1.4rem)',
                color: 'var(--ink)', lineHeight: 1.2, marginBottom: '.6rem',
              }}>
                {w.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-garamond), Georgia, serif',
                fontStyle: 'italic', fontSize: '.88rem',
                color: 'var(--mist)', lineHeight: 1.6,
              }}>
                {w.location} · {w.season} {w.year}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* MAISON MEMORIES TEASER */}
      <section
        aria-label="Maison Memories"
        style={{
          background: 'var(--deep)', color: 'var(--ivory)',
          padding: 'clamp(5rem,10vw,9rem) clamp(2rem,5vw,5rem)',
          borderTop: '1px solid rgba(162,129,90,.12)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px', mixBlendMode: 'screen',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900 }}>
          <p style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.55rem', letterSpacing: '.4em', textTransform: 'uppercase',
            color: 'rgba(162,129,90,.6)', marginBottom: 'clamp(2rem,4vw,3rem)',
          }}>
            Maison Memories &mdash; An Add-On
          </p>
          <h2 style={{
            fontFamily: 'var(--font-prata), Georgia, serif',
            fontSize: 'clamp(2rem,4.5vw,5rem)',
            lineHeight: 1.1, letterSpacing: '-.02em',
            marginBottom: 'clamp(2rem,4vw,3rem)',
          }}>
            After the last toast.<br />
            <em style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', color: 'var(--gold)' }}>
              Every voice. Preserved.
            </em>
          </h2>
          <p style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontStyle: 'italic', fontSize: 'clamp(.95rem,1.2vw,1.1rem)',
            color: 'rgba(248,245,240,.55)', lineHeight: 1.75,
            maxWidth: '46ch', marginBottom: 'clamp(2rem,4vw,3rem)',
          }}>
            Your guests scan a private QR code and leave a video message, a voice note, a photograph, or a written dedication &mdash; directly from their phone, at any moment during the celebration. 48 hours after your event, you receive a beautifully curated private archive. A memory capsule, held for you, forever.
          </p>
          <div style={{ display: 'flex', gap: 'clamp(1.5rem,3vw,2.5rem)', flexWrap: 'wrap', marginBottom: 'clamp(2.5rem,4vw,3.5rem)' }}>
            {['Video messages', 'Voice notes', 'Photographs', 'Written dedications'].map(item => (
              <span key={item} style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '.5rem', letterSpacing: '.25em', textTransform: 'uppercase',
                color: 'rgba(201,168,130,.5)',
              }}>
                {item}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.58rem', letterSpacing: '.28em', textTransform: 'uppercase',
              color: 'var(--ivory)',
              background: 'rgba(162,129,90,.75)',
              padding: '.85em 1.8em', borderRadius: '1px',
              textDecoration: 'none',
              minHeight: 44, display: 'inline-flex', alignItems: 'center',
            }}>
              Ask about Maison Memories
            </Link>
            <span style={{
              fontFamily: 'var(--font-garamond), Georgia, serif',
              fontStyle: 'italic', fontSize: '.88rem',
              color: 'rgba(201,168,130,.5)',
            }}>
              Available as an add-on to any commission
            </span>
          </div>
        </div>
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

      {/* FAQ structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What exactly is a Maison RSVP commission?', acceptedAnswer: { '@type': 'Answer', text: 'A fully bespoke digital invitation experience — not a template, not a website builder. We compose a cinematic, animated digital world for your event from the ground up: motion, narrative, music, RSVP, guest management, and everything in between.' } },
          { '@type': 'Question', name: 'What will my guests actually receive?', acceptedAnswer: { '@type': 'Answer', text: 'A private link — sent by text, email, WhatsApp, or printed QR card. When they open it, they enter a scrolling cinematic experience built around your story. At the end, they RSVP directly inside the experience. No apps to download.' } },
          { '@type': 'Question', name: 'How long does a commission take?', acceptedAnswer: { '@type': 'Answer', text: 'Our Prelude collection takes 3–4 weeks. Signature takes 6–8 weeks. The Maison collection is 10–16 weeks. We recommend beginning at least 3 months before your send date.' } },
          { '@type': 'Question', name: 'What does it cost?', acceptedAnswer: { '@type': 'Answer', text: 'Investment is discussed during your complimentary discovery call. We work with clients across a range of scopes — from intimate Prelude commissions to full Maison creative direction. Contact us to begin.' } },
          { '@type': 'Question', name: 'How many revisions are included?', acceptedAnswer: { '@type': 'Answer', text: 'Prelude includes two rounds of revisions. Signature includes unlimited revisions. The Maison collection is fully iterative.' } },
          { '@type': 'Question', name: 'How long is the experience hosted?', acceptedAnswer: { '@type': 'Answer', text: 'Prelude commissions are hosted for 60 days. Signature commissions include 12 months of hosting. Maison commissions include permanent archival hosting.' } },
          { '@type': 'Question', name: 'Is this only for weddings?', acceptedAnswer: { '@type': 'Answer', text: 'Not at all. We work with couples, families, private members clubs, luxury hotels, and brands. Any occasion that deserves a considered first impression is within our scope.' } },
          { '@type': 'Question', name: 'What is Maison Memories?', acceptedAnswer: { '@type': 'Answer', text: 'An optional add-on available with any commission. During your celebration, guests scan a private QR code to leave video messages, voice notes, photos, and written dedications. You receive a private archive 48 hours after your event.' } },
        ],
      }) }} />

      {/* FAQ */}
      <section
        aria-label="Frequently asked questions"
        style={{
          background: 'var(--ivory)',
          padding: 'clamp(5rem,10vw,9rem) clamp(2rem,5vw,5rem)',
          borderTop: '1px solid rgba(162,129,90,.1)',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase',
          color: 'var(--gold)', marginBottom: 'clamp(3rem,6vw,5rem)',
        }}>
          Questions
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          gap: '0 clamp(4rem,8vw,8rem)',
        }}>
          {[
            {
              q: 'What exactly is a Maison RSVP commission?',
              a: 'A fully bespoke digital invitation experience — not a template, not a website builder. We compose a cinematic, animated digital world for your event from the ground up: motion, narrative, music, RSVP, guest management, and everything in between. Your guests receive a single link and open something they have never seen before.',
            },
            {
              q: 'What will my guests actually receive?',
              a: 'A private link — sent by text, email, WhatsApp, or printed QR card. When they open it, they enter a scrolling cinematic experience built around your story: your names, your venue, your aesthetic. At the end, they RSVP directly inside the experience. No apps to download. Works on any phone or desktop.',
            },
            {
              q: 'How long does a commission take?',
              a: 'Our Prelude collection takes 3–4 weeks. Signature takes 6–8 weeks. The Maison collection is 10–16 weeks. We recommend beginning at least 3 months before your send date to allow for discovery, revisions, and a considered launch.',
            },
            {
              q: 'Can I see an example before committing?',
              a: 'Yes. Visit our Live Invitations page to experience real commissions as a guest would — on your phone or desktop. We also share additional private portfolio pieces during your discovery call.',
            },
            {
              q: 'What does it cost?',
              a: 'Investment is discussed during your complimentary discovery call — there is no obligation, and no numbers are shared until we understand your event and what it deserves. Begin by reaching out and we will schedule a call within one business day.',
            },
            {
              q: 'How many revisions are included?',
              a: 'Prelude includes two rounds of revisions. Signature includes unlimited revisions. The Maison collection is fully iterative — we do not move to the next phase until you are completely satisfied.',
            },
            {
              q: 'How long is the experience hosted?',
              a: 'Prelude commissions are hosted for 60 days from your event date. Signature commissions include 12 months of hosting. Maison commissions include permanent archival hosting with an option for a physical keepsake.',
            },
            {
              q: 'What if my guests are not tech-savvy?',
              a: 'The experience opens with a single tap on any phone — no account, no app, no password unless you request one. We design specifically for guests who have never interacted with digital invitations before. We test every experience across devices before it reaches a single guest.',
            },
            {
              q: 'Is this only for weddings?',
              a: 'Not at all. We work with couples, families, private members clubs, luxury hotels, and brands. Any occasion that deserves a considered first impression — anniversaries, centenary celebrations, brand moments, estate dinners — is within our scope.',
            },
            {
              q: 'What is Maison Memories?',
              a: 'An optional add-on available with any commission. During your celebration, guests scan a private QR code to leave video messages, voice notes, photos, and written dedications from their phones. You receive a beautifully curated private archive 48 hours after your event. Ask about it during your discovery call.',
            },
          ].map((item, i) => (
            <div key={i} style={{
              borderTop: '1px solid rgba(162,129,90,.15)',
              padding: 'clamp(1.5rem,2.5vw,2rem) 0',
            }}>
              <h3 style={{
                fontFamily: 'var(--font-prata), Georgia, serif',
                fontSize: 'clamp(1rem,1.4vw,1.2rem)',
                lineHeight: 1.35, marginBottom: '.9rem', fontWeight: 400,
              }}>
                {item.q}
              </h3>
              <p style={{
                fontFamily: 'var(--font-garamond), Georgia, serif',
                fontStyle: 'italic', fontSize: 'clamp(.9rem,1.1vw,1rem)',
                color: 'var(--mist)', lineHeight: 1.75,
              }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'clamp(3rem,5vw,4rem)', borderTop: '1px solid rgba(162,129,90,.15)', paddingTop: 'clamp(2rem,4vw,3rem)' }}>
          <p style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontStyle: 'italic', fontSize: 'clamp(.9rem,1.1vw,1rem)',
            color: 'var(--mist)', lineHeight: 1.7,
          }}>
            Another question?{' '}
            <a href="mailto:concierge@maisonrsvp.ca" style={{ color: 'var(--gold)', textDecoration: 'none' }}>
              concierge@maisonrsvp.ca
            </a>
            {' '}— we respond within one business day.
          </p>
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
          @media (prefers-reduced-motion: reduce) {
            .ring-pulse-el { animation: none !important; opacity: .05 !important; }
          }
        `}</style>
        {([420, 620, 820] as number[]).map((s, i) => (
          <div key={s} aria-hidden className="ring-pulse-el" style={{
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
          fontStyle: 'italic', fontSize: 'clamp(1rem,1.4vw,1.15rem)',
          color: 'var(--mist)', lineHeight: 1.65,
          marginBottom: 'clamp(2.5rem,5vw,4rem)',
        }}>
          We accept a limited number of commissions each season.
        </p>

        {/* Primary CTA — button-sized tap target */}
        <Link
          href="/contact"
          style={{
            position: 'relative', zIndex: 1,
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontSize: 'clamp(1.05rem,1.8vw,1.4rem)', letterSpacing: '.03em',
            color: 'var(--gold)', borderBottom: '1px solid rgba(162,129,90,.35)',
            paddingBottom: '.25em', transition: 'color .4s, border-color .4s',
            display: 'inline-flex', alignItems: 'center',
            minHeight: 48, textDecoration: 'none',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--ink)';
            e.currentTarget.style.borderBottomColor = 'var(--ink)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--gold)';
            e.currentTarget.style.borderBottomColor = 'rgba(162,129,90,.35)';
          }}
        >
          Begin a commission &rarr;
        </Link>

        <p style={{
          position: 'relative', zIndex: 1,
          marginTop: 'clamp(1rem,2vw,1.5rem)',
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '.52rem', letterSpacing: '.3em', textTransform: 'uppercase',
          color: 'rgba(162,129,90,.6)',
        }}>
          Three commissions remain this season
        </p>

        <p style={{
          position: 'relative', zIndex: 1,
          marginTop: 'clamp(.75rem,1.5vw,1rem)',
          fontFamily: 'var(--font-garamond), Georgia, serif',
          fontStyle: 'italic', fontSize: '.95rem', color: 'var(--mist)',
        }}>
          or write to us at{' '}
          <a href="mailto:concierge@maisonrsvp.ca" style={{ color: 'var(--gold)', textDecoration: 'none' }}>
            concierge@maisonrsvp.ca
          </a>
        </p>

        <p style={{
          position: 'absolute', bottom: 'clamp(2rem,4vw,3.5rem)',
          left: 0, right: 0, textAlign: 'center', zIndex: 1,
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '.6rem', letterSpacing: '.4em', textTransform: 'uppercase',
          color: 'rgba(14,13,11,0.45)',
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
        fontStyle: 'italic', fontSize: 'clamp(.92rem,1.1vw,1rem)',
        color: 'rgba(248,245,240,.45)',
        lineHeight: 1.8, maxWidth: '26ch',
        position: 'relative', zIndex: 1,
      }}>
        {desc}
      </p>
    </article>
  );
}

