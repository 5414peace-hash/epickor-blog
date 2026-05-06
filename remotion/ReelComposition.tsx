import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import type { ReelImage, ReelProps, ReelScene } from './types';

const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);

function staticAsset(assetPath: string) {
  const normalized = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  return staticFile(normalized);
}

function motionStyle(scene: ReelScene, localFrame: number, durationFrames: number) {
  const progress = Math.min(Math.max(localFrame / Math.max(durationFrames, 1), 0), 1);
  const eased = easeOut(progress);

  if (scene.motion === 'pan_left') {
    return { transform: `scale(1.1) translateX(${interpolate(eased, [0, 1], [2.5, -2.5])}%)` };
  }

  if (scene.motion === 'pan_right') {
    return { transform: `scale(1.1) translateX(${interpolate(eased, [0, 1], [-2.5, 2.5])}%)` };
  }

  if (scene.motion === 'slow_zoom_out') {
    return { transform: `scale(${interpolate(eased, [0, 1], [1.12, 1.03])})` };
  }

  return { transform: `scale(${interpolate(eased, [0, 1], [1.03, 1.12])})` };
}

function SceneImage({ image, scene, index, total }: { image: ReelImage; scene: ReelScene; index: number; total: number }) {
  const frame = useCurrentFrame();
  const imageDuration = Math.max(18, Math.floor(scene.durationFrames / Math.max(total, 1)));
  const imageStart = index * imageDuration;
  const localFrame = frame - imageStart;
  const opacity = interpolate(localFrame, [0, 6, imageDuration - 6, imageDuration], index === 0 ? [1, 1, 1, 0] : [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const stableOpacity = index === 0 ? opacity : Math.max(opacity, localFrame >= 0 && localFrame < imageDuration - 6 ? 1 : 0);

  return (
    <Sequence from={imageStart} durationInFrames={imageDuration + 8}>
      <AbsoluteFill style={{ opacity: stableOpacity, overflow: 'hidden', backgroundColor: '#0f172a' }}>
        <Img
          src={staticAsset(image.staticFilePath)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            ...motionStyle(scene, localFrame, imageDuration),
          }}
        />
      </AbsoluteFill>
    </Sequence>
  );
}

function CaptionLayer({ scene }: { scene: ReelScene }) {
  const frame = useCurrentFrame();
  const localFrame = frame;
  const beatDuration = Math.max(15, Math.floor(scene.durationFrames / Math.max(scene.captionBeats.length, 1)));
  const captionLeadFrames = 6;
  const ledFrame = Math.min(scene.durationFrames - 1, localFrame + captionLeadFrames);
  const activeBeat = Math.min(scene.captionBeats.length - 1, Math.max(0, Math.floor(ledFrame / beatDuration)));
  const pop = interpolate(ledFrame % beatDuration, [0, 4, 10], [0.96, 1.04, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 82px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          transform: `scale(${pop})`,
          color: '#ffffff',
          fontFamily: 'Inter, Arial, sans-serif',
          fontSize: 58,
          fontWeight: 900,
          lineHeight: 1.02,
          textAlign: 'center',
          textShadow: '0 8px 28px rgba(0,0,0,0.75)',
          textTransform: 'uppercase',
        }}
      >
        {scene.captionBeats[activeBeat]}
      </div>
    </AbsoluteFill>
  );
}

function TypographyBeat({ scene }: { scene: ReelScene }) {
  if (!scene.typographyBeats.length) return null;

  const frame = useCurrentFrame();
  const localFrame = frame;
  const visible = localFrame > scene.durationFrames * 0.5 && localFrame < scene.durationFrames - 10;
  if (!visible) return null;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '0 82px 170px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          color: '#facc15',
          fontFamily: 'Inter, Arial, sans-serif',
          fontSize: scene.typographyBeats[0].text.length > 24 ? 52 : 72,
          fontWeight: 950,
          lineHeight: 1,
          textAlign: 'center',
          textShadow: '0 8px 24px rgba(0,0,0,0.82)',
        }}
      >
        {scene.typographyBeats[0].text}
      </div>
    </AbsoluteFill>
  );
}

function BrandLayer({ label }: { label: string }) {
  return (
    <AbsoluteFill style={{ alignItems: 'flex-start', justifyContent: 'flex-start', padding: '64px 64px' }}>
      <div
        style={{
          color: '#ffffff',
          fontFamily: 'Inter, Arial, sans-serif',
          fontSize: 34,
          fontWeight: 900,
          textShadow: '0 3px 14px rgba(0,0,0,0.55)',
        }}
      >
        {label}
      </div>
    </AbsoluteFill>
  );
}

function ThumbnailLayer() {
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 72px', pointerEvents: 'none' }}>
      <div
        style={{
          color: '#facc15',
          fontFamily: 'Inter, Arial, sans-serif',
          fontSize: 28,
          fontWeight: 950,
          marginBottom: 28,
          textAlign: 'center',
          textShadow: '0 5px 18px rgba(0,0,0,0.85)',
        }}
      >
        KOREA CULTURE GUIDE
      </div>
      <div
        style={{
          color: '#ffffff',
          fontFamily: 'Inter, Arial, sans-serif',
          fontSize: 82,
          fontWeight: 950,
          lineHeight: 0.95,
          textAlign: 'center',
          textShadow: '0 9px 30px rgba(0,0,0,0.9)',
        }}
      >
        KOREAN PC BANGS
        <br />
        ARE NOT
        <br />
        INTERNET CAFES
      </div>
      <div
        style={{
          marginTop: 32,
          color: '#ffffff',
          fontFamily: 'Inter, Arial, sans-serif',
          fontSize: 34,
          fontWeight: 850,
          textAlign: 'center',
          textShadow: '0 5px 18px rgba(0,0,0,0.78)',
        }}
      >
        Korea means something very different.
      </div>
    </AbsoluteFill>
  );
}

function OutroLayer({ text }: { text: string }) {
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#050505' }}>
      <div
        style={{
          color: '#ffffff',
          fontFamily: 'Inter, Arial, sans-serif',
          fontSize: 92,
          fontWeight: 950,
          letterSpacing: 0,
          textAlign: 'center',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
}

export function ReelComposition(props: ReelProps) {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a' }}>
      {props.audio?.staticFilePath ? <Audio src={staticAsset(props.audio.staticFilePath)} /> : null}
      {props.audioSegments?.map((segment) => (
        <Sequence key={segment.part} from={segment.startFrame} durationInFrames={segment.durationFrames}>
          <Audio src={staticAsset(segment.staticFilePath)} />
        </Sequence>
      ))}
      {props.scenes.map((scene) => (
        <Sequence key={scene.number} from={scene.startFrame} durationInFrames={scene.durationFrames}>
          <AbsoluteFill>
            {scene.images.map((image, index) => (
              <SceneImage key={`${scene.number}-${image.rank}`} image={image} scene={scene} index={index} total={scene.images.length} />
            ))}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.05) 42%, rgba(0,0,0,0.66) 100%)',
              }}
            />
            {scene.number === 1 ? <ThumbnailLayer /> : <CaptionLayer scene={scene} />}
            {scene.number === 1 ? null : <TypographyBeat scene={scene} />}
          </AbsoluteFill>
        </Sequence>
      ))}
      {props.outro ? (
        <Sequence from={props.outro.startFrame} durationInFrames={props.outro.durationFrames}>
          <OutroLayer text={props.outro.text} />
        </Sequence>
      ) : null}
      {props.outro ? (
        <Sequence from={0} durationInFrames={props.outro.startFrame}>
          <BrandLayer label={props.brand.label} />
        </Sequence>
      ) : (
        <BrandLayer label={props.brand.label} />
      )}
    </AbsoluteFill>
  );
}
