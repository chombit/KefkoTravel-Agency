"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Plane, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function PricingSection() {
  const { t } = useLanguage()

  const packages = [
    {
      name: t.pricing.packages.express,
      airline: "Kenya Airways",
      route: "Addis Ababa → Dubai",
      type: "One Way",
      price: "19,500",
      currency: "ETB",
      features: [
        "Economy class seat",
        "20kg checked baggage",
        "In-flight meals",
        "Online check-in",
      ],
    },
    {
      name: t.pricing.packages.complete,
      airline: "Ethiopian Airlines",
      route: "Addis Ababa → Dubai",
      type: "Round Trip + Visa",
      price: "22,500",
      currency: "ETB",
      popular: true,
      features: [
        "Round trip economy class",
        "30kg checked baggage",
        "In-flight meals & entertainment",
        t.pricing.features.visa,
        "24/7 travel support",
        t.pricing.features.transfer,
      ],
    },
    {
      name: t.pricing.packages.premium,
      airline: "Ethiopian Airlines",
      route: "Addis Ababa → Dubai",
      type: "Round Trip + Visa + Hotel",
      price: "45,000",
      currency: "ETB",
      features: [
        "Round trip business class",
        "40kg checked baggage",
        "Lounge access",
        t.pricing.features.visa,
        "3-night hotel accommodation",
        t.pricing.features.privateTransfer,
        t.pricing.features.dedicatedAgent,
      ],
    },
  ]

  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-primary text-sm font-medium uppercase tracking-widest mb-4">{t.pricing.tagline}</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            {t.pricing.title}
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            {t.pricing.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg) => (
            <Card 
              key={pkg.name}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                pkg.popular 
                  ? "border-primary shadow-lg scale-[1.02]" 
                  : "border-border/50 hover:border-primary/30"
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-none rounded-bl-lg bg-primary text-primary-foreground">
                    {t.pricing.mostPopular}
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Plane className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{pkg.airline}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground">{pkg.route}</p>
                <Badge variant="secondary" className="w-fit mt-2">{pkg.type}</Badge>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-4xl font-bold text-foreground">
                    {pkg.price}
                    <span className="text-base font-normal text-muted-foreground ml-1">{pkg.currency}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{t.pricing.perPerson}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/">
                  <Button 
                    className={`w-full gap-2 ${pkg.popular ? "" : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"}`}
                  >
                    {t.pricing.bookNow}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
