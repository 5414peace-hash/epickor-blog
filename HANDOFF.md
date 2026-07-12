# HANDOFF - EpicKor Current Operations

> Fast-start dashboard only. Do not append full session transcripts here.
> Historical detail through 2026-07-11 is preserved in
> `docs/handoff/HANDOFF_ARCHIVE_THROUGH_2026-07-11.md`.

## Start Here (Required Reading Order)

1. Read this file only from top to bottom.
2. Run `git status --short` and `git log -8 --oneline` to confirm the live repository state.
3. Open only the files named under `Active Work`, `Blockers`, or the user's request.
4. Read the latest `output/strategy/week_*.md` only when choosing strategy or the next topic.
5. Search the archive only when a specific slug, decision, incident, or older rule is relevant:
   - `rg -n -i "<slug-or-keyword>" docs/handoff/HANDOFF_ARCHIVE_THROUGH_2026-07-11.md`
   - Read a narrow line range around the match; never load the full archive into context by default.
6. If this dashboard and git history conflict, trust the newer concrete git/file evidence and correct this dashboard.

## Current Snapshot - 2026-07-12

- Latest published normal posts: Blogs `288`-`290` — Korean Pojangmacha, Korean Board Game Cafe, and Seoul Palace Night guides.
- Public URLs: `https://www.epickor.com/blog/288`, `https://www.epickor.com/blog/289`, `https://www.epickor.com/blog/290`.
- Latest published Business post: `COSMAX Deep Dive 2026: The ODM Engine Behind Global K-Beauty`.
- Public Business URL: `https://www.epickor.com/business/cosmax-korean-beauty-odm-deep-dive`.
- Latest published commit: `7eba1772 Fix card news images when optimizer quota is exhausted`; `24ae249e` finalized the second 036/170/287 batch and `7a52ad83` finalized the first 081/288/290 batch plus reusable renderer preset.
- The production deployment containing hotfix `7eba1772` was verified Ready and aliased to `www.epickor.com`; the final Handoff-only follow-up does not change runtime assets.
- No article, Reel, card-news package, or deployment is currently in progress.
- Card-news batch `081`, `288`, and `290` is representative-confirmed: all 21 final 1080x1080 PNGs use the reusable `Seoul After Dark` system; captions, source records, visual reviews, contact sheets, and index rows are ready for representative scheduling. The preset is documented at `.claude/skills/cardnews/seoul_after_dark_style.md` and activates with `style: seoul-after-dark`.
- Second card-news batch `036`, `170`, and `287` is representative-confirmed and live: 21 final 1080x1080 PNGs, captions, source records, visual reviews, high-resolution contact sheets, and batch QA. Visual Fit averages are 98.3/98.6/98.9; batch self-review scores are 97/97/100. Public QA found Vercel image optimization returning 402 after quota exhaustion; hotfix `7eba1772` moved card-news surfaces to direct static images. All three pages return 200 with zero optimizer references, and all 21 public PNGs return 200.
- Existing unrelated dirty worktree files must be preserved. Confirm the exact list with `git status --short` before editing.
- Local master and `origin/master` contain the two batch commits plus the image-quota hotfix; confirm exact divergence before the next publication action.

## Active Work

- Status: none.
- Progress: Blogs 288-290 research, writing, 12-image package, review, commit, deployment, and public verification are 100% complete.
- Review record: `reports/blogs-288-290-review-2026-07-11.md`.
- Social package: first batch `081/288/290` and second batch `036/170/287` are both representative-confirmed and ready for scheduling.

## Blockers / Decisions Needed

- No technical blocker.
- Blog 287 GSC and GA4 results need time to accumulate before performance conclusions.
- Social reuse of Blog 287 requires representative selection and must respect the 3-Reel/3-carousel batch rhythm.
- No blocker for Blogs 288-290. Social production still requires representative selection after public verification, which is now complete.
- No production blocker for card news 081/288/290. Instagram scheduling remains a representative action and should preserve the Tuesday/Wednesday/Thursday three-carousel batch rhythm.

## Next Recommended Work

1. Schedule card news 081/288/290 together on the next Tuesday/Wednesday/Thursday slots. Expected impact: converts one proven GSC topic and two strong new visual guides into Instagram reach. Dependency: representative upload/scheduling action.
2. Keep confirmed 036/170/287 as the next three-carousel scheduling batch after the first upload cycle. Expected impact: extends the revival with seasonal rain, proven PC-bang demand, and affiliate-ready home BBQ. Dependency: representative scheduling action and first-batch performance observation.
3. Hold Blogs 287-290 and COSMAX unchanged while GSC/GA4 data accumulates. Expected impact: preserves clean performance baselines and avoids premature edits. Dependency: 7-14 days of crawl and event volume.

## Standard Blog Production Guardrails

These rules came from the Blog 287 abnormal-duration incident and apply to Strategy, Research, Writer, Reviewer, Marketing, and Publisher work.

- Normal target: 45-90 minutes end to end. Before 120 minutes, stop optional expansion and report the reason for drift.
- Default length: 2,200-2,800 words when intent warrants it; do not expand beyond that without a clear search/editorial reason. Existing Writer minimums still apply.
- Freeze scope before drafting: one keyword brief, one fact pass, one image pass, one editorial revision, and one final build/render/public-check pass.
- Use the minimum image set that passes the project quality rules. Reject unsafe or misleading visuals immediately; stop generating optional variants once the visual gate passes.
- After any pipeline review/private-preview action, run `git fetch origin` and inspect local versus `origin/master`. Repeat immediately before the final publication commit.
- Put essential reverse links into the first final scope. Defer optional cluster expansion instead of causing a second deployment in the same run.
- After a clean build, one rendered-page inspection, one public-page check, one batched asset-path check, and one sitemap check are sufficient unless a failure is found.
- Never weaken required fact/safety checks, affiliate validation, image relevance, rendered-image review, or broken-image checks. Remove duplicated verification and optional polish instead.
- Completion notes must include approximate time by phase when a standard post exceeds 90 minutes.

## Incident Summary - Blog 287 Abnormal Production Time

- Goal elapsed time was about 4h16m; observable file/git work was about 3h27m. Blog 286's comparable path was about 48 minutes.
- Draft and private preview took about 12 minutes, so text generation was not the main cause.
- Primary cause: an overextended quality/polish loop on a 3,843-word article with repeated image, safety, prose, build, render, and public checks.
- Secondary cause: the review pipeline had already committed a private preview remotely, but local master was not synchronized before the first publication commit. Reconciliation and commit reconstruction followed.
- Additional scope: optional reverse links were added after the first deployable state, causing a second deployment/check cycle.
- Contributing friction: browser fallback failures, shell/network waits, and the former 1.15MB Handoff context.
- No evidence supports base-model text generation slowdown as the primary cause. This was mainly scope/orchestration and Git workflow drift.

## Handoff Maintenance Contract

- Keep this file under 250 lines and focused on present state.
- Update the existing snapshot/active/blocker/next sections; do not stack repetitive `Latest Update` entries.
- Put durable operating rules in `CLAUDE.md`, `AGENTS.md`, or the relevant `.claude/agents/*/AGENT.md`, not only here.
- Put long evidence, timelines, superseded status, and completed-session detail in a dated file under `docs/handoff/`.
- When a session materially changes state, add a concise `Recent Change` below (maximum 10 entries), then roll older entries into the dated archive.
- A session close is complete only when this dashboard reflects the real current state and the COO summary in `D:\dev\HANDOFF.md` is updated.

## Recent Change

- 2026-07-12: Public browser QA caught `OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED` on card-news main images despite raw PNG HTTP 200; added `unoptimized` to card-news listing, rail, related cards, carousel slides, and slide thumbnails so the social guides remain visible without Vercel image-optimization quota.
- 2026-07-12: Representative confirmed the second `Seoul After Dark` batch 036/170/287 after 21-card review; web commit/push/deploy authorized.
- 2026-07-12: Representative confirmed all 21 restyled cards in 081/288/290 and approved `Seoul After Dark` for reuse; saved it as the `style: seoul-after-dark` renderer preset with dedicated design-system and quality-standard documentation and committed the scoped batch locally.
- 2026-07-11: Completed card news 081/288/290 with 21 photo-first 1080x1080 cards, captions, source documentation, structural review passes, manual PNG inspection, Visual Fit averages 97.9/98.7/99.0, and index updates; all three await representative scheduling.
- 2026-07-11: Published and publicly verified Blogs 288-290; commit `93cafaee`, Vercel Ready, 12/12 assets HTTP 200, sitemap and three reverse links confirmed, and public browser render passed with zero broken article images.
- 2026-07-11: Representative gave final confirmation for the published COSMAX Business deep dive; no further revision or redeployment is required.
- 2026-07-11: Published and publicly verified the COSMAX Type B-2 company deep dive with seven official images, five Business internal links, two reverse links, two buyer tables, and two affiliate CTAs; commit `05fa20b0` and Vercel deployment Ready.
- 2026-07-11: Committed the Handoff/agent guardrail refactor as `ab3dd487`; audited the next Business company shortlist and recommended COSMAX first, with CJ Olive Young and WEBTOON as later alternatives.
- 2026-07-11: Replaced the 1.15MB rolling Handoff with this fast-start dashboard; archived all prior detail; promoted Blog 287 time-overrun lessons into shared and role-specific operating instructions.

## Agents Involved In This Maintenance

- Card-news 036/170/287 Strategy/Research role: confirmed public source posts, selected the validated second batch, rejected previously used rain IDs, and mapped 21 card messages to unique images.
- Card-news 036/170/287 Writer role: wrote 21 one-message cards plus upload captions and CTA flow.
- Card-news 036/170/287 Image role: sourced 16 local Pexels/post-owned images and generated five Korean-context PC-bang images after generic foreign-looking candidates failed the Korea-context gate.
- Card-news 036/170/287 Reviewer role: ran three structural gates, corrected PC-bang service wording and the BBQ electric-grill mismatch, inspected all 21 rendered cards, and recorded Visual Fit/batch scores.
- Card-news 036/170/287 Publisher/Operations role: synchronized scripts, sources, PNGs, contact sheets, captions, reviews, index rows, and Handoff state; no Instagram upload or scheduling was performed.
- Card-news web QA/Publisher role: verified the production deployment and raw assets, diagnosed the Vercel optimizer 402 in a rendered browser page, implemented the direct-static-image fallback across card-news surfaces, and reran the full production build.
- Card-news 081/288/290 restyle Design/Writer role: translated the selected `Seoul After Dark` cover into a deterministic reusable 21-card system while preserving approved photos and copy.
- Card-news 081/288/290 restyle Reviewer role: ran structural gates, verified dimensions and unique hashes, compared the selected concept with all three covers, and manually inspected all 21 cards in high-resolution contact sheets.
- Card-news 081/288/290 restyle Publisher/Operations role: synchronized final PNGs, scripts, contact sheets, visual-review records, index status, and Handoff documentation; no Instagram upload or scheduling was performed.
- Card-news 081/288/290 Strategy/Research role: confirmed public source-post readiness, selected the approved three-carousel batch, audited the existing index, and mapped Korea-specific visual coverage.
- Card-news 081/288/290 Writer role: wrote 21 one-message cards plus primary/short Instagram captions and save/CTA flow.
- Card-news 081/288/290 Reviewer role: ran structural gates, rejected and replaced weak 081 frames, inspected all rendered contact sheets, verified 1080x1080 output/watermarks/readability, and recorded Visual Fit Scores.
- Card-news 081/288/290 Publisher/Operations role: assembled final public asset folders and updated `CARDNEWS_INDEX.md`; no Instagram upload or scheduling was performed.
- Blogs 288-290 Strategy/Research role: completed semantic duplicate audit, scope freeze, official-source fact plans, current-date checks, and image/source selection.
- Blogs 288-290 Writer role: produced three narrative 2,300-2,400-word English guides with six tables, 18 FAQ answers, six affiliate CTAs, and practical internal-link clusters.
- Blogs 288-290 Reviewer role: completed SEO 100 reviews, manual fact checks, 12-image hash/fit review, full-page desktop/mobile render review, 333-route build verification, and public-page/image/sitemap checks.
- Blogs 288-290 Marketing/Publisher role: validated affiliate attributes, added three reverse links, committed scoped files, pushed master, monitored Vercel to Ready, and verified the public URLs.
- COSMAX Strategy/Research role: completed duplicate audit, B-2 approval framing, official-source fact plan, and official-image selection.
- COSMAX Writer role: wrote the 2,701-word buyer/operator company deep dive, tables, FAQ, CTAs, sources, and five-guide internal-link cluster.
- COSMAX Reviewer role: verified facts, link attributes, official images, duplicate hashes, desktop/mobile render, build output, sitemap, assets, and public reverse links.
- COSMAX Publisher role: committed scoped files, pushed `master`, monitored Vercel to Ready, and verified the public page, hub, sitemap, images, and reverse links.
- Operations/Reviewer role: audited CLAUDE, Handoff history, git timing, and agent instructions; identified that incident lessons had not been promoted into executable role rules.
- Documentation role: created the fast-start/read-on-demand structure and preserved the historical record.
- Strategy/Research/Writer/Reviewer/Marketing/Publisher instruction owners: received scoped production-time, scope-freeze, verification, and Git synchronization rules.
