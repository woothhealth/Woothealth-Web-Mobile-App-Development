import React from 'react'
import { LuPencilLine } from 'react-icons/lu'
import { getCurrentUser } from '@/lib/currentUser'
import { redirect } from 'next/navigation'
import ProfileEditor from './ProfileEditor'
import { cookies } from 'next/headers'

const page = async () => {
  const user = await getCurrentUser()
  
  if (!user || !user.id) {
    redirect('/login')
  }

  // Fetch full user profile data
  let profileData: any = {
    email: user.email || '',
    phone: '',
    status: 'Active',
    userId: user.id,
    role: user.role || 'retail',
    plan: user.plan || 'No Plan found',
    company: user.company || 'WOOTHEALTH',
    companyAddress: user.companyAddress || '',
    regNumber: '',
    industry: user.industry ||'Healthcare',
  }

  try {
    // Build cookie header for server-side fetch
    const cookieStore = await cookies()
    const cookieHeader = (cookieStore.getAll?.() || [])
      .map((c) => `${c.name}=${c.value}`)
      .join('; ')

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/me`, {
      cache: 'no-store',
      headers: {
        cookie: cookieHeader,  // Send cookies with server-side fetch
      },
    })
    if (res.ok) {
      const data = await res.json()
      profileData = {
        companyName: data.company || user.company?.split(' ')[0] || 'User',
        companyAddress: data.companyAddress || user.companyAddress || 'Not Provided',
        regNumber: data.regNumber || '',
        email: data.email || user.email || '',
        phone: data.phone || '',
        status: data.availability === false ? 'Inactive' : 'Active',
        userId: data.userId || data.$id || user.id,
        role: data.role || user.role || 'retail',
        plan: data.plan || 'No Plan Found',
        industry: data.industry || user.industry || 'Healthcare',
      }
    }
  } catch (error) {
    console.error('Failed to fetch profile:', error)
  }

  const information = [
    {
        tite: 'Industry',
        sub: profileData.industry
    },
    {
        tite: 'Email',
        sub: profileData.email
    },
    {
        tite: 'Phone Number',
        sub: profileData.phone || 'Not provided'
    },
    {
        tite: 'Business Address',
        sub: profileData.companyAddress || 'Not Provided'
    },
    {
      tite: 'Registration Number',
      sub: profileData.regNumber || 'Not Provided'
    }
  ]
  return (
    <section className='py-6 px-0 md:p-8 bg-[#FFFFFF] rounded-[10px] md:w-[50%] space-y-6'>
        <div className='flex space-x-4 items-center justify-between'>
            <div className='flex space-x-2 lg:space-x-4 items-center flex-1 lg:w-fit'>
                <div className='md:p-11 p-8 h-fit rounded-full inline-flex bg-amber-200'></div>
                <div className=''>
                    <h3 className='text-[18px] md:text-[20px] font-semibold'>
                        {profileData.companyName || profileData.name || 'User Profile'}
                    </h3>
                    <p className='text-[12px] md:text-[18px]'>{profileData.plan}</p>
                    <p className='text-[12px] md:text-[16px]'>ID: {profileData.userId}</p>
                </div>
            </div>
            <ProfileEditor profileData={profileData} />
        </div>
        <div className='flex flex-col gap-y-4'>
            <h3 className='text-[20px] font-semibold'>Company Information</h3>
            <div className=''>
                {information.map((item, index) => {
                    const first = index === 0
                    return(<div key={index} className={`grid grid-cols-2 py-2 md:py-4 border-b text-[16px] border-[#D9D9D9] ${first ? 'border-t border-[#D9D9D9]' : ''}`}>
                        <h3 className='font-semibold'>{item.tite}</h3>
                        <p>{item.sub}</p>
                    </div>)
                })}
            </div>
        </div>
    </section>
  )
}


export default page