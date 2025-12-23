import React from 'react'
import { FaArrowRight } from 'react-icons/fa6'
import Image from 'next/image'
import Link from 'next/link'

const AboutSection = () => {
  return (
    <section className='py-8'>
        <div className='relative flex justify-center items-center h-[50svh]'>
          <Image src='/HomeAbout.png' width={500} height={100} alt='picture' className='absolute top-0 left-0 w-full h-full' loading='lazy' />
            <div className='bg-[#FFFFFF]/50 md:h-[80%] h-[90%] md:w-[80%] w-[90%] flex flex-col items-center justify-center gap-2 md:gap-4 text-center z-20'>
                <h3 className='text-2xl font-semibold'>Committed to Making Quality Healthcare Accessible to Every Nigerian</h3>
                <p className='max-w-2xl'>At Woot Health, we are more than an insurance provider, we are your partner in wellness, dedicated to protecting what matters most</p>
                <Link href='/about' className='w-fit'>
                  <button className='btn py-2 px-10 md:py-3 md:px-14 flex items-center gap-1.5 font-semibold'>
                      ABOUT US <FaArrowRight/>
                  </button>
                </Link>
            </div>
        </div>
    </section>
  )
}

export default AboutSection