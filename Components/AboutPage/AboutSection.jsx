import React from 'react'
import { LuHeartPulse, LuScanEye } from 'react-icons/lu'

const goal = [
    {
        icon: <LuHeartPulse />,
        title: "Our Mission",
        desc: 'To redefine health insurance through technology, speed, amd trust-delivering healthcare solutions that fit the lives of everyday Nigerians.'
    },
    {
        icon: <LuScanEye/>,
        title: "Our Vision",
        desc: "A Nigeria where every individual, regardless of income or background, has equal access to reliable and life-saving healthcare"
    }
]

const AboutSection = () => {
  return (
    <section className='py-10 md:py-16 px-6 lg:px-[68px] md:px-10 flex flex-col md:gap-16 gap-10'>
        <div className='flex flex-col gap-3 lg:gap-6'>
            <h2 className='text-[2rem] md:text-4xl font-semibold md:text-center text-[#120052]'>About Woot Health</h2>
            <p className='text-lg leading-relaxed'>
                Woot Health is a technology-driven health management company that connects individuals and organizations to quality, affordable healthcare through affordable and thoughtfully crafted health plans, preventive health tips, and a network of verified healthcare providers. Woot Health is a forward-thinking health insurance company dedicated to transforming how people access and experience healthcare. Built on innovation, transparency, and empathy, the company provides simple, flexible, and value-driven health plans tailored to today’s dynamic lifestyles. Woot Health partners with leading hospitals, clinics, and healthcare providers to ensure members receive.
            </p>
        </div>

      <div className='flex flex-col md:flex-row gap-8 md:gap-14 w-[95%] md:w-full mx-auto'>
        {goal.map((item, index) => [
            <div key={index} className='flex flex-col items-center text-center bg-[#49A5EF] text-[#FFFFFF] gap-4 md:gap-6 pt-10 pb-12 px-6 lg:px-10 rounded-2xl flex-1'>
                <div className='text-7xl'>{item.icon}</div>
                <div className='flex flex-col gap-4 md:gap-8'>
                    <h3 className='text-[1.7rem] font-semibold'>{item.title}</h3>
                    <p className='text-lg leading-relaxed lg:w-100'>{item.desc}</p>
                </div>
            </div>
        ])}
      </div>
    </section>
  )
}

export default AboutSection