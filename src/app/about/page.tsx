import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title:       'About Maison RSVP — The Philosophy Behind the Craft',
  description: 'Maison RSVP exists because the invitation is the first act of the story. We are a luxury digital invitation house based in Vancouver, creating bespoke experiences for the world\'s most considered events.',
  path:        '/about',
  keywords:    ['luxury digital invitation house', 'bespoke invitation design Vancouver', 'wedding invitation designer Canada', 'luxury wedding design studio'],
});

export default function AboutPage() {
  return (
    <>
      <Nav light />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(
        breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])
      ) }} />

      <main style={{ background: 'var(--ivory)', color: 'var(--ink)' }}>

        {/* Hero */}
        <section style={{
          minHeight: '90svh', display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(8rem,14vw,14rem) clamp(2rem,5vw,5rem) clamp(5rem,8vw,8rem)',
          position: 'relative', overflow: 'hidden',
          background: `radial-gradient(ellipse 80% 55% at 55% 35%, #EDE5D8 0%, transparent 55%), var(--ivory)`,
        }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .028, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '220px', mixBlendMode: 'multiply' }} />
          <nav aria-label="Breadcrumb" style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 .75rem' }}>·</span>
            <span style={{ color: 'var(--gold)' }}>About</span>
          </nav>
          <h1 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(3.5rem,9vw,10rem)', lineHeight: .92, letterSpacing: '-.03em', maxWidth: '11ch', marginBottom: 'clamp(3rem,5vw,4.5rem)' }}>
            We do not<br />design websites.<br />
            <em style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', color: 'var(--gold)' }}>We compose<br />first acts.</em>
          </h1>
        </section>

        {/* Philosophy */}
        <section style={{ padding: 'clamp(7rem,12vw,12rem) clamp(2rem,5vw,5rem)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,400px),1fr))', gap: 'clamp(4rem,8vw,10rem)', alignItems: 'start', background: `radial-gradient(ellipse 60% 30% at 80% 0%, #F0E9DE 0%, transparent 50%), var(--ivory)` }}>
          <div>
            <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>The Philosophy</p>
            <h2 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(2rem,4vw,4rem)', lineHeight: .97, letterSpacing: '-.02em', marginBottom: 'clamp(2.5rem,4vw,3.5rem)' }}>
              The invitation is not a formality.<br />
              <em style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', color: 'var(--gold)' }}>It is the beginning.</em>
            </h2>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontSize: 'clamp(1rem,1.4vw,1.2rem)', lineHeight: 1.85, color: 'var(--mist)', marginBottom: '2rem', maxWidth: '44ch' }}>
              Maison RSVP was founded on a conviction: that the experience of being invited to something extraordinary should be as carefully composed as the event itself.
            </p>
            <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1rem,1.4vw,1.2rem)', lineHeight: 1.85, color: 'var(--mist)', maxWidth: '44ch' }}>
              We work with couples, families, and organisations who understand that the first impression matters — not just visually, but emotionally. An invitation should make your guests feel something before they arrive.
            </p>
          </div>
        </section>

        {/* Dark principles section */}
        <section style={{ background: 'var(--deep)', color: 'var(--ivory)', padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .055, zIndex: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '200px', mixBlendMode: 'screen' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'rgba(201,168,130,.5)', marginBottom: 'clamp(3rem,5vw,5rem)' }}>
              The Craft
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,280px),1fr))', gap: '2px' }}>
              {[
                { title: 'One commission at a time', body: 'We do not run multiple major commissions simultaneously. When we are working on your invitation, it has our full attention.' },
                { title: 'No templates. Ever.', body: 'Every Maison RSVP invitation is designed from scratch. We do not have a library of layouts to customise. We have a blank page and your story.' },
                { title: 'Narrative before aesthetics', body: 'We begin every commission by understanding what your guests should feel. The design follows the feeling, not the other way around.' },
                { title: 'Motion with intention', body: 'Every animation in a Maison RSVP invitation has a reason. We do not add motion to impress — we add motion to create emotion.' },
              ].map(p => (
                <div key={p.title} style={{ padding: 'clamp(2.5rem,4vw,4rem)', background: 'rgba(248,245,240,.02)', borderTop: '1px solid rgba(248,245,240,.05)' }}>
                  <p style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(1rem,1.6vw,1.3rem)', color: 'var(--ivory)', marginBottom: '1rem' }}>{p.title}</p>
                  <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.9rem', color: 'rgba(248,245,240,.35)', lineHeight: 1.7 }}>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* By the numbers */}
        <section style={{ padding: 'clamp(7rem,12vw,12rem) clamp(2rem,5vw,5rem)', background: `radial-gradient(ellipse 70% 50% at 50% 50%, #F2EBE0 0%, transparent 65%), var(--ivory)` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,180px),1fr))', gap: 'clamp(3rem,5vw,5rem)', textAlign: 'center' }}>
            {[
              { n: '48',  label: 'Commissions completed' },
              { n: '18',  label: 'Countries reached' },
              { n: '100%', label: 'Unique designs' },
              { n: '2021', label: 'Founded' },
            ].map(stat => (
              <div key={stat.label}>
                <p style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(3rem,6vw,5.5rem)', lineHeight: 1, letterSpacing: '-.03em', marginBottom: '.5rem' }}>{stat.n}</p>
                <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.6rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--mist)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Founder */}
        <section style={{
          padding: 'clamp(7rem,12vw,12rem) clamp(2rem,5vw,5rem)',
          background: `radial-gradient(ellipse 60% 40% at 30% 60%, #EDE5D8 0%, transparent 55%), var(--ivory)`,
          borderTop: '1px solid rgba(162,129,90,.08)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,340px),1fr))', gap: 'clamp(4rem,8vw,8rem)', alignItems: 'center' }}>
            {/* Photo placeholder */}
            <div style={{ position: 'relative', maxWidth: 380 }}>
              <div style={{
                width: '100%', aspectRatio: '3/4',
                background: 'rgba(162,129,90,.06)',
                border: '1px solid rgba(162,129,90,.2)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '1rem',
                fontFamily: 'var(--font-manrope), sans-serif',
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(162,129,90,.4)" strokeWidth="1">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
                <span style={{ fontSize: '.55rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'rgba(162,129,90,.4)' }}>
                  [Your photograph here]
                </span>
              </div>
              {/* Gold accent line */}
              <div style={{ position: 'absolute', bottom: -24, left: 0, width: 'clamp(2rem,4vw,3rem)', height: 1, background: 'var(--gold)', opacity: .4 }} />
            </div>

            {/* Text */}
            <div>
              <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'clamp(2rem,3vw,2.5rem)' }}>
                The Founder
              </p>
              <h2 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(2rem,3.5vw,3.2rem)', lineHeight: 1.05, letterSpacing: '-.02em', marginBottom: 'clamp(1.5rem,2.5vw,2rem)' }}>
                {/* PLACEHOLDER — replace with your full name */}
                [Your Name]
              </h2>
              <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontSize: 'clamp(.95rem,1.2vw,1.1rem)', lineHeight: 1.85, color: 'var(--mist)', marginBottom: '1.5rem', maxWidth: '42ch' }}>
                {/* PLACEHOLDER — 2-3 sentences about your background, journey, and what led you to found Maison RSVP. Keep it personal. What did you see that was missing in the market? What do you believe about the role of design in a person's most important moments? */}
                [Your background — e.g. "I spent a decade in luxury event production before founding Maison RSVP. I kept watching couples pour everything into their celebration, only to send a generic digital invite from a template builder. I believed the invitation itself deserved the same care."]
              </p>
              <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(.95rem,1.2vw,1.1rem)', lineHeight: 1.85, color: 'rgba(162,129,90,.7)', maxWidth: '40ch' }}>
                {/* PLACEHOLDER — a short, quotable sentence that captures your design philosophy */}
                &ldquo;[A sentence that defines your creative philosophy — what you believe about beauty, ceremony, or the meaning of a first impression.]&rdquo;
              </p>
              <div style={{ marginTop: 'clamp(2rem,3vw,2.5rem)', paddingTop: 'clamp(1.5rem,2.5vw,2rem)', borderTop: '1px solid rgba(162,129,90,.12)' }}>
                <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.28em', textTransform: 'uppercase', color: 'var(--mist)' }}>
                  {/* PLACEHOLDER — your location or discipline, e.g. "Vancouver, BC — Invitation Design & Art Direction" */}
                  [Your city] — Invitation Design &amp; Art Direction
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ borderTop: '1px solid var(--dust)', padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>Begin your commission</p>
          <h2 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(2.5rem,6vw,6.5rem)', lineHeight: .95, letterSpacing: '-.025em', marginBottom: 'clamp(2.5rem,5vw,4rem)' }}>
            Let us tell<br />your story.
          </h2>
          <Link href="/contact" style={{ display: 'inline-block', fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1rem,1.5vw,1.25rem)', color: 'var(--gold)', borderBottom: '1px solid rgba(162,129,90,.3)', paddingBottom: '.2em', textDecoration: 'none' }}>
            Begin a commission →
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
