'use client'

import React, { useState } from 'react'
import { FaChevronUp } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa6';

const FAQ = () => {
    const questions = [
        {
            ques: 'How does the Woot Wallet work?',
            answer: 'You can top up anytime and use it to pay for treatments when your plan limit is exhausted.'
        },
        {
            ques: 'Which hospitals can i access?',
            answer: 'You can top up anytime and use it to pay for treatments when your plan limit is exhausted.'
        },
        {
            ques: 'How fast is onboarding?',
            answer: 'You can top up anytime and use it to pay for treatments when your plan limit is exhausted.'
        },
        {
            ques: 'Can i get a plan for my family?',
            answer: 'You can top up anytime and use it to pay for treatments when your plan limit is exhausted.'
        },
        {
            ques: 'Do you cover emergencies?',
            answer: 'You can top up anytime and use it to pay for treatments when your plan limit is exhausted.'
        },
        {
            ques: 'How do i contact support?',
            answer: 'You can top up anytime and use it to pay for treatments when your plan limit is exhausted.'
        }
    ]

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
                <h3 className='text-[32px] font-semibold'>
                    Frequently asked questions
                </h3>
                <div>
                    {questions.map((question, index) => {
                        const [istoggle, setIsToggle] = useState(false)
                        return (
                            <div key={index} className='flex flex-col gap-3 py-4 border-b'>
                                <div onClick={() => toggleFAQ(index)}>
                                    <h3 className='flex justify-between cursor-pointer items-center font-semibold text-[16px]' >
                                        {question.ques} {openIndex === index ? <FaChevronUp className='text-[.7rem]'/> : <FaChevronDown className='text-[.7rem]'/>}
                                    </h3>
                                </div>
                                {openIndex === index && (
                                    <div className="faq-answer">
                                        <p className='text-[.9rem]'>{question.answer}</p>
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