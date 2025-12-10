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
            text: `Your claims approved in days, not weeks — because you shouldn't have to wait for what's yours.` 
        },
        {
            icon: <LuHeadset/>,
            title: '24/7 Customer Service Solutions',
            text: 'We believe healthcare services should be instant, the reason behind having a contact centre that is well equipped to support the management of all healthcare needs.'
        }
    ]
  return (
    <section className='px-[68px] py-8'>
        <div className='flex flex-col gap-4'>
            <h2 className='text-[14px] font-medium uppercase text-[#49A5EF]'>Our Health Plan Benefit</h2>
            <p className='text-[#120052] text-[40px] font-medium leading-tight'>
                The benefits we offer you
            </p>
            <p className='max-w-sm leading-tight text-[16px]'>
                Quality care shouldn't break the bank. Our affordable plans give you peace of mind and easy access to the care you deserve, with flexible payment options that fit your schedule.
            </p>
        </div>
        <div className='grid grid-cols-3 items-center mt-8'>
            {benefits.map((benefit, index) => {
                const isCentered = index === 1;
                
                return (
                    <div key={index} className={`text-justify p-6 h-56 flex flex-col gap-1 ${isCentered ? 'md:border-x-2 border-[#B6B6B9]' : 'border-none'}`}>
                        <div className='bg-[#120052] w-10 h-10 rounded-lg text-[#FFFFFF] flex items-center justify-center mb-3'>{benefit.icon}</div>
                        <h3 className='font-semibold text-lg '>{benefit.title}</h3>
                        <p>{benefit.text}</p>
                    </div>
                )
            })
            }
        </div>
    </section>
  )
}

export default BenefitSection