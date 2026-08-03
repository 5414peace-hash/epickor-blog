import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getBlogPostForPreview } from '@/lib/blog';
import { getBusinessPostForPreview } from '@/lib/business';
import { format } from 'date-fns';
import PreviewActions from './actions';

export const dynamic = 'force-dynamic';

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function PreviewPage({ params, searchParams }: PreviewPageProps) {
  const { slug } = await params;
  const { token } = await searchParams;

  const secret = process.env.PREVIEW_SECRET_TOKEN;
  const isLocalPreview = process.env.NODE_ENV !== 'production';
  if (!isLocalPreview && (!secret || token !== secret)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-xl border border-red-200 bg-white p-10 text-center shadow">
          <p className="text-2xl font-bold text-red-600">401</p>
          <p className="mt-2 text-gray-600">Invalid preview token.</p>
        </div>
      </div>
    );
  }

  // Blog first, then business. The approve/reject API routes write and delete
  // `content/blog/{slug}.md` unconditionally, so they must not be offered for a business
  // post — approving one would create a stray blog file under the business slug.
  // Business drafts are therefore read-only here and published through git.
  const blogPost = await getBlogPostForPreview(slug);
  const businessPost = blogPost ? null : await getBusinessPostForPreview(slug);
  const post = blogPost ?? businessPost;
  if (!post) {
    notFound();
  }
  const isBusiness = !blogPost;

  const formattedDate = format(new Date(post.date), 'MMMM dd, yyyy');
  // Only blog posts carry updatedAt; BusinessPost has no such field.
  const updatedAt = blogPost?.updatedAt;
  const formattedUpdatedAt = updatedAt ? format(new Date(updatedAt), 'MMMM dd, yyyy') : null;

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="border-b border-yellow-200 bg-yellow-50 px-4 py-2 text-center text-sm text-yellow-800">
        {isBusiness
          ? 'Business draft preview (read-only). Publishing a business post is done from the repository, not from this page.'
          : 'This post is a private draft. Use the buttons below to approve or reject it.'}
      </div>

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

      <article className="mx-auto max-w-4xl px-4 py-12">
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
                  Updated <time dateTime={updatedAt}>{formattedUpdatedAt}</time>
                </span>
              </>
            )}
          </div>
        </header>

        <div
          className="blog-content max-w-none font-sans"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {!isBusiness && <PreviewActions slug={slug} token={token || ''} />}
    </div>
  );
}
