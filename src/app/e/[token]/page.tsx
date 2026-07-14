import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { decodeEdition, type Edition, type DesignedPayload } from '@/lib/editions';
import { EditionTemplate } from '@/components/editions/templates';
import { EditionRsvp } from '@/components/editions/rsvp-form';
import { InvitationPreview } from '@/components/builder/invitation-preview';
import { getTheme } from '@/lib/builder-config';

type Props = { params: Promise<{ token: string }> };

const isDesigned = (x: Edition | DesignedPayload): x is DesignedPayload =>
  'k' in x && x.k === 'd';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const data = await decodeEdition(token);
  if (!data) return { robots: { index: false, follow: false } };

  const hosts = isDesigned(data)
    ? data.design.details.names
    : [data.n1, data.n2].filter(Boolean).join(' & ');
  const dateLine = isDesigned(data) ? data.design.details.date : data.d;
  const place = isDesigned(data) ? data.design.details.venue : data.v;

  return {
    title: { absolute: `You're invited — ${hosts}` },
    description: `${dateLine}${place ? ` · ${place}` : ''}`,
    robots: { index: false, follow: false },
    openGraph: {
      title: `You're invited — ${hosts}`,
      description: `${dateLine}${place ? ` · ${place}` : ''}`,
      siteName: 'Maison Editions',
    },
  };
}

export default async function EditionPage({ params }: Props) {
  const { token } = await params;
  const data = await decodeEdition(token);
  if (!data) notFound();

  return (
    <main>
      {isDesigned(data) ? (
        <InvitationPreview design={data.design} full>
          {data.design.details.rsvpUrl ? (
            <a
              href={data.design.details.rsvpUrl}
              target="_blank" rel="noreferrer"
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '.6em', letterSpacing: '.3em', textTransform: 'uppercase',
                color: getTheme(data.design.theme).dark ? '#12100C' : getTheme(data.design.theme).bg,
                background: getTheme(data.design.theme).dark ? '#B09062' : getTheme(data.design.theme).ink,
                padding: '1.25em 2.6em', textDecoration: 'none',
              }}
            >
              {data.design.details.rsvpLabel || 'Kindly reply'}
            </a>
          ) : (
            <EditionRsvp token={token} dark={!!getTheme(data.design.theme).dark} />
          )}
        </InvitationPreview>
      ) : (
        <EditionTemplate data={data}>
          <EditionRsvp token={token} dark={data.t === 'nocturne'} />
        </EditionTemplate>
      )}

      {/* Maker attribution — the referral loop */}
      <footer style={{
        background: '#0E0D0B', textAlign: 'center',
        padding: '1.4rem 1.5rem',
      }}>
        <Link href="/invitation-maker" style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '.55rem', letterSpacing: '.28em', textTransform: 'uppercase',
          color: 'rgba(201,168,130,.75)', textDecoration: 'none',
        }}>
          Crafted with Maison RSVP — create yours free
        </Link>
      </footer>
    </main>
  );
}
