'use client';

const TESTIMONIALS = [
  {
    name: 'Beatrice & Théo',
    location: 'Lake Como, Italy',
    year: '2025',
    body: 'The suite arrived and our families simply could not speak. Three minutes of silence around an iPhone screen. That has never happened before.',
  },
  {
    name: 'Priya & James',
    location: 'Maldives',
    year: '2025',
    body: 'We had been so nervous about a digital invitation. Then we saw what Maison created. We were not nervous anymore.',
  },
  {
    name: 'Sofia & Alejandro',
    location: 'Santorini, Greece',
    year: '2024',
    body: 'Every detail was considered before we thought to ask. Less like a service and more like a collaboration with someone who cared as much as we did.',
  },
  {
    name: 'Charlotte & William',
    location: 'Cape Town, South Africa',
    year: '2025',
    body: 'Our guests still talk about the invitation. Not the wedding — the invitation.',
  },
  {
    name: 'Isabelle & Marco',
    location: 'Côte d\'Azur, France',
    year: '2024',
    body: 'The level of craft was unlike anything I have seen — and I have worked in luxury fashion for fifteen years.',
  },
  {
    name: 'Yuki & Liam',
    location: 'Kyoto, Japan',
    year: '2025',
    body: 'We asked for something that felt like us. They gave us something better than we could have imagined.',
  },
  {
    name: 'Elena & Nikolai',
    location: 'Amalfi Coast, Italy',
    year: '2024',
    body: 'The response from our guests was extraordinary. People who never reply to invitations replied within the hour.',
  },
  {
    name: 'Ana & Carlos',
    location: 'Mexico City, Mexico',
    year: '2025',
    body: 'I did not know an invitation could move people to tears. Ours did.',
  },
  {
    name: 'Margot & Henri',
    location: 'Paris, France',
    year: '2025',
    body: 'Nothing about this felt like a product. It felt like a gift — which is exactly what we wanted our guests to experience.',
  },
  {
    name: 'Linh & Sebastian',
    location: 'Vienna, Austria',
    year: '2024',
    body: 'We had used other studios before. There is simply no comparison. Maison operates at a different level entirely.',
  },
];

function TestimonialCard({ name, location, year, body }: typeof TESTIMONIALS[0]) {
  const initials = name.split(' & ').map(n => n[0]).join('·');
  return (
    <div style={{
      width: 'clamp(200px, 22vw, 260px)',
      flexShrink: 0,
      padding: '1.5rem',
      background: 'rgba(248,245,240,.06)',
      border: '1px solid rgba(201,168,130,.12)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      marginBottom: '0.75rem',
    }}>
      {/* Initials + meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '.85rem' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '1px solid rgba(201,168,130,.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontSize: '.7rem', letterSpacing: '.04em',
            color: 'rgba(201,168,130,.75)',
          }}>{initials}</span>
        </div>
        <div>
          <p style={{
            fontFamily: 'var(--font-prata), Georgia, serif',
            fontSize: '.82rem',
            color: 'rgba(248,245,240,.9)',
            lineHeight: 1.2,
          }}>{name}</p>
          <p style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.48rem', letterSpacing: '.2em', textTransform: 'uppercase',
            color: 'rgba(201,168,130,.55)',
            marginTop: '.2rem',
          }}>{location} · {year}</p>
        </div>
      </div>
      {/* Quote */}
      <blockquote style={{
        fontFamily: 'var(--font-garamond), Georgia, serif',
        fontStyle: 'italic',
        fontSize: '.88rem',
        color: 'rgba(248,245,240,.55)',
        lineHeight: 1.7,
        margin: 0,
      }}>
        "{body}"
      </blockquote>
    </div>
  );
}

function MarqueeColumn({ reverse = false }: { reverse?: boolean }) {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
      animation: reverse
        ? 'maison-marquee-down 38s linear infinite'
        : 'maison-marquee-up 38s linear infinite',
      willChange: 'transform',
    }}
    onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
    onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
    >
      {doubled.map((t, i) => (
        <TestimonialCard key={i} {...t} />
      ))}
    </div>
  );
}

export function TestimonialsMarquee() {
  return (
    <section
      aria-label="Client testimonials"
      style={{
        background: 'var(--deep)',
        padding: 'clamp(5rem,9vw,8rem) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes maison-marquee-up {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        @keyframes maison-marquee-down {
          from { transform: translateY(-50%); }
          to   { transform: translateY(0); }
        }
      `}</style>

      {/* Section header */}
      <div style={{
        textAlign: 'center',
        padding: '0 clamp(2rem,5vw,5rem)',
        marginBottom: 'clamp(3rem,5vw,4rem)',
        position: 'relative', zIndex: 2,
      }}>
        <div style={{ width: 30, height: 1, background: 'var(--gold)', opacity: .35, margin: '0 auto clamp(1.5rem,3vw,2rem)' }} />
        <p style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '.56rem', letterSpacing: '.4em', textTransform: 'uppercase',
          color: 'var(--gold)', opacity: .75,
          marginBottom: 'clamp(1.2rem,2vw,1.5rem)',
        }}>
          In their words
        </p>
        <h2 style={{
          fontFamily: 'var(--font-prata), Georgia, serif',
          fontSize: 'clamp(2rem,4.5vw,4.5rem)',
          lineHeight: .95, letterSpacing: '-.025em',
          color: 'var(--ivory)',
          marginBottom: 'clamp(1rem,2vw,1.5rem)',
        }}>
          The couples know best.
        </h2>
        <p style={{
          fontFamily: 'var(--font-garamond), Georgia, serif',
          fontStyle: 'italic',
          fontSize: 'clamp(.9rem,1.2vw,1.1rem)',
          color: 'rgba(248,245,240,.4)',
          maxWidth: '44ch', margin: '0 auto',
          lineHeight: 1.75,
        }}>
          Every commission is private by design. These are the words couples have shared with us — and permitted us to share with you.
        </p>
      </div>

      {/* 3D marquee stage */}
      <div style={{
        position: 'relative',
        height: 'clamp(360px, 50vh, 520px)',
        overflow: 'hidden',
        perspective: '400px',
      }}>
        {/* Columns wrapper with 3D tilt */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '0.75rem',
          alignItems: 'flex-start',
          position: 'absolute',
          top: 0, left: '50%',
          transform: 'translateX(-50%) translateY(-20px) translateZ(-80px) rotateX(18deg) rotateY(-6deg) rotateZ(8deg)',
          transformOrigin: 'center center',
        }}>
          <MarqueeColumn />
          <MarqueeColumn reverse />
          <MarqueeColumn />
          <MarqueeColumn reverse />
        </div>

        {/* Edge fades */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
          background: 'linear-gradient(to bottom, var(--deep) 0%, transparent 22%, transparent 78%, var(--deep) 100%)',
        }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
          background: 'linear-gradient(to right, var(--deep) 0%, transparent 15%, transparent 85%, var(--deep) 100%)',
        }} />
      </div>

      {/* Bottom note */}
      <p style={{
        fontFamily: 'var(--font-garamond), Georgia, serif',
        fontStyle: 'italic',
        fontSize: '.82rem',
        color: 'rgba(248,245,240,.2)',
        textAlign: 'center',
        marginTop: 'clamp(2rem,4vw,3rem)',
        letterSpacing: '.02em',
      }}>
        Shared with permission. Names and locations reflect real commissions.
      </p>
    </section>
  );
}
