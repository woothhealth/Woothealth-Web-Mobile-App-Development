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
    <div className="overflow-hidden w-full">
      <motion.div
        className="flex w-max"
        animate={{ x: ['-50%', '0%'] }}
        transition={{ 
          ease: 'linear', 
          duration: 10, 
          repeat: Infinity 
        }}
      >
        {/* Original content */}
        <div className="flex gap-1 md:gap-4">
          {img.map((item, index) => (
            <div key={index} className="flex items-center">
              <Image
                alt="Images"
                width={500}
                height={200}
                className="h-16 md:h-26 w-full md:w-fit"
                src={item}
              />
            </div>
          ))}
        </div>

        {/* Duplicate content for smooth looping */}
        <div className="flex gap-1 md:gap-4">
          {img.map((item, index) => (
            <div key={`dup-${index}`} className="flex items-center">
              <Image
                alt="Images"
                width={500}
                height={200}
                className="h-16 md:h-26 w-full md:w-fit"
                src={item}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
    </section>
  )
}

export default MarqueeSection