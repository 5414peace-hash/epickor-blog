'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export interface CardNewsArchiveItem {
  folder: string;
  slug: string;
  topic: string;
  date: string;
  dateLabel: string;
  totalCards: number;
  coverImage: string;
  href: string;
  label: string;
  description: string;
}

type SortOrder = 'newest' | 'oldest';

const preferredLabelOrder = ['Travel', 'Food & Shopping', 'Beauty & Lifestyle', 'Culture', 'Business'];

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

function compareNewestFirst(a: CardNewsArchiveItem, b: CardNewsArchiveItem): number {
  if (a.date !== b.date) return b.date.localeCompare(a.date);

  const aSlug = Number(a.slug);
  const bSlug = Number(b.slug);
  if (!Number.isNaN(aSlug) && !Number.isNaN(bSlug)) return bSlug - aSlug;

  return b.slug.localeCompare(a.slug);
}

function CardNewsPreview({ item, priority = false }: { item: CardNewsArchiveItem; priority?: boolean }) {
  return (
    <Link
      href={item.href}
      data-analytics-event="cardnews_archive_item_click"
      data-analytics-slug={item.slug}
      data-analytics-label={item.label}
      className="group block h-full"
    >
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
          <h3 className="mt-3 text-lg font-black leading-snug text-gray-950 group-hover:text-red-700">
            {item.topic}
          </h3>
          <p className="mt-2 text-sm leading-6 text-gray-600 line-clamp-3">{trimText(item.description, 138)}</p>
          <span className="mt-4 inline-flex text-sm font-black text-red-700">Open guide -&gt;</span>
        </div>
      </article>
    </Link>
  );
}

export default function CardNewsArchive({ items }: { items: CardNewsArchiveItem[] }) {
  const [activeLabel, setActiveLabel] = useState('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const labels = useMemo(() => {
    const availableLabels = new Set(items.map((item) => item.label));
    const orderedLabels = preferredLabelOrder.filter((label) => availableLabels.has(label));
    const remainingLabels = Array.from(availableLabels)
      .filter((label) => !preferredLabelOrder.includes(label))
      .sort((a, b) => a.localeCompare(b));

    return ['All', ...orderedLabels, ...remainingLabels];
  }, [items]);

  const visibleItems = useMemo(() => {
    const filteredItems = activeLabel === 'All' ? items : items.filter((item) => item.label === activeLabel);
    const sortedItems = [...filteredItems].sort(compareNewestFirst);
    return sortOrder === 'newest' ? sortedItems : sortedItems.reverse();
  }, [activeLabel, items, sortOrder]);

  return (
    <section aria-labelledby="card-news-archive-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <h2 id="card-news-archive-heading" className="text-2xl font-black text-gray-950">
            All Card News
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
            Filter by topic, choose the order, then open any visual guide for its cards, social caption, and full article.
          </p>
        </div>
        <Link href="/latest" className="text-sm font-black text-red-700 hover:text-red-900">
          See latest posts -&gt;
        </Link>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-[#fbfaf8] p-4 md:p-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p id="card-news-topic-filter" className="text-xs font-black uppercase text-gray-500">
              Topic
            </p>
            <div
              role="group"
              aria-labelledby="card-news-topic-filter"
              className="scrollbar-none mt-2 flex gap-2 overflow-x-auto pb-1"
            >
              {labels.map((label) => {
                const isActive = activeLabel === label;
                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveLabel(label)}
                    data-analytics-event="cardnews_filter_change"
                    data-analytics-label={label}
                    className={`shrink-0 rounded-md border px-3 py-2 text-xs font-black transition ${
                      isActive
                        ? 'border-gray-950 bg-gray-950 text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-red-300 hover:text-red-700'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p id="card-news-sort-order" className="text-xs font-black uppercase text-gray-500">
              Order
            </p>
            <div role="group" aria-labelledby="card-news-sort-order" className="mt-2 inline-flex rounded-md border border-gray-200 bg-white p-1">
              {(['newest', 'oldest'] as const).map((order) => {
                const isActive = sortOrder === order;
                return (
                  <button
                    key={order}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setSortOrder(order)}
                    data-analytics-event="cardnews_sort_change"
                    data-analytics-order={order}
                    className={`rounded px-3 py-1.5 text-xs font-black capitalize transition ${
                      isActive ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-red-50 hover:text-red-700'
                    }`}
                  >
                    {order}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="mt-4 border-t border-gray-200 pt-3 text-xs font-bold text-gray-600" aria-live="polite">
          Showing {visibleItems.length} {visibleItems.length === 1 ? 'guide' : 'guides'}
          {activeLabel === 'All' ? '' : ` in ${activeLabel}`} · {sortOrder === 'newest' ? 'newest first' : 'oldest first'}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {visibleItems.map((item, index) => (
          <CardNewsPreview key={`${item.folder}-${item.slug}`} item={item} priority={index < 5} />
        ))}
      </div>
    </section>
  );
}
