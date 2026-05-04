'use client'

import React, { useState } from 'react'
import { FaUserAlt, FaUsers } from "react-icons/fa";
import { RiLayoutMasonryFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/UI/LogOut';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { HiOutlineAcademicCap, HiOutlineBell, HiOutlineCamera, HiOutlineCash, HiOutlineChatAlt2, HiOutlineCheckCircle, HiOutlineChip, HiOutlineClipboardCheck, HiOutlineClipboardList, HiOutlineCreditCard, HiOutlineDocumentText, HiOutlineKey, HiOutlineOfficeBuilding, HiOutlineShieldCheck, HiOutlineTicket, HiOutlineTrendingUp, HiOutlineUserGroup, HiOutlineUsers } from 'react-icons/hi';

const path = [
    {
        name: 'Overview',
        url: '/dashboard/superadmin',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'Users',
        url: '/dashboard/superadmin/users',
        icon: <HiOutlineUsers/>
    },
    {
        name: 'Enrollees',
        url: '/dashboard/superadmin/enrollees',
        icon: <FaUsers/>
    },
    {
        name: 'Clients',
        // url: '/dashboard/superadmin/coming',
        url: '/dashboard/superadmin/clients',
        icon: <HiMiniUserGroup/>
    },
    {
        name: 'Benefits/Plan',
        // url: '/dashboard/superadmin/coming',
        url: '/dashboard/superadmin/benefits',
        icon: <HiOutlineClipboardList/>
    },
    {
        name: 'Finance',
        // url: '/dashboard/superadmin/coming',
        url: '/dashboard/superadmin/finance',
        icon: <HiOutlineCash/>
    },
    {
        name: 'Leads',
        // url: '/dashboard/superadmin/coming',
        url: '/dashboard/superadmin/leads',
        icon: <HiOutlineTrendingUp/>
    },
    {
        name: 'Feedback',
        url: '/dashboard/superadmin/coming',
        // url: '/dashboard/superadmin/feedback',
        icon: <HiOutlineChatAlt2/>
    },
    {
        name: 'Tickets',
        // url: '/dashboard/superadmin/coming',
        url: '/dashboard/superadmin/tickets',
        icon: <HiOutlineTicket/>
    },
    {
        name: 'Employee',
        // url: '/dashboard/superadmin/coming',
        url: '/dashboard/superadmin/employees',
        icon: <HiOutlineUserGroup/>
    },
    {
        name: 'Providers',
        // url: '/dashboard/superadmin/coming',
        url: '/dashboard/superadmin/providers',
        icon: <HiOutlineOfficeBuilding/>
    },
    {
        name: 'Claims',
        url: '/dashboard/superadmin/claims',
        icon: <HiOutlineDocumentText/>
    },
    {
        name: 'Reimbursement',
        // url: '/dashboard/superadmin/coming',
        url: '/dashboard/superadmin/reimbursement',
        icon: <HiOutlineCreditCard/>
    },
    {
        name: 'Validations',
        // url: '/dashboard/superadmin/coming',
        url: '/dashboard/superadmin/validations',
        icon: <HiOutlineCheckCircle/>
    },
    {
        name: 'PA Codes',
        // url: '/dashboard/superadmin/coming',
        url: '/dashboard/superadmin/pa-code',
        icon: <HiOutlineKey/>
    },
    {
        name: 'Prescription',
        // url: '/dashboard/superadmin/coming',
        url: '/dashboard/superadmin/prescription',
        icon: <HiOutlineClipboardCheck/>
    },
    {
        name: 'Telemedicine',
        // url: '/dashboard/superadmin/coming',
        url: '/dashboard/superadmin/telemedicine',
        icon: <HiOutlineCamera/>
    },
    {
        name: 'Pre-Employment Tests',
        // url: '/dashboard/superadmin/coming',
        url: '/dashboard/superadmin/pre-employment',
        icon: <HiOutlineAcademicCap/>
    },
    {
        name: 'Notification',
        // url: '/dashboard/superadmin/coming',
        url: '/dashboard/superadmin/notification',
        icon: <HiOutlineBell/>
    },
    {
        name: 'Roles',
        // url: '/dashboard/superadmin/coming',
        url: '/dashboard/superadmin/roles',
        icon: <HiOutlineShieldCheck/>
    },
    {
        name: 'Product & Tech',
        url: '/dashboard/superadmin/coming',
        // url: '/dashboard/superadmin/product',
        icon: <HiOutlineChip/>
    }
]

const path2 = [
    {
        name: 'Profile',
        url: '/dashboard/superadmin/profile',
        icon: <FaUserAlt/>
    }
]

const AdminToggle = ({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void }) => {
    const pathname = usePathname()
    if (!isOpen) return null

    const [pressedUrl, setPressedUrl] = useState<string | null>(null)
    
    if (!isOpen) return null
    
    const handleItemClick = (url: string) => {
        setPressedUrl(url)
        onClose?.()
        setTimeout(() => setPressedUrl(null), 400)
    }
  
    return (
    <>
    <div className='absolute top-18 left-0 z-50 flex flex-col md:hidden gap-6 h-[95svh] bg-[#FFFFFF] w-[70%] px-4 pt-4 pb-14 overflow-y-scroll custom-scrollbar mb-4'>
        <div className='flex flex-col gap-1'>
            {path.map((path, index) => {
                const isActive = pathname === path.url || (pathname.startsWith(path.url) && path.url !== "/dashboard/superadmin")
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
                const isActive = pathname === path.url || (pathname.startsWith(path.url) && path.url !== "/dashboard/superadmin")
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
            <div className={`text-[#00000077] font-semibold rounded-2xl justify-center hover:bg-red-500/70 hover:text-[#FFFFFF] text-center cursor-pointer`}>
                <LogoutButton />
            </div>
        </div>
    </div>
    <div className='absolute top-18 h-screen w-full bg-[#FFFFFF] opacity-25'></div>

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
    </>
  )
}

export default AdminToggle