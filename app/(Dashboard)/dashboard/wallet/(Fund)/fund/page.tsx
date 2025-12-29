import React from 'react'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa6'

const page = () => {
  return (
    <section className='p-4'>
      <Link href='/dashboard/wallet'>
        <FaArrowLeft/>
      </Link>
      <div className='flex flex-col justify-center w-[70%]'>
      <p className='text-[20px]'>Fund your wallet for seamless healthcare payments</p>
      <div>
        <div>
          <h4>Paystack</h4>
          <form action="">
            <div>
              <label htmlFor="amount">
                Amount to fund
              </label>
              <input type="number" name='amount'  />
            </div>
            <input type="submit" value='Fund online' className='btn py-2 rounded-2xl w-full'/>
          </form>
        </div>
      </div>
      </div>
    </section>
  )
}

export default page