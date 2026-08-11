/**
 * Trim the leading silence off each narration part and pad the same amount back
 * onto the end, so the file duration is unchanged.
 *
 * Why this shape: the qa-audio gate failed all three reels with 0.61-0.70s holes
 * at the part boundaries, against a 0.6s limit. The design gap is only 9 frames
 * (0.30s) — the rest is ElevenLabs' own lead-in padding, 0.11-0.18s per part.
 *
 * Preserving duration matters because every downstream frame number (cut plan,
 * ONS placement, outro, composition length) is already authored against these
 * durations. Shortening the files would cascade through all of it. Word offsets
 * inside each part do move, so alignment is re-run afterwards.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { reelFolder } from '../../../../scripts/lib/reel-dir.mjs';

function leadSilence(file) {
  // silencedetect writes to stderr; execFileSync only returns stdout — the trap
  // recorded in FACTS after a QA gate passed a file with a 10.3s hole.
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file,
    '-af', 'silencedetect=n=-50dB:d=0.05', '-f', 'null', '-'], { encoding: 'utf8' });
  const text = `${r.stdout}${r.stderr}`;
  const lines = text.split('\n');
  // Leading silence only counts if the first detected run starts at 0.
  const startIdx = lines.findIndex((l) => /silence_start: 0(\.0+)?\s*$/.test(l));
  if (startIdx === -1) return 0;
  const endLine = lines.slice(startIdx).find((l) => l.includes('silence_end'));
  if (!endLine) return 0;
  const m = endLine.match(/silence_end:\s*([\d.]+)/);
  return m ? Number(m[1]) : 0;
}

for (const slug of process.argv.slice(2)) {
  const dir = path.join('output', 'reels', reelFolder(slug), 'audio');
  const pub = path.join('public', 'assets', 'reels', slug, 'audio');
  for (const file of fs.readdirSync(dir).filter((f) => /^voice-part-\d+\.mp3$/.test(f))) {
    const src = path.join(dir, file);
    const before = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
      '-of', 'csv=p=0', src]).toString().trim());
    const lead = leadSilence(src);
    if (lead < 0.03) { console.log(`${slug}/${file}  lead ${lead.toFixed(3)}s — left alone`); continue; }

    const tmp = `${src}.trim.mp3`;
    execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error',
      '-ss', lead.toFixed(3), '-i', src,
      '-af', `apad=pad_dur=${lead.toFixed(3)}`, '-t', before.toFixed(3),
      '-c:a', 'libmp3lame', '-b:a', '128k', tmp]);
    fs.renameSync(tmp, src);
    fs.copyFileSync(src, path.join(pub, file));

    const after = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
      '-of', 'csv=p=0', src]).toString().trim());
    console.log(`${slug}/${file}  lead ${lead.toFixed(3)}s trimmed  ${before.toFixed(3)}s -> ${after.toFixed(3)}s`);
  }
  // Alignment must be recomputed: the words inside each part moved earlier.
  fs.rmSync(path.join(dir, 'alignment-part-1.json'), { force: true });
  for (let i = 1; i <= 8; i += 1) fs.rmSync(path.join(dir, `alignment-part-${i}.json`), { force: true });
}
