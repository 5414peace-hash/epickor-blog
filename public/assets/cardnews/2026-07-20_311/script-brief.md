# EpicKor Card News Brief - 311

## Target

- Topic: Tteokbokki Guide 2026: Types, Spice Levels, and How to Order
- Source draft: `output/drafts/311_draft.md`
- Script path to create manually: `output/cardnews/2026-07-20_311/script.md`
- Render command after writing:
  `python .claude/skills/cardnews/scripts/html-to-png.py --slug 311`

## Best Source Sections

1. What Is Tteokbokki, Really?
   **Tteokbokki (떡볶이)** refers to Korean rice cakes simmered in a seasoned sauce, most famously a sweet-and-spicy red sauce built on **gochujang** (fermented chili paste) and gochugaru (chili flakes). The name literally combines *tteok* (rice cake) and *bokki* (from *bokkeum*, "stir-fried"), though today most versions are

2. The Main Types You'll See on Menus
   Once you know the base, the variations make sense. Here are the styles you're most likely to meet in 2026, from the classic to the crowd-pleasers. <div class="table-scroll"> <table> <thead><tr><th>Style</th><th>What's In It</th><th>Taste</th><th>Best For</th></tr></thead> <tbody> <tr><td>Classic gochujang</td><td>Rice 

3. Spice Levels and How to Order
   The number-one question travelers ask is simple: how spicy is it? The honest answer is that street tteokbokki runs from pleasantly warm to seriously hot, and franchise chains now let you pick a level. Standard tteokbokki is spicy but sweet, so the sugar softens the burn — most people who tolerate mild chili are fine wi

4. Where to Eat Tteokbokki in Seoul
   You're never far from tteokbokki in Seoul, but a few options are worth seeking out depending on how much time and appetite you have. **Street stalls and traditional markets** are the classic entry point. Markets like Gwangjang and Namdaemun, plus countless neighborhood corners, sell portions you eat standing up, often 

5. How to Make Tteokbokki at Home
   Tteokbokki is one of the easiest Korean dishes to recreate, which is part of why it travels so well. The base recipe is forgiving: simmer rice cakes in water or anchovy-kelp stock with gochujang, gochugaru, a little soy sauce, and sugar until the sauce thickens and glosses the cakes. Add fish cake, green onion, and a b

6. The Bottom Line
   Tteokbokki earns its status because it's approachable, customizable, and genuinely fun to eat — a chewy, sweet-spicy snack that scales from a one-dollar market cup to a full table spread with friends. Learn the handful of styles, pick your spice level honestly, and you'll never be stuck staring at a kiosk screen. Next 

## Fact Candidates

1. Complete guide to tteokbokki — Korea's iconic spicy rice cakes. Learn about classic, cheese, rosé, and rabokki styles, where to find the best in Seoul, and how to order. (Source: Tteokbokki Guide: Korea's Spicy Rice Cake Street Snack | Knowaboutkorea)
2. Independent stories about Korean culture, food, travel, and everyday life — written in English for anyone curious about the Land of Morning Calm. (Source: Tteokbokki Guide: Every Style, Spice Level, and First Bite)
3. For foreigners visiting or living in Korea, tteokbokki is often one of the first Korean foods encountered — and for many, it becomes an instant obsess (Source: Everything About Tteokbokki: Types, Flavors, and the Best Places to Eat ...)
4. From Sindang-dong's original communal hotpot to market street stalls — a complete guide to Seoul's most beloved street food. Types, top spots, prices, and how to eat it like a local. (Source: Seoul Tteokbokki Guide 2026: Sindang-dong Hotpot, Street Stalls & Best ...)
5. Korea has dozens of tteokbokki chains, but a handful of names dominate every high street from Seoul to Busan. Here&rsquo;s how the big players compare, … (Source: Best Tteokbokki Chains in Korea: A Complete Guide (2026))

## Image Candidates

1. Savory Korean tteokbokki with ramen in a hot and spicy broth, perfect for food lovers. - https://images.pexels.com/photos/32196399/pexels-photo-32196399.jpeg?auto=compress&cs=tinysrgb&w=1200
   Photo by Theodore Nguyen on Pexels

2. Pedestrians waiting at a crosswalk in Suwon-si, showcasing local architecture and culture. - https://images.pexels.com/photos/31971656/pexels-photo-31971656.jpeg?auto=compress&cs=tinysrgb&w=1200
   Photo by Theodore Nguyen on Pexels

3. Delicious spicy stir-fried noodles garnished with sesame seeds and green onions. - https://images.pexels.com/photos/5104185/pexels-photo-5104185.jpeg?auto=compress&cs=tinysrgb&w=1200
   Photo by Diego Concepción on Pexels

## Script Rules

- Create 5-8 cards.
- Card 01 must be a hook cover.
- Final card must include EPICKOR.COM in spirit through the standard closing CTA.
- Keep Main text short: about 10 words per line, using \n where helpful.
- Keep Sub text to 1-3 short lines.
- Use layouts A/B/C/D only.
- Use point_color Gold for cover/emphasis and Teal for explanatory body cards.
- Do not introduce facts that are not in the draft or research data.

## Script Template

```markdown
---
slug: 311
topic: Tteokbokki Guide 2026: Types, Spice Levels, and How to Order
total_cards: 6
---

## Card 01 - Cover
layout: A
point_color: Gold
image_keyword: korean culture

**Main:** [Hook title with \n line breaks]
**Sub:** [Short teaser]

---

## Card 02 - Context
layout: B
point_color: Teal
image_keyword: korea

**Main:** [Short headline]
**Sub:** [Two short lines of insight]

---

## Card 03 - Surprise
layout: D
point_color: Gold
image_keyword: none

**Main:** [One memorable takeaway]
**Sub:** [Why it matters]

---

## Card 04 - How It Works
layout: C
point_color: Teal
image_keyword: korean daily life

**Main:** [Practical explanation]
**Sub:** [Clear supporting context]

---

## Card 05 - What Visitors Miss
layout: B
point_color: Teal
image_keyword: seoul korea

**Main:** [Reader-facing insight]
**Sub:** [Concise explanation]

---

## Card 06 - Closing
layout: A
point_color: Gold
image_keyword: korean culture

**Main:** Want to know more\nabout Korea?
**Sub:** Follow EpicKor for more hidden stories from Korea.

---
```
