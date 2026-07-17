import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

export type Reel294PosterFrameProps = {
  sceneNumber: number;
};

const CREAM = '#f4eee3';
const PAPER = '#fffaf0';
const INK = '#171715';
const RED = '#c93612';
const MUTED = '#6e675e';

const displayFont = "Impact, 'Arial Narrow', 'Franklin Gothic Condensed', sans-serif";
const bodyFont = "Arial, 'Helvetica Neue', sans-serif";

const brandStyle: CSSProperties = {
  position: 'absolute',
  top: 64,
  left: 62,
  zIndex: 20,
  fontFamily: bodyFont,
  fontSize: 28,
  lineHeight: 1,
  fontWeight: 900,
  letterSpacing: 2.6,
};

const kickerStyle: CSSProperties = {
  fontFamily: bodyFont,
  fontSize: 25,
  lineHeight: 1,
  fontWeight: 900,
  letterSpacing: 4.5,
  textTransform: 'uppercase',
};

const displayStyle: CSSProperties = {
  fontFamily: displayFont,
  textTransform: 'uppercase',
  letterSpacing: -2.2,
  lineHeight: 0.88,
  fontWeight: 900,
};

function Brand({ light = false }: { light?: boolean }) {
  return <div style={{ ...brandStyle, color: light ? PAPER : INK }}>EPICKOR</div>;
}

function Photo({ scene, style }: { scene: number; style?: CSSProperties }) {
  return (
    <Img
      // Render these review-only frames with
      // --public-dir=public/assets/reels/294/design.
      src={staticFile(`scene-${scene}-bg.png`)}
      style={{ width: '100%', height: '100%', objectFit: 'cover', ...style }}
    />
  );
}

function CaptionBlock({ children, dark = false, style }: { children: ReactNode; dark?: boolean; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: bodyFont,
        fontSize: 40,
        lineHeight: 1.18,
        fontWeight: 850,
        letterSpacing: -0.8,
        color: dark ? PAPER : INK,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SceneOne() {
  return (
    <AbsoluteFill style={{ background: CREAM, color: INK }}>
      <AbsoluteFill style={{ left: '42%', width: '58%', overflow: 'hidden' }}>
        <Photo scene={1} style={{ objectPosition: '58% center', filter: 'saturate(.9) contrast(1.03)' }} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', inset: '0 58% 0 0', background: PAPER }} />
      <div style={{ position: 'absolute', left: '38%', top: 0, bottom: 0, width: 88, background: PAPER, transform: 'skewX(-3deg)' }} />
      <Brand />
      <div style={{ position: 'absolute', left: 50, top: 350, width: 720, background: 'rgba(255,250,240,.96)', padding: '36px 34px 42px 12px', boxSizing: 'border-box', zIndex: 8 }}>
        <div style={{ ...kickerStyle, color: RED, marginBottom: 26 }}>Korean table rule</div>
        <div style={{ ...displayStyle, fontSize: 132, lineHeight: .94 }}>Chopsticks</div>
        <div style={{ ...displayStyle, fontSize: 128, lineHeight: .94, color: RED }}>aren&apos;t</div>
        <div style={{ ...displayStyle, fontSize: 126, lineHeight: .94 }}>the problem</div>
        <div style={{ width: 180, height: 10, background: RED, marginTop: 34 }} />
      </div>
      <CaptionBlock style={{ position: 'absolute', left: 62, bottom: 150, width: 650, background: 'rgba(255,250,240,.94)', padding: '24px 26px 28px 0', boxSizing: 'border-box', fontSize: 36, zIndex: 8 }}>
        Korean chopsticks feel impossible<br />
        <span style={{ color: RED }}>when they do the spoon&apos;s job.</span>
      </CaptionBlock>
      <div style={{ position: 'absolute', right: 38, bottom: 46, color: 'rgba(23,23,21,.58)', font: `800 20px ${bodyFont}`, letterSpacing: 3 }}>
        EPICKOR.COM
      </div>
    </AbsoluteFill>
  );
}

function SceneTwo() {
  return (
    <AbsoluteFill style={{ background: PAPER, color: INK }}>
      <Brand />
      <div style={{ position: 'absolute', top: 184, left: 62, right: 62, height: 780, overflow: 'hidden', background: '#070c14' }}>
        <Photo scene={2} style={{ objectFit: 'contain', transform: 'scale(1.12)' }} />
        <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 120px rgba(0,0,0,.45)' }} />
        <div style={{ position: 'absolute', left: 42, bottom: 36, color: PAPER, ...kickerStyle }}>The metal difference</div>
      </div>
      <div style={{ position: 'absolute', left: 62, top: 1032, right: 62 }}>
        <div style={{ ...displayStyle, fontSize: 142, lineHeight: .94 }}>Flatter</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginTop: 6 }}>
          <div style={{ ...displayStyle, fontSize: 102, lineHeight: .94, color: RED }}>+</div>
          <div style={{ ...displayStyle, fontSize: 140, lineHeight: .94 }}>smoother</div>
        </div>
        <div style={{ height: 8, width: 330, background: RED, margin: '30px 0 34px' }} />
        <CaptionBlock style={{ width: 900, fontSize: 36, lineHeight: 1.2 }}>
          They&apos;re flatter and smoother than wooden chopsticks.
          <span style={{ display: 'block', color: MUTED, marginTop: 18 }}>
            Squeezing harder can make them twist instead of behave.
          </span>
        </CaptionBlock>
      </div>
    </AbsoluteFill>
  );
}

function SceneThree() {
  return (
    <AbsoluteFill style={{ background: CREAM, color: INK }}>
      <Brand />
      <div style={{ position: 'absolute', left: 62, right: 62, top: 176, height: 812, background: '#eef0ee', overflow: 'hidden', boxShadow: '0 26px 60px rgba(61,48,32,.13)' }}>
        <Photo scene={3} style={{ objectFit: 'contain', padding: 82, boxSizing: 'border-box' }} />
        <div style={{ position: 'absolute', top: 28, left: 32, ...kickerStyle, color: RED }}>One pair</div>
      </div>
      <div style={{ position: 'absolute', left: 62, top: 1070, right: 62 }}>
        <div style={{ ...displayStyle, fontSize: 122, lineHeight: .98 }}>Only half</div>
        <div style={{ ...displayStyle, fontSize: 122, lineHeight: .98 }}>the system</div>
        <div style={{ marginTop: 42, background: INK, color: PAPER, padding: '28px 34px 32px' }}>
          <div style={{ ...kickerStyle, color: '#e5b441', marginBottom: 14 }}>Korean word</div>
          <div style={{ font: `900 48px/1.08 ${bodyFont}`, letterSpacing: -1 }}>SPOON + CHOPSTICKS = <span style={{ color: '#e5b441' }}>SUJEO</span></div>
        </div>
        <CaptionBlock style={{ marginTop: 34, width: 910, fontSize: 36 }}>
          Koreans call the spoon-and-chopstick pair <span style={{ color: RED }}>sujeo.</span>
        </CaptionBlock>
      </div>
    </AbsoluteFill>
  );
}

function SceneFour() {
  return (
    <AbsoluteFill style={{ background: INK, color: PAPER }}>
      <Photo scene={4} style={{ filter: 'brightness(.78) saturate(.85)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18,16,13,.15), rgba(18,16,13,.12) 42%, rgba(18,16,13,.82) 100%)' }} />
      <Brand light />
      <div style={{ position: 'absolute', left: 62, right: 62, bottom: 238 }}>
        <div style={{ display: 'inline-block', background: RED, color: PAPER, padding: '14px 22px', ...kickerStyle }}>The payoff</div>
        <div style={{ ...displayStyle, fontSize: 154, lineHeight: .96, color: PAPER, marginTop: 28 }}>Here&apos;s the</div>
        <div style={{ ...displayStyle, fontSize: 158, lineHeight: .96, color: '#f3c44d', marginTop: 8 }}>cheat code</div>
        <CaptionBlock dark style={{ borderTop: '2px solid rgba(255,250,240,.62)', paddingTop: 28, marginTop: 34, fontSize: 36 }}>
          One pair. Two different jobs.
        </CaptionBlock>
      </div>
    </AbsoluteFill>
  );
}

function RuleRow({ label, tool, active = false }: { label: string; tool: string; active?: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.15fr .85fr', alignItems: 'center', gap: 20, minHeight: 0, height: '100%', padding: '24px 26px', boxSizing: 'border-box', borderTop: `2px solid ${active ? RED : 'rgba(23,23,21,.18)'}`, background: active ? 'rgba(201,54,18,.08)' : 'transparent' }}>
      <div style={{ font: `900 35px/1.05 ${bodyFont}`, color: INK }}>{label}</div>
      <div style={{ font: `900 40px/1 ${bodyFont}`, color: active ? RED : INK, textAlign: 'right' }}>{tool}</div>
    </div>
  );
}

function SceneFive() {
  return (
    <AbsoluteFill style={{ background: INK, color: INK }}>
      <Photo scene={5} style={{ filter: 'brightness(.72) saturate(.82)' }} />
      <Brand light />
      <div style={{ position: 'absolute', left: 58, right: 58, top: 182, bottom: 168, display: 'flex', flexDirection: 'column', background: 'rgba(255,250,240,.93)', boxShadow: '0 26px 80px rgba(0,0,0,.34)', backdropFilter: 'blur(14px)', padding: '48px 42px 34px', boxSizing: 'border-box' }}>
        <div style={{ ...kickerStyle, color: RED }}>Korean table rule</div>
        <div style={{ ...displayStyle, fontSize: 108, lineHeight: .96, marginTop: 22 }}>The sujeo</div>
        <div style={{ ...displayStyle, fontSize: 108, lineHeight: .96 }}>cheat code</div>
        <div style={{ font: `800 34px/1.2 ${bodyFont}`, color: MUTED, margin: '26px 0 42px' }}>One pair. Two jobs.</div>
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', minHeight: 0, marginBottom: 74 }}>
          <RuleRow label="RICE / SOUP" tool="SPOON" />
          <RuleRow label="KIMCHI / MEAT / BANCHAN" tool="CHOPSTICKS" />
          <RuleRow label="STILL SLIPPING?" tool="LIGHTER GRIP" active />
        </div>
        <div style={{ position: 'absolute', left: 42, right: 42, bottom: 40, font: `900 22px/1.2 ${bodyFont}`, color: MUTED, letterSpacing: 2.2, textAlign: 'center' }}>
          USE THE PAIR, NOT ONE TOOL FOR EVERYTHING
        </div>
      </div>
    </AbsoluteFill>
  );
}

function SceneSix() {
  return (
    <AbsoluteFill style={{ background: PAPER, color: INK }}>
      <Brand />
      <div style={{ position: 'absolute', left: 62, right: 62, top: 176, height: 780, background: '#d8c69f', overflow: 'hidden' }}>
        <Photo scene={6} style={{ objectFit: 'cover', transform: 'scale(1.12)', filter: 'saturate(.72) contrast(1.04)' }} />
        <div style={{ position: 'absolute', left: 42, right: 42, top: '49%', borderTop: `5px solid ${RED}` }} />
        <div style={{ position: 'absolute', left: 42, top: '49%', width: 18, height: 18, marginTop: -7, borderRadius: '50%', background: RED }} />
        <div style={{ position: 'absolute', right: 42, top: '49%', width: 18, height: 18, marginTop: -7, borderRadius: '50%', background: RED }} />
      </div>
      <div style={{ position: 'absolute', left: 62, top: 1024, right: 62 }}>
        <div style={{ ...kickerStyle, color: RED }}>Still slipping?</div>
        <div style={{ ...displayStyle, fontSize: 148, lineHeight: .94, marginTop: 24 }}>Lighter grip</div>
        <div style={{ ...displayStyle, fontSize: 92, lineHeight: .98, color: RED, marginTop: 18 }}>Flat sides aligned</div>
        <CaptionBlock style={{ marginTop: 40, paddingTop: 28, borderTop: '2px solid rgba(23,23,21,.28)', fontSize: 36 }}>
          Loosen your grip and line up the flat sides.
          <span style={{ display: 'block', color: MUTED, marginTop: 18 }}>Save this before your first Korean meal.</span>
        </CaptionBlock>
      </div>
    </AbsoluteFill>
  );
}

function SceneSeven() {
  return (
    <AbsoluteFill style={{ background: PAPER, color: INK }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 970, overflow: 'hidden' }}>
        <Photo scene={7} style={{ objectPosition: 'center 38%', filter: 'saturate(.88) contrast(1.02)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.18), transparent 34%, rgba(0,0,0,.08))' }} />
      </div>
      <Brand light />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 900, bottom: 0, background: PAPER, padding: '72px 62px 52px', boxSizing: 'border-box' }}>
        <div style={{ ...kickerStyle, color: RED }}>Before your first Korean meal</div>
        <div style={{ ...displayStyle, fontSize: 170, lineHeight: .96, marginTop: 30 }}>Save this</div>
        <div style={{ font: `900 42px/1.18 ${bodyFont}`, marginTop: 34, maxWidth: 820 }}>
          Get the full Korean table etiquette guide.
        </div>
        <div style={{ marginTop: 74, borderTop: `10px solid ${RED}`, paddingTop: 28, font: `900 78px/1 ${bodyFont}`, letterSpacing: -3 }}>epickor.com</div>
        <div style={{ marginTop: 66, padding: '26px 28px', border: '2px solid rgba(23,23,21,.2)', font: `900 25px/1.2 ${bodyFont}`, color: MUTED, letterSpacing: 2, textAlign: 'center' }}>
          SPOON &nbsp;•&nbsp; CHOPSTICKS &nbsp;•&nbsp; LIGHTER GRIP
        </div>
        <div style={{ position: 'absolute', left: 62, bottom: 48, color: MUTED, font: `800 22px/1 ${bodyFont}`, letterSpacing: 3 }}>KOREA, EXPLAINED CLEARLY</div>
      </div>
    </AbsoluteFill>
  );
}

export function Reel294PosterFrame({ sceneNumber }: Reel294PosterFrameProps) {
  if (sceneNumber === 1) return <SceneOne />;
  if (sceneNumber === 2) return <SceneTwo />;
  if (sceneNumber === 3) return <SceneThree />;
  if (sceneNumber === 4) return <SceneFour />;
  if (sceneNumber === 5) return <SceneFive />;
  if (sceneNumber === 6) return <SceneSix />;
  return <SceneSeven />;
}
