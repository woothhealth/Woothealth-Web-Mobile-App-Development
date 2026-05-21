'use client'

import React, { useState } from 'react'
import { FaChevronUp } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa6';
import faqData from "@/data/FAQPr.json";


const FAQ = () => {
    const allFaqs = faqData.categories.flatMap( (category) => category.faqs);

    const uiFaqs = allFaqs.slice(0, 6);
    
    const [openIndex, setOpenIndex] = React.useState(null);
    
    const toggleFAQ = (index) => {
        if (openIndex === index) {
            setOpenIndex(null);
        } else {
            setOpenIndex(index);
        }
    }


  return (
    <section className='w-full h-110 overflow-auto custom-scrollbar'>
        <div className='flex w-full'>
            <div className='flex flex-col gap-4'>
                <h3 className='text-[32px] font-semibold'>
                    Frequently asked questions
                </h3>
                <div>
                    {uiFaqs.map((faq) => {
                        const [istoggle, setIsToggle] = useState(false)
                        return (
                            <div key={faq.index} className='flex flex-col gap-3 py-4 border-b w-full'>
                                <div onClick={() => toggleFAQ(faq.index)}>
                                    <h3 className='flex justify-between cursor-pointer items-center font-semibold text-[16px]' >
                                        {faq.question} {openIndex === faq.index ? <FaChevronUp className='text-[.7rem]'/> : <FaChevronDown className='text-[.7rem]'/>}
                                    </h3>
                                </div>
                                {openIndex === faq.index && (
                                    <div className="faq-answer">
                                        <p className='text-[.9rem]'>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    </section>
  )
}

export default FAQ