import { NextRequest, NextResponse } from "next/server"
import { getMongoDB } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

// POST /api/contact - Save contact form message
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { fullName, email, phone, message } = body

        // Validate required fields
        if (!fullName || !email || !phone || !message) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            )
        }

        // Save message to database
        const db = await getMongoDB()
        const contactCollection = db.collection('ContactMessage')

        const contactMessage = {
            fullName,
            email,
            phone,
            message,
            status: "UNREAD",
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const result = await contactCollection.insertOne(contactMessage)

        return NextResponse.json({
            message: "Message saved successfully",
            id: result.insertedId.toString()
        }, { status: 201 })
    } catch (error) {
        console.error("Error saving contact message:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

// GET /api/contact - Get all messages (admin only)
export async function GET(request: NextRequest) {
    try {
        // Note: In production, add admin auth check here
        const db = await getMongoDB()
        const contactCollection = db.collection('ContactMessage')

        const messages = await contactCollection
            .find({})
            .sort({ createdAt: -1 })
            .toArray()

        return NextResponse.json({ 
            messages: messages.map(msg => ({
                ...msg,
                id: msg._id.toString()
            }))
        })
    } catch (error) {
        console.error("Error fetching messages:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
