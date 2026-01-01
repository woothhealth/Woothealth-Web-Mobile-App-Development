import React from 'react'

const members = [
  {
    name: 'Quadri Adekunle',
    role: 'Primary',
    age: '42',
    id: '111076'
  },
  {
    name: 'Aminat Adekunle',
    role: 'Spouse',
    age: '38',
    id: '111046'
  },
  {
    name: 'John Adekunle',
    role: 'Child',
    age: '22',
    id: '111076'
  },
  {
    name: 'Suliamon Adekunle',
    role: 'Child',
    age: '18',
    id: '111076'
  },
  {
    name: 'Deborah Adekunle',
    role: 'Child',
    age: '12',
    id: '111076'
  },
  {
    name: 'Samuel Adekunle',
    role: 'Brother',
    age: '32',
    id: '111076'
  }
]

const page = () => {
  return (
    <section className='flex gap-4'>
      <div className="bg-[#FFFFFF] px-6 rounded-[10px] py-3 w-full space-y-4">
        <h3 className='text-lg font-semibold'>Coverage Members</h3>
        <div className='grid grid-cols-3 gap-3'>
          {members.map((item, index) => {
            const main = item.role === 'Primary'
            return (
              <div key={index} className='p-3 border border-[#D9D9D9] rounded-[10px] space-y-4'>
                <div className='flex justify-between'>
                  <div className='flex gap-1'>
                    <div className='rounded-full inline-flex p-5 bg-emerald-700 h-fit'></div>
                    <div>
                      <h3 className='text-[16px] font-semibold'>{item.name}</h3>
                      <p className='text-sm'>{item.role}</p>
                    </div>
                  </div>
                  <div>
                    {main ? <p className='bg-[#49A5EF1A] text-[#49A5EF] rounded-full px-2 py-1 w-fit text-sm'>{item.role}</p> : ""}
                  </div>
                </div>
                <div className='flex justify-between text-[15px]'>
                  <p>Age: {item.age} years</p>
                  <p>ID: {item.id}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default page