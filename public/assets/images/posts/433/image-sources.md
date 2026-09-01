# Blog 433 — Ttukbaegi vs Dolsot — image sources

Four Wikimedia Commons photographs plus one EpicKor chart. Five images rather than the usual three
because this article's central claim — that a ttukbaegi and a dolsot are different objects — is a
**visual** claim, and a reader who has never held either needs to see brown fired clay next to grey
cut stone rather than be told about it.

| File | What it shows | Source | License / credit |
|---|---|---|---|
| `two-jjigae-in-ttukbaegi.jpg` | Two ttukbaegi on wooden trivets, the right one still bubbling off the heat | `commons.wikimedia.org/wiki/File:Korean_stew-Two_jjigae_in_ttukbaegi-01.jpg` | **CC BY-SA 3.0** — Junho Jung |
| `dolsot-bibimbap-stone-bowl.jpg` | Dolsot bibimbap in a grey stone bowl | `commons.wikimedia.org/wiki/File:Dolsot-bibimbap.jpg` | **CC BY 2.0** — Sous Chef |
| `ttukbaegi-bulgogi.jpg` | Ttukbaegi bulgogi — brothy bulgogi in a dark clay pot | `commons.wikimedia.org/wiki/File:Ttukbaegi-bulgogi.jpg` | **CC0** — hyun chun kim |
| `sundubu-jjigae-still-bubbling.jpg` | Sundubu-jjigae with a raw egg dropped in at the table | `commons.wikimedia.org/wiki/File:Korean_stew-Sundubu_jjigae-05.jpg` | **CC BY-SA 2.0** — titanium22 |
| `ttukbaegi-care-rules.jpg` | EpicKor chart — the three care rules and the one material fact they follow from | Made for this post | — |

**Each photograph is carrying an argument, not decorating a paragraph:**
- The hero shows the **wooden trivets** and a pot visibly bubbling at the table, which is the article's
  opening claim about heat retention, provable in the frame.
- The dolsot shot sits directly under the comparison table so **grey stone against brown clay** is
  settled by looking rather than by adjectives.
- The sundubu shot shows the **raw egg on top**, which is the article's example of residual heat doing
  the cooking after the pot leaves the stove.

**A watermark was removed.** The hero as published on Commons carries a third-party site's watermark
in the lower strip. The bottom 60px are cropped before resizing — the licence permits use, but there is
no reason to publish another site's mark on ours, and the crop costs nothing compositionally.

**Cross-post uniqueness:** all four Commons files were checked against every existing
`image-sources.md` before download and none had been used. Korean stew photographs are a category we
already draw on heavily, so this check mattered more here than usual.

**Technical note:** the generator is `.tmp/make-433-assets.mjs`. It deletes its `src-` originals on
success, and every stage is guarded with `fs.existsSync` so a re-render to fix a layout bug does not
crash — the same pattern as posts 430 and 432. Commons search titles must be taken from the API rather
than guessed: `Ttukbaegi bulgogi` alone matches five distinct files with different licences.

**Size:** 117 + 148 + 119 + 110 + 71 = 565KB for the post, across five images.
