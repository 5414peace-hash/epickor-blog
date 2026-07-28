/**
 * Reel 321 — Korean Fried Chicken Brands Compared ("You've been ordering wrong").
 * Reels 2.2 structure: 3 acts, 6 cuts, zero motion cards. Decision hook archetype.
 */
import { AbsoluteFill } from 'remotion';
import timings from '../output/reels/321/caption-timings-v02.json';
import props from '../output/reels/321/remotion-props-v01.json';
import {
  Captions, Cut, Ons, Outro, VideoCut, VoiceTrack, Watermark,
  social, type CaptionBeat,
} from './Batch0726Kit';

const beats = timings.beats as CaptionBeat[];
const V = 'assets/reels/321/video';
const TOTAL = props.durationInFrames; // 840

export const Reel321Composition: React.FC = () => (
  <AbsoluteFill style={{ background: social.ink }}>
    {/* 0-79 "You've been ordering the wrong Korean fried chicken." */}
    <Cut from={0} len={79}>
      <VideoCut src={`${V}/reveal.mp4`} trim={10} from={1.02} to={1.1} />
      <Ons kicker="Myth check" topLine="You've been" punch="ordering wrong" top={230} size={78} />
    </Cut>

    {/* 79-172 "BHC, BBQ, and Kyochon are not the same chicken." */}
    <Cut from={79} len={93}>
      <VideoCut src={`${V}/handspick.mp4`} trim={15} from={1.03} to={1.1} />
      <Ons kicker="Three brands" punch="Not the same" at={0} top={260} size={90} />
    </Cut>

    {/* 172-297 "BHC is the volume play — bigger portions, lower price, everywhere you look." */}
    <Cut from={172} len={125}>
      <VideoCut src={`${V}/wingspile.mp4`} trim={5} from={1.02} to={1.1} />
      <Ons kicker="01 BHC" topLine="The volume play" punch="Bigger. Cheaper." top={230} size={72} />
    </Cut>

    {/* 297-446 "BBQ's whole thing is the olive oil. Lighter, less greasy..." */}
    <Cut from={297} len={149}>
      <VideoCut src={`${V}/seasoning.mp4`} trim={40} from={1.02} to={1.1} />
      <Ons kicker="02 BBQ" topLine="Their whole thing?" punch="Olive oil" top={230} size={80} />
    </Cut>

    {/* 446-582 "Kyochon basically invented the soy garlic wave everyone else is still copying." */}
    <Cut from={446} len={136}>
      <VideoCut src={`${V}/glossysoy.mp4`} trim={20} from={1.03} to={1.11} />
      <Ons kicker="03 Kyochon" topLine="Started it all" punch="Soy garlic" top={230} size={80} />
    </Cut>

    {/* 582-840 "So: cheap and filling go BHC... Save this before your next order." + outro */}
    <Cut from={582} len={258}>
      <VideoCut src={`${V}/sharedbowls.mp4`} trim={20} from={1.02} to={1.1} />
      <Outro hook="There's more" sub="Full brand breakdown on epickor.com" />
    </Cut>

    <VoiceTrack slug="321" segments={props.audioSegments} />
    <Captions beats={beats} />
    <Watermark />
  </AbsoluteFill>
);
