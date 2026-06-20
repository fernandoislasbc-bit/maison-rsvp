'use client';

import { useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { ARTICLES, CATEGORIES, type Article } from '@/lib/journal';

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function JournalPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const featured = ARTICLES.find(a => a.featured);
  const gridArticles = activeCategory === 'all'
    ? ARTICLES.filter(a => !a.featured)
    : ARTICLES.filter(a => a.categorySlug === activeCategory);

  return (
    <>
      <Nav light />

      <main style={{ background: 'var(--ivory)', color: 'var(--ink)' }}>
        {/* Hero */}
        <section style={{
          padding: 'clamp(8rem,14vw,14rem) clamp(2rem,5vw,5rem) clamp(5rem,8vw,6rem)',
          position: 'relative', overflow: 'hidden',
          background: `radial-gradient(ellipse 70% 55% at 65% 35%, #EDE5D8 0%, transparent 55%), var(--ivory)`,
        }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .028, backgroundImage: GRAIN, backgroundSize: '220px', mixBlendMode: 'multiply' }} />
          <nav aria-label="Breadcrumb" style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 .75rem' }}>·</span>
            <span style={{ color: 'var(--gold)' }}>Journal</span>
          </nav>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,480px),1fr))', gap: 'clamp(3rem,6vw,8rem)', alignItems: 'end' }}>
            <h1 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(3.5rem,9vw,10rem)', lineHeight: .92, letterSpacing: '-.03em' }}>
              The<br />
              <em style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', color: 'var(--gold)' }}>Journal.</em>
            </h1>
            <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1rem,1.4vw,1.2rem)', color: 'var(--mist)', lineHeight: 1.8, maxWidth: '42ch' }}>
              Notes on luxury weddings, destination events, invitation design, and the craft of creating experiences that endure.
            </p>
          </div>
        </section>

        {/* Featured article */}
        {featured && activeCategory === 'all' && (
          <section style={{ padding: '0 clamp(2rem,5vw,5rem) clamp(6rem,10vw,10rem)' }}>
            <Link
              href={`/journal/${featured.slug}`}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,480px),1fr))', gap: 0, textDecoration: 'none', color: 'inherit', borderTop: '1px solid var(--dust)' }}
            >
              <div style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg, #EDE5D8 0%, #D4C9B8 100%)', position: 'relative', overflow: 'hidden', minHeight: 320 }}>
                <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: GRAIN, backgroundSize: '180px', opacity: .04, mixBlendMode: 'multiply' }} />
                <div style={{ position: 'absolute', bottom: 'clamp(1.5rem,3vw,2.5rem)', left: 'clamp(1.5rem,3vw,2.5rem)' }}>
                  <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.56rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--gold)', background: 'rgba(248,245,240,.9)', padding: '.35em .85em' }}>Featured</span>
                </div>
              </div>
              <div style={{ padding: 'clamp(3rem,5vw,5rem)', background: `radial-gradient(ellipse 70% 50% at 20% 80%, #F0E9DE 0%, transparent 55%), var(--ivory)`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.56rem', letterSpacing: '.35em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>{featured.category}</p>
                  <h2 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(1.6rem,3.5vw,3rem)', lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: '1.5rem' }}>{featured.title}</h2>
                  <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(.95rem,1.3vw,1.1rem)', color: 'var(--mist)', lineHeight: 1.75, maxWidth: '44ch', marginBottom: 'clamp(2.5rem,4vw,3.5rem)' }}>{featured.excerpt}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)' }}>{featured.readTime}</p>
                  <span style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.95rem', color: 'var(--gold)', borderBottom: '1px solid rgba(162,129,90,.3)', paddingBottom: '.15em' }}>Read →</span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Category filter */}
        <section style={{ padding: '0 clamp(2rem,5vw,5rem)', borderTop: '1px solid var(--dust)', borderBottom: '1px solid var(--dust)', marginBottom: 'clamp(4rem,7vw,7rem)' }}>
          <div style={{ display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {[{ slug: 'all', label: 'All' }, ...CATEGORIES].map(cat => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '.56rem', letterSpacing: '.3em', textTransform: 'uppercase',
                  padding: '1.25rem 1.5rem',
                  background: 'transparent', border: 'none',
                  borderBottom: activeCategory === cat.slug ? '2px solid var(--gold)' : '2px solid transparent',
                  color: activeCategory === cat.slug ? 'var(--gold)' : 'var(--mist)',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'color .3s, border-color .3s',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Article grid */}
        <section style={{ padding: '0 clamp(2rem,5vw,5rem) clamp(6rem,10vw,10rem)' }}>
          {gridArticles.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--mist)', textAlign: 'center', padding: 'clamp(4rem,8vw,8rem) 0' }}>
              No articles in this category yet. More coming soon.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,360px),1fr))', gap: 'clamp(3rem,5vw,5rem) clamp(2rem,4vw,4rem)' }}>
              {gridArticles.map(article => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section style={{ background: 'var(--deep)', color: 'var(--ivory)', padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .055, zIndex: 0, backgroundImage: GRAIN, backgroundSize: '200px', mixBlendMode: 'screen' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'rgba(201,168,130,.5)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>Begin a commission</p>
            <h2 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(2.5rem,6vw,6.5rem)', lineHeight: .95, letterSpacing: '-.025em', marginBottom: 'clamp(2.5rem,5vw,4rem)', color: 'var(--ivory)' }}>
              Ready to tell<br />your story?
            </h2>
            <Link href="/contact" style={{ display: 'inline-block', fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1rem,1.5vw,1.25rem)', color: 'var(--gold)', borderBottom: '1px solid rgba(162,129,90,.3)', paddingBottom: '.2em', textDecoration: 'none' }}>
              Begin a commission →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/journal/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <article>
        <div style={{ aspectRatio: '3/2', background: 'linear-gradient(135deg, #EDE5D8 0%, #D4C9B8 100%)', marginBottom: '1.75rem', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: GRAIN, backgroundSize: '180px', opacity: .04, mixBlendMode: 'multiply' }} />
        </div>
        <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.54rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '.75rem' }}>{article.category}</p>
        <h3 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(1.1rem,2vw,1.5rem)', lineHeight: 1.2, letterSpacing: '-.015em', marginBottom: '.75rem' }}>{article.title}</h3>
        <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.9rem', color: 'var(--mist)', lineHeight: 1.7, marginBottom: '1.25rem' }}>{article.excerpt}</p>
        <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.54rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(181,175,165,.6)' }}>{article.readTime}</p>
      </article>
    </Link>
  );
}
