'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import { EDITION_TEMPLATES, OCCASIONS, EDITION_LIMITS, validateEdition, type Edition, type EditionTemplateId } from '@/lib/editions';
import { EditionTemplate } from '@/components/editions/templates';

const GOLD = '#A2815A';

const CSS = `
  .edm-layout { display: grid; grid-template-columns: 400px 1fr; min-height: 100svh; }
  .edm-preview { position: sticky; top: 0; height: 100svh; overflow-y: auto; border-left: 1px solid rgba(162,129,90,.15); }
  @media (max-width: 960px) {
    .edm-layout { grid-template-columns: 1fr; }
    .edm-preview { position: relative; height: auto; max-height: 70vh; border-left: none; border-top: 1px solid rgba(162,129,90,.15); }
  }
  .edm-input {
    width: 100%; padding: .65rem 0; background: transparent;
    border: none; border-bottom: 1px solid rgba(162,129,90,.35); outline: none;
    font-family: var(--font-garamond), Georgia, serif; font-style: italic;
    font-size: 16px; color: var(--ink); transition: border-color .25s;
  }
  .edm-input:focus { border-bottom-color: ${GOLD}; }
  .edm-label {
    font-family: var(--font-manrope), sans-serif;
    font-size: .55rem; letter-spacing: .28em; text-transform: uppercase;
    color: var(--mist); display: block; margin-bottom: .4rem;
  }
`;

function CreateEditor() {
  const params = useSearchParams();
  const initial = (params.get('template') as EditionTemplateId) || 'garden';

  const [data, setData] = useState<Edition>({
    t: EDITION_TEMPLATES.some(t => t.id === initial) ? initial : 'garden',
    n1: '', n2: '', o: OCCASIONS[0], d: '', h: '', v: '', c: '', m: '', e: '',
  });
  const [state, setState]   = useState<'editing' | 'sending' | 'done'>('editing');
  const [error, setError]   = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const set = (k: keyof Edition) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setData(d => ({ ...d, [k]: e.target.value }));

  const preview: Edition = {
    ...data,
    n1: data.n1 || 'Amelia',
    n2: data.n2,
    d:  data.d || 'Saturday, June 12th 2027',
    v:  data.v || 'The Orchard House',
    c:  data.c || 'Vancouver',
  };

  const compose = async () => {
    const problem = validateEdition(data);
    if (problem) { setError(problem); return; }
    setError(''); setState('sending');
    try {
      const res = await fetch('/api/editions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'failed');
      setShareUrl(`${window.location.origin}${j.url}`);
      setState('done');
    } catch (e) {
      setState('editing');
      setError(e instanceof Error && e.message !== 'failed' ? e.message : 'Something went wrong — please try again.');
    }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { /* noop */ }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="edm-layout" style={{ background: 'var(--ivory)', paddingTop: 76 }}>

        {/* ── Left: form ── */}
        <div style={{ padding: 'clamp(1.5rem,3vw,2.5rem)', display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.35em', textTransform: 'uppercase', color: GOLD, marginBottom: '.6rem' }}>
              Maison Editions — free
            </p>
            <h1 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(1.6rem,3vw,2.1rem)', lineHeight: 1.05, color: 'var(--ink)' }}>
              Compose your invitation
            </h1>
          </div>

          {state === 'done' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--mist)', lineHeight: 1.7 }}>
                Your invitation is ready. Share this link with your guests — every RSVP will arrive at <strong style={{ color: 'var(--ink)' }}>{data.e}</strong>.
              </p>
              <div style={{ border: `1px solid rgba(162,129,90,.35)`, padding: '1rem', wordBreak: 'break-all', fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.72rem', color: 'var(--ink)', background: 'rgba(162,129,90,.05)' }}>
                {shareUrl}
              </div>
              <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
                <button onClick={copy} style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--ivory)', background: 'var(--ink)', border: 'none', padding: '1em 2.2em', minHeight: 44, cursor: 'pointer' }}>
                  {copied ? 'Copied ✓' : 'Copy link'}
                </button>
                <a href={shareUrl} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.25em', textTransform: 'uppercase', color: GOLD, border: `1px solid rgba(162,129,90,.4)`, padding: '1em 2.2em', minHeight: 44, display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
                  Open invitation
                </a>
              </div>
              <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.88rem', color: 'var(--mist)', lineHeight: 1.7, borderTop: '1px solid rgba(162,129,90,.15)', paddingTop: '1.25rem' }}>
                Keep this link safe — your invitation lives entirely inside it. We store nothing on our servers.
              </p>
              <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontSize: '.95rem', color: 'var(--mist)', lineHeight: 1.7 }}>
                Wanting something composed only for you — with motion, story, and a private dashboard?{' '}
                <Link href="/collection" style={{ color: GOLD }}>Explore commissions →</Link>
              </p>
            </div>
          ) : (
            <>
              {/* Template picker */}
              <div>
                <span className="edm-label">Design</span>
                <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
                  {EDITION_TEMPLATES.map(t => {
                    const active = data.t === t.id;
                    return (
                      <button key={t.id} type="button" onClick={() => setData(d => ({ ...d, t: t.id }))} aria-pressed={active}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '.55rem',
                          padding: '.7em 1.1em', minHeight: 44, cursor: 'pointer',
                          border: `1px solid ${active ? GOLD : 'rgba(162,129,90,.3)'}`,
                          background: active ? 'rgba(162,129,90,.1)' : 'transparent',
                          fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.6rem',
                          letterSpacing: '.14em', textTransform: 'uppercase', color: active ? 'var(--ink)' : 'var(--mist)',
                          transition: 'all .2s',
                        }}>
                        <span style={{ display: 'flex', gap: 2 }}>
                          {t.palette.slice(0, 3).map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,.08)' }} />)}
                        </span>
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '1.25rem' }}>
                <div>
                  <label className="edm-label" htmlFor="ed-n1">First name / host *</label>
                  <input id="ed-n1" className="edm-input" maxLength={EDITION_LIMITS.name} value={data.n1} onChange={set('n1')} placeholder="Amelia" />
                </div>
                <div>
                  <label className="edm-label" htmlFor="ed-n2">Second name (optional)</label>
                  <input id="ed-n2" className="edm-input" maxLength={EDITION_LIMITS.name} value={data.n2} onChange={set('n2')} placeholder="Thomas" />
                </div>
              </div>

              <div>
                <label className="edm-label" htmlFor="ed-o">Occasion line</label>
                <select id="ed-o" className="edm-input" value={data.o} onChange={set('o')} style={{ cursor: 'pointer' }}>
                  {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '1.25rem' }}>
                <div>
                  <label className="edm-label" htmlFor="ed-d">Date *</label>
                  <input id="ed-d" className="edm-input" maxLength={EDITION_LIMITS.date} value={data.d} onChange={set('d')} placeholder="Saturday, June 12th 2027" />
                </div>
                <div>
                  <label className="edm-label" htmlFor="ed-h">Time (optional)</label>
                  <input id="ed-h" className="edm-input" maxLength={EDITION_LIMITS.time} value={data.h} onChange={set('h')} placeholder="4 o'clock in the afternoon" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '1.25rem' }}>
                <div>
                  <label className="edm-label" htmlFor="ed-v">Venue *</label>
                  <input id="ed-v" className="edm-input" maxLength={EDITION_LIMITS.venue} value={data.v} onChange={set('v')} placeholder="The Orchard House" />
                </div>
                <div>
                  <label className="edm-label" htmlFor="ed-c">City / region</label>
                  <input id="ed-c" className="edm-input" maxLength={EDITION_LIMITS.city} value={data.c} onChange={set('c')} placeholder="Vancouver" />
                </div>
              </div>

              <div>
                <label className="edm-label" htmlFor="ed-m">A personal message (optional)</label>
                <textarea id="ed-m" className="edm-input" maxLength={EDITION_LIMITS.message} value={data.m} onChange={set('m')} rows={3}
                  placeholder="Dinner and dancing to follow. We can't wait to celebrate with you."
                  style={{ resize: 'none', lineHeight: 1.6 }} />
              </div>

              <div>
                <label className="edm-label" htmlFor="ed-e">Your email — RSVPs arrive here *</label>
                <input id="ed-e" className="edm-input" type="email" autoComplete="email" value={data.e} onChange={set('e')} placeholder="you@example.com" />
                <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.8rem', color: 'var(--mist)', marginTop: '.5rem' }}>
                  Never shown to guests. Never used for marketing.
                </p>
              </div>

              {error && (
                <p role="alert" style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: '.92rem', color: '#C0564C' }}>
                  {error}
                </p>
              )}

              <button
                type="button" onClick={compose} disabled={state === 'sending'}
                style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '.62rem', letterSpacing: '.3em', textTransform: 'uppercase',
                  color: 'var(--ivory)', background: state === 'sending' ? 'var(--mist)' : 'var(--ink)',
                  border: 'none', padding: '1.2em 2.8em', minHeight: 48,
                  cursor: state === 'sending' ? 'default' : 'pointer', alignSelf: 'flex-start',
                  transition: 'background .25s',
                }}
              >
                {state === 'sending' ? 'Composing…' : 'Create my invitation — free'}
              </button>
            </>
          )}
        </div>

        {/* ── Right: live preview ── */}
        <div className="edm-preview" aria-label="Live preview of your invitation">
          <EditionTemplate data={preview} />
        </div>
      </div>
    </>
  );
}

export default function CreateClient() {
  return (
    <>
      <Nav light />
      <Suspense fallback={<div style={{ minHeight: '100svh', background: 'var(--ivory)' }} />}>
        <CreateEditor />
      </Suspense>
    </>
  );
}
