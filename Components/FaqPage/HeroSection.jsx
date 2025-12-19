import React from 'react'
import Image from 'next/image'

const HeroSection = () => {
  return (
    <section className='flex items-center justify-center relative h-[35svh] text-center px-16 md:px-0'>
      <Image src='/Faqs_img.png' alt='Background' width={500} height={100} className='absolute h-full w-full object-cover' loading='eager'/>
      <div className='absolute h-full w-full bg-black/50'></div>
      <div className='flex flex-col gap-1 items-center z-20 text-[#ffffff]'>
        <h2 className='text-[45px] font-semibold leading-tight'>Frequently Asked Questions</h2>
        <p className='md:text-[1.1rem] text-[1rem]'>Find quick answers to the most common questions about your coverage, Plans, and more</p>
      </div>
    </section>
  )
}

export default HeroSection