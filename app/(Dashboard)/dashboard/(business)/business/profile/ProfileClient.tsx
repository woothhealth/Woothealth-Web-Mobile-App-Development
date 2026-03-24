'use client'

import React from 'react'
import { LuPencilLine } from 'react-icons/lu'
import ProfileEditor from './ProfileEditor'

interface ProfileData {
  companyName: string
  companyAddress: string
  regNumber: string
  email: string
  phone: string
  status: string
  userId: string
  role: string
  plan: string
  industry: string
}

const ProfileClient: React.FC<{ profileData: ProfileData }> = ({ profileData }) => {
  const information = [
    {
      title: 'Industry',
      sub: profileData.industry || 'Not specified'
    },
    {
      title: 'Email',
      sub: profileData.email || 'Not provided'
    },
    {
      title: 'Phone Number',
      sub: profileData.phone || 'Not provided'
    },
    {
      title: 'Business Address',
      sub: profileData.companyAddress || 'Not Provided'
    },
    {
      title: 'Registration Number',
      sub: profileData.regNumber || 'Not Provided'
    }
  ]

  return (
    <section className='py-6 px-6 md:p-8 bg-[#FFFFFF] rounded-[10px] md:w-[50%] space-y-8'>
      <div className='flex items-center justify-between'>
        <div className='flex space-x-2 lg:space-x-4 items-center flex-1 lg:w-fit'>
          <div className='md:p-11 p-8 h-fit rounded-full inline-flex bg-amber-200'></div>
          <div className=''>
            <h3 className='text-[18px] md:text-[20px] font-semibold'>
              {profileData.companyName || 'User Profile'}
            </h3>
            <p className='text-[14px] md:text-[18px]'>{profileData.plan || 'No Plan'}</p>
            <p className='text-[14px] md:text-[16px]'>ID: {profileData.userId || 'N/A'}</p>
          </div>
        </div>
        <ProfileEditor profileData={profileData} />
      </div>
      <div className='flex flex-col gap-y-4'>
        <h3 className='text-[20px] font-semibold'>Company Information</h3>
        <div className=''>
          {information.map((item, index) => {
            const first = index === 0
            return (
              <div
                key={index}
                className={`grid grid-cols-2 py-3 px-2 md:py-4 border-b text-[16px] gap-2 border-[#D9D9D9] ${
                  first ? 'border-t border-[#D9D9D9]' : ''
                }`}
              >
                <h3 className='font-semibold'>{item.title}</h3>
                <p>{item.sub}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ProfileClient
