# Reel 326 Review — Korean Spice Levels

- Render: `output/final/reels/326/EPICKOR_326_05.mp4` (31.8s, 1080x1920, 30fps, 10.5 Mbps H264)
- Hook: "Everyone's scared of this noodle" (myth-bust), thumbnail direction: Mistake
- Voice lane: female_culture_travel, 7-part scene-level TTS, ElevenLabs forced-alignment captions
- Motion cards: 0

## Revision history

- v1: generic international chili/paste stock, no Korean context - rejected.
- v2-v4: replaced with real Korean-specific stills (Buldak product, KOGL gochujang photo, Cheongyang chili); fixed a text-overflow bug on cut 3.
- v5 (2026-07-28, round 3): representative feedback -
  - "an-mapge" mispronounced; respelled to "an-map-gae" for TTS, re-aligned.
  - swapped the low-res Korean greenhouse still for a high-res real harvest photo (Goesan-gun farm, Pexels, hand holding fresh chilis, verified Korea-specific, not reused elsewhere on site).
  - ONS headline text sized up 1.5x; copy shortened to short punch words per cut (e.g. "SCARED" / "VS 8,000" / "5X HOTTER" / "SO MILD"), fuller clause moved into the fixed-size `sub` line to avoid repeating the overflow bug.
  - added BGM (Out of Flux - CHONKLAP, representative's own library, not previously used in a prior Reel).

## QA

Frame-checked all 6 cuts individually at v5. No text overflow, no caption collisions, BGM confirmed present via non-silence check during a narration gap. Not yet done: full phone playback with sound on/off (representative review step).
