import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import About from '../components/About'
import Collection from '../components/Collection'
import Services from '../components/Services'
import Pricing from '../components/Pricing'
import SEOContentSection from '../components/SEOContentSection'
import Contact from '../components/Contact'

function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Collection />
      <Services />
      <Pricing />
      <SEOContentSection />
      <Contact />
    </>
  )
}

export default HomePage
