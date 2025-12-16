import React from 'react'
import Image from 'next/image'

const ContactHero = () => {
  return (
    <section className='flex items-center justify-center relative h-[35svh] text-center px-16 md:px-0'>
      <Image src='/ContactBg.png' alt='Background' width={500} height={100} className='absolute h-full w-full object-cover'/>
      <div className='absolute h-full w-full bg-black/50'></div>
      <div className='flex flex-col gap-1 items-center z-20 text-[#ffffff]'>
        <h2 className='text-[45px] font-semibold'>Contact Us</h2>
        <p className='md:text-[1.1rem] text-[0.9rem]'>Let's connect. Tell us what you need and we'll make sure you get the support you deserve.</p>
      </div>
    </section>
  )
}

export default ContactHero