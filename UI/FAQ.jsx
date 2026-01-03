'use client'

import React, { useState } from 'react'
import { FaChevronUp } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa6';
import faqData from "@/data/faq.json";
import { Reveal } from './Reveal';


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
    <section className='py-16 lg:px-[68px] md:px-10 px-6'>
        <div className='md:px-16 px-0 flex justify-center'>
            <div className='flex flex-col gap-4 w-4xl'>
                <Reveal>
                <h3 className='text-[32px] font-semibold'>
                    Frequently asked questions
                </h3>
                </Reveal>
                <div>
                    {uiFaqs.map((faq) => {
                        const [istoggle, setIsToggle] = useState(false)
                        return (
                            <Reveal key={faq.index}>
                            <div className='flex flex-col gap-3 py-4 border-b'>
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
                        </Reveal>
                        )
                    })}
                </div>
            </div>
        </div>
    </section>
  )
}

export default FAQ