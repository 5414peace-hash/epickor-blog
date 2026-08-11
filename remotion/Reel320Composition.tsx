/**
 * Reel 320 — Seoul Observatory Showdown ("Wrong tower, wasted night").
 * Reels 2.2 structure, zero motion cards.
 *
 * v2 (2026-07-28): representative rejected v1 — no actual Lotte World Tower
 * or 63 Building footage (generic Han River B-roll instead).
 *
 * v3 (2026-07-28): representative round 2 -
 *  - "three towers" line now shows all 3 towers in a quick 짠짠짠 reveal
 *    (3 sub-cuts under one persistent headline) instead of one static clip.
 *  - Lotte Tower still wasn't visible: the source KOCIS photo is a wide
 *    landscape with the tower off-center-left; StillCut's auto cover-crop
 *    was cutting it out of frame. Replaced with a manually pre-cropped
 *    derivative (ffmpeg crop centered exactly on the tower) so it stays in
 *    frame regardless of drift.
 *  - Roughly doubled the material: added a second real Lotte Tower photo
 *    (Commons, Teddy Cross) and a second/third real 63 Building angle
 *    (Commons, Aleksandr Zykov "view from" shot) alongside the existing two
 *    Korea Times photos, splitting the Lotte/63 fact-cuts into two sub-cuts
 *    each instead of one.
 *  - ONS headline sized up 1.5x with shortened punch copy + `sub` detail.
 *  - added BGM (Monument Music - Chapter Two, representative's own library).
 */
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from 'remotion';
import timings from '../output/reels/2026-07-28_320/caption-timings-v02.json';
import props from '../output/reels/2026-07-28_320/remotion-props-v01.json';
import {
  Captions, Cut, Ons, Outro, StillCut, VideoCut, VoiceTrack, Watermark,
  social, type CaptionBeat,
} from './Batch0726Kit';

const beats = timings.beats as CaptionBeat[];
const V = 'assets/reels/320/video';
const I = 'assets/reels/320/images';
const TOTAL = props.durationInFrames; // 970

function Bgm() {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [TOTAL - 45, TOTAL], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <Audio src={staticFile('assets/reels/320/audio/bgm-chapter-two.mp3')} volume={0.11 * Math.min(fadeIn, fadeOut)} />;
}

export const Reel320Composition: React.FC = () => (
  <AbsoluteFill style={{ background: social.ink }}>
    {/* 0-87 "You've picked the wrong Seoul tower before you even land." */}
    <Cut from={0} len={87}>
      <VideoCut src={`${V}/tower_a.mp4`} trim={0} from={1.02} to={1.09} />
      <Ons kicker="Trip mistake" topLine="WRONG TOWER," punch="WASTED NIGHT" sub="Before you even land in Seoul" top={210} size={123} />
    </Cut>

    {/* 87-225 "Three towers. Genuinely different views, different prices, different reasons to go."
        짠짠짠 reveal: 3 quick sub-cuts (Namsan / Lotte / 63) under one persistent headline. */}
    <Cut from={87} len={46}>
      <VideoCut src={`${V}/tower_b.mp4`} trim={0} from={1.0} to={1.02} />
    </Cut>
    <Cut from={133} len={46}>
      <StillCut src={`${I}/lotte-tower-crop-final.jpg`} from={1.0} to={1.03} drift="left" amount={10} />
    </Cut>
    <Cut from={179} len={46}>
      <StillCut src={`${I}/63building-exterior.jpg`} from={1.0} to={1.03} drift="right" amount={10} />
    </Cut>
    <Cut from={87} len={138}>
      <Ons kicker="Three towers" punch="ALL UNIQUE" sub="Different views, different prices, different reasons to go" at={0} top={260} size={135} />
    </Cut>

    {/* 225-388 "N Seoul Tower is the romantic classic. Namsan mountain, love locks, open until 11." */}
    <Cut from={225} len={163}>
      <VideoCut src={`${V}/tower_a.mp4`} trim={280} from={1.03} to={1.1} />
      <Ons kicker="01 Namsan" topLine="ROMANTIC CLASSIC" punch="OPEN TIL 11PM" sub="Namsan mountain, love locks, open latest of the three" top={210} size={96} />
    </Cut>

    {/* 388-558 "Lotte World Tower is the giant. 555 meters, glass floor, tallest in Korea." — 2 sub-cuts */}
    <Cut from={388} len={85}>
      <StillCut src={`${I}/lotte-tower-crop-final.jpg`} from={1.0} to={1.06} drift="left" amount={16} />
      <Ons kicker="02 Lotte Tower" topLine="555 METERS" punch="THE GIANT" sub="Tallest building in Korea" top={210} size={117} />
    </Cut>
    <Cut from={473} len={85}>
      <StillCut src={`${I}/lotte-tower-2.jpg`} from={1.0} to={1.08} drift="right" amount={20} />
      <Ons kicker="02 Lotte Tower" punch="GLASS FLOOR" sub="Seoul Sky, floors 117 to 123" at={0} top={280} size={130} />
    </Cut>

    {/* 558-715 "And 63 Building? Its rooftop was closed for 16 years. It just reopened this year." — 2 sub-cuts */}
    <Cut from={558} len={78}>
      <StillCut src={`${I}/63building-exterior.jpg`} from={1.0} to={1.07} drift="left" amount={16} />
      <Ons kicker="03 63 Building" topLine="CLOSED 16 YEARS" punch="REOPENED" sub="Its rooftop just came back this year" top={210} size={100} />
    </Cut>
    <Cut from={636} len={79}>
      <StillCut src={`${I}/63building-skystage.jpg`} from={1.0} to={1.06} drift="right" amount={14} />
      <Ons kicker="03 63 Building" punch="SKY STAGE" sub="Holographic art, 100% open-air rooftop" at={0} top={280} size={120} />
    </Cut>

    {/* 715-970 "Want romance, go Namsan... Save this before you pick." + outro — 2 sub-cuts */}
    <Cut from={715} len={128}>
      <StillCut src={`${I}/63building-viewfrom.jpg`} from={1.0} to={1.1} drift="left" amount={22} />
    </Cut>
    <Cut from={843} len={127}>
      <VideoCut src={`${V}/tower_b.mp4`} trim={330} from={1.03} to={1.11} />
      <Outro hook="Before you land" sub="Full comparison table on epickor.com" />
    </Cut>

    <VoiceTrack slug="320" segments={props.audioSegments} />
    <Bgm />
    <Captions beats={beats} />
    <Watermark />
  </AbsoluteFill>
);
