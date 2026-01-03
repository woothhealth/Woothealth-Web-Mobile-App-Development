import { Reveal } from '@/UI/Reveal'
import React from 'react'

const HeroSection = () => {
  return (
    <section className='flex items-center flex-col py-8 text-[#120052] text-center space-y-2 px-4'>
      <Reveal>
      <h2 className='text-3xl md:text-[40px] font-bold'>The Woot Health Blog</h2>
      </Reveal>
      <Reveal>
      <p className='md:w-220 md:text-lg'>Stay informed with the latest health tips, wellness advice, and practical guides to help you live healthier and make the most of your coverage.</p>
      </Reveal>
    </section>
  )
}

export default HeroSection