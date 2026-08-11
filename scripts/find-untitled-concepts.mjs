#!/usr/bin/env node
/**
 * Find concepts the corpus keeps mentioning but has never given a post to.
 *
 *   node scripts/find-untitled-concepts.mjs            # top 40
 *   node scripts/find-untitled-concepts.mjs --min 4    # seen in >=4 posts
 *   node scripts/find-untitled-concepts.mjs --term 된장 # everything about one term
 *
 * Why this exists
 * ---------------
 * On 2026-08-10 a keyword cycle reported "no new topics exist" and the
 * representative rejected it. The cycle was wrong, and the reason is worth
 * keeping: every seed axis hunted for *new* things — trending products, fresh
 * launches — which is precisely the ground journalists have already worked
 * over. The topics that actually survived came from the opposite direction:
 * scanning what our own 375 posts already talk about, and asking which of those
 * subjects has never been the subject of a post.
 *
 * 된장 turned up in 14 posts and had never been a title; 한옥스테이 in 7; 보쌈 in
 * 7; 족발 in 5. Four posts came out of that, all reviewer 100/100. The method
 * was recorded as reproducible but not written down, so this is that script.
 *
 * How it works
 * ------------
 * The house rule that every Korean noun gets its Hangul alongside it means every
 * subject the corpus discusses leaves a Hangul trace. So: count Hangul terms by
 * how many posts mention them, then romanize each and check whether any post
 * TITLE already contains it. Bodies are Korean-marked; titles are English; the
 * ownership test has to cross that gap, which is why the romanizer is here.
 *
 * What it does NOT do: decide anything. A high mention count means the corpus
 * keeps needing to refer to the thing — it is a seed list, and every seed still
 * owes the romanization check, Two-Curl, the coverage gate, the shape filter and
 * a SERP read (docs/keyword-selection-playbook.md).
 *
 * Verified against known answers: 삼각김밥 -> 336, 된장 -> 373, 족발/보쌈 -> 372,
 * 미역국 -> 021, and 한강라면 -> nothing. Re-run those five after changing the
 * matcher; the first version reported 삼각김밥 as an untitled opportunity and it
 * had been a titled post for weeks.
 */
import fs from 'node:fs';
import path from 'node:path';

const args = {};
for (let i = 2; i < process.argv.length; i += 1) {
  if (process.argv[i].startsWith('--')) { args[process.argv[i].slice(2)] = process.argv[i + 1] ?? true; }
}
const MIN_POSTS = Number(args.min ?? 4);
const TOP = Number(args.top ?? 40);

const DIR = path.join('content', 'blog');
const HANGUL = /[가-힣][가-힣]+/g;

/**
 * Hangul that carries no topic — particles, verbs, and the connective words
 * that show up in every quoted Korean phrase. Counting these would bury the
 * nouns we are looking for.
 */
const STOP = new Set([
  '있는', '없는', '있다', '없다', '하는', '한다', '합니다', '입니다', '이다', '것은', '것이', '그리고',
  '하지만', '때문에', '그래서', '이것', '저것', '여기', '거기', '우리', '당신', '사람', '사람들',
  '한국', '한국어', '한국인', '서울', '부산', '대한민국', '이렇게', '그렇게', '무엇', '어떻게',
  '가장', '정말', '진짜', '조금', '많이', '아주', '너무', '다시', '먼저', '자주', '보통',
  '경우', '이후', '이전', '동안', '통해', '위해', '대한', '관련', '기준', '정도', '수도',
]);

/* ------------------------------------------------------------------ corpus */

const posts = fs.readdirSync(DIR).filter((f) => f.endsWith('.md')).map((f) => {
  const raw = fs.readFileSync(path.join(DIR, f), 'utf8');
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const head = fm ? fm[1] : '';
  const title = (head.match(/^title:\s*(.+)$/m)?.[1] ?? '').replace(/^["']|["']$/g, '').trim();
  const body = fm ? raw.slice(fm[0].length) : raw;
  return { slug: f.replace(/\.md$/, ''), title, body };
});

const titleBlob = posts.map((p) => p.title.toLowerCase()).join(' | ');

/* --------------------------------- 1. how many posts mention each term */

const mentions = new Map();       // hangul -> Set(slug)
for (const p of posts) {
  for (const t of new Set(p.body.match(HANGUL) ?? [])) {
    if (STOP.has(t) || t.length > 8) continue;
    if (!mentions.has(t)) mentions.set(t, new Set());
    mentions.get(t).add(p.slug);
  }
}

/* ------------------- 2. romanize, so Hangul terms can be found in titles */

// Titles are English, so the ownership test has to cross the alphabet. Learning
// each term's handle from the `English (한글)` pairs was tried first and does not
// work: 삼각김밥 has exactly ONE pair in the whole corpus and it is mid-sentence
// lowercase ("counter with a triangle gimbap"), so the tool reported 삼각김밥 as
// untitled while post 336 is titled "Samgak Kimbap (Triangle Kimbap)". Mention
// density fails for the same reason — 336 writes the Hangul once and English
// thereafter, so the owner looks identical to a passing reference.
//
// Revised Romanization is deterministic and needs no corpus, so it is what the
// check runs on.
const CHO = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const JUNG = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
// Finals take their PRONOUNCED value, not their letter-by-letter transliteration:
// in a cluster only one consonant sounds. 닭 is "dak", which is why English writes
// Buldak — spelling it "dalk" made 불닭볶음면 miss 048 "Carbo Buldak Guide".
const JONG = ['', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm', 'l', 'l', 'l', 'p', 'l', 'm', 'p', 'p', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't'];

function romanize(s) {
  let out = '';
  for (const ch of s) {
    const c = ch.codePointAt(0) - 0xac00;
    if (c < 0 || c > 11171) { out += ch; continue; }
    out += CHO[Math.floor(c / 588)] + JUNG[Math.floor((c % 588) / 28)] + JONG[c % 28];
  }
  return out;
}

// One sound, several accepted spellings. Each of these folds cost a wrong answer
// before it was added, so they are listed with the case that found them:
//   stops     kimbap/gimbap, doenjang/toenjang  — Korean stops are unaspirated
//   eo ~ u    ramyeon/Ramyun                    — missed 346 owning 신라면
//   sh ~ s    sinramyeon/Shin Ramyun            — same miss, second cause
//   doubling  tteokboki/Tteokbokki              — missed 311 owning 떡볶이
//   c ~ k     amerikano/Americano               — missed 027 owning 아메리카노
// The affricates are parked on '1' first, so the leftover plain `c` can join the
// k class without dragging ch/j along with it.
const fold = (s) => s.toLowerCase().replace(/[^a-z]/g, '')
  .replace(/sh/g, 's').replace(/eo/g, 'u')
  .replace(/ch/g, '1').replace(/j/g, '1')
  .replace(/[cgk]/g, 'k').replace(/[bp]/g, 'p')
  .replace(/[dt]/g, 't').replace(/[rl]/g, 'l')
  .replace(/(.)\1+/g, '$1');

const foldedTitles = posts.map((p) => ({ slug: p.slug, title: p.title, f: fold(p.title) }));

/* ----------------------------------------- 3. has it ever been a title? */

function owner(term) {
  const key = fold(romanize(term));
  if (key.length < 4) return null;                   // too short to be distinctive
  return foldedTitles.find((t) => t.f.includes(key)) ?? null;
}

/**
 * A title that owns the head of a compound, e.g. 불닭볶음면 against "Carbo Buldak
 * Guide". Reported as a warning rather than treated as ownership: 한강라면 shares
 * its head with 267 "Hangang, Ramen, Chicken, Ice Cups", which is a picnic guide
 * and genuinely does not own the ramyeon machine. Dropping on a head match would
 * hide real openings; ignoring it would re-propose written topics. So: surface it
 * and let the reader judge.
 */
function nearOwner(term) {
  const key = fold(romanize(term));
  for (let cut = key.length - 1; cut >= 6; cut -= 1) {
    const hit = foldedTitles.find((t) => t.f.includes(key.slice(0, cut)));
    if (hit) return { ...hit, matched: key.slice(0, cut) };
  }
  return null;
}

/* -------------------------------- 4. the same question, English-only side */

/**
 * Hangul-marked terms are only half the corpus. Plenty of subjects are written
 * in English throughout and never carry a Korean gloss — chains, apps, brands,
 * imported terms — and those are invisible to the scan above. This finds the
 * Title-Case phrases the posts keep naming but have never given a post to.
 */
function englishRows() {
  // Sentence-initial capitals and heading words masquerade as proper nouns, so
  // require two capitalised words in a row and drop the openers.
  const PHRASE = /\b([A-Z][a-z]{2,}(?:\s+(?:[A-Z][a-z]{2,}|[A-Z]{2,})){1,2})\b/g;
  const LEAD = new Set(['The', 'This', 'That', 'These', 'Those', 'There', 'What', 'When', 'Where', 'Which',
    'Why', 'How', 'But', 'And', 'For', 'Not', 'You', 'Your', 'Its', 'His', 'Her', 'One', 'Two', 'Most',
    'More', 'Some', 'Every', 'Each', 'Both', 'Last', 'Next', 'First', 'Also', 'Even', 'Just', 'Still',
    'They', 'She', 'Korean', 'Korea', 'Seoul', 'Read', 'See', 'Note', 'Source', 'Photo', 'Image', 'Last Updated']);
  const seen = new Map();
  for (const p of posts) {
    const local = new Set();
    for (const m of p.body.matchAll(PHRASE)) {
      let phrase = m[1].trim();
      const words = phrase.split(/\s+/);
      if (LEAD.has(words[0])) { words.shift(); phrase = words.join(' '); }
      if (words.length < 2) continue;
      local.add(phrase);
    }
    for (const phrase of local) {
      if (!seen.has(phrase)) seen.set(phrase, new Set());
      seen.get(phrase).add(p.slug);
    }
  }
  const inTitle = (phrase) => titleBlob.includes(phrase.toLowerCase());
  return [...seen.entries()]
    .map(([phrase, slugs]) => ({ phrase, n: slugs.size, slugs }))
    .filter((r) => r.n >= MIN_POSTS && !inTitle(r.phrase))
    .sort((a, b) => b.n - a.n);
}

/* --------------------------------------------------------------- report */

if (args.english) {
  const rows = englishRows().slice(0, TOP);
  console.log(`${posts.length} posts scanned | ${rows.length} English phrases in >=${MIN_POSTS} posts, never titled\n`);
  console.log('posts  phrase                              seen in');
  for (const r of rows) {
    console.log(`${String(r.n).padStart(4)}   ${r.phrase.padEnd(34)}  ${[...r.slugs].sort().slice(0, 5).join(' ')}`);
  }
  process.exit(0);
}

if (args.term) {
  const term = String(args.term);
  const slugs = [...(mentions.get(term) ?? [])].sort();
  const own = owner(term);
  const near = own ? null : nearOwner(term);
  console.log(`${term} -> ${fold(romanize(term))} | ${slugs.length} post(s) | owned by: ${own ? `${own.slug} "${own.title}"` : 'nothing'}`);
  if (near) console.log(`   near-match on "${near.matched}": ${near.slug} "${near.title}"  <- judge this`);
  for (const s of slugs) {
    const p = posts.find((x) => x.slug === s);
    console.log(`   ${s}  ${p.title.slice(0, 78)}`);
  }
  process.exit(0);
}

const all = [...mentions.entries()].map(([term, slugs]) => ({ term, n: slugs.size, own: owner(term) }));
const owned = all.filter((r) => r.n >= MIN_POSTS && r.own);
const rows = all.filter((r) => r.n >= MIN_POSTS && !r.own).sort((a, b) => b.n - a.n).slice(0, TOP);

console.log(`${posts.length} posts scanned | ${mentions.size} Hangul terms | `
  + `${rows.length} mentioned in >=${MIN_POSTS} posts and never titled\n`);
console.log(`(${owned.length} other frequent terms are already owned by a title and were dropped)
`);
console.log('posts  term        romanized             head-match (judge these)');
for (const r of rows) {
  const near = nearOwner(r.term);
  const note = near ? `~ ${near.slug} "${near.title.slice(0, 44)}"` : [...mentions.get(r.term)].sort().slice(0, 5).join(' ');
  console.log(`${String(r.n).padStart(4)}   ${r.term.padEnd(10)}  ${fold(romanize(r.term)).padEnd(20)}  ${note}`);
}
console.log('\nSeed list only. Every row still owes: romanization check (playbook 4.1b),'
  + '\nTwo-Curl, coverage gate, shape filter, duplicate audit, SERP read.');
