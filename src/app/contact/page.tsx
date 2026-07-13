import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import ContactPage from './contact-client';

export const metadata: Metadata = buildMetadata({
  title:       'Contact & Private Enquiries',
  description: 'Begin a private commission with Maison RSVP. Share your event date, location, and vision — we respond to every enquiry personally within two business days.',
  path:        '/contact',
  keywords: [
    'commission luxury wedding invitation',
    'bespoke invitation enquiry',
    'luxury wedding invitation designer contact',
  ],
});

export default function Page() {
  return <ContactPage />;
}
