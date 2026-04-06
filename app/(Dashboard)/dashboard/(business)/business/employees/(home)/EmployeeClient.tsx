'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { LuUpload } from 'react-icons/lu';
import Link from 'next/link';
import { useBusinessEmployees } from '@/lib/api';

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  dateOfBirth: string;
  gender: string;
  plan: string;
  status: string;
  enrolledDate: string;
};

type EmployeesData = {
  employees: Employee[];
  stats: {
    total: number;
    active: number;
    slotsAvailable: number;
  };
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
};

const ITEMS_PER_PAGE = 20;

const EmployeeClient = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'name' | 'email' | 'department' | 'plan'>('name');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useBusinessEmployees(search, page);

  const employees: Employee[] = data?.employees || [];
  const stats = data?.stats || { total: 0, active: 0, slotsAvailable: 0 };
  const hasMore = data?.pagination?.hasMore || false;

  const categories = [
    { label: 'Employee Name', value: 'name' },
    { label: 'Email', value: 'email' },
    { label: 'Department', value: 'department' },
    { label: 'Plan', value: 'plan' },
  ];

  const headers = ['Employee Name', 'Email', 'Department', 'Plan', 'Status'];

  const filteredEmployees = useMemo(() => {
    const q = search.toLowerCase();
    return employees.filter((emp: Employee) => {
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      if (selectedCategory === 'name') return fullName.includes(q);
      if (selectedCategory === 'email') return emp.email.toLowerCase().includes(q);
      if (selectedCategory === 'department') return emp.department.toLowerCase().includes(q);
      if (selectedCategory === 'plan') return emp.plan.toLowerCase().includes(q);
      return true;
    });
  }, [employees, search, selectedCategory]);

  const totalPages = Math.ceil(stats.total / ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory]);

  return (
    <div className="p-4 pt-10 w-full lg:max-w-6xl mx-auto bg-[#ffffff] rounded-[10px]">
        <div className="flex flex-col md:flex-row gap-4 mb-8 lg:w-[90%] lg:mx-auto">
          <input
            type="text"
            placeholder="Search Employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#d7d9df]"
            />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#d7d9df]">
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <button className='border rounded-[10px] py-2 px-6 border-[#E5E7EB]'>
            Export <LuUpload className="inline-block ml-1" />
          </button>
          <Link href={`/dashboard/business/employees/add`} className="bg-[#49A5EF] text-white text-center px-4 py-2 rounded-[10px]">Add Employees</Link>
        </div>
        {isLoading ? (
          <div className="overflow-x-auto custom-scrollbar pb-4 h-120">
            <table className="min-w-full border border-gray-200 rounded-[10px] overflow-hidden">
              <tbody className='overflow-y-auto h-96'>
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : error ? (
          <div className='flex justify-center h-64 mt-4'>
            <p className="text-red-500">{error?.message || 'An error occurred'}</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className='flex justify-center h-64 mt-4'>
            <p className='text-lg'>No Employee found.</p>
          </div>
        ) : (
          <>
          <div className="overflow-x-auto custom-scrollbar pb-4 max:h-120">
            <table className="min-w-full border border-gray-200 rounded-[10px] overflow-hidden">
              <thead className="text-[#FFFFFF]">
                <tr className='bg-[#49A5EF]'>
                  {headers.map((h) => (
                    <th key={h} className="text-left text-[18px] px-6 py-6 border-b">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='overflow-y-auto max:h-96'>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 text-[14px] uppercase text-[#000000]">
                    <td className="px-6 py-1 border-b border-[#E5E7EB]">{`${emp.firstName} ${emp.lastName}`}</td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">{emp.email}</td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">{emp.department}</td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">{emp.plan}</td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        emp.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    className={`px-3 py-1 rounded-lg border ${
                      pNum === page ? 'bg-[#49A5EF] text-white' : 'bg-white text-black'
                    }`}
                  >
                    {pNum}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

    <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
          margin-top: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #464646;
          border-radius: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #464646;
        }
      `}</style>
    </div>
  );
}

export default React.memo(EmployeeClient);