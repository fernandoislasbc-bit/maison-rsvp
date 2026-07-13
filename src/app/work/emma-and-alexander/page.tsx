import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { WORKS } from '@/lib/works';
import StoryClient from './story-client';

const work = WORKS.find(w => w.slug === 'emma-and-alexander');

export const metadata: Metadata = work
  ? buildMetadata({
      title:       `${work.title} — ${work.category}, ${work.location}`,
      description: work.tagline,
      path:        '/work/emma-and-alexander',
      type:        'article',
      image:       work.cover,
    })
  : {};

export default function Page() {
  return <StoryClient />;
}
