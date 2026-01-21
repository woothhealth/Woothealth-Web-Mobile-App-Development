import React from 'react'

const plan = [
    {
        name: "Core",
        number: "30"
    },
    {
        name: "Sync",
        number: "20"
    },
    {
        name: "Nexus",
        number: "20"
    },
    {
        name: "Quantum",
        number: "20"
    },
    {
        name: "Ignite",
        number: "10"
    },
]

const page = () => {
  return (
    <section className='py-4 md:p-4 flex flex-col gap-3 bg-[#FFFFFF] rounded-2xl'>
        <h3 className='text-[20px] font-semibold'>Plan Details</h3>
        <div>
            <table>
                <thead>
                    <tr className='text-[17px]'>
                        <td>Plan Name</td>
                        <td className='pl-20'>No of employees</td>
                    </tr>
                </thead>
                <tbody className=''>
                    {plan.map((item, index) => (
                        <tr key={index} className='bg-[#E5E7EB33] font-bold'>
                            <td className='rounded-[10px] px-4 py-3'>{item.name}</td>
                            <td className='px-6 py-3 text-end'>{item.number}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </section>
  )
}

export default page