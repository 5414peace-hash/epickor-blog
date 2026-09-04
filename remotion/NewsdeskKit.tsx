/**
 * NEWSDESK — the news kit. A reel assembled as a broadcast package.
 *
 * WHY THIS EXISTS (2026-09-04, representative's brief)
 *
 *   Instagram reels sit at a 700-view median against card news at 901 across 46 and 39 posts,
 *   and the cause is retention, not reach: median average watch is 7 seconds on a 35-45 second
 *   reel, and corr(avg_watch, views) is 0.623 over those 46. Sorting them by watch time splits
 *   the writing cleanly — the holds open on a decision or a misconception ("jjimjilbang is
 *   confusing only once", 13s, 4,829 views), the drops open on a thesis about a category
 *   ("Korean delivery culture is not just convenient", 4s). News grammar is natively the first
 *   kind. A headline is a verdict and an anchor states stakes in the first second.
 *
 * WHAT IT DOES THAT THE OTHER KITS CANNOT
 *   COUNTER, RECEIPT and DOSSIER all deleted photography to escape the footage gate, which had
 *   killed reel 311 outright. That solved sourcing and gave up the screen. NEWSDESK puts moving
 *   footage back underneath while keeping the graphics layer doing the work, because news B-roll
 *   is illustrative by convention rather than evidentiary — a package about a market can cut to
 *   a market. The honesty device is the lower third: a cut labelled FILE or ILLUSTRATIVE is not
 *   pretending to be proof.
 *
 *   That is a licence for GENERIC footage, never for CONTRADICTORY footage. The 2026-08-04 batch
 *   was rejected for screen-speech mismatch (pork belly under "Sprite came 11 years late"), so
 *   the rule here is that the specificity of the sentence must match the specificity of the
 *   frame. Generic sentence, generic clip, FILE. Sentence that names a place, a photograph of
 *   that place, FILE PHOTO.
 *
 * INFORMATION SPEED IS THE POINT
 *   The 2026-08-17 diagnosis: count discrete state changes, not "movement" — reel 376 passed an
 *   ambient-motion check while nothing but its subtitles changed for five seconds, and card news
 *   gives seven cards to a fifteen-second attention span. Target is one event per second. The
 *   ticker runs continuously, the lower third changes on every sentence, the figure counts, and
 *   the source credit appears when a claim needs one. None of that needs another clip.
 *
 * WHY STILLS ARE ALLOWED HERE
 *   The 2.1 hard reject is `excessive still-image ZOOMS`. A FILE PHOTO held dead still for two
 *   seconds while the graphics carry the motion is the opposite of a Ken Burns push, and it is
 *   how broadcast actually handles archive. No zoom is implemented in this kit, deliberately.
 *
 * NO MOTION CARDS
 *   2026-07-21, representative's change: the payoff must be a visual reveal, not a board. There
 *   is no motion-card concept in this file and there should not be one.
 *
 * ------------------------------------------------------------------------------------------
 * LAYOUT — every number below is against `SAFE` in tokens/core, not invented.
 *
 *   The first draft of this kit put the ticker at y1850 and it would have been INVISIBLE:
 *   SAFE.bottom is 320, so everything past y1600 is Instagram's own caption and CTA stack.
 *   Worse, SAFE.actionRail says x930+ below y1100 sits under the like/comment/share column, so
 *   a full-bleed lower third loses its right end to a button. Both were caught by reading the
 *   tokens rather than by rendering, which is the only reason the pilot did not ship broken.
 *
 *   The usable box below y1100 is therefore x60..x900, and the whole graphic stack has to fit
 *   between the top chrome at y150 and the caption band that starts at y1400.
 *
 *     y 170..238   EPICKOR NEWS bug          (top-left, above the rail so width is free)
 *     y 258..322   BREAKING / segment band   (only while a beat asks for it)
 *     y 700..980   FIGURE card               (centre, one appearance only)
 *     y 1180..1340 lower third               (x60..x900 — the action-rail limit)
 *     y 1348..1396 ticker strip              (thin by nature; the only place left, and correct)
 *     y 1410..1570 narration caption         (the existing y1400 exclusion, ending before y1600)
 *
 *   Captions are centred inside x60..x900, not inside 1080, for the same rail reason.
 * ------------------------------------------------------------------------------------------
 */
import type { ReactNode } from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { SAFE } from './tokens/core';
import { loadFonts } from './fonts';

/* ------------------------------------------------------------------ *
 * Palette. One red, one ground, one type colour. A news screen that
 * uses more than one accent stops reading as news and starts reading
 * as a deck, which is a 2.1 hard reject.
 * ------------------------------------------------------------------ */
export const NEWS = {
  /** The brand red. Same value as the outro chip so the whole reel agrees. */
  red: '#d24437',
  /** Bands and plates. Near-black with a blue bias — video black, not #000. */
  ink: '#0d1014',
  /** Type on the bands. Warm white; pure #fff vibrates against the red. */
  paper: '#f4f2ee',
  /** Secondary label type inside a band. */
  mute: '#9aa3ad',
  /** The ticker ground. Lighter than `ink` so the strip separates from the lower third. */
  strip: '#1a2029',
} as const;

/** The three honesty grades a cut can carry. Every cut MUST declare one. */
export type CutProvenance =
  /** A photograph of the exact place or object the sentence names. */
  | 'FILE PHOTO'
  /** Real Korean footage, generic to the sentence. Never contradictory. */
  | 'FILE'
  /** Dated archive material, where the sentence is about the past. */
  | 'ARCHIVE'
  /** Country-silent or staged material. Use sparingly and never under a named claim. */
  | 'ILLUSTRATIVE';

export type NewsCut = {
  /** Path under public/, e.g. `assets/reels/foo/cut1.mp4`. */
  src: string;
  kind: 'video' | 'still';
  /** Absolute start frame in the composition. */
  from: number;
  /** Length in frames. */
  dur: number;
  /** Where the material came from, shown in the lower third. */
  provenance: CutProvenance;
  /** Optional right-hand credit, e.g. `SEOUL METRO`. */
  credit?: string;
};

export type NewsBeat = {
  from: number;
  dur: number;
  /** The lower-third headline. Written like a chyron: a verdict, not a sentence. */
  chyron: string;
  /** Optional second line, smaller. Place names, dates, hangul. */
  sub?: string;
  /** The narration caption for this beat, already phrase-split. */
  caption: string;
};

export type NewsFigure = {
  from: number;
  dur: number;
  /** Counts up to this. */
  value: number;
  /** Digits after the point. */
  decimals: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export type NewsSpec = {
  /** The band under the bug during the cold open. Empty string hides it. */
  breaking: string;
  cuts: NewsCut[];
  beats: NewsBeat[];
  figure?: NewsFigure;
  /** Ticker items. Every one must be a fact that appears in the source post. */
  ticker: string[];
  outro: { from: number; dur: number; hook: string };
};

/* ------------------------------------------------------------------ *
 * Pieces
 * ------------------------------------------------------------------ */

const RAIL_RIGHT = SAFE.actionRail.x - 30; // x900. Hard right edge below y1100.
const BOX_LEFT = SAFE.side; // x60

function Bug() {
  return (
    <div
      style={{
        position: 'absolute',
        left: BOX_LEFT,
        top: 170,
        display: 'flex',
        alignItems: 'stretch',
        height: 68,
        fontFamily: '"Archivo Variable", system-ui, sans-serif',
      }}
    >
      <div
        style={{
          background: NEWS.red,
          color: NEWS.paper,
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: '0.06em',
          padding: '0 18px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        EPICKOR
      </div>
      <div
        style={{
          background: NEWS.ink,
          color: NEWS.paper,
          fontWeight: 600,
          fontSize: 34,
          letterSpacing: '0.22em',
          padding: '0 16px 0 18px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        NEWS
      </div>
    </div>
  );
}

/** The blinking LIVE-style band. Only rendered while `text` is non-empty. */
function BreakingBand({ text }: { text: string }) {
  const frame = useCurrentFrame();
  // A slow pulse, not a flash. Two-second period reads as a broadcast idle, and a faster
  // blink reads as an error state.
  const dot = 0.45 + 0.55 * Math.abs(Math.sin((frame / 30) * Math.PI));
  return (
    <div
      style={{
        position: 'absolute',
        left: BOX_LEFT,
        top: 258,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: NEWS.ink,
        padding: '0 22px',
        fontFamily: '"Archivo Variable", system-ui, sans-serif',
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: 999,
          background: NEWS.red,
          opacity: dot,
          display: 'inline-block',
        }}
      />
      <span
        style={{
          color: NEWS.paper,
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: '0.2em',
        }}
      >
        {text}
      </span>
    </div>
  );
}

/**
 * The lower third. Wipes in from the left over 8 frames — the standard broadcast
 * entrance, and a discrete state change on every beat, which is the kit's engine.
 */
function LowerThird({ beat, provenance, credit }: { beat: NewsBeat; provenance: CutProvenance; credit?: string }) {
  const frame = useCurrentFrame();
  const wipe = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  const width = (RAIL_RIGHT - BOX_LEFT) * wipe;
  return (
    <div style={{ position: 'absolute', left: BOX_LEFT, top: 1180, width: RAIL_RIGHT - BOX_LEFT, height: 160 }}>
      <div
        style={{
          width,
          height: '100%',
          background: NEWS.ink,
          overflow: 'hidden',
          borderLeft: `10px solid ${NEWS.red}`,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ padding: '18px 24px', width: RAIL_RIGHT - BOX_LEFT - 10, boxSizing: 'border-box' }}>
          <div
            style={{
              color: NEWS.paper,
              fontFamily: '"Archivo Variable", system-ui, sans-serif',
              fontWeight: 800,
              fontSize: beat.chyron.length > 30 ? 46 : 54,
              lineHeight: 1.04,
              letterSpacing: '-0.005em',
              whiteSpace: 'nowrap',
            }}
          >
            {beat.chyron}
          </div>
          <div
            style={{
              marginTop: 10,
              display: 'flex',
              alignItems: 'baseline',
              gap: 16,
              fontFamily: '"Inter Variable", system-ui, sans-serif',
            }}
          >
            <span style={{ color: NEWS.red, fontWeight: 700, fontSize: 24, letterSpacing: '0.14em' }}>
              {provenance}
            </span>
            {beat.sub ? (
              <span style={{ color: NEWS.paper, fontWeight: 500, fontSize: 26, letterSpacing: '0.02em' }}>
                {beat.sub}
              </span>
            ) : null}
            {credit ? (
              <span style={{ color: NEWS.mute, fontWeight: 600, fontSize: 22, letterSpacing: '0.1em', marginLeft: 'auto' }}>
                SOURCE: {credit}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The ticker. Runs the whole reel at a constant rate, which is what keeps a held
 * still from being a dead frame. Speed is 96 px/sec — fast enough to read as live,
 * slow enough to actually read.
 */
function Ticker({ items }: { items: string[] }) {
  const frame = useCurrentFrame();
  const line = items.join('   ···   ') + '   ···   ';
  const shift = (frame / 30) * 96;
  return (
    <div
      style={{
        position: 'absolute',
        left: BOX_LEFT,
        top: 1348,
        width: RAIL_RIGHT - BOX_LEFT,
        height: 48,
        background: NEWS.strip,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: BOX_LEFT ? 0 : 0,
          transform: `translateX(${-shift % 4000}px)`,
          whiteSpace: 'nowrap',
          color: NEWS.paper,
          fontFamily: '"Inter Variable", system-ui, sans-serif',
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: '0.06em',
          paddingLeft: 16,
        }}
      >
        {line}
        {line}
      </div>
    </div>
  );
}

/** The one number, counted. A figure that appears already-final is a caption, not an event. */
function Figure({ figure }: { figure: NewsFigure }) {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, Math.min(38, figure.dur - 6)], [0, 1], {
    extrapolateRight: 'clamp',
  });
  // Ease-out so the last digits settle rather than snapping.
  const eased = 1 - Math.pow(1 - t, 3);
  const shown = (figure.value * eased).toFixed(figure.decimals);
  const pop = interpolate(frame, [0, 6], [0.94, 1], { extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        position: 'absolute',
        left: BOX_LEFT,
        top: 700,
        width: RAIL_RIGHT - BOX_LEFT,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        transform: `scale(${pop})`,
        transformOrigin: 'left top',
      }}
    >
      <div
        style={{
          background: NEWS.red,
          color: NEWS.paper,
          fontFamily: '"Oswald Variable", system-ui, sans-serif',
          fontWeight: 700,
          fontSize: 190,
          lineHeight: 1,
          padding: '10px 26px 18px',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.01em',
        }}
      >
        {figure.prefix ?? ''}
        {shown}
        {figure.suffix ?? ''}
      </div>
      <div
        style={{
          background: NEWS.ink,
          color: NEWS.paper,
          fontFamily: '"Archivo Variable", system-ui, sans-serif',
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: '0.16em',
          padding: '12px 26px',
        }}
      >
        {figure.label}
      </div>
    </div>
  );
}

/**
 * Narration caption. Fixed position, centred inside the rail-safe box.
 *
 * Each caption ends one frame before the next begins — two live at once and libass
 * stacks the second above the first, which is what made captions jump around the
 * 2026-08-04 batch. That constraint is the SPEC's job (beats must not overlap); this
 * component only renders one.
 */
function Caption({ text }: { text: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: BOX_LEFT,
        top: 1410,
        width: RAIL_RIGHT - BOX_LEFT,
        minHeight: 160,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          color: NEWS.paper,
          fontFamily: '"Inter Variable", system-ui, sans-serif',
          fontWeight: 700,
          fontSize: 46,
          lineHeight: 1.18,
          textAlign: 'center',
          textShadow: '0 3px 18px rgba(0,0,0,.85), 0 1px 3px rgba(0,0,0,.95)',
          textWrap: 'balance',
        }}
      >
        {text}
      </span>
    </div>
  );
}

/** Outro. Red chip, one hook line, silent. Never a post path — a viewer cannot click it. */
function Outro({ hook }: { hook: string }) {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [0, 12], [22, 0], { extrapolateRight: 'clamp' });
  const fade = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: NEWS.ink, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ transform: `translateY(${rise}px)`, opacity: fade, textAlign: 'center' }}>
        <div style={{ width: 120, height: 8, background: NEWS.red, margin: '0 auto 34px' }} />
        <div
          style={{
            color: NEWS.paper,
            fontFamily: '"Archivo Variable", system-ui, sans-serif',
            fontWeight: 900,
            fontSize: 78,
            letterSpacing: '-0.01em',
            lineHeight: 1.06,
            marginBottom: 44,
            // The hook is authored with a deliberate line break. Browsers collapse a bare
            // newline in HTML, and letting the box choose the wrap point is exactly the
            // orphan-word failure the text-safety gate exists to stop.
            whiteSpace: 'pre-line',
          }}
        >
          {hook}
        </div>
        <div
          style={{
            display: 'inline-block',
            background: NEWS.red,
            color: '#fff',
            fontFamily: '"Archivo Variable", system-ui, sans-serif',
            fontWeight: 800,
            fontSize: 52,
            letterSpacing: '0.02em',
            padding: '16px 34px',
          }}
        >
          epickor.com
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ *
 * Composition
 * ------------------------------------------------------------------ */

/** The cut that is on screen at a given frame. */
function cutAt(cuts: NewsCut[], frame: number) {
  return cuts.find((c) => frame >= c.from && frame < c.from + c.dur);
}

export function Newsdesk({ spec }: { spec: NewsSpec }) {
  // Inside the component, never at module scope: at module scope the delayRender handle is
  // created before a render tab exists and the render dies on "bundled webfonts" not cleared.
  loadFonts();

  const frame = useCurrentFrame();
  const inOutro = frame >= spec.outro.from;
  const cut = cutAt(spec.cuts, frame);

  const layers: ReactNode[] = [];

  if (!inOutro) {
    // Hard cuts, no crossfade. News cuts hard; a dissolve here reads as a montage.
    for (const c of spec.cuts) {
      layers.push(
        <Sequence key={`cut-${c.from}`} from={c.from} durationInFrames={c.dur}>
          {c.kind === 'video' ? (
            <OffthreadVideo src={staticFile(c.src)} muted style={{ width: 1080, height: 1920, objectFit: 'cover' }} />
          ) : (
            <Img src={staticFile(c.src)} style={{ width: 1080, height: 1920, objectFit: 'cover' }} />
          )}
        </Sequence>,
      );
    }

    // A short scrim under the graphic stack only. Full-frame dimming is what made the
    // 2026-07-20 card news look black; here the top two thirds stay untouched.
    layers.push(
      <AbsoluteFill
        key="scrim"
        style={{
          background: 'linear-gradient(180deg, rgba(6,8,11,0) 54%, rgba(6,8,11,.55) 68%, rgba(6,8,11,.82) 100%)',
        }}
      />,
    );

    layers.push(<Bug key="bug" />);
    if (spec.breaking) {
      const first = spec.beats[0];
      layers.push(
        <Sequence key="breaking" from={0} durationInFrames={first.dur}>
          <BreakingBand text={spec.breaking} />
        </Sequence>,
      );
    }

    for (const b of spec.beats) {
      const c = cutAt(spec.cuts, b.from);
      layers.push(
        <Sequence key={`lt-${b.from}`} from={b.from} durationInFrames={b.dur}>
          <LowerThird beat={b} provenance={c?.provenance ?? 'FILE'} credit={c?.credit} />
        </Sequence>,
        <Sequence key={`cap-${b.from}`} from={b.from} durationInFrames={b.dur}>
          <Caption text={b.caption} />
        </Sequence>,
      );
    }

    if (spec.figure) {
      layers.push(
        <Sequence key="figure" from={spec.figure.from} durationInFrames={spec.figure.dur}>
          <Figure figure={spec.figure} />
        </Sequence>,
      );
    }

    layers.push(<Ticker key="ticker" items={spec.ticker} />);
  }

  return (
    <AbsoluteFill style={{ background: NEWS.ink }}>
      {layers}
      {inOutro ? (
        <Sequence from={spec.outro.from} durationInFrames={spec.outro.dur}>
          <Outro hook={spec.outro.hook} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
}
