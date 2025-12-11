'use client'

import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Image from 'next/image';
import { RiDoubleQuotesR } from 'react-icons/ri';

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
    image: "https://picsum.photos/100/100?random=12"
  },
  {
    id: 5,
    name: "Kunle Adeleke",
    role: "Essential Plan",
    quote: "Signed up in minutes, got covered immediately. The app makes everything so easy.",
    image: "https://picsum.photos/100/100?random=12"
  },
  {
    id: 6,
    name: "Abiodun Olaniyi",
    role: "Starter Plan",
    quote: "Getting covered was so easy! I signed up in less than 10 minutes and had my insurance card the same day.",
    image: "https://picsum.photos/100/100?random=12"
  }
];

const TestimonySection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-8">
      <div className="mx-auto px-6">
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
          <div className="relative w-full overflow-hidden flex items-center justify-center border border-[#E1E1E2] rounded-4xl p-4 md:px-6 md:py-8">
            {testimonials.map((item, index) => (
              <div 
                key={item.id}
                className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ease-in-out ${
                  index === currentIndex 
                    ? 'opacity-100 translate-x-0 relative' 
                    : 'opacity-0 translate-x-20 absolute pointer-events-none'
                }`}
                aria-hidden={index !== currentIndex}
              >
                <div className="flex items-center gap-3 pb-5 border-b border-[#E1E1E2]">
                  <img 
                    src={item.image} 
                    alt={item.name} width={100} height={100}
                    className="w-14 h-14 rounded-full grayscale object-cover" loading='lazy'
                  />
                  <div className="text-left flex flex-col gap-1">
                    <p className="font-bold tracking-wide text-[20px] uppercase">{item.name}</p>
                    <p className="text-[14px] uppercase tracking-wide">{item.role}</p>
                  </div>
                </div>
                <p className="text-[18px] md:text-[20px] font-serif leading-relaxed mb-8 mt-3">
                  {item.quote}
                </p>
                
                <RiDoubleQuotesR className="absolute bottom-0 right-0 text-[#49A5EF80] text-8xl" />
              </div>
            ))}
          </div>

          <div className="flex gap-8 mt-6">
            <button 
              onClick={prevSlide}
              className="p-3 border border-gray-700 rounded-full text-gray-400 hover:text-white hover:border-white hover:bg-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous testimonial"
            >
              <FaChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="p-3 border border-gray-700 rounded-full text-gray-400 hover:text-white hover:border-white hover:bg-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next testimonial"
            >
              <FaChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonySection