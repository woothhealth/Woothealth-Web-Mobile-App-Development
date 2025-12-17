'use client'

import React, { useState } from 'react'
import { FaCheckCircle, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import { FaPhone } from 'react-icons/fa6'

const Contact = () => {
    const getInTouch = [
        {
            icon: <FaMapMarkerAlt/>,
            title: 'Location',
            desc: 'Oregun-Ikeja, Lagos, Nigeria'
        },
        {
            icon: <FaEnvelope/>,
            title: 'Email Us',
            desc: 'support@woothealth.com'
        },
        {
            icon: <FaPhone/>,
            title: 'Call Us',
            desc: '+234 0098762354, +234 0098762354'
        }
    ]

    const [formData, setFormData] = useState({
    name: '',
    company: '',
    subject: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    company: '',
    subject: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors = { name: '', company: '', subject: '', email: '', message: '' };
    let hasError = false;

    if (!formData.name.trim()) {
      newErrors.name = 'Field not filled';
      hasError = true;
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Field not filled';
      hasError = true;
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Field not filled';
      hasError = true;
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Field not filled';
      hasError = true;
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Field not filled';
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form after successful submission
      setFormData({
        name: '',
        company: '',
        subject: '',
        email: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <section className='grid md:grid-cols-2 grid-cols-1 gap-10 pt-10 pb-12 lg:px-[68px] md:px-10 px-6'>
        <div className='flex flex-col gap-6 md:px-4 px-0'>
            <div className='border-b pb-6'>
                <h2 className='text-[30px] mb-4'>Get in touch</h2>
                <p>Reach out to our team with any inquiries. We're committed to providing you with prompt, helpful responses.</p>
            </div>
            <div className='flex flex-col gap-5'>
                {getInTouch.map((touch, index) => (
                    <div key={index} className='flex gap-6 items-center'>
                        <div className='flex items-center justify-center bg-[#49A5EF] text-[#FFFFFF] h-10 w-10 rounded-full'>
                        {touch.icon}
                        </div>
                        <div className='leading-tight'>
                            <h3 className='font-semibold'>{touch.title}</h3>
                            <p>{touch.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className='md:px-5 flex flex-col gap-8 border-[#E5E7EB] border-b rounded-2xl pt-3 pb-6'>
            <div>
                <h2 className='text-[30px] mb-4'>Send a message</h2>
                <p className='text-justify'>We're just a message away. Contact us anytime for questions about your coverage, claims support, or anything else we can help with.</p>
            </div>
            <div>

            {/* Contact Form, Submitted and Not */}
             {isSubmitted ? (
                <div className="text-center border-green-200 py-4 mx-6 md:mx-0">
                  <FaCheckCircle className="h-16 w-16 text-green-600/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className=" mb-4">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-[#49A5EF]/780 text-white px-5 py-3 rounded-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className='flex flex-col gap-2'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4 items-center justify-center mx-4 md:mx-0'>
                    <div className='flex flex-col md:flex-row gap-6 w-full'>
                        <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor="Name">
                                Name
                            </label>
                            <input type="text" placeholder='Name' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-sm px-2.5 py-1.5' id="name" name="name" value={formData.name} onChange={handleChange} />
                            {errors.name && <span className="text-red-500/60 text-sm">{errors.name}</span>}
                        </div>
                        <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor="company">
                                Company
                            </label>
                            <input type="text" name='company' id="company" placeholder='Company' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-sm px-2.5 py-1.5' value={formData.company} onChange={handleChange}/>
                            {errors.company && <span className="text-red-500/60 text-sm">{errors.company}</span>}
                        </div>
                    </div>
                    <div className='flex gap-6 w-full flex-col md:flex-row'>
                        <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor="subject">
                                Subject
                            </label>
                            <input type="text" placeholder='Subject' name='subject' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-sm px-2.5 py-1.5' id="subject" value={formData.subject} onChange={handleChange} />
                            {errors.subject && <span className="text-red-500/60 text-sm">{errors.subject}</span>}
                        </div>
                        <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor="email">
                                Email
                            </label>
                            <input type="email" name='email' placeholder='Email' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-sm px-2.5 py-1.5' id="email" value={formData.email} onChange={handleChange} />
                            {errors.email && <span className="text-red-500/60 text-sm">{errors.email}</span>}
                        </div>
                    </div>
                    <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor="message">
                                Message
                            </label>
                            <textarea name='message' placeholder='Write a message' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-sm px-2.5 py-1 resize-none h-20' value={formData.message} onChange={handleChange}></textarea>
                            {errors.message && <span className="text-red-500/60 text-sm">{errors.message}</span>}
                    </div>
                    <button type='submit' disabled={isSubmitting} className='bg-[#49A5EF] text-[#FFFFFF] px-8 py-3 rounded-sm w-fit mt-2'>
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
            )}
            </div>
        </div>
    </section>
  )
}

export default Contact