# EpicKor Issues Post Playbook

Last updated: 2026-07-10

## Positioning

`Issues` is EpicKor's timely Korea-context section. It should not become a raw breaking-news desk or a thin daily news roundup. Its job is to turn current Korean politics, business, platform, society, culture, or trend stories into readable, durable posts with a clear timestamp.

The reader promise:

- What is happening as of the stated date.
- Why Korea is talking about it now.
- What background a foreign reader needs.
- Why this timing matters.
- What may change after the post date.

The difference from normal EpicKor posts is not length or quality. The difference is time sensitivity: an Issues post is a proper blog article anchored to a specific current moment.

## URL Strategy

### MVP

Keep the existing stable publishing path:

- Section hub: `/issues`
- Individual issue posts: `/blog/{numeric-slug}`
- Example title: `South Korea's Fake-News Law Explained: What Changed In July 2026`
- Example canonical URL for now: `/blog/286`

This keeps the current blog pipeline, sitemap, preview, publishing, analytics, and internal-link behavior intact while the format is still being validated. It also means each issue post must be substantial enough to sit beside normal EpicKor posts.

### Later, If The Format Works

After 2-3 weeks of Issues publishing and GA4/GSC review, consider a dedicated route:

- Timely issue explainer: `/issues/south-korea-fake-news-law-july-2026`
- Evergreen issue explainer: `/issues/south-korea-fake-news-law-explained`

Do not add this route until the section has enough volume and a clear editorial pattern.

## Format

Use one main issue per post. Do not combine 3-6 unrelated stories into one post unless the post is explicitly framed as a weekly roundup.

## Topic Discovery Rule

Before drafting an Issues post, do not jump directly to one recommended topic.

Discovery workflow:

1. Check representative Korean domestic news from today through the previous three days.
2. Build a 10-topic candidate list across politics, society, economy, business, tech/platform, culture, lifestyle, and public safety.
3. For each topic, include:
   - Working title.
   - What happened.
   - Why it may fit EpicKor.
   - Risk or reason to skip.
   - Source links.
4. Present the 10-topic list to the representative.
5. Draft only after the representative selects one topic.

This keeps topic choice editorially grounded and avoids forcing an issue that feels too narrow, too political, or too detached from EpicKor's audience.

Recommended length:

- Normal Issues post: 1,100-1,600 words.
- High-stakes politics/legal/business post: 1,500-2,000 words if needed.
- Shortest acceptable Issues post: about 900 words, only when the issue is narrow and well sourced.

Recommended structure:

```md
---
title: "South Korea's Fake-News Law Explained: What Changed In July 2026"
slug: "286"
date: "2026-07-10"
visibility: "private"
publishAt: ""
description: "A July 2026 explainer on South Korea's fake-news law, platform pressure, media-freedom concerns, and why it matters outside Korea."
ogImage: "/assets/images/posts/286/korea-briefs-desk.jpg"
tags: ['KoreanPolitics', 'KoreanMedia', 'KoreanTrend', 'SouthKorea', 'Issues']
author: "EpicKor"
---

**This article is written from a July 10, 2026 perspective.** Korean policy, court cases, market moves, and platform responses may change after publication.

## Quick Answer

...

## What Changed This Week

...

## Why Korea Is Talking About It Now

...

## The Background Foreign Readers Need

...

## What Could Change Next

...

## Date Check

As of July 10, 2026, this is the practical read. If a court ruling, ministry notice, company filing, or platform policy changes after this date, the story should be updated or followed with a new Issues post.
```

## Date Stamping Rule

Every Issues post should make its time basis obvious in three places:

1. Top: first 150 words include `This article is written from a [Month Day, Year] perspective`.
2. Middle: one section repeats `as of [date]` when explaining what is settled versus still moving.
3. Bottom: a `Date Check` or `What Could Change Next` section states what could change after publication.

## Source Rules

For current-events posts, every article needs reliable sourcing before drafting, not after. Sensitive politics, legal, medical, safety, or financial topics need at least two reliable sources when possible.

Preferred source ladder:

1. Official Korean government, court, regulator, company filing, exchange, or institution.
2. Major wire or reliable international outlet: AP, Reuters, Bloomberg, Financial Times, Wall Street Journal.
3. Established Korea English outlet: Yonhap English, Korea Herald, Korea JoongAng Daily, Korea Times.
4. Korean-language source only when it adds primary/local detail and can be clearly interpreted.

Avoid:

- Unverified social media claims.
- Single-source allegations without clear labeling.
- Overconfident takes on live legal, medical, safety, or financial issues.
- Investment advice language.

## Editorial Tone

Use clear English and neutral framing. The voice can be sharp, but not partisan.

Good:

- `The bigger signal is not only the ruling. It is how Korea's institutions are drawing boundaries after the martial-law crisis.`

Avoid:

- `This proves one party is right.`
- `Investors should buy.`
- `Korea is collapsing.`

## Monetization

Most Issues posts should be light on affiliate CTAs. Use either:

- No visible affiliate CTA when the topic is highly sensitive politics, law, tragedy, public safety, or allegations.
- One late, subtle research-kit CTA for business/market trend posts.

Do not place hard-sell product boxes inside political/legal briefs.

## Publishing Rule

For the first two weeks:

- Publish 2-3 Issues posts per week, not necessarily daily.
- Each post should cover one issue well.
- Use Issues for timeliness, not thinness.
- Review GA4 engagement, `/issues` clicks, scroll depth, affiliate clicks where relevant, and GSC impressions after 2-3 weeks.

If the format feels alive and manageable, increase frequency without reducing depth.
