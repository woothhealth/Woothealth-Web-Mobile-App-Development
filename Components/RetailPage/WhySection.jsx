import React from 'react'
import { LuHeadset } from 'react-icons/lu'
import { TbWorldPin } from 'react-icons/tb'

const features = [
    {
      img: "/icon_desktop.png",
      title: "Affordable Plans",
      description: "Our health plans bring together the products that give you the power to achieve good health."
    },
    {
      icon: <TbWorldPin />,
      title: "Provider Networks",
      description: "Whether you have a general enquiry or need to make a claim we will ensure that you are directed to the department that can help."
    },
    {
      icon: <LuHeadset />,
      title: "24/7 Support",
      description: "Questions don't wait for business hours, and neither do we. Our dedicated support team is available around the clock to help you and your employees whenever you need us."
    }
]

const WhySection = () => {
  return (
    <section className='lg:px-[68px] md:px-10 px-6 py-20'>
        <div className='grid md:grid-cols-3 grid-cols-1 mx-0 md:mx-6 text-center gap-10 md:px-16'>
            {features.map((feature, index) => {
                const isFeatured = index === 1;
                return (
                    <div key={index} className={`border rounded-2xl pt-8 pb-10 px-6 w-fit flex flex-col gap-4 ${isFeatured ? 'md:scale-110' : 'md:scale-100'}`}>
                        <div className='flex justify-center'>
                        {feature.icon ? (
                            <div className='text-6xl text-[#49A5EF]'>
                                {feature.icon}
                            </div>
                            ) : (
                            <img src={feature.img} alt={feature.title} style={{ width: 45, height: 45 }} />
                        )}
                        </div>
                        <h3 className='text-[20px] font-semibold'>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                )
            }
            )}
        </div>
    </section>
  )
}

export default WhySection