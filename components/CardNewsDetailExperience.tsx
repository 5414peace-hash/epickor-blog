'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import CardNewsCarousel from '@/components/CardNewsCarousel';
import CardNewsRail, { type CardNewsRailItem } from '@/components/CardNewsRail';
import type { CardNewsItem } from '@/lib/card-news';

interface CardNewsDetailExperienceProps {
  items: CardNewsItem[];
  initialSlug: string;
}

export default function CardNewsDetailExperience({ items, initialSlug }: CardNewsDetailExperienceProps) {
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const selectedItem = items.find((item) => item.slug === selectedSlug) || items[0];

  const railItems = useMemo<CardNewsRailItem[]>(
    () =>
      items.map((item) => ({
        slug: item.slug,
        href: item.href,
        coverImage: item.coverImage,
        topic: item.topic,
        label: item.label,
        totalCards: item.totalCards,
      })),
    [items]
  );

  const related = useMemo(
    () => items.filter((item) => item.slug !== selectedItem?.slug).slice(0, 8),
    [items, selectedItem?.slug]
  );

  useEffect(() => {
    const syncFromLocation = () => {
      const slugFromPath = window.location.pathname.split('/').filter(Boolean).pop();
      if (slugFromPath && items.some((item) => item.slug === slugFromPath)) {
        setSelectedSlug(slugFromPath);
      }
    };

    window.addEventListener('popstate', syncFromLocation);
    return () => window.removeEventListener('popstate', syncFromLocation);
  }, [items]);

  if (!selectedItem) return null;

  const selectItem = (slug: string) => {
    const nextItem = items.find((item) => item.slug === slug);
    if (!nextItem) return;

    setSelectedSlug(slug);
    if (window.location.pathname !== nextItem.href) {
      window.history.pushState(null, '', nextItem.href);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-gray-950">
      <div className="container mx-auto px-4 pt-5">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm font-bold text-gray-600">
          <Link href="/" className="hover:text-red-700">
            Home
          </Link>
          <span>/</span>
          <Link href="/card-news" className="hover:text-red-700">
            Instagram Guides
          </Link>
          <span>/</span>
          <span className="text-gray-950">{selectedItem.topic}</span>
        </nav>
      </div>

      <CardNewsRail items={railItems} activeSlug={selectedItem.slug} onSelect={selectItem} />

      <main className="container mx-auto px-4 py-7 md:py-9">
        <section>
          <CardNewsCarousel
            key={selectedItem.slug}
            title={selectedItem.topic}
            description={selectedItem.description}
            label={selectedItem.label}
            dateLabel={selectedItem.dateLabel}
            totalCards={selectedItem.totalCards}
            slides={selectedItem.slides}
            caption={selectedItem.caption}
            fullGuideHref={selectedItem.blogHref}
          />
        </section>

        {related.length > 0 && (
          <section className="mt-10 border-t border-gray-200 pt-7">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-gray-950">More Instagram Guides</h2>
                <p className="mt-1 text-sm text-gray-600">Recent visual guides, kept compact for quick browsing.</p>
              </div>
              <Link href="/card-news" className="text-sm font-black text-red-700 hover:text-red-900">
                All Instagram Guides -&gt;
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {related.map((item) => (
                <Link key={`${item.folder}-${item.slug}`} href={item.href} className="group block">
                  <article className="overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm">
                    <div className="relative aspect-square bg-gray-950">
                      <Image
                        src={item.coverImage}
                        alt={`${item.topic} cover`}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.025]"
                        sizes="(max-width: 768px) 50vw, 120px"
                      />
                    </div>
                    <div className="p-2.5">
                      <p className="text-[10px] font-black uppercase text-red-600">{item.label}</p>
                      <h3 className="mt-1 text-xs font-black leading-snug text-gray-950 line-clamp-2">{item.topic}</h3>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
