import { NextRequest, NextResponse } from "next/server"
import { getMongoDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

export const dynamic = "force-dynamic"

// POST /api/auth/reset-password - Reset password with token
export async function POST(request: NextRequest) {
    try {
        const { token, email, password } = await request.json()

        if (!token || !email || !password) {
            return NextResponse.json(
                { error: "Token, email, and password are required" },
                { status: 400 }
            )
        }

        // Validate password
        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters long" },
                { status: 400 }
            )
        }

        const db = await getMongoDB()
        const usersCollection = db.collection('User')

        // Find user with valid reset token
        const user = await usersCollection.findOne({
            email: email.toLowerCase(),
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() }
        })

        if (!user) {
            return NextResponse.json(
                { error: "Invalid or expired reset token" },
                { status: 400 }
            )
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Update user password and clear reset token
        await usersCollection.updateOne(
            { _id: user._id },
            { 
                $set: { 
                    password: hashedPassword,
                    updatedAt: new Date()
                },
                $unset: {
                    resetToken: "",
                    resetTokenExpiry: ""
                }
            }
        )

        return NextResponse.json({
            message: "Password reset successfully"
        })

    } catch (error) {
        console.error("Error in reset password:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
