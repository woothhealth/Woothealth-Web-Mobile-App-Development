import React from 'react'

const HeroSection = () => {
  return (
    <section className='bg-[#120052] text-[#FFFFFF] pt-16 pb-8 lg:px-[68px] md:px-10 px-4'>
        {/* Hero section */}
        <div className='flex items-center justify-center text-center'>
            <div className='flex flex-col gap-4 px-6'>
                <h2 className='font-bold text-5xl'>Tell us about you</h2>
                <p className='text-base md:w-xl'>Get in touch with our team today and discover how Woot Health can transform your healthcare experience.</p>
            </div>
        </div>
    </section>
  )
}

export default HeroSection