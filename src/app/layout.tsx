import type { Metadata } from 'next';
import { Prata, Manrope, EB_Garamond } from 'next/font/google';
import './globals.css';
import { orgSchema, websiteSchema } from '@/lib/seo';
import Cursor from '@/components/ui/Cursor';

const prata = Prata({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-prata',
  display: 'swap',
});

const manrope = Manrope({
  weight: ['200', '300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const garamond = EB_Garamond({
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-garamond',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default:  'Maison RSVP — Bespoke Luxury Digital Invitation Experiences',
    template: '%s | Maison RSVP',
  },
  description: 'Bespoke luxury digital invitation experiences for weddings, destination celebrations, and private events — designed from scratch, never from templates. By private commission only. Vancouver · London · Lake Como.',
  keywords: 'luxury wedding invitations, bespoke digital invitations, custom wedding website, luxury invitation experience, digital wedding invitation Canada',
  metadataBase: new URL('https://www.maisonrsvp.ca'),
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: 'Maison RSVP', locale: 'en_CA' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  verification: { google: 'FTl83WJuOXZaOd7n0pLxfObUUtK1uAV87ZWI1CgCVtw' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${prata.variable} ${manrope.variable} ${garamond.variable}`}
    >
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }} />
      </head>
      <body className="min-h-full">
        <Cursor />
        {children}
      </body>
    </html>
  );
}
