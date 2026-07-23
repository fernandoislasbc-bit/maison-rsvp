import type { Metadata } from 'next';
import { buildMetadata, breadcrumbSchema, softwareApplicationSchema } from '@/lib/seo';
import InvitationBuilder from '@/components/builder/invitation-builder';

export const metadata: Metadata = buildMetadata({
  title:       'Design Your Invitation — Free Online Invitation Studio',
  description: 'Design a custom digital invitation online, free: choose your occasion and style, add a photograph, pick typography, and compose a beautiful invitation with RSVP in minutes. No sign-up.',
  path:        '/invitation-maker/design',
  keywords: [
    'design digital invitation online',
    'online invitation maker free',
    'custom wedding invitation online',
    'invitation design tool free',
    'make your own invitation online',
  ],
});

export default function Page() {
  return (
    <>
      {/* The design studio is a full-screen client tool; these give search
          engines the entity + free-application signals the DOM cannot. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(
        softwareApplicationSchema({
          name:        'Maison RSVP — Free Invitation Design Studio',
          description: 'A guided online studio to design a custom digital invitation free: occasion, style, photograph, typography, and RSVP in one shareable link. No sign-up.',
          url:         '/invitation-maker/design',
        })
      ) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Free Invitation Maker', path: '/invitation-maker' },
          { name: 'Design Studio', path: '/invitation-maker/design' },
        ])
      ) }} />
      <InvitationBuilder />
    </>
  );
}
