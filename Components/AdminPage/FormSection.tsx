import React from 'react'
import Link from 'next/link'
import LoginForm from './LoginForm';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import Image from 'next/image';

const FormSection: React.FC = async () => {
  const session = await getSession();

  if (session?.id && session?.role) {
    // Redirect based on role
    if (session.role === "superadmin") {
      redirect("/dashboard/superadmin");
    } else if (session.role === "admin") {
      redirect("/dashboard/superadmin");
    } else {
      redirect("/admin"); // fallback for unknown roles
    }
  }
  return (
    <section className='relative h-svh'>
      <div className='flex flex-col items-center justify-center bg-[#49A5EF] h-full space-y-3'>
        <div className='flex flex-col space-y-2 items-center'>
          <div className='bg-[#ffffff]/80 rounded-[15px] p-1 w-fit'>
            <Image src='/Dashboard_image.png' alt='Logo' width={200} height={100} className='h-10 w-fit' priority/>
          </div>
          <div className='text-center -space-y-1'>
            <h1 className='text-2xl font-bold text-white tracking-wider'>WOOTHEALTH</h1>
            <h3 className='italic text-sm text-[#ffffff]/80'>Health care simplified</h3>
          </div>
        </div>
        <div className='formDiv overflow-y-scroll md-h-full bg-[#FFFFFF] rounded-3xl py-8 px-6 w-[90%] lg:w-[30%]'>
          <LoginForm/>
        </div>
        <div className='text-[#ffffff]/80 text-sm text-center'>
          <p>This portal is restricted to Administrators only</p>
          <p className='text-[.8rem] tracking-wide'>&copy; {new Date().getFullYear()} | WootHealth | All rights reserved.</p>
        </div>
      </div>
    </section>
  )
}

export default FormSection