import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HubCrossLinks from '@/components/HubCrossLinks';
import HubParentLine from '@/components/HubParentLine';
import HubAffiliateLine from '@/components/HubAffiliateLine';
import { BreadcrumbLd, HubLd } from '@/components/StructuredData';
import { DRINKS, GUIDE_GROUPS, PRICES } from '@/lib/drinks';

export const revalidate = 86400;

const TITLE = 'Korean Drinks: What Each One Actually Is, and What It Costs';
const DESCRIPTION =
  'Chilsung Cider is not cider, Yakult is not yoghurt, and Bacchus is legally a quasi-drug. The Korean drinks aisle explained product by product, with current Korean prices and what to buy first.';

export const metadata: Metadata = {
  title: `${TITLE} | EpicKor`,
  description: DESCRIPTION,
  alternates: { canonical: '/drinks' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.epickor.com/drinks',
    images: ['/assets/images/posts/365/chilsung-cider-bottles.jpg'],
  },
};

/** Verification month shown on the price table. Bump it when the prices are re-checked. */
const PRICES_CHECKED = 'August 2026';

export default function DrinksHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <HubLd
        name={TITLE}
        description={DESCRIPTION}
        href="/drinks"
        items={GUIDE_GROUPS.flatMap((g) => g.guides).map((g) => ({ name: g.title, href: `/blog/${g.slug}` }))}
      />
      <BreadcrumbLd
        trail={[
          { name: 'Home', href: '/' },
          { name: 'Guides', href: '/guides' },
          { name: 'Korean drinks', href: '/drinks' },
        ]}
      />

      <section className="border-b border-gray-200 bg-sky-50/60">
        <div className="container mx-auto px-4 py-12 md:py-14">
          <div className="max-w-4xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-sky-700">
              Korean drinks
            </p>
            <h1 className="text-3xl font-black leading-tight text-gray-950 md:text-5xl">
              Half the names on this shelf point at the wrong thing.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Korean cider has no apples and no alcohol. Yakult is not yoghurt. Bacchus is not an
              energy drink — above a certain dose of taurine it is legally a drug, which is why the
              stronger bottle is behind a pharmacy counter. Each of those is a separate article. This
              is the table that puts them side by side, with what each one costs this month.
            </p>
            <HubParentLine href="/drinks" />
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-10">
        <section aria-labelledby="reality">
          <h2 id="reality" className="text-2xl font-black text-gray-950">
            What each one actually is
          </h2>
          <p className="mt-2 max-w-3xl text-gray-600">
            The middle column is the reason this page exists. Every one of these is a drink a visitor
            can pick up in the first hour of a trip and misread, and the misreading is consistent
            enough to be worth tabulating.
          </p>

          <div className="table-scroll mt-6 overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[880px] border-collapse text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                <tr>
                  <th scope="col" className="px-4 py-3 font-black">Drink</th>
                  <th scope="col" className="px-4 py-3 font-black">What you assume</th>
                  <th scope="col" className="px-4 py-3 font-black">What it is</th>
                  <th scope="col" className="px-4 py-3 font-black">Buy it if</th>
                  <th scope="col" className="px-4 py-3 font-black">Read</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {DRINKS.map((d) => (
                  <tr key={d.name} className="align-top hover:bg-sky-50/50">
                    <th scope="row" className="px-4 py-4 font-black text-gray-950">
                      {d.name}
                      <span className="mt-0.5 block text-xs font-bold text-gray-500">{d.nameKo}</span>
                      <span className="mt-1 block text-xs font-normal text-gray-500">{d.maker}</span>
                    </th>
                    <td className="px-4 py-4 text-gray-500 line-through decoration-gray-300">{d.assumption}</td>
                    <td className="px-4 py-4 font-medium text-gray-800">{d.reality}</td>
                    <td className="px-4 py-4 text-gray-600">{d.buyIf}</td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <Link href={`/blog/${d.slug}`} className="font-bold text-sky-700 hover:underline">
                        Read →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <HubAffiliateLine
            href="https://www.amazon.com/s?k=korean+drinks+variety&amp;tag=epickor-20"
            label="Korean drinks that actually ship — compare on Amazon"
            network="amazon"
          />
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
            Every figure links to the article it was verified in. Two of these moved recently —
            Chilsung Cider went up on 1 August 2026 — so treat the table as the band rather than the
            till receipt.
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
                  <tr key={p.item} className="align-top hover:bg-sky-50/50">
                    <th scope="row" className="px-4 py-3 font-bold text-gray-950">{p.item}</th>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">{p.itemKo}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-black tabular-nums text-gray-950">{p.price}</td>
                    <td className="px-4 py-3 text-gray-600">{p.note}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Link href={`/blog/${p.slug}`} className="font-bold text-sky-700 hover:underline">
                        Read →
                      </Link>
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
                      <Link href={`/blog/${g.slug}`} className="hover:text-sky-700">
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
            Chilled drinks are the part of this shelf that does not travel — Yakult is short-dated
            and the Fresh Manager cart does not ship. Cans, coffee mix and the tonic bottles do
            travel, and they turn up in most Asian grocers. Two things to know before you buy abroad:
            export formulations and can sizes often differ from the Korean domestic ones, and the
            zero and seasonal flavours rarely leave Korea at all. As an Amazon Associate, EpicKor may
            earn from qualifying purchases.
          </p>
          <a
            href="https://www.amazon.com/s?k=korean+drinks+variety&amp;tag=epickor-20"
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-gray-950 px-4 py-2.5 text-sm font-black text-white hover:bg-gray-800"
            data-analytics-location="drinks_hub_amazon"
          >
            Compare Korean drinks on Amazon →
          </a>
        </section>

        <HubCrossLinks current="/drinks" />
      </main>
    </div>
  );
}
