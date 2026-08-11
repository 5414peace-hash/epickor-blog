# Reel 320 Review — Seoul Observatory Showdown

- Render: `output/final/reels/320/EPICKOR_320_03.mp4` (32.4s, 1080x1920, 30fps, 15.9 Mbps H264)
- Hook: "Wrong tower, wasted night" (mistake), thumbnail direction: Mistake
- Voice lane: female_culture_travel, 7-part scene-level TTS, ElevenLabs forced-alignment captions
- Motion cards: 0

## Revision history

- v1: no actual Lotte World Tower or 63 Building footage (generic Han River B-roll) - rejected.
- v2: added real KOCIS/Korea Times photos of both, but the Lotte Tower photo's auto-crop still cut the tower out of frame - rejected again.
- v3 (2026-07-28, round 3): representative feedback -
  - "three towers" line now shows all 3 towers in a quick reveal (3 sub-cuts: Namsan video, Lotte still, 63 Building still, ~1.5s each) under one persistent headline, instead of one static clip for that whole line.
  - Lotte Tower visibility fixed properly: the source KOCIS photo is a wide landscape with the tower off-center; StillCut's automatic cover-crop was cropping it out entirely depending on the drift animation's end position. Replaced with a manually pre-cropped derivative (ffmpeg crop, centered exactly on the tower's actual pixel position, verified by inspection) so it stays in frame regardless of drift.
  - Material roughly doubled: added a second real Lotte Tower photo (Commons, Teddy Cross, construction-era day shot) and a second/third real 63 Building angle (Korea Times Sky Stage interior + a Commons "view from the observatory" shot), splitting the Lotte and 63 Building fact-cuts into two sub-cuts each instead of one static image per building.
  - ONS headline sized up 1.5x with shortened punch copy + `sub` detail line.
  - added BGM (Monument Music - Chapter Two, representative's own library).
  - Checked for real video of Lotte Tower/63 Building specifically (multiple Pexels searches) - none found; stills remain the correct call for those two buildings given the exhaustive search, per the video-first policy's own fallback order (real video > real photo + motion > generated).

## QA

Frame-checked all 10 sub-cuts individually (not samples), including the 3-way reveal and both reused N Seoul Tower trim points. Lotte Tower now clearly visible and well-composed in every cut it appears in. No text overflow, no caption collisions. Not yet done: full phone playback with sound on/off (representative review step).
