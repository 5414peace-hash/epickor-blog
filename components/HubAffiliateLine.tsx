/**
 * Slim early affiliate line for the hub pages.
 *
 * Articles got this treatment on 2026-08-01, which moved their first affiliate
 * link from 38% of the body to 14%. The hubs shipped without it, and measured
 * worse than articles ever were: the only affiliate link on each sat at 82–87%
 * of the page, which on the Seoul hub is 10,000px down a phone. These are also
 * the pages now carrying the most prominent placement on the site, so the gap
 * mattered more here than anywhere.
 *
 * Same rules as the article version. Visually a lower tier than the boxed CTA
 * at the foot of the page, never above the first table — a reader should get
 * the comparison they came for before being offered anything — and it carries
 * its own disclosure, because it appears above the one in the bottom block.
 */

export default function HubAffiliateLine({
  href,
  label,
  network,
}: {
  href: string;
  label: string;
  /** Agoda on accommodation-intent pages, Amazon on product pages. */
  network: 'amazon' | 'agoda';
}) {
  const accent = network === 'agoda' ? 'border-l-blue-700' : 'border-l-amber-600';
  const linkColour = network === 'agoda' ? 'text-blue-700' : 'text-amber-700';
  const disclosure =
    network === 'agoda'
      ? 'Affiliate link. EpicKor may earn a commission from qualifying bookings at no extra cost to you.'
      : 'Affiliate link. As an Amazon Associate, EpicKor earns from qualifying purchases at no extra cost to you.';

  return (
    <p className={`mt-8 border-l-[3px] ${accent} py-0.5 pl-3.5`}>
      <a
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className={`text-[0.95rem] font-bold ${linkColour} underline decoration-current/35 underline-offset-4 hover:decoration-current`}
        data-analytics-location={`hub_topline_${network}`}
      >
        {label} →
      </a>
      <span className="mt-1 block text-[0.78rem] leading-snug text-stone-500">{disclosure}</span>
    </p>
  );
}
