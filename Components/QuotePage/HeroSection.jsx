import React from 'react'

const HeroSection = () => {
  return (
    <section className='bg-[#120052] text-[#FFFFFF] py-16 lg:px-[68px] md:px-10 px-6'>
        {/* Hero section */}
        <div className='flex items-center justify-center text-center'>
            <div className='flex flex-col gap-6 px-6'>
                <h2 className='font-bold text-5xl'>Request a Quote</h2>
                <p className='text-xl w-xl'>Get in touch with our team today and see how Woot Health can transform your employee benefits</p>
            </div>
        </div>
    </section>
  )
}

export default HeroSection