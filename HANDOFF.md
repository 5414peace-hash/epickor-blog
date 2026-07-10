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

## Current Snapshot - 2026-07-11

- Latest published normal post: Blog `287`, `Korean BBQ Grill for Home 2026: Electric vs Grill Pan`.
- Public URL: `https://www.epickor.com/blog/287`.
- Latest commits: `11c46651` reverse-link cluster, `97de3485` final Blog 287 publication, `083149d1` private preview.
- Production deployment was verified Ready and `www.epickor.com` served the article, sitemap entry, images, and reverse links.
- No article, Reel, card-news package, or deployment is currently in progress.
- Existing unrelated dirty worktree files must be preserved. Confirm the exact list with `git status --short` before editing.

## Active Work

- Status: none.
- Progress: 100% complete for Blog 287 publication and public verification.
- First action next session: follow the representative's new request; do not automatically reopen Blog 287 production.

## Blockers / Decisions Needed

- No technical blocker.
- Blog 287 GSC and GA4 results need time to accumulate before performance conclusions.
- Social reuse of Blog 287 requires representative selection and must respect the 3-Reel/3-carousel batch rhythm.

## Next Recommended Work

1. Monitor Blog 287 GSC query impressions for 7-14 days. Expected impact: validate the new transactional keyword cluster. Dependency: indexing/query data.
2. Review GA4 affiliate events for Blog 287 after data accumulates. Expected impact: improve CTA and product-link choices. Dependency: event volume.
3. Keep Blog 287 as a possible future Reel/card-news candidate, but do not auto-produce it ahead of approved inventory. Expected impact: commercial article traffic. Dependency: representative selection and batch timing.

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

- 2026-07-11: Replaced the 1.15MB rolling Handoff with this fast-start dashboard; archived all prior detail; promoted Blog 287 time-overrun lessons into shared and role-specific operating instructions.

## Agents Involved In This Maintenance

- Operations/Reviewer role: audited CLAUDE, Handoff history, git timing, and agent instructions; identified that incident lessons had not been promoted into executable role rules.
- Documentation role: created the fast-start/read-on-demand structure and preserved the historical record.
- Strategy/Research/Writer/Reviewer/Marketing/Publisher instruction owners: received scoped production-time, scope-freeze, verification, and Git synchronization rules.
