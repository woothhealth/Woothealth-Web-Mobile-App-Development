'use client'

type FilterType = 'available' | 'all' | 'favorite'

export default function DoctorFilterTabs({
  active,
  onChange
}: {
  active: FilterType
  onChange: (v: FilterType) => void
}) {
  const tabStyle = (tab: FilterType) =>
    `px-4 py-2 text-sm cursor-pointer ${
      active === tab
        ? 'bg-blue-100/50'
        : 'bg-gray-100 text-gray-600'
    }`

  return (
    <div className="flex bg-[#F8F9FA]">
      <button onClick={() => onChange('available')} className={tabStyle('available')}>
        Available Now
      </button>
      <button onClick={() => onChange('all')} className={tabStyle('all')}>
        All
      </button>
      <button onClick={() => onChange('favorite')} className={tabStyle('favorite')}>
        Favorites
      </button>
    </div>
  )
}