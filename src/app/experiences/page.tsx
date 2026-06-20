import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title:       'Experiences — Luxury Digital Invitations for Every Occasion',
  description: 'From destination weddings to private members\' events, Maison RSVP creates bespoke digital invitation experiences for the world\'s most considered occasions.',
  path:        '/experiences',
  keywords:    ['luxury wedding website Canada', 'destination wedding digital invitation', 'luxury event invitation design', 'private celebration invitation', 'luxury hospitality digital experience', 'corporate luxury invitation'],
});

const EXPERIENCES = [
  {
    id:       'weddings',
    category: 'Luxury Weddings',
    headline: 'Where two stories become one.',
    lead:     'A wedding invitation should feel like the first chapter of the most important story you have ever told. We build it to feel exactly that way.',
    body:     'Maison RSVP has created wedding invitation experiences for ceremonies in France, Switzerland, Japan, Canada, and the United Kingdom. Every one is different. Every one is built around the specific story of the couple — not a template, not a category, not a trend. We spend weeks understanding what your wedding means before we design a single screen.',
    details:  ['Elopements to 500+ guest celebrations', 'Destination and local weddings', 'Multi-day event experiences', 'Multilingual support available'],
    featured: true,
  },
  {
    id:       'destination',
    category: 'Destination Weddings',
    headline: 'The journey begins with the invitation.',
    lead:     'When your guests are crossing oceans, the invitation should feel like the first step of the journey.',
    body:     'Destination weddings create a unique opportunity — your guests are not just attending an event, they are embarking on an experience. We treat the invitation as the opening of that experience: immersive, atmospheric, and specific to the place you have chosen to celebrate.',
    details:  ['Location-specific visual language', 'Travel and venue information integration', 'Multi-timezone RSVP management', 'Accommodation concierge links'],
    featured: false,
  },
  {
    id:       'private',
    category: 'Private Celebrations',
    headline: 'For the occasions that exist only once.',
    lead:     'The anniversary. The milestone. The gathering of those who matter most.',
    body:     'Some of our most meaningful commissions have been for private celebrations — a father commissioning an invitation for his mother\'s eightieth birthday, a family gathering for a centenary, a private dinner for twenty people who love each other. These occasions deserve the same care as any wedding.',
    details:  ['Anniversary celebrations', 'Milestone birthdays', 'Family reunions and legacy events', 'Intimate dinner experiences'],
    featured: false,
  },
  {
    id:       'hospitality',
    category: 'Luxury Hospitality',
    headline: 'An invitation worthy of the address.',
    lead:     'For hotels, private clubs, and luxury brands for whom the experience begins before arrival.',
    body:     'We work with luxury hotels, private members\' clubs, and destination resorts to create invitation experiences for their most significant events. The invitation must carry the full weight of the brand — not just visually, but in the quality of the storytelling.',
    details:  ['Hotel and resort events', "Private members' club events", 'Brand activations and launches', 'Seasonal event programmes'],
    featured: false,
  },
  {
    id:       'corporate',
    category: 'Corporate Luxury',
    headline: 'When the event is part of the proposition.',
    lead:     'For organisations for whom even the invitation is a statement of values.',
    body:     'The most discerning corporate clients understand that an invitation is not a logistics document. It is a statement. A signal. For client dinners, founders\' evenings, and private brand moments, we create digital invitation experiences that carry the full weight of what your organisation represents.',
    details:  ['Founders and board events', 'Client appreciation dinners', 'Product and brand launches', 'Annual signature events'],
    featured: false,
  },
];

export default function ExperiencesPage() {
  return (
    <>
      <Nav light />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(
        breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Experiences', path: '/experiences' }])
      ) }} />

      <main style={{ background: 'var(--ivory)', color: 'var(--ink)' }}>
        {/* Hero */}
        <section style={{ minHeight: '80svh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(8rem,14vw,14rem) clamp(2rem,5vw,5rem) clamp(5rem,8vw,8rem)', position: 'relative', overflow: 'hidden', background: `radial-gradient(ellipse 70% 50% at 65% 30%, #EDE5D8 0%, transparent 55%), var(--ivory)` }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .028, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '220px', mixBlendMode: 'multiply' }} />
          <nav aria-label="Breadcrumb" style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 .75rem' }}>·</span>
            <span style={{ color: 'var(--gold)' }}>Experiences</span>
          </nav>
          <h1 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(3.5rem,9vw,10rem)', lineHeight: .92, letterSpacing: '-.03em', maxWidth: '12ch', marginBottom: 'clamp(3rem,5vw,4.5rem)' }}>
            Every occasion<br />has a story<br />
            <em style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', color: 'var(--gold)' }}>worth telling.</em>
          </h1>
          <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1rem,1.5vw,1.3rem)', color: 'var(--mist)', maxWidth: '44ch', lineHeight: 1.75 }}>
            We create bespoke digital invitation experiences for weddings, private celebrations, luxury hospitality events, and corporate moments that demand something exceptional.
          </p>
        </section>

        {/* Experiences */}
        {EXPERIENCES.map((exp, i) => (
          <section key={exp.id} id={exp.id} style={{
            padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)',
            background: exp.featured
              ? `radial-gradient(ellipse 70% 40% at ${i % 2 === 0 ? '20%' : '80%'} 50%, #EDE5D8 0%, transparent 55%), var(--ivory)`
              : 'var(--ivory)',
            borderTop: '1px solid var(--dust)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,380px),1fr))', gap: 'clamp(3rem,6vw,8rem)', alignItems: 'start' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.2rem' }}>{exp.category}</p>
                <h2 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(2rem,4vw,3.8rem)', lineHeight: .97, letterSpacing: '-.02em', marginBottom: '1rem' }}>{exp.headline}</h2>
                <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1rem,1.4vw,1.15rem)', color: 'var(--gold)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>{exp.lead}</p>
                <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontSize: 'clamp(.95rem,1.2vw,1.1rem)', color: 'var(--mist)', lineHeight: 1.8, maxWidth: '44ch' }}>{exp.body}</p>
              </div>
              <div style={{ paddingTop: 'clamp(1rem,2vw,2rem)' }}>
                <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.56rem', letterSpacing: '.32em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: '1.5rem' }}>We work with</p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, marginBottom: 'clamp(2.5rem,4vw,3.5rem)' }}>
                  {exp.details.map(d => (
                    <li key={d} style={{ display: 'flex', gap: '.75rem', alignItems: 'flex-start', marginBottom: '.75rem' }}>
                      <span style={{ display: 'inline-block', width: 3, height: 3, background: 'var(--gold)', borderRadius: '50%', marginTop: '.5em', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.68rem', letterSpacing: '.04em', color: 'var(--mist)', lineHeight: 1.5 }}>{d}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact" style={{ display: 'inline-block', fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--ink)', border: '1px solid rgba(14,13,11,.2)', padding: '.85em 2em', textDecoration: 'none', transition: 'background .3s, color .3s' }}>
                  Begin this commission
                </Link>
              </div>
            </div>
          </section>
        ))}

        {/* CTA */}
        <section style={{ background: 'var(--deep)', color: 'var(--ivory)', padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .055, zIndex: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '200px', mixBlendMode: 'screen' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'rgba(201,168,130,.5)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>Not sure which experience is right for you?</p>
            <h2 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(2.5rem,6vw,6.5rem)', lineHeight: .95, letterSpacing: '-.025em', marginBottom: 'clamp(2.5rem,5vw,4rem)', color: 'var(--ivory)' }}>
              Let us find<br />it together.
            </h2>
            <Link href="/contact" style={{ display: 'inline-block', fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1rem,1.5vw,1.25rem)', color: 'var(--gold)', borderBottom: '1px solid rgba(162,129,90,.3)', paddingBottom: '.2em', textDecoration: 'none' }}>
              Begin the conversation →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
