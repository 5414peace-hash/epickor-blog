# EpicKor Reels Creative Performance Standard - 2026-06-24

Use this standard for new EpicKor Reels after the confirmed `196/197/198` batch. It upgrades Reels from clean blog-summary videos into curiosity-led short-form videos built for retention, shares, saves, and the EpicKor.com funnel.

## Why This Standard Exists

Recent Reels became technically cleaner but too information-first. The old high-view EpicKor Reels worked because they opened with a simple cultural mystery, surprising Korean daily-life contrast, travel decision, or social rule that a viewer could understand instantly. Future Reels must be judged by viewer impact before production polish.

Do not blame low reach on the algorithm until the Reel has passed these creative gates:

- the first second creates a reason to stop.
- the narration sounds spoken, not summarized from a blog.
- the thumbnail makes a sharp promise in 3-5 words.
- the Reel gives a clear reason to save, share, comment, or send.
- the motion-card insert helps the payoff instead of interrupting the video.

## Reels Viral Fit Score

Strategy must score every candidate before Reels production. Save the score in `output/reels/{slug}/strategy.md`.

| Category | Points | Pass Standard |
| --- | ---: | --- |
| Curiosity gap | 25 | A viewer should immediately wonder "why?" or "wait, really?" |
| Outsider surprise or misconception | 20 | The topic corrects something non-Korean viewers assume incorrectly. |
| Visual immediacy | 20 | The idea can be understood through strong first-frame visuals. |
| Emotional or social stakes | 15 | The viewer may feel shock, relief, embarrassment, nostalgia, FOMO, or recognition. |
| Share/save usefulness | 10 | There is a practical or social reason to save/send it. |
| EpicKor funnel fit | 10 | The video naturally points to a useful guide on EpicKor.com. |

Rules:

- `90+`: priority Reels candidate.
- `80-89`: acceptable if production risk is low.
- `<80`: do not make it a Reel by default. Route it to card news, blog refresh, or wait for a stronger angle.
- A high GSC page or newly published post is not enough. The Reel angle itself must pass.

## Required Creative Brief

Before script, visual research, dashboard, TTS, or Remotion work, create or update `output/reels/{slug}/strategy.md` with:

- source post and public URL verification status.
- target viewer and what they already misunderstand.
- hook archetype: `mystery`, `mistake`, `decision`, `shock`, `social rule`, or `myth-bust`.
- first-frame promise in 3-5 words.
- tension/open loop and exact payoff.
- why a viewer would keep watching.
- why a viewer would save, share, comment, or send.
- chosen voice lane: male, female, or explicitly approved alternate.
- three thumbnail directions: `Mystery`, `Mistake`, and `Decision`.
- the single motion-card role and where it appears.
- expected funnel behavior: profile visit, EpicKor.com visit, or guide save.

## Script Standard

Normal Reels target: 32-42 seconds, 6-7 scenes, one idea per scene.

Required story shape:

1. `0-1.5s`: contradiction, mystery, mistake, or decision hook.
2. `1.5-8s`: concrete scene or example.
3. `8-20s`: twist or misconception break.
4. `20-32s`: useful rule, risk, or practical takeaway.
5. `32-42s`: payoff plus save/share cue.

Every script must include:

- one surprising concrete detail.
- one outsider misconception or mistake.
- one useful takeaway.
- one explicit save/share reason.
- one line that sounds like a real person would say it out loud.

Avoid these openers unless they are immediately paired with conflict:

- `X is one of Korea's...`
- `Here is a guide to...`
- `If you are visiting Korea...`
- `Korea has many...`
- `This post explains...`

Better opener patterns:

- `If you do X in Korea, Y happens first.`
- `The weird part is not X. It is Y.`
- `Tourists think X. Koreans are watching Y.`
- `This looks easy until X.`
- `Do not start with X. Start with Y.`

## Thumbnail And First Frame

Make three thumbnail copy directions before selecting one:

- `Mystery`: asks or implies a cultural mystery.
- `Mistake`: warns about a common foreigner/tourist error.
- `Decision`: helps the viewer choose between two options.

Rules:

- 3-5 words is the default.
- The thumbnail must not simply restate the blog title.
- The first frame must work both in the Reels feed and the profile grid.
- Use real Korea/context visual proof whenever possible.
- Scene 1 dashboard previews must show the actual text overlay on every candidate image.

## Motion-Card Policy

For a normal 35-45 second Reel, use exactly one motion-card insert by default.

- Preferred placement: around 60-75% of the Reel, after the viewer already understands the tension.
- Preferred role: payoff board, checklist, receipt, decision table, mistake list, or rule card.
- Do not use a motion card as Scene 1 unless the representative explicitly approves it.
- Do not use two or more motion-card inserts unless the representative approves a slug-specific exception and it is recorded in `HANDOFF.md`.
- A dashboard may show A/B/C design options for the single motion-card scene; the final render may include only the approved option.
- One motion card is not a license to make it dense. It must still preserve a clean synced-caption zone and avoid empty-center layouts.

## Voice Policy

Default Reels have two voice lanes:

- `male_friend`: conversational American English, like a sharp friend explaining Korea without sounding like a lecture.
- `female_culture_travel`: energetic but natural American English, useful for beauty, travel, food, festivals, shopping, lifestyle, and sharper warning angles.

Rules:

- Choose the lane in the creative brief before TTS.
- Generate a 8-12 second audition sample before full scene-level TTS when using a new voice, new tone, or important batch opener.
- Do not alternate male/female voices inside one short Reel unless the script is intentionally written as a call-and-response and the representative approves it.
- Voice performance should feel more natural and entertaining than the written script. If it sounds like a calm blog readout, regenerate or rewrite.

## Visual And Editing Impact

Visual review must judge more than topic fit:

- Does Scene 1 stop a scroll without relying only on text?
- Does the image prove the spoken beat instantly?
- Is there enough human/object/action context to feel native to Instagram?
- Does the Reel avoid generic support images when a topic-specific image is possible?
- Does the visual rhythm change before the viewer feels the pattern?

## Analytics Loop

After publishing, record a short postmortem in `output/reels/{slug}/postmortem.md` or `HANDOFF.md`:

- hook archetype.
- thumbnail variant used.
- voice lane.
- motion-card count and placement.
- views at 1 hour, 24 hours, and 7 days when available.
- saves, shares/sends, comments, profile visits, external link taps when available.
- what to repeat or avoid in the next batch.

Do not judge a new standard from one Reel only. Compare at least a 3-Reel batch using the same postmortem fields.

## Agent Responsibilities

- Strategy Agent: score Reels Viral Fit and reject weak candidates before production.
- Script Agent: write for curiosity, tension, spoken rhythm, and save/share behavior.
- Visual Research Agent: find first-frame and scene-proof visuals, not just technically relevant images.
- Visual Reviewer Agent: reject dashboards that are visually correct but not scroll-stopping.
- Motion Design Agent: design one payoff insert, not a sequence of info cards.
- Voice Agent: maintain male/female voice lanes and audition important changes.
- Remotion Agent: preserve the selected thumbnail, one-card structure, captions, and safe areas.
- QA/Evaluation Agents: score viewer impact, not just render correctness.
