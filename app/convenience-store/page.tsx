import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HubCrossLinks from '@/components/HubCrossLinks';
import HubParentLine from '@/components/HubParentLine';
import { BreadcrumbLd, HubLd } from '@/components/StructuredData';
import { CHAINS, GUIDE_GROUPS, HOW_TO, PRICES } from '@/lib/convenience-store';

export const revalidate = 86400;

const TITLE = 'Korean Convenience Stores: What to Buy, What It Costs, and Which Chain Has It';
const DESCRIPTION =
  'CU, GS25, 7-Eleven and Emart24 compared, current prices for the things people actually buy, and guides to the specific products — samgak kimbap, Yonsei cream bread, Bacchus, Vita 500 and the rest.';

export const metadata: Metadata = {
  title: `${TITLE} | EpicKor`,
  description: DESCRIPTION,
  alternates: { canonical: '/convenience-store' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.epickor.com/convenience-store',
    images: ['/assets/images/posts/059/convenience-store-lunchbox-01.jpg'],
  },
};

/** Verification month shown on the price table. Bump it when the prices are re-checked. */
const PRICES_CHECKED = 'August 2026';

export default function ConvenienceStoreHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <HubLd
        name={TITLE}
        description={DESCRIPTION}
        href="/convenience-store"
        items={GUIDE_GROUPS.flatMap((g) => g.guides).map((g) => ({ name: g.title, href: `/blog/${g.slug}` }))}
      />
      <BreadcrumbLd
        trail={[
          { name: 'Home', href: '/' },
          { name: 'Guides', href: '/guides' },
          { name: 'Korean convenience stores', href: '/convenience-store' },
        ]}
      />
      <section className="border-b border-gray-200 bg-red-50/50">
        <div className="container mx-auto px-4 py-12 md:py-14">
          <div className="max-w-4xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-red-600">
              Korean convenience stores
            </p>
            <h1 className="text-3xl font-black leading-tight text-gray-950 md:text-5xl">
              A different category of shop, not a smaller supermarket.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Korean convenience stores cook, host, deliver and run their own product lines. Chains
              hold exclusives you cannot buy anywhere else, prices move with promotions, and the
              stock rotates fast enough that a guide written last year is describing a different
              shelf. Here is what is on it now.
            </p>
            <HubParentLine href="/convenience-store" />
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-10">
        <section aria-labelledby="chains">
          <h2 id="chains" className="text-2xl font-black text-gray-950">
            The four chains, and what separates them
          </h2>
          <p className="mt-2 max-w-3xl text-gray-600">
            There is no single &ldquo;number one&rdquo; — GS25 leads on revenue and CU on store
            count, which is why Korean coverage always has to say which measure it means. For a
            visitor the practical difference is the exclusives.
          </p>

          <div className="table-scroll mt-6 overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[780px] border-collapse text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                <tr>
                  <th scope="col" className="px-4 py-3 font-black">Chain</th>
                  <th scope="col" className="px-4 py-3 font-black">Known for</th>
                  <th scope="col" className="px-4 py-3 font-black">Exclusive worth crossing the road for</th>
                  <th scope="col" className="px-4 py-3 font-black">Where it stands</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {CHAINS.map((c) => (
                  <tr key={c.name} className="align-top hover:bg-red-50/40">
                    <th scope="row" className="px-4 py-4 font-black text-gray-950">
                      {c.name}
                      <span className="mt-0.5 block text-xs font-bold text-gray-500">{c.nameKo}</span>
                    </th>
                    <td className="px-4 py-4 text-gray-700">{c.knownFor}</td>
                    <td className="px-4 py-4 text-gray-700">
                      {c.exclusiveSlug ? (
                        <Link href={`/blog/${c.exclusiveSlug}`} className="font-bold text-red-700 hover:underline">
                          {c.exclusive}
                        </Link>
                      ) : (
                        c.exclusive
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-600">{c.standing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Business figures are 2024 full-year, from Korean business press. Store counts across the
            four chains fell by about 1,600 that year.
          </p>
        </section>

        <section aria-labelledby="prices" className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="prices" className="text-2xl font-black text-gray-950">
              What it costs right now
            </h2>
            {/* The date is the point. A price table without one is a rumour. */}
            <span className="rounded-md bg-gray-950 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white">
              Checked {PRICES_CHECKED}
            </span>
          </div>
          <p className="mt-2 max-w-3xl text-gray-600">
            Every figure below links to the article it was verified in. Korean convenience stores use
            open pricing, so individual stores vary and promotions are constant — treat these as the
            band, not the till receipt.
          </p>

          <div className="table-scroll mt-6 overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                <tr>
                  <th scope="col" className="px-4 py-3 font-black">Item</th>
                  <th scope="col" className="px-4 py-3 font-black">Korean</th>
                  <th scope="col" className="px-4 py-3 font-black">Price</th>
                  <th scope="col" className="px-4 py-3 font-black">Worth knowing</th>
                  <th scope="col" className="px-4 py-3 font-black">Verified in</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {PRICES.map((p) => (
                  <tr key={p.item} className="align-top hover:bg-red-50/40">
                    <th scope="row" className="px-4 py-3 font-bold text-gray-950">{p.item}</th>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">{p.itemKo}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-black tabular-nums text-gray-950">{p.price}</td>
                    <td className="px-4 py-3 text-gray-600">{p.note}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Link href={`/blog/${p.slug}`} className="font-bold text-red-700 hover:underline">
                        Read →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>


        <section aria-labelledby="howto" className="mt-14">
          <h2 id="howto" className="text-2xl font-black text-gray-950">
            How to actually use one
          </h2>
          <p className="mt-2 max-w-3xl text-gray-600">
            The half of the format that is not about food. Most of these are things visitors
            hesitate over at the counter for no reason.
          </p>

          <div className="table-scroll mt-6 overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                <tr>
                  <th scope="col" className="px-4 py-3 font-black">Question</th>
                  <th scope="col" className="px-4 py-3 font-black">Short answer</th>
                  <th scope="col" className="px-4 py-3 font-black">What to know</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {HOW_TO.map((h) => (
                  <tr key={h.thing} className="align-top hover:bg-red-50/40">
                    <th scope="row" className="whitespace-nowrap px-4 py-3 font-bold text-gray-950">{h.thing}</th>
                    <td className="whitespace-nowrap px-4 py-3 font-black text-red-700">{h.answer}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {h.detail}
                      {h.slug && (
                        <>
                          {' '}
                          <Link href={`/blog/${h.slug}`} className="font-bold text-red-700 hover:underline">
                            More →
                          </Link>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                      <Link href={`/blog/${g.slug}`} className="hover:text-red-700">
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
          <h2 className="text-xl font-black text-gray-950">Taking it home</h2>
          <p className="mt-3 max-w-3xl leading-7 text-gray-700">
            Most of what makes a Korean convenience store good does not travel — the chilled cream
            bread, the meal trays and the machine-cooked noodles are all things you have to be
            standing there for. The packaged snacks do travel, and they are cheaper at a mart than at
            a convenience store, which is the single most avoidable overspend for visitors. As an
            Amazon Associate, EpicKor may earn from qualifying purchases.
          </p>
          <a
            href="https://www.amazon.com/s?k=korean+snack+variety+box&amp;tag=epickor-20"
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-gray-950 px-4 py-2.5 text-sm font-black text-white hover:bg-gray-800"
            data-analytics-location="cvs_hub_amazon"
          >
            Compare Korean snack boxes on Amazon →
          </a>
        </section>
        <HubCrossLinks current="/convenience-store" />
      </main>
    </div>
  );
}
