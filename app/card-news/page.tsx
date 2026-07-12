import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllCardNews, type CardNewsItem } from '@/lib/card-news';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'EpicKor Instagram Guides | Swipeable Korea Card News',
  description:
    'Browse EpicKor Instagram-style card news for Korea travel, food, shopping, culture, beauty, and lifestyle topics.',
  alternates: {
    canonical: '/card-news',
  },
  openGraph: {
    title: 'EpicKor Instagram Guides | Swipeable Korea Card News',
    description:
      'Browse EpicKor Instagram-style card news for Korea travel, food, shopping, culture, beauty, and lifestyle topics.',
    url: 'https://www.epickor.com/card-news',
  },
};

function labelClass(label: string): string {
  if (label === 'Travel') return 'bg-blue-700 text-white';
  if (label === 'Food & Shopping') return 'bg-red-600 text-white';
  if (label === 'Beauty & Lifestyle') return 'bg-pink-600 text-white';
  if (label === 'Business') return 'bg-emerald-700 text-white';
  return 'bg-violet-700 text-white';
}

function trimText(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trim()}...`;
}

function CardNewsPreview({ item, priority = false }: { item: CardNewsItem; priority?: boolean }) {
  return (
    <Link href={item.href} className="group block h-full">
      <article className="grid h-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="relative aspect-square bg-gray-950">
          <Image
            src={item.coverImage}
            alt={`${item.topic} card-news cover`}
            fill
            unoptimized
            priority={priority}
            className="object-cover transition duration-500 group-hover:scale-[1.025]"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 300px"
          />
          <div className="absolute left-3 top-3 rounded-md bg-black/70 px-2.5 py-1 text-[11px] font-black uppercase text-white">
            {item.totalCards} cards
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-md px-2 py-0.5 text-[11px] font-black uppercase ${labelClass(item.label)}`}>
              {item.label}
            </span>
            <time dateTime={item.date} className="text-[11px] font-bold text-gray-500">
              {item.dateLabel}
            </time>
          </div>
          <h2 className="mt-3 text-lg font-black leading-snug text-gray-950 group-hover:text-red-700">
            {item.topic}
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600 line-clamp-3">{trimText(item.description, 138)}</p>
          <span className="mt-4 inline-flex text-sm font-black text-red-700">Open guide -&gt;</span>
        </div>
      </article>
    </Link>
  );
}

export default function CardNewsPage() {
  const items = getAllCardNews();
  const featured = items[0];
  const labels = Array.from(new Set(items.map((item) => item.label)));
  const totalSwipeCards = items.reduce((sum, item) => sum + item.totalCards, 0);

  return (
    <div className="min-h-screen bg-white text-gray-950">
      <section className="border-b border-gray-200 bg-gray-950 text-white">
        <div className="container mx-auto grid gap-8 px-4 py-8 md:py-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase text-red-300">EpicKor Instagram Guides</p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-black leading-tight md:text-5xl">
              Swipeable Korea card news you can browse like a visual guide.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-200">
              Each Instagram Guide is a short card-news story: quick enough to swipe, useful enough to save, and linked
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
              <p className="mt-3 text-sm font-black text-red-200">Latest Instagram Guide -&gt;</p>
            </Link>
          )}
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {labels.length > 0 && (
          <div className="scrollbar-none mb-6 flex gap-2 overflow-x-auto">
            {labels.map((label) => (
              <span key={label} className="shrink-0 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-black text-gray-700">
                {label}
              </span>
            ))}
          </div>
        )}

        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-gray-950">All Instagram Guides</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
              Browse every EpicKor card-news guide in one place. Open one to swipe through the cards, copy the Instagram
              caption, or continue into the full article.
            </p>
          </div>
          <Link href="/latest" className="text-sm font-black text-red-700 hover:text-red-900">
            See latest posts -&gt;
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item, index) => (
            <CardNewsPreview key={`${item.folder}-${item.slug}`} item={item} priority={index < 5} />
          ))}
        </div>
      </main>
    </div>
  );
}
