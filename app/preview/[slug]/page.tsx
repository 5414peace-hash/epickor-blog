import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getBlogPostForPreview } from '@/lib/blog';
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

  const post = await getBlogPostForPreview(slug);
  if (!post) {
    notFound();
  }

  const formattedDate = format(new Date(post.date), 'MMMM dd, yyyy');

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="border-b border-yellow-200 bg-yellow-50 px-4 py-2 text-center text-sm text-yellow-800">
        This post is a private draft. Use the buttons below to approve or reject it.
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
          <div className="flex items-center gap-4 text-gray-600">
            <span className="font-medium">{post.author}</span>
            <span>|</span>
            <time dateTime={post.date}>{formattedDate}</time>
          </div>
        </header>

        <div
          className="blog-content max-w-none font-sans"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <PreviewActions slug={slug} token={token || ''} />
    </div>
  );
}
