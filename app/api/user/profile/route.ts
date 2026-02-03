import { NextRequest, NextResponse } from "next/server"
import { getMongoDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

// GET /api/user/profile - Get user profile by userId
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        if (!userId) {
            return NextResponse.json(
                { error: "User ID required" },
                { status: 400 }
            )
        }

        const db = await getMongoDB()
        const usersCollection = db.collection('User')

        const user = await usersCollection.findOne(
            { _id: new ObjectId(userId) },
            {
                projection: {
                    name: 1,
                    email: 1,
                    phone: 1,
                    dateOfBirth: 1,
                    nationality: 1,
                    passportNumber: 1,
                    preferences: 1,
                    role: 1,
                    updatedAt: 1
                }
            }
        )

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            user: {
                ...user,
                id: user._id.toString()
            }
        })
    } catch (error) {
        console.error("Error fetching profile:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

// PATCH /api/user/profile - Update user profile
export async function PATCH(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        if (!userId) {
            return NextResponse.json(
                { error: "User ID required" },
                { status: 400 }
            )
        }

        const body = await request.json()
        const { name, phone, dateOfBirth, nationality, passportNumber, preferences } = body

        const db = await getMongoDB()
        const usersCollection = db.collection('User')

        const updateData: any = {}
        if (name) updateData.name = name
        if (phone !== undefined) updateData.phone = phone
        if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth)
        if (nationality !== undefined) updateData.nationality = nationality
        if (passportNumber !== undefined) updateData.passportNumber = passportNumber
        if (preferences !== undefined) updateData.preferences = preferences
        updateData.updatedAt = new Date()

        const result = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: updateData },
            { returnDocument: 'after' }
        )

        if (!result) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        const updatedUser = result.value || result
        const { password: _, ...userWithoutPassword } = updatedUser
        return NextResponse.json({
            message: "Profile updated successfully",
            user: {
                ...userWithoutPassword,
                id: updatedUser._id.toString()
            }
        })
    } catch (error) {
        console.error("Error updating profile:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
