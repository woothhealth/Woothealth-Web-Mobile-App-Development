"use client";

import { useState } from "react";
import faqData from "@/data/faq.json";
import React from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const MainFaq = () => {
  // Initialize selection to the first category to avoid undefined
  const [activeCategory, setActiveCategory] = useState(
    faqData?.categories?.[0] ?? { id: 0, title: "", faqs: [] }
  );

  const handleSelect = (categoryId: number) => {
    const cat = faqData.categories.find((c) => c.id === categoryId);
    if (cat) setActiveCategory(cat);
  };
  
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-22">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-20 h-[65svh]">

        {/* Left Div: For user to select category they want */}
        <aside className="md:col-span-1 space-y-3 overflow-y-auto custom-scrollbar pr-3">
          {faqData.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleSelect(category.id)}
              className={`w-full text-center px-6 py-3 rounded-lg border transition
                ${
                  activeCategory?.id === category.id
                    ? "bg-[#49A5EF] text-[#FFFFFF] border-0 font-semibold"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              aria-pressed={activeCategory?.id === category.id}
            >
              {category.title}
            </button>
          ))}
        </aside>

        {/* Right Div: For tagged question and answer */}
        <main className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-6">
            {activeCategory?.title || "Select a category"}
          </h2>

          <div className="space-y-4 text-justify ">
            {(activeCategory?.faqs ?? []).length ? (
              (activeCategory.faqs ?? []).slice(0, 10).map((faq) => (
                <article key={faq.index} className="border-b border-[#B6B6B9] pb-3">
                  <button className="font-medium text-lg w-full flex items-center justify-between" onClick={() => toggleFAQ(faq.index)}
                  aria-expanded={openIndex === faq.index}>
                    <span>{faq.question}</span>
                    <span>
                      {openIndex === faq.index ? <FaChevronUp className='text-[.7rem]'/> : <FaChevronDown className='text-[.7rem]'/>} 
                    </span>
                  </button>

                  <div
                    className={`faq-answer transition-all duration-200 overflow-hidden ${
                      openIndex === faq.index
                        ? "max-h-[800px] opacity-100 mt-2.5"
                        : "max-h-0 opacity-0"
                    }`}
                    aria-hidden={openIndex === faq.index ? "false" : "true"}
                  >
                    <p className="text-gray-700 ml-2 max-w-xl">{faq.answer}</p>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-gray-600">No FAQs in this category.</p>
            )}
          </div>
        </main>
      </div>
      <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #234b6b;
            border-radius: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #364153;
          }
        `}</style>
    </section>

  );
}

export default MainFaq