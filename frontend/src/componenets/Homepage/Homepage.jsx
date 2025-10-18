import React from 'react'
import Navbar from '../Navbar'
import Hero from './Hero'
import Features from './Features'
import HowItWorks from './HowitWorks'
import FireSection from './FireSection'
import FAQSection from './FAQSection'
import CTASection from './CTASection'
import Footer from '../Footer'

const Homepage = () => {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <FireSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  )
}


export default Homepage