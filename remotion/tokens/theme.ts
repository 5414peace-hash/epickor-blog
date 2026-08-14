/**
 * THEME TOKENS — chosen per reel. Nothing here is a house style.
 *
 * EpicKor has no fixed brand colour. Each reel gets the palette its own footage
 * implies, derived by `node scripts/extract-palette.mjs --slug {slug}`, which
 * writes `output/reels/{date}_{slug}/palette.json`. Copy the numbers from that
 * file into a Theme below; do not eyeball them, and do not carry a palette over
 * from a previous reel because it "looked good".
 *
 * Changing a value here affects ONE video. Changing `core.ts` affects all of them.
 */
import { FONTS, type FontRole } from './core';
import choice from '../../output/reels/2026-08-13_376/theme-choice.json';

/**
 * How the caption sits on the footage. Decided by measured clip luma/variance in
 * the extraction script, not by taste:
 *   scrim — bright or busy clips (luma > 120 or sd > 58). Opaque band.
 *   glass — mid-contrast. Translucent, blurred backdrop.
 *   bare  — dark and even. Type straight on the image.
 */
export type PlateStyle = 'scrim' | 'glass' | 'bare';

export type Theme = {
  slug: string;
  /** One line on why this palette, so a later session can audit the choice. */
  rationale: string;
  color: {
    /** Never pure black or pure white — the darkened dominant, chroma intact. */
    canvas: string;
    /** Same hue, lighter. For light blooms so the ground is not flat. */
    canvasLift: string;
    /** Two hue-separated accents lifted out of the footage. */
    accent: [string, string];
    /** A hue the footage barely contains, so emphasis actually reads. */
    highlight: string;
    ink: string;
    inkMuted: string;
  };
  /** Ground treatment. A flat fill is banned — it reads as a slide, not a frame. */
  ground: {
    /** Radial blooms: [xPct, yPct, radiusPct, colorToken]. */
    blooms: Array<[number, number, number, 'canvasLift' | 'accent0' | 'accent1']>;
    /** Film grain opacity. 0 disables, which should be rare. */
    grain: number;
  };
  plate: PlateStyle;
  /** Which bundled face plays which role. */
  font: { hook: FontRole; body: FontRole; label: FontRole };
};

/* ------------------------------------------------------------------ *
 * 376 — Korean convenience-store deals (1+1 / 2+1, gift cards, ATM)
 *
 * Derived from all six cut plates. See output/reels/2026-08-13_376/palette.json.
 *   dominant #1d1f1f 31.4%  -> canvas #131719 (dark slate, chroma kept)
 *   #54483f  22.4%          -> accent[0] #b0703b (shelf wood / warm store light)
 *   #586e7b  13.4%          -> accent[1] #3b86b0 (chiller glass / signage blue)
 *   emptiest hue 270-300deg -> highlight #c238f0
 *   luma 95 / sd 58.3       -> plate: scrim
 *
 * Note on the accents: raw cluster rank gave #b0703b and #c6a753, 15deg apart and
 * indistinguishable on screen. The extraction now enforces 40deg of separation, so
 * the second accent came from the blue-grey cluster instead — 174deg, complementary.
 * ------------------------------------------------------------------ */
const V_A: Theme = {
  slug: '376',
  rationale:
    'Convenience-store aisles are warm shelf light against cold chiller glass; the palette is that ' +
    'contrast rather than an invented brand colour. Magenta is the one hue the six plates do not ' +
    'contain, so it carries the price/deal emphasis without competing with the real 2+1 tags.',
  color: {
    canvas: '#131719',
    canvasLift: '#242e32',
    accent: ['#b0703b', '#3b86b0'],
    highlight: '#c238f0',
    ink: '#f4f2ee',
    inkMuted: '#9aa3a8',
  },
  ground: {
    blooms: [
      [22, 18, 58, 'accent0'],
      [82, 74, 52, 'accent1'],
      [50, 46, 70, 'canvasLift'],
    ],
    grain: 0.055,
  },
  plate: 'scrim',
  // Store signage is blunt and wide, not elegant: Archivo carries the hook, Inter
  // does the reading, and the kicker chips stay on Inter so Hangul and Latin sit on
  // the same face inside one chip (숙취해소제-style labels break across two faces).
  font: { hook: 'grotesk', body: 'neutral', label: 'neutral' },
};

/* ------------------------------------------------------------------ *
 * 376 design directions.
 *
 * All four are grounded in the SAME measurement — the five colour clusters the
 * extraction found across the six cut plates:
 *
 *   #1d1f1f  31.4%   shadowed shelf interiors
 *   #54483f  22.4%   shelf timber, warm store light
 *   #9d947b  19.6%   packaging card, promo strip
 *   #586e7b  13.4%   chiller glass, signage blue
 *   #c4c5bf  13.1%   price-tag paper
 *
 * A direction is chosen by deciding WHICH cluster becomes the ground. That is the
 * only invented decision; everything downstream follows from it. None of these are
 * a "mood" picked off a reference board.
 * ------------------------------------------------------------------ */

/** B — the price tag itself. Ground from the lightest cluster (#c4c5bf, 13.1%). */
const V_B: Theme = {
  slug: '376',
  rationale:
    'Ground taken from the price-tag paper cluster instead of the shelf shadow, so the frame reads ' +
    'as the tag the whole reel is about rather than as the aisle it hangs in. Serif headline because ' +
    'the argument is a printed rule, not a shout.',
  color: {
    canvas: '#e8e6df',
    canvasLift: '#f6f4ee',
    accent: ['#8a5326', '#2f6f92'],
    highlight: '#a51fd0',
    ink: '#16191b',
    inkMuted: '#6b7278',
  },
  ground: {
    blooms: [[20, 16, 60, 'accent0'], [84, 78, 50, 'accent1'], [50, 50, 74, 'canvasLift']],
    grain: 0.09,
  },
  plate: 'scrim',
  font: { hook: 'serif', body: 'neutral', label: 'neutral' },
};

/** C — the chiller. Ground from the cold cluster (#586e7b, 13.4%). */
const V_C: Theme = {
  slug: '376',
  rationale:
    'Ground from the chiller-glass cluster, with the warm shelf light demoted to a secondary accent. ' +
    'Reads as a late-night store. Condensed headline because store signage is condensed and because ' +
    'the longer hooks fit on one line without shrinking.',
  color: {
    canvas: '#101a20',
    canvasLift: '#1e3540',
    accent: ['#3b86b0', '#b0703b'],
    highlight: '#c238f0',
    ink: '#eef4f6',
    inkMuted: '#8fa3ad',
  },
  ground: {
    blooms: [[26, 22, 62, 'accent0'], [78, 70, 54, 'accent1'], [52, 48, 70, 'canvasLift']],
    grain: 0.05,
  },
  plate: 'glass',
  font: { hook: 'condensed', body: 'neutral', label: 'neutral' },
};

/** D — the promo strip. Ground from the packaging/promo cluster (#9d947b, 19.6%). */
const V_D: Theme = {
  slug: '376',
  rationale:
    'Ground from the packaging-card cluster pushed dark, with the amber raised until it behaves like ' +
    'a promo strip. The loudest of the four, and the closest to how the deal actually looks in store. ' +
    'One face throughout — retail signage does not pair typefaces.',
  color: {
    canvas: '#1a1712',
    canvasLift: '#33291b',
    accent: ['#d9a13c', '#3b86b0'],
    highlight: '#c238f0',
    ink: '#f7f4ee',
    inkMuted: '#a49780',
  },
  ground: {
    blooms: [[18, 20, 64, 'accent0'], [80, 76, 48, 'accent1'], [50, 44, 72, 'canvasLift']],
    grain: 0.07,
  },
  plate: 'scrim',
  font: { hook: 'grotesk', body: 'grotesk', label: 'neutral' },
};

export const VARIANTS_376 = { A: V_A, B: V_B, C: V_C, D: V_D } as const;
export type VariantKey = keyof typeof VARIANTS_376;

/**
 * Which direction 376 currently renders with. Kept in the reel's own folder so the
 * choice travels with the reel and a review render is a one-line change rather than
 * an edit to this shared file.
 */
export const THEME_376: Theme = VARIANTS_376[(choice.variant as VariantKey)] ?? V_A;

/**
 * The caption plate's own background.
 *
 * This was hard-coded as `rgba(10,13,16,.92)` in the kit, which silently assumed
 * every theme puts light text on a dark ground. Direction B inverts that (dark ink
 * on price-tag paper) and the caption measured a contrast ratio of **1.40** —
 * invisible. The plate has to come from the theme, not from the kit.
 *
 * Rule: the plate is the canvas, and the caption text is the ink, so the pair is
 * contrast-checked once here instead of per kit.
 */
export function plateBg(theme: Theme, alpha = 0.92) {
  const h = theme.color.canvas.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Resolve a theme's font role to the bundled stack from core.ts. */
export function face(theme: Theme, role: keyof Theme['font']) {
  return FONTS[theme.font[role]];
}

/** CSS for the ground: canvas + blooms + grain. Never a flat fill. */
export function groundCss(theme: Theme) {
  const pick = (t: 'canvasLift' | 'accent0' | 'accent1') =>
    t === 'canvasLift' ? theme.color.canvasLift
    : t === 'accent0' ? theme.color.accent[0]
    : theme.color.accent[1];
  const layers = theme.ground.blooms
    .map(([x, y, r, t]) => `radial-gradient(${r}% ${r}% at ${x}% ${y}%, ${pick(t)}2e 0%, ${pick(t)}00 100%)`)
    .join(', ');
  return { background: `${layers}, ${theme.color.canvas}` };
}
