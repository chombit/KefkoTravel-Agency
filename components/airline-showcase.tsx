"use client"

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plane, MapPin, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollReveal } from '@/components/scroll-reveal'
import { useLanguage } from '@/lib/language-context'

const airlineImages = [
  {
    id: 1,
    image: "/airlines/ethiopian-airlines.jpg",
    title: "Ethiopian Airlines",
    description: "Connecting Africa to the world"
  },
  {
    id: 2,
    image: "/airlines/emirates.jpg",
    title: "Emirates",
    description: "Fly better experience"
  },
  {
    id: 3,
    image: "/airlines/turkish-airlines.jpg",
    title: "Turkish Airlines",
    description: "Globally yours"
  },
  {
    id: 4,
    image: "/airlines/qr-airways.jpg",
    title: "Qatar Airways",
    description: "Going places together"
  }
]
export function AirlineShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { t } = useLanguage()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % airlineImages.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToPrevious = () => {
    if (airlineImages.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + airlineImages.length) % airlineImages.length)
  }

  const goToNext = () => {
    if (airlineImages.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % airlineImages.length)
  }

  const goToSlide = (index: number) => {
    if (index >= 0 && index < airlineImages.length) {
      setCurrentIndex(index)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-medium uppercase tracking-widest mb-4">
              Premium Aviation Partners
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              World-Class Airlines
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the finest in air travel with our trusted airline partners worldwide
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="relative max-w-6xl mx-auto">
            {/* Main Slider */}
            <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                {airlineImages[currentIndex] && (
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <img
                      src={airlineImages[currentIndex].image}
                      alt={airlineImages[currentIndex].title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.classList.add('bg-gradient-to-br', 'from-blue-400', 'to-purple-600');
                      }}
                    />
                    
                    {/* Overlay Content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                        <motion.div
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.6 }}
                          className="max-w-3xl"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div>
                              <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">
                                {airlineImages[currentIndex].title}
                              </h3>
                              <p className="text-white/80 text-lg">
                                {airlineImages[currentIndex].description}
                              </p>
                            </div>
                          </div>        
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex justify-center gap-2 mt-6">
              {airlineImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-primary w-8' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Side Preview Images */}
            <div className="hidden lg:flex justify-between mt-8 gap-4">
              {airlineImages.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="flex-1 group cursor-pointer"
                  onClick={() => goToSlide(index)}
                >
                  <div className="relative h-32 rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.classList.add('bg-gradient-to-br', 'from-primary/20', 'to-accent/20');
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-sm font-medium truncate">{item.title}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
