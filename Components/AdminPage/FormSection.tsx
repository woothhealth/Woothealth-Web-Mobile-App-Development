import React from 'react'
import Link from 'next/link'
import LoginForm from './LoginForm';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

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
    <section className='relative min-h-[90svh] lg:min-h-[85svh] mb-16'>
      <div className='relative flex flex-col items-center justify-center '>
        <div className='absolute top-0 bg-[#120052] h-40 px-8 w-full'></div>
        <div className='absolute formDiv overflow-y-scroll md-h-full top-15 bg-[#FFFFFF] rounded-3xl py-8 px-6 lg:px-16 w-[90%] lg:w-[40%]'>
          <LoginForm/>
        </div>
      </div>
    </section>
  )
}

export default FormSection