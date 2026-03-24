'use client'

import React, { useMemo, useState, useEffect } from 'react'

type Billing = {
  id: string
  date: string
  description: string
  amount: number
  type: 'credit' | 'debit' | 'pending'
  status: 'paid' | 'processed' | 'pending'
  dueDate?: string | null
  paidDate?: string | null
}

const PAGE_SIZE = 10

export default function BillingClient({
  data,
}: {
  data?: Billing[];
}) {

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [tab, setTab] = useState <'all' | 'credit' | 'debit' | 'pending'>('all')
  const [billings, setBillings] = useState<Billing[]>(data || [])
  const [loading, setLoading] = useState<boolean>(!data)
  
  useEffect(() => {
    const fetchBillings = async () => {
      try {
        const url = tab === 'all' ? '/api/business/billings' : `/api/business/billings?type=${tab}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setBillings(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to fetch billings:', error);
        // Keep existing data or set empty array
        setBillings([]);
      } finally {
        setLoading(false);
      }
    };

    if (!data) {
      fetchBillings();
    } else {
      setLoading(false);
    }
  }, [tab, data]);
  
  const filtered = useMemo(() => {
    if (tab === 'all') return billings
    return billings.filter((b) => b.type === tab)
  }, [tab, billings])
  
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  
  const pageData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [currentPage, filtered])
  
  const formatCurrency = (amt: number) => {
    const nf = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' })
    return nf.format(amt)
  }
  
  const statusClass = (status: Billing['status']) => {
    if (status === 'paid' || status === 'processed') return 'text-green-700 bg-green-50 p-2'
    if (status === 'pending') return 'text-orange-700 bg-orange-50 p-2'
    return 'text-red-700 bg-red-50 p-2'
  }
  
  const handleTab = (t: typeof tab) => {
    setTab(t)
    setCurrentPage(1)
    setExpandedId(null)
  }
  
  return (
    <section className="py-4 px-2 md:p-4 my-4 bg-white rounded-2xl w-full">
      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-10">
        <h2 className="text-lg font-semibold">Billing History</h2>

        <div className="flex gap-2 items-center">
          <div className="flex rounded-[10px] bg-gray-100 py-1.5 px-2.5">
            {['all', 'credit', 'debit', 'pending'].map((t) => (
              <button
                key={t}
                onClick={() => handleTab(t as typeof tab)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${tab === t ? 'bg-white shadow' : 'text-gray-700'}`}
              >
                {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar pb-4">
        <table className="min-w-full border border-gray-200 rounded-[10px] overflow-hidden">
          <thead className="text-[#FFFFFF]">
            <tr className='bg-[#49A5EF]'>
              <th className="text-left text-[18px] px-6 py-6 border-b">ID</th>
              <th className="text-left text-[18px] px-6 py-6 border-b">Date</th>
              <th className="text-left text-[18px] px-6 py-6 border-b">Description</th>
              <th className="text-left text-[18px] px-6 py-6 border-b">Amount</th>
              <th className="text-left text-[18px] px-6 py-6 border-b">Status</th>
              <th className="text-left text-[18px] px-6 py-6 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No billings found.
                </td>
              </tr>
            ) : (
              pageData.map((b) => (
                <React.Fragment key={b.id}>
                  <tr className="hover:bg-gray-50 text-[14px] text-[#000000]">
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">{b.id}</td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">{b.date}</td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">{b.description}</td>
                    <td className={`px-6 py-3 border-b border-[#E5E7EB] ${b.type === 'credit' ? 'text-green-600' : b.type === 'debit' ? 'text-red-600' : ''}`}>
                      {b.type === 'credit' ? '+' : b.type === 'debit' ? '-' : ''}{formatCurrency(b.amount)}
                    </td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusClass(b.status)}`}>
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setExpandedId(expandedId === b.id ? null : b.id)
                        }}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {expandedId === b.id ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr> 
                  {expandedId === b.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="px-6 py-4 text-gray-700">
                        <div className="flex flex-col md:flex-row md:justify-between gap-2">
                          <div>
                            <div className="text-xs text-gray-500">Billing Details</div>
                            <div className="mt-1">
                              <p><strong>Type:</strong> {b.type}</p>
                              <p><strong>Amount:</strong> {formatCurrency(b.amount)}</p>
                              <p><strong>Status:</strong> {b.status}</p>
                              {b.dueDate && <p><strong>Due Date:</strong> {new Date(b.dueDate).toLocaleDateString()}</p>}
                              {b.paidDate && <p><strong>Paid Date:</strong> {new Date(b.paidDate).toLocaleDateString()}</p>}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            <div>Reference: <span className="font-medium">{b.id}</span></div>
                            <div>
                              Date: <span className="font-medium">{new Date(b.date).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 px-2 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{(currentPage - 1) * PAGE_SIZE + 1}</span> to <span className="font-medium">{Math.min(currentPage * PAGE_SIZE, filtered.length)}</span> of <span className="font-medium">{filtered.length}</span> billings
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md border ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          >
            Prev
          </button>

          <div className="hidden sm:flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-md ${currentPage === pageNum ? 'bg-[#49A5EF] text-white' : 'hover:bg-gray-100'}`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md border ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          >
            Next
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
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