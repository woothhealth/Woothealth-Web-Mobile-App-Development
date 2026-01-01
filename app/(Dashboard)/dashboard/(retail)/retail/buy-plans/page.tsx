import React from 'react'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa6'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'

const pricingplans = [
    {
        id: 1,
        name: "Core",
        price: "6,200",
        features: [
            "GP Consultation",
            "Emergency care",
            "Telemedicine Consultation Covered",
            "Immunizations",
            "Optical Care",
            "Dental Care",
            "Antenatal Care"
        ]
    },
    {
        id: 2,
        name: "Sync",
        price: "9,500",
        features: [
            "GP Consultation",
            "Emergency care",
            "Telemedicine Consultation Covered",
            "Immunizations",
            "Optical Care",
            "Dental Care",
            "Antenatal Care"
        ]
    },
    {
        id: 3,
        name: "Nexus",
        price: "20,700",
        features: [
            "GP Consultation",
            "Emergency care",
            "Telemedicine Consultation Covered",
            "Immunizations",
            "Optical Care",
            "Dental Care",
            "Antenatal Care"
        ]
    },
    {
        id: 4,
        name: "Quantum",
        price: "539,400",
        features: [
            "GP Consultation",
            "Emergency care",
            "Telemedicine Consultation Covered",
            "Immunizations",
            "Optical Care",
            "Dental Care",
            "Antenatal Care",
            "Gym",
            "Spa"
        ]
    }
    ,
    {
        id: 5,
        name: "Iginite",
        price: "1,190,000",
        features: [
            "GP Consultation",
            "Emergency care",
            "Telemedicine Consultation Covered",
            "Immunizations",
            "Optical Care",
            "Dental Care",
            "Antenatal Care",
            "Gym",
            "Spa"
        ]
    }
]
const page = () => {
  return (
<section className='py-4 md:p-4'>
      <Link href='/dashboard/retail' className='border p-1 rounded-full inline-flex'>
        <FaArrowLeft className='text-2xl'/>
      </Link>
        <div className='py-10 md:w-full w-[90%] mx-auto md:mx-0 flex flex-col gap-8'>
            <div className='grid lg:grid-cols-3 max-w-full md:grid-cols-2 grid-cols-1 gap-8'>
                {pricingplans.map((plan) => (
                    <div key={plan.id} className='bg-[#FFFFFF] rounded-[10px] text-[#000000] shadow-lg flex flex-col gap-4 h-full pb-8'>
                          <div className='bg-[#49A5EFB2] rounded-t-[10px] text-[#FFFFFF] py-4 px-4'>
                            <h3 className='text-[24px] font-semibold mb-3'>Retail {plan.name}</h3>
                            <p className=' text-start w-full flex flex-col leading-7'><span className='font-bold text-[30px]'> ₦{plan.price}</span>per year</p>
                          </div>
                        <div className='flex flex-col items-start px-4 gap-2'>
                          <p className='text-lg font-semibold'>Benefits included:</p>
                            <ul className='mb-4 text-left ml-2'>
                                {plan.features.map((feature, index) => (
                                    <li key={index} className='mb-1 flex items-center gap-2 text-[#120052]'>
                                        <IoMdCheckmarkCircleOutline className='text-[#10B981]'/>
                                     {feature}
                                    </li>
                                ))}
                            </ul>
                        <Link href="/register" className='bg-[#49A5EF] text-white flex justify-center py-3 rounded-[5px] w-full font-semibold'>
                                Buy {plan.name}
                        </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default page