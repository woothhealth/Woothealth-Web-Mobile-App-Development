'use client';

import React from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import Image from 'next/image';

function HeroSection() {
 return (
    <section className='sect flex flex-col justify-center items-start lg:px-16 md:px-10 px-6 text-[#FFFFFF] gap-8'>
      <Image src='/Hero_1.png' alt='Hero Image' width={500} height={100} className='absolute top-0 left-0 object-cover w-full h-full -z-10' priority />
      <div className='flex flex-col gap-5 z-20 max-w-lg'>
        <h2 className='lg:text-[47px] md:text-[45px] text-[40px] leading-tight font-bold'>Health insurance that actually works!</h2>
        <p className='text-xl md:text-[1.4rem] lg:text-lg'>Quality health coverage for individuals, families, and businesses across Nigeria</p>
      </div>
      <button className='z-20 btn flex items-center gap-1.5 font-semibold px-8 py-3 md:py-4 md:px-12 lg:px-8'>
        GET STARTED <FaArrowRight/>
      </button>
    </section>
 )
}

export default HeroSection;