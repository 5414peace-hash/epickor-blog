/**
 * SPLIT GRID — the "moving card news" frame (design L, representative-approved 2026-08-13).
 *
 * The premise the representative set: a Reel should be built the way a card-news
 * carousel is built. The photo becomes video, the card title becomes the ONS, and
 * the spoken line runs underneath as a caption. This kit is the literal form of
 * that — the frame is a mosaic of tiles, and each tile is a card.
 *
 * Why this frame was matched to post 376 specifically:
 *   EpicKor does not shoot video, and 376 has three stills. A frame that relies on
 *   footage motion would have nothing to work with. Split Grid authors its own
 *   motion — 24 tiles arrive, breathe, and lock on their own schedule — so a
 *   still-only source is a premise rather than a deficiency. Two of the plates are
 *   already grids in the photograph (freezer bins, shelf-edge tag rows), so the
 *   mosaic lands on structure that is really there.
 *
 * Hard constraints carried over unchanged from Batch0811Kit — these are not style:
 *  - The narration caption band is left:72 right:128 bottom:410. Verified against
 *    Instagram's UI overlay 2026-08-13; earlier demos sat at bottom 130-250, which
 *    is inside the UI and would have been covered.
 *  - Nothing that carries copy may descend past y=1340. Label tiles are therefore
 *    restricted to rows 1-3; rows 4-5 are image only, and row 0 belongs to the
 *    watermark and kicker rail. GridScene throws if a label is placed outside it.
 *  - Cut-scoped copy goes through TextGate so it clears before the next cut's copy
 *    arrives (the overlap defect found in QA 2026-07-27).
 *  - epickor.com is a solid red chip, never coloured text over the photo.
 *  - Frame 0 is the Instagram grid thumbnail, so the opening card sits inside the
 *    conservative safe area, roughly y 520-1200.
 */
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import type { CSSProperties, ReactNode } from 'react';
import { Cut, OVERLAP, VoiceTrack, clamp } from './Batch0726Kit';

/* ------------------------------------------------------------------ tokens */

/** Palette taken from the subject: Korean convenience-store signage and shelf tags. */
const T = {
  ink: '#0A0D10',      // the ground the tiles are separated by
  bone: '#F4F1EA',     // shelf-tag paper
  chip: '#D24437',     // brand red — the same chip the outro uses
  cyan: '#12B0E8',     // GS25 sign blue
  amber: '#F2B01E',    // promo-strip yellow
  mute: '#8E9AA3',
};

const black = "'Segoe UI Black', 'Segoe UI', 'Arial Black', sans-serif";
const grotesk = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const mono = "Consolas, 'Courier New', ui-monospace, monospace";

const COLS = 4;
const ROWS = 6;
const W = 1080;
const H = 1920;
const TW = W / COLS;   // 270
const TH = H / ROWS;   // 320
/**
 * Labels may only live in rows 1-3.
 *  - row 0 belongs to the watermark and the kicker rail; a label there gets
 *    overprinted (QA 2026-08-13: `NO CARD` rendered as `CARD` behind the kicker).
 *  - rows 4-5 start at y=1280 and would push copy past the y=1340 floor.
 */
const LABEL_ROW_MIN = 1;
const LABEL_ROW_MAX = 3;

export type CaptionBeat = { text: string; startFrame: number; endFrame: number };
export type Manifest = {
  slug: string;
  durationInFrames: number;
  outroFrom: number;
  cuts: { n: number; from: number; len: number; src: string; kind?: string }[];
  beats: CaptionBeat[];
  audio: { part: number; startFrame: number }[];
};

export type TileLabel = {
  /** tile index, row-major, 0..23 */
  i: number;
  kind: 'chip' | 'cyan' | 'bone' | 'ink' | 'amber';
  label: string;
  sub?: string;
  /** frames after cut start */
  at?: number;
};

/**
 * How the grid behaves on this cut. Representative note 2026-08-13: "블락형으로
 * 카드형 나온거는 나쁘지 않은데, 전체를 다 이렇게 하는게 맞나." Correct. Six cuts of the same
 * lattice turns a device into wallpaper, and it diced the two images the reel most
 * needs read whole — the 2+1 tags on the hook and the ATM on the payoff. A card-news
 * carousel works because the card TYPE changes between slides. So the grid now
 * appears and resolves rather than persisting.
 *
 *  assemble  tiles build, hold, then dissolve — the photograph lands whole
 *  cards     no photo ground at all; the one true card-news slide
 *  lift      the photograph stays whole and a few tiles peel off its surface
 *  quiet     full bleed, hairlines only, one card
 *  shutOpen  the seams close and dim, then open to reveal the subject whole
 */
export type GridMode = 'assemble' | 'cards' | 'lift' | 'quiet' | 'shutOpen';

export type CutOns = {
  cut: number;
  kicker: string;
  mode: GridMode;
  /** opening card — cut 1 only, doubles as the grid thumbnail */
  headline?: { line1: string; line2: string; foot: string; top?: number };
  tiles?: TileLabel[];
  /** `lift` mode: which photo tiles peel off the surface */
  lift?: number[];
  /** `shutOpen` mode: tiles kept lit while the rest dims, before the grid opens */
  keepLit?: number[];
  /** `cards` mode: caption printed under the photo card */
  cardNote?: string;
  /** `assemble` mode: cut-relative frame the grid starts resolving on */
  dissolveAt?: number;
  /** `cards` mode: shelf-tag block under the card stack */
  cardFoot?: { label: string; sub: string };
};

/* ----------------------------------------------------------------- helpers */

function TextGate({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const exit = clamp(frame, [durationInFrames - OVERLAP, durationInFrames - Math.round(OVERLAP / 2)], [1, 0]);
  return <div style={{ ...style, opacity: exit }}>{children}</div>;
}

/** Deterministic per-tile jitter — no Math.random, so renders are reproducible. */
function wobble(i: number) {
  return {
    dir: i % 4,
    phase: ((i * 37) % 100) / 100,
    lift: ((i * 53) % 7) - 3,
  };
}

const PAINT = {
  chip: { bg: T.chip, fg: '#fff', rule: 'rgba(255,255,255,.5)' },
  cyan: { bg: T.cyan, fg: '#04222E', rule: 'rgba(0,0,0,.35)' },
  bone: { bg: T.bone, fg: T.ink, rule: T.chip },
  ink: { bg: '#101519', fg: T.bone, rule: T.cyan },
  amber: { bg: T.amber, fg: '#2A1D00', rule: 'rgba(0,0,0,.4)' },
} as const;

/* -------------------------------------------------------------------- tile */

function PhotoTile({
  src, i, gap, dim, fade = 1, peel = 0,
}: { src: string; i: number; gap: number; dim: number; fade?: number; peel?: number }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const w = wobble(i);

  // Entry: a diagonal stagger, so the mosaic assembles rather than cutting in.
  const delay = (row + col) * 2;
  const enter = clamp(frame, [delay, delay + 15], [0, 1]);
  const slide = (1 - enter) * 54;
  const ox = w.dir === 0 ? -slide : w.dir === 2 ? slide : 0;
  const oy = w.dir === 1 ? -slide : w.dir === 3 ? slide : 0;

  // The representative rejected an earlier demo for motion so slight the image read
  // as frozen. Each tile pushes its own window across the whole cut, and the phase
  // offset means neighbouring tiles are never in step.
  const span = Math.max(1, durationInFrames);
  const zoom = clamp(frame, [0, span], [1.0, 1.13 + w.phase * 0.05]);
  const drift = clamp(frame, [0, span], [0, w.lift * 5]);

  return (
    <div style={{
      position: 'absolute',
      left: col * TW + gap / 2,
      top: row * TH + gap / 2,
      width: TW - gap,
      height: TH - gap,
      overflow: 'hidden',
      opacity: enter * fade,
      transform: `translate(${ox + peel * 0.9}px, ${oy - peel}px) scale(${1 + peel * 0.007})`,
      boxShadow: peel > 0
        ? `0 ${14 + peel * 1.6}px ${26 + peel * 2.6}px rgba(0,0,0,.62), inset 0 0 0 3px rgba(244,241,234,.72)`
        : 'inset 0 0 0 1px rgba(255,255,255,.07)',
      background: T.ink,
    }}>
      <Img
        src={staticFile(src)}
        style={{
          position: 'absolute',
          width: W, height: H,
          left: -col * TW - gap / 2,
          top: -row * TH - gap / 2 + drift,
          objectFit: 'cover',
          transformOrigin: `${col * TW + TW / 2}px ${row * TH + TH / 2}px`,
          transform: `scale(${zoom})`,
        }}
      />
      {dim > 0 && (
        <AbsoluteFill style={{ background: `rgba(6,9,12,${dim})` }} />
      )}
    </div>
  );
}

function LabelTile({ t, gap }: { t: TileLabel; gap: number }) {
  const frame = useCurrentFrame();
  const col = t.i % COLS;
  const row = Math.floor(t.i / COLS);
  const at = t.at ?? (row + col) * 2 + 6;
  const enter = clamp(frame, [at, at + 12], [0, 1]);
  const flip = clamp(frame, [at, at + 12], [82, 0]);

  const paint = PAINT[t.kind];

  // A long label in a 270px tile has to come down in size or it clips.
  const size = t.label.length <= 3 ? 92 : t.label.length <= 7 ? 54 : t.label.length <= 11 ? 38 : 30;

  return (
    <div style={{
      position: 'absolute',
      left: col * TW + gap / 2,
      top: row * TH + gap / 2,
      width: TW - gap,
      height: TH - gap,
      background: paint.bg,
      color: paint.fg,
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      gap: 10, padding: '14px 12px',
      opacity: enter,
      transformOrigin: '50% 50%',
      transform: `perspective(900px) rotateX(${flip}deg)`,
      boxShadow: '0 14px 40px rgba(0,0,0,.45)',
      textAlign: 'center',
    }}>
      <div style={{
        font: `900 ${size}px/0.92 ${black}`,
        letterSpacing: t.label.length <= 3 ? -3 : -1,
        textWrap: 'balance',
      }}>{t.label}</div>
      {t.sub && (
        <>
          <div style={{ width: 40, height: 3, background: paint.rule }} />
          <div style={{
            font: `700 17px/1.2 ${mono}`, letterSpacing: 1.1,
            textTransform: 'uppercase', opacity: .92, textWrap: 'balance',
          }}>{t.sub}</div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------- scene */

/** Hairline lattice — the grid as a whisper, for cuts that keep the photo whole. */
function Hairlines({ opacity }: { opacity: number }) {
  return (
    <AbsoluteFill style={{ opacity }}>
      {Array.from({ length: COLS - 1 }, (_, c) => (
        <div key={`v${c}`} style={{
          position: 'absolute', left: (c + 1) * TW, top: 0, width: 1, height: H,
          background: 'rgba(244,241,234,.55)',
        }} />
      ))}
      {Array.from({ length: ROWS - 1 }, (_, r) => (
        <div key={`h${r}`} style={{
          position: 'absolute', top: (r + 1) * TH, left: 0, height: 1, width: W,
          background: 'rgba(244,241,234,.55)',
        }} />
      ))}
    </AbsoluteFill>
  );
}

/** Full-bleed photograph with a slow push — the ground for every mode but `cards`. */
function Plate({ src, dim, from = 1.0, to = 1.09 }: { src: string; dim: number; from?: number; to?: number }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = clamp(frame, [0, Math.max(1, durationInFrames)], [from, to]);
  return (
    <AbsoluteFill>
      <Img src={staticFile(src)} style={{
        width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`,
      }} />
      {dim > 0 && <AbsoluteFill style={{ background: `rgba(6,9,12,${dim})` }} />}
    </AbsoluteFill>
  );
}

/**
 * `cards` — the one cut with no photograph behind it.
 *
 * The negations are a list of three, which is the only beat in the reel where a
 * stack of cards is what the sentence actually is. Giving this beat the mosaic
 * spent the device where it was not needed, and it forced a second crop of the
 * cut-1 photograph to sit behind it — which is what the representative caught as
 * "백그라운드 이미지가 두번씩 연속으로 나오는건 좀 아닌거 같다". The gift-card rack survives here
 * as a photo card inside the layout instead of as wallpaper behind it.
 */
function CardsScene({ ons, cardSrc }: { ons: CutOns; cardSrc: string }) {
  const frame = useCurrentFrame();
  const wash = clamp(frame, [0, 26], [0, 1]);
  const photoIn = clamp(frame, [6, 26], [0, 1]);
  const zoom = clamp(frame, [0, 140], [1.04, 1.14]);

  return (
    <AbsoluteFill style={{ background: '#080B0E' }}>
      {/* Not a black card: a lit ground with the lattice showing through it. */}
      <AbsoluteFill style={{
        background: 'radial-gradient(118% 66% at 72% 30%, #3B4C57 0%, #253039 46%, #161D24 100%)',
      }} />
      <Hairlines opacity={0.2 * wash} />

      <div style={{
        position: 'absolute', left: 552, top: 250, width: 476, height: 924,
        overflow: 'hidden', background: T.ink,
        opacity: photoIn,
        transform: `translateY(${(1 - photoIn) * 28}px)`,
        boxShadow: '0 26px 64px rgba(0,0,0,.6), inset 0 0 0 3px rgba(244,241,234,.16)',
      }}>
        <Img src={staticFile(cardSrc)} style={{
          width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`,
        }} />
      </div>
      {ons.cardNote && (
        <div style={{
          position: 'absolute', left: 552, top: 1190, width: 476,
          font: `700 19px/1.35 ${mono}`, letterSpacing: 1.3, textTransform: 'uppercase',
          color: '#93A2AD', opacity: photoIn,
        }}>{ons.cardNote}</div>
      )}

      {ons.cardFoot && (() => {
        const footIn = clamp(frame, [46, 66], [0, 1]);
        return (
          <div style={{
            position: 'absolute', left: 68, top: 900, width: 462,
            background: T.bone, color: T.ink, padding: '20px 24px 22px',
            opacity: footIn, transform: `translateY(${(1 - footIn) * 18}px)`,
            boxShadow: '0 18px 44px rgba(0,0,0,.5)',
            borderLeft: `10px solid ${T.chip}`,
          }}>
            <div style={{ font: `900 34px/1.02 ${black}`, letterSpacing: -1.2 }}>{ons.cardFoot.label}</div>
            <div style={{
              marginTop: 10, font: `700 18px/1.35 ${mono}`, letterSpacing: 1.1,
              textTransform: 'uppercase', color: '#55616C',
            }}>{ons.cardFoot.sub}</div>
          </div>
        );
      })()}

      {(ons.tiles ?? []).map((t, n) => {
        const at = t.at ?? n * 14 + 4;
        const enter = clamp(frame, [at, at + 13], [0, 1]);
        const paint = PAINT[t.kind];
        return (
          <div key={t.label} style={{
            position: 'absolute', left: 68, top: 300 + n * 190, width: 462, minHeight: 156,
            background: paint.bg, color: paint.fg,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            gap: 9, padding: '20px 26px 22px',
            opacity: enter,
            transform: `translateX(${(1 - enter) * -48}px)`,
            boxShadow: '0 18px 46px rgba(0,0,0,.5)',
          }}>
            <div style={{ font: `900 62px/0.94 ${black}`, letterSpacing: -2 }}>{t.label}</div>
            {t.sub && (
              <>
                <div style={{ width: 52, height: 3, background: paint.rule }} />
                <div style={{
                  font: `700 20px/1.25 ${mono}`, letterSpacing: 1.2,
                  textTransform: 'uppercase', opacity: .92,
                }}>{t.sub}</div>
              </>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

function GridScene({ src, ons, cardSrc }: { src: string; ons: CutOns; cardSrc?: string }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const D = durationInFrames;

  for (const t of ons.tiles ?? []) {
    if (ons.mode === 'cards') continue;          // laid out as a stack, not on the lattice
    const row = Math.floor(t.i / COLS);
    if (row < LABEL_ROW_MIN || row > LABEL_ROW_MAX) {
      throw new Error(
        `SplitGrid cut ${ons.cut}: label "${t.label}" is on row ${row}; labels must sit on rows ${LABEL_ROW_MIN}-${LABEL_ROW_MAX}.`,
      );
    }
  }

  if (ons.mode === 'cards') {
    if (!cardSrc) throw new Error(`SplitGrid cut ${ons.cut}: mode 'cards' needs a cardSrc`);
    return (
      <>
        <CardsScene ons={ons} cardSrc={cardSrc} />
        <Kicker text={ons.kicker} n={ons.cut} />
      </>
    );
  }

  const labelled = new Map((ons.tiles ?? []).map((t) => [t.i, t]));
  const labels = (ons.tiles ?? []).map((t) => <LabelTile key={t.i} t={t} gap={6} />);

  /* ---- assemble: build, hold, then dissolve so the photograph lands whole ---- */
  if (ons.mode === 'assemble') {
    const d0 = ons.dissolveAt ?? D * 0.46;
    const out = clamp(frame, [d0, d0 + 30], [1, 0]);
    return (
      <AbsoluteFill style={{ background: T.ink }}>
        <Plate src={src} dim={0.22 * out} />
        {Array.from({ length: COLS * ROWS }, (_, i) => (
          <PhotoTile key={i} src={src} i={i} gap={6} dim={0} fade={out} />
        ))}
        <Hairlines opacity={0.1 * (1 - out)} />
        {labels}
        <Kicker text={ons.kicker} n={ons.cut} />
        {ons.headline && <OpeningCard {...ons.headline} />}
      </AbsoluteFill>
    );
  }

  /* ---- lift: the photograph stays whole; a few tiles peel off its surface ---- */
  if (ons.mode === 'lift') {
    const lift = ons.lift ?? [];
    return (
      <AbsoluteFill style={{ background: T.ink }}>
        <Plate src={src} dim={0.14} />
        {lift.map((i, n) => {
          const start = 10 + n * 9;
          const peel = clamp(frame, [start, start + 26], [0, 34]);
          return <PhotoTile key={i} src={src} i={i} gap={0} dim={0} peel={peel} />;
        })}
        {labels}
        <Kicker text={ons.kicker} n={ons.cut} />
      </AbsoluteFill>
    );
  }

  /* ---- quiet: full bleed, hairlines only ---- */
  if (ons.mode === 'quiet') {
    return (
      <AbsoluteFill style={{ background: T.ink }}>
        <Plate src={src} dim={0.14} from={1.0} to={1.12} />
        <Hairlines opacity={clamp(frame, [0, 22], [0, 0.09])} />
        {labels}
        <Kicker text={ons.kicker} n={ons.cut} />
      </AbsoluteFill>
    );
  }

  /* ---- shutOpen: the seams close and dim, then OPEN on the subject ------------
     v003 closed and stayed closed, which reads as the frame ending rather than
     revealing. The payoff has to end on the ATM whole. -------------------------- */
  const shut = clamp(frame, [D - 150, D - 116], [0, 1]);
  const open = clamp(frame, [D - 74, D - 40], [0, 1]);
  const gap = 6 - shut * 6;
  const dimAll = shut * 0.66 * (1 - open);
  return (
    <AbsoluteFill style={{ background: T.ink }}>
      <Plate src={src} dim={0.3 * (1 - open) + dimAll * 0.3} />
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        if (labelled.has(i)) return null;
        const lit = (ons.keepLit ?? []).includes(i);
        return (
          <PhotoTile
            key={i} src={src} i={i} gap={gap}
            dim={lit ? 0 : dimAll} fade={1 - open}
          />
        );
      })}
      <Hairlines opacity={0.1 * open} />
      {labels}
      <Kicker text={ons.kicker} n={ons.cut} />
    </AbsoluteFill>
  );
}

/** Top rail: the section label every card in the carousel would carry. */
function Kicker({ text, n }: { text: string; n: number }) {
  const frame = useCurrentFrame();
  const enter = clamp(frame, [4, 18], [0, 1]);
  return (
    <TextGate style={{
      position: 'absolute', left: 46, right: 46, top: 116, zIndex: 120,
      display: 'flex', alignItems: 'stretch', gap: 0,
      opacity: enter, transform: `translateX(${(1 - enter) * -22}px)`,
    }}>
      <div style={{
        background: T.chip, color: '#fff', padding: '9px 15px 10px',
        font: `800 21px/1 ${mono}`, letterSpacing: 3.4, textTransform: 'uppercase',
      }}>{text}</div>
      <div style={{
        background: 'rgba(10,13,16,.86)', color: T.bone, padding: '9px 14px 10px',
        font: `700 21px/1 ${mono}`, letterSpacing: 2.2,
        borderLeft: `2px solid rgba(255,255,255,.18)`,
      }}>{String(n).padStart(2, '0')}<span style={{ opacity: .45 }}>/06</span></div>
    </TextGate>
  );
}

/**
 * The opening card. Frame 0 is the Instagram grid thumbnail, so this sits inside
 * the conservative safe area and states the reel's thesis rather than the post title.
 */
function OpeningCard({ line1, line2, foot, top = 700 }: { line1: string; line2: string; foot: string; top?: number }) {
  const frame = useCurrentFrame();
  const rise = clamp(frame, [10, 30], [0, 1]);
  const rule = clamp(frame, [22, 44], [0, 1]);
  return (
    <TextGate style={{
      position: 'absolute', left: 84, right: 84, top, zIndex: 130,
      opacity: rise, transform: `translateY(${(1 - rise) * 26}px)`,
    }}>
      <div style={{
        background: T.bone, color: T.ink, padding: '30px 32px 28px',
        boxShadow: '0 26px 70px rgba(0,0,0,.55)',
      }}>
        <div style={{ height: 6, width: `${rule * 100}%`, background: T.chip, marginBottom: 22 }} />
        <div style={{ font: `900 82px/0.94 ${black}`, letterSpacing: -3 }}>
          {line1}<br />{line2}
        </div>
        <div style={{
          marginTop: 20, paddingTop: 16, borderTop: `2px solid rgba(10,13,16,.16)`,
          font: `700 22px/1.3 ${mono}`, letterSpacing: 1.6, textTransform: 'uppercase', color: '#4A5560',
        }}>{foot}</div>
      </div>
    </TextGate>
  );
}

/* ---------------------------------------------------------------- captions */

function Captions({ beats }: { beats: CaptionBeat[] }) {
  const frame = useCurrentFrame();
  const active = beats.find((b) => frame >= b.startFrame && frame <= b.endFrame);
  if (!active) return null;
  const entry = clamp(frame, [active.startFrame, active.startFrame + 6], [0, 1]);
  const run = clamp(frame, [active.startFrame, active.endFrame], [0, 1]);
  return (
    <div data-caption-safe-zone="instagram-reels" style={{
      position: 'absolute', zIndex: 150, left: 72, right: 128, bottom: 410, minHeight: 92,
      background: 'rgba(10,13,16,.92)', borderTop: `4px solid ${T.chip}`,
      display: 'grid', placeItems: 'center', padding: '15px 22px 17px',
      color: T.bone, font: `800 34px/1.14 ${grotesk}`, letterSpacing: -.2,
      textAlign: 'center', textWrap: 'balance',
      opacity: entry, transform: `translateY(${(1 - entry) * 14}px)`,
      boxShadow: '0 12px 40px rgba(0,0,0,.5)',
    }}>
      {active.text}
      <div style={{
        position: 'absolute', left: 0, bottom: 0, height: 3,
        width: `${run * 100}%`, background: T.chip, opacity: .85,
      }} />
    </div>
  );
}

/**
 * Legibility floor for the top rail. The hook plate is a shelf of white price tags,
 * and white watermark text on a white tag is unreadable — the media is a photograph,
 * not a designed backdrop, so the frame has to supply its own ground.
 */
function TopScrim() {
  return (
    <AbsoluteFill style={{
      zIndex: 190, pointerEvents: 'none',
      background: 'linear-gradient(180deg, rgba(6,9,12,.66) 0%, rgba(6,9,12,.28) 14%, rgba(6,9,12,0) 26%)',
    }} />
  );
}

function Watermark() {
  return (
    <div style={{
      position: 'absolute', left: 46, top: 44, zIndex: 200,
      color: 'rgba(255,255,255,.88)', font: `800 22px/1 ${mono}`, letterSpacing: 4.2,
      textShadow: '0 2px 12px rgba(0,0,0,.75)',
    }}>EPICKOR.COM</div>
  );
}

/* ------------------------------------------------------------------- outro */

function Outro({ hook, sub, src }: { hook: string; sub: string; src: string }) {
  const frame = useCurrentFrame();
  const rule = clamp(frame, [4, 18], [0, 1]);
  const rise = clamp(frame, [12, 30], [0, 1]);
  const chip = clamp(frame, [28, 46], [0, 1]);
  // The grid collapses to a single plate: the carousel closing to its back cover.
  const close = clamp(frame, [0, 22], [0, 1]);
  return (
    <AbsoluteFill style={{ background: T.ink }}>
      {/* The back cover of the carousel, cut from the reel's own last frame. A flat
          black card here reads as the video having ended rather than closed, and
          plain black information screens are a hard reject. */}
      <AbsoluteFill>
        <Img src={staticFile(src)} style={{
          width: '100%', height: '100%', objectFit: 'cover',
          filter: 'grayscale(.72) brightness(.34) contrast(1.1)',
          transform: `scale(${clamp(frame, [0, 135], [1.06, 1.0])})`,
        }} />
        <AbsoluteFill style={{ background: `rgba(8,11,14,${0.42 + close * 0.2})` }} />
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const w = wobble(i);
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          return (
            <div key={i} style={{
              position: 'absolute',
              left: col * TW, top: row * TH, width: TW, height: TH,
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.05)',
              background: i % 7 === 0 ? 'rgba(18,176,232,.05)' : 'transparent',
              opacity: clamp(frame, [w.phase * 10, w.phase * 10 + 12], [0, 1]),
            }} />
          );
        })}
      </AbsoluteFill>

      <div style={{ position: 'absolute', left: 92, right: 92, top: 740, zIndex: 20 }}>
        <div style={{ height: 7, width: `${rule * 220}px`, background: T.chip, marginBottom: 30 }} />
        <div style={{
          font: `900 96px/0.94 ${black}`, letterSpacing: -3.4, color: T.bone,
          opacity: rise, transform: `translateY(${(1 - rise) * 20}px)`,
          textShadow: '0 6px 26px rgba(0,0,0,.6)',
        }}>{hook}</div>
        <div style={{
          marginTop: 22, font: `600 30px/1.3 ${grotesk}`, color: '#AEB9C2',
          opacity: rise, textWrap: 'balance',
        }}>{sub}</div>
        <div style={{
          marginTop: 46, display: 'inline-block',
          background: T.chip, color: '#fff', padding: '17px 30px 19px',
          font: `900 42px/1 ${black}`, letterSpacing: -1.2,
          opacity: chip, transform: `translateY(${(1 - chip) * 16}px)`,
          boxShadow: '0 18px 46px rgba(0,0,0,.5)',
        }}>epickor.com</div>
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------- reels */

export function ReelSplitGrid({
  manifest, ons, outro, cardSrc,
}: {
  manifest: Manifest;
  ons: CutOns[];
  outro: { hook: string; sub: string };
  /** the photo card used by the one `cards` cut */
  cardSrc?: string;
}) {
  const byCut = new Map(ons.map((o) => [o.cut, o]));
  return (
    <AbsoluteFill style={{ background: T.ink }}>
      {manifest.cuts.map((c) => {
        const o = byCut.get(c.n);
        if (!o) throw new Error(`SplitGrid: no ONS config for cut ${c.n}`);
        return (
          <Cut key={c.n} from={c.from} len={c.len}>
            <GridScene src={c.src} ons={o} cardSrc={cardSrc} />
          </Cut>
        );
      })}

      <Sequence from={manifest.outroFrom}>
        <Outro hook={outro.hook} sub={outro.sub} src={manifest.cuts[manifest.cuts.length - 1].src} />
      </Sequence>

      <TopScrim />
      <Watermark />
      <Captions beats={manifest.beats} />
      <VoiceTrack slug={manifest.slug} segments={manifest.audio} />
    </AbsoluteFill>
  );
}
