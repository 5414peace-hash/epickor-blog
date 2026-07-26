# Reel 311 Clip Sources — RESOLVED

Status: **buildable.** No vertical tteokbokki footage exists, but enough genuinely Korean street-food
video does. The Reel was restructured so video carries place and motion while verified stills carry
the tteokbokki proof. Final mix: **4 video / 3 stills = 57% video-led**, meeting the >=50% standard
set by the representative on 2026-07-21.

## Selected

| Cut | Source | Type | Role |
| ---: | --- | --- | --- |
| 1 | Pexels 20672042 | video | Hotteok on a street griddle. Real cooking motion and steam; opens on Korean street food. |
| 2 | Blog 311 card image `card_01` | still | Classic tteokbokki tray with Korean packaging text. Subject introduction. |
| 3 | Pexels 11556562 | video | Korean eomuk skewers in broth. The bunsik family around tteokbokki. |
| 4 | Blog 311 card image `card_05` | still | Rabokki. The escalation beat. |
| 5 | Blog 311 card image `card_06` | still | Soy-glazed tteokbokki, no chili. **The reveal.** |
| 6 | Pexels 36718309 | video | Seoul arcade market, Korean signage, crowd motion. |
| 7 | Pexels 37814437 | video | Beomsan Market signage. Outro. |

Stills use restrained push-in only. Cuts 4 and 5 are the only consecutive stills; no three stills run
in a row.

## Search coverage

10 portrait queries, 29 unique candidates:
`tteokbokki`, `tteokbokki cooking`, `korean rice cake spicy`, `korean spicy rice cakes street food`,
`bunsik korean snack`, `gochujang stir fry`, `cheese pull food`, `korean ramyeon noodles`,
`korean street food market seoul`, `korean food cooking pan`.

## Inspected and rejected

| ID | Query | What it actually is | Verdict |
| --- | --- | --- | --- |
| 6221668 | tteokbokki | Italian pasta drained into tomato sauce, Western kitchen | Reject — wrong dish and country |
| 30776422 | tteokbokki | Oden-style fish cake and fried tofu in broth, no rice cake | Reject — reads as Japanese oden |
| 37876501 | tteokbokki cooking | Deep-frying yellow fritters, MODENA stove, SE Asian kitchen | Reject — wrong dish and country |
| 33845162 | korean ramyeon noodles | Indonesian Indomie Mi Goreng packets | Reject — country mismatch |
| 11556562 | korean rice cake spicy | Korean eomuk skewers in broth | Korean, but not tteokbokki |
| 35196990 | korean rice cake spicy | Korean hansik banchan spread, near-static overhead | Korean, but off-topic and low motion |

Zero of the inspected candidates show tteokbokki. The pattern matches the rejection list already
recorded in `output/reels/302/clip-sources.md` ("Indonesian instant noodles... rejected for country
mismatch"), so this is a known failure mode of the query, not a one-off.

## Possibly usable for other topics

Portrait 30fps Seoul market footage exists and is genuinely Korean: `36718309`, `37203915`,
`37814437`, `38489828`. These support a street-food or market topic, not a tteokbokki explainer.

## Why this blocks the Reel

`CLAUDE.md` requires true 9:16 material and forbids simulating vertical quality with zooms on stills;
"excessive still-image zooms" is a Reels 2.1 hard reject. A tteokbokki Reel whose four core cuts are
scaled photographs fails that gate regardless of how good the script and ONS are.

## Options put to the representative 2026-07-21

1. Shoot it. Tteokbokki is trivially filmable and Tripclip has production capability. Yields
   EpicKor-owned footage no competitor has and permanently removes this dependency.
2. Switch the Reel topic to one where verified Korean vertical footage already exists.
3. Licensed Korean stock outside Pexels.
4. AI generation is not viable here: CLAUDE.md prohibits generated food handling and Korean
   packaging, and caps generated material at 25% of cuts.
