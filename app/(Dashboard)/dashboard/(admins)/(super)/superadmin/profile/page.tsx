import React from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import ProfileClient from './ProfileClient'
import { getCurrentUser } from '@/lib/currentUser';

const page = async () => {
  const user = await getCurrentUser()
  
  if (!user || !user.id) {
    redirect('/login')
  }

  // Initialize profileData with user data
  let profileData = {
    firstName: user.name || 'Admin',
    lastName: user.lastName || 'User',
    email: user.email || 'Not Provided',
    phone: user.phone || 'Not Provided', // user doesn't have phone
    status: 'Active', // user doesn't have status
    userId: user.id || 'N/A',
    companyName: user.company || 'Woot Health Administrator'
  }

  try {
    // Build cookie header for server-side fetch
    const cookieStore = await cookies()
    const cookieHeader = (cookieStore.getAll?.() || [])
      .map((c) => `${c.name}=${c.value}`)
      .join('; ')

    const apiBase = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || ''
    const profileUrl = apiBase ? `${apiBase}/api/profile` : '/api/admin/profile'

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
        firstName: profile.firstName || profile.name || user.name || 'Admin',
        lastName: profile.lastName || user.lastName || 'User',
        email: profile.email || user.email || 'Not Provided',
        phone: profile.phone || 'Not Provided',
        status: profile.status || 'Active',
        userId: profile.userId || profile.id || user.id || 'N/A',
        companyName: profile.companyName || user.company || 'Woot Health Administrator'
      }
    }
  } catch (error) {
    console.warn('Profile fetch failed, using fallback data:', error instanceof Error ? error.message : 'Unknown error')
  }

  return (
    <div className="space-y-6 px-4 py-6 md:p-6">
      <ProfileClient profileData={profileData} />
    </div>
  )
}

export default page