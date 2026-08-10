/**
 * Predict the narration gaps the qa-audio gate will report, without a 10-minute
 * render. Uses the gate's own threshold (-40dB) to find the first and last
 * audible instant in each part, then measures boundary to boundary on the
 * timeline the props file defines.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const FPS = 30;
const LIMIT = 0.6;

function edges(file) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file,
    '-af', 'silencedetect=n=-40dB:d=0.05', '-f', 'null', '-'], { encoding: 'utf8' });
  const text = `${r.stdout}${r.stderr}`;
  const runs = [];
  let start = null;
  for (const line of text.split('\n')) {
    const s = line.match(/silence_start:\s*(-?[\d.]+)/);
    const e = line.match(/silence_end:\s*([\d.]+)/);
    if (s) start = Number(s[1]);
    if (e && start !== null) { runs.push([Math.max(0, start), Number(e[1])]); start = null; }
  }
  const dur = Number(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
    '-of', 'csv=p=0', file], { encoding: 'utf8' }).stdout.trim());
  if (start !== null) runs.push([Math.max(0, start), dur]);
  const head = runs.find((r) => r[0] <= 0.02);
  const tail = runs.find((r) => Math.abs(r[1] - dur) < 0.05);
  return { dur, firstAudible: head ? head[1] : 0, lastAudible: tail ? tail[0] : dur };
}

for (const slug of process.argv.slice(2)) {
  const props = JSON.parse(fs.readFileSync(`output/reels/${slug}/remotion-props-v01.json`, 'utf8'));
  const segs = props.audioSegments.map((s) => {
    const e = edges(path.join('output', 'reels', slug, 'audio', s.file));
    return { ...s, ...e };
  });
  console.log(`== ${slug}`);
  let worst = 0;
  for (let i = 0; i < segs.length - 1; i += 1) {
    const a = segs[i], b = segs[i + 1];
    const endT = (a.startFrame / FPS) + a.lastAudible;
    const startT = (b.startFrame / FPS) + b.firstAudible;
    const gap = startT - endT;
    worst = Math.max(worst, gap);
    console.log(`   part ${a.part}->${b.part}  ${endT.toFixed(2)}s -> ${startT.toFixed(2)}s  gap ${gap.toFixed(2)}s ${gap > LIMIT ? 'FAIL' : 'ok'}`);
  }
  console.log(`   worst ${worst.toFixed(2)}s (limit ${LIMIT}s)\n`);
}
