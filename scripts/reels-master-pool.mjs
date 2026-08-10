/**
 * Deduplicated master pool of Korea-verified footage across every gate run.
 *
 * Why: the per-gate counts double-count badly — seoul-park, hanok, namsan-hillside,
 * korea-convenience-store and korea-palace-ceremony all return overlapping generic Seoul
 * footage, so "110 fresh" in one dir and "124" in another are largely the same clips.
 * Deciding a batch off those numbers would repeat the exact mistake the gate results doc
 * warns about: counts lie.
 *
 * Grouping is by what the slug says is IN the frame, not by which query found it.
 */
import fs from 'node:fs';
import path from 'node:path';

const used = new Set();
for (const d of fs.readdirSync('output/reels')) {
  const p = path.join('output/reels', d);
  if (!fs.statSync(p).isDirectory()) continue;
  for (const f of fs.readdirSync(p)) {
    if (!/cut-plan.*\.json|continuity-manifest\.json/.test(f)) continue;
    const s = fs.readFileSync(path.join(p, f), 'utf8');
    for (const m of s.matchAll(/\b(\d{7,8})\b/g)) used.add(m[1]);
  }
}

const pool = new Map();
for (const d of fs.readdirSync('output/footage')) {
  const p = `output/footage/${d}/candidates.json`;
  if (!fs.existsSync(p)) continue;
  for (const c of JSON.parse(fs.readFileSync(p, 'utf8')).candidates) {
    if (!c.korea || used.has(String(c.id)) || c.height < 1080) continue;
    if (!pool.has(c.id)) pool.set(c.id, c);
  }
}

// Subject groups. A clip lands in the FIRST group it matches, so specific beats generic.
const GROUPS = [
  ['ceremony / guard / parade', /guard|ceremon|parade|honor|drum|traditional korean (performance|dance)/],
  ['hanok / village / palace', /hanok|village|palace|pavilion|fortress|temple|traditional korean (house|architec)/],
  ['hanbok / people in costume', /hanbok|costume/],
  ['market / street food', /market|street food|stall|vendor/],
  ['food / cooking', /bbq|grill|noodle|ramen|ramyeon|kimchi|soup|stew|pork|beef|food|cook|dish|restaurant|cafe|coffee/],
  ['han river / park / nature', /river|park|mountain|hiking|forest|beach|cherry blossom|autumn|garden/],
  ['night / neon / nightlife', /night|neon|nightlife|bar |illuminat/],
  ['street / city / transit', /street|city|urban|subway|train|bus|traffic|intersection|skyline|aerial|downtown/],
];

const grouped = new Map(GROUPS.map(([n]) => [n, []]));
grouped.set('unclassified', []);
for (const c of pool.values()) {
  const hit = GROUPS.find(([, re]) => re.test(c.slug));
  grouped.get(hit ? hit[0] : 'unclassified').push(c);
}

console.log(`Deduplicated Korea-verified pool: ${pool.size} clips (unused, >=1080 tall)\n`);
console.log(`${'group'.padEnd(30)} ${'total'.padStart(5)} ${'vert'.padStart(5)} ${'4K+'.padStart(5)} ${'60fps'.padStart(6)}`);
for (const [name, arr] of grouped) {
  if (!arr.length) continue;
  const vert = arr.filter((c) => c.height > c.width).length;
  const uhd = arr.filter((c) => Math.max(c.width, c.height) >= 3840).length;
  const hi = arr.filter((c) => c.fps >= 59).length;
  console.log(`${name.padEnd(30)} ${String(arr.length).padStart(5)} ${String(vert).padStart(5)} ${String(uhd).padStart(5)} ${String(hi).padStart(6)}`);
}

fs.mkdirSync('.tmp/sheets', { recursive: true });
fs.writeFileSync(
  '.tmp/sheets/master-pool.json',
  JSON.stringify({ groups: Object.fromEntries([...grouped].map(([k, v]) => [k, v])) }, null, 1),
);
console.log('\nwrote .tmp/sheets/master-pool.json');
