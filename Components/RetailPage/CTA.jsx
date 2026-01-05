import React from 'react'
import Image from 'next/image'
import { FaArrowRight } from 'react-icons/fa'

const CTA = () => {
  return (
    <section className='lg:px-[68px] md:px-10 px-6'>
        <div className='py-10 md:py-16 grid md:grid-cols-2 grid-cols-1 text-[#120052] gap-8 lg:gap-0 items-center'>
            <div className='flex flex-col gap-5'>
                <h3 className='md:text-[35px] text-3xl font-bold'>Take the first step toward protecting yourself and your loved ones.</h3>
                <p className='md:text-lg text-base'>Let us help you find the right plan today.</p>
                <button className='bg-[#49A5EF] text-[#FFFFFF] px-12 md:py-3.5 py-2.5 rounded-md text-[14px] md:text-base font-semibold w-fit'>
                    PURCHASE PLAN <FaArrowRight className='inline-block ml-2'/>
                </button>
            </div>
            <div className='flex md:justify-end justify-start'>
                <Image width={500} height={100} src='/WH_4.webp' alt='Woot Get Quote Image' className='object-contain w-fit h-fit md:h-[450px]' priority />
            </div>
        </div>
    </section>
  )
}

export default CTA