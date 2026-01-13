'use client'
import { useState } from 'react'

export default function BookingPanel({ doctor, onClose }: any) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('10:00 AM')

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[500px] rounded-xl p-6 space-y-4">
        <h3 className="font-semibold">Book with {doctor.name}</h3>

        <input type="date" className="border p-2 w-full" onChange={e => setDate(e.target.value)} />

        <select className="border p-2 w-full" value={time} onChange={e => setTime(e.target.value)}>
          <option>10:00 AM</option>
          <option>12:00 PM</option>
          <option>2:00 PM</option>
        </select>

        <textarea className="border p-2 w-full" placeholder="Add details (optional)" />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2">Cancel</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Confirm</button>
        </div>
      </div>
    </div>
  )
}