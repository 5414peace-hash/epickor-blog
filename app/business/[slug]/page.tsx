import Image from 'next/image';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import {
  BUSINESS_AUTHOR_PROFILE_HREF,
  BusinessPostMetadata,
  getAllBusinessPosts,
  getAllBusinessSlugs,
  getBusinessPost,
  getBusinessTypeLabel,
} from '@/lib/business';

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = getAllBusinessSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBusinessPost(slug);

  if (!post) {
    return {
      title: 'Business Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/business/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      ...(post.ogImage ? { images: [post.ogImage] } : {}),
      url: `https://www.epickor.com/business/${post.slug}`,
      type: 'article',
    },
  };
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getRelatedBusinessPosts(
  currentPost: BusinessPostMetadata,
  allPosts: BusinessPostMetadata[],
  limit: number = 3
): BusinessPostMetadata[] {
  return allPosts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => {
      const sharedTags = post.tags.filter((tag) => currentPost.tags.includes(tag)).length;
      const typeBoost = post.businessType === currentPost.businessType ? 4 : 0;
      return {
        post,
        score: sharedTags * 10 + typeBoost,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}

export default async function BusinessPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBusinessPost(slug);

  if (!post) {
    notFound();
  }

  if (post.slug !== slug) {
    permanentRedirect(`/business/${post.slug}`);
  }

  const allPosts = getAllBusinessPosts();
  const relatedPosts = getRelatedBusinessPosts(post, allPosts, 3);

  return (
    <div className="min-h-screen bg-white">
      {post.ogImage && (
        <div className="relative h-80 w-full bg-gray-100 md:h-96">
          <Image src={post.ogImage} alt={post.title} fill className="object-cover" priority />
        </div>
      )}

      <article className="mx-auto max-w-4xl px-4 py-12">
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-emerald-700">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/business" className="hover:text-emerald-700">
            Business
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{post.title}</span>
        </nav>

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-bold text-emerald-800">
              {getBusinessTypeLabel(post.businessType)}
            </span>
            {post.industry && (
              <span className="rounded-full bg-gray-100 px-4 py-1 text-sm font-semibold text-gray-700">
                {post.industry}
              </span>
            )}
            {post.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-4 py-1 text-sm font-semibold text-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl font-black leading-tight text-gray-950 md:text-5xl">
            {post.title}
          </h1>

          <p className="mt-5 text-lg leading-8 text-gray-600">{post.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <Link
              href={BUSINESS_AUTHOR_PROFILE_HREF}
              className="font-bold text-emerald-800 hover:text-emerald-950"
            >
              {post.author}
            </Link>
            <span className="text-gray-300">|</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
        </header>

        <aside className="mb-10 rounded-lg border border-gray-200 bg-slate-50 p-5">
          <dl className="grid gap-4 text-sm md:grid-cols-3">
            <div>
              <dt className="font-bold text-gray-950">Coverage Type</dt>
              <dd className="mt-1 text-gray-600">{getBusinessTypeLabel(post.businessType)}</dd>
            </div>
            <div>
              <dt className="font-bold text-gray-950">Company</dt>
              <dd className="mt-1 text-gray-600">{post.companyName || 'Not company-specific'}</dd>
            </div>
            <div>
              <dt className="font-bold text-gray-950">Source Scope</dt>
              <dd className="mt-1 text-gray-600">{post.sourceScope || 'Public and cited sources'}</dd>
            </div>
          </dl>
        </aside>

        <div
          className="blog-content max-w-none font-sans"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {relatedPosts.length > 0 && (
          <section className="mt-16 border-t border-gray-200 pt-12">
            <h2 className="mb-8 text-3xl font-black text-gray-950">More Business Guides</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/business/${relatedPost.slug}`}
                  className="group block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {relatedPost.ogImage ? (
                    <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={relatedPost.ogImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-gray-900">
                      <span className="text-3xl font-black text-white">EK</span>
                    </div>
                  )}
                  <div className="p-4">
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-800">
                      {getBusinessTypeLabel(relatedPost.businessType)}
                    </span>
                    <h3 className="mt-3 text-lg font-black leading-snug text-gray-950 group-hover:text-emerald-800">
                      {relatedPost.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600 line-clamp-2">
                      {relatedPost.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <div className="border-t border-gray-200 bg-gray-50 py-10">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/business"
            className="inline-flex rounded-md bg-gray-950 px-5 py-3 text-sm font-bold text-white hover:bg-gray-800"
          >
            Back to Business
          </Link>
        </div>
      </div>
    </div>
  );
}
