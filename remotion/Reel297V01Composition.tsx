import type { CSSProperties } from 'react';
import { AbsoluteFill, Audio, Easing, Img, Sequence, Video, interpolate, staticFile, useCurrentFrame } from 'remotion';
import type { ReelProps } from './types';
import { TimedNarrationCaptions } from './TimedNarrationCaptions';
import captionTimings from '../output/reels/2026-07-13_297/caption-timings-v02.json';

const RED = '#c52d22';
const DEEP_RED = '#8f1e19';
const CREAM = '#f5ead8';
const PAPER = '#fff8ec';
const INK = '#171310';
const PINK = '#e9a69b';
const GOLD = '#d89c3d';
const MUTED = '#7d6c60';
const displayFont = "Impact, 'Arial Narrow', 'Franklin Gothic Condensed', sans-serif";
const bodyFont = "Arial, 'Helvetica Neue', sans-serif";

const display: CSSProperties = {
  fontFamily: displayFont,
  fontWeight: 900,
  lineHeight: 0.91,
  letterSpacing: -1.7,
  textTransform: 'uppercase',
};

const kicker: CSSProperties = {
  fontFamily: bodyFont,
  fontWeight: 900,
  fontSize: 24,
  lineHeight: 1,
  letterSpacing: 4.2,
  textTransform: 'uppercase',
};

function reveal(frame: number, at = 0, duration = 14) {
  return interpolate(frame, [at, at + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
}

function Brand({ light = false }: { light?: boolean }) {
  return <div style={{ position: 'absolute', left: 54, top: 54, zIndex: 40, color: light ? PAPER : INK, font: `900 27px/1 ${bodyFont}`, letterSpacing: 2.8 }}>EPICKOR</div>;
}

function Grain() {
  return <AbsoluteFill style={{ zIndex: 30, pointerEvents: 'none', opacity: .11, mixBlendMode: 'multiply', backgroundImage: 'radial-gradient(circle, rgba(40,20,10,.45) 0 1px, transparent 1.4px)', backgroundSize: '11px 11px' }} />;
}

function EditorialImage({ src, style }: { src: string; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 210], [-8, 8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(1.035) translateX(${x}px)`, ...style }} />;
}

function Caption({ text, light = false, high = false }: { text: string; light?: boolean; high?: boolean }) {
  return (
    <div className="reel297-editorial-caption" style={{ position: 'absolute', zIndex: 70, left: 58, right: 58, bottom: high ? 245 : 78, padding: '17px 22px 19px', background: light ? 'rgba(255,248,236,.9)' : 'rgba(23,19,16,.82)', border: `1px solid ${light ? 'rgba(23,19,16,.18)' : 'rgba(255,248,236,.3)'}`, color: light ? INK : PAPER, font: `900 31px/1.12 ${bodyFont}`, textAlign: 'center', letterSpacing: .15, boxShadow: '0 12px 32px rgba(0,0,0,.18)' }}>{text}</div>
  );
}

function SceneOne() {
  return (
    <AbsoluteFill style={{ background: INK, color: PAPER, overflow: 'hidden' }}>
      <Video src={staticFile('video/seoul-traditional-market-pexels-36718309-proxy.mp4')} trimBefore={12} muted pauseWhenBuffering style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(.5) saturate(.72) contrast(1.05)', transform: 'scale(1.03)' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(15,8,7,.34), rgba(15,8,7,.12) 34%, rgba(15,8,7,.9) 82%, #171310 100%)' }} />
      <Brand light />
      <div style={{ position: 'absolute', zIndex: 35, left: 54, right: 54, top: 270 }}>
        <div style={{ ...kicker, display: 'inline-block', background: CREAM, color: RED, padding: '13px 18px' }}>Korean dessert mistake</div>
      </div>
      <div style={{ position: 'absolute', zIndex: 35, left: 54, right: 54, top: 625 }}>
        <div style={{ ...display, fontSize: 170 }}>Don&apos;t call</div>
        <div style={{ ...display, fontSize: 174, color: PINK, marginTop: 16 }}>it all</div>
        <div style={{ ...display, fontSize: 200, color: CREAM, marginTop: 16 }}>mochi</div>
        <div style={{ width: 210, height: 11, background: RED, marginTop: 38 }} />
      </div>
      <div className="reel297-scene1-proof" style={{ position: 'absolute', left: 58, right: 58, bottom: 176, zIndex: 36, color: PAPER, font: `900 37px/1.18 ${bodyFont}` }}>You miss most of the<br /><span style={{ color: PINK }}>Korean dessert table.</span></div>
      <div className="reel297-low-watermark" style={{ position: 'absolute', right: 42, bottom: 44, zIndex: 36, color: 'rgba(255,248,236,.7)', font: `800 19px/1 ${bodyFont}`, letterSpacing: 3 }}>EPICKOR.COM</div>
      <Grain />
    </AbsoluteFill>
  );
}

function SceneTwo() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: CREAM, color: INK }}>
      <Brand />
      <div style={{ position: 'absolute', left: 54, right: 54, top: 155, height: 870, overflow: 'hidden', background: '#cbbba9', boxShadow: '0 25px 60px rgba(60,30,20,.18)' }}>
        <EditorialImage src="assets/images/posts/297/kto-assorted-tteok.jpg" style={{ objectPosition: 'center center' }} />
      </div>
      <div className="reel297-scene2-copy" style={{ position: 'absolute', left: 54, right: 54, top: 1080 }}>
        <div style={{ ...kicker, color: RED }}>The category</div>
        <div style={{ ...display, fontSize: 178, marginTop: 28, opacity: reveal(frame, 2) }}>Tteok</div>
        <div style={{ ...display, fontSize: 112, color: RED, marginTop: 13 }}>≠ one thing</div>
        <div className="reel297-scene2-detail" style={{ marginTop: 44, borderTop: `8px solid ${RED}`, paddingTop: 28, font: `900 38px/1.18 ${bodyFont}` }}>Pounded. Steamed. Filled.<br />Coated. Layered.</div>
      </div>
      <Caption text="TTEOK IS A WHOLE FAMILY" light />
      <Grain />
    </AbsoluteFill>
  );
}

function SceneThree() {
  return (
    <AbsoluteFill style={{ background: RED, color: PAPER }}>
      <Brand light />
      <div style={{ position: 'absolute', left: 54, right: 54, top: 160, height: 950, background: CREAM, overflow: 'hidden' }}>
        <EditorialImage src="assets/images/posts/297/kto-injeolmi.jpg" style={{ objectFit: 'contain', padding: 55, boxSizing: 'border-box', background: CREAM }} />
      </div>
      <div className="reel297-scene3-copy" style={{ position: 'absolute', left: 54, right: 54, top: 1160 }}>
        <div style={{ ...kicker, color: CREAM }}>Injeolmi</div>
        <div style={{ ...display, fontSize: 153, marginTop: 26 }}>Soft +</div>
        <div style={{ ...display, fontSize: 174, color: PINK, marginTop: 10 }}>chewy</div>
        <div className="reel297-scene3-detail" style={{ marginTop: 38, paddingTop: 26, borderTop: '2px solid rgba(255,248,236,.55)', font: `900 37px/1.15 ${bodyFont}` }}>ROASTED SOYBEAN POWDER</div>
      </div>
      <Caption text="SOFT, CHEWY, AND NUTTY" />
      <Grain />
    </AbsoluteFill>
  );
}

function SceneFour() {
  const frame = useCurrentFrame();
  const drinks = frame >= 118;
  return drinks ? (
    <AbsoluteFill style={{ background: CREAM, color: INK }}>
      <Brand />
      <div style={{ position: 'absolute', left: 54, right: 54, top: 150, height: 950, overflow: 'hidden', background: '#eee1ce' }}>
        <EditorialImage src="assets/images/posts/297/koreanet-sikhye.jpg" style={{ objectFit: 'contain', padding: 70, boxSizing: 'border-box', background: '#eee1ce' }} />
      </div>
      <div className="reel297-scene4-drinks" style={{ position: 'absolute', left: 54, right: 54, top: 1150, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: PAPER, borderTop: `10px solid ${GOLD}`, padding: '27px 24px 32px' }}><div style={{ ...kicker, fontSize: 19, color: GOLD }}>Sikhye</div><div style={{ font: `900 43px/1.08 ${bodyFont}`, marginTop: 18 }}>MALT<br />+ RICE</div></div>
        <div style={{ background: RED, color: PAPER, borderTop: `10px solid ${DEEP_RED}`, padding: '27px 24px 32px' }}><div style={{ ...kicker, fontSize: 19, color: CREAM }}>Sujeonggwa</div><div style={{ font: `900 43px/1.08 ${bodyFont}`, marginTop: 18 }}>CINNAMON<br />+ GINGER</div></div>
      </div>
      <div className="reel297-scene4-note" style={{ position: 'absolute', left: 54, right: 54, top: 1580, font: `900 35px/1.17 ${bodyFont}`, color: MUTED }}>Both are commonly chilled.<br />They taste nothing alike.</div>
      <Caption text="THE DRINKS SPLIT TOO" light />
      <Grain />
    </AbsoluteFill>
  ) : (
    <AbsoluteFill style={{ background: INK, color: PAPER }}>
      <Brand light />
      <div style={{ position: 'absolute', left: 54, right: 54, top: 155, height: 900, overflow: 'hidden', background: '#2b1b14' }}>
        <EditorialImage src="assets/images/posts/297/kto-yakgwa.jpg" style={{ objectFit: 'contain', padding: 68, boxSizing: 'border-box', background: '#2b1b14' }} />
      </div>
      <div className="reel297-scene4-yakgwa" style={{ position: 'absolute', left: 54, right: 54, top: 1120 }}>
        <div style={{ ...kicker, color: PINK }}>Yakgwa is different</div>
        <div style={{ ...display, fontSize: 142, marginTop: 27 }}>Fried</div>
        <div style={{ ...display, fontSize: 142, color: GOLD, marginTop: 11 }}>dense</div>
        <div style={{ ...display, fontSize: 108, color: PINK, marginTop: 13 }}>syrup-soaked</div>
      </div>
      <Caption text="CRISP HANGWA OPENS ANOTHER LANE" />
      <Grain />
    </AbsoluteFill>
  );
}

function ChoiceRow({ frame, at, left, right, active = false }: { frame: number; at: number; left: string; right: string; active?: boolean }) {
  const p = reveal(frame, at, 13);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.16fr', alignItems: 'center', minHeight: 143, borderTop: `2px solid ${active ? RED : 'rgba(23,19,16,.2)'}`, background: active ? 'rgba(197,45,34,.09)' : 'rgba(255,248,236,.28)', padding: '20px 22px', boxSizing: 'border-box', gap: 18, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <div style={{ font: `900 31px/1.05 ${bodyFont}`, color: active ? RED : MUTED }}>{left}</div>
      <div style={{ font: `900 37px/1.05 ${bodyFont}`, color: INK }}>{right}</div>
    </div>
  );
}

function SceneFive() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: INK }}>
      <EditorialImage src="assets/images/posts/297/kto-traditional-dessert-spread.jpg" style={{ filter: 'brightness(.46) saturate(.72) contrast(1.06)', objectPosition: 'center center' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(135deg, rgba(143,30,25,.48), rgba(23,19,16,.56))' }} />
      <Brand light />
      <div className="reel297-choice-card" style={{ position: 'absolute', left: 54, right: 54, top: 160, bottom: 320, background: 'rgba(255,248,236,.92)', color: INK, padding: '43px 38px 34px', boxSizing: 'border-box', boxShadow: '0 30px 90px rgba(0,0,0,.4)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ ...kicker, color: RED }}>The dessert switch</div>
        <div style={{ ...display, fontSize: 125, marginTop: 23 }}>Pick by</div>
        <div style={{ ...display, fontSize: 132, color: RED, marginTop: 7 }}>texture</div>
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'repeat(4, 1fr)', marginTop: 40, minHeight: 0 }}>
          <ChoiceRow frame={frame} at={0} left="CHEWY" right="TTEOK / INJEOLMI" />
          <ChoiceRow frame={frame} at={58} left="RICH + STICKY" right="YAKGWA" active />
          <ChoiceRow frame={frame} at={116} left="CRISP" right="YUGWA / GANGJEONG" />
          <ChoiceRow frame={frame} at={174} left="DRINK" right="SIKHYE / SUJEONGGWA" />
        </div>
        <div style={{ marginTop: 29, color: MUTED, font: `900 20px/1.15 ${bodyFont}`, letterSpacing: 2, textAlign: 'center' }}>ONE CATEGORY NAME IS NEVER THE WHOLE TABLE</div>
      </div>
      <Caption text="CHEWY, RICH, CRISP, OR A DRINK" high />
      <Grain />
    </AbsoluteFill>
  );
}

function SceneSix() {
  const frame = useCurrentFrame();
  const p = reveal(frame, 4, 14);
  return (
    <AbsoluteFill style={{ background: CREAM, color: INK }}>
      <Brand />
      <div style={{ position: 'absolute', left: 54, right: 54, top: 220 }}>
        <div style={{ ...kicker, color: RED }}>Your first tasting</div>
        <div style={{ ...display, fontSize: 150, marginTop: 30 }}>Build</div>
        <div style={{ ...display, fontSize: 165, color: RED, marginTop: 8 }}>contrast</div>
      </div>
      <div style={{ position: 'absolute', left: 54, right: 54, top: 735, display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: 22, opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}>
        {[
          ['01', 'ONE CHEWY SWEET'],
          ['02', 'ONE CRISP OR FRIED SWEET'],
          ['03', 'TEA'],
        ].map(([n, label], index) => (
          <div key={n} style={{ minHeight: 190, display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'center', background: index === 1 ? RED : PAPER, color: index === 1 ? PAPER : INK, border: `2px solid ${index === 1 ? RED : 'rgba(23,19,16,.16)'}`, padding: '25px 30px', boxSizing: 'border-box' }}>
            <div style={{ ...display, fontSize: 88, color: index === 1 ? PINK : RED }}>{n}</div>
            <div style={{ font: `900 42px/1.08 ${bodyFont}` }}>{label}</div>
          </div>
        ))}
      </div>
      <Caption text="ONE CHEWY + ONE CRISP + TEA" light />
      <Grain />
    </AbsoluteFill>
  );
}

function SceneSeven() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: RED, color: PAPER, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 720, height: 720, borderRadius: '50%', right: -260, top: -210, border: '95px solid rgba(245,234,216,.16)' }} />
      <div style={{ position: 'absolute', width: 530, height: 530, borderRadius: '50%', left: -250, bottom: 90, background: 'rgba(143,30,25,.48)' }} />
      <Brand light />
      <div style={{ position: 'absolute', left: 54, right: 54, top: 340 }}>
        <div style={{ ...kicker, color: CREAM, opacity: reveal(frame, 0) }}>Before a Korean cafe</div>
        <div style={{ ...display, fontSize: 183, marginTop: 38 }}>Save</div>
        <div style={{ ...display, fontSize: 183, color: PINK, marginTop: 13 }}>this</div>
        <div style={{ width: 230, height: 12, background: CREAM, marginTop: 46 }} />
        <div style={{ font: `900 43px/1.18 ${bodyFont}`, marginTop: 52, maxWidth: 860 }}>Choose by texture.<br />Then learn the name.</div>
        <div style={{ marginTop: 95, paddingTop: 30, borderTop: `10px solid ${CREAM}`, font: `900 82px/1 ${bodyFont}`, letterSpacing: -2.8 }}>epickor.com</div>
        <div style={{ marginTop: 46, color: CREAM, font: `900 22px/1 ${bodyFont}`, letterSpacing: 2.8 }}>FULL KOREAN DESSERT GUIDE</div>
      </div>
      <Caption text="FULL GUIDE AT EPICKOR.COM" high />
      <Grain />
    </AbsoluteFill>
  );
}

const sceneStarts = [0, 126, 250, 360, 600, 840, 960];
const sceneDurations = [126, 124, 110, 240, 240, 120, 120];
const scenes = [SceneOne, SceneTwo, SceneThree, SceneFour, SceneFive, SceneSix, SceneSeven];

export function Reel297V01Composition(props: ReelProps) {
  return (
    <AbsoluteFill style={{ background: INK }}>
      {scenes.map((Scene, index) => (
        <Sequence key={index} from={sceneStarts[index]} durationInFrames={sceneDurations[index]} premountFor={30}>
          <Scene />
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

export function Reel297V02Composition(props: ReelProps) {
  return (
    <AbsoluteFill style={{ background: INK }}>
      <style>{`
        .reel297-editorial-caption { display: none !important; }
        .reel297-scene1-proof { bottom: 525px !important; }
        .reel297-low-watermark { top: 58px !important; bottom: auto !important; }
        .reel297-scene2-copy { top: 1035px !important; transform: scale(.88); transform-origin: top left; width: 1050px; }
        .reel297-scene2-detail { display: none !important; }
        .reel297-scene3-copy { top: 1035px !important; transform: scale(.88); transform-origin: top left; width: 1050px; }
        .reel297-scene3-detail { display: none !important; }
        .reel297-scene4-drinks { top: 1055px !important; }
        .reel297-scene4-note { top: 1320px !important; font-size: 30px !important; }
        .reel297-scene4-yakgwa { top: 1015px !important; transform: scale(.86); transform-origin: top left; width: 1080px; }
        .reel297-choice-card { bottom: 565px !important; }
      `}</style>
      {scenes.map((Scene, index) => (
        <Sequence key={index} from={sceneStarts[index]} durationInFrames={sceneDurations[index]} premountFor={30}>
          <Scene />
        </Sequence>
      ))}
      {(props.audioSegments || []).map((segment) => (
        <Sequence key={segment.part} from={segment.startFrame} durationInFrames={segment.durationFrames} premountFor={15}>
          <Audio src={staticFile(segment.staticFilePath)} />
        </Sequence>
      ))}
      <TimedNarrationCaptions beats={captionTimings.beats} accent={RED} />
    </AbsoluteFill>
  );
}
