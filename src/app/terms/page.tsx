import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | Maison RSVP',
  description: 'Terms and conditions governing Maison RSVP commission agreements.',
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    title: 'Commission agreement',
    body: `A commission begins when both parties have agreed to the scope of work and the deposit has been received. Enquiries submitted through our website do not constitute a commission agreement.

Each commission is governed by a bespoke agreement that sets out the scope of work, timeline, deliverables, payment schedule, and intellectual property terms. No work begins before this agreement is signed by both parties.`,
  },
  {
    title: 'Payment',
    body: `Commissions require a deposit of 50% of the agreed fee before work begins. The remaining balance is due upon delivery of the final commission for client approval. Exact payment terms are set out in the individual commission agreement.

All fees are quoted in Canadian dollars unless otherwise agreed. We accept bank transfer and major credit cards.`,
  },
  {
    title: 'Revisions',
    body: `Each collection tier includes a specified number of revision rounds. Requests for changes beyond the included revisions are quoted separately. We define a revision round as a consolidated set of feedback provided in a single communication.`,
  },
  {
    title: 'Intellectual property',
    body: `Upon receipt of final payment, the client receives a perpetual licence to use the completed commission for its intended purpose. Maison RSVP retains the right to display the commission in our portfolio, unless the client requests otherwise in writing before the commission agreement is signed.

Source files and design assets remain the property of Maison RSVP unless a full intellectual property transfer is agreed and paid for separately.`,
  },
  {
    title: 'Cancellation',
    body: `If a client cancels a commission after work has begun, the deposit is non-refundable. If Maison RSVP is unable to complete a commission for any reason, the client will receive a full refund of all fees paid.`,
  },
  {
    title: 'Limitation of liability',
    body: `Maison RSVP's liability in connection with any commission is limited to the fees paid for that commission. We are not liable for indirect, consequential, or incidental damages.`,
  },
  {
    title: 'Governing law',
    body: `These terms and all commission agreements are governed by the laws of British Columbia, Canada. Any disputes will be resolved in the courts of British Columbia.`,
  },
  {
    title: 'Contact',
    body: `For questions about these terms, please contact us at: commissions@maisonrsvp.com`,
  },
];

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function TermsPage() {
  return (
    <>
      <Nav light />
      <main style={{ background: 'var(--ivory)', color: 'var(--ink)' }}>
        <section style={{ padding: 'clamp(8rem,14vw,14rem) clamp(2rem,5vw,5rem) clamp(4rem,6vw,4rem)', position: 'relative', overflow: 'hidden', background: `radial-gradient(ellipse 60% 50% at 60% 30%, #EDE5D8 0%, transparent 55%), var(--ivory)` }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .028, backgroundImage: GRAIN, backgroundSize: '220px', mixBlendMode: 'multiply' }} />
          <nav aria-label="Breadcrumb" style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 .75rem' }}>·</span>
            <span style={{ color: 'var(--gold)' }}>Terms of Service</span>
          </nav>
          <h1 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(2.5rem,6vw,6rem)', lineHeight: .95, letterSpacing: '-.025em', marginBottom: '1rem' }}>Terms of Service</h1>
          <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.9rem', color: 'var(--mist)' }}>Last updated: January 2025</p>
        </section>

        <section style={{ padding: 'clamp(4rem,7vw,7rem) clamp(2rem,5vw,5rem) clamp(6rem,10vw,10rem)' }}>
          <div style={{ maxWidth: 680 }}>
            {SECTIONS.map(s => (
              <div key={s.title} style={{ marginBottom: 'clamp(2.5rem,4vw,4rem)', borderTop: '1px solid var(--dust)', paddingTop: 'clamp(2rem,3vw,3rem)' }}>
                <h2 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(1.1rem,2vw,1.5rem)', marginBottom: '1.25rem' }}>{s.title}</h2>
                {s.body.split('\n\n').map((p, i) => (
                  <p key={i} style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(.9rem,1.2vw,1.05rem)', color: 'var(--mist)', lineHeight: 1.8, marginBottom: '1rem' }}>{p}</p>
                ))}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
