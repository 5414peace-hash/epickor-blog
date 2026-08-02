import Image from 'next/image';
import Link from 'next/link';
import HomeGuideFinder from '@/components/HomeGuideFinder';
import { BlogPostMetadata, getAllBlogPosts } from '@/lib/blog';
import { BusinessPostMetadata, getAllBusinessPosts, getBusinessTypeLabel } from '@/lib/business';
import { getAllCardNews, type CardNewsItem } from '@/lib/card-news';
import { getHomeSurface, getSlotSlug, getSlotSlugs } from '@/lib/editorial-surface';
import { getLatestArticles, type LatestArticle } from '@/lib/latest-articles';

export const revalidate = 86400;

type ArticleSource = 'blog' | 'business';

interface HomeArticle {
  slug: string;
  href: string;
  title: string;
  description: string;
  date: string;
  image: string;
  label: string;
  source: ArticleSource;
  readTime?: string;
}

interface SectionTile {
  title: string;
  description: string;
  href: string;
  image: string;
  accentClass: string;
  action: string;
}

// Topic sections only. The comparison hubs live in their own labelled row —
// Seoul is inside Travel and the food hubs are inside Food & Shopping, so
// listing them as siblings of their own parents made the taxonomy unreadable.
const guideChips = [
  { label: 'Travel', href: '/travel' },
  { label: 'Food & Shopping', href: '/food-shopping' },
  { label: 'Beauty & Lifestyle', href: '/beauty-lifestyle' },
  { label: 'Culture', href: '/culture' },
  { label: 'Business in Korea', href: '/business' },
];

const compareChips = [
  { label: 'Seoul Neighbourhoods', href: '/seoul' },
  { label: 'Convenience Stores', href: '/convenience-store' },
  { label: 'Ramyun', href: '/ramyun' },
  { label: 'All Guides →', href: '/guides' },
];

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function findBlogPost(posts: BlogPostMetadata[], slug: string): BlogPostMetadata | undefined {
  return posts.find((post) => post.slug === slug);
}

function pickBlogPosts(posts: BlogPostMetadata[], slugs: string[], limit: number): BlogPostMetadata[] {
  const selected = slugs
    .map((slug) => findBlogPost(posts, slug))
    .filter((post): post is BlogPostMetadata => Boolean(post));

  if (selected.length >= limit) {
    return selected.slice(0, limit);
  }

  const selectedSlugs = new Set(selected.map((post) => post.slug));
  const fallback = posts.filter((post) => !selectedSlugs.has(post.slug)).slice(0, limit - selected.length);
  return [...selected, ...fallback];
}

function toBlogArticle(post: BlogPostMetadata, label: string, readTime?: string): HomeArticle {
  return {
    slug: post.slug,
    href: `/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    date: post.date,
    image: post.ogImage,
    label,
    source: 'blog',
    readTime,
  };
}

function toBusinessArticle(post: BusinessPostMetadata): HomeArticle {
  return {
    slug: post.slug,
    href: `/business/${post.slug}`,
    title: post.title,
    description: post.description,
    date: post.date,
    image: post.ogImage,
    label: getBusinessTypeLabel(post.businessType),
    source: 'business',
    readTime: post.industry,
  };
}

function trimTitle(title: string, maxLength = 74): string {
  if (title.length <= maxLength) return title;
  return `${title.slice(0, maxLength - 1).trim()}...`;
}

function getReadableTitle(title: string): string {
  return title
    .replace(/\s*2026:\s*/i, ': ')
    .replace(/\s*Guide 2026/i, ' Guide')
    .replace(/\s*2026 Guide/i, ' Guide');
}

function ArticleImage({
  article,
  className,
  sizes,
  priority = false,
}: {
  article: Pick<HomeArticle, 'title' | 'image'>;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  if (!article.image) {
    const positionClass = /\b(absolute|fixed|relative|sticky)\b/.test(className) ? '' : 'relative';
    return (
      <div className={`${positionClass} ${className} flex items-center justify-center bg-gray-950 text-3xl font-black text-white`}>
        EK
      </div>
    );
  }

  const positionClass = /\b(absolute|fixed|relative|sticky)\b/.test(className) ? '' : 'relative';

  return (
    <div className={`${positionClass} overflow-hidden bg-gray-100 ${className}`}>
      <Image
        src={article.image}
        alt={article.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}

function StoryMeta({ article }: { article: HomeArticle }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-500">
      <time dateTime={article.date}>{formatDate(article.date)}</time>
      {article.readTime && (
        <>
          <span className="text-gray-300">|</span>
          <span>{article.readTime}</span>
        </>
      )}
    </div>
  );
}

function OverlayStoryCard({
  article,
  size = 'large',
}: {
  article: HomeArticle;
  size?: 'large' | 'medium';
}) {
  const isLarge = size === 'large';
  const displayTitle = isLarge ? getReadableTitle(article.title) : trimTitle(getReadableTitle(article.title), 62);

  return (
    <Link href={article.href} className="group block h-full">
      <article
        className={`relative h-full overflow-hidden rounded-lg bg-gray-950 text-white ${
          isLarge ? 'min-h-[22rem] lg:min-h-0' : 'min-h-[14rem] lg:min-h-0'
        }`}
      >
        <ArticleImage
          article={article}
          className="absolute inset-0 h-full w-full opacity-75"
          sizes={isLarge ? '(max-width: 1024px) 100vw, 48vw' : '(max-width: 1024px) 100vw, 30vw'}
          priority={isLarge}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5" />
        <div className={`relative z-10 flex h-full flex-col justify-end ${isLarge ? 'p-6 md:p-8' : 'p-5 md:p-6'}`}>
          <span className={`${isLarge ? 'mb-4' : 'mb-2'} w-fit rounded-md bg-blue-600 px-3 py-1 text-xs font-black uppercase text-white`}>
            {article.label}
          </span>
          <h2
            className={
              isLarge
                ? 'max-w-xl font-serif text-4xl font-black leading-tight'
                : 'max-w-md font-serif text-2xl font-black leading-tight line-clamp-2'
            }
          >
            {displayTitle}
          </h2>
          {isLarge && <p className="mt-3 max-w-xl text-sm leading-6 text-gray-100 line-clamp-2">{article.description}</p>}
          <StoryMeta article={article} />
        </div>
      </article>
    </Link>
  );
}

function PopularRail({ posts }: { posts: HomeArticle[] }) {
  return (
    <aside className="h-full overflow-hidden rounded-lg border border-gray-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-black uppercase text-gray-950">Today In Korea</h2>
          <p className="mt-1 text-xs font-semibold text-gray-500">Popular from search</p>
        </div>
        <Link href="/latest" className="text-xs font-bold text-blue-700 hover:text-blue-900">
          More
        </Link>
      </div>
      <div className="divide-y divide-gray-200">
        {posts.map((post, index) => (
          <Link key={post.href} href={post.href} className="group grid grid-cols-[2rem_1fr_64px] gap-3 py-2.5 first:pt-0 last:pb-0">
            <span className="font-serif text-xl text-gray-400">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3 className="text-sm font-black leading-snug text-gray-950 line-clamp-2 group-hover:text-blue-700">
                {trimTitle(getReadableTitle(post.title), 44)}
              </h3>
              <p className="mt-1 text-xs font-semibold text-gray-500">{post.readTime || 'Guide'}</p>
            </div>
            <ArticleImage article={post} className="h-12 rounded-md" sizes="64px" />
          </Link>
        ))}
      </div>
    </aside>
  );
}

function SectionTileCard({ tile }: { tile: SectionTile }) {
  return (
    <Link
      href={tile.href}
      className="group block border-b border-gray-200 pb-6 last:border-b-0 last:pb-0 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6 lg:last:border-r-0 lg:last:pr-0"
    >
      <article>
        <h2 className={`text-base font-black uppercase ${tile.accentClass}`}>{tile.title}</h2>
        <p className="mt-2 min-h-12 text-sm leading-6 text-gray-600">{tile.description}</p>
        <div className="relative mt-4 h-28 overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={tile.image}
            alt={tile.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 20vw"
          />
        </div>
        <span className="mt-4 inline-flex text-sm font-black text-gray-950 group-hover:text-blue-700">
          {tile.action}
          <span className="ml-2" aria-hidden="true">
            -&gt;
          </span>
        </span>
      </article>
    </Link>
  );
}

function CompactArticleCard({ article }: { article: HomeArticle }) {
  return (
    <Link href={article.href} className="group block">
      <article className="grid h-full grid-cols-[112px_1fr] overflow-hidden rounded-lg border border-gray-200 bg-white">
        <ArticleImage article={article} className="h-full min-h-28" sizes="112px" />
        <div className="p-4">
          <span className="text-xs font-black uppercase text-emerald-700">{article.label}</span>
          <h3 className="mt-2 text-sm font-black leading-snug text-gray-950 group-hover:text-emerald-800">
            {trimTitle(getReadableTitle(article.title), 62)}
          </h3>
          <p className="mt-2 text-xs leading-5 text-gray-600 line-clamp-2">{article.description}</p>
        </div>
      </article>
    </Link>
  );
}

function LatestPulse({ articles }: { articles: LatestArticle[] }) {
  if (articles.length === 0) return null;

  const visibleArticles = articles.slice(0, 12);
  const updatedAt = visibleArticles[0]?.date;

  return (
    <section className="border-b border-gray-200 bg-[#fbfaf8]">
      <div className="container mx-auto grid gap-4 px-4 py-4 lg:grid-cols-[190px_1fr_auto] lg:items-center">
        <div className="border-l-4 border-red-500 pl-3">
          <p className="text-xs font-black uppercase text-red-600">Latest on EpicKor</p>
          <p className="mt-1 text-sm font-bold text-gray-950">
            {updatedAt ? `Newest ${formatDate(updatedAt)}` : 'Fresh Korea updates'}
          </p>
        </div>

        <div className="scrollbar-none flex gap-3 overflow-x-auto pb-1">
          {visibleArticles.map((article, index) => (
            <Link key={article.href} href={article.href} className="group grid w-[230px] shrink-0 grid-cols-[58px_1fr] gap-3">
              <ArticleImage article={article} className="h-14 w-14 rounded-md" sizes="58px" />
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                  {index < 3 && (
                    <span className="shrink-0 rounded-md bg-red-600 px-1.5 py-0.5 text-[10px] font-black uppercase text-white">
                      New
                    </span>
                  )}
                  <span className="truncate text-[11px] font-black uppercase text-gray-500">{article.label}</span>
                </div>
                <h2 className="mt-1 text-sm font-black leading-snug text-gray-950 line-clamp-2 group-hover:text-red-700">
                  {trimTitle(getReadableTitle(article.title), 56)}
                </h2>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/latest"
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-black text-gray-950 hover:border-red-500 hover:text-red-700"
        >
          And more -&gt;
        </Link>
      </div>
    </section>
  );
}

function HomeCardNews({ items }: { items: CardNewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-6 border-b border-gray-200 bg-white pb-6">
      <div className="grid gap-4 lg:grid-cols-[190px_1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase text-red-600">Card News</p>
          <h2 className="mt-1 text-lg font-black leading-tight text-gray-950">Swipeable card news</h2>
          <p className="mt-1 text-xs leading-5 text-gray-600">Quick visual guides from EpicKor.</p>
        </div>

        <div className="scrollbar-none flex gap-3 overflow-x-auto pb-1">
          {items.slice(0, 5).map((item, index) => (
            <Link
              key={`${item.folder}-${item.slug}`}
              href={item.href}
              data-analytics-event="home_card_news_click"
              data-analytics-slug={item.slug}
              data-analytics-title={item.topic}
              className="group grid w-[156px] shrink-0 grid-cols-[58px_1fr] gap-3 rounded-lg border border-gray-200 bg-[#fbfaf8] p-2.5 transition hover:border-red-200 hover:bg-white hover:shadow-sm"
            >
              <div className="relative aspect-square overflow-hidden rounded-md bg-gray-950">
                <Image
                  src={item.coverImage}
                  alt={`${item.topic} card-news cover`}
                  fill
                  priority={index < 3}
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  sizes="58px"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase text-red-600">{item.totalCards} cards</p>
                <h3 className="mt-1 text-xs font-black leading-snug text-gray-950 line-clamp-3 group-hover:text-red-700">
                  {trimTitle(getReadableTitle(item.topic), 42)}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/card-news"
          data-analytics-event="home_card_news_all_click"
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-black text-gray-950 hover:border-red-500 hover:text-red-700"
        >
          All Card News -&gt;
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  const blogPosts = getAllBlogPosts();
  const businessPosts = getAllBusinessPosts();
  const latestArticles = getLatestArticles(20);
  const cardNewsItems = getAllCardNews().slice(0, 5);
  const homeSurface = getHomeSurface();
  const curatedSlugs = {
    lead: getSlotSlug(homeSurface.hero),
    secondary: getSlotSlugs(homeSurface.secondary),
    popular: getSlotSlugs(homeSurface.popular),
    plan: getSlotSlugs(homeSurface.plan),
    reels: getSlotSlugs(homeSurface.reels),
  };

  const leadPost = findBlogPost(blogPosts, curatedSlugs.lead) || blogPosts[0];
  const leadArticle = leadPost ? toBlogArticle(leadPost, 'Travel Guide', '12 min read') : null;
  const secondaryArticles = pickBlogPosts(blogPosts, curatedSlugs.secondary, 2).map((post, index) =>
    toBlogArticle(post, index === 0 ? 'Beauty Guide' : 'Food Guide', index === 0 ? '9 min read' : '8 min read')
  );
  const popularArticles = pickBlogPosts(blogPosts, curatedSlugs.popular, 5).map((post, index) =>
    toBlogArticle(post, index < 3 ? 'Culture' : 'Travel Planning', `${index + 5} min read`)
  );
  const planArticles = pickBlogPosts(blogPosts, curatedSlugs.plan, 4).map((post) => toBlogArticle(post, 'Plan Smarter'));
  const reelsArticles = pickBlogPosts(blogPosts, curatedSlugs.reels, 4).map((post) => toBlogArticle(post, 'Guide'));
  const businessArticles = businessPosts.slice(0, 2).map(toBusinessArticle);
  const featuredBusiness = businessArticles[0];

  const sectionTiles: SectionTile[] = [
    {
      title: 'Travel Guides',
      description: 'Itineraries, transport, hotels, and practical Korea travel tips.',
      href: '/travel',
      image: '/assets/images/posts/257/incheon-airport-terminal-departure.jpg',
      accentClass: 'text-blue-700',
      action: 'Explore Travel',
    },
    {
      title: 'Food & Shopping',
      description: 'Where to eat, what to buy, and how to shop smart.',
      href: '/food-shopping',
      image: '/assets/images/posts/270/salt-bread-sea-salt-baker.jpg',
      accentClass: 'text-red-600',
      action: 'Explore Food & Shopping',
    },
    {
      title: 'Beauty & Lifestyle',
      description: 'K-beauty, skincare, fashion, and everyday life.',
      href: '/beauty-lifestyle',
      image: '/assets/images/posts/192/skincare-products-flatlay.jpg',
      accentClass: 'text-pink-600',
      action: 'Explore Beauty',
    },
    {
      title: 'Culture Explainers',
      description: 'Language, customs, K-culture, and how things work here.',
      href: '/culture',
      image: '/assets/images/posts/090/9aba325a-8a83-4721-9780-c2760839d14b.png',
      accentClass: 'text-violet-700',
      action: 'Explore Culture',
    },
    {
      title: 'Korea Business Desk',
      description: 'Companies, industries, and business stories from Korea.',
      href: '/business',
      image: '/assets/images/business/toss-viva-republica-deep-dive/toss-office-open-workspace-rsquare.jpg',
      accentClass: 'text-emerald-700',
      action: 'Visit Business Desk',
    },
    {
      title: 'Seoul by Neighbourhood',
      description: 'Which Seoul neighbourhood is worth your afternoon, compared side by side.',
      href: '/seoul',
      image: '/assets/images/posts/355/ikseon-dong-hanok-alley.jpg',
      accentClass: 'text-blue-700',
      action: 'Compare Neighbourhoods',
    },
    {
      title: 'Korean Convenience Stores',
      description: 'The four chains compared, current prices, and what each product actually is.',
      href: '/convenience-store',
      image: '/assets/images/posts/059/convenience-store-lunchbox-01.jpg',
      accentClass: 'text-red-600',
      action: 'Open the Guide',
    },
    {
      title: 'Korean Ramyun',
      description: 'Every packet compared by soup base and verified Scoville, with current prices.',
      href: '/ramyun',
      image: '/assets/images/posts/346/ansungtangmyun-noodle-and-soup-powder.jpg',
      accentClass: 'text-orange-700',
      action: 'Compare Ramyun',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-950">
      <HomeGuideFinder chips={guideChips} guides={compareChips} />
      <LatestPulse articles={latestArticles} />

      <main className="container mx-auto px-4 py-6">
        {leadArticle && (
          <section className="grid gap-6 lg:h-[390px] lg:grid-cols-[1.05fr_0.68fr_0.52fr]">
            <div className="lg:min-h-[390px]">
              <OverlayStoryCard article={leadArticle} />
            </div>

            <div className="grid gap-6">
              {secondaryArticles.map((article) => (
                <OverlayStoryCard key={article.href} article={article} size="medium" />
              ))}
            </div>

            <PopularRail posts={popularArticles} />
          </section>
        )}

        <section className="mt-6 grid gap-6 border-y border-gray-200 py-6 sm:grid-cols-2 lg:grid-cols-3">
          {sectionTiles.map((tile) => (
            <SectionTileCard key={tile.href} tile={tile} />
          ))}
        </section>

        <HomeCardNews items={cardNewsItems} />

        <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.98fr]">
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black uppercase text-gray-950">Plan Smarter</h2>
                <p className="mt-1 text-sm text-gray-600">Practical Korea guides before you book, pack, or buy.</p>
              </div>
              <Link href="/travel" className="text-sm font-black text-blue-700 hover:text-blue-900">
                View all picks -&gt;
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
              {planArticles.map((article) => (
                <Link key={article.href} href={article.href} className="group block">
                  <article>
                    <ArticleImage article={article} className="h-28 rounded-lg" sizes="(max-width: 768px) 50vw, 18vw" />
                    <h3 className="mt-3 text-sm font-black leading-snug text-gray-950 group-hover:text-blue-700">
                      {trimTitle(getReadableTitle(article.title), 48)}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-gray-600 line-clamp-2">{article.description}</p>
                    <span className="mt-2 inline-flex text-xs font-black text-blue-700">Guide -&gt;</span>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black uppercase text-gray-950">From Reels To Full Korea Guides</h2>
                <p className="mt-1 text-sm text-gray-600">Short on social, deep on EpicKor.</p>
              </div>
              <a
                href="https://www.instagram.com/epickorsnippets/"
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-event="social_channel_click"
                data-analytics-platform="instagram"
                data-analytics-location="home_reels_section"
                className="text-sm font-black text-emerald-700 hover:text-emerald-900"
              >
                Visit Instagram -&gt;
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
              {reelsArticles.map((article) => (
                <Link key={article.href} href={article.href} className="group block">
                  <article>
                    <div className="relative">
                      <ArticleImage article={article} className="h-28 rounded-lg" sizes="(max-width: 768px) 50vw, 18vw" />
                      <span className="absolute bottom-2 left-2 rounded-md bg-white/95 px-2 py-1 text-xs font-black text-gray-950">
                        Guide
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-black leading-snug text-gray-950 group-hover:text-emerald-800">
                      {trimTitle(getReadableTitle(article.title), 48)}
                    </h3>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {businessArticles.length > 0 && (
          <section className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50/70 p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-emerald-700">Korea Business Desk</p>
                <h2 className="mt-1 text-2xl font-black text-gray-950">Companies, industries, and sourcing context</h2>
              </div>
              <Link href="/business" className="rounded-md bg-gray-950 px-4 py-2 text-sm font-black text-white hover:bg-gray-800">
                Go to Business Desk
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {businessArticles.map((article) => (
                <CompactArticleCard key={article.href} article={article} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
