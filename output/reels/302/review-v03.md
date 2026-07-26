# Reel 302 Final Review V03

- Corrected final: `output/final/reels/302/EPICKOR_302_03.mp4`
- Superseded: `EPICKOR_302_01.mp4` and `EPICKOR_302_02.mp4` must not be uploaded.
- Playback root cause: Scene 5 trimmed 80 frames from a 319-frame market clip, leaving 239 usable frames for a 300-frame scene. Browser-level hard looping reset the background near global frame 869.
- Playback fix: the card now uses a 637-frame forward/reverse proxy with the duplicated turnaround endpoint removed, leaving 557 usable frames after trim. Final extraction uses `OffthreadVideo`.
- Collision root cause: the prior rule treated caption `bottom` as a fixed safety proxy, but did not reserve the rendered two-line caption's actual top edge. Scene 6 ONS extended into that band.
- Collision fix: Scene 6 image is 780px high at y=150 and the ONS begins at y=950. Content ends by y=1340; the narration-caption exclusion begins at y=1400. A full-resolution frame confirms a clean visual gap.
- Transition fix: video/photo and hotteok/gimbap changes use 20-22 frame opacity overlaps; global wipes span 21 frames and fully occlude scene cuts.
- Line plans: `LAST NIGHT'S SIDES.` is locked to one line; other critical ONS plans are recorded in the continuity manifest.
- Technical: 1080x1920, 30fps CFR, H.264/AAC, 40.70s. Silence scan passed.
- QA: continuity manifest passed; full contact sheet, 12-frame turnaround strip, and full-resolution caption-clearance frame were visually inspected. No reset, flash, unplanned wrap, or ONS/caption collision was found.

Result: V03 is the only current upload candidate, pending representative phone playback approval.
