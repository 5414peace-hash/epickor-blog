import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getLatestArticles, type LatestArticle } from '@/lib/latest-articles';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Latest on EpicKor | New Korea Guides, Business, Trends, and Culture',
  description:
    'The newest EpicKor posts across Korea travel, food, shopping, culture, business, politics, trends, and lifestyle guides.',
  alternates: {
    canonical: '/latest',
  },
  openGraph: {
    title: 'Latest on EpicKor | New Korea Guides, Business, Trends, and Culture',
    description:
      'The newest EpicKor posts across Korea travel, food, shopping, culture, business, politics, trends, and lifestyle guides.',
    url: 'https://www.epickor.com/latest',
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

function labelClass(label: string): string {
  if (label === 'Issues') return 'bg-red-700 text-white';
  if (label === 'Business') return 'bg-emerald-700 text-white';
  if (label === 'Politics') return 'bg-gray-950 text-white';
  if (label === 'Trend') return 'bg-red-600 text-white';
  if (label === 'Education') return 'bg-violet-700 text-white';
  if (label === 'Travel') return 'bg-blue-700 text-white';
  if (label === 'Food & Shopping') return 'bg-amber-600 text-white';
  if (label === 'Beauty & Lifestyle') return 'bg-pink-600 text-white';
  return 'bg-gray-200 text-gray-950';
}

function LatestImage({
  article,
  className,
  sizes,
  priority = false,
}: {
  article: Pick<LatestArticle, 'title' | 'image'>;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  const positionClass = /\b(absolute|fixed|relative|sticky)\b/.test(className) ? '' : 'relative';

  if (!article.image) {
    return (
      <div className={`${positionClass} ${className} flex items-center justify-center bg-gray-950 text-3xl font-black text-white`}>
        EK
      </div>
    );
  }

  const normalizedImage = article.image.toLowerCase();
  const fitClass = normalizedImage.endsWith('.svg')
    ? 'object-contain p-5'
    : normalizedImage.includes('korea-national-mcs-hero')
      ? 'object-contain'
      : 'object-cover';

  return (
    <div className={`${positionClass} ${className} overflow-hidden bg-gray-100`}>
      <Image
        src={article.image}
        alt={article.title}
        fill
        priority={priority}
        className={`${fitClass} transition-transform duration-500 group-hover:scale-105`}
        sizes={sizes}
      />
    </div>
  );
}

function LeadLatestCard({ article, priority = false }: { article: LatestArticle; priority?: boolean }) {
  return (
    <Link href={article.href} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md">
        <LatestImage article={article} className="aspect-[16/9] w-full" sizes="(max-width: 1024px) 100vw, 33vw" priority={priority} />
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-md px-2.5 py-1 text-xs font-black uppercase ${labelClass(article.label)}`}>
              {article.label}
            </span>
            <time dateTime={article.date} className="text-xs font-bold text-gray-500">
              {formatDate(article.date)}
            </time>
          </div>
          <h2 className="mt-4 font-serif text-2xl font-black leading-tight text-gray-950 group-hover:text-red-700">
            {article.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-600 line-clamp-3">{article.description}</p>
          <span className="mt-auto pt-5 text-sm font-black text-red-700">Read article -&gt;</span>
        </div>
      </article>
    </Link>
  );
}

function LatestFeedCard({ article }: { article: LatestArticle }) {
  return (
    <Link href={article.href} className="group block h-full">
      <article className="grid h-full grid-cols-[104px_1fr] overflow-hidden rounded-lg border border-gray-200 bg-white md:grid-cols-1">
        <LatestImage article={article} className="h-full min-h-28 md:h-40" sizes="(max-width: 768px) 104px, 25vw" />
        <div className="min-w-0 p-4">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className={`rounded-md px-2 py-0.5 text-[11px] font-black uppercase ${labelClass(article.label)}`}>
              {article.label}
            </span>
            <time dateTime={article.date} className="text-[11px] font-bold text-gray-500">
              {formatDate(article.date)}
            </time>
          </div>
          <h3 className="mt-3 text-base font-black leading-snug text-gray-950 line-clamp-2 group-hover:text-red-700">
            {trimText(article.title, 78)}
          </h3>
          <p className="mt-2 text-xs leading-5 text-gray-600 line-clamp-3">{article.description}</p>
          {article.detail && <p className="mt-3 text-[11px] font-bold text-gray-500">{article.detail}</p>}
        </div>
      </article>
    </Link>
  );
}

export default function LatestPage() {
  const articles = getLatestArticles(48);
  const featured = articles[0];
  const latestDate = featured?.date;
  const businessCount = articles.filter((article) => article.source === 'business').length;
  const labels = Array.from(new Set(articles.slice(0, 24).map((article) => article.label)));
  const leadArticles = articles.slice(0, 3);
  const mainRecentArticles = articles.slice(3, 24);
  const moreArticles = articles.slice(24);

  return (
    <div className="min-h-screen bg-white text-gray-950">
      <section className="border-b border-gray-200 bg-[#fbfaf8]">
        <div className="container mx-auto px-4 py-8 md:py-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase text-red-600">Latest on EpicKor</p>
              <h1 className="mt-3 max-w-4xl font-serif text-4xl font-black leading-tight text-gray-950 md:text-5xl">
                New Korea guides, business stories, trends, and culture explainers.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600">
                Follow the newest EpicKor posts in one place as the site expands from travel and lifestyle into sharper
                Korea business, politics, trend, and news-adjacent topics.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <p className="text-xl font-black text-gray-950">{articles.length}</p>
                <p className="mt-1 text-[11px] font-bold uppercase text-gray-500">Recent</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <p className="text-xl font-black text-gray-950">{businessCount}</p>
                <p className="mt-1 text-[11px] font-bold uppercase text-gray-500">Business</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <p className="text-xl font-black text-gray-950">{latestDate ? formatDate(latestDate).replace(', 2026', '') : '-'}</p>
                <p className="mt-1 text-[11px] font-bold uppercase text-gray-500">Newest</p>
              </div>
            </div>
          </div>

          {labels.length > 0 && (
            <div className="scrollbar-none mt-6 flex gap-2 overflow-x-auto">
              {labels.map((label) => (
                <span key={label} className="shrink-0 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-black text-gray-700">
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {featured && (
          <section aria-labelledby="latest-lead-heading">
            <div className="mb-5 flex items-end justify-between gap-3 border-b border-gray-200 pb-4">
              <div>
                <p className="text-xs font-black uppercase text-red-600">Just published</p>
                <h2 id="latest-lead-heading" className="mt-1 text-2xl font-black text-gray-950">Latest stories</h2>
              </div>
              <p className="hidden text-sm text-gray-500 sm:block">The three newest EpicKor reads</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {leadArticles.map((article, index) => (
                <LeadLatestCard key={article.href} article={article} priority={index < 3} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-2xl font-black text-gray-950">All Recent Posts</h2>
              <p className="mt-1 text-sm text-gray-600">Newest first across blog and business desk.</p>
            </div>
            <Link href="/" className="text-sm font-black text-red-700 hover:text-red-900">
              Back to home -&gt;
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {mainRecentArticles.map((article) => (
              <LatestFeedCard key={article.href} article={article} />
            ))}
          </div>

          {moreArticles.length > 0 && (
            <details className="mt-6 rounded-lg border border-gray-200 bg-[#fbfaf8] p-4">
              <summary className="cursor-pointer text-sm font-black text-red-700">And more recent posts</summary>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {moreArticles.map((article) => (
                  <LatestFeedCard key={article.href} article={article} />
                ))}
              </div>
            </details>
          )}
        </section>
      </main>
    </div>
  );
}
