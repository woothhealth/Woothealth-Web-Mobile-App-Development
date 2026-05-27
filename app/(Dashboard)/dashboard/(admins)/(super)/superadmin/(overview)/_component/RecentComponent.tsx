'use client'

import React, { useEffect, useState } from 'react'
import { CiUser } from 'react-icons/ci'
import { FiFileText } from 'react-icons/fi'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { PiClockCounterClockwiseFill } from 'react-icons/pi'

// Note: static fallback removed per request — show no activities on error

type ActivityItem = {
  id: string | number
  name: string
  user: string
  time?: string
  type?: string
  icon?: any
  price?: string
  createdAt?: string
}

const mapServerIcon = (type?: string) => {
  if (!type) return FiFileText
  const t = type.toLowerCase()
  if (t.includes('enroll') || t.includes('employee')) return CiUser
  if (t.includes('payment') || t.includes('processed')) return IoMdCheckmarkCircleOutline
  if (t.includes('pending') || t.includes('clock')) return PiClockCounterClockwiseFill
  return FiFileText
}

const timeAgo = (dateStr?: string) => {
  if (!dateStr) return 'just now'
  try {
    const d = new Date(dateStr)
    const diff = Date.now() - d.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins} mins`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} hrs`
    const days = Math.floor(hours / 24)
    return `${days} days`
  } catch (e) {
    return 'some time'
  }
}

const RecentComponent = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/admin/overview/activities', { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to fetch activities')
        const json = await res.json()
        const items: any[] = Array.isArray(json?.data) ? json.data : json?.activities || []

        const mapped: ActivityItem[] = items.map((it: any, idx: number) => ({
          id: it.id || it.$id || it.activityId || idx,
          name: it.name || it.title || it.event || 'Activity',
          user: it.user || it.userName || it.actor || 'Unknown',
          time: it.time || timeAgo(it.createdAt) || 'some time',
          createdAt: it.createdAt || it.date || undefined,
          type: it.type || it.eventType || 'activity',
          icon: mapServerIcon(it.type || it.eventType || it.title),
          price: it.amount ? String(it.amount) : (it.price ? String(it.price) : ''),
        }))

        if (mounted) setActivities(mapped)
      } catch (err) {
        // per request: do NOT fall back to static activities — show no activities
        console.warn('Could not load recent activities; showing none', err)
        if (mounted) setActivities([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchActivities()
    return () => { mounted = false }
  }, [])

  return (
    <>
      {loading ? (
        <div className="flex flex-col gap-2">
          <div className="h-12 bg-gray-200 rounded animate-pulse" />
          <div className="h-12 bg-gray-200 rounded animate-pulse" />
        </div>
      ) : (
        <div className="flex flex-col gap-2 h-74 max-h-120 pr-2 overflow-y-auto custom-scrollbar">
          {activities.map((item, index) => {
            const idNum = Number(item.id)
            const isFirst = idNum === 1
            const isThird = idNum === 3
            const tagClasses = isFirst ? 'bg-[#49A5EF1A] text-[#49A5EF]' : isThird ? 'bg-[#8063E81A] text-[#8063E8]' : 'bg-[#D1FAE5] text-[#10B981]'
            const Icon = item.icon || FiFileText
            return (
              <div key={String(item.id) + '-' + index} className="flex items-center justify-between bg-[#E5E7EB33] py-2 px-3 rounded-[10px]">
                <div className="flex items-center gap-4">
                  <div className={`p-1.5 rounded-lg text-[18px] ${tagClasses} `}>
                    <Icon />
                  </div>
                  <div>
                    <p className="text-[16px]">{item.name}</p>
                    <p className="text-[14px] text-gray-600">{item.user} - {item.type}</p>
                  </div>
                </div>
                <div className="text-end">
                  <p className="font-semibold">{item.price ? `₦${item.price}` : ''}</p>
                  <p className="text-xs">{item.time} ago</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

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

export default RecentComponent