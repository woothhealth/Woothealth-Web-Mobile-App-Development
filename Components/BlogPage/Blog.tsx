import blogs from "@/data/blog.json";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/UI/Reveal";
import { FaArrowRight } from "react-icons/fa";

export default function Blog() {
  return (
    <div className="py-8 px-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Reveal key={blog.id}>
            <div className='bg-[#FFFFFF] flex flex-col gap-2 items-center rounded-2xl'>
                <Image src={blog.image} width={500} height={100} alt={blog.title} loading='lazy' className='w-full' />
                <h3 className='text-[.9rem] p-2 font-semibold'>{blog.title}</h3>
                <Link href={`/blog/${blog.id}`} className='btn flex gap-1 items-center p-3 md:py-2 md:px-3 mb-4 text-xs rounded-2xl'>
                    READ MORE <FaArrowRight/>
                </Link>
            </div>
        </Reveal>
        ))}
      </div>
    </div>
  );
}