/**
 * Batch 2026-08-11 — three Reels, three visual systems. Second design pass.
 *
 * Representative review of v1: "전체적으로 3개 다 상단의 ons 디자인이 별로", and for
 * Sungnyemun specifically "너무 올드해보인다 … 차라리 좀 오리엔탈릭한 느낌".
 *
 * The v1 systems were decorated differently but built identically: every one was a
 * left-aligned stack at top ~240 of small label → huge condensed uppercase → mono
 * note. On a phone they read as the same slab of text three times, and the condensed
 * face resolved to Arial Narrow on Windows, which is what looked dated. This pass
 * changes the three things that actually differed by nothing:
 *
 *   anchor    D full-width section band · E vertical plaque on the left · F centred card
 *   face      D Bahnschrift (DIN) · E Constantia + HANBatang · F Segoe UI Black + Consolas
 *   gesture   D a lid lifting off · E a board hung and a seal stamped · F split-flap
 *
 * D EXCAVATION → SECTION.  The block is a cross-section: a rule is street level, the
 *   road sits above it in concrete grey, the water below it in cyan. The signature
 *   beat lifts the upper half away. Hazard-tape yellow is gone — it read as generic
 *   construction clip-art rather than as this stream.
 *
 * E RECORD → HYEONPAN (현판).  Sungnyemun's plaque is the one gate plaque in Seoul
 *   written vertically; the traditional explanation is that 禮 is 火 in 오행, so the
 *   name was hung as a flame to press down the fire energy of Gwanaksan (ko.wikipedia
 *   숭례문: "관악산의 화기에 대응하기 위하여 세로로 달았다고 전해진다"). The gate then burned
 *   in 2008 and the plaque itself fell and broke into 38 pieces. So the ONS *is* a
 *   vertical hanging plaque in 단청 pigments, and the correction lands as a 낙관 seal.
 *   The shape of the graphic is the object the Reel is about.
 *
 * F HOLD.  Kept the split-flap idea, rebuilt at a size that reads, and given the
 *   thing it was missing: a centred opening card built to work as the grid thumbnail.
 *
 * Shared constraints that are NOT design choices and must survive any restyle:
 *  - The narration caption band starts at y=1400. Nothing above may descend past
 *    y=1340.
 *  - Every cut-scoped text element goes through TextGate so copy clears the frame
 *    before the next cut's copy arrives (the `YOU DIPLDED` overlap, QA 2026-07-27).
 *  - The outro carries epickor.com as a solid chip, never as coloured text over
 *    footage.
 *  - The opening card must sit inside the conservative profile-grid safe area,
 *    roughly y 520-1200 at 1080x1920, because frame 0 is the thumbnail.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { CSSProperties, ReactNode } from 'react';
import { Cut, OVERLAP, VideoCut, VoiceTrack, clamp } from './Batch0726Kit';

/* ------------------------------------------------------------------ shared */

const mono = "Consolas, 'Courier New', ui-monospace, monospace";
const grotesk = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const black = "'Segoe UI Black', 'Segoe UI', 'Arial Black', sans-serif";
/** Bahnschrift is Microsoft's DIN and ships with Windows 10+; it is the modern
 *  engineering-signage face Arial Narrow was standing in for. */
const din = "Bahnschrift, 'DIN Alternate', 'Segoe UI', sans-serif";
const serif = "Constantia, Cambria, Georgia, 'Times New Roman', serif";
/** HANBatang carries the Hanja 崇禮門 that Malgun Gothic does not. */
const hanja = "HANBatang, Batang, BatangChe, 'Malgun Gothic', serif";

const CHIP = '#d24437';

export type CaptionBeat = { text: string; startFrame: number; endFrame: number };
export type Manifest = {
  slug: string;
  durationInFrames: number;
  cuts: { n: number; from: number; len: number; src: string; kind?: string }[];
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

function Chip({ at = 30 }: { at?: number }) {
  const frame = useCurrentFrame();
  const p = clamp(frame, [at, at + 14], [0, 1]);
  return (
    <div style={{
      marginTop: 26, display: 'inline-block', background: CHIP, color: '#fff',
      padding: '16px 28px 18px', fontFamily: din, fontWeight: 700, fontSize: 54,
      lineHeight: 1, letterSpacing: .5, opacity: p,
      transform: `translateY(${(1 - p) * 14}px)`,
      boxShadow: '0 10px 34px rgba(0,0,0,.55)',
    }}>epickor.com</div>
  );
}

/* =================================================================== D ==== */
/* SECTION — a rule is street level. Road above it, water below it.           */

const D = {
  ink: '#0E1215',
  concrete: '#98A2A8',
  water: '#31C6D4',
  bone: '#F4F2EC',
};

type DOns = {
  from: number; to: number;
  label: string; then?: string; value: string; note?: string;
  size?: number; lift?: boolean;
};

/**
 * This system is the only one in the batch with no panel behind it — the words sit
 * directly on the footage, which is the point of a section drawing. That broke over
 * Cheonggyecheon's bright sky: the shared Scrim is a 180deg gradient fully
 * transparent at y=0 that only reaches 0.52 at y=883, so across the ONS band it
 * contributes almost nothing and the grey label and note washed out.
 *
 * zIndex -1, not 0: an absolutely positioned child with z-index auto paints in the
 * positioned layer, i.e. ON TOP of the in-flow text it is meant to sit behind.
 * TextGate's z-index of 60 makes it a stacking context, so a negative child lands
 * above the footage and below the copy.
 *
 * It fades in at the top as well as out at the bottom. A plate that starts at full
 * strength draws a hard horizontal seam across the frame, which is what the first
 * attempt looked like — a band, not a gradient.
 */
function SectionPlate() {
  return (
    <div style={{
      position: 'absolute', left: -82, right: -96, top: -150, bottom: -96, zIndex: -1,
      background: 'linear-gradient(180deg,'
        + ' rgba(6,10,12,0) 0%,'
        + ' rgba(6,10,12,.60) 20%,'
        + ' rgba(6,10,12,.80) 34%,'
        + ' rgba(6,10,12,.76) 72%,'
        + ' rgba(6,10,12,0) 100%)',
    }} />
  );
}

/** The depth ruler down the left edge. Cheap, but it is what makes the block read
 *  as a section drawing rather than as a list. */
function DepthTicks({ at = 6 }: { at?: number }) {
  const frame = useCurrentFrame();
  const p = clamp(frame, [at, at + 18], [0, 1]);
  return (
    <div style={{
      position: 'absolute', left: -26, top: 4, bottom: 4, width: 12,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      opacity: p,
    }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ height: 2, width: i === 1 ? 12 : 7, background: i === 1 ? D.water : D.concrete }} />
      ))}
    </div>
  );
}

function OnsSection({ label, then, value, note, size = 116, lift }: Omit<DOns, 'from' | 'to'>) {
  const frame = useCurrentFrame();
  const labelIn = clamp(frame, [4, 14], [0, 1]);
  const rule = clamp(frame, [10, 24], [0, 1]);
  // The lid comes off here: the road slides up and out while the water rises from
  // the rule. Everything else in this Reel is a still statement; this is the move.
  const off = lift ? clamp(frame, [40, 62], [0, 1]) : 0;
  const rise = clamp(frame, lift ? [44, 66] : [18, 34], [0, 1]);
  const noteIn = clamp(frame, lift ? [66, 78] : [30, 42], [0, 1]);
  return (
    <TextGate style={{ position: 'absolute', left: 82, right: 96, top: 232, zIndex: 60 }}>
      {/*
        This system is the only one in the batch with no panel behind it — the words
        sit directly on the footage, which is the point of a section drawing. That
        broke over Cheonggyecheon's bright sky: the shared Scrim is a 180deg gradient
        that is fully transparent at y=0 and only reaches 0.52 at y=883, so at the
        ONS band (y 232-600) it contributes almost nothing and the grey label and
        note washed out. A local plate that fades to nothing at its own bottom edge
        buys the contrast back without turning the block into a box.
      */}
      <SectionPlate />
      <DepthTicks />
      <div style={{
        position: 'relative',
        fontFamily: mono, fontWeight: 700, fontSize: 21, letterSpacing: 5.2,
        textTransform: 'uppercase', color: '#CBD3D8', opacity: labelIn,
        textShadow: '0 2px 10px rgba(0,0,0,.95)',
      }}>{label}</div>

      {then && (
        <div style={{
          marginTop: 16, height: off > 0 ? `${(1 - off) * (size * 0.98)}px` : undefined,
          overflow: 'hidden',
        }}>
          <div style={{
            fontFamily: din, fontWeight: 700, fontStretch: '80%', fontSize: size,
            lineHeight: .98, letterSpacing: -1, textTransform: 'uppercase', color: D.concrete,
            transform: `translateY(${-off * size * 0.55}px)`, opacity: 1 - off * 0.9,
            textShadow: '0 5px 26px rgba(0,0,0,.85)',
          }}>{then}</div>
        </div>
      )}

      <div style={{
        marginTop: 18, height: 5, background: D.water, transformOrigin: 'left',
        transform: `scaleX(${rule})`, boxShadow: `0 0 20px ${D.water}88`,
      }} />

      <div style={{ marginTop: 16, overflow: 'hidden' }}>
        <div style={{
          fontFamily: din, fontWeight: 700, fontStretch: '80%', fontSize: Math.round(size * 1.04),
          lineHeight: .98, letterSpacing: -1, textTransform: 'uppercase', color: D.water,
          clipPath: `inset(0 0 ${(1 - rise) * 100}% 0)`,
          transform: `translateY(${(1 - rise) * 18}px)`,
          textShadow: '0 5px 26px rgba(0,0,0,.9)',
        }}>{value}</div>
      </div>

      {note && (
        <div style={{
          marginTop: 18, fontFamily: grotesk, fontWeight: 600, fontSize: 29, lineHeight: 1.25,
          color: D.bone, opacity: noteIn, transform: `translateY(${(1 - noteIn) * 8}px)`,
          textShadow: '0 2px 14px rgba(0,0,0,.9)',
        }}>{note}</div>
      )}
    </TextGate>
  );
}

function CaptionsSection({ beats }: { beats: CaptionBeat[] }) {
  const frame = useCurrentFrame();
  const active = beats.find((b) => frame >= b.startFrame && frame <= b.endFrame);
  if (!active) return null;
  const entry = clamp(frame, [active.startFrame, active.startFrame + 6], [0, 1]);
  const run = clamp(frame, [active.startFrame, active.endFrame], [0, 1]);
  return (
    <div data-caption-safe-zone="instagram-reels" style={{
      position: 'absolute', zIndex: 150, left: 72, right: 128, bottom: 410, minHeight: 92,
      background: 'rgba(11,15,18,.90)', borderTop: `4px solid ${D.water}`,
      display: 'grid', placeItems: 'center', padding: '15px 22px 17px',
      color: D.bone, font: `800 34px/1.14 ${grotesk}`, letterSpacing: -.2,
      textAlign: 'center', textWrap: 'balance',
      opacity: entry, transform: `translateY(${(1 - entry) * 14}px)`,
      boxShadow: '0 12px 40px rgba(0,0,0,.5)',
    }}>
      {active.text}
      <div style={{
        position: 'absolute', left: 0, bottom: 0, height: 3,
        width: `${run * 100}%`, background: D.water, opacity: .8,
      }} />
    </div>
  );
}

function OutroSection({ hook, sub }: { hook: string; sub: string }) {
  const frame = useCurrentFrame();
  const rule = clamp(frame, [6, 20], [0, 1]);
  const rise = clamp(frame, [14, 32], [0, 1]);
  return (
    <TextGate style={{ position: 'absolute', left: 82, right: 96, top: 660, zIndex: 62 }}>
      <SectionPlate />
      <div style={{
        position: 'relative',
        fontFamily: mono, fontWeight: 700, fontSize: 21, letterSpacing: 5.2,
        textTransform: 'uppercase', color: '#CBD3D8',
      }}>Cheonggyecheon · Seoul</div>
      <div style={{
        marginTop: 16, height: 5, background: D.water, transformOrigin: 'left',
        transform: `scaleX(${rule})`, boxShadow: `0 0 20px ${D.water}88`,
      }} />
      <div style={{ marginTop: 16, overflow: 'hidden' }}>
        <div style={{
          fontFamily: din, fontWeight: 700, fontStretch: '80%', fontSize: 108, lineHeight: .98,
          letterSpacing: -1, textTransform: 'uppercase', color: D.water,
          clipPath: `inset(0 0 ${(1 - rise) * 100}% 0)`,
          textShadow: '0 5px 26px rgba(0,0,0,.9)',
        }}>{hook}</div>
      </div>
      <div style={{
        marginTop: 16, fontFamily: grotesk, fontWeight: 600, fontSize: 29, lineHeight: 1.25,
        color: D.bone, textShadow: '0 2px 14px rgba(0,0,0,.9)',
      }}>{sub}</div>
      <Chip at={30} />
    </TextGate>
  );
}

/* =================================================================== E ==== */
/* HYEONPAN — the vertical plaque, in 단청 pigments, and one 낙관 seal.          */

const E = {
  lacquer: '#171009',
  jangdan: '#B23A26',
  noerok: '#2E5D4F',
  hobun: '#EFE7D3',
  gold: '#C9A44C',
  hanji: '#EFE6D2',
  ink: '#1B1610',
};

type EOns = {
  from: number; to: number;
  field: string; value: string; note?: string;
  size?: number; stamp?: string; struck?: string;
};

/**
 * The plaque. It swings down on its hangers and settles, then the three characters
 * are brushed in top to bottom — which is both the order they are written in and
 * the direction the whole graphic is arguing for.
 */
function Plaque({ at = 0 }: { at?: number }) {
  const frame = useCurrentFrame();
  const drop = clamp(frame, [at, at + 16], [0, 1]);
  const settle = clamp(frame, [at + 12, at + 26], [1, 0]);
  return (
    <div style={{
      position: 'absolute', left: 0, top: 0, width: 132,
      transformOrigin: 'top center',
      transform: `translateY(${(1 - drop) * -70}px) rotate(${settle * 1.6}deg)`,
      opacity: drop,
    }}>
      <div style={{
        background: `linear-gradient(180deg, #1E140B 0%, ${E.lacquer} 55%, #0F0A05 100%)`,
        border: `4px solid ${E.jangdan}`,
        outline: `2px solid ${E.noerok}`,
        boxShadow: '0 18px 46px rgba(0,0,0,.72)',
        padding: '20px 0 24px',
      }}>
        <div style={{ height: 3, background: E.gold, margin: '0 12px 16px', opacity: .85 }} />
        {['崇', '禮', '門'].map((c, i) => {
          const p = clamp(frame, [at + 16 + i * 7, at + 28 + i * 7], [0, 1]);
          return (
            <div key={c} style={{
              fontFamily: hanja, fontWeight: 700, fontSize: 62, lineHeight: 1.28,
              color: E.hobun, textAlign: 'center', opacity: p,
              transform: `translateY(${(1 - p) * 12}px)`,
              textShadow: '0 2px 12px rgba(0,0,0,.8)',
            }}>{c}</div>
          );
        })}
        <div style={{ height: 3, background: E.gold, margin: '16px 12px 0', opacity: .85 }} />
      </div>
    </div>
  );
}

/** The three-stripe 단청 band that separates plaque from record. */
function DancheongBand({ at = 10 }: { at?: number }) {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: 'flex', gap: 0, height: 8, marginBottom: 18 }}>
      {[E.noerok, E.jangdan, E.gold].map((c, i) => {
        const p = clamp(frame, [at + i * 5, at + 14 + i * 5], [0, 1]);
        return <div key={c} style={{ flex: 1, background: c, transformOrigin: 'left', transform: `scaleX(${p})` }} />;
      })}
    </div>
  );
}

function OnsHyeonpan({ field, value, note, size = 92, stamp, struck }: Omit<EOns, 'from' | 'to'>) {
  const frame = useCurrentFrame();
  const panel = clamp(frame, [8, 22], [0, 1]);
  const type = clamp(frame, [20, 40], [0, 1]);
  const strike = clamp(frame, [44, 58], [0, 1]);
  const seal = clamp(frame, [58, 70], [0, 1]);
  const head = struck ?? value;
  const chars = Math.round(head.length * type);
  return (
    <TextGate style={{ position: 'absolute', left: 56, right: 96, top: 216, zIndex: 60 }}>
      <Plaque at={0} />
      <div style={{
        marginLeft: 178,
        background: 'rgba(17,11,5,.90)',
        border: `1px solid ${E.gold}55`,
        padding: '22px 26px 26px',
        transformOrigin: 'left center',
        transform: `scaleX(${0.94 + panel * 0.06})`, opacity: panel,
        boxShadow: '0 16px 44px rgba(0,0,0,.6)',
      }}>
        <DancheongBand at={12} />
        <div style={{
          fontFamily: mono, fontWeight: 700, fontSize: 20, letterSpacing: 4.4,
          textTransform: 'uppercase', color: E.gold,
        }}>{field}</div>
        <div style={{ position: 'relative', display: 'inline-block', marginTop: 12 }}>
          <div style={{
            fontFamily: serif, fontWeight: 700, fontSize: size, lineHeight: 1.02,
            letterSpacing: -.5, color: E.hobun, textTransform: 'uppercase',
          }}>{head.slice(0, chars)}</div>
          {struck && (
            <div style={{
              position: 'absolute', left: -4, top: '52%', height: 6,
              width: `${strike * 104}%`, background: E.jangdan,
              boxShadow: `0 0 14px ${E.jangdan}`,
            }} />
          )}
        </div>
        {struck && (
          <div style={{
            marginTop: 18, display: 'inline-block', background: E.jangdan,
            padding: '12px 20px 14px', transform: `rotate(-5deg) scale(${0.84 + seal * 0.16})`,
            opacity: seal, boxShadow: '0 8px 22px rgba(0,0,0,.55)',
          }}>
            {(stamp ?? '').split(' ').map((word) => (
              <div key={word} style={{
                fontFamily: hanja, fontWeight: 700, fontSize: 42, lineHeight: 1.16,
                letterSpacing: 6, color: E.hobun, textAlign: 'center',
              }}>{word}</div>
            ))}
          </div>
        )}
        {note && (
          <div style={{
            marginTop: 16, fontFamily: serif, fontSize: 27, lineHeight: 1.34,
            color: '#D8CDB4', whiteSpace: 'pre-line',
          }}>{note}</div>
        )}
      </div>
    </TextGate>
  );
}

/** 한지 captions: warm paper, ink type, a 장단 edge. Same material world as the plaque. */
function CaptionsHanji({ beats }: { beats: CaptionBeat[] }) {
  const frame = useCurrentFrame();
  const active = beats.find((b) => frame >= b.startFrame && frame <= b.endFrame);
  if (!active) return null;
  const entry = clamp(frame, [active.startFrame, active.startFrame + 6], [0, 1]);
  const run = clamp(frame, [active.startFrame, active.endFrame], [0, 1]);
  return (
    <div data-caption-safe-zone="instagram-reels" style={{
      position: 'absolute', zIndex: 150, left: 72, right: 128, bottom: 410, minHeight: 92,
      background: E.hanji, color: E.ink, borderLeft: `12px solid ${E.jangdan}`,
      display: 'grid', placeItems: 'center', padding: '16px 26px 18px',
      font: `800 34px/1.14 ${grotesk}`, letterSpacing: -.2, textAlign: 'center', textWrap: 'balance',
      opacity: entry, transform: `translateY(${(1 - entry) * 14}px)`,
      boxShadow: '0 14px 44px rgba(0,0,0,.5)',
    }}>
      {active.text}
      <div style={{
        position: 'absolute', left: 0, bottom: 0, height: 4,
        width: `${run * 100}%`, background: E.jangdan, opacity: .5,
      }} />
    </div>
  );
}

function OutroHyeonpan({ hook, sub }: { hook: string; sub: string }) {
  const frame = useCurrentFrame();
  const panel = clamp(frame, [4, 18], [0, 1]);
  return (
    <TextGate style={{ position: 'absolute', left: 56, right: 96, top: 640, zIndex: 62 }}>
      <Plaque at={0} />
      <div style={{
        marginLeft: 178, background: 'rgba(17,11,5,.90)', border: `1px solid ${E.gold}55`,
        padding: '22px 26px 26px', opacity: panel,
        transformOrigin: 'left center', transform: `scaleX(${0.94 + panel * 0.06})`,
        boxShadow: '0 16px 44px rgba(0,0,0,.6)',
      }}>
        <DancheongBand at={8} />
        <div style={{
          fontFamily: mono, fontWeight: 700, fontSize: 20, letterSpacing: 4.4,
          textTransform: 'uppercase', color: E.gold,
        }}>Sungnyemun · Seoul</div>
        <div style={{
          marginTop: 12, fontFamily: serif, fontWeight: 700, fontSize: 78, lineHeight: 1.04,
          color: E.hobun, textTransform: 'uppercase',
        }}>{hook}</div>
        <div style={{ marginTop: 14, fontFamily: serif, fontSize: 27, lineHeight: 1.34, color: '#D8CDB4' }}>{sub}</div>
      </div>
      <div style={{ marginLeft: 178 }}><Chip at={30} /></div>
    </TextGate>
  );
}

/* =================================================================== F ==== */
/* HOLD — a split-flap board, a countdown, and an opening card built to be a    */
/* thumbnail.                                                                   */

const F = {
  night: '#080C13',
  amber: '#FFC043',
  paper: '#F2F5F8',
  alert: '#FF4D3D',
  steel: '#66717F',
};

type BoardRow = { label: string; status: string; alert?: boolean };
type FOns = {
  from: number; to: number;
  head?: string; rows?: BoardRow[];
  hero?: { eyebrow: string; line1: string; line2: string; sub: string };
};

/**
 * The opening card. Centred, not top-left, because frame 0 is the Instagram grid
 * thumbnail and the previous version had no thumbnail statement at all — it opened
 * on a single board row reading "Aircraft HELD", which says nothing at grid size.
 * Vertical placement is inside the conservative centre-square safe area.
 */
function HeroCard({ eyebrow, line1, line2, sub }: NonNullable<FOns['hero']>) {
  const frame = useCurrentFrame();
  // Everything is already legible at frame 0 and only settles. A masked slide-up
  // like the other headlines in this kit would leave frame 0 blank — and frame 0 is
  // the Instagram cover, so the thumbnail would be an empty photograph. Movement in
  // the first second comes from the pan under the card, not from the card.
  const a = clamp(frame, [0, 20], [0, 1]);
  const b = clamp(frame, [4, 26], [0, 1]);
  const rule = clamp(frame, [18, 34], [0, 1]);
  const s = clamp(frame, [24, 40], [0, 1]);
  return (
    <TextGate style={{
      position: 'absolute', left: 64, right: 64, top: 640, zIndex: 64, textAlign: 'center',
    }}>
      <div style={{
        fontFamily: mono, fontWeight: 700, fontSize: 22, letterSpacing: 6.5,
        textTransform: 'uppercase', color: F.amber,
        textShadow: '0 2px 12px rgba(0,0,0,.95)',
      }}>{eyebrow}</div>
      <div style={{
        marginTop: 18, fontFamily: black, fontSize: 152, lineHeight: .96, letterSpacing: -4,
        textTransform: 'uppercase', color: F.paper,
        transform: `translateY(${(1 - a) * 16}px)`,
        textShadow: '0 6px 30px rgba(0,0,0,.92)',
      }}>{line1}</div>
      <div style={{
        // 82, not 88: "DECIDES THE REST" at 88 measures ~928px against the 952px the
        // 64px side margins leave, i.e. one wider glyph away from an unplanned wrap.
        marginTop: 6, fontFamily: black, fontSize: 82, lineHeight: 1.02, letterSpacing: -2.4,
        textTransform: 'uppercase', color: F.amber,
        transform: `translateY(${(1 - b) * 16}px)`,
        textShadow: '0 6px 30px rgba(0,0,0,.92)',
      }}>{line2}</div>
      <div style={{
        height: 4, background: F.alert, margin: '34px auto 0', width: `${(0.2 + rule * 0.8) * 46}%`,
      }} />
      <div style={{
        // 0.6 floor, not 0.35: at frame 0 this line is part of the thumbnail, and at
        // 0.35 over a busy photograph it read as grey noise rather than as a sentence.
        marginTop: 20, fontFamily: grotesk, fontWeight: 700, fontSize: 27, letterSpacing: 2.4,
        textTransform: 'uppercase', color: F.paper, opacity: 0.6 + s * 0.4,
        textShadow: '0 2px 14px rgba(0,0,0,.95)',
      }}>{sub}</div>
    </TextGate>
  );
}

function OnsBoard({ head, rows = [] }: { head?: string; rows?: BoardRow[] }) {
  const frame = useCurrentFrame();
  const headIn = clamp(frame, [4, 14], [0, 1]);
  return (
    <TextGate style={{ position: 'absolute', left: 56, right: 96, top: 248, zIndex: 60 }}>
      {head && (
        <div style={{
          display: 'inline-block', background: F.amber, color: F.night,
          padding: '8px 16px 9px', marginBottom: 18, opacity: headIn,
          fontFamily: mono, fontWeight: 700, fontSize: 22, letterSpacing: 4.4,
          textTransform: 'uppercase',
        }}>{head}</div>
      )}
      {rows.map((r, i) => {
        const at = 14 + i * 11;
        const flip = clamp(frame, [at, at + 10], [0, 1]);
        return (
          <div key={r.label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18,
            background: 'rgba(4,7,13,.90)', borderLeft: `6px solid ${r.alert ? F.alert : F.amber}`,
            padding: '13px 16px 13px 18px', marginBottom: 10,
            transformOrigin: 'top', transform: `perspective(700px) rotateX(${(1 - flip) * -82}deg)`,
            opacity: flip, boxShadow: '0 8px 24px rgba(0,0,0,.45)',
          }}>
            <span style={{
              fontFamily: grotesk, fontWeight: 800, fontSize: 38, letterSpacing: .4,
              textTransform: 'uppercase', color: F.paper,
            }}>{r.label}</span>
            <span style={{
              background: r.alert ? F.alert : F.amber, color: F.night,
              padding: '7px 14px 8px', fontFamily: mono, fontWeight: 700, fontSize: 36,
              letterSpacing: -.5, whiteSpace: 'nowrap',
            }}>{r.status}</span>
          </div>
        );
      })}
    </TextGate>
  );
}

function OnsHold(props: Omit<FOns, 'from' | 'to'>) {
  if (props.hero) return <HeroCard {...props.hero} />;
  return <OnsBoard head={props.head} rows={props.rows} />;
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
      position: 'absolute', right: 74, top: 128, zIndex: 120, textAlign: 'right',
      opacity: Math.min(fadeIn, fadeOut),
    }}>
      <div style={{ color: 'rgba(255,255,255,.62)', font: `700 16px/1 ${mono}`, letterSpacing: 4 }}>
        AIRSPACE HOLD
      </div>
      <div style={{
        marginTop: 6, color: F.amber, font: `700 56px/1 ${mono}`, letterSpacing: -1,
        textShadow: '0 2px 14px rgba(0,0,0,.95)',
      }}>{mm}:{ss}</div>
    </div>
  );
}

function CaptionsBoard({ beats }: { beats: CaptionBeat[] }) {
  const frame = useCurrentFrame();
  const active = beats.find((b) => frame >= b.startFrame && frame <= b.endFrame);
  if (!active) return null;
  const entry = clamp(frame, [active.startFrame, active.startFrame + 5], [0, 1]);
  const run = clamp(frame, [active.startFrame, active.endFrame], [0, 1]);
  return (
    <div data-caption-safe-zone="instagram-reels" style={{
      position: 'absolute', zIndex: 150, left: 72, right: 128, bottom: 410, minHeight: 90,
      background: 'rgba(4,7,13,.90)', borderBottom: `4px solid ${F.amber}`,
      display: 'grid', placeItems: 'center', padding: '15px 24px 17px',
      color: F.paper, font: `700 33px/1.16 ${grotesk}`, letterSpacing: -.1,
      textAlign: 'center', textWrap: 'balance',
      opacity: entry, transform: `translateY(${(1 - entry) * 12}px)`,
      boxShadow: '0 12px 40px rgba(0,0,0,.55)',
    }}>
      {active.text}
      <div style={{
        position: 'absolute', left: 0, bottom: -4, height: 4,
        width: `${run * 100}%`, background: F.alert,
      }} />
    </div>
  );
}

function OutroHold({ hook, sub }: { hook: string; sub: string }) {
  const frame = useCurrentFrame();
  const rule = clamp(frame, [4, 16], [0, 1]);
  const head = clamp(frame, [12, 28], [0, 1]);
  return (
    <TextGate style={{ position: 'absolute', left: 56, right: 96, top: 690, zIndex: 62 }}>
      <div style={{ height: 6, width: `${rule * 100}%`, background: F.amber }} />
      <div style={{ marginTop: 22, overflow: 'hidden' }}>
        <div style={{
          // pre-line so the break is authored, not left to the browser: at 84px
          // "WE WROTE IT ALL DOWN" overflows 928px and wrapped as "WE WROTE IT ALL /
          // DOWN", splitting the verb from its particle.
          fontFamily: black, fontSize: 84, lineHeight: 1.02, letterSpacing: -2.2,
          textTransform: 'uppercase', color: F.paper, whiteSpace: 'pre-line',
          transform: `translateY(${(1 - head) * 100}%)`,
          textShadow: '0 5px 26px rgba(0,0,0,.9)',
        }}>{hook}</div>
      </div>
      <div style={{
        marginTop: 18, fontFamily: mono, fontWeight: 700, fontSize: 28, lineHeight: 1.25,
        color: F.amber, textShadow: '0 2px 14px rgba(0,0,0,.95)',
      }}>{sub}</div>
      <Chip at={30} />
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
    <AbsoluteFill style={{ background: D.ink }}>
      <Media manifest={manifest} />
      <Scrim to={0.52} />
      {ons.map((o) => (
        <Cut key={`ons-${o.from}`} from={o.from} len={o.to - o.from}>
          <OnsSection {...o} />
        </Cut>
      ))}
      <Cut from={outro.from} len={manifest.durationInFrames - outro.from - OVERLAP}>
        <OutroSection hook={outro.hook} sub={outro.sub} />
      </Cut>
      <VoiceTrack slug={manifest.slug} segments={audio} />
      <CaptionsSection beats={manifest.beats} />
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
    <AbsoluteFill style={{ background: E.lacquer }}>
      <Media manifest={manifest} />
      <Scrim to={0.5} />
      {ons.map((o) => (
        <Cut key={`ons-${o.from}`} from={o.from} len={o.to - o.from}>
          <OnsHyeonpan {...o} />
        </Cut>
      ))}
      <Cut from={outro.from} len={manifest.durationInFrames - outro.from - OVERLAP}>
        <OutroHyeonpan hook={outro.hook} sub={outro.sub} />
      </Cut>
      <VoiceTrack slug={manifest.slug} segments={audio} />
      <CaptionsHanji beats={manifest.beats} />
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
    <AbsoluteFill style={{ background: F.night }}>
      <Media manifest={manifest} />
      <Scrim to={0.55} />
      {ons.map((o) => (
        <Cut key={`ons-${o.from}`} from={o.from} len={o.to - o.from}>
          <OnsHold {...o} />
        </Cut>
      ))}
      <HoldClock from={clock.from} to={clock.to} />
      <Cut from={outro.from} len={manifest.durationInFrames - outro.from - OVERLAP}>
        <OutroHold hook={outro.hook} sub={outro.sub} />
      </Cut>
      <VoiceTrack slug={manifest.slug} segments={audio} />
      <CaptionsBoard beats={manifest.beats} />
      <Watermark />
    </AbsoluteFill>
  );
}
