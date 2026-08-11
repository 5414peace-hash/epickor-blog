/**
 * Reel 175 — "Daylight or after midnight"
 * Post: Namdaemun vs Dongdaemun: Which Seoul Market to Visit
 *
 * Deliberately withholds night until the payoff: everything before cut 5 is
 * daylight, so the switch itself carries the argument. That is the job a motion
 * card used to be given and is now banned from taking.
 *
 * FOOTAGE CONSTRAINT, recorded honestly. Pexels has no usable Korean night-market
 * vertical video. 57 portrait candidates were frame-checked across seven Korea-
 * anchored queries and every night result was Tokyo (渋谷センター街, ハラペコ食堂),
 * Türkiye (KÜTAHYA BELEDİYESİ) or Vietnam. The one verified Korean night clip is
 * rain-neon-38489828 (Hangul 약 pharmacy signage), so the night beats run on a
 * forward/reverse ping-pong proxy of it — never a hard loop, per the continuity
 * rule. On-screen text therefore never claims to be Dongdaemun after dark; it
 * says only what the frame can prove, which is Korea after dark.
 *
 * Audio starts at 8 / 500 / 737.
 */
import { AbsoluteFill } from 'remotion';
import timings from '../output/reels/2026-05-20_175/caption-timings-v01.json';
import props from '../output/reels/2026-05-20_175/remotion-props-v01.json';
import {
  Captions, Cut, Ons, Outro, StillCut, VideoCut, VoiceTrack, Watermark,
  social, type CaptionBeat,
} from './Batch0726Kit';

const beats = timings.beats as CaptionBeat[];
const V = 'assets/reels/175/video';
const I = 'assets/reels/175/image';

export const Reel175Composition: React.FC = () => (
  <AbsoluteFill style={{ background: social.ink }}>
    {/* ACT 1 — the bad advice, and the daytime market */}
    <Cut from={0} len={200}>
      <VideoCut src={`${V}/market-arcade-36718309.mp4`} trim={20} from={1.03} to={1.12} />
      <Ons kicker="Seoul markets" topLine="Everyone says" punch="do both" top={250} size={110} />
    </Cut>

    <Cut from={200} len={190}>
      <VideoCut src={`${V}/market-street-37814437.mp4`} trim={15} from={1.02} to={1.10} />
      <Ons kicker="Daytime market" topLine="Morning trade." punch="Gone by night." top={250} size={94} />
    </Cut>

    {/* two daylight stills, opposing moves — texture, not a slideshow */}
    <Cut from={390} len={55}>
      <StillCut src={`${I}/vendor-daylight.jpg`} from={1.0} to={1.16} drift="left" amount={54} />
      <Ons kicker="Eat first" punch="then buy" at={0} top={950} size={96} />
    </Cut>

    <Cut from={445} len={55}>
      <StillCut src={`${I}/gate-daylight.jpg`} from={1.14} to={1.02} drift="right" amount={42} />
      <Ons kicker="Daylight" punch="closes early" at={0} top={950} size={88} />
    </Cut>

    {/* ACT 2 — the turn, still in daylight so the night reveal lands harder */}
    <Cut from={500} len={220}>
      <VideoCut src={`${V}/dongdaemun-gate-37203915.mp4`} trim={10} from={1.02} to={1.11} />
      <Ons kicker="Dongdaemun" topLine="Doesn't wake up" punch="until dark" top={250} size={90} />
    </Cut>

    {/* ACT 3 — payoff: the night the Reel has been withholding.
        Ping-pong proxy of the one verified Korean night clip; no hard loop. */}
    <Cut from={720} len={220}>
      <VideoCut src={`${V}/night-pingpong.mp4`} trim={0} from={1.02} to={1.14} />
      <Ons kicker="After dark" topLine="It doesn't" punch="stop" top={250} size={112} />
    </Cut>

    {/* close on the same verified night location, held as a moving still */}
    <Cut from={940} len={200}>
      <StillCut src={`${I}/night-street.jpg`} from={1.03} to={1.13} drift="left" amount={40} />
      <Outro hook="Before you land" sub="Pick one. Do it properly." />
    </Cut>

    <VoiceTrack slug="175" segments={props.audioSegments} />
    <Captions beats={beats} />
    <Watermark />
  </AbsoluteFill>
);
