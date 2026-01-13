'use client'
import Image from 'next/image'
import { useState } from 'react'
import BookingPanel from './BookingPanel'
import { FaMapPin, FaPhoneAlt } from 'react-icons/fa'
import { FaMapLocation } from 'react-icons/fa6'
import { CiLocationOn } from 'react-icons/ci'
import { LuMessageSquare } from 'react-icons/lu'
import Link from 'next/link'

export default function DoctorCard({ doctor }: any) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl p-4 flex justify-between items-center shadow">
      <div className="flex gap-4">
        <Image src={doctor.avatar} alt="" width={56} height={56} className="rounded-full" />
        <div>
          <p className="font-semibold">{doctor.name}</p>
          <p className="text-sm ">{doctor.specialty}</p>
          <div className='mt-2'>
            <p className="text-sm">⭐ {doctor.rating} ({doctor.reviews})</p>
            <p className="text-sm "><CiLocationOn className='inline-flex mr-2'/> {doctor.location}</p>
          </div>
        </div>
      </div>
    <div className='flex flex-col items-end space-y-4'>
        <button
        onClick={() => setOpen(true)}
        className="btn px-4 py-1 rounded-lg"
        >
            Book Session
        </button>
        <div className='flex space-x-4'>
            <Link href={`/`} className="px-3 bg-[#49A5EF] text-[#FFFFFF] py-2 rounded-lg">
                <LuMessageSquare/>
            </Link>
            <Link href={`/`} className="px-3 bg-[#49A5EF] text-[#FFFFFF] py-2 rounded-lg">
                <FaPhoneAlt/>
            </Link>
        </div>
    </div>

      {open && <BookingPanel doctor={doctor} onClose={() => setOpen(false)} />}
    </div>
  )
}
