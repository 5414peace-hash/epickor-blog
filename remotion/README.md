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

Official Remotion asset rule used here: files live in the project `public/` folder and are referenced through `staticFile()`.
