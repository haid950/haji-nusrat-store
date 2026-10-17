import { useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import { Delivery, FAQ, Features, Specs, TrustBar } from './components/Sections'
import OrderSection from './components/OrderSection'
import { Contact, Footer, MobileOrderBar } from './components/Footer'

// Reveal [data-reveal] elements as they scroll into view
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    const observe = () =>
      document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach((el) => io.observe(el))
    observe()
    // Pick up elements rendered later (e.g. the order confirmation)
    const mo = new MutationObserver(observe)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
}

export default function App() {
  useReveal()
  return (
    <div id="top" className="min-h-screen bg-bg text-fg">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Features />
        <Specs />
        <OrderSection />
        <Delivery />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <MobileOrderBar />
    </div>
  )
}
