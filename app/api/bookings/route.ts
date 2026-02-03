import { NextRequest, NextResponse } from "next/server"
import { getMongoDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

// GET /api/bookings - Get all bookings for current user
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        const db = await getMongoDB()
        const bookingsCollection = db.collection('Booking')

        let bookings
        if (userId) {
            // Get bookings for specific user
            bookings = await bookingsCollection
                .find({ userId })
                .sort({ createdAt: -1 })
                .toArray()
        } else {
            // Get all bookings (admin access) - include user information
            const usersCollection = db.collection('User')
            
            const bookingsData = await bookingsCollection
                .find({})
                .sort({ createdAt: -1 })
                .toArray()
            
            // Fetch user information for each booking
            bookings = await Promise.all(
                bookingsData.map(async (booking) => {
                    if (booking.userId) {
                        try {
                            const userDoc = await usersCollection.findOne(
                                { _id: new ObjectId(booking.userId) },
                                { projection: { name: 1, email: 1 } }
                            )
                            return {
                                ...booking,
                                userEmail: userDoc?.email,
                                userName: userDoc?.name
                            }
                        } catch (error) {
                            return booking
                        }
                    }
                    return booking
                })
            )
        }

        return NextResponse.json({ 
            bookings: bookings.map(booking => ({
                ...booking,
                id: booking._id.toString()
            }))
        })
    } catch (error) {
        console.error("Error fetching bookings:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const body = await request.json()
        const { type, destination, departure, returnDate, travelers, price, details } = body

        if (!userId) {
            return NextResponse.json(
                { error: "User ID required" },
                { status: 400 }
            )
        }

        // Validate required fields
        if (!type || !destination) {
            return NextResponse.json(
                { error: "Type and destination are required" },
                { status: 400 }
            )
        }

        // Validate price is provided and valid
        if (!price || parseFloat(price) <= 0) {
            return NextResponse.json(
                { error: "Valid price is required" },
                { status: 400 }
            )
        }

        const db = await getMongoDB()
        const bookingsCollection = db.collection('Booking')

        const booking = {
            userId,
            type,
            destination,
            departure: departure ? new Date(departure) : null,
            returnDate: returnDate ? new Date(returnDate) : null,
            travelers: travelers || 1,
            price: parseFloat(price),
            details: details || null,
            status: "PENDING",
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const result = await bookingsCollection.insertOne(booking)

        return NextResponse.json({
            message: "Booking created successfully",
            booking: {
                ...booking,
                id: result.insertedId.toString()
            }
        }, { status: 201 })
    } catch (error) {
        console.error("Error creating booking:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
