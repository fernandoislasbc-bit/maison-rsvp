import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import DemoInvitation from './invitation-client';

export const metadata: Metadata = buildMetadata({
  title:       'Demo Invitation — Isabella & Alexander',
  description: 'A sample Maison RSVP invitation. Send a demo RSVP and watch it arrive in the platform dashboard.',
  path:        '/demo/invitation',
});

export default function DemoInvitationPage() {
  return <DemoInvitation />;
}
