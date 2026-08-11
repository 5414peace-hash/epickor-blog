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
import captions313 from '../output/reels/2026-07-21_313/caption-timings-v02.json';

const display = "Impact, 'Arial Narrow', 'Franklin Gothic Condensed', sans-serif";
const body = "'Segoe UI', Arial, 'Helvetica Neue', sans-serif";

type CaptionBeat = { text: string; startFrame: number; endFrame: number };
const beats: CaptionBeat[] = ((captions313 as { beats?: CaptionBeat[] }).beats ??
  (captions313 as unknown as CaptionBeat[])) as CaptionBeat[];

/**
 * Signature system, no motion card.
 *
 * The Reel argues that the red tteokbokki is not the original, so the sauce on
 * screen drives the accent colour: gochujang red through the familiar cuts,
 * then soy brown at the reveal. The palette itself performs the twist, which is
 * something no other EpicKor topic would reproduce. An index rail counts the
 * six versions so the payoff line is already understood before it is spoken.
 */
// House palette, matched to Reel 301 (Ajumma). The brand already had a strong
// system; the earlier sauce-colour idea was an invention that ignored it.
const social = { cobalt: '#0a4d5c', red: '#ff7a29', ivory: '#fff6e9', ink: '#06323a', green: '#ffd23f' };
const SAUCE = social;

const CUTS = [
  { n: 1, from: 0, len: 165, accent: social.red, index: null as number | null },  // hook
  { n: 2, from: 165, len: 195, accent: social.red, index: null }, // the real enemy: subway/stairs
  { n: 3, from: 360, len: 150, accent: social.red, index: null }, // the fix: elevator exit
  { n: 4, from: 510, len: 90, accent: social.red, index: 1 },  // hanbok free
  { n: 5, from: 600, len: 80, accent: social.red, index: 2 },  // museum touch
  { n: 6, from: 680, len: 90, accent: social.red, index: 3 },  // gimbap mild
  { n: 7, from: 770, len: 160, accent: social.red, index: null }, // one big thing
  { n: 8, from: 930, len: 90, accent: social.red, index: null },  // outro
];

function clamp(frame: number, input: number[], output: number[]) {
  return interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

function VideoCut({ src, trim = 0, position = 'center', scale = 1.07 }: { src: string; trim?: number; position?: string; scale?: number }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = clamp(frame, [0, Math.max(1, durationInFrames)], [1.01, scale]);
  return (
    <AbsoluteFill>
      <OffthreadVideo src={staticFile(src)} trimBefore={trim} muted
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: position, transform: `scale(${zoom})` }} />
    </AbsoluteFill>
  );
}

function StillCut({ src, position = 'center', scale = 1.12 }: { src: string; position?: string; scale?: number }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = clamp(frame, [0, Math.max(1, durationInFrames)], [1.0, scale]);
  return (
    <AbsoluteFill>
      <Img src={staticFile(src)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: position, transform: `scale(${zoom})` }} />
    </AbsoluteFill>
  );
}

/** House headline: white line, then the punch line in red. Sizes match Reel 301. */
function Kicker({ children, at = 0, background = social.red, color = social.ivory }: { children: ReactNode; at?: number; background?: string; color?: string }) {
  const frame = useCurrentFrame();
  const p = clamp(frame, [at, at + 10], [0, 1]);
  return (
    <div style={{
      display: 'inline-block', color, background, padding: '11px 15px',
      font: `900 23px/1 ${body}`, letterSpacing: 3.5, textTransform: 'uppercase',
      transformOrigin: 'left center', transform: `scaleX(${p})`, opacity: p,
    }}>{children}</div>
  );
}

function MaskText({ children, at = 0, color = social.ivory, size = 130, style, reveal = 15 }: { children: ReactNode; at?: number; color?: string; size?: number; style?: CSSProperties; reveal?: number }) {
  const frame = useCurrentFrame();
  const p = clamp(frame, [at, at + reveal], [0, 1]);
  return (
    <div style={{
      color, font: `900 ${size}px/.9 ${display}`, letterSpacing: -2,
      textTransform: 'uppercase', clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
      transform: `translateY(${(1 - p) * 30}px)`,
      textShadow: '0 4px 22px rgba(0,0,0,.75)', ...style,
    }}>{children}</div>
  );
}

function Ons({ kicker, topLine, punch, sub, at = 8, size = 130, top = 250, reveal = 15 }: { kicker: string; topLine: string; punch: string; sub?: string; at?: number; size?: number; top?: number; reveal?: number }) {
  return (
    <div style={{ position: 'absolute', left: 54, right: 110, top, zIndex: 60 }}>
      <Kicker at={at}>{kicker}</Kicker>
      {topLine ? <MaskText at={at + 4} size={size} reveal={reveal} style={{ marginTop: 26 }}>{topLine}</MaskText> : null}
      <MaskText at={at + (topLine ? 12 : 2)} size={Math.round(size * 1.16)} color={social.red} reveal={reveal} style={topLine ? undefined : { marginTop: 26 }}>{punch}</MaskText>
      {sub && <div style={{ marginTop: 30, color: social.ivory, font: `900 35px/1.15 ${body}`, textShadow: '0 2px 12px rgba(0,0,0,.85)' }}>{sub}</div>}
    </div>
  );
}

/** Index rail. Keeps "six versions" on screen so the payoff is pre-loaded. */
function IndexRail({ active, accent }: { active: number | null; accent: string }) {
  const frame = useCurrentFrame();
  const p = clamp(frame, [10, 26], [0, 1]);
  if (active === null) return null;
  return (
    <div style={{ position: 'absolute', right: 44, top: 300, zIndex: 70, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 15, opacity: p }}>
      {[1, 2, 3, 4, 5, 6].map((i) => {
        const on = i <= active;
        const isCurrent = i === active;
        return (
          <div key={i} style={{
            width: isCurrent ? 56 : 26, height: 9,
            background: on ? accent : 'rgba(255,255,255,.32)',
            boxShadow: isCurrent ? `0 0 20px ${accent}` : 'none',
          }} />
        );
      })}
      <div style={{
        marginTop: 16, color: social.ivory, font: `900 34px/1 ${display}`,
        letterSpacing: 1, textShadow: '0 2px 8px rgba(0,0,0,.9)',
      }}>{`0${active}/06`}</div>
    </div>
  );
}

/** Caption bar matched to Reel 301: accent left edge and a progress underline. */
function Captions() {
  const frame = useCurrentFrame();
  const active = beats.find((b) => frame >= b.startFrame && frame <= b.endFrame);
  if (!active) return null;
  const entry = clamp(frame, [active.startFrame, active.startFrame + 6], [0, 1]);
  const line = clamp(frame, [active.startFrame, active.startFrame + 11], [0, 1]);
  return (
    <div data-caption-safe-zone="instagram-reels" style={{
      position: 'absolute', zIndex: 150, left: 74, right: 132, bottom: 410, minHeight: 86,
      padding: '16px 25px 18px 31px', boxSizing: 'border-box', display: 'grid', placeItems: 'center',
      borderRadius: 12, overflow: 'hidden', background: 'rgba(10,11,13,.86)',
      border: '1px solid rgba(255,255,255,.2)', color: '#fffaf0',
      boxShadow: '0 14px 42px rgba(0,0,0,.28)', font: `900 34px/1.12 ${body}`,
      letterSpacing: -.2, textAlign: 'center', textWrap: 'balance',
      opacity: entry, transform: `translateY(${(1 - entry) * 18}px) scale(${.975 + entry * .025})`,
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, background: social.red, transformOrigin: 'bottom', transform: `scaleY(${line})` }} />
      <div style={{ position: 'absolute', left: 8, bottom: 0, height: 3, width: `${line * 100}%`, background: social.red, opacity: .75 }} />
      {active.text}
    </div>
  );
}

function OutroCta() {
  const frame = useCurrentFrame();
  const p = clamp(frame, [18, 34], [0, 1]);
  return (
    <div style={{ position: 'absolute', left: 54, right: 110, top: 620, zIndex: 62 }}>
      <Kicker at={2}>The one rule</Kicker>
      <MaskText at={6} size={100} style={{ marginTop: 26 }}>Do less.</MaskText>
      <MaskText at={14} size={116} color={social.red}>see more</MaskText>
      <div style={{ marginTop: 34, color: social.ivory, font: `900 33px/1.15 ${body}`, textShadow: '0 2px 12px rgba(0,0,0,.85)' }}>Save this before your family trip.</div>
      <div style={{ marginTop: 22, opacity: p }}>
        <div style={{ color: social.ivory, font: `900 66px/1 ${display}`, letterSpacing: -1, textShadow: '0 3px 16px rgba(0,0,0,.85)' }}>epickor.com</div>
        <div style={{ marginTop: 12, height: 6, width: `${p * 340}px`, background: social.cobalt }} />
      </div>
    </div>
  );
}

/** Full-height sauce rail. This is what makes the palette shift readable:
 *  it runs the whole frame and visibly turns brown at the reveal. */
function SauceRail({ accent }: { accent: string }) {
  const frame = useCurrentFrame();
  const p = clamp(frame, [0, 12], [0, 1]);
  return (
    <div style={{
      position: 'absolute', left: 0, top: 0, bottom: 0, width: 16, zIndex: 75,
      background: accent, transformOrigin: 'top center', transform: `scaleY(${p})`,
      boxShadow: `0 0 40px ${accent}`,
    }} />
  );
}

function Watermark() {
  return (
    <div style={{
      position: 'absolute', left: 46, top: 46, zIndex: 90, color: 'rgba(255,255,255,.8)',
      font: `900 21px/1 ${body}`, letterSpacing: 3.2, textTransform: 'uppercase',
      textShadow: '0 2px 10px rgba(0,0,0,.85)',
    }}>EpicKor</div>
  );
}

function Cut({ index, children }: { index: number; children: ReactNode }) {
  const c = CUTS[index];
  return <Sequence from={c.from} durationInFrames={c.len}>{children}</Sequence>;
}

export const Reel313Composition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: social.ink }}>
      <Cut index={0}>
        <VideoCut src="assets/reels/313/video/hanbok-parade.mp4" trim={120} position="center 40%" />
        <Ons kicker="Seoul with kids" topLine="Easier than" punch="you think" sub="But the hard part is never what you plan for." top={560} size={112} />
      </Cut>

      <Cut index={1}>
        <VideoCut src="assets/reels/313/video/subway.mp4" trim={30} />
        <Ons kicker="The real enemy" topLine="Not safety." punch="Stairs." top={250} size={116} />
      </Cut>

      <Cut index={2}>
        <VideoCut src="assets/reels/313/video/subway-inside.mp4" trim={40} />
        <Ons kicker="The fix" topLine="Find the" punch="elevator exit" sub="Before you arrive, not after." top={250} size={98} />
      </Cut>

      <Cut index={3}>
        <StillCut src="assets/reels/313/image/hanbok-family.png" scale={1.06} />
        <Ons kicker="01" topLine="Hanbok =" punch="free entry" at={0} top={1020} size={92} reveal={6} />
      </Cut>

      <Cut index={4}>
        <StillCut src="assets/reels/313/image/museum.png" scale={1.06} />
        <Ons kicker="02" topLine="Museums" punch="let them touch" at={0} top={1020} size={82} reveal={6} />
      </Cut>

      <Cut index={5}>
        <StillCut src="assets/reels/313/image/gimbap.png" scale={1.08} />
        <Ons kicker="03" topLine="Gimbap =" punch="never spicy" at={0} top={1020} size={92} reveal={6} />
      </Cut>

      {/* the one rule */}
      <Cut index={6}>
        <VideoCut src="assets/reels/313/video/gyeongbokgung.mp4" trim={30} />
        <Ons kicker="The one rule" topLine="One big thing." punch="Not three." top={250} size={94} />
      </Cut>

      <Cut index={7}>
        <VideoCut src="assets/reels/313/video/palace-pond.mp4" trim={20} scale={1.04} />
        <OutroCta />
      </Cut>

      <Sequence from={5}><Audio src={staticFile('assets/reels/313/audio/voice-part-1.mp3')} /></Sequence>
      <Sequence from={165}><Audio src={staticFile('assets/reels/313/audio/voice-part-2.mp3')} /></Sequence>
      <Sequence from={360}><Audio src={staticFile('assets/reels/313/audio/voice-part-3.mp3')} /></Sequence>
      <Sequence from={510}><Audio src={staticFile('assets/reels/313/audio/voice-part-4.mp3')} /></Sequence>
      <Sequence from={760}><Audio src={staticFile('assets/reels/313/audio/voice-part-5.mp3')} /></Sequence>
      <Sequence from={930}><Audio src={staticFile('assets/reels/313/audio/voice-part-6.mp3')} /></Sequence>

      <Captions />
      <Watermark />
    </AbsoluteFill>
  );
};
