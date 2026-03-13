import Link from 'next/link'
import React from 'react'
import { FaUser } from 'react-icons/fa6'
import { IoIosArrowForward } from 'react-icons/io'

const admini = [
    {
        name: "Oluwaseun Adeyemi",
        role: "HR Director",
        mail: "seunadeyemi@user.com",
        access: 'Full Access'
    },
    {
        name: "Oluwaseun Adeyemi",
        role: "Benefits Manager",
        mail: "seunadeyemi@user.com",
        access: 'Manage Employees'
    },
    {
        name: "Oluwaseun Adeyemi",
        role: "Finance Manager",
        mail: "seunadeyemi@user.com",
        access: 'View & Pay Bills'
    }
]
const page = () => {
  return (
    <section className='md:w-[60%] md:px-4 pb-6'>
        <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-semibold'>Account Administrators</h3>
            <Link href="/dashboard/business/profile/administrators/add" className="text-[#49A5EF] text-sm">Add New</Link>
        </div>
        <div className='space-y-4'>
            {admini.map((item, index) => (
                <div key={index} className='flex justify-between border items-center border-[#D9D9D9] rounded-[10px] p-2'>
                    <div className='flex gap-3'>
                    <div className='bg-[#49A5EF1A] text-[#49A5EF] rounded-full w-10 h-10 flex items-center justify-center'>
                        <FaUser/>
                    </div>
                    <div>
                        <h3 className='font-semibold text-lg'>{item.name}</h3>
                        <p className='text-base'>{item.role}</p>
                        <p className='text-[0.9rem]'>{item.mail}</p>
                        <p className='text-[#49A5EF] text-xs'>{item.access}</p>
                    </div>
                    </div>
                    <div>
                        <IoIosArrowForward className='text-2xl text-gray-400'/>
                    </div>
                </div>
            ))}
        </div>
    </section>
  )
}

export default page