import { bundle } from '@remotion/bundler';
import { selectComposition, renderMedia } from '@remotion/renderer';
import path from 'node:path';

const version = process.argv[2] || 'v001';
const out = path.resolve(`output/reels/2026-08-13_376/epickor-reel-376-${version}.mp4`);

console.log('bundling…');
const serveUrl = await bundle({ entryPoint: path.resolve('remotion/Root.tsx'), onProgress: () => {} });
const composition = await selectComposition({ serveUrl, id: 'Reel376' });
console.log(`composition ${composition.width}x${composition.height} ${composition.fps}fps ${composition.durationInFrames}f`);

let last = -1;
await renderMedia({
  composition,
  serveUrl,
  codec: 'h264',
  outputLocation: out,
  // CLAUDE.md floor is 8 Mbps, 10 for heavy motion. 24 tiles each pushing their own
  // window is heavy motion; reels 296/297 shipped at 3.0-3.6 Mbps and mushed.
  videoBitrate: '14M',
  audioBitrate: '192k',
  x264Preset: 'slow',
  concurrency: 4,
  onProgress: ({ progress }) => {
    const pct = Math.floor(progress * 100);
    if (pct >= last + 10) { last = pct; console.log(`  ${pct}%`); }
  },
});
console.log('done ->', out);
