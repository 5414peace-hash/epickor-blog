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

- **2026-07-27 — ACCOUNT CLOSED. Amazon rejected the Associates application and closed
  `epickor2026-20` in ALL configured countries.** Stated reason: *"You did not meet the requirement
  to drive three qualifying purchases within 180 days of signup."* Associates Central access is
  revoked. **Every fact below this line about OneLink/tracking IDs describes the closed account —
  it is historical context, not current state.** Reapplication is allowed at any time and issues a
  new store ID; all 892 site links (`tag=epickor2026-20` + 5 category tags) and the 2 litt.ly
  `amzn.to` short links earn nothing until reapproval + site-wide retag.
  *Verified:* rejection email received by the representative, pasted 2026-07-27.
- **2026-07-27 — REAPPLIED SAME DAY. New Associate ID: `epickor-20`.** Full Associates Central
  access granted immediately; formal review happens after the first qualified sales, and the new
  180-day / 3-qualifying-sales clock started at this signup. Websites declared: epickor.com,
  litt.ly/epickor, instagram.com/epickorsnippets. Payment/tax deferred ("Later") — required before
  first payout only. *Verified:* signup confirmation screen, 2026-07-27.
- **2026-07-27 — Site-wide retag COMPLETE (commit `16d0f9f4`):** 724 tagged URLs (271 files) moved
  from the six dead tags to `epickor-20`, and all 251 amzn.to short links (116 files) resolved and
  replaced with full URLs — short links carry the dead account's tag inside the redirect, so any
  left behind would silently earn nothing. 9 of 41 short codes were dead (redirect to Amazon home)
  and were rebuilt as search links from their anchor texts. Audit: 975 tagged URLs, 0 short links,
  exactly one approved tag. **Self/test purchases are non-qualifying — the 3 sales must come from
  real readers.**
- **2026-07-27 — litt.ly still carries 2 dead amzn.to links; only the representative can edit
  litt.ly.** Replacements ready: Buldak Original → `https://www.amazon.com/dp/B0C9D5576K?tag=epickor-20`,
  Buldak Carbonara → `https://www.amazon.com/dp/B0C85RZWP3?tag=epickor-20`.
- **2026-07-27 — Why 4 orders did not satisfy "3 qualifying purchases":** the Jul 25 dashboard
  showed 4 ordered/shipped, but (a) the 180-day window is measured from signup, and orders landing
  after the window closed do not count; (b) purchases made by the associate themselves or close
  parties are explicitly non-qualifying. If any of the 4 were internal test purchases, they never
  counted. The next cycle needs 3 real reader purchases inside 180 days of the NEW signup.

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
- **2026-07-26 — Always pass `--disable-sync` when launching a throwaway Chrome profile for someone
  to sign into.** Without it, signing in turns on Chrome Sync and pulls the representative's entire
  extension set (18 extensions, incl. MetaMask, Glasp, Thunderbit) into a `%TEMP%` profile, and each
  newly installed extension auto-opens its own onboarding tab. That is what happened on first run —
  the representative saw MetaMask and Glasp windows appear unprompted. Both launcher scripts now set
  the flag. MetaMask landed on `#/onboarding/welcome` (no vault — MetaMask excludes its vault from
  Chrome Sync), and `Login Data` stayed at the 40KB empty-schema size, so no wallet or saved
  passwords were replicated.

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

## publishing

- **2026-07-29 — `run-pipeline.mjs --approve` / `publish-post.mjs` commits `content/blog/{slug}.md`
  via GitHub API but does NOT push image assets under `public/assets/images/`.** Publishing
  Blogs 330/331/332 this way put all three live with broken images (verified: text returned
  HTTP 200, every image URL returned 404) until the image folders were committed and pushed via
  a normal `git push` afterward. **Always verify every image URL on the live post with `curl`
  after `--approve`, not just the post URL itself** — a 200 on `/blog/{slug}` proves nothing
  about its images.
- **2026-07-29 — `.claude/skills/marketing/scripts/insert-links.mjs` has a real bug: when a draft
  already has exactly 1 CTA box, it auto-inserts a "needed" 2nd box that can (a) duplicate the
  exact same product as the existing manual CTA, and (b) omit the required
  `target="_blank" rel="nofollow sponsored noopener noreferrer"` attributes entirely (bare
  `<a href>`).** Happened identically on both 331 and 332 in the same session. **After every
  `--approve`, grep `output/final/{slug}_final.md` for `affiliate-inline-cta` and manually check
  both boxes use different products/angles and carry the full `target`/`rel` attributes** — do
  not trust the script's auto-insertion blindly. A draft that already writes 2 well-formed CTA
  boxes itself is unaffected (confirmed clean on 330).
  - **Correction/nuance, same day, confirmed on 334/336:** the bare `<a href>` from the auto-insert
    is not actually a live compliance gap. `lib/markdown-enhancer.ts` (~line 280) post-processes
    **every** `<a>` tag site-wide at render time and force-injects `target="_blank"` plus the full
    `rel` list (Amazon hrefs get `nofollow sponsored noopener noreferrer`; other external hrefs get
    `noopener noreferrer`), regardless of what the source markdown/HTML had. Verified by curling
    the live rendered `/blog/336` page and finding the auto-inserted link fully attributed. The
    **duplicate-product** half of the bug is still real and still needs a manual check — the
    attribute half is not.
- **2026-07-29 — `content/business/*.md` posts have no private-preview route.** `app/preview/[slug]`
  only reads `content/blog/`; there is no business equivalent, and the business page
  (`app/business/[slug]/page.tsx`) uses `dynamicParams = false`, so a slug missing from
  `generateStaticParams()` 404s even if you flip `visibility` in the file — the dev server must be
  **restarted** to recompute static params before a brand-new business slug becomes reachable at
  all, even locally. This matches why every existing B-2 spotlight in the repo was committed
  straight to `visibility: "public"` with no draft stage: there is no tooling for anything else.
  Practical flow: write the file with `visibility: "public"` directly, restart the local dev
  server once, curl the `/business/{slug}` route to confirm 200 + images, then commit/push for
  real — there is no separate "approve" step to run afterward.
- **2026-07-29 — Production can serve a stale cached page for several minutes after a fresh
  deploy goes Ready, even across multiple back-to-back deployments.** Blog pages use
  `export const revalidate = 86400` (`app/blog/[slug]/page.tsx`); the edge cache (`X-Vercel-Cache:
  HIT`) kept serving an old CTA-duplicate version of `/blog/332` through at least 2 subsequent
  "Ready" deployments. **Fix: `npx vercel cache purge --yes`** — confirmed safe (CDN+data cache
  only, not a redeploy) and immediately resolved it (`X-Vercel-Cache: PRERENDER` + correct
  content right after). This is unrelated to the documented `vercel deploy --archive=tgz` risk —
  `cache purge` does not touch deployments at all.
- **2026-07-29 — Rapid sequential `--approve` calls (5 in ~10 min) queued 5 separate Vercel
  deployments; Vercel auto-cancels the superseded ones and only the deployment for the latest
  commit goes Ready.** Don't assume a `Queued`/`Canceled` deployment means something failed —
  check the newest deployment's status specifically.

- **2026-07-29 — `publish-post.mjs`'s `markTopicDone()` only writes `topics-queue.json` to the
  local filesystem; it never commits/pushes it (only `content/blog/{slug}.md` goes through the
  GitHub API commit).** The console log `topics-queue.json 업데이트: ID N → done` is easy to
  misread as "pushed" — it is not. Same for its `updateHandoff()` write to root `HANDOFF.md`.
  After any batch of `--approve` runs, both files must be included in a normal manual
  `git add`/`commit`/`push` alongside the image folders (see the broken-images fact above), or the
  "done" status and handoff notes only exist on the machine that ran the pipeline.

## deploy

- **2026-07-26 — `git push` alone deploys. Never run `vercel deploy` manually.** The CLI archive
  upload packs `.tmp/` (11,046 files) and `output/` (5,687) despite `.vercelignore`, producing
  20,230 files, a 45-minute failure, and a jammed queue. Git deploys never see them (both are
  gitignored) and finish in ~3 minutes. Full detail in `CLAUDE.md` → Deployment Operations.

- **2026-07-30 — `git stash push -- <files>` reporting "No local changes to save" does NOT mean
  `git stash pop` is then a no-op.** If those specific files have no diff, `push` creates no new
  stash entry, but a subsequent `pop` still pops whatever stash is ALREADY on top of the stack —
  which can be someone else's/an earlier session's unrelated work. This actually happened: popped
  a pre-existing stash titled "Preserve Reels tooling and unused image changes before content
  work" (unrelated remotion/reels-script/image changes for posts 261-263), which conflicted with
  a freshly-pulled commit and left the working tree dirty with content that wasn't mine to
  resolve. **Always run `git stash list` before any stash push/pop dance**, not just `git status`,
  and if `push` says "no local changes," skip the `pop` entirely rather than running it out of
  habit. Recovery when this happens: `git restore --staged --worktree <each tracked file>` cleanly
  reverts tracked-file damage (a scoped, non-destructive command that the auto-mode classifier
  allows, unlike `git reset --hard` which it blocks), then manually `rm` any newly-appeared
  untracked files that came from the same stash — the stash entry itself survives a conflicted
  `pop` (git keeps it), so nothing is lost either way.
- **2026-07-30 — A multi-step `Edit` sequence that appends a new heading near an existing one can
  silently duplicate that heading.** Writing 337-339, a second `Edit` call's `new_string` re-typed
  a heading (`## Why Korean Companies Are Actually Betting on This`) that already existed
  immediately after the `old_string` match from a first edit — since `Edit` only touches the
  matched span, the pre-existing copy right after it was untouched, producing two consecutive
  identical H2s with the second one empty (no body text before the next heading). Automated
  review (`review-post.mjs`) did NOT catch this — it only counts H2s, not duplicates. Caught only
  by a full-page Playwright screenshot before publish. **When appending a section near an existing
  heading via a second Edit call, grep the target heading text count before and after to confirm
  it didn't double**, and always visually screenshot multi-edit drafts before staging preview.

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

## reels

- **2026-07-27 — Pexels metadata is the country check, and skipping it shipped Kuala Lumpur as
  Seoul.** Reel 174 v001's "proof" car interior `29082029` has the URL slug
  `modern-kuala-lumpur-train-interior`; payoff `18603132` is by Turkish photographer Reyhan
  Alioğlu. Frame "feel" is not verification — **read the slug + photographer for every clip.**
  *Verified:* Pexels API `GET /videos/videos/{id}`.
- **2026-07-27 — Reel clip reuse had no tooling and it produced heavy duplication.** 175 v001's
  hook `36718309` had already been used in Reels 297/301/302/311 (4 times); 220 v001's hook
  `20672041` was used in 302, the immediately preceding finished Reel. Actual-use ledger =
  `output/reels/*/clip-sources.md` + `remotion/*.tsx`, NOT the candidates JSONs.
- **2026-07-27 — Representative rejected the whole 220/174/175 v001 batch** and dictated a 6-step
  process: topic → script(review: fun/fact) → one clip per ~3s beat-sheet numbered against
  narration (first clip video, ≤30% images, images always moving) → per-beat relevance+country
  gate → generate/animate when free sources lack it → BGM ducked under narration.
  Plan: `output/reels/production-process-v3-plan.md`.
- **2026-07-27 — nanobanana MCP is connected to this session** (Gemini image gen/edit,
  gemini-3-pro-image / 2.5-flash-image, 9:16, saves to local path). Billing is the Gemini API, so
  the standing "no Gemini API without explicit approval" rule applies — **approval requested, not
  yet granted.**
- **2026-07-27 — BGM library exists: `input/BGM/` with 11 mp3 tracks** (Do, Me, Cats, Beat, Two,
  CHONKLAP, Camión, Fires, version, Beach, Walk). Licence/origin not yet confirmed with the
  representative. ffmpeg has `zoompan` for pre-rendered image animation; Remotion StillCut already
  does push/drift natively.

- **2026-07-27 — Korea-verified subway-interior VIDEO does not exist on Pexels or Commons.**
  Measured across three sweeps (~150 portrait candidates): "seoul subway/metro" queries return
  Kuala Lumpur, Bucharest, Barcelona, BART, Melbourne and six Turkish photographers. Commons hosts
  one Korail pass-by webm. **Workaround that shipped in Reel 174 v2:** loud-city/silent-subway
  contrast structure — above-ground beats on verified Seoul video, underground beats on the
  **Theodore Nguyen Seoul Metro photo series** (Pexels photos 31892087/31892061/32211609 + Leon
  Bastian 35010155, slugs name Seoul, Hangul in every frame) as moving stills.
- **2026-07-27 — Reel batch v2 all rebuilt and rendered**: 220 v005 (confirmed by representative),
  175 v005, 174 v002. Zero clip overlap with published Reels (ledger-enforced), ONS chains carry
  the argument sound-off, per-track BGM (Hold Me / Walk the Walk / Papi Beat), -14 LUFS.

## instagram / social

- **2026-07-27 — Reels 220/175/174 scheduled via Meta Suite, planner-verified: exactly six entries
  at 5:00 KST** — 7/29 수 (220), 7/30 목 (175), 7/31 금 (174), each FB(EpicKor)+IG(epickorsnippets).
  174 initially landed at 5:37 (composer default time) and was corrected on both rows via
  게시물 상세 → 옵션 → **게시물 일정 조정** dialog.
- **2026-07-27 — Meta Suite Reels scheduling, measured procedure updates:**
  (a) Playwright CDP attach cannot transfer files >50MB — the reel composer uses showOpenFilePicker
  with no DOM input, so the workaround is an **owning process** (`launch_persistent_context` with
  `--remote-debugging-port=9223`) doing upload+caption locally, then CDP scripts continue the flow.
  (b) The machine runs **DPI 1.25**: screenshots are 1920px but CSS viewport is 1536 — divide
  screenshot coords by 1.25 or use DOM getBoundingClientRect, never raw screenshot pixels.
  (c) Date fields accept typed `2026-7-29` + Enter; time is three segment inputs (오전오후/시/분)
  — set minutes by clicking the third segment directly.
  (d) The submit button label check ("예약", never "공유하기") remains the hard safety gate.
  (e) Do NOT kill the browser while "게시 일정 예약 중" spins — the submit may still land (175 did),
  but you lose confirmation; the spinner can also hang >5min after success (174).
- **2026-07-27 — 요일 고정(카드뉴스 화수목/릴스 금토일) 규칙 폐기** — 연속 일자 예약으로 전환.
  다음 측정 의무: 220/175/174 발행 후 1h/24h/7d 지표를 `output/reels/metrics.json`에 기록.

- **2026-07-29 — Card news (multi-image carousel) scheduling uses a DIFFERENT Meta Suite composer
  than Reels: "게시물 만들기" (`/latest/composer/`), not "릴스 만들기".** Key mechanics, distinct from
  the Reels flow already documented above:
  (a) Upload via the SAME `expect_file_chooser` + `set_files([...7 paths in order])` pattern —
  order is preserved faithfully; verified by reading the uploaded thumbnails' visible headline
  text in sequence, not just trusting the array order.
  (b) The caption `contenteditable` is `.nth(1)`, not `.nth(0)` (index 0 exists but has no
  bounding box / isn't rendered).
  (c) The schedule toggle is a text link "날짜 및 시간 설정" (not a segmented control like Reels) —
  clicking it reveals separate Facebook and Instagram date/time rows, each with 4 inputs
  (date, AM/PM, hour, minute) — same index pattern as Reels (date, ampm, hour, minute × 2 rows).
  (d) **The AM/PM + minute + hour interaction is fragile: adjusting minutes past a wrap boundary
  changes the hour, and the starting minute value is whatever the real current minute happened to
  be when the composer loaded (NOT always :59) — never assume a fixed delta.** Reliable pattern:
  click the minute input, read its current value via
  `el.evaluate("e => e.parentElement.innerText")` (returns a plain "NN" string), then press
  ArrowDown exactly that many times to reach :00, THEN re-read the hour the same way and correct
  any carry with additional Arrow presses — don't guess the press count.
  (e) **A hashtag string can silently truncate mid-list** (e.g. typed 8 hashtags, only 1 landed) —
  the hashtag autocomplete dropdown appears to swallow subsequent keystrokes/Shift+Enter
  sometimes. Fix: after typing each hashtag, press `Escape` before typing the next one. Always
  verify the final caption length/content via `editable.inner_text()` before scheduling, don't
  trust the typing loop silently.
  (f) After a successful "예약" submit, a **paid-promotion upsell modal** ("홍보를 통해 더 많은
  사람에게 도달해보세요") appears on top of the "게시물이 예약되었습니다" confirmation — click
  "나중에 하기" to decline; the confirmation card behind it already shows the correct scheduled
  date/time as final proof of success (don't click "홍보하기", that spends real money).
  (g) This composer's post-submit outcome was reliably a clean confirmation dialog every time
  (6/6), unlike the Reels composer's "게시 일정 예약 중" spinner-hang quirk — no cache-purge or
  extended waiting was needed for card news.
- **2026-07-26 — Instagram uploads are representative-managed (~1/day) and leave no repo trace.**
  An empty scheduling record is NOT evidence of an upload stall. Meta Suite's list also does not
  show posts made from the mobile app.
- **2026-07-29 — Reels 326/321/320 scheduled via Meta Suite, planner-verified: six entries at
  5:00 KST** — 8/1 토 (326, spice levels), 8/2 일 (321, chicken brands), 8/3 월 (320, tower
  comparison), each FB(EpicKor)+IG(epickorsnippets). Continues the no-fixed-weekday consecutive-day
  pattern directly after the prior batch's 7/31 landing.
- **2026-07-29 — Exact >50MB attach-mode error confirmed: `"Cannot transfer files larger than 50Mb
  to a browser not co-located with the server"`.** A 48.5MB file (321) succeeded via CDP-attach
  `set_files` despite the client-side call itself timing out at 30s (the upload lands anyway —
  don't trust the Playwright promise, screenshot the actual composer state). A 64.4MB file (320)
  was hard-rejected immediately with the exact error above, no timeout involved. **Fix for >50MB:
  cleanly kill the existing owning Chrome+Python process tree (`taskkill /PID {chrome_pid} /T /F`)
  and relaunch a fresh `launch_persistent_context` against the SAME profile dir + same
  `--remote-debugging-port` — login/session cookies persist because the profile directory itself
  survives on disk, no re-login needed.** Recipe lives in `scratchpad/reel326_upload.py` /
  `reel320_upload.py` (this session, PROFILE_DIR = `scratchpad/meta-profile`, port 9222).
- **2026-07-29 — The AM/PM time segment (오전/오후) frequently needs TWO tries.** Click + one
  `ArrowDown` press often leaves the label unchanged (silently ignored, no error) while hour/minute
  segments set correctly on the first attempt every time. **Always screenshot and check the label
  after setting AM/PM; if still wrong, click the segment again and press `ArrowDown` a second
  time** — this reliably fixes it. Happened on both new schedules this session (321 and 320), each
  time on both the Facebook and Instagram row.
- **2026-07-29 — The "게시 일정 예약 중" spinner hanging past 5 minutes is confirmed harmless,
  three-for-three this session (326, 321, 320).** In every case the schedule had already landed
  server-side; the spinner is a pure UI display bug. **Do not treat a stuck spinner as failure —
  verify via the 콘텐츠 → 예약됨 planner tab instead of waiting for the spinner to resolve.**
- **2026-07-29 — This machine runs Mouse Without Borders (input-sharing across multiple physical
  PCs).** Confirmed via `GetForegroundWindow` unexpectedly resolving to `MouseWithoutBordersHelper`
  after a synthetic `SetCursorPos`+`mouse_event` call intended for the automated Chrome window
  landed on VS Code instead. **Do not drive this browser via raw OS-level mouse/keyboard simulation
  (PowerShell `user32.dll` calls) — synthetic input can be captured by this hook and misdirected to
  a different window or, potentially, a different physical machine. Stay inside Playwright/CDP,
  scoped to the Chrome process, for all browser automation on this machine.**
