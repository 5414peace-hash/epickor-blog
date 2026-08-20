import type { Metadata } from 'next';

// Pre-publication preview URLs. A draft indexed before its real /blog/ URL
// exists would compete with its own launch — never index these.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
