"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Save, Mail, Upload, Trash2, Sun, Moon, Palette, CreditCard, Key, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { ColorPicker } from "@/components/color-picker"
import { useBrandingContext } from "@/context/branding-context"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const { brandColor, setBrandColor, brandName, setBrandName, logoUrl, setLogoUrl } = useBrandingContext()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Pricing settings
  const [pricingSettings, setPricingSettings] = useState({
    standardRate: "500.00",
  })

  // Branding settings
  const [brandingSettings, setBrandingSettings] = useState({
    name: brandName || "SkateTrack",
    color: brandColor || "#3b82f6",
    logo: logoUrl || "",
    logoFile: null as File | null,
    logoPreview: logoUrl || "",
  })

  // Password change settings
  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    email: "admin@example.com",
    verificationCode: "",
    verificationSent: false,
    verificationConfirmed: false,
  })

  // Loading states
  const [isSaving, setIsSaving] = useState({
    pricing: false,
    branding: false,
    password: false,
  })

  // Update branding settings when context values change
  useEffect(() => {
    setBrandingSettings((prev) => ({
      ...prev,
      name: brandName || prev.name,
      color: brandColor || prev.color,
      logo: logoUrl || prev.logo,
      logoPreview: logoUrl || prev.logoPreview,
    }))
  }, [brandName, brandColor, logoUrl])

  // Theme effect
  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePricingChange = (field: string, value: string) => {
    setPricingSettings({
      ...pricingSettings,
      [field]: value,
    })
  }

  const handleBrandingChange = (field: string, value: string) => {
    setBrandingSettings({
      ...brandingSettings,
      [field]: value,
    })
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBrandingSettings({
          ...brandingSettings,
          logoFile: file,
          logoPreview: reader.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    setBrandingSettings({
      ...brandingSettings,
      logoFile: null,
      logoPreview: "",
      logo: "",
    })
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordSettings({
      ...passwordSettings,
      [field]: value,
    })
  }

  const sendVerificationCode = () => {
    // In a real app, this would send a verification code to the user's email
    setPasswordSettings({
      ...passwordSettings,
      verificationSent: true,
    })

    toast({
      title: "Verification Code Sent",
      description: `A verification code has been sent to ${passwordSettings.email}. Please check your inbox.`,
    })
  }

  const verifyCode = () => {
    // In a real app, this would verify the code against what was sent
    if (passwordSettings.verificationCode === "123456") {
      setPasswordSettings({
        ...passwordSettings,
        verificationConfirmed: true,
      })

      toast({
        title: "Verification Successful",
        description: "Your email has been verified. You can now change your password.",
      })
    } else {
      toast({
        title: "Verification Failed",
        description: "The verification code is incorrect. Please try again.",
        variant: "destructive",
      })
    }
  }

  const saveSettings = (settingType: string) => {
    // Set loading state
    setIsSaving((prev) => ({ ...prev, [settingType]: true }))

    // Simulate API call
    setTimeout(() => {
      setIsSaving((prev) => ({ ...prev, [settingType]: false }))

      if (settingType === "pricing") {
        toast({
          title: "Pricing Settings Saved",
          description: "Your pricing settings have been updated successfully.",
        })
      } else if (settingType === "branding") {
        // Update branding context
        setBrandName(brandingSettings.name)
        setBrandColor(brandingSettings.color)

        // If there's a new logo, in a real app we would upload it to a server
        // and then update the URL. Here we just use the preview.
        if (brandingSettings.logoPreview) {
          setLogoUrl(brandingSettings.logoPreview)
        }

        toast({
          title: "Branding Settings Saved",
          description: "Your branding settings have been updated successfully.",
        })
      } else if (settingType === "password") {
        // Check if passwords match
        if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
          toast({
            title: "Password Mismatch",
            description: "The new password and confirmation do not match.",
            variant: "destructive",
          })
          return
        }

        // Check if verification is confirmed
        if (!passwordSettings.verificationConfirmed) {
          toast({
            title: "Verification Required",
            description: "Please verify your email before changing your password.",
            variant: "destructive",
          })
          return
        }

        // In a real app, this would save the new password to a database or API
        toast({
          title: "Password Changed",
          description: "Your password has been changed successfully.",
        })

        // Reset the form
        setPasswordSettings({
          ...passwordSettings,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          verificationCode: "",
          verificationSent: false,
          verificationConfirmed: false,
        })
      }
    }, 1000)
  }

  // Don't render theme controls until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex-1 w-full space-y-4 p-4 md:p-6 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        </div>
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 w-full space-y-4 p-4 md:p-6 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <Tabs defaultValue="pricing" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Pricing</span>
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Branding</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">Password</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <CardTitle>Session Pricing</CardTitle>
              </div>
              <CardDescription>Configure the standard hourly rate for skating sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="standard-rate">Standard Rate (1 hour)</Label>
                <div className="flex items-center">
                  <span className="mr-2">NPR</span>
                  <Input
                    id="standard-rate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={pricingSettings.standardRate}
                    onChange={(e) => handlePricingChange("standardRate", e.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  This is the base rate charged for a standard 1-hour session.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => saveSettings("pricing")} disabled={isSaving.pricing}>
                {isSaving.pricing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Pricing Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-primary" />
                <CardTitle>Branding Settings</CardTitle>
              </div>
              <CardDescription>Customize your brand appearance throughout the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="brand-name">Brand Name</Label>
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="brand-name"
                    value={brandingSettings.name}
                    onChange={(e) => handleBrandingChange("name", e.target.value)}
                    placeholder="Enter your brand name"
                    className="flex-1"
                  />
                </div>
                <p className="text-sm text-muted-foreground">This name will be displayed throughout the application.</p>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Brand Logo</Label>
                {brandingSettings.logoPreview ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-48 h-48 border rounded-md overflow-hidden flex items-center justify-center bg-muted/50">
                      <img
                        src={brandingSettings.logoPreview || "/placeholder.svg"}
                        alt="Brand Logo Preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <Button variant="outline" onClick={() => document.getElementById("logo-upload")?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Change Logo
                      </Button>
                      <Button variant="outline" onClick={handleRemoveLogo}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Logo
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        Recommended size: 512x512 pixels.
                        <br />
                        Max file size: 2MB.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-48 h-48 border rounded-md flex items-center justify-center bg-muted/50">
                      <Upload className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <Button variant="outline" onClick={() => document.getElementById("logo-upload")?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Logo
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        Recommended size: 512x512 pixels.
                        <br />
                        Max file size: 2MB.
                      </p>
                    </div>
                  </div>
                )}
                <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Brand Color</Label>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <ColorPicker
                    color={brandingSettings.color}
                    onChange={(color) => handleBrandingChange("color", color)}
                  />
                  <div className="flex flex-col gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-full border"
                        style={{ backgroundColor: brandingSettings.color }}
                      ></div>
                      <Input
                        value={brandingSettings.color}
                        onChange={(e) => handleBrandingChange("color", e.target.value)}
                        className="w-32"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This color will be used as the primary brand color throughout the application.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => saveSettings("branding")} disabled={isSaving.branding}>
                {isSaving.branding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Branding Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                {theme === "dark" ? (
                  <Moon className="h-5 w-5 text-primary" />
                ) : (
                  <Sun className="h-5 w-5 text-primary" />
                )}
                <CardTitle>Appearance Settings</CardTitle>
              </div>
              <CardDescription>Customize the appearance of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme Mode</Label>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        {theme === "dark" ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                        <span className="font-medium">{theme === "dark" ? "Dark" : "Light"} Mode</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {theme === "dark"
                          ? "Dark mode reduces eye strain in low-light environments."
                          : "Light mode provides better readability in bright environments."}
                      </div>
                    </div>
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Theme Selection</Label>
                  <RadioGroup
                    defaultValue={theme}
                    onValueChange={setTheme}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div>
                      <RadioGroupItem value="light" id="light" className="peer sr-only" />
                      <Label
                        htmlFor="light"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Sun className="mb-3 h-6 w-6" />
                        <div className="font-medium">Light</div>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                      <Label
                        htmlFor="dark"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Moon className="mb-3 h-6 w-6" />
                        <div className="font-medium">Dark</div>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="system" id="system" className="peer sr-only" />
                      <Label
                        htmlFor="system"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="flex space-x-1">
                          <Sun className="mb-3 h-6 w-6" />
                          <Moon className="mb-3 h-6 w-6" />
                        </div>
                        <div className="font-medium">System</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-primary" />
                <CardTitle>Change Password</CardTitle>
              </div>
              <CardDescription>Update your account password securely</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="current-password"
                    type="password"
                    className="pl-10"
                    value={passwordSettings.currentPassword}
                    onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-verification">Email Verification</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email-verification"
                        type="email"
                        className="pl-10"
                        value={passwordSettings.email}
                        onChange={(e) => handlePasswordChange("email", e.target.value)}
                        disabled={passwordSettings.verificationSent}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={sendVerificationCode}
                      disabled={passwordSettings.verificationConfirmed}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      {passwordSettings.verificationSent ? "Resend Code" : "Send Code"}
                    </Button>
                  </div>
                </div>

                {passwordSettings.verificationSent && !passwordSettings.verificationConfirmed && (
                  <div className="space-y-2">
                    <Label htmlFor="verification-code">Verification Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="verification-code"
                        placeholder="Enter the 6-digit code"
                        value={passwordSettings.verificationCode}
                        onChange={(e) => handlePasswordChange("verificationCode", e.target.value)}
                      />
                      <Button type="button" onClick={verifyCode}>
                        Verify
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter the verification code sent to your email address.
                    </p>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type="password"
                    className="pl-10"
                    value={passwordSettings.newPassword}
                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                    disabled={!passwordSettings.verificationConfirmed}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    className="pl-10"
                    value={passwordSettings.confirmPassword}
                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                    disabled={!passwordSettings.verificationConfirmed}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => saveSettings("password")}
                disabled={!passwordSettings.verificationConfirmed || isSaving.password}
              >
                {isSaving.password ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Change Password
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
