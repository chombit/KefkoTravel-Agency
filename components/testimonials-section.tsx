"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function TestimonialsSection() {
  const { t } = useLanguage()

  const testimonials = [
    {
      name: t.testimonials.items.first.name,
      role: t.testimonials.items.first.role,
      rating: 5,
      text: t.testimonials.items.first.quote,
      initials: "AT",
    },
    {
      name: t.testimonials.items.second.name,
      role: t.testimonials.items.second.role,
      rating: 5,
      text: t.testimonials.items.second.quote,
      initials: "TM",
    },
    {
      name: t.testimonials.items.third.name,
      role: t.testimonials.items.third.role,
      rating: 5,
      text: t.testimonials.items.third.quote,
      initials: "DB",
    },
  ]

  return (
    <section id="testimonials" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-primary text-sm font-medium uppercase tracking-widest mb-4">{t.testimonials.tagline}</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            {t.testimonials.title}
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            {t.testimonials.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.name}
              className="border-border/50 hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-8">
                <Quote className="h-10 w-10 text-primary/20 mb-4" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {`"${testimonial.text}"`}
                </p>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 bg-primary/10">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
