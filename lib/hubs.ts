/**
 * The register of EpicKor's reference hubs.
 *
 * Why this file exists: three hubs shipped with no way in. The header carries
 * eight topic sections and no room, the home chip row scrolls horizontally and
 * pushed them off-screen at x=610 and beyond on a 390px phone, the home tiles
 * sat 3,300px down on mobile, and the footer did not list them at all. The only
 * route in was a belt at the bottom of an article — meaning the only people who
 * could find a hub were people already reading something inside it.
 *
 * One nav slot pointing at /guides/ solves that for any number of hubs, which
 * matters because more are planned. Every surface that needs to list hubs reads
 * this array, so adding one is a single edit.
 */

export interface Hub {
  href: string;
  label: string;
  /** Full title used on the /guides index. */
  title: string;
  blurb: string;
  /** What the hub gives you that the individual articles cannot. */
  whatItAdds: string;
  image: string;
  imageAlt: string;
  articleCount: number;
  accentText: string;
  accentBg: string;
  accentBorder: string;
}

export const HUBS: Hub[] = [
  {
    href: '/seoul',
    label: 'Seoul by Neighbourhood',
    title: 'Seoul by neighbourhood',
    blurb:
      'Nine Seoul neighbourhoods compared by character, nearest station, whether they are worth staying in, and how long each actually takes.',
    whatItAdds: 'A side-by-side table, so you pick the neighbourhood before you book the hotel.',
    image: '/assets/images/posts/355/ikseon-dong-hanok-alley.jpg',
    imageAlt: 'A narrow alley of hanok houses in Ikseon-dong, Seoul.',
    articleCount: 9,
    accentText: 'text-blue-700',
    accentBg: 'bg-blue-50',
    accentBorder: 'border-blue-200',
  },
  {
    href: '/convenience-store',
    label: 'Convenience Stores',
    title: 'Korean convenience stores',
    blurb:
      'CU, GS25, 7-Eleven and Emart24 compared, current prices for the things people actually buy, and a guide to each product on the shelf.',
    whatItAdds: 'Which chain holds which exclusive, and what everything costs this month.',
    image: '/assets/images/posts/059/convenience-store-lunchbox-01.jpg',
    imageAlt: 'A Korean convenience store lunch box with rice and side dishes.',
    articleCount: 14,
    accentText: 'text-red-600',
    accentBg: 'bg-red-50',
    accentBorder: 'border-red-200',
  },
  {
    href: '/ramyun',
    label: 'Korean Ramyun',
    title: 'Korean ramyun',
    blurb:
      'Every packet compared by soup base and published Scoville, with current Korean prices and the format that saves money.',
    whatItAdds: 'Real heat numbers — the famous one is about as hot as a jalapeño.',
    image: '/assets/images/posts/346/ansungtangmyun-noodle-and-soup-powder.jpg',
    imageAlt: 'Ansungtangmyun noodle block beside its brown soup powder.',
    articleCount: 9,
    accentText: 'text-orange-700',
    accentBg: 'bg-orange-50',
    accentBorder: 'border-orange-200',
  },
];

/** Hubs other than the one given — used for the cross-links at the foot of each hub. */
export function otherHubs(currentHref: string): Hub[] {
  return HUBS.filter((h) => h.href !== currentHref);
}
