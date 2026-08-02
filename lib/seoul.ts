/**
 * Seoul neighbourhood section data.
 *
 * The hub at /seoul/ curates posts that already live at /blog/{slug}. It is a
 * comparison surface, not a new container — moving these posts to /seoul/{name}
 * was considered and rejected, because URL migration was already disproven for
 * this site and would cost the ranking these posts have started to build.
 *
 * Everything here is written by hand rather than parsed out of frontmatter.
 * The comparison columns are judgements — "who it suits", "worth staying in" —
 * and a parser cannot produce those. Adding a neighbourhood means adding an
 * entry here and nothing else.
 */

export interface Neighbourhood {
  /** Blog slug the entry points at. */
  slug: string;
  /** Roman name as used in the article title. */
  name: string;
  /** Hangul, shown alongside the roman name everywhere. */
  nameKo: string;
  district: string;
  /** One line, in the voice of the article. Not a marketing blurb. */
  hook: string;
  /** Short label for the comparison table's character column. */
  character: string;
  /** Who should go. Written as an answer to "should I bother?". */
  suits: string;
  /** Nearest station, with the lines that serve it. */
  station: string;
  /** Honest answer for the accommodation column. */
  stay: 'Good base' | 'Workable' | 'Visit, don\'t stay';
  /** Realistic time on foot, including sitting down somewhere. */
  time: string;
  /** Best time of day or year to turn up. */
  bestTime: string;
  image: string;
  imageAlt: string;
  /**
   * The mechanism or history the article is actually about. This is the column
   * that separates us from every other Seoul neighbourhood list, so it is
   * required rather than optional.
   */
  theAngle: string;
}

export const NEIGHBOURHOODS: Neighbourhood[] = [
  {
    slug: '355',
    name: 'Ikseon-dong',
    nameKo: '익선동',
    district: 'Jongno-gu',
    hook: 'Seoul’s oldest surviving hanok village, and it was built as a property development.',
    character: 'Hanok alleys, all commercial',
    suits: 'Anyone who wants to sit down inside a 1920s house',
    station: 'Jongno 3-ga (Lines 1, 3, 5)',
    stay: 'Visit, don\'t stay',
    time: '1–2 hours',
    bestTime: 'Weekday morning — the alleys are two metres wide',
    image: '/assets/images/posts/355/ikseon-dong-hanok-alley.jpg',
    imageAlt: 'A narrow alley in Ikseon-dong lined with single-storey hanok.',
    theAngle: 'Mass-produced from the late 1920s by Korea’s first modern developer, and it survived because redevelopment kept failing until 2018.',
  },
  {
    slug: '349',
    name: 'Euljiro',
    nameKo: '을지로',
    district: 'Jung-gu',
    hook: 'Machine shops and print works by day, Seoul’s best drinking alley by night.',
    character: 'Working district, night bars',
    suits: 'Drinkers who want atmosphere over polish',
    station: 'Euljiro 3-ga (Lines 2, 3)',
    stay: 'Workable',
    time: 'An evening',
    bestTime: 'After 7pm, once the workshops shut',
    image: '/assets/images/posts/349/euljiro-nogari-alley-night.jpg',
    imageAlt: 'Nogari Alley in Euljiro at night with plastic tables on the street.',
    theAngle: 'The bars exist because the printers worked night shifts, and Seoul designated the alley Future Heritage in 2015.',
  },
  {
    slug: '351',
    name: 'Yeonnam-dong',
    nameKo: '연남동',
    district: 'Mapo-gu',
    hook: 'The park everyone sits in is a buried railway line.',
    character: 'Linear park, cafes',
    suits: 'Anyone who wants to do nothing outdoors',
    station: 'Hongik University (Lines 2, AREX, Gyeongui–Jungang)',
    stay: 'Good base',
    time: 'Half a day',
    bestTime: 'Spring and autumn afternoons on the grass',
    image: '/assets/images/posts/351/gyeongui-line-forest-park-yeonnam.jpg',
    imageAlt: 'The Gyeongui Line Forest Park running through Yeonnam-dong.',
    theAngle: 'Seoul buried the Yongsan line and turned the surface into a 6km park between 2012 and 2016. The shape gives it away.',
  },
  {
    slug: '354',
    name: 'Mangwon-dong',
    nameKo: '망원동',
    district: 'Mapo-gu',
    hook: 'A grocery market locals actually shop in, ten minutes from the Han River.',
    character: 'Residential, covered market',
    suits: 'Second-trip visitors who have done the landmarks',
    station: 'Mangwon (Line 6)',
    stay: 'Workable',
    time: 'Half a day into the evening',
    bestTime: 'Late afternoon, when the market fills up',
    image: '/assets/images/posts/354/korean-traditional-market-stalls.jpg',
    imageAlt: 'Stalls in a covered Korean neighbourhood market.',
    theAngle: 'Named after a pavilion built in 1424 and renamed in 1484 for its long views. The Mangnidan-gil nickname is borrowed from Itaewon.',
  },
  {
    slug: '353',
    name: 'Haebangchon',
    nameKo: '해방촌',
    district: 'Yongsan-gu',
    hook: 'Liberation Village — built by refugees on the slope of Namsan after 1945.',
    character: 'Steep hillside, mixed',
    suits: 'Walkers who want history under their feet',
    station: 'Noksapyeong (Line 6)',
    stay: 'Workable',
    time: '2–3 hours',
    bestTime: 'Late afternoon, walking downhill',
    image: '/assets/images/posts/353/haebangchon-namsan-hillside.jpg',
    imageAlt: 'The Haebangchon hillside below Namsan.',
    theAngle: 'The famous 108 steps are the surviving approach to a colonial-era Shinto shrine, and Sinheung Market dates from 1953.',
  },
  {
    slug: '352',
    name: 'Mullae',
    nameKo: '문래동',
    district: 'Yeongdeungpo-gu',
    hook: 'A steel district that filled with artists when the orders dried up.',
    character: 'Ironworks and studios',
    suits: 'Anyone bored of neighbourhoods that were designed to be visited',
    station: 'Mullae (Line 2)',
    stay: 'Visit, don\'t stay',
    time: '2–3 hours',
    bestTime: 'Weekday afternoon, while the workshops are open',
    image: '/assets/images/posts/352/mullae-steelworks-shutter-murals.jpg',
    imageAlt: 'Steelwork shutters in Mullae painted with murals.',
    theAngle: 'Named after a spinning wheel, steel from the late 1960s, artists from the 2000s when cheap Chinese imports emptied the workshops.',
  },
  {
    slug: '163',
    name: 'Seongsu & Hannam',
    nameKo: '성수동 · 한남동',
    district: 'Seongdong-gu / Yongsan-gu',
    hook: 'The two neighbourhoods people mean by "Seoul is trendy now" — compared directly.',
    character: 'Pop-ups vs quiet flagships',
    suits: 'Shoppers deciding which one is worth the afternoon',
    station: 'Seongsu (Line 2) / Hangangjin (Line 6)',
    stay: 'Good base',
    time: 'An afternoon each',
    bestTime: 'Seongsu late morning, Hannam after lunch',
    // The article's own ogImage is a Seongsu storefront, which is dark and
    // reads poorly at card size next to six brighter neighbourhoods. The hub
    // uses the Leeum approach in Hannam instead — recognisable, and it carries
    // the "quiet flagship" half of the comparison that the storefront does not.
    image: '/assets/images/posts/163/hannam-art-culture-street.jpg',
    imageAlt: 'The glass-and-steel approach to the Leeum museum in Hannam-dong, Seoul.',
    theAngle: 'One is a former factory district that kept its warehouses; the other never had industry to convert. That is why they feel different.',
  },
];

/**
 * Sibling links for the in-article divider.
 *
 * Two per post, chosen to give a reader a reason to click rather than to fill
 * a slot: the most *different* neighbourhood, and the nearest one. A list of
 * "related posts" sorted by tag overlap would surface near-identical places,
 * which is the opposite of useful on a comparison-driven section.
 */
export const SIBLINGS: Record<string, [string, string]> = {
  '355': ['352', '349'],
  '349': ['351', '355'],
  '351': ['352', '354'],
  '354': ['355', '351'],
  '353': ['352', '163'],
  '352': ['163', '351'],
  '163': ['352', '353'],
};

export function getNeighbourhood(slug: string): Neighbourhood | undefined {
  return NEIGHBOURHOODS.find((n) => n.slug === slug);
}
