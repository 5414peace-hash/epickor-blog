# Reels 185 v004 Review

- Final candidate: `output/reels/185/render/epickor-reel-185-v004.mp4`
- Upload package copy: `output/final/reels/185/EPICKOR_185.mp4`
- Duration: 37.72s
- Format: 1080x1920 H.264 MP4 with AAC stereo audio
- Motion cards: exactly 2, scenes 2 and 6
- Audio: 3 short narration parts, version `v002`
- Caption lead: 12 frames

## Revision From v003

- Increased narration caption lead from 6 frames to 12 frames for Reels 185.
- Added spoken ending: `EpicKor dot com.`
- Regenerated only voiceover part 03 as `narration-v002-part-03.mp3`; parts 01 and 02 were copied from v001 to preserve voice/timing consistency.
- Added `captionLeadFrames` support to Remotion scene props so timing can be tuned per Reel instead of relying only on the old hardcoded 6-frame lead.

## Manual QA

- Render readiness validation passed before rendering.
- Evaluation packet generated: `output/reels/185/evaluation/evaluation-v004.md`, `contact-v004.jpg`, `scene-grid-v004.jpg`.
- Evaluation confirms `Caption lead: 12 frames`.
- Evaluation confirms final caption beat `EpicKor dot com.` in scene 7.
- Visual selection and motion cards are unchanged from v003 and remain approved.

## Decision

- Status: upload-package-ready.
- Supersedes: v003.
- Reason for v004: representative noted captions felt slightly slow and requested spoken `epickor.com` ending.
