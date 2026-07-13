import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import WorkIndex from './work-client';

export const metadata: Metadata = buildMetadata({
  title:       'The Commissions — Bespoke Invitation Portfolio',
  description: 'Selected commissions from Maison RSVP: bespoke digital wedding invitations and private event experiences designed for celebrations in Canada, France, Italy, and Mexico.',
  path:        '/work',
  keywords: [
    'luxury wedding invitation portfolio',
    'bespoke digital invitation examples',
    'custom wedding invitation designs',
  ],
});

export default function Page() {
  return <WorkIndex />;
}
