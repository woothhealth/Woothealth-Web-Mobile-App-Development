import React from 'react'
import Image from 'next/image'

const HeroSection = () => {
  return (
    <section className='flex items-center justify-center relative h-[35svh] text-center px-16 md:px-0'>
      <Image src='/About_img.png' alt='Woot About Background' width={500} height={100} className='absolute h-full w-full object-cover' loading='eager'/>
      <div className='absolute h-full w-full bg-black/50'></div>
      <div className='flex flex-col gap-1 items-center z-20 text-[#ffffff]'>
        <h2 className='text-[45px] font-semibold leading-tight'>About Us</h2>
        <p className='md:text-[1.1rem] text-[1rem] md:w-xl'>Discover the Woot Health story, our mission, our values, and our commitment to transforming healthcare in Nigeria.</p>
      </div>
    </section>
  )
}

export default HeroSection