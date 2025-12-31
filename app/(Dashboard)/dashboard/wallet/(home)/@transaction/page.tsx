'use client'

import React, { useMemo, useState } from 'react'
import transactionsData from '../../../../../../data/transactions.json'

type Transaction = {
  id: string
  date: string
  description: string
  amount: number
  type: 'credit' | 'debit'
  status: 'successful' | 'pending' | 'failed'
  details?: string
}

const PAGE_SIZE = 10

const Page = () => {
  const transactions: Transaction[] = transactionsData as Transaction[]
  const [tab, setTab] = useState<'all' | 'credit' | 'debit' | 'pending'>('all')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (tab === 'all') return transactions
    if (tab === 'pending') return transactions.filter((t) => t.status === 'pending')
    return transactions.filter((t) => t.type === tab)
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
    <section className="p-4 my-4 bg-white rounded-2xl shadow-sm">
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

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-[16px] text-center">
          <thead className='bg-[#49A5EF1A] border-y border-[#49A5EF80]'>
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
            {pageData.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center">
                  No transactions found.
                </td>
              </tr>
            )}

            {pageData.map((t) => (
              <React.Fragment key={t.id}>
                <tr className="border-b border-[#D9D9D9]">
                  <td className="p-3">{t.id}</td>
                  <td className="p-3">{new Date(t.date).toLocaleString()}</td>
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
                          <div>Type: <span className="font-medium">{t.type}</span></div>
                          <div>Date: <span className="font-medium">{new Date(t.date).toLocaleString()}</span></div>
                          <div>Reference: <span className="font-medium">{t.id}</span></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
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
    </section>
  )
}

export default Page