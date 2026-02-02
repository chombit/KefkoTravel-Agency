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
      image: "/services/flights.jpg",
      category: "Airline Services"
    },
    {
      icon: Building2,
      title: t.services.items.hotels.title,
      description: t.services.items.hotels.description,
      image: "/services/hotels.jpg",
      category: "Accommodation"
    },
    {
      icon: MapPin,
      title: t.services.items.tours.title,
      description: t.services.items.tours.description,
      image: "/services/tours.jpg",
      category: "World Tours"
    },
    {
      icon: FileText,
      title: t.services.items.visa.title,
      description: t.services.items.visa.description,
      image: "/services/visa.jpg",
      category: "Visa Services"
    },
    {
      icon: Car,
      title: t.services.items.cars.title,
      description: t.services.items.cars.description,
      image: "/services/car-rental.jpg",
      category: "Transportation"
    },
    {
      icon: Shield,
      title: t.services.items.insurance.title,
      description: t.services.items.insurance.description,
      image: "/services/insurance.jpg",
      category: "Travel Protection"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ScrollReveal key={service.title} delay={index * 0.1}>
              <motion.div
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="relative h-80 group cursor-pointer"
              >
                <Card className="overflow-hidden h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
                  {/* Image Background */}
                  <div className="absolute inset-0">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback to gradient background if image fails
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.classList.add('bg-gradient-to-br', 'from-primary/20', 'to-accent/20');
                      }}
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                  </div>
                  
                  {/* Content Overlay - Hidden by default, shown on hover */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between text-white transition-all duration-500">
                    {/* Top Section - Always Visible */}
                    <div className="transform transition-all duration-500 group-hover:-translate-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                        <service.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{service.category}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg">{service.title}</h3>
                    </div>
                    
                    {/* Bottom Section - Hidden by default, slides up on hover */}
                    <div className="transform translate-y-full transition-all duration-500 group-hover:translate-y-0">
                      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                        <p className="text-white/90 text-sm leading-relaxed mb-4">
                          {service.description}
                        </p>
                        <div className="flex items-center gap-2 text-white font-medium text-sm group-hover:text-primary transition-colors">
                          <span>Learn More</span>
                          <motion.div
                            initial={{ x: 0 }}
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.2 }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
