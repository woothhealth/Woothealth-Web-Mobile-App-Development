'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'

const HeroSection = () => {
  return (
    <section className='flex items-center justify-center relative h-[35svh] text-center px-10 md:px-0'>
      <Image src='/Faqs_img.png' alt='Background' width={500} height={100} className='absolute h-full w-full object-cover' loading='eager'/>
      <div className='absolute h-full w-full bg-black/50'></div>
      <div className='flex flex-col gap-1 items-center z-20 text-[#ffffff]'>
        <motion.h2
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0, duration: 1.5}} className='lg:text-[45px] text-[1.8rem] font-semibold leading-tight'>Frequently Asked Questions</motion.h2>
        <motion.p
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0, duration: 1.5}} className='md:text-[1.1rem] text-[0.95rem]'>Find quick answers to the most common questions about your coverage, Plans, and more</motion.p>
      </div>
    </section>
  )
}

export default HeroSection