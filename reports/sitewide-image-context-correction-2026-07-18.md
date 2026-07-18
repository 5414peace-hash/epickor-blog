# Sitewide Image Context Correction — 2026-07-18

## Outcome

- Audited 286 blog posts, including private Blog 161, and 1,040 body-image references.
- Corrected 27 blog posts: `015`, `053`, `075`, `076`, `077`, `125`, `129`, `131`, `161`, `176`, `198`, `201`, `203`, `204`, `205`, `206`, `214`, `241`, `252`, `253`, `254`, `261`, `265`, `276`, `287`, `291`, and `292`.
- Corrected one misleading proxy-style alt in `content/business/samyang-foods-buldak-global-deep-dive.md`.
- Replaced SVG-only, generated, generic, or weak proxy visuals with real topic-specific photography or official first-party raster material. Removed public defensive captions such as “not a specific…”, “general image”, “category illustration”, “stand-in”, and similar AI/source-anxiety wording.
- Preserved original publication dates. Meaningful revisions use `updatedAt: "2026-07-18"`; they were not republished as new posts.

## Correction groups

### First six

`015`, `053`, `075`, `076`, `077`, `125`

- Added direct Mercedes-Benz Studio Seoul, Seoul market, Korean Olympic archery, National Assembly/impeachment, Dongduk protest, and Korean traditional percussion visuals.

### Remaining priority set

`129`, `131`, `176`, `198`, `201`, `203`, `204`, `205`, `206`, `214`, `252`, `253`, `261`, `265`, `291`, `292`

- Replaced generic or generated visuals with subject-specific Dongmyo, WATERBOMB, Korean transport-card, Korea summer, Korea eSIM, official tax-refund, Catchtable, Golfzon, Korean medical-device, and Seoul coin-noraebang material.
- Removed weak comparison/proxy imagery where a direct real visual was already available.

### Additional findings caught by the expanded audit

`161`, `241`, `254`, `276`, `287`

- Replaced private Blog 161's generated/SVG skincare visuals, Blog 241's generated hero, Blog 254's generated hwachae, Blog 276's generated salon scenes, and Blog 287's generated grill scenes.

## Durable prevention

- Added `npm run audit:image-context` through `scripts/audit-image-context.mjs`.
- Added reviewer hard gates for public defensive-caption patterns and SVG-only posts.
- Strengthened `AGENTS.md`, `CLAUDE.md`, and the research, writer, reviewer, and publisher agent instructions.
- New policy: public captions describe what the image directly shows; uncertainty, licensing notes, and source-selection rationale belong only in `image-sources.md`.
- New policy: SVGs may supplement a post but cannot replace real topic evidence when a direct real image is reasonably available.

## Validation

- `npm run audit:image-context -- --include-private`
  - Posts: 286
  - Body images: 1,040
  - Critical: 0
  - High: 0
  - Medium: 0
  - Informational: 118
- `npm run audit:image-refs`
  - Referenced local blog images: 1,180
  - Missing: 0
  - Decode-only paths: 0
  - SVG references: 0
  - Over 400 KB: 0
  - Over 1,200 KB: 0
- `npm run build`
  - Compile: pass
  - TypeScript: pass
  - Static generation: 366/366 pages
- Direct local browser review at 1536 px: `/blog/198`, `/blog/201`, `/blog/205`, `/blog/206`, `/blog/254`, `/blog/276`, `/blog/287`, `/blog/292`.
  - No broken hero images or horizontal overflow.
  - Blog 206's first official guide-cover hero cropped its heading; visual QA caught it, and the hero was changed to the wider official tax-refund shopping graphic before final validation.

## Informational debt, not release blockers

- 109 older posts still lack a dedicated `image-sources.md`. The audit reports these as informational because their current public image references are valid and the missing record alone does not prove a relevance defect.
- Nine business posts contain mixed SVG/raster media. Each has real raster coverage and uses SVG only as a supporting diagram, so these remain informational manual-review items rather than failures.
- `audit:image-sizes` reports 118 legacy unreferenced assets above 400 KB. No currently referenced public-blog image exceeds 400 KB. These unused files can be handled in a separate asset-cleanup task without broad deletion during this correction.

## Release record

- Implementation commit: `aab2173f` (`Fix sitewide image relevance and review gates`)
- Deployment-safety commit: `59d05af9` (`Exclude local caches from Vercel archive`)
- Production deployment: `dpl_HVetyD36ktJ6Rsv9u3rwor8E65v4`
  - URL: `https://epickor-blog-1lybre7be-yhs-projects-5de403d3.vercel.app`
  - Status: Ready
  - Alias: `https://www.epickor.com`
- Public QA passed for `/blog/015`, `/053`, `/075`, `/198`, `/201`, `/205`, `/206`, and `/292`: HTTP 200, new marker present, defensive-caption pattern absent.
- Eight representative production image URLs returned HTTP 200 with the expected nonzero byte sizes.
- `/latest` returned HTTP 200 and remained ordered `307 -> 306 -> 305`; legacy Blog 015 was absent from the recent list, confirming that the correction did not republish old posts.

## Deployment freeze diagnosis

- The first archived deployment attempt was stopped after Node memory exceeded 2 GB.
- Root cause: `.tmp/` contained 9,843 files totaling about 1.87 GB and was missing from `.vercelignore`; `.git/` was also about 2.4 GB.
- Added explicit Vercel exclusions for `.tmp/`, `.git/`, `.vercel/`, `.agents/`, `.codex/`, `.vscode/`, and the local backup folder.
- After exclusion, a normal non-archive upload contained 4,292 files / 407.7 MB, stayed materially lighter, and deployed successfully. Future routine deploys should use `npx vercel --prod --yes`; use `--archive=tgz` only if the file-count limit actually reappears.
