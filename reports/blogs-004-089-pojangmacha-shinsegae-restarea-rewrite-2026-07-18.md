# Blogs 004/012/089 Content-Debt Rewrite Review - 2026-07-18

## Scope

Rewrote the next high-priority legacy batch:

- Blog `004`: Chung Yong-jin and Shinsegae public-facing leadership
- Blog `012`: Korean highway rest areas / hyugeso
- Blog `089`: Korean pojangmacha street tent food and etiquette

## Editorial Changes

- `004` was rebuilt from an older "influencer chairman" essay into a current, sourced guide to Chung Yong-jin, Shinsegae Group, E-Mart, Starbucks Korea, public owner-executive leadership, chaebol visibility, and reputation risk.
- `012` was rebuilt from a broad rest-area praise article into a practical Korean highway rest area guide covering food, facilities, bus-tour timing, payment, EV/rest-complex context, family safety, and itinerary use.
- `089` was rebuilt from a romanticized outdoor drinking essay into a practical pojangmacha guide covering what to order, drinking etiquette, Seoul areas, payment, seasonality, filming manners, and safety.

## Sources and Trust Notes

- `004` uses Shinsegae Group newsroom, Yonhap, Forbes, and Shinsegae governance/current-leadership context. It avoids presenting social-media personality as proof of business performance.
- `012` uses Korea.net/Korea Expressway Corporation food coverage, Korea.net rest-stop culture context, MOLIT smart rest complex information, and current 2026 rest-area policy direction.
- `089` uses Korea.net/K-InfoHub and Visit Seoul context on night markets, street food tents, and Jongno 3-ga pojangmacha culture.

## Internal Link Pass

Added reverse links:

- To `089`: from `060`
- To `004`: from `085`, `059`
- To `012`: from `084`, `026`

## Automated Review

- `089`: 100/100, 1,802 words, 7 H2, 3 images, 6 FAQ Q&A
- `004`: 100/100, 1,806 words, 7 H2, 3 images, 6 FAQ Q&A
- `012`: 100/100, 1,839 words, 8 H2, 3 images, 6 FAQ Q&A

Sitewide checks:

- `npm.cmd run audit:seo-aeo`: pass, average `90/100`
- High-priority posts: `26 -> 23`
- Low-internal-linking: `61 -> 58`
- Thin content: `60 -> 57`
- Missing FAQ: `54 -> 51`
- Stale posts: `53 -> 50`
- `npm.cmd run audit:amazon-links`: pass
- `npm.cmd run build`: pass, 359 static pages generated
- `git diff --check`: pass; only expected Windows LF/CRLF warnings

## Deployment

- Implementation commit: `89cd086e` (`Rewrite pojangmacha Shinsegae and rest area posts`)
- Vercel deployment: `dpl_DFDx21FxvapX7Xg3M5hyrgVTfDWk`
- Deployment URL: `https://epickor-blog-1c9brxxh5-yhs-projects-5de403d3.vercel.app`
- Status: Ready
- Aliases verified: `https://www.epickor.com`, `https://epickor.com`, `https://epickor-blog.vercel.app`

## Public QA

Public page checks passed:

- `https://www.epickor.com/blog/089`: HTTP 200, expected title marker, affiliate CTA marker, table marker, FAQ marker
- `https://www.epickor.com/blog/004`: HTTP 200, expected title marker, affiliate CTA marker, table marker, FAQ marker
- `https://www.epickor.com/blog/012`: HTTP 200, expected title marker, affiliate CTA marker, table marker, FAQ marker

Sitemap checks passed:

- `/blog/089`
- `/blog/004`
- `/blog/012`

Public reverse-link checks passed:

- `060 -> /blog/089`
- `085 -> /blog/004`
- `059 -> /blog/004`
- `084 -> /blog/012`
- `026 -> /blog/012`

## Notes

- Preserved unrelated untracked file: `reports/business-gsc-affiliate-check-2026-07-17.md`
- No Reels or card-news production was started.
