'use client';

import React from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Reveal } from '@/UI/Reveal';

const HeroSection = () => {
 
  return (
    <section className='relative h-[90svh] flex flex-col justify-center items-start lg:px-16 md:px-10 px-6 text-[#FFFFFF] gap-8 overflow-hidden'>
      <div className='transition-all duration-1000 ease-in-out'
      >
        <Image 
          src='/Retail_Img.png' 
          alt='Woot Retail Picture' 
          width={500} 
          height={100} 
          className='absolute top-0 left-0 object-cover w-full h-full -z-10'
          priority
        />
        <div className='flex flex-col gap-6'>
          <div className='sect'></div>
          <div className='flex flex-col gap-4 z-30 max-w-lg md:max-w-xl'>
            <Reveal>
            <h2 className='lg:text-[47px] md:text-[45px] text-[40px] leading-12 font-bold'>Healthcare that works for your everyday life</h2>
            </Reveal>
            <Reveal>
            <p className='text-[1.2rem] md:text-[1.4rem] lg:text-lg'>Simple health insurance that protects you and your family</p>
            </Reveal>
          </div>
          <a href='#pricing' className='w-fit'>
          <motion.button
              initial= {{opacity: 0 }}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.8, duration: 0.3}}
              whileTap={{scale: 0.95, transition: {delay: 0}}}
              className='z-20 btn flex items-center gap-1.5 font-semibold px-8 py-3 md:py-4 md:px-12 lg:px-8 w-fit'>
            SEE OUR PLANS <FaArrowRight/>
          </motion.button>
          </a>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;