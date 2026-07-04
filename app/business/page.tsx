import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  BUSINESS_AUTHOR_NAME,
  BUSINESS_AUTHOR_PROFILE_HREF,
  getAllBusinessPosts,
  getBusinessTypeLabel,
} from '@/lib/business';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'EpicKor Business | Korea Industry And Sourcing Guides',
  description:
    'Korea business, industry, sourcing, and market-entry guides for overseas buyers, operators, and Korea-market researchers.',
  alternates: {
    canonical: '/business',
  },
  openGraph: {
    title: 'EpicKor Business | Korea Industry And Sourcing Guides',
    description:
      'Korea business, industry, sourcing, and market-entry guides for overseas buyers, operators, and Korea-market researchers.',
    url: 'https://www.epickor.com/business',
  },
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function BusinessIndexPage() {
  const posts = getAllBusinessPosts();
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-gray-200 bg-slate-50">
        <div className="container mx-auto px-4 py-14">
          <div className="max-w-4xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
              EpicKor Business
            </p>
            <h1 className="text-4xl font-black leading-tight text-gray-950 md:text-6xl">
              Korea industry and sourcing guides for overseas operators
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Practical context on Korean SMEs, industries, supplier discovery, and market entry,
              built as a separate trade-media surface inside EpicKor.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <Link
                href={BUSINESS_AUTHOR_PROFILE_HREF}
                className="font-semibold text-emerald-800 hover:text-emerald-950"
              >
                {BUSINESS_AUTHOR_NAME}
              </Link>
              <span className="text-gray-300">|</span>
              <span>Search-demand guides, client stories, and company spotlights</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {featuredPost ? (
          <section className="grid gap-8 border-b border-gray-200 pb-12 lg:grid-cols-[1.15fr_0.85fr]">
            <Link href={`/business/${featuredPost.slug}`} className="group block">
              <article className="grid h-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md md:grid-cols-[0.95fr_1.05fr]">
                <div className="relative min-h-72 bg-gray-100">
                  {featuredPost.ogImage ? (
                    <Image
                      src={featuredPost.ogImage}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <div className="flex h-full min-h-72 items-center justify-center bg-gray-900 text-4xl font-black text-white">
                      EK
                    </div>
                  )}
                </div>
                <div className="p-6 md:p-8">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                      {getBusinessTypeLabel(featuredPost.businessType)}
                    </span>
                    {featuredPost.industry && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        {featuredPost.industry}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-black leading-snug text-gray-950 group-hover:text-emerald-800">
                    {featuredPost.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-gray-600">{featuredPost.description}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500">
                    <span>{formatDate(featuredPost.date)}</span>
                    <span className="text-gray-300">|</span>
                    <span>{featuredPost.author}</span>
                  </div>
                </div>
              </article>
            </Link>

            <aside className="rounded-lg border border-gray-200 bg-slate-50 p-6">
              <h2 className="text-lg font-black text-gray-950">Editorial Scope</h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-gray-600">
                <p>
                  Type A guides answer buyer and operator search demand around Korean suppliers,
                  industries, OEM/ODM paths, and market-entry basics.
                </p>
                <p>
                  Client stories require representative selection, client consent, and video embed
                  permission before publication.
                </p>
                <p>
                  Non-client spotlights use public information only and stay editorial, not vendor
                  promotional copy.
                </p>
              </div>
            </aside>
          </section>
        ) : (
          <section className="rounded-lg border border-dashed border-gray-300 bg-slate-50 p-8">
            <h2 className="text-2xl font-black text-gray-950">Business section in setup</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">
              Approved Korea business and sourcing articles will appear here after the first weekly
              topic list is confirmed.
            </p>
            <Link
              href={BUSINESS_AUTHOR_PROFILE_HREF}
              className="mt-5 inline-flex rounded-md bg-gray-950 px-4 py-2 text-sm font-bold text-white hover:bg-gray-800"
            >
              View Editor Profile
            </Link>
          </section>
        )}

        {remainingPosts.length > 0 && (
          <section className="pt-12">
            <h2 className="mb-6 text-2xl font-black text-gray-950">Latest Business Guides</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {remainingPosts.map((post) => (
                <Link key={post.slug} href={`/business/${post.slug}`} className="group block">
                  <article className="h-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                    <div className="relative h-44 bg-gray-100">
                      {post.ogImage ? (
                        <Image
                          src={post.ogImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gray-900 text-3xl font-black text-white">
                          EK
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                        {getBusinessTypeLabel(post.businessType)}
                      </span>
                      <h3 className="mt-4 text-lg font-black leading-snug text-gray-950 group-hover:text-emerald-800">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-gray-600 line-clamp-3">
                        {post.description}
                      </p>
                      <div className="mt-5 flex items-center justify-between text-xs font-semibold text-gray-500">
                        <span>{formatDate(post.date)}</span>
                        <span>{post.author}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
