'use client';

import { useState, useEffect, useMemo } from 'react';
import { LuUpload } from 'react-icons/lu';
import Link from 'next/link';
import { useAdminEnrollees } from '@/Components/AdminEnrolleesContext';

type Enrollee = {
  id: string;
  name: string;
  email: string;
  status: string;
  enrollmentDate?: string;
  [key: string]: any;
};

const ITEMS_PER_PAGE = 20;

export default function EnrolleesClient() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filteredEnrollees, setFilteredEnrollees] = useState<any[]>([]);
  
  const { enrollees, loading, error, refetch } = useAdminEnrollees();

  const headers = ['Name', 'HMO ID', 'Enrollment Date', 'Expiry Date', 'Dependants', 'Benefit Balance', 'Status', 'Action'];

  useEffect(() => {
    if (enrollees?.data) {
      setFilteredEnrollees(enrollees.data);
    }
  }, [enrollees]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const totalPages = enrollees?.total ? Math.ceil(enrollees.total / ITEMS_PER_PAGE) : 1;

  return (
    <div className="p-4 pt-10 w-full lg:max-w-6xl mx-auto bg-[#ffffff] rounded-[10px]">
        <div className="flex flex-col md:flex-row gap-4 mb-8 lg:w-[90%] lg:mx-auto">
          <input
            type="text"
            placeholder="Search by name, email..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#d7d9df]"
            />
          <Link href={`/dashboard/superadmin/enrollees/add`} className="bg-[#49A5EF] text-white text-center px-4 py-2 rounded-[10px]">Add Enrollee</Link>
        </div>
        {loading ? (
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
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : error ? (
          <div className='flex justify-center h-64 mt-4'>
            <p className="text-red-500">{error}</p>
          </div>
        ) : !filteredEnrollees || filteredEnrollees.length === 0 ? (
          <div className='flex justify-center h-64 mt-4'>
            <p className='text-lg'>No Enrollee found.</p>
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
                {filteredEnrollees.map((enrollee) => (
                  <tr key={enrollee.id} className="hover:bg-gray-50 text-[14px] text-[#000000]">
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">{enrollee.name}</td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">{enrollee.hmoId || '—'}</td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">{enrollee.enrollmentDate || '—'}</td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">{enrollee.expiryDate || '—'}</td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">{enrollee.dependants || 0}</td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">{enrollee.benefitBalance || '—'}</td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        enrollee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {enrollee.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">
                      <button className="text-[#49A5EF] font-semibold text-sm hover:underline">Edit</button>
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