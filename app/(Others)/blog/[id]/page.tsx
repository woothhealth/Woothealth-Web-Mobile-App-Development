import blogs from "@/data/blog.json";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}

export default function BlogDetailPage({ params }: PageProps) {
  const blog = blogs.find((b) => b.id === params.id);
  const otherBlogs = blogs.filter((b) => b.id !== params.id);

  if (!blog) {
    return <p className="p-8">Blog not found</p>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Main Blog */}
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-72 object-cover rounded"
      />

      <h1 className="text-3xl font-bold mt-6 mb-4">
        {blog.title}
      </h1>

      <p className="text-gray-700 leading-relaxed">
        {blog.content}
      </p>

      {/* Carousel Section */}
      <h2 className="text-2xl font-semibold mt-12 mb-4">
        Related Health Articles
      </h2>

      <div className="flex gap-4 overflow-x-auto scroll-smooth pb-4">
        {otherBlogs.map((item) => (
          <div
            key={item.id}
            className="min-w-[250px] border rounded-lg shadow"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-40 w-full object-cover rounded-t"
            />

            <div className="p-4">
              <h3 className="font-semibold mb-2">
                {item.title}
              </h3>

              <Link
                href={`/blog/${item.id}`}
                className="text-blue-600 text-sm"
              >
                Read more →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}