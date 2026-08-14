/**
 * CORE TOKENS — shared by every EpicKor reel, and not negotiable per video.
 *
 * The split matters: touching anything in this file is a SYSTEM change and every
 * existing reel inherits it. Picking different colours or a different font pairing
 * for one video is a THEME change and lives in `theme.ts`. Do not move a value
 * across that line to make one reel easier.
 *
 * Every number below was measured on a rendered 1080x1920 frame, not guessed.
 * Where a rule exists because something shipped broken, the incident is named so
 * the next person does not "simplify" the fix away.
 */

/* ------------------------------------------------------------------ *
 * Safe areas — platform chrome, in composition pixels at 1080x1920.
 * ------------------------------------------------------------------ */
export const SAFE = {
  /** Instagram's top chrome. Measured: the account row eats y0-150. */
  top: 150,
  /** Caption/CTA stack at the bottom. */
  bottom: 320,
  side: 60,
  /**
   * The like/comment/share rail. It is a RIGHT-EDGE column that only exists
   * below y1100 — a mark can sit at x930+ near the top of the frame and be fine,
   * and the same mark at y1200 is covered by a button.
   */
  actionRail: { x: 930, fromY: 1100 },
} as const;

/** True when a box intrudes on platform chrome. Used by the render gate. */
export function violatesSafeArea(box: { x: number; y: number; w: number; h: number }) {
  const hits: string[] = [];
  if (box.y < SAFE.top) hits.push(`top cut zone (y${box.y} < ${SAFE.top})`);
  if (box.y + box.h > 1920 - SAFE.bottom) hits.push(`bottom cut zone`);
  if (box.x < SAFE.side || box.x + box.w > 1080 - SAFE.side) hits.push(`side margin`);
  if (box.y + box.h > SAFE.actionRail.fromY && box.x + box.w > SAFE.actionRail.x) {
    hits.push(`action rail (x${SAFE.actionRail.x}+ below y${SAFE.actionRail.fromY})`);
  }
  return hits;
}

/* ------------------------------------------------------------------ *
 * Type — ratios and roles. A theme picks the FACES; it does not pick sizes.
 * ------------------------------------------------------------------ */
export const TYPE = {
  /**
   * Letter-spacing is expressed in em so it survives a size change. Converting a
   * px value: em = px / fontSize. Never copy an em value between two elements of
   * different size — that is the same bug as hard-coding px, one step removed.
   */
  hook: { size: 118, weight: 900, tracking: -0.027, leading: 0.94 },
  headline: { size: 76, weight: 800, tracking: -0.021, leading: 1.02 },
  sub: { size: 34, weight: 600, tracking: -0.006, leading: 1.14 },
  /** The narration caption. One line. See CAPTION below for its behaviour. */
  caption: { size: 34, weight: 700, tracking: -0.006, leading: 1.14 },
  kicker: { size: 22, weight: 700, tracking: 0.14, leading: 1.2 },
  readout: { size: 92, weight: 900, tracking: -0.024, leading: 1 },
  label: { size: 18, weight: 700, tracking: 0.06, leading: 1.3 },
} as const;

export type TypeRole = keyof typeof TYPE;

/** Emit a CSS `font` shorthand plus tracking for a role, in one place. */
export function typeCss(role: TypeRole, family: string) {
  const t = TYPE[role];
  return {
    font: `${t.weight} ${t.size}px/${t.leading} ${family}`,
    letterSpacing: `${t.tracking}em`,
  } as const;
}

/* ------------------------------------------------------------------ *
 * Motion
 * ------------------------------------------------------------------ */
export const MOTION = {
  /**
   * Cross-cut media overlap. Photography crossfades across this window.
   * TEXT MUST NOT. See TEXT_EXIT.
   */
  overlap: 16,
  /**
   * Outgoing text must be fully gone BEFORE the next cut mounts, not while it is
   * arriving. 2026-08-14: the exit fade used to start at the boundary and run 8
   * frames past it, so two mastheads rendered at once and the glyphs interleaved —
   * measured "THE TIMING | 음주 전 | CE STORE | 숙취해소제" on 377 f203 and
   * "GWANGANLBRIDGBSAN" on 379 f155. The fade now COMPLETES at the boundary.
   */
  textExitFrames: 5,
  /**
   * Frame 0 of the whole reel is the thumbnail. Anything that fades in is black in
   * the grid. 379 f0 measured mean luma 16.2 with 0.2% lit pixels before this rule;
   * 50.8 and 31.7% after. Every element on the first cut renders complete.
   */
  firstCutIsComplete: true,
  /** Something must always be moving, or the reel reads as a slideshow. */
  requireAmbientMotion: true,
  /** Concurrently mounted video elements. Above this Chrome starts dropping frames. */
  maxConcurrentClips: 24,
} as const;

/**
 * Opacity for a text block that belongs to a cut, given the cut-local frame and
 * the cut's own Sequence duration. Fades out; never overlaps the next cut.
 */
export function textExit(frame: number, durationInFrames: number) {
  const end = durationInFrames - MOTION.overlap;
  const start = end - MOTION.textExitFrames;
  if (frame <= start) return 1;
  if (frame >= end) return 0;
  return 1 - (frame - start) / (end - start);
}

/* ------------------------------------------------------------------ *
 * Caption behaviour — the single most-reverted rule in this repo.
 * ------------------------------------------------------------------ */
export const CAPTION = {
  /** No fade. A caption that fades is unreadable for its first and last third. */
  fade: false,
  /** No travel. The band is furniture; only the words inside it change. */
  translate: false,
  /** One line. Two lines push into the bottom cut zone at this size. */
  maxLines: 1,
  /** Band geometry, from the bottom edge. */
  bottom: 410,
  minHeight: 92,
  /**
   * A caption may lead its narration by a few frames, but the lead is made by
   * ENDING the previous caption early, never by starting the next one early:
   * beats[i].endFrame === beats[i + 1].startFrame - 1.
   */
  leadFrames: 6,
} as const;

/* ------------------------------------------------------------------ *
 * Radius and elevation
 * ------------------------------------------------------------------ */
export const RADIUS = { chip: 0, panel: 0, card: 4, pill: 999 } as const;

/* ------------------------------------------------------------------ *
 * Fonts — bundled, never system.
 *
 * public/assets/fonts/fonts.css carries the @font-face rules: four Latin faces as
 * single variable woff2 files (weight 100-900 each) plus Noto Sans KR across its
 * 124 unicode-range subsets. The Korean face is not optional decoration — reel
 * kickers carry live Hangul (숙취해소제, 음주 전), and without it those chips fall
 * back to whatever the render host happens to have installed.
 * ------------------------------------------------------------------ */
const KR = `'Noto Sans KR Variable'`;

export const FONTS = {
  /** Neutral workhorse. The default unless a theme says otherwise. */
  neutral: `'Inter Variable', ${KR}, sans-serif`,
  /** Wide and blunt. For hooks that need to hit. */
  grotesk: `'Archivo Variable', ${KR}, sans-serif`,
  /** Condensed display. Long hooks, ticket/schedule subjects. */
  condensed: `'Oswald Variable', ${KR}, sans-serif`,
  /** Editorial serif. Heritage, food history, anything print-flavoured. */
  serif: `'Newsreader Variable', ${KR}, serif`,
  /** Data and codes. Kept as a stack; no bundled mono is in use yet. */
  mono: `ui-monospace, 'Cascadia Mono', Consolas, monospace`,
} as const;

export type FontRole = keyof typeof FONTS;
