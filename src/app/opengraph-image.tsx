import { ImageResponse } from 'next/og';

export const alt = 'Maison RSVP — Bespoke Luxury Digital Invitation Experiences';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'flex-start',
          background: '#0E0D0B',
          padding: '80px 100px',
          position: 'relative',
        }}
      >
        {/* Gold rule top */}
        <div style={{ position: 'absolute', top: 60, left: 100, right: 100, height: 1, background: 'rgba(162,129,90,0.3)', display: 'flex' }} />

        {/* Wordmark */}
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 60 }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 13, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(162,129,90,0.7)', marginBottom: 20 }}>MAISON RSVP</span>
        </div>

        {/* Headline */}
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 72, fontWeight: 400, lineHeight: 1, letterSpacing: '-0.025em', color: '#F8F5F0', maxWidth: 700, marginBottom: 40, display: 'flex', flexWrap: 'wrap' }}>
          Bespoke luxury<br />digital invitation<br />
          <span style={{ color: '#A2815A', fontStyle: 'italic' }}>experiences.</span>
        </div>

        {/* Descriptor */}
        <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 22, color: 'rgba(181,175,165,0.6)', letterSpacing: '0.01em', display: 'flex' }}>
          Vancouver · London · Lake Como
        </div>

        {/* Gold rule bottom */}
        <div style={{ position: 'absolute', bottom: 60, left: 100, right: 100, height: 1, background: 'rgba(162,129,90,0.3)', display: 'flex' }} />

        {/* URL */}
        <div style={{ position: 'absolute', bottom: 35, right: 100, fontFamily: 'Georgia, serif', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(181,175,165,0.35)', display: 'flex' }}>
          maisonrsvp.com
        </div>
      </div>
    ),
    { ...size }
  );
}
