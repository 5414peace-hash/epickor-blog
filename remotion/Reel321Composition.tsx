/**
 * Reel 321 — Korean Fried Chicken Brands Compared ("You've been ordering wrong").
 * Reels 2.2 structure: 3 acts, 6 cuts, zero motion cards.
 *
 * v2 (2026-07-28): representative rejected v1 — the BHC/BBQ/Kyochon cuts used
 * generic fried-chicken stock with no actual brand identity. Replaced with
 * real, verified branded photos: BHC's actual "Soy Garlic King" product
 * launch (Korea Times editorial photo), bb.q Chicken's own official bucket
 * photo, and a real Kyochon photo showing the "교촌시즈닝" seasoning packet
 * and honeycomb logo (Commons, CC BY-SA 4.0).
 *
 * v3 (2026-07-28): representative round 2 -
 *  - "Kyochon" was still mispronounced as "Gyo-chon" sounding off; switched
 *    the TTS spelling to "Kyo-chon" (hyphenated) instead, re-aligned.
 *  - ONS headline text sized up 1.5x; copy shortened to short punch words
 *    per cut, fuller clause moved into `sub` (fixed small size) to avoid
 *    the text-overflow bug from the first pass.
 *  - added BGM (The Polarity - Son of a Beach, representative's own library).
 */
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from 'remotion';
import timings from '../output/reels/321/caption-timings-v02.json';
import props from '../output/reels/321/remotion-props-v01.json';
import {
  Captions, Cut, Ons, Outro, StillCut, VideoCut, VoiceTrack, Watermark,
  social, type CaptionBeat,
} from './Batch0726Kit';

const beats = timings.beats as CaptionBeat[];
const V = 'assets/reels/321/video';
const I = 'assets/reels/321/images';
const TOTAL = props.durationInFrames; // 833

function Bgm() {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [TOTAL - 45, TOTAL], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <Audio src={staticFile('assets/reels/321/audio/bgm-son-of-a-beach.mp3')} volume={0.11 * Math.min(fadeIn, fadeOut)} />;
}

export const Reel321Composition: React.FC = () => (
  <AbsoluteFill style={{ background: social.ink }}>
    {/* 0-79 "You've been ordering the wrong Korean fried chicken." */}
    <Cut from={0} len={79}>
      <VideoCut src={`${V}/reveal.mp4`} trim={10} from={1.02} to={1.1} />
      <Ons kicker="Myth check" topLine="YOU'VE BEEN" punch="WRONG" sub="Ordering the wrong Korean fried chicken" top={210} size={117} />
    </Cut>

    {/* 79-172 "BHC, BBQ, and Kyochon are not the same chicken." */}
    <Cut from={79} len={93}>
      <VideoCut src={`${V}/handspick.mp4`} trim={15} from={1.03} to={1.1} />
      <Ons kicker="Three brands" punch="NOT THE SAME" sub="BHC, BBQ, and Kyochon are different chicken" at={0} top={260} size={135} />
    </Cut>

    {/* 172-297 "BHC is the volume play — bigger portions, lower price, everywhere you look." */}
    <Cut from={172} len={125}>
      <StillCut src={`${I}/bhc-branded.jpg`} from={1.0} to={1.12} drift="left" amount={30} />
      <Ons kicker="01 BHC" topLine="VOLUME PLAY" punch="BIGGER CHEAPER" sub="Bigger portions, lower price, everywhere" top={210} size={108} />
    </Cut>

    {/* 297-446 "BBQ's whole thing is the olive oil. Lighter, less greasy..." */}
    <Cut from={297} len={149}>
      <StillCut src={`${I}/bbq-branded.jpg`} from={1.08} to={1.0} drift="right" amount={24} />
      {/* The source promo image has its own baked-in "PUNCH!" typography that
          collided with the ONS headline (representative caught this). A scrim
          behind the text block keeps our copy readable over it. */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 160, height: 480, zIndex: 55, background: 'linear-gradient(180deg, rgba(6,10,12,.15) 0%, rgba(6,10,12,.82) 28%, rgba(6,10,12,.82) 78%, rgba(6,10,12,0) 100%)' }} />
      <Ons kicker="02 BBQ" topLine="WHOLE THING?" punch="OLIVE OIL" sub="Lighter, less greasy — and they'll tell you" top={210} size={120} />
    </Cut>

    {/* 446-575 "Kyo-chon basically invented the soy garlic wave everyone else is still copying." */}
    <Cut from={446} len={129}>
      <StillCut src={`${I}/kyochon-branded.jpg`} from={1.0} to={1.1} drift="left" amount={26} position="center 35%" />
      <Ons kicker="03 Kyochon" topLine="STARTED IT ALL" punch="SOY GARLIC" sub="Kyo-chon basically invented this wave" top={210} size={120} />
    </Cut>

    {/* 575-833 "So: cheap and filling go BHC... Save this before your next order." + outro */}
    <Cut from={575} len={258}>
      <VideoCut src={`${V}/sharedbowls.mp4`} trim={20} from={1.02} to={1.1} />
      <Outro hook="There's more" sub="Full brand breakdown on epickor.com" />
    </Cut>

    <VoiceTrack slug="321" segments={props.audioSegments} />
    <Bgm />
    <Captions beats={beats} />
    <Watermark />
  </AbsoluteFill>
);
