"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plane, Building2, Car, FileText, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { SearchModal } from "@/components/search-modal"

interface SearchData {
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

export function HeroSection() {
  const [departureDate, setDepartureDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [searchData, setSearchData] = useState<SearchData | null>(null)
  
  // Flight form state
  const [flightFrom, setFlightFrom] = useState("addis")
  const [flightTo, setFlightTo] = useState("")
  
  // Hotel form state
  const [hotelDestination, setHotelDestination] = useState("")
  const [hotelCheckIn, setHotelCheckIn] = useState("")
  const [hotelCheckOut, setHotelCheckOut] = useState("")
  
  // Car form state
  const [carLocation, setCarLocation] = useState("")
  const [carPickUp, setCarPickUp] = useState("")
  const [carDropOff, setCarDropOff] = useState("")
  
  // Visa form state
  const [visaDestination, setVisaDestination] = useState("")
  const [visaType, setVisaType] = useState("")
  
  const { t } = useLanguage()

  const destinations = [
    { key: "dubai", label: t.hero.destinations.dubai },
    { key: "cairo", label: t.hero.destinations.cairo },
    { key: "nairobi", label: t.hero.destinations.nairobi },
    { key: "istanbul", label: t.hero.destinations.istanbul },
    { key: "bangkok", label: t.hero.destinations.bangkok },
    { key: "london", label: t.hero.destinations.london },
  ]

  const getDestinationLabel = (key: string) => {
    const dest = destinations.find(d => d.key === key)
    return dest?.label || key
  }

  const handleFlightSearch = () => {
    setSearchData({
      type: "flight",
      from: flightFrom === "addis" ? `${t.hero.form.fromPlaceholder}, Ethiopia` : getDestinationLabel(flightFrom),
      to: getDestinationLabel(flightTo),
      departureDate: departureDate ? format(departureDate, "PPP") : undefined,
      returnDate: returnDate ? format(returnDate, "PPP") : undefined,
    })
    setSearchModalOpen(true)
  }

  const handleHotelSearch = () => {
    setSearchData({
      type: "hotel",
      destination: getDestinationLabel(hotelDestination),
      departureDate: hotelCheckIn,
      returnDate: hotelCheckOut,
    })
    setSearchModalOpen(true)
  }

  const handleCarSearch = () => {
    setSearchData({
      type: "car",
      destination: getDestinationLabel(carLocation),
      pickUpDate: carPickUp,
      dropOffDate: carDropOff,
    })
    setSearchModalOpen(true)
  }

  const handleVisaSearch = () => {
    setSearchData({
      type: "visa",
      destination: getDestinationLabel(visaDestination),
      visaType: visaType || "Tourist Visa",
    })
    setSearchModalOpen(true)
  }

  return (
    <>
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="Airplane wing above clouds at sunset"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-foreground/10 to-foreground/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-primary-foreground/80 text-sm font-medium uppercase tracking-widest mb-4">
              {t.hero.tagline}
            </p>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 text-balance">
              {t.hero.title} <span className="text-primary">{t.hero.titleHighlight}</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto text-pretty">
              {t.hero.subtitle}
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl shadow-2xl p-6 md:p-8">
              <Tabs defaultValue="flights" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6 h-auto p-1 bg-muted">
                  <TabsTrigger value="flights" className="flex items-center gap-2 py-3 data-[state=active]:bg-card">
                    <Plane className="h-4 w-4" />
                    <span className="hidden sm:inline">{t.hero.tabs.flights}</span>
                  </TabsTrigger>
                  <TabsTrigger value="hotels" className="flex items-center gap-2 py-3 data-[state=active]:bg-card">
                    <Building2 className="h-4 w-4" />
                    <span className="hidden sm:inline">{t.hero.tabs.hotels}</span>
                  </TabsTrigger>
                  <TabsTrigger value="cars" className="flex items-center gap-2 py-3 data-[state=active]:bg-card">
                    <Car className="h-4 w-4" />
                    <span className="hidden sm:inline">{t.hero.tabs.cars}</span>
                  </TabsTrigger>
                  <TabsTrigger value="visa" className="flex items-center gap-2 py-3 data-[state=active]:bg-card">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">{t.hero.tabs.visa}</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="flights" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="from" className="text-muted-foreground text-xs uppercase tracking-wide">{t.hero.form.from}</Label>
                      <Select value={flightFrom} onValueChange={setFlightFrom}>
                        <SelectTrigger id="from" className="h-12 bg-muted/50">
                          <SelectValue placeholder={t.hero.form.fromPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="addis">{t.hero.form.fromPlaceholder}, Ethiopia</SelectItem>
                          {destinations.map((dest) => (
                            <SelectItem key={dest.key} value={dest.key}>{dest.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="to" className="text-muted-foreground text-xs uppercase tracking-wide">{t.hero.form.to}</Label>
                      <Select value={flightTo} onValueChange={setFlightTo}>
                        <SelectTrigger id="to" className="h-12 bg-muted/50">
                          <SelectValue placeholder={t.hero.form.toPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {destinations.map((dest) => (
                            <SelectItem key={dest.key} value={dest.key}>{dest.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide">{t.hero.form.departure}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-12 w-full justify-start text-left font-normal bg-muted/50",
                              !departureDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {departureDate ? format(departureDate, "PPP") : t.hero.form.departure}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={departureDate}
                            onSelect={setDepartureDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide">{t.hero.form.return}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-12 w-full justify-start text-left font-normal bg-muted/50",
                              !returnDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {returnDate ? format(returnDate, "PPP") : t.hero.form.return}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={returnDate}
                            onSelect={setReturnDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide invisible">Search</Label>
                      <Button className="h-12 w-full gap-2" onClick={handleFlightSearch}>
                        {t.hero.form.search}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="hotels" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide">{t.hero.form.destination}</Label>
                      <Select value={hotelDestination} onValueChange={setHotelDestination}>
                        <SelectTrigger className="h-12 bg-muted/50">
                          <SelectValue placeholder={t.hero.form.destinationPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {destinations.map((dest) => (
                            <SelectItem key={dest.key} value={dest.key}>{dest.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide">{t.hero.form.departure}</Label>
                      <Input 
                        type="date" 
                        className="h-12 bg-muted/50" 
                        value={hotelCheckIn}
                        onChange={(e) => setHotelCheckIn(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide">{t.hero.form.return}</Label>
                      <Input 
                        type="date" 
                        className="h-12 bg-muted/50" 
                        value={hotelCheckOut}
                        onChange={(e) => setHotelCheckOut(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide invisible">Search</Label>
                      <Button className="h-12 w-full gap-2" onClick={handleHotelSearch}>
                        {t.hero.form.searchHotels}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="cars" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide">{t.hero.form.pickUp}</Label>
                      <Select value={carLocation} onValueChange={setCarLocation}>
                        <SelectTrigger className="h-12 bg-muted/50">
                          <SelectValue placeholder={t.hero.form.pickUpPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {destinations.map((dest) => (
                            <SelectItem key={dest.key} value={dest.key}>{dest.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide">{t.hero.form.pickUpDate}</Label>
                      <Input 
                        type="date" 
                        className="h-12 bg-muted/50" 
                        value={carPickUp}
                        onChange={(e) => setCarPickUp(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide">{t.hero.form.dropOffDate}</Label>
                      <Input 
                        type="date" 
                        className="h-12 bg-muted/50" 
                        value={carDropOff}
                        onChange={(e) => setCarDropOff(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide invisible">Search</Label>
                      <Button className="h-12 w-full gap-2" onClick={handleCarSearch}>
                        {t.hero.form.searchCars}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="visa" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide">{t.hero.form.destination}</Label>
                      <Select value={visaDestination} onValueChange={setVisaDestination}>
                        <SelectTrigger className="h-12 bg-muted/50">
                          <SelectValue placeholder={t.hero.form.destinationPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="uae">{t.hero.destinations.dubai}</SelectItem>
                          <SelectItem value="egypt">{t.hero.destinations.cairo}</SelectItem>
                          <SelectItem value="kenya">{t.hero.destinations.nairobi}</SelectItem>
                          <SelectItem value="turkey">{t.hero.destinations.istanbul}</SelectItem>
                          <SelectItem value="thailand">{t.hero.destinations.bangkok}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide">{t.hero.form.visaType}</Label>
                      <Select value={visaType} onValueChange={setVisaType}>
                        <SelectTrigger className="h-12 bg-muted/50">
                          <SelectValue placeholder={t.hero.form.visaTypePlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tourist">{t.hero.form.visaTypePlaceholder}</SelectItem>
                          <SelectItem value="business">Business Visa</SelectItem>
                          <SelectItem value="transit">Transit Visa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide invisible">Apply</Label>
                      <Button className="h-12 w-full gap-2" onClick={handleVisaSearch}>
                        {t.hero.form.applyVisa}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Stats */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "10K+", label: t.hero.stats.travelers },
                { value: "50+", label: t.hero.stats.destinations },
                { value: "24/7", label: "Support" },
                { value: "100%", label: "Satisfaction" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-primary-foreground">{stat.value}</p>
                  <p className="text-sm text-primary-foreground/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SearchModal 
        isOpen={searchModalOpen} 
        onClose={() => setSearchModalOpen(false)} 
        searchData={searchData} 
      />
    </>
  )
}
