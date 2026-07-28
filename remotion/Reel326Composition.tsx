/**
 * Reel 326 — Korean Spice Levels ("Everyone's scared of this noodle").
 * Built on the Reels 2.2 Batch0726Kit: 3 acts, 6 cuts, zero motion cards.
 * The payoff is a visual reveal (real Scoville numbers on screen over real
 * food footage), not a card. 6 real Pexels vertical clips, no stills.
 *
 * Cut boundaries = caption-timings-v02.json segment starts (forced alignment).
 */
import { AbsoluteFill, staticFile } from 'remotion';
import timings from '../output/reels/326/caption-timings-v02.json';
import props from '../output/reels/326/remotion-props-v01.json';
import {
  Captions, Cut, Ons, Outro, VideoCut, VoiceTrack, Watermark, Kicker,
  social, type CaptionBeat,
} from './Batch0726Kit';

const beats = timings.beats as CaptionBeat[];
const V = 'assets/reels/326/video';
const TOTAL = props.durationInFrames; // 944

export const Reel326Composition: React.FC = () => (
  <AbsoluteFill style={{ background: social.ink }}>
    {/* 0-140 "Everyone's scared of this noodle. Turns out, it's barely hotter than a jalapeno." */}
    <Cut from={0} len={140}>
      <VideoCut src={`${V}/noodles.mp4`} trim={20} from={1.03} to={1.11} />
      <Ons kicker="Spice myth" topLine="Everyone's scared" punch="of this noodle" top={230} size={100} />
    </Cut>

    {/* 140-324 "The original fire noodle rates about 4,400 Scoville units. A jalapeno goes up to 8,000." */}
    <Cut from={140} len={184}>
      <VideoCut src={`${V}/chilipile.mp4`} trim={10} from={1.02} to={1.1} />
      <Ons kicker="The actual number" topLine="4,400 Scoville" punch="A jalapeno? 8,000" top={230} size={90} />
    </Cut>

    {/* 324-504 "The pepper Koreans actually reach for? Cheongyang chili. Five times a jalapeno, sliced into everyday dishes." */}
    <Cut from={324} len={180}>
      <VideoCut src={`${V}/chiliglass.mp4`} trim={15} from={1.02} to={1.1} />
      <Ons kicker="The real heat" topLine="Cheongyang chili" punch="5x jalapenos" top={230} size={62} />
    </Cut>

    {/* 504-635 "And that thick red paste that looks terrifying? Usually milder than Sriracha." */}
    <Cut from={504} len={131}>
      <VideoCut src={`${V}/saucestir.mp4`} trim={10} from={1.03} to={1.12} />
      <Ons kicker="Plot twist" topLine="That red paste?" punch="Milder than Sriracha" top={230} size={82} />
    </Cut>

    {/* 635-748 'Next time, just say "an-mapge" — not spicy — before you order.' */}
    <Cut from={635} len={113}>
      <VideoCut src={`${V}/cuttingboard.mp4`} trim={40} from={1.02} to={1.08} />
      <Kicker at={4}>Say this</Kicker>
      <div style={{
        position: 'absolute', left: 54, right: 104, top: 340, zIndex: 60,
        color: social.ivory, font: '900 84px/1 Impact, sans-serif', letterSpacing: -1,
        textShadow: '0 4px 22px rgba(0,0,0,.75)',
      }}>&ldquo;An-mapge&rdquo;</div>
    </Cut>

    {/* 748-944 "Stop fearing the noodle. Watch the little pepper on your side plate. Save this..." + outro */}
    <Cut from={748} len={196}>
      <VideoCut src={`${V}/banchan.mp4`} trim={30} from={1.04} to={1.14} />
      <Outro hook="Don't order blind" sub="Full Scoville breakdown on epickor.com" />
    </Cut>

    <VoiceTrack slug="326" segments={props.audioSegments} />
    <Captions beats={beats} />
    <Watermark />
  </AbsoluteFill>
);
