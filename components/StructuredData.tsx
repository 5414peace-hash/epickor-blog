/**
 * JSON-LD emitters.
 *
 * Audited 2026-08-02: the site was serving zero structured data on every page
 * type — no Article, no BreadcrumbList, no FAQPage — despite most posts already
 * carrying a properly formatted FAQ section. That is a free signal being left
 * on the floor, and it matters most for the new hubs, which are list pages and
 * need to tell search engines what they are listing.
 *
 * Everything below is derived from content that already exists on the page. No
 * claim is made in structured data that a reader cannot also see, which is both
 * the guideline and the only version worth shipping.
 */

function Ld({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from our own content, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const SITE = 'https://www.epickor.com';

export function BreadcrumbLd({ trail }: { trail: { name: string; href: string }[] }) {
  return (
    <Ld
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: trail.map((t, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: t.name,
          item: `${SITE}${t.href}`,
        })),
      }}
    />
  );
}

/**
 * CollectionPage plus the ItemList it actually contains. Used on the hubs,
 * where the list is the page's reason to exist.
 */
export function HubLd({
  name,
  description,
  href,
  items,
}: {
  name: string;
  description: string;
  href: string;
  items: { name: string; href: string }[];
}) {
  return (
    <Ld
      data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name,
        description,
        url: `${SITE}${href}`,
        isPartOf: { '@type': 'WebSite', name: 'EpicKor', url: SITE },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: items.length,
          itemListElement: items.map((it, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: it.name,
            url: `${SITE}${it.href}`,
          })),
        },
      }}
    />
  );
}

export function ArticleLd({
  headline,
  description,
  slug,
  image,
  datePublished,
  dateModified,
}: {
  headline: string;
  description: string;
  slug: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return (
    <Ld
      data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline,
        description,
        url: `${SITE}/blog/${slug}`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${slug}` },
        ...(image ? { image: [image.startsWith('http') ? image : `${SITE}${image}`] } : {}),
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
        author: { '@type': 'Organization', name: 'EpicKor', url: SITE },
        publisher: { '@type': 'Organization', name: 'EpicKor', url: SITE },
      }}
    />
  );
}

/**
 * FAQPage, built from the Q/A pairs already rendered in the article body. Only
 * emitted when the page genuinely has three or more — marking up a thin or
 * absent FAQ is the kind of thing that earns a manual action.
 */
export function FaqLd({ qa }: { qa: { q: string; a: string }[] }) {
  if (qa.length < 3) return null;
  return (
    <Ld
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: qa.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }}
    />
  );
}

/**
 * Pull Q/A pairs out of rendered article HTML.
 *
 * Our posts write FAQs as `**Q: ...**` followed by `**A:** ...`, which the
 * markdown pipeline turns into paragraphs with leading <strong>. Parsing the
 * rendered HTML rather than the markdown means the schema can never claim a
 * question the page does not actually display.
 */
export function extractFaq(html: string): { q: string; a: string }[] {
  const out: { q: string; a: string }[] = [];
  const pattern = /<p>\s*<strong>\s*Q:\s*([\s\S]*?)<\/strong>\s*<\/p>\s*<p>\s*<strong>\s*A:\s*<\/strong>\s*([\s\S]*?)<\/p>/g;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(html)) !== null) {
    const q = m[1].replace(/<[^>]+>/g, '').trim();
    const a = m[2].replace(/<[^>]+>/g, '').trim();
    if (q && a) out.push({ q, a });
  }
  return out;
}
