'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';

export interface CardNewsRailItem {
  slug: string;
  href: string;
  coverImage: string;
  topic: string;
  label: string;
  totalCards: number;
}

interface CardNewsRailProps {
  items: CardNewsRailItem[];
  activeSlug?: string;
  onSelect?: (slug: string) => void;
}

function ArrowMark({ direction }: { direction: 'left' | 'right' }) {
  return (
    <span className="relative block h-8 w-8" aria-hidden="true">
      {direction === 'right' ? (
        <>
          <span className="absolute left-[8px] top-1/2 h-px w-3.5 -translate-y-1/2 bg-gray-950" />
          <span className="absolute left-[15px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-r-2 border-t-2 border-gray-950" />
        </>
      ) : (
        <>
          <span className="absolute right-[8px] top-1/2 h-px w-3.5 -translate-y-1/2 bg-gray-950" />
          <span className="absolute right-[15px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-gray-950" />
        </>
      )}
    </span>
  );
}

function RailButton({
  direction,
  onClick,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
}) {
  const sideClass = direction === 'left' ? 'left-1 md:left-2' : 'right-1 md:right-2';

  return (
    <button
      type="button"
      aria-label={direction === 'left' ? 'Previous Instagram guides' : 'Next Instagram guides'}
      onClick={onClick}
      data-analytics-event="cardnews_rail_scroll"
      data-analytics-direction={direction}
      className={`absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/90 shadow-[0_14px_36px_rgba(15,23,42,0.18)] backdrop-blur transition hover:scale-105 hover:border-red-200 hover:bg-white ${sideClass}`}
    >
      <ArrowMark direction={direction} />
    </button>
  );
}

export default function CardNewsRail({ items, activeSlug, onSelect }: CardNewsRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);
  const movedRef = useRef(false);
  const [dragging, setDragging] = useState(false);

  if (items.length === 0) return null;

  const scrollBy = (direction: 'left' | 'right') => {
    const rail = railRef.current;
    if (!rail) return;

    rail.scrollBy({
      left: direction === 'left' ? -rail.clientWidth * 0.72 : rail.clientWidth * 0.72,
      behavior: 'smooth',
    });
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail) return;

    setDragging(true);
    movedRef.current = false;
    startXRef.current = event.clientX;
    startScrollRef.current = rail.scrollLeft;
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || !dragging) return;

    const delta = event.clientX - startXRef.current;
    if (Math.abs(delta) > 6) movedRef.current = true;
    rail.scrollLeft = startScrollRef.current - delta;
  };

  const endDrag = () => {
    setDragging(false);
  };

  const renderCard = (item: CardNewsRailItem, index: number, active: boolean) => (
    <article
      className={`overflow-hidden rounded-lg border bg-white transition ${
        active
          ? 'border-red-500 shadow-[0_16px_38px_rgba(220,38,38,0.16)]'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="relative aspect-square bg-gray-950">
        <Image
          src={item.coverImage}
          alt={`${item.topic} guide cover`}
          fill
          unoptimized
          priority={index < 7}
          draggable={false}
          className="select-none object-cover transition duration-500 group-hover:scale-[1.025]"
          sizes="(max-width: 768px) 132px, 156px"
        />
        <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-black uppercase text-white">
          {item.totalCards}
        </span>
      </div>
      <div className="p-2.5">
        <p className="text-[10px] font-black uppercase text-red-600">{item.label}</p>
        <h3 className="mt-1 text-xs font-black leading-snug text-gray-950 line-clamp-2">{item.topic}</h3>
      </div>
    </article>
  );

  return (
    <section className="border-b border-gray-200 bg-[#fbfaf8]">
      <div className="mx-auto max-w-6xl px-4 py-5">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-red-600">Browse Instagram Guides</p>
            <h2 className="text-xl font-black text-gray-950">Pick another visual guide</h2>
          </div>
          <Link
            href="/card-news"
            data-analytics-event="cardnews_archive_click"
            data-analytics-location="detail_rail"
            className="text-sm font-black text-red-700 hover:text-red-900"
          >
            All Instagram Guides -&gt;
          </Link>
        </div>

        <div className="relative overflow-hidden">
          <RailButton direction="left" onClick={() => scrollBy('left')} />
          <RailButton direction="right" onClick={() => scrollBy('right')} />
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-[#fbfaf8] via-[#fbfaf8]/85 to-transparent md:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-[#fbfaf8] via-[#fbfaf8]/85 to-transparent md:w-24" />

          <div
            ref={railRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
            className={`scrollbar-none flex snap-x gap-3 overflow-x-auto px-12 py-2 ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          >
            {items.map((item, index) => {
              const active = item.slug === activeSlug;
              const cardClass = `group w-[132px] shrink-0 snap-center text-left md:w-[148px] lg:w-[156px] ${
                active ? 'opacity-100' : 'opacity-90 hover:opacity-100'
              }`;

              return onSelect ? (
                <button
                  key={`${item.href}-${item.slug}`}
                  type="button"
                  aria-current={active ? 'true' : undefined}
                  data-analytics-event="cardnews_rail_select"
                  data-analytics-slug={item.slug}
                  data-analytics-title={item.topic}
                  onClick={() => {
                    if (movedRef.current) {
                      movedRef.current = false;
                      return;
                    }

                    onSelect(item.slug);
                  }}
                  className={cardClass}
                >
                  {renderCard(item, index, active)}
                </button>
              ) : (
                <Link
                  key={`${item.href}-${item.slug}`}
                  href={item.href}
                  data-analytics-event="cardnews_rail_open"
                  data-analytics-slug={item.slug}
                  data-analytics-title={item.topic}
                  onClick={(event) => {
                    if (movedRef.current) {
                      event.preventDefault();
                      movedRef.current = false;
                    }
                  }}
                  className={cardClass}
                >
                  {renderCard(item, index, active)}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
