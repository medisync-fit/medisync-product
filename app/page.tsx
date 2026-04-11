import HeroSection from '@/components/HeroSection'
import SocialProofBar from '@/components/SocialProofBar'
import FeaturesSection from '@/components/FeaturesSection'
import HowItWorks from '@/components/HowItWorks'
import WearableShowcase from '@/components/WearableShowcase'
import PricingSectionNew from '@/components/PricingSectionNew'
import Testimonials from '@/components/Testimonials'
import DownloadCTA from '@/components/DownloadCTA'
import Footer from '@/components/Footer'

function SectionDivider() {
  return (
      <div className="h-px bg-linear-to-r from-transparent via-brand/20 to-transparent"/>
  )
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <SocialProofBar />
      <SectionDivider />
      <FeaturesSection />
      <SectionDivider />
      <HowItWorks />
      <SectionDivider />
      <WearableShowcase />
      <SectionDivider />
        {/*<FallDetectionSpotlight />*/}
      <SectionDivider />
        {/*<PricingSection />*/}
        <PricingSectionNew/>
      <SectionDivider />
      {/*<Testimonials />*/}
      {/*<SectionDivider />*/}
      <DownloadCTA />
      <Footer />
    </main>
  )
}
