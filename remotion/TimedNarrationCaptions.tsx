import { interpolate, useCurrentFrame } from 'remotion';

export type TimedCaptionBeat = {
  text: string;
  startFrame: number;
  endFrame: number;
};

export function TimedNarrationCaptions({ beats, accent, light = false }: { beats: TimedCaptionBeat[]; accent: string; light?: boolean }) {
  const frame = useCurrentFrame();
  const active = beats.find((beat) => frame >= beat.startFrame && frame <= beat.endFrame);
  if (!active) return null;
  const opacity = interpolate(frame, [active.startFrame, active.startFrame + 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      data-caption-safe-zone="instagram-reels"
      style={{
        position: 'absolute', zIndex: 120, left: 76, right: 76, bottom: 410,
        minHeight: 92, boxSizing: 'border-box', display: 'grid', placeItems: 'center',
        padding: '17px 28px 19px', borderRadius: 14,
        border: `2px solid ${light ? 'rgba(23,19,16,.18)' : `${accent}99`}`,
        borderLeft: `8px solid ${accent}`,
        background: light ? 'rgba(255,250,242,.94)' : 'rgba(12,11,10,.88)',
        color: light ? '#171310' : '#fffaf0', boxShadow: '0 14px 40px rgba(0,0,0,.28)',
        fontFamily: "Arial, 'Helvetica Neue', sans-serif", fontSize: 36, fontWeight: 900,
        lineHeight: 1.13, letterSpacing: -0.25, textAlign: 'center', textWrap: 'balance', opacity,
      }}
    >
      {active.text}
    </div>
  );
}
