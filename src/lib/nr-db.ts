/* ─────────────────────────────────────────────────────────────
   Neil & Riley — connected wedding platform data layer.
   A file-backed store on the server (.nr-data/db.json) shared by
   every device: invitations, RSVPs, QR passes, check-ins, and
   guest memories. Server-only — never import in client code.
   The API surface is small on purpose so this file can later be
   swapped for Supabase without touching any UI.
   ───────────────────────────────────────────────────────────── */

import path from 'path';
import { mkdir, readFile, writeFile } from 'fs/promises';

export const NR_DATA_DIR = path.join(process.cwd(), '.nr-data');
export const NR_MEDIA_DIR = path.join(NR_DATA_DIR, 'media');
const DB_PATH = path.join(NR_DATA_DIR, 'db.json');

export const NR_EVENT = {
  couple: 'Neil & Riley',
  date: 'Saturday, September 14th, 2026',
  time: 'Four o’clock in the afternoon',
  venue: 'Acquafarina',
  city: 'Vancouver, British Columbia',
  dress: 'Black tie optional — formal attire encouraged.',
  schedule: [
    { t: '3:30 PM', title: 'Doors Open', line: 'Guests arrive and are welcomed.' },
    { t: '4:00 PM', title: 'Ceremony', line: 'The vows are exchanged.' },
    { t: '5:00 PM', title: 'Cocktail Hour', line: 'Champagne and canapés.' },
    { t: '6:00 PM', title: 'Dinner', line: 'Fine dining at Acquafarina.' },
    { t: '8:00 PM', title: 'Celebration', line: 'Dancing and festivities begin.' },
  ],
  meals: ['Roasted duck, cherry jus', 'Wild salmon, brown butter', 'Autumn vegetable Wellington'],
};

export type NrGuest = {
  id: string;
  code: string;               // unique access code, e.g. RILEY1
  name: string;               // party name on the envelope
  seats: number;              // maximum seats permitted
  message: string;            // the couple's personal note to this guest
  /* RSVP */
  rsvp: null | {
    attending: boolean;
    seatsConfirmed: number;
    meals: string[];          // one entry per confirmed seat
    dietary: string;
    note: string;
    at: number;               // epoch ms
  };
  /* Entrance pass */
  passVersion: number;        // bump to invalidate issued QR codes
  passActive: boolean;        // false until an accepting RSVP exists
  checkedInAt: number | null;
};

export type NrMemory = {
  id: string;
  guestId: string;
  guestName: string;
  type: 'photo' | 'video' | 'message';
  caption: string;            // caption, or the written message itself
  mediaId?: string;           // file id in NR_MEDIA_DIR
  mime?: string;
  status: 'pending' | 'approved' | 'hidden';
  at: number;
};

export type NrDb = {
  v: number;
  guests: NrGuest[];
  memories: NrMemory[];
};

/* ── Seed — realistic demo data so the whole journey is testable ── */

const g = (id: string, code: string, name: string, seats: number, message: string,
  rsvp: NrGuest['rsvp'] = null, checkedInAt: number | null = null): NrGuest => ({
  id, code, name, seats, message, rsvp,
  passVersion: 1,
  passActive: !!rsvp?.attending,
  checkedInAt,
});

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();

const SEED: NrDb = {
  v: 1,
  guests: [
    g('n01', 'ASHFRD', 'Eleanor & James Ashford', 2, 'Riley’s godparents — our first phone call after the proposal. Front row, always.',
      { attending: true, seatsConfirmed: 2, meals: ['Roasted duck, cherry jus', 'Wild salmon, brown butter'], dietary: '', note: 'We have been waiting years for this call.', at: now - 21 * DAY }),
    g('n02', 'MRGX26', 'Margaux Delacroix', 1, 'The maid of honour needs no introduction. Champagne is already on ice.',
      { attending: true, seatsConfirmed: 1, meals: ['Autumn vegetable Wellington'], dietary: 'Vegetarian', note: 'Speech is written. Tissues advised.', at: now - 19 * DAY }),
    g('n03', 'OKFR26', 'Amara & Tobi Okafor', 2, 'From Lagos to Vancouver — thank you for crossing the world for us.',
      { attending: true, seatsConfirmed: 2, meals: ['Roasted duck, cherry jus', 'Roasted duck, cherry jus'], dietary: 'No shellfish', note: '', at: now - 15 * DAY }),
    g('n04', 'LNDQST', 'Thomas Lindqvist', 2, 'Neil’s oldest friend. Bring Astrid — and the stories from Stockholm we can’t print.',
      { attending: false, seatsConfirmed: 0, meals: [], dietary: '', note: 'Astrid is due that very week — we will toast you from the hospital.', at: now - 12 * DAY }),
    g('n05', 'ROSSI4', 'The Rossi Family', 4, 'Milan taught us how to celebrate. Show Vancouver how it’s done.',
      { attending: true, seatsConfirmed: 4, meals: ['Roasted duck, cherry jus', 'Wild salmon, brown butter', 'Wild salmon, brown butter', 'Autumn vegetable Wellington'], dietary: 'One vegan (Sofia)', note: 'Arriving Thursday. Espresso requirements to follow.', at: now - 9 * DAY }),
    g('n06', 'GRDMRS', 'Grandmother Rose', 1, 'The reason we believe in long love stories. A car will collect you at three.',
      { attending: true, seatsConfirmed: 1, meals: ['Wild salmon, brown butter'], dietary: 'Soft menu, please', note: 'My darlings. Of course.', at: now - 8 * DAY }, now - 2 * 60 * 60 * 1000),
    g('n07', 'SHAH26', 'Daniel & Priya Shah', 2, 'Our favourite dinner-party rivals. The rematch happens on the dance floor.',
      { attending: true, seatsConfirmed: 2, meals: ['Autumn vegetable Wellington', 'Autumn vegetable Wellington'], dietary: 'Vegetarian ×2', note: 'So proud of you both.', at: now - 6 * DAY }),
    g('n08', 'BMONT1', 'Claire Beaumont', 1, 'Riley’s first editor, and the first person who said “marry him.”', null),
    g('n09', 'TNKA26', 'The Tanaka Family', 3, 'Kyoto in autumn taught us everything about beauty. We hope this comes close.', null),
    g('n10', 'WHTFLD', 'Eleanor Whitfield', 2, 'Neil’s aunt, keeper of the family recipes and the best toasts.', null),
    g('n11', 'MOREAU', 'Lucas Moreau', 1, 'Brother in everything but paperwork. Dust off the good suit.', null),
    g('n12', 'HRRRA1', 'Sofía Herrera', 1, 'The photographer becomes the photographed. No camera allowed at dinner.',
      { attending: true, seatsConfirmed: 1, meals: ['Wild salmon, brown butter'], dietary: 'Gluten-free', note: 'One small camera. Negotiable.', at: now - 3 * DAY }),
  ],
  memories: [
    { id: 'mem01', guestId: 'n02', guestName: 'Margaux Delacroix', type: 'message', caption: 'I was there the night you two met — I have never seen two people forget an entire party existed. See you in October.', status: 'approved', at: now - 10 * DAY },
    { id: 'mem02', guestId: 'n06', guestName: 'Grandmother Rose', type: 'message', caption: 'Sixty-two years ago someone waited for me under glass and maples too. Wear comfortable shoes and never stop dancing.', status: 'approved', at: now - 7 * DAY },
    { id: 'mem03', guestId: 'n05', guestName: 'The Rossi Family', type: 'message', caption: 'Vancouver has no idea what is coming. Neither does the dance floor. Vi vogliamo bene.', status: 'pending', at: now - 2 * DAY },
  ],
};

/* ── Store: read + serialized writes ── */

let queue: Promise<unknown> = Promise.resolve();

async function ensure(): Promise<void> {
  await mkdir(NR_MEDIA_DIR, { recursive: true });
  try { await readFile(DB_PATH); }
  catch { await writeFile(DB_PATH, JSON.stringify(SEED, null, 2)); }
}

export async function nrRead(): Promise<NrDb> {
  await ensure();
  const raw = await readFile(DB_PATH, 'utf8');
  return JSON.parse(raw) as NrDb;
}

/** Serialized read-modify-write; return a value from the mutator if needed. */
export function nrWrite<T>(fn: (db: NrDb) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const db = await nrRead();
    const out = await fn(db);
    await writeFile(DB_PATH, JSON.stringify(db, null, 2));
    return out;
  });
  queue = run.catch(() => {});
  return run;
}

export async function nrReset(): Promise<void> {
  await nrWrite(db => {
    db.guests = structuredClone(SEED.guests);
    db.memories = structuredClone(SEED.memories);
  });
}

/* ── Helpers ── */

export const findByCode = (db: NrDb, code: string): NrGuest | undefined =>
  db.guests.find(x => x.code.toUpperCase() === code.trim().toUpperCase());

export const publicGuest = (x: NrGuest) => ({
  id: x.id, name: x.name, seats: x.seats, message: x.message,
  rsvp: x.rsvp, passActive: x.passActive, checkedInAt: x.checkedInAt,
});

export function newCode(db: NrDb): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  for (;;) {
    let c = '';
    for (let i = 0; i < 6; i++) c += alphabet[Math.floor(Math.random() * alphabet.length)];
    if (!db.guests.some(x => x.code === c)) return c;
  }
}
