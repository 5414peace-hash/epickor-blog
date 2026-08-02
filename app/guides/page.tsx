import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HUBS } from '@/lib/hubs';
import { BreadcrumbLd, HubLd } from '@/components/StructuredData';

export const revalidate = 86400;

const TITLE = 'EpicKor Guides: Korea, Compared Side by Side';
const DESCRIPTION =
  'EpicKor’s reference guides — Seoul by neighbourhood, Korean convenience stores, and Korean ramyun. Each one compares the options in a single table, with prices checked this month and every figure traced to the article that verified it.';

export const metadata: Metadata = {
  title: `${TITLE} | EpicKor`,
  description: DESCRIPTION,
  alternates: { canonical: '/guides' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.epickor.com/guides',
    images: ['/assets/images/posts/355/ikseon-dong-hanok-alley.jpg'],
  },
};

export default function GuidesIndexPage() {
  const totalArticles = HUBS.reduce((sum, h) => sum + h.articleCount, 0);

  return (
    <div className="min-h-screen bg-white">
      <HubLd
        name={TITLE}
        description={DESCRIPTION}
        href="/guides"
        items={HUBS.map((h) => ({ name: h.title, href: h.href }))}
      />
      <BreadcrumbLd trail={[{ name: 'Home', href: '/' }, { name: 'Guides', href: '/guides' }]} />
      <section className="border-b border-gray-200 bg-slate-50">
        <div className="container mx-auto px-4 py-12 md:py-14">
          <div className="max-w-4xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-gray-600">
              EpicKor Guides
            </p>
            <h1 className="text-3xl font-black leading-tight text-gray-950 md:text-5xl">
              The parts of Korea worth comparing, compared.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Individual articles answer one question. These guides answer the question that comes
              before it — which neighbourhood, which chain, which packet. Each one leads with a table
              rather than a list, prices carry the month they were checked, and every figure links to
              the article it was verified in.
            </p>
            <p className="mt-4 text-sm font-bold text-gray-500">
              {HUBS.length} guides · {totalArticles} articles
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-10">
        <div className="grid gap-8">
          {HUBS.map((hub) => (
            <article
              key={hub.href}
              className={`group grid gap-0 overflow-hidden rounded-lg border ${hub.accentBorder} md:grid-cols-[minmax(0,340px)_1fr]`}
            >
              <Link href={hub.href} className="block">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 md:h-full">
                  <Image
                    src={hub.image}
                    alt={hub.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 340px"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              </Link>
              <div className={`flex flex-col justify-center p-6 ${hub.accentBg}`}>
                <p className={`text-[11px] font-black uppercase tracking-[0.14em] ${hub.accentText}`}>
                  {hub.articleCount} articles
                </p>
                <h2 className="mt-1.5 text-2xl font-black leading-tight text-gray-950">
                  <Link href={hub.href} className="hover:underline">
                    {hub.title}
                  </Link>
                </h2>
                <p className="mt-3 leading-7 text-gray-700">{hub.blurb}</p>
                <p className="mt-3 text-sm font-bold text-gray-600">{hub.whatItAdds}</p>
                <Link
                  href={hub.href}
                  className="mt-5 inline-flex w-fit items-center gap-2 rounded-md bg-gray-950 px-4 py-2.5 text-sm font-black text-white hover:bg-gray-800"
                >
                  Open the guide →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-12 max-w-3xl text-sm leading-6 text-gray-500">
          More guides are being built. The rule for adding one is that the comparison has to be
          something an individual article cannot carry — a table of options, a set of prices, or a
          decision that only makes sense with everything side by side.
        </p>
      </main>
    </div>
  );
}
