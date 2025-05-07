"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Home, Clock, ShoppingBag, SkullIcon as Skateboard, Settings } from "lucide-react"
import { useBrandingContext } from "@/context/branding-context"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()
  const { brandName, brandColor, logoUrl } = useBrandingContext()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          {logoUrl ? (
            <img src={logoUrl || "/placeholder.svg"} alt={brandName} className="h-6 w-auto" />
          ) : (
            <Skateboard className="h-6 w-6" style={{ color: brandColor }} />
          )}
          <span className="font-bold text-xl" style={{ color: brandColor }}>
            {brandName}
          </span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
              <Link href="/dashboard">
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/sessions")}>
              <Link href="/dashboard/sessions">
                <Clock className="h-5 w-5" />
                <span>Sessions</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/inventory")}>
              <Link href="/dashboard/inventory">
                <ShoppingBag className="h-5 w-5" />
                <span>Shoe Inventory</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/analytics")}>
              <Link href="/dashboard/analytics">
                <BarChart3 className="h-5 w-5" />
                <span>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/settings")}>
              <Link href="/dashboard/settings">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="px-3 py-4">
        <div className="text-xs text-muted-foreground text-center">
          <p>{brandName} v1.0</p>
          <p>© 2023 Skate Park Management</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
