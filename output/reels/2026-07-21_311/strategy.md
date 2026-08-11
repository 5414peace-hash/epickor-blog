# Reel 311 Strategy - "The Red One Isn't The Original"

First Reel built under **Reels 2.2** (2026-07-21): no payoff motion card, scene quota dropped,
visual hook required, encoding floor enforced.

## Source Gate

- Source: Blog 311, `Tteokbokki Guide 2026: Types, Spice Levels, and How to Order`
- Public URL: `https://www.epickor.com/blog/311` — verified HTTP 200 on 2026-07-20
- Status: published, deployed, publicly verified before Reels production.
- Fact boundary: gungjung tteokbokki (soy-based, no chili) is the older court form and the spicy
  street version spread later. State this as food history, not a dated claim. Do not assign a
  specific year or credit a single inventor on screen.

## Target Viewer

An English-speaking viewer who has seen tteokbokki once — red, spicy, photogenic — and assumes that
is simply what the dish is. They have never considered that the red version is the newer one.

## Reels Viral Fit Score: 91/100

| Category | Score | Reason |
| --- | ---: | --- |
| Curiosity gap | 24/25 | "The red one isn't the original" contradicts the only version most viewers know. |
| Outsider surprise | 20/20 | Corrects a near-universal assumption about a famous Korean dish. |
| Visual immediacy | 20/20 | Sauce, cheese pull, ramyeon lift, and brown soy sauce all read in under a second. |
| Emotional stakes | 12/15 | Lower than an etiquette trap, but "you've been ordering one of six" lands. |
| Share/save usefulness | 8/10 | Saveable as an ordering cheat, though the payoff is a reveal, not a checklist. |
| EpicKor funnel fit | 7/10 | The guide covers all six styles plus spice levels. |

Decision: produce. Lead asset for the next 3-Reel batch.

## The One Idea

**Tteokbokki is not one dish, and the version everyone knows is the newest one.**

Everything in the Reel proves that single sentence. Nothing else gets screen time. If a beat does not
push that idea forward, it is cut.

## Hook System

Thumbnail directions:

1. Mystery: `NOT THE ORIGINAL`
2. Mistake: `YOU KNOW ONE OF SIX`
3. Decision: `RED OR NO CHILI?`

Selected: **Mystery — `NOT THE ORIGINAL`**, over a macro of the red sauce being stirred.

Spoken opening options:

1. `This is the tteokbokki everyone knows. It's also the newest one.`
2. `You've probably only had one kind of tteokbokki.`
3. `The red one came last. Here's what came first.`

Selected: **option 1.** It shows the familiar thing, then immediately destabilizes it.

First-frame requirement: macro of red gochujang sauce moving on rice cakes with visible steam. The
claim's evidence is on screen before any text appears. No static plate, no title card, no logo open.

## Text Layers

Three layers run, and they are not the same thing. Removing the motion card removed a *board*, not text.

| Layer | Where | Rule |
| --- | --- | --- |
| **ONS** (designed) | All 6 cuts | 3-5 words, heavy condensed uppercase, ends at or above `y=1340`. Carries the argument. |
| **Narration (VO)** | Cuts 1-5 | Cut 6 is intentionally silent so the outro lands on image. |
| **Narration captions** | Whole Reel | Single lower lane, below `y=1340`. Never overlaps ONS. |

ONS copy is deliberately tight. The reveal cut states the surprise outright (`THE FIRST ONE / HAD NO
CHILI`) rather than delaying it, because the viewer is looking at brown sauce at that moment and the
text should confirm what they are seeing.

ONS mockups composited at 1080x1920: `output/reels/311/ons-mock/cut_0N.jpg`.

## Structure — 3 Acts, 6 Cuts, No Motion Card

The payoff is a **visual reveal**: the final tteokbokki on screen is brown, not red. The viewer sees
the twist rather than reading it on a board.

**Rebuilt 2026-07-21 around available footage, not the other way around.** The original plan assumed a
cheese pull and a noodle lift; neither exists as sourceable vertical footage, so those beats were
removed rather than faked with zooms.

| Act | Cut | Time | Media | Beat / ONS |
| --- | ---: | ---: | --- | --- |
| 1 Hook | 1 | 0.0-4.0 | video | Hotteok griddle sizzling. `KOREAN STREET FOOD` |
| 1 Subject | 2 | 4.0-8.0 | still | Classic tteokbokki appears. `YOU KNOW THIS ONE` |
| 2 Escalation | 3 | 8.0-12.5 | video | Eomuk skewers. `IT NEVER EATS ALONE` |
| 2 Escalation | 4 | 12.5-16.5 | still | Rabokki. `THEN IT GOT BIGGER` |
| 2 Reveal | 5 | 16.5-22.5 | still | Soy tteokbokki, no red. `THE FIRST ONE / HAD NO CHILI` |
| 3 Payoff | 6 | 22.5-27.5 | video | Seoul market. `SIX VERSIONS. ONE RICE CAKE.` |
| 3 Outro | 7 | 27.5-30.5 | video | Beomsan Market sign. `DON'T ORDER BLIND` + `epickor.com` chip |

Media mix: **4 video / 3 stills = 57% video-led.** Duration **30.5s**.

**Why 30.5s and not 37.5s.** The first cut plan used 37.5s, which was a template number, not a
content decision. Measured narration is 16.4s across three TTS parts, so 37.5s would have left 21s of
silence — a 35% speech density with dead air a viewer would drop out of. At 30.5s the density is 54%
and the silence that remains sits where it was designed to: just before the reveal line. This is the
Reels 2.2 rule working as intended — content decides duration.

## Narration Parts

| Part | Covers | Duration | Text |
| ---: | --- | ---: | --- |
| 1 | Cuts 1-2 | 5.2s | Korea's most famous street food isn't what you think it is. You know this one. Red, spicy, in every market. |
| 2 | Cuts 3-4 | 5.5s | It never travels alone. Fish cake, fried snacks, the whole counter. Add ramyeon and the snack becomes dinner. |
| 3 | Cuts 5-6 | 5.7s | But the first one had no chili at all. Soy sauce, beef, served at court. Six versions, one rice cake. Start at a market stall. |

Cut 7 is silent. Audio at `output/reels/311/audio/voice-part-{1,2,3}.mp3`.

## Outro CTA

Selected from the rotating bank in `output/reels/outro-cta-bank.md`: **B — `DON'T ORDER BLIND`**
(mistake-avoidance), chosen because this Reel is an ordering guide, so the hook names the exact cost
of not reading. `epickor.com` renders as a solid red chip with white text — red text over footage was
tested on this frame and was unreadable against Korean signage and a red awning.

Outro runs silent so the close lands on image.

## Type And Treatment

- ONS face: **Segoe UI Black** (heavy geometric). Arial Black was rejected — it overflowed the 1080
  frame on two-word lines. Bahnschrift and Arial Narrow read too light for a hook; Impact reads dated.
- ONS treatment: **drop shadow only, no scrim.** Compared four options on real footage; a full-width
  gradient dulled the image and produced the hard horizontal cut-off the representative rejected.
  A local gradient is the fallback for unusually bright backgrounds.
- Accent: a short red rule (`#d24437`) above each ONS block; omitted on the outro.
- ONS auto-fits to frame width by character count so no line can clip.

## Voice

- Lane: **`female_culture_travel`** using the established EpicKor voice in `.env.local`.
- **Corrected 2026-07-21.** The first draft specified `male_friend` with no justification. The
  standard assigns food to `female_culture_travel`, and all ten previous EpicKor Reels used that lane
  with this voice. Departing from the brand voice needed a reason and there wasn't one.
- Audition: both lanes were generated on the hook-plus-reveal text and the representative selected
  the established voice (A).
- Pace: natural 1.0x. Silence is allowed before the reveal line.

## Design System

- Name: `Bunsik Heat`.
- Palette: gochujang red `#c0342b`, garaetteok white `#f4efe4`, stall steel `#8d8f8c`,
  soy brown `#4a2f1d`, charcoal `#141312`.
- Type: heavy condensed uppercase for ONS, held to 3-5 words. No lower-third bars, no card panels.
- Rhythm: cuts land on the action (the stir, the pull, the lift), not on a metronome.
- Guardrail: this is a food film, not an explainer. No boards, no tables, no checklists on screen.

## Technical Gates (Reels 2.2)

- Encoding: **>= 8 Mbps** at 1080x1920; target 10 Mbps because three cuts are motion-heavy.
- fps: 30 native. Do not accept 25fps sources for cuts 1-4; replace rather than interpolate.
- Caption lane: narration captions only, single lane, bottom band clear of all ONS.
- ONS must end at or above `y=1340`.

## Funnel Expectation

Saves and sends first (food reveal is highly sendable), profile visit second, then Blog 311 for the
spice-level table and ordering guide.

## Metrics To Log

Record in `output/reels/metrics.json` after publishing: 1h / 24h / 7d views, saves, sends, shares,
comments, watch-through rate, profile visits. This Reel is the **new-structure arm** of the A/B
against a current-structure control.
