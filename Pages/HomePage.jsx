import React from 'react'
import HomeSection from '@/Components/HomePage/HeroSection'
import CoverageSection from '../Components/HomePage/CoverageSection'
import BenefitSection from '../Components/HomePage/BenefitSection'
import AboutSection from '../Components/HomePage/AboutSection'
import ProviderSection from '../Components/HomePage/ProviderSection'
import TestimonySection from '../UI/TestimonySection'
import FAQ from '../UI/FAQ'
import HomeArticle from '../Components/HomePage/HomeArticle'

const HomePage = () => {
  return (
    <>
        <HomeSection />
        <CoverageSection />
        <BenefitSection />
        <AboutSection />
        <ProviderSection />
        <TestimonySection/>
        <HomeArticle />
        <FAQ />
    </>
  )
}

export default HomePage