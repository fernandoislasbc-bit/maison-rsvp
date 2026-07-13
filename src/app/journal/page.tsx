import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import JournalPage from './journal-client';

export const metadata: Metadata = buildMetadata({
  title:       'The Journal — Notes on Luxury Invitation Design',
  description: 'Essays and guidance on luxury wedding invitations, destination celebrations, and digital invitation design — written by the studio at Maison RSVP.',
  path:        '/journal',
  keywords: [
    'luxury wedding invitation blog',
    'wedding invitation design journal',
    'destination wedding invitation advice',
  ],
});

export default function Page() {
  return <JournalPage />;
}
