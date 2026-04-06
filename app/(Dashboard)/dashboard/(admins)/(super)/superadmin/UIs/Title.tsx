import React from 'react'

const Title = ({ title }: { title: string }) => {
  return (
    <div className='flex px-4'>
        <h2 className='text-[20px] md:text-[24px] font-semibold text-[#000000]'>{title}</h2>
    </div>
  )
}

export default Title