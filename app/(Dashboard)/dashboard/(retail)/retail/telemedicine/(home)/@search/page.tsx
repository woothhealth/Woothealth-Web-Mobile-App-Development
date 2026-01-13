'use client'
import { useState } from 'react'
import DoctorCard from './DoctorCard'
import { doctors } from './mockDoctors'
import SearchBar from './SearchBar'
import DoctorFilterTabs from './DoctorFilterTab'

type FilterType = 'available' | 'all' | 'favorite'

export default function DoctorsPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('available')

  const filteredDoctor = doctors.filter(d => {
    if (filter === 'available') return d.available
    if (filter === 'favorite') return d.favourite

    return true
  })
    .filter(d => d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.specialty.toLowerCase().includes(query.toLowerCase()) ||
    d.location.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <SearchBar value={query} onChange={setQuery} />
      <DoctorFilterTabs active={filter} onChange={setFilter} />
      <div className="space-y-4">
        {filteredDoctor.map(doc => (
          <DoctorCard key={doc.id} doctor={doc} />
        ))}
      </div>
    </div>
  )
}
