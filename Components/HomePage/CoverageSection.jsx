import React from 'react'
import Img from 'next/image'

const CoverageSection = () => {
    const coverageImages = [
        '/Coverage_1.png',
        '/Coverage_2.png',
        '/Coverage_3.png'
    ];
  return (
    <section className='flex flex-col items-center justify-center pt-16 pb-8 px-[68px]'>
        <div className='flex flex-col items-center text-center w-full'>
            <h2 className='text-[35px] max-w-3xl font-medium text-[#49A5EF] leading-tight'>
                Comprehensive coverage. Transparent pricing. Exceptional care — all in one place.
            </h2>
            <div className='flex gap-10 flex-col md:flex-row mt-10 w-full items-center justify-center'>
                {coverageImages.map((src, index) => {
                     const isFeatured = index === 1;
                     return (
                        <div key={index} className={`my-5 ${isFeatured ? 'md:scale-110' : ''}`}>
                            <Img src={src} alt={`Coverage ${index + 1}`} width={100} height={100} className=' w-auto h-80 object-contain' loading='lazy' />
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