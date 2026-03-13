import React from 'react'
import HeroSection from '../Components/RetailPage/HeroSection'
import CTA from '../Components/RetailPage/CTA'
import TestimonySecond from '@/UI/TestimonySecond'
import FAQ from '@/UI/FAQ'
import WhySection from '@/Components/RetailPage/WhySection'
import Pricing from '@/Components/RetailPage/Pricing'
import Talk from '@/UI/Talk'

const RetailPage = () => {
  return (
    <>
        {/* <Talk/> */}
        <HeroSection/>
        <WhySection/>
        <Pricing/>
        <CTA/>
        <TestimonySecond/>
        <FAQ/>
    </>
  )
}

export default RetailPage