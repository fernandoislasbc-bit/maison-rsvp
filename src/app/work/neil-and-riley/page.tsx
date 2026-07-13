import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { WORKS } from '@/lib/works';
import StoryClient from './story-client';

const work = WORKS.find(w => w.slug === 'neil-and-riley');

export const metadata: Metadata = work
  ? buildMetadata({
      title:       `${work.title} — ${work.category}, ${work.location}`,
      description: work.tagline,
      path:        '/work/neil-and-riley',
      type:        'article',
      image:       work.cover,
    })
  : {};

export default function Page() {
  return <StoryClient />;
}
