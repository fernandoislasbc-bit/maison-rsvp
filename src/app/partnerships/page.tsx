import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title:       'Planner Partnerships — Partner with Maison RSVP',
  description: 'Maison RSVP partners with a select group of luxury wedding planners and event professionals. Offer your clients something no other planner can — a bespoke digital invitation experience by Maison RSVP.',
  path:        '/partnerships',
  keywords:    ['luxury wedding planner partner', 'wedding planner referral program', 'luxury invitation white label', 'wedding planner commission', 'luxury event planner partnership Canada'],
});

export default function PartnershipsPage() {
  return (
    <>
      <Nav light />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(
        breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Planner Partnerships', path: '/partnerships' }])
      ) }} />

      <main style={{ background: 'var(--ivory)', color: 'var(--ink)' }}>
        {/* Hero */}
        <section style={{ minHeight: '80svh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(8rem,14vw,14rem) clamp(2rem,5vw,5rem) clamp(5rem,8vw,8rem)', position: 'relative', overflow: 'hidden', background: `radial-gradient(ellipse 70% 55% at 60% 35%, #EDE5D8 0%, transparent 55%), var(--ivory)` }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .028, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '220px', mixBlendMode: 'multiply' }} />
          <nav aria-label="Breadcrumb" style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 .75rem' }}>·</span>
            <span style={{ color: 'var(--gold)' }}>Planner Partnerships</span>
          </nav>
          <h1 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(3.5rem,9vw,10rem)', lineHeight: .92, letterSpacing: '-.03em', maxWidth: '10ch', marginBottom: 'clamp(3rem,5vw,4.5rem)' }}>
            Offer your<br />clients the<br />
            <em style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', color: 'var(--gold)' }}>unforgettable.</em>
          </h1>
          <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1rem,1.5vw,1.3rem)', color: 'var(--mist)', maxWidth: '44ch', lineHeight: 1.75 }}>
            We partner with a select group of luxury wedding planners and event professionals who share our commitment to quality, craft, and the client experience.
          </p>
        </section>

        {/* Partnership benefits */}
        <section style={{ padding: 'clamp(7rem,12vw,12rem) clamp(2rem,5vw,5rem)', background: `radial-gradient(ellipse 60% 30% at 80% 0%, #F0E9DE 0%, transparent 50%), var(--ivory)` }}>
          <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'clamp(3rem,5vw,5rem)' }}>The Partner Programme</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,280px),1fr))', gap: 'clamp(2.5rem,4vw,5rem)' }}>
            {[
              { title: 'Priority access', body: 'Partner planners receive priority booking access, ensuring your clients are never turned away due to capacity.', detail: 'Guaranteed availability within 30 days' },
              { title: 'Commission structure', body: 'A referral commission is paid on every completed commission that originates from a partner planner referral.', detail: '15% on all completed commissions' },
              { title: 'Portfolio access', body: 'Exclusive access to our full private portfolio for use in client presentations and consultations.', detail: 'Including unpublished commissions' },
              { title: 'White label option', body: 'Select partners may offer Maison RSVP experiences under their own brand for client-facing communications.', detail: 'Available to Maison-tier partners' },
              { title: 'Direct creative line', body: 'Partner planners communicate directly with our creative director — no account managers, no waiting.', detail: 'Response within 4 business hours' },
              { title: 'Co-presentation support', body: 'We join client presentations alongside our partner planners when needed — our portfolio, your relationship.', detail: 'Virtual and in-person available' },
            ].map(b => (
              <div key={b.title} style={{ borderTop: '1px solid var(--dust)', paddingTop: 'clamp(2rem,3.5vw,3.5rem)' }}>
                <p style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(1.1rem,1.8vw,1.5rem)', marginBottom: '.8rem' }}>{b.title}</p>
                <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.95rem', color: 'var(--mist)', lineHeight: 1.7, marginBottom: '1rem' }}>{b.body}</p>
                <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.56rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--gold)' }}>{b.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who we partner with */}
        <section style={{ background: 'var(--deep)', color: 'var(--ivory)', padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .055, zIndex: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '200px', mixBlendMode: 'screen' }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 760 }}>
            <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'rgba(201,168,130,.5)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>Who we partner with</p>
            <p style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(1.6rem,3.5vw,3rem)', lineHeight: 1.25, letterSpacing: '-.01em', color: 'var(--ivory)', marginBottom: 'clamp(2rem,4vw,3.5rem)' }}>
              We do not partner with every planner who applies. We partner with those whose standards match ours.
            </p>
            <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(.95rem,1.3vw,1.1rem)', color: 'rgba(248,245,240,.4)', lineHeight: 1.8, marginBottom: '2rem' }}>
              Our partners work in the luxury market. Their clients expect — and deserve — the best. We exist to be what they offer when nothing less will do.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
              {['Luxury wedding planners', 'Destination wedding specialists', 'Luxury event designers', 'Five-star hotel event teams', 'Corporate event consultants', 'Luxury PR & brand agencies'].map(t => (
                <span key={t} style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(248,245,240,.35)', border: '1px solid rgba(248,245,240,.08)', padding: '.4em 1em' }}>{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Apply CTA */}
        <section style={{ padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)', textAlign: 'center', background: `radial-gradient(ellipse 70% 80% at 50% 50%, #F2EBE0 0%, transparent 65%), var(--ivory)` }}>
          <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>Apply to partner</p>
          <h2 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(2.5rem,6vw,6.5rem)', lineHeight: .95, letterSpacing: '-.025em', marginBottom: 'clamp(1.5rem,3vw,2rem)' }}>
            Accepting<br />applications.
          </h2>
          <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(.95rem,1.3vw,1.1rem)', color: 'var(--mist)', lineHeight: 1.7, marginBottom: 'clamp(2.5rem,5vw,4rem)', maxWidth: '38ch', margin: '0 auto clamp(2.5rem,5vw,4rem)' }}>
            We review partnership applications on an ongoing basis. We accept a limited number of new partners each year.
          </p>
          <Link href="/contact?type=partner" style={{ display: 'inline-block', fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1rem,1.5vw,1.25rem)', color: 'var(--gold)', borderBottom: '1px solid rgba(162,129,90,.3)', paddingBottom: '.2em', textDecoration: 'none' }}>
            Book a partner call →
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
