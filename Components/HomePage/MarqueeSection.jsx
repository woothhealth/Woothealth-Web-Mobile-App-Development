'use client'

import Image from 'next/image'
import React from 'react'
import { motion } from 'motion/react'

const img = [
    '/Comp1.png',
    '/Comp2.png',
    '/Comp3.png',
    '/Comp4.png',
    '/Comp5.png'
]

const MarqueeSection = () => {
  return (
    <section className='py-2 lg:px-[78px] md:px-10 px-6 text-[#FFFFFF] overflow-hidden'>
        {/* <motion.div className='flex w-full gap-4'
        animate={{x: ['-50%', '0%']}}
        transition= {{ease: 'linear', duration: 10, repeat: Number.POSITIVE_INFINITY}}
        > */}
        <marquee behavior="" direction="right">
            <div className="flex gap-4">
            {img.map((item, index) => (
                <div key={index} className='flex items-center'>
                    <Image alt='Images' width={500} height={200} className='h-26 w-fit' src={item}/>
                </div>
            ))}
            </div>
        </marquee>
        {/* </motion.div> */}
    </section>
  )
}

export default MarqueeSection