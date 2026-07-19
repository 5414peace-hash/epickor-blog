# Card News And Social Funnel Update - 2026-07-19

Checked at approximately 22:17 KST.

## GA4 live signal

- The EpicKor GA4 Realtime overview showed `social_channel_click` with `2` events in the previous 30 minutes.
- The live report also showed `3` active users and `10` page views during that window.
- The site sends `platform` and `location` parameters with the event. The realtime summary confirmed the event itself; platform/location breakdown should be reviewed after standard reporting has processed enough traffic.

## External profile-link cleanup

- Instagram profile `@epickorsnippets` correctly points to `https://litt.ly/epickor`; that public bio URL was retained.
- Littly had two buttons still targeting the removed `https://www.epickor.com/instagram` route.
- `Start here from Instagram` was renamed to `Browse EpicKor Card News` and now targets `/card-news` with Littly/Instagram UTM parameters.
- `Korea trip setup` now targets `/travel` with its existing Littly/Instagram campaign context.
- The public Littly page was reloaded after saving and contained zero `epickor.com/instagram` targets.

## Card News archive UX

- Added topic filters for All, Travel, Food & Shopping, Beauty & Lifestyle, Culture, and Business.
- Added Newest and Oldest sorting, a live result count, pressed-state accessibility, and click analytics on filters, sorting, and archive items.
- Corrected category precedence so explicit Business and Beauty/Lifestyle topics are not swallowed by generic Seoul, shopping, or travel keywords.
- Desktop `1440x1000` and mobile `390x844` QA passed with no page-level horizontal overflow. The mobile topic row scrolls horizontally inside its own container.
- Business filtering returned only Business cards; Oldest sorting placed `/card-news/071` (`Apr 30, 2026`) first.
- Scoped lint passed with zero errors and warnings. The production build passed `368/368` static pages.
