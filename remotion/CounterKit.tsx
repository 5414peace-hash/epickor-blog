/**
 * COUNTER — a reel built on information rate instead of footage motion.
 *
 * WHY THIS KIT EXISTS (2026-08-17, representative directive: "판을 좀 흔들어야할듯")
 *
 * The measured problem was not taste. Across 46 Instagram Reels the median was 700
 * views; across 39 card-news carousels, 901 — card news won every month measured.
 * Frame extraction on 376 (the "moving card news" kit approved 2026-08-13) showed
 * why: over the opening five seconds the only thing that changed on screen was the
 * subtitle. The photograph was one still under a slow zoom and the white title card
 * never moved. Six cuts in forty seconds. A card-news carousel gives a viewer seven
 * designed frames in about fifteen seconds of attention, so THE REEL WAS SLOWER THAN
 * THE CARD NEWS. That is the whole gap, and no amount of palette work closes it.
 *
 * So this kit inverts the ingredient list the representative asked to break:
 *   - No background footage. EpicKor does not shoot video and rented stock is the
 *     weakest link in every reel it has made. The photography here is product
 *     photography we can get at full resolution from the manufacturer.
 *   - No zoom. Anywhere. `Ken Burns` is banned in this file, because it satisfies
 *     MOTION.requireAmbientMotion on paper while reading as a still to a viewer.
 *     Ambient motion is a drifting depth band and the ticker digits instead.
 *   - No narration, no caption band. The type IS the message, set at 88-176px
 *     instead of 34px in a scrim. Instagram autoplays muted; a reel that needs
 *     audio to make sense has already lost the first second. This also removes the
 *     TTS step, the ASS caption generator, and the two audio QA gates — the three
 *     places the pipeline most often shipped a defect.
 *   - One event every ~20 frames (0.67s), not every 180. A block is six events.
 *
 * THE MOTION THAT JUSTIFIES VIDEO AT ALL
 *   A carousel can show a price. It cannot show a price CHANGING. Every product here
 *   has a verified list price and a verified street price, so the list price is
 *   struck through while the real number counts up underneath. That beat is the
 *   argument for this being a video and not a seventh card.
 *
 * WHY THE GROUND IS LIGHT
 *   Sampled from the Torriden hero plate, which is the only one of the four that is
 *   already a designed image: #47b3e4 at the top of its gradient to #dcf9ff at the
 *   bottom, luma 160-243. A dark ground was the first plan and it was a guess — it
 *   would have buried three frosted-white bottles and forced outlines around them.
 *   Korean skincare packaging is overwhelmingly pale, and nearly every reel in the
 *   feed is dark, so committing to the products' real world also buys contrast
 *   against everything around it.
 *
 * CARRIED OVER UNCHANGED — these are constraints, not style:
 *   - SAFE from tokens/core: top 150, bottom 320, side 60, and the action rail,
 *     which is a right-edge column that only exists below y1100.
 *   - Frame 0 renders complete. It is the Instagram grid thumbnail; anything that
 *     fades in is blank there (measured on 379: f0 luma 16.2 before the rule).
 *   - epickor.com is a solid red chip, never coloured type over the picture.
 *   - One block's copy never coexists with the next block's. Here that is achieved by
 *     strictly adjacent Sequences rather than by a clearing fade — see Block().
 */
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { FONTS, SAFE, TYPE } from './tokens/core';
import { loadFonts } from './fonts';

/* ------------------------------------------------------------------ *
 * Palette — sampled, not chosen. See the header note.
 * ------------------------------------------------------------------ */
const C = {
  /** Bottom of the Torriden gradient, desaturated a touch so type can sit on it. */
  canvas: '#DCEEF7',
  /** Its midpoint. Used for the drifting depth band, never as a flat fill. */
  deep: '#9FD3EC',
  /** Top of the gradient, at full saturation. Rules, labels, the Hangul line. */
  accent: '#1B7FA8',
  /** Deep blue-ink. Never pure black on a blue ground — it reads as a hole. */
  ink: '#0B2430',
  mute: '#5E8598',
  /** Olive Young shelf tags are this red. It is also the brand chip colour. */
  price: '#E8442B',
  paper: '#FFFFFF',
} as const;

const F = {
  hook: FONTS.grotesk,
  num: FONTS.condensed,
  body: FONTS.neutral,
} as const;

/* ------------------------------------------------------------------ *
 * Timing. One block is 126 frames; six events inside it.
 * ------------------------------------------------------------------ */
export const BLOCK = 126;
const HOOK = 66;
const DECIDE = 108;
const OUTRO = 78;

export type Product = {
  id: string;
  /**
   * Portrait product panel under public/assets/reels/kbeauty-picker/media. Every one
   * is cropped to the same 0.535 ratio by prep-cutouts.mjs so the slot width is fixed
   * and the tag column can start at a constant x.
   */
  media: string;
  brand: string;
  name: string;
  hangul: string;
  /** The reader's problem, not the product category. Two short lines. */
  concern: [string, string];
  /** Verified list price, in won. Omitted when the product has no meaningful list. */
  list?: number;
  /** Verified street price, in won. */
  street: number;
  /** Where the street price comes from — shown, because an unsourced price is noise. */
  where: string;
  /** One line of honest counter-information or the single strongest fact. */
  verdict: string;
};

/* ------------------------------------------------------------------ *
 * Easing. `snap` arrives fast and settles; nothing in this kit drifts after
 * it lands, because a permanently-moving element is what makes a frame feel
 * like a screensaver rather than a designed page.
 * ------------------------------------------------------------------ */
const snap = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3.2);

function at(frame: number, start: number, dur = 8) {
  return snap((frame - start) / dur);
}

/** Ambient motion: a wide band of deeper water sliding down the frame. Not a zoom. */
function Ground() {
  const f = useCurrentFrame();
  const y = ((f * 0.9) % 2600) - 700;
  return (
    <AbsoluteFill style={{ background: C.canvas, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          left: -200,
          right: -200,
          top: y,
          height: 900,
          background: `linear-gradient(180deg, transparent, ${C.deep}88 45%, transparent)`,
          filter: 'blur(48px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(120% 70% at 50% 0%, ${C.deep}66, transparent 60%)`,
        }}
      />
    </AbsoluteFill>
  );
}

/** Paper grain. Keeps a light ground from reading as an untextured slide. */
function Grain() {
  return (
    <AbsoluteFill
      style={{
        opacity: 0.05,
        mixBlendMode: 'multiply',
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='3'/></filter><rect width='180' height='180' filter='url(%23n)'/></svg>\")",
      }}
    />
  );
}

function Watermark() {
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.side,
        top: 60,
        font: `800 21px/1 ${F.body}`,
        letterSpacing: '0.16em',
        color: C.ink,
        opacity: 0.5,
      }}
    >
      EPICKOR.COM
    </div>
  );
}

/** Counts to a won value. Tabular figures, or the digits jitter as widths change. */
function Won({
  value,
  from,
  size,
  color,
  weight = 700,
  strike = false,
}: {
  value: number;
  from: number;
  size: number;
  color: string;
  weight?: number;
  strike?: boolean;
}) {
  const f = useCurrentFrame();
  const t = at(f, from, 11);
  const n = Math.round(value * t);
  const struck = strike ? snap((f - from - 16) / 6) : 0;
  const bar = Math.max(4, Math.round(size * 0.055));
  return (
    <span
      style={{
        font: `${weight} ${size}px/1 ${F.num}`,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.01em',
        color,
        /**
         * The strike is a background on the text box itself, animated by
         * `background-size`, not an absolutely positioned overlay.
         *
         * The overlay version was sized against an `inline-block` wrapper that declared
         * no font of its own, so the wrapper's height came from the INHERITED
         * line-height strut rather than from this 52px text. `top: 52%` of that taller
         * box landed above the digits' optical centre and the bar overhung the final
         * glyph. An inline background box is exactly the text's advance width and its
         * em box, so the rule now starts and stops on the number.
         */
        backgroundImage: strike ? `linear-gradient(${C.price}, ${C.price})` : undefined,
        backgroundSize: strike ? `${struck * 100}% ${bar}px` : undefined,
        backgroundPosition: '0 57%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      ₩{n.toLocaleString('en-US')}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * A product block. Six events, listed with their frames so the rhythm is
 * auditable from the source rather than from a stopwatch.
 *   f0   bottle cuts in (hard cut, no crossfade)
 *   f6   concern headline
 *   f26  brand + name tag
 *   f40  Hangul line
 *   f58  list price arrives, then strikes at f74
 *   f72  street price counts
 *   f98  verdict
 * ------------------------------------------------------------------ */
function Block({ p, index, total }: { p: Product; index: number; total: number }) {
  const f = useCurrentFrame();

  // NO OUT-FADE. Blocks are strictly adjacent Sequences (66-191, 192-317, ...), so
  // Remotion unmounts one block's copy on the exact frame the next mounts and two
  // blocks' glyphs can never coexist. The clearing fade this kit started with was
  // carried over from Batch0811Kit, where cuts genuinely overlap by MOTION.overlap=16
  // frames for a photographic crossfade. Ported into a hard-cut kit it defends
  // against nothing and costs six dead frames per cut — v001 measured f65, f191,
  // f677 and f678 as blank or copy-less frames, one full second across the reel.

  // One frame, not two, and at 0.65 rather than 0.85. The v001 sheet showed each cut
  // opening on a near-white frame with nothing on it, which reads as a dropped frame
  // rather than as a cut marker.
  const flash = f < 1 ? 0.65 : 0;

  return (
    <AbsoluteFill>
      <Img
        src={staticFile(p.media)}
        style={{
          position: 'absolute',
          left: 74,
          // Panel occupies y400-1150, x74-475 at this height (the 0.535 crop ratio).
          // The price stack starts at 1140, so these two must not be re-tuned
          // independently — the first render had the panel at bottom:396, which put it
          // at y718-1524 and drove ₩14,000 straight through the bottle.
          top: 400,
          height: 750,
          boxShadow: '22px 30px 44px rgba(11,36,48,0.24)',
          transform: `translateY(${(1 - at(f, 0, 10)) * 26}px)`,
        }}
      />


      {/* Hard-cut flash. Two frames of paper sells the cut without a crossfade. */}
      {flash > 0 ? (
        <AbsoluteFill style={{ background: C.paper, opacity: flash * 0.85 }} />
      ) : null}

      <div>
        {/* Counter rail: which of four, as a real position not decoration. */}
        <div
          style={{
            position: 'absolute',
            right: SAFE.side,
            top: 60,
            font: `800 21px/1 ${F.num}`,
            letterSpacing: '0.2em',
            color: C.accent,
          }}
        >
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>

        {/* The reader's problem, in their words. */}
        <div
          style={{
            position: 'absolute',
            left: SAFE.side,
            right: SAFE.side,
            top: 214,
            // Starts at f3, not f6: the block used to open on roughly a third of a
            // second of panel-only frame before any copy arrived.
            opacity: at(f, 3, 6),
            transform: `translateY(${(1 - at(f, 3, 6)) * 16}px)`,
          }}
        >
          <div
            style={{
              font: `900 ${TYPE.headline.size}px/0.98 ${F.hook}`,
              letterSpacing: '-0.024em',
              color: C.ink,
              textTransform: 'uppercase',
              wordSpacing: '0.055em',
            }}
          >
            {p.concern[0]}
            <br />
            <span style={{ color: C.accent }}>{p.concern[1]}</span>
          </div>
        </div>

        {/* Shelf tag: brand, product, Hangul. Right column, clear of the action rail. */}
        <div
          style={{
            position: 'absolute',
            // Panel occupies x74-475, so the column starts clear of it and stops at
            // x1020, one side margin from the right edge. Top is set so the block's
            // optical centre sits near the panel's (y775), not at the panel's top.
            left: 520,
            top: 600,
            width: 500,
            opacity: at(f, 26, 8),
            transform: `translateX(${(1 - at(f, 26, 8)) * 34}px)`,
          }}
        >
          <div style={{ height: 5, width: 92, background: C.price, marginBottom: 22 }} />
          <div
            style={{
              font: `800 25px/1 ${F.body}`,
              letterSpacing: '0.15em',
              color: C.mute,
              textTransform: 'uppercase',
            }}
          >
            {p.brand}
          </div>
          <div
            style={{
              font: `800 60px/1.02 ${F.hook}`,
              letterSpacing: '-0.02em',
              color: C.ink,
              marginTop: 12,
            }}
          >
            {p.name}
          </div>
          <div
            style={{
              font: `600 38px/1.3 ${F.body}`,
              color: C.accent,
              marginTop: 18,
              opacity: at(f, 40, 8),
            }}
          >
            {p.hangul}
          </div>
        </div>

        {/* Price. The largest element in the frame, because it is the reason to watch.
            The three lines stack rather than sitting side by side: `where` is up to
            four words, and baseline-aligning it against a 168px numeral wrapped it to
            two lines and pushed it into the verdict rule on the first render. */}
        <div style={{ position: 'absolute', left: SAFE.side, top: 1165 }}>
          {p.list ? (
            <div style={{ opacity: at(f, 58, 6), marginBottom: 4 }}>
              <span
                style={{
                  font: `700 26px/1 ${F.body}`,
                  letterSpacing: '0.14em',
                  color: C.mute,
                  marginRight: 18,
                }}
              >
                LIST
              </span>
              <Won value={p.list} from={58} size={52} color={C.mute} strike />
            </div>
          ) : null}
          <div style={{ opacity: at(f, 72, 5) }}>
            <Won value={p.street} from={72} size={156} color={C.ink} weight={700} />
          </div>
          <div
            style={{
              font: `700 27px/1.2 ${F.body}`,
              letterSpacing: '0.1em',
              color: C.price,
              textTransform: 'uppercase',
              marginTop: 6,
              opacity: at(f, 84, 6),
            }}
          >
            {p.where}
          </div>
        </div>

        {/* Verdict. The honest-counter-information line, or the strongest fact. */}
        <div
          style={{
            position: 'absolute',
            left: SAFE.side,
            right: SAFE.side,
            // Price stack with a list line ends at y1415; two verdict lines from here
            // finish at y1557, inside the y1600 bottom cut zone.
            top: 1442,
            opacity: at(f, 98, 8),
            borderTop: `3px solid ${C.ink}22`,
            paddingTop: 20,
          }}
        >
          <div style={{ font: `600 37px/1.24 ${F.body}`, color: C.ink }}>{p.verdict}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/** Opening frame. Renders complete at f0 because it is the grid thumbnail. */
function Hook({ products }: { products: Product[] }) {
  const f = useCurrentFrame();
  // No out-fade: see the note in Block. f65 rendered as an empty blue frame.
  return (
    <AbsoluteFill>
      {/* All four bottles, small, as the promise of what the reel contains. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 850,
          height: 470,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 34,
        }}
      >
        {products.map((p, i) => (
          <Img
            key={p.id}
            src={staticFile(p.media)}
            style={{
              height: 400,
              boxShadow: '10px 16px 26px rgba(11,36,48,0.2)',
              // Staggered arrival, complete by f24 — still well inside the thumbnail
              // rule because f0 shows them all at full opacity, only offset.
              transform: `translateY(${(1 - at(f, i * 4, 12)) * 40}px)`,
            }}
          />
        ))}
      </div>
      <div style={{ position: 'absolute', left: SAFE.side, right: SAFE.side, top: 300 }}>
        <div style={{ height: 6, width: 118, background: C.price, marginBottom: 26 }} />
        <div
          style={{
            font: `900 ${TYPE.hook.size}px/0.93 ${F.hook}`,
            letterSpacing: '-0.028em',
            color: C.ink,
            textTransform: 'uppercase',
              wordSpacing: '0.06em',
          }}
        >
          FOUR KOREAN
          <br />
          BOTTLES.
          <br />
          <span style={{ color: C.accent }}>ONE IS YOURS.</span>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          top: 1400,
          font: `700 32px/1.3 ${F.body}`,
          letterSpacing: '0.04em',
          color: C.mute,
        }}
      >
        Real Olive Young prices · August 2026
      </div>
    </AbsoluteFill>
  );
}

/** The decision grid. This is the frame a viewer screenshots, so it must be complete. */
function Decide({ products }: { products: Product[] }) {
  const f = useCurrentFrame();
  // No out-fade: see the note in Block. f677 rendered as an empty blue frame.
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: SAFE.side, right: SAFE.side, top: 210 }}>
        <div style={{ height: 6, width: 118, background: C.price, marginBottom: 24 }} />
        <div
          style={{
            font: `900 84px/0.98 ${F.hook}`,
            letterSpacing: '-0.024em',
            color: C.ink,
            textTransform: 'uppercase',
              wordSpacing: '0.055em',
          }}
        >
          PICK BY THE
          <br />
          <span style={{ color: C.accent }}>PROBLEM.</span>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          right: SAFE.side,
          // y520 to y1088 for two 270px rows. The grid MUST end above y1100: the right
          // column spans x553-1020, so anything from it that crosses y1100 sits under
          // Instagram's like/comment/share buttons.
          top: 520,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 28,
        }}
      >
        {products.map((p, i) => (
          <div
            key={p.id}
            style={{
              background: C.paper,
              padding: '30px 26px 26px',
              opacity: at(f, 8 + i * 9, 8),
              transform: `translateY(${(1 - at(f, 8 + i * 9, 8)) * 20}px)`,
              boxShadow: '0 14px 30px rgba(11,36,48,0.12)',
            }}
          >
            <div
              style={{
                font: `800 23px/1.16 ${F.body}`,
                letterSpacing: '0.09em',
                color: C.price,
                textTransform: 'uppercase',
                minHeight: 60,
              }}
            >
              {p.concern[0]} {p.concern[1]}
            </div>
            <div
              style={{
                font: `800 33px/1.08 ${F.hook}`,
                letterSpacing: '-0.016em',
                color: C.ink,
                marginTop: 12,
              }}
            >
              {p.brand}
            </div>
            <div
              style={{
                font: `700 88px/1 ${F.num}`,
                fontVariantNumeric: 'tabular-nums',
                color: C.ink,
                marginTop: 16,
              }}
            >
              ₩{p.street.toLocaleString('en-US')}
            </div>
          </div>
        ))}
      </div>

      {/* This is the frame a viewer screenshots, so it is the one frame where the
          domain earns its place mid-reel rather than only in the outro. Kept left of
          x930 because it sits below y1100, inside the action rail's column. */}
      <div style={{ position: 'absolute', left: SAFE.side, top: 1180, width: 850 }}>
        <div
          style={{
            font: `600 36px/1.28 ${F.body}`,
            color: C.ink,
            opacity: at(f, 48, 10),
          }}
        >
          Ingredient by ingredient, and what each one is actually for.
        </div>
        <div
          style={{
            display: 'inline-block',
            marginTop: 26,
            background: C.price,
            padding: '16px 30px 20px',
            opacity: at(f, 60, 9),
          }}
        >
          <span style={{ font: `900 46px/1 ${F.hook}`, letterSpacing: '-0.01em', color: C.paper }}>
            epickor.com
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function Outro({ hook, sub }: { hook: string; sub: string }) {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: SAFE.side, right: SAFE.side, top: 620 }}>
        <div
          style={{
            font: `900 106px/0.94 ${F.hook}`,
            letterSpacing: '-0.028em',
            color: C.ink,
            textTransform: 'uppercase',
              wordSpacing: '0.06em',
            // Present outright. `at(f, 0, 9)` still evaluates to 0 on f0, so moving
            // the fade's start to zero did not fix the blank f678 — removing the fade
            // does. The outro is a hard cut to a text card, which reads sharper anyway.
            // The hook carries its own line break so the phrase splits where it was
            // planned to, not where the box happens to run out. Never let the browser
            // decide a break in outro copy.
            whiteSpace: 'pre-line',
          }}
        >
          {hook}
        </div>
        <div
          style={{
            font: `600 38px/1.3 ${F.body}`,
            color: C.mute,
            marginTop: 30,
            opacity: at(f, 16, 9),
          }}
        >
          {sub}
        </div>
        {/* Solid red chip, never coloured type over a picture. */}
        <div
          style={{
            display: 'inline-block',
            marginTop: 46,
            background: C.price,
            padding: '22px 40px 26px',
            opacity: at(f, 28, 8),
            transform: `translateY(${(1 - at(f, 28, 8)) * 14}px)`,
          }}
        >
          <span
            style={{
              font: `900 62px/1 ${F.hook}`,
              letterSpacing: '-0.012em',
              color: C.paper,
            }}
          >
            epickor.com
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

export function ReelCounter({
  products,
  outroHook,
  outroSub,
}: {
  products: Product[];
  outroHook: string;
  outroSub: string;
}) {
  // Inside the component, matching SplitGridKit. Called at module scope instead, the
  // delayRender handle is created when the bundle evaluates rather than when a render
  // tab is ready, and frame 184 died on "bundled webfonts not cleared after 28000ms".
  loadFonts();
  return (
    <AbsoluteFill style={{ background: C.canvas }}>
      <Ground />
      <Sequence durationInFrames={HOOK}>
        <Hook products={products} />
      </Sequence>
      {products.map((p, i) => (
        <Sequence key={p.id} from={HOOK + i * BLOCK} durationInFrames={BLOCK}>
          <Block p={p} index={i} total={products.length} />
        </Sequence>
      ))}
      <Sequence from={HOOK + products.length * BLOCK} durationInFrames={DECIDE}>
        <Decide products={products} />
      </Sequence>
      <Sequence from={HOOK + products.length * BLOCK + DECIDE} durationInFrames={OUTRO}>
        <Outro hook={outroHook} sub={outroSub} />
      </Sequence>
      <Grain />
      <Watermark />
    </AbsoluteFill>
  );
}

export const counterDuration = (n: number) => HOOK + n * BLOCK + DECIDE + OUTRO;
