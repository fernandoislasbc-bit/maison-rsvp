/* ─────────────────────────────────────────────────────────────
   Atelier configurator — curated data.
   Themes, occasions, image treatments, typography pairings and
   the deterministic recommendation rules that connect them.
   ───────────────────────────────────────────────────────────── */

export type ThemeId =
  | 'timeless' | 'romantic' | 'editorial' | 'minimal'
  | 'botanical' | 'coastal' | 'italian' | 'evening';

export type TreatmentId = 'natural' | 'film' | 'mono' | 'dreamy';
export type TypographyId = 'classic' | 'modern' | 'script' | 'contemporary';
export type Alignment = 'center' | 'left';
export type TypeScale = 'intimate' | 'classic' | 'grand';

export type InvitationDesign = {
  occasion: string;
  theme: ThemeId | '';
  /** object URL, client-only — never persisted or shared */
  image: string | null;
  imagePosition: { x: number; y: number; zoom: number };
  imageEffect: TreatmentId | '';
  typography: TypographyId | '';
  alignment: Alignment;
  scale: TypeScale;
  details: {
    title: string;
    names: string;
    date: string;
    time: string;
    venue: string;
    location: string;
    message: string;
    rsvpLabel: string;
    rsvpUrl: string;
    email: string;
  };
};

export const DEFAULT_DESIGN: InvitationDesign = {
  occasion: '',
  theme: '',
  image: null,
  imagePosition: { x: 50, y: 50, zoom: 1 },
  imageEffect: '',
  typography: '',
  alignment: 'center',
  scale: 'classic',
  details: {
    title: '', names: '', date: '', time: '', venue: '', location: '',
    message: '', rsvpLabel: 'Kindly reply', rsvpUrl: '', email: '',
  },
};

/* ─── Occasions ─── */

export type OccasionMeta = {
  id: string; label: string; line: string; glyph: string;
  suggestedThemes: ThemeId[];
};

export const OCCASIONS_B: OccasionMeta[] = [
  { id: 'wedding',      label: 'Wedding',        line: 'are getting married',                    glyph: '∞', suggestedThemes: ['timeless', 'romantic'] },
  { id: 'save-date',    label: 'Save the Date',  line: 'are saving the date',                    glyph: '✳', suggestedThemes: ['minimal', 'editorial'] },
  { id: 'engagement',   label: 'Engagement',     line: 'are engaged',                            glyph: '❍', suggestedThemes: ['romantic', 'italian'] },
  { id: 'birthday',     label: 'Birthday',       line: 'invites you to celebrate',               glyph: '✦', suggestedThemes: ['editorial', 'coastal'] },
  { id: 'anniversary',  label: 'Anniversary',    line: 'celebrate their anniversary',            glyph: '◌', suggestedThemes: ['timeless', 'evening'] },
  { id: 'dinner',       label: 'Private Dinner', line: 'request the pleasure of your company',   glyph: '❖', suggestedThemes: ['evening', 'minimal'] },
  { id: 'corporate',    label: 'Corporate Event',line: 'cordially invite you',                   glyph: '▣', suggestedThemes: ['editorial', 'evening'] },
  { id: 'other',        label: 'Other',          line: 'invite you to celebrate',                glyph: '·', suggestedThemes: ['timeless', 'minimal'] },
];

/* ─── Themes ─── */

export type ThemeMeta = {
  id: ThemeId;
  name: string;
  line: string;
  /** invitation palette */
  bg: string; ink: string; accent: string; soft: string; rule: string;
  /** swatch preview for the picker card */
  swatch: [string, string, string];
  /** decorative frame style on the invitation */
  frame: 'none' | 'hairline' | 'double' | 'corners';
  dark?: boolean;
  recommendedTreatments: [TreatmentId, TreatmentId];
  recommendedType: TypographyId[];
};

export const THEMES: ThemeMeta[] = [
  {
    id: 'timeless', name: 'Timeless', line: 'Ivory, serif calm, quiet gold.',
    bg: '#F8F5F0', ink: '#2C271F', accent: '#A2815A', soft: '#8B8578', rule: 'rgba(162,129,90,.35)',
    swatch: ['#F8F5F0', '#A2815A', '#2C271F'], frame: 'hairline',
    recommendedTreatments: ['natural', 'mono'], recommendedType: ['classic', 'script', 'modern', 'contemporary'],
  },
  {
    id: 'romantic', name: 'Romantic', line: 'Blush warmth and soft light.',
    bg: '#FAF4F0', ink: '#4A3A34', accent: '#C08A7E', soft: '#A08B82', rule: 'rgba(192,138,126,.4)',
    swatch: ['#FAF4F0', '#C08A7E', '#E8D5CC'], frame: 'corners',
    recommendedTreatments: ['film', 'dreamy'], recommendedType: ['script', 'classic', 'contemporary', 'modern'],
  },
  {
    id: 'editorial', name: 'Editorial', line: 'Bold type, gallery white.',
    bg: '#FCFBF8', ink: '#141310', accent: '#141310', soft: '#77726A', rule: 'rgba(20,19,16,.25)',
    swatch: ['#FCFBF8', '#141310', '#77726A'], frame: 'none',
    recommendedTreatments: ['natural', 'mono'], recommendedType: ['modern', 'contemporary', 'classic', 'script'],
  },
  {
    id: 'minimal', name: 'Modern Minimal', line: 'Warm stone, nothing extra.',
    bg: '#F4F2ED', ink: '#3B3833', accent: '#8A8578', soft: '#98938A', rule: 'rgba(59,56,51,.2)',
    swatch: ['#F4F2ED', '#8A8578', '#3B3833'], frame: 'none',
    recommendedTreatments: ['natural', 'mono'], recommendedType: ['contemporary', 'modern', 'classic', 'script'],
  },
  {
    id: 'botanical', name: 'Botanical', line: 'Sage, garden air, blush.',
    bg: '#F6F5EF', ink: '#3A4032', accent: '#7E8F6E', soft: '#8B917F', rule: 'rgba(126,143,110,.4)',
    swatch: ['#F6F5EF', '#7E8F6E', '#D9A6A0'], frame: 'hairline',
    recommendedTreatments: ['natural', 'film'], recommendedType: ['classic', 'script', 'contemporary', 'modern'],
  },
  {
    id: 'coastal', name: 'Coastal', line: 'Sea light and linen.',
    bg: '#FBFAF6', ink: '#2E3D50', accent: '#5E7A99', soft: '#7E8B99', rule: 'rgba(94,122,153,.35)',
    swatch: ['#FBFAF6', '#5E7A99', '#C9D3DC'], frame: 'hairline',
    recommendedTreatments: ['natural', 'film'], recommendedType: ['contemporary', 'classic', 'modern', 'script'],
  },
  {
    id: 'italian', name: 'Italian Summer', line: 'Citrus, cobalt, la dolce vita.',
    bg: '#FDFCF7', ink: '#1F3F8F', accent: '#D9A03C', soft: '#6B88C4', rule: 'rgba(31,63,143,.3)',
    swatch: ['#FDFCF7', '#1F3F8F', '#D9A03C'], frame: 'double',
    recommendedTreatments: ['film', 'natural'], recommendedType: ['script', 'classic', 'modern', 'contemporary'],
  },
  {
    id: 'evening', name: 'Evening Formal', line: 'Ink, candlelight, black tie.',
    bg: '#12100C', ink: '#F5F1E9', accent: '#B0906238', soft: 'rgba(245,241,233,.55)', rule: 'rgba(176,144,98,.4)',
    swatch: ['#12100C', '#B09062', '#F5F1E9'], frame: 'double', dark: true,
    recommendedTreatments: ['mono', 'natural'], recommendedType: ['classic', 'modern', 'script', 'contemporary'],
  },
];

// evening accent fix — solid value used for text
export const themeAccent = (t: ThemeMeta) => (t.id === 'evening' ? '#B09062' : t.accent);

export const getTheme = (id: ThemeId | ''): ThemeMeta =>
  THEMES.find(t => t.id === id) ?? THEMES[0];

/* ─── Image treatments ─── */

export type TreatmentMeta = {
  id: TreatmentId;
  name: string;
  line: string;
  filter: string;
  /** css background laid over the image */
  overlay: string;
  overlayBlend: React.CSSProperties['mixBlendMode'];
};

export const TREATMENTS: TreatmentMeta[] = [
  {
    id: 'natural', name: 'Natural Editorial', line: 'Subtle contrast, soft warmth.',
    filter: 'contrast(1.04) saturate(1.02) brightness(1.02) sepia(.04)',
    overlay: 'linear-gradient(180deg, rgba(248,245,240,.05), rgba(44,39,31,.06))', overlayBlend: 'normal',
  },
  {
    id: 'film', name: 'Soft Film', line: 'Muted colour, warm highlights.',
    filter: 'saturate(.82) contrast(.96) brightness(1.05) sepia(.12)',
    overlay: 'radial-gradient(120% 90% at 50% 10%, rgba(255,246,230,.16), rgba(120,100,80,.1))', overlayBlend: 'soft-light',
  },
  {
    id: 'mono', name: 'Black & White', line: 'Elegant monochrome.',
    filter: 'grayscale(1) contrast(1.08) brightness(1.03)',
    overlay: 'linear-gradient(180deg, rgba(255,255,255,.04), rgba(0,0,0,.08))', overlayBlend: 'normal',
  },
  {
    id: 'dreamy', name: 'Dreamy Romance', line: 'Soft light, ivory veil.',
    filter: 'saturate(.9) brightness(1.08) contrast(.92) blur(.4px)',
    overlay: 'linear-gradient(180deg, rgba(248,243,238,.22), rgba(233,214,204,.14))', overlayBlend: 'normal',
  },
];

export const getTreatment = (id: TreatmentId | ''): TreatmentMeta =>
  TREATMENTS.find(t => t.id === id) ?? TREATMENTS[0];

/* ─── Typography pairings ─── */

export type TypographyMeta = {
  id: TypographyId;
  name: string;
  line: string;
  heading: React.CSSProperties;
  body: React.CSSProperties;
};

const PRATA = 'var(--font-prata), Georgia, serif';
const GARAMOND = 'var(--font-garamond), Georgia, serif';
const MANROPE = 'var(--font-manrope), sans-serif';

export const TYPE_PAIRINGS: TypographyMeta[] = [
  {
    id: 'classic', name: 'Classic Serif', line: 'The stationery standard.',
    heading: { fontFamily: PRATA, fontWeight: 400, letterSpacing: '-.015em', lineHeight: 1.12 },
    body:    { fontFamily: GARAMOND, fontWeight: 400, lineHeight: 1.65 },
  },
  {
    id: 'modern', name: 'Modern Editorial', line: 'Confident and current.',
    heading: { fontFamily: PRATA, fontWeight: 400, textTransform: 'uppercase', letterSpacing: '.12em', lineHeight: 1.25 },
    body:    { fontFamily: MANROPE, fontWeight: 300, letterSpacing: '.02em', lineHeight: 1.7 },
  },
  {
    id: 'script', name: 'Romantic Italic', line: 'Soft, handwritten feeling.',
    heading: { fontFamily: GARAMOND, fontStyle: 'italic', fontWeight: 400, letterSpacing: '-.01em', lineHeight: 1.15 },
    body:    { fontFamily: GARAMOND, fontWeight: 400, lineHeight: 1.65 },
  },
  {
    id: 'contemporary', name: 'Clean Contemporary', line: 'Light, airy, unfussy.',
    heading: { fontFamily: MANROPE, fontWeight: 200, letterSpacing: '.04em', lineHeight: 1.2 },
    body:    { fontFamily: MANROPE, fontWeight: 300, lineHeight: 1.7 },
  },
];

export const getTypography = (id: TypographyId | ''): TypographyMeta =>
  TYPE_PAIRINGS.find(t => t.id === id) ?? TYPE_PAIRINGS[0];

/* ─── Scale ─── */

export const SCALES: Record<TypeScale, { label: string; names: number; body: number }> = {
  intimate: { label: 'Intimate', names: 0.85, body: 0.95 },
  classic:  { label: 'Classic',  names: 1,    body: 1 },
  grand:    { label: 'Grand',    names: 1.18, body: 1.05 },
};

/* ─── Recommendations (deterministic) ─── */

export function recommendedTreatments(theme: ThemeId | ''): TreatmentMeta[] {
  const rec = getTheme(theme).recommendedTreatments;
  return [...TREATMENTS].sort((a, b) => {
    const ra = rec.indexOf(a.id), rb = rec.indexOf(b.id);
    return (ra === -1 ? 9 : ra) - (rb === -1 ? 9 : rb);
  });
}

export function orderedTypography(theme: ThemeId | ''): TypographyMeta[] {
  const rec = getTheme(theme).recommendedType;
  return [...TYPE_PAIRINGS].sort((a, b) => rec.indexOf(a.id) - rec.indexOf(b.id));
}

/* ─── Limits & storage ─── */

export const BUILDER_LIMITS = {
  title: 60, names: 48, date: 48, time: 40, venue: 70, location: 60,
  message: 240, rsvpLabel: 24, rsvpUrl: 200,
  imageBytes: 10 * 1024 * 1024,
};

export const BUILDER_STORAGE_KEY = 'maison-atelier-design-v1';

export const STEP_TITLES = [
  'What are you celebrating?',
  'What style feels like your event?',
  'Add a photograph',
  'Curated treatments for your image',
  'Which typography feels right?',
  'Personalise the invitation',
  'Review & finish',
];

export const STEP_SHORT = [
  'Occasion', 'Style', 'Photograph', 'Treatment', 'Typography', 'Details', 'Review',
];
