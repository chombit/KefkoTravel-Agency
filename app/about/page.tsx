import { Header } from "@/components/header"
import { AboutSection } from "@/components/about-section"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <AboutSection />
      <Footer />
    </main>
  )
}

export const metadata = {
  title: 'About Us - Kefko Travel Agency',
  description: 'Learn about Kefko Travel Agency - Your trusted travel partner based in Addis Ababa, Ethiopia. Discover our story, mission, and commitment to exceptional travel experiences.',
}
