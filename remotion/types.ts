export interface ReelImage {
  rank: number;
  publicPath: string;
  staticFilePath: string;
  sourceUrl: string;
}

export interface ReelTypographyBeat {
  text: string;
  emphasis: string;
  timingHint: string;
}

export interface ReelScene {
  number: number;
  startFrame: number;
  durationFrames: number;
  durationSeconds: number;
  narration: string;
  captionBeats: string[];
  typographyBeats: ReelTypographyBeat[];
  motion: string;
  images: ReelImage[];
}

export interface ReelProps {
  slug: string;
  title: string;
  width: number;
  height: number;
  fps: number;
  durationFrames: number;
  durationSeconds: number;
  finalizedAt: string;
  audio: null | {
    file: string;
    publicPath?: string;
    staticFilePath?: string;
    note?: string;
  };
  audioSegments?: Array<{
    part: number;
    file: string;
    publicPath: string;
    staticFilePath: string;
    startFrame: number;
    durationFrames: number;
    durationSeconds: number;
  }>;
  outro?: {
    startFrame: number;
    durationFrames: number;
    text: string;
  };
  brand: {
    label: string;
    cta: string;
  };
  subtitleStyle: {
    mode: string;
    preset: string;
    font?: string;
    fontWeight?: number;
    basePosition?: string;
    highlightColor?: string;
    background?: string;
    maxWordsPerBeat?: number;
  };
  scenes: ReelScene[];
}
