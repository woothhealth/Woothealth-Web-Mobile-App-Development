import React from 'react'
import HomeSection from '@/Components/HomePage/HeroSection'
import CoverageSection from '../Components/HomePage/CoverageSection'
import BenefitSection from '../Components/HomePage/BenefitSection'
import AboutSection from '../Components/HomePage/AboutSection'
import ProviderSection from '../Components/HomePage/ProviderSection'
import TestimonySection from '../UI/TestimonySection'
import FAQ from '../UI/FAQ'
import HomeArticle from '../Components/HomePage/HomeArticle'
import WalletSection from '../Components/HomePage/WalletSection'
import MarqueeSection from '../Components/HomePage/MarqueeSection'
import Talk from '@/UI/Talk'

const HomePage = () => {
  return (
    <>
        <Talk/>
        <HomeSection />
        <CoverageSection />
        <WalletSection/>
        <MarqueeSection/>
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