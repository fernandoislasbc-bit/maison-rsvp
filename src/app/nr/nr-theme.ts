/* Neil & Riley — shared guest-facing theme. Burgundy velvet, ivory, gold. */

export const NR = {
  velvet: '#2A0A0E',
  velvetDeep: '#1C0608',
  burgundy: '#4A141B',
  gold: '#C9A35A',
  goldSoft: 'rgba(201,163,90,.55)',
  ivory: '#F4EBDD',
  mist: 'rgba(244,235,221,.62)',
  line: 'rgba(201,163,90,.28)',
};

export const nrSerif: React.CSSProperties = { fontFamily: 'var(--font-prata), Georgia, serif' };
export const nrItalic: React.CSSProperties = { fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic' };
export const nrSans: React.CSSProperties = { fontFamily: 'var(--font-manrope), sans-serif' };

export const nrMicro: React.CSSProperties = {
  ...nrSans, fontSize: '.56rem', letterSpacing: '.32em', textTransform: 'uppercase',
};

export const nrButton = (solid = true): React.CSSProperties => ({
  ...nrMicro, cursor: 'pointer', minHeight: 46, padding: '1.1em 2.4em',
  color: solid ? NR.velvetDeep : NR.ivory,
  background: solid ? NR.gold : 'transparent',
  border: `1px solid ${solid ? NR.gold : NR.goldSoft}`,
  transition: 'background .3s, color .3s, border-color .3s, box-shadow .3s',
});

export const nrInput: React.CSSProperties = {
  width: '100%', background: 'transparent', color: NR.ivory,
  border: 'none', borderBottom: `1px solid ${NR.goldSoft}`, borderRadius: 0,
  fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic',
  fontSize: '1.05rem', padding: '.6rem 0', outline: 'none',
};

export const nrLabel: React.CSSProperties = {
  ...nrMicro, fontSize: '.52rem', color: NR.gold, display: 'block', marginBottom: '.55rem',
};
