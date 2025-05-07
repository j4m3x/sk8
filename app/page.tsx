"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBrandingContext } from "@/context/branding-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Mail, LockKeyhole, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { brandName, brandColor, logoUrl } = useBrandingContext()

  // Forgot password states
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [forgotPasswordStep, setForgotPasswordStep] = useState<"email" | "verification" | "reset">("email")
  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isResetting, setIsResetting] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login - in a real app, this would be an API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setIsResetting(true)

    // Simulate sending verification code
    setTimeout(() => {
      setIsResetting(false)
      setForgotPasswordStep("verification")
      toast({
        title: "Verification Code Sent",
        description: "A verification code has been sent to your email address.",
      })
    }, 1500)
  }

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault()
    setIsResetting(true)

    // Simulate verifying code
    setTimeout(() => {
      setIsResetting(false)
      if (verificationCode === "123456") {
        setForgotPasswordStep("reset")
      } else {
        toast({
          title: "Invalid Code",
          description: "The verification code you entered is invalid. Please try again.",
          variant: "destructive",
        })
      }
    }, 1500)
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "The passwords you entered don't match. Please try again.",
        variant: "destructive",
      })
      return
    }

    setIsResetting(true)

    // Simulate resetting password
    setTimeout(() => {
      setIsResetting(false)
      setForgotPasswordOpen(false)
      setForgotPasswordStep("email")
      setForgotPasswordEmail("")
      setVerificationCode("")
      setNewPassword("")
      setConfirmPassword("")

      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset successfully. You can now log in with your new password.",
      })
    }, 1500)
  }

  const resetForgotPasswordFlow = () => {
    setForgotPasswordStep("email")
    setForgotPasswordEmail("")
    setVerificationCode("")
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/30 via-background to-secondary/30 p-4">
      <div className="w-full max-w-md relative">
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>

        <Card className="border-0 shadow-2xl overflow-hidden bg-background/80 backdrop-blur-sm">
          <div className="h-1.5 bg-gradient-to-r from-primary to-secondary w-full"></div>
          <CardHeader className="space-y-1 text-center pt-8">
            <div className="flex justify-center mb-6">
              {logoUrl ? (
                <img src={logoUrl || "/placeholder.svg"} alt={brandName} className="h-20 w-auto" />
              ) : (
                <div className="h-20 w-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white text-3xl font-bold">
                  {brandName.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <CardTitle className="text-3xl font-bold" style={{ color: brandColor }}>
              {brandName}
            </CardTitle>
            <CardDescription className="text-base">Welcome back! Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 h-5 w-5 text-muted-foreground bg-primary/10 rounded-md flex items-center justify-center">
                    <Mail className="h-3.5 w-3.5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 border-input focus-visible:ring-primary rounded-lg h-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 font-normal text-xs"
                    style={{ color: brandColor }}
                    onClick={() => setForgotPasswordOpen(true)}
                  >
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-3 h-5 w-5 text-muted-foreground bg-primary/10 rounded-md flex items-center justify-center">
                    <LockKeyhole className="h-3.5 w-3.5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 border-input focus-visible:ring-primary rounded-lg h-12"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full text-white hover:opacity-90 mt-4 h-12 rounded-lg"
                style={{
                  background: `linear-gradient(to right, ${brandColor}, ${brandColor}CC)`,
                  boxShadow: `0 4px 14px 0 ${brandColor}40`,
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t bg-muted/30 px-6 py-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Don&apos;t have an account? Contact your administrator.</p>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotPasswordOpen}
        onOpenChange={(open) => {
          setForgotPasswordOpen(open)
          if (!open) resetForgotPasswordFlow()
        }}
      >
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
            <DialogDescription>
              {forgotPasswordStep === "email" && "Enter your email address to receive a verification code."}
              {forgotPasswordStep === "verification" && "Enter the verification code sent to your email."}
              {forgotPasswordStep === "reset" && "Create a new password for your account."}
            </DialogDescription>
          </DialogHeader>

          {forgotPasswordStep === "email" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email Address</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="name@example.com"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                  className="rounded-lg"
                />
              </div>
              <DialogFooter className="sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isResetting}
                  className="rounded-lg"
                  style={{
                    background: `linear-gradient(to right, ${brandColor}, ${brandColor}CC)`,
                  }}
                >
                  {isResetting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    "Send Code"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}

          {forgotPasswordStep === "verification" && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className="rounded-lg"
                />
                <p className="text-sm text-muted-foreground">
                  A verification code has been sent to {forgotPasswordEmail}
                </p>
              </div>
              <DialogFooter className="sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setForgotPasswordStep("email")}
                  className="rounded-lg"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isResetting}
                  className="rounded-lg"
                  style={{
                    background: `linear-gradient(to right, ${brandColor}, ${brandColor}CC)`,
                  }}
                >
                  {isResetting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}

          {forgotPasswordStep === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="rounded-lg"
                />
              </div>
              <DialogFooter className="sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setForgotPasswordStep("verification")}
                  className="rounded-lg"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isResetting}
                  className="rounded-lg"
                  style={{
                    background: `linear-gradient(to right, ${brandColor}, ${brandColor}CC)`,
                  }}
                >
                  {isResetting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
