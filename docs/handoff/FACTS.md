# Verified Facts Ledger

> **Why this file exists.** On 2026-07-26 a whole session was spent concluding "Amazon OneLink
> needs to be set up" — it had already been fully set up. Nothing in the repo recorded that, so
> the work was re-derived from scratch. This file is the cure: **anything checked with your own
> tools goes here immediately**, so the next session reads instead of re-investigating.
>
> **Rules**
> - Only facts **you personally verified** with a tool. Not plans, not guesses, not "probably".
> - Every row carries the date and *how* it was verified. A fact without evidence is a guess.
> - When a fact is disproved, **replace the row and mark it `CORRECTED`** — do not silently delete;
>   the wrong belief is what caused the re-derivation, so future sessions need to see it was wrong.
> - Read this file at session start. It is small on purpose. Keep it that way.
>
> Query it: `node scripts/handoff.mjs facts <domain>` or `node scripts/handoff.mjs find <term>`

---

## amazon

- **2026-07-26 — Global Earning (OneLink) is ALREADY fully configured. There is nothing to set up.**
  Store `epickor2026-20` is enrolled in all 10 countries: US, Canada, UK, Germany, France, Italy,
  Spain, Netherlands, Poland, Sweden.
  *Verified:* `affiliate-program.amazon.com/p/stores/globalStore/countries` read directly.
- **2026-07-26 — Those 10 ARE the entire program. Japan, Australia, India, Mexico, Brazil,
  Singapore, UAE are NOT available.** So no country can be added; "Add countries" links to an
  info page, not a form.
  *Verified:* DOM scan of the Global Earning help page (`amazon.com/b?node=216882793011`).
- **2026-07-26 — The "You have no default tracking IDs configured" warning on
  `/p/stores/oneLinkPreference` is harmless. Do not treat it as a blocker.** The page itself says
  *"Ignore this warning if you have configured your store ID to earn globally"* — which is the case.
  Per-country default tracking IDs only affect reporting granularity.
- **2026-07-26 — Payment method is configured in all 10 countries** (US Citibank ...173).
  *Verified:* `/p/stores/paymentPreferences`.
- **2026-07-26 — CORRECTED: earnings are NOT zero.** Jun 26–Jul 25 2026: **35 clicks, 4 ordered,
  4 shipped, $4.18, conversion 11.43%** — roughly 2-3x the 3-5% industry average. Earlier sessions
  repeatedly claimed "0 orders / funnel broken". **The funnel converts fine; the constraint is
  click volume.** *Verified:* `/p/reporting/earnings`.
- **2026-07-26 — 6 tracking IDs exist:** `epickor2026-20` (generic), `-gear-`, `-books-`,
  `-beauty-`, `-travel-`, `-food-`. Repo usage is **674 generic vs 50 category** links.
  **Do NOT retag until monthly clicks exceed ~300** — splitting 35 clicks across 5 categories
  yields ~7 each and teaches nothing. *Verified:* `/home/account/tag/manage` + repo grep.
- **2026-07-17 — Manually built `amazon.com/dp/{ASIN}?tag={id}` links pass Amazon Link Checker.
  SiteStripe is a convenience, not a requirement.** Do not claim ASIN work is blocked on the
  representative.
- **2026-07-26 — Registered traffic sources on the account:** `epickor.com`,
  `instagram.com/epickorsnippets`, `litt.ly/epickor`. *Verified:* `/home/account/profile/sitelist`.
- **2026-07-26 — Canada tax status is Incomplete** (US is Completed). Representative has ruled this
  **out of scope for now** — do not raise it again until earnings justify it.

## ga4

- **2026-07-26 — GA4 is live and firing.** Measurement ID `G-HH7PM78V3E`, confirmed present in the
  served HTML of `https://www.epickor.com/blog/090`. Source: `lib/analytics-config.ts`.
- **2026-07-26 — `affiliate_amazon_click` sends `content_slug`, `content_type`, `cta_context`,
  `link_path`, `page_path`.** *Source:* `components/AnalyticsEvents.tsx:175`.
- **2026-07-10 — but `content_slug`, `link_path`, `link_text` were deliberately NOT registered as
  GA4 custom dimensions** (high cardinality). Only `cta_context`, `affiliate_domain`, `link_query`,
  `affiliate_tag`, `content_type` are registered. **Unregistered event params are invisible to
  standard reports and the Data API** — so you cannot slice by `content_slug`.
  **Slice by the standard `Page path and screen class` dimension instead**, which GA4 attaches to
  every event automatically. That gives per-post affiliate clicks without registering anything.
  *Source:* `docs/handoff/HANDOFF_ARCHIVE_THROUGH_2026-07-11.md:306-320`.
- **2026-07-26 — CSV export path for per-post affiliate clicks:** GA4 → 탐색(Explore) → 자유 형식 →
  측정기준 `페이지 경로 및 화면 클래스`, 측정항목 `이벤트 수`, 필터 `이벤트 이름 = affiliate_amazon_click`
  → 우측 상단 다운로드 → CSV. Standard 보고서 경로로는 페이지별 분해가 나오지 않는다.
- **2026-07-26 — Google blocks sign-in in any Chrome launched with `--remote-debugging-port`**
  ("브라우저 또는 앱이 안전하지 않을 수 있습니다"). The block is at the *sign-in* step only.
  **Workaround that works:** launch the profile via raw `subprocess.Popen` with **no automation
  flags at all**, have the representative sign in, then relaunch the **same `--user-data-dir`**
  with the debug port — the session cookie persists and CDP attaches to a logged-in GA4.
  Scripts: `scratchpad/ga_login.py` (step 1) → `scratchpad/ga_attach.py` (step 2).
  Profile is `scratchpad/ga-profile`, separate from `meta-profile` so the Amazon session is untouched.

- **2026-07-26 — GA4 data starts ~2026-07-10, so only ~16 days exist.** Whole-property totals:
  **5,688 events, 1,839 page_view, 1,316 users, 7 `affiliate_amazon_click` (4 users).** The 90-day
  and 28-day windows return identical numbers, and the last 7 days hold 46% of pageviews where an
  even 28-day spread would give 25% — both confirm the short history. *Verified:* GA4 이벤트 report.
- **2026-07-26 — The website's affiliate CTR is 0.38%** (7 clicks / 1,839 pageviews ≈ 13/month).
  **This is the actual bottleneck**, and the ratio is robust even though absolute counts are
  undercounted by ad blockers — blockers suppress pageviews and click events alike.
- **2026-07-26 — Most Amazon clicks do NOT come from epickor.com.** GA4 ≈13/month vs Amazon's
  35/month. **Cause found:** the Instagram bio hub `litt.ly/epickor` carries two direct Amazon
  short links (`amzn.to/4bSbotg` "Mud Festival packing checklist", `amzn.to/4k0T839` "Korean food
  and snack picks"). Off-domain, so they earn on Amazon but never fire a GA4 event. That hub also
  carries Coupang Partners and Agoda `cid=1968802` links.
  **Consequence: never treat GA4 affiliate clicks as the site's total Amazon clicks.**
- **2026-07-26 — GA4 cannot yet say which posts convert.** n=7 across 4 users is noise. Revisit once
  the event count passes ~100 (roughly 2026-10 at the current rate).
- **2026-07-26 — GA tag coverage verified on live production**: `/`, `/business`, `/blog/322`,
  `/blog/090` all serve `G-HH7PM78V3E`. No coverage gap; the tracking code in
  `AnalyticsEvents.tsx` correctly matches amazon.com, its subdomains, `amzn.to`, and `tag=`.

## deploy

- **2026-07-26 — `git push` alone deploys. Never run `vercel deploy` manually.** The CLI archive
  upload packs `.tmp/` (11,046 files) and `output/` (5,687) despite `.vercelignore`, producing
  20,230 files, a 45-minute failure, and a jammed queue. Git deploys never see them (both are
  gitignored) and finish in ~3 minutes. Full detail in `CLAUDE.md` → Deployment Operations.

## gsc / strategy

- **2026-07-24 — CTR by query type is the whole ballgame:** definition queries **0.048%**,
  comparison **1.15%**, purchase **2.0%** (42x spread). 10x impressions on the current query mix
  yields only **1.3x clicks**; fixing CTR at flat impressions yields **9.2x**.
  Goal confirmed by the representative: **clicks x10, not impressions x10.**
- **2026-07-26 — Ranking at position 5-9 with zero clicks is a title problem, not a content gap.**
  Fixing the title is far cheaper than a new post. Applied to 175 and 145.
- **2026-07-26 — Statistical guardrail:** at a normal 3% conversion, 0 orders from 42 clicks happens
  **28% of the time**. Do not diagnose the funnel from small samples. (Superseded in substance by
  the real 11.43% figure above, but the reasoning rule still stands.)

## images

- **2026-07-25 — Cross-post duplicate detection must key off the documented Pexels/Unsplash photo
  ID, never SHA-256.** Each post's copy is compressed independently, so byte hashes differ for the
  identical source photo — that is exactly how photo `31925324` reached three posts (192, 239, 318).
  Tool: `node scripts/audit-image-uniqueness.mjs --check-id {id}`.
- **2026-07-26 — The Reels footage gate now applies to blog topics too.** Verify usable imagery
  exists *before* committing to a topic. A K-pop fan gift guide was parked as `blocked_no_imagery`
  rather than illustrated with a plausible-looking substitute.

## instagram / social

- **2026-07-26 — Instagram uploads are representative-managed (~1/day) and leave no repo trace.**
  An empty scheduling record is NOT evidence of an upload stall. Meta Suite's list also does not
  show posts made from the mobile app.
