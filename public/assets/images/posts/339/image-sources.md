# Image sources for Blog 339 (Squid Game Filming Locations)

All four images show real, visitable places connected to Netflix's Squid Game, not the show's sets,
props, costumes, or any official promotional stills. No copyrighted show material was downloaded or
used. All four were sourced from Wikimedia Commons and independently license-checked; none of the
exact files below appear in any other post's `image-sources.md` (checked via grep across
`public/assets/images/posts/*/image-sources.md` and `public/assets/images/business/*/image-sources.md`
before download).

- `ifc-mall-yeouido.jpg` (hero/og) - Wide river-level view of the Yeouido financial district skyline
  from across the Han River, showing the Parc.1 twin towers (red-striped) and the Three IFC / IFC
  Mall tower cluster where Squid Game's Season 1 finale confrontation was filmed. Wikimedia Commons,
  photographer "S h y numis," taken March 26, 2024, license CC BY 4.0:
  https://commons.wikimedia.org/wiki/File:Skyline_of_Yeouido,_a_prominent_finance_district_in_Seoul.jpg
- `yangjae-citizens-forest-station.jpg` - Entrance/exit 3 of Yangjae Citizen's Forest Station
  (Sinbundang Line), with the Korean/English station name sign "양재시민의 숲 (매헌) / Yangjae Citizen's
  Forest (Maeheon)" clearly legible on the canopy — the actual, publicly reachable subway station
  used in the show. Wikimedia Commons, photographer Piotrus, taken October 13, 2013, license
  CC BY-SA 3.0: https://commons.wikimedia.org/wiki/File:Yangjae_Citizens%27_Forest_Station_01.JPG
- `namsan-park.jpg` - N Seoul Tower rising above the wooded Namsan hillside, photographed from inside
  Namsan Park, the real public park where Episode 2 outdoor scenes were shot. Wikimedia Commons,
  photographer FLASHPACKER TRAVELGUIDE (via Flickr, transferred to Commons), taken November 26,
  2017, license CC BY-SA 2.0:
  https://commons.wikimedia.org/wiki/File:N-Seoul-Tower_and_Namsan_Park_(26876783888).jpg
- `studio-cube-daejeon-exterior.jpg` - Exterior grounds view at Daejeon Expo Science Park (480
  Daedeok-daero, Yuseong-gu, Daejeon), showing the park's Hanbit Tower, the Expo Bridge, and the
  southern-plaza gate structure. This is the public exterior of the science-park complex where the
  Studio Cube soundstage (the actual building where the game sets were built) is located; no interior
  or set photography is used, only the publicly visible park exterior. Wikimedia Commons,
  photographer Yoo Chung, taken April 29, 2007, license CC BY-SA 3.0:
  https://commons.wikimedia.org/wiki/File:Gate,_bridge,_and_tower_at_Daejeon_Expo_Science_Park.jpg

## Locations considered and dropped

- **Incheon International Airport** - well photographed on Commons/Pexels, but existing Pexels/Commons
  files are already used across Blogs 026, 205, and 257; a genuinely new airport angle wasn't needed
  once four strong non-duplicate location photos were secured, so it was dropped in favor of keeping
  the set focused on the four most visually distinct, unambiguous filming-adjacent locations.
- **Wolmi Theme Park (Wolmido, Incheon)** - Commons has photos of Wolmi-do generally (Wolmi Sea Train,
  Eunha Rail, park entrance, promenade, sunset shots) but no clear photo of the theme-park ride area
  itself (the actual amusement rides referenced in the show, e.g. Viking ship/flying chair-type
  attractions) at a usable resolution/angle. Rather than force a generic Wolmido waterfront shot that
  doesn't clearly read as "the theme park," this location was dropped in favor of the four confirmed
  strong images above.

## Verification notes

- All four source files were downloaded via Commons `Special:FilePath` (width=1600) and verified with
  the `file` command to be genuine JPEG image data (not HTML error pages) before optimization.
- All four were opened and visually inspected at full size: the Yeouido skyline clearly shows the
  Parc.1/Three IFC tower cluster with river reflection (strong hero shot); the Yangjae station photo
  has the station name sign in frame for unambiguous identification; the Namsan photo shows N Seoul
  Tower plus the park's observatory building and walking paths; the Daejeon Expo Science Park photo
  shows Hanbit Tower, the Expo Bridge, and the plaza gate together.
- Optimized with `sharp` (mozjpeg, resized to 1600px width, quality 58-82 as needed per source) to
  255-297 KB each, within the 150-300 KB working target and well under the 400 KB site ceiling.
- Downloaded and processed 2026-07-30.
