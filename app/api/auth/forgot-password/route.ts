import { NextRequest, NextResponse } from "next/server"
import { getMongoDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

// POST /api/auth/forgot-password - Send password reset email
export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
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

        const db = await getMongoDB()
        const usersCollection = db.collection('User')

        // Check if user exists
        const user = await usersCollection.findOne({ email: email.toLowerCase() })

        // Always return success to prevent email enumeration attacks
        if (!user) {
            return NextResponse.json({
                message: "If an account with this email exists, a password reset link has been sent."
            })
        }

        // Generate a reset token (in a real app, you'd use a more secure method)
        const resetToken = new ObjectId().toString()
        const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

        // Store the reset token in the user document
        await usersCollection.updateOne(
            { _id: user._id },
            { 
                $set: { 
                    resetToken,
                    resetTokenExpiry
                }
            }
        )

        // In a real application, you would send an email here
        // For now, we'll just log the reset token (for development)
        console.log(`Password reset token for ${email}: ${resetToken}`)
        console.log(`Reset link: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`)

        // For development, we'll return the reset link in the response
        // In production, remove this and only send via email
        const isDevelopment = process.env.NODE_ENV === 'development'
        
        return NextResponse.json({
            message: "If an account with this email exists, a password reset link has been sent.",
            ...(isDevelopment && { 
                debugInfo: {
                    resetToken,
                    resetLink: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`
                }
            })
        })

    } catch (error) {
        console.error("Error in forgot password:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
