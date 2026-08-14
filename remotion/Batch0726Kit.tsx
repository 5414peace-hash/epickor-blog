/**
 * Shared kit for the 2026-07-26 batch (Reels 220 / 174 / 175).
 *
 * Built to the Reels 2.2 rules set on 2026-07-21:
 *  - three acts, four to six cuts; strong shots are allowed to run 6-8s
 *  - the hook is a video with a motion event, never typography over a still
 *  - zero motion cards; the payoff is a reveal that happens on screen
 *  - epickor.com renders as a SOLID RED CHIP, never red text over footage
 *
 * Two things here exist specifically because of representative notes:
 *  - StillCut takes a direction, so consecutive photos move in opposing
 *    directions and a run of stills reads as motion rather than a carousel
 *  - CrossCut holds a 16-frame opacity overlap so cuts never flash to
 *    background between media
 */
import type { CSSProperties, ReactNode } from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const display = "Impact, 'Arial Narrow', 'Franklin Gothic Condensed', sans-serif";
export const body = "'Segoe UI', Arial, 'Helvetica Neue', sans-serif";

/** House palette, carried over from Reel 301/313 so the batch stays on-brand. */
export const social = {
  cobalt: '#0a4d5c',
  red: '#ff7a29',
  chip: '#d24437',
  ivory: '#fff6e9',
  ink: '#06323a',
};

export type CaptionBeat = { text: string; startFrame: number; endFrame: number };

export function clamp(frame: number, input: number[], output: number[]) {
  return interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

/**
 * Every cut fades its first and last 8 frames. Adjacent Sequences overlap by
 * 16 frames in the compositions, so one cut is still at partial opacity while
 * the next comes up — no hard reset to the background colour.
 */
function Fade({ children, hold = 8, fadeIn = true }: { children: ReactNode; hold?: number; fadeIn?: boolean }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inOpacity = fadeIn ? clamp(frame, [0, hold], [0, 1]) : 1;
  const outOpacity = clamp(frame, [durationInFrames - hold, durationInFrames], [1, 0]);
  return <AbsoluteFill style={{ opacity: Math.min(inOpacity, outOpacity) }}>{children}</AbsoluteFill>;
}

/**
 * QA 2026-07-27 (175 v003): objectPosition is useless on a full-bleed 9:16
 * source — there is no overflow to reposition, so "reframed" returns rendered
 * identical to their first appearance. Reframing now uses transform-origin:
 * scaling toward 'center 15%' shows the top of the frame, 'center 85%' the
 * bottom. That is what actually turns a returning clip into a different shot.
 */
export function VideoCut({
  src, trim = 0, position = 'center', origin = 'center center', from = 1.02, to = 1.09, fadeIn = true,
}: { src: string; trim?: number; position?: string; origin?: string; from?: number; to?: number; fadeIn?: boolean }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = clamp(frame, [0, Math.max(1, durationInFrames)], [from, to]);
  return (
    <Fade fadeIn={fadeIn}>
      <OffthreadVideo
        src={staticFile(src)}
        trimBefore={trim}
        muted
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          objectPosition: position, transformOrigin: origin, transform: `scale(${zoom})`,
        }}
      />
    </Fade>
  );
}

/** 16-frame overlap on every cut boundary, so media never flashes to background. */
export const OVERLAP = 16;

export type Drift = 'left' | 'right' | 'up' | 'down';

/**
 * A still is never allowed to sit still. It gets a push or a pull plus a drift,
 * and consecutive stills are given opposing directions by the caller.
 */
export function StillCut({
  src, from = 1.0, to = 1.15, drift = 'left', amount = 46, position = 'center', fadeIn = true,
}: { src: string; from?: number; to?: number; drift?: Drift; amount?: number; position?: string; fadeIn?: boolean }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const span = Math.max(1, durationInFrames);
  const zoom = clamp(frame, [0, span], [from, to]);
  const travel = clamp(frame, [0, span], [0, amount]);
  const x = drift === 'left' ? -travel : drift === 'right' ? travel : 0;
  const y = drift === 'up' ? -travel : drift === 'down' ? travel : 0;
  return (
    <Fade fadeIn={fadeIn}>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%', height: '100%', objectFit: 'cover', objectPosition: position,
          transform: `scale(${zoom}) translate(${x}px, ${y}px)`,
        }}
      />
    </Fade>
  );
}

export function Kicker({ children, at = 0 }: { children: ReactNode; at?: number }) {
  const frame = useCurrentFrame();
  const p = clamp(frame, [at, at + 10], [0, 1]);
  return (
    <div style={{
      display: 'inline-block', color: social.ivory, background: social.red,
      padding: '11px 15px', font: `900 23px/1 ${body}`, letterSpacing: 3.5,
      textTransform: 'uppercase', transformOrigin: 'left center',
      transform: `scaleX(${p})`, opacity: p,
    }}>{children}</div>
  );
}

export function MaskText({
  children, at = 0, color = social.ivory, size = 120, style, reveal = 14,
}: { children: ReactNode; at?: number; color?: string; size?: number; style?: CSSProperties; reveal?: number }) {
  const frame = useCurrentFrame();
  const p = clamp(frame, [at, at + reveal], [0, 1]);
  return (
    <div style={{
      color, font: `900 ${size}px/.9 ${display}`, letterSpacing: -2,
      textTransform: 'uppercase', clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
      transform: `translateY(${(1 - p) * 28}px)`,
      textShadow: '0 4px 22px rgba(0,0,0,.75)', ...style,
    }}>{children}</div>
  );
}

/**
 * On-screen statement. `top` must keep the lowest glyph at or above y=1340 so
 * the narration caption band starting at y=1400 is never collided with.
 */
/**
 * Text must clear the frame before the next cut's text arrives.
 *
 * QA 2026-07-27: the 16-frame media overlap that keeps cuts from flashing was
 * also overlapping the on-screen copy, so at a boundary "you dip" rendered on
 * top of "hand-folded" and read as `YOU DIPLDED`. Copy now fades out across the
 * overlap window while the footage keeps crossfading underneath.
 */
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

export function Ons({
  kicker, topLine, punch, sub, at = 8, size = 118, top = 250,
}: { kicker: string; topLine?: string; punch: string; sub?: string; at?: number; size?: number; top?: number }) {
  return (
    <TextGate style={{ position: 'absolute', left: 54, right: 104, top, zIndex: 60 }}>
      <Kicker at={at}>{kicker}</Kicker>
      {topLine ? <MaskText at={at + 4} size={size} style={{ marginTop: 24 }}>{topLine}</MaskText> : null}
      <MaskText
        at={at + (topLine ? 12 : 2)}
        size={Math.round(size * 1.14)}
        color={social.red}
        style={topLine ? undefined : { marginTop: 24 }}
      >{punch}</MaskText>
      {sub && (
        <div style={{
          marginTop: 26, color: social.ivory, font: `900 33px/1.15 ${body}`,
          textShadow: '0 2px 12px rgba(0,0,0,.85)',
        }}>{sub}</div>
      )}
    </TextGate>
  );
}

/** Narration captions. Band starts at y=1400; nothing above may reach past 1340. */
export function Captions({ beats }: { beats: CaptionBeat[] }) {
  const frame = useCurrentFrame();
  const active = beats.find((b) => frame >= b.startFrame && frame <= b.endFrame);
  if (!active) return null;
  const entry = clamp(frame, [active.startFrame, active.startFrame + 6], [0, 1]);
  const line = clamp(frame, [active.startFrame, active.endFrame], [0, 1]);
  return (
    <div data-caption-safe-zone="instagram-reels" style={{
      position: 'absolute', zIndex: 150, left: 74, right: 132, bottom: 410, minHeight: 86,
      padding: '16px 25px 18px 31px', boxSizing: 'border-box', display: 'grid', placeItems: 'center',
      borderRadius: 12, overflow: 'hidden', background: 'rgba(10,11,13,.86)',
      border: '1px solid rgba(255,255,255,.2)', color: '#fffaf0',
      boxShadow: '0 14px 42px rgba(0,0,0,.28)', font: `900 34px/1.12 ${body}`,
      letterSpacing: -.2, textAlign: 'center', textWrap: 'balance',
      opacity: entry, transform: `translateY(${(1 - entry) * 16}px) scale(${.978 + entry * .022})`,
    }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 8,
        background: social.red, transformOrigin: 'bottom', transform: `scaleY(${entry})`,
      }} />
      <div style={{
        position: 'absolute', left: 8, bottom: 0, height: 3,
        width: `${line * 100}%`, background: social.red, opacity: .7,
      }} />
      {active.text}
    </div>
  );
}

/**
 * Outro. The hook line comes from output/reels/outro-cta-bank.md and rotates by
 * topic; epickor.com is a solid red chip because red text over Korean signage
 * was measured unreadable in earlier Reels.
 */
export function Outro({ hook, sub }: { hook: string; sub: string }) {
  const frame = useCurrentFrame();
  const rule = clamp(frame, [6, 18], [0, 1]);
  const chip = clamp(frame, [30, 46], [0, 1]);
  return (
    <TextGate style={{ position: 'absolute', left: 54, right: 104, top: 700, zIndex: 62 }}>
      <div style={{ height: 8, width: `${rule * 190}px`, background: social.chip }} />
      <MaskText at={12} size={104} style={{ marginTop: 26 }}>{hook}</MaskText>
      <div style={{
        marginTop: 26, color: social.ivory, font: `900 32px/1.2 ${body}`,
        textShadow: '0 2px 12px rgba(0,0,0,.85)',
      }}>{sub}</div>
      <div style={{
        marginTop: 30, display: 'inline-block', background: social.chip, color: '#ffffff',
        padding: '18px 30px', font: `900 60px/1 ${display}`, letterSpacing: -.5,
        opacity: chip, transform: `translateY(${(1 - chip) * 16}px)`,
        boxShadow: '0 10px 34px rgba(0,0,0,.45)',
      }}>epickor.com</div>
    </TextGate>
  );
}

export function Watermark() {
  return (
    <div style={{
      position: 'absolute', left: 46, top: 46, zIndex: 90, color: 'rgba(255,255,255,.82)',
      font: `900 21px/1 ${body}`, letterSpacing: 3.2, textTransform: 'uppercase',
      textShadow: '0 2px 10px rgba(0,0,0,.85)',
    }}>EpicKor</div>
  );
}

export function Cut({ from, len, children }: { from: number; len: number; children: ReactNode }) {
  return <Sequence from={from} durationInFrames={len + OVERLAP}>{children}</Sequence>;
}

export function VoiceTrack({ slug, segments }: { slug: string; segments: { part: number; startFrame: number }[] }) {
  return (
    <>
      {segments.map((s) => (
        <Sequence key={s.part} from={s.startFrame}>
          <Audio src={staticFile(`assets/reels/${slug}/audio/voice-part-${s.part}.mp3`)} />
        </Sequence>
      ))}
    </>
  );
}
