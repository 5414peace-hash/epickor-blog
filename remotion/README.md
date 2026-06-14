# EpicKor Reels Remotion Scaffold

This folder contains the first vertical Reels MVP composition.

## Current MVP

- Generic composition: `EpicKorReel`
- Legacy composition: `EpicKorReel170`
- Source props: `output/reels/170/remotion-props.json`
- Local visual assets: `public/assets/reels/170/`
- Target format: 1080x1920, 30fps

## Flow

1. Finalize visuals in `/reels-review/{slug}`.
2. Download approved visuals:
   `npm run reels:prepare-assets -- --slug {slug}`
3. Generate scene-level ElevenLabs narration, one file per scene:
   `npm.cmd run reels:tts -- --slug {slug} --text output/reels/{slug}/voiceover-v001-scene-01.txt --output narration-v001-scene-01.mp3`
   Repeat for every scene number.
4. Build props with the intended audio version:
   `npm run reels:props -- --slug {slug} --audio-version v001`
5. Validate before render:
   `npm.cmd run reels:validate -- --slug {slug} --require-scene-audio`
6. Render a numbered candidate without overwriting previous files:
   `npm.cmd run reels:render -- --slug {slug} --version v001 --audio-version v001`
7. Evaluate and create contact sheets:
   `npm.cmd run reels:evaluate -- --slug {slug} --render output/reels/{slug}/render/epickor-reel-{slug}-v001.mp4 --version v001`

The generic render helper writes `output/reels/{slug}/render/epickor-reel-{slug}-v###.mp4`.
It also passes `--public-dir public/assets/reels/{slug}` to Remotion so regular renders do not copy the whole project `public/` directory.
If a render command cannot start a child process such as Remotion or Chrome, the helper prints the spawn error before exiting.

Never accept a final render that accidentally falls back to `audio/narration.mp3`, has no audio, or fails caption/narration validation. `170 v011` is a legacy exception that still uses 3 part-audio files; do not copy that workflow into new Reels.

## Motion Cards

- Optional per-Reel manifest: `output/reels/{slug}/motion-cards.json`
- Optional per-Reel template override: `output/reels/{slug}/motion-card-templates.json`
- Default template library: `.claude/skills/reels/motion-card-templates.json`

Motion cards are reviewed in `/reels-review/{slug}` before rendering. They replace the normal center subtitle layer for their scene, use the approved background image plus a black overlay, and should be versioned/reviewed like any other render candidate.

The current reusable template library should keep roughly 10 distinct motion-card families. `radial_burst` and any center-lockup card must use the mid-lower caption placement so synced narration captions do not overlap bottom footer text. Yellow typography beats should render above the active narration caption unless they are final CTA text.

Use explicit text-line arrays for English layout control:

- `headlineLines`
- `subheadLines`
- `footerLines`

Starting with Reels 186, spoken narration captions should use `readable_band` by default. Write caption beats as natural sentence or phrase groups with deliberate `\n` line breaks, and keep every rendered spoken-caption beat to a maximum of two lines.

The current Reels motion-card standard for new work uses two inserts for a normal 35-45 second Reel. Use two distinct information structures, and avoid making both cards look like the same dark panel with color changes. Three motion cards require explicit representative approval for that slug and a note in `HANDOFF.md`.

The confirmed 2026-05-11 candidates are:

- `170 v011`
- `171 v008`
- `172 v008`

Future renders should match their safe-area, exact-caption, approved-motion, and visual-cleanliness standard in the first full pass.

Official Remotion asset rule used here: files live in the project `public/` folder and are referenced through `staticFile()`.
