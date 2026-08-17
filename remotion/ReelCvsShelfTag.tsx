/**
 * CVS SHELF TAG — the third reel on the COUNTER kit, and the one aimed at EpicKor's
 * best-converting query cluster.
 *
 * WHY THIS TOPIC
 *   `korean convenience store breakfast` is the site's highest-CTR query at 14.75% against
 *   61 impressions — the measurement that the whole "pointed beats voluminous" thesis rests
 *   on. This reel sits in that cluster.
 *
 *   It is also a rebuild of reel 376's subject. 376 was the convenience-store deals reel
 *   whose frame extraction proved the old kit was slower than card news, so running the same
 *   topic through COUNTER is the cleanest available comparison: identical subject, two kits.
 *
 * THE THESIS AND ITS ONE HONEST COMPLICATION
 *   The listed price on a Korean convenience-store shelf is not what Koreans pay. There are
 *   two mechanisms, not one: the 2+1 / 3+1 promotion, and simply buying elsewhere. Three
 *   blocks show a promotion; the fourth shows Pocachip, where the gap is a different shelf
 *   entirely. The `where` line names the mechanism on every block, so the reel is not
 *   pretending they are the same thing — and the break gives block four a payoff.
 *
 * EVERY FIGURE IS TRANSCRIBED, NOT ESTIMATED
 *   진라면 컵         ₩1,100 → ₩825    3+1/2+1, checked 3 Aug 2026   content/blog/361.md
 *   너구리 큰사발      ₩1,900 → ₩1,267  2+1 at CU, checked 3 Aug 2026 content/blog/359.md
 *   밀키스 250ml      ₩1,500 → ₩1,000  2+1 at GS25                  content/blog/360.md
 *   포카칩 66g        ₩1,700 → ₩1,100  supermarket multipack         content/blog/366.md
 *
 *   Both ramyeon prices are for CUP formats, and until 2026-08-17 every ramyeon photograph in
 *   the repo was a packet — so this reel could not have been made honestly before the
 *   representative supplied the two cup shots. Pairing a cup price with a packet photo is the
 *   2026-08-03 카드뉴스 defect.
 *
 * PALETTE — the store, not the pack
 *   Sampled across all four finished panels: red dominates at hue 355-358 with chroma up to
 *   210, then neutral grey at hue 205-207 and a near-black. The ramyeon reel already owns a
 *   warm cream ground with red on it, so this one takes the cool half of the measurement: a
 *   fluorescent grey-white ground and steel-slate accents, with the measured #ED1B2D as the
 *   price. That is also the more honest read of the subject — the products are red but the
 *   shop is cool white light and grey shelving, and this reel is about the shelf tag.
 */
import { ReelCounter, counterDuration, type Copy, type Palette, type Product } from './CounterKit';

const M = 'assets/reels/cvs-shelf-tag/media';

/** Red measured verbatim; the greys pushed to a steel-slate accent. See the header note. */
export const PALETTE_CVS: Palette = {
  canvas: '#E8EBED',
  deep: '#C3C9CD',
  accent: '#2E5A6B',
  ink: '#14191C',
  mute: '#6D7679',
  price: '#ED1B2D',
  paper: '#FFFFFF',
};

export const CVS_PRODUCTS: Product[] = [
  {
    id: 'jin-cup',
    media: `${M}/jin-cup.png`,
    brand: 'Ottogi',
    name: 'Jin Ramen Cup',
    hangul: '진라면 매운맛 컵',
    concern: ['THE CHEAPEST', 'HOT MEAL.'],
    list: 1100,
    street: 825,
    where: '3+1 at emart24, CU, 7-Eleven',
    verdict: 'Checked across three chains on 3 August 2026. Mild and slightly-spicy cups list at the same ₩1,100.',
  },
  {
    id: 'neoguri-cup',
    media: `${M}/neoguri-cup.png`,
    brand: 'Nongshim',
    name: 'Neoguri Large Cup',
    hangul: '너구리 큰사발',
    concern: ['BIGGEST CUP.', 'BIGGEST DROP.'],
    list: 1900,
    street: 1267,
    where: '2+1 at CU',
    verdict: 'A ₩633 gap on one cup — and the stiff dark square inside is kelp, not a seasoning packet.',
  },
  {
    id: 'milkis',
    media: `${M}/milkis.png`,
    brand: 'Lotte Chilsung',
    name: 'Milkis',
    hangul: '밀키스 250ml',
    concern: ['NOT MILK.', 'NOT QUITE SODA.'],
    list: 1500,
    street: 1000,
    where: '2+1 at GS25',
    verdict: 'On sale since 1989, and Lotte Chilsung has publicly talked about it reaching ₩80 billion a year.',
  },
  {
    id: 'pocachip',
    media: `${M}/pocachip.png`,
    brand: 'Orion',
    name: 'Pocachip',
    hangul: '포카칩 66g',
    concern: ['NOT A', 'PROMOTION.'],
    list: 1700,
    street: 1100,
    where: 'supermarket multipack',
    verdict: 'Same bag, different shelf. The convenience store is the expensive way to buy Korea’s No.1 chip.',
  },
];

export const CVS_COPY: Copy = {
  // 'THE SHELF TAG' overflowed 118px and the browser broke it, orphaning 'TAG' on its
  // own line. Each hook line has to fit unbroken — see the budget note in CounterKit.
  hook: ['THE TAG', 'IS NOT', 'THE PRICE.'],
  hookSource: 'Korean convenience-store prices · August 2026',
  decide: ['NEVER PAY', 'THE TAG.'],
  decideSub: 'Which chain runs which deal, and how a 2+1 actually works.',
};

export const CVS_DURATION = counterDuration(CVS_PRODUCTS.length);

export function ReelCvsShelfTag() {
  return (
    <ReelCounter
      products={CVS_PRODUCTS}
      copy={CVS_COPY}
      palette={PALETTE_CVS}
      outroHook={'LOCALS KNOW\nTHE REST.'}
      outroSub="The 1+1 and 2+1 rules, which chains bank the free item, and what a visitor can actually use."
    />
  );
}
