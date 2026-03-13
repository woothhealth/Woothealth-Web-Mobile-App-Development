import { Reveal } from '@/UI/Reveal'
import React from 'react'
import { LuHeadset } from 'react-icons/lu'
import { TbWorldPin } from 'react-icons/tb'

const features1 = [
    {
      img: "/icon_desktop.png",
      title: "Affordable Plans",
      description: "Quality healthcare shouldn't break the bank. Our flexible plans are designed to fit businesses of every size and budget, giving your team comprehensive coverage without the hefty price tag."
    },
    {
      icon: <TbWorldPin />,
      title: "Provider Networks",
      description: "Access to quality care, wherever you are. With Nigeria's most extensive provider network, your employees can choose from thousands of trusted hospitals and clinics across the country."
    }
]

const features2 = [
  {
    img: "/icon_wallet.png",
    title: "Telemedicine Access",
    description: "Healthcare on your schedule. Your team can consult with doctor from anywhere, anytime, perfect for busy schedules and remote work."
  },
  {
      icon: <LuHeadset />,
      title: "24/7 Support",
      description: "Questions don't wait for business hours, and neither do we. Our dedicated support team is available around the clock to help you and your employees whenever you need us."
    }
]

const WhySection = () => {
  return (
    <section className='lg:px-36 md:px-10 px-8 py-10 flex flex-col justify-center items-center lg:gap-8 gap-6'>
      <Reveal>
        <h3 className='text-[#120052] text-[38px] md:text-[45px]'>Why Choose Us</h3>
      </Reveal>
        <div className='flex lg:flex-row flex-col items-center md:divide-x-2 divide-[#B6B6B9] w-full lg:h-svh lg:px-12'>
          <div className='flex justify-center items-center md:justify-end flex-col md:divide-y-2 divide-[#B6B6B9] h-full md:pr-10'>
            {features1.map((feature, index) => (
              <Reveal key={index}>
              <div className='flex flex-col gap-2 md:pl-15 py-4'>
                <div className='flex lg:justify-center mb-2'>
                  {feature.icon ? (
                    <div className='text-6xl text-[#49A5EF]'>
                      {feature.icon}
                    </div>
                  ) : (
                    <img src={feature.img} alt={feature.title} style={{ width: 45, height: 45 }} />
                  )}
                </div>
                <h3 className='text-[20px] font-semibold'>{feature.title}</h3>
                <p className='text-justify'>{feature.description}</p>
              </div>
              </Reveal>
            ))}
          </div>
          <div className='flex flex-col justify-start md:divide-y-2 divide-[#B6B6B9] h-full md:pl-10'>
            {features2.map((feat, index) => (
              <Reveal key={index}>
              <div className='flex flex-col gap-2 md:pl-10 md:pr-5 py-5'>
                <div className='flex lg:justify-center mb-2'>
                  {feat.icon ? (
                    <div className='text-6xl text-[#49A5EF]'>
                      {feat.icon}
                    </div>
                  ) : (
                    <img src={feat.img} alt={feat.title} style={{ width: 45, height: 45 }} />
                  )}
                </div>
                <h3 className='text-[20px] font-semibold'>{feat.title}</h3>
                <p className='text-justify'>{feat.description}</p>
              </div>
              </Reveal>
            ))}
          </div>

        </div>
    </section>
  )
}

export default WhySection