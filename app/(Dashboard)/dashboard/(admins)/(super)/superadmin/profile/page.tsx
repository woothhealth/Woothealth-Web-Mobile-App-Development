import React from 'react'
import { getBusinessCurrentUser } from '@/lib/businessCurrentUser'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import ProfileClient from './ProfileClient'

const page = async () => {
  const user = await getBusinessCurrentUser()
  
  if (!user || !user.id) {
    redirect('/login')
  }

  // Fetch full user profile data
  let profileData: any = {
    companyName: user.businessName || user.company?.split(' ')[0] || 'User',
    companyAddress: user.companyAddress || 'Not Provided',
    regNumber: user.taxId || '',
    email: user.email || '',
    phone: user.phone || '',
    status: user.subscriptionStatus === 'inactive' ? 'Inactive' : 'Active',
    userId: user.id,
    role: user.role || 'business',
    plan: user.plan || 'No Plan found',
    industry: user.industry || 'Healthcare',
  }

  try {
    // Build cookie header for server-side fetch
    const cookieStore = await cookies()
    const cookieHeader = (cookieStore.getAll?.() || [])
      .map((c) => `${c.name}=${c.value}`)
      .join('; ')

    const apiBase = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || '';
    const profileUrl = apiBase ? `${apiBase}/api/business/profile` : `/api/business/profile`;

    const res = await fetch(profileUrl, {
      cache: 'no-store',
      headers: {
        cookie: cookieHeader,
      },
    })
    
    if (res.ok) {
      const data = await res.json()
      const profile = data?.data || data || {}

      profileData = {
        companyName: profile.businessName || profile.company || user.businessName || user.company?.split(' ')[0] || 'User',
        companyAddress: profile.address || profile.companyAddress || user.companyAddress || 'Not Provided',
        regNumber: profile.taxId || profile.regNumber || user.taxId || '',
        email: profile.email || user.email || '',
        phone: profile.phone || user.phone || '',
        status: profile.subscriptionStatus === 'inactive' ? 'Inactive' : (user.subscriptionStatus === 'inactive' ? 'Inactive' : 'Active'),
        userId: profile.userId || profile.id || user.id,
        role: profile.role || user.role || 'business',
        plan: profile.planType || profile.plan || user.plan || 'No Plan Found',
        industry: profile.industry || user.industry || 'Healthcare',
      }
    }
  } catch (error) {
    console.error('Failed to fetch profile:', error)
  }

  return <ProfileClient profileData={profileData} />
}

export default page