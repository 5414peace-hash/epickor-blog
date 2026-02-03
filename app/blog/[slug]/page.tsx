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
          className="prose prose-lg max-w-none font-sans prose-headings:font-black prose-headings:text-gray-900 prose-headings:mb-10 prose-headings:mt-20 prose-h1:text-6xl prose-h1:leading-tight prose-h1:mb-12 prose-h2:text-6xl prose-h2:leading-tight prose-h2:mt-24 prose-h2:mb-8 prose-h2:border-b prose-h2:border-gray-300 prose-h2:pb-4 prose-h3:text-5xl prose-h3:leading-snug prose-h3:mt-16 prose-h3:mb-6 prose-h3:text-gray-800 prose-p:mb-10 prose-p:text-gray-700 prose-p:text-lg prose-a:text-blue-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-strong:font-bold prose-img:my-12 prose-img:mx-auto prose-img:max-w-[600px] prose-img:w-full prose-img:h-auto prose-img:rounded-lg prose-img:shadow-lg prose-ul:my-10 prose-ul:space-y-4 prose-ol:my-10 prose-ol:space-y-4 prose-li:text-lg prose-hr:my-20 prose-hr:border-gray-300"
          style={{ lineHeight: '1.8' }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
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
