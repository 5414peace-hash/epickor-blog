import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CardNewsDetailExperience from '@/components/CardNewsDetailExperience';
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

  return <CardNewsDetailExperience items={getAllCardNews()} initialSlug={item.slug} />;
}
