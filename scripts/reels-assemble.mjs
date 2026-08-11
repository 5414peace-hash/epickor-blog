#!/usr/bin/env node
/**
 * Assemble the two build-time JSON files a Reel composition imports, from the two
 * files a human actually authors: the cut plan and the list of narration starts.
 *
 * Before this existed, remotion-props-v01.json and render-manifest.json were edited
 * by hand. That is how the 2026-08-11 batch shipped a render-manifest whose cuts had
 * no `kind` field, which crashed qa-cut-sheet with an unhelpful `padEnd` of
 * undefined, and how audio durationFrames could silently disagree with the mp3 on
 * disk after a re-record.
 *
 *   node scripts/reels-assemble.mjs props    --slug suneung --starts 10,99,495,794,1073,1213 --duration 1440
 *   node scripts/reels-assemble.mjs manifest --slug suneung
 *
 * `props` measures every mp3 itself, so durations are never stale. `manifest` reads
 * the aligned caption timings, so it must run after align-reel-captions.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { reelFolder } from './lib/reel-dir.mjs';

const FPS = 30;
const mode = process.argv[2];
const args = {};
for (let i = 3; i < process.argv.length; i += 1) {
  if (process.argv[i].startsWith('--')) { args[process.argv[i].slice(2)] = process.argv[i + 1]; i += 1; }
}
/**
 * Spoken form vs written form.
 *
 * The narration script has to spell numbers out or the TTS mispronounces them, and
 * it has to say "epickor dot com" or the voice reads the full stop. But a caption is
 * *read*, not heard, and a reader wants the written form. Alignment is unaffected:
 * these rewrite the display string only, after the word offsets are already fixed.
 *
 * The line drawn here is the ordinary typographic one — years, measurements and
 * large figures take digits; small counts stay as words ("two years", "five hours",
 * "nine hours", "sixty-nine year old"). Order matters: the longest year pattern has
 * to match before its own prefix does.
 */
const CAPTION_FORM = [
  [/\bepickor dot com\b/gi, 'epickor.com'],
  [/\btwenty twenty-one\b/gi, '2021'],
  [/\btwenty thirteen\b/gi, '2013'],
  [/\btwo thousand three\b/gi, '2003'],
  [/\btwo thousand six\b/gi, '2006'],
  [/\btwo thousand eight\b/gi, '2008'],
  [/\bFive point eight kilometres\b/g, '5.8 kilometres'],
  [/\bThree hundred and eighty six billion won\b/g, '386 billion won'],
  [/\bthirty five thousand people\b/g, '35,000 people'],
  [/\bthirty-five minutes\b/g, '35 minutes'],
  [/\btwenty-five minutes\b/g, '25 minutes'],
  [/\babove three kilometres\b/g, 'above 3 kilometres'],
  [/\btwo hundred metres\b/g, '200 metres'],
  [/\babout three degrees\b/g, 'about 3 degrees'],
];

function captionForm(text) {
  return CAPTION_FORM.reduce((s, [pattern, replacement]) => s.replace(pattern, replacement), text);
}

/**
 * Beats that must absorb the next beat, because the aligner's length-based split
 * landed inside a grammatical unit. CLAUDE.md: "never end a card on a word that
 * grammatically requires the next one."
 *
 * Listed explicitly rather than derived, because the general form is not decidable
 * without part-of-speech tagging. The near-miss proves it: "Twenty years ago this
 * exact spot" / "was six lanes of elevated motorway" trips every mechanical rule
 * that catches these three, but it is a subject-then-reveal beat and should stay
 * split. What separates them is whether the first card ends on a complete noun
 * phrase, which a regex cannot tell.
 *
 * `checkBinding()` below prints candidates for the next batch, so this list is
 * maintained from evidence rather than from memory.
 */
const CAPTION_MERGE = new Set([
  "Except the wood you're looking",  // "looking / at"  — phrasal verb split across cards
  'and we wrote all',                // "all / of it"   — quantifier split from its object
  'and what to avoid if you',        // "if you / are"  — subject split from its verb
]);

/** Surfaces beats whose first word binds backwards, for manual judgement. */
function checkBinding(beats) {
  const BIND_BACK = /^(at|of|are|is|was|were|am|been|than)\b/i;
    return beats
    .map((b, i) => (i > 0 && BIND_BACK.test(b.text) && !CAPTION_MERGE.has(beats[i - 1].text)
      ? `      "${beats[i - 1].text}"  +  "${b.text}"` : null))
    .filter(Boolean);
}

const slug = args.slug;
if (!slug || !['props', 'manifest'].includes(mode)) {
  console.error('usage: reels-assemble.mjs <props|manifest> --slug <slug> [--starts a,b,c --duration N]');
  process.exit(1);
}
const dir = path.join('output', 'reels', reelFolder(slug));
const seconds = (file) => Number(execFileSync('ffprobe',
  ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString().trim());

if (mode === 'props') {
  const starts = String(args.starts).split(',').map((n) => Number(n.trim()));
  const durationInFrames = Number(args.duration);
  const audioSegments = starts.map((startFrame, i) => {
    const part = i + 1;
    const file = `voice-part-${part}.mp3`;
    const abs = path.join(dir, 'audio', file);
    if (!fs.existsSync(abs)) throw new Error(`missing ${abs}`);
    const durationSeconds = seconds(abs);
    return {
      part, file, staticFilePath: `audio/${file}`, startFrame,
      durationFrames: Math.round(durationSeconds * FPS), durationSeconds,
    };
  });
  const last = audioSegments.at(-1);
  const narrationEnd = last.startFrame + last.durationFrames;
  if (narrationEnd > durationInFrames) {
    throw new Error(`narration ends at ${narrationEnd} but composition is ${durationInFrames}`);
  }
  // Every boundary, not just the last: a gap wider than the qa-audio limit blocks the
  // render, and finding that out here costs a second instead of a ten-minute render.
  for (let i = 0; i < audioSegments.length - 1; i += 1) {
    const gap = audioSegments[i + 1].startFrame - (audioSegments[i].startFrame + audioSegments[i].durationFrames);
    // A few frames of overlap is normal and harmless: what overlaps is one file's
    // tail padding and the next file's lead padding, both silent. Only a real
    // overlap — where speech could collide — is worth blocking on.
    if (gap < -20) throw new Error(`parts ${i + 1}/${i + 2} overlap by ${-gap} frames`);
    if (gap > 16) console.warn(`  warn: ${gap}-frame gap after part ${i + 1} (${(gap / FPS).toFixed(2)}s) — run reels:gaps`);
  }
  fs.writeFileSync(path.join(dir, 'remotion-props-v01.json'),
    `${JSON.stringify({ slug, fps: FPS, width: 1080, height: 1920, durationInFrames, audioSegments }, null, 1)}\n`);
  console.log(`props: ${audioSegments.length} parts, narration ends ${narrationEnd}, composition ${durationInFrames} (${(durationInFrames / FPS).toFixed(2)}s)`);
} else {
  const plan = JSON.parse(fs.readFileSync(path.join(dir, 'cut-plan-v01.json'), 'utf8'));
  const props = JSON.parse(fs.readFileSync(path.join(dir, 'remotion-props-v01.json'), 'utf8'));
  const timings = JSON.parse(fs.readFileSync(path.join(dir, 'caption-timings-v02.json'), 'utf8'));
  const source = timings.beats ?? timings;
  const rewritten = source
    .filter((b) => captionForm(b.text) !== b.text)
    .map((b) => `      "${b.text}" -> "${captionForm(b.text)}"`);
  if (rewritten.length) console.log(`   caption form rewritten on ${rewritten.length} beat(s):\n${rewritten.join('\n')}`);

  // Merge before rewriting form, so the merge keys match the aligner's own text.
  const beats = [];
  for (let i = 0; i < source.length; i += 1) {
    const b = source[i];
    if (CAPTION_MERGE.has(b.text) && source[i + 1]) {
      const next = source[i + 1];
      console.log(`   merged split phrase: "${b.text}" + "${next.text}"`);
      beats.push({ text: captionForm(`${b.text} ${next.text}`), startFrame: b.startFrame, endFrame: next.endFrame });
      i += 1;
      continue;
    }
    beats.push({ text: captionForm(b.text), startFrame: b.startFrame, endFrame: b.endFrame });
  }
  const binding = checkBinding(source);
  if (binding.length) console.log(`   review these splits by eye (${binding.length}):\n${binding.join('\n')}`);
  for (let i = 0; i < beats.length - 1; i += 1) {
    // libass stacks a caption that is still alive when the next one starts, which is
    // what made captions visibly hop between cuts on 2026-08-04. Enforce here too.
    if (beats[i].endFrame >= beats[i + 1].startFrame) beats[i].endFrame = beats[i + 1].startFrame - 1;
  }
  const covered = plan.reduce((n, c) => n + c.len, 0);
  if (covered !== props.durationInFrames) {
    throw new Error(`cuts cover ${covered} frames, composition is ${props.durationInFrames}`);
  }
  const manifest = {
    slug,
    durationInFrames: props.durationInFrames,
    cuts: plan.map((c) => ({
      n: c.n, from: c.from, len: c.len,
      src: `assets/reels/${slug}/media/cut-${String(c.n).padStart(2, '0')}.mp4`,
      kind: c.kind,
    })),
    beats,
  };
  fs.writeFileSync(path.join(dir, 'render-manifest.json'), `${JSON.stringify(manifest, null, 1)}\n`);
  console.log(`manifest: ${manifest.cuts.length} cuts, ${beats.length} beats, ${manifest.durationInFrames} frames`);
}
