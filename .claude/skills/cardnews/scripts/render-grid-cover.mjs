#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const args = process.argv.slice(2);
const slugIndex = args.indexOf('--slug');
const slug = slugIndex >= 0 ? args[slugIndex + 1] : '';
const mirror = args.includes('--mirror');

if (!slug) {
  console.error('Usage: node .claude/skills/cardnews/scripts/render-grid-cover.mjs --slug 159 [--mirror]');
  process.exit(2);
}

function findDir(base, targetSlug) {
  const exact = path.join(base, targetSlug);
  if (fs.existsSync(exact)) return exact;
  const prefixed = fs.readdirSync(base, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.endsWith(`_${targetSlug}`))
    .map((entry) => path.join(base, entry.name))
    .sort();
  return prefixed.at(-1) || exact;
}

function parseFirstCard(scriptPath) {
  const content = fs.readFileSync(scriptPath, 'utf8');
  const header = content.split(/^## Card\s+\d+/m)[0] || '';
  const topic = (header.match(/^topic:\s*(.+)$/m) || [null, 'Korean Culture'])[1].trim();
  const block = (content.split(/\n(?=## Card\s+\d+)/g)
    .find((part) => /^## Card\s+01\b/m.test(part))) || '';
  const card = {
    number: 1,
    topic,
    pointColor: 'Gold',
    kicker: '',
    image: '',
    imagePosition: 'center center',
    imageZoom: '1',
    imageOpacity: '0.78',
    main: '',
    sub: '',
  };

  for (const rawLine of block.split('\n')) {
    const line = rawLine.trim();
    if (line.startsWith('point_color:')) card.pointColor = line.split(':').slice(1).join(':').trim();
    if (line.startsWith('kicker:')) card.kicker = line.split(':').slice(1).join(':').trim();
    if (line.startsWith('image:')) card.image = line.split(':').slice(1).join(':').trim();
    if (line.startsWith('image_position:')) card.imagePosition = line.split(':').slice(1).join(':').trim();
    if (line.startsWith('image_zoom:')) card.imageZoom = line.split(':').slice(1).join(':').trim();
    if (line.startsWith('image_opacity:')) card.imageOpacity = line.split(':').slice(1).join(':').trim();
    if (line.startsWith('**Main:**')) card.main = cleanText(line.replace('**Main:**', '').trim());
    if (line.startsWith('**Sub:**')) card.sub = cleanText(line.replace('**Sub:**', '').trim());
  }
  return card;
}

function cleanText(text) {
  return (text || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .trim();
}

function imagePath(value) {
  if (!value) throw new Error('Card 01 is missing image.');
  if (/^https?:\/\//.test(value)) {
    throw new Error(`Card 01 image must be local for grid-cover render: ${value}`);
  }
  const fullPath = value.startsWith('/')
    ? path.join(root, 'public', value.slice(1))
    : path.join(root, value);
  if (!fs.existsSync(fullPath)) throw new Error(`Missing image: ${fullPath}`);
  return fullPath;
}

function pointColor(card) {
  const key = card.pointColor.toLowerCase();
  if (key === 'teal') return '#4ECDC4';
  if (key === 'red') return '#C94C3F';
  return '#C9A84C';
}

function sharpPosition(position) {
  const value = (position || '').toLowerCase();
  if (value.includes('top')) return 'top';
  if (value.includes('bottom')) return 'bottom';
  if (value.includes('left')) return 'left';
  if (value.includes('right')) return 'right';
  return 'center';
}

function escapeXml(text) {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapLine(line, maxChars) {
  const words = line.trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function wrapText(text, maxChars) {
  return text
    .split(/\\n|\r?\n/g)
    .flatMap((line) => wrapLine(line, maxChars))
    .filter(Boolean);
}

function textBlock(lines, opts) {
  const { x, y, size, lineHeight, weight, fill, opacity = 1, shadow = false } = opts;
  const tspans = lines.map((line, index) => {
    const dy = index === 0 ? 0 : lineHeight;
    return `<tspan x="${x}" dy="${dy}">${escapeXml(line)}</tspan>`;
  }).join('');
  const filter = shadow ? ' filter="url(#textShadow)"' : '';
  return `<text x="${x}" y="${y}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" opacity="${opacity}" letter-spacing="0"${filter}>${tspans}</text>`;
}

async function renderCover(card, outputPath) {
  const pc = pointColor(card);
  const mainLines = wrapText(card.main, 24);
  const subLines = wrapText(card.sub, 34);
  const mainSize = mainLines.length <= 2 ? 76 : mainLines.length === 3 ? 66 : mainLines.length === 4 ? 58 : 52;
  const mainLineHeight = Math.round(mainSize * 1.08);
  const subSize = subLines.length > 3 ? 28 : 31;
  const subLineHeight = Math.round(subSize * 1.32);
  const kickerText = (card.kicker || card.topic).toUpperCase();
  const kickerWidth = Math.min(780, Math.max(260, kickerText.length * 12 + 34));

  const blockHeight = 34 + 28 + 5 + 30 + (mainLines.length - 1) * mainLineHeight + mainSize + 32
    + (subLines.length - 1) * subLineHeight + subSize;
  const top = Math.round((1080 - blockHeight) / 2 - 10);
  const kickerY = top;
  const lineY = kickerY + 64;
  const mainY = lineY + 64;
  const subY = mainY + (mainLines.length - 1) * mainLineHeight + mainSize + 42;

  const overlay = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="centerShade" cx="50%" cy="50%" r="58%">
      <stop offset="0%" stop-color="#111111" stop-opacity="0.76"/>
      <stop offset="48%" stop-color="#111111" stop-opacity="0.60"/>
      <stop offset="100%" stop-color="#111111" stop-opacity="0.34"/>
    </radialGradient>
    <linearGradient id="verticalShade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#111111" stop-opacity="0.20"/>
      <stop offset="55%" stop-color="#111111" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="#111111" stop-opacity="0.74"/>
    </linearGradient>
    <filter id="textShadow" x="-20%" y="-20%" width="140%" height="160%">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#000000" flood-opacity="0.58"/>
    </filter>
  </defs>
  <rect width="1080" height="1080" fill="url(#centerShade)"/>
  <rect width="1080" height="1080" fill="url(#verticalShade)"/>

  <g opacity="0.74" font-family="Segoe UI, Arial, sans-serif" fill="#FFFFFF">
    <rect x="42" y="34" width="30" height="30" fill="none" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="1.5"/>
    <text x="57" y="54" text-anchor="middle" font-size="12" font-weight="900" letter-spacing="0">EK</text>
    <text x="84" y="54" font-size="12" font-weight="800" letter-spacing="2.2">EPICKOR.COM</text>
  </g>
  <text x="1038" y="55" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" opacity="0.52">01</text>

  <g>
    <rect x="${540 - kickerWidth / 2}" y="${kickerY}" width="${kickerWidth}" height="38" fill="#111111" fill-opacity="0.34" stroke="${pc}" stroke-width="1"/>
    <text x="540" y="${kickerY + 25}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="16" font-weight="800" fill="${pc}" letter-spacing="1.9">${escapeXml(kickerText)}</text>
    <rect x="502" y="${lineY}" width="76" height="5" fill="${pc}"/>
    ${textBlock(mainLines, { x: 540, y: mainY, size: mainSize, lineHeight: mainLineHeight, weight: 950, fill: '#FFFFFF', shadow: true })}
    ${textBlock(subLines, { x: 540, y: subY, size: subSize, lineHeight: subLineHeight, weight: 650, fill: '#FFFFFF', opacity: 0.86, shadow: true })}
  </g>

  <g opacity="0.58">
    <rect x="895" y="1020" width="149" height="31" fill="#111111" fill-opacity="0.34" stroke="#FFFFFF" stroke-opacity="0.18"/>
    <text x="970" y="1041" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="11" font-weight="800" fill="#FFFFFF" letter-spacing="1.8">EPICKOR.COM</text>
  </g>
</svg>`);

  const img = await sharp(imagePath(card.image))
    .rotate()
    .resize(1080, 1080, { fit: 'cover', position: sharpPosition(card.imagePosition) })
    .png()
    .toBuffer();

  await sharp(img)
    .composite([{ input: overlay, top: 0, left: 0 }])
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
}

const outputDir = findDir(path.join(root, 'output', 'cardnews'), slug);
const scriptPath = path.join(outputDir, 'script.md');
if (!fs.existsSync(scriptPath)) {
  console.error(`Missing script.md: ${scriptPath}`);
  process.exit(1);
}

const card = parseFirstCard(scriptPath);
const outputPath = path.join(outputDir, 'card_01.png');
await renderCover(card, outputPath);
console.log(`Rendered ${path.relative(root, outputPath)}`);

if (mirror) {
  const publicDir = findDir(path.join(root, 'public', 'assets', 'cardnews'), slug);
  if (!fs.existsSync(publicDir)) {
    throw new Error(`Missing public cardnews dir: ${publicDir}`);
  }
  const publicPath = path.join(publicDir, 'card_01.png');
  fs.copyFileSync(outputPath, publicPath);
  console.log(`Mirrored ${path.relative(root, publicPath)}`);
}
