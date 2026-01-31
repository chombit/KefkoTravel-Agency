import { Header } from "@/components/header"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <ContactSection />
      <Footer />
    </main>
  )
}

export const metadata = {
  title: 'Contact Us - Kefko Travel Agency',
  description: 'Get in touch with Kefko Travel Agency. Visit our office in Addis Ababa, call us, or send a message. We\'re here to help plan your perfect trip.',
}
