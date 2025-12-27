import React from 'react'
import { GoDotFill } from 'react-icons/go'
import { TbCurrencyNaira } from 'react-icons/tb'

const summary = [
  {
    id: 1,
    name: 'Blood Test Result',
    doc: 'Dr. Amaka Oknokwo',
    location: 'Lagos University Teaching Hospital',
    date: 'Dec. 7, 2025',
    tag: 'PDF',
    size: '2.3'
  },
  {
    id: 2,
    name: 'Chest X-Ray',
    doc: 'Dr. Chioma Nwosu',
    location: 'Radiology Center Lagos',
    date: 'Nove. 7, 2025',
    tag: 'JPG',
    size: '4.1'
  },
  {
    id: 1,
    name: 'Blood Test Result',
    doc: 'Dr. Amaka Oknokwo',
    location: 'Lagos University Teaching Hospital',
    date: 'Dec. 7, 2025',
    tag: 'PDF',
    size: '2.3'
  },
  {
    id: 2,
    name: 'Chest X-Ray',
    doc: 'Dr. Chioma Nwosu',
    location: 'Lagos University Teaching Hospital',
    date: 'Dec. 7, 2025',
    tag: 'PDF',
    size: '2.3'
  },

const page = () => {
  return (
    <section className='p-4 flex flex-col gap-3 bg-[#FFFFFF] rounded-2xl'>
      <h3 className='text-[20px]'>Claims Summary</h3>
      <div className='grid grid-cols-3 gap-5'>
        <div className='flex flex-col justify-center text-center bg-[#D1FAE5] rounded-[10px] py-4'>
          <p className='text-[#10B981] text-[20px]'>12</p>
          <p>Approved</p>
        </div>
        <div className='flex flex-col justify-center text-center bg-[#FEF3C7] rounded-[10px] py-4'>
          <p className='text-[#F59E0B] text-[20px]'>12</p>
          <p>Pending</p>
        </div>
        <div className='flex flex-col justify-center text-center bg-[#FEE2E2] rounded-[10px] py-4'>
          <p className='text-[#EF4444] text-[20px]'>12</p>
          <p>Failed</p>
        </div>
      </div>
      <div className='flex flex-col gap-2 h-80 overflow-x-auto formDiv'>
        {summary.map((item, index) => {
          const idNum = Number(item.id);
          const isFirst = idNum === 1;
          const isThird = idNum === 3;
          const tagClasses = isFirst ? 'bg-[#D1FAE5] text-[#10B981]' : isThird ? 'bg-[#FEE2E2] text-[#EF4444]' : 'bg-[#FEF3C7] text-[#F59E0B]';
          return (
            <div key={index} className='border border-[#D9D9D9] rounded-[10px] p-4 flex justify-between'>
              <div className='flex flex-col gap-1.5'>
                <p className='text-[16px]'>{item.name}</p>
                <div className='flex items-center text-sm text-[#00000080]'>
                  <p className=''>{item.type}</p>
                  <span><GoDotFill className='text-xs'/></span>
                  <p>{item.date}</p>
                </div>
                <p className='flex font-semibold'><TbCurrencyNaira className='text-2xl'/> {item.price}</p>
              </div>
              <div className={`py-2 px-3 text-xs h-fit rounded-lg ${tagClasses}`}>{item.tag}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default page