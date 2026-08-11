/**
 * Reel 326 — Korean Spice Levels ("Everyone's scared of this noodle").
 * Built on the Reels 2.2 Batch0726Kit: 3 acts, 6 cuts, zero motion cards.
 *
 * v2 (2026-07-28): representative rejected v1 — the chili/paste footage was
 * generic international stock with no visible Korean context. Replaced with
 * real, verified Korean-specific stills: actual Buldak product (Commons,
 * CC BY-SA 4.0), a KOGL-licensed official Korean-agency gochujang photo, and
 * real Cheongyang chili photos (CC0 / CC BY-SA 3.0).
 *
 * v3 (2026-07-28): representative round 2 -
 *  - "an-mapge" was mispronounced; respelled to "an-map-gae" for TTS, re-aligned.
 *  - swapped the low-res greenhouse still for a high-res real Korean chili
 *    harvest photo (Goesan-gun farm, Pexels, verified Korea-specific).
 *  - ONS headline text sized up 1.5x; copy shortened to short punch words per
 *    cut with the fuller clause moved into the `sub` line (fixed small size,
 *    no overflow risk) to avoid repeating the text-overflow bug.
 *  - added BGM (Out of Flux - CHONKLAP, representative's own library).
 *
 * Cut boundaries = caption-timings-v02.json segment starts (forced alignment).
 */
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from 'remotion';
import timings from '../output/reels/2026-07-28_326/caption-timings-v02.json';
import props from '../output/reels/2026-07-28_326/remotion-props-v01.json';
import {
  Captions, Cut, Ons, Outro, StillCut, VideoCut, VoiceTrack, Watermark, Kicker,
  social, type CaptionBeat,
} from './Batch0726Kit';

const beats = timings.beats as CaptionBeat[];
const V = 'assets/reels/326/video';
const I = 'assets/reels/326/images';
const TOTAL = props.durationInFrames; // 953

function Bgm() {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [TOTAL - 45, TOTAL], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <Audio src={staticFile('assets/reels/326/audio/bgm-chonklap.mp3')} volume={0.11 * Math.min(fadeIn, fadeOut)} />;
}

export const Reel326Composition: React.FC = () => (
  <AbsoluteFill style={{ background: social.ink }}>
    {/* 0-140 "Everyone's scared of this noodle. Turns out, it's barely hotter than a jalapeno." */}
    <Cut from={0} len={140}>
      <StillCut src={`${I}/buldak-branded.png`} from={1.0} to={1.1} drift="left" amount={30} position="center 30%" />
      <Ons kicker="Spice myth" topLine="EVERYONE'S" punch="SCARED" sub="...of this noodle. It's barely hotter than a jalapeno." top={210} size={150} />
    </Cut>

    {/* 140-324 "The original fire noodle rates about 4,400 Scoville units. A jalapeno goes up to 8,000." */}
    <Cut from={140} len={184}>
      <StillCut src={`${I}/goesan-chili-farm.jpg`} from={1.02} to={1.14} drift="right" amount={36} />
      <Ons kicker="The actual number" topLine="4,400" punch="VS 8,000" sub="Scoville units: Buldak vs. one jalapeno" top={210} size={135} />
    </Cut>

    {/* 324-504 "The pepper Koreans actually reach for? Cheongyang chili. Five times a jalapeno, sliced into everyday dishes." */}
    <Cut from={324} len={180}>
      <StillCut src={`${I}/cheongyang-chili.jpg`} from={1.0} to={1.13} drift="left" amount={34} />
      <Ons kicker="The real heat" topLine="CHEONGYANG" punch="5X HOTTER" sub="The chili Koreans actually reach for" top={210} size={140} />
    </Cut>

    {/* 504-635 "And that thick red paste that looks terrifying? Usually milder than Sriracha." */}
    <Cut from={504} len={131}>
      <StillCut src={`${I}/gochujang-official.jpg`} from={1.1} to={1.0} drift="right" amount={26} />
      <Ons kicker="Plot twist" topLine="RED PASTE?" punch="SO MILD" sub="Usually milder than Sriracha" top={210} size={123} />
    </Cut>

    {/* 635-757 'Next time, just say "an-map-gae" — not spicy — before you order.' */}
    <Cut from={635} len={122}>
      <VideoCut src={`${V}/cuttingboard.mp4`} trim={40} from={1.02} to={1.08} />
      <Kicker at={4}>Say this</Kicker>
      <div style={{
        position: 'absolute', left: 54, right: 104, top: 320, zIndex: 60,
        color: social.ivory, font: '900 126px/1.05 Impact, sans-serif', letterSpacing: -1,
        textShadow: '0 4px 22px rgba(0,0,0,.75)',
      }}>&ldquo;An-map-gae&rdquo;</div>
    </Cut>

    {/* 757-953 "Stop fearing the noodle. Watch the little pepper on your side plate. Save this..." + outro */}
    <Cut from={757} len={196}>
      <VideoCut src={`${V}/banchan.mp4`} trim={30} from={1.04} to={1.14} />
      <Outro hook="Don't order blind" sub="Full Scoville breakdown on epickor.com" />
    </Cut>

    <VoiceTrack slug="326" segments={props.audioSegments} />
    <Bgm />
    <Captions beats={beats} />
    <Watermark />
  </AbsoluteFill>
);
