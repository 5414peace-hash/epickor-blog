/**
 * Reel 220 v3 render (composition id Reel220V2) — fixes the four defects the
 * representative found in the v2 render:
 *
 *  1. "tells / you" caption split → align-reel-captions.mjs now breaks at
 *     punctuation and never strands grammar halves (22 clean cards).
 *  2. 19s jump-repeat → the two Shinsegae segments overlapped at the source
 *     (150-167). The station passage now runs as ONE continuous clip.
 *  3. Outro duplicated 175's pharmacy street → replaced with the Bank of Korea
 *     intersection (verified Korean landmark). 38489829 removed from this Reel.
 *  4. "hotteok" narrated over bindaetteok footage → narration re-recorded: the
 *     griddle clip now carries "golden pancakes pressed flat" (true of the
 *     frame), and hotteok is named only over the real Busan ssiat-hotteok
 *     photograph. Bonus: 37395796 has the 안국역 station sign IN FRAME, so the
 *     "come out of the station" line is now visually provable.
 *
 * Cut boundaries = caption-timings-v02.json word starts. 15 cuts, 5 images
 * (33%), first cut is video. Total 1449f = 48.3s.
 */
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from 'remotion';
import timings from '../output/reels/220/caption-timings-v02.json';
import props from '../output/reels/220/remotion-props-v01.json';
import {
  Captions, Cut, Ons, Outro, StillCut, VideoCut, VoiceTrack, Watermark,
  social, type CaptionBeat,
} from './Batch0726Kit';

const beats = timings.beats as CaptionBeat[];
const V = 'assets/reels/220/video2';
const I = 'assets/reels/220/image2';
const TOTAL = props.durationInFrames; // 1449

function Bgm() {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [TOTAL - 45, TOTAL], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <Audio src={staticFile('assets/reels/220/audio/bgm-hold-me.mp3')} volume={0.11 * Math.min(fadeIn, fadeOut)} />;
}

export const Reel220V2Composition: React.FC = () => (
  <AbsoluteFill style={{ background: social.ink }}>
    {/* 8-83 "Okay so — that smell / About ten seconds" */}
    <Cut from={0} len={83}>
      <VideoCut src={`${V}/griddle-work-4551328.mp4`} trim={40} from={1.04} to={1.12} />
      <Ons kicker="Seoul street food" topLine="That smell?" punch="On purpose" top={250} size={112} />
    </Cut>

    {/* 83-162 "after you come up the stairs... it hits you" — 신촌역 exit 2 */}
    <Cut from={83} len={79}>
      <StillCut src={`${I}/sinchon-exit.jpg`} from={1.0} to={1.16} drift="up" amount={52} />
      <Ons kicker="Station exit" topLine="Ten seconds" punch="up the stairs" at={0} top={250} size={92} />
    </Cut>

    {/* 162-217 "and you're gonna stop walking." */}
    <Cut from={162} len={55}>
      <VideoCut src={`${V}/street-day-36412260.mp4`} trim={20} from={1.02} to={1.09} />
      <Ons kicker="And then" punch="you stop" at={0} top={250} size={118} />
    </Cut>

    {/* 217-310 "Somebody's pressing golden pancakes flat on a hot griddle" — TRUE of the frame */}
    <Cut from={217} len={93}>
      <VideoCut src={`${V}/griddle-work-4551328.mp4`} trim={230} from={1.02} to={1.12} />
      <Ons kicker="On the griddle" topLine="Pressed flat." punch="Golden." top={250} size={104} />
    </Cut>

    {/* 310-415 "right on the sidewalk... a dollar fifty" */}
    <Cut from={310} len={105}>
      <VideoCut src={`${V}/street-day-36412260.mp4`} trim={115} from={1.03} to={1.11} />
      <Ons kicker="On the sidewalk" punch="≈ $1.50" at={0} top={250} size={116} />
    </Cut>

    {/* 415-585 ONE continuous clip — no jump. 안국역 station sign is in frame,
        so "parked right where you come out of the station" is provable. */}
    <Cut from={415} len={170}>
      <VideoCut src={`${V}/lantern-street-37395796.mp4`} trim={30} from={1.02} to={1.12} />
      <Ons kicker="The real trick" topLine="Not random." punch="Placed." top={250} size={110} />
      <Ons kicker="Right at" punch="the exits" at={104} top={620} size={96} />
    </Cut>

    {/* 579-651 "That's the entire business model." */}
    <Cut from={579} len={72}>
      <VideoCut src={`${V}/seoul-shinsegae-31727226.mp4`} trim={20} from={1.03} to={1.10} />
      <Ons kicker="That's the" punch="business model" at={0} top={250} size={88} />
    </Cut>

    {/* 651-795 "Hotteok — sweet fried dough with brown sugar melting inside." */}
    <Cut from={651} len={144}>
      <StillCut src={`${I}/hotteok-busan.jpg`} from={1.1} to={1.0} drift="left" amount={34} />
      <Ons kicker="01 Hotteok" topLine="Brown sugar" punch="inside" at={0} top={250} size={104} />
    </Cut>

    {/* 795-870 "Fish-shaped bread stuffed with red bean." */}
    <Cut from={795} len={75}>
      <StillCut src={`${I}/bungeoppang-stall.jpg`} from={1.0} to={1.15} drift="right" amount={48} />
      <Ons kicker="02 Bungeoppang" punch="red bean" at={0} top={940} size={96} />
    </Cut>

    {/* 870-951 "Steamed dumplings the size of your fist." — actual jjin-mandu
        on the plate (Commons, Korea GPS). Replaced the vendor/banner shot the
        representative rejected for showing text and a person instead of food. */}
    <Cut from={870} len={81}>
      <StillCut src={`${I}/jjinmandu-plate.jpg`} from={1.18} to={1.02} drift="right" amount={38} />
      <Ons kicker="03 Mandu" punch="fist-sized" at={0} top={940} size={92} />
    </Cut>

    {/* 951-1099 "And fish cakes on skewers, floating in a broth that's been
        going since morning." — one clip proves both halves of the line:
        skewers AND the broth pot. Replaces the sauce-cup and kimchi-pan cuts
        the representative rejected. */}
    <Cut from={951} len={148}>
      <VideoCut src={`${V}/odeng-pot-11556562.mp4`} trim={20} from={1.02} to={1.12} />
      <Ons kicker="04 Odeng" topLine="Skewers in broth," punch="since 6am" at={0} top={940} size={84} />
    </Cut>

    {/* 1099-1205 "None of it is a meal / about two bucks" — ₩3,000 sign in frame */}
    <Cut from={1099} len={106}>
      <StillCut src={`${I}/hanbok-stall.jpg`} from={1.02} to={1.16} drift="up" amount={46} />
      <Ons kicker="None of it" topLine="is a meal." punch="₩3,000 a bag" top={250} size={92} />
    </Cut>

    {/* 1205-1446 "standing up... which exit" + outro — Bank of Korea intersection */}
    <Cut from={1205} len={241}>
      <VideoCut src={`${V}/bank-street-36849357.mp4`} trim={30} from={1.02} to={1.10} />
      <Outro hook="Don't order blind" sub="Save this before you land in Seoul." />
    </Cut>

    <VoiceTrack slug="220" segments={props.audioSegments} />
    <Bgm />
    <Captions beats={beats} />
    <Watermark />
  </AbsoluteFill>
);
