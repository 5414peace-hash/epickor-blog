import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HubCrossLinks from '@/components/HubCrossLinks';
import { BreadcrumbLd, HubLd } from '@/components/StructuredData';
import { NEIGHBOURHOODS } from '@/lib/seoul';

export const revalidate = 86400;

const TITLE = 'Seoul by Neighbourhood: Which One Is Actually Worth Your Afternoon';
const DESCRIPTION =
  'Seoul is not one city. Ikseon-dong, Euljiro, Yeonnam-dong, Mangwon, Haebangchon, Mullae, Seongsu and Hannam compared by character, nearest station, whether to stay there, and how long each really takes.';

export const metadata: Metadata = {
  title: `${TITLE} | EpicKor`,
  description: DESCRIPTION,
  alternates: { canonical: '/seoul' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.epickor.com/seoul',
    images: ['/assets/images/posts/355/ikseon-dong-hanok-alley.jpg'],
  },
};

/** Colour-codes the accommodation verdict so the table scans without reading. */
function stayClass(stay: string): string {
  if (stay === 'Good base') return 'bg-emerald-50 text-emerald-800 ring-emerald-200';
  if (stay === 'Workable') return 'bg-amber-50 text-amber-800 ring-amber-200';
  return 'bg-gray-100 text-gray-700 ring-gray-200';
}

/**
 * "Pick by what you want" — the entry point for readers who do not yet know
 * any neighbourhood names, which is most of them. Each row is a decision, not
 * a category.
 */
const PICKERS: { want: string; answer: string; slug: string }[] = [
  { want: 'I want to do nothing outdoors', answer: 'Yeonnam-dong', slug: '351' },
  { want: 'I want to drink somewhere with atmosphere', answer: 'Euljiro', slug: '349' },
  { want: 'I want to eat where locals shop', answer: 'Mangwon-dong', slug: '354' },
  { want: 'I want to sit inside an old house', answer: 'Ikseon-dong', slug: '355' },
  { want: 'I want history under my feet', answer: 'Haebangchon', slug: '353' },
  { want: 'I want somewhere not built for visitors', answer: 'Mullae', slug: '352' },
  { want: 'I want to shop and see pop-ups', answer: 'Seongsu or Hannam', slug: '163' },
];

export default function SeoulHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <HubLd
        name={TITLE}
        description={DESCRIPTION}
        href={metadata.alternates!.canonical as string}
        items={NEIGHBOURHOODS.map((n) => ({ name: n.name, href: `/blog/${n.slug}` }))}
      />
      <BreadcrumbLd
        trail={[
          { name: 'Home', href: '/' },
          { name: 'Guides', href: '/guides' },
          { name: 'Seoul by neighbourhood', href: metadata.alternates!.canonical as string },
        ]}
      />
      <section className="border-b border-gray-200 bg-slate-50">
        <div className="container mx-auto px-4 py-12 md:py-14">
          <div className="max-w-4xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
              Seoul by neighbourhood
            </p>
            <h1 className="text-3xl font-black leading-tight text-gray-950 md:text-5xl">
              Seoul is not one city. Pick the neighbourhood first.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Most Seoul guides hand you a list of cafes. That is the wrong order. The neighbourhoods
              here feel genuinely different from each other, and the reason is usually historical —
              a buried railway, a shrine approach, a district of workshops that emptied out. Work out
              which one you want, then book near it.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-10">
        {/* The comparison table leads, deliberately. A card grid first would read
            as one more list; the comparison is the reason to be here. */}
        <section aria-labelledby="compare">
          <h2 id="compare" className="text-2xl font-black text-gray-950">
            Compared side by side
          </h2>
          <p className="mt-2 max-w-3xl text-gray-600">
            The &ldquo;worth staying in&rdquo; column is about accommodation, not quality. Two of
            these are excellent to spend an afternoon in and a poor place to sleep.
          </p>

          <div className="table-scroll mt-6 overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                <tr>
                  <th scope="col" className="px-4 py-3 font-black">Neighbourhood</th>
                  <th scope="col" className="px-4 py-3 font-black">Character</th>
                  <th scope="col" className="px-4 py-3 font-black">Who it suits</th>
                  <th scope="col" className="px-4 py-3 font-black">Nearest station</th>
                  <th scope="col" className="px-4 py-3 font-black">Worth staying in?</th>
                  <th scope="col" className="px-4 py-3 font-black">Time needed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {NEIGHBOURHOODS.map((n) => (
                  <tr key={n.slug} className="align-top hover:bg-slate-50/70">
                    <th scope="row" className="px-4 py-4 font-black text-gray-950">
                      <Link href={`/blog/${n.slug}`} className="hover:text-blue-700 hover:underline">
                        {n.name}
                      </Link>
                      <span className="mt-0.5 block text-xs font-bold text-gray-500">{n.nameKo}</span>
                    </th>
                    <td className="px-4 py-4 text-gray-700">{n.character}</td>
                    <td className="px-4 py-4 text-gray-700">{n.suits}</td>
                    <td className="px-4 py-4 text-gray-700">{n.station}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block whitespace-nowrap rounded-md px-2 py-1 text-xs font-black ring-1 ${stayClass(n.stay)}`}
                      >
                        {n.stay}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-gray-700">{n.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="pick" className="mt-14">
          <h2 id="pick" className="text-2xl font-black text-gray-950">
            Pick by what you actually want
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {PICKERS.map((p) => (
              <li key={p.want}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="flex items-baseline justify-between gap-4 rounded-lg border border-gray-200 px-4 py-3 transition hover:border-blue-300 hover:bg-blue-50/50"
                >
                  <span className="text-gray-700">&ldquo;{p.want}&rdquo;</span>
                  <span className="whitespace-nowrap font-black text-blue-700">{p.answer} →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="guides" className="mt-14">
          <h2 id="guides" className="text-2xl font-black text-gray-950">
            The guides
          </h2>
          <p className="mt-2 max-w-3xl text-gray-600">
            Each one leads with the thing that made the neighbourhood what it is, because that is
            what you will not get from a list of cafes.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {NEIGHBOURHOODS.map((n) => (
              <article key={n.slug} className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md">
                <Link href={`/blog/${n.slug}`} className="block">
                  {/* Fixed 16:9 across every card so the grid reads as one set. */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={n.image}
                      alt={n.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute bottom-0 left-0 bg-gray-950/85 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white">
                      {n.name} <span className="font-bold text-white/70">{n.nameKo}</span>
                    </span>
                  </div>
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">
                    {n.district}
                  </p>
                  <h3 className="mt-1 text-lg font-black leading-snug text-gray-950">
                    <Link href={`/blog/${n.slug}`} className="hover:text-blue-700">
                      {n.hook}
                    </Link>
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">{n.theAngle}</p>
                  <p className="mt-4 text-xs font-bold text-gray-500">Best time: {n.bestTime}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-lg border border-blue-200 bg-blue-50/60 p-6">
          <h2 className="text-xl font-black text-gray-950">Booking by neighbourhood</h2>
          <p className="mt-3 max-w-3xl leading-7 text-gray-700">
            Seoul&rsquo;s subway makes almost everything reachable, so the neighbourhood you sleep in
            matters less for transport than for what is outside the door at 9pm. If you want an
            evening you can walk into, the three marked <strong>Good base</strong> above are the ones
            to search first. EpicKor may earn a commission from qualifying bookings at no extra cost
            to you.
          </p>
          <a
            href="https://www.agoda.com/city/seoul-kr.html?cid=1968802"
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-gray-950 px-4 py-2.5 text-sm font-black text-white hover:bg-gray-800"
            data-analytics-location="seoul_hub_agoda"
          >
            Compare Seoul stays on Agoda →
          </a>
        </section>

        <p className="mt-12 text-sm text-gray-500">
          More neighbourhoods are being added. Next up: Seochon and Bukchon, which are the
          counterpart to the Ikseon-dong story above.
        </p>
        <HubCrossLinks current="/seoul" />
      </main>
    </div>
  );
}
