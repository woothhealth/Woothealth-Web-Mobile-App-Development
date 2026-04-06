'use client'

import React, { use, useState } from 'react'
import { FaUserAlt } from "react-icons/fa";
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
        url: '/dashboard/superadmin',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Users',
        url: '/dashboard/superadmin/users',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Enrollees',
        url: '/dashboard/superadmin/enrollees',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Claims',
        url: '/dashboard/superadmin/claims',
        icon: <BiSolidFile/>
    },
    {
        name: 'Clients',
        url: '/dashboard/superadmin/coming',
        // url: '/dashboard/superadmin/clients',
        icon: <HiMiniUserGroup/>
    },
    {
        name: 'Benefits/Plan',
        url: '/dashboard/superadmin/coming',
        // url: '/dashboard/superadmin/benefits',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Finance',
        url: '/dashboard/superadmin/coming',
        // url: '/dashboard/superadmin/finance',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Leads',
        url: '/dashboard/superadmin/coming',
        // url: '/dashboard/superadmin/leads',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Feedback',
        url: '/dashboard/superadmin/coming',
        // url: '/dashboard/superadmin/feedback',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Tickets',
        url: '/dashboard/superadmin/coming',
        // url: '/dashboard/superadmin/tickets',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Employee',
        url: '/dashboard/superadmin/coming',
        // url: '/dashboard/superadmin/employee',
        icon: <BiSolidFile/>
    },
    {
        name: 'Providers',
        url: '/dashboard/superadmin/coming',
        // url: '/dashboard/superadmin/providers',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Claims',
        url: '/dashboard/superadmin/claims',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Reimbursement',
        url: '/dashboard/superadmin/coming',
        // url: '/dashboard/superadmin/reimbursement',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Validations',
        url: '/dashboard/superadmin/coming',
        // url: '/dashboard/superadmin/validations',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'PA Codes',
        url: '/dashboard/superadmin/coming',
        // url: '/dashboard/superadmin/pa-code',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Prescription',
        url: '/dashboard/superadmin/coming',
        // url: '/dashboard/superadmin/prescription',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Telemedicine',
        url: '/dashboard/superadmin/coming',
        // url: '/dashboard/superadmin/telemedicine',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Pre-Employment Tests',
        url: '/dashboard/superadmin/coming',
        // url: '/dashboard/superadmin/pre-employment',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Notification',
        url: '/dashboard/superadmin/coming',
        // url: '/dashboard/superadmin/notification',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Roles',
        url: '/dashboard/superadmin/coming',
        // url: '/dashboard/superadmin/roles',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Product & Tech',
        url: '/dashboard/superadmin/coming',
        // url: '/dashboard/superadmin/product',
        icon: <RiLayoutMasonryFill/>
    }
]

const path2 = [
    {
        name: 'Profile',
        url: '/dashboard/superadmin/profile',
        icon: <FaUserAlt/>
    },
    {
        name: 'Settings',
        url: '/dashboard/superadmin/settings',
        icon: <IoMdSettings/>
    }
]

const AdminToggle = ({ isOpen }: { isOpen: boolean }) => {
    const pathname = usePathname()
    if (!isOpen) return null
  
    return (
    <>
    <div className='absolute top-18 left-0 z-50 flex flex-col gap-6 h-screen bg-[#FFFFFF] w-[65%] px-4 pt-6 pb-10 overflow-y-scroll'>
        <div className='flex flex-col gap-1'>
            {path.map((path, index) => {
                const isActive = pathname === path.url || (pathname.startsWith(path.url) && path.url !== "/dashboard/superadmin")
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
                const isActive = pathname === path.url || (pathname.startsWith(path.url) && path.url !== "/dashboard/superadmin")
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
            <div className={`flex gap-4 items-center text-[#00000077] font-semibold rounded-2xl justify-center hover:bg-red-500/70 hover:text-[#FFFFFF] text-center cursor-pointer`}>
                <LogoutButton />
            </div>
        </div>
    </div>
    <div className='absolute top-18 h-screen w-full bg-[#FFFFFF] opacity-25'></div>
    </>
  )
}

export default AdminToggle