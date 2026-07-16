import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import Home from './home-client';

export const metadata: Metadata = {
  ...buildMetadata({
    // The descriptive title, so a shared homepage link reads as the offer
    // rather than as the bare brand name.
    title:       'Maison RSVP — Bespoke Luxury Digital Invitation Experiences',
    description: 'Bespoke luxury digital invitation experiences for weddings, destination celebrations, and private events — designed from scratch, never from templates. By private commission only. Vancouver · London · Lake Como.',
    path:        '/',
    keywords: [
      'luxury wedding invitations',
      'bespoke digital invitations',
      'custom wedding website',
      'luxury invitation experience',
      'digital wedding invitation Canada',
    ],
  }),
  title: { absolute: 'Maison RSVP — Bespoke Luxury Digital Invitation Experiences' },
};

export default function Page() {
  return <Home />;
}
