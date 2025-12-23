import React from 'react'
import { MdSpeed } from "react-icons/md";
import Link from 'next/link';
import { PiLightbulbFilamentBold, PiPersonArmsSpreadLight } from "react-icons/pi";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { RiShakeHandsLine } from "react-icons/ri";
import { FaArrowRight } from "react-icons/fa6";

const BenefitSection = () => {

    const benefits = [
        {
            icon: <PiPersonArmsSpreadLight/>,
            title: 'Accessibility',
            text: 'We make healthcare simple, affordable, and available to all.'
        },
        {
            icon: <MdSpeed/>,
            title: 'Speed',
            text: `We ensure claimsand services are deliverable quickly, without unnecessary delays.` 
        },
        {
            icon: <IoShieldCheckmarkOutline/>,
            title: 'Trust',
            text: 'We operate with transparency and honesty, earning the confidence of our members.'
        },
        {
            icon: <PiLightbulbFilamentBold/>,
            title: 'Innovation',
            text: 'Our health plans offer healthcare services leveraging our partnership with world-class healthcare facilities.'
        },
        {
            img: '/Core2.png',
            title: 'Community',
            text: `We built strong relationships with the people and businesses we serve.` 
        },
        {
            icon: <RiShakeHandsLine/>,
            title: 'Compassion',
            text: `We treat every customer as a person, not a policy number.` 
        }
    ]
  return (
    <section className='py-8 lg:px-[68px] md:px-10 px-6'>
        <h2 className='text-[#120052] text-[35px] lg:text-[40px] font-semibold leading-tight'>
            Our Core Values
        </h2>
        <div className='grid md:grid-cols-3 grid-cols-1 items-center lg:mt-12 mt-8 md:mt-8 space-x-4 space-y-6'>
            {benefits.map((benefit, index) => (
                <div key={index} className="text-justify md:p-6 md:h-52 flex flex-col gap-1">
                    <div className='bg-[#120052] md:w-[2.8rem] md:h-[2.8rem] h-14 w-14 text-2xl rounded-lg text-[#FFFFFF] flex items-center justify-center mb-3'>
                        {benefit.icon ? (
                            <div>
                                {benefit.icon}
                            </div>
                        ) : (
                            <img src={benefit.img} alt={benefit.title} style={{ width: 25, height: 25 }} />
                        )}
                    </div>
                    <h3 className='font-semibold md:text-lg text-xl'>{benefit.title}</h3>
                    <p className='text-[1rem] md:text-base'>{benefit.text}</p>
                </div>
            ))}
        </div>
        <div className="flex justify-end mt-10 md:mt-0">
            <Link href='/about/management' className='w-fit'>
                <button className="btn px-4 py-3">Our Management Team <FaArrowRight className="ml-1 inline-flex"/></button>
            </Link>
        </div>
    </section>
  )
}

export default BenefitSection