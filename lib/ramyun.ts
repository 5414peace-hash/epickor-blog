/**
 * Korean ramyun section data.
 *
 * Third hub, same contract as lib/seoul.ts and lib/convenience-store.ts: the
 * page at /ramyun/ curates posts that already live at /blog/{slug}. 038 is
 * already the ramyun guide, so the hub must not re-explain — it compares,
 * prices, and routes.
 *
 * Every heat and price figure below was verified in one of our own posts and
 * carries the slug it came from. Nothing here is estimated.
 *
 * Shin Ramyun's number was left blank at launch because published figures
 * disagreed. They disagree for a reason worth knowing: the 1,320 and 2,700
 * figures circulating online were published by Paldo, a competitor, in 2012 and
 * 2014 while marketing against it. Nongshim's own account is 2,900 SHU from
 * 1986 to 2016 and a single rise to 3,400 in 2017. Resolved rather than guessed.
 */

export interface RamyunRow {
  name: string;
  nameKo: string;
  maker: string;
  /** Soup, stir-fried, or cold — the thing English coverage flattens. */
  format: string;
  /** What the flavour is actually built on. */
  base: string;
  /** Verified Scoville, or an honest note where no reliable figure exists. */
  heat: string;
  /** True when we have a published number rather than a description. */
  heatVerified: boolean;
  buyIf: string;
  slug: string;
}

export const RAMYUN: RamyunRow[] = [
  {
    name: 'Shin Ramyun',
    nameKo: '신라면',
    maker: 'Nongshim',
    format: 'Soup',
    base: 'Chili',
    heat: '3,400 SHU (2,900 before 2017)',
    heatVerified: true,
    buyIf: 'You want the famous one, and the reference everything is measured against',
    slug: '346',
  },
  {
    name: 'Ansungtangmyun',
    nameKo: '안성탕면',
    maker: 'Nongshim',
    format: 'Soup',
    base: 'Soybean paste (된장)',
    heat: '~570 SHU',
    heatVerified: true,
    buyIf: 'You want to taste Korean seasoning rather than Korean heat',
    slug: '346',
  },
  {
    name: 'Buldak, original',
    nameKo: '불닭볶음면',
    maker: 'Samyang',
    format: 'Stir-fried',
    base: 'Chili sauce, no broth',
    heat: '~4,404 SHU',
    heatVerified: true,
    buyIf: 'You have had a jalapeño and were fine — this is about the same',
    slug: '038',
  },
  {
    name: 'Buldak 2x Spicy',
    nameKo: '핵불닭볶음면 2x',
    maker: 'Samyang',
    format: 'Stir-fried',
    base: 'Chili sauce, no broth',
    heat: '~10,000 SHU',
    heatVerified: true,
    buyIf: 'You actively enjoy being uncomfortable',
    slug: '326',
  },
  {
    name: 'Buldak 3x Haek',
    nameKo: '핵불닭볶음면 3x',
    maker: 'Samyang',
    format: 'Stir-fried',
    base: 'Chili sauce, no broth',
    heat: '~13,200 SHU',
    heatVerified: true,
    buyIf: 'Almost nobody. This is the hottest official version',
    slug: '326',
  },
  {
    name: 'Carbo Buldak',
    nameKo: '까르보불닭볶음면',
    maker: 'Samyang',
    format: 'Stir-fried',
    base: 'Chili sauce plus cream',
    heat: 'Below original — the dairy blunts it',
    heatVerified: false,
    buyIf: 'You want the viral one without the dare',
    slug: '048',
  },
  {
    name: 'Chapaghetti',
    nameKo: '짜파게티',
    maker: 'Nongshim',
    format: 'Stir-fried',
    base: 'Black bean (춘장)',
    heat: 'Not spicy',
    heatVerified: false,
    buyIf: 'You want savoury and sweet rather than hot',
    slug: '038',
  },
  {
    name: 'Jin Ramen, mild',
    nameKo: '진라면 순한맛',
    maker: 'Ottogi',
    format: 'Soup',
    base: 'Beef-savoury, lightly sweet',
    heat: 'Effectively not a spicy food — Korean five-year-olds eat it',
    heatVerified: false,
    buyIf: 'Someone at the table cannot take heat. This is Korea’s standard answer',
    slug: '361',
  },
  {
    name: 'Jin Ramen, spicy',
    nameKo: '진라면 매운맛',
    maker: 'Ottogi',
    format: 'Soup',
    base: 'Same base as the mild, chili dialled up',
    heat: 'Moderate, below Shin Ramyun',
    heatVerified: false,
    buyIf: 'You want the bag Koreans actually buy most often — 26.4% on purchase frequency',
    slug: '361',
  },
  {
    name: 'Neoguri, spicy',
    nameKo: '얼큰한 너구리',
    maker: 'Nongshim',
    format: 'Soup, udon-thick noodle',
    base: 'Seafood and kelp',
    heat: 'Moderate — the seafood carries it, not the chili',
    heatVerified: false,
    buyIf: 'You want depth rather than heat. The kelp square in the packet is real food',
    slug: '359',
  },
];

export interface PriceRow {
  format: string;
  formatKo: string;
  price: string;
  note: string;
  slug: string;
}

export const PRICES: PriceRow[] = [
  { format: 'Bagged, single', formatKo: '봉지', price: 'about ₩1,000', note: 'Convenience store. A public price benchmark in Korea', slug: '038' },
  { format: 'Bagged, five-pack', formatKo: '봉지 5개입', price: 'markedly less per serving', note: 'E-Mart, Homeplus or Lotte Mart', slug: '038' },
  { format: 'Cup, small', formatKo: '컵라면', price: '₩1,200–1,800', note: 'Rose in the August 2026 increase', slug: '038' },
  { format: 'Buldak cup', formatKo: '불닭볶음면 컵', price: 'about ₩1,800', note: 'Stir-fried, so drain rather than fill', slug: '038' },
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
    intro: 'The two questions everyone has before the first packet.',
    guides: [
      {
        slug: '038',
        title: 'The Korean ramyun guide',
        blurb: 'Shin, Buldak, Chapaghetti and the stew-style bowls — what each one is, and current prices.',
        image: '/assets/images/posts/038/36628da4-9e56-4710-bde0-a77b9874e472.jpg',
        imageAlt: 'Korean instant noodles being prepared.',
      },
      {
        slug: '093',
        title: 'Bagged or cup?',
        blurb: 'They are not the same product cooked differently. Which format the in-store machine is for.',
        image: '/assets/images/posts/093/0eee505d-81b1-4281-aa69-e4ba3b32fc50.png',
        imageAlt: 'Korean instant noodles in bag and cup formats.',
      },
      {
        slug: '326',
        title: 'How hot is it, really',
        blurb: 'Scoville numbers for the things people are actually scared of, measured against a Korean pepper.',
        image: '/assets/images/posts/326/korean-street-food-noodles.jpg',
        imageAlt: 'Spicy Korean noodles in a bowl.',
      },
    ],
  },
  {
    heading: 'The head-to-heads',
    intro: 'Where the useful decision is between two specific packets.',
    guides: [
      {
        slug: '346',
        title: 'Ansungtangmyun vs Shin Ramyun',
        blurb: 'Not mild versus hot. One is a soybean-paste soup and the other is a chili soup — different dishes.',
        image: '/assets/images/posts/346/ansungtangmyun-noodle-and-soup-powder.jpg',
        imageAlt: 'Ansungtangmyun noodle block beside its brown soup powder.',
      },
      {
        slug: '048',
        title: 'Carbo Buldak',
        blurb: 'How the creamy version became the export that carried the whole brand.',
        image: '/assets/images/posts/048/efd079cc-5d55-40e8-921b-2785c9caab20.png',
        imageAlt: 'Carbo Buldak, the creamy spicy Korean instant noodle.',
      },
      {
        slug: '145',
        title: 'Pyongyang vs Hamheung naengmyeon',
        blurb: 'The cold-noodle decision, which is about broth versus sauce rather than temperature.',
        image: '/assets/images/posts/145/mul-naengmyeon-bowl.jpg',
        imageAlt: 'A bowl of mul-naengmyeon in chilled broth.',
      },
      {
        slug: '361',
        title: 'Jin Ramen mild vs spicy',
        blurb: 'One recipe with the chili dialled up, not two. The bag Koreans buy most often, and the third heat grade Korea keeps to itself.',
        image: '/assets/images/posts/361/jin-ramen-cooked-bowl.jpg',
        imageAlt: 'A prepared bowl of Jin Ramen spicy.',
      },
    ],
  },
  {
    heading: 'Beyond the packet',
    intro: 'Noodles that are not instant, and the places instant noodles are eaten.',
    guides: [
      {
        slug: '219',
        title: 'What is trending this year',
        blurb: 'Toomba, creamy heat, and the convenience store recipes that drive the whole category.',
        image: '/assets/images/posts/219/korean-ramen-chopsticks.jpg',
        imageAlt: 'Korean ramen being lifted with chopsticks.',
      },
      {
        slug: '065',
        title: 'Rainy-day noodles',
        blurb: 'Kalguksu, sujebi and why Koreans reach for broth the moment it starts raining.',
        image: '/assets/images/posts/065/pajeon-on-the-pan.jpg',
        imageAlt: 'A scallion pancake frying in oil.',
      },
      {
        slug: '054',
        title: 'The in-store ramyun machine',
        blurb: 'How to use it, and why the bag is the wrong purchase if you are cooking at the counter.',
        image: '/assets/images/posts/054/13031ce3-164e-4758-8082-f1e023470333.png',
        imageAlt: 'A ramen cooking machine in a Korean convenience store.',
      },
      {
        slug: '359',
        title: 'How Koreans actually cook Neoguri',
        blurb: 'The green square in the packet is Wando kelp, not seasoning — and it is why the broth tastes the way it does.',
        image: '/assets/images/posts/359/neoguri-spicy-nongshim.jpg',
        imageAlt: 'A packet of Nongshim Neoguri spicy seafood udon ramyun.',
      },
    ],
  },
];

export const RAMYUN_SLUGS: string[] = GUIDE_GROUPS.flatMap((g) => g.guides.map((x) => x.slug));
