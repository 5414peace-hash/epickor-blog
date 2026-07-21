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
import captions311 from '../output/reels/311/caption-timings-v02.json';

const display = "'Segoe UI Black', 'Segoe UI', Impact, sans-serif";
const body = "'Segoe UI', Arial, 'Helvetica Neue', sans-serif";

// Bunsik Heat palette
const heat = {
  red: '#d24437',
  ivory: '#f4efe4',
  ink: '#141312',
  white: '#ffffff',
};

type CaptionBeat = { text: string; startFrame: number; endFrame: number };

const beats: CaptionBeat[] = ((captions311 as { beats?: CaptionBeat[] }).beats ??
  (captions311 as unknown as CaptionBeat[])) as CaptionBeat[];

// Cut boundaries in frames at 30fps. Durations come from the narration, not a template.
const CUTS = [
  { n: 1, from: 0, len: 120 },
  { n: 2, from: 120, len: 120 },
  { n: 3, from: 240, len: 135 },
  { n: 4, from: 375, len: 120 },
  { n: 5, from: 495, len: 180 },
  { n: 6, from: 675, len: 150 },
  { n: 7, from: 825, len: 90 },
];

function clamp(frame: number, input: number[], output: number[]) {
  return interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

/** Full-bleed video with a slow push so the frame never sits static. */
function VideoCut({
  src,
  trim = 0,
  position = 'center',
  scale = 1.06,
}: {
  src: string;
  trim?: number;
  position?: string;
  scale?: number;
}) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = clamp(frame, [0, Math.max(1, durationInFrames)], [1.01, scale]);
  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile(src)}
        trimBefore={trim}
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: position,
          transform: `scale(${zoom})`,
        }}
      />
    </AbsoluteFill>
  );
}

/** Still with a restrained push-in. Never more than two of these run back to back. */
function StillCut({
  src,
  position = 'center',
  scale = 1.1,
}: {
  src: string;
  position?: string;
  scale?: number;
}) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = clamp(frame, [0, Math.max(1, durationInFrames)], [1.0, scale]);
  return (
    <AbsoluteFill>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: position,
          transform: `scale(${zoom})`,
        }}
      />
    </AbsoluteFill>
  );
}

/**
 * ONS. Shadow only, never a scrim — a full-width gradient dulls the footage and
 * leaves a hard horizontal edge across the frame.
 */
function Ons({
  lines,
  at = 8,
  size = 104,
  top = 300,
  rule = true,
}: {
  lines: string[];
  at?: number;
  size?: number;
  top?: number;
  rule?: boolean;
}) {
  const frame = useCurrentFrame();
  const p = clamp(frame, [at, at + 14], [0, 1]);
  const shadow = '0 3px 18px rgba(0,0,0,.92), 0 1px 4px rgba(0,0,0,.8)';
  return (
    <div style={{ position: 'absolute', left: 68, right: 68, top, zIndex: 60 }}>
      {rule && (
        <div
          style={{
            width: 128,
            height: 10,
            background: heat.red,
            marginBottom: 26,
            transformOrigin: 'left center',
            transform: `scaleX(${p})`,
          }}
        />
      )}
      {lines.map((line, i) => (
        <div
          key={line}
          style={{
            color: heat.white,
            font: `900 ${size}px/1.02 ${display}`,
            letterSpacing: -2.5,
            textTransform: 'uppercase',
            textShadow: shadow,
            clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
            transform: `translateY(${(1 - p) * 24}px)`,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
}

/** Outro CTA: hook line from the rotating bank plus the URL as a solid red chip. */
function OutroCta({ hook }: { hook: string[] }) {
  const frame = useCurrentFrame();
  const p = clamp(frame, [6, 22], [0, 1]);
  const chip = clamp(frame, [26, 40], [0, 1]);
  return (
    <>
      <Ons lines={hook} at={6} size={96} top={330} />
      <div
        style={{
          position: 'absolute',
          left: 68,
          top: 620,
          zIndex: 62,
          background: heat.red,
          padding: '20px 30px 24px',
          transformOrigin: 'left center',
          transform: `scaleX(${chip})`,
          opacity: p,
          boxShadow: '0 18px 48px rgba(0,0,0,.4)',
        }}
      >
        <span
          style={{
            color: heat.white,
            font: `900 74px/1 ${display}`,
            letterSpacing: -1.5,
          }}
        >
          epickor.com
        </span>
      </div>
    </>
  );
}

/** Narration captions. Single lane, below every ONS, never overlapping it. */
function Captions() {
  const frame = useCurrentFrame();
  const active = beats.find((b) => frame >= b.startFrame && frame <= b.endFrame);
  if (!active) return null;
  const entry = clamp(frame, [active.startFrame, active.startFrame + 6], [0, 1]);
  return (
    <div
      data-caption-safe-zone="instagram-reels"
      style={{
        position: 'absolute',
        left: 74,
        right: 74,
        bottom: 410,
        zIndex: 150,
        padding: '20px 28px 22px',
        boxSizing: 'border-box',
        display: 'grid',
        placeItems: 'center',
        borderRadius: 14,
        background: 'rgba(10,11,13,.84)',
        border: '1px solid rgba(255,255,255,.18)',
        color: '#fffaf0',
        font: `700 40px/1.16 ${body}`,
        letterSpacing: -.3,
        textAlign: 'center',
        textWrap: 'balance',
        opacity: entry,
        transform: `translateY(${(1 - entry) * 16}px)`,
      }}
    >
      {active.text}
    </div>
  );
}

/** Cross-cut wipe. 21 frames so the incoming media is never transparent over the outgoing cut. */
function Wipe() {
  const frame = useCurrentFrame();
  const p = clamp(frame, [0, 21], [0, 1]);
  const cover = p < 0.5 ? clamp(p, [0, 0.5], [0, 100]) : clamp(p, [0.5, 1], [100, 0]);
  const side = p < 0.5 ? 'right' : 'left';
  return (
    <AbsoluteFill style={{ zIndex: 120, pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: heat.ink,
          clipPath: side === 'right' ? `inset(0 ${100 - cover}% 0 0)` : `inset(0 0 0 ${100 - cover}%)`,
        }}
      />
    </AbsoluteFill>
  );
}

function Watermark() {
  return (
    <div
      style={{
        position: 'absolute',
        right: 44,
        bottom: 44,
        zIndex: 90,
        color: 'rgba(255,255,255,.72)',
        font: `900 22px/1 ${body}`,
        letterSpacing: 3.4,
        textTransform: 'uppercase',
        textShadow: '0 2px 10px rgba(0,0,0,.8)',
      }}
    >
      epickor.com
    </div>
  );
}

function Cut({ index, children }: { index: number; children: ReactNode }) {
  const cut = CUTS[index];
  return (
    <Sequence from={cut.from} durationInFrames={cut.len}>
      {children}
    </Sequence>
  );
}

export const Reel311Composition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: heat.ink }}>
      {/* 1 — hook: hotteok on a street griddle, real cooking motion */}
      <Cut index={0}>
        <VideoCut src="assets/reels/311/video/cut1-hotteok.mp4" trim={60} position="center 55%" />
        <Ons lines={['KOREAN', 'STREET FOOD']} top={330} />
      </Cut>

      {/* 2 — subject: the tteokbokki everyone knows */}
      <Cut index={1}>
        <StillCut src="assets/reels/311/image/cut2-classic.png" position="center 60%" />
        <Ons lines={['YOU KNOW', 'THIS ONE']} top={250} />
      </Cut>

      {/* 3 — the bunsik family */}
      <Cut index={2}>
        <VideoCut src="assets/reels/311/video/cut3-eomuk.mp4" trim={30} />
        <Ons lines={['IT NEVER', 'EATS ALONE']} top={250} size={98} />
      </Cut>

      {/* 4 — escalation: rabokki */}
      <Cut index={3}>
        <StillCut src="assets/reels/311/image/cut4-rabokki.png" />
        <Ons lines={['THEN IT', 'GOT BIGGER']} top={250} size={98} />
      </Cut>

      {/* 5 — THE REVEAL: no red anywhere in frame */}
      <Cut index={4}>
        <StillCut src="assets/reels/311/image/cut5-soy.png" scale={1.14} />
        <Ons lines={['THE FIRST ONE', 'HAD NO CHILI']} at={9} top={250} size={88} />
      </Cut>

      {/* 6 — payoff at a real market */}
      <Cut index={5}>
        <VideoCut src="assets/reels/311/video/cut6-market.mp4" trim={45} />
        <Ons lines={['SIX VERSIONS.', 'ONE RICE CAKE.']} top={300} size={92} />
      </Cut>

      {/* 7 — outro, silent */}
      <Cut index={6}>
        <VideoCut src="assets/reels/311/video/cut7-beomsan.mp4" trim={110} scale={1.04} />
        <OutroCta hook={["DON'T ORDER", 'BLIND']} />
      </Cut>

      {/* Hard cuts. Each Sequence fully covers the frame, so there is no transparency
          gap to flash through. A 21-frame wipe on all six boundaries would have spent
          4.2s of a 30.5s Reel on transitions and read as a harsh black sweep over food. */}

      {/* narration */}
      <Sequence from={6}>
        <Audio src={staticFile('assets/reels/311/audio/voice-part-1.mp3')} />
      </Sequence>
      <Sequence from={240}>
        <Audio src={staticFile('assets/reels/311/audio/voice-part-2.mp3')} />
      </Sequence>
      <Sequence from={510}>
        <Audio src={staticFile('assets/reels/311/audio/voice-part-3.mp3')} />
      </Sequence>
      <Sequence from={690}>
        <Audio src={staticFile('assets/reels/311/audio/voice-part-4.mp3')} />
      </Sequence>

      <Captions />
      <Watermark />
    </AbsoluteFill>
  );
};
