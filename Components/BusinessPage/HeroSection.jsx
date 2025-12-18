'use client';

import React from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
 
  return (
    <section className='relative h-[90svh] flex flex-col justify-center items-start lg:px-16 md:px-10 px-4 text-[#FFFFFF] gap-8 overflow-hidden'>
      <div className='transition-all duration-1000 ease-in-out'
      >
        <Image 
          src='/Business_img.png' 
          alt='Woot Business Picture' 
          width={500} 
          height={100} 
          className='absolute top-0 left-0 object-cover w-full h-full -z-10' 
          priority
        />
        <div className='flex flex-col gap-6'>
          <div className='sect'></div>
          <div className='flex flex-col gap-4 z-30 max-w-lg md:max-w-xl'>
            <h2 className='lg:text-[47px] md:text-[45px] text-[38px] leading-10 font-bold'>Health benefit that keep your team healthy and your business thriving</h2>
            <p className='text-[1.2rem] md:text-[1.4rem] lg:text-lg'>Flexible plans designed for business of every size</p>
          </div>
          <Link href="/quote">
            <button className='z-20 btn flex items-center gap-1.5 font-semibold px-8 py-3 md:py-4 md:px-12 lg:px-8 w-fit'>
              GET QUOTE <FaArrowRight/>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;