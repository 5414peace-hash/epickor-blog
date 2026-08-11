# Remotion Scaffold Plan

Remotion is not installed in this repo yet. The MVP should add it only after visual approval works.

Planned package additions:

- `remotion`
- `@remotion/cli`
- `@remotion/media-utils`

Planned paths:

- `remotion/index.ts`
- `remotion/Root.tsx`
- `remotion/ReelsComposition.tsx`
- `remotion/load-scenes.ts`

Composition inputs:

- `output/reels/{slug}/scenes.json`
- `output/reels/{slug}/approved-visuals.json`
- `output/reels/{slug}/audio/narration.mp3`

Scene rendering model:

- Use `selectedImages` sorted by rank, not only `selectedImage`.
- Split each scene duration across 2-5 ranked images.
- Use `subtitleText` for synced subtitles. `caption` is retained only for backward compatibility.
- Render typography beats from `typographyBeats` as short overlays on top of the normal narration subtitles.
- Keep all Remotion assets under ASCII paths, following the TravelHippo lesson: copy downloaded assets into a Remotion `public/` folder before rendering.

Render command target:

```bash
npm run reels:render -- --slug {slug} --audio-version v005
```

The render helper writes numbered candidate files to `output/reels/{dated-slug}/final/`, such as `EPICKOR_{slug}_01.mp4`, and refuses overwrites.
After representative confirmation, run:

```bash
npm run reels:finalize -- --slug {slug} --candidate 01
```

Finalization leaves `output/reels/{dated-slug}/final/EPICKOR_{slug}.mp4` plus package notes/caption, then removes numbered candidate MP4 files.
It should pass `--public-dir public/assets/reels/{slug}` so Remotion copies only the current Reel assets instead of the full site `public/` directory.

Do not render final video until every scene has one approved visual candidate.
