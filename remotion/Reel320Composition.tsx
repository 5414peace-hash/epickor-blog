/**
 * Reel 320 — Seoul Observatory Showdown ("Wrong tower, wasted night").
 * Reels 2.2 structure: 3 acts, 6 cuts, zero motion cards. Decision hook archetype.
 *
 * Footage note: confirmed real N Seoul Tower footage (tower_a/tower_b) is used
 * for the hook, intro, and the N Seoul Tower section itself. Lotte World Tower
 * and 63 Building do not have confirmed exact-match stock footage in this pass,
 * so those two cuts use real, verified Han River/Seoul skyline footage instead
 * of risking a mislabeled building — the specific facts ride on-screen as text,
 * not as a claim that the footage shows that exact tower.
 */
import { AbsoluteFill } from 'remotion';
import timings from '../output/reels/320/caption-timings-v02.json';
import props from '../output/reels/320/remotion-props-v01.json';
import {
  Captions, Cut, Ons, Outro, VideoCut, VoiceTrack, Watermark,
  social, type CaptionBeat,
} from './Batch0726Kit';

const beats = timings.beats as CaptionBeat[];
const V = 'assets/reels/320/video';
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
      <VideoCut src={`${V}/hanriver_a.mp4`} trim={0} from={1.02} to={1.1} />
      <Ons kicker="02 Lotte Tower" topLine="555 meters" punch="Glass floor" top={230} size={78} />
    </Cut>

    {/* 558-715 "And 63 Building? Its rooftop was closed for 16 years. It just reopened this year." */}
    <Cut from={558} len={157}>
      <VideoCut src={`${V}/hanriver_b.mp4`} trim={0} from={1.02} to={1.1} />
      <Ons kicker="03 63 Building" topLine="Closed 16 years" punch="Just reopened" top={230} size={68} />
    </Cut>

    {/* 715-970 "Want romance, go Namsan... Save this before you pick." + outro */}
    <Cut from={715} len={255}>
      <VideoCut src={`${V}/tower_b.mp4`} trim={330} from={1.03} to={1.11} />
      <Outro hook="Before you land" sub="Full comparison table on epickor.com" />
    </Cut>

    <VoiceTrack slug="320" segments={props.audioSegments} />
    <Captions beats={beats} />
    <Watermark />
  </AbsoluteFill>
);
