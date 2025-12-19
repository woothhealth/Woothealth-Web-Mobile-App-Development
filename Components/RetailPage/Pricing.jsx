import Link from 'next/link'
import { features } from 'process'
import React from 'react'
import { FaCheck } from 'react-icons/fa6'

const pricingplans = [
    {
        id: 1,
        name: "Starter",
        price: "5,000",
        features: [
            "Clinic & GP consultations",
            "Telemedicine access",
            "Basic Medications",
            "Limited diagnostics"
        ]
    },
    {
        id: 2,
        name: "Essential",
        price: "15,000",
        features: [
            "Everything in Starter",
            "Specialist consultation",
            "Expanded diagnostics",
            "Emergency care"
        ]
    },
    {
        id: 3,
        name: "Premium",
        price: "30,000",
        features: [
            "Full coverage",
            "Surgery & advanced procedures",
            "Mental health therapy",
            "Maternity support"
        ]
    }
]
const Pricing = () => {
  return (
    <section className='py-6md:py-10 flex flex-col items-center justify-center text-center gap-6' id='pricing'>
        <div className='text-[#120052] px-6'>
            <h2 className='text-[32px] md:text-[42px] font-semibold mb-2'>
                Simple pricing for every lifestyle
            </h2>
            <p className='md:text-[22px] text-[18px]'>Choose a plan that works for you. No hidden fees, ever.</p>
        </div>
        <div className='px-6 lg:px-20 py-10 lg:py-18 w-full bg-[#49A5EF] flex flex-col gap-8'>
            <div className='grid lg:grid-cols-3 overflow-x-auto max-w-full md:grid-cols-2 grid-cols-1 gap-8'>
                {pricingplans.map((plan) => (
                    <div key={plan.id} className='bg-[#FFFFFF] rounded-3xl text-[#000000] shadow-lg py-8 px-6 flex flex-col gap-6 h-full'>
                        <div className='flex flex-col items-start'>
                            <h3 className='text-[24px] font-semibold mb-3 text-[#120052]'>{plan.name} Plan</h3>
                            <p className='mb-6 text-[#120052] border-b pb-3 text-start w-full'>For as low as <span className='font-bold text-[20px]'> ₦{plan.price}</span>/ month</p>
                            <ul className='mb-6 text-left'>
                                {plan.features.map((feature, index) => (
                                    <li key={index} className='mb-2 flex items-center gap-4 text-[#120052]'>
                                        <span className='text-[#FFFFFF] text-[9px] p-px inline-flex rounded-full bg-[#B6B6B9] font-bold'><FaCheck/></span>
                                     {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Link href="/register" className='mx-auto'>
                            <button className='bg-[#49A5EF] text-white px-8 py-3 rounded-full w-fit'>
                                Choose {plan.name}
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
            <div className='grid md:grid-cols-2 grid-cols-1 text-start bg-[#FFFFFF] px-6 py-5 gap-6 lg:gap-0 rounded-3xl items-center'>
                <div className='flex flex-col gap-3'>
                    <h2 className='text-xl font-semibold'>Need something custom?</h2>
                    <p>We design plans for SMEs, teams, and organizations</p>
                </div>
                <Link href="/contact" className='flex justify-center lg:justify-end'>
                    <button className='btn text-white px-10 font-semibold py-3 w-fit'>
                        Contact Us
                    </button>
                </Link>
            </div>
        </div>
    </section>
  )
}

export default Pricing