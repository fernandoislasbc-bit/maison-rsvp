import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Maison RSVP',
  description: 'How Maison RSVP collects, uses, and protects your personal information.',
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    title: 'Information we collect',
    body: `When you submit a commission enquiry through our website, we collect the information you provide: your name and your partner's name, your email address, your phone number (if provided), event details including date, location, and guest count, and any message you include.

We do not collect payment information through our website. All billing is handled separately through secure invoice processes.`,
  },
  {
    title: 'How we use your information',
    body: `We use the information you provide solely to respond to your commission enquiry, to develop and deliver your commission if you proceed, and to communicate with you about your project.

We do not sell your personal information. We do not share it with third parties except where necessary to deliver your commission (for example, our development infrastructure providers), and only then subject to appropriate data processing agreements.`,
  },
  {
    title: 'Data retention',
    body: `We retain your information for as long as necessary to deliver your commission and to comply with our legal obligations. For completed commissions, we retain project files for a period of three years following delivery, after which they are securely deleted upon request.`,
  },
  {
    title: 'Cookies',
    body: `Our website uses only essential cookies necessary for the site to function. We do not use tracking cookies, advertising cookies, or third-party analytics that share your data.`,
  },
  {
    title: 'Your rights',
    body: `You have the right to access the personal information we hold about you, to request its correction, to request its deletion, and to withdraw consent where consent is the basis for processing.

To exercise any of these rights, please contact us at: privacy@maisonrsvp.com`,
  },
  {
    title: 'Contact',
    body: `If you have questions about this privacy policy or how we handle your personal information, please contact us at privacy@maisonrsvp.com. We will respond within five business days.`,
  },
];

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function PrivacyPage() {
  return (
    <>
      <Nav light />
      <main style={{ background: 'var(--ivory)', color: 'var(--ink)' }}>
        <section style={{ padding: 'clamp(8rem,14vw,14rem) clamp(2rem,5vw,5rem) clamp(4rem,6vw,4rem)', position: 'relative', overflow: 'hidden', background: `radial-gradient(ellipse 60% 50% at 60% 30%, #EDE5D8 0%, transparent 55%), var(--ivory)` }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .028, backgroundImage: GRAIN, backgroundSize: '220px', mixBlendMode: 'multiply' }} />
          <nav aria-label="Breadcrumb" style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 .75rem' }}>·</span>
            <span style={{ color: 'var(--gold)' }}>Privacy Policy</span>
          </nav>
          <h1 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(2.5rem,6vw,6rem)', lineHeight: .95, letterSpacing: '-.025em', marginBottom: '1rem' }}>Privacy Policy</h1>
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
