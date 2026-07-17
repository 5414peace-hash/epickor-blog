**Product Design QA - EpicKor Homepage Redesign**

- source visual truth path: `C:\Users\user\.codex\generated_images\019f4461-17b2-70c0-8ad1-2bf0b7992b17\ig_0f4a7686c93bab8a016a4f1dce115c819b8176407fb75ce3e6.png`
- implementation screenshot path: `output/homepage-redesign-desktop.png`
- mobile screenshot path: `output/homepage-redesign-mobile.png`
- full-view comparison evidence: `output/homepage-redesign-comparison.png`
- viewport: desktop `1440x1024`, mobile `390x844`
- state: homepage default, light theme, local dev server at `http://127.0.0.1:4000`

**Findings**

- No P0/P1/P2 findings remain.

**Required Fidelity Surfaces**

- Fonts and typography: Passed. The implementation uses a serif-style EpicKor masthead and editorial serif headlines with clean sans body/navigation text. Text wraps safely on desktop and mobile. Secondary story text was tightened to prevent overlap.
- Spacing and layout rhythm: Passed. Header, guide finder strip, editorial grid, section entrances, Plan Smarter, and Reels modules follow the selected Editorial Guide Desk structure. Desktop has no horizontal overflow. Mobile has no page overflow; header/chips intentionally scroll horizontally.
- Colors and visual tokens: Passed. White base, charcoal text, travel blue, food red, beauty pink, culture violet, and business emerald match the approved direction without becoming one-note.
- Image quality and asset fidelity: Passed. All visible homepage images are real EpicKor/local or approved remote image assets. No broken loaded images were found. Lazy images were checked after scrolling; broken image count remained `0`.
- Copy and content: Passed. The implementation uses live EpicKor blog and business metadata where possible. Some titles differ from the mock because the UI now reflects real published post titles.

**Intentional Deviations**

- The lead image uses EpicKor's actual Incheon Airport article asset rather than the generated airport-sunset mock image.
- The top-right language/search micro-controls from the mock were simplified because the implemented homepage already has a functional guide search bar below the header.
- Section and article titles use real CMS/frontmatter text, so several labels are longer than the mock. Text clamps and trims were added where needed.

**Patches Made During QA**

- Reduced guide finder vertical padding and changed chips to a compact horizontal rail.
- Fixed the editorial grid height to keep section entrances visible in the first desktop viewport.
- Tightened secondary story cards and removed their descriptions to avoid overlap.
- Replaced the business section entrance image with a Toss office interior photo instead of a black logo block.

**Implementation Checklist**

- Build passed with `npm.cmd run build`.
- Desktop capture passed: no broken loaded images, no horizontal overflow.
- Mobile capture passed: no horizontal page overflow.
- Lazy-image scroll check passed: broken image count `0`.

**Follow-up Polish**

- Consider a dedicated mobile hamburger or drawer later if the expanded section navigation grows further.
- Consider adding real category index routes after the current homepage validates navigation demand.

final result: passed
