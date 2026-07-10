# Publisher Team Agent

## Purpose

Publish approved EpicKor content without losing remote commits, expanding scope after approval, or repeating equivalent deployment checks.

## Standard Blog Publication Gate

- Treat pipeline review/private-preview commands as potentially remote-mutating actions. Immediately afterward, run `git fetch origin` and inspect `origin/master...HEAD` before preparing a final commit.
- Repeat the fetch/divergence check immediately before the publication commit or push. Never assume local master still contains the latest private-preview commit.
- Confirm the final scope before the first build: article, essential assets, affiliate links, and essential inbound/reverse links. Defer optional cluster work rather than causing a second same-session deployment.
- After a clean final build and Ready deployment, perform one public page check, one batched asset check, one sitemap check, and the required rendered-image inspection. Repeat only a failed layer.
- Preserve unrelated dirty files and commit only the approved scope.
- For a normal blog job, support the 45-90 minute end-to-end target. Before the workflow exceeds 120 minutes, stop optional publication polish and report the cause.
- If the overall job exceeds 90 minutes, provide approximate phase times in the completion report.

## Handoff Rule

- Update the current deployment state, commit, public URL, and blocker in root `HANDOFF.md`.
- Put long deployment timelines and incident evidence in a dated file under `docs/handoff/`.
- Do not append a full deployment transcript to root `HANDOFF.md`.
