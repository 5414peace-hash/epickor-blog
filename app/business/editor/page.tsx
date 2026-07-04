import type { Metadata } from 'next';
import Link from 'next/link';
import { BUSINESS_AUTHOR_NAME } from '@/lib/business';

export const metadata: Metadata = {
  title: 'EpicKor Business Editor | Editorial Profile',
  description:
    'Editorial profile for EpicKor Business coverage on Korean industries, SMEs, sourcing paths, and market-entry context.',
  alternates: {
    canonical: '/business/editor',
  },
  openGraph: {
    title: 'EpicKor Business Editor | Editorial Profile',
    description:
      'Editorial profile for EpicKor Business coverage on Korean industries, SMEs, sourcing paths, and market-entry context.',
    url: 'https://www.epickor.com/business/editor',
  },
};

export default function BusinessEditorProfilePage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-4xl px-4 py-14">
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-emerald-700">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/business" className="hover:text-emerald-700">
            Business
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Editor</span>
        </nav>

        <header className="border-b border-gray-200 pb-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
            Editorial Profile
          </p>
          <h1 className="text-4xl font-black leading-tight text-gray-950 md:text-5xl">
            {BUSINESS_AUTHOR_NAME}
          </h1>
          <p className="mt-5 text-lg leading-8 text-gray-600">
            EpicKor Business Editor is the transparent brand byline for EpicKor&apos;s Korea
            business, industry, sourcing, and market-entry coverage.
          </p>
        </header>

        <section className="py-10">
          <h2 className="text-2xl font-black text-gray-950">What This Byline Means</h2>
          <div className="mt-5 space-y-5 text-base leading-8 text-gray-600">
            <p>
              This byline represents EpicKor&apos;s business editorial desk, not a fictional
              individual author. EpicKor does not use fake headshots, invented credentials, or
              fictional editorial personas for business coverage.
            </p>
            <p>
              The section is informed by Tripclip&apos;s 10 years of video-production work and
              export-voucher field experience, especially where Korean SMEs, overseas-facing
              communication, buyer questions, and market-entry context overlap.
            </p>
          </div>
        </section>

        <section className="border-t border-gray-200 py-10">
          <h2 className="text-2xl font-black text-gray-950">Editorial Standards</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-slate-50 p-5">
              <h3 className="text-base font-black text-gray-950">Guides</h3>
              <p className="mt-2 text-sm leading-7 text-gray-600">
                Search-demand guides prioritize practical operator questions, official sources,
                reliable industry references, and clearly labeled estimates.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-slate-50 p-5">
              <h3 className="text-base font-black text-gray-950">Client Stories</h3>
              <p className="mt-2 text-sm leading-7 text-gray-600">
                Client stories require representative selection, client consent, and permission to
                embed the production video before drafting or publication.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-slate-50 p-5">
              <h3 className="text-base font-black text-gray-950">Company Spotlights</h3>
              <p className="mt-2 text-sm leading-7 text-gray-600">
                Non-client spotlights use public information only and stay editorial. They are not
                written as vendor sales copy.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-slate-50 p-5">
              <h3 className="text-base font-black text-gray-950">Affiliate Disclosure</h3>
              <p className="mt-2 text-sm leading-7 text-gray-600">
                Relevant Amazon links may appear when useful for readers. As an Amazon Associate,
                EpicKor earns from qualifying purchases.
              </p>
            </div>
          </div>
        </section>

        <div className="border-t border-gray-200 pt-8">
          <Link
            href="/business"
            className="inline-flex rounded-md bg-gray-950 px-5 py-3 text-sm font-bold text-white hover:bg-gray-800"
          >
            Back to EpicKor Business
          </Link>
        </div>
      </main>
    </div>
  );
}
