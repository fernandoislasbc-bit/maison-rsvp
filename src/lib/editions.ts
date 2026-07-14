/* ─────────────────────────────────────────────────────────────
   Maison Editions — the free invitation maker.
   Invitations are stateless: the entire invitation is encrypted
   into its own URL token (AES-256-GCM + deflate). Nothing is
   stored. RSVPs are delivered to the creator by email.
   ───────────────────────────────────────────────────────────── */

export type EditionTemplateId = 'garden' | 'nocturne' | 'riviera';

export type Edition = {
  t: EditionTemplateId;   // template
  n1: string;             // first host name
  n2: string;             // second host name (optional)
  o: string;              // occasion line, e.g. "are getting married"
  d: string;              // date display string
  h: string;              // time, optional
  v: string;              // venue
  c: string;              // city / region
  m: string;              // personal message, optional
  e: string;              // creator email — RSVPs are sent here
};

export type EditionTemplateMeta = {
  id: EditionTemplateId;
  name: string;
  tagline: string;
  description: string;
  palette: string[];       // swatches shown in the gallery
  keywords: string;        // for the gallery card alt/SEO copy
};

export const EDITION_TEMPLATES: EditionTemplateMeta[] = [
  {
    id: 'garden',
    name: 'The Garden',
    tagline: 'Botanical, ivory & sage',
    description: 'A soft botanical invitation — ivory linen, sage foliage, and blush accents. For garden weddings, spring celebrations, and afternoon ceremonies.',
    palette: ['#F8F5F0', '#8A9B7C', '#D9A6A0', '#A2815A'],
    keywords: 'botanical wedding invitation, garden party invitation',
  },
  {
    id: 'nocturne',
    name: 'The Nocturne',
    tagline: 'Ink, gold & candlelight',
    description: 'An evening invitation in deep ink and gold — hairline borders, serif typography, and a candlelit glow. For black-tie weddings, galas, and dinners after dark.',
    palette: ['#0E0D0B', '#A2815A', '#F8F5F0', '#1A1208'],
    keywords: 'elegant black and gold invitation, formal dinner invitation',
  },
  {
    id: 'riviera',
    name: 'The Riviera',
    tagline: 'Cobalt, citrus & sea light',
    description: 'A Mediterranean invitation — cobalt blue on white, citrus accents, and easy coastal air. For destination weddings, summer celebrations, and seaside events.',
    palette: ['#FDFCF9', '#1F3F8F', '#E9B44C', '#6B88C4'],
    keywords: 'mediterranean wedding invitation, destination wedding invitation',
  },
];

export const OCCASIONS = [
  'are getting married',
  'invite you to celebrate',
  'request the pleasure of your company',
  'are hosting a celebration',
];

/* ─── Server-side token crypto (do not import in client code) ─── */

export async function encodeEdition(data: Edition): Promise<string> {
  const { createCipheriv, randomBytes, createHash } = await import('crypto');
  const { deflateRawSync } = await import('zlib');
  const key = createHash('sha256')
    .update(process.env.EDITIONS_SECRET || process.env.MAISON_EMAIL_KEY || 'maison-editions-dev')
    .digest();
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const plain = deflateRawSync(Buffer.from(JSON.stringify(data), 'utf8'));
  const enc = Buffer.concat([cipher.update(plain), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString('base64url');
}

export async function decodeEdition(token: string): Promise<Edition | null> {
  try {
    const { createDecipheriv, createHash } = await import('crypto');
    const { inflateRawSync } = await import('zlib');
    const key = createHash('sha256')
      .update(process.env.EDITIONS_SECRET || process.env.MAISON_EMAIL_KEY || 'maison-editions-dev')
      .digest();
    const buf = Buffer.from(token, 'base64url');
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const enc = buf.subarray(28);
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const plain = Buffer.concat([decipher.update(enc), decipher.final()]);
    const data = JSON.parse(inflateRawSync(plain).toString('utf8')) as Edition;
    if (!data.n1 || !data.t || !data.d) return null;
    return data;
  } catch {
    return null;
  }
}

/* ─── Shared validation (client + server) ─── */

export const EDITION_LIMITS = {
  name: 40, occasion: 60, date: 60, time: 30, venue: 80, city: 60, message: 300,
};

export function validateEdition(x: Partial<Edition>): string | null {
  if (!x.t || !EDITION_TEMPLATES.some(t => t.id === x.t)) return 'Please choose a design.';
  if (!x.n1?.trim()) return 'Please add at least one name.';
  if (!x.d?.trim()) return 'Please add the date.';
  if (!x.v?.trim()) return 'Please add the venue.';
  if (!x.e || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(x.e)) return 'A valid email is needed to receive your RSVPs.';
  const L = EDITION_LIMITS;
  if ((x.n1 ?? '').length > L.name || (x.n2 ?? '').length > L.name) return 'Names are a little long.';
  if ((x.m ?? '').length > L.message) return 'The message is a little long.';
  if ((x.v ?? '').length > L.venue || (x.c ?? '').length > L.city) return 'The venue text is a little long.';
  return null;
}
