'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";
import { usePathname } from 'next/navigation';
import { FaUserAlt } from "react-icons/fa";
import { RiLayoutMasonryFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import Link from 'next/link';
import LogoutButton from '@/UI/LogOut';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { HiOutlineAcademicCap, HiOutlineBell, HiOutlineCamera, HiOutlineCash, HiOutlineChatAlt2, HiOutlineCheckCircle, HiOutlineChip, HiOutlineClipboardCheck, HiOutlineClipboardList, HiOutlineCreditCard, HiOutlineDocumentText, HiOutlineKey, HiOutlineOfficeBuilding, HiOutlineShieldCheck, HiOutlineTicket, HiOutlineTrendingUp, HiOutlineUserGroup, HiOutlineUsers } from 'react-icons/hi';
import { useAdminDashboardUser } from '@/Components/AdminDashboardUserProvider';
import { can } from '@/lib/rbac';

const navItems = [
    {
        name: 'Overview',
        url: '/dashboard/superadmin',
        icon: <RiLayoutMasonryFill/>,
        permission: 'overview',
    },
    {
        name: 'Users',
        url: '/dashboard/superadmin/users',
        icon: <HiOutlineUsers/>,
        permission: 'users',
    },
    {
        name: 'Enrollees',
        url: '/dashboard/superadmin/enrollees',
        icon: <FaUserAlt/>,
        permission: 'enrollees',
    },
    {
        name: 'Clients',
        url: '/dashboard/superadmin/clients',
        icon: <HiMiniUserGroup/>,
        permission: 'clients',
    },
    {
        name: 'Benefits/Plan',
        url: '/dashboard/superadmin/benefits',
        icon: <HiOutlineClipboardList/>,
        permission: 'benefits',
    },
    {
        name: 'Finance',
        url: '/dashboard/superadmin/finance',
        icon: <HiOutlineCash/>,
        permission: 'finance',
    },
    {
        name: 'Leads',
        url: '/dashboard/superadmin/leads',
        icon: <HiOutlineTrendingUp/>,
        permission: 'leads',
    },
    {
        name: 'Feedback',
        url: '/dashboard/superadmin/coming',
        icon: <HiOutlineChatAlt2/>,
        permission: 'customerFeeds',
    },
    {
        name: 'Tickets',
        url: '/dashboard/superadmin/tickets',
        icon: <HiOutlineTicket/>,
        permission: 'tickets',
    },
    {
        name: 'Employee',
        url: '/dashboard/superadmin/employees',
        icon: <HiOutlineUserGroup/>,
        permission: 'employees',
    },
    {
        name: 'Providers',
        url: '/dashboard/superadmin/providers',
        icon: <HiOutlineOfficeBuilding/>,
        permission: 'providers',
    },
    {
        name: 'Claims',
        url: '/dashboard/superadmin/claims',
        icon: <HiOutlineDocumentText/>,
        permission: 'claims',
    },
    {
        name: 'Reimbursement',
        url: '/dashboard/superadmin/reimbursement',
        icon: <HiOutlineCreditCard/>,
        permission: 'reimbursement',
    },
    {
        name: 'Validations',
        url: '/dashboard/superadmin/validations',
        icon: <HiOutlineCheckCircle/>,
        permission: 'validations',
    },
    {
        name: 'PA Codes',
        url: '/dashboard/superadmin/pa-code',
        icon: <HiOutlineKey/>,
        permission: 'paCodes',
    },
    {
        name: 'Prescription',
        url: '/dashboard/superadmin/prescription',
        icon: <HiOutlineClipboardCheck/>,
        permission: 'prescription',
    },
    {
        name: 'Telemedicine',
        url: '/dashboard/superadmin/telemedicine',
        icon: <HiOutlineCamera/>,
        permission: 'telemedicine',
    },
    {
        name: 'Pre-Employment Tests',
        url: '/dashboard/superadmin/pre-employment',
        icon: <HiOutlineAcademicCap/>,
        permission: 'preEmployment',
    },
    {
        name: 'Notification',
        url: '/dashboard/superadmin/notification',
        icon: <HiOutlineBell/>,
        permission: 'notification',
    },
    {
        name: 'Roles',
        url: '/dashboard/superadmin/roles',
        icon: <HiOutlineShieldCheck/>,
        permission: 'roles',
    },
    {
        name: 'Product & Tech',
        url: '/dashboard/superadmin/products',
        icon: <HiOutlineChip/>,
        permission: 'product',
    },
];

const actionItems = [
    {
        name: 'Profile',
        url: '/dashboard/superadmin/profile',
        icon: <FaUserAlt/>,
        permission: 'profile',
    }
];

const SideBar = () => {
    const [isToggle, setIsToggle] = useState(false);
    const user = useAdminDashboardUser();

    const click = () => {
        setIsToggle(!isToggle)
    }

    const pathname = usePathname();
    const visibleNavItems = navItems.filter((item) => can(user, item.permission));
    const visibleActionItems = actionItems.filter((item) => can(user, item.permission));

  return (
    <section className='hidden lg:block lg:sticky lg:left-0 lg:top-0 px-6 h-screen w-fit border-r border-[#D9D9D9] pb-8'>
        {!isToggle && 
        <>
        <div className='relative flex flex-col gap-6 h-fit w-[18vw]'>
            <div className='flex justify-between pt-8 pb-2 items-center'>
                <Image src='/Logo2.png' height={100} width={500} alt='WootHealth Logo' className='h-10 w-fit' loading='eager' />
                <GoSidebarExpand className='text-3xl cursor-pointer text-[#00000077] font-semibold' onClick={click} />
            </div>
            <div className='flex flex-col gap-6 overflow-y-scroll custom-scrollbar h-[80vh] pr-2'>
            <div className='flex flex-col gap-1'>
                {visibleNavItems.map((item, index) => {
                    const isActive = pathname === item.url || (pathname.startsWith(item.url) && item.url !== "/dashboard/superadmin")
                return (
                    <Link key={index} href={item.url}>
                        <div className={`flex gap-4 py-3 items-center text-[#00000077] font-semibold rounded-2xl pl-5 hover:bg-gray-100 ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''}`}>
                            <div className='text-xl'>
                                {item.icon}
                            </div>
                            {item.name}
                        </div>
                    </Link>
                )})}
            </div>
            <div className='flex flex-col gap-1 h-full'>
                {visibleActionItems.map((item, index) => {
                    const isActive = pathname === item.url || (pathname.startsWith(item.url) && item.url !== "/dashboard/superadmin")
                    return (
                        <Link key={index} href={item.url}>
                            <div className={`flex gap-4 py-3 items-center text-[#00000077] font-semibold rounded-2xl pl-5 hover:bg-gray-100 ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''}`}>
                                <div className='text-xl'>
                                    {item.icon}
                                </div>
                                {item.name}
                            </div>
                        </Link>
                )})}
                <div className={`text-[#00000077] font-semibold rounded-2xl hover:bg-red-400/50 hover:text-[#FFFFFF] cursor-pointer`}>
                    <LogoutButton/>
                </div>
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
                        {visibleNavItems.map((item, index) => {
                        const isActive = pathname === item.url || (pathname.startsWith(item.url) && item.url !== "/dashboard/superadmin")
                        return (
                            <Link key={index} href={item.url}>
                                <div className={`flex gap-4 py-3 items-center text-[#00000077] font-semibold rounded-2xl justify-center hover:bg-gray-100 ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''}`}>
                                    <div className='text-2xl'>
                                        {item.icon}
                                    </div>
                                </div>
                            </Link>
                        )})}
                    </div>
                    <div className='flex flex-col gap-1 h-full'>
                        {visibleActionItems.map((item, index) => {
                            const isActive = pathname === item.url || (pathname.startsWith(item.url) && item.url !== "/")
                            return (
                                <Link key={index} href={item.url}>
                                    <div className={`flex gap-4 py-3 items-center text-[#00000077] font-semibold rounded-2xl justify-center hover:bg-gray-100 ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''}`}>
                                        <div className='text-2xl'>
                                            {item.icon}
                                        </div>
                                    </div>
                                </Link>
                        )})}
                        <div className={`flex items-center text-[#00000077] font-semibold rounded-2xl justify-center hover:bg-red-400/50 hover:text-[#FFFFFF] text-center cursor-pointer`}>
                            <LogoutButton collapsed />
                        </div>
                    </div>
            </div>
            </>
        )
        }

        <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          margin-top: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00000080;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e0e0e0;
        }
      `}</style>
    </section>
  )
}

export default SideBar