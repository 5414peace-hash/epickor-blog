import Image from 'next/image';
import Link from 'next/link';

/**
 * Seoul neighbourhood map.
 *
 * Replaces a hand-drawn schematic that was not good enough — an abstract
 * diagram of a real city reads as a wireframe, not a map. This uses the actual
 * district outline of Seoul with the Han River in it, and groups the
 * neighbourhoods by the gu they sit in, which is also how Korean addresses and
 * subway signage group them.
 *
 * Base map: Wikimedia Commons, "Seoul districts.svg" by Kurykh, CC BY-SA 3.0,
 * rendered to PNG and recompressed. Attribution is in the caption, which the
 * licence requires.
 *
 * Layout is dot-and-callout rather than labels-on-districts. A first attempt
 * put the boxes directly on the districts, which pushed Mapo and Yeongdeungpo
 * off the city outline entirely to avoid collisions — the labels were readable
 * and in the wrong place, which is worse than no map. Now the dot marks the
 * real district position and the box sits in the margin, joined by a leader
 * line, so accuracy and legibility stop competing.
 *
 * Coordinates are percentages of the square map box, read off the district
 * outlines in the base image. Boxes down each margin are ordered to match the
 * vertical order of their dots — otherwise the leader lines cross, which reads
 * as an error even when every label is correct.
 */

interface Cluster {
  gu: string;
  /** True position of the district on the map. */
  dot: { x: number; y: number };
  /** Where the label sits, out in the margin. */
  box: { x: number; y: number };
  /** Which way the box is anchored, so edge boxes do not overflow. */
  side: 'left' | 'right';
  places: { slug: string; label: string }[];
}

const CLUSTERS: Cluster[] = [
  {
    gu: 'Mapo-gu',
    dot: { x: 39, y: 51 },
    box: { x: 4, y: 34 },
    side: 'left',
    places: [
      { slug: '351', label: 'Yeonnam-dong' },
      { slug: '354', label: 'Mangwon-dong' },
    ],
  },
  {
    gu: 'Jongno-gu',
    dot: { x: 52, y: 42 },
    box: { x: 36, y: 8 },
    side: 'left',
    places: [
      { slug: '357', label: 'Bukchon' },
      { slug: '356', label: 'Seochon' },
      { slug: '355', label: 'Ikseon-dong' },
    ],
  },
  {
    gu: 'Jung-gu',
    dot: { x: 53, y: 50 },
    box: { x: 96, y: 20 },
    side: 'right',
    places: [
      { slug: '349', label: 'Euljiro' },
      { slug: '315', label: 'Myeongdong' },
    ],
  },
  {
    gu: 'Seongdong & Gangnam',
    dot: { x: 64, y: 62 },
    box: { x: 96, y: 74 },
    side: 'right',
    places: [
      { slug: '163', label: 'Seongsu & Hannam' },
      { slug: '169', label: 'Gangnam nightlife' },
    ],
  },
  {
    gu: 'Yongsan-gu',
    dot: { x: 51, y: 57 },
    box: { x: 96, y: 48 },
    side: 'right',
    places: [
      { slug: '353', label: 'Haebangchon' },
      { slug: '047', label: 'Yongsan' },
    ],
  },
  {
    gu: 'Yeongdeungpo-gu',
    dot: { x: 39, y: 67 },
    box: { x: 4, y: 78 },
    side: 'left',
    places: [{ slug: '352', label: 'Mullae' }],
  },
];

export default function SeoulMap() {
  return (
    <figure className="mt-6">
      <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="relative aspect-square w-full">
          <Image
            src="/assets/images/site/seoul-districts-base.png"
            alt="Outline map of Seoul's 25 districts with the Han River running through the middle."
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-contain"
            priority={false}
          />

          {/* Leader lines, drawn under the boxes. */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            {CLUSTERS.map((c) => (
              <line
                key={c.gu}
                x1={c.dot.x}
                y1={c.dot.y}
                x2={c.side === 'left' ? c.box.x + 1 : c.box.x - 1}
                y2={c.box.y + 4}
                stroke="#1d4ed8"
                strokeWidth="0.25"
                strokeDasharray="1.2 1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          {CLUSTERS.map((c) => (
            <div key={c.gu}>
              <span
                className="absolute block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-blue-700 shadow"
                style={{ left: `${c.dot.x}%`, top: `${c.dot.y}%` }}
                aria-hidden
              />
              <div
                className="absolute"
                style={{
                  left: `${c.box.x}%`,
                  top: `${c.box.y}%`,
                  transform: c.side === 'right' ? 'translateX(-100%)' : undefined,
                }}
              >
                <div className="rounded-md border border-blue-300 bg-white/95 px-2 py-1.5 shadow-sm">
                  <p className="whitespace-nowrap text-[9px] font-black uppercase leading-none tracking-wide text-blue-700 sm:text-[10px]">
                    {c.gu}
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {c.places.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/blog/${p.slug}`}
                          className="whitespace-nowrap text-[10px] font-bold leading-tight text-gray-950 hover:text-blue-700 hover:underline sm:text-xs"
                        >
                          {p.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <figcaption className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-gray-500">
        Dots mark the district; labels sit in the margin so they stay readable. Neighbourhoods are
        grouped by the gu they belong to — the same grouping Korean addresses and subway signage
        use. Seoul&rsquo;s subway connects almost all of these to each other in under 40 minutes.
        Base map by{' '}
        <a
          href="https://commons.wikimedia.org/wiki/File:Seoul_districts.svg"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Kurykh
        </a>
        , CC BY-SA 3.0.
      </figcaption>
    </figure>
  );
}
