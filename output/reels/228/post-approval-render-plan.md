# Reel 228 Post-Approval Render Plan

Do not run these until the representative approves a dashboard selection or explicitly says to proceed with the recommended approval string.

## Recommended Approval String

```text
S1 1:D@50/50 / 2:B@50/50 | S2 1:B@50/50 | S3 A | S4 1:A@50/50 / 2:B@50/50 | S5 A | S6 1:C@50/50 / 2:E@50/50 | S7 1:B@50/50 / 2:C@50/50
```

## If Representative Approves Recommended Selection

1. Apply the recommended ranks and approve motion-card Scene 3 A and Scene 5 A in the dashboard, or use a local finalized manifest only after the representative message is captured.
2. Finalize visual review so `output/reels/228/approved-visuals.json` has `finalizedAt` and `output/reels/228/scenes.json` has `status: "visuals_approved"`.
3. Generate scene-level TTS:

```powershell
npm.cmd run reels:tts -- --slug 228 --text output/reels/228/voice/scene-01.txt --output narration-v001-scene-01.mp3
npm.cmd run reels:tts -- --slug 228 --text output/reels/228/voice/scene-02.txt --output narration-v001-scene-02.mp3
npm.cmd run reels:tts -- --slug 228 --text output/reels/228/voice/scene-03.txt --output narration-v001-scene-03.mp3
npm.cmd run reels:tts -- --slug 228 --text output/reels/228/voice/scene-04.txt --output narration-v001-scene-04.mp3
npm.cmd run reels:tts -- --slug 228 --text output/reels/228/voice/scene-05.txt --output narration-v001-scene-05.mp3
npm.cmd run reels:tts -- --slug 228 --text output/reels/228/voice/scene-06.txt --output narration-v001-scene-06.mp3
npm.cmd run reels:tts -- --slug 228 --text output/reels/228/voice/scene-07.txt --output narration-v001-scene-07.mp3
```

4. Prepare assets and Remotion props:

```powershell
npm.cmd run reels:prepare-assets -- --slug 228
npm.cmd run reels:props -- --slug 228 --audio-version v001
npm.cmd run reels:validate -- --slug 228 --require-scene-audio
```

5. Render and evaluate:

```powershell
npm.cmd run reels:render -- --slug 228 --version v001 --audio-version v001
npm.cmd run reels:evaluate -- --slug 228 --render output/reels/228/render/epickor-reel-228-v001.mp4 --version v001
```

## Required Manual Spot Checks After Render

- Intro thumbnail first frame: `NOT A / SPA NIGHT` must be readable, with no live caption overlap.
- Scene 3 motion card: narration caption must not cover program rows.
- Scene 5 motion card: narration caption must not cover etiquette rows or footer.
- Scene 4 activity images must stay clearly visible and not feel like generic architecture.
- Scene 6 mountain/logistics image should use directional motion, not only scale-up.
- Outro must show `More Korean culture guide at` and centered black-screen `epicKor.com`.
