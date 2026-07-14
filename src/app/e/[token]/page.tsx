import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { decodeEdition } from '@/lib/editions';
import { EditionTemplate } from '@/components/editions/templates';
import { EditionRsvp } from '@/components/editions/rsvp-form';

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const data = await decodeEdition(token);
  if (!data) return { robots: { index: false, follow: false } };
  const hosts = [data.n1, data.n2].filter(Boolean).join(' & ');
  return {
    title: { absolute: `You're invited — ${hosts}` },
    description: `${hosts} ${data.o}. ${data.d}${data.v ? ` · ${data.v}` : ''}`,
    robots: { index: false, follow: false },
    openGraph: {
      title: `You're invited — ${hosts}`,
      description: `${data.d}${data.v ? ` · ${data.v}` : ''}`,
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
      <EditionTemplate data={data}>
        <EditionRsvp token={token} dark={data.t === 'nocturne'} />
      </EditionTemplate>

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
