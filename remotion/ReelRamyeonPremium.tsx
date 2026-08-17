/**
 * RAMYEON PREMIUM — the second reel on the COUNTER kit, and the test of whether that kit
 * is a tool or a one-off design.
 *
 * WHY THIS TOPIC
 *   The kit's justifying motion is a price that CHANGES. On the beauty reel that was a
 *   discount — list struck, real price counting up underneath. Here the number moves the
 *   other way and the movement IS the article's thesis: post 219 is titled "Why a Packet
 *   Now Costs ₩1,900". So ₩1,000 gets struck and the number climbs. A rise is more
 *   surprising than a discount, which makes this a stronger fit than the reel it follows.
 *
 *   It is also the 1차 레인 (음식-구체) rather than the conditional 2차 beauty lane, which is
 *   where the execution plan says new work belongs.
 *
 * EVERY FIGURE IS TRANSCRIBED, NOT ESTIMATED
 *   신라면 (standard)   ~₩1,000, on the shelf since 1986   content/blog/219*.md
 *   신라면 골드           ₩1,500, launched 2 January 2026    content/blog/219*.md
 *   삼양1963             ₩1,900, launched 3 November 2025   content/blog/219*.md
 *
 *   Block one carries no strike, because ₩1,000 is the reference the other two are priced
 *   against rather than a price that moved. The beauty reel set the precedent with Round
 *   Lab: a block that legitimately has one number gets one number.
 *
 * THE PAYOFF
 *   삼양1963 relaunched on 3 November 2025 — exactly thirty-six years after the anonymous
 *   3 November 1989 tip-off that falsely accused Samyang of frying its noodles in
 *   industrial-grade beef tallow, a charge the Supreme Court cleared in 1997. The
 *   relaunched product is fried in beef tallow, and **the bag prints 우지 6.87% on the
 *   front.** That last detail was read off the packaging supplied by the representative on
 *   2026-08-17 and is not yet in post 219 — it belongs there too.
 *
 * PALETTE
 *   Sampled from the one pack shot of this reel already in the repo,
 *   093/shin-ramyun-bag-official.jpg: black #030202 at 35.8% and the Shin red #ea1c24 at
 *   23.8%, chroma 206. The red is used verbatim as the price colour, because on a Korean
 *   ramyeon shelf that red IS the price tag. The cream ground is the premium packs' own
 *   world; re-sample it from the 삼양1963 pack once that file is on disk.
 */
import { ReelCounter, counterDuration, type Copy, type Palette, type Product } from './CounterKit';

const M = 'assets/reels/ramyeon-premium/media';

/** Red and black measured; cream and brick derived from them. See the header note. */
export const PALETTE_RAMYEON: Palette = {
  canvas: '#F1E7D8',
  deep: '#DFCDB0',
  accent: '#8C1D18',
  ink: '#1A0F0C',
  mute: '#8A7666',
  price: '#EA1C24',
  paper: '#FFFFFF',
};

export const RAMYEON_PRODUCTS: Product[] = [
  {
    id: 'shin-standard',
    media: `${M}/shin-standard.png`,
    brand: 'Nongshim',
    name: 'Shin Ramyun',
    hangul: '신라면',
    concern: ['FORTY YEARS', 'ON ONE SHELF.'],
    street: 1000,
    where: 'the ordinary shelf',
    verdict: 'On sale since 1986. This is the number the whole aisle is priced against.',
  },
  {
    id: 'shin-gold',
    media: `${M}/shin-gold.png`,
    brand: 'Nongshim',
    name: 'Shin Ramyun Gold',
    hangul: '신라면 골드',
    concern: ['FORTIETH', 'BIRTHDAY.'],
    list: 1000,
    street: 1500,
    where: 'launched 2 January 2026',
    verdict: 'Half again the standard packet — and a premium Shin was sold abroad before it came home.',
  },
  {
    id: 'samyang-1963',
    media: `${M}/samyang-1963.png`,
    brand: 'Samyang',
    name: 'Samyang 1963',
    hangul: '삼양1963',
    concern: ['SAME DATE.', 'THIRTY-SIX YEARS.'],
    list: 1000,
    street: 1900,
    where: 'launched 3 November 2025',
    verdict: 'Fried in beef tallow, 우지 6.87% printed on the bag — on the anniversary of the charge that nearly killed the company.',
  },
];

export const RAMYEON_COPY: Copy = {
  hook: ['ONE PACKET', 'USED TO BE', '₩1,000.'],
  hookSource: 'Korean launch prices · 2026',
  decide: ['THE SHELF', 'SPLIT IN TWO.'],
  decideSub: 'What the 1989 letter claimed, and why the price moved.',
};

export const RAMYEON_DURATION = counterDuration(RAMYEON_PRODUCTS.length);

export function ReelRamyeonPremium() {
  return (
    <ReelCounter
      products={RAMYEON_PRODUCTS}
      copy={RAMYEON_COPY}
      palette={PALETTE_RAMYEON}
      outroHook={'THERE’S\nMORE.'}
      outroSub="What the 1989 letter said, why it was false, and what the shelf looks like now."
    />
  );
}
