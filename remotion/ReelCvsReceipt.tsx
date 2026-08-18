/**
 * CVS RECEIPT — the first reel on the RECEIPT kit (design C).
 *
 * WHY THIS TOPIC FIRST
 *   `korean convenience store breakfast` is the site's highest-CTR query at 14.75%, and post
 *   171 already carries an itemised price table with Hangul. That is the entire input this
 *   kit needs — no photography at all, which is the point of building it.
 *
 * EVERY FIGURE IS PRINTED AS THE POST WRITES IT
 *   Ranges stay ranges. A receipt with a range on it is slightly odd, and inventing a single
 *   price to make it look like a real transaction would be worse — the numbers are what the
 *   post verified, so they print unaltered. Source: content/blog/171.md.
 *
 * THE REVERSAL
 *   A 2025 Hankyung headline: "편의점 갔다가 화들짝… 1000원으로 삼각김밥도 못 산다". The cheapest
 *   line on the receipt has moved out of reach of the smallest note. That lands after the
 *   total, which is the one order a carousel cannot enforce.
 *
 *   Note: post 171 glossed this as a "₩1,000 coin" until today. ₩1,000 is a banknote in
 *   Korea — the coins stop at ₩500 — so the post was corrected alongside this reel.
 */
import { ReelReceipt, receiptDuration, type ReceiptPalette, type ReceiptSpec } from './ReceiptKit';

/**
 * Thermal paper, warm grey. Deliberately near-monochrome: the three COUNTER reels are each a
 * coloured ground with a coloured accent, so a one-ink receipt separates instantly in the
 * profile grid — and a real receipt has no palette.
 */
export const PALETTE_RECEIPT: ReceiptPalette = {
  paper: '#EDEBE6',
  ink: '#2B2825',
  faint: '#BDB8AE',
  mute: '#7C776E',
  red: '#C4362A',
};

export const CVS_RECEIPT_SPEC: ReceiptSpec = {
  storeLine: 'Convenience store · Seoul',
  subjectLine: 'What a Korean\nbreakfast costs',
  metaLine: 'Prices read August 2026 · 편의점 아침',
  items: [
    { label: 'Triangle gimbap', hangul: '삼각김밥', price: '₩1,200–1,900' },
    { label: 'Two-pack, smaller', price: '₩2,000–2,300' },
    { label: 'Banana milk 240ml', hangul: '바나나맛우유', price: '₩1,800' },
    { label: 'Brewed coffee', price: 'from ₩1,000' },
    { label: 'Sandwich', hangul: '샌드위치', price: '₩2,500–4,500' },
  ],
  totalLabel: 'A real breakfast',
  totalPrefix: '₩3,000–',
  totalValue: 5000,
  totalNote: 'One gimbap and one drink. That is what it actually comes to.',
  twist: ['THE ₩1,000', 'GIMBAP IS GONE.'],
  twistHangul: '1000원으로 삼각김밥도 못 산다 — a 2025 Hankyung headline. ₩1,000 is Korea’s smallest note.',
  outroHook: 'LOCALS BUY\nDIFFERENT.',
  outroSub: 'What Koreans actually pick up at 7am, and the one item worth skipping.',
};

export const CVS_RECEIPT_DURATION = receiptDuration(CVS_RECEIPT_SPEC.items.length);

export function ReelCvsReceipt() {
  return <ReelReceipt spec={CVS_RECEIPT_SPEC} palette={PALETTE_RECEIPT} />;
}
