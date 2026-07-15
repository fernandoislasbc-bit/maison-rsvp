'use client';

/* Neil & Riley — the couple's private dashboard.
   Same design system as the approved platform demo, but every number
   here is live: guests, RSVPs, passes, arrivals, and memories come
   from the server and refresh continuously. */

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import type { NrGuest, NrMemory } from '@/lib/nr-db';

const GOLD = '#A2815A';
const INK = '#14110C';
const IVORY = '#F8F5F0';
const LINE = 'rgba(162,129,90,.22)';

const TONE = {
  attending: { fg: '#4A6741', bg: 'rgba(126,143,110,.14)' },
  regrets:   { fg: '#8C4A3F', bg: 'rgba(176,94,78,.12)' },
  pending:   { fg: '#7A7466', bg: 'rgba(122,116,102,.12)' },
} as const;

const sans: React.CSSProperties = { fontFamily: 'var(--font-manrope), sans-serif' };
const serif: React.CSSProperties = { fontFamily: 'var(--font-prata), Georgia, serif' };
const italic: React.CSSProperties = { fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic' };
const micro: React.CSSProperties = { ...sans, fontSize: '.55rem', letterSpacing: '.26em', textTransform: 'uppercase' };

const btn = (primary = false): React.CSSProperties => ({
  ...micro, cursor: 'pointer', padding: '.9em 1.6em', minHeight: 40,
  color: primary ? IVORY : INK,
  background: primary ? INK : 'transparent',
  border: `1px solid ${primary ? INK : LINE}`,
});
const tinyBtn: React.CSSProperties = {
  ...micro, fontSize: '.48rem', cursor: 'pointer', padding: '.7em 1.1em',
  color: '#6B6455', background: 'transparent', border: `1px solid ${LINE}`,
};
const field: React.CSSProperties = {
  ...italic, fontSize: '.95rem', width: '100%', padding: '.6em .8em',
  border: `1px solid ${LINE}`, background: '#FFFEFB', color: INK, outline: 'none', borderRadius: 0,
};

function Chip({ tone, children }: { tone: keyof typeof TONE; children: React.ReactNode }) {
  return (
    <span style={{ ...micro, fontSize: '.5rem', color: TONE[tone].fg, background: TONE[tone].bg, padding: '.45em .9em', whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

type GuestRow = NrGuest & { pass: string | null };
type Data = { guests: GuestRow[]; memories: NrMemory[] };
type Tab = 'overview' | 'guests' | 'memories' | 'arrivals';

const guestStatus = (g: GuestRow): keyof typeof TONE =>
  !g.rsvp ? 'pending' : g.rsvp.attending ? 'attending' : 'regrets';

export default function AdminClient() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [data, setData] = useState<Data | null>(null);
  const [tab, setTab] = useState<Tab>('overview');

  const refresh = useCallback(async () => {
    const res = await fetch('/api/nr/admin', { cache: 'no-store' });
    if (res.status === 401) { setAuthed(false); return; }
    const j = await res.json();
    setData({ guests: j.guests, memories: j.memories });
    setAuthed(true);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  /* live arrivals — poll while the tab is visible */
  useEffect(() => {
    if (!authed) return;
    const t = setInterval(() => { if (document.visibilityState === 'visible') refresh(); }, 8000);
    return () => clearInterval(t);
  }, [authed, refresh]);

  const act = useCallback(async (body: Record<string, unknown>) => {
    await fetch('/api/nr/admin', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    await refresh();
  }, [refresh]);

  if (authed === null) return <div style={{ minHeight: '100svh', background: IVORY }} aria-busy="true" />;
  if (authed === false) return <Login onDone={refresh} />;
  if (!data) return <div style={{ minHeight: '100svh', background: IVORY }} aria-busy="true" />;

  const TABS: { id: Tab; label: string; badge?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'guests', label: 'Guests & RSVPs' },
    { id: 'memories', label: 'Memories', badge: data.memories.filter(m => m.status === 'pending').length || undefined },
    { id: 'arrivals', label: 'Arrivals' },
  ];

  return (
    <div style={{ minHeight: '100svh', background: IVORY, color: INK }}>
      <style>{`
        .nra-tabs::-webkit-scrollbar { display: none; }
        button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible { outline: 2px solid ${GOLD}; outline-offset: 2px; }
      `}</style>

      <header style={{ background: IVORY, borderBottom: `1px solid ${LINE}`, padding: '1rem clamp(1rem,4vw,3rem)', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{ ...micro, color: GOLD, marginBottom: '.3rem' }}>Maison RSVP — Couple dashboard</p>
          <p style={{ ...serif, fontSize: 'clamp(1.05rem,2.5vw,1.4rem)' }}>Neil &amp; Riley</p>
          <p style={{ ...italic, fontSize: '.8rem', color: '#8B8578' }}>Saturday, September 14th, 2026 · Acquafarina, Vancouver</p>
        </div>
        <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
          <Link href="/nr/checkin" style={{ ...btn(true), textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Open check-in scanner</Link>
          <button style={tinyBtn} onClick={() => act({ action: 'reset' })}>Reset demo</button>
          <button style={tinyBtn} onClick={async () => { await fetch('/api/nr/auth', { method: 'DELETE' }); setAuthed(false); }}>Sign out</button>
        </div>
      </header>

      <nav aria-label="Dashboard sections" className="nra-tabs" style={{
        display: 'flex', gap: '.3rem', overflowX: 'auto', scrollbarWidth: 'none',
        padding: '.9rem clamp(1rem,4vw,3rem) 0', borderBottom: `1px solid ${LINE}`,
        background: IVORY, position: 'sticky', top: 0, zIndex: 10,
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} aria-current={tab === t.id ? 'page' : undefined} style={{
            ...micro, cursor: 'pointer', whiteSpace: 'nowrap', padding: '.9em 1.3em', minHeight: 44,
            color: tab === t.id ? INK : '#8B8578', background: 'transparent', border: 'none',
            borderBottom: `2px solid ${tab === t.id ? GOLD : 'transparent'}`,
          }}>
            {t.label}{t.badge ? <span style={{ color: '#8C4A3F' }}> ·{t.badge}</span> : null}
          </button>
        ))}
      </nav>

      <main style={{ padding: 'clamp(1.4rem,3.5vw,3rem) clamp(1rem,4vw,3rem) 5rem', maxWidth: 1180, margin: '0 auto' }}>
        {tab === 'overview' && <Overview data={data} go={setTab} />}
        {tab === 'guests'   && <GuestsTab data={data} act={act} />}
        {tab === 'memories' && <MemoriesTab data={data} act={act} />}
        {tab === 'arrivals' && <Arrivals data={data} act={act} />}
      </main>
    </div>
  );
}

/* ═══ Login ═══ */
function Login({ onDone }: { onDone: () => void }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Arriving from the guided tour (?demo=1) fills the public demo password so
  // the visitor only has to tap Enter — while still seeing that it's protected.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('demo') === '1') setPw('rosewood2026');
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    const res = await fetch('/api/nr/auth', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'couple', secret: pw }),
    });
    if (res.ok) { onDone(); return; }
    const j = await res.json().catch(() => ({}));
    setError(j.error || 'That’s not quite right.');
    setBusy(false);
  };

  return (
    <main style={{ minHeight: '100svh', background: IVORY, color: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: 380, textAlign: 'center' }}>
        <p style={{ ...micro, color: GOLD, marginBottom: '1.6rem' }}>Neil &amp; Riley — private</p>
        <h1 style={{ ...serif, fontSize: '1.7rem', marginBottom: '2.2rem' }}>The couple&rsquo;s dashboard</h1>
        <label htmlFor="nra-pw" style={{ ...micro, fontSize: '.5rem', color: '#8B8578', display: 'block', textAlign: 'left', marginBottom: '.5rem' }}>Password</label>
        <input id="nra-pw" type="password" value={pw} onChange={e => setPw(e.target.value)} autoComplete="current-password" style={field} />
        {error && <p role="alert" style={{ ...italic, color: '#8C4A3F', marginTop: '1rem' }}>{error}</p>}
        <button type="submit" disabled={busy} style={{ ...btn(true), width: '100%', marginTop: '1.8rem', opacity: busy ? .6 : 1 }}>
          {busy ? 'Signing in…' : 'Enter'}
        </button>
        <p style={{ ...italic, fontSize: '.82rem', color: '#A29A88', marginTop: '2rem' }}>
          Demonstration login: <strong style={{ fontStyle: 'normal', letterSpacing: '.08em' }}>rosewood2026</strong>
        </p>
      </form>
    </main>
  );
}

/* ═══ Overview ═══ */
function Overview({ data, go }: { data: Data; go: (t: Tab) => void }) {
  const accepted = data.guests.filter(g => g.rsvp?.attending);
  const declined = data.guests.filter(g => g.rsvp && !g.rsvp.attending);
  const pending = data.guests.filter(g => !g.rsvp);
  const seats = accepted.reduce((n, g) => n + (g.rsvp?.seatsConfirmed ?? 0), 0);
  const arrived = data.guests.filter(g => g.checkedInAt).reduce((n, g) => n + (g.rsvp?.seatsConfirmed ?? 0), 0);
  const toReview = data.memories.filter(m => m.status === 'pending').length;

  const stats = [
    { n: data.guests.length, label: 'Invitations', sub: `${data.guests.reduce((n, g) => n + g.seats, 0)} seats offered`, tab: 'guests' as Tab },
    { n: seats, label: 'Attending', sub: `${accepted.length} parties confirmed`, tab: 'guests' as Tab },
    { n: declined.length, label: 'Regrets', sub: 'with love, from afar', tab: 'guests' as Tab },
    { n: pending.length, label: 'Awaiting reply', sub: 'invitations open', tab: 'guests' as Tab },
    { n: arrived, label: 'Arrived', sub: 'checked in tonight', tab: 'arrivals' as Tab },
    { n: data.memories.length, label: 'Memories', sub: toReview ? `${toReview} to review` : 'all reviewed', tab: 'memories' as Tab },
  ];

  const latest = [...data.guests].filter(g => g.rsvp).sort((a, b) => (b.rsvp!.at - a.rsvp!.at)).slice(0, 4);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2.6rem' }}>
        {stats.map(s => (
          <button key={s.label} onClick={() => go(s.tab)} style={{ background: '#FFFEFB', border: `1px solid ${LINE}`, padding: '1.4rem 1.2rem', textAlign: 'left', cursor: 'pointer' }}>
            <p style={{ ...serif, fontSize: '2.1rem', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{s.n}</p>
            <p style={{ ...micro, color: GOLD, margin: '.7rem 0 .25rem' }}>{s.label}</p>
            <p style={{ ...italic, fontSize: '.8rem', color: '#8B8578' }}>{s.sub}</p>
          </button>
        ))}
      </div>

      <section style={{ background: '#FFFEFB', border: `1px solid ${LINE}`, padding: '1.6rem' }}>
        <h2 style={{ ...micro, color: GOLD, marginBottom: '1.2rem' }}>Latest replies</h2>
        {latest.map(g => (
          <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', padding: '.75rem 0', borderBottom: '1px solid rgba(162,129,90,.1)' }}>
            <div>
              <p style={{ ...serif, fontSize: '.95rem' }}>{g.name}</p>
              {g.rsvp?.note && <p style={{ ...italic, fontSize: '.82rem', color: '#8B8578', marginTop: '.2rem' }}>&ldquo;{g.rsvp.note}&rdquo;</p>}
            </div>
            <Chip tone={guestStatus(g)}>{g.rsvp?.attending ? `Attending · ${g.rsvp.seatsConfirmed}` : 'Regrets'}</Chip>
          </div>
        ))}
      </section>
    </div>
  );
}

/* ═══ Guests & RSVPs ═══ */
function GuestsTab({ data, act }: { data: Data; act: (b: Record<string, unknown>) => Promise<void> }) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | 'attending' | 'regrets' | 'pending'>('all');
  const [open, setOpen] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [copied, setCopied] = useState('');

  const rows = data.guests.filter(g =>
    (filter === 'all' || guestStatus(g) === filter) &&
    (!q || g.name.toLowerCase().includes(q.toLowerCase()) || g.code.toLowerCase().includes(q.toLowerCase()))
  );

  const copy = async (text: string, id: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(''), 1400); } catch { /* ignore */ }
  };

  const exportCsv = () => {
    const head = 'Guest,Code,Invitation link,Seats offered,Reply,Seats confirmed,Meals,Dietary,Note,Checked in';
    const lines = data.guests.map(g => [
      g.name, g.code, `${window.location.origin}/nr/i/${g.code}`, g.seats,
      !g.rsvp ? 'Pending' : g.rsvp.attending ? 'Attending' : 'Regrets',
      g.rsvp?.seatsConfirmed ?? '', (g.rsvp?.meals ?? []).join(' | '), g.rsvp?.dietary ?? '', g.rsvp?.note ?? '',
      g.checkedInAt ? new Date(g.checkedInAt).toLocaleString() : '',
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    const blob = new Blob([[head, ...lines].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'neil-riley-guests.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.4rem' }}>
        {(['all', 'attending', 'regrets', 'pending'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            ...tinyBtn,
            color: filter === f ? INK : '#8B8578',
            borderColor: filter === f ? GOLD : LINE,
            background: filter === f ? 'rgba(162,129,90,.08)' : 'transparent',
          }}>{f === 'all' ? `All (${data.guests.length})` : f}</button>
        ))}
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name or code…" aria-label="Search guests"
          style={{ ...field, width: 'auto', minWidth: 180, marginLeft: 'auto' }} />
        <button style={tinyBtn} onClick={exportCsv}>Export CSV</button>
        <button style={btn(true)} onClick={() => setAdding(a => !a)}>{adding ? 'Close' : 'Add guest'}</button>
      </div>

      {adding && <AddGuest act={act} done={() => setAdding(false)} />}

      <div style={{ background: '#FFFEFB', border: `1px solid ${LINE}` }}>
        {rows.map(g => (
          <div key={g.id} style={{ borderBottom: '1px solid rgba(162,129,90,.12)' }}>
            <button onClick={() => setOpen(o => o === g.id ? null : g.id)} aria-expanded={open === g.id} style={{
              display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', textAlign: 'left',
              padding: '1rem 1.2rem', background: 'transparent', border: 'none', cursor: 'pointer', minHeight: 56,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ ...serif, fontSize: '.98rem' }}>{g.name}</p>
                <p style={{ ...sans, fontSize: '.68rem', color: '#A29A88', marginTop: '.25rem', letterSpacing: '.12em' }}>
                  {g.code} · {g.seats} {g.seats === 1 ? 'seat' : 'seats'} offered
                  {g.checkedInAt ? ' · arrived' : ''}
                </p>
              </div>
              <Chip tone={guestStatus(g)}>
                {!g.rsvp ? 'Pending' : g.rsvp.attending ? `Attending · ${g.rsvp.seatsConfirmed}` : 'Regrets'}
              </Chip>
              <span aria-hidden style={{ color: '#A29A88', fontSize: '.7rem' }}>{open === g.id ? '▲' : '▼'}</span>
            </button>

            {open === g.id && (
              <GuestDetail g={g} act={act} copy={copy} copied={copied} />
            )}
          </div>
        ))}
        {rows.length === 0 && <p style={{ ...italic, textAlign: 'center', color: '#8B8578', padding: '2.5rem' }}>No guests match.</p>}
      </div>
    </div>
  );
}

function GuestDetail({ g, act, copy, copied }: {
  g: GuestRow; act: (b: Record<string, unknown>) => Promise<void>;
  copy: (text: string, id: string) => void; copied: string;
}) {
  const [name, setName] = useState(g.name);
  const [seats, setSeats] = useState(g.seats);
  const [message, setMessage] = useState(g.message);
  const link = typeof window !== 'undefined' ? `${window.location.origin}/nr/i/${g.code}` : `/nr/i/${g.code}`;

  return (
    <div style={{ padding: '0 1.2rem 1.4rem', display: 'grid', gap: '1.2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,280px), 1fr))' }}>
      {/* invitation & pass */}
      <div style={{ border: `1px solid ${LINE}`, padding: '1.1rem' }}>
        <h3 style={{ ...micro, color: GOLD, marginBottom: '.9rem' }}>Invitation</h3>
        <p style={{ ...sans, fontSize: '.72rem', color: '#6B6455', wordBreak: 'break-all', marginBottom: '.8rem' }}>{link}</p>
        <div style={{ display: 'flex', gap: '.45rem', flexWrap: 'wrap' }}>
          <button style={tinyBtn} onClick={() => copy(link, `l-${g.id}`)}>{copied === `l-${g.id}` ? 'Copied ✓' : 'Copy link'}</button>
          <button style={tinyBtn} onClick={() => copy(g.code, `c-${g.id}`)}>{copied === `c-${g.id}` ? 'Copied ✓' : 'Copy code'}</button>
          {g.rsvp?.attending && (
            <button style={{ ...tinyBtn, color: g.passActive ? '#8C4A3F' : '#4A6741' }} onClick={() => act({ action: 'togglePass', id: g.id })}>
              {g.passActive ? 'Deactivate QR pass' : 'Issue new QR pass'}
            </button>
          )}
          {g.checkedInAt && <button style={tinyBtn} onClick={() => act({ action: 'undoCheckin', id: g.id })}>Undo check-in</button>}
        </div>
        {g.rsvp && (
          <div style={{ marginTop: '1rem', paddingTop: '.9rem', borderTop: '1px solid rgba(162,129,90,.12)' }}>
            <p style={{ ...micro, fontSize: '.46rem', color: '#8B8578', marginBottom: '.5rem' }}>RSVP details</p>
            <p style={{ ...italic, fontSize: '.88rem', lineHeight: 1.7, color: '#3B362C' }}>
              {g.rsvp.attending ? `${g.rsvp.seatsConfirmed} attending` : 'Declined'}
              {g.rsvp.meals.length > 0 && <> · {g.rsvp.meals.join(', ')}</>}
              {g.rsvp.dietary && <> · <strong style={{ fontStyle: 'normal' }}>{g.rsvp.dietary}</strong></>}
            </p>
            {g.rsvp.note && <p style={{ ...italic, fontSize: '.85rem', color: '#8B8578', marginTop: '.4rem' }}>&ldquo;{g.rsvp.note}&rdquo;</p>}
          </div>
        )}
      </div>

      {/* edit */}
      <div style={{ border: `1px solid ${LINE}`, padding: '1.1rem' }}>
        <h3 style={{ ...micro, color: GOLD, marginBottom: '.9rem' }}>Edit guest</h3>
        <label htmlFor={`en-${g.id}`} style={{ ...micro, fontSize: '.46rem', color: '#8B8578', display: 'block', marginBottom: '.35rem' }}>Name</label>
        <input id={`en-${g.id}`} value={name} onChange={e => setName(e.target.value)} style={{ ...field, marginBottom: '.8rem' }} />
        <label htmlFor={`es-${g.id}`} style={{ ...micro, fontSize: '.46rem', color: '#8B8578', display: 'block', marginBottom: '.35rem' }}>Seats offered</label>
        <select id={`es-${g.id}`} value={seats} onChange={e => setSeats(Number(e.target.value))} style={{ ...field, marginBottom: '.8rem', cursor: 'pointer' }}>
          {[1, 2, 3, 4, 5, 6, 8, 10].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <label htmlFor={`em-${g.id}`} style={{ ...micro, fontSize: '.46rem', color: '#8B8578', display: 'block', marginBottom: '.35rem' }}>Personal note on the invitation</label>
        <textarea id={`em-${g.id}`} value={message} onChange={e => setMessage(e.target.value)} rows={3} maxLength={400} style={{ ...field, resize: 'none', marginBottom: '.9rem' }} />
        <div style={{ display: 'flex', gap: '.45rem', flexWrap: 'wrap' }}>
          <button style={btn(true)} onClick={() => act({ action: 'editGuest', id: g.id, name, seats, message })}>Save</button>
          <button style={{ ...tinyBtn, color: '#8C4A3F', borderColor: 'rgba(176,94,78,.35)' }}
            onClick={() => { if (confirm(`Remove ${g.name} from the guest list?`)) act({ action: 'deleteGuest', id: g.id }); }}>
            Remove guest
          </button>
        </div>
      </div>
    </div>
  );
}

function AddGuest({ act, done }: { act: (b: Record<string, unknown>) => Promise<void>; done: () => void }) {
  const [name, setName] = useState('');
  const [seats, setSeats] = useState(2);
  const [message, setMessage] = useState('');

  return (
    <div style={{ background: '#FFFEFB', border: `1px solid ${GOLD}`, padding: '1.3rem', marginBottom: '1.2rem' }}>
      <h3 style={{ ...micro, color: GOLD, marginBottom: '1rem' }}>New invitation</h3>
      <div style={{ display: 'grid', gap: '.9rem', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,220px), 1fr))' }}>
        <div>
          <label htmlFor="ag-name" style={{ ...micro, fontSize: '.46rem', color: '#8B8578', display: 'block', marginBottom: '.35rem' }}>Guest or party name</label>
          <input id="ag-name" value={name} onChange={e => setName(e.target.value)} style={field} />
        </div>
        <div>
          <label htmlFor="ag-seats" style={{ ...micro, fontSize: '.46rem', color: '#8B8578', display: 'block', marginBottom: '.35rem' }}>Seats</label>
          <select id="ag-seats" value={seats} onChange={e => setSeats(Number(e.target.value))} style={{ ...field, cursor: 'pointer' }}>
            {[1, 2, 3, 4, 5, 6, 8, 10].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <label htmlFor="ag-msg" style={{ ...micro, fontSize: '.46rem', color: '#8B8578', display: 'block', margin: '.9rem 0 .35rem' }}>Personal note on their invitation</label>
      <textarea id="ag-msg" value={message} onChange={e => setMessage(e.target.value)} rows={2} maxLength={400} style={{ ...field, resize: 'none' }} />
      <button style={{ ...btn(true), marginTop: '1rem' }} onClick={async () => {
        if (!name.trim()) return;
        await act({ action: 'addGuest', name, seats, message });
        done();
      }}>Create invitation & code</button>
    </div>
  );
}

/* ═══ Memories moderation ═══ */
function MemoriesTab({ data, act }: { data: Data; act: (b: Record<string, unknown>) => Promise<void> }) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'hidden'>('all');
  const items = data.memories.filter(m => filter === 'all' || m.status === filter);

  return (
    <div>
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1.6rem' }}>
        {(['all', 'pending', 'approved', 'hidden'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            ...tinyBtn,
            color: filter === f ? INK : '#8B8578',
            borderColor: filter === f ? GOLD : LINE,
            background: filter === f ? 'rgba(162,129,90,.08)' : 'transparent',
          }}>{f}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {items.map(m => (
          <article key={m.id} style={{
            background: '#FFFEFB', border: `1px solid ${m.status === 'pending' ? 'rgba(162,129,90,.55)' : LINE}`,
            opacity: m.status === 'hidden' ? .55 : 1, display: 'flex', flexDirection: 'column',
          }}>
            {m.type === 'photo' && m.mediaId && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/api/nr/media/${m.mediaId}`} alt={m.caption} loading="lazy" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
            )}
            {m.type === 'video' && m.mediaId && (
              <video src={`/api/nr/media/${m.mediaId}`} controls playsInline preload="metadata" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', background: '#000' }} />
            )}
            <div style={{ padding: '1rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '.6rem', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '.5rem' }}>
                <span style={{ ...micro, fontSize: '.46rem', color: GOLD }}>{m.type}</span>
                <span style={{ ...micro, fontSize: '.44rem', color: m.status === 'pending' ? '#8C4A3F' : '#8B8578' }}>{m.status === 'pending' ? 'To review' : m.status}</span>
              </div>
              {m.caption && <p style={{ ...italic, fontSize: m.type === 'message' ? '.98rem' : '.86rem', lineHeight: 1.65, flex: 1 }}>&ldquo;{m.caption}&rdquo;</p>}
              <p style={{ ...serif, fontSize: '.82rem', color: '#6B6455' }}>— {m.guestName}</p>
              <div style={{ display: 'flex', gap: '.45rem', flexWrap: 'wrap' }}>
                {m.status !== 'approved' && <button style={{ ...tinyBtn, color: '#4A6741', borderColor: 'rgba(126,143,110,.5)' }} onClick={() => act({ action: 'moderateMemory', id: m.id, status: 'approved' })}>Approve</button>}
                {m.status === 'approved' && <button style={tinyBtn} onClick={() => act({ action: 'moderateMemory', id: m.id, status: 'hidden' })}>Hide</button>}
                {m.status === 'hidden' && <button style={tinyBtn} onClick={() => act({ action: 'moderateMemory', id: m.id, status: 'approved' })}>Restore</button>}
                <button style={{ ...tinyBtn, color: '#8C4A3F', borderColor: 'rgba(176,94,78,.35)' }} onClick={() => act({ action: 'removeMemory', id: m.id })}>Remove</button>
              </div>
            </div>
          </article>
        ))}
        {items.length === 0 && <p style={{ ...italic, color: '#8B8578' }}>Nothing here.</p>}
      </div>
    </div>
  );
}

/* ═══ Arrivals (live) ═══ */
function Arrivals({ data, act }: { data: Data; act: (b: Record<string, unknown>) => Promise<void> }) {
  const attending = data.guests.filter(g => g.rsvp?.attending);
  const arrived = attending.filter(g => g.checkedInAt);
  const seatsIn = arrived.reduce((n, g) => n + (g.rsvp?.seatsConfirmed ?? 0), 0);
  const seatsTotal = attending.reduce((n, g) => n + (g.rsvp?.seatsConfirmed ?? 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.8rem' }}>
        <p style={{ ...serif, fontSize: '2.4rem', fontVariantNumeric: 'tabular-nums' }}>{seatsIn}<span style={{ color: '#A29A88', fontSize: '1.3rem' }}> / {seatsTotal}</span></p>
        <p style={{ ...italic, color: '#8B8578' }}>guests through the door — updates live while this page is open.</p>
      </div>

      <div style={{ background: '#FFFEFB', border: `1px solid ${LINE}` }}>
        {[...attending].sort((a, b) => (b.checkedInAt ?? 0) - (a.checkedInAt ?? 0)).map(g => (
          <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '.95rem 1.2rem', borderBottom: '1px solid rgba(162,129,90,.1)', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <p style={{ ...serif, fontSize: '.95rem' }}>{g.name}</p>
              <p style={{ ...sans, fontSize: '.7rem', color: '#8B8578', marginTop: '.2rem', fontVariantNumeric: 'tabular-nums' }}>
                {g.rsvp!.seatsConfirmed} {g.rsvp!.seatsConfirmed === 1 ? 'seat' : 'seats'}
                {g.rsvp!.dietary ? ` · ${g.rsvp!.dietary}` : ''}
              </p>
            </div>
            {g.checkedInAt ? (
              <>
                <span style={{ ...micro, fontSize: '.48rem', color: '#4A6741', background: 'rgba(126,143,110,.14)', padding: '.5em 1em' }}>
                  ✓ {new Date(g.checkedInAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </span>
                <button style={tinyBtn} onClick={() => act({ action: 'undoCheckin', id: g.id })}>Undo</button>
              </>
            ) : (
              <span style={{ ...micro, fontSize: '.48rem', color: '#7A7466' }}>Expected</span>
            )}
          </div>
        ))}
      </div>

      <p style={{ ...italic, fontSize: '.88rem', color: '#8B8578', marginTop: '1.4rem' }}>
        The door team scans passes from the <Link href="/nr/checkin" style={{ color: GOLD }}>mobile check-in scanner</Link> —
        staff code <strong style={{ fontStyle: 'normal' }}>ENTRANCE26</strong>.
      </p>
    </div>
  );
}
