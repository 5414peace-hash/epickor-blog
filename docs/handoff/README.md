# EpicKor Handoff Archive

The root `HANDOFF.md` is the only default startup document. Files in this directory are historical evidence, not required reading.

## Lookup Pattern

Use targeted search first:

```powershell
rg -n -i "287|abnormal production time|private preview" docs/handoff
```

Then read only a narrow range around relevant matches. Do not open an entire archive unless the user explicitly requests a full historical audit.

## Retention Pattern

- Keep current status, active work, blockers, and the next three actions in root `HANDOFF.md`.
- Store detailed session evidence in `docs/handoff/YYYY-MM-DD_<topic>.md` or a clearly dated cumulative archive.
- Move durable rules into `CLAUDE.md`, `AGENTS.md`, or the relevant role file.
- Do not duplicate the same full report in all three places.
