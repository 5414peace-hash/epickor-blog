# Blogs 083/084/085 Content-Debt Rewrite Review - 2026-07-18

## Scope

Rewrote the next high-priority legacy batch:

- Blog `083`: Ssamjang / Korean BBQ wrap sauce
- Blog `084`: Korea travel cheat codes by interest
- Blog `085`: K-brand / Hallyu soft-power explainer

## Editorial Changes

- `083` was rebuilt from a short sauce essay into a practical ssamjang guide covering ingredients, ssam etiquette, Korean BBQ use, buying tips, label cautions, home uses, tables, FAQs, images, and two disclosed Amazon CTAs.
- `084` was reframed away from nationality-based travel stereotypes into an interest-based Korea itinerary guide for food, shopping, Hallyu, history, wellness, families, solo travelers, long stays, and business-style visitors.
- `085` was rebuilt from broad K-brand hype into a practical soft-power explainer connecting Hallyu, K-pop, K-drama, K-food, K-beauty, travel, shopping, language, and responsible interpretation of the K-prefix.

## Sources and Trust Notes

- `083` uses official MCST/KOCIS material on Korea's ssam tradition and VisitKorea material on Korean seasonings.
- `084` uses current tourism context from official/trade reporting, including MCST/KTO-linked inbound tourism figures and Korea.net reporting.
- `085` uses MCST/KOFICE Hallyu survey context, Korea.net national overview material, and the Academy of Korean Studies explanation of the Korea/Goryeo name origin.

## Internal Link Pass

Added reverse links:

- To `083`: from `050`, `299`
- To `084`: from `026`, `169`
- To `085`: from `002`, `291`

## Automated Review

- `083`: 100/100, 1,846 words, 8 H2, 3 images, 6 FAQ Q&A
- `084`: 100/100, 1,845 words, 8 H2, 3 images, 6 FAQ Q&A
- `085`: 100/100, 1,843 words, 8 H2, 3 images, 6 FAQ Q&A

Sitewide checks:

- `npm.cmd run audit:seo-aeo`: pass, average `89/100`
- High-priority posts: `29 -> 26`
- Low-internal-linking: `64 -> 61`
- Thin content: `63 -> 60`
- Missing FAQ: `57 -> 54`
- Stale posts: `56 -> 53`
- `npm.cmd run audit:amazon-links`: pass
- `npm.cmd run build`: pass, 359 static pages generated
- `git diff --check`: pass; only expected Windows LF/CRLF warnings

## Deployment

- Implementation commit: `da6d0e0f` (`Rewrite ssamjang travel and K-brand posts`)
- Vercel deployment: `dpl_GQpGZftJtozRvysyxeLSZbcKeSB7`
- Deployment URL: `https://epickor-blog-dadosaew5-yhs-projects-5de403d3.vercel.app`
- Status: Ready
- Aliases verified: `https://www.epickor.com`, `https://epickor.com`, `https://epickor-blog.vercel.app`

## Public QA

Public page checks passed:

- `https://www.epickor.com/blog/083`: HTTP 200, expected title marker, affiliate CTA marker, table marker, FAQ marker
- `https://www.epickor.com/blog/084`: HTTP 200, expected title marker, affiliate CTA marker, table marker, FAQ marker
- `https://www.epickor.com/blog/085`: HTTP 200, expected title marker, affiliate CTA marker, table marker, FAQ marker

Sitemap checks passed:

- `/blog/083`
- `/blog/084`
- `/blog/085`

Public reverse-link checks passed:

- `050 -> /blog/083`
- `299 -> /blog/083`
- `026 -> /blog/084`
- `169 -> /blog/084`
- `002 -> /blog/085`
- `291 -> /blog/085`

## Notes

- Preserved unrelated untracked file: `reports/business-gsc-affiliate-check-2026-07-17.md`
- No Reels or card-news production was started.
