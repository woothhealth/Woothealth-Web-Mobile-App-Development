import React from 'react'
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const HelpPanel = () => {
  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
      <p className="text-gray-600 mb-6">
        Contact our support team for questions about Woot Health HMO
      </p>
      <div className="space-y-4">
        <a href="tel:02018877500" className='bg-[#49A5EF1A] text-primary px-4 py-2 rounded-lg flex items-center gap-2'>
          <span className='flex gap-2 items-center'><FaPhoneAlt/>02018877500</span>
        </a>
        <a href="mailto:support@woothealth.com" className='bg-[#8063E81A] text-[#8063E8] px-4 py-2 rounded-lg flex items-center gap-2'>
          <span className='flex gap-2 items-center'><FaEnvelope/>support@woothealth.com</span>
        </a>
      </div>
    </section>
  )
}

export default HelpPanel