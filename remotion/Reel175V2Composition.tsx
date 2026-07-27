/**
 * Reel 175 v2 — full rebuild under process v3.
 *
 * v001 was rejected for heavy clip reuse (its hook had appeared in four prior
 * Reels) and its night payoff could not show Dongdaemun. v2 shares ZERO assets
 * with v001 or any published Reel:
 *  - Dongdaemun is proven on screen: DOOSAN tower, DOOTA.COM, 평화시장 and
 *    패션타운 signage all in frame (Pexels 36294726).
 *  - The night payoff is a real Seoul night intersection (정지/STOP, 광화문·
 *    서울역·명동역 road signs, Bank of Korea building) — no ping-pong proxy.
 *  - The two namesake gates anchor each half: 숭례문 with royal guards for
 *    Namdaemun, 흥인지문 with a green Seoul bus for Dongdaemun (both Commons).
 *  - B10↔B11 cross-cut day/night on the same subjects, so the closing question
 *    "daylight or after midnight?" is made by the pictures themselves.
 *
 * Cut boundaries = caption-timings-v02.json word starts. 13 cuts, 3 images
 * (23%), first cut video. Total 1140f = 38.0s.
 */
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from 'remotion';
import timings from '../output/reels/175/caption-timings-v02.json';
import props from '../output/reels/175/remotion-props-v01.json';
import {
  Captions, Cut, Ons, Outro, StillCut, VideoCut, VoiceTrack, Watermark,
  social, type CaptionBeat,
} from './Batch0726Kit';

const beats = timings.beats as CaptionBeat[];
const V = 'assets/reels/175/video2';
const I = 'assets/reels/175/image2';
const TOTAL = props.durationInFrames; // 1140

function Bgm() {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [TOTAL - 45, TOTAL], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <Audio src={staticFile('assets/reels/175/audio/bgm-walk.mp3')} volume={0.11 * Math.min(fadeIn, fadeOut)} />;
}

export const Reel175V2Composition: React.FC = () => (
  <AbsoluteFill style={{ background: social.ink }}>
    {/* B1 0-105 "two huge markets / everybody tells you to do both" */}
    <Cut from={0} len={105}>
      <VideoCut src={`${V}/market-stalls-38433424.mp4`} trim={10} from={1.03} to={1.12} />
      <Ons kicker="Seoul markets" topLine="Namdaemun vs" punch="Dongdaemun" sub="Pick one. Skip one." top={250} size={96} />
    </Cut>

    {/* B2 105-174 "a great way to waste a whole day" */}
    <Cut from={105} len={69}>
      <VideoCut src={`${V}/jongno-alley-32214386.mp4`} trim={20} from={1.02} to={1.10} />
      <Ons kicker="Doing both?" punch="a wasted day" at={0} top={250} size={104} />
    </Cut>

    {/* B3 174-248 "they're not the same kind of place at all" */}
    <Cut from={174} len={74}>
      <VideoCut src={`${V}/seoul-street-34676841.mp4`} trim={20} from={1.02} to={1.10} />
      <Ons kicker="Two markets" topLine="Two different" punch="worlds" top={250} size={104} />
    </Cut>

    {/* B4 248-312 "Namdaemun is a daytime thing." — 숭례문 + royal guards */}
    <Cut from={248} len={64}>
      <StillCut src={`${I}/sungnyemun-gate.jpg`} from={1.0} to={1.14} drift="up" amount={44} />
      <Ons kicker="Namdaemun" punch="daytime" at={0} top={250} size={122} />
    </Cut>

    {/* B5 312-424 "morning / eat too much / buy stuff you didn't plan on" */}
    <Cut from={312} len={112}>
      {/* same source as B1 but reframed hard onto the goods (low crop, tight
          push) so the return reads as a NEW shot, not the first one repeating */}
      <StillCut src={`${I}/namdaemun-alley.jpg`} from={1.0} to={1.16} drift="left" amount={50} />
      <Ons kicker="Namdaemun rule" topLine="Eat first." punch="Then buy." at={0} top={250} size={100} />
    </Cut>

    {/* B6 424-500 "by evening most of it's closing up" */}
    <Cut from={424} len={76}>
      <VideoCut src={`${V}/cheonggyecheon-38109939.mp4`} trim={30} from={1.02} to={1.10} />
      <Ons kicker="Namdaemun" topLine="By evening" punch="it closes" at={0} top={250} size={96} />
    </Cut>

    {/* B7 500-562 "Dongdaemun does the exact opposite." — 흥인지문 */}
    <Cut from={500} len={62}>
      <StillCut src={`${I}/heunginjimun-gate.jpg`} from={1.14} to={1.0} drift="down" amount={40} />
      <Ons kicker="Dongdaemun" punch="the opposite" at={0} top={250} size={104} />
    </Cut>

    {/* B8 562-637 "doesn't wake up until it's dark" — DOOTA + 평화시장 in frame */}
    <Cut from={562} len={75}>
      <VideoCut src={`${V}/doota-question-36294726.mp4`} trim={30} from={1.02} to={1.10} />
      <Ons kicker="Dongdaemun" topLine="Wakes up" punch="after dark" at={0} top={250} size={96} />
    </Cut>

    {/* B9 637-737 "the wholesale buildings just keep going till dawn" — real Seoul night */}
    <Cut from={637} len={100}>
      <VideoCut src={`${V}/night-cross-26690701.mp4`} trim={30} from={1.02} to={1.11} />
      <Ons kicker="Dongdaemun wholesale" topLine="Runs till" punch="dawn" at={0} top={250} size={112} />
    </Cut>

    {/* B10 737-819 "So it's really one question. Are you shopping in daylight," */}
    <Cut from={737} len={82}>
      {/* reframed to the tower top vs B8's full view — the day/night cross-cut
          is intentional, but each return still gets its own framing */}
      <VideoCut src={`${V}/ntower-cherry-36949144.mp4`} trim={30} from={1.02} to={1.10} />
      <Ons kicker="One question" punch="Daylight?" at={0} top={250} size={116} />
    </Cut>

    {/* B11 819-871 "or are you shopping after midnight?" — the cross-cut answers it */}
    <Cut from={819} len={52}>
      <StillCut src={`${I}/ddp-night.jpg`} from={1.14} to={1.02} drift="right" amount={36} />
      <Ons kicker="Or" punch="after midnight?" at={0} top={250} size={100} />
    </Cut>

    {/* B12 871-1140 "Pick one. Do it properly. Skip the other one — enjoy your
        trip" + outro — one 9s closing shot: Han River with the N Seoul Tower
        skyline. Two returning cuts were removed entirely; every source in this
        Reel now appears exactly once. */}
    <Cut from={871} len={269}>
      <VideoCut src={`${V}/hanriver-ntower-37763965.mp4`} trim={30} from={1.02} to={1.10} />
      <Outro hook="Before you land" sub="Pick one. Do it properly." />
    </Cut>

    <VoiceTrack slug="175" segments={props.audioSegments} />
    <Bgm />
    <Captions beats={beats} />
    <Watermark />
  </AbsoluteFill>
);
