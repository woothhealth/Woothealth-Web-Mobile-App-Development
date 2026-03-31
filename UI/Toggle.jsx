'use client'

import React, { useState } from 'react'
import { FaWallet, FaTv, FaUserAlt } from "react-icons/fa";
import { RiLayoutMasonryFill } from "react-icons/ri";
import { ImLocation2 } from "react-icons/im";
import { GrPlan } from "react-icons/gr";
import { IoMdSettings } from "react-icons/io";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './LogOut';

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
    }
]

const Toggle = ({ isOpen, onClose }) => {
    const pathname = usePathname()
    const [pressedUrl, setPressedUrl] = useState(null)

    if (!isOpen) return null

    const handleItemClick = (url) => {
        setPressedUrl(url)
        onClose?.()
        setTimeout(() => setPressedUrl(null), 400)
    }
  
    return (
    <>
    <div className='absolute top-20 left-0 z-50 flex flex-col gap-6 h-screen bg-[#FFFFFF] w-[65%] px-4 py-6'>
        <div className='flex flex-col gap-1'>
            {path.map((path, index) => {
                const isActive = pathname === path.url || (pathname.startsWith(path.url) && path.url !== "/dashboard/retail")
                return (
                    <Link key={index} href={path.url} onClick={() => handleItemClick(path.url)}>
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
                const isActive = pathname === path.url || (pathname.startsWith(path.url) && path.url !== "/dashboard/retail")
                return (
                    <Link key={index} href={path.url} onClick={() => handleItemClick(path.url)}>
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

export default Toggle