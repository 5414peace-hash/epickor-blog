import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Img, Video, interpolate, staticFile, useCurrentFrame } from 'remotion';

export type Reel296PosterFrameProps = {
  sceneNumber: number;
  motion?: boolean;
};

const INK = '#11100f';
const SOOT = '#1b1815';
const IVORY = '#f3ebdc';
const COPPER = '#bd7445';
const AMBER = '#dfa35b';
const RED = '#c9442f';
const MUTED = '#b8ad9e';

const displayFont = "Impact, 'Arial Narrow', 'Franklin Gothic Condensed', sans-serif";
const bodyFont = "Arial, 'Helvetica Neue', sans-serif";

const brandStyle: CSSProperties = {
  position: 'absolute',
  left: 58,
  top: 58,
  zIndex: 30,
  fontFamily: bodyFont,
  fontSize: 28,
  lineHeight: 1,
  fontWeight: 900,
  letterSpacing: 3,
};

const kickerStyle: CSSProperties = {
  fontFamily: bodyFont,
  fontSize: 24,
  lineHeight: 1,
  fontWeight: 900,
  letterSpacing: 4.4,
  textTransform: 'uppercase',
};

const displayStyle: CSSProperties = {
  fontFamily: displayFont,
  fontWeight: 900,
  lineHeight: 0.9,
  letterSpacing: -1.6,
  textTransform: 'uppercase',
};

function Brand({ dark = false }: { dark?: boolean }) {
  return <div style={{ ...brandStyle, color: dark ? INK : IVORY }}>EPICKOR</div>;
}

function Grain() {
  return (
    <AbsoluteFill
      style={{
        zIndex: 15,
        pointerEvents: 'none',
        opacity: 0.12,
        mixBlendMode: 'soft-light',
        backgroundImage:
          'radial-gradient(circle at 18% 24%, rgba(255,255,255,.6) 0 1px, transparent 1.5px), radial-gradient(circle at 72% 65%, rgba(255,255,255,.48) 0 1px, transparent 1.5px)',
        backgroundSize: '9px 9px, 13px 13px',
      }}
    />
  );
}

function Photo({ src, style }: { src: string; style?: CSSProperties }) {
  return <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', ...style }} />;
}

function MotionPhoto({ src, still, style, trimBefore = 0 }: { src: string; still: string; style?: CSSProperties; trimBefore?: number }) {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 240], [1.015, 1.055], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Video
      src={staticFile(src)}
      trimBefore={trimBefore}
      muted
      pauseWhenBuffering
      style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})`, ...style }}
    />
  );
}

function Caption({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      className="reel296-editorial-caption"
      style={{
        fontFamily: bodyFont,
        fontSize: 35,
        lineHeight: 1.18,
        fontWeight: 800,
        letterSpacing: -0.45,
        color: IVORY,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SceneOne({ motion = false }: { motion?: boolean }) {
  return (
    <AbsoluteFill style={{ background: INK, color: IVORY }}>
      {motion ? (
        <MotionPhoto src="video/bukchon-hanok-walk-pexels-30120707-proxy.mp4" still="assets/reels/296/design/scene-1-bg.jpg" trimBefore={12} style={{ filter: 'brightness(.64) saturate(.74) contrast(1.08)', objectPosition: '48% center' }} />
      ) : (
        <Photo src="assets/reels/296/design/scene-1-bg.jpg" style={{ filter: 'brightness(.64) saturate(.74) contrast(1.08)', objectPosition: '48% center' }} />
      )}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(10,9,8,.36), rgba(10,9,8,.08) 33%, rgba(10,9,8,.88) 79%, #11100f 100%)' }} />
      <Brand />
      <div style={{ position: 'absolute', top: 250, left: 58, right: 58, zIndex: 18 }}>
        <div style={{ ...kickerStyle, display: 'inline-block', color: INK, background: AMBER, padding: '13px 18px 12px' }}>Seoul social rule</div>
      </div>
      <div style={{ position: 'absolute', left: 54, right: 54, top: 670, zIndex: 18 }}>
        <div style={{ ...displayStyle, fontSize: 164 }}>Don&apos;t enter</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 25, marginTop: 18 }}>
          <div style={{ width: 126, height: 12, background: COPPER }} />
          <div style={{ ...displayStyle, fontSize: 181, color: AMBER }}>after 5</div>
        </div>
      </div>
      <Caption style={{ position: 'absolute', left: 58, right: 150, bottom: 175, zIndex: 18, borderTop: '2px solid rgba(243,235,220,.58)', paddingTop: 24 }}>
        One of Seoul&apos;s prettiest hanok lanes<br />
        <span style={{ color: AMBER }}>can fine tourists after five.</span>
      </Caption>
      <div className="reel296-low-watermark" style={{ position: 'absolute', right: 42, bottom: 45, zIndex: 18, color: MUTED, font: `800 19px/1 ${bodyFont}`, letterSpacing: 3 }}>EPICKOR.COM</div>
      <Grain />
    </AbsoluteFill>
  );
}

function SceneTwo() {
  return (
    <AbsoluteFill style={{ background: INK, color: IVORY }}>
      <Brand />
      <div style={{ position: 'absolute', top: 150, left: 54, right: 54, height: 930, background: '#e9b652', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,.48)' }}>
        <Photo src="assets/reels/296/stills/bukchon-red-zone-poster-seoul.jpg" style={{ objectFit: 'contain', background: '#f2c763' }} />
      </div>
      <div className="reel296-scene2-copy" style={{ position: 'absolute', top: 1130, left: 58, right: 58 }}>
        <div style={{ ...kickerStyle, color: AMBER }}>The rule is specific</div>
        <div style={{ ...displayStyle, fontSize: 115, marginTop: 22 }}>Bukchon-ro</div>
        <div style={{ ...displayStyle, fontSize: 148, color: COPPER, marginTop: 8 }}>11-gil</div>
        <div style={{ marginTop: 34, display: 'inline-block', border: `2px solid ${COPPER}`, padding: '17px 22px', font: `900 28px/1 ${bodyFont}`, letterSpacing: 2.4, color: IVORY }}>
          RED ZONE · NOT ALL OF BUKCHON
        </div>
        <Caption style={{ marginTop: 38, color: MUTED }}>
          Tourist visits are restricted in the designated residential zone.
        </Caption>
      </div>
      <Grain />
    </AbsoluteFill>
  );
}

function SceneThree({ motion = false }: { motion?: boolean }) {
  return (
    <AbsoluteFill style={{ background: SOOT, color: IVORY }}>
      {motion ? (
        <MotionPhoto src="video/korean-village-wall-pexels-36947447-proxy.mp4" still="assets/reels/296/design/scene-3-bg.jpg" trimBefore={15} style={{ filter: 'brightness(.48) saturate(.48) contrast(1.12)' }} />
      ) : (
        <Photo src="assets/reels/296/design/scene-3-bg.jpg" style={{ filter: 'brightness(.48) saturate(.48) contrast(1.12)' }} />
      )}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(13,12,10,.38), rgba(13,12,10,.72) 58%, #11100f 100%)' }} />
      <Brand />
      <div style={{ position: 'absolute', left: 58, right: 58, top: 400, zIndex: 18 }}>
        <div style={{ ...kickerStyle, color: AMBER }}>Restricted hours</div>
        <div style={{ ...displayStyle, fontSize: 194, marginTop: 42 }}>5 PM</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, margin: '12px 0 14px' }}>
          <div style={{ height: 8, flex: 1, background: COPPER }} />
          <div style={{ color: COPPER, font: `900 70px/1 ${bodyFont}` }}>→</div>
          <div style={{ height: 8, flex: 1, background: COPPER }} />
        </div>
        <div style={{ ...displayStyle, fontSize: 194 }}>10 AM</div>
        <div style={{ marginTop: 74, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '2px solid rgba(243,235,220,.5)', borderBottom: '2px solid rgba(243,235,220,.5)', padding: '24px 0' }}>
          <div style={{ ...kickerStyle, color: MUTED }}>Violation fine</div>
          <div style={{ font: `900 64px/1 ${bodyFont}`, color: AMBER }}>₩100,000</div>
        </div>
      </div>
      <Caption style={{ position: 'absolute', left: 58, right: 58, bottom: 150, zIndex: 18 }}>
        From five in the evening<br />until ten the next morning.
      </Caption>
      <Grain />
    </AbsoluteFill>
  );
}

function SceneFour() {
  return (
    <AbsoluteFill style={{ background: IVORY, color: INK }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 1020, overflow: 'hidden' }}>
        <Photo src="assets/images/posts/296/bukchon-street-pexels-20325769.jpg" style={{ objectPosition: 'center center', filter: 'saturate(.66) contrast(1.06)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,9,8,.08), transparent 52%, rgba(17,16,15,.55) 100%)' }} />
      </div>
      <Brand />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 955, bottom: 0, background: IVORY, padding: '70px 58px 56px', boxSizing: 'border-box' }}>
        <div style={{ ...kickerStyle, color: RED }}>Why the rule exists</div>
        <div style={{ ...displayStyle, fontSize: 136, marginTop: 28 }}>A neighborhood.</div>
        <div style={{ ...displayStyle, fontSize: 154, color: RED, marginTop: 17 }}>Not a set.</div>
        <div style={{ width: 270, height: 9, background: RED, marginTop: 38 }} />
        <Caption style={{ color: INK, marginTop: 44, fontSize: 39 }}>
          People sleep, work, and come home here.<br />
          <span style={{ color: '#746b61' }}>Pretty doesn&apos;t mean public.</span>
        </Caption>
        <div className="reel296-low-footer" style={{ position: 'absolute', left: 58, right: 58, bottom: 60, paddingTop: 24, borderTop: '2px solid rgba(17,16,15,.24)', color: '#746b61', font: `900 22px/1 ${bodyFont}`, letterSpacing: 3 }}>BUKCHON · SEOUL</div>
      </div>
    </AbsoluteFill>
  );
}

function PlanRow({ time, action, active = false, animated = false, revealAt = 0 }: { time: string; action: string; active?: boolean; animated?: boolean; revealAt?: number }) {
  const frame = useCurrentFrame();
  const progress = animated
    ? interpolate(frame, [revealAt, revealAt + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr', alignItems: 'center', minHeight: 174, borderTop: `2px solid ${active ? COPPER : 'rgba(243,235,220,.2)'}`, background: active ? 'rgba(189,116,69,.13)' : 'transparent', padding: '20px 24px', boxSizing: 'border-box', gap: 18, opacity: progress, transform: `translateY(${(1 - progress) * 22}px)` }}>
      <div style={{ font: `900 31px/1.04 ${bodyFont}`, color: active ? AMBER : MUTED, letterSpacing: .2 }}>{time}</div>
      <div style={{ font: `900 39px/1.05 ${bodyFont}`, color: IVORY }}>{action}</div>
    </div>
  );
}

function SceneFive({ motion = false }: { motion?: boolean }) {
  return (
    <AbsoluteFill style={{ background: INK, color: IVORY }}>
      {motion ? (
        <MotionPhoto src="video/seoul-hanok-skyline-pexels-34676852-proxy.mp4" still="assets/reels/296/design/scene-5-bg.jpg" trimBefore={18} style={{ filter: 'brightness(.42) saturate(.56) contrast(1.08)' }} />
      ) : (
        <Photo src="assets/reels/296/design/scene-5-bg.jpg" style={{ filter: 'brightness(.42) saturate(.56) contrast(1.08)' }} />
      )}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(12,11,10,.34), rgba(12,11,10,.68))' }} />
      <Brand />
      <div className="reel296-plan-card" style={{ position: 'absolute', left: 54, right: 54, top: 168, bottom: 152, background: 'rgba(21,19,17,.88)', border: '1px solid rgba(243,235,220,.3)', boxShadow: '0 34px 90px rgba(0,0,0,.46)', padding: '45px 38px 36px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', zIndex: 18 }}>
        <div style={{ ...kickerStyle, color: AMBER }}>The easy plan</div>
        <div style={{ ...displayStyle, fontSize: 120, marginTop: 23 }}>Hanok</div>
        <div style={{ ...displayStyle, fontSize: 120, color: COPPER, marginTop: 6 }}>after dark</div>
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', minHeight: 0, marginTop: 48, marginBottom: 112 }}>
          <PlanRow time="10 TO 5" action="BUKCHON RED ZONE" animated={motion} revealAt={0} />
          <PlanRow time="AFTER 5" action="OFFICIAL HANOK EVENT" active animated={motion} revealAt={68} />
          <PlanRow time="EASY NIGHT" action="JONGNO COMMERCIAL AREA" animated={motion} revealAt={136} />
        </div>
        <div style={{ position: 'absolute', left: 38, right: 38, bottom: 38, paddingTop: 23, borderTop: '1px solid rgba(243,235,220,.24)', color: MUTED, font: `900 21px/1.15 ${bodyFont}`, letterSpacing: 2.2, textAlign: 'center' }}>
          CHECK THE VENUE ROUTE · RESPECT RESIDENTIAL LANES
        </div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
}

function SceneSix({ motion = false }: { motion?: boolean }) {
  return (
    <AbsoluteFill style={{ background: INK, color: IVORY }}>
      <div style={{ position: 'absolute', inset: '0 0 840px 0', overflow: 'hidden' }}>
        <Photo src="assets/reels/296/stills/public-hanok-night-seoul.jpg" style={{ filter: 'brightness(.65) saturate(.72) contrast(1.06)', objectPosition: 'center center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,9,8,.22), rgba(10,9,8,.12) 52%, rgba(10,9,8,.84) 100%)' }} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 900, overflow: 'hidden' }}>
        {motion ? (
          <MotionPhoto src="video/jongno-alley-pexels-32214387-proxy.mp4" still="assets/reels/296/design/scene-6b-bg.jpg" trimBefore={24} style={{ filter: 'brightness(.48) saturate(.62)', objectPosition: 'center 35%' }} />
        ) : (
          <Photo src="assets/reels/296/design/scene-6b-bg.jpg" style={{ filter: 'brightness(.48) saturate(.62)', objectPosition: 'center 35%' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #11100f 0%, rgba(17,16,15,.34) 24%, rgba(17,16,15,.72) 100%)' }} />
      </div>
      <Brand />
      <div style={{ position: 'absolute', left: 58, right: 58, top: 550, zIndex: 18 }}>
        <div style={{ ...kickerStyle, color: AMBER }}>After five</div>
        <div style={{ ...displayStyle, fontSize: 142, marginTop: 25 }}>Night has</div>
        <div style={{ ...displayStyle, fontSize: 155, color: COPPER, marginTop: 8 }}>options</div>
      </div>
      <div className="reel296-scene6-options" style={{ position: 'absolute', left: 58, right: 58, bottom: 170, zIndex: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
        <div style={{ borderTop: `5px solid ${AMBER}`, paddingTop: 18 }}>
          <div style={{ ...kickerStyle, color: AMBER, fontSize: 20 }}>Authorized</div>
          <div style={{ font: `900 34px/1.08 ${bodyFont}`, marginTop: 12 }}>OFFICIAL HANOK EVENT</div>
        </div>
        <div style={{ borderTop: `5px solid ${COPPER}`, paddingTop: 18 }}>
          <div style={{ ...kickerStyle, color: COPPER, fontSize: 20 }}>Commercial</div>
          <div style={{ font: `900 34px/1.08 ${bodyFont}`, marginTop: 12 }}>JONGNO EVENING</div>
        </div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
}

function SceneSeven() {
  return (
    <AbsoluteFill style={{ background: INK, color: IVORY }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1000, overflow: 'hidden' }}>
        <Photo src="assets/reels/296/stills/hong-house-night-seoul.jpg" style={{ filter: 'brightness(.72) saturate(.74) contrast(1.08)', objectPosition: 'center center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,9,8,.3), rgba(10,9,8,.06) 46%, #11100f 100%)' }} />
      </div>
      <Brand />
      <div className="reel296-outro-copy" style={{ position: 'absolute', left: 58, right: 58, top: 890 }}>
        <div style={{ ...kickerStyle, color: AMBER }}>Respect the neighborhood</div>
        <div style={{ ...displayStyle, fontSize: 138, marginTop: 29 }}>Pretty</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 28, marginTop: 5 }}>
          <div style={{ font: `900 115px/1 ${bodyFont}`, color: COPPER }}>≠</div>
          <div style={{ ...displayStyle, fontSize: 138 }}>public</div>
        </div>
        <div style={{ width: 100, height: 10, background: AMBER, marginTop: 35 }} />
        <div style={{ font: `900 39px/1.17 ${bodyFont}`, marginTop: 42 }}>Save this before your Seoul trip.</div>
        <div style={{ marginTop: 64, borderTop: `8px solid ${COPPER}`, paddingTop: 28, font: `900 78px/1 ${bodyFont}`, letterSpacing: -2.8 }}>epickor.com</div>
        <div style={{ marginTop: 54, color: MUTED, font: `900 22px/1 ${bodyFont}`, letterSpacing: 2.5 }}>FULL SEOUL HANOK GUIDE</div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
}

export function Reel296PosterFrame({ sceneNumber, motion = false }: Reel296PosterFrameProps) {
  if (sceneNumber === 1) return <SceneOne motion={motion} />;
  if (sceneNumber === 2) return <SceneTwo />;
  if (sceneNumber === 3) return <SceneThree motion={motion} />;
  if (sceneNumber === 4) return <SceneFour />;
  if (sceneNumber === 5) return <SceneFive motion={motion} />;
  if (sceneNumber === 6) return <SceneSix motion={motion} />;
  return <SceneSeven />;
}
