"use client";

import { useState } from "react";
import faqData from "@/data/faq.json";
import React from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Reveal } from "@/UI/Reveal";
import { AnimatePresence, motion } from "motion/react";

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
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 lg:h-[65svh]">

        {/* Left Div: For user to select category they want */}
        <aside className="md:col-span-1 space-y-3 overflow-y-auto custom-scrollbar pr-3 h-48 lg:h-full">
          {faqData.categories.map((category) => (
            <Reveal key={category.id}>
            <button
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
            </Reveal>
          ))}
        </aside>

        {/* Right Div: For tagged question and answer */}
        <main className="md:col-span-2">
          <Reveal>
          <h2 className="text-2xl font-semibold mb-6">
            {activeCategory?.title || "Select a category"}
          </h2>
          </Reveal>

          <div className="space-y-4 text-justify ">
            <AnimatePresence>
            {(activeCategory?.faqs ?? []).length ? (
              (activeCategory.faqs ?? []).slice(0, 10).map((faq) => (
                <Reveal key={faq.index}>
                <article className="border-b border-[#B6B6B9] pb-4">
                  <button className="font-medium text-lg w-full flex items-center justify-between text-start" onClick={() => toggleFAQ(faq.index)}
                  aria-expanded={openIndex === faq.index}>
                    <span>{faq.question}</span>
                    <span>
                      {openIndex === faq.index ? <FaChevronUp className='text-[.7rem]'/> : <FaChevronDown className='text-[.7rem]'/>} 
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden ${
                      openIndex === faq.index
                      ? "max-h-[800px] opacity-100 mt-2.5"
                      : "max-h-0 opacity-0"
                    }`}
                    aria-hidden={openIndex === faq.index ? "false" : "true"}
                    >
                    <motion.p
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 1}}
                    transition={{delay: 0.2, duration: 0.5}}
                    exit={{opacity: 0}} className="text-gray-700 ml-2 max-w-xl">{faq.answer}</motion.p>
                  </div>
                </article>
                </Reveal>
              ))
            ) : (
              <p className="text-gray-600">No FAQs in this category.</p>
            )}
            </AnimatePresence>
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