'use client';

/* Guest memories — photographs, short videos, and written wishes
   for Neil & Riley, before, during, and after the party. Uploads
   go to the couple for review before joining the shared gallery. */

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { compressPhoto } from '@/components/builder/photo-store';
import { NR, nrSerif, nrItalic, nrMicro, nrButton, nrInput, nrLabel } from '../nr-theme';

type GalleryItem = {
  id: string; guestName: string; type: 'photo' | 'video' | 'message';
  caption: string; mediaId?: string; mime?: string; at: number;
};

export default function MemoriesClient() {
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [error, setError] = useState('');
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const c = sessionStorage.getItem('nr-code');
    if (c) verify(c);
    fetch('/api/nr/memories').then(r => r.json()).then(j => setGallery(j.memories ?? [])).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function verify(c: string) {
    setError('');
    try {
      const res = await fetch('/api/nr/guest', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: c }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      sessionStorage.setItem('nr-code', c.trim().toUpperCase());
      setVerified(c.trim().toUpperCase());
      setGuestName(j.guest.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please try again.');
    }
  }

  return (
    <main style={{ minHeight: '100svh', background: NR.velvetDeep, color: NR.ivory }}>
      <header style={{
        textAlign: 'center', padding: 'clamp(4.5rem,10vw,7rem) 1.5rem clamp(2.5rem,6vw,4rem)',
        background: `radial-gradient(ellipse 100% 80% at 50% 0%, ${NR.burgundy} 0%, ${NR.velvetDeep} 70%)`,
      }}>
        <p style={{ ...nrMicro, color: NR.gold, marginBottom: '1.4rem' }}>Neil &amp; Riley — Memories</p>
        <h1 style={{ ...nrSerif, fontSize: 'clamp(1.9rem,6vw,3rem)', lineHeight: 1.15, maxWidth: '18ch', margin: '0 auto 1.2rem' }}>
          Help us remember this.
        </h1>
        <p style={{ ...nrItalic, fontSize: '1rem', color: NR.mist, maxWidth: '48ch', margin: '0 auto', lineHeight: 1.85 }}>
          A photograph, a short video, or a few written words — before the day, during the party,
          or after. Everything you leave goes privately to Neil &amp; Riley first.
        </p>
      </header>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        {!verified ? (
          <section style={{ padding: '2.5rem 0', textAlign: 'center' }}>
            <p style={{ ...nrItalic, fontSize: '.95rem', color: NR.mist, marginBottom: '1.6rem' }}>
              Enter your invitation code to contribute.
            </p>
            <form onSubmit={e => { e.preventDefault(); verify(code); }} style={{ maxWidth: 320, margin: '0 auto' }}>
              <label htmlFor="mem-code" style={nrLabel}>Access code</label>
              <input id="mem-code" value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                autoComplete="off" autoCapitalize="characters" maxLength={8}
                style={{ ...nrInput, textAlign: 'center', letterSpacing: '.4em', fontStyle: 'normal', fontFamily: 'var(--font-manrope), sans-serif' }} />
              {error && <p role="alert" style={{ ...nrItalic, color: '#E08A80', marginTop: '1rem' }}>{error}</p>}
              <button type="submit" style={{ ...nrButton(true), width: '100%', marginTop: '1.6rem' }}>Continue</button>
            </form>
          </section>
        ) : (
          <Composer code={verified} guestName={guestName} />
        )}

        {/* ═══ Shared gallery ═══ */}
        {gallery.length > 0 && (
          <section style={{ marginTop: '3rem', borderTop: `1px solid ${NR.line}`, paddingTop: '2.6rem' }}>
            <p style={{ ...nrMicro, color: NR.gold, textAlign: 'center', marginBottom: '2rem' }}>From the guests</p>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {gallery.map(m => (
                <article key={m.id} style={{ border: `1px solid ${NR.line}`, background: 'rgba(201,163,90,.04)' }}>
                  {m.type === 'photo' && m.mediaId && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`/api/nr/media/${m.mediaId}`} alt={m.caption || `Photograph from ${m.guestName}`} loading="lazy"
                      style={{ width: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }} />
                  )}
                  {m.type === 'video' && m.mediaId && (
                    <video src={`/api/nr/media/${m.mediaId}`} controls playsInline preload="metadata"
                      style={{ width: '100%', maxHeight: 420, display: 'block', background: '#000' }} />
                  )}
                  <div style={{ padding: '1.1rem 1.2rem' }}>
                    {m.caption && (
                      <p style={{ ...nrItalic, fontSize: m.type === 'message' ? '1.02rem' : '.9rem', lineHeight: 1.75, color: 'rgba(244,235,221,.85)' }}>
                        &ldquo;{m.caption}&rdquo;
                      </p>
                    )}
                    <p style={{ ...nrSerif, fontSize: '.85rem', color: NR.gold, marginTop: '.6rem' }}>— {m.guestName}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <p style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/nr" style={{ ...nrMicro, fontSize: '.5rem', color: NR.mist, textDecoration: 'none' }}>← Back to the invitation</Link>
        </p>
      </div>
    </main>
  );
}

/* ═══ Contribution composer ═══ */
function Composer({ code, guestName }: { code: string; guestName: string }) {
  const [mode, setMode] = useState<'message' | 'photo' | 'video'>('message');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const pick = useCallback((f: File | null | undefined) => {
    setError('');
    if (!f) return;
    if (mode === 'photo' && !['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
      setError('Please choose a JPG, PNG, or WebP photograph.'); return;
    }
    if (mode === 'video') {
      if (!f.type.startsWith('video/')) { setError('Please choose a video file.'); return; }
      if (f.size > 25 * 1024 * 1024) { setError('Videos are limited to 25 MB — a short clip is perfect.'); return; }
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, [mode, preview]);

  const submit = async () => {
    setBusy(true); setError('');
    try {
      if (mode === 'message') {
        if (!caption.trim()) throw new Error('Write a few words first.');
        const res = await fetch('/api/nr/memories', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, type: 'message', caption }),
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error);
      } else {
        if (!file) throw new Error(mode === 'photo' ? 'Choose a photograph first.' : 'Choose a video first.');
        const body = mode === 'photo' ? await compressPhoto(file) : file;
        const res = await fetch('/api/nr/memories', {
          method: 'POST',
          headers: {
            'Content-Type': mode === 'photo' ? 'image/jpeg' : (file.type || 'video/mp4'),
            'x-nr-code': code,
            'x-nr-type': mode,
            'x-nr-caption': encodeURIComponent(caption.trim()),
          },
          body,
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error);
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The upload didn’t make it — please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <section style={{ padding: '2.6rem 0', textAlign: 'center', borderBottom: `1px solid ${NR.line}` }}>
        <p style={{ ...nrSerif, fontSize: '1.25rem', marginBottom: '.9rem' }}>Received, with thanks.</p>
        <p style={{ ...nrItalic, fontSize: '.95rem', color: NR.mist, maxWidth: '46ch', margin: '0 auto', lineHeight: 1.8 }}>
          Your memory has gone privately to Neil &amp; Riley. Once they’ve seen it, it may appear in the
          shared gallery below.
        </p>
        <button onClick={() => { setSent(false); setCaption(''); setFile(null); if (preview) { URL.revokeObjectURL(preview); setPreview(''); } }}
          style={{ ...nrButton(false), marginTop: '1.8rem' }}>
          Leave another
        </button>
      </section>
    );
  }

  return (
    <section style={{ padding: '2.6rem 0', borderBottom: `1px solid ${NR.line}` }}>
      <p style={{ ...nrItalic, fontSize: '.95rem', color: NR.mist, textAlign: 'center', marginBottom: '1.8rem' }}>
        Contributing as <strong style={{ color: NR.gold, fontStyle: 'normal', ...nrSerif, fontWeight: 400 }}>{guestName}</strong>
      </p>

      {/* type selector */}
      <div role="radiogroup" aria-label="What would you like to leave?" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.6rem', marginBottom: '1.8rem' }}>
        {([['message', 'A message'], ['photo', 'A photograph'], ['video', 'A video']] as const).map(([id, label]) => (
          <button key={id} type="button" role="radio" aria-checked={mode === id}
            onClick={() => { setMode(id); setFile(null); setError(''); if (preview) { URL.revokeObjectURL(preview); setPreview(''); } }}
            style={{
              ...nrMicro, fontSize: '.48rem', cursor: 'pointer', minHeight: 48, padding: '1em .5em',
              color: mode === id ? NR.velvetDeep : NR.ivory,
              background: mode === id ? NR.gold : 'transparent',
              border: `1px solid ${mode === id ? NR.gold : NR.goldSoft}`,
              transition: 'background .3s, color .3s',
            }}>{label}</button>
        ))}
      </div>

      {mode !== 'message' && (
        <div style={{ marginBottom: '1.6rem' }}>
          <input ref={fileRef} type="file" accept={mode === 'photo' ? 'image/jpeg,image/png,image/webp' : 'video/*'}
            onChange={e => pick(e.target.files?.[0])} style={{ display: 'none' }} />
          {!file ? (
            <button type="button" onClick={() => fileRef.current?.click()} style={{
              width: '100%', minHeight: 120, cursor: 'pointer',
              border: `1px dashed ${NR.goldSoft}`, background: 'rgba(201,163,90,.04)',
              color: NR.mist, ...nrItalic, fontSize: '.95rem',
            }}>
              Tap to choose {mode === 'photo' ? 'a photograph' : 'a short video'}
            </button>
          ) : (
            <div style={{ border: `1px solid ${NR.line}` }}>
              {mode === 'photo'
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={preview} alt="Your photograph, ready to send" style={{ width: '100%', maxHeight: 360, objectFit: 'cover', display: 'block' }} />
                : <video src={preview} controls playsInline style={{ width: '100%', maxHeight: 360, display: 'block', background: '#000' }} />}
              <button type="button" onClick={() => fileRef.current?.click()} style={{ ...nrMicro, fontSize: '.48rem', color: NR.mist, background: 'none', border: 'none', cursor: 'pointer', padding: '1em', width: '100%' }}>
                Choose a different file
              </button>
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: '1.8rem' }}>
        <label htmlFor="mem-caption" style={nrLabel}>
          {mode === 'message' ? 'Your words for Neil & Riley' : 'A caption (optional)'}
        </label>
        <textarea id="mem-caption" value={caption} onChange={e => setCaption(e.target.value)}
          rows={mode === 'message' ? 4 : 2} maxLength={600}
          style={{ ...nrInput, resize: 'none', lineHeight: 1.7 }} />
      </div>

      {error && <p role="alert" style={{ ...nrItalic, color: '#E08A80', marginBottom: '1.2rem' }}>{error}</p>}

      <button onClick={submit} disabled={busy} style={{ ...nrButton(true), width: '100%', opacity: busy ? .55 : 1 }}>
        {busy ? 'Sending…' : 'Send to the couple'}
      </button>
      <p style={{ ...nrItalic, fontSize: '.8rem', color: 'rgba(244,235,221,.42)', textAlign: 'center', marginTop: '1rem', lineHeight: 1.7 }}>
        Shared privately with Neil &amp; Riley — nothing appears publicly until they approve it.
      </p>
    </section>
  );
}
