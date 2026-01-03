import React from 'react'
import Image from 'next/image'
import { Reveal } from '@/UI/Reveal'

const AdvantageSection = () => {
  return (
    <section className='py-14 lg:px-[68px] md:px-10 px-6 bg-[#49A5EF] text-[#FFFFFF] flex flex-col items-center justify-center md:text-center'>
        <Reveal>
        <h3 className='md:text-4xl text-[36px] leading-10 font-bold text-center'>The Woot Health Advantage</h3>
        </Reveal>
            <div className='flex flex-col gap-20 md:mt-16 mt-10'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0'>
                    <Reveal>
                    <div className='hidden md:flex'>
                        <Image width={500}height={100} src='/WH_1.png' alt={`Woot's advantage`} className='object-contain w-fit h-[450px]' priority />
                    </div>
                    </Reveal>
                    <div className='md:text-justify'>
                        <Reveal>
                        <h4 className='md:text-[28px] text-[26px] font-semibold md:mb-4 mb-2'>Beyond basic coverage</h4>
                        </Reveal>
                        <Reveal>
                        <p className='md:text-[20px] text-[16px]'>We don&apos;t just meet expectations, we exceed them. With innovative tools, personalized support, and a commitment to your team&apos;s total wellness, Woot Health delivers healthcare that goes further.</p>
                        </Reveal>
                        <Reveal>
                        <p className='text-[16px] md:text-[20px] mt-2'>Every business gets a dedicated account manager and access to our 24/7 support team. Real people, real solutions, whenever you need us.</p>
                        </Reveal>
                    </div>
                    <Reveal>
                    <div className='md:hidden block'>
                        <Image width={500}height={100} src='/WH_1.png' alt={`Woot's advantage`} className='object-contain w-fit md:h-[450px]' priority />
                    </div>
                    </Reveal>
                </div>
                <div className='grid md:grid-cols-2 grid-cols-1 gap-8 md:gap-0'>
                    <div className='md:text-justify'>
                        <Reveal>
                        <h4 className='md:text-[28px] text-[26px] font-semibold md:mb-4 mb-2'>Healthcare That Works Harder</h4>
                        </Reveal>
                        <Reveal>
                        <p className='md:text-[20px] text-[16px]'>Standard plans give you coverage. We give you peace of mind. From 24/7 support to cutting-edge telemedicine, we&apos;re redefining what employee health benefits should be.</p>
                        </Reveal>
                        <Reveal>
                        <p className='md:text-[20px] text-[16px] mt-2'>When you choose Woot Health you gain more than an insurance provider, you gain a partner who understands Nigerian businesses. We know your challenges, we speak your language, and we&apos;re committed to making healthcare accessible, affordable, and stress-free for companies like yours. Your success is our mission.</p>
                        </Reveal>
                    </div>
                    <Reveal>
                    <div className='flex items-center justify-end'>
                        <Image width={500}height={100} src='/WH_3.png' alt={`Woot's advantage`} className='object-contain w-fit md:h-[450px]' priority />
                    </div>
                    </Reveal>
                </div>
            </div>
    </section>
  )
}

export default AdvantageSection