'use client'

import React, { use, useState } from 'react'
import { FaWallet, FaTv, FaUserAlt } from "react-icons/fa";
import { RiLayoutMasonryFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/UI/LogOut';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { BiSolidFile } from 'react-icons/bi';

const path = [
    {
        name: 'Overview',
        url: '/dashboard/business',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Employees',
        url: '/dashboard/business/employees',
        icon: <HiMiniUserGroup/>
    },
    {
        name: 'Billing',
        url: '/dashboard/business/billing',
        icon: <BiSolidFile/>
    },
    {
        name: 'Wallet',
        url: '/dashboard/business/wallet',
        icon: <FaWallet/>
    }
]

const path2 = [
    {
        name: 'Profile',
        url: '/dashboard/business/profile',
        icon: <FaUserAlt/>
    },
    {
        name: 'Settings',
        url: '/dashboard/business/settings',
        icon: <IoMdSettings/>
    }
]

const BusinessToggle = ({ isOpen }: { isOpen: boolean }) => {
    const pathname = usePathname()
    if (!isOpen) return null
  
    return (
    <>
    <div className='absolute top-20 left-0 z-50 flex flex-col gap-6 h-screen bg-[#FFFFFF] w-[65%] px-4 py-6'>
        <div className='flex flex-col gap-1'>
            {path.map((path, index) => {
                const isActive = pathname === path.url || (pathname.startsWith(path.url) && path.url !== "/dashboard/business")
                return (
                    <Link key={index} href={path.url}>
                        <div className={`flex gap-4 py-3 items-center text-[#00000077] font-semibold rounded-2xl hover:bg-gray-100 pl-5 ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''}`}>
                            <div className='text-xl'>
                                {path.icon}
                            </div>
                            {path.name}
                        </div>
                    </Link>
            )})}
        </div>
        <div className='flex flex-col gap-1 h-full'>
            {path2.map((path, index) => {
                const isActive = pathname === path.url || (pathname.startsWith(path.url) && path.url !== "/dashboard/business")
                return (
                    <Link key={index} href={path.url}>
                        <div className={`flex gap-4 py-3 items-center text-[#00000077] font-semibold rounded-2xl pl-5 hover:bg-gray-100 ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''}`}>
                            <div className='text-xl'>
                                {path.icon}
                            </div>
                            {path.name}
                        </div>
                    </Link>
            )})}
            <div className={`flex gap-4 mt-4 items-center text-[#00000077] font-semibold rounded-2xl justify-center hover:bg-red-500/70 hover:text-[#FFFFFF] text-center cursor-pointer`}>
                <LogoutButton />
            </div>
        </div>
    </div>
    <div className='absolute top-18 h-screen w-full bg-[#FFFFFF] opacity-25'></div>
    </>
  )
}

export default BusinessToggle