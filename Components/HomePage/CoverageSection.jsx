import React from 'react'
import Image from 'next/image'

const CoverageSection = () => {
    const coverageImages = [
        '/Coverage_1.png',
        '/Coverage_2.png',
        '/Coverage_3.png'
    ];
  return (
    <section className='flex flex-col items-center justify-center pt-16 pb-8 lg:px-[68px] md:px-10 px-6'>
        <div className='flex flex-col items-center text-center w-full'>
            <h2 className='text-[30px] md:text-[35px] max-w-3xl font-medium text-[#49A5EF] leading-tight'>
                Comprehensive coverage. Transparent pricing. Exceptional care — all in one place.
            </h2>
            <div className='flex md:gap-10 gap-8 flex-col md:flex-row mt-6 md:mt-10 w-full items-center justify-center'>
                {coverageImages.map((src, index) => {
                     const isFeatured = index === 1;
                     return (
                        <div key={index} className={`md:my-5 ${isFeatured ? 'md:scale-110' : 'md:scale-100'}`}>
                            <Image src={src} alt={`Coverage ${index + 1}`} width={100} height={100} className='w-auto md:h-80 h-[450px] object-cover rounded-br-2xl rounded-tl-2xl' loading='lazy' />
                        </div>
                     )
                }
                )}
            </div>
        </div>
    </section>
  )
}

export default CoverageSection