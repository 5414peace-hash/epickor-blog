# Reel 228 Completion Readiness Audit

Date: 2026-06-24

Objective: produce a reviewable final candidate for Blog 228 `Korea Temple Stay Guide 2026`, applying the lessons from Reel 229 and targeting `95+` quality.

## Current Status

- Status in `scenes.json`: `visual_review_pending`
- Real finalized visual manifest: not present
  - `output/reels/228/approved-visuals.json` does not exist.
- Final render: not created yet.
- Reason: representative visual approval is still required before finalizing visuals, generating TTS, building Remotion props, validating render readiness, and rendering the candidate.

## Evidence Already Completed

| Requirement | Evidence | Status |
| --- | --- | --- |
| Source post is public before Reels production | `curl.exe -I https://www.epickor.com/blog/228` returned HTTP `200` earlier in the session and is recorded in `HANDOFF.md`. | Complete |
| Reel 229 lessons applied | Strategy and review notes record: stronger direct images, no duplicate selected source families, Concept 02 thumbnail, caption-safe motion cards, directional motion plan. | Complete |
| Dashboard has enough photo choice depth | `npm.cmd run reels:dashboard-gate -- --slug 228` passed with `25` photo candidates and `25` source families. | Complete |
| Images are Korea/topic relevant | `visual-contact-v1.jpg`, `recommended-storyboard-v2.jpg`, `image-sources.md`; Scene 4 includes direct activity proof: 108 bows and Baru Gongyang. | Complete for dashboard stage |
| Thumbnail Concept 02 prepared | `thumbnail-concept-02-contact-v1.jpg`; Scene 1 overlay is `NOT A / SPA NIGHT`. | Complete for dashboard stage |
| Motion cards prepared | `motion-card-contact-v1.jpg`; Scene 3 has program picker options, Scene 5 has etiquette/checklist options. | Complete for dashboard stage |
| Recommended approval string prepared | `approval-string-recommended.txt` | Complete |
| Recommended selection dry-run | `.tmp/reel228-post-approval-dryrun-check.mjs` passed; output in `post-approval-dryrun-check.json`. | Complete |
| Post-approval execution plan | `post-approval-render-plan.md` | Complete |
| Safety against accidental approval | `.tmp/reel228-apply-recommended-selection.mjs` refuses to run without `--representative-approved`. | Complete |

## Remaining Required Work

These items are not optional if the goal is to produce a real final candidate:

1. Representative approval
   - Approve the dashboard selection manually, or explicitly approve the recommended string:

```text
S1 1:D@50/50 / 2:B@50/50 | S2 1:B@50/50 | S3 A | S4 1:A@50/50 / 2:B@50/50 | S5 A | S6 1:C@50/50 / 2:E@50/50 | S7 1:B@50/50 / 2:C@50/50
```

2. Finalize visual state
   - After approval only:

```powershell
node .tmp\reel228-apply-recommended-selection.mjs --representative-approved
```

3. Generate scene-level TTS
   - Use the commands in `post-approval-render-plan.md`.

4. Prepare assets and Remotion props

```powershell
npm.cmd run reels:prepare-assets -- --slug 228
npm.cmd run reels:props -- --slug 228 --audio-version v001
```

5. Validate, render, and evaluate

```powershell
npm.cmd run reels:validate -- --slug 228 --require-scene-audio
npm.cmd run reels:render -- --slug 228 --version v001 --audio-version v001
npm.cmd run reels:evaluate -- --slug 228 --render output/reels/228/render/epickor-reel-228-v001.mp4 --version v001
```

6. Manual spot checks after render
   - Intro thumbnail: no live subtitle overlap.
   - Scene 3 motion card: caption does not cover program rows.
   - Scene 5 motion card: caption does not cover etiquette rows or footer.
   - Scene 4 activity visuals remain clear.
   - Scene 6 uses directional motion, not only scale-up.
   - Outro shows `More Korean culture guide at` and centered `epicKor.com`.

## Conclusion

Reel 228 is ready for representative visual approval, not yet a final render candidate.

The completion blocker is representative approval of visuals/motion cards. Once approval is given, the render path is prepared and dry-run checked.
