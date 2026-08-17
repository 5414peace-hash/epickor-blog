/**
 * K-BEAUTY PICKER — the first reel on the COUNTER kit (see CounterKit.tsx for why
 * that kit exists).
 *
 * Every number here is transcribed from a published EpicKor post that carries its own
 * date stamp and Korean-language sourcing; nothing is estimated for the video:
 *   COSRX Snail 96      ₩23,000 list / ₩14,000 promo   content/blog/395.md
 *   Anua Heartleaf 77   ₩25,000 list / ₩19,900 promo   content/blog/396.md
 *   Torriden Dive-In    ₩25,500 list / ₩16,900 direct  content/blog/398.md
 *   Round Lab Dokdo     no meaningful list / ₩10,900   content/blog/401.md
 *
 * Round Lab has no list-price beat because the post does not claim one — the refill
 * pack simply sells at that price. Rather than invent a list to keep the rhythm
 * uniform, that block runs one beat shorter, which also breaks the pattern before a
 * viewer can start predicting it.
 *
 * The Torriden verdict is the reel's reason to exist as a shopping video: the
 * manufacturer's own Korean mall undercuts Olive Young by ₩5,100, so the retailer is
 * not the cheap option. That is the kind of fact the English-language web does not
 * carry, and it is the sort of thing a viewer screenshots.
 */
import { ReelCounter, counterDuration, type Product } from './CounterKit';

const M = 'assets/reels/kbeauty-picker/media';

export const KBEAUTY_PRODUCTS: Product[] = [
  {
    id: 'cosrx',
    media: `${M}/cosrx.png`,
    brand: 'COSRX',
    name: 'Snail 96 Essence',
    hangul: '스네일 96 뮤신 에센스',
    concern: ['FLAKING.', 'TIGHT AFTER WASH.'],
    list: 23000,
    street: 14000,
    where: 'Olive Young promo week',
    verdict: 'Nobody in Korea pays the ₩23,000 list. The promotion cycle is the real price.',
  },
  {
    id: 'anua',
    media: `${M}/anua.png`,
    brand: 'Anua',
    name: 'Heartleaf 77 Toner',
    hangul: '어성초 77 수딩 토너',
    concern: ['SHINY BY NOON.', 'RED AFTER WASH.'],
    list: 25000,
    street: 19900,
    where: 'Olive Young, 250ml',
    verdict: 'It smells faintly of fish for about a minute. That is the heartleaf, not a bad bottle.',
  },
  {
    id: 'torriden',
    media: `${M}/torriden.png`,
    brand: 'Torriden',
    name: 'Dive-In Serum',
    hangul: '다이브인 히알루론산 세럼',
    concern: ['DRINKS WATER.', 'STILL FEELS DRY.'],
    list: 25500,
    street: 16900,
    where: "Torriden's own Korean mall",
    verdict: 'The maker undercuts Olive Young by ₩5,100. The retailer is not the cheap option here.',
  },
  {
    id: 'roundlab',
    media: `${M}/roundlab.png`,
    brand: 'Round Lab',
    name: '1025 Dokdo Toner',
    hangul: '1025 독도 토너',
    concern: ['SENSITIVE SKIN.', 'NEW TO ALL THIS.'],
    street: 10900,
    where: '200ml refill pack',
    verdict: 'Cheapest of the four. 1025 is a date — October 25, Korea’s Dokdo Day.',
  },
];

export const KBEAUTY_DURATION = counterDuration(KBEAUTY_PRODUCTS.length);

export function ReelKBeautyPicker() {
  return (
    <ReelCounter
      products={KBEAUTY_PRODUCTS}
      outroHook={'DON’T ORDER\nBLIND.'}
      outroSub="Ingredient breakdowns, Korean prices, and what each bottle is actually for."
    />
  );
}
