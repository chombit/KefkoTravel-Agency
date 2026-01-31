"use client"

import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { t } = useLanguage()

  const footerLinks = {
    services: [
      { name: t.services.items.flights.title, href: "/#services" },
      { name: t.services.items.hotels.title, href: "/#services" },
      { name: t.services.items.tours.title, href: "/#services" },
      { name: t.services.items.visa.title, href: "/#services" },
      { name: t.services.items.cars.title, href: "/#services" },
      { name: t.services.items.insurance.title, href: "/#services" },
    ],
    destinations: [
      { name: t.hero.destinations.dubai, href: "/#destinations" },
      { name: t.hero.destinations.cairo, href: "/#destinations" },
      { name: t.hero.destinations.nairobi, href: "/#destinations" },
      { name: t.hero.destinations.istanbul, href: "/#destinations" },
      { name: t.hero.destinations.bangkok, href: "/#destinations" },
      { name: t.hero.destinations.london, href: "/#destinations" },
    ],
    company: [
      { name: t.nav.about, href: "/about" },
      { name: t.about.team.tagline, href: "/#team" },
      { name: t.nav.pricing, href: "/pricing" },
      { name: t.testimonials.tagline, href: "/#testimonials" },
      { name: t.nav.contact, href: "/contact" },
    ],
  }

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/logo.png"
                alt="Kefko Travel Agent - Let's Fly Together"
                width={400}
                height={100}
                className="h-20 w-auto object-contain"
                priority
              />
            </Link>
            <p className="text-background/70 mb-6 max-w-sm">
              {t.footer.description}
            </p>
            <div className="space-y-3">
              <a href="tel:+251925791588" className="flex items-center gap-3 text-background/70 hover:text-background transition-colors">
                <Phone className="h-4 w-4" />
                <span>+251 925 79 15 88</span>
              </a>
              <a href="mailto:info@kefkotravelagency.com" className="flex items-center gap-3 text-background/70 hover:text-background transition-colors">
                <Mail className="h-4 w-4" />
                <span>info@kefkotravelagency.com</span>
              </a>
              <div className="flex items-start gap-3 text-background/70">
                <MapPin className="h-4 w-4 mt-1 shrink-0" />
                <span>{t.contact.info.address.value}</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-background mb-4">{t.footer.sections.services}</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-background/70 hover:text-background transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-semibold text-background mb-4">{t.footer.sections.destinations}</h4>
            <ul className="space-y-3">
              {footerLinks.destinations.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-background/70 hover:text-background transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-background mb-4">{t.footer.sections.company}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-background/70 hover:text-background transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-background/20" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/60 text-sm">
            {`© ${new Date().getFullYear()} ${t.footer.copyright}`}
          </p>
          <p className="text-background/60 text-sm italic">
            {`"${t.footer.tagline}"`}
          </p>
        </div>
      </div>
    </footer>
  )
}
