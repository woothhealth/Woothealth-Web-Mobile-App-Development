import React, { useEffect, useState } from 'react'
import { FaArrowUp } from 'react-icons/fa'
import { MdOutlinePendingActions } from 'react-icons/md'

const PendingComponent = () => {
  const [pendingCount, setPendingCount] = useState<number | null>(2560)
  const [percentChange, setPercentChange] = useState<string>('5.7%')

  useEffect(() => {
    let mounted = true

    const fetchTickets = async () => {
      try {
        const res = await fetch('/api/admin/tickets', { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to fetch tickets')
        const json = await res.json()
        const tickets: any[] = Array.isArray(json?.data) ? json.data : json?.tickets || []

        const total = tickets.length
        const pending = tickets.filter(t => (t.status || '').toLowerCase() === 'pending').length

        if (mounted) {
          setPendingCount(pending)
          const pct = total > 0 ? ((pending / total) * 100) : 0
          setPercentChange(`${pct.toFixed(1)}%`)
        }
      } catch (err) {
        console.warn('Failed to load tickets for PendingComponent, keeping fallback', err)
      }
    }

    fetchTickets()
    return () => { mounted = false }
  }, [])

  return (
    <section className='p-4 flex gap-3 bg-[#FFFFFF] lg:space-x-16 rounded-[10px]'>
      <div className='bg-[#4755691A] p-2 w-fit h-fit rounded-[10px] text-[20px]'>
        <MdOutlinePendingActions />
      </div>
      <div className='flex flex-col space-y-1.5'>
        <p className='text-[15px] font-semibold'>Pending Tickets</p>
        <div className='flex space-x-2 items-center'>
          <h3 className='text-[25px] font-semibold'>{pendingCount ?? ''}</h3>
          <p className='text-sm flex items-center gap-2 text-[#10B981]'>
            <FaArrowUp className='text-xs'/> {percentChange}
          </p>
        </div>
        <p className='text-[13px]'>All time Activity</p>
      </div>
    </section>
  )
}

export default PendingComponent