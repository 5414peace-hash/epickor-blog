/**
 * RECEIPT — the C kit. A reel that prints itself.
 *
 * WHY THIS EXISTS (2026-08-17)
 *
 * COUNTER works, but it has a hard entry requirement: three to five comparable products, a
 * two-state number, AND portrait product photography at 800px+ on the short edge. That last
 * clause is what actually blocks work. A full session went into sourcing four pack shots,
 * and the food lane stayed blocked until the representative supplied them by hand.
 *
 * So this kit is deliberately built to need NO photography at all. The entire frame is type
 * on paper. Any published post with itemised won figures becomes a reel the same day.
 *
 * WHAT IT DOES THAT A CAROUSEL CANNOT
 *   A carousel can show a finished receipt. It cannot show one being totted up. Lines print
 *   in sequence, the running subtotal climbs at the foot of the paper as each one lands, and
 *   the total resolves last. The suspense of a rising number is the whole format, and it is
 *   the same argument COUNTER makes with a price strike — a number moving in time.
 *
 * WHY NEAR-MONOCHROME
 *   The three COUNTER reels are all a coloured ground with a coloured accent: clinical blue,
 *   warm cream, fluorescent grey. A receipt is thermal paper and one ink. Committing to that
 *   makes this instantly separable in the profile grid, and it is honest to the object — a
 *   real receipt has no palette. One red is allowed, for the total and the reversal, which is
 *   exactly where a Korean receipt actually carries colour.
 *
 * TYPE
 *   No mono face is bundled (tokens/core FONTS.mono is a system stack, and a system font is
 *   banned because a render host without it substitutes silently). Inter with
 *   `tabular-nums`, wide tracking and dot leaders reads as a ledger without one, and Oswald
 *   carries the total.
 *
 * MOTION — no zoom, same as COUNTER
 *   The paper feeds upward as lines print, which is the ambient motion and is a real
 *   translation rather than a Ken Burns. Each line lands with a two-frame ink strike: a
 *   sub-pixel horizontal offset, the way a thermal head misregisters. Dot leaders draw left
 *   to right. Nothing drifts after it lands.
 */
import { createContext, useContext } from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { FONTS, SAFE } from './tokens/core';
import { loadFonts } from './fonts';

export type ReceiptPalette = {
  /** Thermal paper. Warm grey, never pure white — white reads as a slide, not paper. */
  paper: string;
  /** Thermal ink is a warm near-black, not #000. */
  ink: string;
  /** Faint rules and the dot leaders. */
  faint: string;
  /** Secondary text: the Hangul line, the unit column. */
  mute: string;
  /** The one colour. Total, stamp, reversal. */
  red: string;
};

export const PAPER_DEFAULT: ReceiptPalette = {
  paper: '#EDEBE6',
  ink: '#2B2825',
  faint: '#BDB8AE',
  mute: '#7C776E',
  red: '#C4362A',
};

export type LineItem = {
  /** English name, as the reader would say it. */
  label: string;
  /** Hangul, printed small under the label. Optional for non-product lines. */
  hangul?: string;
  /** Printed exactly as written — ranges are honest, invented single prices are not. */
  price: string;
};

export type ReceiptSpec = {
  /** Header block: the shop line and the subject line. */
  storeLine: string;
  subjectLine: string;
  /** Right-hand meta on the header, e.g. the date the prices were read. */
  metaLine: string;
  items: LineItem[];
  /** The total row's label, e.g. 'A REAL BREAKFAST'. */
  totalLabel: string;
  /** Sub-label under it — what the total actually covers. */
  totalNote: string;
  /** Fixed prefix printed before the counting figure, e.g. '₩3,000–'. Optional. */
  totalPrefix?: string;
  /** The figure that counts up. */
  totalValue: number;
  /** The reversal, printed after the total. Two lines. */
  twist: [string, string];
  twistHangul: string;
  /** Outro. */
  outroHook: string;
  outroSub: string;
};

const Pal = createContext<ReceiptPalette>(PAPER_DEFAULT);
const usePal = () => useContext(Pal);

const F = { body: FONTS.neutral, num: FONTS.condensed, hook: FONTS.grotesk } as const;

/* ------------------------------------------------------------------ *
 * Timing. A receipt prints fast — faster than COUNTER's 20-frame beat.
 * ------------------------------------------------------------------ */
const HEAD = 12;
const LINE = 24;          // one item every 0.8s
const TOTAL = 78;
const TWIST = 96;
const OUTRO = 84;

export const receiptDuration = (n: number) => HEAD + n * LINE + TOTAL + TWIST + OUTRO;

const snap = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3.2);
const at = (f: number, start: number, dur = 8) => snap((f - start) / dur);

/** Paper grain plus the faint vertical banding a thermal print actually has. */
function Paper() {
  const C = usePal();
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <AbsoluteFill
        style={{
          opacity: 0.055,
          mixBlendMode: 'multiply',
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='3'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.05,
          background:
            'repeating-linear-gradient(90deg, rgba(0,0,0,0.5) 0 1px, transparent 1px 7px)',
        }}
      />
    </AbsoluteFill>
  );
}

/** The torn top edge, so the frame reads as paper rather than as a page. */
function TornEdge({ y, flip = false }: { y: number; flip?: boolean }) {
  const C = usePal();
  const teeth = 26;
  const pts: string[] = [];
  for (let i = 0; i <= teeth; i++) {
    // Deterministic jitter — a torn edge is irregular, but it must not change per frame.
    const j = ((i * 9301 + 49297) % 233280) / 233280;
    pts.push(`${(i / teeth) * 1080},${8 + j * 16}`);
  }
  return (
    <svg
      width={1080}
      height={30}
      viewBox="0 0 1080 30"
      style={{ position: 'absolute', left: 0, top: y, transform: flip ? 'scaleY(-1)' : undefined }}
    >
      <polygon points={`0,0 1080,0 ${pts.join(' ')} 0,30`} fill={C.paper} />
    </svg>
  );
}

/** A printed row: label, Hangul, dot leader, right-aligned figure. */
function Row({
  item,
  from,
  y,
}: {
  item: LineItem;
  from: number;
  y: number;
}) {
  const C = usePal();
  const f = useCurrentFrame();
  const t = at(f, from, 5);
  if (t <= 0) return null;
  // Two-frame ink strike: a thermal head lands slightly off and settles.
  const strike = f - from < 2 ? (f - from === 0 ? 3 : 1) : 0;
  const leader = at(f, from + 3, 7);
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.side + 20,
        right: SAFE.side + 20,
        top: y,
        opacity: t,
        transform: `translateX(${strike}px)`,
        display: 'flex',
        alignItems: 'baseline',
        gap: 14,
      }}
    >
      <div style={{ flex: '0 0 auto', maxWidth: 640 }}>
        <div
          style={{
            font: `700 56px/1.12 ${F.body}`,
            letterSpacing: '0.01em',
            color: C.ink,
            textTransform: 'uppercase',
          }}
        >
          {item.label}
        </div>
        {item.hangul ? (
          <div style={{ font: `500 31px/1.3 ${F.body}`, color: C.mute, marginTop: 4 }}>
            {item.hangul}
          </div>
        ) : null}
      </div>
      <div
        style={{
          flex: '1 1 auto',
          height: 3,
          alignSelf: 'center',
          marginTop: item.hangul ? -18 : 0,
          background: `repeating-linear-gradient(90deg, ${C.faint} 0 3px, transparent 3px 12px)`,
          transformOrigin: 'left center',
          transform: `scaleX(${leader})`,
        }}
      />
      <div
        style={{
          flex: '0 0 auto',
          font: `700 60px/1 ${F.num}`,
          fontVariantNumeric: 'tabular-nums',
          color: C.ink,
          marginTop: item.hangul ? -18 : 0,
          opacity: at(f, from + 8, 5),
        }}
      >
        {item.price}
      </div>
    </div>
  );
}

function Rule({ from, y, weight = 3 }: { from: number; y: number; weight?: number }) {
  const C = usePal();
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.side + 20,
        right: SAFE.side + 20,
        top: y,
        height: weight,
        background: C.ink,
        transformOrigin: 'left center',
        transform: `scaleX(${at(f, from, 6)})`,
      }}
    />
  );
}

function Header({ spec }: { spec: ReceiptSpec }) {
  const C = usePal();
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: SAFE.side + 20, right: SAFE.side + 20, top: 340 }}>
      <div
        style={{
          font: `900 30px/1 ${F.body}`,
          letterSpacing: '0.34em',
          color: C.ink,
          }}
      >
        EPICKOR
      </div>
      <div
        style={{
          font: `700 25px/1.4 ${F.body}`,
          letterSpacing: '0.13em',
          color: C.mute,
          textTransform: 'uppercase',
          marginTop: 12,
        }}
      >
        {spec.storeLine}
      </div>
      <div
        style={{
          font: `800 72px/1.1 ${F.hook}`,
          letterSpacing: '-0.012em',
          wordSpacing: '0.04em',
          color: C.ink,
          textTransform: 'uppercase',
          marginTop: 16,
          // The subject carries its own break so the phrase splits where it was planned to.
          whiteSpace: 'pre-line',
        }}
      >
        {spec.subjectLine}
      </div>
      <div
        style={{
          font: `600 24px/1.3 ${F.body}`,
          letterSpacing: '0.06em',
          color: C.mute,
          marginTop: 14,
        }}
      >
        {spec.metaLine}
      </div>
    </div>
  );
}

/** The total. The figure counts; the prefix does not, because a range's floor is fixed. */
function Total({ spec, from }: { spec: ReceiptSpec; from: number }) {
  const C = usePal();
  const f = useCurrentFrame();
  const t = at(f, from + 14, 13);
  const n = Math.round(spec.totalValue * t);
  return (
    <>
      <Rule from={from} y={0} weight={4} />
      <div style={{ position: 'absolute', left: SAFE.side + 20, right: SAFE.side + 20, top: 26 }}>
        <div
          style={{
            font: `800 30px/1.2 ${F.body}`,
            letterSpacing: '0.15em',
            color: C.red,
            textTransform: 'uppercase',
            opacity: at(f, from + 6, 6),
          }}
        >
          {spec.totalLabel}
        </div>
        <div
          style={{
            font: `700 156px/1 ${F.num}`,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.012em',
            color: C.ink,
            marginTop: 10,
            opacity: at(f, from + 12, 5),
          }}
        >
          {spec.totalPrefix ?? '₩'}
          {n.toLocaleString('en-US')}
        </div>
        <div
          style={{
            font: `600 30px/1.35 ${F.body}`,
            color: C.mute,
            marginTop: 10,
            opacity: at(f, from + 34, 8),
          }}
        >
          {spec.totalNote}
        </div>
      </div>
    </>
  );
}

/** The reversal, stamped over the paper after the total settles. */
function Twist({ spec }: { spec: ReceiptSpec }) {
  const C = usePal();
  const f = useCurrentFrame();
  // The stamp lands hard: overshoot and settle, and a slight rotation so it reads as
  // pressed onto the paper rather than laid out on it.
  const s = at(f, 4, 9);
  const scale = 1.22 - 0.22 * s;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          right: SAFE.side,
          top: 640,
          transform: `rotate(-2.4deg) scale(${scale})`,
          opacity: s,
        }}
      >
        <div style={{ border: `7px solid ${C.red}`, padding: '30px 30px 34px' }}>
          <div
            style={{
              font: `900 84px/1.02 ${F.hook}`,
              letterSpacing: '-0.022em',
              wordSpacing: '0.05em',
              color: C.red,
              textTransform: 'uppercase',
            }}
          >
            {spec.twist[0]}
            <br />
            {spec.twist[1]}
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          right: SAFE.side,
          top: 1030,
          font: `600 38px/1.4 ${F.body}`,
          color: C.ink,
          opacity: at(f, 26, 9),
        }}
      >
        {spec.twistHangul}
      </div>
    </AbsoluteFill>
  );
}

function Outro({ spec }: { spec: ReceiptSpec }) {
  const C = usePal();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: SAFE.side, right: SAFE.side, top: 640 }}>
        <div
          style={{
            font: `900 104px/0.96 ${F.hook}`,
            letterSpacing: '-0.026em',
            wordSpacing: '0.055em',
            color: C.ink,
            textTransform: 'uppercase',
            whiteSpace: 'pre-line',
          }}
        >
          {spec.outroHook}
        </div>
        <div
          style={{
            font: `600 36px/1.35 ${F.body}`,
            color: C.mute,
            marginTop: 28,
            opacity: at(f, 14, 9),
          }}
        >
          {spec.outroSub}
        </div>
        <div
          style={{
            display: 'inline-block',
            marginTop: 44,
            background: C.red,
            padding: '22px 40px 26px',
            opacity: at(f, 28, 8),
          }}
        >
          <span style={{ font: `900 62px/1 ${F.hook}`, letterSpacing: '-0.012em', color: C.paper }}>
            epickor.com
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function Watermark() {
  const C = usePal();
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.side,
        top: 60,
        font: `800 21px/1 ${F.body}`,
        letterSpacing: '0.16em',
        color: C.ink,
        opacity: 0.42,
      }}
    >
      EPICKOR.COM
    </div>
  );
}

export function ReelReceipt({
  spec,
  palette = PAPER_DEFAULT,
}: {
  spec: ReceiptSpec;
  palette?: ReceiptPalette;
}) {
  // Inside the component. At module scope the delayRender handle is created before a render
  // tab exists — the failure that killed CounterKit's first render at frame 184.
  loadFonts();
  const f = useCurrentFrame();

  const itemsFrom = HEAD;
  const totalFrom = HEAD + spec.items.length * LINE;
  const twistFrom = totalFrom + TOTAL;
  const outroFrom = twistFrom + TWIST;

  // Ambient motion: the paper feeds upward as lines print. A real translation, not a zoom.
  // It stops once the last line has landed, because a receipt stops feeding when it is done.
  const fed = Math.min(f, totalFrom);
  // 2.5px/frame: by the time the total prints the sheet has travelled ~300px, which
  // carries the total into view and scrolls the header off the top, the way a receipt
  // actually feeds. 0.42 was too slow to read as movement at all.
  const feed = -Math.max(0, (fed - itemsFrom) * 2.5);

  return (
    <Pal.Provider value={palette}>
      <AbsoluteFill style={{ background: palette.paper, overflow: 'hidden' }}>
        <Paper />
        {f < twistFrom ? (
          <AbsoluteFill style={{ transform: `translateY(${feed}px)` }}>
            <TornEdge y={236} />
            <Header spec={spec} />
            <Rule from={8} y={604} />
            {spec.items.map((it, i) => (
              <Row key={it.label} item={it} from={itemsFrom + i * LINE} y={654 + i * 168} />
            ))}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 654 + spec.items.length * 168 + 24 }}>
              <Total spec={spec} from={totalFrom} />
            </div>
          </AbsoluteFill>
        ) : null}

        <Sequence from={twistFrom} durationInFrames={TWIST}>
          <Twist spec={spec} />
        </Sequence>
        <Sequence from={outroFrom} durationInFrames={OUTRO}>
          <Outro spec={spec} />
        </Sequence>

        <Watermark />
      </AbsoluteFill>
    </Pal.Provider>
  );
}
