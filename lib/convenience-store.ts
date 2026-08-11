/**
 * Korean convenience store section data.
 *
 * Same shape as lib/seoul.ts and for the same reason: the hub at
 * /convenience-store/ curates posts that already live at /blog/{slug} rather
 * than becoming a new article. That matters more here than it did for Seoul,
 * because 059 is already a full convenience-store food guide — a hub that
 * explained the same things would be a near-duplicate of a page that already
 * ranks. The hub's job is to route, compare and price, then hand off.
 *
 * Every price carries the post it was verified in, and the month it was
 * checked. A price with no source and no date is a rumour.
 */

export interface Chain {
  name: string;
  nameKo: string;
  /** What it actually leads on, not marketing copy. */
  knownFor: string;
  /** Something only this chain has, where we have a post proving it. */
  exclusive: string;
  exclusiveSlug?: string;
  /** Where the business actually stands, from Korean reporting. */
  standing: string;
}

/**
 * 2024 full-year figures from Korean business press. GS25 leads on revenue and
 * CU on store count — both are true, which is why every Korean article about
 * "the number one convenience store" has to specify which measure it means.
 */
export const CHAINS: Chain[] = [
  {
    name: 'GS25',
    nameKo: '지에스25',
    knownFor: 'Widest coverage outside big cities; strong own-brand drinks',
    exclusive: 'Yellow-cheese snack line, including the Haitai crisp',
    exclusiveSlug: '343',
    standing: 'Revenue leader — about ₩8.67 trillion in 2024',
  },
  {
    name: 'CU',
    nameKo: '씨유',
    knownFor: 'Collaboration products and desserts',
    exclusive: 'Yonsei Cream Bread — over 100 million units',
    exclusiveSlug: '345',
    standing: 'Store-count leader; revenue about ₩8.52 trillion in 2024',
  },
  {
    name: '7-Eleven',
    nameKo: '세븐일레븐',
    knownFor: 'The familiar name for visitors; merged with Ministop',
    exclusive: '—',
    standing: 'Loss-making since 2021, store count falling',
  },
  {
    name: 'Emart24',
    nameKo: '이마트24',
    knownFor: 'Grocery crossover, larger stores, seating more often',
    exclusive: '—',
    standing: 'Loss-making, store count falling',
  },
];

export interface PriceRow {
  item: string;
  itemKo: string;
  price: string;
  note: string;
  /** Post the figure was verified in. */
  slug: string;
  /** Month it was checked, so staleness is visible rather than hidden. */
  asOf: string;
}

/**
 * Prices carried over from posts that verified them. This is the seed of the
 * separate /prices/ section — the same discipline, on a smaller set, so the
 * monthly review ritual gets rehearsed on something forgiving first.
 */
export const PRICES: PriceRow[] = [
  { item: 'Triangle gimbap', itemKo: '삼각김밥', price: '₩1,200–1,900', note: 'The 2XL sizes sit at the top of that range', slug: '336', asOf: '2026-07' },
  { item: 'Yonsei Cream Bread', itemKo: '연세우유 크림빵', price: '₩2,600–3,000', note: 'CU only. Varies by flavour', slug: '345', asOf: '2026-07' },
  { item: 'Banana milk, 240ml', itemKo: '바나나맛우유', price: '₩1,800', note: 'Often ₩1,200 on promotion', slug: '171', asOf: '2026-07' },
  { item: 'Vita 500', itemKo: '비타500', price: '₩1,000–1,500', note: 'Cheaper by the ten-bottle box at a mart', slug: '347', asOf: '2026-08' },
  { item: 'Bacchus F', itemKo: '박카스 F', price: '₩1,000–1,500', note: 'The D version is pharmacy-only', slug: '344', asOf: '2026-08' },
  { item: 'Bagged ramyun, single', itemKo: '라면 봉지', price: 'about ₩1,000', note: 'Five-packs at a mart cost markedly less', slug: '346', asOf: '2026-08' },
  { item: 'Store-brand coffee', itemKo: '원두커피', price: 'from about ₩1,000', note: 'Brewed at the counter machine', slug: '171', asOf: '2026-07' },
  { item: 'Sandwich', itemKo: '샌드위치', price: '₩2,500–4,500', note: 'Discounted near the expiry cut-off', slug: '171', asOf: '2026-07' },
];

export interface HowToRow {
  thing: string;
  answer: string;
  detail: string;
  /** Post that covers it properly, where one exists. */
  slug?: string;
}

/**
 * The "how do I use one" half, which the hub was missing entirely at launch.
 * Every row here is something a visitor gets wrong or hesitates over at the
 * counter, and each answer comes from a post we have already verified rather
 * than from general knowledge.
 */
export const HOW_TO: HowToRow[] = [
  {
    thing: 'Opening hours',
    answer: 'Usually 24 hours',
    detail: 'Not guaranteed — smaller franchise stores in residential areas do close overnight. The sign on the door is the authority.',
  },
  {
    thing: 'Foreign cards',
    answer: 'Widely accepted',
    detail: 'Visa and Mastercard work at convenience stores. Some machines still reject foreign cards, so carry a little cash as a fallback.',
    slug: '201',
  },
  {
    thing: 'Transport cards',
    answer: 'Buy and top up here',
    detail: 'Convenience stores sell and recharge T-money. Availability and card designs vary by location.',
    slug: '201',
  },
  {
    thing: '1+1 and 2+1',
    answer: 'Take the free one yourself',
    detail: 'The shelf tag means buy one get one, or buy two get one. Nobody hands it to you — you pick the extra up and bring it to the till. The chains also let you bank the free item in their app and collect it later, which almost no short-term visitor can actually do.',
    slug: '376',
  },
  {
    thing: 'End-of-day markdown',
    answer: '마감 할인, usually evening',
    detail: 'Gimbap, sandwiches and lunchboxes are discounted as their sell-by time approaches. Locals use this constantly.',
    slug: '171',
  },
  {
    thing: 'Microwave and hot water',
    answer: 'Self-service, free',
    detail: 'Heat your own food. Hot water dispensers are for cup noodles. Some stores have a machine that cooks bagged ramyun for you.',
    slug: '054',
  },
  {
    thing: 'Seating',
    answer: 'Eat there, briefly',
    detail: 'The counter or table is for quick use, not for spreading out luggage or working. It is normal to eat a meal there alone.',
    slug: '186',
  },
  {
    thing: 'Bin and packaging',
    answer: 'Separate it, in-store',
    detail: 'Korea has few street bins and strict sorting. Leave packaging in the store bins rather than carrying it out to look for one.',
    slug: '213',
  },
  {
    thing: 'Parcels and ATMs',
    answer: 'Both, at most branches',
    detail: 'Convenience stores run parcel drop-off and pickup and carry ATMs, which is a large part of why they are on every corner.',
  },
];

export interface Guide {
  slug: string;
  title: string;
  blurb: string;
  image: string;
  imageAlt: string;
}

export interface GuideGroup {
  heading: string;
  intro: string;
  guides: Guide[];
}

export const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'Start here',
    intro: 'If you are standing in one right now and do not know what to pick up.',
    guides: [
      {
        slug: '059',
        title: 'What to eat in a Korean convenience store',
        blurb: 'The full food guide — dosirak, snacks, and how the shelves are organised.',
        image: '/assets/images/posts/059/convenience-store-lunchbox-01.jpg',
        imageAlt: 'A Korean convenience store lunch box with rice and side compartments.',
      },
      {
        slug: '171',
        title: 'What locals actually buy for breakfast',
        blurb: 'The morning basket, with this year’s prices and the ₩1,000 gimbap that disappeared.',
        image: '/assets/images/posts/171/korean-convenience-store-breakfast.jpg',
        imageAlt: 'A Seoul convenience store fridge of Korean drinks, with ₩1,800 shelf tags.',
      },
      {
        slug: '281',
        title: 'The dosirak lunchbox, decoded',
        blurb: 'What is in the compartments, and how to tell a good box from a filler one.',
        image: '/assets/images/posts/281/homemade-dosirak-gangneung.jpg',
        imageAlt: 'Home-packed dosirak boxes shared on a table in Gangneung.',
      },
    ],
  },
  {
    heading: 'The products worth knowing',
    intro: 'Each of these is a specific thing on a specific shelf, with the story behind it.',
    guides: [
      {
        slug: '336',
        title: 'Samgak kimbap',
        blurb: 'The wrapper is an engineering solution. Open it in the wrong order and it falls apart.',
        image: '/assets/images/posts/336/samgak-kimbap-1.jpg',
        imageAlt: 'A Korean triangle gimbap in its wrapper.',
      },
      {
        slug: '345',
        title: 'Yonsei Cream Bread',
        blurb: 'Roughly 80% cream by weight, CU-exclusive, and Koreans eat it frozen.',
        image: '/assets/images/posts/345/yonsei-milk-cream-bread-cross-section.jpg',
        imageAlt: 'A cross-section of Yonsei cream bread showing the cream layer.',
      },
      {
        slug: '335',
        title: 'Convenience store ice cream, ranked',
        blurb: 'What is actually in the freezer cabinet and which bars are worth the space.',
        image: '/assets/images/posts/335/melona-original.jpg',
        imageAlt: 'A Melona ice bar, a Korean convenience store staple.',
      },
      {
        slug: '032',
        title: 'Viyott',
        blurb: 'The yoghurt with a topping lid, and why the mixing ritual is the product.',
        image: '/assets/images/posts/032/1eb77d14-d926-4fce-b7ed-c3b14f60484d.png',
        imageAlt: 'Viyott, a Korean convenience store yoghurt snack.',
      },
      {
        slug: '048',
        title: 'Carbo Buldak',
        blurb: 'How a creamy version of a fire-noodle became the export that carried the brand.',
        image: '/assets/images/posts/048/efd079cc-5d55-40e8-921b-2785c9caab20.png',
        imageAlt: 'Carbo Buldak, the creamy spicy Korean instant noodle.',
      },
      {
        slug: '343',
        title: 'Orion moist yellow cheese chip',
        blurb: 'Sold out for most of 2026, and Orion has explained why it can never be permanent.',
        image: '/assets/images/posts/343/korean-convenience-store-ramyeon-wall-hongdae.jpg',
        imageAlt: 'A wall of Korean instant noodles on convenience store shelves.',
      },
      {
        slug: '366',
        title: 'Pocachip',
        blurb: 'Korea’s No.1 potato chip. Onion launched in 1988 and Original only in 1992, so the blue bag is the later one.',
        image: '/assets/images/posts/366/pocachip-original-onion-bags.jpg',
        imageAlt: 'Bags of Pocachip Original and Onion side by side.',
      },
      {
        slug: '364',
        title: 'Matdongsan',
        blurb: 'Looks like traditional Korean confection, descends from Japanese karinto. Withdrawn in 1974 for selling too well.',
        image: '/assets/images/posts/364/matdongsan-in-bag.jpg',
        imageAlt: 'An open bag of Matdongsan peanut-coated fried sticks.',
      },
      {
        slug: '365',
        title: 'Chilsung Cider',
        blurb: 'The default fridge drink. No apples, no alcohol, and eleven years older than Sprite.',
        image: '/assets/images/posts/365/chilsung-cider-bottles.jpg',
        imageAlt: 'Green bottles of Chilsung Cider.',
      },
    ],
  },
  {
    heading: 'The small bottles',
    intro: 'The two brown bottles beside the till, and why one of them is legally a drug.',
    guides: [
      {
        slug: '344',
        title: 'Bacchus D vs F',
        blurb: 'Taurine above 1,000mg makes it a pharmacy-only quasi-drug. The smaller bottle is the stronger one.',
        image: '/assets/images/posts/344/bacchus-f-120ml-bottle.jpg',
        imageAlt: 'A bottle of Bacchus F, the convenience store version.',
      },
      {
        slug: '347',
        title: 'Vita 500',
        blurb: 'Registered as a drink rather than a quasi-drug, which put it on shelves ten years before Bacchus.',
        image: '/assets/images/posts/347/vita500-original-bottle.jpg',
        imageAlt: 'A bottle of Vita 500, the Korean vitamin drink.',
      },
    ],
  },
  {
    heading: 'How the shop itself works',
    intro: 'The machines, the discount clock, and the parts of the format that are not about food.',
    guides: [
      {
        slug: '376',
        title: '1+1 and 2+1, and who can bank the free one',
        blurb: 'The deals need no app and work for everyone. The trick every guide recommends — saving the free item for later — needs Korean ID verification.',
        image: '/assets/images/posts/376/cu-store-interior-2plus1-freezer.jpg',
        imageAlt: 'A 2+1 promotion strip on the ice-cream chest of a Korean convenience store.',
      },
      {
        slug: '054',
        title: 'The automated store',
        blurb: 'Ramen machines, self-checkout and robots — what you are expected to operate yourself.',
        image: '/assets/images/posts/054/13031ce3-164e-4758-8082-f1e023470333.png',
        imageAlt: 'A ramen cooking machine in a Korean convenience store.',
      },
      {
        slug: '093',
        title: 'Bagged versus cup noodles',
        blurb: 'Which one the in-store machine is for, and when the bag is the wrong choice.',
        image: '/assets/images/posts/093/0eee505d-81b1-4281-aa69-e4ba3b32fc50.png',
        imageAlt: 'Korean instant noodles in bag and cup formats.',
      },
      {
        slug: '029',
        title: 'Korean snacks worth packing',
        blurb: 'What survives a suitcase, and what to buy at a mart instead of a convenience store.',
        image: '/assets/images/posts/029/fdd29860-8135-412c-a2b4-8551e90675d0.jpg',
        imageAlt: 'An assortment of Korean packaged snacks.',
      },
    ],
  },
];

/** Every slug the hub links to, for the section-belt wiring. */
export const CVS_SLUGS: string[] = GUIDE_GROUPS.flatMap((g) => g.guides.map((x) => x.slug));
