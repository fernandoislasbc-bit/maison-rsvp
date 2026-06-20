import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { buildMetadata, serviceSchema, faqSchema, breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title:       'The Collection — Luxury Digital Invitation Tiers',
  description: 'Three collections. Each designed for a different level of experience. Prelude, Signature, and Maison — bespoke luxury digital invitations for weddings and private events.',
  path:        '/collection',
  keywords:    ['luxury wedding invitations', 'bespoke digital invitation', 'custom wedding website', 'luxury invitation experience', 'digital wedding invitation Canada', 'wedding website design'],
});

const TIERS = [
  {
    id:       'prelude',
    name:     'Prelude',
    roman:    'I',
    tagline:  'The perfect introduction.',
    price:    'From $2,400',
    timeline: '3–4 weeks',
    ideal:    'Intimate weddings, private dinners, milestone celebrations',
    lead:     'For events where craft matters, but the story is short. Prelude is a refined digital experience built on our foundation framework — beautiful, intentional, and uniquely yours.',
    features: [
      'Custom digital invitation experience',
      'Up to 4 design screens',
      'RSVP functionality',
      'Mobile & desktop optimised',
      'Password protected',
      'Guest management dashboard',
      'Two rounds of revisions',
      '60-day hosting included',
    ],
    note:    null,
  },
  {
    id:       'signature',
    name:     'Signature',
    roman:    'II',
    tagline:  'Your story, fully told.',
    price:    'From $5,800',
    timeline: '6–8 weeks',
    ideal:    'Destination weddings, luxury celebrations, 100–300 guests',
    lead:     'The Signature collection is where Maison RSVP begins to feel like itself. A cinematic digital experience with motion, narrative, and a design language built from the ground up for your occasion.',
    features: [
      'Full bespoke design experience',
      'Custom storytelling narrative',
      'GSAP cinematic animations',
      'Up to 8 design screens',
      'Custom music or atmospheric sound',
      'Advanced RSVP with meal preferences',
      'Guest communications suite',
      'Venue & travel information',
      'Unlimited revisions',
      '12-month hosting included',
      'Print-ready stationery files',
    ],
    note:    'Most requested.',
    featured: true,
  },
  {
    id:       'maison',
    name:     'Maison',
    roman:    'III',
    tagline:  'The most complete experience we create.',
    price:    'By consultation',
    timeline: '10–16 weeks',
    ideal:    'Ultra-luxury weddings, private estates, brand events, 300+ guests',
    lead:     'Maison is a commission, not a product. We begin with a discovery process unlike anything else — understanding not just your event, but your story, your aesthetic, and what you want your guests to feel the moment they open the invitation.',
    features: [
      'Complete bespoke creative direction',
      'Custom visual identity for the event',
      'Original photography or cinematography direction',
      'Unlimited narrative screens',
      'Bespoke motion system',
      'Live guest experience dashboard',
      'Multi-language support',
      'Concierge RSVP management',
      'Physical keepsake archive',
      'White-glove launch support',
      '24-month hosting & maintenance',
      'Archive rights',
    ],
    note:    'By private consultation only.',
  },
];

const FAQ = [
  { q: 'What is a luxury digital invitation experience?', a: 'A luxury digital invitation is a fully bespoke, animated digital experience sent in place of — or alongside — traditional printed invitations. Unlike wedding website templates, each Maison RSVP invitation is designed from scratch for one occasion and never repeated.' },
  { q: 'How long does a commission take?', a: 'Prelude commissions typically complete in 3–4 weeks. Signature commissions take 6–8 weeks. Maison commissions begin with a 2-week discovery process, with total timelines of 10–16 weeks depending on scope.' },
  { q: 'Do you work with clients internationally?', a: 'Yes. Maison RSVP works with clients worldwide. We have completed commissions for events in France, Switzerland, Japan, the United Kingdom, the United States, and Canada.' },
  { q: 'Can guests RSVP through the digital invitation?', a: 'Yes. Every collection includes RSVP functionality with a guest management dashboard. Signature and Maison collections include advanced RSVP with meal selection, dietary requirements, and automated communications.' },
  { q: 'Is each invitation truly unique?', a: 'Yes. Every commission is designed once, for one occasion, and retired. We do not reuse designs, templates, or motion systems between clients.' },
];

export default function CollectionPage() {
  return (
    <>
      <Nav light />

      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'The Collection', path: '/collection' }]),
        serviceSchema({ name: 'Luxury Digital Invitation Experiences', description: 'Bespoke digital invitation experiences for luxury weddings and private events.', url: '/collection', priceRange: '$$$$' }),
      ]) }} />

      <main style={{ background: 'var(--ivory)', color: 'var(--ink)' }}>

        {/* ── Hero ──────────────────────────────── */}
        <section style={{
          minHeight: '100svh',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(8rem,14vw,14rem) clamp(2rem,5vw,5rem) clamp(5rem,8vw,8rem)',
          position: 'relative', overflow: 'hidden',
          background: `
            radial-gradient(ellipse 80% 50% at 60% 30%, #EDE5D8 0%, transparent 55%),
            radial-gradient(ellipse 50% 60% at 10% 80%, #E8DFD0 0%, transparent 50%),
            var(--ivory)
          `,
        }}>
          {/* paper grain */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .028,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '220px', mixBlendMode: 'multiply',
          }} />

          {/* Ghost roman numeral */}
          <span aria-hidden style={{
            position: 'absolute', top: '50%', right: '5vw',
            transform: 'translateY(-50%)',
            fontFamily: 'var(--font-prata), Georgia, serif',
            fontSize: 'clamp(20rem,35vw,44rem)', lineHeight: 1,
            color: 'transparent',
            WebkitTextStroke: '1px rgba(162,129,90,.05)',
            userSelect: 'none', pointerEvents: 'none',
          }}>III</span>

          <nav aria-label="Breadcrumb" style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.55rem', letterSpacing: '.3em', textTransform: 'uppercase',
            color: 'var(--mist)', marginBottom: 'clamp(2rem,4vw,3rem)',
          }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 .75rem' }}>·</span>
            <span style={{ color: 'var(--gold)' }}>The Collection</span>
          </nav>

          <h1 style={{
            fontFamily: 'var(--font-prata), Georgia, serif',
            fontSize: 'clamp(3.5rem,9vw,10rem)',
            lineHeight: .92, letterSpacing: '-.03em',
            maxWidth: '10ch',
            marginBottom: 'clamp(3rem,5vw,4.5rem)',
          }}>
            Three<br />collections.<br />
            <em style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', color: 'var(--gold)' }}>One standard.</em>
          </h1>

          <p style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(1rem,1.5vw,1.3rem)',
            color: 'var(--mist)', maxWidth: '42ch', lineHeight: 1.75,
          }}>
            Each collection is a different level of depth, narrative, and craft.
            Every one is designed once, for one occasion, and never made again.
          </p>
        </section>

        {/* ── Tiers ─────────────────────────────── */}
        <section
          id="tiers"
          aria-label="Collection tiers"
          style={{
            padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)',
            background: `radial-gradient(ellipse 60% 20% at 50% 0%, #F0E9DE 0%, transparent 45%), var(--ivory)`,
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,300px), 1fr))',
            gap: 2,
          }}>
            {TIERS.map(tier => (
              <TierCard key={tier.id} tier={tier} />
            ))}
          </div>
        </section>

        {/* ── What's included across all ──────── */}
        <section style={{
          background: 'var(--deep)', color: 'var(--ivory)',
          padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .055, zIndex: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px', mixBlendMode: 'screen',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase',
              color: 'rgba(201,168,130,.5)', marginBottom: 'clamp(2rem,4vw,3.5rem)',
            }}>
              Every commission includes
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,260px),1fr))',
              gap: 'clamp(2rem,4vw,4rem)',
            }}>
              {[
                { title: 'One-of-a-kind design', body: 'No templates. No reuse. Every commission is a completely original work of design.' },
                { title: 'Direct creative access', body: 'You work with the Maison RSVP creative director throughout every stage of the process.' },
                { title: 'Device optimised', body: 'Your invitation is built to feel exceptional on every screen — from 4K monitors to mobile.' },
                { title: 'Private & protected', body: 'Password-protected delivery ensures only your intended guests receive the experience.' },
                { title: 'Guest management', body: 'Every commission includes a private dashboard for managing RSVPs and guest communications.' },
                { title: 'Archive rights', body: 'Your invitation is yours. We provide full archive access and rights upon completion.' },
              ].map(item => (
                <div key={item.title}>
                  <div style={{ width: 20, height: 1, background: 'rgba(162,129,90,.4)', marginBottom: '1.2rem' }} />
                  <p style={{
                    fontFamily: 'var(--font-prata), Georgia, serif',
                    fontSize: 'clamp(1rem,1.5vw,1.2rem)',
                    color: 'var(--ivory)', marginBottom: '.75rem',
                  }}>
                    {item.title}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-garamond), Georgia, serif',
                    fontStyle: 'italic', fontSize: '.9rem',
                    color: 'rgba(248,245,240,.35)', lineHeight: 1.7,
                  }}>
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────── */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(FAQ)) }} />
        <section style={{
          padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)',
          background: `radial-gradient(ellipse 70% 40% at 50% 100%, #F0E9DE 0%, transparent 55%), var(--ivory)`,
        }}>
          <p style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: 'clamp(3rem,5vw,5rem)',
          }}>
            Frequently asked
          </p>
          <div style={{ maxWidth: 760 }}>
            {FAQ.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────── */}
        <section style={{
          borderTop: '1px solid var(--dust)',
          padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)',
          textAlign: 'center',
          background: `radial-gradient(ellipse 70% 80% at 50% 50%, #F2EBE0 0%, transparent 65%), var(--ivory)`,
          position: 'relative', overflow: 'hidden',
        }}>
          <p style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: 'clamp(2rem,4vw,3rem)',
          }}>
            Three commissions remaining this season
          </p>
          <h2 style={{
            fontFamily: 'var(--font-prata), Georgia, serif',
            fontSize: 'clamp(2.5rem,6vw,6.5rem)',
            lineHeight: .95, letterSpacing: '-.025em',
            marginBottom: 'clamp(2.5rem,5vw,4rem)',
          }}>
            Your event<br />deserves its<br />own world.
          </h2>
          <style>{`.coll-cta{display:inline-block;font-family:var(--font-garamond),Georgia,serif;font-style:italic;font-size:clamp(1rem,1.5vw,1.25rem);color:var(--gold);border-bottom:1px solid rgba(162,129,90,.3);padding-bottom:.2em;text-decoration:none;transition:color .4s,border-color .4s}.coll-cta:hover{color:var(--ink);border-bottom-color:var(--ink)}`}</style>
          <Link
            href="/contact"
            className="coll-cta"
          >
            Begin a commission →
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* ─── Tier card ────────────────────────────────── */
function TierCard({ tier }: { tier: typeof TIERS[0] }) {
  return (
    <article
      id={tier.id}
      style={{
        padding: 'clamp(3rem,5vw,5rem) clamp(2rem,4vw,4rem)',
        background: tier.featured ? 'var(--deep)' : 'var(--ivory)',
        color: tier.featured ? 'var(--ivory)' : 'var(--ink)',
        position: 'relative', overflow: 'hidden',
        borderTop: tier.featured ? 'none' : '1px solid var(--dust)',
      }}
    >
      {tier.featured && (
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .05, zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px', mixBlendMode: 'screen',
        }} />
      )}

      {/* Ghost roman */}
      <span aria-hidden style={{
        position: 'absolute', bottom: '-1rem', right: '1.5rem',
        fontFamily: 'var(--font-prata), Georgia, serif',
        fontSize: 'clamp(8rem,14vw,14rem)', lineHeight: 1,
        color: 'transparent',
        WebkitTextStroke: tier.featured ? '1px rgba(162,129,90,.12)' : '1px rgba(14,13,11,.06)',
        userSelect: 'none', pointerEvents: 'none',
        zIndex: 0,
      }}>
        {tier.roman}
      </span>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {tier.note && (
          <p style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.54rem', letterSpacing: '.35em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: '1.5rem',
          }}>
            {tier.note}
          </p>
        )}

        <h2 style={{
          fontFamily: 'var(--font-prata), Georgia, serif',
          fontSize: 'clamp(2rem,4vw,3.5rem)',
          lineHeight: 1, letterSpacing: '-.015em',
          marginBottom: '.5rem',
        }}>
          {tier.name}
        </h2>

        <p style={{
          fontFamily: 'var(--font-garamond), Georgia, serif',
          fontStyle: 'italic',
          fontSize: 'clamp(.9rem,1.2vw,1.05rem)',
          color: tier.featured ? 'rgba(248,245,240,.5)' : 'var(--mist)',
          marginBottom: 'clamp(2rem,4vw,3.5rem)',
        }}>
          {tier.tagline}
        </p>

        <div style={{
          width: '100%', height: 1,
          background: tier.featured ? 'rgba(162,129,90,.25)' : 'var(--dust)',
          marginBottom: 'clamp(2rem,4vw,3rem)',
        }} />

        {/* Price + timeline */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.54rem', letterSpacing: '.3em', textTransform: 'uppercase',
              color: tier.featured ? 'rgba(201,168,130,.5)' : 'var(--mist)',
              marginBottom: '.4rem',
            }}>
              Investment
            </p>
            <p style={{
              fontFamily: 'var(--font-prata), Georgia, serif',
              fontSize: 'clamp(1.1rem,1.8vw,1.5rem)',
              color: tier.featured ? 'var(--ivory)' : 'var(--ink)',
            }}>
              {tier.price}
            </p>
          </div>
          <div>
            <p style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '.54rem', letterSpacing: '.3em', textTransform: 'uppercase',
              color: tier.featured ? 'rgba(201,168,130,.5)' : 'var(--mist)',
              marginBottom: '.4rem',
            }}>
              Timeline
            </p>
            <p style={{
              fontFamily: 'var(--font-prata), Georgia, serif',
              fontSize: 'clamp(1.1rem,1.8vw,1.5rem)',
              color: tier.featured ? 'var(--ivory)' : 'var(--ink)',
            }}>
              {tier.timeline}
            </p>
          </div>
        </div>

        <p style={{
          fontFamily: 'var(--font-garamond), Georgia, serif',
          fontSize: '.88rem',
          color: tier.featured ? 'rgba(248,245,240,.35)' : 'var(--mist)',
          lineHeight: 1.7, marginBottom: 'clamp(2rem,4vw,3rem)',
        }}>
          {tier.lead}
        </p>

        {/* Features */}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, marginBottom: 'clamp(2.5rem,4vw,3.5rem)' }}>
          {tier.features.map(f => (
            <li key={f} style={{
              display: 'flex', alignItems: 'flex-start', gap: '.75rem',
              marginBottom: '.75rem',
            }}>
              <span style={{
                display: 'inline-block', width: 4, height: 4,
                background: 'var(--gold)', borderRadius: '50%',
                marginTop: '.45em', flexShrink: 0,
              }} />
              <span style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '.68rem', letterSpacing: '.04em', lineHeight: 1.5,
                color: tier.featured ? 'rgba(248,245,240,.6)' : 'var(--mist)',
              }}>
                {f}
              </span>
            </li>
          ))}
        </ul>

        <Link
          href="/contact"
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.6rem', fontWeight: 400,
            letterSpacing: '.3em', textTransform: 'uppercase',
            color: tier.featured ? 'var(--ivory)' : 'var(--ink)',
            border: `1px solid ${tier.featured ? 'rgba(248,245,240,.25)' : 'rgba(14,13,11,.2)'}`,
            padding: '.85em 2em',
            textDecoration: 'none',
            transition: 'background .3s, color .3s, border-color .3s',
          }}
        >
          {tier.id === 'maison' ? 'Request a consultation' : 'Begin this commission'}
        </Link>
      </div>
    </article>
  );
}

/* ─── FAQ accordion ─────────────────────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details
      style={{
        borderBottom: '1px solid var(--dust)',
        padding: 'clamp(1.5rem,2.5vw,2.2rem) 0',
      }}
    >
      <summary style={{
        fontFamily: 'var(--font-garamond), Georgia, serif',
        fontSize: 'clamp(.95rem,1.3vw,1.15rem)',
        letterSpacing: '.01em',
        color: 'var(--ink)',
        listStyle: 'none',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: '2rem',
        cursor: 'pointer',
      }}>
        {q}
        <span style={{
          fontFamily: 'var(--font-garamond), Georgia, serif',
          fontSize: '1.2rem', color: 'var(--gold)', flexShrink: 0,
        }}>
          +
        </span>
      </summary>
      <p style={{
        fontFamily: 'var(--font-garamond), Georgia, serif',
        fontStyle: 'italic',
        fontSize: 'clamp(.88rem,1.1vw,1rem)',
        color: 'var(--mist)', lineHeight: 1.8,
        marginTop: '1rem',
        maxWidth: '60ch',
      }}>
        {a}
      </p>
    </details>
  );
}
