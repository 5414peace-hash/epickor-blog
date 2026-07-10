import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CardNewsCarousel from '@/components/CardNewsCarousel';
import CardNewsRail from '@/components/CardNewsRail';
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
    title: `${item.topic} | EpicKor Instagram Guides`,
    description: item.description,
    alternates: {
      canonical: `/card-news/${item.slug}`,
    },
    openGraph: {
      title: `${item.topic} | EpicKor Instagram Guides`,
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

  const allItems = getAllCardNews();
  const related = allItems
    .filter((candidate) => candidate.slug !== item.slug)
    .slice(0, 8);
  const railItems = allItems.map((candidate) => ({
    slug: candidate.slug,
    href: candidate.href,
    coverImage: candidate.coverImage,
    topic: candidate.topic,
    label: candidate.label,
    totalCards: candidate.totalCards,
  }));

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
          <span className="text-gray-950">{item.topic}</span>
        </nav>
      </div>

      <CardNewsRail items={railItems} activeSlug={item.slug} />

      <main className="container mx-auto px-4 py-7 md:py-9">
        <section>
          <CardNewsCarousel
            title={item.topic}
            description={item.description}
            label={item.label}
            dateLabel={item.dateLabel}
            totalCards={item.totalCards}
            slides={item.slides}
            caption={item.caption}
            fullGuideHref={item.blogHref}
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
              {related.map((candidate) => (
                <Link key={`${candidate.folder}-${candidate.slug}`} href={candidate.href} className="group block">
                  <article className="overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm">
                    <div className="relative aspect-square bg-gray-950">
                      <Image
                        src={candidate.coverImage}
                        alt={`${candidate.topic} cover`}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.025]"
                        sizes="(max-width: 768px) 50vw, 120px"
                      />
                    </div>
                    <div className="p-2.5">
                      <p className="text-[10px] font-black uppercase text-red-600">{candidate.label}</p>
                      <h3 className="mt-1 text-xs font-black leading-snug text-gray-950 line-clamp-2">
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
