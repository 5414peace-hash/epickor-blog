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

- **`run-pipeline.mjs --step review --slug {n}`는 읽기 전용이 아니다. GitHub에 직접 커밋·푸시하고, 라이브 글을 내려버린다.** (2026-07-31 실측, 사고)
  - 발행된 글 `171`에 리뷰만 돌렸는데, 스크립트가 `content/blog/171.md`를 **`visibility: "private"`로 바꿔 커밋**(`6b2e067d "draft: update private preview post 171"`)하고 푸시했다. 배포가 나가면서 **사이트 최고 CTR 음식 글(3.35%)이 프로덕션에서 404**가 됐다.
  - 그것만이 아니다. 스크립트는 `output/drafts/`의 **낡은 초안 본문으로 덮어썼다.** 그 결과 `171`에서 **내부 링크 5개(059, 277, 278, 279, 281, 302)와 Amazon 제휴 CTA 박스 2개가 통째로 삭제**됐다. 발행 후에 넣은 수익화·내부링크가 전부 날아간 것이다.
  - 로컬에서만 검토했다고 착각하기 쉽다. 원격이 앞서가서 다음 `git push`가 거절되고, `git pull --rebase`에서 충돌이 나야 비로소 알게 된다. **충돌 구간(frontmatter)만 해결하고 넘어가면 삭제된 링크·CTA는 조용히 사라진 채로 남는다.**
  - **따라서 이미 발행된 글에는 `--step review`를 쓰지 말 것.** 리뷰만 필요하면 리뷰어 스크립트를 파일 지정으로 직접 돌린다: `node .claude/skills/reviewer/scripts/review-post.mjs --file content/blog/{n}.md`. `--step review`는 아직 발행 안 된 신규 초안에만 쓴다.
  - 실수로 돌렸다면 복구법: `git show <그커밋>^:content/blog/{n}.md`로 사고 직전 원본을 꺼내 기준으로 삼고, 그 위에 이번 편집을 다시 얹는다. 충돌 해결만으로 끝내지 말고 **내부 링크 수와 `affiliate-inline-cta` 개수를 편집 전후로 반드시 대조**한다.

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

- **2026-07-31 — This repo is pnpm. Adding a dependency with `npm install` silently breaks every
  deployment.** `npm install googleapis --save` updated `package.json` but left `pnpm-lock.yaml`
  untouched, and Vercel builds with `pnpm install --frozen-lockfile`, which then fails with
  `ERR_PNPM_OUTDATED_LOCKFILE`. Four consecutive production builds errored at ~25s each and three
  finished commits (two retitles plus a new post) sat undeployed for roughly 40 minutes before
  anyone looked at the build log — the pages simply 404'd while git and the GitHub API commits all
  reported success. **Fix:** `pnpm install --lockfile-only`, commit `pnpm-lock.yaml`.
  **Prevention:** use `pnpm add <pkg>`, never `npm install`, in this repo.
  **Diagnostic shortcut:** when a published page 404s for more than ~5 minutes, run
  `npx vercel ls epickor-blog --yes` first — an `● Error` status with a ~25s duration is a dependency
  install failure, not a content problem. `npx vercel inspect --logs <url>` gives the reason.
  *Verified:* build log read directly, 2026-07-31.


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

- **바이럴 한국 트렌드는 영문 통신사가 선점한다. 수요가 아니라 커버리지 공백을 봐야 한다.** (2026-07-31 실측, `output/strategy/keywords_2026-W31b.md`)
  - 이 사이클에서 수요 최상위 후보 2개가 커버리지 게이트에서 탈락했다. `chestnut tiramisu cu`는 구글 영문 자동완성 **1위**였고, 두쫀쿠도 `viral dubai chocolate cookie korea` 등 수요가 확실했다. 그런데 공급을 재보니 —
  - 두쫀쿠: **Korea Times(2026-01-14)·Stripes Korea·VisitKorea 영문판·서울경제 영문판(2026-02-07)·Gulf News·AOL/Food&Wine 신디케이션**이 전부 커버
  - 밤 티라미수: 조회 수백만 틱톡 레시피 다수 + K-en News + KoreaProductPost 전용 기사 + SETHLUI
  - **규칙**: 한국에서 바이럴이 터지면 우리보다 도메인 권위가 훨씬 높은 영문 매체가 며칠 안에 쓴다. **트렌드를 쫓으면 항상 늦는다.** 343(황치즈칩)이 통한 건 신선해서가 아니라 **한국에서 큰데 영어권에 안 보였기** 때문이다.
  - **선정 기준**: 신선도가 아니라 **"한국에서 크지만 영어권에 전용 기사가 0건"**. 실제로 이 기준으로 뽑은 344(박카스)·345(연세우유 크림빵)는 둘 다 한국인이면 다 아는데 영어 전용 기사가 없었다.

- **2026-07-31 — Two-Curl arbitrage measures DEMAND, not SUPPLY. Both gates are required.**
  An empty English autocomplete array means nobody *searches* the romanization; it does not mean
  nobody has *written* about it. Proven by 짜르르 (Samyang beef-tallow jjajang) in the W31 cycle:
  Naver 10 branches, `jjareureu` and `samyang jjareureu` both **0** EN branches — textbook prime
  arbitrage on the numbers — but a live SERP check showed **Korea Herald, Korea Times and Stripes
  Korea had already published the 1989 우지 파동 angle in English.** No demand + existing supply.
  Correctly parked. Playbook §4.1a added as an equal gate; Step 5a added to the weekly cadence.
  **Always search the descriptive English phrase, not just the romanization** — `jjareureu` returns
  nothing while `samyang beef tallow ramen` returns three major outlets.
  *Verified:* direct autocomplete calls + WebSearch, 2026-07-31.
- **2026-07-31 — Blog `301` (Ajumma Meaning) added to the permanent definitional dead-end list**
  alongside `090` (ahjussi), `082` (SKY), `210`. 946 impressions / 0.21% CTR / position 8.3 —
  structurally identical to 090. Do not spend a retitle on it. Recorded in CLAUDE.md.
- **2026-07-31 — GSC web-export query CSV is capped at 1,000 rows and that materially limits the
  weekly cycle's Step 1.** Page-level data covers all 322 pages, but most pages' query detail is
  invisible: Blog `227` shows 1,797 page impressions while only 18 impressions of its queries appear
  in the query export. Retitle decisions for such pages are therefore shape-inferred, not
  query-verified, and must be labelled as such. `scripts/gsc-fetch.mjs` (25,000 rows/request) is
  built and gitignore-verified but setup is optional and must not be prioritised over content.


- **2026-07-31 — Keyword-selection playbook written: `docs/keyword-selection-playbook.md`.**
  Repeatable weekly process, free tools only. Read that file before doing any keyword research;
  it records which tools are alive, which are dead, and the accept/reject rules. The rows below
  are the tool-behavior facts verified while building it — do not re-test these.
- **2026-07-31 — Autocomplete endpoints are ALL live, unauthenticated, and un-throttled at low
  volume.** Verified by direct curl: Google (`suggestqueries.google.com/complete/search?client=firefox`
  and `google.com/complete/search?client=chrome` — the latter returns 15 suggestions + relevance
  scores vs 10), YouTube (`&ds=yt`), Amazon (`completion.amazon.com/api/2017/suggestions`), Bing,
  DuckDuckGo, and Naver (`ac.search.naver.com/nx/ac`). **This is the core of the discovery stack.**
  The legacy `completion.amazon.com/search/complete` path is **404** — use `/api/2017/suggestions`.
- **2026-07-31 — `gl=` is IGNORED on Google autocomplete; results follow the requesting IP.**
  `gl=us`, `gl=kr`, and `gl=ph` on the same seed returned byte-identical suggestions. `hl=en` does
  work for language. **Running this from Seoul yields Korea-IP suggestions** — do not claim US
  results without a VPN. *Verified:* three-way curl comparison on `is tteokbokki`.
- **2026-07-31 — Reddit `.json` is DEAD: 403 on every route.** Tested `www.reddit.com/*.json`,
  `old.reddit.com/*.json`, `api.reddit.com`, across User-Agents. Guides claiming "10 QPM
  unauthenticated" are stale. `reddit.com/robots.txt` is now `Disallow: /` with no Googlebot
  carve-out (Google's access is contractual). Surviving free paths: `old.reddit.com` HTML search,
  `arctic-shift.photon-reddit.com`, and `site:reddit.com` **via Google only** (Bing/DDG lack recent
  Reddit content). ⚠️ Reddit's free API tier is scoped **non-commercial** — a grey zone for an
  affiliate-monetized site; prefer plain web access.
- **2026-07-31 — Automated SERP scraping is not viable; SERP inspection must stay manual.**
  Google and Bing return JS-required shells with zero results in raw HTML (Google has needed JS
  rendering since ~Jan 2025). DuckDuckGo's `html.duckduckgo.com` worked for ~5 queries then served
  empty results/challenge pages even after a 45s cooldown. **Do not build a SERP scraper.**
  Use `&udm=14&pws=0` in a browser to see the true organic field with AI Overviews suppressed.
- **2026-07-31 — `&num=100` was removed mid-September 2025 and Google Trends' unofficial API
  returns 429.** Page SERPs with `&start=0,10,20…`. The official Trends API is still an
  application-gated alpha (announced 2025-07-24, not GA) — do not plan around it. `pytrends` is
  effectively dead.
- **2026-07-31 — Two data-integrity problems contaminate our own GSC baseline. Compare CLICKS
  across time, never impressions or CTR.** (a) Google confirmed a logging bug that **over-reported
  impressions from 2025-05-13 until early April 2026** (clicks unaffected) — inflated impressions
  with correct clicks means our CTR figures are **artificially low by an unknown margin**, and every
  export in `output/gsc/` sits inside that window. (b) The `num=100` removal stripped rank-tracker
  bot impressions in Sept 2025 (87.7% of 319 studied sites lost impressions, clicks flat).
- **2026-07-31 — CORRECTION to `reports/competitor-study-v2-verified-2026-07-30.md`: the "86.4%
  below benchmark CTR" claim compares against the wrong curve and should not be repeated.**
  Clickstream curves (First Page Sage: position 1 = 39.8%) measure a different population than
  GSC-aggregate curves (Ahrefs, 300k keywords, Dec 2025: position 1 = **3.9%** without an AI
  Overview, **1.6%** with one). Benchmarked against the GSC-appropriate curve, expected CTR at
  position 7.81 is roughly **0.10–0.25%**, so our **0.363% is at or slightly above expectation.**
  We are not uniquely broken. **The strategic conclusion is unchanged** — it is a query-mix problem
  (definition 0.048% vs purchase 2.0% on the same site), which is exactly what topic selection
  controls. Only the diagnostic framing was wrong.
- **2026-07-31 — GSC row limits, from Google's own docs.** UI export **1,000 rows**; Search
  Analytics API **25,000/request**, paginating to **50,000/day/site/search-type**; **the Looker
  Studio connector does NOT bypass this** — same 50,000 ceiling. BigQuery bulk export has **no row
  cap and accumulates indefinitely**, but only from the day it is enabled, and it **requires a
  billing-enabled GCP project (card on file)** even though our volume stays inside the free tier
  (1 TiB queries + 10 GiB storage/month). GSC retention is **16 months, rolling**. **GSC API access
  is still NOT configured** (no credentials, no `googleapis` dependency) — wiring it up is the
  single highest-leverage unfilled gap: 25× more discoverable queries.
- **2026-07-31 — Bing Webmaster Tools Keyword Research is genuinely free and gives REAL volume
  numbers** (Microsoft Advertising data, not estimates), filterable by country/language/device,
  with CSV export and a free API (`ssl.bing.com/webmaster/api.svc/json/`, `GetKeywordStats` /
  `GetRelatedKeywords`). Requires verified site ownership. **Hard limit: Keyword Research holds
  6 months only** (the Search Performance report separately holds 24 — better than Google's 16).
  ⚠️ Bing is ~27–28% of US *desktop* but only ~0.6% of mobile, while **64.7% of our impressions are
  mobile** — use for relative ranking between keywords, never as an absolute forecast. Any
  "multiply by 10–20×" rule is folklore.
- **2026-07-31 — Google Trends returns 0 for our best keywords and must not be used to validate
  topics.** Google states low-volume terms "appear as 0"; the floor is roughly several hundred
  searches/month. Our top converter (`korean convenience store breakfast`, 61 impressions,
  **14.75% CTR**) sits below it. Trends is for **seasonality and direction only**. It is a sample,
  not a census — identical repeated queries have measured 8 vs 23 across successive exports.

### korean-source arbitrage (all verified by direct curl 2026-07-31)

- **2026-07-31 — The Two-Curl Arbitrage Test works and is the cheapest signal we have.**
  `ac.search.naver.com/nx/ac?q={한글}&st=100&r_format=json` returns branch counts; Naver only builds
  branches for terms with real query volume. Live proof: **`육포깡` → 10 branches** (후기/가격/편의점/
  칼로리/맛/매콤한맛) while **`yukpokkang` on Google EN → `[]` empty array**. That gap *is* the
  arbitrage, measured in two unauthenticated GETs.
- **2026-07-31 — `POST datalab.naver.com/shoppingInsight/getCategoryKeywordRank.naver` is OPEN —
  no auth, no cookie — and the age/gender/device filters are where the signal lives.** Independently
  reproduced: 식품 (`cid=50000006`) unfiltered returns staples (옥수수/쌀20kg/닭가슴살); with
  `age=20&gender=f&device=mo` it returns 생새우·바위굴·**화과자**·**볶음너구리**·촉촉한황치즈칩.
  Needs `Referer: .../sCategory.naver` + `X-Requested-With: XMLHttpRequest`. ⚠️ Flaky — a call may
  301 to `/notfound.html` then succeed on retry; treat 301 as retry, not dead. The 검색어트렌드
  equivalent (`qc/getKeywordTrend.naver`) is **not** open — use the official API for that.
- **2026-07-31 — `POST know.tour.go.kr/stat/entryTourStatDis_DataXML.do` returns inbound tourists
  by all 75 nationalities, monthly, with NO auth.** The widely-cited
  `kto.visitkorea.or.kr/eng/tourismStatics/...` link is **DEAD** and `datalab.visitkorea.or.kr` is
  login-gated — use this instead. **Strategic finding: English is our slowest-growing inbound
  market.** H1 2025→H1 2026: Taiwan **+33.4%**, China **+27.1%**, Japan **+20.4%**, USA **+11.1%**,
  total +21.3% (first-ever 10M half-year). Worth a representative conversation; not acted on.
- **2026-07-31 — 뉴스와이어 RSS is live and free:** `api.newswire.co.kr/rss/theme/101` (신상품),
  `/theme/116` (사업확장), `/region/11` (해외). ⚠️ **대한민국 정책브리핑 (korea.kr) RSS is officially
  discontinued** — the list page still scrapes. 식품음료신문 has the only true 수출 desk with a feed:
  `thinkfood.co.kr/rss/S1N3.xml`. **더구루** is real and on-beat but the useful section is
  **생활경제 `sec_no=52`**, not 글로벌 — and it has **no RSS**, so scraping is mandatory.
- **2026-07-31 — 공정위 정보공개서 is free with NO login** (plain anonymous curl), ~11,750 registered
  brands, comparison tool at `franchise.ftc.go.kr/mnu/00014/program/firHope/view.do` covering
  **2017–2025** across 17 regions. ⚠️ `franchise.ftc.go.kr/main.do` is **404** — deep paths only.
  Store-count growth (신규개점 − 계약종료) is a **leading indicator of overseas franchise expansion**,
  visible months before any press release. Data is self-reported and excludes 외국계 브랜드.
- **2026-07-31 — The Korea→English arbitrage window has collapsed to ~8 weeks for visually viral
  items.** 왁뿌볼/말랑이 reached **CNN on 2026-07-04**; 얼먹젤리 was already in Korea Herald and Korea
  Times. Buldak's 12–18 month runway no longer exists. **Durable arbitrage has moved to structural/
  retail/channel topics** (convenience-store category shifts, franchise counts, export figures)
  that English media covers late or never. **Always verify English coverage before writing.**
- **2026-07-31 — Naver DataLab Open API signup requires 휴대폰 인증 + company name but NOT a
  사업자등록번호.** 1,000 calls/day, data from 2016-01-01, returns **relative ratio 0–100 only —
  never absolute volume**. Max 5 groups × 20 keywords. This phone-verification barrier is precisely
  the moat: trivial for a Seoul team, a hard block for a foreign competitor.
- **2026-07-31 — Domain migrations to fix in old notes:** `motie.go.kr`→**`motir.go.kr`** (ministry
  renamed 산업통상부), `unipass.customs.go.kr/ets`→**`tradedata.go.kr`**, `kostat.go.kr`→**`mods.go.kr`**
  (통계청 renamed 국가데이터처 2025-10-01), `search.shopping.naver.com/best`→**`shopping.naver.com/ns/home/best`**.
  **Dead/blocked:** namu.wiki RecentChanges (Cloudflare JS challenge; article pages work fine),
  namu.news (410), TikTok `creative_radar_api` (auth-gated), Waygook (frozen 2019), Korea4Expats
  (500), 네이버/다음 카페 (login + join approval).

- **2026-07-30 — Real keyword cannibalization confirmed: Blog `090` and Blog `210` target the
  identical "oppa/samchon/ahjussi" comparison.** 090 (retitled 7/18 to lead with this comparison,
  already has an H2 "Oppa, Samchon, and Ahjussi: The Real Difference") is the site's top-trafficked
  page at 142 clicks/158,280 impressions. 210's title is literally "Oppa, Samchon, Ahjussi: Korean
  Male Terms Explained" — same three-word comparison, never touched since its 2026-06-17 publish,
  stuck at 7 clicks/2,562 impressions. Confirmed by reading both files directly, not just query
  matching. **Not yet resolved** — needs a representative call (merge/redirect 210 into 090, or
  differentiate 210's angle so it stops competing for the same query) before acting.
  *Verified:* direct file read of `content/blog/090-*.md` and `content/blog/210.md`, cross-checked
  against `output/gsc/https___www.epickor.com_-Performance-on-Search-2026-07-24/페이지.csv`.
- **2026-07-30 — The "SKY university" query cluster is a confirmed structural dead-end, same as
  ahjussi — stop trying to fix it with retitles.** Combined queries ("sky university," "sky
  universities," "sky korea university," etc.) run roughly 15,000-20,000+ impressions with
  near-0% CTR across both pages that touch it (082, 231). 082 already got the CTR-fix retitle
  treatment on 7/18 and is still near-0% six days later; 231 name-checks SKY early in the body
  (`## What SKY Means In Korea`) but the title doesn't signal that, and it likely wouldn't help
  anyway — this is a pure definition query where Google answers in the snippet, exactly like
  ahjussi. Do not spend more retitle effort chasing this cluster.
  *Verified:* parsed the full 1,000-row query CSV and 322-row page CSV programmatically (not
  eyeballed), cross-referenced against `content/blog/082-*.md` and `content/blog/231.md`.
- **2026-07-30 — GSC data only shows queries the site already has SOME impression footprint on —
  it cannot reveal genuinely new, zero-footprint search demand.** A weak-position (rank 15-40,
  impressions ≥80) scan of the same 1,000-query export returned only 3 hits, all already covered
  elsewhere on the site. This is why a rigorous GSC re-analysis found no fresh "new topic"
  candidates on 2026-07-30 — the query universe in a single export is inherently bounded to what
  we already rank for somewhere. New-topic discovery needs external research (news/trends/
  competitor gaps), not another GSC pass, once the existing CTR-fix backlog is exhausted.
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

- **CORRECTED (2026-08-01, 같은 날 정정): 한국 캠핑 사진은 있다. 공유마당에 2,225장이다.** 아래 항목은 **서양 스톡(Pexels·Commons·Openverse)에 한정해서만** 맞다.
  - **무엇을 놓쳤나**: `공유마당`(gongu.copyright.or.kr, 한국저작권위원회)은 **CLAUDE.md 2차 소스 목록에 이미 적혀 있었는데 열어보지 않았다.** 서양 스톡 25개 쿼리가 0건이라 "한국 캠핑 사진은 존재하지 않는다"로 결론냈고, 그건 **"내가 찾아본 곳에 없다"를 "없다"로 바꿔치기한 것**이다.
  - **실측**: `이미지 검색 → 사진 필터 → 캠핑` = **2,225건.** 한국 공원의 타프, 야간 텐트와 랜턴, 텐트 안에서 본 소나무숲, 숯불 등 **진짜 한국 캠핑 사진**이다.
  - **라이선스 내역**: 사진+**CCL 2,120건** / 사진+**KOGL 99건** / 사진+**기증저작물 6건** / 만료 0건. **CCL에는 상업 이용 불가인 CC BY-NC가 섞여 있으므로 개별 확인이 필수다.** KOGL도 Type 4는 상업 이용 금지다.
  - **막힌 지점**: KOGL 필터 결과가 썸네일 대신 플레이스홀더로 뜬다 — **로그인이 필요한 것으로 보인다.** 계정 없이는 개별 라이선스 확인과 다운로드가 안 된다. **대표님 판단 필요.**
  - **접근법**: JS 사이트라 WebFetch로는 부족하고 Playwright로 조작해야 한다. 셀렉터는 `#wrtTy`(이미지 전체/미술/**사진**), `#licenseCd`(전체/만료/기증/CCL/KOGL), `#searchWrd`(검색어), `#searchSrcTrgetInttCd`(제공처 — 문화체육관광부·한국문화정보센터 등).
  - **일반화**: **소스 목록에 적어만 두고 실제로 열어본 적 없는 소스가 더 있을 수 있다.** "없다"고 결론내기 전에 목록의 모든 소스를 실제로 시도했는지 확인할 것.

- **(서양 스톡 한정) 한국 캠핑 사진은 Pexels·Commons·Openverse에 없다. "한국 장소" 아니면 "텐트"만 나오고 교집합이 없다. Pexels·Commons는 "한국 장소" 아니면 "텐트"만 주고 교집합이 없다.** (2026-08-01 실측, 25개 이상 쿼리)
  - **왜 찾았나**: 대표님 지적 — *"한국에도 재작년·작년에 캠핑 붐이 크게 일었으니 사진이 없을 리 없다. 강원도 캠핑·양평 캠핑장처럼 지명을 붙여 봐라."* 지적은 타당했고 지명 전략도 부분적으로 맞았다.
  - **부분적으로 맞은 부분**: Pexels에 **지명을 넣으면 한국 검증본이 실제로 나온다** — `gapyeong`(3,625) · `yangpyeong korea`(7,411) · `goseong korea beach` · `nami island` 모두 alt에 지명이 박힌 진짜 한국 사진을 준다. **한국 풍경 사진이 필요할 때는 반드시 지명을 쓸 것.**
  - **그런데 캠핑 장면은 끝내 0건이었다.** `camping gapyeong` → 가평 낚시·자라섬·풍력발전기(텐트 없음). `tent gangwon` → 설악산 봉우리 + **달랏(베트남) 텐트**. `tent beach korea` → 부산 광안대교 + **이스탄불·악타우(카자흐스탄) 텐트**. 한국어로 `캠핑`·`캠핑장`을 쳐도 **튀르키예·멕시코·상하이·베트남**만 나오고 한국 명시 **0건**.
  - **Commons는 지명 조합이 전부 0건**: `난지한강공원 캠핑장`·`노을캠핑장`·`강원도 캠핑장`·`양평 캠핑장`·`경기도 캠핑장`·`서울 캠핑장` 모두 0. Commons는 백과사전용이라 레저 캠핑장을 아무도 올리지 않는다.
  - **구조적 이유**: 한국 캠핑 붐은 **네이버 블로그·인스타그램·캠핑장 예약 사이트**에 기록됐다. 전부 저작권 자료다. 서양 무료 스톡의 기여자 층이 한국에서 캠핑을 하지 않는다.
  - **남은 유일한 경로**: **PHOTO KOREA (한국관광공사, KOGL Type 1)** — 가입 필요, 1일 20장 제한. 미시도 상태. 관광공사라면 캠핑장 홍보 사진을 보유할 가능성이 높다. 대표님 계정 또는 보유 스톡 확인이 선행되어야 한다.
  - **부수 발견**: 이미지 검색 실패가 **주제 이해 부족의 신호**일 수 있다. 캠핑 사진을 못 찾은 1차 원인은 소재 부재가 아니라 **한국인이 산에서 텐트를 안 친다**는 사실이었고, 그걸 깨달아 `350`(대피소·야영 규정)이 나왔다. **없는 사진을 계속 찾기 전에 왜 없는지를 먼저 물을 것.**

- **Wikimedia Commons에 한국 상용 제품 실물 사진이 생각보다 많다. Pexels 실패를 이미지 조달 실패로 착각하지 말 것.** (2026-07-31 실측)
  - 344/345 작업 중 Pexels는 두 주제 모두 실패했다 — `korean convenience store bread` 등은 베트남·필리핀·러시아 이미지를 반환했고, 유일한 한국 검증 사진(Pexels `31735910`)은 이미 Blog `171`의 ogImage라 교차중복 규칙에 걸렸다.
  - 그런데 **Commons에는 해당 제품 실물이 그대로 있었다**:
    - `File:연세우유 우유생크림빵.jpg` 외 3건 — 포장 상태 + 단면 2종, 전부 **CC BY 2.0 KR**, 저작자 이분의일디자인
    - `File:박카스-F.jpg` (CC BY 2.0 KR, 라벨에 `120mL` 판독 가능), `File:박카스1970.jpg` (**KOGL Type 1**, 한국문화정보원, 라벨에 `BACCHUS-D` `100cc.` 판독 가능)
  - **검색 요령**: 영어 서술구가 아니라 **한글 제품명 그대로** 검색해야 나온다. `Korean convenience store bread`는 실패하고 `연세우유`는 4건이 나왔다. API 파라미터는 `gsrnamespace=6` 필수.
  - **주의**: 짧은 시간에 여러 번 호출하면 `You are making too many requests`(HTML 반환)가 뜬다. 요청 사이 3초 이상 간격을 두고, 다운로드는 UA에 연락처를 포함한다 (`EpicKor/1.0 (https://epickor.com)`). 실패 시 1,964바이트짜리 HTML이 `.jpg`로 저장되므로 **다운로드 후 파일 크기를 반드시 확인**한다.
  - **부수 효과**: 라벨에 수치가 찍힌 사진을 쓰면 본문 주장과 이미지가 서로를 증명한다 — 344는 `100cc.`와 `120mL`가 사진에 그대로 있어 캡션이 변명할 필요가 없었다.

- **2026-07-31 — STRUCTURAL CONSTRAINT ON LANE 1: viral limited-edition Korean products have no
  freely-licensed photos, and there is no workaround.** Confirmed exhaustively for 오리온 촉촉한
  황치즈칩 (the W31 pick): **zero** results on Wikimedia Commons, Pexels and Unsplash for the actual
  product. The causes are structural and will repeat for every similar product:
  (a) limited editions get **no permanent manufacturer catalog page** — verified that 촉촉한 초코칩
  *is* in Orion's biscuit catalog while 황치즈칩 is in neither the 스낵 nor 비스킷 catalog;
  (b) **no export SKU**, so no foreign retail photography either;
  (c) scarcity means it never enters casual photo commons.
  **Press photos credited "오리온 제공" are press-distribution licensing, not CC or PD** — same
  reasoning that already bars Getty embeds from this monetized site.
  **The tier-4 "reference and recreate" route is CLOSED for branded packaged goods** — a recreated
  package is brand impersonation, which the sourcing rules bar outright.
  **Therefore the standing approach for lane-1 product posts is:** honestly-captioned real Korean
  retail context (convenience store interiors, the manufacturer's *other* CC0-licensed products),
  each captioned by what it positively IS with zero reference to the target product. If the only
  honest caption explains what the photo is NOT, the photo is the wrong choice — replace it, do not
  hedge the caption. Upgrade paths worth taking when the product matters enough: request permission
  from the manufacturer's PR, or have the representative photograph it on a Korean shelf.
  *Verified:* direct searches of Commons/Pexels/Unsplash and Orion's own KR + EN catalogs, 2026-07-31.


- **2026-07-30 — Actually violated the site's own Blog Reference Image Standard while writing
  captions for images honestly documented as "not the real venue" (Blogs 340/342, both brand-new
  2026 locations too recent for Wikimedia Commons).** Wrote captions like "not a photo of the park
  itself" and "not one of Galaxy Robot Park's own robots" — directly using the exact hard-reject
  phrase pattern the standard names ("not the actual", "shown for illustration only", "without
  implying"). The rule's actual instruction when honesty requires an apology is to **replace or
  remove the image**, not write a more careful disclaimer — hedging IS the violation, regardless of
  how honest the hedge is. Caught by the representative post-publish, not by me. Fixed by (a)
  dropping the one image (a Tokyo Pepper robot) that could only be captioned by explaining what it
  wasn't, and (b) rewriting the remaining captions to name their real subject directly with zero
  apology (e.g. "Namsan Park's elevated walkway" instead of "similar in spirit to Yongwangsan").
  **Test to apply going forward**: if a caption's honest version requires saying what the photo
  ISN'T, the image is wrong — don't caption around it.
- **2026-07-30 — A Python `open(path, 'w').write(text)` on this Windows checkout converts `\n` to
  `\r\n` (CRLF), which silently broke `review-post.mjs`'s frontmatter regex** (it returned
  `unknown_review.json` with every field empty, no error). Files under `content/blog/` are CRLF by
  git-autocrlf convention on this machine and the reviewer handles them fine when they arrive via
  `git pull`/Edit-tool edits; the breakage was specific to rewriting `output/drafts` /`output/final`
  files (gitignored, not autocrlf-managed) via raw Python file writes. Fix: after any Python-based
  bulk text edit to a draft/final file, verify with `file <path>` that it still says "with CRLF
  line terminators" only if it already had them, or normalize back with
  `open(p,'rb').read().replace(b'\r\n', b'\n')` before re-running the reviewer.

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
- **2026-08-02 — 본문의 세로 1080x1920 이미지 91편은 문제가 아니다. 대표님이 의도한 것이다.**
  릴스 제작 시 **텍스트 겸 썸네일로 일부러 만든 것**이고 내부 이미지도 괜찮다는 판정을 받았다
  (대표님 원문: "그냥 둬도 괜찮을거같아 릴스로 제작할때 일부러 텍스트겸 썸네일로 제작한거라.
  내부 이미지도 괜찮고"). **다음 세션이 이걸 다시 결함으로 올리지 말 것.** 가로 크롭 일괄 작업도
  하지 않는다. 허용된 것은 **사진이 적은 글에 한두 장 더 얹는 것**뿐이다.
  - **단, 예외가 하나 있었다.** Blog `156`의 구 `156_01.jpg`는 실존 인물의 얼굴이 눈·안경 부위에서
    뭉개진 상태였고, `155_01`/`136_01`은 alt 텍스트가 실제 이미지와 불일치했다(155는 "반가사유상
    미니어처 진열"이라 써놓고 호랑이 배지·달항아리, 136은 근거 없이 "우영미 블레이저"라고 단정).
    이 셋은 2026-08-01에 교체 완료했고, 그건 세로 비율 때문이 아니라 **초상 변형과 캡션 불일치**
    때문이었다. 비율 이슈와 혼동하지 말 것.
- **2026-08-01 — 리뷰어 `parseFrontmatter`가 CRLF 파일을 파싱하지 못하고 있었다 (수정 완료).**
  `/^---\n/`로 매칭하는데 이 저장소는 `core.autocrlf=true`라 git이 체크아웃하는 모든 `.md`가
  CRLF다. 그래서 **갓 체크아웃한 글은 제목·description·ogImage·tags 검사가 통째로 실패해
  60점대**가 나왔고 원인이 글 내용처럼 보였다. 337을 stash/pop 했더니 같은 파일이 90→60으로
  떨어져 발견. 읽는 시점에 BOM과 CRLF를 함께 정규화하도록 고쳤다.
- **2026-08-01 — 아마존 링크 12개(글 5편: 337·338·339·340·342)에 제휴 태그가 아예 없었다 (수정 완료).**
  판매가 나도 수익이 0원인 상태였다. 전부 `tag=epickor-20` 부착. 현재 사이트 전체 아마존 링크
  1,276개가 모두 태그를 갖고 있다. 신규 글 발행 시 태그 유무를 반드시 확인할 것.
- **2026-08-01 — CTA 위치 실측: 첫 아마존 링크 중앙값이 본문 38% 지점이었다.**
  모바일 6~8스크롤이라 대다수 독자가 링크를 보지 못한 채 이탈했다. `.affiliate-topline`
  (한 줄 링크)을 273편에 넣어 중앙값을 **14%**로 당겼다. 첫 박스가 이미 25% 이전인 36편은
  의도적으로 제외했다(박스 옆에 붙으면 광고 더미로 읽힘). 효과 판정은 다음 아마존 리포트에서
  클릭 수가 35에서 얼마나 움직이는지로 한다.
- **2026-08-02 — Vercel의 서버리스 함수 한도는 압축 전 250MB이고, `public/`에서 런타임 파일 읽기를
  하면 이 한도를 넘긴다 (실측).** 이미지 방향(세로/가로)을 판별하려고 `lib/`에서
  `readFileSync(path.join(process.cwd(),'public',...))`를 했더니 Next.js가 `public/`(**1.7GB**)을
  함수 번들에 추적해 넣어 `blog/[slug]` 함수가 **418.77MB**가 됐고 배포가 거부됐다.
  - **가장 중요한 부분: `next build`는 로컬에서도 Vercel에서도 성공했다.** 에러는 그 뒤 배포 단계에서
    났다. **빌드 초록불은 배포 안전의 증거가 아니다.** 로그 마지막 줄까지 봐야 한다
    (`npx vercel inspect {url} --logs | tail -30`).
  - 해결: 빌드 시점에 한 번 스캔해 `lib/generated/portrait-images.json`(42KB)을 만들고 런타임은
    Set 조회만 한다. 생성 스크립트는 `scripts/build-image-dimensions.mjs`이고
    **`prebuild` 훅이 아니라 `build` 스크립트 안에 직접** 넣었다 — pnpm은 pre/post 스크립트를
    기본으로 실행하지 않는다.
  - 일반화: **`lib/`나 서버 컴포넌트에서 `public/` 아래를 런타임에 읽지 말 것.** 필요하면 빌드 산출물로 넘긴다.
- **2026-08-02 — 이미지 쌍을 감싸는 코드가 세 군데에 있어 그리드가 3중 중첩되고 있었다 (수정 완료).**
  `autoGridLayout`(image-resolver) + `convertToParallelImageGrid`(markdown-enhancer) +
  옛 관리자 도구가 글 파일에 직접 박아둔 `<div class="image-grid-2up">`. 2열 그리드가 겹치면서
  이미지가 컬럼 폭의 **1/4**로 줄고 오른쪽 절반이 비었다. 파이프라인 끝에서 중첩을 펴는
  `normalizeImageGrids`로 해결. **각 생산자를 서로 알게 만들려 하지 말 것 — 마지막에 정규화한다.**
- **2026-08-02 — 사용 가능한 한국 공공 영상 소스 조사 결과 (릴스 소재 게이트 관련).**
  | 소스 | 규모 | 라이선스 | 접근 |
  |---|---|---|---|
  | **공유마당 영상** (`gongu.copyright.or.kr/gongu/wrt/wrtCl/listWrtVideo.do?menuNo=200026`) | **128,504건** | CCL 6종 + KOGL 4종이 **항목별로 혼재** | 로그인 필요 (전용 프로필 보유) |
  | **포토코리아 관광지 영상** (`phoko.visitkorea.or.kr/sub/video.kto`) | 미집계 | KOGL (1유형 다수) | **가입 필요 — 대표님 액션** |
  | **KTV 국민방송 / e영상역사관** | 대량 | **KOGL 1~4유형 혼재** (`ktv.go.kr/guide/copyright`) | 나누리 포털(`nanuri.ktv.go.kr`) 가입 후 신청 |
  | 서울시 mediahub / tv.seoul.go.kr | — | **미확인** — 홈에 조건 없음, 항목별 확인 필요 | — |
  - **쓸 수 있는 것은 CC BY / CC BY-SA / KOGL 1유형뿐이다.** KOGL 2·4유형은 상업 금지(우리는 제휴 수익이 있으므로 해당), 3유형은 변형 금지(편집이 곧 변형이므로 릴스에 못 쓴다).
  - **영상은 이미지보다 라이선스 함정이 크다.** 배경음악, 등장인물 초상, 타사 방송 인용분이 한 클립 안에 섞일 수 있고 KTV 안내 페이지도 그 예외를 명시하지 않는다. **항목별 상세 페이지를 반드시 열어볼 것.**
  - **이걸로 릴스 소재 게이트가 완전히 풀리지는 않는다.** 대부분 가로 촬영이고 우리 기준은 진짜 9:16이다. 세로 크롭은 화질·구도 손실이 크므로 **주역 컷이 아니라 브릿지·establishing 컷 용도**로 보는 것이 정확하다.
- **2026-08-03 — 원격 이미지 로컬화 스크립트가 마크다운 경로를 부분 치환해 42개 참조를 깨뜨렸다 (수정 완료).**
  `e90a0365`의 `scripts/localise-remote-images.mjs`는 **파일은 전부 정확히 내려받았는데** 마크다운
  치환에서 원본 URL의 꼬리를 남겼다:
  `/assets/images/posts/177/pexels-31736001.jpg` **+ `s-photo-31736001.jpeg?auto=compress...`**
  (`https://images.pexels.com/photos/{id}/pexel` 까지만 바뀌고 뒤가 남음).
  - **규모: 14편 54개 참조, 그중 12개가 ogImage.** 즉 그 글들은 구글·SNS 미리보기에 404를 넘기고 있었다.
  - **발견 경로: 대표님이 홈 화면 스크린샷에서 깨진 썸네일 2개를 짚었다.** 내 배포 후 검증은
    "이미지 파일이 200을 반환하는가"만 봤고 **마크다운이 그 파일을 실제로 가리키는지는 안 봤다.**
  - **재발 방지: 발행/일괄수정 후 아래를 돌린다.** 1,193개 참조를 파일시스템과 대조한다.
    ```
    node -e "const fs=require('fs'),p=require('path');let b=0;for(const d of ['content/blog','content/business'])for(const f of fs.readdirSync(d).filter(x=>x.endsWith('.md')))for(const r of new Set([...fs.readFileSync(p.join(d,f),'utf8').matchAll(/\/assets\/[^\"')\s]+/g)].map(m=>m[0]))){const c=r.split('?')[0];if(!fs.existsSync(p.join('public',c))&&!fs.existsSync(p.join('public',decodeURIComponent(c)))){b++;console.log('MISSING',f,r)}}console.log(b?b+' broken':'CLEAN')"
    ```
- **2026-08-03 — 썸네일이 비어 보이는 것은 이미지가 깨진 것과 다른 문제다.** 블로그 `205`의 ogImage는
  LG U+ **웹 배너**(1280x225)였다. 깨지지 않고 200을 반환하지만 그림이 오른쪽 3분의 1에만 있고
  나머지는 단색이라 `object-cover` 썸네일이 **빈 하늘색 사각형**이 됐다.
  **가로세로비가 극단적인 배너를 ogImage로 쓰지 말 것** — 파일 존재 검사로는 절대 안 잡힌다.
- **2026-08-03 — Wikimedia Commons 사용자 `Mobius6`가 한국 라면 제품 해체 사진을 동일 세팅으로
  다수 보유하고 있다 (CC BY-SA 4.0).** 같은 나무 테이블·흰 접시·조명으로 찍혀 있어 **제품 간
  수프 색 비교에 그대로 쓸 수 있다.** 확인된 것: 신라면, 안성탕면, 짜파게티(`Nongshim Chapagetti
  20201120 001~004`), 불닭(`Buldak Ramen 20210114 001~004`). 청양고추는 `File:Cheongyang-gochu.jpg`가
  **CC0**(출처표기 불요, 3543x2362).
  - 검색 요령: Commons API `action=query&list=search&srnamespace=6`로 제품명을 치되 **한글 검색어가
    로마자보다 잘 걸린다**(`짜파게티` > `Chapagetti`). 파일명 규칙이 `{제품} {날짜} {번호}.jpg`라
    하나를 찾으면 같은 시리즈를 통째로 가져올 수 있다.
- **2026-08-03 — 카드뉴스 이미지는 "주제에 맞는가"가 아니라 "그 제품인가"로 검수해야 한다.**
  라면 카로셀 초판이 전 카드에 "매운 한국 라면" 일반 사진을 썼고, **짜파게티 카드(검은콩장·국물
  없음·안 매움)에 낙지 든 붉은 해물탕면**이, **불닭 카드(볶음면·국물 없음)에 국물 라면**이 올라갔다.
  구조 검수 스크립트도, 내 육안 검수도 통과했다 — 둘 다 "음식 사진이 있는가"만 봤기 때문이다.
  **제품명을 말하는 카드는 그 제품의 실물 사진만 쓴다. 카테고리 사진은 불합격이다.**
