import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import CardNewsArchive from '@/components/CardNewsArchive';
import { getAllCardNews } from '@/lib/card-news';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'EpicKor Card News | Swipeable Korea Visual Guides',
  description:
    'Browse EpicKor card news for Korea travel, food, shopping, culture, beauty, and lifestyle topics.',
  alternates: {
    canonical: '/card-news',
  },
  openGraph: {
    title: 'EpicKor Card News | Swipeable Korea Visual Guides',
    description:
      'Browse EpicKor card news for Korea travel, food, shopping, culture, beauty, and lifestyle topics.',
    url: 'https://www.epickor.com/card-news',
  },
};

export default function CardNewsPage() {
  const items = getAllCardNews();
  const featured = items[0];
  const totalSwipeCards = items.reduce((sum, item) => sum + item.totalCards, 0);
  const archiveItems = items.map((item) => ({
    folder: item.folder,
    slug: item.slug,
    topic: item.topic,
    date: item.date,
    dateLabel: item.dateLabel,
    totalCards: item.totalCards,
    coverImage: item.coverImage,
    href: item.href,
    label: item.label,
    description: item.description,
  }));

  return (
    <div className="min-h-screen bg-white text-gray-950">
      <section className="border-b border-gray-200 bg-gray-950 text-white">
        <div className="container mx-auto grid gap-8 px-4 py-8 md:py-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase text-red-300">EpicKor Card News</p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-black leading-tight md:text-5xl">
              Swipeable Korea card news you can browse like a visual guide.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-200">
              Each edition is a short card-news story: quick enough to swipe, useful enough to save, and linked
              to the full EpicKor article when you want the deeper guide.
            </p>
            <div className="mt-6 grid max-w-xl grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border border-white/15 bg-white/10 p-3">
                <p className="text-2xl font-black">{items.length}</p>
                <p className="mt-1 text-[11px] font-bold uppercase text-gray-300">Visual guides</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 p-3">
                <p className="text-2xl font-black">{totalSwipeCards}</p>
                <p className="mt-1 text-[11px] font-bold uppercase text-gray-300">Swipe cards</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 p-3">
                <p className="text-2xl font-black">{featured ? featured.dateLabel.replace(', 2026', '') : '-'}</p>
                <p className="mt-1 text-[11px] font-bold uppercase text-gray-300">Latest update</p>
              </div>
            </div>
          </div>

          {featured && (
            <Link href={featured.href} className="group block">
              <div className="relative aspect-square overflow-hidden rounded-lg border border-white/15 bg-black">
                <Image
                  src={featured.coverImage}
                  alt={`${featured.topic} card-news cover`}
                  fill
                  unoptimized
                  priority
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 360px"
                />
              </div>
              <p className="mt-3 text-sm font-black text-red-200">Latest Card News -&gt;</p>
            </Link>
          )}
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <CardNewsArchive items={archiveItems} />
      </main>
    </div>
  );
}
