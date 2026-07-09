import Image from 'next/image';
import Link from 'next/link';
import type { BlogPostMetadata } from '@/lib/blog';
import { getAllBlogPosts } from '@/lib/blog';
import { getSectionSurface, getSlotSlug, getSlotSlugs, uniqueSlugs } from '@/lib/editorial-surface';
import type { SectionPageConfig } from '@/lib/section-pages';

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function trimText(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trim()}...`;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function postMatchesSection(post: BlogPostMetadata, config: SectionPageConfig): boolean {
  const haystack = normalize([post.title, post.description, ...post.tags].join(' '));
  return config.matchers.some((matcher) => haystack.includes(normalize(matcher)));
}

function findBySlug(posts: BlogPostMetadata[], slug: string): BlogPostMetadata | undefined {
  return posts.find((post) => post.slug === slug);
}

function pickBySlugs(posts: BlogPostMetadata[], slugs: string[]): BlogPostMetadata[] {
  return slugs
    .map((slug) => findBySlug(posts, slug))
    .filter((post): post is BlogPostMetadata => Boolean(post));
}

function uniquePosts(posts: BlogPostMetadata[]): BlogPostMetadata[] {
  const seen = new Set<string>();
  return posts.filter((post) => {
    if (seen.has(post.slug)) return false;
    seen.add(post.slug);
    return true;
  });
}

function getSectionPosts(allPosts: BlogPostMetadata[], config: SectionPageConfig, preferredSlugs: string[]): BlogPostMetadata[] {
  const matched = allPosts.filter((post) => postMatchesSection(post, config));
  return uniquePosts([...pickBySlugs(allPosts, preferredSlugs), ...matched]);
}

function PostImage({
  post,
  className,
  sizes,
  priority = false,
}: {
  post: Pick<BlogPostMetadata, 'title' | 'ogImage'>;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  const positionClass = /\b(absolute|fixed|relative|sticky)\b/.test(className) ? '' : 'relative';

  if (!post.ogImage) {
    return (
      <div className={`${positionClass} ${className} flex items-center justify-center bg-gray-950 text-3xl font-black text-white`}>
        EK
      </div>
    );
  }

  const fitClass = post.ogImage.toLowerCase().endsWith('.svg') ? 'object-contain p-5' : 'object-cover';

  return (
    <div className={`${positionClass} ${className} overflow-hidden bg-gray-100`}>
      <Image
        src={post.ogImage}
        alt={post.title}
        fill
        className={`${fitClass} transition-transform duration-500 group-hover:scale-105`}
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}

function ArticleMeta({ post }: { post: BlogPostMetadata }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-gray-500">
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      {post.tags[0] && (
        <>
          <span className="text-gray-300">|</span>
          <span>{post.tags[0]}</span>
        </>
      )}
    </div>
  );
}

function SmallStoryRow({
  post,
  index,
  config,
}: {
  post: BlogPostMetadata;
  index: number;
  config: SectionPageConfig;
}) {
  return (
    <Link href={`/blog/${post.slug}`} className="group grid grid-cols-[1.75rem_1fr_60px] gap-3 border-t border-gray-200 py-3 first:border-t-0 first:pt-0 last:pb-0">
      <span className={`pt-0.5 font-serif text-lg ${config.accentTextClass}`}>{String(index + 1).padStart(2, '0')}</span>
      <div>
        <h3 className="text-[13px] font-black leading-snug text-gray-950 line-clamp-2 group-hover:text-blue-700">
          {trimText(post.title, 62)}
        </h3>
        <p className="mt-1 text-[11px] font-semibold text-gray-500 line-clamp-1">{post.tags.slice(0, 2).join(' / ') || config.label}</p>
      </div>
      <PostImage post={post} className="h-12 rounded-md" sizes="60px" />
    </Link>
  );
}

function RecommendedCard({ post, config }: { post: BlogPostMetadata; config: SectionPageConfig }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="h-full overflow-hidden rounded-lg border border-gray-200 bg-white">
        <PostImage post={post} className="h-36 rounded-t-lg" sizes="(max-width: 768px) 100vw, 25vw" />
        <div className="p-4">
          <span className={`text-[11px] font-black uppercase ${config.accentTextClass}`}>{post.tags[0] || config.label}</span>
          <h3 className="mt-2 text-base font-black leading-snug text-gray-950 group-hover:text-blue-700">
            {trimText(post.title, 76)}
          </h3>
          <p className="mt-2 text-xs leading-5 text-gray-600 line-clamp-3">{post.description}</p>
          <ArticleMeta post={post} />
        </div>
      </article>
    </Link>
  );
}

function LatestCard({ post, config }: { post: BlogPostMetadata; config: SectionPageConfig }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="grid grid-cols-[88px_1fr] gap-3 border-t border-gray-200 py-3 first:border-t-0 first:pt-0">
        <PostImage post={post} className="h-20 rounded-lg" sizes="88px" />
        <div>
          <span className={`text-[11px] font-black uppercase ${config.accentTextClass}`}>{post.tags[0] || config.label}</span>
          <h3 className="mt-1.5 text-[13px] font-black leading-snug text-gray-950 line-clamp-2 group-hover:text-blue-700">
            {trimText(post.title, 72)}
          </h3>
          <p className="mt-1.5 text-[11px] leading-5 text-gray-600 line-clamp-2">{post.description}</p>
        </div>
      </article>
    </Link>
  );
}

export default function SectionLandingPage({ config }: { config: SectionPageConfig }) {
  const allPosts = getAllBlogPosts();
  const surface = getSectionSurface(config.key);
  const heroSlugs = uniqueSlugs([getSlotSlug(surface.hero), ...config.heroSlugs]);
  const startHereSlugs = getSlotSlugs(surface.startHere);
  const recommendedSlugs = getSlotSlugs(surface.recommended);
  const preferredSlugs = uniqueSlugs([...startHereSlugs, ...recommendedSlugs, ...config.recommendedSlugs]);
  const sectionPosts = getSectionPosts(allPosts, config, preferredSlugs);
  const heroPost = pickBySlugs(allPosts, heroSlugs)[0] || sectionPosts[0] || allPosts[0];

  const recommendedPosts = uniquePosts([
    ...pickBySlugs(allPosts, recommendedSlugs),
    ...sectionPosts,
  ]).filter((post) => post.slug !== heroPost?.slug).slice(0, 6);
  const startHerePosts = uniquePosts([
    ...pickBySlugs(allPosts, startHereSlugs),
    ...recommendedPosts,
  ]).filter((post) => post.slug !== heroPost?.slug).slice(0, 5);
  const latestPosts = sectionPosts
    .filter((post) => post.slug !== heroPost?.slug && !recommendedPosts.slice(0, 3).some((recommended) => recommended.slug === post.slug))
    .slice(0, 12);

  return (
    <div className="min-h-screen bg-white text-gray-950">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-5 md:py-6">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px] xl:items-center">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3">
                <div className={`h-1.5 w-16 rounded-md ${config.accentSolidClass}`} />
                <p className={`text-[11px] font-black uppercase tracking-[0.16em] ${config.accentTextClass}`}>
                  {config.eyebrow}
                </p>
              </div>
              <h1 className="mt-3 max-w-5xl font-serif text-3xl font-black leading-tight tracking-normal text-gray-950 md:text-4xl">
                {config.title}
              </h1>
              <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,0.9fr)_auto] lg:items-end">
                <p className="max-w-3xl text-sm leading-6 text-gray-700">{config.description}</p>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                {config.topicPills.map((pill) => (
                  <span key={pill} className={`rounded-md border ${config.accentBorderClass} ${config.accentBgClass} px-2.5 py-1 text-[11px] font-bold text-gray-700`}>
                    {pill}
                  </span>
                ))}
                </div>
              </div>
            </div>
            <div className={`rounded-lg border ${config.accentBorderClass} ${config.accentBgClass} p-3.5`}>
              <p className={`text-[11px] font-black uppercase tracking-[0.14em] ${config.accentTextClass}`}>Reader Path</p>
              <p className="mt-1.5 text-xs leading-5 text-gray-700">{config.promise}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-5">
        {heroPost && (
          <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <Link href={`/blog/${heroPost.slug}`} className="group block">
              <article className="grid h-full overflow-hidden rounded-lg border border-gray-200 bg-white md:grid-cols-[0.92fr_1.08fr]">
                <PostImage post={heroPost} className="min-h-56 md:min-h-full" sizes="(max-width: 768px) 100vw, 48vw" priority />
                <div className="flex min-h-56 flex-col justify-center p-5 md:p-6">
                  <span className={`w-fit rounded-md px-2.5 py-1 text-[11px] font-black uppercase text-white ${config.accentSolidClass}`}>
                    Featured {config.label}
                  </span>
                  <h2 className="mt-3 font-serif text-2xl font-black leading-tight text-gray-950 md:text-[1.7rem]">
                    {heroPost.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-600 line-clamp-2">{heroPost.description}</p>
                  <ArticleMeta post={heroPost} />
                  <span className="mt-3 inline-flex text-sm font-black text-gray-950 group-hover:text-blue-700">
                    Read the guide <span className="ml-2" aria-hidden="true">-&gt;</span>
                  </span>
                </div>
              </article>
            </Link>

            <aside className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-black uppercase text-gray-950">Start Here</h2>
                  <p className="mt-1 text-xs font-semibold text-gray-500">Useful entry points</p>
                </div>
                <Link href="/" className="text-xs font-black text-gray-500 hover:text-gray-950">
                  Home
                </Link>
              </div>
              {startHerePosts.map((post, index) => (
                <SmallStoryRow key={post.slug} post={post} index={index} config={config} />
              ))}
            </aside>
          </section>
        )}

        {recommendedPosts.length > 0 && (
          <section className="mt-8">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className={`text-[11px] font-black uppercase ${config.accentTextClass}`}>{config.label}</p>
                <h2 className="mt-1 text-xl font-black text-gray-950">Recommended Guides</h2>
              </div>
              <p className="max-w-md text-xs leading-5 text-gray-600">
                A curated path through the posts readers are most likely to need before they search again.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {recommendedPosts.slice(0, 6).map((post) => (
                <RecommendedCard key={post.slug} post={post} config={config} />
              ))}
            </div>
          </section>
        )}

        {latestPosts.length > 0 && (
          <section className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
            <div>
              <p className={`text-[11px] font-black uppercase ${config.accentTextClass}`}>Fresh From EpicKor</p>
              <h2 className="mt-2 text-xl font-black leading-tight text-gray-950">Latest in {config.label}</h2>
              <p className="mt-3 text-xs leading-5 text-gray-600">
                Newer guides and explainers that match this section, pulled from the public EpicKor archive.
              </p>
            </div>
            <div className="grid gap-x-6 md:grid-cols-2">
              {latestPosts.map((post) => (
                <LatestCard key={post.slug} post={post} config={config} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
