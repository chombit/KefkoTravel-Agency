"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import {
  Star,
  Plane,
  Hotel,
  Camera,
  Utensils,
  Calendar,
  Clock,
  Users,
  Check,
  Phone,
  MessageCircle,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface DestinationModalProps {
  isOpen: boolean
  onClose: () => void
  destination: {
    name: string
    image: string
    price: string
    currency: string
    rating: number
    tag: string
    description: string
    id: string
  } | null
}

export function DestinationModal({ isOpen, onClose, destination }: DestinationModalProps) {
  const { language } = useLanguage()

  if (!destination) return null

  const destinationDetails: Record<string, {
    highlights: string[]
    included: string[]
    itinerary: { day: string; title: string; description: string }[]
    packages: { name: string; duration: string; price: string; features: string[] }[]
    gallery: string[]
  }> = {
    dubai: {
      highlights: language === "en" 
        ? ["Burj Khalifa Visit", "Desert Safari", "Dubai Mall", "Palm Jumeirah", "Dubai Marina Cruise", "Gold Souk Tour"]
        : ["ቡርጅ ኻሊፋ ጉብኝት", "በረሃ ሳፋሪ", "ዱባይ ሞል", "ፓልም ጁሜራ", "ዱባይ ማሪና ክሩዝ", "የወርቅ ሱቅ ጉብኝት"],
      included: language === "en"
        ? ["Round-trip flights", "4-star hotel accommodation", "Airport transfers", "Breakfast daily", "City tour", "Visa assistance"]
        : ["መልስ በረራዎች", "4-ኮከብ ሆቴል ማረፊያ", "የአየር ማረፊያ ማጓጓዣ", "ቁርስ በየቀኑ", "የከተማ ጉብኝት", "የቪዛ ድጋፍ"],
      itinerary: language === "en" ? [
        { day: "Day 1", title: "Arrival & Dubai Marina", description: "Airport pickup, hotel check-in, evening walk at Dubai Marina" },
        { day: "Day 2", title: "Burj Khalifa & Downtown", description: "Visit Burj Khalifa observation deck, Dubai Mall, Dubai Fountain show" },
        { day: "Day 3", title: "Desert Safari", description: "Morning at leisure, afternoon desert safari with BBQ dinner" },
        { day: "Day 4", title: "Old Dubai Tour", description: "Gold Souk, Spice Souk, Abra ride, Dubai Museum" },
        { day: "Day 5", title: "Departure", description: "Breakfast, checkout, airport transfer" },
      ] : [
        { day: "ቀን 1", title: "መድረስ እና ዱባይ ማሪና", description: "ከአየር ማረፊያ መውሰድ፣ ሆቴል ቼክ-ኢን፣ ምሽት በዱባይ ማሪና" },
        { day: "ቀን 2", title: "ቡርጅ ኻሊፋ እና ዳውንታውን", description: "ቡርጅ ኻሊፋ ማየት፣ ዱባይ ሞል፣ የዱባይ ፏፏቴ ትርኢት" },
        { day: "ቀን 3", title: "በረሃ ሳፋሪ", description: "ጠዋት በእረፍት፣ ከሰዓት በኋላ በረሃ ሳፋሪ ከባርቤኪው እራት ጋር" },
        { day: "ቀን 4", title: "የድሮ ዱባይ ጉብኝት", description: "የወርቅ ሱቅ፣ የቅመማ ቅመም ሱቅ፣ አብራ መጓዝ፣ የዱባይ ሙዚየም" },
        { day: "ቀን 5", title: "መውጣት", description: "ቁርስ፣ ቼክአውት፣ ወደ አየር ማረፊያ መጓጓዣ" },
      ],
      packages: language === "en" ? [
        { name: "Budget Explorer", duration: "3 Days", price: "19,500", features: ["3-star hotel", "Breakfast", "Airport transfer", "City tour"] },
        { name: "Classic Dubai", duration: "5 Days", price: "35,000", features: ["4-star hotel", "All meals", "Desert safari", "Burj Khalifa ticket"] },
        { name: "Luxury Experience", duration: "7 Days", price: "65,000", features: ["5-star hotel", "All inclusive", "Private tours", "Yacht cruise"] },
      ] : [
        { name: "ቁጠባ አሳሽ", duration: "3 ቀናት", price: "19,500", features: ["3-ኮከብ ሆቴል", "ቁርስ", "የአየር ማረፊያ ማጓጓዣ", "የከተማ ጉብኝት"] },
        { name: "ክላሲክ ዱባይ", duration: "5 ቀናት", price: "35,000", features: ["4-ኮከብ ሆቴል", "ሁሉም ምግቦች", "በረሃ ሳፋሪ", "ቡርጅ ኻሊፋ ቲኬት"] },
        { name: "ቅንጡ ተሞክሮ", duration: "7 ቀናት", price: "65,000", features: ["5-ኮከብ ሆቴል", "ሁሉም ጨምሮ", "የግል ጉብኝቶች", "የጀልባ ክሩዝ"] },
      ],
      gallery: ["/destinations/dubai.jpg"],
    },
    cairo: {
      highlights: language === "en"
        ? ["Pyramids of Giza", "Sphinx", "Egyptian Museum", "Khan el-Khalili Bazaar", "Nile River Cruise", "Valley of the Kings"]
        : ["የጊዛ ፒራሚዶች", "ስፊንክስ", "የግብፅ ሙዚየም", "ካን ኤል-ኻሊሊ ገበያ", "የናይል ወንዝ ክሩዝ", "የነገስታት ሸለቆ"],
      included: language === "en"
        ? ["Round-trip flights", "4-star hotel accommodation", "Airport transfers", "Breakfast daily", "Guided pyramid tour", "Visa on arrival"]
        : ["መልስ በረራዎች", "4-ኮከብ ሆቴል ማረፊያ", "የአየር ማረፊያ ማጓጓዣ", "ቁርስ በየቀኑ", "በመመሪያ የፒራሚድ ጉብኝት", "በመድረስ ቪዛ"],
      itinerary: language === "en" ? [
        { day: "Day 1", title: "Arrival in Cairo", description: "Airport pickup, hotel check-in, evening Nile dinner cruise" },
        { day: "Day 2", title: "Pyramids & Sphinx", description: "Full day tour of Giza Pyramids, Sphinx, and Valley Temple" },
        { day: "Day 3", title: "Egyptian Museum", description: "Visit the famous Egyptian Museum, Citadel, and old Cairo" },
        { day: "Day 4", title: "Khan el-Khalili", description: "Morning bazaar visit, afternoon at leisure, farewell dinner" },
        { day: "Day 5", title: "Departure", description: "Breakfast, checkout, airport transfer" },
      ] : [
        { day: "ቀን 1", title: "ካይሮ መድረስ", description: "ከአየር ማረፊያ መውሰድ፣ ሆቴል ቼክ-ኢን፣ ምሽት የናይል እራት ክሩዝ" },
        { day: "ቀን 2", title: "ፒራሚዶች እና ስፊንክስ", description: "ሙሉ ቀን የጊዛ ፒራሚዶች፣ ስፊንክስ፣ እና የሸለቆ ቤተመቅደስ ጉብኝት" },
        { day: "ቀን 3", title: "የግብፅ ሙዚየም", description: "ታዋቂውን የግብፅ ሙዚየም፣ ሲታዴል፣ እና አሮጌውን ካይሮ መጎብኘት" },
        { day: "ቀን 4", title: "ካን ኤል-ኻሊሊ", description: "ጠዋት ገበያ ጉብኝት፣ ከሰዓት በኋላ በእረፍት፣ የስንብት እራት" },
        { day: "ቀን 5", title: "መውጣት", description: "ቁርስ፣ ቼክአውት፣ ወደ አየር ማረፊያ መጓጓዣ" },
      ],
      packages: language === "en" ? [
        { name: "Pyramid Express", duration: "3 Days", price: "18,000", features: ["3-star hotel", "Breakfast", "Pyramid tour", "Airport transfer"] },
        { name: "Classic Egypt", duration: "5 Days", price: "32,000", features: ["4-star hotel", "All meals", "Nile cruise", "Museum entry"] },
        { name: "Pharaoh's Journey", duration: "7 Days", price: "55,000", features: ["5-star hotel", "All inclusive", "Luxor trip", "Private guide"] },
      ] : [
        { name: "ፒራሚድ ኤክስፕረስ", duration: "3 ቀናት", price: "18,000", features: ["3-ኮከብ ሆቴል", "ቁርስ", "የፒራሚድ ጉብኝት", "የአየር ማረፊያ ማጓጓዣ"] },
        { name: "ክላሲክ ግብፅ", duration: "5 ቀናት", price: "32,000", features: ["4-ኮከብ ሆቴል", "ሁሉም ምግቦች", "የናይል ክሩዝ", "ሙዚየም መግቢያ"] },
        { name: "የፈርኦን ጉዞ", duration: "7 ቀናት", price: "55,000", features: ["5-ኮከብ ሆቴል", "ሁሉም ጨምሮ", "የሉክሶር ጉዞ", "የግል መመሪያ"] },
      ],
      gallery: ["/destinations/cairo.jpg"],
    },
    zanzibar: {
      highlights: language === "en"
        ? ["Stone Town UNESCO Site", "Pristine Beaches", "Spice Farm Tour", "Snorkeling & Diving", "Sunset Dhow Cruise", "Jozani Forest"]
        : ["የድንጋይ ከተማ ዩኔስኮ ቦታ", "ንፁህ የባህር ዳርቻዎች", "የቅመማ ቅመም እርሻ ጉብኝት", "ስኖርክሊንግ እና ዳይቪንግ", "የፀሐይ ስትጠልቅ ዳው ክሩዝ", "ጆዛኒ ደን"],
      included: language === "en"
        ? ["Round-trip flights", "Beach resort stay", "Airport transfers", "Breakfast daily", "Stone Town tour", "Spice tour"]
        : ["መልስ በረራዎች", "የባህር ዳርቻ ሪዞርት ቆይታ", "የአየር ማረፊያ ማጓጓዣ", "ቁርስ በየቀኑ", "የድንጋይ ከተማ ጉብኝት", "የቅመማ ቅመም ጉብኝት"],
      itinerary: language === "en" ? [
        { day: "Day 1", title: "Arrival in Zanzibar", description: "Airport pickup, resort check-in, beach relaxation" },
        { day: "Day 2", title: "Stone Town Tour", description: "Explore UNESCO heritage site, local markets, and historic buildings" },
        { day: "Day 3", title: "Spice Farm & Beach", description: "Morning spice tour, afternoon free for beach activities" },
        { day: "Day 4", title: "Ocean Activities", description: "Snorkeling trip, sunset dhow cruise with seafood dinner" },
        { day: "Day 5", title: "Departure", description: "Breakfast, checkout, airport transfer" },
      ] : [
        { day: "ቀን 1", title: "ዛንዚባር መድረስ", description: "ከአየር ማረፊያ መውሰድ፣ ሪዞርት ቼክ-ኢን፣ የባህር ዳርቻ እረፍት" },
        { day: "ቀን 2", title: "የድንጋይ ከተማ ጉብኝት", description: "የዩኔስኮ ቅርስ ቦታ፣ የአካባቢ ገበያዎች፣ እና ታሪካዊ ህንፃዎችን ማሰስ" },
        { day: "ቀን 3", title: "የቅመማ ቅመም እርሻ እና ባህር ዳርቻ", description: "ጠዋት የቅመማ ቅመም ጉብኝት፣ ከሰዓት በኋላ ለባህር ዳርቻ እንቅስቃሴዎች ነፃ" },
        { day: "ቀን 4", title: "የውቅያኖስ እንቅስቃሴዎች", description: "ስኖርክሊንግ ጉዞ፣ የፀሐይ ስትጠልቅ ዳው ክሩዝ ከባህር ምግብ እራት ጋር" },
        { day: "ቀን 5", title: "መውጣት", description: "ቁርስ፣ ቼክአውት፣ ወደ አየር ማረፊያ መጓጓዣ" },
      ],
      packages: language === "en" ? [
        { name: "Beach Escape", duration: "3 Days", price: "15,500", features: ["3-star resort", "Breakfast", "Beach access", "Airport transfer"] },
        { name: "Island Explorer", duration: "5 Days", price: "28,000", features: ["4-star resort", "Half board", "Snorkeling", "Stone Town tour"] },
        { name: "Zanzibar Luxury", duration: "7 Days", price: "48,000", features: ["5-star resort", "All inclusive", "Private beach", "Dhow cruise"] },
      ] : [
        { name: "የባህር ዳርቻ ማምለጥ", duration: "3 ቀናት", price: "15,500", features: ["3-ኮከብ ሪዞርት", "ቁርስ", "የባህር ዳርቻ መዳረሻ", "የአየር ማረፊያ ማጓጓዣ"] },
        { name: "ደሴት አሳሽ", duration: "5 ቀናት", price: "28,000", features: ["4-ኮከብ ሪዞርት", "ግማሽ ቦርድ", "ስኖርክሊንግ", "የድንጋይ ከተማ ጉብኝት"] },
        { name: "ዛንዚባር ቅንጡ", duration: "7 ቀናት", price: "48,000", features: ["5-ኮከብ ሪዞርት", "ሁሉም ጨምሮ", "የግል ባህር ዳርቻ", "ዳው ክሩዝ"] },
      ],
      gallery: ["/destinations/zanzibar.jpg"],
    },
  }

  const details = destinationDetails[destination.id] || destinationDetails.dubai

  const labels = {
    overview: language === "en" ? "Overview" : "አጠቃላይ እይታ",
    itinerary: language === "en" ? "Itinerary" : "የጉዞ መርሃ ግብር",
    packages: language === "en" ? "Packages" : "ፓኬጆች",
    highlights: language === "en" ? "Highlights" : "ዋና ዋና ነጥቦች",
    included: language === "en" ? "What's Included" : "የተካተተ",
    bookPackage: language === "en" ? "Book Package" : "ፓኬጅ ይያዙ",
    perPerson: language === "en" ? "per person" : "በሰው",
    needHelp: language === "en" ? "Need help planning your trip?" : "ጉዞዎን ለማቀድ እርዳታ ይፈልጋሉ?",
    callUs: language === "en" ? "Call Us" : "ይደውሉልን",
    telegram: language === "en" ? "Telegram" : "ቴሌግራም",
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Hero Image */}
        <div className="relative h-64 w-full">
          <Image
            src={destination.image || "/placeholder.svg"}
            alt={destination.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-accent text-accent-foreground">{destination.tag}</Badge>
              <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full">
                <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                <span className="text-sm font-medium">{destination.rating}</span>
              </div>
            </div>
            <DialogHeader>
              <DialogTitle className="text-3xl font-serif font-bold text-foreground">
                {destination.name}
              </DialogTitle>
            </DialogHeader>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview">{labels.overview}</TabsTrigger>
              <TabsTrigger value="itinerary">{labels.itinerary}</TabsTrigger>
              <TabsTrigger value="packages">{labels.packages}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">{destination.description}</p>
              
              {/* Highlights */}
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  {labels.highlights}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {details.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>

              {/* What's Included */}
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  {labels.included}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {details.included.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="itinerary" className="space-y-4">
              {details.itinerary.map((day, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          {index + 1}
                        </div>
                        {index < details.itinerary.length - 1 && (
                          <div className="w-0.5 h-full bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <p className="text-xs text-primary font-medium mb-1">{day.day}</p>
                        <h5 className="font-semibold text-foreground mb-1">{day.title}</h5>
                        <p className="text-sm text-muted-foreground">{day.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="packages" className="space-y-4">
              {details.packages.map((pkg, index) => (
                <Card key={index} className={`border-border/50 ${index === 1 ? 'ring-2 ring-primary' : ''}`}>
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h5 className="font-semibold text-foreground text-lg">{pkg.name}</h5>
                          {index === 1 && (
                            <Badge className="bg-primary text-primary-foreground text-xs">
                              {language === "en" ? "Popular" : "ተወዳጅ"}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {pkg.duration}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {pkg.features.map((feature, i) => (
                            <Badge key={i} variant="secondary" className="text-xs font-normal">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-foreground">{pkg.price} ETB</p>
                          <p className="text-xs text-muted-foreground">{labels.perPerson}</p>
                        </div>
                        <Button className="w-full md:w-auto">{labels.bookPackage}</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          {/* Contact CTA */}
          <Card className="mt-6 border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-medium text-foreground">{labels.needHelp}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
                    <a href="tel:+251911234567">
                      <Phone className="h-4 w-4" />
                      {labels.callUs}
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
                    <a href="https://t.me/Kefkotravelagency" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" />
                      {labels.telegram}
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
