'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import Image from 'next/image';
import Link from 'next/link';

const slides = [
  {
    image: '/Hero_1.png',
    title: 'Health insurance that actually works!',
    text: 'Quality health coverage for individuals, families, and businesses across Nigeria.'
  },
  {
    image: '/Hero_2.png',
    title: 'Invest in Your Teams Health, Watch Your Business Thrive',
    text: 'Digital-first plans with nationwide coverage, telemedicine access, and support when you need it most.'
  },
  {
    image: '/Hero_3.png',
    title: 'Health Coverage That Puts You and Your Family First',
    text: `Affordable plans with access to Nigeria's largest network of trusted hospitals and healthcare providers.`
  }
];

function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prevCurrent) => (prevCurrent + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const currentSlide = slides[current];

  return (
    <section className='relative h-[90svh] flex flex-col justify-center items-start lg:px-16 md:px-10 px-6 text-[#FFFFFF] gap-8 overflow-hidden'>
      <div className='transition-all duration-1000 ease-in-out'
      >
        <Image 
          src={currentSlide.image} 
          alt={currentSlide.title} 
          width={500} 
          height={100} 
          className='absolute top-0 left-0 object-cover w-full h-full -z-10' 
          priority 
        />
        <div className='flex flex-col gap-3'>
          <div className='sect'></div>
          <div className='flex flex-col gap-4 z-30 max-w-lg md:max-w-xl'>
            <h2 className='lg:text-[47px] md:text-[45px] text-[40px] leading-12 font-bold'>{currentSlide.title}</h2>
            <p className='text-[1.2rem] md:text-[1.4rem] lg:text-lg'>{currentSlide.text}</p>
          </div>
          <Link href='/register' className='w-fit'>
            <button className='z-20 btn flex items-center gap-1.5 font-semibold px-8 py-3 md:py-4 md:px-12 lg:px-8 w-fit'>
              GET STARTED <FaArrowRight/>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;