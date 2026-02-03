import { NextRequest, NextResponse } from "next/server"
import { getMongoDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const db = await getMongoDB()
    const usersCollection = db.collection('User')

    // Fetch all users (excluding passwords)
    const users = await usersCollection.find(
      {},
      { 
        projection: { 
          password: 0,
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          phone: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      users: users.map(user => ({
        ...user,
        id: user._id.toString()
      }))
    })

  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, role } = await request.json()

    if (!userId || !role || !['USER', 'AGENT', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { error: "Invalid user ID or role" },
        { status: 400 }
      )
    }

    const db = await getMongoDB()
    const usersCollection = db.collection('User')

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "User role updated successfully"
    })

  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const db = await getMongoDB()
    const usersCollection = db.collection('User')

    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "User deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
}
