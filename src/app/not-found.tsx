import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function NotFound() {
  return (
    <>
      <Nav light />
      <main style={{
        minHeight: '100svh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)',
        position: 'relative', overflow: 'hidden',
        background: `radial-gradient(ellipse 70% 60% at 50% 45%, #F2EBE0 0%, transparent 65%), var(--ivory)`,
      }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .028, backgroundImage: GRAIN, backgroundSize: '220px', mixBlendMode: 'multiply' }} />

        {/* Ghost numeral */}
        <span aria-hidden style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          fontFamily: 'var(--font-prata), Georgia, serif',
          fontSize: 'clamp(16rem,40vw,38rem)', lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(162,129,90,.07)',
          whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none',
        }}>
          404
        </span>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ width: 30, height: 1, background: 'var(--gold)', opacity: .4, margin: '0 auto clamp(2rem,4vw,3rem)' }} />
          <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
            Page not found
          </p>
          <h1 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(2.4rem,6vw,6rem)', lineHeight: .98, letterSpacing: '-.025em', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
            This invitation<br />
            <em style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', color: 'var(--gold)' }}>was never sent.</em>
          </h1>
          <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(.95rem,1.4vw,1.15rem)', color: 'var(--mist)', lineHeight: 1.75, maxWidth: '38ch', margin: '0 auto clamp(2.5rem,5vw,4rem)' }}>
            The page you are looking for does not exist — or it was created for someone else entirely.
          </p>
          <Link href="/" style={{
            display: 'inline-block',
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontStyle: 'italic', fontSize: 'clamp(1rem,1.4vw,1.2rem)',
            color: 'var(--gold)',
            borderBottom: '1px solid rgba(162,129,90,.3)', paddingBottom: '.2em',
            textDecoration: 'none',
          }}>
            Return to the beginning →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
