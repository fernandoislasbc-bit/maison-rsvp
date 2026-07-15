import type { Metadata } from 'next';

/* Private wedding area — never indexed. */
export const metadata: Metadata = {
  title: { absolute: 'Neil & Riley — October 9th, 2026' },
  description: 'A private wedding invitation.',
  robots: { index: false, follow: false },
};

export default function NrLayout({ children }: { children: React.ReactNode }) {
  return children;
}
