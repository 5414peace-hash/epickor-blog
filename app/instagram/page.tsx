import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'EpicKor Instagram Guide Hub',
  description:
    'Start here from EpicKor Reels: Korea travel setup, festival packing, K-beauty, Korean food, and culture guides.',
  alternates: {
    canonical: '/instagram',
  },
  openGraph: {
    title: 'EpicKor Instagram Guide Hub',
    description:
      'Start here from EpicKor Reels: Korea travel setup, festival packing, K-beauty, Korean food, and culture guides.',
    url: 'https://www.epickor.com/instagram',
    images: ['/assets/images/posts/197/boryeong-mud-festival-crowd.jpg'],
  },
};

const campaign = 'utm_source=instagram&utm_medium=littly&utm_campaign=profile_hub';

function tracked(path: string, content: string) {
  const joiner = path.includes('?') ? '&' : '?';
  return `${path}${joiner}${campaign}&utm_content=${content}`;
}

const latestGuides = [
  {
    label: 'Current Reel',
    title: 'Boryeong Mud Festival packing checklist',
    body: 'What to wear, what to bring, and how to avoid a messy return trip from Seoul.',
    href: tracked('/blog/197', 'latest_boryeong_mud_festival'),
    image: '/assets/images/posts/197/boryeong-mud-festival-crowd.jpg',
  },
  {
    label: 'Festival Prep',
    title: 'Waterbomb Seoul survival guide',
    body: 'Quick-dry outfits, phone protection, sun care, and exit strategy before the splash starts.',
    href: tracked('/blog/198', 'latest_waterbomb_seoul'),
    image: '/assets/images/posts/198/water-festival-crowd-generated.jpg',
  },
];

const sections = [
  {
    eyebrow: 'Korea Trip Starter Kit',
    title: 'Set up the boring stuff before it becomes stressful',
    image: '/assets/images/posts/197/boryeong-mud-on-the-beach.jpg',
    links: [
      ['T-money, WOWPASS, cards, and cash', '/blog/201', 'trip_payment_setup'],
      ['Incheon Airport to Seoul', '/blog/202', 'airport_to_seoul'],
      ['Rainy season packing for Korea', '/blog/199', 'rainy_season_packing'],
      ['Korea mosquito season guide', '/blog/203', 'mosquito_season'],
    ],
  },
  {
    eyebrow: 'K-Beauty And Olive Young',
    title: 'Know what is worth buying before your cart gets crowded',
    image: '/assets/images/posts/192/cosmetics-shelf-browsing.jpg',
    links: [
      ['Olive Young Korea: buy, skip, and compare', '/blog/192', 'olive_young_guide'],
      ['Best Korean sunscreens for 2026', '/blog/160', 'korean_sunscreens'],
      ['Why Korean skincare feels different', '/blog/163', 'korean_skincare'],
    ],
  },
  {
    eyebrow: 'Korean Food At Home',
    title: 'Turn the food curiosity into a simple pantry plan',
    image: '/assets/images/posts/071/071_frame_1.jpg',
    links: [
      ['Korean convenience store breakfast', '/blog/171', 'convenience_breakfast'],
      ['What is Deli Manjoo?', '/blog/071', 'deli_manjoo'],
      ['Isaac Toast sauce explained', '/blog/153', 'isaac_toast_sauce'],
    ],
  },
  {
    eyebrow: 'Popular Culture Explainers',
    title: 'The terms and status signals behind the Reels',
    image: '/assets/images/posts/090/090_frame_1.jpg',
    links: [
      ['Ahjussi meaning in Korean', '/blog/090', 'ahjussi_meaning'],
      ['SKY universities in Korea', '/blog/082', 'sky_universities'],
      ['Seoul subway etiquette', '/blog/174', 'subway_etiquette'],
    ],
  },
];

export default function InstagramHubPage() {
  return (
    <main className="bg-stone-50 text-stone-950">
      <section className="relative min-h-[620px] overflow-hidden bg-black text-white">
        <Image
          src="/assets/images/posts/197/boryeong-mud-festival-group.jpg"
          alt="Boryeong Mud Festival crowd covered in mud during a Korean summer event"
          fill
          priority
          className="object-cover opacity-70"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto flex min-h-[620px] max-w-5xl flex-col justify-end px-5 pb-12 pt-20 sm:px-8 lg:px-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-lime-300">
            Start here from EpicKor Reels
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Korea travel, food, beauty, and culture guides worth opening after the Reel.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-100 sm:text-lg">
            Pick the guide that matches what you just watched. The best starting points are trip setup, festival packing,
            K-beauty, Korean food, and the social words that make Korea confusing in a good way.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={tracked('/blog/197', 'hero_latest_reel')}
              className="inline-flex items-center justify-center rounded-md bg-lime-300 px-5 py-3 text-sm font-black text-black transition hover:bg-lime-200"
            >
              Latest Reel Guide
            </Link>
            <Link
              href={tracked('/blog/201', 'hero_trip_setup')}
              className="inline-flex items-center justify-center rounded-md border border-white/70 px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-black"
            >
              Korea Trip Setup
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-2">
          {latestGuides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="group grid overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:grid-cols-[150px_1fr]"
            >
              <div className="relative min-h-[170px] bg-stone-200 sm:min-h-full">
                <Image
                  src={guide.image}
                  alt={guide.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(min-width: 768px) 150px, 100vw"
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-black uppercase tracking-normal text-amber-700">{guide.label}</p>
                <h2 className="mt-2 text-xl font-black leading-snug text-stone-950">{guide.title}</h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">{guide.body}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white py-10">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-5 md:grid-cols-2">
            {sections.map((section) => (
              <article key={section.eyebrow} className="overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
                <div className="relative h-44 bg-stone-200">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-normal text-teal-700">{section.eyebrow}</p>
                  <h2 className="mt-2 text-2xl font-black leading-snug text-stone-950">{section.title}</h2>
                  <div className="mt-5 grid gap-2">
                    {section.links.map(([label, href, content]) => (
                      <Link
                        key={href}
                        href={tracked(href, content)}
                        className="rounded-md border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-stone-900 transition hover:border-lime-400 hover:bg-lime-50"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-4 rounded-lg border border-stone-200 bg-stone-950 p-6 text-white md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-lime-300">Support the guide loop</p>
            <h2 className="mt-2 text-2xl font-black">Useful Korea guides first, shopping links only when they help.</h2>
            <p className="mt-3 text-sm leading-6 text-stone-200">
              EpicKor may earn from qualifying purchases when a guide links to Amazon. The goal is to compare smarter
              before a trip, not to buy things you do not need.
            </p>
          </div>
          <Link
            href={tracked('/blog/160', 'support_sunscreen_money_page')}
            className="inline-flex items-center justify-center rounded-md bg-lime-300 px-5 py-3 text-sm font-black text-black transition hover:bg-lime-200"
          >
            Start With SPF
          </Link>
        </div>
      </section>
    </main>
  );
}
