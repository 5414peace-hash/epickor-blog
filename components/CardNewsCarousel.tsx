'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';

interface CardNewsCarouselSlide {
  index: number;
  kicker: string;
  main: string;
  sub: string;
  imageLabel: string;
  renderedImage: string;
}

interface CardNewsCarouselProps {
  title: string;
  description: string;
  label: string;
  dateLabel: string;
  totalCards: number;
  slides: CardNewsCarouselSlide[];
  caption: string;
  fullGuideHref: string;
}

function splitLines(value: string): string[] {
  return value
    .split(/\\n|\n/g)
    .map((line) => line.trim())
    .filter(Boolean);
}

function cleanText(value: string): string {
  return splitLines(value).join(' ').replace(/\*\*/g, '').trim();
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

function EdgeButton({
  direction,
  onClick,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
}) {
  const sideClass = direction === 'left' ? 'left-2 md:-left-5' : 'right-2 md:-right-5';

  return (
    <button
      type="button"
      aria-label={direction === 'left' ? 'Previous card' : 'Next card'}
      onClick={onClick}
      className={`absolute top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 shadow-[0_18px_48px_rgba(15,23,42,0.24)] backdrop-blur transition hover:scale-105 hover:border-red-200 hover:bg-white ${sideClass}`}
    >
      <ArrowMark direction={direction} />
    </button>
  );
}

export default function CardNewsCarousel({
  title,
  description,
  label,
  dateLabel,
  totalCards,
  slides,
  caption,
  fullGuideHref,
}: CardNewsCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);

  const scrollToSlide = useCallback((index: number) => {
    const viewport = viewportRef.current;
    const slide = slideRefs.current[index];
    if (!viewport || !slide) return;

    viewport.scrollTo({
      left: slide.offsetLeft,
      behavior: 'smooth',
    });
    setSelected(index);
  }, []);

  const updateSelectedFromScroll = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    slideRefs.current.forEach((slide, index) => {
      if (!slide) return;
      const distance = Math.abs(slide.offsetLeft - viewport.scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setSelected(closestIndex);
  }, []);

  const copyCaption = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (_error) {
      setCopied(false);
    }
  }, [caption]);

  const current = slides[selected];

  return (
    <section className="w-full" aria-label={title} aria-roledescription="carousel">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.72fr)_minmax(320px,620px)_minmax(0,0.72fr)] xl:items-start">
        <aside className="order-2 rounded-lg border border-gray-200 bg-white p-5 xl:order-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-red-600 px-2.5 py-1 text-[11px] font-black uppercase text-white">
              {label}
            </span>
            <time dateTime={dateLabel} className="text-xs font-bold text-gray-500">
              {dateLabel}
            </time>
          </div>
          <h1 className="mt-4 font-serif text-3xl font-black leading-tight text-gray-950 md:text-4xl xl:text-3xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">{description}</p>

          <div className="mt-5 border-t border-gray-200 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-black uppercase text-gray-950">Caption</h2>
              <button
                type="button"
                onClick={copyCaption}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-black text-gray-950 transition hover:border-gray-950"
              >
                {copied ? 'Copied' : 'Copy caption'}
              </button>
            </div>
            <p className="mt-3 max-h-72 overflow-y-auto whitespace-pre-line pr-1 text-sm leading-6 text-gray-700">
              {caption}
            </p>
            <Link
              href={fullGuideHref}
              className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-gray-950 px-4 py-3 text-sm font-black text-white transition hover:bg-red-700"
            >
              Read full article -&gt;
            </Link>
          </div>
        </aside>

        <div className="order-1 min-w-0 xl:order-2">
          <div className="relative mx-auto max-w-[620px]">
            {selected > 0 && <EdgeButton direction="left" onClick={() => scrollToSlide(selected - 1)} />}
            {selected < slides.length - 1 && <EdgeButton direction="right" onClick={() => scrollToSlide(selected + 1)} />}

            <div
              ref={viewportRef}
              onScroll={updateSelectedFromScroll}
              className="scrollbar-none overflow-x-auto scroll-smooth rounded-lg bg-gray-950 shadow-[0_22px_70px_rgba(15,23,42,0.18)]"
              style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
            >
              <div className="flex">
                {slides.map((slide, index) => {
                  const mainLines = splitLines(slide.main);

                  return (
                    <div
                      key={slide.index}
                      ref={(node) => {
                        slideRefs.current[index] = node;
                      }}
                      className="relative aspect-square w-full min-w-full shrink-0 overflow-hidden bg-gray-950"
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`${index + 1} of ${slides.length}: ${slide.imageLabel || slide.kicker || title}`}
                      style={{ scrollSnapAlign: 'center' }}
                    >
                      <Image
                        src={slide.renderedImage}
                        alt={slide.imageLabel || `${title} card ${index + 1}`}
                        fill
                        priority={index === 0}
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 620px"
                      />
                      <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/70 px-2.5 py-1 text-[11px] font-black uppercase text-white md:hidden">
                        {index + 1} / {slides.length}
                      </div>
                      {mainLines.length > 0 && (
                        <span className="sr-only">
                          {mainLines.join(' ')}
                          {slide.sub ? `. ${slide.sub}` : ''}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mx-auto mt-4 max-w-[620px]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="rounded-md bg-gray-950 px-3 py-2 text-sm font-black text-white" aria-live="polite">
                Card {selected + 1} / {slides.length}
              </p>

              <div className="scrollbar-none flex max-w-full items-center gap-1.5 overflow-x-auto">
                {slides.map((slide, index) => (
                  <button
                    key={slide.index}
                    type="button"
                    aria-label={`Go to card ${index + 1}`}
                    aria-current={index === selected ? 'true' : undefined}
                    onClick={() => scrollToSlide(index)}
                    className={`h-2.5 rounded-full transition ${
                      index === selected ? 'w-7 bg-red-600' : 'w-2.5 bg-gray-300 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            {current && (
              <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs font-black uppercase text-red-600">{current.kicker || 'EpicKor Card News'}</p>
                <h2 className="mt-2 text-lg font-black leading-snug text-gray-950">{cleanText(current.main)}</h2>
                {current.sub && <p className="mt-2 text-sm leading-6 text-gray-600">{cleanText(current.sub)}</p>}
              </div>
            )}
          </div>
        </div>

        <aside className="order-3 rounded-lg border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-gray-500">Slide List</p>
              <h2 className="mt-1 text-lg font-black text-gray-950">{totalCards} cards</h2>
            </div>
          </div>
          <div className="grid max-h-[620px] gap-2 overflow-y-auto pr-1">
            {slides.map((slide, index) => {
              const active = index === selected;

              return (
                <button
                  key={slide.index}
                  type="button"
                  onClick={() => scrollToSlide(index)}
                  aria-current={active ? 'true' : undefined}
                  className={`grid grid-cols-[54px_1fr] gap-3 rounded-md border p-2 text-left transition ${
                    active
                      ? 'border-red-300 bg-red-50'
                      : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="relative aspect-square overflow-hidden rounded-md bg-gray-950">
                    <Image
                      src={slide.renderedImage}
                      alt={slide.imageLabel || `${title} card ${slide.index}`}
                      fill
                      className="object-cover"
                      sizes="54px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase text-red-600">{slide.kicker || `Card ${slide.index}`}</p>
                    <p className="mt-1 text-sm font-black leading-snug text-gray-950 line-clamp-2">
                      {cleanText(slide.main)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}
