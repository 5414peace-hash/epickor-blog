/**
 * Batch 2026-08-11 — three Reels, three visual systems.
 *
 * Representative direction, 2026-08-11: "말자막 및 ons 디자인도 참신하게 가고."
 * Same instruction the card news already runs under — a new system per batch,
 * derived from the subject rather than reused from the house template. So none
 * of Batch0726Kit's Ons/Captions/Outro are used here. Its Cut, VideoCut,
 * VoiceTrack, Watermark, clamp and OVERLAP still are, because those encode
 * measured fixes (16-frame overlap, frame-accurate OffthreadVideo, Sequence-
 * mounted audio that cannot be silently dropped) and are not styling.
 *
 *   D cheonggyecheon  EXCAVATION      survey tape, section lines, strike-through
 *   E sungnyemun      RECORD          paper index card, correction stamp
 *   F suneung         HOLD            departure board, countdown, terminal type
 *
 * Shared constraints that are NOT design choices and must survive any restyle:
 *  - The narration caption band starts at y=1400. Nothing above may descend past
 *    y=1340.
 *  - Every cut-scoped text element goes through TextGate so copy clears the frame
 *    before the next cut's copy arrives (the `YOU DIPLDED` overlap, QA 2026-07-27).
 *  - The outro carries epickor.com as a solid chip, never as coloured text over
 *    footage.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { CSSProperties, ReactNode } from 'react';
import { Cut, OVERLAP, VideoCut, VoiceTrack, clamp } from './Batch0726Kit';

/* ------------------------------------------------------------------ shared */

const mono = "Consolas, 'Courier New', ui-monospace, monospace";
const grotesk = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const condensed = "'Arial Narrow', 'Franklin Gothic Condensed', Impact, sans-serif";

export type CaptionBeat = { text: string; startFrame: number; endFrame: number };
export type Manifest = {
  slug: string;
  durationInFrames: number;
  cuts: { n: number; from: number; len: number; src: string }[];
  beats: CaptionBeat[];
};

/** Copy must clear the frame before the next cut's copy arrives. */
function TextGate({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const exit = clamp(frame, [durationInFrames - OVERLAP, durationInFrames - Math.round(OVERLAP / 2)], [1, 0]);
  return <div style={{ ...style, opacity: exit }}>{children}</div>;
}

/** Legibility floor for every system: media is footage, not a designed backdrop. */
function Scrim({ from = 0, to = 1, style }: { from?: number; to?: number; style?: CSSProperties }) {
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, rgba(0,0,0,${from}) 0%, rgba(0,0,0,${to}) 46%, rgba(0,0,0,0) 72%)`,
      ...style,
    }} />
  );
}

function Watermark({ color = 'rgba(255,255,255,.86)' }: { color?: string }) {
  return (
    <div style={{
      position: 'absolute', left: 46, top: 44, zIndex: 200, color,
      font: `800 20px/1 ${mono}`, letterSpacing: 4.5, textTransform: 'uppercase',
      textShadow: '0 2px 10px rgba(0,0,0,.9)',
    }}>EPICKOR.COM</div>
  );
}

/* =================================================================== D ==== */
/* EXCAVATION — survey tape, section lines, one strike-through.               */

const D = { concrete: '#22262a', tape: '#ffd200', water: '#2aa3b8', chalk: '#f4f2ec' };

/** Diagonal hazard tape. Reads as site signage, not a UI chip. */
function TapeStrip({ children, at = 0, bg = D.tape }: { children: ReactNode; at?: number; bg?: string }) {
  const frame = useCurrentFrame();
  const p = clamp(frame, [at, at + 9], [0, 1]);
  return (
    <div style={{
      display: 'inline-block', transformOrigin: 'left center',
      transform: `scaleX(${p})`, opacity: p,
      background: `repeating-linear-gradient(115deg, ${bg} 0 16px, #12151800 16px 30px), ${bg}`,
      color: '#11151a', padding: '9px 18px 10px',
      font: `800 21px/1 ${mono}`, letterSpacing: 3.4, textTransform: 'uppercase',
      boxShadow: '0 6px 20px rgba(0,0,0,.5)',
    }}>{children}</div>
  );
}

/**
 * Copy is uncovered by a section line travelling down the block, not wiped in
 * from the side. That is the gesture the whole Reel is about: a lid coming off.
 */
function SectionReveal({
  children, at = 0, size = 128, color = D.chalk, span = 16, style,
}: { children: ReactNode; at?: number; size?: number; color?: string; span?: number; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const p = clamp(frame, [at, at + span], [0, 1]);
  return (
    <div style={{ position: 'relative', ...style }}>
      <div style={{
        color, font: `700 ${size}px/.94 ${condensed}`, letterSpacing: -1.5,
        textTransform: 'uppercase',
        clipPath: `inset(0 0 ${(1 - p) * 100}% 0)`,
        textShadow: '0 5px 26px rgba(0,0,0,.85)',
      }}>{children}</div>
      <div style={{
        position: 'absolute', left: -10, right: -10,
        top: `${p * 100}%`, height: 4, background: D.tape,
        opacity: p > 0 && p < 1 ? 1 : 0, boxShadow: `0 0 18px ${D.tape}`,
      }} />
    </div>
  );
}

type DOns = {
  from: number; to: number;
  tape: string; line1?: string; line2: string; note?: string;
  size?: number; strike?: boolean;
};

function OnsExcavation({ tape, line1, line2, note, size = 124, strike }: Omit<DOns, 'from' | 'to'>) {
  const frame = useCurrentFrame();
  const cut = clamp(frame, [26, 40], [0, 1]);
  // The note has no reveal of its own, so without an explicit delay it lands
  // before the headline it belongs to — measured on the first D still at f30,
  // where "Elevated. On concrete stilts." was floating under an empty tape strip.
  const noteAt = strike ? 58 : 36;
  const noteIn = clamp(frame, [noteAt, noteAt + 10], [0, 1]);
  return (
    <TextGate style={{ position: 'absolute', left: 56, right: 96, top: 236, zIndex: 60 }}>
      <TapeStrip at={6}>{tape}</TapeStrip>
      {line1 && (
        <div style={{ position: 'relative', marginTop: 22 }}>
          <SectionReveal at={12} size={size}>{line1}</SectionReveal>
          {strike && (
            <div style={{
              position: 'absolute', left: -6, top: '52%', height: 9,
              width: `${cut * 100}%`, background: D.tape, boxShadow: `0 0 22px ${D.tape}`,
            }} />
          )}
        </div>
      )}
      <SectionReveal
        at={strike ? 42 : 20}
        size={Math.round(size * 1.06)}
        color={D.tape}
        style={{ marginTop: 16 }}
      >{line2}</SectionReveal>
      {note && (
        <div style={{
          marginTop: 22, color: D.chalk, font: `700 30px/1.25 ${mono}`,
          letterSpacing: .4, textShadow: '0 2px 14px rgba(0,0,0,.9)',
          opacity: noteIn, transform: `translateY(${(1 - noteIn) * 10}px)`,
        }}>{note}</div>
      )}
    </TextGate>
  );
}

/** Flat survey-tape caption bar. No radius, no soft shadow — site signage. */
function CaptionsExcavation({ beats }: { beats: CaptionBeat[] }) {
  const frame = useCurrentFrame();
  const active = beats.find((b) => frame >= b.startFrame && frame <= b.endFrame);
  if (!active) return null;
  const entry = clamp(frame, [active.startFrame, active.startFrame + 6], [0, 1]);
  const run = clamp(frame, [active.startFrame, active.endFrame], [0, 1]);
  return (
    <div data-caption-safe-zone="instagram-reels" style={{
      position: 'absolute', zIndex: 150, left: 72, right: 128, bottom: 410,
      display: 'flex', alignItems: 'stretch', minHeight: 92,
      background: 'rgba(16,19,22,.90)', border: `2px solid rgba(255,210,0,.42)`,
      opacity: entry, transform: `translateY(${(1 - entry) * 14}px)`,
      boxShadow: '0 12px 40px rgba(0,0,0,.5)',
    }}>
      <div style={{
        width: 22, flex: '0 0 22px',
        background: `repeating-linear-gradient(135deg, ${D.tape} 0 9px, #14171a 9px 18px)`,
      }} />
      <div style={{
        flex: 1, display: 'grid', placeItems: 'center', padding: '15px 22px 17px',
        color: D.chalk, font: `800 34px/1.14 ${grotesk}`, letterSpacing: -.2,
        textAlign: 'center', textWrap: 'balance',
      }}>{active.text}</div>
      <div style={{
        position: 'absolute', left: 22, bottom: 0, height: 4,
        width: `calc(${run * 100}% - 22px)`, background: D.tape, opacity: .85,
      }} />
    </div>
  );
}

function OutroExcavation({ hook, sub }: { hook: string; sub: string }) {
  const frame = useCurrentFrame();
  const chip = clamp(frame, [28, 44], [0, 1]);
  return (
    <TextGate style={{ position: 'absolute', left: 56, right: 96, top: 690, zIndex: 62 }}>
      <TapeStrip at={2}>Cheonggyecheon · Seoul</TapeStrip>
      <SectionReveal at={12} size={108} color={D.tape} style={{ marginTop: 22 }}>{hook}</SectionReveal>
      <div style={{
        marginTop: 20, color: D.chalk, font: `700 30px/1.25 ${mono}`,
        textShadow: '0 2px 14px rgba(0,0,0,.9)',
      }}>{sub}</div>
      <div style={{
        marginTop: 28, display: 'inline-block', background: '#d24437', color: '#fff',
        padding: '17px 28px', font: `700 56px/1 ${condensed}`, letterSpacing: .5,
        opacity: chip, transform: `translateY(${(1 - chip) * 14}px)`,
        boxShadow: '0 10px 34px rgba(0,0,0,.55)',
      }}>epickor.com</div>
    </TextGate>
  );
}

/* =================================================================== E ==== */
/* RECORD — a paper index card, and one correction stamp.                     */

const E = { ink: '#171512', ember: '#d8451f', paper: '#e9e1d1', jade: '#2f7d63' };

type EOns = {
  from: number; to: number;
  field: string; value: string; note?: string;
  size?: number; stamp?: string; struck?: string;
};

function OnsRecord({ field, value, note, size = 104, stamp, struck }: Omit<EOns, 'from' | 'to'>) {
  const frame = useCurrentFrame();
  const card = clamp(frame, [4, 15], [0, 1]);
  const rule = clamp(frame, [12, 26], [0, 1]);
  const type = clamp(frame, [16, 34], [0, 1]);
  const strike = clamp(frame, [40, 54], [0, 1]);
  const stampIn = clamp(frame, [56, 66], [0, 1]);
  const chars = Math.round((struck ?? value).length * type);
  return (
    <TextGate style={{ position: 'absolute', left: 56, right: 96, top: 244, zIndex: 60 }}>
      <div style={{
        background: E.paper, color: E.ink, padding: '26px 30px 30px',
        transformOrigin: 'top left', transform: `scaleY(${card})`, opacity: card,
        boxShadow: '0 16px 44px rgba(0,0,0,.55)',
        borderLeft: `10px solid ${E.ember}`,
      }}>
        <div style={{ font: `700 21px/1 ${mono}`, letterSpacing: 4.2, textTransform: 'uppercase', color: '#6b6355' }}>
          {field}
        </div>
        <div style={{ height: 2, background: '#bdb3a0', margin: '14px 0 18px', transformOrigin: 'left', transform: `scaleX(${rule})` }} />
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{ font: `700 ${size}px/.98 ${condensed}`, letterSpacing: -1.2, textTransform: 'uppercase' }}>
            {(struck ?? value).slice(0, chars)}
          </div>
          {struck && (
            <div style={{
              position: 'absolute', left: -4, top: '50%', height: 7,
              width: `${strike * 104}%`, background: E.ember,
            }} />
          )}
        </div>
        {struck && (
          <div style={{
            marginTop: 16, display: 'inline-block', color: E.ember,
            border: `4px solid ${E.ember}`, padding: '8px 18px 10px',
            font: `700 62px/1 ${grotesk}`, letterSpacing: 2,
            transform: `rotate(-4deg) scale(${0.86 + stampIn * 0.14})`, opacity: stampIn,
          }}>{stamp}</div>
        )}
        {note && (
          <div style={{ marginTop: 16, font: `600 27px/1.3 ${mono}`, color: '#4a443a' }}>{note}</div>
        )}
      </div>
    </TextGate>
  );
}

/** Index-card captions: cream paper, dark type. Inverted from every other Reel. */
function CaptionsRecord({ beats }: { beats: CaptionBeat[] }) {
  const frame = useCurrentFrame();
  const active = beats.find((b) => frame >= b.startFrame && frame <= b.endFrame);
  if (!active) return null;
  const entry = clamp(frame, [active.startFrame, active.startFrame + 6], [0, 1]);
  const run = clamp(frame, [active.startFrame, active.endFrame], [0, 1]);
  return (
    <div data-caption-safe-zone="instagram-reels" style={{
      position: 'absolute', zIndex: 150, left: 72, right: 128, bottom: 410, minHeight: 92,
      background: E.paper, color: E.ink, borderLeft: `12px solid ${E.ember}`,
      display: 'grid', placeItems: 'center', padding: '16px 26px 18px',
      font: `800 34px/1.14 ${grotesk}`, letterSpacing: -.2, textAlign: 'center', textWrap: 'balance',
      opacity: entry, transform: `translateY(${(1 - entry) * 14}px)`,
      boxShadow: '0 14px 44px rgba(0,0,0,.5)',
    }}>
      {active.text}
      <div style={{
        position: 'absolute', left: 0, bottom: 0, height: 4,
        width: `${run * 100}%`, background: E.ember, opacity: .55,
      }} />
    </div>
  );
}

function OutroRecord({ hook, sub }: { hook: string; sub: string }) {
  const frame = useCurrentFrame();
  const card = clamp(frame, [2, 14], [0, 1]);
  const chip = clamp(frame, [30, 46], [0, 1]);
  return (
    <TextGate style={{ position: 'absolute', left: 56, right: 96, top: 690, zIndex: 62 }}>
      <div style={{
        background: E.paper, color: E.ink, padding: '26px 30px 30px',
        borderLeft: `10px solid ${E.ember}`, transformOrigin: 'top left',
        transform: `scaleY(${card})`, opacity: card, boxShadow: '0 16px 44px rgba(0,0,0,.55)',
      }}>
        <div style={{ font: `700 21px/1 ${mono}`, letterSpacing: 4.2, textTransform: 'uppercase', color: '#6b6355' }}>
          Sungnyemun · Seoul
        </div>
        <div style={{ height: 2, background: '#bdb3a0', margin: '14px 0 18px' }} />
        <div style={{ font: `700 96px/.98 ${condensed}`, letterSpacing: -1.2, textTransform: 'uppercase' }}>{hook}</div>
        <div style={{ marginTop: 16, font: `600 27px/1.3 ${mono}`, color: '#4a443a' }}>{sub}</div>
      </div>
      <div style={{
        marginTop: 26, display: 'inline-block', background: '#d24437', color: '#fff',
        padding: '17px 28px', font: `700 56px/1 ${condensed}`, letterSpacing: .5,
        opacity: chip, transform: `translateY(${(1 - chip) * 14}px)`,
        boxShadow: '0 10px 34px rgba(0,0,0,.55)',
      }}>epickor.com</div>
    </TextGate>
  );
}

/* =================================================================== F ==== */
/* HOLD — a departure board and a clock that stops.                           */

const F = { navy: '#0b1220', amber: '#ffb020', paper: '#f5f7fa', alert: '#e03131' };

type BoardRow = { label: string; status: string; alert?: boolean };
type FOns = { from: number; to: number; head?: string; rows: BoardRow[] };

function OnsBoard({ head, rows }: Omit<FOns, 'from' | 'to'>) {
  const frame = useCurrentFrame();
  const headIn = clamp(frame, [4, 14], [0, 1]);
  return (
    <TextGate style={{ position: 'absolute', left: 56, right: 96, top: 250, zIndex: 60 }}>
      {head && (
        <div style={{
          color: F.amber, font: `700 22px/1 ${mono}`, letterSpacing: 5,
          textTransform: 'uppercase', opacity: headIn, marginBottom: 16,
          textShadow: '0 2px 10px rgba(0,0,0,.9)',
        }}>{head}</div>
      )}
      {rows.map((r, i) => {
        const at = 14 + i * 11;
        const flip = clamp(frame, [at, at + 9], [0, 1]);
        return (
          <div key={r.label} style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            gap: 20, background: 'rgba(6,10,18,.86)', borderBottom: '2px solid rgba(255,176,32,.28)',
            padding: '14px 20px 15px', marginBottom: 8,
            transformOrigin: 'top', transform: `perspective(600px) rotateX(${(1 - flip) * -78}deg)`,
            opacity: flip,
          }}>
            <span style={{ color: F.paper, font: `700 40px/1 ${condensed}`, letterSpacing: 1.4, textTransform: 'uppercase' }}>
              {r.label}
            </span>
            <span style={{
              color: r.alert ? F.alert : F.amber, font: `700 44px/1 ${mono}`, letterSpacing: -.5,
              whiteSpace: 'nowrap',
            }}>{r.status}</span>
          </div>
        );
      })}
    </TextGate>
  );
}

/**
 * The only persistent element in the batch. It exists so that its removal reads:
 * the board and the clock both leave before the final cut, because that beat is
 * not data, it is the people outside the gate.
 */
function HoldClock({ from, to }: { from: number; to: number }) {
  const frame = useCurrentFrame();
  if (frame < from || frame > to) return null;
  const fadeIn = clamp(frame, [from, from + 10], [0, 1]);
  const fadeOut = clamp(frame, [to - 14, to], [1, 0]);
  const elapsed = (frame - from) / 30;
  const remain = Math.max(0, 35 * 60 - Math.round(elapsed * 60 * (35 / ((to - from) / 30))));
  const mm = String(Math.floor(remain / 60)).padStart(2, '0');
  const ss = String(remain % 60).padStart(2, '0');
  return (
    <div style={{
      position: 'absolute', right: 74, top: 132, zIndex: 120, textAlign: 'right',
      opacity: Math.min(fadeIn, fadeOut),
    }}>
      <div style={{ color: 'rgba(255,255,255,.66)', font: `700 17px/1 ${mono}`, letterSpacing: 4 }}>
        AIRSPACE HOLD
      </div>
      <div style={{
        marginTop: 7, color: F.amber, font: `700 58px/1 ${mono}`, letterSpacing: -1,
        textShadow: '0 2px 14px rgba(0,0,0,.9)',
      }}>{mm}:{ss}</div>
    </div>
  );
}

/** Terminal readout: amber monospace, thin dark bar, blinking cursor block. */
function CaptionsBoard({ beats }: { beats: CaptionBeat[] }) {
  const frame = useCurrentFrame();
  const active = beats.find((b) => frame >= b.startFrame && frame <= b.endFrame);
  if (!active) return null;
  const entry = clamp(frame, [active.startFrame, active.startFrame + 5], [0, 1]);
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <div data-caption-safe-zone="instagram-reels" style={{
      position: 'absolute', zIndex: 150, left: 72, right: 128, bottom: 410, minHeight: 90,
      background: 'rgba(5,9,16,.90)', border: '1px solid rgba(255,176,32,.34)',
      display: 'grid', placeItems: 'center', padding: '15px 24px 17px',
      color: F.paper, font: `700 33px/1.16 ${grotesk}`, letterSpacing: -.1,
      textAlign: 'center', textWrap: 'balance',
      opacity: entry, transform: `translateY(${(1 - entry) * 12}px)`,
      boxShadow: '0 12px 40px rgba(0,0,0,.55)',
    }}>
      <div>
        {active.text}
        <span style={{
          display: 'inline-block', width: 15, height: 30, marginLeft: 9,
          verticalAlign: '-4px', background: F.amber, opacity: blink ? .95 : 0,
        }} />
      </div>
    </div>
  );
}

function OutroBoard({ hook, sub }: { hook: string; sub: string }) {
  const frame = useCurrentFrame();
  const rule = clamp(frame, [4, 16], [0, 1]);
  const head = clamp(frame, [12, 26], [0, 1]);
  const chip = clamp(frame, [30, 46], [0, 1]);
  return (
    <TextGate style={{ position: 'absolute', left: 56, right: 96, top: 700, zIndex: 62 }}>
      <div style={{ height: 6, width: `${rule * 100}%`, background: F.amber }} />
      <div style={{
        marginTop: 24, color: F.paper, font: `700 100px/.98 ${condensed}`,
        letterSpacing: -1.2, textTransform: 'uppercase',
        clipPath: `inset(0 ${(1 - head) * 100}% 0 0)`,
        textShadow: '0 5px 26px rgba(0,0,0,.85)',
      }}>{hook}</div>
      <div style={{
        marginTop: 20, color: F.amber, font: `700 29px/1.25 ${mono}`,
        textShadow: '0 2px 14px rgba(0,0,0,.9)',
      }}>{sub}</div>
      <div style={{
        marginTop: 28, display: 'inline-block', background: '#d24437', color: '#fff',
        padding: '17px 28px', font: `700 56px/1 ${condensed}`, letterSpacing: .5,
        opacity: chip, transform: `translateY(${(1 - chip) * 14}px)`,
        boxShadow: '0 10px 34px rgba(0,0,0,.55)',
      }}>epickor.com</div>
    </TextGate>
  );
}

/* ============================================================== drivers === */

function Media({ manifest }: { manifest: Manifest }) {
  return (
    <>
      {manifest.cuts.map((c, i) => {
        // Cut 1 is pulled back to frame 0 and does not fade in — otherwise the
        // opening frames show bare background (measured on ramyun v015).
        const first = i === 0;
        return (
          <Cut key={c.n} from={first ? 0 : c.from} len={first ? c.len + c.from : c.len}>
            <VideoCut src={c.src} from={1.01} to={1.05} fadeIn={!first} />
          </Cut>
        );
      })}
    </>
  );
}

export function ReelExcavation({
  manifest, ons, outro, audio,
}: {
  manifest: Manifest; ons: DOns[]; outro: { from: number; hook: string; sub: string };
  audio: { part: number; startFrame: number }[];
}) {
  return (
    <AbsoluteFill style={{ background: D.concrete }}>
      <Media manifest={manifest} />
      <Scrim to={0.52} />
      {ons.map((o) => (
        <Cut key={`ons-${o.from}`} from={o.from} len={o.to - o.from}>
          <OnsExcavation {...o} />
        </Cut>
      ))}
      <Cut from={outro.from} len={manifest.durationInFrames - outro.from - OVERLAP}>
        <OutroExcavation hook={outro.hook} sub={outro.sub} />
      </Cut>
      <VoiceTrack slug={manifest.slug} segments={audio} />
      <CaptionsExcavation beats={manifest.beats} />
      <Watermark />
    </AbsoluteFill>
  );
}

export function ReelRecord({
  manifest, ons, outro, audio,
}: {
  manifest: Manifest; ons: EOns[]; outro: { from: number; hook: string; sub: string };
  audio: { part: number; startFrame: number }[];
}) {
  return (
    <AbsoluteFill style={{ background: E.ink }}>
      <Media manifest={manifest} />
      <Scrim to={0.5} />
      {ons.map((o) => (
        <Cut key={`ons-${o.from}`} from={o.from} len={o.to - o.from}>
          <OnsRecord {...o} />
        </Cut>
      ))}
      <Cut from={outro.from} len={manifest.durationInFrames - outro.from - OVERLAP}>
        <OutroRecord hook={outro.hook} sub={outro.sub} />
      </Cut>
      <VoiceTrack slug={manifest.slug} segments={audio} />
      <CaptionsRecord beats={manifest.beats} />
      <Watermark />
    </AbsoluteFill>
  );
}

export function ReelHold({
  manifest, ons, outro, audio, clock,
}: {
  manifest: Manifest; ons: FOns[]; outro: { from: number; hook: string; sub: string };
  audio: { part: number; startFrame: number }[]; clock: { from: number; to: number };
}) {
  return (
    <AbsoluteFill style={{ background: F.navy }}>
      <Media manifest={manifest} />
      <Scrim to={0.55} />
      {ons.map((o) => (
        <Cut key={`ons-${o.from}`} from={o.from} len={o.to - o.from}>
          <OnsBoard {...o} />
        </Cut>
      ))}
      <HoldClock from={clock.from} to={clock.to} />
      <Cut from={outro.from} len={manifest.durationInFrames - outro.from - OVERLAP}>
        <OutroBoard hook={outro.hook} sub={outro.sub} />
      </Cut>
      <VoiceTrack slug={manifest.slug} segments={audio} />
      <CaptionsBoard beats={manifest.beats} />
      <Watermark />
    </AbsoluteFill>
  );
}
