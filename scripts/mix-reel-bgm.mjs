import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

function parseArgs(argv) {
  const values = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) continue;
    values.set(key.slice(2), argv[index + 1]);
    index += 1;
  }
  return values;
}

function run(binary, args, options = {}) {
  const result = spawnSync(binary, args, {
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
  });
  if (result.status !== 0) {
    const detail = options.capture ? `\n${result.stderr || result.stdout}` : "";
    throw new Error(`${binary} failed with exit code ${result.status}.${detail}`);
  }
  return result.stdout?.trim() ?? "";
}

const args = parseArgs(process.argv.slice(2));
const input = resolve(args.get("input") ?? "");
const bgm = resolve(args.get("bgm") ?? "");
const output = resolve(args.get("output") ?? "");
const musicDb = Number(args.get("music-db") ?? -19);
const voiceDb = Number(args.get("voice-db") ?? 0);
const musicStart = Number(args.get("music-start") ?? 0);
const fadeIn = Number(args.get("fade-in") ?? 0.35);
const fadeOut = Number(args.get("fade-out") ?? 1.1);

for (const [label, file] of [["input", input], ["bgm", bgm]]) {
  if (!file || !existsSync(file)) throw new Error(`Missing ${label} file: ${file}`);
}
if (!output) throw new Error("Missing --output path.");
if (![musicDb, voiceDb, musicStart, fadeIn, fadeOut].every(Number.isFinite)) {
  throw new Error("Invalid numeric mix option.");
}

const duration = Number(run("ffprobe", [
  "-v", "error",
  "-show_entries", "format=duration",
  "-of", "default=noprint_wrappers=1:nokey=1",
  input,
], { capture: true }));

if (!Number.isFinite(duration) || duration <= 0) {
  throw new Error(`Could not read duration from ${input}`);
}

const outFadeStart = Math.max(0, duration - fadeOut).toFixed(3);
const filter = [
  `[0:a]aresample=48000,loudnorm=I=-18:TP=-3:LRA=7,volume=${voiceDb}dB,asplit=2[voice_mix][voice_key]`,
  `[1:a]atrim=start=${musicStart}:duration=${duration.toFixed(3)},asetpts=PTS-STARTPTS,aresample=48000,volume=${musicDb}dB,afade=t=in:st=0:d=${fadeIn},afade=t=out:st=${outFadeStart}:d=${fadeOut}[music]`,
  "[music][voice_key]sidechaincompress=threshold=0.025:ratio=8:attack=15:release=280:makeup=1[ducked]",
  "[voice_mix][ducked]amix=inputs=2:duration=first:dropout_transition=0:normalize=0,alimiter=limit=0.841395:attack=5:release=50[mix]",
].join(";");

run("ffmpeg", [
  "-hide_banner", "-y",
  "-i", input,
  "-stream_loop", "-1", "-i", bgm,
  "-filter_complex", filter,
  "-map", "0:v:0",
  "-map", "[mix]",
  "-c:v", "copy",
  "-c:a", "aac",
  "-b:a", "192k",
  "-ar", "48000",
  "-ac", "2",
  "-t", duration.toFixed(3),
  "-movflags", "+faststart",
  output,
]);

console.log(JSON.stringify({ input, bgm, output, duration, musicDb, voiceDb, musicStart }, null, 2));
