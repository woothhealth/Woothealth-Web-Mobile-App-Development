'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { RiDoubleQuotesR } from 'react-icons/ri'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const testimonials = [
  {
    id: 1,
    name: "Abiodun Olaniyi",
    role: "Core plan",
    ini: "AO",
    quote: "Getting covered was so easy! I signed up in less than 10 minutes and had my insurance card the same day.",
    image: "https://picsum.photos/100/100?random=10"
  },
  {
    id: 2,
    name: "Amaka Johnson",
    role: "Sync Plan",
    ini: "AJ",
    quote: "Affordable and reliable! I've used my coverage at three different hospitals, and each time the process was seamless. The monthly premium fits my budget perfectly, and I get quality healthcare when I need it.",
    image: "https://picsum.photos/100/100?random=11"
  },
  {
    id: 3,
    name: "Tunde Adebayo",
    role: "Nexus Plan",
    ini: "TA",
    quote: "After comparing several insurance providers, Woot Health stood out. The transparent pricing, no hidden fees, and quick claim approvals make them the best. I've recommended them to all my friends.",
    image: "https://picsum.photos/100/100?random=12"
  },
  {
    id: 4,
    name: "Funmi Ajayi",
    role: "Nexus Plan",
    ini: "FA",
    quote: "I needed insurance but didn't want to break the bank. Woot Health gave me exactly what I needed at a price I could afford.",
    image: "https://picsum.photos/100/100?random=13"
  },
  {
    id: 5,
    name: "Kunle Adeleke",
    role: "Core Plan",
    ini: "KA",
    quote: "Signed up in minutes, got covered immediately. The app makes everything so easy.",
    image: "https://picsum.photos/100/100?random=14"
  },
  {
    id: 6,
    name: "Abiodun Taiwo",
    role: "Sync Plan",
    ini: "AT",
    quote: "Getting covered was so easy! I signed up in less than 10 minutes and had my insurance card the same day.",
    image: "https://picsum.photos/100/100?random=15"
  }
]

const TestimonySecond = () => {
  const [current, setCurrent] = useState(0)
  const itemsPerPageDesktop = 3
  const itemsPerPageMobile = 1
  const scrollRef = useRef(null)

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % Math.ceil(testimonials.length / itemsPerPageDesktop))
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + Math.ceil(testimonials.length / itemsPerPageDesktop)) % Math.ceil(testimonials.length / itemsPerPageDesktop))
  }

  const visibleTestimonialsDesktop = testimonials.slice(current * itemsPerPageDesktop, (current + 1) * itemsPerPageDesktop)

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) { // small tolerance
          scrollRef.current.scrollLeft = 0;
        } else {
          scrollRef.current.scrollLeft += 320; 
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="py-8 lg:px-12 md:px-6 px-4 bg-[#49A5EF] text-[#FFFFFF]">
      <div className='flex flex-col items-center justify-center gap-10 text-center'>
        <h3 className='lg:text-[45px] text-[38px] leading-tight'>
            What Our Customers Say?
        </h3>

        {/* Desktop scrollable */}
        <div className="hidden md:block relative mx-auto max-w-5xl">
          <div className="flex gap-4 justify-center">
            {visibleTestimonialsDesktop.map((item) => (
              <div key={item.id} className="relative flex-1 max-w-sm border border-[#E1E1E2] rounded-4xl p-4 h-64">
                <div className="flex items-center gap-3 pb-5 border-b border-[#E1E1E2]">
                  <div className='w-14 h-14 rounded-full bg-[rgba(233,233,245,0.6)] flex items-center justify-center text-xl font-bold'>
                    {item.ini}
                  </div>
                  <div className="text-left flex flex-col gap-1">
                    <p className="font-bold tracking-wide text-[18px] uppercase">{item.name}</p>
                    <p className="text-[12px] uppercase tracking-wide">{item.role}</p>
                  </div>
                </div>
                <p className="text-[16px] font-serif leading-tight text-justify mb-8 mt-3 z-5">
                  {item.quote}
                <RiDoubleQuotesR className="absolute bottom-0 right-0 text-[#067cde80] text-9xl" />
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
        <div className="relative md:hidden overflow-x-auto max-w-full custom-scrollbar pb-4" ref={scrollRef}>
          <div className="flex gap-4 px-4">
            {testimonials.map((item) => (
              <div key={item.id} className="relative shrink-0 w-80 border border-[#E1E1E2] rounded-4xl p-4 h-70">
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
                <RiDoubleQuotesR className="absolute bottom-0 right-0 text-[#067cde80] text-9xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
          margin-top: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ffffff;
          border-radius: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e0e0e0;
        }
      `}</style>
    </section>
  )
}

export default TestimonySecond