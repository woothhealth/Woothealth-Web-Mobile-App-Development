'use client'

import React, { useMemo, useState } from 'react'

type Transaction = {
  id: string
  transactionDate: string
  description: string
  amount: number
  transactionType: 'credit' | 'debit'
  status: 'successful' | 'pending' | 'failed'
  details?: string
}

const PAGE_SIZE = 10

export default function TransactionClient({
  data,
  loading = false,
  error = null,
}: {
  data: Transaction[];
  loading?: boolean;
  error?: string | null;
}) {

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [tab, setTab] = useState <'all' | 'credit' | 'debit' | 'pending'>('all')
  
  const transactions: Transaction[] = data as Transaction[]
  
  const filtered = useMemo(() => {
    if (tab === 'all') return transactions
    if (tab === 'pending') return transactions.filter((t) => t.status === 'pending')
      return transactions.filter((t) => t.transactionType === tab)
  }, [tab, transactions])
  
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  
  const pageData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [currentPage, filtered])
  
  const formatCurrency = (amt: number) => {
    const nf = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' })
    return nf.format(amt)
  }
  
  const statusClass = (status: Transaction['status']) => {
    if (status === 'successful') return 'text-green-700 bg-green-50 p-2'
    if (status === 'pending') return 'text-orange-700 bg-orange-50 p-2'
    return 'text-red-700 bg-red-50 p-2'
  }
  
  const handleTab = (t: typeof tab) => {
    setTab(t)
    setCurrentPage(1)
    setExpandedId(null)
  }
  
  return (
    <section className="py-4 px-2 md:p-4 my-4 bg-white rounded-2xl shadow-sm">
      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-10">
        <h2 className="text-lg font-semibold">Transaction History</h2>

        <div className="flex gap-2 items-center">
          <div className="flex rounded-[10px] bg-gray-100 py-2 px-4">
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
        <table className="w-full table-auto text-[16px] text-center">
          <thead className='bg-[#49A5EF1A] border-y border-[#49A5EF80] z-5'>
            <tr className="text-center text-[16px]">
              <th className="px-3 py-5">Transaction ID</th>
              <th className="px-3 py-5">Date</th>
              <th className="px-3 py-5">Description</th>
              <th className="px-3 py-5">Amount</th>
              <th className="px-3 py-5">Status</th>
              <th className="px-3 py-5">Details</th>
            </tr>
          </thead>
          <tbody>
            {(loading || pageData.length === 0) ? (
              // Loading + empty-state skeleton rows (keep table structure)
              <>
                {error && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center">
                      <div className="text-red-500 mb-2">Failed to load transactions</div>
                      <div className="text-sm text-gray-500">{error}</div>
                    </td>
                  </tr>
                )}

                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <tr key={i} className="border-b border-[#D9D9D9]">
                    <td className="p-3">
                      <div className="h-4 bg-gray-200 rounded w-24 mx-auto animate-pulse"></div>
                    </td>
                    <td className="p-3">
                      <div className="h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
                    </td>
                    <td className="p-3">
                      <div className="h-4 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
                    </td>
                    <td className="p-3">
                      <div className="h-4 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
                    </td>
                    <td className="p-3">
                      <div className="h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
                    </td>
                    <td className="p-3">
                      <div className="h-4 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              // Data rows
              pageData.map((t) => (
                <React.Fragment key={t.id}>
                  <tr className="border-b border-[#D9D9D9] text-[13px] md:text-[15px]">
                    <td className="p-3">{t.id}</td>
                    <td className="p-3">{t.transactionDate}</td>
                    <td className="p-3">{t.description}</td>
                    <td className={`p-3 `}>{formatCurrency(t.amount)}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusClass(t.status)}`}>
                        {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setExpandedId(expandedId === t.id ? null : t.id)
                        }}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {expandedId === t.id ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>

                  {expandedId === t.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="p-4 text-gray-700">
                        <div className="flex flex-col md:flex-row md:justify-between gap-2">
                          <div>
                            <div className="text-xs text-gray-500">Transaction Details</div>
                            <div className="mt-1">{t.details || 'No additional details provided.'}</div>
                          </div>
                          <div className="text-xs text-gray-500">
                            <div>Type: <span className="font-medium">{t.transactionType}</span></div>
                            <div>Date: <span className="font-medium">{new Date(t.transactionDate).toLocaleString()}</span></div>
                            <div>Reference: <span className="font-medium">{t.id}</span></div>
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

      {!loading && !error && pageData.length > 0 && (
        <div className="mt-4 px-2 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{(currentPage - 1) * PAGE_SIZE + 1}</span> to <span className="font-medium">{Math.min(currentPage * PAGE_SIZE, filtered.length)}</span> of <span className="font-medium">{filtered.length}</span> transactions
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
                    className={`px-3 py-1 rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
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
      )}

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