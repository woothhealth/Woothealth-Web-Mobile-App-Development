import React from 'react'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'

const benefit = [
  {
    desc: "Basic Laboratory Investigations/ X-Rays/ Ultrasounds",
  },
  {
    desc: "Accommodation and Admission",
  },
  {
    desc: "24/7 Telemedicine Consultation",
  },
  {
    desc: "Physiotherapy Sessions (Up to Approves Limits)",
  },
  {
    desc: "Access to 500+ Network Hospitals",
  },
  {
    desc: "Maternity Care up to N250,000",
  },
  {
    desc: "Prescribes Medicines & Drugs",
  },
  {
    desc: "Intensive Care Services",
  },
  {
    desc: "Emergency Room Care",
  }

]

const page = () => {
  return (
    <section className='flex gap-4'>
      <div className="bg-[#FFFFFF] px-6 rounded-[10px] py-3 w-full space-y-4">
        <h3 className='text-lg font-semibold'>Coverage Summary</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 md:gap-3 space-y-4'>
          {benefit.map((item, index) => (
            <div key={index} className='bg-[#F8F9FA] rounded-[10px] flex gap-2 md:p-2 px-2 py-3'>
              <IoMdCheckmarkCircleOutline className='text-lg text-[#10B981]'/>
              <p className='text-[14px]'>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default page