import { NextRequest, NextResponse } from "next/server"
import { getMongoDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

type RouteContext = {
    params: Promise<{ id: string }>
}

// GET /api/bookings/[id] - Get a single booking
export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const userRole = searchParams.get('userRole')
        const { id } = await context.params

        if (!userId) {
            return NextResponse.json(
                { error: "User ID required" },
                { status: 400 }
            )
        }

        const db = await getMongoDB()
        const bookingsCollection = db.collection('Booking')

        const booking = await bookingsCollection.findOne({
            _id: new ObjectId(id)
        })

        if (!booking) {
            return NextResponse.json(
                { error: "Booking not found" },
                { status: 404 }
            )
        }

        // Security check: only owner or admin/agent can see booking
        if (booking.userId !== userId && userRole !== 'ADMIN' && userRole !== 'AGENT') {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            )
        }

        return NextResponse.json({
            booking: {
                ...booking,
                id: booking._id.toString()
            }
        })
    } catch (error) {
        console.error("Error fetching booking:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

// PATCH /api/bookings/[id] - Update a booking
export async function PATCH(request: NextRequest, context: RouteContext) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const userRole = searchParams.get('userRole')
        const { id } = await context.params

        if (!userId) {
            return NextResponse.json(
                { error: "User ID required" },
                { status: 400 }
            )
        }

        const db = await getMongoDB()
        const bookingsCollection = db.collection('Booking')

        const existingBooking = await bookingsCollection.findOne({
            _id: new ObjectId(id)
        })

        if (!existingBooking) {
            return NextResponse.json(
                { error: "Booking not found" },
                { status: 404 }
            )
        }

        const body = await request.json()
        const { status, departure, returnDate, travelers, destination, price } = body

        // Admin and Agent only for status updates
        if (status && userRole !== 'ADMIN' && userRole !== 'AGENT') {
            return NextResponse.json(
                { error: "Only admins and agents can update booking status" },
                { status: 403 }
            )
        }

        const updateData: any = {}
        if (status) updateData.status = status
        if (departure) updateData.departure = new Date(departure)
        if (returnDate) updateData.returnDate = new Date(returnDate)
        if (travelers) updateData.travelers = parseInt(travelers)
        if (destination) updateData.destination = destination
        if (price) updateData.price = parseFloat(price)
        updateData.updatedAt = new Date()

        const result = await bookingsCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        )

        if (!result) {
            return NextResponse.json(
                { error: "Booking not found after update" },
                { status: 404 }
            )
        }

        const updatedBooking = result.value || result

        return NextResponse.json({
            message: "Booking updated successfully",
            booking: {
                ...updatedBooking,
                id: updatedBooking._id.toString()
            }
        })
    } catch (error) {
        console.error("Error updating booking:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

// DELETE /api/bookings/[id] - Delete/Cancel a booking
export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const userRole = searchParams.get('userRole')
        const { id } = await context.params

        if (!userId) {
            return NextResponse.json(
                { error: "User ID required" },
                { status: 400 }
            )
        }

        const db = await getMongoDB()
        const bookingsCollection = db.collection('Booking')

        const existingBooking = await bookingsCollection.findOne({
            _id: new ObjectId(id)
        })

        if (!existingBooking) {
            return NextResponse.json(
                { error: "Booking not found" },
                { status: 404 }
            )
        }

        // Check if booking belongs to user or if admin/agent
        if (existingBooking.userId !== userId && userRole !== 'ADMIN' && userRole !== 'AGENT') {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            )
        }

        // Instead of deleting, mark as cancelled
        await bookingsCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    status: "CANCELLED",
                    updatedAt: new Date()
                }
            }
        )

        return NextResponse.json({
            message: "Booking cancelled successfully"
        })
    } catch (error) {
        console.error("Error cancelling booking:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
