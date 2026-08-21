# Image Sources - Blog 006

## Selected Images

- `seoul-bike-station-sinseoldong.jpg` — Wikimedia Commons
  `File:Bicycle-sharing station in Seoul Sinseol-dong.jpg`, photo by Sarang, **public domain**.
  A 따릉이 (Seoul Bike) dock outside 신설동역 exit 8, with the station sign, road signage and a rack
  of the green-and-white hire bikes in frame. Added 2026-08-22.

## 2026-08-22 — this post borrows images from other posts' folders

Blog 006 referenced **three images, none of them its own**: `posts/141/`, `posts/147/` and
`posts/248/`. That breaks the cross-post image uniqueness rule, and it is invisible to
`npm run audit:image-uniqueness`, which parses Pexels-style `photos/{id}` URLs out of
`image-sources.md` and never looks at which folder a path points into.

It surfaced by accident. While refreshing 248 the generated running-crew image there was deleted,
and `audit:image-context` immediately reported a **critical MISSING_ASSET against slug 006** — a
post nobody was working on. That is the only reason anyone found out.

The borrowed image has been replaced with the photograph above, which is also a better fit: the
old one showed a running crew on a riverside path under a caption about station-area bicycle
parking.

**Still outstanding on this post**: `posts/141/han-river-bike-path-seongsu-bridge-pexels.jpg` and
`posts/147/seoul-couple-cycling-pexels.jpg` are still borrowed. They are not broken, so they were
left rather than expanding an unrelated refresh — but they should get their own files.

A site-wide scan on 2026-08-22 found the pattern is contained: **6 posts, 19 borrowed references**
(`002`, `006`, `023`, `024`, `025`, `170`), all but one of them early low-numbered posts.
