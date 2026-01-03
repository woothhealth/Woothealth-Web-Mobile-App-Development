'use client'

import React from 'react'
import { FaWallet, FaTv, FaUserAlt } from "react-icons/fa";
import { RiLayoutMasonryFill, RiLogoutBoxRLine } from "react-icons/ri";
import { ImLocation2 } from "react-icons/im";
import { GrPlan } from "react-icons/gr";
import { IoMdSettings } from "react-icons/io";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const path = [
    {
        name: 'Overview',
        url: '/dashboard/retail',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'My Plans',
        url: '/dashboard/retail/plans',
        icon: <GrPlan/>
    },
    {
        name: 'Wallet',
        url: '/dashboard/retail/wallet',
        icon: <FaWallet/>
    },
    {
        name: 'Providers',
        url: '/dashboard/retail/providers',
        icon: <ImLocation2/>
    },
    {
        name: 'Telemedicine',
        url: '/dashboard/retail/telemedicine',
        icon: <FaTv/>
    }
]

const path2 = [
    {
        name: 'Profile',
        url: '/dashboard/retail/profile',
        icon: <FaUserAlt/>
    },
    {
        name: 'Settings',
        url: '/dashboard/retail/settings',
        icon: <IoMdSettings/>
    },
    {
        name: 'Logout',
        url: '/login',
        icon: <RiLogoutBoxRLine/>
    }
]

const Toggle = ({ isOpen }) => {
    const pathname = usePathname()
    if (!isOpen) return null
  
    return (
    <>
    <div className='absolute top-20 left-0 z-50 flex flex-col gap-10 h-screen bg-[#FFFFFF] w-[65%] px-4 py-6'>
        <div className='flex flex-col gap-2'>
            {path.map((path, index) => {
                const isActive = pathname === path.url || (pathname.startsWith(path.url) && path.url !== "/dashboard/retail")
                return (
                    <Link key={index} href={path.url}>
                        <div className={`flex gap-4 py-3 items-center text-[#00000033] rounded-2xl pl-5 ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''}`}>
                            <div className='text-xl'>
                                {path.icon}
                            </div>
                            {path.name}
                        </div>
                    </Link>
            )})}
        </div>
        <div className='flex flex-col gap-2 h-full'>
            {path2.map((path, index) => {
                const last = index === 2;
                const isActive = pathname === path.url || (pathname.startsWith(path.url) && path.url !== "/dashboard/retail")
                return (
                    <Link key={index} href={path.url}>
                        <div className={`flex gap-4 py-3 items-center text-[#00000033] rounded-2xl pl-5 hover:bg-amber-500 ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''} ${last ? 'mt-10' : ''}`}>
                            <div className='text-xl'>
                                {path.icon}
                            </div>
                            {path.name}
                        </div>
                    </Link>
            )})}
        </div>
    </div>
    <div className='absolute top-18 h-screen w-full bg-[#FFFFFF] opacity-25'></div>
    </>
  )
}

export default Toggle