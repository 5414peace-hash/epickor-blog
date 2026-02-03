import { getAllBlogPosts } from '@/lib/blog';
import BlogCard from '@/components/BlogCard';

export default function Home() {
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="mb-4 text-6xl font-black text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              EpicKor
            </h1>
            <p className="text-xl text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              Discover Hidden Travel Gems, Unique Attractions, and Must-Visit Destinations in Korea
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Latest Stories</h2>
            <p className="mt-2 text-gray-600">
              Explore Korea like never before with our curated articles
            </p>
          </div>

          {posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <p className="text-gray-500">No blog posts yet. Stay tuned!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Planning a visit to Korea?</h2>
          <p className="mb-8 text-lg opacity-90">
            Make sure to follow EpicKor! We provide exclusive tips and advanced info you won't get from anyone else.
          </p>
          <button className="rounded-full bg-white px-8 py-3 font-semibold text-gray-900 transition-all hover:bg-gray-100">
            Follow Us
          </button>
        </div>
      </section>
    </div>
  );
}
