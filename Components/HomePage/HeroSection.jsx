import React from 'react'
import { FaTools } from 'react-icons/fa'
import { FaBoxesPacking } from 'react-icons/fa6'

const HeroSection = () => {

  const Carousel = [
    {
      image: '../public/Hero_1.png',
      text: 'Welcome to our website'
    },
    {
      image: '../public/Hero_1.png',
      text: 'Discover our features'
    },
    {
      image: '../public/Hero_1.png',
      text: 'Join our community'
    }
  ]

  return (
    <section className='sect flex items-center justify-center text-[#ededed]'>
        <div className='flex flex-col z-10 gap-4 items-center w-180'>
          <FaTools className='text-yellow-400 h-40 w-auto'/>
          <h2 className='font-extrabold text-4xl'>PAGE UNDER CONSTRUCTION</h2>
          <p className='text-xl font-bold text-center'>This is page is currently under production. Please do well to folllow our socials as we await</p>

        </div>
    </section>
  )
}

export default HeroSection