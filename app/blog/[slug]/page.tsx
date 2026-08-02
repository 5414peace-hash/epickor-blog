import { notFound, permanentRedirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPost, getAllBlogSlugs, getAllBlogPosts } from '@/lib/blog';
import { getRelatedPosts } from '@/lib/related-posts';
import { isPortraitImage } from '@/lib/image-dimensions';
import { ArticleLd, BreadcrumbLd, FaqLd, extractFaq } from '@/components/StructuredData';
import { format } from 'date-fns';

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      ...(post.ogImage ? { images: [post.ogImage] } : {}),
      url: `https://www.epickor.com/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  if (post.slug !== slug) {
    permanentRedirect(`/blog/${post.slug}`);
  }

  const formattedDate = format(new Date(post.date), 'MMMM dd, yyyy');
  const formattedUpdatedAt = post.updatedAt ? format(new Date(post.updatedAt), 'MMMM dd, yyyy') : null;
  
  // Get related posts
  const allPosts = getAllBlogPosts();
  const relatedPosts = getRelatedPosts(post, allPosts, 3);
  
  const faq = extractFaq(post.content || '');

  return (
    <div className="min-h-screen bg-white">
      <ArticleLd
        headline={post.title}
        description={post.description}
        slug={post.slug}
        image={post.ogImage}
        datePublished={post.date}
        dateModified={post.updatedAt || post.date}
      />
      <BreadcrumbLd
        trail={[
          { name: 'Home', href: '/' },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      <FaqLd qa={faq} />

      {/* Hero Image
          Portrait sources are anchored to the top rather than centred. Many of
          these are Reels thumbnails with the headline set in the upper third,
          and a centred cover crop sliced straight through that text — the hero
          showed a bowl of noodles and half a word. Anchoring to the top keeps
          the headline intact; landscape photographs keep the centred crop,
          where the subject is normally in the middle. */}
      {post.ogImage && (
        <div className="relative h-96 w-full bg-gray-100">
          <Image
            src={post.ogImage}
            alt={post.title}
            fill
            className={
              isPortraitImage(post.ogImage)
                ? 'object-cover object-top'
                : 'object-cover'
            }
            priority
          />
        </div>
      )}

      {/* Article Content */}
      <article className="mx-auto max-w-4xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{post.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-gray-600">
            <span className="font-medium">{post.author}</span>
            <span>|</span>
            <time dateTime={post.date}>{formattedDate}</time>
            {formattedUpdatedAt && formattedUpdatedAt !== formattedDate && (
              <>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-gray-500">
                  Updated <time dateTime={post.updatedAt}>{formattedUpdatedAt}</time>
                </span>
              </>
            )}
          </div>
        </header>

        {/* Content */}
        <div
          className="blog-content max-w-none font-sans"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 border-t border-gray-200 pt-12">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">You Might Also Like</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
                >
                  {relatedPost.ogImage ? (
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={relatedPost.ogImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                      <span className="text-4xl font-bold text-white">EK</span>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="mb-2 flex flex-wrap gap-2">
                      {relatedPost.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {relatedPost.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
      
      {/* Back to Home */}
      <div className="border-t border-gray-200 bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700"
          >
            Back to All Stories
          </Link>
        </div>
      </div>
    </div>
  );
}


