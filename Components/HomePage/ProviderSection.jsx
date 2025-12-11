import React from 'react'
import Image from 'next/image'
import { FaArrowRight } from 'react-icons/fa6'

const ProviderSection = () => {
  return (
    <section className='py-8'>
        <div className='bg-[#49A5EF] flex flex-col items-center justify-center py-10 px-6 text-center text-[#FFFFFF] md:gap-6 gap-3'>
            <h3 className='md:text-[38px] text-[32px] font-semibold'>
                Find a provider near you
            </h3>
            <Image src='/Mapimg.png' width={500} height={100} alt='Provider Map' className='md:h-30 h-25 w-auto' priority />
            <p className='md:max-w-2xl text-[1rem] md:text-[1.1rem] mb-2'>
                Finding quality healthcare close to home shouldn't be a hassle. Woot Health gives you access to Nigeria's largest network of providers, so you can choose the care that's right for you and your loved ones.
            </p>
            <button className='bg-[#FFFFFF] py-3 px-10 text-[#120052] flex gap-1.5 items-center font-semibold'>
                FIND PROVIDER <FaArrowRight/>
            </button>
        </div>
    </section>
  )
}

export default ProviderSection