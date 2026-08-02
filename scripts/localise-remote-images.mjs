#!/usr/bin/env node
/**
 * Download images that posts hotlink from external hosts and rewrite the
 * references to local paths.
 *
 * Why: an audit on 2026-08-02 found 14 posts pointing at Pexels CDN URLs, plus
 * one at Unsplash and one at Seoul's mediahub — 56 images in total, twelve of
 * them as the post's ogImage. Hotlinking means the image disappears if the host
 * changes the URL, the file size is outside our control, and the cross-post
 * duplicate audit cannot see it at all (it keys off documented photo IDs, and a
 * remote URL never gets documented). One genuine duplicate was hiding this way:
 * Pexels 32196411 was serving as the hero of both 169 and 175.
 *
 * Run with an explicit job list rather than a crawl, so every download is a
 * deliberate decision that can be reviewed in the diff.
 */
import { mkdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'fs';
import sharp from 'sharp';

const UA = { 'User-Agent': 'EpicKorBot/1.0 (https://epickor.com; contact@epickor.com)' };

/** [post slug, source URL, local filename without extension] */
const JOBS = [
  [
    '183',
    'https://images.unsplash.com/photo-1687692629869-a27ac2887251?auto=format&fit=crop&fm=jpg&q=80&w=1600',
    'seoul-heatwave-summer',
  ],
  [
    '185',
    'https://mediahub.seoul.go.kr/uploads/mediahub/2025/05/yFHmOtNOzYnLOkvBkrvGhkLfKGHqsFlN.jpg',
    'seoul-mediahub-hero',
  ],
  [
    '183',
    'https://mediahub.seoul.go.kr/uploads/mediahub/2025/08/mhBBBQdIOaRczDfLwIfPlzQVzZqnmMQo.jpg',
    'seoul-mediahub-1',
  ],
  [
    '183',
    'https://mediahub.seoul.go.kr/uploads/mediahub/2024/06/WQrKqPplJlTkzhqqiMdMgPulZpgmyhLa.jpg',
    'seoul-mediahub-2',
  ],
  [
    '183',
    'https://mediahub.seoul.go.kr/uploads/mediahub/2024/05/QNutHxadaXppiaOpwrZCUhkrytmOdmIo.jpg',
    'seoul-mediahub-3',
  ],
  [
    '185',
    'https://mediahub.seoul.go.kr/uploads/mediahub/2025/05/fCbAhHlgwGoGOoPgdKihhJiqatcrSQGD.jpg',
    'seoul-mediahub-1',
  ],
];

for (const [slug, url, name] of JOBS) {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) {
    console.log('MISS', slug, res.status);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const dir = `public/assets/images/posts/${slug}`;
  mkdirSync(dir, { recursive: true });
  const out = `${dir}/${name}.jpg`;
  await sharp(buf).resize({ width: 1400, withoutEnlargement: true }).jpeg({ quality: 76, mozjpeg: true }).toFile(out);

  const mdPath = `content/blog/${slug}.md`;
  if (!existsSync(mdPath)) {
    console.log('MD 없음', mdPath);
    continue;
  }
  let md = readFileSync(mdPath, 'utf8');
  // Match the URL with or without its query string, since the same asset is
  // referenced both ways across ogImage and the body.
  const base = url.split('?')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  md = md.replace(new RegExp(base + '[^\\s")]*', 'g'), `/assets/images/posts/${slug}/${name}.jpg`);
  writeFileSync(mdPath, md, 'utf8');

  console.log(`${out} ${(statSync(out).size / 1024) | 0}KB`);
}
