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
type CaptionPlacement = 'default' | 'intro' | 'radialCard' | 'motionRoute' | 'motionStamp' | 'motionReceipt' | 'motionTabs' | 'motionEditorial' | 'motionChecklist' | 'motionMenu' | 'motionLowerBand' | 'motionDefault';

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

function cameraMotionStyle(image: ReelImage, scene: ReelScene, localFrame: number, durationFrames: number, scaleBoost = 1) {
  const progress = Math.min(Math.max(localFrame / Math.max(durationFrames, 1), 0), 1);
  const eased = easeOut(progress);
  const move = image.cameraMove || scene.motion;
  const scale = 1.08 * scaleBoost;

  if (move === 'pan_left') {
    return { transform: `scale(${scale}) translateX(${interpolate(eased, [0, 1], [4.2, -4.2])}%)` };
  }

  if (move === 'pan_right') {
    return { transform: `scale(${scale}) translateX(${interpolate(eased, [0, 1], [-4.2, 4.2])}%)` };
  }

  if (move === 'pan_up') {
    return { transform: `scale(${scale}) translateY(${interpolate(eased, [0, 1], [3.6, -3.6])}%)` };
  }

  if (move === 'pan_down') {
    return { transform: `scale(${scale}) translateY(${interpolate(eased, [0, 1], [-3.6, 3.6])}%)` };
  }

  if (move === 'drift_left') {
    return { transform: `translateX(${interpolate(eased, [0, 1], [22, -22])}px) scale(${interpolate(eased, [0, 1], [0.988, 1.01])})` };
  }

  if (move === 'drift_right') {
    return { transform: `translateX(${interpolate(eased, [0, 1], [-22, 22])}px) scale(${interpolate(eased, [0, 1], [0.988, 1.01])})` };
  }

  if (move === 'drift_up') {
    return { transform: `translateY(${interpolate(eased, [0, 1], [18, -18])}px) scale(${interpolate(eased, [0, 1], [0.988, 1.01])})` };
  }

  if (move === 'drift_down') {
    return { transform: `translateY(${interpolate(eased, [0, 1], [-18, 18])}px) scale(${interpolate(eased, [0, 1], [0.988, 1.01])})` };
  }

  if (move === 'anchor_right') {
    return { transform: `scale(${interpolate(eased, [0, 1], [1.06 * scaleBoost, 1.035 * scaleBoost])}) translateX(-3.8%)` };
  }

  if (move === 'slow_zoom_out') {
    return { transform: `scale(${interpolate(eased, [0, 1], [1.13 * scaleBoost, 1.04 * scaleBoost])})` };
  }

  return motionStyle(scene, localFrame, durationFrames);
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
  const imageSrc = staticAsset(image.staticFilePath);
  const imageMotion = cameraMotionStyle(image, scene, localFrame, imageDuration);
  const backgroundMotion = cameraMotionStyle(image, scene, localFrame, imageDuration, 1.08);
  const shouldContain = image.fitMode === 'contain_frame';
  const shouldFrame16x9 = image.fitMode === 'framed_16_9';

  return (
    <Sequence from={imageStart} durationInFrames={imageDuration + 8}>
      <AbsoluteFill style={{ opacity: stableOpacity, overflow: 'hidden', backgroundColor: '#0f172a' }}>
        {shouldFrame16x9 ? (
          <>
            <Img
              src={imageSrc}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'blur(26px)',
                opacity: 0.48,
                ...backgroundMotion,
              }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,8,13,0.42), rgba(5,8,13,0.18) 42%, rgba(5,8,13,0.78))' }} />
            <div
              style={{
                position: 'absolute',
                left: 64,
                right: 64,
                top: scene.number === 4 ? 382 : 356,
                aspectRatio: '16 / 9',
                borderRadius: 30,
                overflow: 'hidden',
                background: 'rgba(9,13,20,0.86)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 32px 84px rgba(0,0,0,0.46)',
                ...cameraMotionStyle(image, scene, localFrame, imageDuration),
              }}
            >
              <Img
                src={imageSrc}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'blur(18px)',
                  opacity: 0.34,
                  transform: 'scale(1.12)',
                }}
              />
              <Img
                src={imageSrc}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 20px 34px rgba(0,0,0,0.34))',
                }}
              />
            </div>
          </>
        ) : shouldContain ? (
          <>
            <Img
              src={imageSrc}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'blur(24px)',
                opacity: 0.58,
                ...backgroundMotion,
              }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(7,10,16,0.38), rgba(7,10,16,0.76))' }} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '140px 56px 430px',
              }}
            >
              <Img
                src={imageSrc}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 28px 46px rgba(0,0,0,0.48))',
                  ...imageMotion,
                }}
              />
            </div>
          </>
        ) : (
          <Img
            src={imageSrc}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              ...imageMotion,
            }}
          />
        )}
      </AbsoluteFill>
    </Sequence>
  );
}

function motionCaptionPlacement(template: string): CaptionPlacement {
  if (template === 'radial_burst') return 'radialCard';
  if (template === 'morning_route') return 'motionRoute';
  if (template === 'stamp_stack') return 'motionStamp';
  if (template === 'receipt_stack') return 'motionReceipt';
  if (template === 'wrapper_tabs') return 'motionTabs';
  if (template === 'editorial_box') return 'motionEditorial';
  if (template === 'split_checklist') return 'motionChecklist';
  if (template === 'menu_board') return 'motionMenu';
  if (template === 'zone_compare' || template === 'kit_grid') return 'motionLowerBand';
  return 'motionDefault';
}

function CaptionLayer({ scene, compact = false, placement = 'default' }: { scene: ReelScene; compact?: boolean; placement?: CaptionPlacement }) {
  const frame = useCurrentFrame();
  const localFrame = frame;
  const isKoreanFloorThumbnailIntro = scene.number === 1 && /floor is not just floor/i.test(scene.narration);
  const isTempleStayThumbnailIntro = scene.number === 1 && /temple stay is not a spa night/i.test(scene.narration);
  const isTransportThumbnailIntro = scene.number === 1 && /fastest ride is not always the best route/i.test(scene.narration);
  if ((isKoreanFloorThumbnailIntro || isTempleStayThumbnailIntro || isTransportThumbnailIntro) && localFrame < 42) return null;

  const isReadableBand = scene.captionStyle === 'readable_band';
  const isOndolInfoCardCaption = scene.number === 3
    && /Ondol made warm floors normal/i.test(scene.narration)
    && scene.images.length > 1
    && localFrame >= Math.floor(scene.durationFrames / scene.images.length) - 8;
  const isIntro = placement === 'intro';
  const isRadialCard = placement === 'radialCard';
  const isMotionPlaced = compact && ['motionRoute', 'motionStamp', 'motionReceipt', 'motionTabs', 'motionEditorial', 'motionChecklist', 'motionMenu', 'motionLowerBand', 'motionDefault'].includes(placement);
  const isTopPlaced = isIntro || isRadialCard || isMotionPlaced;
  const isStationFirstMotionCaption = compact && placement === 'motionMenu' && /Pick by station first/i.test(scene.narration);
  const isLoweredMenuBoardCaption = compact
    && placement === 'motionMenu'
    && (/Use the first bowl rule/i.test(scene.narration) || /Check five things/i.test(scene.narration));
  const captionLeadFrames = scene.captionLeadFrames ?? 6;
  const ledFrame = Math.min(scene.durationFrames - 1, localFrame + captionLeadFrames);
  const beatStarts = scene.captionBeatStartFrames?.length === scene.captionBeats.length
    ? scene.captionBeatStartFrames
    : scene.captionBeats.map((_, index) => Math.floor((index / Math.max(scene.captionBeats.length, 1)) * scene.durationFrames));
  const activeBeat = Math.max(
    0,
    beatStarts.findIndex((start, index) => ledFrame >= start && ledFrame < (beatStarts[index + 1] ?? scene.durationFrames)),
  );
  const beatStart = beatStarts[activeBeat] ?? 0;
  const beatEnd = beatStarts[activeBeat + 1] ?? scene.durationFrames;
  const beatDuration = Math.max(15, beatEnd - beatStart);
  const beatFrame = Math.max(0, ledFrame - beatStart);
  const rawCaptionText = scene.captionBeats[activeBeat] ?? '';
  const captionText = /^epickor dot com\.?$/i.test(rawCaptionText.trim()) ? 'epicKor.com' : rawCaptionText;
  const isDomainCaption = /^epickor\.com$/i.test(captionText);
  const pop = isReadableBand ? 1 : interpolate(beatFrame, [0, 4, 10], [0.96, 1.04, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const captionLayout: Record<CaptionPlacement, { justifyContent: CSSProperties['justifyContent']; padding: string; maxWidth: number; fontSize: number; lineHeight: number }> = {
    default: { justifyContent: 'center', padding: '0 82px', maxWidth: 960, fontSize: 56, lineHeight: 1.02 },
    intro: { justifyContent: 'flex-end', padding: '0 84px 360px', maxWidth: 900, fontSize: 36, lineHeight: 1.08 },
    radialCard: { justifyContent: 'flex-start', padding: '1248px 118px 0', maxWidth: 780, fontSize: 44, lineHeight: 1.08 },
    motionRoute: { justifyContent: 'flex-start', padding: '1288px 112px 0', maxWidth: 856, fontSize: 54, lineHeight: 1.06 },
    motionStamp: { justifyContent: 'flex-start', padding: '1228px 112px 0', maxWidth: 856, fontSize: 54, lineHeight: 1.06 },
    motionReceipt: { justifyContent: 'flex-start', padding: '1210px 116px 0', maxWidth: 850, fontSize: 54, lineHeight: 1.06 },
    motionTabs: { justifyContent: 'flex-start', padding: '1362px 112px 0', maxWidth: 856, fontSize: 48, lineHeight: 1.06 },
    motionEditorial: { justifyContent: 'flex-start', padding: '1368px 112px 0', maxWidth: 856, fontSize: 48, lineHeight: 1.06 },
    motionChecklist: { justifyContent: 'flex-start', padding: '1348px 112px 0', maxWidth: 856, fontSize: 48, lineHeight: 1.06 },
    motionMenu: { justifyContent: 'flex-start', padding: '232px 112px 0', maxWidth: 856, fontSize: 44, lineHeight: 1.06 },
    motionLowerBand: { justifyContent: 'flex-start', padding: '1374px 112px 0', maxWidth: 856, fontSize: 48, lineHeight: 1.06 },
    motionDefault: { justifyContent: 'flex-start', padding: '1328px 112px 0', maxWidth: 856, fontSize: 48, lineHeight: 1.06 },
  };
  const layout = isReadableBand
    ? isOndolInfoCardCaption
      ? {
          justifyContent: 'flex-end' as CSSProperties['justifyContent'],
          padding: '0 72px 108px',
          maxWidth: 920,
          fontSize: 44,
          lineHeight: 1.12,
        }
      : placement === 'motionStamp'
      ? {
          justifyContent: 'flex-start' as CSSProperties['justifyContent'],
          padding: '1120px 72px 0',
          maxWidth: 900,
          fontSize: 44,
          lineHeight: 1.14,
        }
      : isStationFirstMotionCaption
      ? {
          justifyContent: 'flex-end' as CSSProperties['justifyContent'],
          padding: '0 72px 214px',
          maxWidth: 900,
          fontSize: 44,
          lineHeight: 1.14,
        }
      : isLoweredMenuBoardCaption
      ? {
          justifyContent: 'flex-end' as CSSProperties['justifyContent'],
          padding: '0 72px 180px',
          maxWidth: 900,
          fontSize: 44,
          lineHeight: 1.14,
        }
      : {
          justifyContent: 'flex-end' as CSSProperties['justifyContent'],
          padding: compact ? '0 72px 392px' : '0 72px 420px',
          maxWidth: 920,
          fontSize: compact ? 46 : 50,
          lineHeight: 1.14,
        }
    : captionLayout[placement];

  return (
    <AbsoluteFill
      style={{
        justifyContent: layout.justifyContent,
        alignItems: 'center',
        padding: layout.padding,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          transform: `scale(${pop})`,
          color: '#ffffff',
          fontFamily: 'Inter, Arial, sans-serif',
          fontSize: layout.fontSize,
          fontWeight: isReadableBand ? 820 : 900,
          lineHeight: layout.lineHeight,
          textAlign: 'center',
          textShadow: isReadableBand ? '0 4px 16px rgba(0,0,0,0.62)' : '0 8px 28px rgba(0,0,0,0.75)',
          textTransform: isReadableBand || isDomainCaption || isIntro || compact || isRadialCard ? 'none' : 'uppercase',
          maxWidth: layout.maxWidth,
          whiteSpace: isReadableBand ? 'pre-line' : 'nowrap',
          padding: isReadableBand ? '24px 30px' : isTopPlaced ? '14px 24px' : compact ? '16px 22px' : undefined,
          borderRadius: isReadableBand ? 24 : isTopPlaced ? 18 : compact ? 18 : undefined,
          background: isReadableBand
            ? 'linear-gradient(180deg, rgba(8,12,18,0.76), rgba(8,12,18,0.88))'
            : isTopPlaced
              ? 'rgba(0,0,0,0.5)'
              : compact
                ? 'rgba(0,0,0,0.42)'
                : undefined,
          border: isReadableBand ? '1px solid rgba(255,255,255,0.18)' : undefined,
          boxShadow: isReadableBand ? '0 18px 48px rgba(0,0,0,0.34)' : undefined,
          display: isReadableBand ? '-webkit-box' : undefined,
          WebkitBoxOrient: isReadableBand ? 'vertical' : undefined,
          WebkitLineClamp: isReadableBand ? 2 : undefined,
          overflow: isReadableBand ? 'hidden' : undefined,
        }}
      >
        {captionText}
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
  const beat = scene.typographyBeats[0];
  const isFinalCta = /EpicKor\.com/i.test(scene.narration) || /final CTA/i.test(beat.emphasis || '');
  if (isFinalCta) return null;
  const lines = typographyLines(beat.text);
  const textLength = lines.join('').length;
  const bottomPadding = 500;
  const fontSize = textLength > 24 || lines.length > 1 ? (isFinalCta ? 46 : 54) : (isFinalCta ? 62 : 66);

  return (
    <AbsoluteFill
      style={{
        justifyContent: isFinalCta ? 'flex-end' : 'flex-start',
        alignItems: 'center',
        padding: isFinalCta ? `0 82px ${bottomPadding}px` : '650px 82px 0',
        pointerEvents: 'none',
      }}
    >
      <LineStack
        lines={lines}
        style={{
          color: '#facc15',
          fontFamily: 'Inter, Arial, sans-serif',
          fontSize,
          fontWeight: 950,
          lineHeight: lines.length > 1 ? 0.94 : 1,
          textAlign: 'center',
          textShadow: '0 8px 24px rgba(0,0,0,0.82)',
          textTransform: 'uppercase',
          maxWidth: 860,
        }}
      />
    </AbsoluteFill>
  );
}

function cardTemplate(card: ReelMotionCard) {
  return card.templateId || card.layout || 'editorial_box';
}

function bulletRevealStartFrame(card: ReelMotionCard | undefined, scene: ReelScene, index: number, total: number) {
  const overrides: Record<string, number[]> = {
    '173-2-motion-b': [22, 38, 54],
    '173-4-motion-a': [108, 125, 143, 165],
    '173-6-motion-a': [58, 88, 126, 154],
    '190-card-save-numbers-menu': [-12, 18, 40],
    '190-card-right-door-menu': [-12, 16, 34],
    '197-card-survival-kit-checklist': [-10, -2, 6, 14, 22],
    '198-card-dress-dry-kit-grid': [-8, 3, 12, 21],
    '198-card-tiny-bag-kit-grid': [-8, 8, 24, 40],
    '229-card-three-zone-rule': [-8, 8, 24],
    '228-card-program-picker': [-8, 6, 20, 34],
    '228-card-quiet-checklist': [-8, 4, 16, 28],
    '225-card-station-first': [-8, 4, 16, 28],
    '225-card-door-to-door-check': [-8, 2, 12, 22, 34],
  };
  const start = card?.id ? overrides[card.id]?.[index] : undefined;
  if (typeof start === 'number') return Math.min(scene.durationFrames - 18, Math.max(-12, start));

  const available = Math.max(30, scene.durationFrames - 58);
  return Math.round(20 + (index / Math.max(total, 1)) * available);
}

function revealTiming(frame: number, scene: ReelScene, index: number, total: number, card?: ReelMotionCard) {
  const start = bulletRevealStartFrame(card, scene, index, total);
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

function typographyLines(text: string) {
  const explicit = textLines(text);
  if (explicit.length > 1) return explicit;
  if (text.includes(',') && text.length > 18) {
    return text.split(',').map((line) => line.trim()).filter(Boolean);
  }
  return explicit;
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
  const headlineChars = headlineLines.join('').length;
  const headlineFontSize = compact
    ? headlineLines.length > 2 || headlineChars > 30
      ? 54
      : 62
    : headlineLines.length > 2
      ? 58
      : headlineChars > 30
        ? 62
        : 78;
  const subheadFontSize = compact ? 28 : subheadLines.length > 1 ? 30 : 34;
  return (
    <div style={{ display: 'grid', gap: compact ? 16 : 22 }}>
      <div style={{ color: card.accentColor, fontSize: compact ? 24 : 28, fontWeight: 950, textTransform: 'uppercase' }}>
        {card.kicker}
      </div>
      <LineStack
        lines={headlineLines}
        style={{
          color: '#ffffff',
          fontSize: headlineFontSize,
          fontWeight: 950,
          lineHeight: 0.94,
          textTransform: 'uppercase',
        }}
      />
      {subheadLines.length ? (
        <LineStack lines={subheadLines} style={{ color: 'rgba(255,255,255,0.83)', fontSize: subheadFontSize, fontWeight: 760, lineHeight: 1.14 }} />
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
  const headlineLines = textLines(card.headline, card.headlineLines);
  const subheadLines = textLines(card.subhead, card.subheadLines);
  const headlineChars = headlineLines.join('').length;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', padding: '118px 78px 0' }}>
      <div
        style={{
          width: 860,
          height: 1158,
          opacity,
          transform: `translateY(${enter + float}px) scale(${scale})`,
          borderRadius: 36,
          border: '2px solid rgba(255,255,255,0.22)',
          background: 'linear-gradient(180deg, rgba(13,18,28,0.94), rgba(12,18,26,0.82))',
          boxShadow: '0 34px 90px rgba(0,0,0,0.48)',
          color: '#ffffff',
          overflow: 'hidden',
          fontFamily: 'Inter, Arial, sans-serif',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 14, background: card.accentColor }} />
        <div style={{ position: 'absolute', left: 54, right: 54, top: 58, display: 'grid', gridTemplateColumns: '1fr auto', gap: 26, alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ color: card.accentColor, fontSize: 28, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
            <LineStack
              lines={headlineLines}
              style={{
                color: '#ffffff',
                fontSize: headlineChars > 26 ? 58 : 70,
                fontWeight: 950,
                lineHeight: 0.9,
                textTransform: 'uppercase',
              }}
            />
            {subheadLines.length ? (
              <LineStack lines={subheadLines} style={{ color: 'rgba(255,255,255,0.84)', fontSize: 30, fontWeight: 820, lineHeight: 1.14 }} />
            ) : null}
          </div>
          <div style={{ display: 'grid', placeItems: 'center', width: 112, height: 112, borderRadius: 26, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.16)', color: 'rgba(255,255,255,0.82)', fontSize: 24, fontWeight: 950 }}>
            EPIC
          </div>
        </div>
        <div style={{ position: 'absolute', left: 54, right: 54, top: 410, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {card.bullets.slice(0, 4).map((bullet, index) => {
            const reveal = revealTiming(frame, scene, index, card.bullets.length, card);
            return (
              <div
                key={bullet}
                style={{
                  minHeight: 210,
                  opacity: reveal.opacity,
                  transform: `translateY(${reveal.y}px) scale(${reveal.scale})`,
                  display: 'grid',
                  alignContent: 'space-between',
                  gap: 18,
                  borderRadius: 26,
                  padding: '28px 28px 26px',
                  background: index === 0 ? card.accentColor : 'rgba(255,255,255,0.12)',
                  color: index === 0 ? '#111827' : '#ffffff',
                  border: '1px solid rgba(255,255,255,0.18)',
                  boxShadow: '0 18px 48px rgba(0,0,0,0.22)',
                }}
              >
                <div style={{ width: 58, height: 58, borderRadius: 999, display: 'grid', placeItems: 'center', background: index === 0 ? '#111827' : card.accentColor, color: index === 0 ? '#ffffff' : '#111827', fontSize: 24, fontWeight: 950 }}>
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div style={{ fontSize: String(bullet).length > 12 ? 34 : 40, fontWeight: 950, lineHeight: 0.98, textTransform: 'uppercase' }}>{bullet}</div>
              </div>
            );
          })}
        </div>
        {footerLines.length ? (
          <LineStack
            lines={footerLines}
            style={{
              position: 'absolute',
              left: 54,
              right: 54,
              bottom: 52,
              color: 'rgba(255,255,255,0.76)',
              fontSize: 28,
              fontWeight: 850,
              lineHeight: 1.14,
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          />
        ) : null}
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
  const headlineLines = textLines(card.headline, card.headlineLines);
  const subheadLines = textLines(card.subhead, card.subheadLines);
  const footerLines = textLines(card.footer, card.footerLines);

  return (
    <AbsoluteFill style={{ padding: '116px 78px', fontFamily: 'Inter, Arial, sans-serif', color: '#ffffff' }}>
      <div style={{ opacity, transform: `translateY(${enter + float}px) scale(${scale})`, position: 'relative', height: '100%', borderRadius: 42, background: 'linear-gradient(180deg, rgba(15,23,42,0.93), rgba(15,23,42,0.82))', border: '3px solid rgba(255,255,255,0.2)', boxShadow: '0 34px 90px rgba(0,0,0,0.42)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 54, right: 54, top: 60, display: 'grid', gap: 18 }}>
          <div style={{ color: card.accentColor, fontSize: 30, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
          <LineStack lines={headlineLines} style={{ fontSize: headlineLines.join('').length > 34 ? 62 : 76, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase' }} />
          {subheadLines.length ? (
            <LineStack lines={subheadLines} style={{ color: 'rgba(255,255,255,0.84)', fontSize: 30, fontWeight: 820, lineHeight: 1.12 }} />
          ) : null}
        </div>
        <div style={{ position: 'absolute', left: 54, right: 54, top: 510, display: 'grid', gap: 28 }}>
          {card.bullets.map((bullet, index) => {
            const reveal = revealTiming(frame, scene, index, card.bullets.length, card);
            return (
              <div
                key={bullet}
                style={{
                  opacity: reveal.opacity,
                  transform: `translateX(${interpolate(reveal.opacity, [0, 1], [-80, 0])}px) translateY(${reveal.y}px) scale(${reveal.scale})`,
                  display: 'grid',
                  gridTemplateColumns: '78px 1fr',
                  alignItems: 'center',
                  gap: 24,
                  minHeight: 132,
                  borderRadius: 30,
                  padding: '0 30px',
                  color: index === 0 ? '#111827' : '#ffffff',
                  background: index === 0 ? card.accentColor : 'rgba(255,255,255,0.16)',
                  boxShadow: '0 18px 48px rgba(0,0,0,0.28)',
                  border: '1px solid rgba(255,255,255,0.16)',
                }}
              >
                <div style={{ width: 66, height: 66, borderRadius: 999, display: 'grid', placeItems: 'center', background: index === 0 ? '#111827' : card.accentColor, color: index === 0 ? '#ffffff' : '#111827', fontSize: 28, fontWeight: 950 }}>
                  {index + 1}
                </div>
                <div style={{ fontSize: 45, fontWeight: 950, lineHeight: 0.96, textTransform: 'uppercase' }}>{bullet}</div>
              </div>
            );
          })}
        </div>
        {footerLines.length ? (
          <LineStack lines={footerLines} style={{ position: 'absolute', left: 70, right: 70, bottom: 72, color: 'rgba(255,255,255,0.78)', fontSize: 30, fontWeight: 850, lineHeight: 1.16, textAlign: 'center', textTransform: 'uppercase' }} />
        ) : null}
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
  const headlineLines = textLines(card.headline, card.headlineLines);
  const subheadLines = textLines(card.subhead, card.subheadLines);

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: '110px 78px', fontFamily: 'Inter, Arial, sans-serif' }}>
      <div
        style={{
          opacity,
          transform: `rotate(-1.5deg) translateY(${enter + float}px) scale(${scale})`,
          width: 850,
          height: 1280,
          padding: '0 58px',
          borderRadius: 12,
          color: '#ffffff',
          background: 'linear-gradient(180deg, rgba(32,20,22,0.97), rgba(14,14,16,0.94))',
          border: `10px solid ${card.accentColor}`,
          boxShadow: '0 36px 96px rgba(0,0,0,0.5)',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', left: 58, right: 58, top: 58, display: 'grid', gap: 18 }}>
          <div style={{ color: card.accentColor, fontSize: 28, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
          <LineStack lines={headlineLines} style={{ fontSize: headlineLines.join('').length > 34 ? 62 : 72, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase' }} />
          {subheadLines.length ? (
            <LineStack lines={subheadLines} style={{ color: 'rgba(255,255,255,0.84)', fontSize: 30, fontWeight: 820, lineHeight: 1.12 }} />
          ) : null}
        </div>
        <div style={{ position: 'absolute', left: 58, right: 58, top: 500, display: 'grid', gap: 20 }}>
          {card.bullets.map((bullet, index) => {
            const reveal = revealTiming(frame, scene, index, card.bullets.length, card);
            return (
              <div
                key={bullet}
                style={{
                  opacity: reveal.opacity,
                  transform: `translateX(${interpolate(reveal.opacity, [0, 1], [80, 0])}px) translateY(${reveal.y}px) scale(${reveal.scale})`,
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  minHeight: 104,
                  padding: '0 28px',
                  borderRadius: 24,
                  background: index === 0 ? card.accentColor : 'rgba(255,255,255,0.13)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: index === 0 ? '#111827' : '#ffffff',
                  boxShadow: '0 18px 48px rgba(0,0,0,0.24)',
                }}
              >
                <div style={{ fontSize: String(bullet).length > 12 ? 38 : 42, fontWeight: 950, lineHeight: 0.96, textTransform: 'uppercase' }}>{bullet}</div>
                <div style={{ width: 56, height: 56, display: 'grid', placeItems: 'center', borderRadius: 999, background: index === 0 ? '#111827' : card.accentColor, color: index === 0 ? '#ffffff' : '#111827', fontSize: 24, fontWeight: 950 }}>{String(index + 1).padStart(2, '0')}</div>
              </div>
            );
          })}
        </div>
        {footerLines.length ? (
          <LineStack lines={footerLines} style={{ position: 'absolute', left: 58, right: 58, bottom: 46, color: 'rgba(255,255,255,0.72)', fontSize: 24, fontWeight: 850, lineHeight: 1.14, textTransform: 'uppercase' }} />
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
  const headlineChars = headlineLines.join('').length;
  const maxHeadlineLineChars = headlineLines.reduce((max, line) => Math.max(max, line.length), 0);
  const headlineFontSize = headlineLines.length > 3
    ? 56
    : headlineLines.length > 2 || maxHeadlineLineChars > 10 || headlineChars > 24
      ? 64
      : 76;
  const positions = [
    { top: 224, left: 78, rotate: -11, color: '#fde047' },
    { top: 340, right: 64, rotate: 9, color: '#38bdf8' },
    { bottom: 420, left: 92, rotate: 8, color: '#fb7185' },
    { bottom: 250, right: 84, rotate: -7, color: '#4ade80' },
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
            top: 470,
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
          <div style={{ display: 'grid', gap: 18, padding: '0 82px' }}>
            <div style={{ color: card.accentColor, fontSize: 30, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
            <LineStack lines={headlineLines} style={{ fontSize: headlineFontSize, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase', whiteSpace: 'nowrap' }} />
            {subheadLines.length ? (
              <LineStack lines={subheadLines} style={{ fontSize: subheadLines.length > 1 ? 28 : 32, fontWeight: 800, lineHeight: 1.16, color: 'rgba(255,255,255,0.82)' }} />
            ) : null}
          </div>
        </div>
        {card.bullets.map((bullet, index) => {
          const reveal = revealTiming(frame, scene, index, card.bullets.length, card);
          const pos = positions[index % positions.length];
          return (
            <div
              key={bullet}
              style={{
                position: 'absolute',
                ...pos,
                opacity: reveal.opacity,
                transform: `rotate(${pos.rotate}deg) translateY(${reveal.y}px) scale(${reveal.scale})`,
                minWidth: 238,
                minHeight: 102,
                display: 'grid',
                placeItems: 'center',
                borderRadius: index % 2 === 0 ? 999 : 24,
                padding: '0 34px',
                background: pos.color,
                color: '#111111',
                fontSize: String(bullet).length > 8 ? 32 : 36,
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
  const headlineLines = textLines(card.headline, card.headlineLines);
  const subheadLines = textLines(card.subhead, card.subheadLines);
  return (
    <AbsoluteFill style={{ fontFamily: 'Inter, Arial, sans-serif', color: '#ffffff', padding: '118px 78px 0' }}>
      <div style={{ opacity, transform: `translateY(${enter + float}px) scale(${scale})`, position: 'relative', height: 1190 }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, display: 'grid', gridTemplateColumns: '0.92fr 1fr', gap: 32, alignItems: 'end' }}>
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ color: card.accentColor, fontSize: 30, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
            <LineStack lines={headlineLines} style={{ color: '#ffffff', fontSize: headlineLines.join('').length > 24 ? 62 : 74, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase' }} />
          </div>
          {subheadLines.length ? (
            <LineStack lines={subheadLines} style={{ color: 'rgba(255,255,255,0.84)', fontSize: 31, fontWeight: 820, lineHeight: 1.12, paddingBottom: 8 }} />
          ) : null}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 36,
            top: 360,
            bottom: 168,
            width: 14,
            borderRadius: 999,
            background: `linear-gradient(180deg, ${card.accentColor}, rgba(255,255,255,0.16))`,
          }}
        />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 332, display: 'grid', gap: 24 }}>
          {card.bullets.map((bullet, index) => {
            const reveal = revealTiming(frame, scene, index, card.bullets.length, card);
            const isEven = index % 2 === 0;
            return (
              <div
                key={bullet}
                style={{
                  opacity: reveal.opacity,
                  transform: `translateX(${interpolate(reveal.opacity, [0, 1], [isEven ? -70 : 70, 0])}px) translateY(${reveal.y}px)`,
                  display: 'grid',
                  gridTemplateColumns: '78px 1fr',
                  alignItems: 'center',
                  gap: 24,
                  marginLeft: isEven ? 0 : 112,
                  width: isEven ? 790 : 680,
                }}
              >
                <div
                  style={{
                    width: 78,
                    height: 78,
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
                    minHeight: 118,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 34px',
                    borderRadius: isEven ? '28px 28px 28px 8px' : '28px 28px 8px 28px',
                    background: index === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.14)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 18px 54px rgba(0,0,0,0.28)',
                    fontSize: String(bullet).length > 13 ? 38 : 44,
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
            style={{ position: 'absolute', left: 96, right: 96, bottom: 24, color: 'rgba(255,255,255,0.78)', fontSize: 28, fontWeight: 850, lineHeight: 1.16, textAlign: 'center', textTransform: 'uppercase' }}
          />
        ) : null}
      </div>
    </AbsoluteFill>
  );
}

function ConvenienceTrayCard({ card, scene, frame, opacity, enter, float, scale }: {
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
  const colors = ['#fff7d6', '#d8f3ee', '#ffe1d2', '#eef2ff', '#fef3c7'];

  return (
    <AbsoluteFill style={{ fontFamily: 'Inter, Arial, sans-serif', color: '#17201c', padding: '0 72px', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          opacity,
          transform: `translateY(${enter + float}px) scale(${scale})`,
          width: '100%',
          height: 1080,
          borderRadius: 42,
          background: 'linear-gradient(180deg, rgba(255,250,235,0.96), rgba(238,247,244,0.94))',
          border: '3px solid rgba(255,255,255,0.72)',
          boxShadow: '0 34px 90px rgba(0,0,0,0.42)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div style={{ height: 56, background: `repeating-linear-gradient(90deg, ${card.accentColor} 0 18px, #10231f 18px 28px)` }} />
        <div style={{ padding: '44px 52px 0', display: 'grid', gap: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'center' }}>
            <div style={{ color: card.accentColor, fontSize: 28, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
            <div style={{ fontSize: 28, fontWeight: 950, color: '#24312d' }}>07:42 AM</div>
          </div>
          <LineStack lines={headlineLines} style={{ color: '#10231f', fontSize: 76, fontWeight: 950, lineHeight: 0.91, textTransform: 'uppercase' }} />
          {subheadLines.length ? (
            <LineStack lines={subheadLines} style={{ color: '#36413d', fontSize: 32, fontWeight: 820, lineHeight: 1.12 }} />
          ) : null}
        </div>
        <div style={{ position: 'absolute', left: 52, right: 52, top: 400, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {card.bullets.map((bullet, index) => {
            const reveal = revealTiming(frame, scene, index, card.bullets.length, card);
            const itemOpacity = 0.2 + reveal.opacity * 0.8;
            return (
              <div
                key={bullet}
                style={{
                  minHeight: index === 0 ? 184 : 150,
                  gridColumn: index === 0 ? 'span 2' : 'span 1',
                  opacity: itemOpacity,
                  transform: `translateY(${reveal.y}px) scale(${reveal.scale})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 18,
                  borderRadius: 24,
                  padding: '0 32px',
                  background: colors[index % colors.length],
                  border: '2px solid rgba(16,35,31,0.12)',
                  boxShadow: '0 14px 34px rgba(16,35,31,0.12)',
                }}
              >
                <div style={{ fontSize: index === 0 ? 62 : 43, fontWeight: 950, lineHeight: 1, textTransform: 'uppercase' }}>{bullet}</div>
                <div style={{ width: 54, height: 54, display: 'grid', placeItems: 'center', borderRadius: 12, color: '#fffaf0', background: '#10231f', fontSize: 24, fontWeight: 950 }}>
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

function MorningRouteCard({ card, scene, frame, opacity, enter, float, scale }: {
  card: ReelMotionCard;
  scene: ReelScene;
  frame: number;
  opacity: number;
  enter: number;
  float: number;
  scale: number;
}) {
  const footerLines = textLines(card.footer, card.footerLines);
  const headlineLines = textLines(card.headline, card.headlineLines);
  const subheadLines = textLines(card.subhead, card.subheadLines);

  return (
    <AbsoluteFill style={{ fontFamily: 'Inter, Arial, sans-serif', color: '#ffffff', padding: '118px 80px' }}>
      <div style={{ opacity, transform: `translateY(${enter + float}px) scale(${scale})`, position: 'relative', height: '100%' }}>
        <div style={{ position: 'absolute', top: 72, left: 0, right: 0, display: 'grid', gap: 18 }}>
          <div style={{ color: card.accentColor, fontSize: 30, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
          <LineStack lines={headlineLines} style={{ fontSize: headlineLines.join('').length > 34 ? 62 : 74, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase' }} />
          {subheadLines.length ? (
            <LineStack lines={subheadLines} style={{ color: 'rgba(255,255,255,0.84)', fontSize: 30, fontWeight: 820, lineHeight: 1.12 }} />
          ) : null}
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 520, display: 'grid', gap: 30 }}>
          {card.bullets.map((bullet, index) => {
            const reveal = revealTiming(frame, scene, index, card.bullets.length, card);
            const parts = bullet.split('->').map((part) => part.trim());
            return (
              <div
                key={bullet}
                style={{
                  opacity: reveal.opacity,
                  transform: `translateX(${interpolate(reveal.opacity, [0, 1], [70, 0])}px) translateY(${reveal.y}px) scale(${reveal.scale})`,
                  display: 'grid',
                  gridTemplateColumns: '82px 1fr',
                  gap: 22,
                  alignItems: 'center',
                  minHeight: 138,
                  padding: '0 28px',
                  borderRadius: 30,
                  background: index === 0 ? card.accentColor : 'rgba(255,255,255,0.17)',
                  color: index === 0 ? '#111827' : '#ffffff',
                  border: '1px solid rgba(255,255,255,0.22)',
                  boxShadow: '0 22px 58px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{ width: 72, height: 72, display: 'grid', placeItems: 'center', borderRadius: 999, background: index === 0 ? '#111827' : card.accentColor, color: index === 0 ? '#ffffff' : '#111827', fontSize: 28, fontWeight: 950 }}>
                  {index + 1}
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                  <div style={{ fontSize: 45, fontWeight: 950, lineHeight: 0.94, textTransform: 'uppercase' }}>{parts[0]}</div>
                  {parts[1] ? <div style={{ fontSize: 28, fontWeight: 850, lineHeight: 1, opacity: 0.82, textTransform: 'uppercase' }}>{parts[1]}</div> : null}
                </div>
              </div>
            );
          })}
        </div>
        {footerLines.length ? (
          <LineStack lines={footerLines} style={{ position: 'absolute', left: 68, right: 68, bottom: 96, color: 'rgba(255,255,255,0.78)', fontSize: 30, fontWeight: 850, lineHeight: 1.16, textAlign: 'center', textTransform: 'uppercase' }} />
        ) : null}
      </div>
    </AbsoluteFill>
  );
}

function WrapperTabsCard({ card, scene, frame, opacity, enter, float, scale }: {
  card: ReelMotionCard;
  scene: ReelScene;
  frame: number;
  opacity: number;
  enter: number;
  float: number;
  scale: number;
}) {
  const footerLines = textLines(card.footer, card.footerLines);
  const headlineLines = textLines(card.headline, card.headlineLines);
  const subheadLines = textLines(card.subhead, card.subheadLines);

  return (
    <AbsoluteFill style={{ fontFamily: 'Inter, Arial, sans-serif', color: '#ffffff', padding: '116px 74px' }}>
      <div style={{ opacity, transform: `translateY(${enter + float}px) scale(${scale})`, position: 'relative', height: '100%' }}>
        <div style={{ position: 'absolute', inset: '44px 22px 124px', borderRadius: 42, background: 'linear-gradient(180deg, rgba(15,23,42,0.94), rgba(15,23,42,0.82))', border: '3px solid rgba(255,255,255,0.2)', boxShadow: '0 34px 90px rgba(0,0,0,0.42)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 50, right: 50, top: 56, display: 'grid', gap: 18 }}>
            <div style={{ color: card.accentColor, fontSize: 30, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
            <LineStack lines={headlineLines} style={{ fontSize: headlineLines.join('').length > 34 ? 62 : 76, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase' }} />
            {subheadLines.length ? (
              <LineStack lines={subheadLines} style={{ color: 'rgba(255,255,255,0.84)', fontSize: 30, fontWeight: 820, lineHeight: 1.12 }} />
            ) : null}
          </div>
          <div style={{ position: 'absolute', left: 50, right: 50, top: 500, display: 'grid', gap: 30 }}>
          {card.bullets.map((bullet, index) => {
            const reveal = revealTiming(frame, scene, index, card.bullets.length, card);
            return (
              <div
                key={bullet}
                style={{
                  opacity: reveal.opacity,
                  transform: `translateY(${reveal.y}px) scale(${reveal.scale})`,
                  display: 'grid',
                  gridTemplateColumns: '78px 1fr',
                  alignItems: 'center',
                  gap: 24,
                  minHeight: 138,
                  padding: '0 30px',
                  borderRadius: 30,
                  background: index === 0 ? card.accentColor : '#ffffff',
                  color: index === 0 ? '#111827' : '#10231f',
                  border: '2px solid rgba(255,255,255,0.16)',
                  boxShadow: '0 18px 48px rgba(0,0,0,0.24)',
                }}
              >
                <div style={{ width: 66, height: 66, display: 'grid', placeItems: 'center', borderRadius: 999, background: index === 0 ? '#111827' : card.accentColor, color: index === 0 ? '#ffffff' : '#111827', fontSize: 28, fontWeight: 950 }}>{index + 1}</div>
                <div style={{ fontSize: 44, fontWeight: 950, lineHeight: 0.96, textTransform: 'uppercase' }}>{bullet}</div>
              </div>
            );
          })}
          </div>
        </div>
        {footerLines.length ? (
          <LineStack lines={footerLines} style={{ position: 'absolute', left: 80, right: 80, bottom: 74, color: 'rgba(255,255,255,0.82)', fontSize: 30, fontWeight: 850, lineHeight: 1.16, textAlign: 'center', textTransform: 'uppercase' }} />
        ) : null}
      </div>
    </AbsoluteFill>
  );
}

function ReceiptStackCard({ card, scene, frame, opacity, enter, float, scale }: {
  card: ReelMotionCard;
  scene: ReelScene;
  frame: number;
  opacity: number;
  enter: number;
  float: number;
  scale: number;
}) {
  const footerLines = textLines(card.footer, card.footerLines);
  const headlineLines = textLines(card.headline, card.headlineLines);
  const subheadLines = textLines(card.subhead, card.subheadLines);

  return (
    <AbsoluteFill style={{ fontFamily: 'Inter, Arial, sans-serif', color: '#1c1917', padding: '112px 78px' }}>
      <div
        style={{
          opacity,
          transform: `translateY(${enter + float}px) scale(${scale}) rotate(1deg)`,
          height: '100%',
          borderRadius: 18,
          background: 'linear-gradient(180deg, #fffaf0, #f8efe0)',
          boxShadow: '0 34px 90px rgba(0,0,0,0.46)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 36, background: `repeating-linear-gradient(90deg, transparent 0 22px, rgba(28,25,23,0.12) 22px 30px)` }} />
        <div style={{ padding: '82px 58px 48px', display: 'grid', gap: 22 }}>
          <div style={{ color: card.accentColor, fontSize: 28, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
          <LineStack lines={headlineLines} style={{ color: '#1c1917', fontSize: 76, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase' }} />
          {subheadLines.length ? (
            <LineStack lines={subheadLines} style={{ color: '#57534e', fontSize: 32, fontWeight: 820, lineHeight: 1.13 }} />
          ) : null}
        </div>
        <div style={{ position: 'absolute', left: 58, right: 58, top: 548, display: 'grid', gap: 18 }}>
          {card.bullets.map((bullet, index) => {
            const reveal = revealTiming(frame, scene, index, card.bullets.length, card);
            return (
              <div
                key={bullet}
                style={{
                  opacity: reveal.opacity,
                  transform: `translateY(${reveal.y}px)`,
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  minHeight: 92,
                  borderBottom: '3px dotted rgba(28,25,23,0.25)',
                  color: '#1c1917',
                }}
              >
                <div style={{ fontSize: 42, fontWeight: 950, lineHeight: 1, textTransform: 'uppercase' }}>{bullet}</div>
                <div style={{ fontSize: 34, fontWeight: 950, color: card.accentColor }}>{String(index + 1).padStart(2, '0')}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', left: 58, right: 58, bottom: 184, height: 82, display: 'grid', placeItems: 'center', color: '#1c1917', fontSize: 30, fontWeight: 950, letterSpacing: 0, background: 'repeating-linear-gradient(90deg, #1c1917 0 8px, transparent 8px 14px)' }} />
        {footerLines.length ? (
          <LineStack lines={footerLines} style={{ position: 'absolute', left: 58, right: 58, bottom: 70, color: '#57534e', fontSize: 28, fontWeight: 850, lineHeight: 1.14, textTransform: 'uppercase' }} />
        ) : null}
      </div>
    </AbsoluteFill>
  );
}

function StampStackCard({ card, scene, frame, opacity, enter, float, scale }: {
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
  const panels = card.bullets.length ? card.bullets : ['Local rule', 'Small habit', 'Big signal'];

  return (
    <AbsoluteFill style={{ fontFamily: 'Inter, Arial, sans-serif', color: '#fff7ed', padding: '126px 78px' }}>
      <div style={{ opacity, transform: `translateY(${enter + float}px) scale(${scale})`, position: 'relative', height: '100%' }}>
        <div style={{ position: 'absolute', left: 18, right: 18, top: 30, display: 'grid', gap: 22 }}>
          <div style={{ color: card.accentColor, fontSize: 30, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
          <LineStack lines={headlineLines} style={{ fontSize: headlineLines.join('').length > 28 ? 68 : 82, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase', color: '#ffffff' }} />
          {subheadLines.length ? (
            <LineStack lines={subheadLines} style={{ color: 'rgba(255,255,255,0.82)', fontSize: 32, fontWeight: 820, lineHeight: 1.14 }} />
          ) : null}
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 520, height: 660 }}>
          {panels.map((panel, index) => {
            const reveal = revealTiming(frame, scene, index, panels.length, card);
            const rotate = [-7, 4, -2, 6][index % 4];
            const top = index * 138;
            return (
              <div
                key={panel}
                style={{
                  position: 'absolute',
                  left: index % 2 === 0 ? 18 : 92,
                  right: index % 2 === 0 ? 92 : 18,
                  top,
                  minHeight: 150,
                  opacity: reveal.opacity,
                  transform: `rotate(${rotate}deg) translateY(${reveal.y}px) scale(${reveal.scale})`,
                  display: 'grid',
                  gridTemplateColumns: '96px 1fr',
                  alignItems: 'center',
                  gap: 26,
                  padding: '0 34px',
                  borderRadius: 18,
                  color: '#111827',
                  background: index % 2 === 0 ? '#fff7ed' : '#fde68a',
                  border: `5px solid ${index % 2 === 0 ? card.accentColor : '#111827'}`,
                  boxShadow: '0 24px 60px rgba(0,0,0,0.34)',
                }}
              >
                <div style={{ width: 82, height: 82, display: 'grid', placeItems: 'center', borderRadius: 999, background: '#111827', color: card.accentColor, fontSize: 30, fontWeight: 950 }}>
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div style={{ fontSize: 42, fontWeight: 950, lineHeight: 0.96, textTransform: 'uppercase' }}>{panel}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', left: 120, right: 120, bottom: 245, height: 124, display: 'grid', placeItems: 'center', transform: 'rotate(-6deg)', borderRadius: 999, color: card.accentColor, border: `8px solid ${card.accentColor}`, fontSize: 38, fontWeight: 950, textTransform: 'uppercase', background: 'rgba(17,24,39,0.62)' }}>
          verified
        </div>
        {footerLines.length ? (
          <LineStack lines={footerLines} style={{ position: 'absolute', left: 56, right: 56, bottom: 90, color: 'rgba(255,255,255,0.78)', fontSize: 28, fontWeight: 850, lineHeight: 1.16, textAlign: 'center', textTransform: 'uppercase' }} />
        ) : null}
      </div>
    </AbsoluteFill>
  );
}

function ZoneCompareCard({ card, scene, frame, opacity, enter, float, scale }: {
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
  const leftReveal = revealTiming(frame, scene, 0, 2, card);
  const rightReveal = revealTiming(frame, scene, 1, 2, card);
  const leftTitle = card.bullets[0] || 'Wet bath';
  const leftRule = card.bullets[1] || 'Nude zone';
  const rightTitle = card.bullets[2] || 'Common room';
  const rightRule = card.bullets[3] || 'Uniform zone';

  return (
    <AbsoluteFill style={{ fontFamily: 'Inter, Arial, sans-serif', color: '#ffffff', padding: '112px 66px 0' }}>
      <div
        style={{
          opacity,
          transform: `translateY(${enter + float}px) scale(${scale})`,
          position: 'relative',
          height: 1164,
          borderRadius: 40,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, rgba(8,13,24,0.88), rgba(8,13,24,0.64))',
          border: '2px solid rgba(255,255,255,0.22)',
          boxShadow: '0 34px 90px rgba(0,0,0,0.44)',
        }}
      >
        <div style={{ position: 'absolute', left: 48, right: 48, top: 48, display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ color: card.accentColor, fontSize: 28, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
            <LineStack lines={headlineLines} style={{ color: '#ffffff', fontSize: 72, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase' }} />
            {subheadLines.length ? (
              <LineStack lines={subheadLines} style={{ color: 'rgba(255,255,255,0.84)', fontSize: 30, fontWeight: 820, lineHeight: 1.12 }} />
            ) : null}
          </div>
          <div style={{ width: 118, height: 118, borderRadius: 999, border: `5px solid ${card.accentColor}`, display: 'grid', placeItems: 'center', color: card.accentColor, fontSize: 30, fontWeight: 950 }}>
            2X
          </div>
        </div>
        <div style={{ position: 'absolute', left: 48, right: 48, top: 380, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[
            { index: 0, label: 'BATH AREA', title: leftTitle, rule: leftRule, note: 'gender separated', reveal: leftReveal },
            { index: 1, label: 'COMMON AREA', title: rightTitle, rule: rightRule, note: 'shared space', reveal: rightReveal },
          ].map((zone) => (
            <div
              key={zone.label}
              style={{
                minHeight: 570,
                opacity: zone.reveal.opacity,
                transform: `translateY(${zone.reveal.y}px) scale(${zone.reveal.scale})`,
                display: 'grid',
                alignContent: 'space-between',
                borderRadius: 34,
                padding: '34px 30px',
                background: zone.index === 0 ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.16)',
                color: zone.index === 0 ? '#101827' : '#ffffff',
                border: `3px solid ${zone.index === 0 ? card.accentColor : 'rgba(255,255,255,0.25)'}`,
                boxShadow: '0 22px 58px rgba(0,0,0,0.26)',
              }}
            >
              <div style={{ display: 'grid', gap: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <div style={{ color: zone.index === 0 ? '#111827' : card.accentColor, fontSize: 22, fontWeight: 950, textTransform: 'uppercase' }}>{zone.label}</div>
                  <div style={{ width: 54, height: 54, display: 'grid', placeItems: 'center', borderRadius: 16, background: zone.index === 0 ? '#111827' : card.accentColor, color: zone.index === 0 ? card.accentColor : '#111827', fontSize: 22, fontWeight: 950 }}>
                    {`0${zone.index + 1}`}
                  </div>
                </div>
                <div style={{ height: 4, borderRadius: 999, background: zone.index === 0 ? 'rgba(17,24,39,0.22)' : 'rgba(255,255,255,0.24)' }} />
              </div>
              <div style={{ display: 'grid', gap: 18 }}>
                <div style={{ fontSize: 58, fontWeight: 950, lineHeight: 0.92, textTransform: 'uppercase' }}>{zone.title}</div>
                <div style={{ borderRadius: 999, padding: '18px 22px', background: zone.index === 0 ? card.accentColor : 'rgba(255,255,255,0.16)', color: zone.index === 0 ? '#111827' : '#ffffff', fontSize: 34, fontWeight: 950, lineHeight: 1, textTransform: 'uppercase' }}>
                  {zone.rule}
                </div>
              </div>
              <div style={{ color: zone.index === 0 ? 'rgba(17,24,39,0.68)' : 'rgba(255,255,255,0.72)', fontSize: 24, fontWeight: 850, textTransform: 'uppercase' }}>{zone.note}</div>
            </div>
          ))}
        </div>
        {footerLines.length ? (
          <LineStack lines={footerLines} style={{ position: 'absolute', left: 66, right: 66, bottom: 58, color: 'rgba(255,255,255,0.78)', fontSize: 30, fontWeight: 850, lineHeight: 1.12, textAlign: 'center', textTransform: 'uppercase' }} />
        ) : null}
      </div>
    </AbsoluteFill>
  );
}

function KitGridCard({ card, scene, frame, opacity, enter, float, scale }: {
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
  const tileColors = ['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.18)', 'rgba(255,255,255,0.18)', card.accentColor];

  return (
    <AbsoluteFill style={{ fontFamily: 'Inter, Arial, sans-serif', color: '#ffffff', padding: '112px 66px 0' }}>
      <div
        style={{
          opacity,
          transform: `translateY(${enter + float}px) scale(${scale})`,
          position: 'relative',
          height: 1164,
          borderRadius: 40,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, rgba(8,13,24,0.88), rgba(8,13,24,0.62))',
          border: '2px solid rgba(255,255,255,0.22)',
          boxShadow: '0 34px 90px rgba(0,0,0,0.44)',
        }}
      >
        <div style={{ position: 'absolute', left: 48, right: 48, top: 48, display: 'grid', gridTemplateColumns: '1fr 190px', gap: 24, alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ color: card.accentColor, fontSize: 28, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
            <LineStack lines={headlineLines} style={{ color: '#ffffff', fontSize: 72, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase' }} />
            {subheadLines.length ? (
              <LineStack lines={subheadLines} style={{ color: 'rgba(255,255,255,0.84)', fontSize: 30, fontWeight: 820, lineHeight: 1.12 }} />
            ) : null}
          </div>
          <div style={{ height: 154, borderRadius: 28, border: `4px solid ${card.accentColor}`, display: 'grid', placeItems: 'center', color: card.accentColor, fontSize: 34, fontWeight: 950, textTransform: 'uppercase' }}>
            Small
          </div>
        </div>
        <div style={{ position: 'absolute', left: 48, right: 48, top: 390, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
          {card.bullets.slice(0, 4).map((bullet, index) => {
            const reveal = revealTiming(frame, scene, index, card.bullets.length, card);
            const darkText = index === 0 || index === 3;
            return (
              <div
                key={bullet}
                style={{
                  minHeight: 260,
                  opacity: reveal.opacity,
                  transform: `translateY(${reveal.y}px) scale(${reveal.scale})`,
                  display: 'grid',
                  alignContent: 'space-between',
                  gap: 18,
                  borderRadius: 34,
                  padding: '30px 30px 28px',
                  background: tileColors[index % tileColors.length],
                  color: darkText ? '#111827' : '#ffffff',
                  border: `2px solid ${darkText ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)'}`,
                  boxShadow: '0 22px 58px rgba(0,0,0,0.24)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 950, opacity: 0.8 }}>{`0${index + 1}`}</div>
                  <div style={{ width: 50, height: 8, borderRadius: 999, background: darkText ? 'rgba(17,24,39,0.24)' : card.accentColor }} />
                </div>
                <div style={{ fontSize: String(bullet).length > 12 ? 40 : 48, fontWeight: 950, lineHeight: 0.94, textTransform: 'uppercase' }}>{bullet}</div>
              </div>
            );
          })}
        </div>
        {footerLines.length ? (
          <LineStack lines={footerLines} style={{ position: 'absolute', left: 66, right: 66, bottom: 58, color: 'rgba(255,255,255,0.78)', fontSize: 30, fontWeight: 850, lineHeight: 1.12, textAlign: 'center', textTransform: 'uppercase' }} />
        ) : null}
      </div>
    </AbsoluteFill>
  );
}

function MotionCardLayer({ card, scene }: { card: ReelMotionCard; scene: ReelScene }) {
  const frame = useCurrentFrame();
  const progress = Math.min(Math.max(frame / Math.max(scene.durationFrames, 1), 0), 1);
  const enter = interpolate(frame, [0, 12, 24], [18, -4, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, [0, 6, scene.durationFrames - 12, scene.durationFrames], [0.86, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const float = Math.sin(progress * Math.PI * 2) * 6;
  const scale = interpolate(frame, [0, 18], [0.985, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const shared = { card, scene, frame, opacity, enter, float, scale };
  const template = cardTemplate(card);

  if (template === 'zone_compare') return <ZoneCompareCard {...shared} />;
  if (template === 'kit_grid') return <KitGridCard {...shared} />;
  if (template === 'convenience_tray') return <ConvenienceTrayCard {...shared} />;
  if (template === 'morning_route') return <MorningRouteCard {...shared} />;
  if (template === 'wrapper_tabs') return <WrapperTabsCard {...shared} />;
  if (template === 'receipt_stack') return <ReceiptStackCard {...shared} />;
  if (template === 'stamp_stack') return <StampStackCard {...shared} />;
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

function EmbeddedBrandShield({ scene }: { scene: ReelScene }) {
  const frame = useCurrentFrame();
  if (scene.number !== 3 || !/Ondol made warm floors normal/i.test(scene.narration) || scene.images.length < 2) return null;

  const imageStart = Math.floor(scene.durationFrames / scene.images.length);
  if (frame < imageStart - 8) return null;
  const opacity = interpolate(frame, [imageStart - 8, imageStart], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity }}>
      <div
        style={{
          position: 'absolute',
          left: 52,
          top: 52,
          width: 190,
          height: 74,
          borderRadius: 18,
          background: 'linear-gradient(90deg, rgba(30,16,8,0.92), rgba(30,16,8,0.68), rgba(30,16,8,0))',
          filter: 'blur(0.2px)',
        }}
      />
    </AbsoluteFill>
  );
}

function ThumbnailLayer({ scene, title }: { scene: ReelScene; title: string }) {
  const frame = useCurrentFrame();
  const isWaterbombTitle = scene.number === 1 && /Waterbomb Seoul 2026 Survival Guide/i.test(title);
  const isOliveYoungTitle = scene.number === 1 && /Olive Young Korea Shopping Guide/i.test(title);
  const isWorldCupTitle = scene.number === 1 && /World Cup/i.test(title);
  const isKtxSrtBusTitle = scene.number === 1 && /KTX vs SRT vs Express Bus/i.test(title);
  const isKoreanFloorTitle = scene.number === 1 && /Korean Floor Culture/i.test(title);
  const isTempleStayTitle = scene.number === 1 && /Korea Temple Stay Guide/i.test(title);
  const customThumbnailTitle = scene.number === 1
    ? scene.typographyBeats.find((beat) => /thumbnail_title/i.test(beat.emphasis || ''))
    : undefined;
  const beatText = isWaterbombTitle
    ? 'WATERBOMB SEOUL 2026'
    : isOliveYoungTitle
      ? 'OLIVE YOUNG GUIDE'
      : isWorldCupTitle && customThumbnailTitle
        ? 'WORLD CUP BRUNCH'
        : '';
  const isWebtoonTitle = scene.number === 1 && /Webtoons Changed How Stories Travel/i.test(title);
  const titleLines =
    isWaterbombTitle
      ? ['DRESS TO DRY', 'NOT JUST POSE']
      : isOliveYoungTitle
        ? ["DON'T PANIC", 'BUY']
      : isWebtoonTitle
        ? ['WEBTOONS CHANGED', 'HOW STORIES TRAVEL']
      : scene.number === 1 && /Convenience Store Breakfast/i.test(title)
        ? ['KOREAN', 'CONVENIENCE STORE', 'BREAKFAST']
      : customThumbnailTitle
        ? textLines(customThumbnailTitle.text)
        : textLines(title);

  if (isKtxSrtBusTitle) {
    const opacity = interpolate(frame, [0, 30, 42], [1, 1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const cardScale = interpolate(frame, [0, 18], [0.96, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const options = [
      { label: 'KTX', color: '#22c55e' },
      { label: 'SRT', color: '#a855f7' },
      { label: 'BUS', color: '#f59e0b' },
    ];

    return (
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 64px', pointerEvents: 'none', opacity }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(4,7,12,0.18), rgba(4,7,12,0.58) 46%, rgba(4,7,12,0.86))',
          }}
        />
        <div
          style={{
            transform: `scale(${cardScale}) rotate(-0.8deg)`,
            width: '100%',
            maxWidth: 900,
            display: 'grid',
            gap: 30,
            padding: '44px 46px 54px',
            borderRadius: 12,
            background: 'linear-gradient(180deg, rgba(7,11,19,0.9), rgba(7,11,19,0.64))',
            border: '2px solid rgba(255,255,255,0.22)',
            boxShadow: '0 36px 96px rgba(0,0,0,0.48)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 18,
              color: '#f8fafc',
              fontFamily: 'Inter, Arial, sans-serif',
              fontSize: 29,
              fontWeight: 950,
              textTransform: 'uppercase',
              textShadow: '0 6px 20px rgba(0,0,0,0.82)',
            }}
          >
            <span>KOREA CITY TRAVEL</span>
            <span style={{ width: 112, height: 6, borderRadius: 999, background: '#22c55e' }} />
          </div>
          <LineStack
            lines={['KTX / SRT', 'OR BUS?']}
            style={{
              color: '#ffffff',
              fontFamily: 'Inter, Arial, sans-serif',
              fontSize: 114,
              fontWeight: 950,
              lineHeight: 0.88,
              textAlign: 'left',
              textTransform: 'uppercase',
              textShadow: '0 13px 36px rgba(0,0,0,0.92)',
            }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            {options.map((option) => (
              <div
                key={option.label}
                style={{
                  height: 92,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 10,
                  background: option.color,
                  color: '#07111f',
                  fontFamily: 'Inter, Arial, sans-serif',
                  fontSize: 44,
                  fontWeight: 950,
                  boxShadow: '0 18px 46px rgba(0,0,0,0.34)',
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
          <div
            style={{
              color: '#f8fafc',
              fontFamily: 'Inter, Arial, sans-serif',
              fontSize: 38,
              fontWeight: 900,
              lineHeight: 1.1,
              textAlign: 'left',
              textShadow: '0 7px 22px rgba(0,0,0,0.82)',
            }}
          >
            <div>Do not pick by speed.</div>
            <div>Start with your station.</div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 70,
            bottom: 76,
            color: '#ffffff',
            fontFamily: 'Inter, Arial, sans-serif',
            fontSize: 29,
            fontWeight: 950,
            letterSpacing: 0,
            textTransform: 'uppercase',
            textShadow: '0 4px 16px rgba(0,0,0,0.82)',
          }}
        >
          EPICKOR.COM
        </div>
      </AbsoluteFill>
    );
  }

  if (isKoreanFloorTitle) {
    const opacity = interpolate(frame, [0, 30, 42], [1, 1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return (
      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'flex-start', padding: '0 64px 322px', pointerEvents: 'none', opacity }}>
        <div
          style={{
            display: 'grid',
            gap: 24,
            textShadow: '0 8px 28px rgba(0,0,0,0.88)',
          }}
        >
          <div style={{ display: 'grid', gap: 18 }}>
            <div
              style={{
                color: '#22c55e',
                fontFamily: 'Inter, Arial, sans-serif',
                fontSize: 31,
                fontWeight: 950,
                letterSpacing: 0,
                textTransform: 'uppercase',
              }}
            >
              KOREAN HOME RULE
            </div>
            <div style={{ width: 142, height: 8, borderRadius: 999, background: '#22c55e' }} />
          </div>
          <LineStack
            lines={['FLOOR IS', 'THE ROOM']}
            style={{
              color: '#ffffff',
              fontFamily: 'Inter, Arial, sans-serif',
              fontSize: 118,
              fontWeight: 950,
              lineHeight: 0.9,
              textAlign: 'left',
              textTransform: 'uppercase',
              maxWidth: 890,
            }}
          />
          <div
            style={{
              color: '#f8fafc',
              fontFamily: 'Inter, Arial, sans-serif',
              fontSize: 42,
              fontWeight: 900,
              lineHeight: 1.08,
              textAlign: 'left',
            }}
          >
            Why everyone sits lower
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 70,
            bottom: 76,
            color: '#ffffff',
            fontFamily: 'Inter, Arial, sans-serif',
            fontSize: 29,
            fontWeight: 950,
            letterSpacing: 0,
            textTransform: 'uppercase',
            textShadow: '0 4px 16px rgba(0,0,0,0.82)',
          }}
        >
          EPICKOR.COM
        </div>
      </AbsoluteFill>
    );
  }

  if (isTempleStayTitle) {
    const opacity = interpolate(frame, [0, 30, 42], [1, 1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const warnScale = interpolate(frame, [0, 18], [0.96, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    return (
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 66px', pointerEvents: 'none', opacity }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(4,5,7,0.08), rgba(4,5,7,0.58) 56%, rgba(4,5,7,0.82))',
          }}
        />
        <div
          style={{
            transform: `scale(${warnScale}) rotate(-1deg)`,
            display: 'grid',
            gap: 24,
            width: '100%',
            maxWidth: 900,
            padding: '46px 46px 54px',
            borderTop: '8px solid #f59e0b',
            borderBottom: '8px solid #f59e0b',
            background: 'linear-gradient(180deg, rgba(10,12,16,0.78), rgba(10,12,16,0.48))',
            boxShadow: '0 36px 90px rgba(0,0,0,0.42)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 18,
              color: '#fbbf24',
              fontFamily: 'Inter, Arial, sans-serif',
              fontSize: 30,
              fontWeight: 950,
              letterSpacing: 0,
              textTransform: 'uppercase',
              textShadow: '0 5px 18px rgba(0,0,0,0.82)',
            }}
          >
            <span>KOREA TEMPLE STAY</span>
            <span style={{ width: 112, height: 6, borderRadius: 999, background: '#f59e0b' }} />
          </div>
          <LineStack
            lines={['NOT A', 'SPA NIGHT']}
            style={{
              color: '#ffffff',
              fontFamily: 'Inter, Arial, sans-serif',
              fontSize: 130,
              fontWeight: 950,
              lineHeight: 0.86,
              textAlign: 'left',
              textTransform: 'uppercase',
              textShadow: '0 12px 36px rgba(0,0,0,0.92)',
              maxWidth: 890,
            }}
          />
          <div
            style={{
              color: '#f8fafc',
              fontFamily: 'Inter, Arial, sans-serif',
              fontSize: 40,
              fontWeight: 900,
              lineHeight: 1.1,
              textAlign: 'left',
              textShadow: '0 7px 22px rgba(0,0,0,0.82)',
            }}
          >
            Choose the program first.
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 70,
            bottom: 76,
            color: '#ffffff',
            fontFamily: 'Inter, Arial, sans-serif',
            fontSize: 29,
            fontWeight: 950,
            letterSpacing: 0,
            textTransform: 'uppercase',
            textShadow: '0 4px 16px rgba(0,0,0,0.82)',
          }}
        >
          EPICKOR.COM
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: isWebtoonTitle ? '0 48px' : '0 72px', pointerEvents: 'none' }}>
      {beatText ? (
        <div
          style={{
            color: '#facc15',
            fontFamily: 'Inter, Arial, sans-serif',
            fontSize: isWebtoonTitle ? 42 : isWaterbombTitle || isOliveYoungTitle ? 34 : 28,
            fontWeight: 950,
            marginBottom: isWebtoonTitle ? 24 : isWaterbombTitle || isOliveYoungTitle ? 26 : 28,
            textAlign: 'center',
            textShadow: '0 5px 18px rgba(0,0,0,0.85)',
            textTransform: 'uppercase',
            zIndex: 2,
          }}
        >
          {beatText.replace(/\|/g, ' ')}
        </div>
      ) : null}
      <LineStack
        lines={titleLines}
        style={{
          color: '#ffffff',
          fontFamily: 'Inter, Arial, sans-serif',
          fontSize: isWebtoonTitle ? 108 : isWaterbombTitle || isOliveYoungTitle ? 104 : titleLines.join('').length > 28 ? 68 : 82,
          fontWeight: 950,
          lineHeight: isWebtoonTitle || isWaterbombTitle || isOliveYoungTitle ? 0.9 : 0.95,
          textAlign: 'center',
          textShadow: '0 9px 30px rgba(0,0,0,0.9)',
          textTransform: 'uppercase',
          position: 'relative',
          zIndex: 3,
        }}
      />
    </AbsoluteFill>
  );
}

function OutroLayer({ text }: { text: string }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 14, 72, 90], [0, 1, 1, 0.88], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(frame, [0, 22], [34, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(frame, [0, 24, 90], [0.94, 1, 1.025], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lineWidth = interpolate(frame, [8, 36], [0, 520], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#030406', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 46%, rgba(34,197,94,0.16), transparent 36%)' }} />
      <div style={{ position: 'absolute', left: 120, right: 120, top: 470, height: 1, background: 'rgba(255,255,255,0.08)' }} />
      <div style={{ position: 'absolute', left: 120, right: 120, bottom: 470, height: 1, background: 'rgba(255,255,255,0.08)' }} />
      <div
        style={{
          opacity,
          transform: `translateY(${y}px) scale(${scale})`,
          display: 'grid',
          justifyItems: 'center',
          gap: 28,
        }}
      >
        <div
          style={{
            color: '#22c55e',
            fontFamily: 'Inter, Arial, sans-serif',
            fontSize: 28,
            fontWeight: 920,
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 0,
          }}
        >
          More Korea travel guides at
        </div>
      <div
        style={{
          color: '#ffffff',
          fontFamily: 'Inter, Arial, sans-serif',
            fontSize: 104,
          fontWeight: 950,
          letterSpacing: 0,
          textAlign: 'center',
            textShadow: '0 12px 44px rgba(34,197,94,0.34)',
        }}
      >
        {text}
      </div>
        <div style={{ width: lineWidth, height: 5, borderRadius: 999, background: '#22c55e', boxShadow: '0 0 26px rgba(34,197,94,0.62)' }} />
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
        const motionCard = props.motionCards?.find((card) => card.sceneNumber === scene.number && card.reviewStatus === 'approved');
        const motionTemplate = motionCard ? cardTemplate(motionCard) : '';
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
              <EmbeddedBrandShield scene={scene} />
              {motionCard ? (
                <>
                  <MotionCardLayer card={motionCard} scene={scene} />
                  <CaptionLayer scene={scene} compact placement={motionCaptionPlacement(motionTemplate)} />
                </>
              ) : scene.number === 1 ? (
                <>
                  <ThumbnailLayer scene={scene} title={props.title} />
                  <CaptionLayer scene={scene} placement="intro" />
                </>
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
