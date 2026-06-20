import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title:       'Our Process — How a Maison RSVP Commission Works',
  description: 'A five-stage creative process built around your story. From first conversation to final delivery, every Maison RSVP commission is a collaboration between two things: your occasion and our craft.',
  path:        '/process',
  keywords:    ['luxury wedding invitation process', 'bespoke wedding website design process', 'custom digital invitation timeline', 'wedding website design Canada'],
});

const STEPS = [
  {
    n:     '01',
    title: 'Discovery',
    time:  '1–2 weeks',
    lead:  'We begin with a conversation, not a brief.',
    body:  'The Discovery stage is where we learn who you are, what your event means, and what you want your guests to feel. We ask questions that go beyond logistics — about light, atmosphere, the details that matter to you, the story you are inviting people into.',
    deliverables: [
      'Private discovery session (60–90 minutes)',
      'Creative questionnaire',
      'Mood & reference board',
      'Initial creative direction document',
    ],
  },
  {
    n:     '02',
    title: 'Story Development',
    time:  '1–2 weeks',
    lead:  'We find the thread that runs through everything.',
    body:  'Before any design begins, we identify the narrative. Your invitation should feel like the first chapter of your event — not a description of it. Story Development is where we find the tone, the imagery, the motion language, and the typography that will carry your story.',
    deliverables: [
      'Narrative outline',
      'Typography system',
      'Colour palette',
      'Motion language direction',
      'Image art direction',
    ],
  },
  {
    n:     '03',
    title: 'Design',
    time:  '2–4 weeks',
    lead:  'The invitation takes shape.',
    body:  'Working from the approved story direction, we design every screen, transition, and typographic moment of your invitation. Nothing is templated. Every element is built for this occasion alone. You review at key milestones and we refine until it is exactly right.',
    deliverables: [
      'Full screen-by-screen designs',
      'Motion storyboard',
      'Typography specimen',
      'Revision sessions',
    ],
  },
  {
    n:     '04',
    title: 'Development',
    time:  '2–4 weeks',
    lead:  'The invitation comes alive.',
    body:  'Approved designs are built into a fully interactive digital experience — with cinematic animations, RSVP functionality, and the fine details that make the difference between a website and an invitation. You receive a private preview link before anything goes to your guests.',
    deliverables: [
      'Full development build',
      'Private preview access',
      'Guest-facing RSVP integration',
      'Dashboard setup',
      'Cross-device testing',
      'Performance optimisation',
    ],
  },
  {
    n:     '05',
    title: 'Launch & Support',
    time:  'Ongoing',
    lead:  'Delivered to your guests. Supported throughout.',
    body:  'Your invitation is deployed, your guests are notified, and we remain available throughout your event window. Every commission includes guest management support, post-launch refinements, and hosting for the agreed term. When the event is over, your archive is yours.',
    deliverables: [
      'Private launch to your guest list',
      'Guest management dashboard access',
      'Post-launch support',
      'Full archive delivery',
      'Print-ready stationery files (Signature & Maison)',
    ],
  },
];

export default function ProcessPage() {
  return (
    <>
      <Nav light />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(
        breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Our Process', path: '/process' }])
      ) }} />

      <main style={{ background: 'var(--ivory)', color: 'var(--ink)' }}>

        {/* ── Hero ─────────────────────────────── */}
        <section style={{
          minHeight: '80svh', display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(8rem,14vw,14rem) clamp(2rem,5vw,5rem) clamp(5rem,8vw,8rem)',
          position: 'relative', overflow: 'hidden',
          background: `
            radial-gradient(ellipse 70% 50% at 70% 30%, #EDE5D8 0%, transparent 55%),
            var(--ivory)
          `,
        }}>
          <div aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .028,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '220px', mixBlendMode: 'multiply',
          }} />
          <nav aria-label="Breadcrumb" style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 .75rem' }}>·</span>
            <span style={{ color: 'var(--gold)' }}>Our Process</span>
          </nav>
          <h1 style={{
            fontFamily: 'var(--font-prata), Georgia, serif',
            fontSize: 'clamp(3.5rem,9vw,10rem)',
            lineHeight: .92, letterSpacing: '-.03em',
            maxWidth: '10ch', marginBottom: 'clamp(3rem,5vw,4.5rem)',
          }}>
            Five stages.<br />
            <em style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', color: 'var(--gold)' }}>One story.</em>
          </h1>
          <p style={{
            fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic',
            fontSize: 'clamp(1rem,1.5vw,1.3rem)',
            color: 'var(--mist)', maxWidth: '44ch', lineHeight: 1.75,
          }}>
            A five-stage creative process built around your occasion. From first conversation to final delivery, every commission is a collaboration between your story and our craft.
          </p>
        </section>

        {/* ── Steps ────────────────────────────── */}
        <section style={{ padding: '0 clamp(2rem,5vw,5rem) clamp(8rem,12vw,12rem)' }}>
          {STEPS.map((step, i) => (
            <ProcessStep key={step.n} step={step} index={i} total={STEPS.length} />
          ))}
        </section>

        {/* ── Timeline overview ────────────────── */}
        <section style={{
          background: 'var(--deep)', color: 'var(--ivory)',
          padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .05, zIndex: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px', mixBlendMode: 'screen',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'rgba(201,168,130,.5)', marginBottom: 'clamp(3rem,5vw,5rem)' }}>
              Total timelines by collection
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,220px),1fr))', gap: '2px' }}>
              {[
                { tier: 'Prelude',   duration: '3–4 weeks',   note: 'For intimate events on a considered timeline.' },
                { tier: 'Signature', duration: '6–8 weeks',   note: 'Our most requested. Full story, full craft.' },
                { tier: 'Maison',    duration: '10–16 weeks', note: 'For events that require nothing less than everything.' },
              ].map(t => (
                <div key={t.tier} style={{
                  padding: 'clamp(2.5rem,4vw,4rem) clamp(2rem,3.5vw,3.5rem)',
                  background: 'rgba(248,245,240,.025)',
                  borderTop: '1px solid rgba(248,245,240,.05)',
                }}>
                  <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.56rem', letterSpacing: '.32em', textTransform: 'uppercase', color: 'rgba(201,168,130,.5)', marginBottom: '.8rem' }}>{t.tier}</p>
                  <p style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(1.5rem,2.8vw,2.4rem)', color: 'var(--ivory)', marginBottom: '.8rem' }}>{t.duration}</p>
                  <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.88rem', color: 'rgba(248,245,240,.3)', lineHeight: 1.65 }}>{t.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────── */}
        <section style={{
          padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)',
          textAlign: 'center',
          background: `radial-gradient(ellipse 70% 80% at 50% 50%, #F2EBE0 0%, transparent 65%), var(--ivory)`,
        }}>
          <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>Ready to begin</p>
          <h2 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(2.5rem,6vw,6.5rem)', lineHeight: .95, letterSpacing: '-.025em', marginBottom: 'clamp(2.5rem,5vw,4rem)' }}>
            Start the conversation.
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

function ProcessStep({ step, index, total }: { step: typeof STEPS[0]; index: number; total: number }) {
  const dark = index % 2 === 1;
  return (
    <article style={{
      display: 'grid',
      gridTemplateColumns: 'clamp(3.5rem,8vw,8rem) 1fr',
      gap: 'clamp(2rem,4vw,5rem)',
      padding: 'clamp(4rem,7vw,7rem) 0',
      borderBottom: index < total - 1 ? '1px solid var(--dust)' : 'none',
    }}>
      {/* Step number */}
      <div style={{ paddingTop: '.2em' }}>
        <span style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '.6rem', letterSpacing: '.35em', textTransform: 'uppercase',
          color: 'var(--gold)',
        }}>
          {step.n}
        </span>
      </div>

      {/* Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,320px),1fr))',
        gap: 'clamp(2rem,4vw,5rem)',
        alignItems: 'start',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-prata), Georgia, serif',
            fontSize: 'clamp(2rem,4vw,3.8rem)',
            lineHeight: 1, letterSpacing: '-.02em',
            marginBottom: '1rem',
          }}>
            {step.title}
          </h2>
          <p style={{
            fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic',
            fontSize: 'clamp(1rem,1.4vw,1.15rem)', color: 'var(--gold)',
            marginBottom: 'clamp(1.5rem,3vw,2.5rem)',
          }}>
            {step.lead}
          </p>
          <p style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontSize: 'clamp(.95rem,1.2vw,1.1rem)',
            color: 'var(--mist)', lineHeight: 1.8, maxWidth: '42ch',
          }}>
            {step.body}
          </p>
        </div>

        <div style={{ paddingTop: 'clamp(1rem,2vw,2rem)' }}>
          <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.56rem', letterSpacing: '.32em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: '1.5rem' }}>
            Deliverables
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {step.deliverables.map(d => (
              <li key={d} style={{ display: 'flex', gap: '.75rem', alignItems: 'flex-start', marginBottom: '.8rem' }}>
                <span style={{ display: 'inline-block', width: 3, height: 3, background: 'var(--gold)', borderRadius: '50%', marginTop: '.5em', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.65rem', letterSpacing: '.04em', color: 'var(--mist)', lineHeight: 1.55 }}>{d}</span>
              </li>
            ))}
          </ul>
          <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.54rem', letterSpacing: '.28em', textTransform: 'uppercase', color: 'rgba(162,129,90,.5)', marginTop: '1.5rem' }}>
            {step.time}
          </p>
        </div>
      </div>
    </article>
  );
}
