# Reels 190 Reviewer Visual Precheck

## Scope

- Source post: `content/blog/190.md`
- Topic: Korean healthcare for tourists
- Dashboard URL: `http://localhost:4000/reels-review/190`
- Current status: replacement candidates added; representative review required before asset prep, TTS, or render.

## Failure Audit From Rejected Pass

- What failed:
  - The previous dashboard showed only one candidate in too many scenes.
  - Scene 4 relied too much on generated/SVG pharmacy fallbacks instead of a real Korean pharmacy photo.
  - Scene 7 offered generated flatlays but no real-photo alternative.
  - The review note made the dashboard sound approved while the actual review was mostly structural.
- Why the Reviewer Agent did not stop it:
  - Existing checks covered JSON validity, duplicate paths, local asset presence, template support, API/page status, and URL stability.
  - There was no enforced candidate-depth gate before showing the dashboard.
  - Duplicate-risk cleanup was allowed to make the dashboard thinner instead of triggering replacement sourcing.
- Resulting problem:
  - The dashboard was technically stable but not useful enough for representative visual approval.

## Corrective Actions Applied In This Replacement Pass

- Scene 1 now has two distinct hook candidates:
  - generated save-the-numbers thumbnail
  - real National Medical Center Seoul source-post photo
- Scene 4 now uses a real VisitKorea Hongdae 365 Pharmacy photo as the recommended replacement candidate.
- Scene 7 now has three real Pexels alternatives plus one generated fallback:
  - travel-health essentials
  - health insurance and pills
  - passport/travel documents
  - generated full-checklist flatlay fallback
- The rejected pharmacy SVG fallback was removed from the active dashboard.
- No remote image URLs are used inside `visual-candidates.json`; all review candidates are local `/assets` paths.

## Candidate-Depth Audit

| Scene | Type | Candidate Count | Pass? | Notes |
| ---: | --- | ---: | --- | --- |
| 1 | photo-led thumbnail | 2 | PASS | Save-number generated hook + real Korea healthcare alternative |
| 2 | motion-card-led | 3 | PASS | Approved official-number card plus two alternatives |
| 3 | photo-led | 3 | PASS | Approved real emergency-center + generated clinic + cached Seoul medical center |
| 4 | photo-led | 2 | PASS | Real VisitKorea Hongdae pharmacy + generated pharmacy fallback |
| 5 | motion-card-led | 3 | PASS | Approved triage card plus two alternatives |
| 6 | photo-led | 2 | PASS | Approved generated emergency center + real Korean ambulance |
| 7 | photo-led outro | 4 | PASS | Three real Pexels prep photos + one generated exact-checklist fallback |

## Visual Fit Score Draft

- Direct topic fit: 30/30
- Korea/context fit: 23/25
- No misleading/text/watermark risk: 18/20
- Variety/coherence: 15/15
- Rendered mobile quality expectation: 9/10
- Average draft score: 95/100

## Remaining Risks

- Scene 7 real-photo options are practical travel-prep images, not Korea-location photos. This is acceptable only because the narration is about documents, insurance, medication names, and allergy info.
- Scene 4 VisitKorea photo is landscape and needs careful vertical crop during asset prep.
- Scene 1 best thumbnail clarity is still the generated number-save visual; if documentary realism matters more, choose the real NMC or ambulance alternative.

## Structural Gates To Re-run Before Sharing

- JSON parse for `scenes.json`, `motion-cards.json`, and `visual-candidates.json`.
- Same-dashboard candidate duplicate check.
- Local image existence check.
- Remote image URL count check.
- Motion-card template check.
- Local API/page HTTP `200` check.
