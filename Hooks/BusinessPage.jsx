import React from 'react'
import HeroSection from '@/Components/BusinessPage/HeroSection'
import WhySection from '@/Components/BusinessPage/WhySection'
import AdvantageSection from '@/Components/BusinessPage/AdvantageSection'
import GetQuote from '@/Components/BusinessPage/GetQuote'
import TestimonySecond from '../UI/TestimonySecond'
import FAQ from '../UI/FAQ'
import Talk from '@/UI/Talk'

const BusinessPage = () => {
  return (
    <>
        {/* <Talk/> */}
        <HeroSection/>
        <WhySection/>
        <AdvantageSection/>
        <GetQuote/>
        <TestimonySecond/>
        <FAQ/>
    </>
  )
}

export default BusinessPage