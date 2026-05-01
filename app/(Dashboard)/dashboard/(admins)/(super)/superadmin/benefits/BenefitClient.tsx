'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { IoMdCheckmarkCircleOutline, IoMdAdd, IoMdRemove } from 'react-icons/io'

const initialPricingPlans = [
    {
        id: 1,
        name: "Core",
        price: "102,300",
        year: "quarter",
        enrollee: "23",
        annual: "500,000",
        status: "active",
        features: [
            "GP Consultation",
            "Emergency care",
            "Telemedicine Consultation Covered",
            "Immunizations",
            "Optical Care",
            "Dental Care",
            "Antenatal Care"
        ]
    },
    {
        id: 2,
        name: "Sync",
        price: "156,750",
        year: "quarter",
        enrollee: "23",
        annual: "500,000",
        status: "active",
        features: [
            "GP Consultation",
            "Emergency care",
            "Telemedicine Consultation Covered",
            "Immunizations",
            "Optical Care",
            "Dental Care",
            "Antenatal Care"
        ]
    },
    {
        id: 3,
        name: "Nexus",
        price: "341,550",
        year: "quarter",
        enrollee: "23",
        annual: "500,000",
        status: "active",
        features: [
            "GP Consultation",
            "Emergency care",
            "Telemedicine Consultation Covered",
            "Immunizations",
            "Optical Care",
            "Dental Care",
            "Antenatal Care"
        ]
    },
    {
        id: 4,
        name: "Quantum",
        price: "2,966,700",
        year: "annual",
        enrollee: "23",
        annual: "500,000",
        status: "suspended",
        features: [
            "GP Consultation",
            "Emergency care",
            "Telemedicine Consultation Covered",
            "Immunizations",
            "Optical Care",
            "Dental Care",
            "Antenatal Care",
            "Gym",
            "Spa"
        ]
    },
    {
        id: 5,
        name: "Iginite",
        price: "6,545,000",
        year: "annual",
        enrollee: "23",
        annual: "500,000",
        status: "suspended",
        features: [
            "GP Consultation",
            "Emergency care",
            "Telemedicine Consultation Covered",
            "Immunizations",
            "Optical Care",
            "Dental Care",
            "Antenatal Care",
            "Gym",
            "Spa"
        ]
    }
]

const BenefitClient = () => {
    const [plans, setPlans] = useState(initialPricingPlans)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editedPlan, setEditedPlan] = useState<Partial<typeof initialPricingPlans[0]>>({})

    const statusColors: { [key: string]: string } = {
        active: 'bg-[#D1FAE5] text-[#10B981]',
        suspended: 'bg-[#FEE2E2] text-[#EF4444]',
    };

    const handleEdit = (plan: typeof initialPricingPlans[0]) => {
        setEditingId(plan.id)
        setEditedPlan({ ...plan })
    }

    const handleSave = () => {
        if (editingId) {
            setPlans(plans.map(plan => plan.id === editingId ? { ...plan, ...editedPlan } : plan))
            setEditingId(null)
            setEditedPlan({})
        }
    }

    const handleCancel = () => {
        setEditingId(null)
        setEditedPlan({})
    }

    const handleChange = (field: keyof typeof editedPlan, value: any) => {
        setEditedPlan(prev => ({ ...prev, [field]: value }))
    }

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...(editedPlan.features || [])]
        newFeatures[index] = value
        setEditedPlan(prev => ({ ...prev, features: newFeatures }))
    }

    const removeFeature = (index: number) => {
        const newFeatures = (editedPlan.features || []).filter((_, i) => i !== index)
        setEditedPlan(prev => ({ ...prev, features: newFeatures }))
    }

    return (
        <section className='py-4 md:p-4'>
            <div className='my-6 md:w-full mx-auto w-[85%] flex flex-col gap-8 overflow-x-auto md:overflow-hidden formDiv'>
                <div className='flex gap-8 md:grid grid-cols-3'>
                    {plans.map((plan) => (
                        <div key={plan.id} className='bg-[#FFFFFF] rounded-[10px] text-[#000000] shadow-lg h-full pb-8'>
                            <div className='w-76 md:w-full flex flex-col gap-4'>
                                <div className='bg-[#49A5EFB2] rounded-t-[10px] text-[#FFFFFF] py-4 px-4'>
                                    {editingId === plan.id ? (
                                        <input
                                            type="text"
                                            value={editedPlan.name || ''}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            className='text-[24px] font-semibold mb-3 bg-transparent border-b border-white text-white placeholder-white outline-0 w-fit'
                                            placeholder="Plan Name"
                                        />
                                    ) : (
                                        <h3 className='text-[24px] font-semibold mb-3'>Retail {plan.name}</h3>
                                    )}
                                    <p className=' text-[#FFFFFF] text-start w-fit flex flex-col'>
                                        <span>For as low as</span>
                                        {editingId === plan.id ? (
                                            <input
                                                type="text"
                                                value={editedPlan.price || ''}
                                                onChange={(e) => handleChange('price', e.target.value)}
                                                className='font-bold text-[20px] bg-transparent border-b border-white text-white placeholder-white'
                                                placeholder="Price"
                                            />
                                        ) : (
                                            <span className='font-bold text-[20px]'> ₦{plan.price}/ {plan.year}</span>
                                        )}
                                    </p>
                                </div>
                                <div className='px-4'>
                                    <p className='flex justify-between w-full'>
                                        <span className=''>Enrollees</span>
                                        {editingId === plan.id ? (
                                            <input
                                                type="text"
                                                value={editedPlan.enrollee || ''}
                                                onChange={(e) => handleChange('enrollee', e.target.value)}
                                                className='text-base border-b border-gray-300 w-full'
                                                placeholder="Enrollees"
                                            />
                                        ) : (
                                            <span className='text-lg font-semibold'>{plan.enrollee}</span>
                                        )}
                                    </p>
                                    <p className='flex justify-between w-full'>
                                        <span className=''>Annual limit</span>
                                        {editingId === plan.id ? (
                                            <input
                                                type="text"
                                                value={editedPlan.annual || ''}
                                                onChange={(e) => handleChange('annual', e.target.value)}
                                                className='text-base border-b border-gray-300 w-fit'
                                                placeholder="Annual limit"
                                            />
                                        ) : (
                                            <span className='text-lg font-semibold'>{plan.annual}</span>
                                        )}
                                    </p>
                                    <p className='flex justify-between'>
                                        <span className=''>Enrollees status</span>
                                        {editingId === plan.id ? (
                                            <select
                                                value={editedPlan.status || ''}
                                                onChange={(e) => handleChange('status', e.target.value)}
                                                className='px-3 py-1 rounded-full text-sm border-b border-gray-300'
                                            >
                                                <option value="active">Active</option>
                                                <option value="suspended">Suspended</option>
                                            </select>
                                        ) : (
                                            <span className={`px-3 py-1 rounded-full text-sm ${statusColors[plan.status] || 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                                                {plan.status}
                                            </span>
                                        )}
                                    </p>
                                    {editingId === plan.id && (
                                        <p className='flex justify-between'>
                                            <span className=''>Year</span>
                                            <select
                                                value={editedPlan.year || ''}
                                                onChange={(e) => handleChange('year', e.target.value)}
                                                className='text-base border-b border-gray-300'
                                            >
                                                <option value="quarter">Quarter</option>
                                                <option value="annual">Annual</option>
                                                <option value="bi-annual">Bi-annual</option>
                                            </select>
                                        </p>
                                    )}
                                </div>
                                <div className='flex flex-col items-start px-4 gap-2'>
                                    <p className='text-lg font-semibold'>Benefits included:</p>
                                    {editingId === plan.id ? (
                                        <div className='mb-4 text-left ml-2'>
                                            {(editedPlan.features || []).map((feature, index) => (
                                                <div key={index} className='mb-1 flex items-center gap-2'>
                                                    <input
                                                        type="text"
                                                        value={feature}
                                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                                        className='border-b border-gray-300 text-[#120052]'
                                                        placeholder="Feature"
                                                    />
                                                    <button onClick={() => removeFeature(index)} className='text-red-500'>
                                                        <IoMdRemove />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <ul className='mb-4 text-left ml-2'>
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className='mb-1 flex items-center gap-2 text-[#120052]'>
                                                    <IoMdCheckmarkCircleOutline className='text-[#10B981]'/>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {editingId === plan.id ? (
                                        <div className='flex gap-2 w-full'>
                                            <button onClick={handleSave} className='bg-[#49A5EF] text-white flex justify-center py-3 rounded-[5px] w-full font-semibold'>
                                                Save
                                            </button>
                                            <button onClick={handleCancel} className='bg-gray-500 text-white flex justify-center py-3 rounded-[5px] w-full font-semibold'>
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button onClick={() => handleEdit(plan)} className='bg-[#49A5EF] text-white flex justify-center py-3 rounded-[5px] w-full font-semibold'>
                                            Edit Benefits
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default BenefitClient