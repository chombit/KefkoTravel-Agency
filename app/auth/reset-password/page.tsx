"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowLeft, Lock, CheckCircle, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  useEffect(() => {
    // Validate token on component mount
    if (!token || !email) {
      setTokenValid(false)
      setError("Invalid reset link. Please request a new password reset.")
      return
    }

    // In a real app, you'd validate the token with the server
    // For now, we'll assume it's valid if it exists
    setTokenValid(true)
  }, [token, email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate passwords
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to reset password")
      } else {
        setSuccess(true)
        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          router.push("/auth/signin")
        }, 3000)
      }
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl border-0">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Invalid Reset Link
              </h2>
              <p className="text-muted-foreground mb-6">
                {error || "This password reset link is invalid or has expired."}
              </p>
              <div className="space-y-2">
                <Link href="/auth/forgot-password">
                  <Button className="w-full">
                    Request New Reset Link
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button className="w-full" variant="ghost">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl border-0">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Password Reset Successful!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your password has been successfully reset. You will be redirected to the sign in page.
              </p>
              <Link href="/auth/signin">
                <Button className="w-full">
                  Sign In Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="mx-auto mb-4"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Set New Password
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-11"
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={isLoading || !password || !confirmPassword}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>

            <div className="text-center">
              <Link 
                href="/auth/signin" 
                className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
