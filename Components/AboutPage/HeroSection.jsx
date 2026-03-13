'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'

const HeroSection = () => {
  return (
    <section className='flex items-center justify-center relative h-[35svh] text-center px-16 md:px-0'>
      <Image src='/About_img.webp' alt='Woot About Background' width={500} height={100} className='absolute h-full w-full object-cover' loading='eager'/>
      <div className='absolute h-full w-full bg-black/50'></div>
      <div className='flex flex-col gap-1 items-center z-20 text-[#ffffff]'>
        <motion.h2
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0, duration: 1.5}}
        className='text-[40px] md:text-[45px] font-semibold leading-tight'>About Us</motion.h2>
        <motion.p
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0, duration: 1.5}} className='md:text-[1.1rem] text-[1rem] leading-tight md:leading-normal md:w-xl'>Discover the Woot Health story, our mission, our values, and our commitment to transforming healthcare in Nigeria.</motion.p>
      </div>
    </section>
  )
}

export default HeroSection