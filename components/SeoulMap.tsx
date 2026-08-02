import Link from 'next/link';

/**
 * Schematic map of the neighbourhoods in the Seoul hub.
 *
 * Hand-authored SVG rather than a tile map on purpose. Tiles mean an external
 * host, which the site's CSP would have to allow and whose licence terms would
 * have to be tracked; an interactive map library means shipping JavaScript for
 * something that is read once. This is a diagram, not a navigation tool — the
 * job is to answer "which of these are near each other", which the comparison
 * table cannot do.
 *
 * Positions are schematic, not surveyed. They preserve the relationships that
 * matter for planning a day — the river runs between the north and the south,
 * Mapo sits west, Jongno clusters in the centre-north, Yongsan sits between the
 * centre and the river — and the caption says so rather than implying accuracy
 * the drawing does not have.
 */

interface Pin {
  slug: string;
  label: string;
  x: number;
  y: number;
  /** Anchor the text so labels near the edges do not overflow the viewBox. */
  anchor?: 'start' | 'middle' | 'end';
}

const PINS: Pin[] = [
  { slug: '356', label: 'Seochon', x: 330, y: 108, anchor: 'end' },
  { slug: '357', label: 'Bukchon', x: 405, y: 92 },
  { slug: '355', label: 'Ikseon-dong', x: 452, y: 128 },
  { slug: '349', label: 'Euljiro', x: 448, y: 176 },
  { slug: '315', label: 'Myeongdong', x: 470, y: 214, anchor: 'start' },
  { slug: '351', label: 'Yeonnam-dong', x: 196, y: 150, anchor: 'end' },
  { slug: '354', label: 'Mangwon-dong', x: 140, y: 196, anchor: 'end' },
  { slug: '352', label: 'Mullae', x: 168, y: 300, anchor: 'end' },
  { slug: '353', label: 'Haebangchon', x: 372, y: 250, anchor: 'end' },
  { slug: '047', label: 'Yongsan', x: 400, y: 288, anchor: 'start' },
  { slug: '163', label: 'Seongsu & Hannam', x: 604, y: 232, anchor: 'start' },
  { slug: '169', label: 'Gangnam', x: 596, y: 330, anchor: 'start' },
];

export default function SeoulMap() {
  return (
    <figure className="mt-6">
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-slate-50">
        <svg
          viewBox="0 0 760 400"
          role="img"
          aria-label="Schematic map showing the relative positions of the Seoul neighbourhoods in this guide, with the Han River running east to west."
          className="h-auto w-full min-w-[640px]"
        >
          <title>Where these Seoul neighbourhoods sit relative to each other</title>

          {/* Han River — the one line that orients everything else */}
          <path
            d="M0 268 C 110 250, 190 276, 300 288 S 520 300, 760 262"
            fill="none"
            stroke="#bfdbfe"
            strokeWidth="34"
            strokeLinecap="round"
          />
          <text x="52" y="274" className="fill-blue-700" fontSize="13" fontWeight="800">
            Han River
          </text>

          {/* District labels, set well behind the pins */}
          <text x="120" y="120" fill="#cbd5e1" fontSize="15" fontWeight="900">MAPO</text>
          <text x="400" y="60" fill="#cbd5e1" fontSize="15" fontWeight="900">JONGNO</text>
          <text x="470" y="330" fill="#cbd5e1" fontSize="15" fontWeight="900">YONGSAN</text>
          <text x="640" y="380" fill="#cbd5e1" fontSize="15" fontWeight="900">GANGNAM</text>

          {PINS.map((pin) => {
            const anchor = pin.anchor ?? 'middle';
            const dx = anchor === 'start' ? 12 : anchor === 'end' ? -12 : 0;
            const dy = anchor === 'middle' ? -14 : 4;
            return (
              <Link key={pin.slug} href={`/blog/${pin.slug}`}>
                <g className="cursor-pointer">
                  <circle cx={pin.x} cy={pin.y} r="7" fill="#1d4ed8" />
                  <circle cx={pin.x} cy={pin.y} r="12" fill="#1d4ed8" fillOpacity="0.16" />
                  <text
                    x={pin.x + dx}
                    y={pin.y + dy}
                    textAnchor={anchor}
                    fontSize="14"
                    fontWeight="800"
                    fill="#0f172a"
                  >
                    {pin.label}
                  </text>
                </g>
              </Link>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-3 text-sm leading-6 text-gray-500">
        Schematic, not to scale. It shows which neighbourhoods are near each other and which side of
        the river they sit on — the two things the comparison table above cannot tell you. Seoul&rsquo;s
        subway makes almost all of these reachable from each other in under 40 minutes.
      </figcaption>
    </figure>
  );
}
