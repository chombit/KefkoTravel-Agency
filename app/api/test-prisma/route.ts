import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Prisma connected successfully')
    
    // Test a simple query
    const userCount = await prisma.user.count()
    console.log('✅ User count query successful:', userCount)
    
    return NextResponse.json({
      message: "Prisma connection successful",
      userCount,
      database: process.env.DATABASE_URL ? "configured" : "not configured"
    })
  } catch (error) {
    console.error("Prisma test error:", error)
    return NextResponse.json({
      error: "Prisma connection failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
