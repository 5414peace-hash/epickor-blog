# EpicKor Reels Remotion Scaffold

This folder contains the first vertical Reels MVP composition.

## Current MVP

- Generic composition: `EpicKorReel`
- Legacy composition: `EpicKorReel170`
- Source props: `output/reels/170/remotion-props.json`
- Local visual assets: `public/assets/reels/170/`
- Target format: 1080x1920, 30fps

## Flow

1. Finalize visuals in `/reels-review/170`.
2. Download approved visuals:
   `npm run reels:prepare-assets -- --slug 170`
3. Build Remotion props:
   `npm run reels:props -- --slug 170`
4. Add ElevenLabs keys and voice id, then generate narration:
   `npm run reels:tts -- --slug 170 --text output/reels/170/voiceover.txt`
5. Rebuild props so audio path is included:
   `npm run reels:props -- --slug 170`
6. Render a numbered candidate without overwriting previous files:
   `npm run reels:render -- --slug 170 --audio-version v005`

The generic render helper writes `output/reels/{slug}/render/epickor-reel-{slug}-v###.mp4`.
It also passes `--public-dir public/assets/reels/{slug}` to Remotion so regular renders do not copy the whole project `public/` directory.
If a render command cannot start a child process such as Remotion or Chrome, the helper prints the spawn error before exiting.

## Motion Cards

- Optional per-Reel manifest: `output/reels/{slug}/motion-cards.json`
- Optional per-Reel template override: `output/reels/{slug}/motion-card-templates.json`
- Default template library: `.claude/skills/reels/motion-card-templates.json`

Motion cards are reviewed in `/reels-review/{slug}` before rendering. They replace the normal center subtitle layer for their scene, use the approved background image plus a black overlay, and should be versioned/reviewed like any other render candidate.

Use explicit text-line arrays for English layout control:

- `headlineLines`
- `subheadLines`
- `footerLines`

The accepted Reels 170 motion-card standard uses three inserts: one concept/radial shape, one boxed menu board, and one vertical process/checklist structure. Avoid making all cards look like the same dark panel with color changes.

Official Remotion asset rule used here: files live in the project `public/` folder and are referenced through `staticFile()`.
