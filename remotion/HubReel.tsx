/**
 * Hub Reels (drinks / ramyun / seoul) — 2026-08-05 rebuild.
 *
 * The 2026-08-04 delivery of these three was assembled straight to MP4 with
 * ffmpeg, bypassing Batch0726Kit entirely. It therefore shipped with no ONS,
 * no outro chip, no watermark, and — because the "caption leads by 4 frames"
 * rule was implemented by starting each subtitle early without ending the one
 * before it — 29 of 33 subtitle lines were live simultaneously with their
 * neighbour, which libass stacks upward. That is the caption jitter.
 *
 * This driver puts the batch back on the kit. Two things differ from the
 * single-post compositions (326 etc.), both because these are category Reels
 * cut to narration rather than 6-cut story Reels:
 *
 *  - 21-23 cuts instead of 6, so ONS cannot live inside a cut. It sits in its
 *    own Sequence spanning several cuts, which is also what lets a statement
 *    hold while the picture keeps moving.
 *  - Media is pre-composed to 1080x1920 upstream. Post photos are landscape;
 *    the kit's objectFit:cover would crop one to a central sliver, so stills
 *    arrive as blur-cover plates and videos as panned proxies with a 45-frame
 *    tail for the kit's 16-frame cut overlap.
 */
import { AbsoluteFill } from 'remotion';
import {
  Captions, Cut, Ons, Outro, StillCut, VideoCut, VoiceTrack, Watermark,
  social, type CaptionBeat,
} from './Batch0726Kit';

export type ManifestCut = {
  n: number; from: number; len: number;
  kind: 'video' | 'still'; src: string; handle?: number;
};

export type Manifest = {
  slug: string; durationInFrames: number;
  cuts: ManifestCut[]; beats: CaptionBeat[];
};

export type OnsBeat = {
  from: number; to: number;
  kicker: string; topLine?: string; punch: string; sub?: string; size?: number;
};

export type ReelOutro = { from: number; hook: string; sub: string };

/** Consecutive stills get opposing drifts so a run of plates reads as motion. */
const DRIFTS = ['left', 'right', 'up', 'right', 'left', 'down'] as const;

export function HubReel({
  manifest, ons, outro, audio,
}: {
  manifest: Manifest;
  ons: OnsBeat[];
  outro: ReelOutro;
  /** Narration part start frames. Sequence-mounted, so a part can never be
   *  silently dropped the way the ffmpeg amix build lost 10s of drinks part 2. */
  audio: { part: number; startFrame: number }[];
}) {
  let stillIndex = 0;
  return (
    <AbsoluteFill style={{ background: social.ink }}>
      {manifest.cuts.map((c, i) => {
        /**
         * The opening was showing bare background, and it was two faults at once:
         *
         *  1. cut 1 started at the first narration frame (f10/f11), so frames
         *     0-10 had no media mounted at all — 0.37s of flat teal with just
         *     the watermark on it. Measured on ramyun v015: frames 0, 1 and 4
         *     all luma 37, which is exactly social.ink.
         *  2. cut 1 then faded in over 8 frames, revealing that background
         *     rather than crossfading over anything.
         *
         * So the first cut is pulled back to frame 0 and does not fade in.
         * Representative, 2026-08-05: "화면이 먼저 나와있어야지. 페이드아웃은
         * 필요해도 페이드인은 없어도 되지." Later cuts keep the fade, because
         * there it crossfades over the outgoing cut instead of the background.
         */
        const first = i === 0;
        const from = first ? 0 : c.from;
        const len = first ? c.len + c.from : c.len;
        if (c.kind === 'video') {
          return (
            <Cut key={c.n} from={from} len={len}>
              <VideoCut src={c.src} from={1.01} to={1.06} fadeIn={!first} />
            </Cut>
          );
        }
        const drift = DRIFTS[stillIndex++ % DRIFTS.length];
        return (
          <Cut key={c.n} from={from} len={len}>
            <StillCut src={c.src} from={1.0} to={1.07} drift={drift} amount={26} fadeIn={!first} />
          </Cut>
        );
      })}

      {ons.map((o) => (
        <Cut key={`ons-${o.from}`} from={o.from} len={o.to - o.from}>
          <Ons
            kicker={o.kicker}
            topLine={o.topLine}
            punch={o.punch}
            sub={o.sub}
            size={o.size ?? 112}
            top={230}
          />
        </Cut>
      ))}

      <Cut from={outro.from} len={manifest.durationInFrames - outro.from - 16}>
        <Outro hook={outro.hook} sub={outro.sub} />
      </Cut>

      <VoiceTrack slug={manifest.slug} segments={audio} />
      <Captions beats={manifest.beats} />
      <Watermark />
    </AbsoluteFill>
  );
}
