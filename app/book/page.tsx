"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Plane, Building2, Car, FileText, Loader2, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

interface BookingData {
  type: string
  destination: string
  departure?: string
  returnDate?: string
  travelers: number
  price: number
  details?: any
}

export default function BookingPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isBooking, setIsBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Get booking data from URL params
  const type = searchParams.get('type') || ''
  const destination = searchParams.get('destination') || ''
  const urlPrice = parseFloat(searchParams.get('price') || '0')
  
  // Set default price for visa bookings if URL price is 0
  const [price, setPrice] = useState(() => {
    if (type.toUpperCase() === 'VISA' && urlPrice <= 0) {
      return 50000 // Default visa price
    }
    return urlPrice
  })
  
  const [formData, setFormData] = useState({
    travelers: 1,
    departureDate: '',
    returnDate: '',
    specialRequests: '',
    contactPhone: '',
    contactEmail: user?.email || ''
  })

  useEffect(() => {
    // Only redirect if auth is finished and user is still null
    if (!authLoading && !user) {
      router.push('/auth/signin')
    } else if (user) {
      // Update form data when user loads
      setFormData(prev => ({
        ...prev,
        contactEmail: user.email || prev.contactEmail
      }))
    }
  }, [user, authLoading, router])

  const getTypeIcon = () => {
    switch (type.toLowerCase()) {
      case 'flight': return <Plane className="h-6 w-6" />
      case 'hotel': return <Building2 className="h-6 w-6" />
      case 'car': return <Car className="h-6 w-6" />
      case 'visa': return <FileText className="h-6 w-6" />
      default: return <Plane className="h-6 w-6" />
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      router.push('/auth/signin')
      return
    }
    
    if (!user.id) {
      setError('Authentication error. Please sign in again.')
      return
    }
    
    setIsBooking(true)
    setError(null)

    try {
      // Validate required fields before sending
      if (!type || !destination) {
        setError('Missing required booking information. Please try again.')
        return
      }

      // Validate price is provided and valid for all booking types
      if (!price || price <= 0) {
        setError('Please enter a valid price for the booking.')
        return
      }

      const bookingData: BookingData = {
        type: type.toUpperCase(),
        destination,
        departure: formData.departureDate || undefined,
        returnDate: formData.returnDate || undefined,
        travelers: formData.travelers,
        price: price * formData.travelers,
        details: {
          contactPhone: formData.contactPhone,
          contactEmail: formData.contactEmail,
          specialRequests: formData.specialRequests,
          bookedAt: new Date().toISOString()
        }
      }

      const response = await fetch(`/api/bookings?userId=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      const responseData = await response.json()

      if (response.ok) {
        setBookingSuccess(true)
        setTimeout(() => {
          router.push('/bookings')
        }, 3000)
      } else {
        setError(responseData.error || 'Booking failed. Please try again.')
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      setError('Error creating booking. Please try again.')
    } finally {
      setIsBooking(false)
    }
  }

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4"
        >
          <Card className="text-center">
            <CardContent className="p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="h-8 w-8 text-green-600" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
              <p className="text-muted-foreground mb-4">
                Your {type.toLowerCase()} booking has been successfully created.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to your bookings...
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                {getTypeIcon()}
                <div>
                  <CardTitle className="text-2xl">Complete Your Booking</CardTitle>
                  <p className="text-muted-foreground">
                    {type.charAt(0).toUpperCase() + type.slice(1)} • {destination}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Base Price</span>
                  <span className="font-semibold">ETB {price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-muted-foreground">Travelers</span>
                  <span className="font-semibold">{formData.travelers}</span>
                </div>
                <div className="border-t mt-2 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-primary">
                      ETB {(price * formData.travelers).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="travelers">Number of Travelers</Label>
                    <Select 
                      value={formData.travelers.toString()} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, travelers: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Traveler</SelectItem>
                        <SelectItem value="2">2 Travelers</SelectItem>
                        <SelectItem value="3">3 Travelers</SelectItem>
                        <SelectItem value="4">4 Travelers</SelectItem>
                        <SelectItem value="5">5+ Travelers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {type.toLowerCase() === 'visa' && (
                    <div className="space-y-2">
                      <Label htmlFor="visaPrice">Visa Price (ETB)</Label>
                      <Input
                        id="visaPrice"
                        type="number"
                        placeholder="50000"
                        value={price}
                        onChange={(e) => {
                          const newPrice = parseFloat(e.target.value) || 0
                          setPrice(newPrice)
                          // Update the URL params to reflect the new price
                          const params = new URLSearchParams(searchParams)
                          params.set('price', newPrice.toString())
                          window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`)
                        }}
                        min="0"
                        step="1000"
                        required
                      />
                      <div className="flex gap-2 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPrice(35000)
                            const params = new URLSearchParams(searchParams)
                            params.set('price', '35000')
                            window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`)
                          }}
                        >
                          ETB 35,000
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPrice(50000)
                            const params = new URLSearchParams(searchParams)
                            params.set('price', '50000')
                            window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`)
                          }}
                        >
                          ETB 50,000
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPrice(75000)
                            const params = new URLSearchParams(searchParams)
                            params.set('price', '75000')
                            window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`)
                          }}
                        >
                          ETB 75,000
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Visa prices vary by destination and type. Common ranges: Tourist (ETB 35K-50K), Business (ETB 50K-75K), Express processing may cost extra.
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="+251 9xx xxx xxx"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                {(type.toLowerCase() === 'flight' || type.toLowerCase() === 'hotel') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="departureDate">Departure Date</Label>
                      <Input
                        id="departureDate"
                        type="date"
                        value={formData.departureDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, departureDate: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="returnDate">Return Date</Label>
                      <Input
                        id="returnDate"
                        type="date"
                        value={formData.returnDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, returnDate: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                  <textarea
                    id="specialRequests"
                    className="w-full min-h-[100px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                    placeholder="Any special requirements or requests..."
                    value={formData.specialRequests}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isBooking}
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing Booking...
                    </>
                  ) : (
                    `Confirm Booking - ETB ${(price * formData.travelers).toLocaleString()}`
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
