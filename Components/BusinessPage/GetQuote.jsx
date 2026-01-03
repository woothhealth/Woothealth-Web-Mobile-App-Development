'use client'

import React from 'react'
import Image from 'next/image'
import { FaArrowRight } from 'react-icons/fa'
import Link from 'next/link'
import { Reveal } from '@/UI/Reveal'
import { motion } from 'motion/react'

const GetQuote = () => {
  return (
    <section className='lg:px-[68px] md:px-10 px-6'>
        <div className='py-16 grid md:grid-cols-2 grid-cols-1 text-[#120052] gap-8 md:gap-0 items-center'>
            <div className='flex flex-col gap-4'>
                <Reveal>
                <h3 className='md:text-[35px] text-3xl font-bold'>Take the first step toward happier, healthier employees.</h3>
                </Reveal>
                <Reveal>
                <p className='md:text-lg text-base'>Tell us about your team and we&apos;ll show you the best options</p>
                </Reveal>
                <Link href='/quote' className="w-fit">
                <Reveal>
                <motion.button
                  whileTap={{scale: 0.95, transition: {delay: 0}}}
                    className='bg-[#49A5EF] text-[#FFFFFF] px-12 md:py-3.5 py-2.5 rounded-md font-semibold w-fit'>
                    Get a Quote <FaArrowRight className='inline-block ml-2'/>
                </motion.button>
                </Reveal>
                </Link>
            </div>
            <Reveal>
            <div className='flex justify-end'>
                <Image width={500} height={100} src='/WH_2.png' alt='Woot Get Quote Image' className='object-contain w-fit md:h-[450px]' priority />
            </div>
            </Reveal>
        </div>
    </section>
  )
}

export default GetQuote