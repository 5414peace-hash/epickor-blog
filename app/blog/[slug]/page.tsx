import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPost, getAllBlogSlugs } from '@/lib/blog';
import { format } from 'date-fns';

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
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.ogImage],
      url: `https://www.epickor.com/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = format(new Date(post.date), 'MMMM dd, yyyy');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      {post.ogImage && (
        <div className="relative h-96 w-full bg-gray-100">
          <Image
            src={post.ogImage}
            alt={post.title}
            fill
            className="object-cover"
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

          <div className="flex items-center gap-4 text-gray-600">
            <span className="font-medium">{post.author}</span>
            <span>•</span>
            <time dateTime={post.date}>{formattedDate}</time>
          </div>
        </header>

        {/* Content */}
        <div
          className="blog-content max-w-none font-sans"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <style jsx>{`
          .blog-content :global(h1) {
            font-size: 64px;
            font-weight: 900;
            color: #111827;
            margin-top: 3rem;
            margin-bottom: 3rem;
            line-height: 1.2;
          }
          .blog-content :global(h2) {
            font-size: 64px;
            font-weight: 900;
            color: #111827;
            margin-top: 6rem;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #d1d5db;
            line-height: 1.2;
          }
          .blog-content :global(h3) {
            font-size: 56px;
            font-weight: 900;
            color: #1f2937;
            margin-top: 4rem;
            margin-bottom: 1.5rem;
            line-height: 1.3;
          }
          .blog-content :global(p) {
            font-size: 18px;
            color: #374151;
            margin-bottom: 2.5rem;
            line-height: 1.8;
          }
          .blog-content :global(a) {
            color: #2563eb;
            font-weight: 600;
            text-decoration: none;
          }
          .blog-content :global(a:hover) {
            text-decoration: underline;
          }
          .blog-content :global(strong) {
            font-weight: 700;
            color: #111827;
          }
          .blog-content :global(img) {
            max-width: 600px;
            width: 100%;
            height: auto;
            margin: 3rem auto;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }
          .blog-content :global(ul),
          .blog-content :global(ol) {
            margin: 2.5rem 0;
            padding-left: 1.5rem;
          }
          .blog-content :global(li) {
            font-size: 18px;
            margin-bottom: 1rem;
            line-height: 1.8;
          }
          .blog-content :global(hr) {
            margin: 5rem 0;
            border-color: #d1d5db;
          }
        `}</style>
      </article>

      {/* Back to Home */}
      <div className="border-t border-gray-200 bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700"
          >
            ← Back to All Stories
          </Link>
        </div>
      </div>
    </div>
  );
}
