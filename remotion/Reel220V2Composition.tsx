/**
 * Reel 220 v2 — rebuilt under process v3 after the representative rejected v001.
 *
 * What changed and why:
 *  - Every cut boundary comes from the forced-alignment word timings, so the
 *    footage matches what is being said at that moment (the v001 failure).
 *  - Every clip passed the country gate (metadata slug/photographer read, Hangul
 *    on frame for place claims) and the cross-Reel uniqueness ledger.
 *  - ~3s per beat, 15 beats, 5 images (33%), every image moves, first beat video.
 *  - BGM: Cosmonkey "Hold Me", ducked ~-20dB under narration with fades.
 *
 * Honest weak spots, flagged in beat-sheet-v2.md for the representative:
 *  B8 (station-exit line over city commerce) and B13 (broth line over a kimchi
 *  pot) — no Korea-verified footage exists on Pexels for either subject.
 */
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import timings from '../output/reels/220/caption-timings-v01.json';
import props from '../output/reels/220/remotion-props-v01.json';
import {
  Captions, Cut, Ons, Outro, StillCut, VideoCut, VoiceTrack, Watermark,
  social, type CaptionBeat,
} from './Batch0726Kit';

const beats = timings.beats as CaptionBeat[];
const V = 'assets/reels/220/video2';
const I = 'assets/reels/220/image2';

/** BGM under the narration: in 15f, out over the last 45f. */
function Bgm() {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [1300, 1345], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <Audio src={staticFile('assets/reels/220/audio/bgm-hold-me.mp3')} volume={0.11 * Math.min(fadeIn, fadeOut)} />;
}

export const Reel220V2Composition: React.FC = () => (
  <AbsoluteFill style={{ background: social.ink }}>
    {/* B1 8-99 "Okay so — that smell / ten seconds after" */}
    <Cut from={0} len={99}>
      <VideoCut src={`${V}/griddle-work-4551328.mp4`} trim={40} from={1.04} to={1.12} />
      <Ons kicker="Seoul street food" topLine="That smell?" punch="On purpose" top={250} size={112} />
    </Cut>

    {/* B2 99-204 "you come up the stairs in Seoul... stop walking" — real 신촌역 exit */}
    <Cut from={99} len={105}>
      <StillCut src={`${I}/sinchon-exit.jpg`} from={1.0} to={1.16} drift="up" amount={52} />
      <Ons kicker="Station exit" topLine="Ten seconds" punch="up the stairs" at={0} top={250} size={92} />
    </Cut>

    {/* B4 204-234 "It's hotteok." — real ssiat-hotteok, Busan GPS */}
    <Cut from={204} len={30}>
      <StillCut src={`${I}/hotteok-busan.jpg`} from={1.12} to={1.02} drift="left" amount={30} />
      <Ons kicker="The answer" punch="Hotteok" at={0} top={250} size={132} />
    </Cut>

    {/* B5 234-342 "Brown sugar... pressed flat on a griddle" */}
    <Cut from={234} len={108}>
      <VideoCut src={`${V}/griddle-work-4551328.mp4`} trim={230} from={1.02} to={1.12} />
      <Ons kicker="Hotteok" topLine="Brown sugar" punch="melting" sub="Pressed flat, right on the griddle." top={250} size={104} />
    </Cut>

    {/* B6 342-425 "sidewalk... dollar fifty" — Namdaemun-area market street */}
    <Cut from={342} len={83}>
      <VideoCut src={`${V}/street-day-36412260.mp4`} trim={20} from={1.02} to={1.10} />
      <Ons kicker="On the sidewalk" punch="≈ $1.50" at={0} top={250} size={116} />
    </Cut>

    {/* B7 425-556 "these stalls aren't random" */}
    <Cut from={425} len={131}>
      <VideoCut src={`${V}/seoul-shinsegae-31727226.mp4`} trim={20} from={1.02} to={1.10} />
      <Ons kicker="The real trick" topLine="Not random." punch="Placed." top={250} size={110} />
    </Cut>

    {/* B8 556-594 "come out of the station" — weak match #1, flagged */}
    <Cut from={556} len={38}>
      <VideoCut src={`${V}/seoul-shinsegae-31727226.mp4`} trim={150} from={1.04} to={1.10} />
      <Ons kicker="Right at" punch="the exits" at={0} top={250} size={110} />
    </Cut>

    {/* B9 594-657 "That's the entire business model." */}
    <Cut from={594} len={63}>
      <VideoCut src={`${V}/street-day-36412260.mp4`} trim={130} from={1.03} to={1.11} />
      <Ons kicker="That's the" punch="business model" at={0} top={250} size={88} />
    </Cut>

    {/* B10 657-753 "Fish-shaped bread" — post-owned 잉어빵 truck */}
    <Cut from={657} len={96}>
      <StillCut src={`${I}/bungeoppang-stall.jpg`} from={1.0} to={1.15} drift="left" amount={52} />
      <Ons kicker="01 Bungeoppang" punch="red bean" at={0} top={940} size={96} />
    </Cut>

    {/* B11 753-834 "Steamed dumplings" — post-owned 손만두 banner */}
    <Cut from={753} len={81}>
      <StillCut src={`${I}/mandu-vendor.jpg`} from={1.16} to={1.02} drift="right" amount={40} />
      <Ons kicker="02 Son-mandu" punch="hand-folded" at={0} top={940} size={88} />
    </Cut>

    {/* B12 834-901 "Fried stuff on sticks that you dip" */}
    <Cut from={834} len={67}>
      <VideoCut src={`${V}/dip-skewer-4551330.mp4`} trim={30} from={1.04} to={1.13} />
      <Ons kicker="03 Skewers" punch="you dip" at={0} top={940} size={96} />
    </Cut>

    {/* B13 901-998 "A pot of broth" — weak match #2, flagged */}
    <Cut from={901} len={97}>
      <VideoCut src={`${V}/kimchi-pot-11588425.mp4`} trim={20} from={1.02} to={1.12} />
      <Ons kicker="04 The pot" punch="since 6am" at={0} top={940} size={96} />
    </Cut>

    {/* B14 998-1104 "None of it is a meal / two bucks" — ₩3,000 sign in frame */}
    <Cut from={998} len={106}>
      <StillCut src={`${I}/hanbok-stall.jpg`} from={1.02} to={1.16} drift="up" amount={46} />
      <Ons kicker="None of it" topLine="is a meal." punch="₩3,000 a bag" top={250} size={92} />
    </Cut>

    {/* B15 1104-1345 "standing up... which exit" + outro — 약 neon street */}
    <Cut from={1104} len={241}>
      <VideoCut src={`${V}/rain-yak-38489829.mp4`} trim={0} from={1.02} to={1.10} />
      <Outro hook="Don't order blind" sub="Save this before you land in Seoul." />
    </Cut>

    <VoiceTrack slug="220" segments={props.audioSegments} />
    <Bgm />
    <Captions beats={beats} />
    <Watermark />
  </AbsoluteFill>
);
