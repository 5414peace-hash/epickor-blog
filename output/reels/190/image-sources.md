# Reels 190 Image Sources

## Root-Cause Correction

- Previous dashboard failure: candidates were reduced to one option per scene while trying to avoid duplicate paths and Wikimedia 429 failures.
- That made the dashboard technically stable but not review-worthy.
- Rebuild rule applied here: every scene now has at least two reviewable options, and motion-card scenes have three distinct design options.

## Source Post Photos

- `/assets/images/posts/190/national-medical-center-seoul.jpg`
  - Source: Wikimedia Commons / parkyongjoo
  - License: CC BY-SA 3.0
  - Use: Scene 1 candidate B
  - Notes: Real Seoul hospital image from the source post.

- `/assets/images/posts/190/ambulance-daehakro-seoul.jpg`
  - Source: Wikimedia Commons / parkyongjoo
  - License: CC BY-SA 3.0
  - Use: Scene 6 candidate A
  - Notes: Real Seoul ambulance with 119 cue.

- `/assets/images/posts/190/emergency-medical-center-seoul.jpg`
  - Source: Wikimedia Commons / parkyongjoo
  - License: CC BY-SA 3.0
  - Use: Scene 3 candidate C
  - Notes: Real emergency center source-post image.

## Cached External Photo

- `/assets/reels/190/candidate-cache/seoul-medical-01.jpg`
  - Source: Wikimedia Commons / Exj
  - License: CC BY-SA 4.0
  - Use: Scene 3 candidate B
  - Notes: Cached locally because Wikimedia started returning 429 during verification.

- `/assets/reels/190/candidate-cache/hongdae-365-pharmacy-visitkorea.jpg`
  - Source: VisitKorea tourism listing image for Hongdae 365 Pharmacy
  - Original URL used for cache: `https://tong.visitkorea.or.kr/cms/resource/81/4018381_image2_1.jpg`
  - Use: Scene 4 candidate A
  - Notes: Real Korean pharmacy storefront with Hangul and English "Pharmacy" signage; replaces the thin pharmacy fallback problem.

- `/assets/reels/190/candidate-cache/pexels-travel-health-essentials-8830710.jpg`
  - Source: Photo by Nataliya Vaitkevich on Pexels
  - Original URL used for cache: `https://images.pexels.com/photos/8830710/pexels-photo-8830710.jpeg?auto=compress&cs=tinysrgb&w=1200`
  - Use: Scene 7 candidate A
  - Notes: Real travel-health flatlay with passport/travel and health items; not Korea-specific, but the scene is a practical prep reminder.

- `/assets/reels/190/candidate-cache/pexels-health-insurance-pills-7163940.jpg`
  - Source: Photo by Leeloo The First on Pexels
  - Original URL used for cache: `https://images.pexels.com/photos/7163940/pexels-photo-7163940.jpeg?auto=compress&cs=tinysrgb&w=1200`
  - Use: Scene 7 candidate B
  - Notes: Strong insurance and medication cue; weaker passport cue.

- `/assets/reels/190/candidate-cache/pexels-passport-travel-docs-32642485.jpg`
  - Source: Photo by DAVE GARCIA on Pexels
  - Original URL used for cache: `https://images.pexels.com/photos/32642485/pexels-photo-32642485.jpeg?auto=compress&cs=tinysrgb&w=1200`
  - Use: Scene 7 candidate C
  - Notes: Strong passport and travel-document cue; weaker medication/allergy cue.

## EpicKor-Owned Generated Photo Candidates

- `/assets/reels/190/generated/health-contact-numbers.png`
  - Use: Scene 1 candidate A
  - Notes: Phone-note visual for 119 / 1330 / 1339. Generated/owned; no personal data.

- `/assets/reels/190/generated/local-clinic-entrance.png`
  - Use: Scene 3 candidate A
  - Notes: Local Korean clinic entrance candidate for "choose the right door."

- `/assets/reels/190/generated/korean-pharmacy-storefront.png`
  - Use: Scene 4 candidate A
  - Notes: Korean 약국-style storefront candidate; added because remote real pharmacy photos were unstable.

- `/assets/reels/190/generated/emergency-center-generated.png`
  - Use: Scene 6 candidate B
  - Notes: Emergency-center alternative if the source ambulance crop feels too street-like.

- `/assets/reels/190/generated/travel-health-prep-flatlay.png`
  - Use: Scene 7 candidate A
  - Notes: Direct insurance/passport/medication/allergy-info match.

- `/assets/reels/190/generated/health-note-flatlay.png`
  - Use: Scene 7 candidate B
  - Notes: Calmer travel-health prep outro alternative.

## EpicKor-Owned Graphic Fallback

- `/assets/reels/190/owned-korean-pharmacy.svg`
  - Use: Scene 4 candidate B
  - Notes: Owned SVG fallback; no longer the only pharmacy option.

## Motion-Card Options

- Scene 2:
  - `motion-card:190-card-save-numbers-menu`
  - `motion-card:190-card-save-numbers-stamp`
  - `motion-card:190-card-save-numbers-receipt`
- Scene 5:
  - `motion-card:190-card-right-door-checklist`
  - `motion-card:190-card-right-door-route`
  - `motion-card:190-card-right-door-menu`

## Official Fact Checks

- VisitKorea emergency situations page checked for `119`, `1330`, and `1339` context.
- KDCA 1339 page checked for public-health call-center support reference.

## Reviewer Notes

- No candidate `src` is repeated inside the rebuilt `visual-candidates.json`.
- No remote image URLs remain in `visual-candidates.json`.
- Generated assets are clearly marked as EpicKor-owned generated photo candidates, not documentary source photos.
