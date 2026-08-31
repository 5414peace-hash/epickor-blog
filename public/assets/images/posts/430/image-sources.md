# Blog 430 — Korean Yuja Tea — image sources

Two Wikimedia Commons photographs plus one EpicKor chart. **Pexels and Unsplash were checked first
and produced nothing usable** — searches for `citron tea`, `yuzu tea` and `marmalade jar` returned
lemonade, lemon tea and orange marmalade only. Under the Blog Reference Image Standard those are
hard rejects for an article that names a specific product, so the waterfall moved on to Commons.

| File | What it shows | Source | License / credit |
|---|---|---|---|
| `korean-yuja-tea-in-cafe-mug.jpg` | A served cup of yuja tea in a ceramic cafe mug, shredded peel visible in suspension | `commons.wikimedia.org/wiki/File:Korean_yuja_tea.jpg` | **Public domain** — Drew Lietzow |
| `yuja-citrus-junos-fruit.jpg` | Ripe yuja (*Citrus junos*) on the branch | `commons.wikimedia.org/wiki/File:Citrus_junos_fruits.jpg` | **CC BY 4.0** — 경빈마마 |
| `yuja-tea-jar-label-math.jpg` | EpicKor chart — 1kg jar broken into 40% fruit / 40% preserve sugar / 15% added sugar / 5% pear purée, with the front-of-jar 80% bracketed | Made for this post | Figures read from the product's own 원재료명, cited in the article |

**Why the fruit photo earns its place rather than decorating.** The article's opening correction is
that yuja is *Citrus junos* (= yuzu) and not a citron (*Citrus medica*). A photograph filed on
Commons under the species name is the direct reference for that claim, not a mood shot.

**Chart notes for the next person:**
- Generator is `.tmp/make-430-assets.mjs`, written to be **idempotent** — it deletes the downloaded
  originals after optimising, so the re-run needed to fix the chart would otherwise crash on the
  missing sources. Guarded with `fs.existsSync`.
- **The first render collided its last two captions** (`Sugar added separately` ran into
  `Pear purée`) — the same class of bug as posts 426, 428 and 429. Narrow segments now drop their
  caption to a lower row with a leader line. **This is only visible by opening the rendered JPEG;
  no script catches it.** Open the file every time.

**Cross-post uniqueness:** neither Commons file appears in any other post's `image-sources.md`,
checked before download. These are not stock-library photos, so no Pexels/Unsplash photo ID applies;
the Commons file page URLs above are the identifiers to check against.

**Size:** 84 + 43 + 61 = 188KB for the post.
