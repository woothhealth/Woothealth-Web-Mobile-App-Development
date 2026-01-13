'use client'

type searchBarProps = {
     value: string
     onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: searchBarProps) {
    return (
        <div className="flex gap-2">
            <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search doctors by name, specialty or location" className="border p-3 rounded-lg flex-1" />
            <button className="btn px-10 py-3">Search</button>
        </div>
    )
}