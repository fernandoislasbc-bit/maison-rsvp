import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { WORKS } from '@/lib/works';
import WorkStory from './story-client';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = WORKS.find(w => w.slug === slug);
  if (!work) return {};
  return buildMetadata({
    title:       `${work.title} — ${work.category}, ${work.location}`,
    description: work.tagline,
    path:        `/work/${work.slug}`,
    type:        'article',
    image:       work.cover,
  });
}

export default function Page() {
  return <WorkStory />;
}
