import type { Metadata } from 'next';

const SITE = {
  name:    'Maison RSVP',
  url:     'https://www.maisonrsvp.com',
  twitter: '@maisonrsvp',
  locale:  'en_CA',
};

export function buildMetadata({
  title,
  description,
  path = '/',
  image = '/og/default.jpg',
  type = 'website',
  keywords,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const fullTitle = `${title} | Maison RSVP`;
  const canonical = `${SITE.url}${path}`;
  const ogImage   = image.startsWith('http') ? image : `${SITE.url}${image}`;

  return {
    title:       fullTitle,
    description,
    keywords:    keywords?.join(', '),
    metadataBase: new URL(SITE.url),
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type,
      title:       fullTitle,
      description,
      url:         canonical,
      siteName:    SITE.name,
      locale:      SITE.locale,
      images: [{
        url:    ogImage,
        width:  1200,
        height: 630,
        alt:    title,
      }],
    },
    twitter: {
      card:        'summary_large_image',
      title:       fullTitle,
      description,
      images:      [ogImage],
      site:        SITE.twitter,
      creator:     SITE.twitter,
    },
  };
}

/* ─── Schema helpers ───────────────────────────── */
export function orgSchema() {
  return {
    '@context':   'https://schema.org',
    '@type':      'Organization',
    name:         'Maison RSVP',
    url:          SITE.url,
    logo:         `${SITE.url}/logo.png`,
    description:  'Bespoke luxury digital invitation experiences. By private commission only.',
    address: {
      '@type':           'PostalAddress',
      addressLocality:   'Vancouver',
      addressRegion:     'BC',
      addressCountry:    'CA',
    },
    sameAs: [
      'https://www.instagram.com/maisonrsvp',
      'https://www.pinterest.com/maisonrsvp',
    ],
    contactPoint: {
      '@type':        'ContactPoint',
      contactType:    'customer service',
      email:          'commissions@maisonrsvp.com',
    },
  };
}

export function websiteSchema() {
  return {
    '@context':  'https://schema.org',
    '@type':     'WebSite',
    name:        'Maison RSVP',
    url:         SITE.url,
    description: 'Bespoke luxury digital invitation experiences for weddings, private celebrations, and luxury events.',
    potentialAction: {
      '@type':       'SearchAction',
      target:        `${SITE.url}/journal?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function serviceSchema({
  name,
  description,
  url,
  priceRange,
}: {
  name: string;
  description: string;
  url: string;
  priceRange?: string;
}) {
  return {
    '@context':   'https://schema.org',
    '@type':      'Service',
    name,
    description,
    url:          `${SITE.url}${url}`,
    provider: {
      '@type': 'Organization',
      name:    'Maison RSVP',
      url:     SITE.url,
    },
    areaServed: 'Worldwide',
    ...(priceRange ? { priceRange } : {}),
  };
}

export function articleSchema({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  image,
  authorName = 'Maison RSVP',
}: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  authorName?: string;
}) {
  return {
    '@context':     'https://schema.org',
    '@type':        'BlogPosting',
    headline:       title,
    description,
    url:            `${SITE.url}/journal/${slug}`,
    datePublished,
    dateModified:   dateModified ?? datePublished,
    author: {
      '@type': 'Organization',
      name:    authorName,
      url:     SITE.url,
    },
    publisher: {
      '@type': 'Organization',
      name:    'Maison RSVP',
      logo: {
        '@type': 'ImageObject',
        url:     `${SITE.url}/logo.png`,
      },
    },
    image: image ? `${SITE.url}${image}` : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   `${SITE.url}/journal/${slug}`,
    },
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: items.map(item => ({
      '@type':          'Question',
      name:             item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text:    item.a,
      },
    })),
  };
}

export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type':   'ListItem',
      position:  i + 1,
      name:      c.name,
      item:      `${SITE.url}${c.path}`,
    })),
  };
}
