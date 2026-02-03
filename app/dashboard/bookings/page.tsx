"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plane,
  Building2,
  Car,
  FileText,
  ArrowLeft,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
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
  userId: string
}

export default function DashboardBookings() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin")
    }
    
    if (!authLoading && user && user.role !== 'ADMIN' && user.role !== 'AGENT') {
      router.push("/bookings")
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'AGENT')) {
      fetchBookings()
    }
  }, [user])

  useEffect(() => {
    let result = bookings

    if (searchTerm) {
      result = result.filter(b =>
        b.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.userName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      result = result.filter(b => b.status === statusFilter)
    }

    if (typeFilter !== "all") {
      result = result.filter(b => b.type === typeFilter)
    }

    setFilteredBookings(result)
  }, [bookings, searchTerm, statusFilter, typeFilter])

  const fetchBookings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/bookings')
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    if (!user) return
    
    setIsUpdating(bookingId)
    try {
      const response = await fetch(`/api/bookings/${bookingId}?userId=${user.id}&userRole=${user.role}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Update local state
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: newStatus }
              : booking
          )
        )
      }
    } catch (error) {
      console.error("Error updating booking:", error)
    } finally {
      setIsUpdating(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'CANCELLED': return <XCircle className="h-4 w-4 text-red-600" />
      case 'PENDING': return <Clock className="h-4 w-4 text-yellow-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'flight': return <Plane className="h-5 w-5" />
      case 'hotel': return <Building2 className="h-5 w-5" />
      case 'car': return <Car className="h-5 w-5" />
      case 'visa': return <FileText className="h-5 w-5" />
      default: return <Plane className="h-5 w-5" />
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'AGENT')) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                Home
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Manage Bookings</h1>
              <p className="text-muted-foreground">
                {user.role === 'ADMIN' ? 'All customer bookings' : 'Manage customer bookings'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Destination, email, name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="FLIGHT">Flight</SelectItem>
                    <SelectItem value="HOTEL">Hotel</SelectItem>
                    <SelectItem value="CAR">Car Rental</SelectItem>
                    <SelectItem value="VISA">Visa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={fetchBookings}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings ({filteredBookings.length})</CardTitle>
            <CardDescription>
              Manage and update booking statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No bookings found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                          {getTypeIcon(booking.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{booking.destination}</h3>
                            <Badge variant="secondary">{booking.type}</Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Customer: {booking.userName || booking.userEmail}</p>
                            <p>Email: {booking.userEmail}</p>
                            <p>Travelers: {booking.travelers}</p>
                            <p>Price: ETB {booking.price.toLocaleString()}</p>
                            <p>Created: {new Date(booking.createdAt).toLocaleDateString()}</p>
                            {booking.departure && <p>Departure: {new Date(booking.departure).toLocaleDateString()}</p>}
                            {booking.returnDate && <p>Return: {new Date(booking.returnDate).toLocaleDateString()}</p>}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(booking.status)}
                          <Badge className={
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {booking.status}
                          </Badge>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {booking.status === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                                disabled={isUpdating === booking.id}
                              >
                                {isUpdating === booking.id ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                                disabled={isUpdating === booking.id}
                              >
                                {isUpdating === booking.id ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <XCircle className="h-4 w-4" />
                                )}
                                Cancel
                              </Button>
                            </>
                          )}
                          
                          {booking.status === 'CONFIRMED' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                              disabled={isUpdating === booking.id}
                            >
                              {isUpdating === booking.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                              Cancel
                            </Button>
                          )}
                          
                          {booking.status === 'CANCELLED' && (
                            <Button
                              size="sm"
                              onClick={() => updateBookingStatus(booking.id, 'PENDING')}
                              disabled={isUpdating === booking.id}
                            >
                              {isUpdating === booking.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <RefreshCw className="h-4 w-4" />
                              )}
                              Reactivate
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
