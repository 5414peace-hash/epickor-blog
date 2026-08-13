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

export type CutOns = {
  cut: number;
  kicker: string;
  /** opening card — cut 1 only, doubles as the grid thumbnail */
  headline?: { line1: string; line2: string; foot: string };
  tiles?: TileLabel[];
  /** payoff move: tile gaps close to zero and the grid dims around one tile */
  slamShut?: boolean;
  /** tile indices kept lit while the rest dims, used with slamShut */
  keepLit?: number[];
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

/* -------------------------------------------------------------------- tile */

function PhotoTile({
  src, i, gap, dim,
}: { src: string; i: number; gap: number; dim: number }) {
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
      opacity: enter,
      transform: `translate(${ox}px, ${oy}px)`,
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.07)',
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

  const paint = {
    chip: { bg: T.chip, fg: '#fff', rule: 'rgba(255,255,255,.5)' },
    cyan: { bg: T.cyan, fg: '#04222E', rule: 'rgba(0,0,0,.35)' },
    bone: { bg: T.bone, fg: T.ink, rule: T.chip },
    ink: { bg: '#101519', fg: T.bone, rule: T.cyan },
    amber: { bg: T.amber, fg: '#2A1D00', rule: 'rgba(0,0,0,.4)' },
  }[t.kind];

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

function GridScene({ src, ons }: { src: string; ons: CutOns }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // The payoff move: the seams close and the grid dims around the tile that
  // carries the point. It reads as the frame locking rather than cutting.
  const shut = ons.slamShut ? clamp(frame, [durationInFrames - 96, durationInFrames - 62], [0, 1]) : 0;
  const gap = 6 - shut * 6;
  const dimAll = shut * 0.62;

  for (const t of ons.tiles ?? []) {
    const row = Math.floor(t.i / COLS);
    if (row < LABEL_ROW_MIN || row > LABEL_ROW_MAX) {
      throw new Error(
        `SplitGrid cut ${ons.cut}: label "${t.label}" is on row ${row}; labels must sit on rows ${LABEL_ROW_MIN}-${LABEL_ROW_MAX}.`,
      );
    }
  }
  const labelled = new Map((ons.tiles ?? []).map((t) => [t.i, t]));

  return (
    <AbsoluteFill style={{ background: T.ink }}>
      {/* Base plate. Without it frame 0 is the ink ground while the tiles are still
          arriving — a black open, which is a hard reject. It also means the seams
          reveal a darker copy of the same photo instead of flat black, so the grid
          reads as cut from one image rather than pasted onto nothing. */}
      <AbsoluteFill>
        <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <AbsoluteFill style={{ background: `rgba(6,9,12,${0.5 + dimAll * 0.34})` }} />
      </AbsoluteFill>

      {Array.from({ length: COLS * ROWS }, (_, i) => {
        if (labelled.has(i)) return null;
        const lit = (ons.keepLit ?? []).includes(i);
        return <PhotoTile key={i} src={src} i={i} gap={gap} dim={lit ? 0 : dimAll} />;
      })}
      {(ons.tiles ?? []).map((t) => <LabelTile key={t.i} t={t} gap={gap} />)}

      <Kicker text={ons.kicker} n={ons.cut} />
      {ons.headline && <OpeningCard {...ons.headline} />}
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
function OpeningCard({ line1, line2, foot }: { line1: string; line2: string; foot: string }) {
  const frame = useCurrentFrame();
  const rise = clamp(frame, [10, 30], [0, 1]);
  const rule = clamp(frame, [22, 44], [0, 1]);
  return (
    <TextGate style={{
      position: 'absolute', left: 84, right: 84, top: 700, zIndex: 130,
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
  manifest, ons, outro,
}: {
  manifest: Manifest;
  ons: CutOns[];
  outro: { hook: string; sub: string };
}) {
  const byCut = new Map(ons.map((o) => [o.cut, o]));
  return (
    <AbsoluteFill style={{ background: T.ink }}>
      {manifest.cuts.map((c) => {
        const o = byCut.get(c.n);
        if (!o) throw new Error(`SplitGrid: no ONS config for cut ${c.n}`);
        return (
          <Cut key={c.n} from={c.from} len={c.len}>
            <GridScene src={c.src} ons={o} />
          </Cut>
        );
      })}

      <Sequence from={manifest.outroFrom}>
        <Outro hook={outro.hook} sub={outro.sub} src={manifest.cuts[manifest.cuts.length - 1].src} />
      </Sequence>

      <Watermark />
      <Captions beats={manifest.beats} />
      <VoiceTrack slug={manifest.slug} segments={manifest.audio} />
    </AbsoluteFill>
  );
}
