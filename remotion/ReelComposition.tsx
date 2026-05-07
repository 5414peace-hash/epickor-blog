import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import type { CSSProperties } from 'react';
import type { ReelImage, ReelMotionCard, ReelProps, ReelScene } from './types';

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

function cardTemplate(card: ReelMotionCard) {
  return card.templateId || card.layout || 'editorial_box';
}

function revealTiming(frame: number, scene: ReelScene, index: number, total: number) {
  const available = Math.max(30, scene.durationFrames - 58);
  const start = Math.round(20 + (index / Math.max(total, 1)) * available);
  const opacity = interpolate(frame, [start, start + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(frame, [start, start + 14], [28, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(frame, [start, start + 14], [0.96, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return { opacity, y, scale };
}

function textLines(text?: string, explicit?: string[]) {
  if (explicit?.length) return explicit;
  if (!text) return [];
  return text.split(/\s*\|\s*/).filter(Boolean);
}

function LineStack({
  lines,
  style,
}: {
  lines: string[];
  style: CSSProperties;
}) {
  return (
    <div style={style}>
      {lines.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  );
}

function ShellText({ card, compact = false }: { card: ReelMotionCard; compact?: boolean }) {
  const headlineLines = textLines(card.headline, card.headlineLines);
  const subheadLines = textLines(card.subhead, card.subheadLines);
  return (
    <div style={{ display: 'grid', gap: compact ? 16 : 22 }}>
      <div style={{ color: card.accentColor, fontSize: compact ? 24 : 28, fontWeight: 950, textTransform: 'uppercase' }}>
        {card.kicker}
      </div>
      <LineStack
        lines={headlineLines}
        style={{
          color: '#ffffff',
          fontSize: compact || headlineLines.join('').length > 30 ? 62 : 78,
          fontWeight: 950,
          lineHeight: 0.94,
          textTransform: 'uppercase',
        }}
      />
      {subheadLines.length ? (
        <LineStack lines={subheadLines} style={{ color: 'rgba(255,255,255,0.83)', fontSize: compact ? 30 : 34, fontWeight: 760, lineHeight: 1.14 }} />
      ) : null}
    </div>
  );
}

function EditorialBoxCard({ card, scene, frame, opacity, enter, float, scale }: {
  card: ReelMotionCard;
  scene: ReelScene;
  frame: number;
  opacity: number;
  enter: number;
  float: number;
  scale: number;
}) {
  const footerLines = textLines(card.footer, card.footerLines);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: '112px 86px 116px' }}>
      <div
        style={{
          width: 820,
          height: 1458,
          opacity,
          transform: `translateY(${enter + float}px) scale(${scale})`,
          borderRadius: 34,
          border: '2px solid rgba(255,255,255,0.16)',
          background: 'linear-gradient(180deg, rgba(14,14,16,0.96), rgba(29,33,38,0.92))',
          boxShadow: '0 34px 90px rgba(0,0,0,0.48)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        <div style={{ height: 12, background: card.accentColor }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 34, flex: 1, padding: '58px 58px 46px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'center' }}>
            <ShellText card={card} compact />
            <div style={{ color: 'rgba(255,255,255,0.72)', fontSize: 22, fontWeight: 850 }}>EPICKOR</div>
          </div>
          <div style={{ display: 'grid', gap: 18, marginTop: 'auto' }}>
            {card.bullets.map((bullet, index) => {
              const reveal = revealTiming(frame, scene, index, card.bullets.length);
              return (
                <div
                  key={bullet}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    minHeight: 94,
                    opacity: reveal.opacity,
                    transform: `translateY(${reveal.y}px) scale(${reveal.scale})`,
                    borderRadius: 18,
                    padding: '0 24px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  <div style={{ width: 42, height: 42, borderRadius: 999, display: 'grid', placeItems: 'center', background: card.accentColor, color: '#111111', fontSize: 22, fontWeight: 950 }}>
                    {index + 1}
                  </div>
                  <div style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.02 }}>{bullet}</div>
                </div>
              );
            })}
          </div>
          {footerLines.length ? <LineStack lines={footerLines} style={{ color: 'rgba(255,255,255,0.62)', fontSize: 24, fontWeight: 800, lineHeight: 1.14, textTransform: 'uppercase' }} /> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
}

function KineticStepsCard({ card, scene, frame, opacity, enter, float, scale }: {
  card: ReelMotionCard;
  scene: ReelScene;
  frame: number;
  opacity: number;
  enter: number;
  float: number;
  scale: number;
}) {
  return (
    <AbsoluteFill style={{ justifyContent: 'center', padding: '118px 84px', fontFamily: 'Inter, Arial, sans-serif' }}>
      <div style={{ opacity, transform: `translateY(${enter + float}px) scale(${scale})`, display: 'grid', gap: 54 }}>
        <ShellText card={card} />
        <div style={{ display: 'grid', gap: 26 }}>
          {card.bullets.map((bullet, index) => {
            const reveal = revealTiming(frame, scene, index, card.bullets.length);
            return (
              <div
                key={bullet}
                style={{
                  opacity: reveal.opacity,
                  transform: `translateX(${interpolate(reveal.opacity, [0, 1], [-80, 0])}px) scale(${reveal.scale})`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 22,
                  width: index % 2 === 0 ? 760 : 680,
                  marginLeft: index % 2 === 0 ? 0 : 88,
                  minHeight: 104,
                  borderRadius: 999,
                  padding: '0 34px',
                  color: '#ffffff',
                  background: 'rgba(255,255,255,0.16)',
                  boxShadow: '0 18px 48px rgba(0,0,0,0.28)',
                  border: '1px solid rgba(255,255,255,0.16)',
                }}
              >
                <div style={{ width: 58, height: 58, borderRadius: 999, display: 'grid', placeItems: 'center', background: card.accentColor, color: '#111', fontSize: 29, fontWeight: 950 }}>
                  {index + 1}
                </div>
                <div style={{ fontSize: 42, fontWeight: 950 }}>{bullet}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

function MenuBoardCard({ card, scene, frame, opacity, enter, float, scale }: {
  card: ReelMotionCard;
  scene: ReelScene;
  frame: number;
  opacity: number;
  enter: number;
  float: number;
  scale: number;
}) {
  const footerLines = textLines(card.footer, card.footerLines);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: '110px 78px', fontFamily: 'Inter, Arial, sans-serif' }}>
      <div
        style={{
          opacity,
          transform: `rotate(-1.5deg) translateY(${enter + float}px) scale(${scale})`,
          width: 850,
          minHeight: 1280,
          padding: '58px 58px 50px',
          borderRadius: 12,
          color: '#ffffff',
          background: 'linear-gradient(180deg, rgba(32,20,22,0.97), rgba(14,14,16,0.94))',
          border: `10px solid ${card.accentColor}`,
          boxShadow: '0 36px 96px rgba(0,0,0,0.5)',
        }}
      >
        <ShellText card={card} compact />
        <div style={{ display: 'grid', gap: 12, marginTop: 70 }}>
          {card.bullets.map((bullet, index) => {
            const reveal = revealTiming(frame, scene, index, card.bullets.length);
            return (
              <div
                key={bullet}
                style={{
                  opacity: reveal.opacity,
                  transform: `translateX(${interpolate(reveal.opacity, [0, 1], [80, 0])}px)`,
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  minHeight: 92,
                  borderBottom: '2px dashed rgba(255,255,255,0.28)',
                  color: '#ffffff',
                }}
              >
                <div style={{ fontSize: 46, fontWeight: 950, textTransform: 'uppercase' }}>{bullet}</div>
                <div style={{ color: card.accentColor, fontSize: 34, fontWeight: 950 }}>{String(index + 1).padStart(2, '0')}</div>
              </div>
            );
          })}
        </div>
        {footerLines.length ? (
          <LineStack lines={footerLines} style={{ marginTop: 54, color: 'rgba(255,255,255,0.72)', fontSize: 28, fontWeight: 850, lineHeight: 1.16, textTransform: 'uppercase' }} />
        ) : null}
      </div>
    </AbsoluteFill>
  );
}

function RadialBurstCard({ card, scene, frame, opacity, enter, float, scale }: {
  card: ReelMotionCard;
  scene: ReelScene;
  frame: number;
  opacity: number;
  enter: number;
  float: number;
  scale: number;
}) {
  const headlineLines = textLines(card.headline, card.headlineLines);
  const subheadLines = textLines(card.subhead, card.subheadLines);
  const footerLines = textLines(card.footer, card.footerLines);
  const positions = [
    { top: 256, left: 78, rotate: -11, color: '#fde047' },
    { top: 398, right: 64, rotate: 9, color: '#38bdf8' },
    { bottom: 362, left: 96, rotate: 8, color: '#fb7185' },
    { bottom: 220, right: 84, rotate: -7, color: '#4ade80' },
  ];

  return (
    <AbsoluteFill style={{ fontFamily: 'Inter, Arial, sans-serif', color: '#ffffff' }}>
      <div style={{ position: 'absolute', inset: 0, opacity, transform: `translateY(${enter + float}px) scale(${scale})` }}>
        {[0, 1, 2, 3].map((item) => (
          <div
            key={`radial-line-${item}`}
            style={{
              position: 'absolute',
              left: item % 2 === 0 ? 268 : 512,
              top: item < 2 ? 454 : 902,
              width: 330,
              height: 4,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.24)',
              transform: `rotate(${item % 2 === 0 ? 28 : -28}deg)`,
              transformOrigin: 'center',
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            left: 190,
            top: 500,
            width: 700,
            height: 700,
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
            borderRadius: 999,
            background: 'radial-gradient(circle, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.78) 54%, rgba(255,255,255,0.16) 55%, rgba(255,255,255,0.04) 70%, rgba(255,255,255,0) 71%)',
            boxShadow: '0 30px 90px rgba(0,0,0,0.42)',
          }}
        >
          <div style={{ display: 'grid', gap: 24, padding: '0 72px' }}>
            <div style={{ color: card.accentColor, fontSize: 30, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
            <LineStack lines={headlineLines} style={{ fontSize: 80, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase' }} />
            {subheadLines.length ? (
              <LineStack lines={subheadLines} style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.16, color: 'rgba(255,255,255,0.82)' }} />
            ) : null}
          </div>
        </div>
        {card.bullets.map((bullet, index) => {
          const reveal = revealTiming(frame, scene, index, card.bullets.length);
          const pos = positions[index % positions.length];
          return (
            <div
              key={bullet}
              style={{
                position: 'absolute',
                ...pos,
                opacity: reveal.opacity,
                transform: `rotate(${pos.rotate}deg) translateY(${reveal.y}px) scale(${reveal.scale})`,
                minWidth: 260,
                minHeight: 116,
                display: 'grid',
                placeItems: 'center',
                borderRadius: index % 2 === 0 ? 999 : 24,
                padding: '0 34px',
                background: pos.color,
                color: '#111111',
                fontSize: 38,
                fontWeight: 950,
                boxShadow: '0 18px 44px rgba(0,0,0,0.32)',
                textTransform: 'uppercase',
              }}
            >
              {bullet}
            </div>
          );
        })}
        {footerLines.length ? (
          <LineStack
            lines={footerLines}
            style={{ position: 'absolute', left: 110, right: 110, bottom: 118, textAlign: 'center', color: 'rgba(255,255,255,0.78)', fontSize: 30, fontWeight: 850, lineHeight: 1.16, textTransform: 'uppercase' }}
          />
        ) : null}
      </div>
    </AbsoluteFill>
  );
}

function SplitChecklistCard({ card, scene, frame, opacity, enter, float, scale }: {
  card: ReelMotionCard;
  scene: ReelScene;
  frame: number;
  opacity: number;
  enter: number;
  float: number;
  scale: number;
}) {
  const footerLines = textLines(card.footer, card.footerLines);
  return (
    <AbsoluteFill style={{ fontFamily: 'Inter, Arial, sans-serif', color: '#ffffff', padding: '112px 78px' }}>
      <div style={{ opacity, transform: `translateY(${enter + float}px) scale(${scale})`, position: 'relative', height: '100%' }}>
        <div
          style={{
            position: 'absolute',
            left: 46,
            top: 540,
            bottom: 242,
            width: 16,
            borderRadius: 999,
            background: `linear-gradient(180deg, ${card.accentColor}, rgba(255,255,255,0.16))`,
          }}
        />
        <div style={{ position: 'absolute', left: 0, top: 70, right: 0 }}>
          <ShellText card={card} />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 560, display: 'grid', gap: 34 }}>
          {card.bullets.map((bullet, index) => {
            const reveal = revealTiming(frame, scene, index, card.bullets.length);
            const isEven = index % 2 === 0;
            return (
              <div
                key={bullet}
                style={{
                  opacity: reveal.opacity,
                  transform: `translateX(${interpolate(reveal.opacity, [0, 1], [isEven ? -70 : 70, 0])}px) translateY(${reveal.y}px)`,
                  display: 'grid',
                  gridTemplateColumns: '84px 1fr',
                  alignItems: 'center',
                  gap: 26,
                  marginLeft: isEven ? 0 : 118,
                  width: isEven ? 770 : 650,
                }}
              >
                <div
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: 999,
                    display: 'grid',
                    placeItems: 'center',
                    background: card.accentColor,
                    color: '#111',
                    fontSize: 28,
                    fontWeight: 950,
                    boxShadow: '0 16px 42px rgba(0,0,0,0.34)',
                  }}
                >
                  {index + 1}
                </div>
                <div
                  style={{
                    minHeight: 94,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 32px',
                    borderRadius: isEven ? '28px 28px 28px 8px' : '28px 28px 8px 28px',
                    background: 'rgba(255,255,255,0.14)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    boxShadow: '0 18px 54px rgba(0,0,0,0.28)',
                    fontSize: 42,
                    fontWeight: 950,
                    lineHeight: 1.02,
                    textTransform: 'uppercase',
                  }}
                >
                  {bullet}
                </div>
              </div>
            );
          })}
        </div>
        {footerLines.length ? (
          <LineStack
            lines={footerLines}
            style={{ position: 'absolute', left: 96, right: 96, bottom: 100, color: 'rgba(255,255,255,0.78)', fontSize: 30, fontWeight: 850, lineHeight: 1.16, textAlign: 'center', textTransform: 'uppercase' }}
          />
        ) : null}
      </div>
    </AbsoluteFill>
  );
}

function MotionCardLayer({ card, scene }: { card: ReelMotionCard; scene: ReelScene }) {
  const frame = useCurrentFrame();
  const progress = Math.min(Math.max(frame / Math.max(scene.durationFrames, 1), 0), 1);
  const enter = interpolate(frame, [0, 16, 30], [62, -6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, [0, 10, scene.durationFrames - 12, scene.durationFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const float = Math.sin(progress * Math.PI * 2) * 6;
  const scale = interpolate(frame, [0, 24], [0.97, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const shared = { card, scene, frame, opacity, enter, float, scale };
  const template = cardTemplate(card);

  if (template === 'kinetic_steps') return <KineticStepsCard {...shared} />;
  if (template === 'menu_board') return <MenuBoardCard {...shared} />;
  if (template === 'radial_burst') return <RadialBurstCard {...shared} />;
  if (template === 'split_checklist') return <SplitChecklistCard {...shared} />;
  return <EditorialBoxCard {...shared} />;
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
      {props.scenes.map((scene) => {
        const motionCard = props.motionCards?.find((card) => card.sceneNumber === scene.number);
        return (
          <Sequence key={scene.number} from={scene.startFrame} durationInFrames={scene.durationFrames}>
            <AbsoluteFill>
              {scene.images.map((image, index) => (
                <SceneImage key={`${scene.number}-${image.rank}`} image={image} scene={scene} index={index} total={scene.images.length} />
              ))}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: motionCard
                    ? `rgba(0,0,0,${motionCard.overlayOpacity})`
                    : 'linear-gradient(180deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.05) 42%, rgba(0,0,0,0.66) 100%)',
                }}
              />
              {motionCard ? (
                <MotionCardLayer card={motionCard} scene={scene} />
              ) : scene.number === 1 ? (
                <ThumbnailLayer />
              ) : (
                <CaptionLayer scene={scene} />
              )}
              {scene.number === 1 || motionCard ? null : <TypographyBeat scene={scene} />}
            </AbsoluteFill>
          </Sequence>
        );
      })}
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
