import React from 'react'
import { FaArrowRight } from 'react-icons/fa6'

const AboutSection = () => {
  return (
    <section className='py-8'>
        <div className='about flex justify-center items-center'>
            <div className='glassy md:h-[80%] h-[90%] md:w-[80%] w-[90%] flex flex-col items-center justify-center gap-2 md:gap-4 text-center'>
                <h3 className='text-2xl font-semibold'>Committed to Making Quality Healthcare Accessible to Every Nigerian</h3>
                <p className='max-w-2xl'>At Woot Health, we're more than an insurance provider—we're your partner in wellness, dedicated to protecting what matters most</p>
                <button className='btn py-3 px-14 flex items-center gap-1.5 font-semibold'>
                    ABOUT US <FaArrowRight/>
                </button>
            </div>
        </div>
    </section>
  )
}

export default AboutSection