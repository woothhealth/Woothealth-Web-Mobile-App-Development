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
    <div className="bg-white rounded-xl p-1 md:p-4 flex justify-between items-center shadow gap-1">
      <div className="flex md:gap-4 gap-1">
        <Image src={doctor.avatar} alt="" width={56} height={56} className="rounded-full h-fit" />
        <div>
          <p className="font-semibold text-[0.85rem]">{doctor.name}</p>
          <p className="md:text-sm text-xs">{doctor.specialty}</p>
          <div className='mt-2'>
            <p className="md:text-sm text-xs">⭐ {doctor.rating} ({doctor.reviews})</p>
            <p className="md:text-sm text-xs"><CiLocationOn className='inline-flex mr-2'/> {doctor.location}</p>
          </div>
        </div>
      </div>
    <div className='flex flex-col items-end space-y-4'>
        <button
        onClick={() => setOpen(true)}
        className="btn md:px-4 px-2 py-1 text-[0.7rem] md:text-base rounded-lg">
            Book Session
        </button>
        <div className='flex space-x-4'>
            <Link href={`/`} className="md:px-3 p-2 bg-[#49A5EF] text-[#FFFFFF] md:py-2 rounded-lg md:text-base text-xs">
                <LuMessageSquare/>
            </Link>
            <Link href={`/`} className="md:px-3 p-2 bg-[#49A5EF] text-[#FFFFFF] md:py-2 rounded-lg md:text-base text-xs">
                <FaPhoneAlt/>
            </Link>
        </div>
    </div>

      {open && <BookingPanel doctor={doctor} onClose={() => setOpen(false)} />}
    </div>
  )
}
