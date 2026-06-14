#!/usr/bin/env node
/**
 * Generate a frame/second-level evaluation packet for a rendered EpicKor Reel.
 *
 * Usage:
 *   npm run reels:evaluate -- --slug 172 --render output/reels/172/render/epickor-reel-172-v003.mp4 --version v003
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const DEFAULT_FPS = 30;
const CAPTION_LEAD_FRAMES = 6;

const rubric = [
  ['C01', 'Hook Clarity And First 2 Seconds', 8],
  ['C02', 'Narration-Caption Timing', 12],
  ['C03', 'Scene Cut And Audio Boundary Sync', 10],
  ['C04', 'Caption Readability And Phrase Quality', 8],
  ['C05', 'Instagram Mobile Safe Area', 8],
  ['C06', 'Visual-Narration Relevance', 8],
  ['C07', 'Motion-Card Fit And Density', 8],
  ['C08', 'Pacing And Cognitive Load', 8],
  ['C09', 'Visual Continuity, Variety, And Risk', 7],
  ['C10', 'CTA And Brand Finish', 6],
  ['C11', 'Technical Render Integrity', 9],
  ['C12', 'Production Traceability', 8],
];

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i += 1) {
    if (!args[i].startsWith('--')) continue;
    const key = args[i].slice(2);
    const next = args[i + 1];
    if (!next || next.startsWith('--')) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      i += 1;
    }
  }
  return parsed;
}

function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: options.encoding || 'utf8',
    stdio: options.stdio || 'pipe',
    shell: false,
  });
  return result;
}

function runRequired(command, args) {
  const result = run(command, args, { stdio: 'inherit' });
  if (result.error || result.status !== 0) {
    const error = result.error ? `${result.error.name}: ${result.error.message}` : `exit ${result.status}`;
    throw new Error(`${command} ${args.join(' ')} failed: ${error}`);
  }
}

function ffprobeJson(filePath) {
  const result = run('ffprobe', ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', filePath]);
  if (result.error || result.status !== 0) {
    return { error: result.error?.message || result.stderr || 'ffprobe failed' };
  }
  return JSON.parse(result.stdout || '{}');
}

function ratioToNumber(value) {
  const [a, b] = String(value || '').split('/').map(Number);
  if (!Number.isFinite(a)) return null;
  if (!Number.isFinite(b) || b === 0) return a;
  return a / b;
}

function seconds(frame, fps) {
  return frame / fps;
}

function formatTime(value) {
  const total = Math.max(0, Number(value) || 0);
  const minutes = Math.floor(total / 60);
  const secs = total - minutes * 60;
  return `${String(minutes).padStart(2, '0')}:${secs.toFixed(2).padStart(5, '0')}`;
}

function wordCount(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

function safeRelative(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function findLatestRender(slug) {
  const renderDir = path.join(ROOT, 'output', 'reels', slug, 'render');
  if (!fs.existsSync(renderDir)) return null;
  const names = fs.readdirSync(renderDir).filter((name) => name.endsWith('.mp4'));
  const versioned = names
    .map((name) => ({ name, match: name.match(new RegExp(`^epickor-reel-${slug}-v(\\d{3})\\.mp4$`)) }))
    .filter((item) => item.match)
    .sort((a, b) => Number(a.match[1]) - Number(b.match[1]));
  const selected = versioned.at(-1)?.name || names.sort().at(-1);
  return selected ? path.join(renderDir, selected) : null;
}

function getVersion(renderPath, fallback) {
  if (fallback) return fallback;
  const match = path.basename(renderPath).match(/-(v\d{3})\.mp4$/);
  return match?.[1] || 'unversioned';
}

function renderContactSheet(renderPath, outputPath) {
  runRequired('ffmpeg', [
    '-y',
    '-i',
    renderPath,
    '-vf',
    'fps=1/5,scale=216:-1,tile=5x2:padding=8:margin=8:color=white',
    '-frames:v',
    '1',
    '-update',
    '1',
    outputPath,
  ]);
}

function renderSceneGrid(renderPath, outputPath, scenes) {
  const sampleFrames = [];
  for (const scene of scenes) {
    sampleFrames.push(scene.startFrame);
    sampleFrames.push(scene.startFrame + Math.floor(scene.durationFrames / 2));
  }
  const uniqueFrames = [...new Set(sampleFrames.map((frame) => Math.max(0, Math.round(frame))))].sort((a, b) => a - b);
  const columns = Math.min(4, Math.max(1, Math.ceil(Math.sqrt(uniqueFrames.length))));
  const rows = Math.max(1, Math.ceil(uniqueFrames.length / columns));
  const selectExpression = uniqueFrames.map((frame) => `eq(n\\,${frame})`).join('+');
  runRequired('ffmpeg', [
    '-y',
    '-i',
    renderPath,
    '-vf',
    `select=${selectExpression},scale=180:-1,tile=${columns}x${rows}:padding=8:margin=8:color=white`,
    '-frames:v',
    '1',
    '-update',
    '1',
    outputPath,
  ]);
}

function buildSceneTimeline(props, fps) {
  return (props.scenes || []).map((scene) => {
    const captionBeats = scene.captionBeats || [];
    const starts = scene.captionBeatStartFrames || [];
    const captionLeadFrames = Number(scene.captionLeadFrames ?? props.subtitleStyle?.captionLeadFrames ?? CAPTION_LEAD_FRAMES);
    const captions = captionBeats.map((text, index) => {
      const beatStart = starts[index] ?? Math.floor((index / Math.max(captionBeats.length, 1)) * scene.durationFrames);
      const displayFrame = Math.max(0, beatStart - captionLeadFrames);
      const nextStart = starts[index + 1] ?? scene.durationFrames;
      return {
        text,
        words: wordCount(text),
        beatStartFrame: beatStart,
        displayFrame,
        beatStartSeconds: seconds(scene.startFrame + beatStart, fps),
        displaySeconds: seconds(scene.startFrame + displayFrame, fps),
        durationFrames: Math.max(1, nextStart - beatStart),
      };
    });

    return {
      number: scene.number,
      startFrame: scene.startFrame,
      endFrame: scene.startFrame + scene.durationFrames,
      startSeconds: seconds(scene.startFrame, fps),
      endSeconds: seconds(scene.startFrame + scene.durationFrames, fps),
      durationFrames: scene.durationFrames,
      durationSeconds: scene.durationFrames / fps,
      narration: scene.narration,
      motion: scene.motion,
      imageCount: (scene.images || []).length,
      captionLeadFrames: Number.isFinite(captionLeadFrames) ? captionLeadFrames : CAPTION_LEAD_FRAMES,
      captions,
    };
  });
}

function buildMachineFindings({ props, probe, sceneTimeline, renderDuration, renderPath, fps }) {
  const findings = [];
  const streams = probe.streams || [];
  const video = streams.find((stream) => stream.codec_type === 'video');
  const audio = streams.find((stream) => stream.codec_type === 'audio');
  const sceneCount = (props.scenes || []).length;
  const audioSegments = props.audioSegments || [];
  const motionCards = props.motionCards || [];
  const primaryImages = (props.scenes || []).map((scene) => scene.images?.[0]?.staticFilePath).filter(Boolean);
  const duplicateImages = primaryImages.filter((image, index) => primaryImages.indexOf(image) !== index);
  const captionRisks = [];

  for (const scene of sceneTimeline) {
    if (scene.durationSeconds < 2.5) {
      captionRisks.push(`Scene ${scene.number} is short (${scene.durationSeconds.toFixed(2)}s).`);
    }
    if (scene.durationSeconds > 7.0) {
      captionRisks.push(`Scene ${scene.number} is long (${scene.durationSeconds.toFixed(2)}s).`);
    }
    for (const caption of scene.captions) {
      if (caption.words > 7) captionRisks.push(`Scene ${scene.number} caption is long: "${caption.text}" (${caption.words} words).`);
      if (caption.durationFrames < 14) captionRisks.push(`Scene ${scene.number} caption beat may be too fast: "${caption.text}" (${caption.durationFrames} frames).`);
    }
  }

  if (!video) findings.push({ level: 'fail', check: 'video_stream', message: 'No video stream found.' });
  if (!audio) findings.push({ level: 'fail', check: 'audio_stream', message: 'No audio stream found.' });
  if (video && (Number(video.width) !== 1080 || Number(video.height) !== 1920)) {
    findings.push({ level: 'fail', check: 'canvas', message: `Expected 1080x1920, got ${video.width}x${video.height}.` });
  }
  if (video) {
    const actualFps = ratioToNumber(video.avg_frame_rate || video.r_frame_rate);
    if (actualFps && Math.abs(actualFps - fps) > 0.1) {
      findings.push({ level: 'warn', check: 'fps', message: `Expected about ${fps}fps, got ${actualFps.toFixed(2)}fps.` });
    }
  }
  if (renderDuration && props.durationSeconds && Math.abs(renderDuration - props.durationSeconds) > 0.75) {
    findings.push({
      level: 'warn',
      check: 'duration_match',
      message: `Render duration ${renderDuration.toFixed(3)}s differs from props ${Number(props.durationSeconds).toFixed(3)}s.`,
    });
  }
  if (sceneCount > 0 && audioSegments.length !== sceneCount) {
    findings.push({
      level: 'warn',
      check: 'scene_audio',
      message: `Audio segment count is ${audioSegments.length} for ${sceneCount} scenes. Final standard prefers scene-level audio.`,
    });
  }
  if (motionCards.length > 2) {
    findings.push({
      level: 'warn',
      check: 'motion_density',
      message: `Motion-card count is ${motionCards.length}; current new-Reels standard is two inserts unless the representative approved an exception.`,
    });
  }
  if (duplicateImages.length) {
    findings.push({
      level: 'warn',
      check: 'duplicate_primary_visuals',
      message: `Duplicate primary scene visuals: ${[...new Set(duplicateImages)].join(', ')}`,
    });
  }
  for (const risk of captionRisks) {
    findings.push({ level: 'note', check: 'caption_or_scene_pacing', message: risk });
  }
  if (path.basename(renderPath).includes('-v001') && !audioSegments.length) {
    findings.push({
      level: 'fail',
      check: 'silent_candidate_risk',
      message: 'Versioned render appears to have no audio segments in props. Confirm this is not a silent candidate.',
    });
  }

  return findings;
}

function markdownTable(rows) {
  return rows.map((row) => `| ${row.join(' | ')} |`).join('\n');
}

function buildMarkdown({ slug, version, renderPath, props, probe, sceneTimeline, findings, contactPath, sceneGridPath, renderDuration, renderSize }) {
  const video = (probe.streams || []).find((stream) => stream.codec_type === 'video');
  const audio = (probe.streams || []).find((stream) => stream.codec_type === 'audio');
  const leadValues = [...new Set(sceneTimeline.map((scene) => scene.captionLeadFrames ?? CAPTION_LEAD_FRAMES))];
  const captionLeadSummary = leadValues.length === 1 ? `${leadValues[0]} frames` : `${leadValues.join(', ')} frames by scene`;
  const scoreRows = [
    ['Criterion', 'Weight', 'Raw 0-5', 'Weighted', 'Evidence / Rework Agent'],
    ['---', '---:', '---:', '---:', '---'],
    ...rubric.map(([id, label, weight]) => [`${id} ${label}`, String(weight), '', '', '']),
  ];
  const sceneRows = [
    ['Scene', 'Frames', 'Seconds', 'Motion', 'Images', 'Caption Beats'],
    ['---:', '---', '---', '---', '---:', '---:'],
    ...sceneTimeline.map((scene) => [
      String(scene.number),
      `${scene.startFrame}-${scene.endFrame}`,
      `${formatTime(scene.startSeconds)}-${formatTime(scene.endSeconds)}`,
      scene.motion || '',
      String(scene.imageCount),
      String(scene.captions.length),
    ]),
  ];
  const captionRows = [
    ['Scene', 'Display Time', 'Display Frame', 'Beat Start Frame', 'Words', 'Caption'],
    ['---:', '---', '---:', '---:', '---:', '---'],
    ...sceneTimeline.flatMap((scene) =>
      scene.captions.map((caption) => [
        String(scene.number),
        formatTime(caption.displaySeconds),
        String(scene.startFrame + caption.displayFrame),
        String(scene.startFrame + caption.beatStartFrame),
        String(caption.words),
        caption.text,
      ])
    ),
  ];
  const findingRows = [
    ['Level', 'Check', 'Message'],
    ['---', '---', '---'],
    ...(findings.length ? findings : [{ level: 'pass', check: 'machine_checks', message: 'No machine-level findings.' }]).map((finding) => [
      finding.level,
      finding.check,
      finding.message.replace(/\|/g, '/'),
    ]),
  ];

  return `# Reels Evaluation Packet - ${slug} ${version}

## Candidate

- Render: \`${safeRelative(renderPath)}\`
- Props: \`output/reels/${slug}/remotion-props.json\`
- Contact sheet: \`${safeRelative(contactPath)}\`
- Scene grid: \`${safeRelative(sceneGridPath)}\`
- Rubric: \`.claude/skills/reels/evaluation_rubric.md\`

## Render Facts

- Title: ${props.title || ''}
- Duration: ${renderDuration ? `${renderDuration.toFixed(3)}s` : 'unknown'}
- Size: ${renderSize ? `${renderSize} bytes` : 'unknown'}
- Video: ${video ? `${video.codec_name}, ${video.width}x${video.height}, ${video.avg_frame_rate || video.r_frame_rate}` : 'missing'}
- Audio: ${audio ? `${audio.codec_name}, ${audio.sample_rate}Hz, ${audio.channels} channel(s)` : 'missing'}
- Scenes: ${(props.scenes || []).length}
- Audio segments: ${(props.audioSegments || []).length}
- Motion cards: ${(props.motionCards || []).length}
- Caption lead: ${captionLeadSummary}

## Scorecard

Fill this table after visual/watch-through review.

${markdownTable(scoreRows)}

## 대표님 확인용 한국어 요약

평가자가 시청 후 채워야 합니다.

- 점수/판정:
- 한 줄 결론:
- 가장 좋은 점:
- 가장 큰 보완점:
- 호출할 에이전트:
- 다음 액션:

## Decision

- Overall score:
- Band:
- Hard gates:
- Recommendation:

## Scene Timeline

${markdownTable(sceneRows)}

## Caption Timing Timeline

Display time accounts for the configured caption lead in Remotion.

${markdownTable(captionRows)}

## Machine Findings

${markdownTable(findingRows)}

## Required Watch-Through Notes

- First 0-3 seconds:
- Narration/caption naturalness:
- Mobile safe-area/occlusion:
- Motion-card density:
- Visual relevance:
- CTA:

## Rework Calls

Use the call format from \`.claude/agents/reels-evaluation-team/AGENT.md\`.
`;
}

const args = parseArgs();
const slug = String(args.slug || '');
if (!slug || !/^[a-zA-Z0-9_-]+$/.test(slug)) {
  console.error('Usage: --slug {safe-slug} [--render path] [--version v003]');
  process.exit(1);
}

const reelDir = path.join(ROOT, 'output', 'reels', slug);
const propsPath = path.join(reelDir, 'remotion-props.json');
const props = readJson(propsPath);
if (!props) {
  console.error(`Missing props file: ${safeRelative(propsPath)}`);
  process.exit(1);
}

const renderPath = path.resolve(ROOT, String(args.render || findLatestRender(slug) || ''));
if (!renderPath || !fs.existsSync(renderPath)) {
  console.error(`Missing render file: ${args.render || '(latest render not found)'}`);
  process.exit(1);
}

const version = getVersion(renderPath, args.version);
const evalDir = path.join(reelDir, 'evaluation');
fs.mkdirSync(evalDir, { recursive: true });

const probe = ffprobeJson(renderPath);
const renderDuration = Number(probe.format?.duration || 0);
const renderSize = Number(probe.format?.size || 0);
const fps = Number(props.fps || DEFAULT_FPS);
const sceneTimeline = buildSceneTimeline(props, fps);
const contactPath = path.join(evalDir, `contact-${version}.jpg`);
const sceneGridPath = path.join(evalDir, `scene-grid-${version}.jpg`);

renderContactSheet(renderPath, contactPath);
renderSceneGrid(renderPath, sceneGridPath, sceneTimeline);

const findings = buildMachineFindings({ props, probe, sceneTimeline, renderDuration, renderPath, fps });
const evaluation = {
  slug,
  version,
  generatedAt: new Date().toISOString(),
  renderPath: safeRelative(renderPath),
  propsPath: safeRelative(propsPath),
  contactPath: safeRelative(contactPath),
  sceneGridPath: safeRelative(sceneGridPath),
  render: {
    durationSeconds: renderDuration || null,
    sizeBytes: renderSize || null,
    streams: probe.streams || [],
  },
  props: {
    title: props.title,
    durationSeconds: props.durationSeconds,
    durationFrames: props.durationFrames,
    scenes: (props.scenes || []).length,
    audioSegments: (props.audioSegments || []).length,
    motionCards: (props.motionCards || []).length,
  },
  sceneTimeline,
  machineFindings: findings,
  rubric: rubric.map(([id, criterion, weight]) => ({ id, criterion, weight })),
};

const jsonPath = path.join(evalDir, `evaluation-${version}.json`);
const mdPath = path.join(evalDir, `evaluation-${version}.md`);
writeJson(jsonPath, evaluation);
fs.writeFileSync(
  mdPath,
  buildMarkdown({ slug, version, renderPath, props, probe, sceneTimeline, findings, contactPath, sceneGridPath, renderDuration, renderSize }),
  'utf8'
);

console.log(`Saved ${safeRelative(jsonPath)}`);
console.log(`Saved ${safeRelative(mdPath)}`);
console.log(`Saved ${safeRelative(contactPath)}`);
console.log(`Saved ${safeRelative(sceneGridPath)}`);
