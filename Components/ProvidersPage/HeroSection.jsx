import { Reveal } from '@/UI/Reveal'
import React from 'react'

const HeroSection = () => {
  return (
    <section className='flex items-center flex-col py-8 text-[#120052] text-center space-y-2 px-4'>
      <Reveal>
      <h2 className='text-3xl md:text-[40px] font-bold'>Find Quality Healthcare Near You</h2>
      </Reveal>
      <Reveal>
      <p className='md:w-220 md:text-lg'>Search thousands of trusted hospitals, Pharmacy, Dental Clinics, Diagnostic Centers and Wellness &Therapy Facilities across Nigeria.</p>
      </Reveal>
    </section>
  )
}

export default HeroSection