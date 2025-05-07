"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface BrandingContextType {
  brandName: string
  setBrandName: (name: string) => void
  brandColor: string
  setBrandColor: (color: string) => void
  logoUrl: string
  setLogoUrl: (url: string) => void
  applyBrandColor: (element: string) => object
}

const defaultBrandColor = "#3b82f6" // Default blue color

const BrandingContext = createContext<BrandingContextType>({
  brandName: "SkateTrack",
  setBrandName: () => {},
  brandColor: defaultBrandColor,
  setBrandColor: () => {},
  logoUrl: "",
  setLogoUrl: () => {},
  applyBrandColor: () => ({}),
})

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [brandName, setBrandName] = useState("SkateTrack")
  const [brandColor, setBrandColor] = useState(defaultBrandColor)
  const [logoUrl, setLogoUrl] = useState("")

  // Load branding settings from localStorage on initial render
  useEffect(() => {
    const storedName = localStorage.getItem("brandName")
    const storedColor = localStorage.getItem("brandColor")
    const storedLogo = localStorage.getItem("logoUrl")

    if (storedName) setBrandName(storedName)
    if (storedColor) setBrandColor(storedColor)
    if (storedLogo) setLogoUrl(storedLogo)
  }, [])

  // Save branding settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("brandName", brandName)
    localStorage.setItem("brandColor", brandColor)
    localStorage.setItem("logoUrl", logoUrl)

    // Update CSS variables for brand colors
    document.documentElement.style.setProperty("--brand-color", brandColor)

    // Generate lighter and darker variants
    const lighterColor = adjustColor(brandColor, 40)
    const darkerColor = adjustColor(brandColor, -40)

    document.documentElement.style.setProperty("--brand-color-light", lighterColor)
    document.documentElement.style.setProperty("--brand-color-dark", darkerColor)

    // Update primary color variables
    document.documentElement.style.setProperty("--primary", brandColor)
    document.documentElement.style.setProperty("--primary-foreground", "#ffffff")
  }, [brandName, brandColor, logoUrl])

  // Helper function to apply brand color to elements
  const applyBrandColor = (element: string) => {
    switch (element) {
      case "button":
        return { backgroundColor: brandColor, color: "#ffffff" }
      case "text":
        return { color: brandColor }
      case "border":
        return { borderColor: brandColor }
      case "background":
        return { backgroundColor: brandColor }
      default:
        return {}
    }
  }

  // Helper function to adjust color brightness
  function adjustColor(color: string, amount: number): string {
    // Remove the # if present
    color = color.replace("#", "")

    // Parse the color
    const r = Number.parseInt(color.substring(0, 2), 16)
    const g = Number.parseInt(color.substring(2, 4), 16)
    const b = Number.parseInt(color.substring(4, 6), 16)

    // Adjust each component
    const adjustR = Math.max(0, Math.min(255, r + amount))
    const adjustG = Math.max(0, Math.min(255, g + amount))
    const adjustB = Math.max(0, Math.min(255, b + amount))

    // Convert back to hex
    return `#${adjustR.toString(16).padStart(2, "0")}${adjustG.toString(16).padStart(2, "0")}${adjustB.toString(16).padStart(2, "0")}`
  }

  return (
    <BrandingContext.Provider
      value={{
        brandName,
        setBrandName,
        brandColor,
        setBrandColor,
        logoUrl,
        setLogoUrl,
        applyBrandColor,
      }}
    >
      {children}
    </BrandingContext.Provider>
  )
}

export const useBrandingContext = () => useContext(BrandingContext)
