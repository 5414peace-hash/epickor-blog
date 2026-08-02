import Link from 'next/link';
import { HUBS } from '@/lib/hubs';

/**
 * "Guides › Travel › this guide" line at the top of a hub.
 *
 * Makes the hierarchy visible on the page rather than only in the sitemap. A
 * reader arriving from search sees immediately that this is one guide inside a
 * set, and which topic section it sits under — which is the thing the flat
 * navigation was failing to communicate.
 */
export default function HubParentLine({ href }: { href: string }) {
  const hub = HUBS.find((h) => h.href === href);
  if (!hub) return null;

  return (
    <p className="hub-parent-line mt-6 flex flex-wrap items-center gap-1.5 text-sm font-bold text-gray-500">
      <Link href="/guides" className="text-gray-950 hover:underline">
        Guides
      </Link>
      <span aria-hidden>›</span>
      <Link href={hub.parent.href} className="text-gray-950 hover:underline">
        {hub.parent.label}
      </Link>
      <span aria-hidden>›</span>
      <span className="text-gray-500">{hub.title}</span>
    </p>
  );
}
