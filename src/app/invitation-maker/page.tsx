import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { buildMetadata, faqSchema, breadcrumbSchema } from '@/lib/seo';
import { EDITION_TEMPLATES, type Edition } from '@/lib/editions';
import { EditionTemplate } from '@/components/editions/templates';

export const metadata: Metadata = buildMetadata({
  title:       'Free Digital Invitation Maker — Beautiful, No Sign-Up',
  description: 'Create a beautiful digital invitation free in minutes. Three elegant designs, gentle animation, RSVP by email, one shareable link. No sign-up, no watermarked mess — by the studio behind Maison RSVP.',
  path:        '/invitation-maker',
  keywords: [
    'free digital invitation maker',
    'free online invitation maker',
    'digital wedding invitation free',
    'free invitation with RSVP',
    'elegant invitation maker',
  ],
});

const FAQ = [
  { q: 'Is the invitation maker really free?', a: 'Yes — completely. No sign-up, no credit card, no trial. Choose a design, add your details, and share your link. It is our gift, made by the same studio that composes bespoke invitation experiences by private commission.' },
  { q: 'How do guests RSVP?', a: 'Your invitation includes an elegant reply form. Every RSVP — attending or regrets, with an optional note — arrives directly in your email inbox. Guests never need an account.' },
  { q: 'Do you store my information or my guest list?', a: 'Almost nothing. Your invitation text lives entirely inside its own private link — we keep no copy of it and no database of your guests. If you add a photograph in the design studio, it is stored privately for up to twelve months so your guests can see it, then deleted. Your email address is used only to deliver RSVPs and never for marketing.' },
  { q: 'Can I use it for weddings, birthdays, or dinners?', a: 'Any occasion. The occasion line is editable — weddings, engagement parties, anniversaries, private dinners, and celebrations of any kind.' },
  { q: 'What is the difference between a free Edition and a commission?', a: 'An Edition is a beautiful foundation design you personalise in minutes. A commission is composed from scratch for one occasion only — cinematic motion, original narrative, guest dashboard, and entrance management. Editions are our gift; commissions are our craft.' },
];

const SAMPLE: Record<string, Edition> = {
  garden:   { t: 'garden',   n1: 'Amelia', n2: 'Thomas', o: 'are getting married', d: 'June 12th, 2027', h: '', v: 'The Orchard House', c: 'Vancouver', m: '', e: '' },
  nocturne: { t: 'nocturne', n1: 'Isabelle', n2: 'James', o: 'request the pleasure of your company', d: 'September 4th, 2027', h: '', v: 'The Pembroke Room', c: 'London', m: '', e: '' },
  riviera:  { t: 'riviera',  n1: 'Sofia', n2: 'Marco', o: 'invite you to celebrate', d: 'July 18th, 2027', h: '', v: 'Villa Limonaia', c: 'Amalfi Coast', m: '', e: '' },
};

const STEPS = [
  { n: 'I',   title: 'Choose a design', body: 'Three designs from our studio — botanical, candlelit, or Mediterranean. Each with gentle, elegant animation.' },
  { n: 'II',  title: 'Add your details', body: 'Names, date, venue, and a personal message. Watch your invitation compose itself as you type.' },
  { n: 'III', title: 'Share one link', body: 'Send it by message or email. Guests reply on the invitation, and every RSVP arrives in your inbox.' },
];

export default function InvitationMakerPage() {
  return (
    <>
      <Nav light />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(FAQ)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(
        breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Free Invitation Maker', path: '/invitation-maker' }])
      ) }} />

      <main style={{ background: 'var(--ivory)', color: 'var(--ink)' }}>

        {/* ── Hero ── */}
        <section style={{
          padding: 'clamp(8rem,14vw,13rem) clamp(1.5rem,5vw,5rem) clamp(4rem,7vw,6rem)',
          textAlign: 'center',
          background: 'radial-gradient(ellipse 80% 55% at 50% 20%, #EDE5D8 0%, transparent 60%), var(--ivory)',
        }}>
          <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.75rem' }}>
            Maison Editions — free, always
          </p>
          <h1 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(2.6rem,7vw,6rem)', lineHeight: .98, letterSpacing: '-.025em', maxWidth: '16ch', margin: '0 auto clamp(1.5rem,3vw,2rem)' }}>
            A free digital invitation maker,{' '}
            <em style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', color: 'var(--gold)' }}>done beautifully.</em>
          </h1>
          <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1rem,1.5vw,1.2rem)', color: 'var(--mist)', maxWidth: '52ch', margin: '0 auto clamp(2.5rem,4vw,3rem)', lineHeight: 1.75 }}>
            Compose an elegant animated invitation in minutes. One shareable link, RSVPs straight to your email. No sign-up, no account, no guest lists kept — a gift from the studio behind Maison RSVP.
          </p>
          <Link href="/invitation-maker/design" style={{
            display: 'inline-block',
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.62rem', letterSpacing: '.3em', textTransform: 'uppercase',
            color: 'var(--ivory)', background: 'var(--ink)',
            padding: '1.3em 3em', textDecoration: 'none',
          }}>
            Create your invitation — free
          </Link>
        </section>

        {/* ── Template gallery ── */}
        <section aria-label="Invitation designs" style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,5rem) clamp(5rem,8vw,7rem)' }}>
          <h2 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(1.8rem,3.5vw,3rem)', textAlign: 'center', letterSpacing: '-.02em', marginBottom: 'clamp(3rem,5vw,4rem)' }}>
            Three designs, <em style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', color: 'var(--gold)' }}>from our atelier.</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,300px),1fr))', gap: 'clamp(1.5rem,3vw,2.5rem)', maxWidth: 1200, margin: '0 auto' }}>
            {EDITION_TEMPLATES.map(t => (
              <Link key={t.id} href={`/invitation-maker/create?template=${t.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                {/* Scaled live preview */}
                <div aria-hidden style={{
                  position: 'relative', overflow: 'hidden', borderRadius: 4,
                  border: '1px solid rgba(162,129,90,.2)',
                  height: '40svh', minHeight: 280,
                  boxShadow: '0 20px 44px -18px rgba(14,13,11,.25)',
                }}>
                  <div style={{ width: '250%', transform: 'scale(.4)', transformOrigin: 'top left', pointerEvents: 'none' }}>
                    <EditionTemplate data={SAMPLE[t.id]} />
                  </div>
                </div>
                <div style={{ padding: '1.25rem .25rem 0' }}>
                  <p style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: '1.15rem', marginBottom: '.3rem' }}>{t.name}</p>
                  <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.9rem', color: 'var(--mist)', lineHeight: 1.6 }}>{t.description}</p>
                  <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--gold)', marginTop: '.8rem' }}>
                    Use this design →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section style={{ background: 'var(--deep)', color: 'var(--ivory)', padding: 'clamp(5rem,9vw,8rem) clamp(1.5rem,5vw,5rem)' }}>
          <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'rgba(201,168,130,.6)', textAlign: 'center', marginBottom: 'clamp(3rem,5vw,4.5rem)' }}>
            How it works
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,240px),1fr))', gap: 'clamp(2.5rem,4vw,3.5rem)', maxWidth: 1100, margin: '0 auto' }}>
            {STEPS.map(s => (
              <div key={s.n} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: '1.4rem', color: 'var(--gold)', marginBottom: '1rem' }}>{s.n}</p>
                <p style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: '1.1rem', marginBottom: '.8rem' }}>{s.title}</p>
                <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.92rem', color: 'rgba(248,245,240,.45)', lineHeight: 1.7, maxWidth: '32ch', margin: '0 auto' }}>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ padding: 'clamp(5rem,9vw,8rem) clamp(1.5rem,5vw,5rem)', maxWidth: 780, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', letterSpacing: '-.02em', textAlign: 'center', marginBottom: 'clamp(2.5rem,4vw,3.5rem)' }}>
            Questions, answered.
          </h2>
          <div>
            {FAQ.map(f => (
              <details key={f.q} style={{ borderTop: '1px solid rgba(162,129,90,.18)', padding: '1.4rem 0' }}>
                <summary style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: '1.02rem', cursor: 'pointer', listStyle: 'none' }}>
                  {f.q}
                </summary>
                <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontSize: '.95rem', color: 'var(--mist)', lineHeight: 1.8, paddingTop: '.8rem', maxWidth: '62ch' }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Upsell — the bridge to commissions ── */}
        <section style={{ borderTop: '1px solid rgba(162,129,90,.15)', padding: 'clamp(5rem,9vw,8rem) clamp(1.5rem,5vw,5rem)', textAlign: 'center', background: 'radial-gradient(ellipse 70% 50% at 50% 100%, #EDE5D8 0%, transparent 60%), var(--ivory)' }}>
          <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.75rem' }}>
            When the occasion asks for more
          </p>
          <h2 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(2rem,5vw,4rem)', lineHeight: 1, letterSpacing: '-.02em', maxWidth: '18ch', margin: '0 auto 1.5rem' }}>
            Editions are our gift. <em style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', color: 'var(--gold)' }}>Commissions are our craft.</em>
          </h2>
          <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(.95rem,1.3vw,1.1rem)', color: 'var(--mist)', maxWidth: '52ch', margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
            A commission is composed once, for one occasion — cinematic motion, original narrative, private guest dashboard, and entrance management. Designed from scratch, never repeated.
          </p>
          <Link href="/collection" style={{
            display: 'inline-block', fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic',
            fontSize: 'clamp(1rem,1.4vw,1.2rem)', color: 'var(--gold)',
            borderBottom: '1px solid rgba(162,129,90,.35)', paddingBottom: '.2em', textDecoration: 'none',
          }}>
            Explore the Collection →
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
