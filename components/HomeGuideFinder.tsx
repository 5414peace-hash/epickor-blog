'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

interface GuideChip {
  label: string;
  href: string;
}

interface HomeGuideFinderProps {
  /** Topic sections — the subject you want to browse. */
  chips: GuideChip[];
  /**
   * Reference hubs. Kept in a separate, labelled row rather than mixed into the
   * topic chips: Seoul sits inside Travel and the food hubs sit inside Food &
   * Shopping, so listing them side by side put children next to their own
   * parents and made the site look like it had a dozen unrelated categories.
   */
  guides?: GuideChip[];
}

export default function HomeGuideFinder({ chips, guides = [] }: HomeGuideFinderProps) {
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

        <div className="grid gap-2">
          {guides.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="hidden shrink-0 text-[10px] font-black uppercase tracking-[0.12em] text-gray-500 sm:block">
                Compare
              </span>
              <nav className="scrollbar-none flex gap-2 overflow-x-auto" aria-label="Comparison guides">
                {guides.map((chip) => (
                  <Link
                    key={chip.href}
                    href={chip.href}
                    className="shrink-0 rounded-md border border-gray-950 bg-gray-950 px-3.5 py-2 text-center text-sm font-bold text-white transition-colors hover:bg-gray-800"
                  >
                    {chip.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="hidden shrink-0 text-[10px] font-black uppercase tracking-[0.12em] text-gray-500 sm:block">
              Browse
            </span>
            <nav className="scrollbar-none flex gap-2 overflow-x-auto" aria-label="Topic sections">
              {chips.map((chip) => (
                <Link
                  key={chip.href}
                  href={chip.href}
                  className="shrink-0 rounded-md border border-gray-200 bg-gray-50 px-3.5 py-2 text-center text-sm font-bold text-gray-800 transition-colors hover:border-gray-950 hover:bg-white hover:text-gray-950"
                >
                  {chip.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
