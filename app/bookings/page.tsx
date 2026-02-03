"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ArrowLeft,
    Search,
    Filter,
    RefreshCw
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { BookingCard } from "@/components/booking-card"

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

export default function BookingsPage() {
    const { user, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const [bookings, setBookings] = useState<Booking[]>([])
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/signin")
        }
    }, [authLoading, user, router])

    useEffect(() => {
        if (user) {
            fetchBookings()
        }
    }, [user])

    useEffect(() => {
        let result = bookings

        if (searchTerm) {
            result = result.filter(b =>
                b.destination.toLowerCase().includes(searchTerm.toLowerCase())
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
        setError(null)
        try {
            // Admin can see all bookings, users can only see their own
            const isAdmin = user?.role === 'ADMIN'
            const url = isAdmin ? '/api/bookings' : `/api/bookings?userId=${user?.id}`
            
            const response = await fetch(url)
            if (response.ok) {
                const data = await response.json()
                setBookings(data.bookings || [])
            } else {
                setError("Failed to fetch bookings")
            }
        } catch (err) {
            setError("Error connecting to server")
            console.error("Error fetching bookings:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancelBooking = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this booking?")) return

        try {
            const response = await fetch(`/api/bookings/${id}?userId=${user?.id}`, {
                method: "DELETE"
            })
            if (response.ok) {
                fetchBookings()
            }
        } catch (err) {
            console.error("Error cancelling booking:", err)
        }
    }

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
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

            <main className="flex-1 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">
                                {user?.role === 'ADMIN' ? 'All Bookings' : 'My Bookings'}
                            </h1>
                            <p className="text-muted-foreground">
                                {user?.role === 'ADMIN' 
                                    ? 'Manage and view all customer bookings' 
                                    : 'View and manage your travel bookings'
                                }
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchBookings}
                                disabled={isLoading}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            {user?.role !== 'ADMIN' && (
                                <Link href="/">
                                    <Button>
                                        New Booking
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Filters */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search bookings..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full md:w-40">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className="w-full md:w-40">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="FLIGHT">Flight</SelectItem>
                                        <SelectItem value="HOTEL">Hotel</SelectItem>
                                        <SelectItem value="TOUR">Tour</SelectItem>
                                        <SelectItem value="VISA">Visa</SelectItem>
                                        <SelectItem value="CAR_RENTAL">Car Rental</SelectItem>
                                        <SelectItem value="INSURANCE">Insurance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                {/* Bookings List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <Card>
                        <CardContent className="text-center py-16">
                            <p className="text-red-500 mb-4">{error}</p>
                            <Button onClick={fetchBookings}>Try Again</Button>
                        </CardContent>
                    </Card>
                ) : filteredBookings.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-16">
                            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">
                                {bookings.length === 0
                                    ? "No bookings yet. Start planning your next adventure!"
                                    : "No bookings match your filters."}
                            </p>
                            {bookings.length === 0 && (
                                <Link href="/">
                                    <Button>Browse Services</Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking, index) => (
                            <motion.div
                                key={booking.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <BookingCard 
                                    booking={booking} 
                                    isAdmin={user?.role === 'ADMIN'} 
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
                </div>
            </main>
        </div>
    )
}
