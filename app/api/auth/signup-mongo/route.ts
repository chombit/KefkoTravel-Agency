import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getMongoDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    const db = await getMongoDB()
    const usersCollection = db.collection('User')

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user
    const result = await usersCollection.insertOne({
      _id: new ObjectId(),
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
      role: "USER",
      emailVerified: null,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const user = await usersCollection.findOne({ _id: result.insertedId })

    if (!user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    })

  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
