"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plane, Building2, Car, FileText, Calendar, Users, Phone, MessageCircle, User as UserIcon } from "lucide-react"
import Link from "next/link"

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
}

interface BookingCardProps {
  booking: Booking & { userEmail?: string, userName?: string }
  isAdmin?: boolean
}

export function BookingCard({ booking, isAdmin = false }: BookingCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(booking.status)

  const handleStatusUpdate = async (newStatus: string) => {
    if (!isAdmin) return
    
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/bookings/${booking.id}?userId=admin`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setCurrentStatus(newStatus)
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
    } finally {
      setIsUpdating(false)
    }
  }
  const getBookingIcon = (type: string) => {
    switch (type) {
      case "FLIGHT": return Plane
      case "HOTEL": return Building2
      case "TOUR": return FileText
      case "VISA": return FileText
      case "CAR_RENTAL": return Car
      case "INSURANCE": return FileText
      default: return Calendar
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED": return "bg-green-100 text-green-800"
      case "PENDING": return "bg-yellow-100 text-yellow-800"
      case "CANCELLED": return "bg-red-100 text-red-800"
      case "COMPLETED": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const Icon = getBookingIcon(booking.type)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{booking.destination}</h3>
              <p className="text-sm text-muted-foreground">
                {booking.type.replace('_', ' ')} • {booking.travelers} traveler(s)
              </p>
              {isAdmin && booking.userEmail && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <UserIcon className="w-3 h-3" />
                  <span>{booking.userName || booking.userEmail}</span>
                  {booking.userName && booking.userEmail && (
                    <span className="text-xs">({booking.userEmail})</span>
                  )}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                {booking.departure
                  ? new Date(booking.departure).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : 'Date TBD'}
                {booking.returnDate && ` → ${new Date(booking.returnDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}`}
              </p>
              {booking.details && (
                <p className="text-sm text-muted-foreground">
                  Contact: {booking.details.contactPhone ? String(booking.details.contactPhone) : 'Not provided'}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xl font-bold">ETB {booking.price.toLocaleString()}</p>
              <Badge className={getStatusColor(currentStatus)}>
                {currentStatus}
              </Badge>
            </div>
            {isAdmin && (
              <div className="flex flex-col gap-2">
                <Select
                  value={currentStatus}
                  onValueChange={handleStatusUpdate}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {currentStatus === "PENDING" && !isAdmin && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Your booking is being processed. We'll contact you soon to confirm details.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <a href="tel:+251911123456">
                  <Phone className="h-4 w-4" />
                  Call Us
                </a>
              </Button>
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <a href="https://t.me/Kefkotravelagency" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  Telegram
                </a>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
