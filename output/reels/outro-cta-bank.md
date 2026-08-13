# EpicKor Reels — Outro CTA Bank

Six rotating outro hooks. The old outro showed only `epickor.com`, which gave the viewer no reason to
go. Each line below adds a reason, and the six use **different psychological mechanisms** so rotation
does not feel repetitive.

## Fixed elements (every Reel)

- Hook line in **Segoe UI Black**, white, drop shadow, 1-2 lines, above the URL.
- Short red rule (`#d24437`) above the hook.
- **`epickor.com` as a solid red chip with white text.** Never red text on the footage — it fails on
  warm or busy backgrounds. The chip reads identically on any background and doubles as a consistent
  brand mark across the whole Reels library.
- URL only. No post paths — viewers cannot click text in a Reel.
- Outro cut runs silent by default so the close lands on image.

## The bank

| ID | Hook | Mechanism | Best fit |
| --- | --- | --- | --- |
| A | `THERE'S MORE` | Incompleteness — the Reel deliberately withheld something | Universal default |
| B | `DON'T ORDER BLIND` | Mistake avoidance — implies a cost to not reading | Food, shopping, ordering |
| C | `LOCALS KNOW THE REST` | Insider status — the viewer is outside a group they could join | Culture, etiquette, social rules |
| D | `BEFORE YOU LAND` | Timing pressure — a deadline the viewer already has | Travel, planning, first-trip |
| E | `WE WROTE IT ALL DOWN` | Reassurance and save-worthiness — no effort required | Guides, lists, how-to |
| F | `NO PAYWALL. NO APP.` | Friction removal — answers the unspoken "is it worth it" | Universal, use when reach is the goal |

## Rotation rules

- Match the mechanism to the topic first; only fall back to rotation order when two fit equally.
- Do not reuse the same ID on consecutive Reels in a batch.
- A and F are the universal pair — alternate them when nothing topic-specific fits.
- Reel 311 (tteokbokki, ordering guide) uses **B — `DON'T ORDER BLIND`**.

## Spoken tag — required, and it must say the domain

**Representative instruction, 2026-08-13**: *"마지막에 epickor.com 을 한번 나레이션으로 윺어주면
좋은데, 그건 다음편에는 그렇게하자."* From Reel 377 onward the outro carries a spoken line and
that line **says `epickor.com` out loud**. A viewer watching with sound cannot read a chip, and the
domain is the only thing in the frame they can act on.

This section previously read "default is silent", which is why Reel 376 shipped with a silent close.
That default was already stale: the 2026-08-11 batch had moved every reel to a spoken CTA after a
silent card sat for 7.3 seconds at the end of the Suneung reel. **Silent outros are no longer a
default and no longer an option** — write the tag into voice part 3 so the forced alignment carries it,
rather than generating a fourth clip.

Pair the hook with the domain, never a generic "link in bio":

- A: "There's more at epickor dot com."
- B: "Don't order blind — it's all at epickor dot com."
- C: "The locals know the rest. So does epickor dot com."
- D: "Sort it out before you land, at epickor dot com."
- E: "We wrote it all down at epickor dot com."
- F: "No paywall, no app. Epickor dot com."

Spell it "epickor dot com" in the narration text — TTS reads a bare URL as letters.

Older guidance, kept for reels before 377:

- B: "Don't order blind."
- D: "Sort it out before you land."
- F: "No paywall, no app."
