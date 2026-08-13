# Image sources — Blog 382 (Korean emergency alerts vs civil defence sirens)

The article's whole argument is that two systems get confused, so the images had to
show **two different things**: the street, and the phone. A generic Seoul photo would
have failed that on its own terms.

## 1. `civil-defence-drill-vehicle-control.jpg` (hero, ogImage)

- **Source:** https://commons.wikimedia.org/wiki/File:2012.8.22_제389차_민방위훈련_Rep.of_Korea_Civil_Defense_traing_(7842571192).jpg
- **Author:** 대한민국 국군 / Republic of Korea Armed Forces (official MND Flickr, `flickr.com/photos/kormnd`)
- **Licence:** CC BY-SA 2.0
- **Original:** 2927x1684. Delivered 1400x806, 245 KB.
- **Why this one:** the file's own description says soldiers of the 56th Division are
  controlling vehicles at the north end of Hannam Bridge **during a nationwide civil
  defence drill** — i.e. it is a photograph of the exact event the article describes,
  taken by the organising institution. Four soldiers, red batons, an empty road,
  stopped traffic behind. Nothing on Pexels or Unsplash shows this.
- The frame carries an MND Defense Media Agency watermark. Left as-is: it is an honest
  credit on an official image, and cropping it out would misrepresent provenance.

## 2. `sejong-daero-traffic.jpg`

- **Source:** https://commons.wikimedia.org/wiki/File:Sejongno_in_Jongno-gu_2012.jpg
- **Author:** Michaela den
- **Licence:** CC BY-SA 3.0
- **Delivered:** 1166x778, 114 KB (original is only 1166x778 — not upscaled).
- **Why this one:** 2026's vehicle-control section is **one stretch of Sejong-daero in
  Jung-gu**, and this shows that road looking north to Gwanghwamun with the Yi Sun-sin
  statue. The reader can place themselves on it.
- **Rejected first:** `Sejongno, Jongno-gu, Seoul, South Korea - panoramio (11).jpg`
  (CC BY 3.0, 4649x3114) was downloaded and inspected — despite the filename it is a
  photograph of **Gwanghwamun Gate and the changing of the guard**, not the road.
  Higher resolution, wrong subject. Do not re-fetch it for this purpose.

## 3. `emergency-ready-app-seoul-official.jpg`

- **Source:** screenshot of https://english.seoul.go.kr/service/living/disaster-evacuation-tips-citizens/emergency-ready-app/
- **Captured:** 2026-08-13, headless Chromium at 1280x1000, `.tmp/shot-emergency-app.py`
- **Delivered:** 1400x1094, 181 KB.
- **Why a screenshot:** the Blog Reference Image Standard asks for the real interface
  when an article tells a reader to install something. This is Seoul's own English
  government page, showing the app's feature cards and QR download codes.
- It is also a **source**, not just an illustration: the "22 languages" figure in the
  article is read off this page, which contradicted a secondary source claiming five.

## Note on the throwaway browser

The screenshot script launches a **fresh headless Chromium**, deliberately not the
`epickor-meta` persistent profile. A 2026 incident logged in memory — a throwaway
profile plus a Google login syncing eighteen extensions into %TEMP% — is the reason
this is stated rather than assumed. No login, no profile, no state.

## Checks run

- **Cross-post uniqueness:** all three first use on this site. The two Commons files
  are recorded by full URL; `audit-image-uniqueness.mjs` keys off Pexels/Unsplash
  `photos/{id}` patterns and does not cover Commons or screenshots.
- **Korea-first:** ROK military personnel on a Korean road, a named Seoul street, and
  a Korean government website.
- **Size:** 114-245 KB each, 541 KB for the post.
- **Captions:** each states what the photograph shows and credits the source. The hero
  caption names the drill and the bridge rather than implying it was shot in 2026.
