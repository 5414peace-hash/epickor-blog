import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HubCrossLinks from '@/components/HubCrossLinks';
import HubParentLine from '@/components/HubParentLine';
import HubAffiliateLine from '@/components/HubAffiliateLine';
import { BreadcrumbLd, HubLd } from '@/components/StructuredData';
import { GUIDE_GROUPS, PRICES, RAMYUN } from '@/lib/ramyun';

export const revalidate = 86400;

const TITLE = 'Korean Ramyun: Which Packet to Buy, How Hot It Actually Is, and What It Costs';
const DESCRIPTION =
  'Shin Ramyun, Ansungtangmyun, Buldak and Chapaghetti compared by soup base, format and verified Scoville numbers — original Buldak is about one jalapeño — plus current Korean prices and where to buy.';

export const metadata: Metadata = {
  title: `${TITLE} | EpicKor`,
  description: DESCRIPTION,
  alternates: { canonical: '/ramyun' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.epickor.com/ramyun',
    images: ['/assets/images/posts/346/ansungtangmyun-noodle-and-soup-powder.jpg'],
  },
};

/**
 * Bars are drawn against the hottest official Buldak so the scale stays honest
 * — the whole point of the table is that the famous "insanely spicy" noodle is
 * roughly one jalapeño, and a bar chart normalised to the hottest item is the
 * fastest way to show that without the reader doing arithmetic.
 */
const MAX_SHU = 13200;

function heatBar(heat: string): number | null {
  const m = heat.match(/([\d,]+)\s*SHU/);
  if (!m) return null;
  const value = Number(m[1].replace(/,/g, ''));
  if (!value) return null;
  return Math.max(3, Math.round((value / MAX_SHU) * 100));
}

export default function RamyunHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <HubLd
        name={TITLE}
        description={DESCRIPTION}
        href={metadata.alternates!.canonical as string}
        items={RAMYUN.map((r) => ({ name: r.name, href: `/blog/${r.slug}` }))}
      />
      <BreadcrumbLd
        trail={[
          { name: 'Home', href: '/' },
          { name: 'Guides', href: '/guides' },
          { name: 'Korean ramyun', href: metadata.alternates!.canonical as string },
        ]}
      />
      <section className="border-b border-gray-200 bg-orange-50/60">
        <div className="container mx-auto px-4 py-12 md:py-14">
          <div className="max-w-4xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-orange-700">
              Korean ramyun
            </p>
            <h1 className="text-3xl font-black leading-tight text-gray-950 md:text-5xl">
              The famous one is about as hot as a jalapeño.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Korean instant noodles get sorted into &ldquo;spicy&rdquo; and &ldquo;very spicy&rdquo;
              by almost every English guide, which sends people to the wrong packet. The real
              differences are the soup base — chili, soybean paste, black bean — and whether there is
              broth at all. Here they are side by side, with the Scoville figures that have actually
              been published.
            </p>
            <HubParentLine href="/ramyun" />
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-10">
        <section aria-labelledby="compare">
          <h2 id="compare" className="text-2xl font-black text-gray-950">
            Compared by what actually differs
          </h2>
          <p className="mt-2 max-w-3xl text-gray-600">
            Bars are scaled against the hottest official Buldak. Where no reliable published figure
            exists, the row says so rather than guessing — Shin Ramyun&rsquo;s numbers genuinely vary
            between sources, and inventing one would be worse than leaving it out.
          </p>

          <div className="table-scroll mt-6 overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                <tr>
                  <th scope="col" className="px-4 py-3 font-black">Noodle</th>
                  <th scope="col" className="px-4 py-3 font-black">Maker</th>
                  <th scope="col" className="px-4 py-3 font-black">Format</th>
                  <th scope="col" className="px-4 py-3 font-black">Built on</th>
                  <th scope="col" className="px-4 py-3 font-black">Heat</th>
                  <th scope="col" className="px-4 py-3 font-black">Buy it if</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {RAMYUN.map((r) => {
                  const bar = heatBar(r.heat);
                  return (
                    <tr key={r.name} className="align-top hover:bg-orange-50/50">
                      <th scope="row" className="px-4 py-4 font-black text-gray-950">
                        <Link href={`/blog/${r.slug}`} className="hover:text-orange-700 hover:underline">
                          {r.name}
                        </Link>
                        <span className="mt-0.5 block text-xs font-bold text-gray-500">{r.nameKo}</span>
                      </th>
                      <td className="whitespace-nowrap px-4 py-4 text-gray-700">{r.maker}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-gray-700">{r.format}</td>
                      <td className="px-4 py-4 text-gray-700">{r.base}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`block text-xs font-bold ${r.heatVerified ? 'text-gray-950' : 'text-gray-500'}`}
                        >
                          {r.heat}
                        </span>
                        {bar !== null && (
                          <span className="mt-1.5 block h-1.5 w-full max-w-[130px] overflow-hidden rounded-full bg-gray-200">
                            <span
                              className="block h-full rounded-full bg-orange-500"
                              style={{ width: `${bar}%` }}
                            />
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-gray-600">{r.buyIf}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            For reference, a single jalapeño runs roughly 2,500–8,000 SHU. Every figure here is
            sourced from the linked article.
          </p>
          <HubAffiliateLine
            href="https://www.amazon.com/s?k=korean+ramyun+variety+pack&amp;tag=epickor-20"
            label="Korean ramyun variety packs — compare on Amazon"
            network="amazon"
          />
        </section>

        <section aria-labelledby="prices" className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="prices" className="text-2xl font-black text-gray-950">
              What it costs in Korea
            </h2>
            <span className="rounded-md bg-gray-950 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white">
              Checked August 2026
            </span>
          </div>
          <p className="mt-2 max-w-3xl text-gray-600">
            Ramyun price is watched more closely in Korea than almost any other grocery item. When
            Nongshim raised prices in August 2026 it put up cup noodles, snacks and drinks and
            <strong> left bagged ramyun alone</strong> — bagged is about 63% of sales, and the ₩1,000
            bag works as a public benchmark that is politically expensive to move.
          </p>

          <div className="table-scroll mt-6 overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                <tr>
                  <th scope="col" className="px-4 py-3 font-black">Format</th>
                  <th scope="col" className="px-4 py-3 font-black">Korean</th>
                  <th scope="col" className="px-4 py-3 font-black">Price</th>
                  <th scope="col" className="px-4 py-3 font-black">Where and why</th>
                  <th scope="col" className="px-4 py-3 font-black">Verified in</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {PRICES.map((p) => (
                  <tr key={p.format} className="align-top hover:bg-orange-50/50">
                    <th scope="row" className="px-4 py-3 font-bold text-gray-950">{p.format}</th>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">{p.formatKo}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-black tabular-nums text-gray-950">{p.price}</td>
                    <td className="px-4 py-3 text-gray-600">{p.note}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Link href={`/blog/${p.slug}`} className="font-bold text-orange-700 hover:underline">
                        Read →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 max-w-3xl text-sm text-gray-600">
            <strong>The one rule that saves money:</strong> buy single packets at a convenience store
            only to sample. For anything more, a five-pack at E-Mart, Homeplus or Lotte Mart costs
            meaningfully less per serving.
          </p>
        </section>

        {GUIDE_GROUPS.map((group) => (
          <section key={group.heading} className="mt-14">
            <h2 className="text-2xl font-black text-gray-950">{group.heading}</h2>
            <p className="mt-2 max-w-3xl text-gray-600">{group.intro}</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.guides.map((g) => (
                <article
                  key={g.slug}
                  className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                >
                  <Link href={`/blog/${g.slug}`} className="block">
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                      <Image
                        src={g.image}
                        alt={g.imageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-black leading-snug text-gray-950">
                      <Link href={`/blog/${g.slug}`} className="hover:text-orange-700">
                        {g.title}
                      </Link>
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">{g.blurb}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-14 rounded-lg border border-amber-200 bg-amber-50/70 p-6">
          <h2 className="text-xl font-black text-gray-950">Buying it outside Korea</h2>
          <p className="mt-3 max-w-3xl leading-7 text-gray-700">
            Bagged ramyun is one of the few Korean foods that genuinely survives export — it is dry,
            shelf-stable and made for shipping. The honest caveat is that it costs several times the
            Korean price abroad, so if you are travelling, buy the five-packs at a mart before you
            fly rather than paying import pricing later. As an Amazon Associate, EpicKor may earn
            from qualifying purchases.
          </p>
          <a
            href="https://www.amazon.com/s?k=korean+ramyun+variety+pack&amp;tag=epickor-20"
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-gray-950 px-4 py-2.5 text-sm font-black text-white hover:bg-gray-800"
            data-analytics-location="ramyun_hub_amazon"
          >
            Compare Korean ramyun packs on Amazon →
          </a>
        </section>
        <HubCrossLinks current="/ramyun" />
      </main>
    </div>
  );
}
