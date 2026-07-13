import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { WORKS } from '@/lib/works';
import StoryClient from './story-client';

const work = WORKS.find(w => w.slug === 'oliver-and-charlotte');

export const metadata: Metadata = work
  ? buildMetadata({
      title:       `${work.title} — ${work.category}, ${work.location}`,
      description: work.tagline,
      path:        '/work/oliver-and-charlotte',
      type:        'article',
      image:       work.cover,
    })
  : {};

export default function Page() {
  return <StoryClient />;
}
