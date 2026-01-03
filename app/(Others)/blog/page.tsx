import blogs from "@/data/blog.json";
import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Health Blog</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="border rounded-lg overflow-hidden shadow"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="h-48 w-full object-cover"
            />

            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">
                {blog.title}
              </h2>

              <Link
                href={`/blog/${blog.id}`}
                className="inline-block mt-2 text-blue-600 font-medium"
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
