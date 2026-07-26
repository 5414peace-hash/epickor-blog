# Reel 301 Final Review V02

- Corrected final: `output/final/reels/301/EPICKOR_301_02.mp4`
- Superseded: `EPICKOR_301_01.mp4` must not be uploaded.
- Root cause: Scene 5 required 300 frames but its vendor background contained only 212 frames. Browser-level hard looping reset the footage at global frame 832, creating the visible mid-card blink. Short wipes also failed to fully cover scene cuts.
- Fix: the background is a 423-frame forward/reverse proxy with the duplicated turnaround endpoint removed. The 300-frame scene stays within that file, and `OffthreadVideo` extracts final frames exactly.
- Transition fix: scene wipes now span 21 frames and fully occlude the cut. Scene 2/4/6 video-to-photo changes use 14-20 frame opacity overlap with no opaque background flash.
- Line plan: `BEFORE YOU USE IT` is explicitly one line with `whiteSpace: nowrap`.
- Safe area: the motion card ends at y=1320; the narration-caption exclusion begins at y=1400.
- Technical: 1080x1920, 30fps CFR, H.264/AAC, 40.73s. Silence scan passed.
- QA: continuity manifest passed; full contact sheet and a 12-frame turnaround strip around the former blink point were visually inspected. No reset, flash, black frame, or unplanned line wrap was found.

Result: V02 is the only current upload candidate, pending representative phone playback approval.
