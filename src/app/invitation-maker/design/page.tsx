import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import InvitationBuilder from '@/components/builder/invitation-builder';

export const metadata: Metadata = buildMetadata({
  title:       'Design Your Invitation — Free Online Studio',
  description: 'A guided design experience: choose your occasion and style, add a photograph, pick typography, and compose a beautiful digital invitation — free, in minutes.',
  path:        '/invitation-maker/design',
  keywords: [
    'design digital invitation online',
    'invitation design tool free',
    'custom wedding invitation online',
  ],
});

export default function Page() {
  return <InvitationBuilder />;
}
