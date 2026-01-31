"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star } from "lucide-react"
import { motion } from "framer-motion"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useLanguage } from "@/lib/language-context"
import { DestinationModal } from "@/components/destination-modal"

export function DestinationsSection() {
  const { t } = useLanguage()
  const [selectedDestination, setSelectedDestination] = useState<{
    name: string
    image: string
    price: string
    currency: string
    rating: number
    tag: string
    description: string
    id: string
  } | null>(null)

  const destinations = [
    {
      id: "dubai",
      name: t.destinations.items.dubai.title,
      image: "/destinations/dubai.jpg",
      price: "19,500",
      currency: "ETB",
      rating: 4.9,
      tag: "Popular",
      description: t.destinations.items.dubai.description,
    },
    {
      id: "cairo",
      name: t.destinations.items.cairo.title,
      image: "/destinations/cairo.jpg",
      price: "18,000",
      currency: "ETB",
      rating: 4.8,
      tag: "Historic",
      description: t.destinations.items.cairo.description,
    },
    {
      id: "zanzibar",
      name: t.destinations.items.zanzibar.title,
      image: "/destinations/zanzibar.jpg",
      price: "15,500",
      currency: "ETB",
      rating: 4.7,
      tag: "Beach",
      description: t.destinations.items.zanzibar.description,
    },
  ]

  return (
    <>
      <section id="destinations" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
            <div className="max-w-2xl mb-6 md:mb-0">
              <p className="text-primary text-sm font-medium uppercase tracking-widest mb-4">{t.destinations.tagline}</p>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground text-balance">
                {t.destinations.title}
              </h2>
            </div>
            <Button variant="outline" className="self-start md:self-auto gap-2 bg-transparent">
              {t.destinations.viewAll || t.destinations.viewDetails}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <ScrollReveal key={destination.id} delay={index * 0.15}>
                <motion.div
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                  className="group relative bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                    {destination.tag}
                  </Badge>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-card">{destination.name}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-muted-foreground mb-4 line-clamp-2">{destination.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{t.destinations.from}</p>
                      <p className="text-2xl font-bold text-foreground">
                        {destination.price} <span className="text-sm font-normal text-muted-foreground">{destination.currency}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="text-sm font-medium text-foreground">{destination.rating}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4 group-hover:bg-primary/90"
                    onClick={() => setSelectedDestination(destination)}
                  >
                    {t.destinations.viewDetails}
                  </Button>
                </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <DestinationModal
        isOpen={!!selectedDestination}
        onClose={() => setSelectedDestination(null)}
        destination={selectedDestination}
      />
    </>
  )
}
