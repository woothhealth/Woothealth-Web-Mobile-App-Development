import React from 'react'
import Link from 'next/link'

const page = () => {
  return (
    <section className='p-4'>
      <Link href='/dashboard/wallet' className='border p-1 rounded-full inline-flex'>
        <FaArrowLeft className='text-2xl'/>
      </Link>
    </section>
  )
}

export default page