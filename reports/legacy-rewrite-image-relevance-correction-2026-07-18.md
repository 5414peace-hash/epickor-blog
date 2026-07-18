# Legacy rewrite image relevance correction - 2026-07-18

## Reason

After the representative flagged that recently improved legacy posts had passed with too many SVG helper graphics, the image standard was tightened:

- A content/reviewer score is not visual approval.
- Meaningfully rewritten public legacy posts should not rely on SVG helper graphics where a real topic image, owned frame, or reliable external photo can support the section.
- `ogImage` must also be checked, not just Markdown body images.

## Scope corrected

The following 21 public legacy/recently corrected posts now have zero SVG references in Markdown body images and `ogImage`:

`005`, `011`, `014`, `019`, `022`, `032`, `034`, `036`, `038`, `041`, `042`, `048`, `049`, `058`, `061`, `086`, `093`, `162`, `163`, `164`, `165`

Actions:

- Replaced remaining SVG body slots with real raster images or topic-specific owned/video stills.
- Replaced SVG `ogImage` values for `011`, `014`, `041`, and `086`.
- Replaced low-relevance Blog `005` visuals with three rapper/live-stage Pexels photos because the old visuals looked like generic Seoul/hotspot frames rather than Korean hip-hop context.
- Added Pexels/source records where new external images were introduced:
  - `public/assets/images/posts/005/image-sources.md`
  - `public/assets/images/posts/036/image-sources.md`
  - `public/assets/images/posts/041/image-sources.md`
  - `public/assets/images/posts/042/image-sources.md`
  - `public/assets/images/posts/048/image-sources.md`
  - `public/assets/images/posts/061/image-sources.md`
- Converted large referenced PNGs to lighter JPG siblings and updated references where needed.
- Copied Blog `093`'s legacy frame to the safe ASCII filename `ramyeon-bag-cup-video-frame.jpg` to avoid Markdown parsing risk from parentheses in the original filename.

## Verification

- Targeted referenced-image check: pass.
  - 21 scoped posts have `0` SVG references across Markdown body images and `ogImage`.
  - Referenced image files all exist.
  - Referenced image files are all under `400 KB`.
- Visual contact sheet was inspected for the scoped posts. Blog `005` was identified as still too generic after the first pass and was corrected again with hip-hop/live-stage imagery.
- `npm.cmd run audit:seo-aeo` - pass, average `99/100`.
- `npm.cmd run audit:amazon-links` - pass.
- `npm.cmd run build` - pass, 363 static pages.
- `git diff --check` - pass, CRLF warnings only.

## Deployment and public QA

- Implementation commit: `b3058e80` (`Replace legacy rewrite SVG images`) pushed to `origin/master`.
- Vercel deployment: `https://epickor-blog-evs48rq8t-yhs-projects-5de403d3.vercel.app`
- Deployment id: `dpl_H7YvXFq8bv7obgtFSSq58tWC5XKQ`
- Status: Ready and aliased to `https://www.epickor.com`.
- Public QA passed:
  - `/blog/005` contains the three new hip-hop/live-stage image paths and no longer contains `smtm-tv-flywheel.svg`.
  - `/blog/011` contains the new JPG blood-type card paths and no longer contains `korean-blood-type-mbti-map.svg`.
  - `/blog/036` contains the Seoul rainy-street Pexels paths and no longer contains `korea-rainy-season-timeline.svg`.
  - `/blog/042` contains the production/studio camera paths and no longer contains `kdrama-star-economics.svg`.
  - `/blog/061` contains the Asia Culture Center concert paths and no longer contains `korean-concert-crowd-map.svg`.
  - `/blog/093` contains `ramyeon-bag-cup-video-frame.jpg` and no longer contains `bag-vs-cup-ramyeon-choice-map.svg`.
  - All representative replacement image assets returned HTTP 200 from `www.epickor.com`.

## Remaining sitewide SVG notes

Sitewide public posts with body/og SVG references remain at 13 after this correction:

`261`, `265`, `268`, `269`, `270`, `271`, `272`, `273`, `275`, `276`, `283`, `287`, `305`

These are newer posts where SVGs are currently used as one supporting map/logo/diagram alongside multiple raster images, not the older rewrite issue where helper SVGs dominated the article. If the representative wants a strict "no SVG anywhere in article bodies" rule, these should become the next dedicated visual pass.
