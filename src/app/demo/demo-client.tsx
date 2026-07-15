'use client';

/* ─────────────────────────────────────────────────────────────
   Platform demo — the private couple dashboard, live.
   RSVPs, guest list & check-in, QR sharing, and the Memories
   archive (photos, videos, voice notes, written messages left
   before, during, and after the party). Entirely client-side:
   every action mutates a localStorage copy of the seed.
   ───────────────────────────────────────────────────────────── */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  type DemoStore, type DemoMemory, type MemoryPhase, type MemoryType,
  DEMO_COUPLE, loadDemo, saveDemo, resetDemo,
} from '@/lib/demo-data';

const GOLD = '#A2815A';
const INK = '#14110C';
const IVORY = '#F8F5F0';
const LINE = 'rgba(162,129,90,.22)';

/* status colours — semantic, muted to match the house */
const TONE = {
  attending: { fg: '#4A6741', bg: 'rgba(126,143,110,.14)' },
  regrets:   { fg: '#8C4A3F', bg: 'rgba(176,94,78,.12)' },
  pending:   { fg: '#7A7466', bg: 'rgba(122,116,102,.12)' },
  approved:  { fg: '#4A6741', bg: 'rgba(126,143,110,.14)' },
  hidden:    { fg: '#8C4A3F', bg: 'rgba(176,94,78,.12)' },
} as const;

const sans: React.CSSProperties = { fontFamily: 'var(--font-manrope), sans-serif' };
const serif: React.CSSProperties = { fontFamily: 'var(--font-prata), Georgia, serif' };
const italic: React.CSSProperties = { fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic' };

const micro: React.CSSProperties = {
  ...sans, fontSize: '.55rem', letterSpacing: '.26em', textTransform: 'uppercase',
};

function Chip({ tone, children }: { tone: keyof typeof TONE; children: React.ReactNode }) {
  return (
    <span style={{
      ...micro, fontSize: '.5rem', color: TONE[tone].fg, background: TONE[tone].bg,
      padding: '.45em .9em', borderRadius: 2, whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

const btn = (primary = false): React.CSSProperties => ({
  ...micro, cursor: 'pointer', padding: '.9em 1.6em', minHeight: 40,
  color: primary ? IVORY : INK,
  background: primary ? INK : 'transparent',
  border: `1px solid ${primary ? INK : LINE}`,
  transition: 'border-color .25s, background .25s, color .25s',
});

const tinyBtn: React.CSSProperties = {
  ...micro, fontSize: '.48rem', cursor: 'pointer', padding: '.7em 1.1em',
  color: '#6B6455', background: 'transparent', border: `1px solid ${LINE}`,
};

/* ═══ Voice note — animated waveform + soft synthesized chime ═══ */
function VoiceNote({ duration, playing, onToggle }: { duration: string; playing: boolean; onToggle: () => void }) {
  const bars = useMemo(() => Array.from({ length: 28 }, (_, i) => 8 + Math.abs(Math.sin(i * 1.7)) * 18), []);
  return (
    <button onClick={onToggle} aria-label={playing ? 'Pause voice note' : 'Play voice note'} style={{
      display: 'flex', alignItems: 'center', gap: '.9rem', width: '100%',
      background: 'rgba(162,129,90,.06)', border: `1px solid ${LINE}`,
      padding: '.85rem 1rem', cursor: 'pointer', minHeight: 44,
    }}>
      <span aria-hidden style={{
        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
        border: `1px solid ${GOLD}`, color: GOLD,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.6rem',
      }}>{playing ? '❚❚' : '▶'}</span>
      <span aria-hidden style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, height: 26, overflow: 'hidden' }}>
        {bars.map((h, i) => (
          <span key={i} style={{
            width: 2, borderRadius: 1, background: playing ? GOLD : 'rgba(162,129,90,.45)',
            height: h,
            animation: playing ? `demoWave .9s ease-in-out ${i * .05}s infinite alternate` : 'none',
          }} />
        ))}
      </span>
      <span style={{ ...sans, fontSize: '.62rem', color: '#6B6455', fontVariantNumeric: 'tabular-nums' }}>{duration}</span>
    </button>
  );
}

/* Gentle bell arpeggio so demo voice notes really play something. */
function useChime() {
  const ctxRef = useRef<AudioContext | null>(null);
  const stopRef = useRef<() => void>(() => {});
  const play = useCallback((onEnd: () => void) => {
    try {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = ctxRef.current ?? new Ctor();
      ctxRef.current = ctx;
      const master = ctx.createGain();
      master.gain.value = .12;
      master.connect(ctx.destination);
      const notes = [523.25, 659.25, 783.99, 659.25, 523.25, 587.33, 659.25];
      const oscs: OscillatorNode[] = [];
      notes.forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = f;
        const t = ctx.currentTime + i * .55;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(1, t + .06);
        g.gain.exponentialRampToValueAtTime(.001, t + .5);
        o.connect(g); g.connect(master);
        o.start(t); o.stop(t + .55);
        oscs.push(o);
      });
      const timer = setTimeout(onEnd, notes.length * 550 + 200);
      stopRef.current = () => { clearTimeout(timer); oscs.forEach(o => { try { o.stop(); } catch { /* already stopped */ } }); };
    } catch { onEnd(); }
  }, []);
  const stop = useCallback(() => stopRef.current(), []);
  return { play, stop };
}

/* ═══ Main dashboard ═══ */

type Tab = 'overview' | 'rsvps' | 'guests' | 'memories' | 'share';
const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'rsvps',    label: 'RSVPs' },
  { id: 'guests',   label: 'Guests' },
  { id: 'memories', label: 'Memories' },
  { id: 'share',    label: 'QR & Share' },
];

export default function DemoDashboard() {
  const [store, setStore] = useState<DemoStore | null>(null);
  const [tab, setTab] = useState<Tab>('overview');

  useEffect(() => { setStore(loadDemo()); }, []);

  const mutate = useCallback((fn: (s: DemoStore) => DemoStore) => {
    setStore(prev => {
      if (!prev) return prev;
      const next = fn(structuredClone(prev));
      saveDemo(next);
      return next;
    });
  }, []);

  if (!store) {
    return <div style={{ minHeight: '100svh', background: IVORY }} aria-busy="true" />;
  }

  return (
    <div style={{ minHeight: '100svh', background: IVORY, color: INK }}>
      <style>{`
        @keyframes demoWave { from { transform: scaleY(.4); } to { transform: scaleY(1.15); } }
        .demo-tabs::-webkit-scrollbar { display: none; }
        .demo-table-wrap { overflow-x: auto; }
        .demo-table { width: 100%; border-collapse: collapse; min-width: 660px; }
        .demo-table th { text-align: left; padding: .8rem .9rem; border-bottom: 1px solid ${LINE}; }
        .demo-table td { padding: .95rem .9rem; border-bottom: 1px solid rgba(162,129,90,.12); vertical-align: top; }
        .demo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; }
        button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid ${GOLD}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { .demo-anim, [style*="demoWave"] { animation: none !important; } }
      `}</style>

      {/* ── Top bar ── */}
      <header style={{
        background: IVORY,
        borderBottom: `1px solid ${LINE}`,
        padding: '1rem clamp(1rem,4vw,3rem)',
        display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{ ...micro, color: GOLD, marginBottom: '.3rem' }}>Maison RSVP — Platform demo</p>
          <p style={{ ...serif, fontSize: 'clamp(1.05rem,2.5vw,1.4rem)' }}>{DEMO_COUPLE.names}</p>
          <p style={{ ...italic, fontSize: '.8rem', color: '#8B8578' }}>{DEMO_COUPLE.date} · {DEMO_COUPLE.venue}, {DEMO_COUPLE.city}</p>
        </div>
        <div style={{ display: 'flex', gap: '.6rem', alignItems: 'center' }}>
          <button style={tinyBtn} onClick={() => setStore(resetDemo())}>Reset demo</button>
          <Link href="/contact" style={{ ...btn(true), textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Commission yours
          </Link>
        </div>
      </header>

      {/* ── Tabs ── */}
      <nav aria-label="Dashboard sections" className="demo-tabs" style={{
        display: 'flex', gap: '.3rem', overflowX: 'auto', scrollbarWidth: 'none',
        padding: '.9rem clamp(1rem,4vw,3rem) 0', borderBottom: `1px solid ${LINE}`,
        background: IVORY, position: 'sticky', top: 0, zIndex: 10,
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} aria-current={tab === t.id ? 'page' : undefined} style={{
            ...micro, cursor: 'pointer', whiteSpace: 'nowrap',
            padding: '.9em 1.3em', minHeight: 44,
            color: tab === t.id ? INK : '#8B8578',
            background: 'transparent', border: 'none',
            borderBottom: `2px solid ${tab === t.id ? GOLD : 'transparent'}`,
            transition: 'color .25s, border-color .25s',
          }}>{t.label}</button>
        ))}
      </nav>

      <main style={{ padding: 'clamp(1.4rem,3.5vw,3rem) clamp(1rem,4vw,3rem) 5rem', maxWidth: 1180, margin: '0 auto' }}>
        {tab === 'overview' && <Overview store={store} go={setTab} />}
        {tab === 'rsvps'    && <Rsvps store={store} />}
        {tab === 'guests'   && <Guests store={store} mutate={mutate} />}
        {tab === 'memories' && <Memories store={store} mutate={mutate} />}
        {tab === 'share'    && <Share />}
      </main>

      {/* ── Demo footer note ── */}
      <footer style={{ borderTop: `1px solid ${LINE}`, padding: '2.2rem clamp(1rem,4vw,3rem)', textAlign: 'center' }}>
        <p style={{ ...italic, fontSize: '.9rem', color: '#8B8578', maxWidth: '58ch', margin: '0 auto', lineHeight: 1.8 }}>
          This is a living demonstration with a fictional wedding — every button works, and your changes
          stay on this device. Each commission receives its own private dashboard exactly like this one.
        </p>
        <Link href="/collection" style={{ ...italic, fontSize: '.95rem', color: GOLD, display: 'inline-block', marginTop: '1rem' }}>
          Explore the Collection →
        </Link>
      </footer>
    </div>
  );
}

/* ═══ Overview ═══ */
function Overview({ store, go }: { store: DemoStore; go: (t: Tab) => void }) {
  const attending = store.rsvps.filter(r => r.attending);
  const seats = attending.reduce((n, r) => n + r.party, 0);
  const invited = store.guests.reduce((n, g) => n + g.seats, 0);
  const responded = store.rsvps.reduce((n, r) => n + r.party, 0);
  const pendingMedia = store.memories.filter(m => m.status === 'pending').length;
  const checkedIn = store.guests.filter(g => g.checkedIn).reduce((n, g) => n + g.seats, 0);

  const stats = [
    { n: seats, label: 'Attending', sub: `${attending.length} replies`, tab: 'rsvps' as Tab },
    { n: store.rsvps.length - attending.length, label: 'Regrets', sub: 'with love, from afar', tab: 'rsvps' as Tab },
    { n: invited - responded, label: 'Awaiting reply', sub: `of ${invited} invited`, tab: 'guests' as Tab },
    { n: store.memories.length, label: 'Memories left', sub: pendingMedia ? `${pendingMedia} to review` : 'all reviewed', tab: 'memories' as Tab },
    { n: checkedIn, label: 'Checked in', sub: 'at the entrance', tab: 'guests' as Tab },
  ];

  const recent = [...store.rsvps].slice(-4).reverse();
  const featured = store.memories.filter(m => m.featured && m.status === 'approved').slice(0, 3);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2.6rem' }}>
        {stats.map(s => (
          <button key={s.label} onClick={() => go(s.tab)} style={{
            background: '#FFFEFB', border: `1px solid ${LINE}`, padding: '1.4rem 1.2rem',
            textAlign: 'left', cursor: 'pointer', minHeight: 44,
          }}>
            <p style={{ ...serif, fontSize: '2.1rem', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{s.n}</p>
            <p style={{ ...micro, color: GOLD, margin: '.7rem 0 .25rem' }}>{s.label}</p>
            <p style={{ ...italic, fontSize: '.8rem', color: '#8B8578' }}>{s.sub}</p>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,320px), 1fr))', gap: '1.4rem' }}>
        <section style={{ background: '#FFFEFB', border: `1px solid ${LINE}`, padding: '1.6rem' }}>
          <h2 style={{ ...micro, color: GOLD, marginBottom: '1.2rem' }}>Latest replies</h2>
          {recent.map(r => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', padding: '.75rem 0', borderBottom: `1px solid rgba(162,129,90,.1)` }}>
              <div>
                <p style={{ ...serif, fontSize: '.95rem' }}>{r.guest}</p>
                {r.note && <p style={{ ...italic, fontSize: '.82rem', color: '#8B8578', marginTop: '.2rem' }}>&ldquo;{r.note}&rdquo;</p>}
              </div>
              <Chip tone={r.attending ? 'attending' : 'regrets'}>{r.attending ? 'Attending' : 'Regrets'}</Chip>
            </div>
          ))}
        </section>

        <section style={{ background: '#FFFEFB', border: `1px solid ${LINE}`, padding: '1.6rem' }}>
          <h2 style={{ ...micro, color: GOLD, marginBottom: '1.2rem' }}>Featured memories</h2>
          {featured.map(m => (
            <div key={m.id} style={{ padding: '.75rem 0', borderBottom: `1px solid rgba(162,129,90,.1)` }}>
              <p style={{ ...micro, fontSize: '.48rem', color: '#8B8578', marginBottom: '.35rem' }}>{m.type} · {m.guest}</p>
              <p style={{ ...italic, fontSize: '.9rem', lineHeight: 1.6 }}>&ldquo;{m.caption}&rdquo;</p>
            </div>
          ))}
          <button onClick={() => go('memories')} style={{ ...tinyBtn, marginTop: '1.2rem' }}>Open the archive</button>
        </section>
      </div>
    </div>
  );
}

/* ═══ RSVPs ═══ */
function Rsvps({ store }: { store: DemoStore }) {
  const [filter, setFilter] = useState<'all' | 'attending' | 'regrets'>('all');
  const [q, setQ] = useState('');

  const rows = store.rsvps.filter(r =>
    (filter === 'all' || (filter === 'attending') === r.attending) &&
    (!q || r.guest.toLowerCase().includes(q.toLowerCase()))
  );

  const exportCsv = () => {
    const head = 'Guest,Seats,Reply,Dietary,Note,Received,Channel';
    const lines = store.rsvps.map(r =>
      [r.guest, r.party, r.attending ? 'Attending' : 'Regrets', r.dietary, r.note, r.when, r.channel]
        .map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    const blob = new Blob([[head, ...lines].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'maison-rsvps.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.4rem' }}>
        {(['all', 'attending', 'regrets'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            ...tinyBtn,
            color: filter === f ? INK : '#8B8578',
            borderColor: filter === f ? GOLD : LINE,
            background: filter === f ? 'rgba(162,129,90,.08)' : 'transparent',
          }}>{f === 'all' ? `All (${store.rsvps.length})` : f}</button>
        ))}
        <input
          value={q} onChange={e => setQ(e.target.value)} placeholder="Search guests…" aria-label="Search guests"
          style={{ ...italic, fontSize: '.9rem', padding: '.55em .9em', border: `1px solid ${LINE}`, background: '#FFFEFB', minWidth: 170, marginLeft: 'auto' }}
        />
        <button style={tinyBtn} onClick={exportCsv}>Export CSV</button>
      </div>

      <div className="demo-table-wrap" style={{ background: '#FFFEFB', border: `1px solid ${LINE}` }}>
        <table className="demo-table">
          <thead>
            <tr>
              {['Guest', 'Reply', 'Seats', 'Dietary', 'Note', 'Received'].map(h => (
                <th key={h} style={{ ...micro, fontSize: '.48rem', color: '#8B8578' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>
                  <p style={{ ...serif, fontSize: '.92rem' }}>{r.guest}</p>
                  <p style={{ ...micro, fontSize: '.44rem', color: '#A29A88', marginTop: '.3rem' }}>via {r.channel}</p>
                </td>
                <td><Chip tone={r.attending ? 'attending' : 'regrets'}>{r.attending ? 'Attending' : 'Regrets'}</Chip></td>
                <td style={{ ...sans, fontSize: '.85rem', fontVariantNumeric: 'tabular-nums' }}>{r.party}</td>
                <td style={{ ...italic, fontSize: '.85rem', color: '#6B6455' }}>{r.dietary || '—'}</td>
                <td style={{ ...italic, fontSize: '.85rem', color: '#6B6455', maxWidth: 260 }}>{r.note || '—'}</td>
                <td style={{ ...sans, fontSize: '.78rem', color: '#8B8578', whiteSpace: 'nowrap' }}>{r.when}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} style={{ ...italic, textAlign: 'center', color: '#8B8578', padding: '2.5rem' }}>No replies match.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <p style={{ ...italic, fontSize: '.85rem', color: '#8B8578', marginTop: '1.1rem' }}>
        Try it yourself — open the <Link href="/demo/invitation" style={{ color: GOLD }}>demo invitation</Link> and
        send an RSVP; it appears here instantly.
      </p>
    </div>
  );
}

/* ═══ Guests & check-in ═══ */
function Guests({ store, mutate }: { store: DemoStore; mutate: (fn: (s: DemoStore) => DemoStore) => void }) {
  const groups = [...new Set(store.guests.map(g => g.group))];
  return (
    <div>
      <p style={{ ...italic, fontSize: '.92rem', color: '#8B8578', marginBottom: '1.6rem', maxWidth: '60ch' }}>
        On the evening itself, the concierge greets each arrival by name — one tap marks the party as received.
      </p>
      {groups.map(group => (
        <section key={group} style={{ marginBottom: '1.8rem' }}>
          <h2 style={{ ...micro, color: GOLD, marginBottom: '.8rem' }}>{group}</h2>
          <div style={{ background: '#FFFEFB', border: `1px solid ${LINE}` }}>
            {store.guests.filter(g => g.group === group).map(g => (
              <div key={g.id} style={{
                display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
                padding: '.9rem 1.1rem', borderBottom: `1px solid rgba(162,129,90,.1)`,
              }}>
                <div style={{ flex: 1, minWidth: 150 }}>
                  <p style={{ ...serif, fontSize: '.95rem' }}>{g.name}</p>
                  <p style={{ ...sans, fontSize: '.72rem', color: '#8B8578', marginTop: '.2rem', fontVariantNumeric: 'tabular-nums' }}>
                    {g.seats} {g.seats === 1 ? 'seat' : 'seats'}
                  </p>
                </div>
                <Chip tone={g.status}>{g.status}</Chip>
                <button
                  onClick={() => mutate(s => {
                    const t = s.guests.find(x => x.id === g.id);
                    if (t) t.checkedIn = !t.checkedIn;
                    return s;
                  })}
                  disabled={g.status !== 'attending'}
                  style={{
                    ...tinyBtn,
                    opacity: g.status === 'attending' ? 1 : .35,
                    cursor: g.status === 'attending' ? 'pointer' : 'default',
                    color: g.checkedIn ? '#4A6741' : '#6B6455',
                    borderColor: g.checkedIn ? 'rgba(126,143,110,.5)' : LINE,
                    background: g.checkedIn ? 'rgba(126,143,110,.1)' : 'transparent',
                  }}
                >{g.checkedIn ? '✓ Checked in' : 'Check in'}</button>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ═══ Memories archive ═══ */
const PHASES: { id: MemoryPhase | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'before', label: 'Before the party' },
  { id: 'party', label: 'The party' },
  { id: 'after', label: 'After the party' },
];
const TYPES: { id: MemoryType | 'all'; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'photo', label: 'Photographs' },
  { id: 'video', label: 'Videos' },
  { id: 'voice', label: 'Voice notes' },
  { id: 'message', label: 'Messages' },
];

function Memories({ store, mutate }: { store: DemoStore; mutate: (fn: (s: DemoStore) => DemoStore) => void }) {
  const [phase, setPhase] = useState<MemoryPhase | 'all'>('all');
  const [type, setType] = useState<MemoryType | 'all'>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const chime = useChime();

  const toggleVoice = (id: string) => {
    if (playingId === id) { chime.stop(); setPlayingId(null); return; }
    chime.stop();
    setPlayingId(id);
    chime.play(() => setPlayingId(p => (p === id ? null : p)));
  };
  useEffect(() => () => chime.stop(), [chime]);

  const items = store.memories.filter(m =>
    (phase === 'all' || m.phase === phase) && (type === 'all' || m.type === type)
  );

  const setStatus = (id: string, status: DemoMemory['status']) =>
    mutate(s => { const t = s.memories.find(x => x.id === id); if (t) t.status = status; return s; });
  const toggleFeature = (id: string) =>
    mutate(s => { const t = s.memories.find(x => x.id === id); if (t) t.featured = !t.featured; return s; });
  const remove = (id: string) =>
    mutate(s => { s.memories = s.memories.filter(x => x.id !== id); return s; });

  return (
    <div>
      <p style={{ ...italic, fontSize: '.92rem', color: '#8B8578', marginBottom: '1.4rem', maxWidth: '62ch' }}>
        Guests scan the Memories QR at the celebration to leave photographs, videos, voice notes, and written
        dedications — before the day, during the party, and after. You curate what enters the final archive.
      </p>

      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '.8rem' }}>
        {PHASES.map(p => (
          <button key={p.id} onClick={() => setPhase(p.id)} style={{
            ...tinyBtn,
            color: phase === p.id ? INK : '#8B8578',
            borderColor: phase === p.id ? GOLD : LINE,
            background: phase === p.id ? 'rgba(162,129,90,.08)' : 'transparent',
          }}>{p.label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1.6rem' }}>
        {TYPES.map(t => (
          <button key={t.id} onClick={() => setType(t.id)} style={{
            ...tinyBtn, fontSize: '.44rem',
            color: type === t.id ? INK : '#A29A88',
            borderColor: type === t.id ? 'rgba(162,129,90,.45)' : 'rgba(162,129,90,.15)',
          }}>{t.label}</button>
        ))}
      </div>

      <div className="demo-grid">
        {items.map(m => (
          <article key={m.id} style={{
            background: '#FFFEFB', border: `1px solid ${m.status === 'pending' ? 'rgba(162,129,90,.5)' : LINE}`,
            display: 'flex', flexDirection: 'column',
            opacity: m.status === 'hidden' ? .55 : 1,
          }}>
            {/* media */}
            {m.type === 'photo' && m.src && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.src} alt={m.caption} loading="lazy" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
            )}
            {m.type === 'video' && m.src && (
              <video src={m.src} muted loop playsInline preload="metadata"
                onMouseEnter={e => e.currentTarget.play().catch(() => {})}
                onMouseLeave={e => e.currentTarget.pause()}
                style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', background: '#14110C' }}
              />
            )}
            <div style={{ padding: '1rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '.7rem', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '.6rem', alignItems: 'center' }}>
                <span style={{ ...micro, fontSize: '.46rem', color: GOLD }}>
                  {m.type}{m.duration ? ` · ${m.duration}` : ''} · {m.when}
                </span>
                {m.status !== 'approved'
                  ? <Chip tone={m.status === 'pending' ? 'pending' : 'hidden'}>{m.status === 'pending' ? 'To review' : 'Hidden'}</Chip>
                  : m.featured && <span style={{ ...micro, fontSize: '.44rem', color: GOLD }}>★ Featured</span>}
              </div>

              {m.type === 'voice' && (
                <VoiceNote duration={m.duration ?? '0:30'} playing={playingId === m.id} onToggle={() => toggleVoice(m.id)} />
              )}

              <p style={{ ...italic, fontSize: m.type === 'message' ? '.98rem' : '.86rem', lineHeight: 1.65, flex: 1 }}>
                &ldquo;{m.caption}&rdquo;
              </p>
              <p style={{ ...serif, fontSize: '.82rem', color: '#6B6455' }}>— {m.guest}</p>

              <div style={{ display: 'flex', gap: '.45rem', flexWrap: 'wrap' }}>
                {m.status !== 'approved' && <button style={{ ...tinyBtn, color: '#4A6741', borderColor: 'rgba(126,143,110,.5)' }} onClick={() => setStatus(m.id, 'approved')}>Approve</button>}
                {m.status === 'approved' && (
                  <>
                    <button style={tinyBtn} onClick={() => toggleFeature(m.id)}>{m.featured ? 'Unfeature' : 'Feature'}</button>
                    <button style={tinyBtn} onClick={() => setStatus(m.id, 'hidden')}>Hide</button>
                  </>
                )}
                {m.status === 'hidden' && <button style={tinyBtn} onClick={() => setStatus(m.id, 'approved')}>Restore</button>}
                <button style={{ ...tinyBtn, color: '#8C4A3F', borderColor: 'rgba(176,94,78,.35)' }} onClick={() => remove(m.id)}>Remove</button>
              </div>
            </div>
          </article>
        ))}
        {items.length === 0 && (
          <p style={{ ...italic, color: '#8B8578', padding: '2rem 0' }}>Nothing here yet for this filter.</p>
        )}
      </div>
    </div>
  );
}

/* ═══ QR & Share ═══ */
function Share() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const u = `${window.location.origin}/demo/invitation`;
    setUrl(u);
    import('qrcode').then(({ default: QRCode }) => {
      if (!canvasRef.current) return;
      QRCode.toCanvas(canvasRef.current, u, {
        width: 240, margin: 1,
        color: { dark: '#14110C', light: '#F8F5F0' },
      }).catch(() => {});
    });
  }, []);

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/png');
    a.download = 'maison-invitation-qr.png';
    a.click();
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* ignore */ }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,300px), 1fr))', gap: '1.6rem', alignItems: 'start' }}>
      <section style={{ background: '#FFFEFB', border: `1px solid ${LINE}`, padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ ...micro, color: GOLD, marginBottom: '1.4rem' }}>The invitation QR</h2>
        <div style={{ display: 'inline-block', padding: 14, border: `1px solid ${LINE}` }}>
          <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%' }} aria-label={`QR code linking to ${url}`} />
        </div>
        <p style={{ ...italic, fontSize: '.85rem', color: '#8B8578', margin: '1.2rem auto 1.4rem', maxWidth: '36ch', lineHeight: 1.7 }}>
          Printed on place cards, welcome signage, or a wax-sealed card — one scan opens the invitation.
        </p>
        <div style={{ display: 'flex', gap: '.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={btn(true)} onClick={download}>Download PNG</button>
          <a href="/demo/invitation" target="_blank" rel="noreferrer" style={{ ...btn(), textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Open invitation
          </a>
        </div>
      </section>

      <section style={{ background: '#FFFEFB', border: `1px solid ${LINE}`, padding: '2rem' }}>
        <h2 style={{ ...micro, color: GOLD, marginBottom: '1.4rem' }}>The private link</h2>
        <div style={{
          ...sans, fontSize: '.78rem', color: '#6B6455', wordBreak: 'break-all',
          border: `1px solid ${LINE}`, background: IVORY, padding: '1rem 1.1rem', marginBottom: '1rem',
        }}>{url}</div>
        <button style={tinyBtn} onClick={copy}>{copied ? 'Copied ✓' : 'Copy link'}</button>

        <div style={{ borderTop: `1px solid ${LINE}`, marginTop: '1.8rem', paddingTop: '1.6rem' }}>
          <h3 style={{ ...micro, color: GOLD, marginBottom: '1rem' }}>How guests receive it</h3>
          {[
            ['By message', 'Text or WhatsApp — the link unfurls with your names and date.'],
            ['By email', 'A composed announcement from your own concierge address.'],
            ['By QR card', 'Letterpress cards with the code — scan, and the experience begins.'],
          ].map(([t, d]) => (
            <div key={t} style={{ padding: '.7rem 0', borderBottom: '1px solid rgba(162,129,90,.1)' }}>
              <p style={{ ...serif, fontSize: '.9rem', marginBottom: '.25rem' }}>{t}</p>
              <p style={{ ...italic, fontSize: '.84rem', color: '#8B8578', lineHeight: 1.6 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
