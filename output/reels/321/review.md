# Reel 321 Review — Korean Fried Chicken Brands Compared

- Render: `output/final/reels/321/EPICKOR_321_04.mp4` (27.8s, 1080x1920, 30fps, 13.9 Mbps H264)
- Hook: "You've been ordering the wrong Korean fried chicken" (mistake), thumbnail direction: Mistake
- Voice lane: female_culture_travel, 7-part scene-level TTS, ElevenLabs forced-alignment captions
- Motion cards: 0

## Revision history

- v1: generic fried chicken under BHC/BBQ/Kyochon labels, no actual brand identity - rejected.
- v2-v3: replaced with real branded photos (BHC Soy Garlic King launch, bb.q official product shot, real Kyochon seasoning packet/logo); first pronunciation fix attempt ("Gyo-chon").
- v4 (2026-07-28, round 3): representative feedback -
  - "Kyochon" still mispronounced; switched the TTS spelling from "Gyo-chon" to "Kyo-chon" (hyphenated K, not G) and re-aligned. On-screen kicker and the later payoff-line caption both show the correct brand spelling "Kyochon"; only the mid-cut spoken-caption line shows the hyphenated phonetic spelling.
  - Caught and fixed a real defect during verification: the bb.q Chicken source promo image has its own baked-in "...PUNCH!" marketing typography that collided visually with the ONS headline ("WHOLE THING? / OLIVE OIL"). Added a dark gradient scrim behind the text block for that one cut so the headline stays legible over the competing text instead of replacing the image.
  - ONS headline sized up 1.5x with shortened punch copy ("WRONG" / "NOT THE SAME" / "BIGGER CHEAPER" / "OLIVE OIL" / "SOY GARLIC") + `sub` detail line.
  - added BGM (The Polarity - Son of a Beach, representative's own library).

## QA

Frame-checked all 6 cuts individually across two render passes (v03 then v04 after the scrim fix). No text overflow. All 3 brand images confirmed clearly legible (BHC signage, bb.q bucket branding, Kyochon packet + honeycomb logo). Not yet done: full phone playback with sound on/off (representative review step).
