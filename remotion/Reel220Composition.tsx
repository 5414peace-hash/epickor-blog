/**
 * Reel 220 — "The smell hits you first"
 * Post: Korean Subway Snacks Guide (Deli Manjoo, Hotteok, Food)
 *
 * The argument is that the stalls are placed on subway exits deliberately, so
 * the cut order has to earn that: griddle (what you smell) → platform (where)
 * → the menu → eating it standing up. The payoff is a hand dipping a skewer,
 * not a summary card.
 *
 * Audio starts at 8 / 425 / 998; cuts are placed against those beats.
 */
import { AbsoluteFill } from 'remotion';
import timings from '../output/reels/2026-07-26_220/caption-timings-v01.json';
import props from '../output/reels/2026-07-26_220/remotion-props-v01.json';
import {
  Captions, Cut, Ons, Outro, StillCut, VideoCut, VoiceTrack, Watermark,
  social, type CaptionBeat,
} from './Batch0726Kit';

const beats = timings.beats as CaptionBeat[];
const V = 'assets/reels/220/video';
const I = 'assets/reels/220/image';

/**
 * The menu beats, aligned to the actual word timings in caption-timings-v01.json:
 *   657-753 "Fish-shaped bread with sweet red bean inside"
 *   753-834 "Steamed dumplings the size of your fist"
 *   834-901 "Fried stuff on sticks that you dip yourself"   <- video, not a still
 *   901-998 "A pot of broth that's been going since morning" <- video, not a still
 *
 * The first QA pass labelled two stills "SKEWERS" and "HOT BROTH" when neither
 * skewers nor broth were visible in those photographs. Fixed by moving those two
 * lines onto the clips that actually show them, and by re-labelling the remaining
 * stills to what is genuinely on screen (잉어빵 signage, 손만두 banner, ₩3,000 price).
 */
export const Reel220Composition: React.FC = () => (
  <AbsoluteFill style={{ background: social.ink }}>
    {/* ACT 1 — the smell */}
    <Cut from={0} len={196}>
      <VideoCut src={`${V}/griddle-press-20672041.mp4`} trim={6} from={1.04} to={1.14} />
      <Ons kicker="Seoul street food" topLine="That smell?" punch="On purpose" top={250} size={112} />
    </Cut>

    <Cut from={196} len={229}>
      <VideoCut src={`${V}/griddle-wide-20672042.mp4`} trim={10} from={1.02} to={1.10} />
      <Ons kicker="Hotteok" topLine="Brown sugar" punch="melting" sub="About $1.50, straight off the griddle." top={250} size={108} />
    </Cut>

    {/* ACT 2 — why it is exactly here, then the menu */}
    <Cut from={425} len={225}>
      <VideoCut src={`${V}/station-platform-12153167.mp4`} trim={90} from={1.03} to={1.11} />
      <Ons kicker="The real trick" topLine="Not random." punch="Station exits." top={250} size={104} />
    </Cut>

    {/* 잉어빵 truck — matches "fish-shaped bread with sweet red bean" exactly */}
    <Cut from={657} len={96}>
      <StillCut src={`${I}/bungeoppang-stall.jpg`} from={1.0} to={1.15} drift="left" amount={52} />
      <Ons kicker="01 Bungeoppang" punch="red bean" at={0} top={940} size={96} />
    </Cut>

    {/* 손만두 banner behind the vendor — matches "steamed dumplings" */}
    <Cut from={753} len={81}>
      <StillCut src={`${I}/mandu-vendor.jpg`} from={1.16} to={1.02} drift="right" amount={40} />
      <Ons kicker="02 Son-mandu" punch="hand-folded" at={0} top={940} size={88} />
    </Cut>

    {/* the dipping line gets the dipping footage */}
    <Cut from={834} len={67}>
      <VideoCut src={`${V}/dip-skewer-4551330.mp4`} trim={30} from={1.04} to={1.13} />
      <Ons kicker="03 Skewers" punch="you dip" at={0} top={940} size={96} />
    </Cut>

    {/* ACT 3 — the broth line gets the boiling pot, then the price, then the behaviour */}
    <Cut from={901} len={97}>
      <VideoCut src={`${V}/stew-pot-29267692.mp4`} trim={40} from={1.02} to={1.12} />
      <Ons kicker="04 Hot broth" punch="since 6am" at={0} top={940} size={92} />
    </Cut>

    {/* the ₩3,000 price sign is physically in this photograph, so the price line is provable */}
    <Cut from={998} len={110}>
      <StillCut src={`${I}/hanbok-stall.jpg`} from={1.02} to={1.16} drift="up" amount={46} />
      <Ons kicker="None of it" topLine="is a meal." punch="₩3,000 a bag" top={250} size={92} />
    </Cut>

    <Cut from={1108} len={86}>
      <StillCut src={`${I}/myeongdong-arcade.jpg`} from={1.14} to={1.02} drift="down" amount={38} />
      <Ons kicker="Grilled to order" punch="standing up" at={0} top={940} size={92} />
    </Cut>

    {/* payoff: eating it right there, from a later part of the same clip */}
    <Cut from={1194} len={151}>
      <VideoCut src={`${V}/dip-skewer-4551330.mp4`} trim={250} from={1.02} to={1.08} />
      <Outro hook="Don't order blind" sub="Save this before you land in Seoul." />
    </Cut>

    <VoiceTrack slug="220" segments={props.audioSegments} />
    <Captions beats={beats} />
    <Watermark />
  </AbsoluteFill>
);
