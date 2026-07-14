import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import CreateClient from './create-client';

export const metadata: Metadata = buildMetadata({
  title:       'Create a Free Digital Invitation',
  description: 'Compose a beautiful digital invitation in minutes — choose a design, add your details, and share one elegant link. Free, no sign-up, RSVPs to your email.',
  path:        '/invitation-maker/create',
  keywords: [
    'create digital invitation free',
    'make online invitation',
    'free invitation with rsvp',
  ],
});

export default function Page() {
  return <CreateClient />;
}
