import { Reveal } from '@/UI/Reveal';
import React from 'react'
import { FaHandHoldingMedical,FaSuitcaseMedical } from 'react-icons/fa6';
import { LuHeadset } from 'react-icons/lu';

const BenefitSection = () => {

    const benefits = [
        {
            icon: <FaSuitcaseMedical/>,
            title: 'Comprehensive Health Plans',
            text: 'Our health plans offer healthcare services leveraging our partnership with world-class healthcare facilities.'
        },
        {
            icon: <FaHandHoldingMedical/>,
            title: 'Fast Claims Processing',
            text: `Your claims approved in days not weeks, because you shouldn't have to wait for what's yours.` 
        },
        {
            icon: <LuHeadset/>,
            title: '24/7 Customer Service Solutions',
            text: 'We believe healthcare services should be instant, the reason behind having a contact centre that is well equipped to support the management of all healthcare needs.'
        }
    ]
  return (
    <section className='py-8 lg:px-[68px] md:px-10 px-6'>
        <Reveal>
        <div className='flex flex-col gap-4'>
            <h2 className='md:text-[14px] text-[15px] font-medium uppercase text-[#49A5EF]'>
                Our Health Plan Benefit
            </h2>
            <p className='text-[#120052] text-[40px] font-semibold leading-tight'>
                The benefits we offer you
            </p>
            <p className='md:max-w-sm leading-tight text-[17px] md:text-[16px] text-justify'>
                Quality care shouldn&lsquo;t break the bank. Our affordable plans give you peace of mind and easy access to the care you deserve, with flexible payment options that fit your schedule.
            </p>
        </div>
        </Reveal>
        <div className='grid md:grid-cols-3 grid-cols-1 items-center mt-12 md:mt-8 gap-6'>
            {benefits.map((benefit, index) => {
                const isCentered = index === 1;
                
                return (
                    <Reveal key={index}>
                    <div className={`text-justify md:p-6 md:h-60 flex flex-col gap-1 ${isCentered ? 'md:border-x-2 border-[#B6B6B9]' : 'border-none'}`}>
                        <div className='bg-[#120052] md:w-[2.8rem] md:h-[2.8rem] h-14 w-14 md:text-xl text-2xl rounded-lg text-[#FFFFFF] flex items-center justify-center mb-3'>
                            {benefit.icon}
                        </div>
                        <h3 className='font-semibold md:text-lg text-xl'>{benefit.title}</h3>
                        <p className='text-[1rem] md:text-base'>{benefit.text}</p>
                    </div>
                    </Reveal>
                )
            })
            }
        </div>
    </section>
  )
}

export default BenefitSection