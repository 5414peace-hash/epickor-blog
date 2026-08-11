# Reel 299 Final Review V02

- Corrected final: `output/final/reels/299/EPICKOR_299_02.mp4`
- Superseded: `EPICKOR_299_01.mp4` must not be uploaded.
- Root cause: Scene 1 used a 79-frame 25fps original that had been converted to a 95-frame 30fps proxy through duplicate-frame cadence, then hard-looped inside a 105-frame scene. The cadence and reset produced visible judder.
- Fix: Scene 1 now uses a reviewed 106-frame 30fps interpolation proxy, and final video extraction uses Remotion `OffthreadVideo`. No selected source is looped.
- Transition fix: scene wipes now span 21 frames, fully occlude the underlying scene cut, and ease in/out. Cross-media replacements use opacity overlap rather than exposing an opaque background flash.
- Line plans: `STILL COOKING`, `KEEPS CHANGING FOOD`, `PAN ≠ SYSTEM`, and `BEFORE THE GRILL PAN` are explicitly locked as semantic units.
- Safe area: information content ends by y=1330; the narration-caption exclusion begins at y=1400.
- Technical: 1080x1920, 30fps CFR, H.264/AAC, 36.84s. Silence scan passed.
- QA: continuity manifest passed; full contact sheet and all six scene boundaries at five-frame windows were visually inspected. No exposed cut, black frame, browser loop reset, or ONS/caption collision was found.

Result: V02 is the only current upload candidate, pending representative phone playback approval.
