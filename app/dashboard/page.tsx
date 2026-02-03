"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Plane,
  Building2,
  Car,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star,
  ArrowRight,
  RefreshCw
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"

interface Booking {
  id: string
  type: string
  destination: string
  departure: string | null
  returnDate: string | null
  travelers: number
  price: number
  status: string
  details: Record<string, unknown> | null
  createdAt: string
  userEmail?: string
  userName?: string
}

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin")
    }
    
    // Redirect customers to bookings page
    if (!authLoading && user && user.role === 'USER') {
      router.push("/bookings")
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'AGENT')) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/bookings") // Admin gets all bookings
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
      }
    } catch (err) {
      console.error("Error fetching bookings:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Only Admin and Agent should see this page
  if (user.role === 'USER') {
    return null // Will redirect
  }

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'PENDING').length,
    confirmedBookings: bookings.filter(b => b.status === 'CONFIRMED').length,
    completedBookings: bookings.filter(b => b.status === 'COMPLETED').length,
  }

  const recentBookings = bookings.slice(0, 5)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-muted-foreground">
                {user?.role === 'ADMIN' ? 'Admin Dashboard' : 'Agent Dashboard'}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/">
                <Button variant="outline">
                  Home
                </Button>
              </Link>
              <Link href="/dashboard/bookings">
                <Button>
                  Manage Bookings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button>
                  New Booking
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">{stats.totalBookings}</p>
                  </div>
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">{stats.pendingBookings}</p>
                  </div>
                  <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <RefreshCw className="h-4 w-4 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
                    <p className="text-2xl font-bold">{stats.confirmedBookings}</p>
                  </div>
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{stats.completedBookings}</p>
                  </div>
                  <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  {user?.role === 'ADMIN' ? 'All customer bookings' : 'Your managed bookings'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : recentBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No bookings yet</p>
                    <Link href="/">
                      <Button>Create First Booking</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                            {booking.type === 'FLIGHT' && <Plane className="h-5 w-5 text-primary" />}
                            {booking.type === 'HOTEL' && <Building2 className="h-5 w-5 text-primary" />}
                            {booking.type === 'CAR_RENTAL' && <Car className="h-5 w-5 text-primary" />}
                            {booking.type === 'VISA' && <FileText className="h-5 w-5 text-primary" />}
                          </div>
                          <div>
                            <p className="font-medium">{booking.destination}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.type.replace('_', ' ')} • {booking.travelers} traveler(s)
                            </p>
                            {booking.userEmail && (
                              <p className="text-xs text-muted-foreground">
                                {booking.userName || booking.userEmail}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {booking.status}
                          </Badge>
                          <p className="text-sm font-medium mt-1">ETB {booking.price.toLocaleString()}</p>
                        </div>
                      </motion.div>
                    ))}
                    <Link href="/dashboard/bookings">
                      <Button variant="outline" className="w-full">
                        Manage All Bookings
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/dashboard/bookings">
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Manage Bookings
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="w-full justify-start" variant="outline">
                    <Plane className="mr-2 h-4 w-4" />
                    Book Flight
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="w-full justify-start" variant="outline">
                    <Building2 className="mr-2 h-4 w-4" />
                    Book Hotel
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="w-full justify-start" variant="outline">
                    <Car className="mr-2 h-4 w-4" />
                    Rent Car
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Apply Visa
                  </Button>
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link href="/dashboard/users">
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Users
                    </Button>
                  </Link>
                )}
                <Link href="/contact">
                  <Button className="w-full justify-start" variant="outline">
                    <Phone className="mr-2 h-4 w-4" />
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
