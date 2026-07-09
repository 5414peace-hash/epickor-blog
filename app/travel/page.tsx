import type { Metadata } from 'next';
import SectionLandingPage from '@/components/SectionLandingPage';
import { sectionPageConfigs } from '@/lib/section-pages';

export const revalidate = 86400;

const config = sectionPageConfigs.travel;

export const metadata: Metadata = {
  title: config.metadataTitle,
  description: config.metadataDescription,
  alternates: {
    canonical: config.href,
  },
  openGraph: {
    title: config.metadataTitle,
    description: config.metadataDescription,
    url: `https://www.epickor.com${config.href}`,
  },
};

export default function TravelPage() {
  return <SectionLandingPage config={config} />;
}
