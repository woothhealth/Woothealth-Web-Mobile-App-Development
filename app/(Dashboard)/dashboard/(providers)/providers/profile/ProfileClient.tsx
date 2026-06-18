'use client'

import React from 'react'
// import ProfileEditor from './ProfileEditor'

interface ProfileData {
  name: string;
  email: string;
  address: string;
  type: string;
  remark: string;
  status: string;
  userId: string;
}

const ProfileClient: React.FC<{ profileData: ProfileData }> = ({ profileData }) => {
  const information = [
    {
      title: 'Email',
      sub: (() => {
        const raw = profileData.email
        if (!raw) return 'Not provided'
        // If it's already an array, show each on its own line
        if (Array.isArray(raw) && raw.length > 0) {
          return (
            <div className="flex flex-col gap-1">
              {raw.map((e, i) => <span key={i} className="wrap-break-word">{e}</span>)}
            </div>
          )
        }
        // try to extract email addresses from a string
        const str = String(raw)
        const emailMatches = str.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi) || []
        if (emailMatches.length > 1) {
          return (
            <div className="flex flex-col gap-1">
              {emailMatches.map((e, i) => <span key={i} className="wrap-break-word">{e}</span>)}
            </div>
          )
        }
        // single email or plain string
        return str || 'Not provided'
      })()
    },
    {
      title: 'Address',
      sub: profileData.address || 'Not provided'
    },
    {
      title: 'Type',
      sub: profileData.type || 'Not specified'
    },
    {
      title: 'Remark',
      sub: profileData.remark || 'No remarks'
    },
    {
      title: 'Status',
      sub: profileData.status || 'Unknown'}
  ]

  return (
    <section className='py-6 px-6 md:p-8 bg-[#FFFFFF] rounded-[10px] md:w-[60%] space-y-8'>
      <div className='flex items-center justify-between'>
        <div className='flex space-x-2 lg:space-x-4 items-center flex-1 lg:w-fit'>
          <div className='h-22 w-22 rounded-full flex items-center justify-center bg-primary/60'>
            <p className='text-white text-[24px] md:text-[34px] font-bold'>
              {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
            </p>
          </div>
          <div className=''>
            <h3 className='text-[18px] md:text-[20px] font-semibold'>
              {profileData.name || 'User Profile'}
            </h3>
            <p className='text-[14px] md:text-[18px]'>{profileData.status || 'Inactive'}</p>
            <p className='text-[14px] md:text-[16px]'>ID: {profileData.userId || 'N/A'}</p>
          </div>
        </div>
        {/* <ProfileEditor profileData={profileData} /> */}
      </div>
      <div className='flex flex-col gap-y-4'>
        <h3 className='text-[20px] font-semibold'>User Information</h3>
          <div className=''>
            {information.map((item, index) => {
              const first = index === 0
              return (
                <div
                  key={index}
                  className={`grid md:grid-cols-2 py-3 px-2 md:py-4 border-b text-[16px] wrap-break-word gap-2 border-[#D9D9D9] ${
                    first ? 'border-t border-[#D9D9D9]' : ''
                  }`}
                >
                  <h3 className='font-semibold'>{item.title}</h3>
                  <div className=''>{item.sub}</div>
                </div>
              )
            })}
          </div>
      </div>
    </section>
  )
}

export default ProfileClient
