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

/** The entity's other homes. AI engines lean on these to resolve "EpicKor" to one thing. */
const SAME_AS = [
  'https://www.instagram.com/epickorsnippets/',
  'https://www.youtube.com/@epickor',
];

/**
 * WebSite + Organization, for the homepage only. Emitting it site-wide would
 * be noise; on the root URL it is the page's identity.
 */
export function SiteLd() {
  return (
    <Ld
      data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${SITE}/#org`,
            name: 'EpicKor',
            url: SITE,
            sameAs: SAME_AS,
          },
          {
            '@type': 'WebSite',
            '@id': `${SITE}/#website`,
            name: 'EpicKor',
            url: SITE,
            inLanguage: 'en',
            description:
              'English-language Korea media and guide hub for travel, food, shopping, K-beauty, culture explainers, and Korean business stories.',
            publisher: { '@id': `${SITE}/#org` },
          },
        ],
      }}
    />
  );
}

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

/**
 * `basePath` exists because the site has two article routes, not one. It
 * defaulted to `/blog` implicitly until 2026-08-24, which meant `/business/`
 * could not use this component at all without publishing the wrong canonical
 * URL — so it published no Article schema whatsoever. Callers on other routes
 * must pass their own base.
 */
export function ArticleLd({
  headline,
  description,
  slug,
  image,
  datePublished,
  dateModified,
  basePath = '/blog',
}: {
  headline: string;
  description: string;
  slug: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  basePath?: string;
}) {
  const url = `${SITE}${basePath}/${slug}`;
  return (
    <Ld
      data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline,
        description,
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        ...(image ? { image: [image.startsWith('http') ? image : `${SITE}${image}`] } : {}),
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
        author: { '@type': 'Organization', name: 'EpicKor', url: SITE },
        publisher: {
          '@type': 'Organization',
          name: 'EpicKor',
          url: SITE,
          sameAs: SAME_AS,
        },
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
  const seen = new Set<string>();
  const push = (rawQ: string, rawA: string) => {
    const q = rawQ.replace(/<[^>]+>/g, '').trim();
    const a = rawA.replace(/<[^>]+>/g, '').trim();
    if (q && a && !seen.has(q)) {
      seen.add(q);
      out.push({ q, a });
    }
  };

  // Newer posts: **Q: ...** and **A:** ... as two separate paragraphs.
  const twoPara = /<p>\s*<strong>\s*Q:\s*([\s\S]*?)<\/strong>\s*<\/p>\s*<p>\s*<strong>\s*A:\s*<\/strong>\s*([\s\S]*?)<\/p>/g;
  let m: RegExpExecArray | null;
  while ((m = twoPara.exec(html)) !== null) push(m[1], m[2]);

  // The archive holds two older shapes that were silently emitting zero
  // FAQPage schema until 2026-08-20 — together the large majority of the
  // site's public posts (only ~67 of 345 used the marked shape above).
  //
  // Shape 2: bold question paragraph, then a PLAIN answer paragraph with no
  // **A:** marker —
  //   <p><strong>Q: ...?</strong></p><p>Answer text...</p>
  // The lookahead refuses a following paragraph that itself opens with a bold
  // Q:/A: marker, so back-to-back questions never swallow each other and the
  // marked shape above is never double-counted (the dedupe set backstops it).
  const qParaPlainAnswer = /<p>\s*<strong>\s*Q:\s*([\s\S]*?)<\/strong>\s*<\/p>\s*<p>(?!\s*<strong>\s*[QA]:)([\s\S]*?)<\/p>/g;
  while ((m = qParaPlainAnswer.exec(html)) !== null) push(m[1], m[2]);

  // Shape 3: question and answer share one paragraph —
  //   <p><strong>Q: ...?</strong> Answer text...</p>
  // For shape-1/2 posts this pattern still matches the question paragraph but
  // captures an empty answer, which push() filters, so nothing matches twice.
  const onePara = /<p>\s*<strong>\s*Q:\s*([\s\S]*?)<\/strong>\s*([\s\S]*?)<\/p>/g;
  while ((m = onePara.exec(html)) !== null) push(m[1], m[2]);

  return out;
}
