import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getLatestArticles, type LatestArticle } from '@/lib/latest-articles';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'EpicKor Issues | Timely Korea News and Trend Explainers',
  description:
    'Date-anchored EpicKor explainers on Korean news, politics, business signals, labor, culture shifts, and emerging trends.',
  alternates: {
    canonical: '/issues',
  },
  openGraph: {
    title: 'EpicKor Issues | Timely Korea News and Trend Explainers',
    description:
      'Date-anchored EpicKor explainers on Korean news, politics, business signals, labor, culture shifts, and emerging trends.',
    url: 'https://www.epickor.com/issues',
  },
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function trimText(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trim()}...`;
}

function IssueCard({ article, priority = false }: { article: LatestArticle; priority?: boolean }) {
  return (
    <Link href={article.href} className="group block h-full">
      <article className="grid h-full overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm">
        <div className="relative aspect-[16/10] bg-gray-100">
          {article.image ? (
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority={priority}
              className="object-cover transition duration-500 group-hover:scale-[1.025]"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 260px"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-950 text-2xl font-black text-white">
              EK
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-black uppercase text-gray-500">
            <span className="rounded-md bg-gray-950 px-2 py-1 text-white">{article.label}</span>
            <time dateTime={article.date}>{formatDate(article.date)}</time>
          </div>
          <h2 className="mt-3 text-lg font-black leading-snug text-gray-950 group-hover:text-red-700">
            {trimText(article.title, 82)}
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600 line-clamp-3">{article.description}</p>
        </div>
      </article>
    </Link>
  );
}

export default function IssuesPage() {
  const latest = getLatestArticles(60);
  const issueArticles = latest.filter((article) =>
    ['Politics', 'Trend', 'Business', 'Education'].includes(article.label)
  );
  const visibleArticles = (issueArticles.length > 0 ? issueArticles : latest).slice(0, 15);

  return (
    <div className="min-h-screen bg-white text-gray-950">
      <section className="border-b border-gray-200 bg-[#f5f5f2]">
        <div className="container mx-auto px-4 py-10 md:py-12">
          <p className="text-xs font-black uppercase text-red-600">EpicKor Issues</p>
          <h1 className="mt-3 max-w-4xl font-serif text-4xl font-black leading-tight md:text-5xl">
            Timely Korea issues, explained with context and a clear date.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600">
            This is the home for substantial, date-anchored EpicKor reads on Korean public issues, business moves,
            political context, culture shifts, and trends worth understanding before the facts move again.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-gray-950">Latest Issue Reads</h2>
            <p className="mt-1 text-sm text-gray-600">
              Timely Korea explainers with the background international readers need.
            </p>
          </div>
          <Link href="/latest" className="text-sm font-black text-red-700 hover:text-red-900">
            Full latest feed -&gt;
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {visibleArticles.map((article, index) => (
            <IssueCard key={article.href} article={article} priority={index < 5} />
          ))}
        </div>
      </main>
    </div>
  );
}
