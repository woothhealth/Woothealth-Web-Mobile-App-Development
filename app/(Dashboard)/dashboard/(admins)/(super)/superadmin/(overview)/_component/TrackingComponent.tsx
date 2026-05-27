import React, { useEffect, useState } from 'react'
import { TiClipboard } from "react-icons/ti";

const TrackingComponent = () => {
    const [resolved, setResolved] = useState<number>(127)
    const [inProgress, setInProgress] = useState<number>(45)
    const [escalated, setEscalated] = useState<number>(12)

    useEffect(() => {
        let mounted = true

        const fetchTickets = async () => {
            try {
                const res = await fetch('/api/admin/tickets', { credentials: 'include' })
                if (!res.ok) throw new Error('Failed to fetch tickets')
                const json = await res.json()
                const tickets: any[] = Array.isArray(json?.data) ? json.data : json?.tickets || []

                const resolvedCount = tickets.filter(t => {
                    const s = (t.status || '').toLowerCase()
                    return s === 'resolved' || s === 'closed' || s === 'completed'
                }).length

                const inProgressCount = tickets.filter(t => {
                    const s = (t.status || '').toLowerCase()
                    return s === 'in_progress' || s === 'in progress' || s === 'pending' || s === 'processing'
                }).length

                const escalatedCount = tickets.filter(t => (t.status || '').toLowerCase() === 'escalated').length

                if (mounted) {
                    setResolved(resolvedCount)
                    setInProgress(inProgressCount)
                    setEscalated(escalatedCount)
                }
            } catch (err) {
                console.warn('Failed to load tickets for TrackingComponent, keeping fallback', err)
            }
        }

        fetchTickets()
        return () => { mounted = false }
    }, [])

    return (
        <div className='flex flex-col w-full space-y-2'>
            <div className='bg-[#D1FAE5] flex justify-between px-4 py-3 rounded-[10px]'>
                <h3 className='text-[14px]'>Resolved Requests</h3>
                <p className='text-[15px] font-semibold text-[#10B981]'>{resolved}</p>
            </div>
            <div className='bg-[#FEF3C7] flex justify-between px-4 py-3 rounded-[10px]'>
                <h3 className='text-[14px]'>In Progress</h3>
                <p className='text-[15px] font-semibold text-[#F59E0B]'>{inProgress}</p>
            </div>
            <div className='bg-[#FEE2E2] flex justify-between px-4 py-3 rounded-[10px]'>
                <h3 className='text-[14px]'>Escalated</h3>
                <p className='text-[15px] font-semibold text-[#EF4444]'>{escalated}</p>
            </div>
        </div>
    )
}

export default TrackingComponent