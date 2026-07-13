'use client';

import { useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

const COLLECTIONS = ['Prelude', 'Signature', 'Maison', 'Not sure yet'];
const CONTACT_METHODS = ['Email', 'Video call', 'Phone'];

type Form = {
  firstName: string; lastName: string; partnerName: string;
  email: string; phone: string;
  eventDate: string; eventLocation: string; guestCount: string; message: string;
  collection: string; contactMethod: string;
};

const EMPTY: Form = {
  firstName: '', lastName: '', partnerName: '',
  email: '', phone: '',
  eventDate: '', eventLocation: '', guestCount: '', message: '',
  collection: '', contactMethod: 'Email',
};

export default function ContactPage() {
  const [step, setStep]           = useState(1);
  const [sent, setSent]           = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm]           = useState<Form>(EMPTY);

  const set = (k: keyof Form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm(f => ({ ...f, [k]: e.target.value }));

  const pick = (k: keyof Form, val: string) =>
    setForm(f => ({ ...f, [k]: val }));

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('failed');
      setSent(true);
    } catch {
      setSubmitError('Something went wrong. Please try again or write to us at concierge@maisonrsvp.ca.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Success ────────────────────────────────────────── */
  if (sent) {
    return (
      <>
        <Nav light />
        <main style={{
          minHeight: '100svh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', textAlign: 'center',
          padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)',
          background: `radial-gradient(ellipse 80% 70% at 50% 50%, #F2EBE0 0%, transparent 65%), var(--ivory)`,
        }}>
          <div>
            <div style={{ width: 30, height: 1, background: 'var(--gold)', opacity: .4, margin: '0 auto clamp(2rem,4vw,3rem)' }} />
            <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
              Commission received
            </p>
            <h1 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(2.5rem,6vw,6rem)', lineHeight: .95, letterSpacing: '-.025em', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
              We have received<br />your enquiry.
            </h1>
            <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1rem,1.4vw,1.15rem)', color: 'var(--mist)', lineHeight: 1.75, maxWidth: '40ch', margin: '0 auto clamp(2.5rem,5vw,4rem)' }}>
              We respond to every enquiry personally, within two business days.
            </p>
            <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.95rem', color: 'var(--mist)' }}>
              concierge@maisonrsvp.ca
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  /* ── Page ───────────────────────────────────────────── */
  return (
    <>
      <Nav light />
      <main style={{ background: 'var(--ivory)', color: 'var(--ink)' }}>

        {/* Header */}
        <section style={{
          padding: 'clamp(8rem,14vw,14rem) clamp(2rem,5vw,5rem) clamp(4rem,6vw,5rem)',
          background: `radial-gradient(ellipse 70% 55% at 65% 35%, #EDE5D8 0%, transparent 55%), var(--ivory)`,
          position: 'relative', overflow: 'hidden',
        }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .028, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '220px', mixBlendMode: 'multiply' }} />
          <nav aria-label="Breadcrumb" style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 .75rem' }}>·</span>
            <span style={{ color: 'var(--gold)' }}>Begin a Commission</span>
          </nav>
          <h1 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(2.8rem,6vw,7rem)', lineHeight: .92, letterSpacing: '-.03em', maxWidth: '14ch', marginBottom: 'clamp(1.5rem,3vw,2rem)' }}>
            Begin the<br />conversation.
          </h1>
          <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1rem,1.3vw,1.15rem)', color: 'var(--mist)', maxWidth: '46ch', lineHeight: 1.75 }}>
            Tell us about your occasion. We respond to every enquiry personally, within two business days.
          </p>
        </section>

        {/* Form + Sidebar */}
        <section style={{
          padding: 'clamp(4rem,7vw,7rem) clamp(2rem,5vw,5rem)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
          gap: 'clamp(4rem,8vw,10rem)',
          alignItems: 'start',
        }}>

          {/* ── Multi-step form ───────────────────────── */}
          <div>
            {/* Step indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: 'clamp(2.5rem,4vw,3.5rem)' }}>
              {[1, 2, 3].map(n => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button
                    onClick={() => n < step && setStep(n)}
                    style={{
                      width: 28, height: 28, borderRadius: '50%',
                      border: `1px solid ${n === step ? 'var(--gold)' : n < step ? 'var(--gold)' : 'var(--dust)'}`,
                      background: n < step ? 'var(--gold)' : 'transparent',
                      color: n < step ? 'var(--ivory)' : n === step ? 'var(--gold)' : 'var(--dust)',
                      fontFamily: 'var(--font-manrope), sans-serif',
                      fontSize: '.52rem', letterSpacing: '.08em',
                      cursor: n < step ? 'pointer' : 'default',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all .3s', flexShrink: 0,
                    }}
                  >
                    {n < step ? (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ) : n}
                  </button>
                  {n < 3 && (
                    <div style={{ width: 32, height: 1, background: n < step ? 'var(--gold)' : 'var(--dust)', opacity: n < step ? .6 : .3, transition: 'all .4s' }} />
                  )}
                </div>
              ))}
              <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.52rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--mist)', opacity: .6, marginLeft: '.5rem' }}>
                {step === 1 ? 'You' : step === 2 ? 'Your occasion' : 'How we connect'}
              </span>
            </div>

            {/* ── Step 1: You ── */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', animation: 'fadeSlide .35s ease both' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
                  <Field label="First name" required htmlFor="firstName">
                    <Input id="firstName" name="firstName" autoComplete="given-name" autoFocus value={form.firstName} onChange={set('firstName')} placeholder="Emma" required />
                  </Field>
                  <Field label="Last name" required htmlFor="lastName">
                    <Input id="lastName" name="lastName" autoComplete="family-name" value={form.lastName} onChange={set('lastName')} placeholder="Bennett" required />
                  </Field>
                </div>
                <Field label="Email address" required htmlFor="email">
                  <Input id="email" name="email" autoComplete="email" type="email" value={form.email} onChange={set('email')} placeholder="emma@example.com" required />
                </Field>
                <Field label="Partner's name" htmlFor="partnerName">
                  <Input id="partnerName" name="partnerName" value={form.partnerName} onChange={set('partnerName')} placeholder="Alexander Whitmore (optional)" />
                </Field>
                <StepNav
                  onNext={() => setStep(2)}
                  nextDisabled={!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()}
                />
              </div>
            )}

            {/* ── Step 2: Occasion ── */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', animation: 'fadeSlide .35s ease both' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
                  <Field label="Event date" htmlFor="eventDate">
                    <Input id="eventDate" name="eventDate" value={form.eventDate} onChange={set('eventDate')} placeholder="June 2026" />
                  </Field>
                  <Field label="Guest count" htmlFor="guestCount">
                    <Input id="guestCount" name="guestCount" inputMode="numeric" value={form.guestCount} onChange={set('guestCount')} placeholder="80" />
                  </Field>
                </div>
                <Field label="Location" htmlFor="eventLocation">
                  <Input id="eventLocation" name="eventLocation" value={form.eventLocation} onChange={set('eventLocation')} placeholder="Lake Como, Italy" />
                </Field>
                <Field label="Tell us about your occasion" htmlFor="message">
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={set('message')}
                    rows={5}
                    placeholder="Tell us about your event, your aesthetic, what matters most. The more you share, the better we can advise."
                    style={{
                      width: '100%', padding: '1rem 0',
                      fontFamily: 'var(--font-garamond), Georgia, serif',
                      fontStyle: 'italic', fontSize: '.95rem',
                      color: 'var(--ink)', background: 'transparent',
                      border: 'none', borderBottom: '1px solid var(--dust)',
                      resize: 'none', outline: 'none', lineHeight: 1.75,
                      transition: 'border-color .3s',
                    }}
                    onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
                    onBlur={e => (e.target.style.borderBottomColor = 'var(--dust)')}
                  />
                </Field>
                <StepNav onBack={() => setStep(1)} onNext={() => setStep(3)} />
              </div>
            )}

            {/* ── Step 3: Connect ── */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', animation: 'fadeSlide .35s ease both' }}>
                <Field label="Collection of interest">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem', paddingTop: '.5rem' }}>
                    {COLLECTIONS.map(c => (
                      <PillButton key={c} active={form.collection === c} onClick={() => pick('collection', c)}>
                        {c}
                      </PillButton>
                    ))}
                  </div>
                </Field>

                <Field label="How would you prefer we reach you?">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem', paddingTop: '.5rem' }}>
                    {CONTACT_METHODS.map(m => (
                      <PillButton key={m} active={form.contactMethod === m} onClick={() => pick('contactMethod', m)}>
                        {m}
                      </PillButton>
                    ))}
                  </div>
                </Field>

                {(form.contactMethod === 'Phone' || form.contactMethod === 'Video call') && (
                  <Field label="Phone number" htmlFor="phone">
                    <Input id="phone" name="phone" autoComplete="tel" type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 604 555 0100" />
                  </Field>
                )}

                {submitError && (
                  <p role="alert" style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.9rem', color: '#DC2626', lineHeight: 1.6 }}>
                    {submitError}
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <button
                    onClick={() => setStep(2)}
                    style={{
                      fontFamily: 'var(--font-manrope), sans-serif',
                      fontSize: '.55rem', letterSpacing: '.22em', textTransform: 'uppercase',
                      color: 'var(--mist)', background: 'none', border: 'none',
                      cursor: 'pointer', padding: '0',
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{
                      fontFamily: 'var(--font-manrope), sans-serif',
                      fontSize: '.6rem', fontWeight: 400,
                      letterSpacing: '.3em', textTransform: 'uppercase',
                      color: 'var(--ivory)',
                      background: submitting ? 'var(--mist)' : 'var(--ink)',
                      border: 'none', padding: '1.1em 2.8em',
                      cursor: submitting ? 'default' : 'pointer',
                      transition: 'background .3s',
                      opacity: submitting ? 0.7 : 1,
                    }}
                    onMouseEnter={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)'; }}
                    onMouseLeave={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.background = 'var(--ink)'; }}
                  >
                    {submitting ? 'Sending…' : 'Send enquiry'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ───────────────────────────────── */}
          <aside style={{ paddingTop: 'clamp(1rem,2vw,2rem)' }}>
            <div style={{ borderTop: '1px solid var(--dust)', paddingTop: 'clamp(2rem,4vw,3.5rem)', marginBottom: 'clamp(3rem,5vw,5rem)' }}>
              <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.56rem', letterSpacing: '.32em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>What to expect</p>
              {[
                { step: '01', text: 'We review your enquiry personally within 2 business days.' },
                { step: '02', text: 'We respond with an initial creative assessment and suggested collection.' },
                { step: '03', text: 'If there is a fit, we schedule a discovery conversation.' },
                { step: '04', text: 'You decide whether to commission. There is no pressure.' },
              ].map(s => (
                <div key={s.step} style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.56rem', letterSpacing: '.25em', color: 'rgba(162,129,90,.5)', flexShrink: 0, paddingTop: '.2em' }}>{s.step}</span>
                  <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.92rem', color: 'var(--mist)', lineHeight: 1.7 }}>{s.text}</p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--dust)', paddingTop: 'clamp(2rem,4vw,3.5rem)' }}>
              <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.56rem', letterSpacing: '.32em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.2rem' }}>Availability</p>
              <p style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(1.4rem,2.5vw,2rem)', marginBottom: '.5rem' }}>Three remain.</p>
              <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.9rem', color: 'var(--mist)', lineHeight: 1.7 }}>We accept a limited number of commissions each season. This is not a marketing device. It is how we maintain our standard.</p>
            </div>

            <div style={{ marginTop: 'clamp(2.5rem,4vw,4rem)', borderTop: '1px solid var(--dust)', paddingTop: 'clamp(2rem,4vw,3.5rem)' }}>
              <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.88rem', color: 'var(--mist)', lineHeight: 1.7, marginBottom: '1rem' }}>You may also reach us directly:</p>
              <a href="mailto:concierge@maisonrsvp.ca" style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.95rem', color: 'var(--gold)', textDecoration: 'none' }}>
                concierge@maisonrsvp.ca
              </a>
            </div>
          </aside>

        </section>
      </main>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Footer />
    </>
  );
}

/* ── Sub-components ──────────────────────────────────── */

function Field({ label, children, required, htmlFor }: { label: string; children: React.ReactNode; required?: boolean; htmlFor?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.56rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)', display: 'block', marginBottom: '.6rem' }}>
        {label}{required && <span style={{ color: 'var(--gold)', marginLeft: '.3em' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: '100%', padding: '.75rem 0',
        fontFamily: 'var(--font-garamond), Georgia, serif',
        fontStyle: 'italic', fontSize: '.95rem',
        color: 'var(--ink)', background: 'transparent',
        border: 'none', borderBottom: '1px solid var(--dust)',
        outline: 'none', transition: 'border-color .3s',
      }}
      onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
      onBlur={e => (e.target.style.borderBottomColor = 'var(--dust)')}
    />
  );
}

function PillButton({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-manrope), sans-serif',
        fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase',
        color: active ? 'var(--ivory)' : 'var(--mist)',
        background: active ? 'var(--ink)' : 'transparent',
        border: `1px solid ${active ? 'var(--ink)' : 'var(--dust)'}`,
        padding: '.65em 1.4em',
        cursor: 'pointer',
        transition: 'all .2s',
      }}
      onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--gold)'; } }}
      onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--dust)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--mist)'; } }}
    >
      {children}
    </button>
  );
}

function StepNav({ onBack, onNext, nextDisabled }: { onBack?: () => void; onNext: () => void; nextDisabled?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingTop: '.5rem' }}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '.55rem', letterSpacing: '.22em', textTransform: 'uppercase',
            color: 'var(--mist)', background: 'none', border: 'none',
            cursor: 'pointer', padding: '0',
          }}
        >
          ← Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase',
          color: 'var(--ivory)',
          background: nextDisabled ? 'var(--dust)' : 'var(--ink)',
          border: 'none', padding: '1.1em 2.8em',
          cursor: nextDisabled ? 'default' : 'pointer',
          transition: 'background .3s',
        }}
        onMouseEnter={e => { if (!nextDisabled) (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)'; }}
        onMouseLeave={e => { if (!nextDisabled) (e.currentTarget as HTMLButtonElement).style.background = 'var(--ink)'; }}
      >
        Continue →
      </button>
    </div>
  );
}
