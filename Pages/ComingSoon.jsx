import React from 'react'
import { FaTools } from 'react-icons/fa'

const ComingSoon = () => {

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
        <div className='flex flex-col text-center z-10 gap-4 items-center w-180'>
          <FaTools className='text-yellow-400 h-32 md:h-40 w-auto'/>
          <h2 className='font-extrabold text-3xl md:text-4xl'>PAGE UNDER CONSTRUCTION</h2>
          <p className='text-lg md:text-xl font-bold text-center'>This is page is currently under production. Please do well to folllow our socials as we await</p>

        </div>
    </section>
  )
}

export default ComingSoon