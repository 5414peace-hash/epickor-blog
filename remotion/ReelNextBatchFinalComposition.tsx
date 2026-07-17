import type { CSSProperties, ReactNode } from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { ReelProps } from './types';
import captions299 from '../output/reels/299/caption-timings-v01.json';
import captions301 from '../output/reels/301/caption-timings-v01.json';
import captions302 from '../output/reels/302/caption-timings-v01.json';

const display = "Impact, 'Arial Narrow', 'Franklin Gothic Condensed', sans-serif";
const body = "Arial, 'Helvetica Neue', sans-serif";

type CaptionBeat = { text: string; startFrame: number; endFrame: number };
type SceneProps = { n: number };

const social = { cobalt: '#1557ff', red: '#ff3b30', ivory: '#f7f2e8', ink: '#111318', green: '#25b56a' };
const morning = { blue: '#2449d8', yellow: '#ffc928', red: '#ee3e2b', rice: '#fff8e8', ink: '#15171b' };
const kitchen = { ink: '#11151a', steel: '#b7c2c9', flame: '#ff5a1f', teal: '#00d0c6', yellow: '#ffc928', white: '#f6f7f3' };

function clamp(frame: number, input: number[], output: number[]) {
  return interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
}

function Brand({ color = '#fff' }: { color?: string }) {
  return <div style={{ position: 'absolute', left: 54, top: 50, zIndex: 90, color, font: `900 27px/1 ${body}`, letterSpacing: 5 }}>EPICKOR</div>;
}

function Grain() {
  return <AbsoluteFill style={{ zIndex: 80, pointerEvents: 'none', opacity: .12, backgroundImage: 'radial-gradient(rgba(255,255,255,.42) .75px, transparent .75px)', backgroundSize: '8px 8px', mixBlendMode: 'soft-light' }} />;
}

function FullVideo({ src, trim = 0, dim = .15, position = 'center', scale = 1.07 }: { src: string; trim?: number; dim?: number; position?: string; scale?: number }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = clamp(frame, [0, Math.max(1, durationInFrames)], [1.015, scale]);
  return <AbsoluteFill>
    <OffthreadVideo src={staticFile(src)} trimBefore={trim} muted style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: position, transform: `scale(${zoom})` }} />
    {dim > 0 && <AbsoluteFill style={{ background: `rgba(8,10,13,${dim})` }} />}
  </AbsoluteFill>;
}

function SoftLayer({ children, fadeIn = 14, fadeOutAt, fadeOut = 14 }: { children: ReactNode; fadeIn?: number; fadeOutAt?: number; fadeOut?: number }) {
  const frame = useCurrentFrame();
  const enter = fadeIn === 0 ? 1 : clamp(frame, [0, fadeIn], [0, 1]);
  const exit = fadeOutAt === undefined ? 1 : clamp(frame, [fadeOutAt, fadeOutAt + fadeOut], [1, 0]);
  return <AbsoluteFill style={{ opacity: enter * exit }}>{children}</AbsoluteFill>;
}

function PhotoCut({ src, accent, position = 'center', top = 230, size = 860 }: { src: string; accent: string; position?: string; top?: number; size?: number }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 130, mass: .8 } });
  const zoom = clamp(frame, [0, Math.max(1, durationInFrames)], [1.015, 1.09]);
  return <div style={{ position: 'absolute', left: (1080 - size) / 2, top, width: size, height: size, overflow: 'hidden', border: `9px solid ${accent}`, boxShadow: '0 28px 80px rgba(0,0,0,.32)', transform: `translateY(${(1 - enter) * 44}px) scale(${.97 + enter * .03})`, opacity: enter }}>
    <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: position, transform: `scale(${zoom})` }} />
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 58%,rgba(0,0,0,.24))' }} />
  </div>;
}

function Typewriter({ text, at = 0, duration = 22, color = '#fff', size = 110, style }: { text: string; at?: number; duration?: number; color?: string; size?: number; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const count = Math.round(clamp(frame, [at, at + duration], [0, text.length]));
  const cursor = frame >= at && frame < at + duration + 18 && frame % 12 < 8;
  return <div style={{ color, font: `900 ${size}px/.9 ${display}`, letterSpacing: -2, textTransform: 'uppercase', ...style }}>
    {text.slice(0, count)}<span style={{ display: 'inline-block', width: 10, height: size * .72, marginLeft: 12, background: cursor ? color : 'transparent', verticalAlign: -2 }} />
  </div>;
}

function MaskText({ children, at = 0, color = '#fff', size = 120, style }: { children: ReactNode; at?: number; color?: string; size?: number; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const p = clamp(frame, [at, at + 16], [0, 1]);
  return <div style={{ color, font: `900 ${size}px/.88 ${display}`, letterSpacing: -2.5, textTransform: 'uppercase', clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, transform: `translateY(${(1 - p) * 34}px)`, ...style }}>{children}</div>;
}

function Kicker({ children, at = 0, color = '#fff', background }: { children: ReactNode; at?: number; color?: string; background?: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: Math.max(0, frame - at), fps, config: { damping: 15, stiffness: 180 } });
  return <div style={{ display: 'inline-block', color, background, padding: background ? '12px 16px' : 0, font: `900 23px/1 ${body}`, letterSpacing: 3.5, textTransform: 'uppercase', transformOrigin: 'left center', transform: `scaleX(${p})`, opacity: p }}>{children}</div>;
}

function Footer({ children, color = 'rgba(255,255,255,.7)' }: { children: ReactNode; color?: string }) {
  return <div style={{ position: 'absolute', left: 54, right: 150, bottom: 76, zIndex: 92, color, font: `900 19px/1 ${body}`, letterSpacing: 3, textTransform: 'uppercase' }}>{children}</div>;
}

function PremiumCaptions({ beats, accent, light = false }: { beats: CaptionBeat[]; accent: string; light?: boolean }) {
  const frame = useCurrentFrame();
  const active = beats.find((beat) => frame >= beat.startFrame && frame <= beat.endFrame);
  if (!active) return null;
  const entry = clamp(frame, [active.startFrame, active.startFrame + 6], [0, 1]);
  const line = clamp(frame, [active.startFrame, active.startFrame + 11], [0, 1]);
  return <div data-caption-safe-zone="instagram-reels" style={{ position: 'absolute', zIndex: 150, left: 74, right: 132, bottom: 410, minHeight: 86, padding: '16px 25px 18px 31px', boxSizing: 'border-box', display: 'grid', placeItems: 'center', borderRadius: 12, overflow: 'hidden', background: light ? 'rgba(255,250,242,.95)' : 'rgba(10,11,13,.86)', border: `1px solid ${light ? 'rgba(15,17,20,.18)' : 'rgba(255,255,255,.2)'}`, color: light ? '#15171b' : '#fffaf0', boxShadow: '0 14px 42px rgba(0,0,0,.28)', font: `900 34px/1.12 ${body}`, letterSpacing: -.2, textAlign: 'center', textWrap: 'balance', opacity: entry, transform: `translateY(${(1 - entry) * 18}px) scale(${.975 + entry * .025})` }}>
    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, background: accent, transformOrigin: 'bottom', transform: `scaleY(${line})` }} />
    <div style={{ position: 'absolute', left: 8, bottom: 0, height: 3, width: `${line * 100}%`, background: accent, opacity: .75 }} />
    {active.text}
  </div>;
}

function SceneWipes({ starts, color }: { starts: number[]; color: string }) {
  return <>{starts.slice(1).map((start) => <Sequence key={start} from={start - 10} durationInFrames={21}>
    <Wipe color={color} />
  </Sequence>)}</>;
}

function Wipe({ color }: { color: string }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, 12, 20], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const scale = interpolate(frame, [0, 20], [1.035, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill style={{ zIndex: 140, opacity, transform: `scale(${scale})`, background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 76%, #111 24%))` }} />;
}

function SocialScene({ n }: SceneProps) {
  if (n === 1) return <AbsoluteFill style={{ background: social.ink, color: social.ivory }}>
    <FullVideo src="video/market-36718309.mp4" dim={.32} scale={1.065} />
    <AbsoluteFill style={{ background: 'linear-gradient(180deg,rgba(17,19,24,.08),rgba(17,19,24,.84) 82%)' }} />
    <Brand /><div style={{ position: 'absolute', left: 54, top: 250, zIndex: 20 }}><Kicker background={social.red}>Korean social rule</Kicker></div>
    <Typewriter text="아줌마" at={2} duration={19} size={170} style={{ position: 'absolute', left: 54, top: 430, zIndex: 20 }} />
    <div style={{ position: 'absolute', left: 54, right: 110, top: 790, zIndex: 20 }}><MaskText at={10} size={145}>Don&apos;t say</MaskText><MaskText at={18} size={174} color={social.red}>ajumma</MaskText><div style={{ marginTop: 40, font: `900 35px/1.15 ${body}` }}>It can look like “ma&apos;am” in subtitles<br/>and land very differently in real life.</div></div>
    <Footer>Seoul social decoder · 01</Footer><Grain />
  </AbsoluteFill>;

  if (n === 2) return <AbsoluteFill style={{ background: social.cobalt, color: social.ivory }}>
    <Sequence from={0} durationInFrames={90} premountFor={20}><SoftLayer fadeIn={0} fadeOutAt={66} fadeOut={18}><FullVideo src="video/street-34676736.mp4" trim={35} dim={.18} /></SoftLayer></Sequence>
    <Sequence from={66} durationInFrames={69} premountFor={20}><SoftLayer fadeIn={18}><AbsoluteFill style={{ background: social.cobalt }}><PhotoCut src="assets/reels/301/extra/woman-seoul-market-31892097.jpg" accent={social.ivory} top={210} size={850} position="center" /></AbsoluteFill></SoftLayer></Sequence>
    <Brand /><div style={{ position: 'absolute', left: 54, right: 120, top: 260, zIndex: 40 }}><Kicker color="#bed0ff">Subtitle mismatch</Kicker><Typewriter text={'“MA’AM” ?'} at={5} duration={16} color={social.ink} size={145} style={{ marginTop: 30 }} /><MaskText at={22} color={social.red} size={152}>Not quite</MaskText></div>
    <div style={{ position: 'absolute', left: 54, right: 120, bottom: 610, zIndex: 45, padding: '24px 26px', background: 'rgba(247,242,232,.94)', borderLeft: `10px solid ${social.red}`, color: social.ink, font: `900 30px/1.1 ${body}` }}>AGE + FAMILIARITY<br/>YOU MAY NOT HAVE</div>
    <Footer>Meaning is not permission</Footer><Grain />
  </AbsoluteFill>;

  if (n === 3) return <AbsoluteFill style={{ background: social.ink, color: social.ivory }}>
    <FullVideo src="video/market-city-37203915.mp4" trim={10} dim={.48} />
    <Brand /><div style={{ position: 'absolute', left: 54, right: 130, top: 260, zIndex: 30 }}><Kicker color={social.cobalt}>Three things arrive first</Kicker>
      {['01  AGE', '02  RELATIONSHIP', '03  SOCIAL POSITION'].map((x, i) => <MaskText key={x} at={10 + i * 9} size={61} color={i === 1 ? social.red : social.ivory} style={{ marginTop: 38, paddingBottom: 22, borderBottom: '1px solid rgba(255,255,255,.25)' }}>{x}</MaskText>)}
      <MaskText at={44} size={113} style={{ marginTop: 70 }}>The translation</MaskText><MaskText at={52} size={123} color={social.red}>is easy.</MaskText><div style={{ marginTop: 24, font: `900 34px/1.12 ${body}` }}>The social distance is not.</div>
    </div><Footer>Read the relationship · not the face</Footer><Grain />
  </AbsoluteFill>;

  if (n === 4) return <AbsoluteFill style={{ background: social.cobalt, color: social.ivory }}>
    <Sequence from={0} durationInFrames={126} premountFor={20}><SoftLayer fadeIn={0} fadeOutAt={96} fadeOut={20}><FullVideo src="video/myeongdong-37362904.mp4" trim={15} dim={.26} /></SoftLayer></Sequence>
    <Sequence from={96} durationInFrames={114} premountFor={20}><SoftLayer fadeIn={20}><AbsoluteFill style={{ background: social.cobalt }}><PhotoCut src="assets/reels/301/extra/market-vendor-31826559.jpg" accent={social.red} top={180} size={880} position="center" /></AbsoluteFill></SoftLayer></Sequence>
    <Brand /><div style={{ position: 'absolute', left: 54, right: 120, top: 890, zIndex: 35 }}><Kicker color="#bfd0ff">Context can change it</Kicker><MaskText at={7} size={134}>Not always</MaskText><MaskText at={16} size={166} color={social.red}>an insult</MaskText><div style={{ marginTop: 34, padding: '26px 28px', background: social.red, font: `900 34px/1.08 ${body}` }}>SELF-USE ≠ STRANGER PERMISSION</div></div>
    <Footer>Warmth belongs to the relationship</Footer><Grain />
  </AbsoluteFill>;

  if (n === 5) return <SocialCard />;

  if (n === 6) return <AbsoluteFill style={{ background: social.ivory, color: social.ink }}>
    <Sequence from={0} durationInFrames={100} premountFor={20}><SoftLayer fadeIn={0} fadeOutAt={70} fadeOut={20}><FullVideo src="video/market-exterior-37814437.mp4" dim={.15} /></SoftLayer></Sequence>
    <Sequence from={70} durationInFrames={80} premountFor={20}><SoftLayer fadeIn={20}><AbsoluteFill style={{ background: social.ivory }}><PhotoCut src="assets/images/posts/301/market-women-seoul.jpg" accent={social.green} top={190} size={860} /></AbsoluteFill></SoftLayer></Sequence>
    <Brand color={social.ink} /><div style={{ position: 'absolute', left: 54, right: 130, top: 920, zIndex: 40 }}><Kicker color={social.green}>Safest first move</Kicker><Typewriter text="JEOGIYO" at={10} duration={20} color={social.green} size={145} style={{ marginTop: 36 }} /><MaskText at={34} size={102}>Get attention.</MaskText><MaskText at={42} size={116} color={social.red}>Skip the age guess.</MaskText></div><Footer color="rgba(17,19,24,.62)">Neutral is respectful</Footer><Grain />
  </AbsoluteFill>;

  return <AbsoluteFill style={{ background: social.ink, color: social.ivory }}>
    <FullVideo src="video/alley-32214387.mp4" trim={75} dim={.48} />
    <Brand /><div style={{ position: 'absolute', left: 54, right: 140, top: 700, zIndex: 30 }}><Kicker color="#bfd0ff">The one rule</Kicker><MaskText at={7} size={132}>Understand it</MaskText><MaskText at={16} size={98} color={social.red} style={{ whiteSpace: 'nowrap' }}>before you use it</MaskText><div style={{ marginTop: 46, font: `900 34px/1.15 ${body}` }}>Save this for your first real conversation.</div><div style={{ marginTop: 55, borderTop: `8px solid ${social.cobalt}`, paddingTop: 24, font: `900 76px/1 ${body}` }}>epickor.com</div></div><Footer>Full Korean address-term guide</Footer><Grain />
  </AbsoluteFill>;
}

function SocialCard() {
  const frame = useCurrentFrame();
  const rows = [['STRANGER', 'JEOGIYO', social.green], ['KNOWN OWNER', 'SAJANGNIM', social.cobalt], ['CASUAL RESTAURANT', 'IMO — ONLY IF THE ROOM DOES', social.red]];
  return <AbsoluteFill style={{ background: social.ink, color: social.ink }}><FullVideo src="video/vendor-20672042-pingpong.mp4" dim={.48} scale={1.04} /><AbsoluteFill style={{ background: 'rgba(21,87,255,.28)' }} /><Brand />
    <div style={{ position: 'absolute', left: 54, right: 112, top: 150, bottom: 600, zIndex: 35, padding: '40px 38px', boxSizing: 'border-box', background: 'rgba(247,242,232,.95)', boxShadow: '0 28px 90px rgba(0,0,0,.35)' }}><Kicker color={social.cobalt}>Social distance decoder</Kicker><MaskText at={7} size={97} color={social.ink} style={{ marginTop: 26 }}>Use the room</MaskText><MaskText at={13} size={100} color={social.red}>not a phrasebook</MaskText><div style={{ marginTop: 34, borderTop: `5px solid ${social.ink}` }}>{rows.map(([a, b, c], i) => { const p = clamp(frame, [36 + i * 48, 50 + i * 48], [0, 1]); return <div key={a} style={{ minHeight: 196, display: 'grid', gridTemplateColumns: '250px 1fr', gap: 20, alignItems: 'center', borderBottom: '2px solid rgba(17,19,24,.18)', opacity: p, transform: `translateX(${(1 - p) * 38}px)` }}><div style={{ font: `900 23px/1.1 ${body}`, letterSpacing: 1.8, color: '#666a72' }}>{a}</div><div style={{ font: `900 ${i === 2 ? 34 : 43}px/1.04 ${body}`, color: c }}>{b}</div></div>; })}</div></div><Grain />
  </AbsoluteFill>;
}

function MorningScene({ n }: SceneProps) {
  if (n === 1) return <AbsoluteFill style={{ background: morning.blue, color: morning.rice }}><FullVideo src="video/hansik-35196990.mp4" dim={.32} /><AbsoluteFill style={{ background: 'linear-gradient(180deg,rgba(36,73,216,.08),rgba(21,23,27,.82) 85%)' }} /><Brand /><div style={{ position: 'absolute', left: 54, top: 240, zIndex: 30 }}><Kicker background={morning.red}>Korean morning mystery</Kicker></div><div style={{ position: 'absolute', right: 70, top: 230, zIndex: 30, color: morning.ink, background: morning.yellow, padding: '15px 20px', font: `900 27px/1 ${body}` }}>07:03 SEOUL</div><div style={{ position: 'absolute', left: 54, right: 130, top: 790, zIndex: 30 }}><Typewriter text="SOUP AT" at={4} duration={17} size={150} /><MaskText at={18} size={210} color={morning.yellow}>7AM?</MaskText><div style={{ marginTop: 38, font: `900 36px/1.12 ${body}` }}>In Korea, that isn&apos;t even<br/>the surprising part.</div></div><Footer>Seoul 7:03 AM · live morning file</Footer><Grain /></AbsoluteFill>;
  if (n === 2) return <AbsoluteFill style={{ background: morning.blue, color: morning.rice }}><FullVideo src="video/stonepot-37391013.mp4" trim={50} dim={.25} /><Brand /><div style={{ position: 'absolute', left: 54, right: 125, top: 280, zIndex: 30 }}><Kicker color={morning.yellow}>The misconception</Kicker><MaskText at={7} size={143}>No hard</MaskText><MaskText at={15} size={151} color={morning.yellow}>food border</MaskText><div style={{ marginTop: 42, display: 'flex', gap: 12 }}>{['BREAKFAST', 'LUNCH', 'DINNER'].map((x, i) => <div key={x} style={{ flex: 1, padding: '18px 10px', background: i === 0 ? morning.red : 'rgba(255,255,255,.12)', border: '2px solid rgba(255,255,255,.34)', font: `900 20px/1 ${body}`, letterSpacing: 1.5, textAlign: 'center', transform: `translateY(${(1 - clamp(useCurrentFrame(), [25 + i * 7, 38 + i * 7], [0, 1])) * 24}px)`, opacity: clamp(useCurrentFrame(), [25 + i * 7, 38 + i * 7], [0, 1]) }}>{x}</div>)}</div></div><Footer>Meals first · labels second</Footer><Grain /></AbsoluteFill>;
  if (n === 3) return <AbsoluteFill style={{ background: morning.yellow, color: morning.ink }}><Sequence from={0} durationInFrames={84}><PhotoCut src="assets/images/posts/302/korean-rice-soup-banchan.jpg" accent={morning.ink} top={170} size={860} /></Sequence><Sequence from={76} durationInFrames={84}><FullVideo src="video/morning-street-37362904.mp4" trim={18} dim={.08} /></Sequence><Brand color={morning.ink} /><div style={{ position: 'absolute', left: 54, right: 120, top: 1050, zIndex: 40 }}><Kicker color={morning.red}>A real modern range</Kicker><MaskText at={9} size={118} color={morning.ink}>Rice. Soup.</MaskText><MaskText at={18} size={133} color={morning.red}>Last night&apos;s sides.</MaskText><div style={{ marginTop: 30, font: `900 31px/1.12 ${body}` }}>The clock changes. The food doesn&apos;t have to.</div></div><Footer color="rgba(21,23,27,.65)">Tradition can still be practical</Footer><Grain /></AbsoluteFill>;
  if (n === 4) return <AbsoluteFill style={{ background: morning.red, color: morning.rice }}><Sequence from={0} durationInFrames={105}><FullVideo src="video/hotteok-20672041.mp4" dim={.13} /></Sequence><Sequence from={96} durationInFrames={104}><FullVideo src="video/gimbap-35196951.mp4" trim={75} dim={.18} /></Sequence><Brand /><div style={{ position: 'absolute', left: 54, right: 130, top: 890, zIndex: 40 }}><Kicker color={morning.yellow}>08:11 · train day</Kicker><Typewriter text="PORTABLE" at={6} duration={18} color={morning.rice} size={146} /><MaskText at={22} size={186} color={morning.yellow}>counts</MaskText><div style={{ marginTop: 36, display: 'flex', gap: 16 }}>{['STREET FOOD', 'GIMBAP', 'COFFEE'].map((x, i) => <div key={x} style={{ padding: '17px 18px', border: '2px solid rgba(255,255,255,.6)', font: `900 20px/1 ${body}`, letterSpacing: 1.4, opacity: clamp(useCurrentFrame(), [30 + i * 7, 40 + i * 7], [0, 1]) }}>{x}</div>)}</div></div><Footer>Eat while the city moves</Footer><Grain /></AbsoluteFill>;
  if (n === 5) return <MorningCard />;
  if (n === 6) return <AbsoluteFill style={{ background: morning.yellow, color: morning.ink }}><PhotoCut src="assets/images/posts/302/kimchi-fried-rice.jpg" accent={morning.red} top={160} size={800} /><Brand color={morning.ink} /><div style={{ position: 'absolute', left: 54, right: 120, top: 980, zIndex: 40 }}><Kicker color={morning.red}>Real life is compressed</Kicker><Typewriter text="LEFTOVERS" at={7} duration={20} color={morning.ink} size={131} /><MaskText at={26} size={176} color={morning.red}>count</MaskText><div style={{ marginTop: 28, font: `900 32px/1.1 ${body}` }}>So does convenience food.<br/>So does coffee.</div></div><Footer color="rgba(21,23,27,.65)">Authentic can still be fast</Footer><Grain /></AbsoluteFill>;
  return <AbsoluteFill style={{ background: morning.blue, color: morning.rice }}><PhotoCut src="assets/images/posts/302/gilgeori-toast.jpg" accent={morning.yellow} top={180} size={860} position="center" /><AbsoluteFill style={{ background: 'linear-gradient(180deg,transparent 38%,rgba(36,73,216,.97) 66%)' }} /><Brand /><div style={{ position: 'absolute', left: 54, right: 140, top: 820, zIndex: 40 }}><Kicker color={morning.yellow}>The real answer</Kicker><MaskText at={8} size={135}>A system.</MaskText><MaskText at={17} size={148} color={morning.yellow}>Not a menu.</MaskText><div style={{ marginTop: 38, font: `900 34px/1.13 ${body}` }}>Save this before your first Seoul morning.</div><div style={{ marginTop: 55, borderTop: `8px solid ${morning.red}`, paddingTop: 23, font: `900 76px/1 ${body}` }}>epickor.com</div></div><Footer>All 12 Korean breakfast options</Footer><Grain /></AbsoluteFill>;
}

function MorningCard() {
  const frame = useCurrentFrame();
  const rows = [['JET-LAGGED', 'JUK'], ['BIG WALKING DAY', 'GUKBAP'], ['EARLY TRAIN', 'GIMBAP'], ['FUN FIRST BITE', 'STREET TOAST']];
  return <AbsoluteFill style={{ background: morning.blue, color: morning.ink }}><FullVideo src="video/market-36718309.mp4" trim={80} dim={.48} /><Brand /><div style={{ position: 'absolute', left: 54, right: 112, top: 150, bottom: 560, zIndex: 35, background: 'rgba(255,248,232,.95)', padding: '40px 38px', boxSizing: 'border-box' }}><Kicker color={morning.blue}>Choose your morning</Kicker><MaskText at={7} size={105} color={morning.ink} style={{ marginTop: 24 }}>What do you need?</MaskText><div style={{ marginTop: 34, borderTop: `5px solid ${morning.ink}` }}>{rows.map(([a, b], i) => { const p = clamp(frame, [32 + i * 39, 45 + i * 39], [0, 1]); return <div key={a} style={{ minHeight: 174, display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 18, alignItems: 'center', borderBottom: '2px solid rgba(21,23,27,.17)', background: i === 3 ? 'rgba(238,62,43,.08)' : 'transparent', opacity: p, transform: `translateX(${(1 - p) * 42}px)` }}><div style={{ font: `900 24px/1.08 ${body}`, color: '#64666c', letterSpacing: 1.5 }}>{a}</div><div style={{ font: `900 ${i === 3 ? 39 : 45}px/1 ${body}`, color: [morning.blue, morning.red, morning.ink, morning.red][i] }}>{b}</div></div>; })}</div></div><Grain /></AbsoluteFill>;
}

function MorningSceneV2({ n }: SceneProps) {
  const frame = useCurrentFrame();

  if (n === 1) return <AbsoluteFill style={{ background: morning.blue, color: morning.rice }}>
    <FullVideo src="video/hansik-35196990.mp4" dim={.32} />
    <AbsoluteFill style={{ background: 'linear-gradient(180deg,rgba(36,73,216,.08),rgba(21,23,27,.82) 85%)' }} />
    <Brand />
    <div style={{ position: 'absolute', left: 54, top: 240, zIndex: 30 }}><Kicker background={morning.red}>Korean morning mystery</Kicker></div>
    <div style={{ position: 'absolute', right: 70, top: 230, zIndex: 30, color: morning.ink, background: morning.yellow, padding: '15px 20px', font: `900 27px/1 ${body}` }}>07:03 SEOUL</div>
    <div style={{ position: 'absolute', left: 54, right: 130, top: 790, zIndex: 30 }}>
      <Typewriter text="SOUP AT" at={4} duration={17} size={150} />
      <MaskText at={18} size={210} color={morning.yellow}>7AM?</MaskText>
      <div style={{ marginTop: 38, font: `900 36px/1.12 ${body}` }}>In Korea, that isn&apos;t even<br />the surprising part.</div>
    </div>
    <Footer>Seoul 7:03 AM - live morning file</Footer><Grain />
  </AbsoluteFill>;

  if (n === 2) return <AbsoluteFill style={{ background: morning.blue, color: morning.rice }}>
    <FullVideo src="video/stonepot-37391013.mp4" trim={50} dim={.25} />
    <Brand />
    <div style={{ position: 'absolute', left: 54, right: 125, top: 280, zIndex: 30 }}>
      <Kicker color={morning.yellow}>The misconception</Kicker>
      <MaskText at={7} size={143}>No hard</MaskText>
      <MaskText at={15} size={151} color={morning.yellow}>food border</MaskText>
      <div style={{ marginTop: 42, display: 'flex', gap: 12 }}>{['BREAKFAST', 'LUNCH', 'DINNER'].map((x, i) => {
        const p = clamp(frame, [25 + i * 7, 38 + i * 7], [0, 1]);
        return <div key={x} style={{ flex: 1, padding: '18px 10px', background: i === 0 ? morning.red : 'rgba(255,255,255,.12)', border: '2px solid rgba(255,255,255,.34)', font: `900 20px/1 ${body}`, letterSpacing: 1.5, textAlign: 'center', transform: `translateY(${(1 - p) * 24}px)`, opacity: p }}>{x}</div>;
      })}</div>
    </div>
    <Footer>Meals first - labels second</Footer><Grain />
  </AbsoluteFill>;

  if (n === 3) return <AbsoluteFill style={{ background: morning.yellow, color: morning.ink }}>
    <Sequence from={0} durationInFrames={98}><SoftLayer fadeIn={0} fadeOutAt={68} fadeOut={20}><PhotoCut src="assets/images/posts/302/korean-rice-soup-banchan.jpg" accent={morning.ink} top={170} size={860} /></SoftLayer></Sequence>
    <Sequence from={68} durationInFrames={92}><SoftLayer fadeIn={20}><FullVideo src="video/morning-street-37362904.mp4" trim={18} dim={.14} /></SoftLayer></Sequence>
    <Brand color={morning.ink} />
    <div style={{ position: 'absolute', left: 54, right: 120, top: 1000, zIndex: 40 }}>
      <Kicker color={morning.red}>A real modern range</Kicker>
      <MaskText at={9} size={108} color={morning.ink}>Rice. Soup.</MaskText>
      <MaskText at={18} size={94} color={morning.red} style={{ whiteSpace: 'nowrap' }}>Last night&apos;s sides.</MaskText>
      <div style={{ marginTop: 24, font: `900 29px/1.1 ${body}` }}>The clock changes. The food doesn&apos;t have to.</div>
    </div>
    <Footer color="rgba(21,23,27,.65)">Tradition can still be practical</Footer><Grain />
  </AbsoluteFill>;

  if (n === 4) return <AbsoluteFill style={{ background: morning.red, color: morning.rice }}>
    <Sequence from={0} durationInFrames={118}><SoftLayer fadeIn={0} fadeOutAt={84} fadeOut={22}><FullVideo src="video/hotteok-20672041.mp4" dim={.13} /></SoftLayer></Sequence>
    <Sequence from={84} durationInFrames={116}><SoftLayer fadeIn={22}><FullVideo src="video/gimbap-35196951.mp4" trim={75} dim={.18} /></SoftLayer></Sequence>
    <Brand />
    <div style={{ position: 'absolute', left: 54, right: 130, top: 820, zIndex: 40 }}>
      <Kicker color={morning.yellow}>08:11 - train day</Kicker>
      <Typewriter text="PORTABLE" at={6} duration={18} color={morning.rice} size={146} />
      <MaskText at={22} size={186} color={morning.yellow}>counts</MaskText>
      <div style={{ marginTop: 36, display: 'flex', gap: 16 }}>{['STREET FOOD', 'GIMBAP', 'COFFEE'].map((x, i) => <div key={x} style={{ padding: '17px 18px', border: '2px solid rgba(255,255,255,.6)', font: `900 20px/1 ${body}`, letterSpacing: 1.4, opacity: clamp(frame, [30 + i * 7, 40 + i * 7], [0, 1]) }}>{x}</div>)}</div>
    </div>
    <Footer>Eat while the city moves</Footer><Grain />
  </AbsoluteFill>;

  if (n === 5) return <MorningCardV2 />;

  if (n === 6) return <AbsoluteFill style={{ background: morning.yellow, color: morning.ink }}>
    <PhotoCut src="assets/images/posts/302/kimchi-fried-rice.jpg" accent={morning.red} top={150} size={780} />
    <Brand color={morning.ink} />
    <div style={{ position: 'absolute', left: 54, right: 120, top: 950, zIndex: 40 }}>
      <Kicker color={morning.red}>Real life is compressed</Kicker>
      <Typewriter text="LEFTOVERS" at={7} duration={20} color={morning.ink} size={131} />
      <MaskText at={26} size={176} color={morning.red}>count</MaskText>
      <div style={{ marginTop: 28, font: `900 32px/1.1 ${body}` }}>So does convenience food.<br />So does coffee.</div>
    </div>
    <Footer color="rgba(21,23,27,.65)">Authentic can still be fast</Footer><Grain />
  </AbsoluteFill>;

  return <AbsoluteFill style={{ background: morning.blue, color: morning.rice }}>
    <PhotoCut src="assets/images/posts/302/gilgeori-toast.jpg" accent={morning.yellow} top={180} size={860} position="center" />
    <AbsoluteFill style={{ background: 'linear-gradient(180deg,transparent 38%,rgba(36,73,216,.97) 66%)' }} />
    <Brand />
    <div style={{ position: 'absolute', left: 54, right: 140, top: 820, zIndex: 40 }}>
      <Kicker color={morning.yellow}>The real answer</Kicker>
      <MaskText at={8} size={135}>A system.</MaskText>
      <MaskText at={17} size={148} color={morning.yellow}>Not a menu.</MaskText>
      <div style={{ marginTop: 38, font: `900 34px/1.13 ${body}` }}>Save this before your first Seoul morning.</div>
      <div style={{ marginTop: 55, borderTop: `8px solid ${morning.red}`, paddingTop: 23, font: `900 76px/1 ${body}` }}>epickor.com</div>
    </div>
    <Footer>All 12 Korean breakfast options</Footer><Grain />
  </AbsoluteFill>;
}

function MorningCardV2() {
  const frame = useCurrentFrame();
  const rows = [['JET-LAGGED', 'JUK'], ['BIG WALKING DAY', 'GUKBAP'], ['EARLY TRAIN', 'GIMBAP'], ['FUN FIRST BITE', 'STREET TOAST']];
  return <AbsoluteFill style={{ background: morning.blue, color: morning.ink }}>
    <FullVideo src="video/market-36718309-pingpong.mp4" trim={80} dim={.48} />
    <Brand />
    <div style={{ position: 'absolute', left: 54, right: 112, top: 150, bottom: 600, zIndex: 35, background: 'rgba(255,248,232,.95)', padding: '40px 38px', boxSizing: 'border-box' }}>
      <Kicker color={morning.blue}>Choose your morning</Kicker>
      <MaskText at={7} size={105} color={morning.ink} style={{ marginTop: 24 }}>What do you need?</MaskText>
      <div style={{ marginTop: 34, borderTop: `5px solid ${morning.ink}` }}>{rows.map(([a, b], i) => {
        const p = clamp(frame, [32 + i * 39, 45 + i * 39], [0, 1]);
        return <div key={a} style={{ minHeight: 164, display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 18, alignItems: 'center', borderBottom: '2px solid rgba(21,23,27,.17)', background: i === 3 ? 'rgba(238,62,43,.08)' : 'transparent', opacity: p, transform: `translateX(${(1 - p) * 36}px)` }}>
          <div style={{ font: `900 24px/1.08 ${body}`, color: '#64666c', letterSpacing: 1.5 }}>{a}</div>
          <div style={{ font: `900 ${i === 3 ? 39 : 45}px/1 ${body}`, color: [morning.blue, morning.red, morning.ink, morning.red][i], whiteSpace: 'nowrap' }}>{b}</div>
        </div>;
      })}</div>
    </div>
    <Grain />
  </AbsoluteFill>;
}

function KitchenScene({ n }: SceneProps) {
  if (n === 1) return <AbsoluteFill style={{ background: kitchen.ink, color: kitchen.white }}><FullVideo src="video/stew-10200309.mp4" dim={.35} scale={1.06} /><Brand /><div style={{ position: 'absolute', left: 54, top: 235, zIndex: 35 }}><Kicker background={kitchen.flame}>Residual heat test</Kicker></div><div style={{ position: 'absolute', left: 54, right: 125, top: 760, zIndex: 35 }}><Typewriter text="FLAME OFF" at={4} duration={18} size={141} /><MaskText at={20} size={169} color={kitchen.flame}>still cooking</MaskText><div style={{ marginTop: 37, font: `900 35px/1.14 ${body}` }}>The pot&apos;s job continues at the table.</div></div><Footer>Kitchen heat lab · test 01</Footer><Grain /></AbsoluteFill>;
  if (n === 2) return <AbsoluteFill style={{ background: kitchen.ink, color: kitchen.white }}><FullVideo src="video/stew-35629815.mp4" trim={42} dim={.28} /><Brand /><div style={{ position: 'absolute', left: 54, right: 130, top: 860, zIndex: 35 }}><Kicker color={kitchen.teal}>Tool 01 · ttukbaegi</Kicker><MaskText at={7} size={151}>Holds heat</MaskText><MaskText at={16} size={124} color={kitchen.flame}>keeps changing food</MaskText><div style={{ marginTop: 43, display: 'flex', alignItems: 'center', gap: 17 }}><div style={{ height: 8, flex: clamp(useCurrentFrame(), [25, 40], [0, 1]), background: kitchen.flame }} /><div style={{ font: `900 28px/1 ${body}`, color: kitchen.steel }}>BURNER → TABLE</div></div></div><Footer>Residual heat is part of the recipe</Footer><Grain /></AbsoluteFill>;
  if (n === 3) return <AbsoluteFill style={{ background: kitchen.yellow, color: kitchen.ink }}><PhotoCut src="assets/images/posts/299/pexels-korean-ramen-pot.jpg" accent={kitchen.ink} top={160} size={860} /><Brand color={kitchen.ink} /><div style={{ position: 'absolute', left: 54, right: 120, top: 1050, zIndex: 35 }}><Kicker color={kitchen.ink}>Tool 02 · thin ramen pot</Kicker><Typewriter text="FAST HEAT." at={7} duration={18} color={kitchen.ink} size={130} /><MaskText at={25} size={129} color={kitchen.flame}>Fast overflow.</MaskText><div style={{ marginTop: 35, font: `900 29px/1.1 ${body}` }}>LIGHT · REACTIVE · NOT UNIVERSAL</div></div><Footer color="rgba(17,21,26,.65)">Check material · handle · burner fit</Footer><Grain /></AbsoluteFill>;
  if (n === 4) return <AbsoluteFill style={{ background: kitchen.ink, color: kitchen.white }}><FullVideo src="video/bbq-34753874.mp4" trim={85} dim={.42} /><Brand /><div style={{ position: 'absolute', left: 54, right: 120, top: 760, zIndex: 35 }}><Kicker color={kitchen.teal}>Korean BBQ workflow</Kicker><MaskText at={7} size={172}>Pan</MaskText><div style={{ display: 'flex', gap: 22, alignItems: 'baseline' }}><MaskText at={14} size={141} color={kitchen.flame}>≠</MaskText><MaskText at={18} size={165}>system</MaskText></div><div style={{ marginTop: 37, display: 'flex', gap: 12, flexWrap: 'wrap' }}>{['VENT', 'GREASE', 'TONGS', 'SCISSORS'].map((x, i) => <div key={x} style={{ padding: '17px 20px', background: i === 3 ? kitchen.flame : 'rgba(255,255,255,.12)', border: '2px solid rgba(255,255,255,.35)', font: `900 22px/1 ${body}`, letterSpacing: 1.6, opacity: clamp(useCurrentFrame(), [28 + i * 7, 39 + i * 7], [0, 1]), transform: `translateY(${(1 - clamp(useCurrentFrame(), [28 + i * 7, 39 + i * 7], [0, 1])) * 22}px)` }}>{x}</div>)}</div></div><Footer>One pan cannot solve the room</Footer><Grain /></AbsoluteFill>;
  if (n === 5) return <KitchenCard />;
  if (n === 6) return <AbsoluteFill style={{ background: kitchen.white, color: kitchen.ink }}><PhotoCut src="assets/images/posts/299/pexels-bbq-scissors.jpg" accent={kitchen.flame} top={160} size={860} /><Brand color={kitchen.ink} /><div style={{ position: 'absolute', left: 54, right: 120, top: 1050, zIndex: 35 }}><Kicker color={kitchen.flame}>Lowest-risk first upgrade</Kicker><Typewriter text="SCISSORS" at={7} duration={18} color={kitchen.ink} size={151} /><MaskText at={24} size={112} color={kitchen.teal}>before the grill pan</MaskText><div style={{ marginTop: 33, borderTop: `6px solid ${kitchen.ink}`, paddingTop: 22, font: `900 28px/1.14 ${body}` }}>CHECK STOVE · VENT · CLEANUP</div></div><Footer color="rgba(17,21,26,.62)">Buy the workflow · not the prop</Footer><Grain /></AbsoluteFill>;
  return <AbsoluteFill style={{ background: kitchen.ink, color: kitchen.white }}><FullVideo src="video/stonepot-37391013.mp4" trim={95} dim={.5} /><Brand /><div style={{ position: 'absolute', left: 54, right: 140, top: 720, zIndex: 35 }}><Kicker color={kitchen.teal}>Before you buy</Kicker><MaskText at={7} size={157}>Buy for</MaskText><MaskText at={15} size={183} color={kitchen.flame}>the heat</MaskText><div style={{ marginTop: 34, font: `900 42px/1.12 ${body}` }}>Not the photograph.</div><div style={{ marginTop: 55, font: `900 33px/1.12 ${body}` }}>Save this before building the kit.</div><div style={{ marginTop: 54, borderTop: `8px solid ${kitchen.teal}`, paddingTop: 23, font: `900 76px/1 ${body}` }}>epickor.com</div></div><Footer>Full Korean cookware decision guide</Footer><Grain /></AbsoluteFill>;
}

function KitchenCard() {
  const frame = useCurrentFrame();
  const rows = [['STEW', 'TTUKBAEGI'], ['RAMYEON', 'COMPATIBLE SMALL POT'], ['HOME BBQ', 'SCISSORS + TONGS FIRST'], ['MIXED USE', 'KEEP YOUR SAUCEPAN']];
  return <AbsoluteFill style={{ background: kitchen.ink, color: kitchen.white }}><FullVideo src="video/bbq-37905787.mp4" trim={45} dim={.58} /><Brand /><div style={{ position: 'absolute', left: 54, right: 112, top: 150, bottom: 560, zIndex: 35, background: 'rgba(17,21,26,.92)', border: '2px solid rgba(183,194,201,.38)', padding: '39px 38px', boxSizing: 'border-box' }}><Kicker color={kitchen.teal}>Heat-lab result</Kicker><MaskText at={7} size={105} style={{ marginTop: 24 }}>What do you repeat?</MaskText><div style={{ marginTop: 34, borderTop: `5px solid ${kitchen.flame}` }}>{rows.map(([a, b], i) => { const p = clamp(frame, [34 + i * 42, 47 + i * 42], [0, 1]); return <div key={a} style={{ minHeight: 171, display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, alignItems: 'center', borderBottom: '1px solid rgba(183,194,201,.28)', opacity: p, transform: `translateX(${(1 - p) * 42}px)` }}><div style={{ color: kitchen.steel, font: `900 23px/1 ${body}`, letterSpacing: 1.7 }}>{a}</div><div style={{ color: i === 3 ? kitchen.teal : kitchen.white, font: `900 ${i === 1 || i === 2 ? 32 : 40}px/1.04 ${body}` }}>{b}</div></div>; })}</div></div><Grain /></AbsoluteFill>;
}

function KitchenSceneV2({ n }: SceneProps) {
  const frame = useCurrentFrame();

  if (n === 1) return <AbsoluteFill style={{ background: kitchen.ink, color: kitchen.white }}>
    <FullVideo src="video/stew-10200309-fluid.mp4" dim={.35} scale={1.06} />
    <Brand />
    <div style={{ position: 'absolute', left: 54, top: 235, zIndex: 35 }}><Kicker background={kitchen.flame}>Residual heat test</Kicker></div>
    <div style={{ position: 'absolute', left: 54, right: 125, top: 760, zIndex: 35 }}>
      <Typewriter text="FLAME OFF" at={4} duration={18} size={141} />
      <MaskText at={20} size={132} color={kitchen.flame} style={{ whiteSpace: 'nowrap' }}>still cooking</MaskText>
      <div style={{ marginTop: 37, font: `900 35px/1.14 ${body}` }}>The pot&apos;s job continues at the table.</div>
    </div>
    <Footer>Kitchen heat lab - test 01</Footer><Grain />
  </AbsoluteFill>;

  if (n === 2) return <AbsoluteFill style={{ background: kitchen.ink, color: kitchen.white }}>
    <FullVideo src="video/stew-35629815.mp4" trim={42} dim={.28} />
    <Brand />
    <div style={{ position: 'absolute', left: 54, right: 130, top: 820, zIndex: 35 }}>
      <Kicker color={kitchen.teal}>Tool 01 - ttukbaegi</Kicker>
      <MaskText at={7} size={145}>Holds heat</MaskText>
      <MaskText at={16} size={91} color={kitchen.flame} style={{ whiteSpace: 'nowrap' }}>keeps changing food</MaskText>
      <div style={{ marginTop: 43, display: 'flex', alignItems: 'center', gap: 17 }}>
        <div style={{ height: 8, flex: clamp(frame, [25, 40], [0, 1]), background: kitchen.flame }} />
        <div style={{ font: `900 28px/1 ${body}`, color: kitchen.steel }}>BURNER TO TABLE</div>
      </div>
    </div>
    <Footer>Residual heat is part of the recipe</Footer><Grain />
  </AbsoluteFill>;

  if (n === 3) return <AbsoluteFill style={{ background: kitchen.yellow, color: kitchen.ink }}>
    <PhotoCut src="assets/images/posts/299/pexels-korean-ramen-pot.jpg" accent={kitchen.ink} top={150} size={820} />
    <Brand color={kitchen.ink} />
    <div style={{ position: 'absolute', left: 54, right: 120, top: 1000, zIndex: 35 }}>
      <Kicker color={kitchen.ink}>Tool 02 - thin ramen pot</Kicker>
      <Typewriter text="FAST HEAT." at={7} duration={18} color={kitchen.ink} size={130} />
      <MaskText at={25} size={105} color={kitchen.flame} style={{ whiteSpace: 'nowrap' }}>Fast overflow.</MaskText>
      <div style={{ marginTop: 30, font: `900 29px/1.1 ${body}` }}>LIGHT - REACTIVE - NOT UNIVERSAL</div>
    </div>
    <Footer color="rgba(17,21,26,.65)">Check material - handle - burner fit</Footer><Grain />
  </AbsoluteFill>;

  if (n === 4) return <AbsoluteFill style={{ background: kitchen.ink, color: kitchen.white }}>
    <FullVideo src="video/bbq-34753874.mp4" trim={85} dim={.42} />
    <Brand />
    <div style={{ position: 'absolute', left: 54, right: 120, top: 720, zIndex: 35 }}>
      <Kicker color={kitchen.teal}>Korean BBQ workflow</Kicker>
      <MaskText at={8} size={128} color={kitchen.white} style={{ whiteSpace: 'nowrap' }}>Pan <span style={{ color: kitchen.flame }}>≠</span> system</MaskText>
      <div style={{ marginTop: 37, display: 'flex', gap: 12, flexWrap: 'wrap' }}>{['VENT', 'GREASE', 'TONGS', 'SCISSORS'].map((x, i) => {
        const p = clamp(frame, [28 + i * 7, 39 + i * 7], [0, 1]);
        return <div key={x} style={{ padding: '17px 20px', background: i === 3 ? kitchen.flame : 'rgba(255,255,255,.12)', border: '2px solid rgba(255,255,255,.35)', font: `900 22px/1 ${body}`, letterSpacing: 1.6, opacity: p, transform: `translateY(${(1 - p) * 22}px)` }}>{x}</div>;
      })}</div>
    </div>
    <Footer>One pan cannot solve the room</Footer><Grain />
  </AbsoluteFill>;

  if (n === 5) return <KitchenCardV2 />;

  if (n === 6) return <AbsoluteFill style={{ background: kitchen.white, color: kitchen.ink }}>
    <PhotoCut src="assets/images/posts/299/pexels-bbq-scissors.jpg" accent={kitchen.flame} top={150} size={810} />
    <Brand color={kitchen.ink} />
    <div style={{ position: 'absolute', left: 54, right: 120, top: 970, zIndex: 35 }}>
      <Kicker color={kitchen.flame}>Lowest-risk first upgrade</Kicker>
      <Typewriter text="SCISSORS" at={7} duration={18} color={kitchen.ink} size={151} />
      <MaskText at={24} size={88} color={kitchen.teal} style={{ whiteSpace: 'nowrap' }}>before the grill pan</MaskText>
      <div style={{ marginTop: 28, borderTop: `6px solid ${kitchen.ink}`, paddingTop: 20, font: `900 28px/1.14 ${body}` }}>CHECK STOVE - VENT - CLEANUP</div>
    </div>
    <Footer color="rgba(17,21,26,.62)">Buy the workflow - not the prop</Footer><Grain />
  </AbsoluteFill>;

  return <AbsoluteFill style={{ background: kitchen.ink, color: kitchen.white }}>
    <FullVideo src="video/stonepot-37391013.mp4" trim={95} dim={.5} />
    <Brand />
    <div style={{ position: 'absolute', left: 54, right: 140, top: 690, zIndex: 35 }}>
      <Kicker color={kitchen.teal}>Before you buy</Kicker>
      <MaskText at={7} size={157}>Buy for</MaskText>
      <MaskText at={15} size={183} color={kitchen.flame}>the heat</MaskText>
      <div style={{ marginTop: 34, font: `900 42px/1.12 ${body}` }}>Not the photograph.</div>
      <div style={{ marginTop: 50, font: `900 33px/1.12 ${body}` }}>Save this before building the kit.</div>
      <div style={{ marginTop: 48, borderTop: `8px solid ${kitchen.teal}`, paddingTop: 23, font: `900 76px/1 ${body}` }}>epickor.com</div>
    </div>
    <Footer>Full Korean cookware decision guide</Footer><Grain />
  </AbsoluteFill>;
}

function KitchenCardV2() {
  const frame = useCurrentFrame();
  const rows = [['STEW', 'TTUKBAEGI'], ['RAMYEON', 'COMPATIBLE SMALL POT'], ['HOME BBQ', 'SCISSORS + TONGS FIRST'], ['MIXED USE', 'KEEP YOUR SAUCEPAN']];
  return <AbsoluteFill style={{ background: kitchen.ink, color: kitchen.white }}>
    <FullVideo src="video/bbq-37905787.mp4" trim={45} dim={.58} />
    <Brand />
    <div style={{ position: 'absolute', left: 54, right: 112, top: 150, bottom: 600, zIndex: 35, background: 'rgba(17,21,26,.92)', border: '2px solid rgba(183,194,201,.38)', padding: '39px 38px', boxSizing: 'border-box' }}>
      <Kicker color={kitchen.teal}>Heat-lab result</Kicker>
      <MaskText at={7} size={105} style={{ marginTop: 24 }}>What do you repeat?</MaskText>
      <div style={{ marginTop: 34, borderTop: `5px solid ${kitchen.flame}` }}>{rows.map(([a, b], i) => {
        const p = clamp(frame, [34 + i * 42, 47 + i * 42], [0, 1]);
        return <div key={a} style={{ minHeight: 158, display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, alignItems: 'center', borderBottom: '1px solid rgba(183,194,201,.28)', opacity: p, transform: `translateX(${(1 - p) * 36}px)` }}>
          <div style={{ color: kitchen.steel, font: `900 23px/1 ${body}`, letterSpacing: 1.7 }}>{a}</div>
          <div style={{ color: i === 3 ? kitchen.teal : kitchen.white, font: `900 ${i === 1 || i === 2 ? 31 : 40}px/1.04 ${body}`, whiteSpace: 'nowrap' }}>{b}</div>
        </div>;
      })}</div>
    </div>
    <Grain />
  </AbsoluteFill>;
}

function ReelFinal({ props, starts, durations, Scene, beats, accent, captionLight = false, wipe }: { props: ReelProps; starts: number[]; durations: number[]; Scene: (props: SceneProps) => ReactNode; beats: CaptionBeat[]; accent: string; captionLight?: boolean; wipe: string }) {
  return <AbsoluteFill style={{ background: '#111' }}>
    {starts.map((start, i) => <Sequence key={start} from={start} durationInFrames={durations[i]} premountFor={30}><Scene n={i + 1} /></Sequence>)}
    {(props.audioSegments || []).map((segment) => <Sequence key={segment.part} from={segment.startFrame} durationInFrames={segment.durationFrames} premountFor={15}><Audio src={staticFile(segment.staticFilePath)} /></Sequence>)}
    <SceneWipes starts={starts} color={wipe} />
    <PremiumCaptions beats={beats} accent={accent} light={captionLight} />
  </AbsoluteFill>;
}

export function Reel301V01Composition(props: ReelProps) {
  return <ReelFinal props={props} starts={[0, 125, 260, 410, 620, 920, 1070]} durations={[125, 135, 150, 210, 300, 150, 150]} Scene={SocialScene} beats={captions301.beats} accent={social.red} wipe={social.cobalt} />;
}

export function Reel302V01Composition(props: ReelProps) {
  return <ReelFinal props={props} starts={[0, 120, 270, 430, 630, 930, 1080]} durations={[120, 150, 160, 200, 300, 150, 140]} Scene={MorningScene} beats={captions302.beats} accent={morning.red} captionLight wipe={morning.yellow} />;
}

export function Reel299V01Composition(props: ReelProps) {
  return <ReelFinal props={props} starts={[0, 105, 240, 360, 585, 855, 990]} durations={[105, 135, 120, 225, 270, 135, 114]} Scene={KitchenScene} beats={captions299.beats} accent={kitchen.teal} wipe={kitchen.flame} />;
}

export function Reel301V02Composition(props: ReelProps) {
  return <ReelFinal props={props} starts={[0, 125, 260, 410, 620, 920, 1070]} durations={[125, 135, 150, 210, 300, 150, 150]} Scene={SocialScene} beats={captions301.beats} accent={social.red} wipe={social.cobalt} />;
}

export function Reel302V03Composition(props: ReelProps) {
  return <ReelFinal props={props} starts={[0, 120, 270, 430, 630, 930, 1080]} durations={[120, 150, 160, 200, 300, 150, 140]} Scene={MorningSceneV2} beats={captions302.beats} accent={morning.red} captionLight wipe={morning.yellow} />;
}

export function Reel299V02Composition(props: ReelProps) {
  return <ReelFinal props={props} starts={[0, 105, 240, 360, 585, 855, 990]} durations={[105, 135, 120, 225, 270, 135, 114]} Scene={KitchenSceneV2} beats={captions299.beats} accent={kitchen.teal} wipe={kitchen.flame} />;
}
