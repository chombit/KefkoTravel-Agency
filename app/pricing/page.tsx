import { Header } from "@/components/header"
import { PricingSection } from "@/components/pricing-section"
import { Footer } from "@/components/footer"

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <PricingSection />
      <Footer />
    </main>
  )
}

export const metadata = {
  title: 'Pricing & Packages - Kefko Travel Agency',
  description: 'Explore our competitive travel packages and pricing. From budget-friendly options to luxury experiences, Kefko Travel Agency has the perfect package for your next adventure.',
}
