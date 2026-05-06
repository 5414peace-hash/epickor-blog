import { Composition, registerRoot } from 'remotion';
import { ReelComposition } from './ReelComposition';
import type { ReelProps } from './types';
import props from '../output/reels/170/remotion-props.json';

const reelProps = props as ReelProps;

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
        width={reelProps.width}
        height={reelProps.height}
        fps={reelProps.fps}
        durationInFrames={reelProps.durationFrames}
        defaultProps={reelProps}
        calculateMetadata={({ props: inputProps }) => metadataFromProps(inputProps as ReelProps)}
      />
      <Composition
        id="EpicKorReel170"
        component={ReelComposition}
        width={reelProps.width}
        height={reelProps.height}
        fps={reelProps.fps}
        durationInFrames={reelProps.durationFrames}
        defaultProps={reelProps}
      />
    </>
  );
}

registerRoot(Root);
