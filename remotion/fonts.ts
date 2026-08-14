/**
 * Bundled webfont loading for every EpicKor composition.
 *
 * The faces live in `public/assets/fonts/` as woff2 and are declared in the
 * generated `fonts.css` — four Latin variable faces (Inter, Archivo, Oswald,
 * Newsreader, weight 100-900 each) plus Noto Sans KR across its 124 unicode-range
 * subsets. Nothing here may fall back to a system face: reel kickers carry live
 * Hangul, and a render host without a Korean font would silently produce tofu.
 *
 * Two things have to be true before Remotion measures a frame:
 *   1. the stylesheet is in the document, and
 *   2. the faces are actually decoded.
 * `document.fonts.ready` alone is not enough — it resolves immediately when no
 * face has been *requested* yet, so each family is explicitly loaded first.
 */
import { continueRender, delayRender, staticFile } from 'remotion';

const FAMILIES = [
  'Inter Variable',
  'Archivo Variable',
  'Oswald Variable',
  'Newsreader Variable',
  'Noto Sans KR Variable',
] as const;

/** Probe strings: Latin for the Latin faces, Hangul for the Korean subsets. */
const PROBE = 'EpicKor 0123 · 숙취해소제 음주 전';

let started = false;

export function loadFonts() {
  if (started || typeof document === 'undefined') return;
  started = true;

  const handle = delayRender('bundled webfonts');

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = staticFile('assets/fonts/fonts.css');
  document.head.appendChild(link);

  const ready = new Promise<void>((resolve) => {
    if (link.sheet) resolve();
    else {
      link.addEventListener('load', () => resolve(), { once: true });
      link.addEventListener('error', () => resolve(), { once: true });
    }
  });

  ready
    .then(() =>
      Promise.all(
        // 900 and 400 cover the two extremes a variable face is asked for here; a
        // variable font resolves the range from one file, so this is two requests
        // per family, not eight.
        FAMILIES.flatMap((f) => [
          document.fonts.load(`900 100px "${f}"`, PROBE),
          document.fonts.load(`400 100px "${f}"`, PROBE),
        ]),
      ),
    )
    .then(() => document.fonts.ready)
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
}

/**
 * Report which bundled families the document actually resolved. Used by the render
 * gate — "I added @font-face" is not evidence that the face loaded.
 */
export function loadedFamilies() {
  if (typeof document === 'undefined') return [];
  return FAMILIES.filter((f) => document.fonts.check(`900 100px "${f}"`, PROBE));
}
