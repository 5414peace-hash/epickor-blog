# 2026-07-11 Handoff And Agent Guardrail Refactor

## Request

Review `CLAUDE.md` and `HANDOFF.md`, understand current progress, verify whether the Blog 287 abnormal-duration lesson was recorded only in Handoff, promote it to agent instructions, and make future Handoff startup cheaper.

## Findings

- Blog 287 is published and publicly verified; no production task is active.
- The abnormal-duration incident was documented well in Handoff, but the detailed controls were not present in Strategy, Research, Writer, Reviewer, Marketing, or Publisher role instructions.
- The prior root `HANDOFF.md` was about 1.15MB and more than 15,000 displayed lines, with duplicated/newest-at-top and appended historical sections. `CLAUDE.md` and `AGENTS.md` still instructed agents to read it as a normal startup step.
- The most important repeatable risks were open-ended polish, excess article length, repeated equivalent checks, optional post-deploy scope, and failure to fetch/reconcile the remote private-preview commit.

## Changes

- Preserved the full former Handoff as `HANDOFF_ARCHIVE_THROUGH_2026-07-11.md`.
- Replaced root `HANDOFF.md` with a 64-line fast-start dashboard containing only current state, active work, blockers, next priorities, and incident guardrails.
- Added an archive README with targeted `rg` lookup and retention rules.
- Updated `CLAUDE.md` and `AGENTS.md` so startup reads the root dashboard plus git status/recent history; strategy reports and archives are conditional reads.
- Updated Strategy, Research, Writer, Reviewer, and Marketing role files with scoped controls.
- Added the missing Publisher Team role file with remote synchronization, one-pass deployment verification, scope-freeze, and time-drift rules.

## Verification

- Root Handoff: 64 lines / about 6.7KB.
- Historical archive: about 1.15MB, preserved intact at the time of the move.
- `git diff --check` passed.
- No build was run because changes are documentation/agent operating instructions only.

## Agent Roles

- Operations/Reviewer: audited current state, prior incident evidence, git history, and instruction coverage.
- Documentation: created the fast-start/archive structure.
- Strategy/Research/Writer/Reviewer/Marketing/Publisher instruction owners: received role-specific guardrails.
