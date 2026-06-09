import React from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import ProfileClient from './ProfileClient'
import { getCurrentProvider } from '@/lib/currentUser';

const page = async () => {
  const user = await getCurrentProvider()
  
  if (!user || !user.id) {
    redirect('/providers')
  }

  // Initialize profileData with user data
  let profileData = {
    name: user.name || 'Admin',
    email: user.email || 'Not Provided',
    address: user.address || 'Not Provided',
    type: user.type || 'Not specified',
    remark: user.remark || 'No remarks',
    status: 'Active', // user doesn't have status
    userId: user.id || 'N/A'
  }

  try {
    // Build cookie header for server-side fetch
    const cookieStore = await cookies()
    const cookieHeader = (cookieStore.getAll?.() || [])
      .map((c) => `${c.name}=${c.value}`)
      .join('; ')

    // Use provider profile proxy (use absolute URL on server)
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const profileUrl = `${base}/api/pr/profile`;

    const res = await fetch(profileUrl, {
      cache: 'no-store',
      headers: {
        cookie: cookieHeader,
      },
    })
    
    if (res.ok) {
      const data = await res.json()
      const profile = (data?.data || data) as Record<string, any>

      profileData = {
        name: profile.name || user.name || 'Admin',
        email: profile.email || user.email || 'Not Provided',
        address: profile.address || 'Not Provided',
        type: profile.type || 'Not specified',
        remark: profile.remark || 'No remarks',
        status: profile.status || 'Active',
        userId: profile.userId || profile.id || user.id || 'N/A'
      }
    }
  } catch (error) {
    console.warn('Profile fetch failed, using fallback data:', error instanceof Error ? error.message : 'Unknown error')
  }

  // If neither a provider identity nor a fetched profile exists, redirect to providers landing
  if ((!user || !user.id) && (!profileData || !profileData.userId)) {
    redirect('/providers')
  }

  return (
    <div className="space-y-6 px-4 py-6 md:p-6">
      <ProfileClient profileData={profileData} />
    </div>
  )
}

export default page