/**
 * Build 1080x1920 media for the batch.
 *
 * Video: crop a 9:16 window out of the landscape source and pan it slowly across
 * the frame, then scale to 1080x1920. Panning is legitimate here (the subject is
 * genuinely moving) and is not the "excessive still-image zoom" the Reels 2.1
 * gate rejects — but it does not add resolution, so the upscale factor is logged.
 *
 * Every proxy is cut length + HANDLE frames so the kit's 16-frame crossfade
 * never runs off the end of the file and drops to black.
 *
 * Stills: blur-cover plates. The kit's objectFit:cover would crop a landscape
 * photo to a central sliver at 9:16, so the photo is fitted whole over a blurred,
 * darkened copy of itself.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const FPS = 30;
const HANDLE = 45;
const W = 1080, H = 1920;

const slug = process.argv[2];
const plan = JSON.parse(fs.readFileSync(`output/reels/${slug}/cut-plan-v01.json`, 'utf8'));
const outDir = path.join('public', 'assets', 'reels', slug, 'media');
fs.mkdirSync(outDir, { recursive: true });

const report = [];

for (const cut of plan) {
  const out = path.join(outDir, `cut-${String(cut.n).padStart(2, '0')}.mp4`);
  const seconds = (cut.len + HANDLE) / FPS;

  if (cut.kind === 'video') {
    const src = `.tmp/clips/${cut.src}.mp4`;
    const probe = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height', '-of', 'csv=p=0', src]).toString().trim().split(',');
    const [sw, sh] = probe.map(Number);
    const cropW = Math.floor((sh * 9) / 16 / 2) * 2;
    const travel = Math.max(0, sw - cropW);
    // Pan across at most 70% of the available travel so the window never slams
    // into the edge and stall visibly at the end of the cut.
    const span = Math.round(travel * 0.7);
    const start = cut.pan === 'left' ? travel - Math.round((travel - span) / 2) : Math.round((travel - span) / 2);
    const dir = cut.pan === 'left' ? -1 : 1;
    const xExpr = `${start}+${dir}*${span}*(t/${seconds.toFixed(3)})`;
    const upscale = W / cropW;

    execFileSync('ffmpeg', [
      '-y', '-hide_banner', '-loglevel', 'error',
      '-ss', String(cut.ss ?? 0), '-i', src,
      '-t', seconds.toFixed(3),
      '-vf', `crop=${cropW}:${sh}:'clip(${xExpr},0,${travel})':0,scale=${W}:${H}:flags=lanczos,fps=${FPS}`,
      '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p',
      out,
    ]);
    report.push({ n: cut.n, kind: 'video', src: cut.src, source: `${sw}x${sh}`, cropW, upscale: +upscale.toFixed(2), seconds: +seconds.toFixed(2) });
  } else {
    /**
     * A wide photo fitted whole into 9:16 leaves the subject as a thin strip
     * between two large blur bands — measured on the first suneung build, where
     * the payoff photograph of the parents occupied about a third of the frame
     * height and read as small. So the source is first cropped to a taller
     * aspect around a focus point, then fitted.
     *
     *   aspect  target w:h of the crop (default 0.80 = 4:5)
     *   focusX  0..1 horizontal centre of the crop  (default 0.5)
     *   focusY  0..1 vertical centre of the crop    (default 0.5)
     *   top     y position of the fitted image      (default centred)
     *
     * Background darkening was -0.16 and made whole frames fail the luma>=60
     * floor: suneung cut 4 measured 36 on the qa-cut sheet, reading as a black
     * void under the subject rather than a plate. Now -0.06.
     */
    const src = cut.src;
    const [sw, sh] = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height', '-of', 'csv=p=0', src]).toString().trim().split(',').map(Number);

    const aspect = cut.aspect ?? 0.80;
    let cw = Math.min(sw, Math.round(sh * aspect));
    let ch = Math.min(sh, Math.round(cw / aspect));
    cw = Math.floor(cw / 2) * 2; ch = Math.floor(ch / 2) * 2;
    const cx = Math.max(0, Math.min(sw - cw, Math.round((sw - cw) * (cut.focusX ?? 0.5))));
    const cy = Math.max(0, Math.min(sh - ch, Math.round((sh - ch) * (cut.focusY ?? 0.5))));

    const fgH = Math.round((W / cw) * ch / 2) * 2;
    const top = cut.top ?? Math.round((H - fgH) / 2);

    execFileSync('ffmpeg', [
      '-y', '-hide_banner', '-loglevel', 'error',
      '-loop', '1', '-i', src, '-t', seconds.toFixed(3),
      '-filter_complex',
      `[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},boxblur=44:2,eq=brightness=-0.06:saturation=0.66[bg];`
      + `[0:v]crop=${cw}:${ch}:${cx}:${cy},scale=${W}:${fgH}:flags=lanczos[fg];`
      + `[bg][fg]overlay=0:${top},fps=${FPS}[v]`,
      '-map', '[v]', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p',
      out,
    ]);
    report.push({
      n: cut.n, kind: 'still', src: path.basename(src), seconds: +seconds.toFixed(2),
      crop: `${cw}x${ch}@${cx},${cy}`, fitted: `${W}x${fgH}`, top,
      coverage: +((fgH / H) * 100).toFixed(0),
    });
  }
  const kb = Math.round(fs.statSync(out).size / 1024);
  const last = report.at(-1);
  console.log(`cut ${String(cut.n).padStart(2)} ${last.kind.padEnd(5)} ${String(last.src).padEnd(38)} ${last.seconds}s ${kb}KB${last.upscale ? `  upscale ${last.upscale}x` : ''}`);
}

fs.writeFileSync(`output/reels/${slug}/media-report.json`, `${JSON.stringify(report, null, 1)}\n`);
