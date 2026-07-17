# EpicKor Reels 2.1 Recovery Spec - 2026-07-14

## Decision

The representative rejected Blog 293 Reels 2.0 V04. It must not be published or used as the new baseline. Reels 2.1 returns to the concise pre-293 structure, then improves the opening impact, narration, video coverage, single motion-card treatment, vertical composition, and human-made finish.

## What Failed In Reel 293

- The 50-second length felt slow compared with the established 34-second Reel 257.
- The opening used a dark, generic page-turn/library image before showing a compelling consequence or action.
- `WHICH SEOUL BOOK SPACE FITS YOU?` described the topic but did not create meaningful stakes.
- The early information board and the closing card sequence made the Reel feel like a corporate presentation.
- The narration was useful but written like a structured guide and slowed to an unnatural pace.
- Multiple still/library visuals were technically relevant but not enough to make the video feel native to Instagram.
- Internal scores overvalued rights, topic fit, structural completion, and source variety. They did not adequately score hook strength, voice naturalness, native social feel, or visible AI/automation smell.

## Reels 2.1 Format

Target: 32-42 seconds, 6-7 scenes, exactly one motion card.

1. `0-3s`: real topic action or consequence, 3-5-word hook, narration starts with tension.
2. `3-12s`: demonstrate the problem with real vertical footage or direct visual proof.
3. `12-22s`: reveal the misconception or cultural twist.
4. `22-30s`: one motion-card payoff over a dimmed/softened topic image or video background.
5. `30-42s`: practical resolution, save/share cue, and `epickor.com`.

The motion card is written into the script before design. It needs a spoken setup, one narration beat per row/reveal, and a final payoff line. Plain black backgrounds and second summary cards are prohibited.

## Thumbnail And Narration Hook

- Generate three thumbnail directions: Mystery, Mistake, and Decision.
- Generate three first-sentence options.
- Select the thumbnail and narration together as one hook unit.
- The first frame must show a relevant object, action, risk, or human response; no black intro, generic mood shot, or animated cover slide.
- Female narration is allowed and preferred when it gives food, culture, travel, or mistake angles more natural energy.
- Test 8-12 seconds before full TTS. Use natural speed, with no default `0.8x` slowdown.

## Video Strategy

Use real topic-specific vertical footage first. For a normal seven-scene Reel, target at least four scenes with real motion, one purposeful still/macro proof scene, one motion card over a moving or photographic background, and one final real-motion CTA scene.

AI video should solve a specific gap, not create the Reel. Google AI Pro includes monthly AI credits for Flow and Whisk; Google currently describes approximately 50 Veo Fast generations or 10 Quality generations at the listed credit rates, subject to model/output behavior. These credits belong to the consumer tools, not the Gemini Developer API.

The Gemini Developer API is billed separately. As checked on 2026-07-14, Google's API pricing lists Veo 3.1 Fast video at roughly `$0.10/sec` for 720p and `$0.12/sec` for 1080p, while Standard is `$0.40/sec` with audio. API billing requires a separate paid project and prepay/billing setup. Therefore:

- Do not activate or automate the Gemini API for this pilot.
- Use the existing Google AI Pro plan manually through Flow for at most one or two controlled bridge/establishing generations.
- Log model, prompt, date, source output, and chosen 3-5-second excerpt in `clip-sources.md`.
- Reassess API automation only after one Reels 2.1 candidate passes representative review and a three-Reel batch proves the format.

Official references:

- [Google AI credits for Flow and Whisk](https://support.google.com/googleone/answer/16287445?hl=en-za)
- [Gemini Developer API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini Developer API billing](https://ai.google.dev/gemini-api/docs/billing)
- [Gemini video generation documentation](https://ai.google.dev/gemini-api/docs/video)

## Generated-Visual Safety

Generated visuals may cover no more than 25% of selected cuts. Do not use them as proof of a real location, Korean sign, property, brand, product claim, or human technique. Avoid generated hands manipulating chopsticks, food, phones, or tools. Safer generated shots are atmospheric macro or establishing shots with no text, logos, or complex hand contact.

Recommended safe Flow prompt for Blog 294 if a bridge is still needed:

> Vertical 9:16 documentary macro shot of a polished stainless Korean spoon and flat metal chopsticks resting beside small Korean banchan dishes, authentic restaurant table, subtle steam, natural warm lighting, physically accurate reflections, restrained three-centimeter lateral camera move, no hands, no text, no logos, no morphing, no object movement.

## First Prototype

Blog 294, `Why Korean Chopsticks Are Metal`, is the best first recovery prototype because it is newly published, has an immediate outsider pain point, supports a strong mistake hook, and can be demonstrated visually. Its first frame should show real metal chopsticks slipping or rotating, not an AI-generated hand demonstration.

The motion-card payoff should appear around 50-70% over a real Korean-table background:

- `RICE / SOUP -> SPOON`
- `KIMCHI / MEAT -> CHOPSTICKS`
- `STILL SLIPPING -> LIGHTER GRIP`

## Approval Gates

- Reels Viral Fit Score: at least 80.
- Reels Visual Variety Score: at least 92/100, no scene below 90.
- Reels 2.1 Viewer-Impact Score: at least 92/100, with no weak hook, voice, social-feel, motion-card, vertical/video, or AI-artifact category.
- Final phone review with sound on and sound off.
- Representative approval remains the final gate and overrides all internal scores.

