import React from 'react'
import { LuPencilLine } from 'react-icons/lu'

const information = [
    {
        tite: 'First Name',
        sub: 'Quadri'
    },
    {
        tite: 'Last Name',
        sub: 'Adekunle'
    },
    {
        tite: 'Email',
        sub: 'adek@gmail.com'
    },
    {
        tite: 'Phone Number',
        sub: '08159059492'
    },
    {
        tite: 'Gender',
        sub: 'Male'
    },
    {
        tite: 'Date of Birth',
        sub: '24/04/1985'
    },
    {
        tite: 'Status',
        sub: 'Active'
    }
]

const page = () => {
  return (
    <section className='p-8 bg-[#FFFFFF] rounded-[10px] w-[45%] space-y-6'>
        <div className='flex space-x-4 items-center'>
            <div className='p-11 h-fit rounded-full inline-flex bg-amber-200'></div>
            <div className=''>
                <h3 className='text-[20px] font-semibold flex items-center gap-10'>Quadri Adekunle <span><LuPencilLine/></span></h3>
                <p className='text-[18px]'>Retail Quantun Plan</p>
                <p className='text-[18px]'>ID: 12006</p>
            </div>
        </div>
        <div className='flex flex-col gap-y-4'>
            <h3 className='text-[20px] font-semibold'>Personal Information</h3>
            <div className=''>
                {information.map((item, index) => {
                    const first = index === 0
                    return(<div key={index} className={`grid grid-cols-2 py-4 border-b text-[16px] border-[#D9D9D9] ${first ? 'border-t border-[#D9D9D9]' : ''}`}>
                        <h3 className='font-semibold'>{item.tite}</h3>
                        <p>{item.sub}</p>
                    </div>)
                })}
            </div>
        </div>
    </section>
  )
}

export default page