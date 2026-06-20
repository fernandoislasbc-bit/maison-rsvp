import type { MetadataRoute } from 'next';
import { ARTICLES } from '@/lib/journal';
import { WORKS } from '@/lib/works';

const BASE = 'https://www.maisonrsvp.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                   lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/collection`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/experiences`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/process`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/about`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/work`,         lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/journal`,      lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/partnerships`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contact`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  const workPages: MetadataRoute.Sitemap = WORKS.map(w => ({
    url:              `${BASE}/work/${w.slug}`,
    lastModified:     new Date(),
    changeFrequency:  'monthly',
    priority:         0.8,
  }));

  const articlePages: MetadataRoute.Sitemap = ARTICLES.map(a => ({
    url:              `${BASE}/journal/${a.slug}`,
    lastModified:     new Date(a.date),
    changeFrequency:  'monthly',
    priority:         0.75,
  }));

  return [...staticPages, ...workPages, ...articlePages];
}
