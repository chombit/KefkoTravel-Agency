import { NextRequest, NextResponse } from "next/server"
import { getMongoDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const db = await getMongoDB()
    const bookingsCollection = db.collection('Booking')
    const usersCollection = db.collection('User')

    // Fetch all bookings with user information
    const bookings = await bookingsCollection.find({}).sort({ createdAt: -1 }).toArray()

    // Get user information for each booking
    const bookingsWithUsers = await Promise.all(
      bookings.map(async (booking) => {
        const user = await usersCollection.findOne(
          { _id: new ObjectId(booking.userId) },
          { projection: { name: 1, email: 1 } }
        )
        
        return {
          ...booking,
          id: booking._id.toString(),
          user: user || { name: 'Unknown', email: 'unknown@example.com' }
        }
      })
    )

    return NextResponse.json({
      bookings: bookingsWithUsers
    })

  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { bookingId, status } = await request.json()

    if (!bookingId || !status || !['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return NextResponse.json(
        { error: "Invalid booking ID or status" },
        { status: 400 }
      )
    }

    const db = await getMongoDB()
    const bookingsCollection = db.collection('Booking')

    const result = await bookingsCollection.updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { status, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Booking status updated successfully"
    })

  } catch (error) {
    console.error("Error updating booking status:", error)
    return NextResponse.json(
      { error: "Failed to update booking status" },
      { status: 500 }
    )
  }
}
