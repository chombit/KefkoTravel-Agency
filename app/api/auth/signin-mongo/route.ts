import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getMongoDB } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const db = await getMongoDB()
    const usersCollection = db.collection('User')

    // Find user by email
    const user = await usersCollection.findOne({ email })
    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      message: "Sign in successful",
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

  } catch (error) {
    console.error("Signin error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
