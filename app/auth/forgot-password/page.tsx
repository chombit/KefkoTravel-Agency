"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowLeft, Mail, Plane, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to send reset email")
      } else {
        setSuccess(true)
      }
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
                <Mail className="w-8 h-8 text-primary" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Reset Your Password
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password
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

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Reset Link Sent!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    We've sent a password reset link to your email address. 
                    Please check your inbox and follow the instructions.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                </div>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setSuccess(false)
                      setEmail("")
                    }}
                  >
                    Try Another Email
                  </Button>
                  <Link href="/auth/signin">
                    <Button className="w-full" variant="ghost">
                      Back to Sign In
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={isLoading || !email}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            )}

            {!success && (
              <div className="text-center">
                <Link 
                  href="/auth/signin" 
                  className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to Sign In
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
