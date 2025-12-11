import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import Image from 'next/image'

const articleBlog = [
    {
        image: '/Article1.png',
        text: 'LIVER: 10 FACTS ABOUT THE LIVER',
    },
    {
        image: '/Article2.png',
        text: 'DIET: NUTRITION ESSENTIALS',
    },
    {
        image: '/Article3.png',
        text: 'FITNESS: A 30 DAYS CHALLENGE',
    }
]

const HomeArticle = () => {
  return (
    <section className='py-16 lg:px-[78px] md:px-10 px-6 bg-[#49A5EF] text-[#FFFFFF]'>
        <div className='flex flex-col gap-10'>
            <div className='flex md:flex-row flex-col md:justify-between text-center gap-6 items-center'>
                <div>
                    <h3 className='text-[21px] md:w-sm leading-tight'>Explore articles, tips, and resources to help you and your team thrive</h3>
                </div>
                <button className='bg-[#FFFFFF] uppercase flex gap-1.5 items-center py-2 px-5 font-semibold text-[#000000]'>
                    Discover More <FaArrowRight/>
                </button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-[#000000]'>
                {articleBlog.map((post, index) => (
                    <div key={index} className='bg-[#FFFFFF] flex flex-col gap-2 items-center rounded-2xl'>
                        <Image src={post.image} width={100} height={100} alt='Blog Images' loading='lazy' className='w-full' />
                        <h3 className='text-[.9rem] p-2 font-semibold'>{post.text}</h3>
                        <button className='btn flex gap-1 items-center p-3 md:py-2 md:px-3 mb-4 text-xs'>
                            READ MORE <FaArrowRight/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default HomeArticle