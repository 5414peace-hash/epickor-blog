/**
 * Reel 320 — Seoul Observatory Showdown ("Wrong tower, wasted night").
 * Reels 2.2 structure: 3 acts, 6 cuts, zero motion cards.
 *
 * v2 (2026-07-28): representative rejected v1 — it had no actual Lotte World
 * Tower or 63 Building footage (generic Han River B-roll instead), and one
 * reused clip had an unverified, awkward crop. Replaced with real, verified
 * photos: a KOCIS official photographer's shot of the completed Lotte World
 * Tower (Commons, CC BY-SA 2.0) and two Korea Times editorial photos of the
 * actual 63 Building — its exterior at sunset, and the new "Sky Stage"
 * holographic-orb art installation inside the just-reopened rooftop. Every
 * cut, including reused N Seoul Tower footage, was frame-checked this time,
 * not just sampled.
 */
import { AbsoluteFill } from 'remotion';
import timings from '../output/reels/320/caption-timings-v02.json';
import props from '../output/reels/320/remotion-props-v01.json';
import {
  Captions, Cut, Ons, Outro, StillCut, VideoCut, VoiceTrack, Watermark,
  social, type CaptionBeat,
} from './Batch0726Kit';

const beats = timings.beats as CaptionBeat[];
const V = 'assets/reels/320/video';
const I = 'assets/reels/320/images';
const TOTAL = props.durationInFrames; // 970

export const Reel320Composition: React.FC = () => (
  <AbsoluteFill style={{ background: social.ink }}>
    {/* 0-87 "You've picked the wrong Seoul tower before you even land." */}
    <Cut from={0} len={87}>
      <VideoCut src={`${V}/tower_a.mp4`} trim={0} from={1.02} to={1.09} />
      <Ons kicker="Trip mistake" topLine="Wrong tower," punch="wasted night" top={230} size={82} />
    </Cut>

    {/* 87-225 "Three towers. Genuinely different views, different prices, different reasons to go." */}
    <Cut from={87} len={138}>
      <VideoCut src={`${V}/tower_b.mp4`} trim={0} from={1.02} to={1.1} />
      <Ons kicker="Three towers" punch="Different everything" at={0} top={260} size={68} />
    </Cut>

    {/* 225-388 "N Seoul Tower is the romantic classic. Namsan mountain, love locks, open until 11." */}
    <Cut from={225} len={163}>
      <VideoCut src={`${V}/tower_a.mp4`} trim={280} from={1.03} to={1.1} />
      <Ons kicker="01 Namsan" topLine="The romantic classic" punch="Open till 11pm" top={230} size={68} />
    </Cut>

    {/* 388-558 "Lotte World Tower is the giant. 555 meters, glass floor, tallest in Korea." */}
    <Cut from={388} len={170}>
      <StillCut src={`${I}/lotte-tower-kocis.jpg`} from={1.0} to={1.14} drift="left" amount={30} />
      <Ons kicker="02 Lotte Tower" topLine="555 meters" punch="Glass floor" top={230} size={78} />
    </Cut>

    {/* 558-715 "And 63 Building? Its rooftop was closed for 16 years. It just reopened this year." */}
    <Cut from={558} len={157}>
      <StillCut src={`${I}/63building-exterior.jpg`} from={1.05} to={1.16} drift="right" amount={26} />
      <Ons kicker="03 63 Building" topLine="Closed 16 years" punch="Just reopened" top={230} size={68} />
    </Cut>

    {/* 715-970 "Want romance, go Namsan... Save this before you pick." + outro */}
    <Cut from={715} len={255}>
      <StillCut src={`${I}/63building-skystage.jpg`} from={1.0} to={1.08} drift="left" amount={18} />
      <Outro hook="Before you land" sub="Full comparison table on epickor.com" />
    </Cut>

    <VoiceTrack slug="320" segments={props.audioSegments} />
    <Captions beats={beats} />
    <Watermark />
  </AbsoluteFill>
);
