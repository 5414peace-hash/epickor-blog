import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import type { ReelProps } from './types';
import { Reel296PosterFrame } from './Reel296PosterFrames';
import { TimedNarrationCaptions } from './TimedNarrationCaptions';
import captionTimings from '../output/reels/2026-07-13_296/caption-timings-v02.json';

const sceneStarts = [0, 126, 359, 479, 590, 800, 950];
const sceneDurations = [126, 233, 120, 111, 210, 150, 130];

const captions: Array<Array<{ at: number; text: string }>> = [
  [
    { at: 0, text: "ONE OF SEOUL'S PRETTIEST HANOK LANES" },
    { at: 61, text: 'CAN FINE TOURISTS AFTER FIVE' },
  ],
  [
    { at: 0, text: 'THE RULE IS SPECIFIC' },
    { at: 93, text: 'BUKCHON-RO 11-GIL RED ZONE' },
    { at: 166, text: '5 PM TO 10 THE NEXT MORNING' },
  ],
  [
    { at: 0, text: 'THE FINE IS 100,000 WON' },
    { at: 62, text: "THIS ISN'T A MOVIE SET" },
  ],
  [
    { at: 0, text: 'PEOPLE LIVE HERE' },
    { at: 51, text: 'QUIET HOURS BELONG TO THE NEIGHBORHOOD' },
  ],
  [
    { at: 0, text: 'VISIT THE RED ZONE FROM TEN TO FIVE' },
    { at: 70, text: 'LEAVE BEFORE THE RESTRICTION STARTS' },
    { at: 142, text: 'AFTER FIVE, CHOOSE AN OFFICIAL PROGRAM' },
  ],
  [
    { at: 0, text: 'OR AN EVENING-FRIENDLY PART OF JONGNO' },
    { at: 76, text: "PRETTY DOESN'T MEAN PUBLIC" },
  ],
  [
    { at: 0, text: 'SAVE THIS BEFORE SEOUL' },
    { at: 62, text: 'FULL HANOK GUIDE AT EPICKOR.COM' },
  ],
];

function PhraseCaption({ sceneNumber }: { sceneNumber: number }) {
  const frame = useCurrentFrame();
  const beats = captions[sceneNumber - 1];
  let active = beats[0];
  for (const beat of beats) {
    if (frame >= beat.at - 5) active = beat;
  }
  const opacity = interpolate(frame, [Math.max(0, active.at - 5), active.at + 7], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const high = sceneNumber === 5 || sceneNumber === 7;
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 60,
        left: 58,
        right: 58,
        bottom: high ? 245 : 78,
        padding: '17px 22px 19px',
        background: 'rgba(10,9,8,.78)',
        border: '1px solid rgba(243,235,220,.28)',
        color: '#f3ebdc',
        fontFamily: "Arial, 'Helvetica Neue', sans-serif",
        fontWeight: 900,
        fontSize: 31,
        lineHeight: 1.12,
        letterSpacing: 0.2,
        textAlign: 'center',
        opacity,
        transform: `translateY(${(1 - opacity) * 10}px)`,
        boxShadow: '0 12px 30px rgba(0,0,0,.2)',
      }}
    >
      {active.text}
    </div>
  );
}

export function Reel296V01Composition(props: ReelProps) {
  return (
    <AbsoluteFill style={{ background: '#11100f' }}>
      {sceneStarts.map((startFrame, index) => (
        <Sequence key={index} from={startFrame} durationInFrames={sceneDurations[index]} premountFor={30}>
          <Reel296PosterFrame sceneNumber={index + 1} motion />
          <PhraseCaption sceneNumber={index + 1} />
        </Sequence>
      ))}
      {(props.audioSegments || []).map((segment) => (
        <Sequence key={segment.part} from={segment.startFrame} durationInFrames={segment.durationFrames} premountFor={15}>
          <Audio src={staticFile(segment.staticFilePath)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}

export function Reel296V02Composition(props: ReelProps) {
  return (
    <AbsoluteFill style={{ background: '#11100f' }}>
      <style>{`
        .reel296-editorial-caption { display: none !important; }
        .reel296-low-watermark { top: 60px !important; bottom: auto !important; }
        .reel296-scene2-copy { top: 1070px !important; transform: scale(.9); transform-origin: top left; width: 1080px; }
        .reel296-low-footer { display: none !important; }
        .reel296-plan-card { bottom: 565px !important; }
        .reel296-scene6-options { bottom: 565px !important; }
        .reel296-outro-copy { top: 715px !important; }
      `}</style>
      {sceneStarts.map((startFrame, index) => (
        <Sequence key={index} from={startFrame} durationInFrames={sceneDurations[index]} premountFor={30}>
          <Reel296PosterFrame sceneNumber={index + 1} motion />
        </Sequence>
      ))}
      {(props.audioSegments || []).map((segment) => (
        <Sequence key={segment.part} from={segment.startFrame} durationInFrames={segment.durationFrames} premountFor={15}>
          <Audio src={staticFile(segment.staticFilePath)} />
        </Sequence>
      ))}
      <TimedNarrationCaptions beats={captionTimings.beats} accent="#dfa35b" />
    </AbsoluteFill>
  );
}
