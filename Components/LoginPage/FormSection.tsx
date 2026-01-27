import React from 'react'
import Link from 'next/link'
import LoginForm from './LoginForm';

const FormSection: React.FC = () => {
  return (
    <section className='relative min-h-[90svh] lg:min-h-[85svh] mb-16'>
      <div className='relative flex flex-col items-center justify-center '>
        <div className='absolute top-0 bg-[#120052] py-14 px-8 w-full'></div>
        <div className='absolute formDiv overflow-y-scroll md-h-full top-0 bg-[#FFFFFF] rounded-3xl py-8 px-6 lg:px-16 w-[90%] lg:w-[70%]'>
              <LoginForm/>
                <div className='text-center mt-6'>
                  <p className='text-base md:text-lg'>Don't have an account? { " "}
                    <Link href={`/register`} className='text-[#49A5EF] underline'>Sign Up</Link>
                  </p>
                </div>
            </div>
        </div>
    </section>
  )
}

export default FormSection