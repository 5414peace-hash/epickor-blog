import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CardNewsCarousel from '@/components/CardNewsCarousel';
import { getAllCardNews, getAllCardNewsSlugs, getCardNewsBySlug } from '@/lib/card-news';

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllCardNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getCardNewsBySlug(slug);

  if (!item) {
    return {
      title: 'Card News Not Found',
    };
  }

  return {
    title: `${item.topic} | EpicKor Card News`,
    description: item.description,
    alternates: {
      canonical: `/card-news/${item.slug}`,
    },
    openGraph: {
      title: `${item.topic} | EpicKor Card News`,
      description: item.description,
      url: `https://www.epickor.com/card-news/${item.slug}`,
      images: [item.coverImage],
    },
  };
}

export default async function CardNewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getCardNewsBySlug(slug);

  if (!item) {
    notFound();
  }

  const related = getAllCardNews()
    .filter((candidate) => candidate.slug !== item.slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-gray-950">
      <main className="container mx-auto px-4 py-8 md:py-10">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm font-bold text-gray-600">
          <Link href="/" className="hover:text-red-700">
            Home
          </Link>
          <span>/</span>
          <Link href="/card-news" className="hover:text-red-700">
            Card News
          </Link>
          <span>/</span>
          <span className="text-gray-950">{item.topic}</span>
        </nav>

        <header className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase text-red-600">{item.label} Card News</p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-black leading-tight text-gray-950 md:text-5xl">
              {item.topic}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600">{item.description}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-xl font-black text-gray-950">{item.totalCards}</p>
              <p className="mt-1 text-[11px] font-bold uppercase text-gray-500">Cards</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-xl font-black text-gray-950">{item.slug}</p>
              <p className="mt-1 text-[11px] font-bold uppercase text-gray-500">Guide</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-xl font-black text-gray-950">{item.dateLabel.replace(', 2026', '')}</p>
              <p className="mt-1 text-[11px] font-bold uppercase text-gray-500">Saved</p>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,640px)_minmax(0,1fr)] lg:items-start">
          <CardNewsCarousel
            title={item.topic}
            slides={item.slides}
            caption={item.caption}
            fullGuideHref={item.blogHref}
          />

          <aside className="grid gap-4">
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <p className="text-xs font-black uppercase text-red-600">Full Article</p>
              <h2 className="mt-2 text-2xl font-black leading-snug text-gray-950">
                Read the guide behind this carousel
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                The carousel is the fast visual version. The full EpicKor article has the details, context, and practical
                links.
              </p>
              <Link
                href={item.blogHref}
                className="mt-5 inline-flex items-center justify-center rounded-md bg-gray-950 px-4 py-2.5 text-sm font-black text-white transition hover:bg-red-700"
              >
                Open guide -&gt;
              </Link>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <p className="text-xs font-black uppercase text-gray-500">Slide List</p>
              <div className="mt-4 grid gap-3">
                {item.slides.map((slide) => (
                  <div key={slide.index} className="grid grid-cols-[54px_1fr] gap-3">
                    <div className="relative aspect-square overflow-hidden rounded-md bg-gray-950">
                      <Image
                        src={slide.renderedImage}
                        alt={slide.imageLabel || `${item.topic} card ${slide.index}`}
                        fill
                        className="object-cover"
                        sizes="54px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-black uppercase text-red-600">{slide.kicker || `Card ${slide.index}`}</p>
                      <p className="mt-1 text-sm font-black leading-snug text-gray-950 line-clamp-2">
                        {slide.main.replace(/\\n/g, ' ').replace(/\*\*/g, '')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        {related.length > 0 && (
          <section className="mt-10 border-t border-gray-200 pt-8">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-gray-950">More Card News</h2>
                <p className="mt-1 text-sm text-gray-600">Keep swiping through recent EpicKor carousels.</p>
              </div>
              <Link href="/card-news" className="text-sm font-black text-red-700 hover:text-red-900">
                All card news -&gt;
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((candidate) => (
                <Link key={`${candidate.folder}-${candidate.slug}`} href={candidate.href} className="group block">
                  <article className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="relative aspect-square bg-gray-950">
                      <Image
                        src={candidate.coverImage}
                        alt={`${candidate.topic} cover`}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.025]"
                        sizes="(max-width: 768px) 50vw, 240px"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-[11px] font-black uppercase text-red-600">{candidate.label}</p>
                      <h3 className="mt-2 text-sm font-black leading-snug text-gray-950 line-clamp-2">
                        {candidate.topic}
                      </h3>
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
