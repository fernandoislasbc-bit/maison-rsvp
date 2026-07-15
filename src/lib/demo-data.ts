/* ─────────────────────────────────────────────────────────────
   Platform demo — the fictional wedding of Isabella & Alexander.
   Everything is client-side: the seed below is written to
   localStorage on first visit, and every action in the demo
   dashboard (approve, hide, check-in, RSVP…) mutates that copy.
   "Reset demo" restores this file's state.
   ───────────────────────────────────────────────────────────── */

export type DemoRsvp = {
  id: string;
  guest: string;
  party: number;              // seats incl. the guest
  attending: boolean;
  dietary: string;
  note: string;
  when: string;               // display date
  channel: 'Invitation' | 'QR card' | 'Concierge';
};

export type DemoGuest = {
  id: string;
  name: string;
  group: string;              // table / party grouping
  seats: number;
  status: 'attending' | 'regrets' | 'pending';
  checkedIn: boolean;
};

export type MemoryType = 'photo' | 'video' | 'voice' | 'message';
export type MemoryPhase = 'before' | 'party' | 'after';

export type DemoMemory = {
  id: string;
  type: MemoryType;
  phase: MemoryPhase;
  guest: string;
  caption: string;            // caption, or the written message itself
  src?: string;               // photo/video source
  duration?: string;          // voice/video length
  status: 'approved' | 'pending' | 'hidden';
  featured: boolean;
  when: string;
};

export type DemoStore = {
  v: number;
  rsvps: DemoRsvp[];
  guests: DemoGuest[];
  memories: DemoMemory[];
};

export const DEMO_KEY = 'maison-demo-v1';

export const DEMO_COUPLE = {
  names: 'Isabella & Alexander',
  date: 'Saturday, June 12th, 2027',
  venue: 'The Orchard House',
  city: 'Vancouver',
};

export const DEMO_SEED: DemoStore = {
  v: 1,
  rsvps: [
    { id: 'r1',  guest: 'Margaux Delacroix',   party: 2, attending: true,  dietary: 'Vegetarian',        note: 'We would not miss it for the world.',            when: 'May 2',  channel: 'Invitation' },
    { id: 'r2',  guest: 'Henry & June Ashford', party: 2, attending: true,  dietary: '',                  note: 'Counting the days. All our love.',               when: 'May 2',  channel: 'Invitation' },
    { id: 'r3',  guest: 'Sofía Herrera',        party: 1, attending: true,  dietary: 'Gluten-free',       note: '',                                               when: 'May 3',  channel: 'QR card' },
    { id: 'r4',  guest: 'Thomas Lindqvist',     party: 2, attending: false, dietary: '',                  note: 'Heartbroken to miss it — we will toast from Stockholm.', when: 'May 4', channel: 'Invitation' },
    { id: 'r5',  guest: 'Amara Okafor',         party: 1, attending: true,  dietary: 'No shellfish',      note: 'Honoured to be there.',                          when: 'May 5',  channel: 'Invitation' },
    { id: 'r6',  guest: 'The Rossi Family',     party: 4, attending: true,  dietary: 'One vegan',         note: 'Arriving Thursday from Milan.',                  when: 'May 6',  channel: 'QR card' },
    { id: 'r7',  guest: 'Claire Beaumont',      party: 1, attending: true,  dietary: '',                  note: '',                                               when: 'May 8',  channel: 'Concierge' },
    { id: 'r8',  guest: 'Daniel & Priya Shah',  party: 2, attending: true,  dietary: 'Vegetarian ×2',     note: 'So proud of you both.',                          when: 'May 9',  channel: 'Invitation' },
    { id: 'r9',  guest: 'Lucas Moreau',         party: 1, attending: false, dietary: '',                  note: 'Deployed until August — sending a gift and a long letter.', when: 'May 11', channel: 'Invitation' },
    { id: 'r10', guest: 'Grandmother Rose',     party: 1, attending: true,  dietary: 'Soft menu, please', note: 'My darling girl. Of course.',                    when: 'May 12', channel: 'Concierge' },
  ],
  guests: [
    { id: 'g1',  name: 'Margaux Delacroix',    group: 'Table I — Family',    seats: 2, status: 'attending', checkedIn: true },
    { id: 'g2',  name: 'Henry & June Ashford', group: 'Table II — Ashfords', seats: 2, status: 'attending', checkedIn: true },
    { id: 'g3',  name: 'Sofía Herrera',        group: 'Table III — Friends', seats: 1, status: 'attending', checkedIn: false },
    { id: 'g4',  name: 'Thomas Lindqvist',     group: 'Table III — Friends', seats: 2, status: 'regrets',   checkedIn: false },
    { id: 'g5',  name: 'Amara Okafor',         group: 'Table III — Friends', seats: 1, status: 'attending', checkedIn: true },
    { id: 'g6',  name: 'The Rossi Family',     group: 'Table IV — Milan',    seats: 4, status: 'attending', checkedIn: false },
    { id: 'g7',  name: 'Claire Beaumont',      group: 'Table II — Ashfords', seats: 1, status: 'attending', checkedIn: false },
    { id: 'g8',  name: 'Daniel & Priya Shah',  group: 'Table V — Colleagues', seats: 2, status: 'attending', checkedIn: false },
    { id: 'g9',  name: 'Lucas Moreau',         group: 'Table V — Colleagues', seats: 1, status: 'regrets',  checkedIn: false },
    { id: 'g10', name: 'Grandmother Rose',     group: 'Table I — Family',    seats: 1, status: 'attending', checkedIn: true },
    { id: 'g11', name: 'Eleanor Whitfield',    group: 'Table IV — Milan',    seats: 2, status: 'pending',   checkedIn: false },
    { id: 'g12', name: 'The Tanaka Family',    group: 'Table VI — Kyoto',    seats: 3, status: 'pending',   checkedIn: false },
  ],
  memories: [
    // ── Before the party ──
    { id: 'm1',  type: 'message', phase: 'before', guest: 'Margaux Delacroix', caption: 'I still remember the night Isabella called me about a boy named Alexander. Six years later, here we are. My heart is full.', status: 'approved', featured: true,  when: 'June 2' },
    { id: 'm2',  type: 'photo',   phase: 'before', guest: 'Henry Ashford',     caption: 'Found this from the summer you two met.', src: '/assets/editorial-2.jpg', status: 'approved', featured: false, when: 'June 4' },
    { id: 'm3',  type: 'voice',   phase: 'before', guest: 'Grandmother Rose',  caption: 'A blessing for the morning of the wedding.', duration: '0:42', status: 'approved', featured: true,  when: 'June 8' },
    { id: 'm4',  type: 'photo',   phase: 'before', guest: 'Sofía Herrera',     caption: 'Rehearsal dinner, golden hour.', src: '/assets/editorial-3.jpg', status: 'pending', featured: false, when: 'June 11' },
    // ── During the party ──
    { id: 'm5',  type: 'video',   phase: 'party',  guest: 'Daniel Shah',       caption: 'The first dance, from our table.', src: '/assets/invitation.mp4', duration: '0:31', status: 'approved', featured: true,  when: 'June 12' },
    { id: 'm6',  type: 'photo',   phase: 'party',  guest: 'Amara Okafor',      caption: 'The courtyard at ten.', src: '/assets/editorial-5.jpg', status: 'approved', featured: false, when: 'June 12' },
    { id: 'm7',  type: 'voice',   phase: 'party',  guest: 'Marco Rossi',       caption: 'A toast, in Italian and bad English.', duration: '1:05', status: 'approved', featured: false, when: 'June 12' },
    { id: 'm8',  type: 'photo',   phase: 'party',  guest: 'Claire Beaumont',   caption: 'Caught the exact moment of the toast.', src: '/assets/editorial-6.jpg', status: 'pending', featured: false, when: 'June 12' },
    { id: 'm9',  type: 'message', phase: 'party',  guest: 'Priya Shah',        caption: 'Nobody has ever looked at anyone the way Alexander looked at you tonight.', status: 'approved', featured: false, when: 'June 12' },
    { id: 'm10', type: 'video',   phase: 'party',  guest: 'June Ashford',      caption: 'Sparklers at midnight.', src: '/assets/hero.mp4', duration: '0:18', status: 'pending', featured: false, when: 'June 12' },
    // ── After the party ──
    { id: 'm11', type: 'message', phase: 'after',  guest: 'Thomas Lindqvist',  caption: 'Watched every video from Stockholm at 3am, crying happily into my coffee. Congratulations, you two.', status: 'approved', featured: false, when: 'June 13' },
    { id: 'm12', type: 'photo',   phase: 'after',  guest: 'Eleanor Whitfield', caption: 'The morning after — the orchard, quiet again.', src: '/assets/editorial-7.jpg', status: 'approved', featured: false, when: 'June 14' },
    { id: 'm13', type: 'voice',   phase: 'after',  guest: 'Isabella',          caption: 'A thank-you to everyone who left a memory here.', duration: '1:22', status: 'approved', featured: true,  when: 'June 15' },
  ],
};

/* ── localStorage helpers (client only) ── */

export function loadDemo(): DemoStore {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (raw) {
      const s = JSON.parse(raw) as DemoStore;
      if (s && s.v === DEMO_SEED.v) return s;
    }
  } catch { /* fall through to seed */ }
  const fresh = structuredClone(DEMO_SEED);
  try { localStorage.setItem(DEMO_KEY, JSON.stringify(fresh)); } catch { /* ignore */ }
  return fresh;
}

export function saveDemo(s: DemoStore) {
  try { localStorage.setItem(DEMO_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

export function resetDemo(): DemoStore {
  const fresh = structuredClone(DEMO_SEED);
  try { localStorage.setItem(DEMO_KEY, JSON.stringify(fresh)); } catch { /* ignore */ }
  return fresh;
}
