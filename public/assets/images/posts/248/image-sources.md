# Image Sources - Blog 248

Post: Seoul Running Crew Culture

## Selected Images

1. `seoul-marathon-runners-pack.jpg` — **ogImage since 2026-08-22.** Wikimedia Commons
   `File:Korea-Seoul International Marathon-02.jpg`, photo by hojusaram, `CC BY-SA 2.0`, shot
   2008-03-16. A real pack of Korean road runners with club vests and Korean lettering visible.
   Illustrates the race-entry statistics section, and gives the article a real photograph as its
   search and social thumbnail.
2. `han-river-dongho-bridge-night.jpg` — Pexels photo `15375822`, O-seop Sim. Real Han River /
   Dongho Bridge at night. Unchanged.
3. `seoul-running-crew-han-river.jpg` — **generated image, owned.** Runners in a loose group on a
   lit riverside path at dusk. See the note below on why this one stays.
4. `yeouido-jogging-track.jpg` — Wikimedia Commons `File:Yeouido Park Jogging Track 201604.jpg`,
   photo by Wpcpey, `CC BY 4.0`, shot 2016-04-15. The rubberised, distance-marked jogging track in
   Yeouido Park — real municipal running infrastructure, which is the point the caption makes.

## 2026-08-22 review — the AI ratio was too high, and the waterfall had not been run

At the previous pass this post carried **four images, three of them generated**, including the
ogImage. The note recorded for that decision said license-safe real running photos "were not strong
enough." That judgment was made after checking stock libraries only. It was not true of the public
archives: Wikimedia Commons holds six real Seoul International Marathon photographs under CC BY-SA,
and real Seoul running infrastructure under CC BY. Neither had been searched.

Changes:

- ogImage moved from a generated crew scene to a **real photograph**. An article now making hard
  factual claims — 1,008,122 race entries, a dated Seocho District regulation, named crews — should
  not be represented in search results by a generated image.
- ~~`seoul-night-run-gear-flatlay.jpg` / `.png`~~ **removed.** Generated gear flatlay. It illustrated
  nothing the text did not already say, and gear flatlays are the easiest kind of image to source
  for real if they are ever wanted.
- ~~`seoul-running-crew-cooldown.jpg` / `.png`~~ **removed.** Generated post-run convenience-store
  scene. Replaced by the real Yeouido track photograph.
- Stray `.png` originals were also deleted. Both the `.jpg` and `.png` of each generated image had
  been committed, so the repo was carrying every one of them twice.

Net: **three real photographs and one illustration**, down from one and three.

## Why one generated image remains

The article's subject is a crew run at night. There is no freely licensed photograph of one — not on
Commons, not in the Korean public archives, and the earlier pass found none on the stock libraries
either. Korea also has strict portrait-rights norms, which is a large part of why candid night-crowd
photography of identifiable people does not circulate freely.

That is the case `CLAUDE.md` describes when it permits a generated image: a fallback where a direct
real reference cannot be used safely or clearly. The caption says plainly that it is an illustration
and points the reader to the sources, rather than implying it documents a specific crew or evening.

## Duplicate check

`seoul-marathon-runners-pack.jpg` and `yeouido-jogging-track.jpg` are the first use of those Commons
files anywhere in the repo (checked 2026-08-22). Note that
`scripts/audit-image-uniqueness.mjs` parses Pexels-style `photos/{id}` URLs and does not see Commons
files, so this had to be checked by filename.
