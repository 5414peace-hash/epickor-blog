# EpicKor Reels 2.0 — Autonomous Pilot Operating Contract

Date: 2026-07-12  
Pilot: Blog 293, Korea Decision Guide

## Decision

The strategy is viable only after removing representative choices from the middle of production. The representative should receive one finished MP4 and answer only pass or reject.

## What changed from the original plan

1. The representative does not select three topics for the prototype. The system scores newly published, publicly verified posts and selects one based on decision value, moving-footage feasibility, Korea-context proof, rights risk, and monetization fit.
2. Higgsfield access is not a prerequisite for the first prototype. Rights-cleared stock, owned/article assets, and motion graphics can prove the format; AI video becomes a selective enhancement after the format passes.
3. Source approval is automated through a renderable rights manifest. Unclear rights, reference-only YouTube material, or misleading foreign context are hard failures.
4. The renderer creates 1080p proxies before rendering while retaining source originals and source URLs.
5. Internal QA may reject technically complete MP4s. Only a candidate passing story, motion, proof, sound, mobile-frame, and rights gates is shown to the representative.
6. A representative rejection triggers one scoped revision pass based on the stated reason. It does not reopen topic, script, source, and template approvals individually.

## Autonomous workflow

`public post pool -> topic score -> episode promise -> rights-cleared source manifest -> three-part narration -> scene assembly -> proxy generation -> render -> frame/audio/rights QA -> internal revise or final MP4`

## Representative interface

- Input during production: none.
- Final input: `통과` or `반려: {one short reason}`.
- A passed sample may enter the three-Reel batch, but it is not scheduled alone.

## Pilot evidence

- Final candidate: `output/final/reels/293/EPICKOR_293_04.mp4`
- Rights record: `output/reels/293/source-rights.json`
- Review record: `output/reels/293/review.md`
- Script and autonomy contract: `output/reels/293/script.md`
- Renderer now supports first-class MP4 clips, trim offsets, playback rate, square-centered horizontal exceptions, narration segments, and SFX segments.

## Remaining scale work after a pass

- Automate proxy generation and source-manifest validation.
- Add the same autonomous contract to the review dashboard and render-readiness gate.
- Produce one Visual Explainer and one Mini Mission to complete the three-format batch.
- Prepare two first-three-second variants for each batch Reel before Trial Reels testing.
