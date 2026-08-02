import Link from 'next/link';
import { otherHubs } from '@/lib/hubs';

/**
 * Cross-links at the foot of every hub.
 *
 * The three hubs shipped with no links to each other, which is a plain miss —
 * convenience stores and ramyun are the same shopping trip, and someone
 * comparing Seoul neighbourhoods is by definition planning a trip that involves
 * both. This also gives each hub an inbound internal link from two other hubs
 * rather than only from articles.
 */
export default function HubCrossLinks({ current }: { current: string }) {
  const others = otherHubs(current);
  if (others.length === 0) return null;

  return (
    <section className="mt-14 border-t border-gray-200 pt-8">
      <h2 className="text-lg font-black uppercase tracking-wide text-gray-950">Other EpicKor guides</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {others.map((hub) => (
          <Link
            key={hub.href}
            href={hub.href}
            className={`rounded-lg border ${hub.accentBorder} ${hub.accentBg} p-5 transition hover:-translate-y-0.5 hover:shadow-md`}
          >
            <p className={`text-[11px] font-black uppercase tracking-[0.14em] ${hub.accentText}`}>
              {hub.articleCount} articles
            </p>
            <h3 className="mt-1 text-xl font-black text-gray-950">{hub.title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-700">{hub.whatItAdds}</p>
          </Link>
        ))}
      </div>
      <Link href="/guides" className="mt-5 inline-block text-sm font-black text-gray-950 hover:underline">
        See all EpicKor guides →
      </Link>
    </section>
  );
}
