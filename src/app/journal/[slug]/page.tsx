import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { getArticle, ARTICLES } from '@/lib/journal';
import { buildMetadata, articleSchema, breadcrumbSchema, faqSchema } from '@/lib/seo';

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return buildMetadata({
    title:       article.seoTitle,
    description: article.description,
    path:        `/journal/${article.slug}`,
    keywords:    article.keywords,
  });
}

export function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }));
}

// Article body content — in production this would come from a CMS
function getArticleBody(slug: string): { intro: string; sections: { heading: string; body: string }[]; pullQuote: string; faqs: { q: string; a: string }[] } {
  const bodies: Record<string, ReturnType<typeof getArticleBody>> = {
    'why-your-wedding-invitation-is-the-most-important-design-decision-you-will-make': {
      intro: `Most couples spend months agonising over the venue, the flowers, the menu, the dress. These decisions take weeks, sometimes months, of deliberation. The invitation, by contrast, is often treated as a formality — something to be checked off the list in an afternoon.

This is the wrong order. Not because the venue doesn't matter, but because the invitation is doing something the venue never can: it is the first moment your guests experience what your wedding will feel like.`,
      sections: [
        {
          heading: 'The invitation is not a logistics document',
          body: `When a guest receives an invitation, they are not looking for information. They already know roughly when and where the wedding will happen. What they are looking for — consciously or not — is an emotional signal. They are asking: what kind of experience is this going to be? How should I feel about being here?

The invitation answers that question before a single arrangement has been placed or a single note of music has been played. It is the first impression. And in luxury design, as in all design, first impressions are the hardest things to correct once they have been made.`,
        },
        {
          heading: 'What a great invitation does',
          body: `A great invitation does not describe your wedding. It creates anticipation for it. It makes your guests feel something specific — not just excitement (which is generic) but the particular quality of excitement that belongs to your event.

A garden wedding in Provence should feel different from a city celebration in a private members' club in Tokyo. Both might be equally beautiful. But they should feel different from the first moment a guest encounters them — and that difference begins with the invitation.`,
        },
        {
          heading: 'The luxury standard',
          body: `In every other area of the luxury experience — hospitality, fashion, jewellery, gastronomy — the packaging and the approach are considered as carefully as the object or service itself. A hotel that charges four figures per night does not send guests a generic confirmation email. A jeweller does not wrap a significant piece in a paper bag.

The luxury wedding invitation should be held to the same standard. Not because of what it costs, but because of what it communicates. The invitation is where the event begins.`,
        },
      ],
      pullQuote: 'The venue is where the wedding happens. The invitation is where it begins. These are not the same moment.',
      faqs: [
        {
          q: 'What is a bespoke digital wedding invitation?',
          a: 'A bespoke digital wedding invitation is a custom-designed digital experience — not a template — that tells the story of a couple and creates genuine anticipation for their event. Unlike a standard wedding website, a bespoke invitation is designed from scratch around the specific aesthetic and narrative of the occasion.',
        },
        {
          q: 'How early should we commission our wedding invitation?',
          a: 'For a Maison RSVP commission, we recommend beginning the process at least three to four months before you plan to send your invitations. Our Signature and Maison collections require six to sixteen weeks of design and development time, and we accept a limited number of commissions each season.',
        },
        {
          q: 'Is a digital invitation appropriate for a formal luxury wedding?',
          a: 'Yes. The formality of an occasion is conveyed by the quality and craft of the invitation, not its medium. A bespoke digital invitation designed with the same care and intentionality as a letterpress paper suite communicates the same level of sophistication — and offers storytelling dimensions that paper cannot.',
        },
      ],
    },
    'the-difference-between-a-wedding-website-and-a-wedding-invitation-experience': {
      intro: `There is a common misconception in wedding planning: that a wedding website and a wedding invitation are the same thing, or that one can substitute for the other. They cannot. They are doing fundamentally different work.

Understanding the difference is not an academic exercise. It is the difference between guests who arrive at your wedding curious and expectant, and guests who arrive having simply confirmed logistics.`,
      sections: [
        {
          heading: 'What a wedding website does',
          body: `A wedding website is an information system. It answers the practical questions that guests have: When is it? Where is it? What should I wear? Where should I stay? How do I RSVP?

These are important questions. They deserve clear, well-designed answers. A good wedding website does this beautifully, with care. But answering questions is not the same thing as creating desire. It is not the same as making someone feel something.`,
        },
        {
          heading: 'What a wedding invitation experience does',
          body: `A wedding invitation experience begins before the information. It begins with atmosphere — with the specific quality of light, sound, movement, and mood that defines your event. It tells guests not just where to go, but what to feel about going there.

This is the work of a narrative designer, not just a web designer. It requires understanding the story of a couple — how they met, what draws them together, what the place they have chosen means to them — and translating that into a digital experience that a guest encounters for the first time and immediately understands, emotionally, what kind of occasion this will be.`,
        },
        {
          heading: 'Why both matter',
          body: `The most considered couples do not choose between an invitation experience and a wedding website. They understand that these serve different purposes in the guest journey.

The invitation experience is sent to guests before the save-the-date, or alongside it. It is the opening statement — the emotional declaration that this is going to be extraordinary. The wedding website handles the logistics: accommodation, directions, dietary requirements, the schedule.

One creates desire. The other fulfils the practical requirements that desire creates. Both are necessary. But they are not interchangeable.`,
        },
      ],
      pullQuote: 'A wedding website answers questions. A wedding invitation creates anticipation. They are not the same thing.',
      faqs: [
        {
          q: 'Do I need both a wedding website and a digital invitation?',
          a: 'Not necessarily. At Maison RSVP, our Signature and Maison commissions include full information architecture — including RSVP functionality, accommodation details, and schedule — within the invitation experience itself. We design them as a single, unified guest journey rather than two separate products.',
        },
        {
          q: 'Can a digital invitation include RSVP functionality?',
          a: 'Yes. All Maison RSVP commissions include bespoke RSVP experiences designed to feel as considered as the invitation itself — not a standard form, but an interaction that belongs to the aesthetic and narrative of the event.',
        },
      ],
    },
  };

  return bodies[slug] ?? {
    intro: `This is one of the most important questions in luxury event design, and it is one that does not get asked often enough. The answer changes everything about how you approach the invitation — and, in turn, how your guests approach your event.`,
    sections: [
      {
        heading: 'The principle',
        body: `Every element of a truly considered event experience is intentional. Not every element needs to be expensive, or elaborate, or technically complex. But every element should be deliberate — chosen with an understanding of what it communicates, what emotion it creates, and how it contributes to the whole.

The invitation is where this intentionality begins. It is the first element your guests encounter. The care you bring to it — or don't — tells them everything about what follows.`,
      },
      {
        heading: 'What this means in practice',
        body: `In practice, it means beginning the invitation design process not with aesthetic references, but with a question: what do we want our guests to feel when they open this? Not just "excited" — that is too general. What specific quality of feeling? What atmosphere? What sense of occasion?

The design answers that question. Typography, motion, colour, language — every choice is in service of a specific emotional destination. This is the discipline that separates bespoke invitation design from template selection.`,
      },
    ],
    pullQuote: 'The most important design decisions are not about aesthetics. They are about emotion.',
    faqs: [
      {
        q: 'How does Maison RSVP approach a new commission?',
        a: 'Every commission begins with a discovery conversation — not about aesthetics, but about story. We want to understand who the couple is, how they met, what the occasion means to them, and what they want their guests to feel. The design follows from that, not the other way around.',
      },
      {
        q: 'What makes a Maison RSVP invitation different from a template?',
        a: 'Every Maison RSVP invitation is designed from scratch, for a specific couple and a specific occasion. We do not have a library of layouts to customise. We begin each commission with a blank page and a story. The result is something that could not exist for any other couple.',
      },
    ],
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const body = getArticleBody(slug);
  const relatedArticles = ARTICLES.filter(a => a.slug !== slug && a.categorySlug === article.categorySlug).slice(0, 2);

  const aSchema = articleSchema({
    title:         article.title,
    description:   article.description,
    slug:          `journal/${article.slug}`,
    datePublished: article.date,
    dateModified:  article.date,
    image:         article.cover,
    authorName:    'Maison RSVP',
  });

  return (
    <>
      <Nav light />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Journal', path: '/journal' },
          { name: article.title, path: `/journal/${article.slug}` },
        ])
      ) }} />
      {body.faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(body.faqs)) }} />
      )}

      <main style={{ background: 'var(--ivory)', color: 'var(--ink)' }}>
        {/* Hero */}
        <header style={{
          padding: 'clamp(8rem,14vw,14rem) clamp(2rem,5vw,5rem) clamp(5rem,8vw,6rem)',
          position: 'relative', overflow: 'hidden',
          background: `radial-gradient(ellipse 70% 60% at 60% 40%, #EDE5D8 0%, transparent 55%), var(--ivory)`,
        }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .028, backgroundImage: GRAIN, backgroundSize: '220px', mixBlendMode: 'multiply' }} />
          <div style={{ maxWidth: 860, position: 'relative' }}>
            <nav aria-label="Breadcrumb" style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 'clamp(2rem,4vw,3rem)', display: 'flex', gap: '.75rem', alignItems: 'center' }}>
              <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
              <span>·</span>
              <Link href="/journal" style={{ color: 'inherit', textDecoration: 'none' }}>Journal</Link>
              <span>·</span>
              <Link href={`/journal?category=${article.categorySlug}`} style={{ color: 'var(--gold)', textDecoration: 'none' }}>{article.category}</Link>
            </nav>
            <h1 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(2.2rem,5.5vw,5rem)', lineHeight: 1.05, letterSpacing: '-.025em', marginBottom: 'clamp(2rem,4vw,3rem)', maxWidth: '22ch' }}>
              {article.title}
            </h1>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)' }}>{article.readTime}</p>
              <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)' }}>
                {new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </header>

        {/* Cover image placeholder */}
        <div style={{ padding: '0 clamp(2rem,5vw,5rem)', marginBottom: 'clamp(5rem,8vw,8rem)' }}>
          <div style={{ width: '100%', aspectRatio: '21/9', background: 'linear-gradient(135deg, #EDE5D8 0%, #D4C9B8 55%, #C5BAA8 100%)', position: 'relative', overflow: 'hidden' }}>
            <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: GRAIN, backgroundSize: '200px', opacity: .05, mixBlendMode: 'multiply' }} />
          </div>
        </div>

        {/* Article body */}
        <article style={{ padding: '0 clamp(2rem,5vw,5rem) clamp(6rem,10vw,10rem)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr min(680px, 100%) 1fr', gap: 0 }}>
            <div /> {/* left spacer */}
            <div>
              {/* Intro */}
              <div style={{ marginBottom: 'clamp(3rem,5vw,5rem)' }}>
                {body.intro.split('\n\n').map((p, i) => (
                  <p key={i} style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontSize: 'clamp(1.05rem,1.5vw,1.25rem)', lineHeight: 1.85, color: i === 0 ? 'var(--ink)' : 'var(--mist)', marginBottom: '1.5rem' }}>{p}</p>
                ))}
              </div>

              {/* Sections */}
              {body.sections.map((section, i) => (
                <section key={i} style={{ marginBottom: 'clamp(3rem,5vw,5rem)' }}>
                  <h2 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(1.3rem,2.5vw,2rem)', lineHeight: 1.2, letterSpacing: '-.015em', marginBottom: '1.5rem' }}>{section.heading}</h2>
                  {section.body.split('\n\n').map((p, j) => (
                    <p key={j} style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontSize: 'clamp(1rem,1.4vw,1.15rem)', lineHeight: 1.85, color: 'var(--mist)', marginBottom: '1.25rem' }}>{p}</p>
                  ))}
                </section>
              ))}

              {/* Pull quote */}
              <blockquote style={{
                borderLeft: '2px solid var(--gold)',
                paddingLeft: 'clamp(2rem,4vw,3.5rem)',
                margin: 'clamp(3rem,6vw,6rem) 0',
              }}>
                <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1.2rem,2.5vw,2rem)', lineHeight: 1.45, letterSpacing: '-.01em', color: 'var(--ink)' }}>
                  {body.pullQuote}
                </p>
              </blockquote>

              {/* FAQ section */}
              {body.faqs.length > 0 && (
                <section style={{ marginTop: 'clamp(4rem,7vw,7rem)' }}>
                  <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>Common questions</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {body.faqs.map((faq, i) => (
                      <details key={i} style={{ borderTop: '1px solid var(--dust)', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
                        <summary style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(1rem,1.6vw,1.25rem)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                          {faq.q}
                          <span style={{ flexShrink: 0, width: 16, height: 16, color: 'var(--gold)', fontSize: '.75rem' }}>+</span>
                        </summary>
                        <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(.9rem,1.2vw,1.05rem)', color: 'var(--mist)', lineHeight: 1.75, marginTop: '1rem', maxWidth: '60ch' }}>{faq.a}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* CTA */}
              <div style={{ marginTop: 'clamp(5rem,8vw,8rem)', borderTop: '1px solid var(--dust)', paddingTop: 'clamp(3rem,5vw,5rem)', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>Ready to begin?</p>
                <h3 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(1.5rem,3vw,2.8rem)', lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: '1.5rem' }}>Tell us your story.</h3>
                <Link href="/contact" style={{ display: 'inline-block', fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1rem,1.4vw,1.15rem)', color: 'var(--gold)', borderBottom: '1px solid rgba(162,129,90,.3)', paddingBottom: '.2em', textDecoration: 'none' }}>
                  Begin a commission →
                </Link>
              </div>
            </div>
            <div /> {/* right spacer */}
          </div>
        </article>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <section style={{ padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)', borderTop: '1px solid var(--dust)' }}>
            <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'clamp(3rem,5vw,5rem)' }}>Continue reading</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,380px),1fr))', gap: 'clamp(3rem,5vw,5rem) clamp(2rem,4vw,4rem)' }}>
              {relatedArticles.map(a => (
                <Link key={a.slug} href={`/journal/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <article>
                    <div style={{ aspectRatio: '3/2', background: 'linear-gradient(135deg, #EDE5D8 0%, #D4C9B8 100%)', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                      <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: GRAIN, backgroundSize: '180px', opacity: .04, mixBlendMode: 'multiply' }} />
                    </div>
                    <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.54rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '.6rem' }}>{a.category}</p>
                    <h3 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(1.1rem,2vw,1.5rem)', lineHeight: 1.2, letterSpacing: '-.015em' }}>{a.title}</h3>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
