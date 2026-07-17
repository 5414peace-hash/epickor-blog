import type { CSSProperties, ReactNode } from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  Video,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import type { ReelProps, ReelScene } from './types';

const CREAM = '#f4eee3';
const PAPER = '#fffaf0';
const INK = '#171715';
const RED = '#c93612';
const MUTED = '#6e675e';
const GOLD = '#f3c44d';

const displayFont = "Impact, 'Arial Narrow', 'Franklin Gothic Condensed', sans-serif";
const bodyFont = "Arial, 'Helvetica Neue', sans-serif";

const display: CSSProperties = {
  fontFamily: displayFont,
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: -2.2,
  lineHeight: 0.94,
};

const kicker: CSSProperties = {
  fontFamily: bodyFont,
  fontSize: 25,
  lineHeight: 1,
  fontWeight: 900,
  letterSpacing: 4.5,
  textTransform: 'uppercase',
};

function reveal(frame: number, delay = 0, duration = 12) {
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
}

function rise(frame: number, delay = 0, distance = 34): CSSProperties {
  const progress = reveal(frame, delay, 13);
  return {
    opacity: progress,
    transform: `translateY(${(1 - progress) * distance}px)`,
  };
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 64,
        left: 62,
        zIndex: 30,
        color: light ? PAPER : INK,
        font: `900 28px/1 ${bodyFont}`,
        letterSpacing: 2.6,
        textShadow: light ? '0 2px 12px rgba(0,0,0,.34)' : undefined,
      }}
    >
      EPICKOR
    </div>
  );
}

function VideoBackground({ scene, dim = 0, blur = 0, objectPosition = 'center' }: { scene: ReelScene; dim?: number; blur?: number; objectPosition?: string }) {
  const frame = useCurrentFrame();
  const clip = scene.videoClips?.[0];
  if (!clip) return <AbsoluteFill style={{ background: INK }} />;
  const renderSafePath = clip.staticFilePath.replace(/-proxy\.mp4$/i, '-v03.mp4');
  const scale = interpolate(frame, [0, scene.durationFrames], [1.015, 1.045], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: INK }}>
      <Video
        src={staticFile(renderSafePath)}
        trimBefore={Math.max(0, clip.trimBeforeFrames || 0)}
        playbackRate={clip.playbackRate || 1}
        muted
        pauseWhenBuffering
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition,
          filter: `blur(${blur}px) saturate(.9) contrast(1.03)`,
          transform: `scale(${scale})`,
        }}
      />
      {dim > 0 ? <AbsoluteFill style={{ background: `rgba(12,10,8,${dim})` }} /> : null}
    </AbsoluteFill>
  );
}

function StillImage({ scene, objectFit = 'contain', objectPosition = 'center', padding = 0, scaleFrom = 1.045, scaleTo = 1 }: { scene: ReelScene; objectFit?: CSSProperties['objectFit']; objectPosition?: string; padding?: number; scaleFrom?: number; scaleTo?: number }) {
  const frame = useCurrentFrame();
  const image = scene.images[0];
  if (!image) return null;
  const scale = interpolate(frame, [0, scene.durationFrames], [scaleFrom, scaleTo], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <Img
      src={staticFile(image.staticFilePath)}
      style={{
        width: '100%',
        height: '100%',
        objectFit,
        objectPosition,
        padding,
        boxSizing: 'border-box',
        transform: `scale(${scale})`,
      }}
    />
  );
}

function CaptionText({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: bodyFont,
        fontSize: 36,
        lineHeight: 1.18,
        fontWeight: 900,
        letterSpacing: -0.7,
        color: INK,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SceneOne({ scene }: { scene: ReelScene }) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: CREAM, color: INK, overflow: 'hidden' }}>
      <VideoBackground scene={scene} objectPosition="58% center" />
      <div style={{ position: 'absolute', inset: 0, width: '71%', background: PAPER, clipPath: 'polygon(0 0, 72% 0, 100% 100%, 0 100%)' }} />
      <Brand />
      <div
        style={{
          position: 'absolute',
          left: 50,
          top: 350,
          width: 720,
          zIndex: 8,
          background: 'rgba(255,250,240,.96)',
          padding: '36px 34px 42px 12px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ ...kicker, color: RED, marginBottom: 26 }}>Korean table rule</div>
        <div style={{ ...display, fontSize: 132 }}>Chopsticks</div>
        <div style={{ ...display, fontSize: 128, color: RED }}>aren&apos;t</div>
        <div style={{ ...display, fontSize: 126 }}>the problem</div>
        <div style={{ width: 180, height: 10, background: RED, marginTop: 34, transformOrigin: 'left', transform: `scaleX(${reveal(frame, 8, 18)})` }} />
      </div>
      <CaptionText
        style={{
          position: 'absolute',
          left: 62,
          bottom: 150,
          width: 650,
          zIndex: 8,
          background: 'rgba(255,250,240,.95)',
          padding: '24px 26px 28px 0',
          boxSizing: 'border-box',
          ...rise(frame, 12, 20),
        }}
      >
        Korean chopsticks feel impossible<br />
        <span style={{ color: RED }}>when they do the spoon&apos;s job.</span>
      </CaptionText>
      <div style={{ position: 'absolute', right: 38, bottom: 46, zIndex: 8, color: 'rgba(255,250,240,.74)', font: `800 20px/1 ${bodyFont}`, letterSpacing: 3 }}>EPICKOR.COM</div>
    </AbsoluteFill>
  );
}

function SceneTwo({ scene }: { scene: ReelScene }) {
  const frame = useCurrentFrame();
  const secondBeat = reveal(frame, 67, 12);
  return (
    <AbsoluteFill style={{ background: PAPER, color: INK }}>
      <Brand />
      <div style={{ position: 'absolute', top: 184, left: 62, right: 62, height: 780, overflow: 'hidden', background: '#070c14' }}>
        <StillImage scene={scene} objectFit="contain" scaleFrom={1.1} scaleTo={1.02} />
        <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 120px rgba(0,0,0,.45)' }} />
        <div style={{ position: 'absolute', left: 42, bottom: 36, color: PAPER, ...kicker }}>The metal difference</div>
      </div>
      <div style={{ position: 'absolute', left: 62, top: 1032, right: 62, ...rise(frame, 5, 28) }}>
        <div style={{ ...display, fontSize: 142 }}>Flatter</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginTop: 6 }}>
          <div style={{ ...display, fontSize: 102, color: RED }}>+</div>
          <div style={{ ...display, fontSize: 140 }}>smoother</div>
        </div>
        <div style={{ height: 8, width: 330, background: RED, margin: '30px 0 34px', transformOrigin: 'left', transform: `scaleX(${reveal(frame, 10, 18)})` }} />
        <CaptionText style={{ width: 900 }}>They&apos;re flatter and smoother than wooden chopsticks.</CaptionText>
        <CaptionText style={{ width: 900, color: MUTED, marginTop: 18, opacity: secondBeat, transform: `translateY(${(1 - secondBeat) * 18}px)` }}>
          Squeezing harder can make them twist instead of behave.
        </CaptionText>
      </div>
    </AbsoluteFill>
  );
}

function SceneThree({ scene }: { scene: ReelScene }) {
  const frame = useCurrentFrame();
  const wordReveal = reveal(frame, 58, 14);
  return (
    <AbsoluteFill style={{ background: CREAM, color: INK }}>
      <Brand />
      <div style={{ position: 'absolute', left: 62, right: 62, top: 176, height: 812, background: '#eef0ee', overflow: 'hidden', boxShadow: '0 26px 60px rgba(61,48,32,.13)' }}>
        <StillImage scene={scene} objectFit="contain" padding={82} scaleFrom={1.04} scaleTo={1} />
        <div style={{ position: 'absolute', top: 28, left: 32, ...kicker, color: RED }}>One pair</div>
      </div>
      <div style={{ position: 'absolute', left: 62, top: 1070, right: 62 }}>
        <div style={{ ...display, fontSize: 122, ...rise(frame, 4, 24) }}>Only half</div>
        <div style={{ ...display, fontSize: 122, ...rise(frame, 8, 24) }}>the system</div>
        <div style={{ marginTop: 42, background: INK, color: PAPER, padding: '28px 34px 32px', opacity: wordReveal, transform: `translateY(${(1 - wordReveal) * 20}px)` }}>
          <div style={{ ...kicker, color: GOLD, marginBottom: 14 }}>Korean word</div>
          <div style={{ font: `900 48px/1.08 ${bodyFont}`, letterSpacing: -1 }}>SPOON + CHOPSTICKS = <span style={{ color: GOLD }}>SUJEO</span></div>
        </div>
        <CaptionText style={{ marginTop: 34, width: 910, opacity: wordReveal }}>
          Koreans call the spoon-and-chopstick pair <span style={{ color: RED }}>sujeo.</span>
        </CaptionText>
      </div>
    </AbsoluteFill>
  );
}

function SceneFour({ scene }: { scene: ReelScene }) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: INK, color: PAPER }}>
      <VideoBackground scene={scene} dim={0.25} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(18,16,13,.08), rgba(18,16,13,.08) 44%, rgba(18,16,13,.84) 100%)' }} />
      <Brand light />
      <div style={{ position: 'absolute', left: 62, right: 62, bottom: 238 }}>
        <div style={{ display: 'inline-block', background: RED, color: PAPER, padding: '14px 22px', ...kicker, ...rise(frame, 0, 18) }}>The payoff</div>
        <div style={{ ...display, fontSize: 154, color: PAPER, marginTop: 28, ...rise(frame, 4, 24) }}>Here&apos;s the</div>
        <div style={{ ...display, fontSize: 158, color: GOLD, marginTop: 8, ...rise(frame, 8, 24) }}>cheat code</div>
        <div style={{ borderTop: '2px solid rgba(255,250,240,.62)', marginTop: 34, transformOrigin: 'left', transform: `scaleX(${reveal(frame, 12, 14)})` }} />
        <CaptionText style={{ color: PAPER, paddingTop: 28, opacity: reveal(frame, 12, 12) }}>One pair. Two different jobs.</CaptionText>
      </div>
    </AbsoluteFill>
  );
}

function RuleRow({ frame, revealAt, label, tool, active = false }: { frame: number; revealAt: number; label: string; tool: string; active?: boolean }) {
  const progress = reveal(frame, revealAt, 12);
  return (
    <div style={{ position: 'relative', height: '100%', borderTop: `2px solid ${active ? RED : 'rgba(23,23,21,.18)'}`, background: active ? 'rgba(201,54,18,.08)' : 'rgba(255,250,240,.06)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: active ? 'rgba(201,54,18,.08)' : 'rgba(23,23,21,.035)', opacity: 1 - progress }} />
      <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '1.16fr .84fr', alignItems: 'center', gap: 20, padding: '24px 26px', boxSizing: 'border-box', opacity: progress, transform: `translateY(${(1 - progress) * 22}px)` }}>
        <div style={{ font: `900 34px/1.08 ${bodyFont}`, color: INK }}>{label}</div>
        <div style={{ font: `900 39px/1 ${bodyFont}`, color: active ? RED : INK, textAlign: 'right' }}>{tool}</div>
      </div>
    </div>
  );
}

function SceneFive({ scene }: { scene: ReelScene }) {
  const frame = useCurrentFrame();
  const cardIn = reveal(frame, 0, 14);
  return (
    <AbsoluteFill style={{ background: INK, color: INK }}>
      <VideoBackground scene={scene} dim={0.31} blur={1.2} />
      <Brand light />
      <div
        style={{
          position: 'absolute',
          left: 58,
          right: 58,
          top: 182,
          bottom: 168,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255,250,240,.92)',
          boxShadow: '0 26px 80px rgba(0,0,0,.34)',
          backdropFilter: 'blur(14px)',
          padding: '48px 42px 34px',
          boxSizing: 'border-box',
          opacity: cardIn,
          transform: `translateY(${(1 - cardIn) * 24}px) scale(${0.985 + cardIn * 0.015})`,
        }}
      >
        <div style={{ ...kicker, color: RED }}>Korean table rule</div>
        <div style={{ ...display, fontSize: 108, marginTop: 22 }}>The sujeo</div>
        <div style={{ ...display, fontSize: 108 }}>cheat code</div>
        <div style={{ font: `800 34px/1.2 ${bodyFont}`, color: MUTED, margin: '26px 0 42px' }}>One pair. Two jobs.</div>
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', minHeight: 0, marginBottom: 74 }}>
          <RuleRow frame={frame} revealAt={0} label="RICE / SOUP" tool="SPOON" />
          <RuleRow frame={frame} revealAt={74} label="KIMCHI / MEAT / NOODLES / BANCHAN" tool="CHOPSTICKS" />
          <RuleRow frame={frame} revealAt={172} label="STILL SLIPPING?" tool="LIGHTER GRIP" active />
        </div>
        <div style={{ position: 'absolute', left: 42, right: 42, bottom: 40, font: `900 22px/1.2 ${bodyFont}`, color: MUTED, letterSpacing: 2.2, textAlign: 'center' }}>
          USE THE PAIR, NOT ONE TOOL FOR EVERYTHING
        </div>
      </div>
    </AbsoluteFill>
  );
}

function SceneSix({ scene }: { scene: ReelScene }) {
  const frame = useCurrentFrame();
  const line = reveal(frame, 12, 24);
  return (
    <AbsoluteFill style={{ background: PAPER, color: INK }}>
      <Brand />
      <div style={{ position: 'absolute', left: 62, right: 62, top: 176, height: 780, background: '#d8c69f', overflow: 'hidden' }}>
        <StillImage scene={scene} objectFit="cover" scaleFrom={1.12} scaleTo={1.06} />
        <div style={{ position: 'absolute', left: 42, right: 42, top: '49%', borderTop: `5px solid ${RED}`, transformOrigin: 'left', transform: `scaleX(${line})` }} />
        <div style={{ position: 'absolute', left: 42, top: '49%', width: 18, height: 18, marginTop: -7, borderRadius: '50%', background: RED, opacity: line }} />
        <div style={{ position: 'absolute', right: 42, top: '49%', width: 18, height: 18, marginTop: -7, borderRadius: '50%', background: RED, opacity: line }} />
      </div>
      <div style={{ position: 'absolute', left: 62, top: 1024, right: 62 }}>
        <div style={{ ...kicker, color: RED, ...rise(frame, 5, 18) }}>Still slipping?</div>
        <div style={{ ...display, fontSize: 148, marginTop: 24, ...rise(frame, 8, 22) }}>Lighter grip</div>
        <div style={{ ...display, fontSize: 92, color: RED, marginTop: 18, ...rise(frame, 12, 22) }}>Flat sides aligned</div>
        <CaptionText style={{ marginTop: 40, paddingTop: 28, borderTop: '2px solid rgba(23,23,21,.28)', ...rise(frame, 18, 18) }}>
          Loosen your grip and line up the flat sides.
          <span style={{ display: 'block', color: MUTED, marginTop: 18 }}>Save this before your first Korean meal.</span>
        </CaptionText>
      </div>
    </AbsoluteFill>
  );
}

function SceneSeven({ scene }: { scene: ReelScene }) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: PAPER, color: INK }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 900, overflow: 'hidden' }}>
        <VideoBackground scene={scene} objectPosition="center 42%" />
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.15), transparent 38%, rgba(0,0,0,.04))' }} />
      </div>
      <Brand light />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 900, bottom: 0, background: PAPER, padding: '72px 62px 52px', boxSizing: 'border-box' }}>
        <div style={{ ...kicker, color: RED, ...rise(frame, 0, 18) }}>Before your first Korean meal</div>
        <div style={{ ...display, fontSize: 170, marginTop: 30, ...rise(frame, 4, 24) }}>Save this</div>
        <div style={{ font: `900 42px/1.18 ${bodyFont}`, marginTop: 34, maxWidth: 820, ...rise(frame, 8, 20) }}>Get the full Korean table etiquette guide.</div>
        <div style={{ marginTop: 74, borderTop: `10px solid ${RED}`, paddingTop: 28, font: `900 78px/1 ${bodyFont}`, letterSpacing: -3, ...rise(frame, 16, 22) }}>epickor.com</div>
        <div style={{ marginTop: 66, padding: '26px 28px', border: '2px solid rgba(23,23,21,.2)', font: `900 25px/1.2 ${bodyFont}`, color: MUTED, letterSpacing: 2, textAlign: 'center', opacity: reveal(frame, 28, 18) }}>
          SPOON &nbsp;•&nbsp; CHOPSTICKS &nbsp;•&nbsp; LIGHTER GRIP
        </div>
        <div style={{ position: 'absolute', left: 62, bottom: 48, color: MUTED, font: `800 22px/1 ${bodyFont}`, letterSpacing: 3 }}>KOREA, EXPLAINED CLEARLY</div>
      </div>
    </AbsoluteFill>
  );
}

function DesignedScene({ scene }: { scene: ReelScene }) {
  if (scene.number === 1) return <SceneOne scene={scene} />;
  if (scene.number === 2) return <SceneTwo scene={scene} />;
  if (scene.number === 3) return <SceneThree scene={scene} />;
  if (scene.number === 4) return <SceneFour scene={scene} />;
  if (scene.number === 5) return <SceneFive scene={scene} />;
  if (scene.number === 6) return <SceneSix scene={scene} />;
  return <SceneSeven scene={scene} />;
}

export function Reel294V03Composition(props: ReelProps) {
  return (
    <AbsoluteFill style={{ background: INK }}>
      {props.scenes.map((scene) => (
        <Sequence key={scene.number} from={scene.startFrame} durationInFrames={scene.durationFrames} premountFor={30}>
          <DesignedScene scene={scene} />
        </Sequence>
      ))}
      {(props.audioSegments || []).map((segment) => (
        <Sequence key={segment.part} from={segment.startFrame} durationInFrames={segment.durationFrames} premountFor={15}>
          <Audio src={staticFile(segment.staticFilePath)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
