#!/usr/bin/env node
/**
 * Build props and render a versioned EpicKor Reel.
 *
 * Usage:
 *   npm run reels:render -- --slug 170 --audio-version v005
 *   npm run reels:render -- --slug 170 --version v006 --skip-props
 *   npm run reels:render -- --slug 170 --audio-version v005 --dry-run
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i += 1) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const next = args[i + 1];
      if (!next || next.startsWith('--')) {
        parsed[key] = true;
      } else {
        parsed[key] = next;
        i += 1;
      }
    }
  }
  return parsed;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: false,
  });

  if (result.error) {
    console.error(`Command failed to start: ${command} ${args.join(' ')}`);
    console.error(`${result.error.name}: ${result.error.message}`);
  }

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function nextVersion(renderDir, slug) {
  if (!fs.existsSync(renderDir)) return 'v001';

  const pattern = new RegExp(`^epickor-reel-${slug}-v(\\d{3})\\.mp4$`);
  const versions = fs.readdirSync(renderDir)
    .map((name) => name.match(pattern)?.[1])
    .filter(Boolean)
    .map((value) => Number(value));
  const next = versions.length ? Math.max(...versions) + 1 : 1;
  return `v${String(next).padStart(3, '0')}`;
}

function stripSlugPublicPrefix(staticFilePath, slug) {
  const normalized = String(staticFilePath || '').replace(/\\/g, '/').replace(/^\/+/, '');
  const prefix = `assets/reels/${slug}/`;
  return normalized.startsWith(prefix) ? normalized.slice(prefix.length) : normalized;
}

function buildRenderProps(props, slug) {
  const cloned = JSON.parse(JSON.stringify(props));

  for (const scene of cloned.scenes || []) {
    for (const image of scene.images || []) {
      image.staticFilePath = stripSlugPublicPrefix(image.staticFilePath, slug);
    }
  }

  if (cloned.audio?.staticFilePath) {
    cloned.audio.staticFilePath = stripSlugPublicPrefix(cloned.audio.staticFilePath, slug);
  }

  for (const segment of cloned.audioSegments || []) {
    segment.staticFilePath = stripSlugPublicPrefix(segment.staticFilePath, slug);
  }

  return cloned;
}

const args = parseArgs();
const slug = args.slug;
const audioVersion = args['audio-version'] || args.audioVersion;
const skipProps = Boolean(args['skip-props']);
const dryRun = Boolean(args['dry-run']);

if (!slug || !/^[a-zA-Z0-9_-]+$/.test(slug)) {
  console.error('Usage: npm run reels:render -- --slug {safe-slug} [--audio-version v005] [--version v006]');
  process.exit(1);
}

const reelDir = path.join(ROOT, 'output', 'reels', slug);
const propsPath = path.join(reelDir, 'remotion-props.json');
const publicDir = path.join(ROOT, 'public', 'assets', 'reels', slug);
const renderDir = path.join(reelDir, 'render');

if (!skipProps) {
  const buildArgs = ['.claude/skills/reels/scripts/build-remotion-props.mjs', '--slug', slug];
  if (audioVersion) buildArgs.push('--audio-version', audioVersion);
  run(process.execPath, buildArgs);
}

if (!fs.existsSync(propsPath)) {
  console.error(`Missing props file: ${path.relative(ROOT, propsPath)}`);
  process.exit(1);
}

if (!fs.existsSync(publicDir)) {
  console.error(`Missing Reel public asset directory: ${path.relative(ROOT, publicDir)}`);
  process.exit(1);
}

fs.mkdirSync(renderDir, { recursive: true });

const version = args.version || nextVersion(renderDir, slug);
if (!/^v\d{3}$/.test(version)) {
  console.error('Version must look like v006.');
  process.exit(1);
}

const outputPath = path.join(renderDir, `epickor-reel-${slug}-${version}.mp4`);
if (fs.existsSync(outputPath)) {
  console.error(`Refusing to overwrite existing render: ${path.relative(ROOT, outputPath)}`);
  process.exit(1);
}

const props = readJson(propsPath);
const renderPropsPath = path.join(reelDir, `remotion-props-render-${version}.json`);
writeJson(renderPropsPath, buildRenderProps(props, slug));

if (dryRun) {
  console.log(`Dry run OK`);
  console.log(`Props: ${path.relative(ROOT, renderPropsPath)}`);
  console.log(`Output: ${path.relative(ROOT, outputPath)}`);
  console.log(`Public dir: ${path.relative(ROOT, publicDir)}`);
  process.exit(0);
}

const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';
run(npxCommand, [
  'remotion',
  'render',
  'remotion/Root.tsx',
  'EpicKorReel',
  outputPath,
  '--props',
  renderPropsPath,
  '--public-dir',
  publicDir,
]);

console.log(`Saved ${path.relative(ROOT, outputPath)}`);
