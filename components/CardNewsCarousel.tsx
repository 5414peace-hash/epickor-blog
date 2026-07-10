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
  slides: CardNewsCarouselSlide[];
  caption: string;
  fullGuideHref: string;
}

function splitLines(value: string): string[] {
  return value.split(/\\n|\n/g).map((line) => line.trim()).filter(Boolean);
}

export default function CardNewsCarousel({ title, slides, caption, fullGuideHref }: CardNewsCarouselProps) {
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
    <section
      className="w-full"
      aria-label={title}
      aria-roledescription="carousel"
    >
      <div
        ref={viewportRef}
        onScroll={updateSelectedFromScroll}
        className="scrollbar-none overflow-x-auto scroll-smooth rounded-lg bg-gray-950"
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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous card"
            onClick={() => scrollToSlide(Math.max(0, selected - 1))}
            disabled={selected === 0}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-gray-300 bg-white text-2xl font-black text-gray-950 transition hover:border-gray-950 disabled:cursor-not-allowed disabled:opacity-35"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next card"
            onClick={() => scrollToSlide(Math.min(slides.length - 1, selected + 1))}
            disabled={selected === slides.length - 1}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-gray-300 bg-white text-2xl font-black text-gray-950 transition hover:border-gray-950 disabled:cursor-not-allowed disabled:opacity-35"
          >
            ›
          </button>
        </div>

        <p className="rounded-md bg-gray-950 px-3 py-2 text-sm font-black text-white" aria-live="polite">
          Card {selected + 1} / {slides.length}
        </p>

        <div className="flex max-w-full items-center gap-1.5 overflow-x-auto">
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
          <h2 className="mt-2 text-xl font-black leading-snug text-gray-950">
            {splitLines(current.main).join(' ')}
          </h2>
          {current.sub && <p className="mt-2 text-sm leading-6 text-gray-600">{current.sub.replace(/\*\*/g, '')}</p>}
        </div>
      )}

      <div className="mt-4 rounded-lg border border-gray-200 bg-[#fbfaf8] p-4">
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
        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-700">{caption}</p>
        <Link
          href={fullGuideHref}
          className="mt-4 inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-red-700"
        >
          Read full guide
        </Link>
      </div>
    </section>
  );
}
