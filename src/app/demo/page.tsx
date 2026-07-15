import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import DemoDashboard from './demo-client';

export const metadata: Metadata = buildMetadata({
  title:       'Platform Demo — RSVP & Guest Dashboard',
  description: 'Explore the private couple dashboard behind every Maison RSVP commission: live RSVP tracking, guest list and check-in, QR invitation sharing, and the Memories archive of photos, videos, and voice notes your guests leave.',
  path:        '/demo',
  keywords: [
    'wedding rsvp dashboard',
    'digital wedding invitation with rsvp tracking',
    'wedding guest list management',
    'qr code wedding invitation',
  ],
});

export default function DemoPage() {
  return <DemoDashboard />;
}
