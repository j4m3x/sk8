import type React from "react"
import "./globals.css"
import { Poppins } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { BrandingProvider } from "@/context/branding-context"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata = {
  title: "Skate Park Management System",
  description: "A comprehensive management system for skate parks",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <BrandingProvider>
            {children}
            <Toaster />
          </BrandingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
