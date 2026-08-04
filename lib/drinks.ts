/**
 * Korean drinks section data.
 *
 * Fourth hub, same contract as lib/seoul.ts, lib/convenience-store.ts and
 * lib/ramyun.ts: the page at /drinks/ curates posts that already live at
 * /blog/{slug}. It must not re-explain what those articles say — it compares,
 * prices, and routes.
 *
 * Why this hub exists at all: ten drink articles had accumulated with no shelf
 * to sit on, and they turned out to share a single problem. Korean drink names
 * mislead English speakers in a consistent way — 사이다 is not cider, 야쿠르트
 * is not yoghurt, 박카스 is not an energy drink in the sense the shelf implies.
 * That is a cross-product question, so no individual article can answer it and
 * a hub can.
 *
 * Every price below was verified in one of our own posts and carries the slug
 * it came from. Nothing here is estimated.
 */

export interface DrinkRow {
  name: string;
  nameKo: string;
  maker: string;
  /** What an English speaker assumes from the name or the bottle. */
  assumption: string;
  /** What it actually is. This column is the reason the hub exists. */
  reality: string;
  buyIf: string;
  slug: string;
}

export const DRINKS: DrinkRow[] = [
  {
    name: 'Chilsung Cider',
    nameKo: '칠성사이다',
    maker: 'Lotte Chilsung',
    assumption: 'Alcoholic apple cider',
    reality:
      'Clear lemon-lime soda. No apples, no alcohol, no caffeine. Launched 1950, eleven years before Sprite',
    buyIf: 'You want the drink Korea actually orders at the barbecue table',
    slug: '365',
  },
  {
    name: 'Yakult',
    nameKo: '야쿠르트',
    maker: 'hy',
    assumption: 'Spoonable yoghurt',
    reality:
      'Liquid fermented milk — homogenised after fermentation so it pours. 65 ml, and deliberately so',
    buyIf: 'You want the single most familiar taste in Korean childhood',
    slug: '362',
  },
  {
    name: 'Milkis',
    nameKo: '밀키스',
    maker: 'Lotte Chilsung',
    assumption: 'A Korean original milk soda',
    reality:
      'Milk-and-soda hybrid — but Japan’s Ambasa launched in 1982, seven years earlier',
    buyIf: 'You want something with no clean Western equivalent. Start with the original',
    slug: '360',
  },
  {
    name: 'Bacchus',
    nameKo: '박카스',
    maker: 'Dong-A Pharmaceutical',
    assumption: 'An energy drink',
    reality:
      'A taurine tonic. Above 1,000 mg of taurine it is legally a quasi-drug, which is why D is pharmacy-only and F is not',
    buyIf: 'You are curious about the bottle every Korean adult recognises. Not for caffeine',
    slug: '344',
  },
  {
    name: 'Vita 500',
    nameKo: '비타500',
    maker: 'Kwangdong Pharmaceutical',
    assumption: 'A Bacchus competitor',
    reality:
      'Registered as a drink rather than a quasi-drug, which is exactly how it reached shelves years ahead of Bacchus. Caffeine-free',
    buyIf: 'You want the tonic format without caffeine or the pharmacy counter',
    slug: '347',
  },
  {
    name: 'Pororo drink',
    nameKo: '뽀로로 음료',
    maker: 'Paldo',
    assumption: 'A single children’s juice',
    reality:
      'A range that differs sharply by flavour, including a caffeine-free barley version Korean parents rebuy',
    buyIf: 'You are travelling with a child, or want the character bottle',
    slug: '358',
  },
  {
    name: 'Coffee mix',
    nameKo: '커피믹스',
    maker: 'Dongsuh (Maxim) and others',
    assumption: 'Instant coffee',
    reality:
      'A three-in-one stick with the creamer and sugar already in it. The ratio is the product, not a convenience',
    buyIf: 'You want to understand the default coffee of Korean offices and mountains',
    slug: '278',
  },
  {
    name: 'Hwachae',
    nameKo: '화채',
    maker: 'Homemade',
    assumption: 'A traditional punch',
    reality:
      'Usually built on Chilsung Cider or another clear soda, plus fruit and milk. A summer picnic dish more than a beverage',
    buyIf: 'You are in Korea in summer and want the thing Koreans make rather than buy',
    slug: '254',
  },
];

export interface PriceRow {
  item: string;
  itemKo: string;
  price: string;
  note: string;
  slug: string;
}

export const PRICES: PriceRow[] = [
  {
    item: 'Chilsung Cider, 500 ml',
    itemKo: '칠성사이다',
    price: '₩2,500',
    note: 'Raised from ₩2,300 on 1 August 2026, alongside Pepsi',
    slug: '365',
  },
  {
    item: 'Yakult Light, 65 ml',
    itemKo: '야쿠르트 라이트',
    price: '₩250',
    note: 'Raised from ₩220 on 1 May 2025. The cheapest thing in this table by a distance',
    slug: '362',
  },
  {
    item: 'Milkis, 250 ml can',
    itemKo: '밀키스',
    price: '₩1,500',
    note: 'Listed at GS25, frequently discounted on promotion',
    slug: '360',
  },
  {
    item: 'Pororo drink, 235 ml',
    itemKo: '뽀로로 음료',
    price: '₩1,500',
    note: 'Listed at CU and GS25; about ₩1,000 each on a 2+1',
    slug: '358',
  },
  {
    item: 'Bacchus F',
    itemKo: '박카스 F',
    price: '₩1,000–1,500',
    note: 'Convenience store. Bacchus D is pharmacy-only and priced separately',
    slug: '344',
  },
  {
    item: 'Vita 500',
    itemKo: '비타500',
    price: '₩1,000–1,500',
    note: 'Varies by store and version',
    slug: '347',
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
    heading: 'The ones whose names mislead',
    intro:
      'Three drinks where the English word on the bottle points at the wrong thing. These are the articles to read before you order.',
    guides: [
      {
        slug: '365',
        title: 'Korean cider isn’t cider',
        blurb:
          'No apples, no alcohol, no caffeine — and Chilsung launched in 1950, eleven years before Sprite. The frame every English page uses is backwards.',
        image: '/assets/images/posts/365/chilsung-cider-bottles.jpg',
        imageAlt: 'Green bottles of Chilsung Cider standing in snow.',
      },
      {
        slug: '362',
        title: 'Yakult is not yoghurt',
        blurb:
          'One production step separates them, and it produces a physically different object. Plus the rolling refrigerator that delivers it.',
        image: '/assets/images/posts/362/coco-cart-official.jpg',
        imageAlt: 'The COCO electric refrigerated cart used by Korea’s Fresh Managers.',
      },
      {
        slug: '344',
        title: 'Bacchus D vs F',
        blurb:
          'Taurine above 1,000 mg makes it a quasi-drug, so the stronger bottle is the one you cannot buy in a convenience store.',
        image: '/assets/images/posts/344/bacchus-f-120ml-bottle.jpg',
        imageAlt: 'A bottle of Bacchus F.',
      },
    ],
  },
  {
    heading: 'Which one to pick',
    intro: 'Where the useful question is not what it is, but which version to buy.',
    guides: [
      {
        slug: '360',
        title: 'Milkis flavours',
        blurb:
          'Eleven flavours on one base. Which to start with, how Koreans actually drink it, and the Japanese soda that got there first.',
        image: '/assets/images/posts/360/milkis-bottles.jpg',
        imageAlt: 'Korean bottles of Milkis.',
      },
      {
        slug: '347',
        title: 'Vita 500',
        blurb:
          'Caffeine-free, and registered as a drink rather than a quasi-drug — which is how it beat Bacchus to the shelf.',
        image: '/assets/images/posts/347/vita500-original-bottle.jpg',
        imageAlt: 'A bottle of Vita 500.',
      },
      {
        slug: '358',
        title: 'Pororo drink',
        blurb:
          'Which flavour to pick, what the barley version is for, and the foil seal under the cap that defeats most first-time buyers.',
        image: '/assets/images/posts/358/pororo-drink-lineup-paldo.jpg',
        imageAlt: 'The Pororo drink range from Paldo.',
      },
    ],
  },
  {
    heading: 'What Koreans drink daily',
    intro: 'The formats that are less a product than a habit.',
    guides: [
      {
        slug: '278',
        title: 'Coffee mix',
        blurb:
          'The three-in-one stick that is the default coffee of Korean offices, and why the built-in ratio is the point.',
        image: '/assets/images/posts/278/maxim-coffee-mix-sticks.jpg',
        imageAlt: 'Korean Maxim coffee mix sticks.',
      },
      {
        slug: '027',
        title: 'Iced americano, all year',
        blurb:
          'Why Koreans order it in January, and what 얼죽아 says about the culture around it.',
        image: '/assets/images/posts/027/fa4ffba6-b779-4911-ab69-8179e299eb38.png',
        imageAlt: 'An iced americano, Korea’s default coffee order.',
      },
      {
        slug: '254',
        title: 'Hwachae',
        blurb:
          'The summer fruit punch built on soda, and the picnic culture it belongs to.',
        image: '/assets/images/posts/254/subak-hwachae-kto.jpg',
        imageAlt: 'A bowl of Korean watermelon hwachae.',
      },
    ],
  },
  {
    heading: 'When it is alcohol',
    intro: 'The other half of the drinks aisle, and the one where the vocabulary matters most.',
    guides: [
      {
        slug: '060',
        title: 'Korean drinks beyond soju',
        blurb:
          'Makgeolli, somaek, beer and what to order when you do not want the obvious thing.',
        image: '/assets/images/posts/060/ecf8dfd7-dd2e-47f7-839c-69016976ceec.jpg',
        imageAlt: 'Korean alcoholic drinks on a table.',
      },
    ],
  },
];

export const DRINKS_SLUGS: string[] = GUIDE_GROUPS.flatMap((g) => g.guides.map((x) => x.slug));
