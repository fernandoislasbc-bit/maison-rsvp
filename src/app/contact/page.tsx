'use client';

import { useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

const BUDGET_OPTIONS = ['Under $3,000', '$3,000 – $6,000', '$6,000 – $12,000', '$12,000+', 'Not sure yet'];
const COLLECTION_OPTIONS = ['Prelude', 'Signature', 'Maison', 'Not sure — I need guidance'];
const CONTACT_OPTIONS = ['Email', 'Video call', 'Phone'];

export default function ContactPage() {
  const [sent,     setSent]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: '', lastName: '', partnerName: '',
    email: '', phone: '',
    eventDate: '', eventLocation: '', guestCount: '',
    budget: '', collection: '', experience: '',
    contactMethod: 'Email', message: '',
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Request failed');
      setSent(true);
    } catch {
      setSubmitError('Something went wrong. Please try again or write to us directly at commissions@maisonrsvp.com.');
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <>
        <Nav light />
        <main style={{
          minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)',
          background: `radial-gradient(ellipse 80% 70% at 50% 50%, #F2EBE0 0%, transparent 65%), var(--ivory)`,
        }}>
          <div>
            <div style={{ width: 30, height: 1, background: 'var(--gold)', opacity: .4, margin: '0 auto clamp(2rem,4vw,3rem)' }} />
            <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>Commission received</p>
            <h1 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(2.5rem,6vw,6rem)', lineHeight: .95, letterSpacing: '-.025em', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
              We have received<br />your enquiry.
            </h1>
            <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1rem,1.4vw,1.15rem)', color: 'var(--mist)', lineHeight: 1.75, maxWidth: '40ch', margin: '0 auto clamp(2.5rem,5vw,4rem)' }}>
              We respond to every enquiry personally, within two business days. Thank you for reaching out.
            </p>
            <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.95rem', color: 'var(--mist)' }}>commissions@maisonrsvp.com</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav light />

      <main style={{ background: 'var(--ivory)', color: 'var(--ink)' }}>
        {/* Header */}
        <section style={{
          padding: 'clamp(8rem,14vw,14rem) clamp(2rem,5vw,5rem) clamp(5rem,8vw,5rem)',
          position: 'relative', overflow: 'hidden',
          background: `radial-gradient(ellipse 70% 55% at 65% 35%, #EDE5D8 0%, transparent 55%), var(--ivory)`,
        }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .028, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '220px', mixBlendMode: 'multiply' }} />
          <nav aria-label="Breadcrumb" style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 .75rem' }}>·</span>
            <span style={{ color: 'var(--gold)' }}>Begin a Commission</span>
          </nav>
          <h1 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(3rem,7vw,8rem)', lineHeight: .92, letterSpacing: '-.03em', maxWidth: '12ch', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
            Begin the<br />conversation.
          </h1>
          <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1rem,1.4vw,1.2rem)', color: 'var(--mist)', maxWidth: '44ch', lineHeight: 1.75 }}>
            Tell us about your occasion. We respond to every enquiry personally, within two business days.
          </p>
        </section>

        {/* Form */}
        <section style={{ padding: 'clamp(5rem,8vw,8rem) clamp(2rem,5vw,5rem)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,460px),1fr))', gap: 'clamp(4rem,8vw,10rem)' }}>
          <form
            onSubmit={handleSubmit}
            aria-label="Commission enquiry form"
            style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(2rem,3.5vw,3rem)' }}
          >
            {/* Names */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,150px), 1fr))', gap: '1.5rem' }}>
              <Field label="Your first name" required>
                <Input value={form.firstName} onChange={set('firstName')} placeholder="Emma" required />
              </Field>
              <Field label="Your last name" required>
                <Input value={form.lastName} onChange={set('lastName')} placeholder="Bennett" required />
              </Field>
            </div>

            <Field label="Partner's name">
              <Input value={form.partnerName} onChange={set('partnerName')} placeholder="Alexander Whitmore" />
            </Field>

            {/* Contact */}
            <Field label="Email address" required>
              <Input type="email" value={form.email} onChange={set('email')} placeholder="emma@example.com" required />
            </Field>
            <Field label="Phone number">
              <Input type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 604 555 0100" />
            </Field>

            {/* Event details */}
            <Field label="Event date (approximate is fine)">
              <Input value={form.eventDate} onChange={set('eventDate')} placeholder="June 2026" />
            </Field>
            <Field label="Event location">
              <Input value={form.eventLocation} onChange={set('eventLocation')} placeholder="Lake Como, Italy" />
            </Field>
            <Field label="Estimated guest count">
              <Input value={form.guestCount} onChange={set('guestCount')} placeholder="80" />
            </Field>

            {/* Commission preferences */}
            <Field label="Budget range">
              <Select value={form.budget} onChange={set('budget')}>
                <option value="">Select a range</option>
                {BUDGET_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </Select>
            </Field>

            <Field label="Collection of interest">
              <Select value={form.collection} onChange={set('collection')}>
                <option value="">Select a collection</option>
                {COLLECTION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </Select>
            </Field>

            <Field label="Tell us about your occasion">
              <textarea
                value={form.message}
                onChange={set('message')}
                rows={5}
                placeholder="Tell us about your event, your aesthetic, what matters to you. The more you share, the better we can advise."
                style={{
                  width: '100%', padding: '1rem 0',
                  fontFamily: 'var(--font-garamond), Georgia, serif',
                  fontStyle: 'italic', fontSize: '.95rem',
                  color: 'var(--ink)', background: 'transparent',
                  border: 'none', borderBottom: '1px solid var(--dust)',
                  resize: 'none', outline: 'none',
                  lineHeight: 1.75,
                  transition: 'border-color .3s',
                }}
                onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
                onBlur={e => (e.target.style.borderBottomColor = 'var(--dust)')}
              />
            </Field>

            <Field label="Preferred contact method">
              <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '.25rem' }}>
                {CONTACT_OPTIONS.map(o => (
                  <label key={o} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer' }}>
                    <input
                      type="radio" name="contactMethod" value={o}
                      checked={form.contactMethod === o}
                      onChange={set('contactMethod')}
                      style={{ accentColor: 'var(--gold)' }}
                    />
                    <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.62rem', letterSpacing: '.08em', color: 'var(--mist)' }}>{o}</span>
                  </label>
                ))}
              </div>
            </Field>

            {submitError && (
              <p style={{
                fontFamily: 'var(--font-garamond), Georgia, serif',
                fontStyle: 'italic', fontSize: '.9rem',
                color: '#DC2626', lineHeight: 1.6,
              }}>
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                alignSelf: 'flex-start',
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
              onMouseEnter={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)' }}
              onMouseLeave={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.background = 'var(--ink)' }}
            >
              {submitting ? 'Sending…' : 'Send enquiry'}
            </button>
          </form>

          {/* Sidebar */}
          <aside style={{ paddingTop: 'clamp(1rem,2vw,2rem)' }}>
            <div style={{ borderTop: '1px solid var(--dust)', paddingTop: 'clamp(2rem,4vw,3.5rem)', marginBottom: 'clamp(3rem,5vw,5rem)' }}>
              <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.56rem', letterSpacing: '.32em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.2rem' }}>What to expect</p>
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
              <a href="mailto:commissions@maisonrsvp.com" style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.95rem', color: 'var(--gold)', textDecoration: 'none' }}>
                commissions@maisonrsvp.com
              </a>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.56rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)', display: 'block', marginBottom: '.6rem' }}>
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
        ...props.style,
      }}
      onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
      onBlur={e => (e.target.style.borderBottomColor = 'var(--dust)')}
    />
  );
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        {...props}
        style={{
          width: '100%', padding: '.75rem 2rem .75rem 0',
          fontFamily: 'var(--font-garamond), Georgia, serif',
          fontStyle: 'italic', fontSize: '.95rem',
          color: 'var(--ink)', background: 'transparent',
          border: 'none', borderBottom: '1px solid var(--dust)',
          outline: 'none', appearance: 'none',
          cursor: 'pointer',
          transition: 'border-color .3s',
        }}
        onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
        onBlur={e => (e.target.style.borderBottomColor = 'var(--dust)')}
      >
        {children}
      </select>
      {/* Custom dropdown chevron */}
      <svg
        aria-hidden
        width="10" height="6" viewBox="0 0 10 6"
        style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--mist)' }}
      >
        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
