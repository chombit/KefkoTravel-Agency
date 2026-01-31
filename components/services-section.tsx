"use client"

import { Plane, Building2, Car, FileText, Shield, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useLanguage } from "@/lib/language-context"

export function ServicesSection() {
  const { t } = useLanguage()

  const services = [
    {
      icon: Plane,
      title: t.services.items.flights.title,
      description: t.services.items.flights.description,
    },
    {
      icon: Building2,
      title: t.services.items.hotels.title,
      description: t.services.items.hotels.description,
    },
    {
      icon: MapPin,
      title: t.services.items.tours.title,
      description: t.services.items.tours.description,
    },
    {
      icon: FileText,
      title: t.services.items.visa.title,
      description: t.services.items.visa.description,
    },
    {
      icon: Car,
      title: t.services.items.cars.title,
      description: t.services.items.cars.description,
    },
    {
      icon: Shield,
      title: t.services.items.insurance.title,
      description: t.services.items.insurance.description,
    },
  ]

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-primary text-sm font-medium uppercase tracking-widest mb-4">{t.services.tagline}</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            {t.services.title}
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ScrollReveal key={service.title} delay={index * 0.1}>
              <motion.div
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <Card className="group border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-8">
                    <motion.div 
                      className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <service.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
