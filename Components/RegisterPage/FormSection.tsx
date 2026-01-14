import React from 'react'
import RegisterForm from './RegisterForm';

const FormSection = () => {
  return (
    <section className='relative min-h-screen mb-16'>
      <div className='relative flex flex-col items-center justify-center '>
        <div className='absolute top-0 bg-[#120052] py-14 px-8 w-full'></div>
        <div className='absolute formDiv overflow-y-scroll h-screen md-h-full top-0 bg-[#FFFFFF] rounded-3xl py-10 px-8 lg:px-16 w-[90%] lg:w-[70%]'>
          <div className='flex flex-col gap-2 '>
            <RegisterForm/>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FormSection