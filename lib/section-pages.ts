export type SectionPageKey = 'travel' | 'food-shopping' | 'beauty-lifestyle' | 'culture';

export interface SectionPageConfig {
  key: SectionPageKey;
  href: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  promise: string;
  heroSlugs: string[];
  recommendedSlugs: string[];
  matchers: string[];
  topicPills: string[];
  accentTextClass: string;
  accentBgClass: string;
  accentSolidClass: string;
  accentBorderClass: string;
  metadataTitle: string;
  metadataDescription: string;
  /**
   * Optional pointer to a reference hub that belongs to this topic but is not a
   * post — /seoul under Travel, and /prices under Food & Shopping once it
   * exists. Kept optional so the five sections without one render unchanged.
   */
  spotlight?: {
    eyebrow: string;
    title: string;
    body: string;
    href: string;
    action: string;
  };
}

export const sectionPageConfigs: Record<SectionPageKey, SectionPageConfig> = {
  travel: {
    key: 'travel',
    href: '/travel',
    label: 'Travel',
    eyebrow: 'EpicKor Travel',
    title: 'Korea travel guides for arrivals, routes, seasons, and better days out',
    description:
      'Plan Korea with airport transfers, Seoul routes, festival timing, packing decisions, and practical day-by-day guides.',
    promise: 'Start with the high-friction travel decisions first, then branch into neighborhoods, seasons, and local routines.',
    spotlight: {
      eyebrow: 'New section',
      title: 'Seoul by neighbourhood',
      body:
        'Ikseon-dong, Euljiro, Yeonnam-dong, Mangwon, Haebangchon, Mullae, Seongsu and Hannam compared by character, nearest station, and whether each is worth staying in.',
      href: '/seoul',
      action: 'Compare neighbourhoods',
    },
    heroSlugs: ['257', '202', '159'],
    recommendedSlugs: ['257', '202', '205', '216', '201', '204', '267', '180'],
    matchers: [
      'KoreaTravel',
      'SeoulTravel',
      'IncheonAirport',
      'AirportTransfer',
      'TravelPlanning',
      'TravelGuide',
      'Hangang',
      'Bukchon',
      'Seoul',
      'Busan',
      'Jeju',
      'Gyeongju',
    ],
    topicPills: ['Airport', 'Seoul routes', 'Packing', 'Festivals', 'Neighborhoods'],
    accentTextClass: 'text-blue-700',
    accentBgClass: 'bg-blue-50',
    accentSolidClass: 'bg-blue-700',
    accentBorderClass: 'border-blue-200',
    metadataTitle: 'EpicKor Travel | Korea Travel Guides',
    metadataDescription:
      'Korea travel guides for airports, Seoul routes, packing, seasons, neighborhoods, and practical trip planning.',
  },
  'food-shopping': {
    key: 'food-shopping',
    href: '/food-shopping',
    label: 'Food & Shopping',
    eyebrow: 'EpicKor Food & Shopping',
    title: 'Korean food, grocery, cafe, souvenir, and shopping guides',
    description:
      'Find what to eat, what to buy, what to bring home, and how to shop smarter in Korea without turning every trip into a guess.',
    promise: 'Use this page when a Reel or search result makes you hungry, curious, or one click away from buying the wrong thing.',
    spotlight: {
      eyebrow: 'Reference guides',
      title: 'Convenience stores, ramyun and drinks',
      body:
        'Three comparison guides sit inside this section: Korean convenience stores — CU, GS25, 7-Eleven and Emart24 compared with current prices — Korean ramyun, every packet ranked by published Scoville, and Korean drinks, where half the names point at the wrong thing.',
      href: '/guides',
      action: 'See all three guides',
    },
    heroSlugs: ['270', '209', '272'],
    recommendedSlugs: ['270', '272', '209', '220', '153', '171', '277', '279', '280', '281', '282'],
    matchers: [
      'KoreanFood',
      'Korean Food',
      'KoreaShopping',
      'SeoulShopping',
      'SeoulFood',
      'KoreanBakery',
      'CafeCulture',
      'ConvenienceStore',
      'KoreanSnacks',
      'KoreanPantry',
      'KoreaAtHome',
      'StreetFood',
      'KoreanDrinks',
      'KoreanGifts',
      'Dosirak',
      'KimchiJjigae',
    ],
    topicPills: ['Bakeries', 'Grocery', 'Convenience stores', 'Souvenirs', 'At-home Korea'],
    accentTextClass: 'text-red-600',
    accentBgClass: 'bg-red-50',
    accentSolidClass: 'bg-red-600',
    accentBorderClass: 'border-red-200',
    metadataTitle: 'EpicKor Food & Shopping | Korean Food And Korea Shopping Guides',
    metadataDescription:
      'Korean food, grocery, cafe, souvenir, convenience store, and Seoul shopping guides from EpicKor.',
  },
  'beauty-lifestyle': {
    key: 'beauty-lifestyle',
    href: '/beauty-lifestyle',
    label: 'Beauty & Lifestyle',
    eyebrow: 'EpicKor Beauty & Lifestyle',
    title: 'K-beauty, skincare, shopping, and everyday Korea lifestyle guides',
    description:
      'Compare Korean sunscreens, Olive Young shelves, beauty devices, wearable skincare, and daily-life routines before you buy.',
    promise: 'This is the calmer route through viral K-beauty and Korea lifestyle trends: useful context first, shopping second.',
    heroSlugs: ['160', '192', '268'],
    recommendedSlugs: ['160', '192', '268', '269', '271', '163', '206', '244'],
    matchers: [
      'K-Beauty',
      'KBeauty',
      'KoreanSkincare',
      'Korean Sunscreen',
      'SPF',
      'Skincare',
      'OliveYoung',
      'BeautyShopping',
      'KoreanMakeup',
      'CushionFoundation',
      'BeautyDevices',
      'WearableSkincare',
      'Glass Skin',
      'Beauty',
    ],
    topicPills: ['SPF', 'Olive Young', 'Makeup shades', 'Devices', 'Daily routines'],
    accentTextClass: 'text-pink-600',
    accentBgClass: 'bg-pink-50',
    accentSolidClass: 'bg-pink-600',
    accentBorderClass: 'border-pink-200',
    metadataTitle: 'EpicKor Beauty & Lifestyle | K-Beauty And Korean Lifestyle Guides',
    metadataDescription:
      'K-beauty, Korean skincare, Olive Young, sunscreen, makeup shade, beauty device, and lifestyle guides.',
  },
  culture: {
    key: 'culture',
    href: '/culture',
    label: 'Culture',
    eyebrow: 'EpicKor Culture',
    title: 'Korean culture explainers for words, habits, status signals, and daily life',
    description:
      'Understand Korean social terms, schools, etiquette, customs, and everyday moments that make Korea easier to read.',
    promise: 'Use this page when the question is not just where to go, but what a Korean moment means.',
    heroSlugs: ['090', '082', '210'],
    recommendedSlugs: ['090', '082', '210', '231', '055', '174', '166', '178', '080'],
    matchers: [
      'Culture',
      'KoreanCulture',
      'Social',
      'Language',
      'Education',
      'History',
      'Korean Culture',
      'Korean Society',
      'KoreanEducation',
      'KoreanLanguage',
      'KoreanTerms',
      'KoreanAge',
      'KoreanUniversities',
      'StudyInKorea',
      'StudentLife',
      'Etiquette',
      'Kpop',
      'K-Culture',
      'SeoulSubway',
    ],
    topicPills: ['Language', 'Social cues', 'Education', 'Etiquette', 'K-culture'],
    accentTextClass: 'text-violet-700',
    accentBgClass: 'bg-violet-50',
    accentSolidClass: 'bg-violet-700',
    accentBorderClass: 'border-violet-200',
    metadataTitle: 'EpicKor Culture | Korean Culture Explainers',
    metadataDescription:
      'Korean culture explainers for social terms, etiquette, education, language, customs, and daily-life signals.',
  },
};

export const sectionPageList = Object.values(sectionPageConfigs);
