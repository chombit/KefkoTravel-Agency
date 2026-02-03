"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plane, Building2, Car, FileText, Clock, MapPin, Phone, MessageCircle, Star, Users, Briefcase, Calendar } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/contexts/auth-context"

interface SearchResult {
  type: "flight" | "hotel" | "car" | "visa"
  from?: string
  to?: string
  destination?: string
  departureDate?: string
  returnDate?: string
  pickUpDate?: string
  dropOffDate?: string
  visaType?: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  searchData: SearchResult | null
}

export function SearchModal({ isOpen, onClose, searchData }: SearchModalProps) {
  const { t } = useLanguage()
  const { user, isLoading } = useAuth()

  if (!searchData) return null

  const getIcon = () => {
    switch (searchData.type) {
      case "flight": return <Plane className="h-6 w-6 text-primary" />
      case "hotel": return <Building2 className="h-6 w-6 text-primary" />
      case "car": return <Car className="h-6 w-6 text-primary" />
      case "visa": return <FileText className="h-6 w-6 text-primary" />
    }
  }

  const getTitle = () => {
    switch (searchData.type) {
      case "flight": return t.hero.tabs.flights
      case "hotel": return t.hero.tabs.hotels
      case "car": return t.hero.tabs.cars
      case "visa": return t.hero.tabs.visa
    }
  }

  const flightResults = [
    { airline: "Ethiopian Airlines", departure: "06:00", arrival: "12:30", duration: "6h 30m", price: "ETB 45,000", stops: "Direct" },
    { airline: "Emirates", departure: "10:15", arrival: "17:45", duration: "7h 30m", price: "ETB 52,000", stops: "1 Stop" },
    { airline: "Qatar Airways", departure: "14:30", arrival: "22:00", duration: "7h 30m", price: "ETB 48,500", stops: "1 Stop" },
  ]

  const hotelResults = [
    { name: "Grand Luxury Hotel", rating: 5, reviews: 2450, price: "ETB 8,500", amenities: ["Pool", "Spa", "Gym", "WiFi"] },
    { name: "City Center Inn", rating: 4, reviews: 1820, price: "ETB 5,200", amenities: ["WiFi", "Restaurant", "Parking"] },
    { name: "Business Suite Hotel", rating: 4, reviews: 980, price: "ETB 6,800", amenities: ["WiFi", "Gym", "Conference"] },
  ]

  const carResults = [
    { type: "Economy", model: "Toyota Yaris", seats: 4, price: "ETB 2,500/day", features: ["AC", "Manual", "Bluetooth"] },
    { type: "SUV", model: "Toyota Land Cruiser", seats: 7, price: "ETB 6,500/day", features: ["AC", "Auto", "4WD", "GPS"] },
    { type: "Luxury", model: "Mercedes E-Class", seats: 5, price: "ETB 8,000/day", features: ["AC", "Auto", "Leather", "GPS"] },
  ]

  const visaInfo = {
    processingTime: "5-7 Business Days",
    fee: "ETB 5,500",
    requirements: [
      "Valid passport (6+ months validity)",
      "2 passport-sized photos",
      "Bank statement (last 3 months)",
      "Flight reservation",
      "Hotel booking confirmation",
      "Employment letter or business registration",
    ]
  }

  const handleBooking = (item: any, type: string) => {
    if (isLoading) {
      return
    }
    
    if (!user) {
      // Redirect to sign in if not logged in
      window.location.href = '/auth/signin'
      return
    }

    // Safety check for price
    let price = '0'
    if (item.price) {
      price = item.price.toString()
    } else if (item.basePrice) {
      price = item.basePrice.toString()
    }
    
    // Redirect to booking page with details
    const params = new URLSearchParams({
      type: searchData.type,
      destination: searchData.destination || searchData.to || `${searchData.from} → ${searchData.to}`,
      price: price.replace(/[^0-9.]/g, '')
    })
    
    window.location.href = `/book?${params.toString()}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getIcon()}
            <div className="flex-1">
              <DialogTitle className="text-xl">{getTitle()} - {t.search?.results || "Search Results"}</DialogTitle>
              <DialogDescription>
                {searchData.type === "flight" && searchData.from && searchData.to && (
                  <span>{searchData.from} → {searchData.to} {searchData.departureDate && `| ${searchData.departureDate}`}</span>
                )}
                {searchData.type === "hotel" && searchData.destination && (
                  <span>{searchData.destination} {searchData.departureDate && `| ${searchData.departureDate}`} {searchData.returnDate && `- ${searchData.returnDate}`}</span>
                )}
                {searchData.type === "car" && searchData.destination && (
                  <span>{searchData.destination} {searchData.pickUpDate && `| ${searchData.pickUpDate}`} {searchData.dropOffDate && `- ${searchData.dropOffDate}`}</span>
                )}
                {searchData.type === "visa" && searchData.destination && (
                  <span>{searchData.destination} | {searchData.visaType || "Tourist Visa"}</span>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        {/* Flight Results */}
        {searchData.type === "flight" && (
          <div className="space-y-4">
            {flightResults.map((flight, index) => (
              <Card key={index} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{flight.airline}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="font-medium">{flight.departure}</span>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <div className="w-8 h-px bg-border" />
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{flight.duration}</span>
                          <div className="w-8 h-px bg-border" />
                        </div>
                        <span className="font-medium">{flight.arrival}</span>
                      </div>
                      <Badge variant="secondary" className="mt-2">{flight.stops}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">{flight.price}</p>
                      <Button 
                        size="sm" 
                        className="mt-2" 
                        onClick={() => handleBooking(flight, `flight-${index}`)}
                      >
                        {t.search?.book || "Book Now"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Hotel Results */}
        {searchData.type === "hotel" && (
          <div className="space-y-4">
            {hotelResults.map((hotel, index) => (
              <Card key={index} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{hotel.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {Array.from({ length: hotel.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">({hotel.reviews} reviews)</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {hotel.amenities.map((amenity) => (
                          <Badge key={amenity} variant="outline" className="text-xs">{amenity}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">{hotel.price}</p>
                      <p className="text-xs text-muted-foreground">per night</p>
                      <Button 
                        size="sm" 
                        className="mt-2" 
                        onClick={() => handleBooking(hotel, `hotel-${index}`)}
                      >
                        {t.search?.book || "Book Now"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Car Results */}
        {searchData.type === "car" && (
          <div className="space-y-4">
            {carResults.map((car, index) => (
              <Card key={index} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge>{car.type}</Badge>
                        <p className="font-semibold text-foreground">{car.model}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" /> {car.seats} seats
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {car.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">{feature}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">{car.price}</p>
                      <Button 
                        size="sm" 
                        className="mt-2" 
                        onClick={() => handleBooking(car, `car-${index}`)}
                      >
                        {t.search?.book || "Book Now"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Visa Info */}
        {searchData.type === "visa" && (
          <div className="space-y-6">
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t.search?.processingTime || "Processing Time"}</p>
                      <p className="font-semibold">{visaInfo.processingTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t.search?.serviceFee || "Service Fee"}</p>
                      <p className="font-semibold">{visaInfo.fee}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <h4 className="font-semibold mb-3">{t.search?.requirements || "Required Documents"}</h4>
                  <ul className="space-y-2">
                    {visaInfo.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs text-primary font-medium">{index + 1}</span>
                        </div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Button 
              className="w-full gap-2" 
              size="lg"
              onClick={() => handleBooking(visaInfo, 'visa')}
            >
              <FileText className="h-4 w-4" />
              {t.search?.applyNow || "Apply Now"}
            </Button>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-3">{t.search?.needHelp || "Need help with your booking?"}</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
              <a href="tel:+251911123456">
                <Phone className="h-4 w-4" />
                +251 911 123 456
              </a>
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
              <a href="https://t.me/Kefkotravelagency" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Telegram
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
