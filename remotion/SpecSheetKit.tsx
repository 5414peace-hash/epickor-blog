/**
 * SPEC SHEET — design H, first use on Reel 377 (MATCH 02).
 *
 * The premise, same as Split Grid: a Reel built the way a card-news carousel is
 * built. This one takes the other half of that idea. Where Split Grid dices a
 * photograph, Spec Sheet puts a *specimen* on a page and labels it.
 *
 * Why this frame drew this topic. The load-bearing asset for post 377 is HK
 * inno.N's own pack shot of seven Condition sticks on white, and it is already a
 * spec sheet: seven columns, each printing a flavour, a weight, a kcal figure,
 * HANGOVER TECHNOLOGY, and the 숙취개선효과 인체적용시험완료 badge. The frame does not
 * impose a structure — it finishes the one that is there. It is also the one topic
 * in the batch where a static pack shot is a premise rather than a deficiency: a
 * reel about a regulation printed on a package wants the package held still and
 * labelled, not moving.
 *
 * The page is deliberately LIGHT. Reel 376 shipped on an ink ground, and two reels
 * in one batch that share a value key read as one template even when the layouts
 * differ. The products are cut out of their studio white (see prep-plates.mjs) so
 * they sit on the paper rather than on a white rectangle.
 *
 * Constraints carried over unchanged — these are not style:
 *  - Caption band is left:72 right:128 bottom:410, verified against Instagram's UI.
 *  - Nothing carrying copy descends past y=1340.
 *  - Cut-scoped copy goes through TextGate so it clears before the next cut's.
 *  - epickor.com is a solid red chip, never coloured text over the image.
 *  - Frame 0 is the grid thumbnail, so cut 1 is built to read at that size.
 *
 * New from 2026-08-13: the outro is spoken and says the domain aloud. The tag is
 * written into voice part 3, so `outroFrom` is a beat index rather than the end of
 * speech, and the caption band stays live over the closing plate.
 */
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import type { CSSProperties, ReactNode } from 'react';
import { Cut, OVERLAP, VoiceTrack, clamp } from './Batch0726Kit';

/* ------------------------------------------------------------------ tokens */

/** A regulatory subject, so the page is a technical document, not a mood. */
const S = {
  paper: '#F4F1EA',
  ink: '#14181C',
  rule: '#C6BFB1',
  faint: '#DED8CB',
  red: '#D24437',
  /** The badge on the package is green; certification marks borrow it. */
  cert: '#127A55',
  mute: '#6E7780',
};

const black = "'Segoe UI Black', 'Segoe UI', 'Arial Black', sans-serif";
const grotesk = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const mono = "Consolas, 'Courier New', ui-monospace, monospace";

const W = 1080;
const H = 1920;
/** Nothing carrying copy may cross this. */
const COPY_FLOOR = 1340;

export type CaptionBeat = { text: string; startFrame: number; endFrame: number };
export type Manifest = {
  slug: string;
  durationInFrames: number;
  outroFrom: number;
  cuts: { n: number; from: number; len: number; kind?: string }[];
  beats: CaptionBeat[];
  audio: { part: number; startFrame: number }[];
};

export type SpecRow = { label: string; value: string; at?: number; cert?: boolean };

export type CutPage =
  | {
      mode: 'specimen';
      cut: number; kicker: string; index: string;
      title: string; sub?: string;
      src: string; rows: SpecRow[];
      headline?: { line1: string; line2: string };
      /** the specimen is wider than it is tall (the seven-stick rack) */
      wide?: boolean;
    }
  | {
      mode: 'lineup';
      cut: number; kicker: string; index: string;
      title: string; sub?: string;
      items: { src: string; label: string; at?: number }[];
      figure?: { value: string; label: string; at?: number };
    }
  | {
      mode: 'callout';
      cut: number; kicker: string; index: string;
      title: string;
      src: string;
      /** where on the frame the leader actually points — a badge, not a guess */
      anchor?: { x: number; y: number };
      note: { label: string; body: string; at?: number };
    }
  | {
      mode: 'tally';
      cut: number; kicker: string; index: string;
      title: string;
      entries: { value: string; label: string; tone: 'ink' | 'cert' | 'red'; at?: number }[];
      foot?: string;
    };

/* ----------------------------------------------------------------- helpers */

function TextGate({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // 2026-08-14: this used to START fading at durationInFrames - OVERLAP, i.e. the
  // exact frame the next cut mounts, and run 8 frames past it. For photography that
  // reads as a crossfade; for text both mastheads render at once and the glyphs
  // interleave -- measured 'THE TIMING | 음주 전 | CE STORE | 숙취해소제' on 377 f203.
  // The fade now COMPLETES at the boundary, so text swaps and never overlaps.
  const exit = clamp(frame, [durationInFrames - OVERLAP - 5, durationInFrames - OVERLAP], [1, 0]);
  return <div style={{ ...style, opacity: exit }}>{children}</div>;
}

/** The page itself — drawn once, above the cuts, so it never flashes on a boundary. */
function Page() {
  const frame = useCurrentFrame();
  const drift = clamp(frame, [0, 1200], [0, -26]);
  return (
    <AbsoluteFill style={{ background: S.paper }}>
      <AbsoluteFill style={{ opacity: 0.5, transform: `translateY(${drift}px)` }}>
        {Array.from({ length: 22 }, (_, i) => (
          <div key={`h${i}`} style={{
            position: 'absolute', left: 0, right: 0, top: i * 96, height: 1, background: S.faint,
          }} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <div key={`v${i}`} style={{
            position: 'absolute', top: 0, bottom: 0, left: i * 96, width: 1, background: S.faint,
          }} />
        ))}
      </AbsoluteFill>
      {/* The margin rule a real spec sheet has. */}
      <div style={{ position: 'absolute', left: 60, top: 0, bottom: 0, width: 2, background: S.rule, opacity: .55 }} />

      {/* Footer block: the metadata strip a controlled document carries. It also
          closes the gap between the page body and the caption band, which on a
          light ground reads as an unfinished page rather than as breathing room. */}
      <div style={{ position: 'absolute', left: 60, right: 56, top: 1252, height: 3, background: S.ink, opacity: .82 }} />
      <div style={{
        position: 'absolute', left: 62, right: 56, top: 1270,
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        font: `700 18px/1.2 ${mono}`, letterSpacing: 2.2, textTransform: 'uppercase', color: S.mute,
      }}>
        <span>EpicKor · 숙취해소제 · Seoul</span>
        <span>Prices &amp; labels as of Aug 2026</span>
      </div>
      <div style={{ position: 'absolute', left: 60, right: 56, top: 1308, height: 1, background: S.rule }} />

      {/* Ticks down the right margin — a measured page, not a blank one. */}
      {Array.from({ length: 26 }, (_, i) => (
        <div key={`t${i}`} style={{
          position: 'absolute', right: 34, top: 290 + i * 38,
          width: i % 5 === 0 ? 18 : 9, height: 2, background: S.rule,
        }} />
      ))}
    </AbsoluteFill>
  );
}

function Masthead({ kicker, index, n }: { kicker: string; index: string; n: number }) {
  const frame = useCurrentFrame();
  const enter = clamp(frame, [3, 17], [0, 1]);
  return (
    <TextGate style={{
      position: 'absolute', left: 60, right: 56, top: 158, zIndex: 120,
      display: 'flex', alignItems: 'stretch',
      opacity: enter, transform: `translateX(${(1 - enter) * -20}px)`,
    }}>
      <div style={{
        background: S.ink, color: S.paper, padding: '9px 16px 10px',
        font: `800 20px/1 ${mono}`, letterSpacing: 3.2, textTransform: 'uppercase',
      }}>{kicker}</div>
      <div style={{
        background: S.red, color: '#fff', padding: '9px 14px 10px',
        font: `800 20px/1 ${mono}`, letterSpacing: 2.4,
      }}>{index}</div>
      <div style={{ flex: 1, borderBottom: `2px solid ${S.rule}`, alignSelf: 'flex-end', marginBottom: 3 }} />
      <div style={{
        alignSelf: 'flex-end', color: S.mute, paddingLeft: 12,
        font: `700 20px/1 ${mono}`, letterSpacing: 2,
      }}>{String(n).padStart(2, '0')}<span style={{ opacity: .5 }}>/06</span></div>
    </TextGate>
  );
}

function Head({ title, sub }: { title: string; sub?: string }) {
  const frame = useCurrentFrame();
  const enter = clamp(frame, [8, 26], [0, 1]);
  return (
    <TextGate style={{
      position: 'absolute', left: 88, right: 88, top: 214, zIndex: 110,
      opacity: enter, transform: `translateY(${(1 - enter) * 16}px)`,
    }}>
      <div style={{ font: `900 54px/1.0 ${black}`, letterSpacing: -1.8, color: S.ink, textWrap: 'balance' }}>
        {title}
      </div>
      {sub && (
        <div style={{
          marginTop: 10, font: `700 22px/1.3 ${mono}`, letterSpacing: 1.2,
          textTransform: 'uppercase', color: S.mute,
        }}>{sub}</div>
      )}
    </TextGate>
  );
}

/** `LABEL ···················· VALUE`, the line that makes a page a spec sheet. */
function Row({ row, i, top }: { row: SpecRow; i: number; top: number }) {
  const frame = useCurrentFrame();
  const at = row.at ?? 24 + i * 11;
  const enter = clamp(frame, [at, at + 14], [0, 1]);
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, top,
      display: 'flex', alignItems: 'baseline', gap: 10,
      opacity: enter, transform: `translateX(${(1 - enter) * 22}px)`,
    }}>
      <div style={{
        font: `700 20px/1.2 ${mono}`, letterSpacing: 1.5,
        textTransform: 'uppercase', color: S.mute, whiteSpace: 'nowrap',
      }}>{row.label}</div>
      <div style={{ flex: 1, borderBottom: `2px dotted ${S.rule}`, transform: 'translateY(-6px)' }} />
      <div style={{
        font: `900 30px/1.1 ${black}`, letterSpacing: -0.6,
        color: row.cert ? S.cert : S.ink, whiteSpace: 'nowrap',
      }}>{row.value}</div>
    </div>
  );
}

/* ------------------------------------------------------------------- modes */

function Specimen({ page }: { page: Extract<CutPage, { mode: 'specimen' }> }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const rise = clamp(frame, [4, 26], [0, 1]);
  const float = clamp(frame, [0, Math.max(1, durationInFrames)], [0, -22]);
  const scale = clamp(frame, [0, Math.max(1, durationInFrames)], [1.0, 1.06]);
  return (
    <>
      <TextGate style={{
        position: 'absolute',
        left: page.wide ? 74 : 66, top: page.wide ? 392 : 406,
        width: page.wide ? 932 : 430, height: page.wide ? 430 : 660,
        zIndex: 60,
        opacity: rise, transform: `translateY(${(1 - rise) * 30 + float}px) scale(${scale})`,
      }}>
        <Img src={staticFile(page.src)} style={{
          width: '100%', height: '100%', objectFit: 'contain',
          filter: 'drop-shadow(0 30px 42px rgba(20,24,28,.28))',
        }} />
      </TextGate>

      <TextGate style={{
        position: 'absolute',
        left: page.wide ? 88 : 512, right: page.wide ? 80 : 76,
        top: page.wide ? 896 : 440, zIndex: 70,
      }}>
        <div style={{ position: 'relative', height: page.wide ? 300 : 600 }}>
          {page.rows.map((r, i) => <Row key={r.label} row={r} i={i} top={i * (page.wide ? 96 : 98)} />)}
        </div>
      </TextGate>

      {page.headline && <BigNote line1={page.headline.line1} line2={page.headline.line2} />}
    </>
  );
}

/** The one shouted line a technical page is allowed. */
function BigNote({ line1, line2 }: { line1: string; line2: string }) {
  const frame = useCurrentFrame();
  const enter = clamp(frame, [30, 50], [0, 1]);
  return (
    <TextGate style={{
      position: 'absolute', left: 74, right: 76, top: 1060, zIndex: 90,
      opacity: enter, transform: `translateY(${(1 - enter) * 18}px)`,
    }}>
      <div style={{ height: 6, width: `${enter * 240}px`, background: S.red, marginBottom: 16 }} />
      <div style={{ font: `900 76px/0.96 ${black}`, letterSpacing: -2.6, color: S.ink }}>
        {line1}<br />{line2}
      </div>
    </TextGate>
  );
}

function Lineup({ page }: { page: Extract<CutPage, { mode: 'lineup' }> }) {
  const frame = useCurrentFrame();
  const n = page.items.length;
  const colW = (W - 148) / n;
  return (
    <>
      {page.items.map((it, i) => {
        const at = it.at ?? 6 + i * 9;
        const enter = clamp(frame, [at, at + 16], [0, 1]);
        const left = 74 + i * colW;
        return (
          <TextGate key={it.label} style={{ position: 'absolute', left, top: 440, width: colW, zIndex: 60 }}>
            {i > 0 && (
              <div style={{
                position: 'absolute', left: 0, top: -30, height: 640, width: 1,
                background: S.rule, opacity: 0.7 * enter,
              }} />
            )}
            <div style={{
              height: 470, opacity: enter,
              transform: `translateY(${(1 - enter) * 26}px)`,
            }}>
              <Img src={staticFile(it.src)} style={{
                width: '100%', height: '100%', objectFit: 'contain',
                filter: 'drop-shadow(0 22px 32px rgba(20,24,28,.26))',
              }} />
            </div>
            <div style={{
              marginTop: 18, textAlign: 'center', opacity: enter,
              font: `700 18px/1.3 ${mono}`, letterSpacing: 1.1,
              textTransform: 'uppercase', color: S.mute, textWrap: 'balance',
            }}>{it.label}</div>
          </TextGate>
        );
      })}
      {page.figure && <Figure {...page.figure} />}
    </>
  );
}

function Figure({ value, label, at = 40 }: { value: string; label: string; at?: number }) {
  const frame = useCurrentFrame();
  const enter = clamp(frame, [at, at + 18], [0, 1]);
  return (
    <TextGate style={{
      position: 'absolute', left: 74, right: 76, top: 1050, zIndex: 90,
      display: 'flex', alignItems: 'baseline', gap: 22,
      opacity: enter, transform: `translateY(${(1 - enter) * 16}px)`,
      borderTop: `4px solid ${S.ink}`, paddingTop: 20,
    }}>
      <div style={{ font: `900 108px/0.86 ${black}`, letterSpacing: -4, color: S.red }}>{value}</div>
      <div style={{
        font: `700 24px/1.3 ${mono}`, letterSpacing: 1.4,
        textTransform: 'uppercase', color: S.mute, textWrap: 'balance',
      }}>{label}</div>
    </TextGate>
  );
}

/**
 * `callout` — a leader line to a printed detail, with the English beside it.
 *
 * The badge on the package reads 숙취개선효과 인체적용시험완료. It is legible in this crop,
 * but a viewer who does not read Korean still needs the sentence, so the page
 * annotates rather than merely magnifies. That is what a spec sheet is for.
 */
function Callout({ page }: { page: Extract<CutPage, { mode: 'callout' }> }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const rise = clamp(frame, [2, 22], [0, 1]);
  const scale = clamp(frame, [0, Math.max(1, durationInFrames)], [1.04, 1.15]);
  const at = page.note.at ?? 26;
  const line = clamp(frame, [at, at + 16], [0, 1]);
  const ax = page.anchor?.x ?? 380;
  const ay = page.anchor?.y ?? 560;
  const box = clamp(frame, [at + 8, at + 26], [0, 1]);
  return (
    <>
      <TextGate style={{
        position: 'absolute', left: 74, right: 76, top: 380, height: 530, zIndex: 55,
        overflow: 'hidden', opacity: rise,
      }}>
        <Img src={staticFile(page.src)} style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${scale})`,
        }} />
      </TextGate>

      {/* leader: down from the badge row, then across to the note */}
      <TextGate style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, zIndex: 95 }}>
        <div style={{
          position: 'absolute', left: ax, top: ay, width: 4,
          height: (930 - ay) * line, background: S.red,
        }} />
        <div style={{
          position: 'absolute', left: ax, top: 926, height: 4,
          width: 260 * line, background: S.red,
        }} />
        <div style={{
          position: 'absolute', left: ax - 15, top: ay - 15, width: 32, height: 32,
          borderRadius: 16, border: `4px solid ${S.red}`, opacity: line,
        }} />
      </TextGate>

      <TextGate style={{
        position: 'absolute', left: 74, right: 76, top: 976, zIndex: 96,
        opacity: box, transform: `translateY(${(1 - box) * 16}px)`,
      }}>
        <div style={{
          background: S.ink, color: S.paper, padding: '22px 26px 24px',
          borderLeft: `10px solid ${S.cert}`,
          boxShadow: '0 22px 50px rgba(20,24,28,.32)',
        }}>
          <div style={{
            font: `700 19px/1.2 ${mono}`, letterSpacing: 2,
            textTransform: 'uppercase', color: '#9BA6B0',
          }}>{page.note.label}</div>
          <div style={{
            marginTop: 12, font: `900 40px/1.12 ${black}`, letterSpacing: -1.2, textWrap: 'balance',
          }}>{page.note.body}</div>
        </div>
      </TextGate>
    </>
  );
}

/**
 * `tally` — the results ledger, and the only page in the reel with no product on it.
 *
 * That is deliberate and it is not a design choice. The narration here says three
 * products could not produce evidence and lost the right to the claim. Showing any
 * named pack shot under that sentence would implicate a brand the article never
 * names and the reporting never identified.
 */
function Tally({ page }: { page: Extract<CutPage, { mode: 'tally' }> }) {
  const frame = useCurrentFrame();
  return (
    <>
      {page.entries.map((e, i) => {
        const at = e.at ?? 10 + i * 20;
        const enter = clamp(frame, [at, at + 16], [0, 1]);
        const color = e.tone === 'cert' ? S.cert : e.tone === 'red' ? S.red : S.ink;
        return (
          <TextGate key={e.label} style={{
            position: 'absolute', left: 88, right: 80, top: 396 + i * 250, zIndex: 70,
            display: 'flex', alignItems: 'baseline', gap: 26,
            opacity: enter, transform: `translateX(${(1 - enter) * 30}px)`,
            borderBottom: `3px solid ${S.rule}`, paddingBottom: 18,
          }}>
            <div style={{
              font: `900 152px/0.82 ${black}`, letterSpacing: -7, color,
              minWidth: 250,
            }}>{e.value}</div>
            <div style={{
              font: `700 26px/1.28 ${mono}`, letterSpacing: 1.3,
              textTransform: 'uppercase', color: S.mute, textWrap: 'balance',
            }}>{e.label}</div>
          </TextGate>
        );
      })}
      {page.foot && (
        <TextGate style={{
          position: 'absolute', left: 88, right: 80, top: 1136, zIndex: 70,
          font: `700 22px/1.4 ${mono}`, letterSpacing: 1.1, color: S.mute, textWrap: 'balance',
          opacity: clamp(frame, [78, 96], [0, 1]),
        }}>{page.foot}</TextGate>
      )}
    </>
  );
}

/* ---------------------------------------------------------------- chrome */

function Captions({ beats }: { beats: CaptionBeat[] }) {
  const frame = useCurrentFrame();
  const active = beats.find((b) => frame >= b.startFrame && frame <= b.endFrame);
  if (!active) return null;
  const entry = clamp(frame, [active.startFrame, active.startFrame + 6], [0, 1]);
  const run = clamp(frame, [active.startFrame, active.endFrame], [0, 1]);
  return (
    <div data-caption-safe-zone="instagram-reels" style={{
      position: 'absolute', zIndex: 150, left: 72, right: 128, bottom: 410, minHeight: 92,
      background: 'rgba(14,18,22,.94)', borderTop: `4px solid ${S.red}`,
      display: 'grid', placeItems: 'center', padding: '15px 22px 17px',
      color: S.paper, font: `800 34px/1.14 ${grotesk}`, letterSpacing: -.2,
      textAlign: 'center', textWrap: 'balance',
      // No fade, no travel: the caption swaps text in place (playbook §9).
      boxShadow: '0 14px 44px rgba(20,24,28,.34)',
    }}>
      {active.text}
      <div style={{
        position: 'absolute', left: 0, bottom: 0, height: 3,
        width: `${run * 100}%`, background: S.red, opacity: .85,
      }} />
    </div>
  );
}

/** Dark on paper. The Split Grid kit's white mark would vanish here. */
function Watermark({ onDark }: { onDark: boolean }) {
  return (
    <div style={{
      // Was top 46 - inside the 0-150 platform cut zone. The pre-footer band
      // y1180-1240 measured empty on every page mode, so the mark moved there.
      position: 'absolute', left: 60, top: 1196, zIndex: 200,
      color: onDark ? 'rgba(255,255,255,.9)' : 'rgba(20,24,28,.62)',
      font: `800 22px/1 ${mono}`, letterSpacing: 4.2,
      textShadow: onDark ? '0 2px 12px rgba(0,0,0,.7)' : 'none',
    }}>EPICKOR.COM</div>
  );
}

/**
 * The closing page. Not silent — the narration is still running over it, which is
 * why the caption band stays mounted above this in the composition.
 */
function Outro({ hook, sub, src }: { hook: string; sub: string; src: string }) {
  const frame = useCurrentFrame();
  const wipe = clamp(frame, [0, 20], [0, 1]);
  const rule = clamp(frame, [10, 26], [0, 1]);
  const rise = clamp(frame, [16, 36], [0, 1]);
  const chip = clamp(frame, [30, 50], [0, 1]);
  const zoom = clamp(frame, [0, 180], [1.08, 1.0]);
  return (
    <AbsoluteFill style={{ opacity: wipe }}>
      <Img src={staticFile(src)} style={{
        width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${zoom})`, filter: 'brightness(.52) saturate(.9)',
      }} />
      <AbsoluteFill style={{
        background: 'linear-gradient(180deg, rgba(10,13,16,.72) 0%, rgba(10,13,16,.34) 42%, rgba(10,13,16,.78) 100%)',
      }} />
      <div style={{ position: 'absolute', left: 84, right: 84, top: 700, zIndex: 20 }}>
        <div style={{ height: 7, width: `${rule * 230}px`, background: S.red, marginBottom: 28 }} />
        <div style={{
          font: `900 92px/0.96 ${black}`, letterSpacing: -3.2, color: '#F7F4EE',
          whiteSpace: 'pre-line',   // the hook chooses its own break; the browser must not
          opacity: rise, transform: `translateY(${(1 - rise) * 20}px)`,
          textShadow: '0 6px 26px rgba(0,0,0,.6)',
        }}>{hook}</div>
        <div style={{
          marginTop: 20, font: `600 29px/1.32 ${grotesk}`, color: '#CBD3D8',
          opacity: rise, textWrap: 'balance',
        }}>{sub}</div>
        <div style={{
          marginTop: 42, display: 'inline-block',
          background: S.red, color: '#fff', padding: '17px 30px 19px',
          font: `900 42px/1 ${black}`, letterSpacing: -1.2,
          opacity: chip, transform: `translateY(${(1 - chip) * 16}px)`,
          boxShadow: '0 18px 46px rgba(0,0,0,.5)',
        }}>epickor.com</div>
      </div>
    </AbsoluteFill>
  );
}

/* -------------------------------------------------------------------- reel */

function PageBody({ page }: { page: CutPage }) {
  if (page.mode === 'specimen') return <Specimen page={page} />;
  if (page.mode === 'lineup') return <Lineup page={page} />;
  if (page.mode === 'callout') return <Callout page={page} />;
  return <Tally page={page} />;
}

export function ReelSpecSheet({
  manifest, pages, outro,
}: {
  manifest: Manifest;
  pages: CutPage[];
  outro: { hook: string; sub: string; src: string };
}) {
  const byCut = new Map(pages.map((p) => [p.cut, p]));
  return (
    <AbsoluteFill style={{ background: S.paper }}>
      {/* The sheet is continuous; only its contents change, so a cut boundary reads
          as the page being filled in rather than as the paper flashing. */}
      <Page />

      {manifest.cuts.map((c) => {
        const page = byCut.get(c.n);
        if (!page) throw new Error(`SpecSheet: no page for cut ${c.n}`);
        return (
          <Cut key={c.n} from={c.from} len={c.len}>
            <PageBody page={page} />
            <Masthead kicker={page.kicker} index={page.index} n={page.cut} />
            <Head title={page.title} sub={'sub' in page ? page.sub : undefined} />
          </Cut>
        );
      })}

      <Sequence from={manifest.outroFrom}>
        <Outro hook={outro.hook} sub={outro.sub} src={outro.src} />
      </Sequence>

      <WatermarkSwitch outroFrom={manifest.outroFrom} />
      <Captions beats={manifest.beats} />
      <VoiceTrack slug={manifest.slug} segments={manifest.audio} />
    </AbsoluteFill>
  );
}

/** Paper for the sheet, white once the photographic outro takes over. */
function WatermarkSwitch({ outroFrom }: { outroFrom: number }) {
  const frame = useCurrentFrame();
  return <Watermark onDark={frame >= outroFrom + 8} />;
}

export { COPY_FLOOR, H, S, W };
