"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, User, Save, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"

interface UserProfile {
    id: string
    name: string | null
    email: string
    phone: string | null
    dateOfBirth: string | null
    nationality: string | null
    passportNumber: string | null
    role: string
    createdAt: string
}

export default function ProfilePage() {
    const { user, isLoading: authLoading, signOut } = useAuth()
    const router = useRouter()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        dateOfBirth: "",
        nationality: "",
        passportNumber: ""
    })

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/signin")
        }
    }, [authLoading, user, router])

    useEffect(() => {
        if (user) {
            fetchProfile()
        }
    }, [user])

    const fetchProfile = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await fetch(`/api/user/profile?userId=${user?.id}`)
            if (response.ok) {
                const data = await response.json()
                setProfile(data.user)
                setFormData({
                    name: data.user.name || "",
                    phone: data.user.phone || "",
                    dateOfBirth: data.user.dateOfBirth ? data.user.dateOfBirth.split('T')[0] : "",
                    nationality: data.user.nationality || "",
                    passportNumber: data.user.passportNumber || ""
                })
            } else {
                setError("Failed to fetch profile")
            }
        } catch (err) {
            setError("Error connecting to server")
            console.error("Error fetching profile:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setError(null)
        setSuccess(null)

        try {
            const response = await fetch(`/api/user/profile?userId=${user?.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone || null,
                    dateOfBirth: formData.dateOfBirth || null,
                    nationality: formData.nationality || null,
                    passportNumber: formData.passportNumber || null
                })
            })

            if (response.ok) {
                const data = await response.json()
                setProfile(data.user)
                setSuccess("Profile updated successfully!")
            } else {
                const data = await response.json()
                setError(data.error || "Failed to update profile")
            }
        } catch (err) {
            setError("Error connecting to server")
            console.error("Error updating profile:", err)
        } finally {
            setIsSaving(false)
        }
    }

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-background/95 backdrop-blur">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/bookings">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to My Bookings
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
                    <p className="text-muted-foreground">Manage your personal information</p>
                </motion.div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                        <User className="w-8 h-8 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle>{profile?.name || "User"}</CardTitle>
                                        <CardDescription>{profile?.email}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {error && (
                                    <Alert variant="destructive" className="mb-4">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                {success && (
                                    <Alert className="mb-4 border-green-500 text-green-700">
                                        <AlertDescription>{success}</AlertDescription>
                                    </Alert>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                                placeholder="+251 9XX XXX XXX"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                            <Input
                                                id="dateOfBirth"
                                                type="date"
                                                value={formData.dateOfBirth}
                                                onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="nationality">Nationality</Label>
                                            <Input
                                                id="nationality"
                                                value={formData.nationality}
                                                onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                                                placeholder="Ethiopian"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="passportNumber">Passport Number</Label>
                                        <Input
                                            id="passportNumber"
                                            value={formData.passportNumber}
                                            onChange={(e) => setFormData(prev => ({ ...prev, passportNumber: e.target.value }))}
                                            placeholder="EP1234567"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Your passport information is securely stored and only used for booking purposes.
                                        </p>
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Button type="button" variant="outline" onClick={fetchProfile}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isSaving}>
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>

                                <div className="mt-8 pt-6 border-t">
                                    <h3 className="font-semibold mb-2">Account Information</h3>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <p>Email: {profile?.email}</p>
                                        <p>Account Type: {profile?.role}</p>
                                        <p>Member Since: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '-'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </main>
        </div>
    )
}
