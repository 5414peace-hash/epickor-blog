'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

interface GuideChip {
  label: string;
  href: string;
}

interface HomeGuideFinderProps {
  chips: GuideChip[];
}

export default function HomeGuideFinder({ chips }: HomeGuideFinderProps) {
  const [query, setQuery] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      `site:epickor.com ${trimmed}`
    )}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <section className="border-b border-gray-200 bg-white">
      <div className="container mx-auto grid gap-4 px-4 py-3 lg:grid-cols-[minmax(320px,460px)_1fr] lg:items-center">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-[1fr_auto] overflow-hidden rounded-md border border-gray-300 bg-white"
          role="search"
        >
          <label htmlFor="home-guide-search" className="sr-only">
            Search EpicKor guides
          </label>
          <input
            id="home-guide-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
            placeholder="Search Korea guides, brands, topics, or questions..."
            type="search"
          />
          <button
            type="submit"
            className="border-l border-gray-300 bg-gray-950 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Search
          </button>
        </form>

        <nav className="scrollbar-none flex gap-2 overflow-x-auto" aria-label="Guide shortcuts">
          {chips.map((chip) => (
            <Link
              key={chip.href}
              href={chip.href}
              className="shrink-0 rounded-md border border-gray-200 bg-gray-50 px-4 py-2.5 text-center text-sm font-bold text-gray-800 transition-colors hover:border-gray-950 hover:bg-white hover:text-gray-950"
            >
              {chip.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
