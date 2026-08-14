/**
 * TIMELINE — design O, first use on Reel 379 (MATCH 03).
 *
 * The third frame in the batch, and the third answer to the same brief: a Reel
 * built like a card-news carousel. Split Grid dices a photograph. Spec Sheet puts a
 * specimen on a page. Timeline makes **time the layout axis** — a media band across
 * the top, a large readout under it, and a calendar rail whose head moves to
 * wherever the sentence currently is.
 *
 * Why this frame drew this topic. Post 379's spine is a schedule, and the article's
 * actual advice is a date problem: the show is 7 November, but the thing you have to
 * act on falls in late August. On a rail that runs AUG → NOV 7, the head jumping
 * *backwards* when the narration reaches tickets is the argument, drawn.
 *
 * It is also why the rail carries `2025 PATTERN / 2026 UNCONFIRMED` in the HUD
 * throughout. The 2026 ticket dates have not been published — the official site's
 * notice board has not been updated since November 2025 — and a timeline graphic is
 * exactly the kind of thing that would imply otherwise if left unlabelled.
 *
 * Constraints carried over unchanged — these are not style:
 *  - Caption band is left:72 right:128 bottom:410, verified against Instagram's UI.
 *  - Nothing carrying copy descends past y=1340. The stops row ends at ~1262.
 *  - Cut-scoped copy goes through TextGate so it clears before the next cut's.
 *  - epickor.com is a solid red chip, never coloured text over the footage.
 *  - The outro is spoken and says the domain aloud (from 377 onward).
 */
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import type { CSSProperties, ReactNode } from 'react';
import { Cut, OVERLAP, VoiceTrack, clamp } from './Batch0726Kit';

/* ------------------------------------------------------------------ tokens */

const T = {
  ground: '#0E1116',
  panel: '#161C24',
  bone: '#F2F5F9',
  amber: '#FFD24A',      // the readout, and the live stop
  dim: '#5C6675',
  rail: '#232A34',
  red: '#D24437',
};

const black = "'Segoe UI Black', 'Segoe UI', 'Arial Black', sans-serif";
const grotesk = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const mono = "Consolas, 'Courier New', ui-monospace, monospace";

const W = 1080;
const H = 1920;
/** The media band. Everything below it is the timeline. */
const BAND = 820;

export type CaptionBeat = { text: string; startFrame: number; endFrame: number };
export type Manifest = {
  slug: string;
  durationInFrames: number;
  outroFrom: number;
  cuts: { n: number; from: number; len: number; kind?: string }[];
  beats: CaptionBeat[];
  audio: { part: number; startFrame: number }[];
};

export type Stop = { label: string; at: number };

export type CutFrame = {
  cut: number;
  src: string;
  hud: [string, string];
  /** the large amber readout */
  readout: string;
  label: string;
  /** 0..1 along the rail — where this sentence sits in the calendar */
  head: number;
  /** frames after cut start before the readout swaps in */
  at?: number;
  pan?: 'left' | 'right';
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

/** The media band: a photograph that keeps moving, faded into the ground. */
/**
 * `first` = this is cut 1, so it renders the video's frame 0.
 * Frame 0 is the thumbnail and the scroll-stop decision, so nothing on it may
 * fade in — 2026-08-14 audit found 379's frame 0 completely black because the
 * band, the HUD and the readout were all still at opacity 0. Later cuts keep
 * their dissolve; that is cut grammar, not a frame-0 fade.
 */
function Band({ src, pan = 'left', first = false }: { src: string; pan?: 'left' | 'right'; first?: boolean }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const span = Math.max(1, durationInFrames);
  const zoom = clamp(frame, [0, span], [1.06, 1.22]);
  const travel = clamp(frame, [0, span], [0, 54]);
  const x = pan === 'left' ? -travel : travel;
  const enter = first ? 1 : clamp(frame, [0, 12], [0, 1]);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: BAND, overflow: 'hidden', opacity: enter }}>
      <Img src={staticFile(src)} style={{
        width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${zoom}) translateX(${x}px)`,
      }} />
      {/* The band does not end on an edge; it dissolves into the page. */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 260,
        background: `linear-gradient(180deg, rgba(14,17,22,0) 0%, ${T.ground} 100%)`,
      }} />
    </div>
  );
}

function Hud({ left, right, first = false }: { left: string; right: string; first?: boolean }) {
  const frame = useCurrentFrame();
  const enter = first ? 1 : clamp(frame, [4, 18], [0, 1]);
  return (
    <TextGate style={{
      // top 118 put this inside the 0-150 platform cut zone (measured y112-150).
      position: 'absolute', left: 60, right: 150, top: 200, zIndex: 60,
      display: 'flex', justifyContent: 'space-between',
      font: `700 22px/1 ${mono}`, letterSpacing: 4.4, color: T.dim,
      opacity: enter,
      textShadow: '0 2px 14px rgba(0,0,0,.85)',
    }}>
      <span>{left}</span><span style={{ color: T.amber, opacity: .75 }}>{right}</span>
    </TextGate>
  );
}

/** The readout, and the line that says what it is. */
function Readout({ value, label, at = 6, first = false }: { value: string; label: string; at?: number; first?: boolean }) {
  const frame = useCurrentFrame();
  const enter = first ? 1 : clamp(frame, [at, at + 14], [0, 1]);
  const size = value.length <= 5 ? 168 : value.length <= 8 ? 124 : 96;
  return (
    <TextGate style={{ position: 'absolute', left: 60, right: 120, top: 846, zIndex: 40 }}>
      <div style={{
        font: `700 ${size}px/0.9 ${mono}`, letterSpacing: -6, color: T.amber,
        opacity: enter, transform: `translateY(${(1 - enter) * 20}px)`,
        textShadow: '0 0 44px rgba(255,210,74,.28)',
      }}>{value}</div>
      <div style={{
        marginTop: 22, font: `900 56px/1.02 ${black}`, letterSpacing: -1.8, color: T.bone,
        opacity: first ? 1 : clamp(frame, [at + 6, at + 22], [0, 1]),
        textWrap: 'balance',
      }}>{label}</div>
    </TextGate>
  );
}

/**
 * The calendar rail. The stops are the event's real dates; the head is where the
 * current sentence sits on them. It moves backwards between cuts on purpose — the
 * show is in November and the thing you must act on is in August, and that gap is
 * the article's actual advice.
 */
function Rail({ stops, head }: { stops: Stop[]; head: number }) {
  const frame = useCurrentFrame();
  const draw = clamp(frame, [8, 30], [0, 1]);
  const pos = clamp(frame, [10, 34], [0, head]);
  return (
    <TextGate style={{ position: 'absolute', left: 60, right: 150, top: 1168, zIndex: 40 }}>
      <div style={{ position: 'relative', height: 8, background: T.rail }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%',
          width: `${pos * 100}%`, background: T.amber, opacity: .55,
        }} />
        {stops.map((s) => {
          const live = Math.abs(s.at - head) < 0.04;
          return (
            <div key={s.label} style={{
              position: 'absolute', left: `${s.at * 100}%`, top: -15, width: 4, height: 38,
              marginLeft: -2, opacity: draw,
              background: live ? T.amber : '#3A4351',
              boxShadow: live ? '0 0 18px rgba(255,210,74,.9)' : 'none',
            }} />
          );
        })}
        <div style={{
          position: 'absolute', left: `${pos * 100}%`, top: -21, width: 20, height: 50,
          marginLeft: -10, background: T.bone, opacity: draw,
          boxShadow: '0 0 26px rgba(255,255,255,.7)',
        }} />
      </div>
      <div style={{
        position: 'relative', marginTop: 30, height: 30,
        font: `700 23px/1 ${mono}`, letterSpacing: 2, color: T.dim, opacity: draw,
      }}>
        {stops.map((s) => {
          const live = Math.abs(s.at - head) < 0.04;
          return (
            <span key={s.label} style={{
              position: 'absolute',
              left: `${s.at * 100}%`,
              transform: s.at > 0.9 ? 'translateX(-100%)' : s.at < 0.1 ? 'none' : 'translateX(-50%)',
              color: live ? T.bone : T.dim,
              whiteSpace: 'nowrap',
            }}>{s.label}</span>
          );
        })}
      </div>
    </TextGate>
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
      background: 'rgba(10,13,17,.92)', borderTop: `4px solid ${T.amber}`,
      display: 'grid', placeItems: 'center', padding: '15px 22px 17px',
      color: T.bone, font: `800 34px/1.14 ${grotesk}`, letterSpacing: -.2,
      textAlign: 'center', textWrap: 'balance',
      // No fade, no travel: the caption swaps text in place (playbook §9).
      boxShadow: '0 12px 40px rgba(0,0,0,.55)',
    }}>
      {active.text}
      <div style={{
        position: 'absolute', left: 0, bottom: 0, height: 3,
        width: `${run * 100}%`, background: T.amber, opacity: .85,
      }} />
    </div>
  );
}

function Watermark() {
  return (
    <div style={{
      // top 46 sat inside the 0-150 cut zone (measured y50-63).
      position: 'absolute', left: 60, top: 168, zIndex: 200,
      color: 'rgba(255,255,255,.88)', font: `800 22px/1 ${mono}`, letterSpacing: 4.2,
      textShadow: '0 2px 14px rgba(0,0,0,.8)',
    }}>EPICKOR.COM</div>
  );
}

/** A hairline that runs the whole reel, so something is always advancing. */
function Progress({ total }: { total: number }) {
  const frame = useCurrentFrame();
  return (
    <div style={{
      // Below the 0-150 cut zone: at top 0 the platform UI hid it entirely.
      position: 'absolute', left: 0, top: 152, height: 3, zIndex: 210,
      width: `${clamp(frame, [0, total], [0, 100])}%`, background: T.amber, opacity: .5,
    }} />
  );
}

function Outro({ hook, sub, src }: { hook: string; sub: string; src: string }) {
  const frame = useCurrentFrame();
  const wipe = clamp(frame, [0, 18], [0, 1]);
  const rule = clamp(frame, [8, 24], [0, 1]);
  const rise = clamp(frame, [14, 34], [0, 1]);
  const chip = clamp(frame, [28, 48], [0, 1]);
  const zoom = clamp(frame, [0, 170], [1.1, 1.0]);
  return (
    <AbsoluteFill style={{ opacity: wipe, background: T.ground }}>
      <Img src={staticFile(src)} style={{
        width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${zoom})`, filter: 'brightness(.6)',
      }} />
      <AbsoluteFill style={{
        background: 'linear-gradient(180deg, rgba(10,13,17,.7) 0%, rgba(10,13,17,.3) 40%, rgba(10,13,17,.82) 100%)',
      }} />
      <div style={{ position: 'absolute', left: 84, right: 84, top: 690, zIndex: 20 }}>
        <div style={{ height: 7, width: `${rule * 230}px`, background: T.amber, marginBottom: 28 }} />
        <div style={{
          font: `900 92px/0.96 ${black}`, letterSpacing: -3.2, color: T.bone,
          whiteSpace: 'pre-line',
          opacity: rise, transform: `translateY(${(1 - rise) * 20}px)`,
          textShadow: '0 6px 26px rgba(0,0,0,.7)',
        }}>{hook}</div>
        <div style={{
          marginTop: 20, font: `600 29px/1.32 ${grotesk}`, color: '#C3CBD4',
          opacity: rise, textWrap: 'balance',
        }}>{sub}</div>
        <div style={{
          marginTop: 42, display: 'inline-block',
          background: T.red, color: '#fff', padding: '17px 30px 19px',
          font: `900 42px/1 ${black}`, letterSpacing: -1.2,
          opacity: chip, transform: `translateY(${(1 - chip) * 16}px)`,
          boxShadow: '0 18px 46px rgba(0,0,0,.55)',
        }}>epickor.com</div>
      </div>
    </AbsoluteFill>
  );
}

/* -------------------------------------------------------------------- reel */

export function ReelTimeline({
  manifest, frames, stops, outro,
}: {
  manifest: Manifest;
  frames: CutFrame[];
  stops: Stop[];
  outro: { hook: string; sub: string; src: string };
}) {
  const byCut = new Map(frames.map((f) => [f.cut, f]));
  return (
    <AbsoluteFill style={{ background: T.ground }}>
      {manifest.cuts.map((c) => {
        const f = byCut.get(c.n);
        if (!f) throw new Error(`Timeline: no frame config for cut ${c.n}`);
        return (
          <Cut key={c.n} from={c.from} len={c.len}>
            <Band src={f.src} pan={f.pan} first={c.from === 0} />
            <Hud left={f.hud[0]} right={f.hud[1]} first={c.from === 0} />
            <Readout value={f.readout} label={f.label} at={f.at} first={c.from === 0} />
            <Rail stops={stops} head={f.head} />
          </Cut>
        );
      })}

      <Sequence from={manifest.outroFrom}>
        <Outro hook={outro.hook} sub={outro.sub} src={outro.src} />
      </Sequence>

      <Progress total={manifest.durationInFrames} />
      <Watermark />
      <Captions beats={manifest.beats} />
      <VoiceTrack slug={manifest.slug} segments={manifest.audio} />
    </AbsoluteFill>
  );
}
