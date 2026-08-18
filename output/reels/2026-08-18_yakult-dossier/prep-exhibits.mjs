/**
 * Exhibit plates for the Yakult / COCO DOSSIER reel (post `362`).
 *
 * SOURCES
 *   All three are manufacturer-official and were already vetted for the post — hy Mobility for
 *   the cart, hy's own Fredit storefront for the bottle. Commons has no Korean Yakult at all
 *   and nothing whatsoever for the COCO cart, which is why the 0차 manufacturer rule decided
 *   this set in the first place.
 *
 * WHY TWO CART VIEWS AND NOT ONE
 *   They are doing different jobs. The cream three-quarter render carries hy's slogan and the
 *   handlebars, so it belongs on the card about the person who rides it. The side profile is
 *   shot on black, which is the film ground the kit already uses, and it is the only framing
 *   that makes the chest-freezer-with-a-steering-column proportion readable — which is the
 *   entire joke of the card about the Road Traffic Act.
 *
 * CROP BOXES COME FROM A MEASURED CONTENT BBOX, NOT FROM EYEBALLING A CONTACT SHEET.
 * The first pass guessed them and clipped 50px off the right of the cream render — the cart
 * fills that frame edge to edge (measured content 0,0 1199x1224, no studio margin at all) —
 * and left a stray bright band beside the side profile. Both boxes below are the luminance
 * bbox plus a 20px margin. Two are downscales; the side profile is a 1.08x enlargement,
 * because hy only publishes that view at 682x482 of usable subject.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const SRC = 'public/assets/images/posts/362';
const OUT = 'public/assets/reels/yakult-dossier/media';

async function assertSize(file, w, h) {
  const m = await sharp(file).metadata();
  if (m.width !== w || m.height !== h) {
    throw new Error(`${file}: expected ${w}x${h}, got ${m.width}x${m.height} — recheck crops`);
  }
}

await mkdir(OUT, { recursive: true });

const cuts = [
  // The bottle beside the poured glass. The glass is the evidence: the article's claim is that
  // this is a liquid and not a spoonable yogurt, and it is the only image that shows it pouring.
  ['exhibit-bottle.png', `${SRC}/yakult-premium-light.jpg`, [720, 720],
    { left: 40, top: 90, width: 650, height: 580 }],
  // Cream three-quarter render, hy's 신선한 가치로 건강한 습관을 legible on the flank.
  ['exhibit-cart.png', `${SRC}/coco-cart-official.jpg`, [1200, 1231],
    { left: 0, top: 0, width: 1200, height: 1224 }],
  // Side profile on black.
  ['exhibit-cart-side.png', `${SRC}/coco-cart-side.jpg`, [1200, 1050],
    { left: 108, top: 268, width: 722, height: 522 }],
];

const lines = [];
for (const [name, file, size, box] of cuts) {
  await assertSize(file, size[0], size[1]);
  const info = await sharp(file).extract(box).resize({ height: 566, kernel: 'lanczos3' })
    .png({ compressionLevel: 9 }).toFile(`${OUT}/${name}`);
  const scale = (info.height / box.height).toFixed(3);
  lines.push(`${name.padEnd(24)} ${info.width}x${info.height}  ratio ${(info.width / info.height).toFixed(3)}  scale ${scale}`);
  console.log(lines.at(-1));
}
await writeFile(`${OUT}/crops.txt`, lines.join('\n') + '\n');
