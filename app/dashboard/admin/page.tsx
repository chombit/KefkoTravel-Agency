"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminOnly } from "@/components/role-guard"
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Settings,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"

interface User {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  createdAt: string
}

interface Booking {
  id: string
  type: string
  destination: string
  price: number
  status: string
  user: {
    name: string
    email: string
  }
  createdAt: string
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0
  })

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    fetchAdminData()
  }, [user, router])

  const fetchAdminData = async () => {
    try {
      // Fetch users
      const usersResponse = await fetch('/api/admin/users')
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.users || [])
      }

      // Fetch bookings
      const bookingsResponse = await fetch('/api/admin/bookings')
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        setBookings(bookingsData.bookings || [])
      }

      // Calculate stats
      setStats({
        totalUsers: users.length,
        totalBookings: bookings.length,
        totalRevenue: bookings.reduce((sum, b) => sum + b.price, 0),
        pendingBookings: bookings.filter(b => b.status === 'PENDING').length
      })
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AdminOnly fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    }>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Settings className="h-6 w-6 text-primary" />
                  <span className="font-bold text-xl">Admin Panel</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                  <Link href="/dashboard/admin" className="text-foreground font-medium">
                    Overview
                  </Link>
                  <Link href="/dashboard/admin/users" className="text-muted-foreground hover:text-foreground">
                    Users
                  </Link>
                  <Link href="/dashboard/admin/bookings" className="text-muted-foreground hover:text-foreground">
                    Bookings
                  </Link>
                </nav>
              </div>
              <Badge variant="secondary">ADMIN</Badge>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mb-8">
              Manage users, bookings, and system settings
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                        <p className="text-2xl font-bold">{stats.totalUsers}</p>
                      </div>
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                        <p className="text-2xl font-bold">{stats.totalBookings}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                        <p className="text-2xl font-bold">${stats.totalRevenue}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending Bookings</p>
                        <p className="text-2xl font-bold">{stats.pendingBookings}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Users */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>Newly registered users</CardDescription>
                  </div>
                  <Link href="/dashboard/admin/users">
                    <Button variant="outline">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 5).map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    >
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </AdminOnly>
  )
}
