import { Composition, registerRoot } from 'remotion';
import { ReelComposition } from './ReelComposition';
import { Reel294PosterFrame } from './Reel294PosterFrames';
import { Reel294V03Composition } from './Reel294V03Composition';
import { Reel296PosterFrame } from './Reel296PosterFrames';
import { Reel296V01Composition, Reel296V02Composition } from './Reel296V01Composition';
import { Reel297V01Composition, Reel297V02Composition } from './Reel297V01Composition';
import { Reel299PosterFrame, Reel301PosterFrame, Reel302PosterFrame } from './ReelNextBatchPosterFrames';
import {
  Reel299V01Composition,
  Reel299V02Composition,
  Reel301V01Composition,
  Reel301V02Composition,
  Reel302V01Composition,
  Reel302V03Composition,
} from './ReelNextBatchFinalComposition';
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
  sfxSegments: [],
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
      <Composition
        id="Reel294V03"
        component={Reel294V03Composition}
        width={defaultReelProps.width}
        height={defaultReelProps.height}
        fps={defaultReelProps.fps}
        durationInFrames={defaultReelProps.durationFrames}
        defaultProps={defaultReelProps}
        calculateMetadata={({ props: inputProps }) => metadataFromProps(inputProps as ReelProps)}
      />
      <Composition
        id="Reel296V01"
        component={Reel296V01Composition}
        width={defaultReelProps.width}
        height={defaultReelProps.height}
        fps={defaultReelProps.fps}
        durationInFrames={defaultReelProps.durationFrames}
        defaultProps={defaultReelProps}
        calculateMetadata={({ props: inputProps }) => metadataFromProps(inputProps as ReelProps)}
      />
      <Composition
        id="Reel297V01"
        component={Reel297V01Composition}
        width={defaultReelProps.width}
        height={defaultReelProps.height}
        fps={defaultReelProps.fps}
        durationInFrames={defaultReelProps.durationFrames}
        defaultProps={defaultReelProps}
        calculateMetadata={({ props: inputProps }) => metadataFromProps(inputProps as ReelProps)}
      />
      <Composition
        id="Reel296V02"
        component={Reel296V02Composition}
        width={defaultReelProps.width}
        height={defaultReelProps.height}
        fps={defaultReelProps.fps}
        durationInFrames={defaultReelProps.durationFrames}
        defaultProps={defaultReelProps}
        calculateMetadata={({ props: inputProps }) => metadataFromProps(inputProps as ReelProps)}
      />
      <Composition
        id="Reel297V02"
        component={Reel297V02Composition}
        width={defaultReelProps.width}
        height={defaultReelProps.height}
        fps={defaultReelProps.fps}
        durationInFrames={defaultReelProps.durationFrames}
        defaultProps={defaultReelProps}
        calculateMetadata={({ props: inputProps }) => metadataFromProps(inputProps as ReelProps)}
      />
      {[
        { id: 'Reel299V01', component: Reel299V01Composition },
        { id: 'Reel299V02', component: Reel299V02Composition },
        { id: 'Reel301V01', component: Reel301V01Composition },
        { id: 'Reel301V02', component: Reel301V02Composition },
        { id: 'Reel302V01', component: Reel302V01Composition },
        { id: 'Reel302V03', component: Reel302V03Composition },
      ].map(({ id, component }) => (
        <Composition
          key={id}
          id={id}
          component={component}
          width={defaultReelProps.width}
          height={defaultReelProps.height}
          fps={defaultReelProps.fps}
          durationInFrames={defaultReelProps.durationFrames}
          defaultProps={defaultReelProps}
          calculateMetadata={({ props: inputProps }) => metadataFromProps(inputProps as ReelProps)}
        />
      ))}
      {[1, 2, 3, 4, 5, 6, 7].map((sceneNumber) => (
        <Composition
          key={`reel-294-poster-scene-${sceneNumber}`}
          id={`Reel294PosterScene${sceneNumber}`}
          component={Reel294PosterFrame}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={1}
          defaultProps={{ sceneNumber }}
        />
      ))}
      {[
        { slug: 299, component: Reel299PosterFrame },
        { slug: 301, component: Reel301PosterFrame },
        { slug: 302, component: Reel302PosterFrame },
      ].flatMap(({ slug, component }) =>
        [1, 2, 3, 4, 5, 6, 7].map((sceneNumber) => (
          <Composition
            key={`reel-${slug}-poster-scene-${sceneNumber}`}
            id={`Reel${slug}PosterScene${sceneNumber}`}
            component={component}
            width={1080}
            height={1920}
            fps={30}
            durationInFrames={1}
            defaultProps={{ sceneNumber }}
          />
        )),
      )}
      {[1, 2, 3, 4, 5, 6, 7].map((sceneNumber) => (
        <Composition
          key={`reel-296-poster-scene-${sceneNumber}`}
          id={`Reel296PosterScene${sceneNumber}`}
          component={Reel296PosterFrame}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={1}
          defaultProps={{ sceneNumber }}
        />
      ))}
    </>
  );
}

registerRoot(Root);
