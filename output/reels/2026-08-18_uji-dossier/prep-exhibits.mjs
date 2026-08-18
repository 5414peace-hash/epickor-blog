/**
 * Cut the DOSSIER reel's exhibits out of Samyang's own brand page.
 *
 * WHY THIS SCRIPT EXISTS AT ALL
 *   The first cut of this reel had zero photography, on the reasoning that a kit needing no
 *   imagery is a kit that never gets blocked. The representative's verdict was that for a
 *   story this obscure the design was fine but the reel was unreadable — with nothing on
 *   screen you cannot tell what is being talked about. That is correct, and it is a limit on
 *   the *reel*, not on the kit: DOSSIER still runs without images, but a subject nobody has
 *   heard of has to show its subject.
 *
 * SOURCE — the manufacturer, which is where a packaged product is supposed to come from
 *   `samyangfoods.com/asset/images/brand/samyang1963_PC_detail.jpg` is the brand page's own
 *   1920x6781 detail sheet. Everything below is a crop of it. Editorial use identifying the
 *   product and the company's own published history; no sponsorship implied.
 *
 *   Checked and rejected first: the product thumbnails under `/upload/product/` are 180x180,
 *   and no `_org` / `big_` variant exists (404). The detail sheet is the only large-format
 *   official imagery on the site.
 *
 * THE PRINT-LINE CROP IS THE POINT
 *   `print-front.png` is a 2.2x enlargement of a 400x120 strip. Upscaling is normally a smell,
 *   but the source is a vector product render rather than a photograph, so it holds — and it
 *   renders the sentence the whole reel is built to land:
 *       제품명 : 삼양1963 | 중량 : 131 g(530 kcal)
 *       제품 중 우지 6.87%, 비프추출물 1.05%(우정육 14.8%), 사골풍미분 1.02% 함유.
 *   Every figure the closing card claims is legible IN the photograph. That turns the payoff
 *   from a caption into evidence, which is the one thing a dossier has to do.
 */
import sharp from 'sharp';
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'node:fs';

const SRC_URL = 'https://www.samyangfoods.com/asset/images/brand/samyang1963_PC_detail.jpg';
const CACHE = '.tmp/samyang1963_PC_detail.jpg';
const OUT = 'public/assets/reels/uji-dossier/media';
mkdirSync(OUT, { recursive: true });
mkdirSync('.tmp', { recursive: true });

if (!existsSync(CACHE)) {
  const r = await fetch(SRC_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Referer: 'https://www.samyangfoods.com/kor/brand/samyang1963.do',
    },
  });
  if (!r.ok) throw new Error(`source ${r.status}`);
  writeFileSync(CACHE, Buffer.from(await r.arrayBuffer()));
}
const src = readFileSync(CACHE);
const meta = await sharp(src).metadata();
if (meta.width !== 1920 || meta.height !== 6781) {
  // The crops below are absolute pixel offsets into this exact sheet. If Samyang republishes
  // it at another size they silently point at the wrong thing, so fail loudly instead.
  throw new Error(`source sheet is ${meta.width}x${meta.height}, expected 1920x6781 — re-measure the crops`);
}

const JOBS = [
  {
    id: 'tv-1963',
    crop: { left: 850, top: 1912, width: 690, height: 510 },
    // Samyang's own 1960s television advertisement, reproduced on their brand page:
    // "우리나라 최초의 INSTANT 라면! 三養라면" — the claim the reel opens on.
    scale: 1,
  },
  {
    id: 'pack-1963',
    crop: { left: 775, top: 4665, width: 400, height: 490 },
    scale: 1,
  },
  {
    id: 'print-front',
    crop: { left: 775, top: 5005, width: 400, height: 120 },
    scale: 2.2,
  },
];

for (const job of JOBS) {
  const w = Math.round(job.crop.width * job.scale);
  const h = Math.round(job.crop.height * job.scale);
  const file = `${OUT}/${job.id}.png`;
  await sharp(src)
    .extract(job.crop)
    .resize(w, h, { kernel: 'lanczos3' })
    .png({ compressionLevel: 9 })
    .toFile(file);
  const m = await sharp(file).metadata();
  console.log(`OK    ${job.id.padEnd(12)} ${m.width}x${m.height}`
    + ` ratio ${(m.width / m.height).toFixed(3)}`
    + (job.scale === 1 ? '' : `  (${job.scale}x from ${job.crop.width}x${job.crop.height})`));
}
