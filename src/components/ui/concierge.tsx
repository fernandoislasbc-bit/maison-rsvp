'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

/* ─────────────────────────────────────────────────────────────
   The Concierge — a guided quote composer.
   Scripted flow (no external AI): occasion → guests → date →
   location → collection recommendation → enquiry via /api/contact.
   ───────────────────────────────────────────────────────────── */

const GOLD  = '#A2815A';
const IVORY = '#F8F5F0';

type Tier = {
  name: string; roman: string; tagline: string;
  timeline: string; ideal: string; features: string[];
};

const TIERS: Record<string, Tier> = {
  Prelude: {
    name: 'Prelude', roman: 'I', tagline: 'The perfect introduction.',
    timeline: '3–4 weeks', ideal: 'Intimate weddings & milestone celebrations',
    features: ['Custom digital invitation experience', 'RSVP & guest dashboard', 'Password protected', '60-day hosting included'],
  },
  Signature: {
    name: 'Signature', roman: 'II', tagline: 'Your story, fully told.',
    timeline: '6–8 weeks', ideal: 'Destination weddings & luxury celebrations',
    features: ['Full bespoke design & narrative', 'Cinematic motion & sound', 'Advanced RSVP with meal preferences', 'Unlimited revisions · 12-month hosting'],
  },
  Maison: {
    name: 'Maison', roman: 'III', tagline: 'The most complete experience we create.',
    timeline: '10–16 weeks', ideal: 'Ultra-luxury weddings, estates & brand events',
    features: ['Complete creative direction', 'Custom visual identity', 'Concierge RSVP management', 'White-glove launch · 24-month hosting'],
  },
};

type Quote = {
  occasion: string; guests: string; eventDate: string; eventLocation: string;
  tier: keyof typeof TIERS;
};

type Msg =
  | { from: 'bot' | 'user'; kind: 'text'; text: string }
  | { from: 'bot'; kind: 'card'; tier: Tier };

type Step =
  | 'intro' | 'occasion' | 'guests' | 'date' | 'location'
  | 'recommend' | 'name' | 'email' | 'notes' | 'sending' | 'done' | 'failed';

function recommend(occasion: string, guests: string): keyof typeof TIERS {
  if (guests === '300+ guests' || occasion === 'A brand or corporate event') return 'Maison';
  if (occasion === 'A destination wedding' || guests === '100–300 guests') return 'Signature';
  return 'Prelude';
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const CSS = `
  .mc-launch {
    position: fixed; right: clamp(1rem,3vw,1.75rem); bottom: clamp(1rem,3vw,1.75rem);
    z-index: 1400; width: 60px; height: 60px; border-radius: 50%;
    background: linear-gradient(145deg,#1A1208 0%,#0E0D0B 100%);
    border: 1px solid rgba(162,129,90,.45); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 16px 40px -10px rgba(14,13,11,.6), 0 0 0 0 rgba(162,129,90,.35);
    transition: transform .25s ease, box-shadow .25s ease;
    animation: mc-in .8s .8s cubic-bezier(.16,1,.3,1) both;
  }
  .mc-launch:hover { transform: translateY(-2px); box-shadow: 0 20px 44px -10px rgba(14,13,11,.7), 0 0 0 6px rgba(162,129,90,.12); }
  .mc-launch:focus-visible { outline: 2px solid ${GOLD}; outline-offset: 3px; }
  @keyframes mc-in { from { opacity: 0; transform: translateY(16px) scale(.9); } to { opacity: 1; transform: none; } }

  .mc-panel {
    position: fixed; z-index: 1401;
    right: clamp(1rem,3vw,1.75rem); bottom: clamp(1rem,3vw,1.75rem);
    width: min(392px, calc(100vw - 2rem));
    height: min(620px, calc(100dvh - 7rem));
    display: flex; flex-direction: column;
    background: linear-gradient(160deg,#171009 0%,#0E0D0B 70%);
    border: 1px solid rgba(162,129,90,.22);
    border-radius: 18px; overflow: hidden;
    box-shadow: 0 48px 90px -20px rgba(0,0,0,.75), inset 0 1px 0 rgba(162,129,90,.14);
    animation: mc-panel-in .45s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes mc-panel-in { from { opacity: 0; transform: translateY(24px) scale(.97); } to { opacity: 1; transform: none; } }
  @media (max-width: 640px) {
    .mc-panel {
      right: 0; left: 0; bottom: 0; width: 100%;
      height: min(82dvh, 640px);
      border-radius: 20px 20px 0 0;
    }
  }

  .mc-msgs { flex: 1; overflow-y: auto; padding: 1.25rem 1.15rem 1rem; display: flex; flex-direction: column; gap: .8rem; scrollbar-width: thin; scrollbar-color: rgba(162,129,90,.3) transparent; }
  .mc-bubble { animation: mc-msg .4s cubic-bezier(.16,1,.3,1) both; max-width: 88%; }
  @keyframes mc-msg { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

  .mc-pill {
    font-family: var(--font-manrope), sans-serif;
    font-size: .58rem; letter-spacing: .18em; text-transform: uppercase;
    color: rgba(248,245,240,.75); background: transparent;
    border: 1px solid rgba(162,129,90,.35); border-radius: 999px;
    padding: .8em 1.5em; min-height: 40px; cursor: pointer;
    transition: all .2s ease;
  }
  .mc-pill:hover, .mc-pill:focus-visible { border-color: ${GOLD}; color: ${GOLD}; background: rgba(162,129,90,.08); outline: none; }

  .mc-input {
    flex: 1; background: transparent; border: none; outline: none;
    border-bottom: 1px solid rgba(162,129,90,.3);
    font-family: var(--font-garamond), Georgia, serif; font-style: italic;
    font-size: 16px; color: ${IVORY}; padding: .55rem 0;
    transition: border-color .25s;
  }
  .mc-input:focus { border-bottom-color: ${GOLD}; }
  .mc-input::placeholder { color: rgba(248,245,240,.28); }

  .mc-send {
    background: none; border: 1px solid rgba(162,129,90,.4); border-radius: 50%;
    width: 40px; height: 40px; cursor: pointer; color: ${GOLD};
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    transition: all .2s ease;
  }
  .mc-send:hover, .mc-send:focus-visible { background: rgba(162,129,90,.12); outline: none; }

  .mc-dot { width: 5px; height: 5px; border-radius: 50%; background: ${GOLD}; opacity: .4; animation: mc-blink 1.1s infinite; }
  .mc-dot:nth-child(2) { animation-delay: .18s; }
  .mc-dot:nth-child(3) { animation-delay: .36s; }
  @keyframes mc-blink { 0%,100% { opacity: .25; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }

  @media (prefers-reduced-motion: reduce) {
    .mc-launch, .mc-panel, .mc-bubble { animation: none; }
    .mc-dot { animation: none; opacity: .7; }
  }
`;

export function Concierge() {
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState<Msg[]>([]);
  const [step, setStep]       = useState<Step>('intro');
  const [typing, setTyping]   = useState(false);
  const [input, setInput]     = useState('');
  const [quote, setQuote]     = useState<Quote>({ occasion: '', guests: '', eventDate: '', eventLocation: '', tier: 'Signature' });
  const [contact, setContact] = useState({ name: '', email: '', notes: '' });

  const listRef   = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const launchRef = useRef<HTMLButtonElement>(null);
  const timers    = useRef<ReturnType<typeof setTimeout>[]>([]);
  const started   = useRef(false);

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing, step]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const say = useCallback((text: string, after?: () => void, delay = 900) => {
    setTyping(true);
    timers.current.push(setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, { from: 'bot', kind: 'text', text }]);
      after?.();
    }, delay));
  }, []);

  const openPanel = () => {
    setOpen(true);
    if (!started.current) {
      started.current = true;
      say('Good day — welcome to Maison RSVP. I am the studio concierge.', () => {
        say('In a few brief questions I can compose a personal recommendation for your invitation, and place your enquiry directly with our studio. Shall we begin?', () => setStep('occasion'), 1100);
      }, 700);
    }
  };

  const close = () => { setOpen(false); launchRef.current?.focus(); };

  const userSays = (text: string) => setMsgs(m => [...m, { from: 'user', kind: 'text', text }]);

  const pickOccasion = (o: string) => {
    userSays(o); setStep('intro');
    setQuote(q => ({ ...q, occasion: o }));
    say('A beautiful occasion. And how many guests will you be inviting?', () => setStep('guests'));
  };

  const pickGuests = (g: string) => {
    userSays(g); setStep('intro');
    setQuote(q => ({ ...q, guests: g }));
    say('Noted. When is the celebration? A season or a date — whatever you have.', () => setStep('date'));
  };

  const submitText = () => {
    const v = input.trim();
    if (!v) return;
    setInput('');
    userSays(v);

    if (step === 'date') {
      setStep('intro');
      setQuote(q => ({ ...q, eventDate: v }));
      say('And where will it take place?', () => setStep('location'));
    } else if (step === 'location') {
      setStep('intro');
      const tier = recommend(quote.occasion, quote.guests);
      setQuote(q => ({ ...q, eventLocation: v, tier }));
      say('Thank you. One moment while I compose my recommendation…', () => {
        setTyping(true);
        timers.current.push(setTimeout(() => {
          setTyping(false);
          setMsgs(m => [...m, { from: 'bot', kind: 'card', tier: TIERS[tier] }]);
          say('Every commission is priced by consultation — your exact investment is discussed privately during your discovery call. May I have your name, so the studio can prepare for you?', () => setStep('name'), 1200);
        }, 1400));
      }, 1000);
    } else if (step === 'name') {
      setStep('intro');
      setContact(c => ({ ...c, name: v }));
      say(`A pleasure, ${v.split(' ')[0]}. And the best email address for our reply?`, () => setStep('email'));
    } else if (step === 'email') {
      if (!EMAIL_RE.test(v)) {
        say('That address does not look quite right — would you check it for me?', () => setStep('email'), 700);
        return;
      }
      setStep('intro');
      setContact(c => ({ ...c, email: v }));
      say('Lastly — anything you would like the studio to know? Your vision, your venue, your story. Or simply say "send it".', () => setStep('notes'));
    } else if (step === 'notes') {
      setStep('sending');
      const notes = /^send it\.?$/i.test(v) ? '' : v;
      setContact(c => ({ ...c, notes }));
      sendEnquiry(notes);
    }
  };

  const sendEnquiry = async (notes: string) => {
    say('Composing your enquiry…', undefined, 500);
    const [firstName, ...rest] = contact.name.trim().split(/\s+/);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName: rest.join(' ') || '—',
          email: contact.email,
          eventDate: quote.eventDate,
          eventLocation: quote.eventLocation,
          guestCount: quote.guests,
          collection: quote.tier,
          contactMethod: 'Email',
          message: `Composed with the site concierge.\nOccasion: ${quote.occasion}\nRecommended collection: ${quote.tier}${notes ? `\n\n${notes}` : ''}`,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      say('Your enquiry is with our studio. We reply personally within two business days — watch for a note from concierge@maisonrsvp.ca.', () => setStep('done'), 1200);
    } catch {
      say('Something interrupted the delivery. You may write to us directly at concierge@maisonrsvp.ca — or try once more.', () => setStep('failed'), 900);
    }
  };

  const showTextInput = ['date', 'location', 'name', 'email', 'notes'].includes(step);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {!open && (
        <button
          ref={launchRef}
          className="mc-launch"
          onClick={openPanel}
          aria-label="Open the concierge — compose your quote"
          aria-haspopup="dialog"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </button>
      )}

      {open && (
        <div className="mc-panel" role="dialog" aria-modal="false" aria-label="Maison RSVP concierge">
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.15rem', borderBottom: '1px solid rgba(162,129,90,.15)',
            background: 'rgba(162,129,90,.05)',
          }}>
            <div>
              <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.5rem', letterSpacing: '.35em', textTransform: 'uppercase', color: GOLD, marginBottom: '.25rem' }}>
                Maison RSVP
              </p>
              <p style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: '1rem', color: IVORY }}>
                The Concierge
              </p>
            </div>
            <button
              onClick={close}
              aria-label="Close concierge"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(248,245,240,.5)', padding: 8, minWidth: 40, minHeight: 40,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="mc-msgs" aria-live="polite">
            {msgs.map((m, i) => {
              if (m.kind === 'card') {
                return (
                  <div key={i} className="mc-bubble" style={{
                    maxWidth: '100%',
                    border: '1px solid rgba(162,129,90,.35)', borderRadius: 12,
                    padding: '1.15rem 1.2rem',
                    background: 'linear-gradient(160deg, rgba(162,129,90,.1) 0%, rgba(162,129,90,.03) 100%)',
                  }}>
                    <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.48rem', letterSpacing: '.3em', textTransform: 'uppercase', color: GOLD, marginBottom: '.5rem' }}>
                      Collection {m.tier.roman} — recommended for you
                    </p>
                    <p style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: '1.5rem', color: IVORY, marginBottom: '.2rem' }}>
                      {m.tier.name}
                    </p>
                    <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.85rem', color: 'rgba(248,245,240,.5)', marginBottom: '.9rem' }}>
                      {m.tier.tagline}
                    </p>
                    <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '.9rem' }}>
                      <div>
                        <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.45rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(248,245,240,.35)' }}>Timeline</p>
                        <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontSize: '.85rem', color: IVORY }}>{m.tier.timeline}</p>
                      </div>
                      <div>
                        <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.45rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(248,245,240,.35)' }}>Ideal for</p>
                        <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontSize: '.85rem', color: IVORY }}>{m.tier.ideal}</p>
                      </div>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 .9rem', display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
                      {m.tier.features.map(f => (
                        <li key={f} style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start', fontFamily: 'var(--font-garamond), Georgia, serif', fontSize: '.82rem', color: 'rgba(248,245,240,.6)', lineHeight: 1.5 }}>
                          <span style={{ color: GOLD, flexShrink: 0 }}>·</span>{f}
                        </li>
                      ))}
                    </ul>
                    <a href="/collection" style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.52rem', letterSpacing: '.22em', textTransform: 'uppercase', color: GOLD, textDecoration: 'none', borderBottom: '1px solid rgba(162,129,90,.35)', paddingBottom: '.25em' }}>
                      View the full collection →
                    </a>
                  </div>
                );
              }
              const mine = m.from === 'user';
              return (
                <div key={i} className="mc-bubble" style={{
                  alignSelf: mine ? 'flex-end' : 'flex-start',
                  background: mine ? 'rgba(162,129,90,.16)' : 'rgba(248,245,240,.04)',
                  border: `1px solid ${mine ? 'rgba(162,129,90,.3)' : 'rgba(248,245,240,.07)'}`,
                  borderRadius: mine ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  padding: '.7rem .95rem',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-garamond), Georgia, serif',
                    fontStyle: mine ? 'normal' : 'italic',
                    fontSize: '.92rem', lineHeight: 1.6,
                    color: mine ? IVORY : 'rgba(248,245,240,.85)',
                  }}>
                    {m.text}
                  </p>
                </div>
              );
            })}

            {typing && (
              <div className="mc-bubble" style={{ display: 'flex', gap: 4, padding: '.8rem .95rem', alignSelf: 'flex-start' }} aria-label="Concierge is typing">
                <span className="mc-dot" /><span className="mc-dot" /><span className="mc-dot" />
              </div>
            )}

            {/* Quick replies */}
            {step === 'occasion' && !typing && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', paddingTop: '.25rem' }}>
                {['A wedding', 'A destination wedding', 'A private celebration', 'A brand or corporate event'].map(o => (
                  <button key={o} className="mc-pill" onClick={() => pickOccasion(o)}>{o}</button>
                ))}
              </div>
            )}
            {step === 'guests' && !typing && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', paddingTop: '.25rem' }}>
                {['Under 100 guests', '100–300 guests', '300+ guests'].map(g => (
                  <button key={g} className="mc-pill" onClick={() => pickGuests(g)}>{g}</button>
                ))}
              </div>
            )}
            {step === 'done' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', paddingTop: '.25rem' }}>
                <a href="/work" className="mc-pill" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Browse the portfolio</a>
                <button className="mc-pill" onClick={close}>Close</button>
              </div>
            )}
            {step === 'failed' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', paddingTop: '.25rem' }}>
                <button className="mc-pill" onClick={() => { setStep('sending'); sendEnquiry(contact.notes); }}>Try again</button>
                <a href="mailto:concierge@maisonrsvp.ca" className="mc-pill" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Email us instead</a>
              </div>
            )}
          </div>

          {/* Input */}
          {showTextInput && (
            <div style={{
              display: 'flex', gap: '.75rem', alignItems: 'center',
              padding: '.85rem 1.15rem 1.05rem',
              borderTop: '1px solid rgba(162,129,90,.15)',
            }}>
              <input
                ref={inputRef}
                className="mc-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') submitText(); }}
                placeholder={
                  step === 'date'     ? 'June 2027, or “next autumn”…' :
                  step === 'location' ? 'Lake Como, Vancouver, a family estate…' :
                  step === 'name'     ? 'Your name…' :
                  step === 'email'    ? 'you@example.com' :
                  'Tell us anything — or “send it”'
                }
                type={step === 'email' ? 'email' : 'text'}
                autoComplete={step === 'email' ? 'email' : step === 'name' ? 'name' : 'off'}
                aria-label="Your reply"
                autoFocus
              />
              <button className="mc-send" onClick={submitText} aria-label="Send reply">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
