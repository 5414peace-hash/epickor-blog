import type { Metadata } from 'next';

// Internal publishing tool. Never index — robots.txt blocks crawling, this
// blocks indexing of URLs search engines already know about.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
