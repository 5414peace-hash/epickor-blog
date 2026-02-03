import Link from 'next/link';
import Image from 'next/image';
import { BlogPostMetadata } from '@/lib/blog';
import { format } from 'date-fns';

interface BlogCardProps {
  post: BlogPostMetadata;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formattedDate = format(new Date(post.date), 'MMM dd, yyyy');

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg">
        {/* 이미지 */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          {post.ogImage ? (
            <Image
              src={post.ogImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
              <span className="text-4xl font-bold text-white">EK</span>
            </div>
          )}
        </div>

        {/* 콘텐츠 */}
        <div className="p-6">
          {/* 태그 */}
          <div className="mb-3 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 제목 */}
          <h2 className="mb-2 text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600">
            {post.title}
          </h2>

          {/* 설명 */}
          <p className="mb-4 text-sm text-gray-600 line-clamp-3">
            {post.description}
          </p>

          {/* 메타 정보 */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formattedDate}</span>
            <span className="font-medium">{post.author}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
