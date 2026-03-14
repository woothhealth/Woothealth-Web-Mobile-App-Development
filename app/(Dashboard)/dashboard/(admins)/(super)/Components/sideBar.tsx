'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";
import { FaWallet, FaUserAlt } from "react-icons/fa";
import { RiLayoutMasonryFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogOut from '@/UI/LogOut';
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
        name: 'Clients',
        url: '/dashboard/superadmin/clients',
        icon: <HiMiniUserGroup/>
    },
    {
        name: 'Benefits/Plan',
        url: '/dashboard/superadmin/benefits',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Finance',
        url: '/dashboard/superadmin/finance',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Leads',
        url: '/dashboard/superadmin/leads',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Feedback',
        url: '/dashboard/superadmin/feedback',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Tickets',
        url: '/dashboard/superadmin/tickets',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Employee',
        url: '/dashboard/superadmin/employee',
        icon: <BiSolidFile/>
    },
    {
        name: 'Providers',
        url: '/dashboard/superadmin/providers',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Claims',
        url: '/dashboard/superadmin/claims',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Reimbursement',
        url: '/dashboard/superadmin/reimbursement',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Validations',
        url: '/dashboard/superadmin/validations',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'PA Codes',
        url: '/dashboard/superadmin/pa-code',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Prescription',
        url: '/dashboard/superadmin/prescription',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Telemedicine',
        url: '/dashboard/superadmin/telemedicine',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Pre-Employment Tests',
        url: '/dashboard/superadmin/pre-employment',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Notification',
        url: '/dashboard/superadmin/notification',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Roles',
        url: '/dashboard/superadmin/roles',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Product & Tech',
        url: '/dashboard/superadmin/product',
        icon: <RiLayoutMasonryFill/>
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

const SideBar = () => {
    const [isToggle, setIsToggle] = useState(false);

    const click = () => {
        setIsToggle(!isToggle)
    }

    const pathname = usePathname()

  return (
    <section className='hidden lg:block lg:sticky lg:left-0 lg:top-0 px-6 h-screen w-fit border-r border-[#D9D9D9] pb-8 overflow-y-scroll'>
        {!isToggle && 
        <>
        <div className='relative flex flex-col gap-6 h-fit w-[20vw]'>
            <div className='sticky bg-[#FAFAFA] top-0 flex justify-between pt-8 pb-2 items-center'>
                <Image src='/Logo2.png' height={100} width={500} alt='WootHealth Logo' className='h-10 w-fit' loading='eager' />
                <GoSidebarExpand className='text-3xl cursor-pointer text-[#00000077] font-semibold' onClick={click} />
            </div>
            <div className='flex flex-col gap-1'>
                {path.map((path, index) => {
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
            </div>
            <div className='flex flex-col gap-2 h-full'>
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
                <div className={`flex gap-4 items-center text-[#00000077] font-semibold mt-4 rounded-2xl hover:bg-red-400/50 hover:text-[#FFFFFF] cursor-pointer`}>
                    <LogOut/>
                </div>
            </div>
        </div>
        </>
        }
       {isToggle && (
            <>
            <div className='flex flex-col gap-6 h-fit w-fit'>
                    <div className='sticky bg-[#FAFAFA] top-0 flex justify-between pt-8 pb-2 items-center gap-4'>
                        <Image src='/Woot_collapse.png' height={100} width={500} alt='WootHealth Logo' className='h-9 w-fit' loading='eager' />
                        <GoSidebarCollapse className='text-3xl text-[#00000077] font-semibold cursor-pointer' onClick={click} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        {path.map((path, index) => {
                        const isActive = pathname === path.url || (pathname.startsWith(path.url) && path.url !== "/dashboard/business")
                        return (
                            <Link key={index} href={path.url}>
                                <div className={`flex gap-4 py-3 items-center text-[#00000077] font-semibold rounded-2xl justify-center hover:bg-gray-100 ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''}`}>
                                    <div className='text-2xl'>
                                        {path.icon}
                                    </div>
                                </div>
                            </Link>
                        )})}
                    </div>
                    <div className='flex flex-col gap-1 h-full'>
                        {path2.map((path, index) => {
                            const isActive = pathname === path.url || (pathname.startsWith(path.url) && path.url !== "/")
                            return (
                                <Link key={index} href={path.url}>
                                    <div className={`flex gap-4 py-3 items-center text-[#00000077] font-semibold rounded-2xl justify-center hover:bg-gray-100 ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''}`}>
                                        <div className='text-2xl'>
                                            {path.icon}
                                        </div>
                                    </div>
                                </Link>
                        )})}
                        <div className={`flex gap-4 mt-4 items-center text-[#00000077] font-semibold rounded-2xl justify-center hover:bg-red-400/50 hover:text-[#FFFFFF] text-center cursor-pointer`}>
                            <LogOut collapsed />
                        </div>
                    </div>
            </div>
            </>
        )
        }
    </section>
  )
}

export default SideBar