/**
 * QA fix 2026-07-27: the first pass put "BAG OFF THE SEAT" over a photograph of
 * the Seoul Station building and "the pink seats" over a car whose seats are
 * cream, not pink. Both stills now come from car interiors that actually show
 * seats, and the narration was re-recorded to say "priority seats" so no claim
 * on screen contradicts the frame.
 *
 * Reel 174 — "A thousand people and no sound"
 * Post: Seoul Subway Etiquette: The Quiet Rules Tourists Miss
 *
 * Built to fix a measured failure: Reel 171 averaged 5s of watch on a 41s Reel
 * with zero saves and zero shares. That Reel listed information. This one makes
 * a claim in the first second (this many people, no sound) and then proves it
 * on screen, which is the only structure that earns a save.
 *
 * Audio starts at 8 / 487 / 696.
 */
import { AbsoluteFill } from 'remotion';
import timings from '../output/reels/2026-05-19_174/caption-timings-v01.json';
import props from '../output/reels/2026-05-19_174/remotion-props-v01.json';
import {
  Captions, Cut, Ons, Outro, StillCut, VideoCut, VoiceTrack, Watermark,
  social, type CaptionBeat,
} from './Batch0726Kit';

const beats = timings.beats as CaptionBeat[];
const V = 'assets/reels/174/video';
const I = 'assets/reels/174/image';

export const Reel174Composition: React.FC = () => (
  <AbsoluteFill style={{ background: social.ink }}>
    {/* ACT 1 — the claim, and the proof of the claim */}
    <Cut from={0} len={205}>
      <VideoCut src={`${V}/corridor-crowd-29844136.mp4`} trim={120} from={1.03} to={1.12} />
      <Ons kicker="Seoul subway" topLine="A thousand people." punch="No sound." top={250} size={98} />
    </Cut>

    <Cut from={205} len={282}>
      <VideoCut src={`${V}/car-passengers-29082029.mp4`} trim={300} position="center 45%" from={1.02} to={1.10} />
      <Ons kicker="Not quiet" punch="Silent" sub="No calls. No speaker. Nobody." top={250} size={126} />
    </Cut>

    {/* ACT 2 — the rules nobody writes down */}
    <Cut from={487} len={98}>
      <VideoCut src={`${V}/platform-tactile-35287724.mp4`} trim={60} from={1.04} to={1.13} />
      <Ons kicker="Nobody posts the rules" topLine="They're just" punch="understood" top={250} size={92} />
    </Cut>

    {/* two stills, opposing moves — one rule each */}
    <Cut from={585} len={72}>
      <StillCut src={`${I}/rule-no-eating.jpg`} from={1.02} to={1.16} drift="right" amount={50} />
      <Ons kicker="Rule 01" punch="Don't eat" sub="Not even coffee, on a packed train." at={0} top={930} size={104} />
    </Cut>

    <Cut from={657} len={72}>
      <StillCut src={`${I}/rule-bag-off-seat.jpg`} from={1.16} to={1.02} drift="left" amount={44} />
      <Ons kicker="Rule 02" punch="Bag off the seat" at={0} top={930} size={84} />
    </Cut>

    {/* ACT 3 — the priority seat, then blending in */}
    <Cut from={729} len={261}>
      <VideoCut src={`${V}/car-empty-36302344.mp4`} trim={30} from={1.02} to={1.11} />
      <Ons kicker="Priority seats" topLine="Empty doesn't" punch="mean available" top={250} size={94} />
    </Cut>

    {/* payoff: you, walking out, having blended in */}
    <Cut from={990} len={335}>
      <VideoCut src={`${V}/stairs-teal-18603132.mp4`} trim={40} from={1.02} to={1.09} />
      <Outro hook="Locals know the rest" sub="Headphones in. Face the doors." />
    </Cut>

    <VoiceTrack slug="174" segments={props.audioSegments} />
    <Captions beats={beats} />
    <Watermark />
  </AbsoluteFill>
);
