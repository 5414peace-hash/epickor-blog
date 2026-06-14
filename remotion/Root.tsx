import { Composition, registerRoot } from 'remotion';
import { ReelComposition } from './ReelComposition';
import type { ReelProps } from './types';

const defaultReelProps: ReelProps = {
  slug: 'preview',
  title: 'EpicKor Reel',
  width: 1080,
  height: 1920,
  fps: 30,
  durationFrames: 1,
  durationSeconds: 1 / 30,
  finalizedAt: '',
  audio: null,
  audioSegments: [],
  outro: {
    startFrame: 0,
    durationFrames: 1,
    text: 'epicKor.com',
  },
  brand: {
    label: 'EpicKor',
    cta: 'EPICKOR.COM',
  },
  subtitleStyle: {
    mode: 'narration_synced',
    preset: 'modern_reels_phrase_pop',
  },
  scenes: [],
  motionCards: [],
  motionCardTemplates: [],
};

function metadataFromProps(inputProps: ReelProps) {
  return {
    width: inputProps.width,
    height: inputProps.height,
    fps: inputProps.fps,
    durationInFrames: inputProps.durationFrames,
  };
}

function Root() {
  return (
    <>
      <Composition
        id="EpicKorReel"
        component={ReelComposition}
        width={defaultReelProps.width}
        height={defaultReelProps.height}
        fps={defaultReelProps.fps}
        durationInFrames={defaultReelProps.durationFrames}
        defaultProps={defaultReelProps}
        calculateMetadata={({ props: inputProps }) => metadataFromProps(inputProps as ReelProps)}
      />
      <Composition
        id="EpicKorReelPreview"
        component={ReelComposition}
        width={defaultReelProps.width}
        height={defaultReelProps.height}
        fps={defaultReelProps.fps}
        durationInFrames={defaultReelProps.durationFrames}
        defaultProps={defaultReelProps}
      />
    </>
  );
}

registerRoot(Root);
