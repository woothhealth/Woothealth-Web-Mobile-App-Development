'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { RiDoubleQuotesR } from 'react-icons/ri'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const testimonials = [
  {
    id: 1,
    name: "Abiodun Olaniyi",
    role: "Starter plan",
    quote: "Getting covered was so easy! I signed up in less than 10 minutes and had my insurance card the same day.",
    image: "https://picsum.photos/100/100?random=10"
  },
  {
    id: 2,
    name: "Amaka Johnson",
    role: "Premium Plan",
    quote: "Affordable and reliable! I've used my coverage at three different hospitals, and each time the process was seamless. The monthly premium fits my budget perfectly, and I get quality healthcare when I need it.",
    image: "https://picsum.photos/100/100?random=11"
  },
  {
    id: 3,
    name: "Tunde Adebayo",
    role: "Starter Plan",
    quote: "After comparing several insurance providers, Woot Health stood out. The transparent pricing, no hidden fees, and quick claim approvals make them the best. I've recommended them to all my friends.",
    image: "https://picsum.photos/100/100?random=12"
  },
  {
    id: 4,
    name: "Funmi Ajayi",
    role: "Starter Plan",
    quote: "I needed insurance but didn't want to break the bank. Woot Health gave me exactly what I needed at a price I could afford.",
    image: "https://picsum.photos/100/100?random=13"
  },
  {
    id: 5,
    name: "Kunle Adeleke",
    role: "Essential Plan",
    quote: "Signed up in minutes, got covered immediately. The app makes everything so easy.",
    image: "https://picsum.photos/100/100?random=14"
  },
  {
    id: 6,
    name: "Abiodun Olaniyi",
    role: "Starter Plan",
    quote: "Getting covered was so easy! I signed up in less than 10 minutes and had my insurance card the same day.",
    image: "https://picsum.photos/100/100?random=15"
  }
]

const TestimonySection = () => {
  const [current, setCurrent] = useState(0)
  const itemsPerPageDesktop = 3
  const itemsPerPageMobile = 1

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % Math.ceil(testimonials.length / itemsPerPageDesktop))
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + Math.ceil(testimonials.length / itemsPerPageDesktop)) % Math.ceil(testimonials.length / itemsPerPageDesktop))
  }

  const visibleTestimonialsDesktop = testimonials.slice(current * itemsPerPageDesktop, (current + 1) * itemsPerPageDesktop)

  return (
    <section id="testimonials" className="py-8 lg:px-12 md:px-6 px-4">
      <div className='flex flex-col items-center justify-center gap-8 text-center'>
        <h3 className='lg:text-[54px] text-[38px] leading-tight'>
          Loved by thousands of Nigerians
        </h3>
        {/* Desktop: Show 3 testimonials with navigation */}
        <div className="hidden md:block relative mx-auto max-w-6xl">
          <div className="flex gap-4 justify-center">
            {visibleTestimonialsDesktop.map((item) => (
              <div key={item.id} className="relative flex-1 max-w-sm border border-[#E1E1E2] rounded-4xl p-4 h-70">
                <div className="flex items-center gap-3 pb-5 border-b border-[#E1E1E2]">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    width={56} 
                    height={56}
                    className="w-14 h-14 rounded-full grayscale object-cover" 
                  />
                  <div className="text-left flex flex-col gap-1">
                    <p className="font-bold tracking-wide text-[20px] uppercase">{item.name}</p>
                    <p className="text-[12px] uppercase tracking-wide">{item.role}</p>
                  </div>
                </div>
                <p className="text-[16px] md:text-[18px] font-serif leading-relaxed mb-8 mt-3 text-start">
                  {item.quote}
                <RiDoubleQuotesR className="absolute bottom-0 right-0 text-[#49A5EF80] text-9xl" />
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-10 mt-7">
            <button onClick={prevSlide} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
              <FaChevronLeft />
            </button>
            <button onClick={nextSlide} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
              <FaChevronRight />
            </button>
          </div>
        </div>
        {/* Mobile: Horizontal scrollable list */}
        <div className="md:hidden overflow-x-auto max-w-full">
          <div className="flex gap-4 px-4">
            {testimonials.map((item) => (
              <div key={item.id} className="shrink-0 w-80 border border-[#E1E1E2] rounded-4xl p-4 h-70">
                <div className="flex items-center gap-3 pb-5 border-b border-[#E1E1E2]">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    width={56} 
                    height={56}
                    className="w-14 h-14 rounded-full grayscale object-cover" 
                  />
                  <div className="text-left flex flex-col gap-1">
                    <p className="font-bold tracking-wide text-[20px] uppercase">{item.name}</p>
                    <p className="text-[12px] uppercase tracking-wide">{item.role}</p>
                  </div>
                </div>
                <p className="text-[16px] md:text-[18px] font-serif leading-relaxed mb-8 mt-3 text-start">
                  {item.quote}
                </p>
                <RiDoubleQuotesR className="absolute bottom-0 right-0 text-[#49A5EF80] text-9xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonySection