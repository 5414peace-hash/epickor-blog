/**
 * DOSSIER — the D kit. A reel assembled out of the record.
 *
 * WHY THIS EXISTS (2026-08-18)
 *
 * COUNTER and RECEIPT are both *lists*: comparable items, each carrying a figure. That is a
 * real class of EpicKor post, but it is not the strongest one. The site's best material is
 * single-subject and DATED — 삼양's 우지 파동, Coway's 1998 IMF sale, Winia's liquidation,
 * 약과's two bans, 라운드랩's Dokdo day. None of those is a comparison, so neither existing
 * kit can hold them, and until now they had no Reels form at all.
 *
 * WHAT IT DOES THAT A CAROUSEL CANNOT
 *   The power of a timeline is the GAP between two dates, and a carousel throws that away: a
 *   swipe moves 1989 to 1997 in half a second. Here the years count in the gutter BETWEEN
 *   entries. Eight years takes eight years' worth of ticks to cross and twenty-eight takes
 *   longer still, so the reader waits — which is the only way elapsed time is ever felt. It
 *   is the same argument the other two kits make with a moving number, applied to time
 *   instead of money.
 *
 * WHY A DARK GROUND — and why it is not just for variety
 *   All four shipped reels are a light ground: clinical blue, warm cream, fluorescent grey,
 *   thermal paper. This one inverts, and the reason is the subject rather than the grid.
 *   1989 newspaper archives are physically stored on microfilm, and microfilm is white type
 *   on black. A story assembled out of the record should look like the record. The off-white
 *   is emulsion, never #FFF — pure white reads as a slide.
 *
 * TYPE
 *   Newsreader for the entry heads. `FONTS.serif` is documented for "heritage, food history,
 *   anything print-flavoured" and no other reel has used it, so the kit is separable by face
 *   as well as by ground. Oswald carries every numeral — stamps, the year counter, the
 *   figures — because the counting IS the format and the digits must stay condensed enough
 *   to run large. Inter takes the body.
 *
 * NO PHOTOGRAPHY, deliberately, same as RECEIPT
 *   The constraint that blocked a whole session was pack shots. Both kits designed after that
 *   day need none: any post with dated, sourced beats becomes a reel the same day.
 *
 * MOTION
 *   No zoom anywhere. Entries arrive as a stamp landing and type printing; the rail fills as
 *   the file advances; the year counter is the ambient motion during a span, and it is a
 *   discrete change every two to three frames rather than a drift.
 */
import { createContext, useContext, type ReactNode } from 'react';
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { FONTS, SAFE } from './tokens/core';
import { loadFonts } from './fonts';

export type DossierPalette = {
  /** The archive ground. Cold near-black, never pure #000. */
  film: string;
  /** The type. Warm off-white — microfilm emulsion, not paper white. */
  emulsion: string;
  /** The rail, hairlines, unspent ticks. */
  faint: string;
  /** Body copy and secondary labels. */
  mute: string;
  /** The one colour: date stamps on the turn, the verdict, the closing figure. */
  flag: string;
};

export const FILM_DEFAULT: DossierPalette = {
  film: '#0E1114',
  emulsion: '#E9E4D8',
  faint: '#333A42',
  mute: '#8E959C',
  flag: '#D4452F',
};

export type DossierFigure = {
  /** Counts from this to `to`. A collapse should fall, so `to` may be the smaller number. */
  from: number;
  to: number;
  unit: string;
  /**
   * Denominator for the bar, when the figure is a share of something. Without it the bar is
   * scaled to the larger of `from`/`to` and therefore starts full — which reads as 100%,
   * not as 60%.
   */
  scale?: number;
  /** What the figure is of. Printed above it. */
  label: string;
  /** Printed under it. The honest qualifier goes here. */
  note: string;
};

/**
 * A pinned photograph. The kit works without any, but a subject the audience has never heard
 * of has to show itself — the first cut of the 우지 파동 reel was all type and the
 * representative could not tell what it was about.
 *
 * The caption says what the picture IS. It never apologises for the picture, and it never
 * stands in for a subject the picture does not show: an exhibit on a 1989 card has to be a
 * 1989 thing, so a card with no era-appropriate image gets no exhibit rather than a
 * plausible substitute. That is the same rule as the 2026-08-03 카드뉴스 defect.
 */
export type Exhibit = {
  /** Path under `public/`, passed through `staticFile`. */
  media: string;
  /** Aspect ratio w/h, so the plate can be laid out without measuring the file. */
  ratio: number;
  label: string;
  caption: string;
};

export type DossierEntry = {
  /** '1989 · 11 · 03', or an honest span label where no exact date is sourced. */
  stamp: string;
  /**
   * Pre-broken. EACH LINE MUST FIT UNBROKEN at 100px in the serif — roughly **13
   * characters**. Nothing throws when a line overflows; the browser silently orphans the
   * last word, which is how 'THE SHELF TAG' shipped broken on the CVS reel's first render.
   */
  head: string[];
  /**
   * One paragraph per beat, printed in sequence. Two is the working maximum. It is a LIST
   * rather than a string because an entry whose last change lands at frame 16 of 84 then
   * holds a still picture for 2.3 seconds — which is precisely reel 376's defect, measured
   * and rejected. Splitting the prose gives the back half of the cut something to do.
   */
  body: string[];
  /** A small tracked line that lands late in the cut: the statute, the court, the plant. */
  detail?: string;
  figure?: DossierFigure;
  /** Takes the lower band. Wins over `figure`, which wins over the ghosted year. */
  exhibit?: Exhibit;
  /** Where this entry sits in time. Drives the counter in the gutter before the NEXT entry. */
  year: number;
  /** Set on the entry that turns the story. Prints its stamp in `flag`. */
  turn?: boolean;
};

export type DossierSpec = {
  /** Small tracked line at the top of every frame, e.g. 'CASE FILE · 우지 파동'. */
  caseLine: string;
  /** Opening card. Pre-broken, and complete on frame 0 — it is the grid thumbnail. */
  title: string[];
  titleSub: string;
  entries: DossierEntry[];
  /** The payoff: one figure that closes the loop. */
  close: {
    figure: string;
    label: string;
    note: string;
    hangul?: string;
    /** The evidence itself, printed above the drawn figure. See `Close`. */
    media?: string;
    mediaRatio?: number;
    mediaCaption?: string;
  };
  /** Where the facts came from. Printed at the foot of the closing card. */
  sourceLine?: string;
  outroHook: string;
  outroSub: string;
};

const Pal = createContext<DossierPalette>(FILM_DEFAULT);
const usePal = () => useContext(Pal);

const F = { body: FONTS.neutral, num: FONTS.condensed, head: FONTS.serif } as const;

/* ------------------------------------------------------------------ *
 * Timing
 * ------------------------------------------------------------------ */
export const OPEN = 78;
export const ENTRY = 84;
export const CLOSE = 102;
export const OUTRO = 84;

/**
 * A span's length is proportional to the years it crosses, clamped. Proportional matters: if
 * every gap took the same time the format would be lying about the one thing it exists to
 * show. Clamped matters too — 28 years at a linear rate would run nine seconds.
 */
export const spanFrames = (gap: number) => Math.min(74, Math.max(26, Math.round(22 + gap * 2.4)));

export function dossierDuration(spec: DossierSpec) {
  let n = OPEN;
  spec.entries.forEach((e, i) => {
    n += ENTRY;
    const next = spec.entries[i + 1];
    if (next && next.year > e.year) n += spanFrames(next.year - e.year);
  });
  return n + CLOSE + OUTRO;
}

/**
 * Opening stamp beats, in frames. Exported because `build-bgm.py` reads the same numbers —
 * the snap you hear and the invert you see are one event, and a table in two places is a
 * table that will disagree.
 */
export const TITLE_AT = [6, 20, 34];
export const FOOTER_AT = 52;

/** Two hard inverts per beat: on 0-2, off 3-4, on 5-7. That is the 깜빡깜빡. */
export function struck(f: number, at: number) {
  const d = f - at;
  return (d >= 0 && d <= 2) || (d >= 5 && d <= 7);
}

const snap = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3.2);
const at = (f: number, start: number, dur = 8) => snap((f - start) / dur);

/* ------------------------------------------------------------------ *
 * Geometry
 *
 * The rail and the text used to share x96, so the rail's tick sat on the first glyph of
 * every line — "THEN NOTHING, UNTIL" rendered with a red dot through the T. The rail now has
 * its own column and nothing else enters it.
 * ------------------------------------------------------------------ */
const RAIL_X = 84;
const TEXT_X = 172;
const TEXT_R = SAFE.side;
const BODY_W = 830;

/* ------------------------------------------------------------------ *
 * Ground and furniture
 * ------------------------------------------------------------------ */

/**
 * Emulsion grain, scan banding, vignette. Static per frame on purpose — grain that crawls
 * reads as a video filter rather than as film stock, and it also destroys h264 bitrate by
 * making every frame a fresh keyframe's worth of noise.
 */
function Film() {
  const C = usePal();
  return (
    <AbsoluteFill style={{ background: C.film }}>
      <AbsoluteFill
        style={{
          opacity: 0.07,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='3'/></filter><rect width='240' height='240' filter='url(%23n)'/></svg>\")",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.05,
          background:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 5px)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 42%, transparent 46%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </AbsoluteFill>
  );
}

/** Case line, hairline, and the closing rule. Furniture: on every frame, never animated. */
function Masthead({ spec }: { spec: DossierSpec }) {
  const C = usePal();
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: TEXT_X,
          top: 190,
          font: `700 24px/1 ${F.body}`,
          letterSpacing: '0.26em',
          color: C.mute,
          textTransform: 'uppercase',
        }}
      >
        {spec.caseLine}
      </div>
      <div
        style={{ position: 'absolute', left: TEXT_X, right: TEXT_R, top: 232, height: 1, background: C.faint }}
      />
      {/* Bottom rule. Without it the lower third of a sparse card has no edge and the frame
          reads as unfinished rather than as spare. */}
      <div
        style={{ position: 'absolute', left: TEXT_X, right: TEXT_R, top: 1596, height: 1, background: C.faint }}
      />
    </>
  );
}

/**
 * The vertical rail, one tick per entry. `progress` fills the segment ahead of the current
 * tick during a span, so the year counter has something travelling beside it and the reader
 * can see how much file is left.
 *
 * Unspent ticks are FILLED with `faint`, not outlined. An outlined dot on a near-black ground
 * measured invisible on the first render, so the rail showed only where the file had been and
 * never how far it had to go.
 */
function Rail({ index, total, progress = 0 }: { index: number; total: number; progress?: number }) {
  const C = usePal();
  const top = 320;
  const bottom = 1560;
  const step = (bottom - top) / Math.max(1, total - 1);
  const y = (i: number) => top + i * step;
  const filled = y(index) + step * progress;
  return (
    <>
      <div style={{ position: 'absolute', left: RAIL_X, top, width: 2, height: bottom - top, background: C.faint }} />
      <div
        style={{
          position: 'absolute',
          left: RAIL_X,
          top,
          width: 2,
          height: Math.max(0, filled - top),
          background: C.flag,
        }}
      />
      {Array.from({ length: total }, (_, i) => {
        const on = i === index;
        const size = on ? 24 : 13;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: RAIL_X + 1 - size / 2,
              top: y(i) - size / 2,
              width: size,
              height: size,
              borderRadius: 999,
              background: i <= index ? C.flag : C.faint,
              boxShadow: on ? `0 0 0 8px ${C.film}` : undefined,
            }}
          />
        );
      })}
    </>
  );
}

function Watermark() {
  const C = usePal();
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.side,
        top: 60,
        font: `800 21px/1 ${F.body}`,
        letterSpacing: '0.16em',
        color: C.emulsion,
        opacity: 0.4,
      }}
    >
      EPICKOR.COM
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Cards
 *
 * EVERY CARD IS ANCHORED TOP AND BOTTOM. The first render put all content in the upper 45%
 * and left the lower half black on all nine cuts. That is the hollow-centre failure the
 * Reels rules already name for motion cards, and it makes a spare design read as an
 * unfinished one. Each card type now has a lower element that belongs to it: a ghosted year
 * on an entry, a span bar on a gap, a source credit on the close.
 * ------------------------------------------------------------------ */

/**
 * The opening card, and the reel's only chance to earn the next twenty-seven seconds.
 *
 * IT USED TO BE A STILL. Frame 0 has to render complete because it is the grid thumbnail, and
 * that requirement quietly became "animate nothing" — so the first 1.8 seconds were a static
 * page. Representative: *"맨 처음 인트로에 나오는 문장이 더 임펙트 있어야할듯 … 색이 바뀌면서
 * 깜빡깜빡 거리면서 효과음이 이쁜게 같이 나온다던가 (스테이플러 찰칵 거리는 소리)."*
 *
 * The two requirements are only in conflict if the animation is an entrance. So every line is
 * present and final on frame 0 — the thumbnail is the finished headline — and the motion is a
 * STAMP passing down them: each line inverts to a solid flag-coloured block twice, hard cut,
 * no fade, with a stapler snap on each hit. Two inverts per line is the 깜빡깜빡; three lines
 * is three snaps in the first second and a half.
 */
function Open({ spec }: { spec: DossierSpec }) {
  const C = usePal();
  const f = useCurrentFrame();
  const years = spec.entries.map((e) => e.year);
  const span = Math.max(...years) - Math.min(...years);
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 46% 44%, ${C.flag}26 0%, transparent 62%)`,
          opacity: 1 - at(f, 4, 26) * 0.8,
        }}
      />
      <div style={{ position: 'absolute', left: TEXT_X, right: TEXT_R, top: 430 }}>
        <div
          style={{
            font: `600 112px/1.03 ${F.head}`,
            letterSpacing: '-0.018em',
            wordSpacing: '0.03em',
            color: C.emulsion,
          }}
        >
          {spec.title.map((l, i) => {
            const on = struck(f, TITLE_AT[i] ?? 4);
            return (
              <div key={l} style={{ display: 'flex' }}>
                <span
                  style={{
                    // Hard cut, not a fade: a stamp either has landed or it has not, and a
                    // ramp at this size reads as a glow rather than as an impact.
                    background: on ? C.flag : 'transparent',
                    color: on ? C.film : C.emulsion,
                    padding: '2px 16px 10px',
                    marginLeft: -16,
                  }}
                >
                  {l}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{ width: 132, height: 4, background: C.flag, margin: '46px 0 36px' }} />
        <div style={{ font: `500 38px/1.44 ${F.body}`, color: C.mute, maxWidth: BODY_W }}>
          {spec.titleSub}
        </div>
      </div>
      <div style={{ position: 'absolute', left: TEXT_X, right: TEXT_R, top: 1428 }}>
        <div style={{ height: 1, background: C.faint, marginBottom: 26 }} />
        <div
          style={{
            font: `700 30px/1 ${F.num}`,
            letterSpacing: '0.2em',
            color: struck(f, FOOTER_AT) ? C.film : C.emulsion,
            background: struck(f, FOOTER_AT) ? C.flag : 'transparent',
            padding: '4px 12px 8px',
            marginLeft: -12,
            display: 'inline-block',
            textTransform: 'uppercase',
          }}
        >
          {spec.entries.length} dates
          <span style={{ color: struck(f, FOOTER_AT) ? C.film : C.flag }}>{'  ·  '}</span>
          {span} years
        </div>
      </div>
    </AbsoluteFill>
  );
}

/** A figure that moves and drains a bar at the same time. Two discrete changes, one beat. */
function Figure({ fig, from }: { fig: DossierFigure; from: number }) {
  const C = usePal();
  const f = useCurrentFrame();
  const t = at(f, from, 26);
  const v = Math.round(fig.from + (fig.to - fig.from) * t);
  const denom = fig.scale ?? Math.max(fig.from, fig.to);
  return (
    <div style={{ position: 'absolute', left: TEXT_X, right: TEXT_R, top: 1116 }}>
      <div
        style={{
          font: `700 24px/1 ${F.body}`,
          letterSpacing: '0.2em',
          color: C.mute,
          textTransform: 'uppercase',
          opacity: at(f, from - 8, 8),
        }}
      >
        {fig.label}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 30, marginTop: 14 }}>
        <div
          style={{
            font: `700 168px/0.88 ${F.num}`,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.02em',
            color: C.flag,
          }}
        >
          {v}
          <span style={{ fontSize: 88 }}>{fig.unit}</span>
        </div>
        <div style={{ flex: '1 1 auto', paddingBottom: 40 }}>
          <div style={{ height: 18, background: C.faint }}>
            <div style={{ height: 18, width: `${(v / denom) * 100}%`, background: C.flag }} />
          </div>
        </div>
      </div>
      <div style={{ font: `500 32px/1.42 ${F.body}`, color: C.mute, marginTop: 22, maxWidth: BODY_W }}>
        {fig.note}
      </div>
    </div>
  );
}

/**
 * The exhibit plate. Sized from a declared ratio rather than measured, so a wrong number
 * shows up as a letterboxed plate rather than a silently stretched photograph.
 *
 * It lands with a two-frame kick and a slight overshoot, the way a print is pressed onto a
 * page — the same gesture as the date stamp, so the card reads as one object being assembled.
 */
function ExhibitPlate({ ex, from }: { ex: Exhibit; from: number }) {
  const C = usePal();
  const f = useCurrentFrame();
  const t = at(f, from, 11);
  if (t <= 0) return null;
  // Big enough to carry the card. The first cut ran these at 420x310 beside a narrow caption
  // column and they read as postage stamps — which defeats the entire reason for adding them.
  // The plate now owns the lower 40% of the frame and the caption sits under it at full width.
  const MAXH = 566;
  const MAXW = 848;
  let h = MAXH;
  let w = Math.round(MAXH * ex.ratio);
  if (w > MAXW) {
    w = MAXW;
    h = Math.round(MAXW / ex.ratio);
  }
  const kick = f - from < 2 ? (f - from === 0 ? 5 : 2) : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: TEXT_X,
        right: TEXT_R,
        top: 920,
        opacity: t,
      }}
    >
      <div
        style={{
          width: w,
          height: h,
          border: `3px solid ${C.faint}`,
          background: C.film,
          overflow: 'hidden',
          transform: `translateX(${kick}px) rotate(-0.7deg) scale(${1.06 - 0.06 * t})`,
        }}
      >
        <Img
          src={staticFile(ex.media)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
      <div style={{ marginTop: 20 }}>
        <span
          style={{
            font: `700 23px/1 ${F.num}`,
            letterSpacing: '0.22em',
            color: C.flag,
            textTransform: 'uppercase',
          }}
        >
          {ex.label}
          <span style={{ color: C.faint }}>{'   '}</span>
        </span>
        <span style={{ font: `500 27px/1.42 ${F.body}`, color: C.mute }}>{ex.caption}</span>
      </div>
    </div>
  );
}

/** Entry cards with no figure get the date itself, set huge and faint across the lower half. */
function GhostYear({ year, from }: { year: number; from: number }) {
  const C = usePal();
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        left: TEXT_X - 14,
        top: 1160,
        font: `600 380px/0.8 ${F.num}`,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.03em',
        color: C.faint,
        opacity: 0.85 * at(f, from, 14),
      }}
    >
      {year}
    </div>
  );
}

function Entry({ entry, index, total }: { entry: DossierEntry; index: number; total: number }) {
  const C = usePal();
  const f = useCurrentFrame();
  const stampColor = entry.turn ? C.flag : C.emulsion;
  // Two-frame land: a rubber stamp misregisters and settles.
  const kick = f < 2 ? (f === 0 ? 4 : 2) : 0;
  return (
    <AbsoluteFill>
      <Rail index={index} total={total} />
      <div style={{ position: 'absolute', left: TEXT_X, right: TEXT_R, top: 306 }}>
        <div
          style={{
            display: 'inline-block',
            border: `3px solid ${stampColor}`,
            padding: '11px 22px 14px',
            transform: `translateX(${kick}px) rotate(-1.1deg)`,
          }}
        >
          <span
            style={{
              font: `600 46px/1 ${F.num}`,
              letterSpacing: '0.1em',
              fontVariantNumeric: 'tabular-nums',
              color: stampColor,
            }}
          >
            {entry.stamp}
          </span>
        </div>
        <div
          style={{
            font: `600 104px/1.02 ${F.head}`,
            letterSpacing: '-0.016em',
            wordSpacing: '0.03em',
            color: C.emulsion,
            marginTop: 34,
          }}
        >
          {entry.head.map((l, i) => (
            <div key={l} style={{ opacity: at(f, 4 + i * 5, 7) }}>
              {l}
            </div>
          ))}
        </div>
        {entry.body.map((p, i) => (
          <div
            key={p}
            style={{
              font: `500 40px/1.46 ${F.body}`,
              color: C.mute,
              marginTop: i === 0 ? 40 : 22,
              maxWidth: BODY_W,
              opacity: at(f, 16 + i * 18, 10),
            }}
          >
            {p}
          </div>
        ))}
        {entry.detail ? (
          <div
            style={{
              font: `700 25px/1.4 ${F.body}`,
              letterSpacing: '0.16em',
              color: C.flag,
              textTransform: 'uppercase',
              marginTop: 34,
              opacity: at(f, 58, 9),
            }}
          >
            {entry.detail}
          </div>
        ) : null}
      </div>
      {entry.exhibit ? (
        <ExhibitPlate ex={entry.exhibit} from={24} />
      ) : entry.figure ? (
        <Figure fig={entry.figure} from={30} />
      ) : (
        <GhostYear year={entry.year} from={44} />
      )}
    </AbsoluteFill>
  );
}

/**
 * The gutter counter — the kit's whole reason to exist as video. The years tick one at a
 * time, so a reader who watches 1997 climb to 2025 has actually spent time crossing it.
 */
function Span({
  fromYear,
  toYear,
  index,
  total,
  duration,
}: {
  fromYear: number;
  toYear: number;
  index: number;
  total: number;
  duration: number;
}) {
  const C = usePal();
  const f = useCurrentFrame();
  const travel = duration - 12;
  // Linear, not eased. An eased counter reads as an animation; a linear one reads as a
  // machine advancing, and the point is that the time is real.
  const t = Math.min(1, f / travel);
  const year = Math.round(fromYear + (toYear - fromYear) * t);
  const gap = toYear - fromYear;
  return (
    <AbsoluteFill>
      <Rail index={index} total={total} progress={t} />
      <div style={{ position: 'absolute', left: TEXT_X, right: TEXT_R, top: 470 }}>
        <div
          style={{
            font: `700 26px/1 ${F.body}`,
            letterSpacing: '0.24em',
            color: C.mute,
            textTransform: 'uppercase',
          }}
        >
          Then nothing, until
        </div>
        <div
          style={{
            font: `600 306px/0.88 ${F.num}`,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.03em',
            color: C.emulsion,
            marginTop: 28,
          }}
        >
          {year}
        </div>
        <div
          style={{
            font: `600 66px/1 ${F.num}`,
            letterSpacing: '0.06em',
            color: C.flag,
            marginTop: 36,
            // Lands only once the counter has ARRIVED. At `duration - 22` the label read
            // "8 YEARS LATER" over a counter still showing 1995 — it announced a destination
            // the picture had not reached.
            opacity: at(f, travel, 7),
          }}
        >
          {gap === 1 ? 'ONE YEAR LATER' : `${gap} YEARS LATER`}
        </div>
      </div>
      {/* The gap drawn as distance, both ends labelled. It fills the lower half, and it is the
          same information as the counter held still enough to actually read. */}
      <div style={{ position: 'absolute', left: TEXT_X, right: TEXT_R, top: 1300 }}>
        <div style={{ height: 6, background: C.faint }}>
          <div style={{ height: 6, width: `${t * 100}%`, background: C.flag }} />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 20,
            font: `700 30px/1 ${F.num}`,
            letterSpacing: '0.12em',
            color: C.mute,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          <span>{fromYear}</span>
          <span>{toYear}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/**
 * The payoff.
 *
 * THE PHOTOGRAPH COMES FIRST, THEN THE DRAWN FIGURE. The reel's whole claim is that the
 * incriminating ingredient is printed on the FRONT of the bag, and a caption asserting that
 * is worth far less than a picture in which you can read it. The drawn stamp still follows,
 * because the print in the photograph is small on a phone and the number has to be legible —
 * but it is now a restatement of visible evidence rather than the only evidence.
 */
function Close({ spec }: { spec: DossierSpec }) {
  const C = usePal();
  const f = useCurrentFrame();
  const hasMedia = Boolean(spec.close.media);
  const plateW = 848;
  const plateH = Math.round(plateW / (spec.close.mediaRatio ?? 3.333));
  // With evidence on screen the stamp is a caption, not the hero, so it runs smaller.
  const figSize = hasMedia ? 118 : 158;
  const stampFrom = hasMedia ? 26 : 3;
  const s = at(f, stampFrom, 10);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: TEXT_X, right: TEXT_R, top: 400 }}>
        <div
          style={{
            font: `700 26px/1.4 ${F.body}`,
            letterSpacing: '0.2em',
            color: C.mute,
            textTransform: 'uppercase',
          }}
        >
          {spec.close.label}
        </div>
        {hasMedia ? (
          <>
            <div
              style={{
                width: plateW,
                height: plateH,
                marginTop: 26,
                border: `3px solid ${C.faint}`,
                background: C.film,
                overflow: 'hidden',
                opacity: at(f, 3, 10),
              }}
            >
              <Img
                src={staticFile(spec.close.media as string)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            {spec.close.mediaCaption ? (
              <div
                style={{
                  font: `500 28px/1.4 ${F.body}`,
                  color: C.mute,
                  marginTop: 18,
                  maxWidth: plateW,
                  opacity: at(f, 16, 9),
                }}
              >
                {spec.close.mediaCaption}
              </div>
            ) : null}
          </>
        ) : null}
        <div
          style={{
            display: 'inline-block',
            border: `8px solid ${C.flag}`,
            padding: '18px 30px 24px',
            marginTop: 36,
            transform: `rotate(-2.2deg) scale(${1.18 - 0.18 * s})`,
            opacity: s,
          }}
        >
          <span
            style={{ font: `700 ${figSize}px/0.94 ${F.num}`, letterSpacing: '0.01em', color: C.flag }}
          >
            {spec.close.figure}
          </span>
        </div>
        {spec.close.hangul ? (
          <div
            style={{
              font: `600 48px/1.3 ${F.body}`,
              color: C.emulsion,
              marginTop: 48,
              opacity: at(f, stampFrom + 23, 9),
            }}
          >
            {spec.close.hangul}
          </div>
        ) : null}
        <div
          style={{
            font: `500 36px/1.42 ${F.body}`,
            color: C.mute,
            marginTop: 28,
            maxWidth: BODY_W,
            opacity: at(f, stampFrom + 33, 10),
          }}
        >
          {spec.close.note}
        </div>
      </div>
      {/* A factual reel should say where the facts came from, and it also anchors the foot of
          the card. It lands last, after the reader has taken the number. */}
      {spec.sourceLine ? (
        <div
          style={{ position: 'absolute', left: TEXT_X, right: TEXT_R, top: 1462, opacity: at(f, 66, 12) }}
        >
          <div style={{ height: 1, background: C.faint, marginBottom: 22 }} />
          <div
            style={{
              font: `600 25px/1.4 ${F.body}`,
              letterSpacing: '0.13em',
              color: C.mute,
              textTransform: 'uppercase',
            }}
          >
            {spec.sourceLine}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
}

function Outro({ spec }: { spec: DossierSpec }) {
  const C = usePal();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: TEXT_X, right: TEXT_R, top: 560 }}>
        <div
          style={{
            font: `600 108px/1.02 ${F.head}`,
            letterSpacing: '-0.018em',
            wordSpacing: '0.03em',
            color: C.emulsion,
            whiteSpace: 'pre-line',
          }}
        >
          {spec.outroHook}
        </div>
        <div
          style={{
            font: `500 36px/1.4 ${F.body}`,
            color: C.mute,
            marginTop: 34,
            maxWidth: BODY_W,
            opacity: at(f, 12, 9),
          }}
        >
          {spec.outroSub}
        </div>
        <div
          style={{
            display: 'inline-block',
            marginTop: 54,
            background: C.flag,
            padding: '22px 40px 26px',
            opacity: at(f, 26, 8),
          }}
        >
          <span
            style={{ font: `800 62px/1 ${FONTS.grotesk}`, letterSpacing: '-0.012em', color: '#FFFFFF' }}
          >
            epickor.com
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ *
 * Composition
 * ------------------------------------------------------------------ */

export function ReelDossier({
  spec,
  palette = FILM_DEFAULT,
}: {
  spec: DossierSpec;
  palette?: DossierPalette;
}) {
  // Inside the component, never at module scope: at module scope the delayRender handle is
  // created before a render tab exists and the render dies on "bundled webfonts" not cleared.
  loadFonts();

  const total = spec.entries.length;
  const cuts: { from: number; dur: number; node: ReactNode }[] = [];
  let cur = 0;

  cuts.push({ from: cur, dur: OPEN, node: <Open spec={spec} /> });
  cur += OPEN;

  spec.entries.forEach((e, i) => {
    cuts.push({ from: cur, dur: ENTRY, node: <Entry entry={e} index={i} total={total} /> });
    cur += ENTRY;
    const next = spec.entries[i + 1];
    if (next && next.year > e.year) {
      const d = spanFrames(next.year - e.year);
      cuts.push({
        from: cur,
        dur: d,
        node: <Span fromYear={e.year} toYear={next.year} index={i} total={total} duration={d} />,
      });
      cur += d;
    }
  });

  cuts.push({ from: cur, dur: CLOSE, node: <Close spec={spec} /> });
  cur += CLOSE;
  cuts.push({ from: cur, dur: OUTRO, node: <Outro spec={spec} /> });

  return (
    <Pal.Provider value={palette}>
      <AbsoluteFill style={{ background: palette.film, overflow: 'hidden' }}>
        <Film />
        {cuts.map((c) => (
          // Hard cuts, adjacent Sequences. No out-fade: in a kit whose cuts do not overlap an
          // out-fade defends against nothing and manufactures blank frames at every boundary —
          // measured at a full second across the CVS reel's first render.
          <Sequence key={c.from} from={c.from} durationInFrames={c.dur}>
            {c.node}
          </Sequence>
        ))}
        <Masthead spec={spec} />
        <Watermark />
      </AbsoluteFill>
    </Pal.Provider>
  );
}
