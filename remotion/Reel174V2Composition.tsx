/**
 * Reel 174 v2 — full rebuild under process v3, direction A approved by the
 * representative after v001 shipped a Kuala Lumpur car interior as Seoul.
 *
 * The structural fix: no Korea-verified subway-interior VIDEO exists on Pexels
 * or Commons (measured three times), so the reel is rebuilt as a loud-city vs
 * silent-subway contrast. Everything above ground is verified Seoul video;
 * everything underground is Theodore Nguyen's Seoul Metro photo series
 * (slugs literally name Seoul; Hangul signage in every frame) as moving stills.
 * Narration re-recorded so every line is provable by its footage.
 *
 * 10 cuts: 6 video / 4 images (40% — above the ~30% guide, disclosed to the
 * representative as the honest ceiling for this topic). Total 1214f = 40.5s.
 */
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from 'remotion';
import timings from '../output/reels/174/caption-timings-v02.json';
import props from '../output/reels/174/remotion-props-v01.json';
import {
  Captions, Cut, Ons, Outro, StillCut, VideoCut, VoiceTrack, Watermark,
  social, type CaptionBeat,
} from './Batch0726Kit';

const beats = timings.beats as CaptionBeat[];
const V = 'assets/reels/174/video2';
const I = 'assets/reels/174/image2';
const TOTAL = props.durationInFrames; // 1214

function Bgm() {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [TOTAL - 45, TOTAL], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <Audio src={staticFile('assets/reels/174/audio/bgm-blooming.mp3')} volume={0.10 * Math.min(fadeIn, fadeOut)} />;
}

export const Reel174V2Composition: React.FC = () => (
  <AbsoluteFill style={{ background: social.ink }}>
    {/* 8-126 "nobody warns you / the city is loud" — subject named in the hook ONS */}
    <Cut from={0} len={126}>
      <VideoCut src={`${V}/myeongdong-crowd-37998673.mp4`} trim={20} from={1.03} to={1.11} />
      <Ons kicker="Seoul subway" topLine="Loud city." punch="Silent trains." top={250} size={98} />
    </Cut>

    {/* 126-211 "packed streets, music, traffic" — Hangul billboard street.
        (cathedral-steps moved to B8 so the cathedral location appears once) */}
    <Cut from={126} len={85}>
      <VideoCut src={`${V}/billboard-street-37984173.mp4`} trim={60} from={1.02} to={1.10} />
      <Ons kicker="Above ground" punch="packed" at={0} top={250} size={120} />
    </Cut>

    {/* 211-301 "the second you step into the subway, it all just stops" */}
    <Cut from={211} len={90}>
      <StillCut src={`${I}/cherry-metro.jpg`} from={1.0} to={1.15} drift="left" amount={46} />
      <Ons kicker="The switch" topLine="Underground," punch="it stops" at={0} top={250} size={100} />
    </Cut>

    {/* 301-429 "no speakerphone calls, no videos out loud. Just... quiet." */}
    <Cut from={301} len={128}>
      <StillCut src={`${I}/yellow-corridor.jpg`} from={1.16} to={1.02} drift="right" amount={40} />
      <Ons kicker="House rule" topLine="No calls." punch="No speakers." at={0} top={250} size={94} />
    </Cut>

    {/* 429-521 "the rules aren't posted anywhere, they're just understood" */}
    <Cut from={429} len={92}>
      <VideoCut src={`${V}/seoul-station-street-38391895.mp4`} trim={30} from={1.02} to={1.10} />
      <Ons kicker="Unwritten" punch="but understood" at={0} top={250} size={94} />
    </Cut>

    {/* 521-594 "let people off the train before you get on" — platform doors still */}
    <Cut from={521} len={73}>
      <StillCut src={`${I}/platform-doors.jpg`} from={1.02} to={1.16} drift="up" amount={44} />
      <Ons kicker="Rule 01" topLine="Off first." punch="Then on." at={0} top={250} size={100} />
    </Cut>

    {/* 594-694 "on the escalator, stand right, walk left" — real Seoul escalator */}
    <Cut from={594} len={100}>
      <StillCut src={`${I}/escalator.jpg`} from={1.14} to={1.0} drift="down" amount={40} />
      <Ons kicker="Rule 02" topLine="Stand right." punch="Walk left." at={0} top={250} size={96} />
    </Cut>

    {/* 694-826 "that snack? waits until you're back outside" — street crowd */}
    <Cut from={694} len={132}>
      <VideoCut src={`${V}/cathedral-steps-38533116.mp4`} trim={30} from={1.02} to={1.10} />
      <Ons kicker="Rule 03" topLine="Snacks wait" punch="for outside" at={0} top={250} size={94} />
    </Cut>

    {/* 826-996 "look like a local: do almost nothing" — a person sitting still
        by the Yeouido pond. The calmest shot in the Reel carries the calmest line. */}
    <Cut from={826} len={170}>
      <VideoCut src={`${V}/pond-person-32242948.mp4`} trim={20} from={1.02} to={1.10} />
      <Ons kicker="Look local" topLine="Do almost" punch="nothing" at={0} top={250} size={104} />
    </Cut>

    {/* 996-1214 "everybody already doing it" + outro — Korean city aerial.
        Every source in this Reel appears exactly once. */}
    <Cut from={996} len={218}>
      <VideoCut src={`${V}/city-aerial-37500922.mp4`} trim={40} from={1.02} to={1.10} />
      <Outro hook="Locals know the rest" sub="Headphones in. Face the doors." />
    </Cut>

    <VoiceTrack slug="174" segments={props.audioSegments} />
    <Bgm />
    <Captions beats={beats} />
    <Watermark />
  </AbsoluteFill>
);
