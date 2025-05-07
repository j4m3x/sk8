"use client"

import { useState } from "react"
import { Clock, DollarSign, Plus, ShoppingBag, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import * as XLSX from "xlsx"

export default function DashboardPage() {
  const [activeSessionCount, setActiveSessionCount] = useState(12)
  const [availableShoes, setAvailableShoes] = useState(28)
  const [totalShoes, setTotalShoes] = useState(50)

  const downloadReport = (format: string) => {
    // Create report data
    const reportData = [
      ["Dashboard Report", new Date().toLocaleString()],
      [""],
      ["Metric", "Value"],
      ["Active Sessions", activeSessionCount],
      ["Today's Visitors", "78"],
      ["Revenue", "NPR 4,231"],
      ["Available Shoes", `${availableShoes}/${totalShoes}`],
      [""],
    ]

    if (format === "csv") {
      // CSV export
      const csvContent = reportData.map((row) => row.join(",")).join("\n")
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `dashboard_report_${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (format === "xlsx") {
      // XLSX export
      const ws = XLSX.utils.aoa_to_sheet(reportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Dashboard Report")
      XLSX.writeFile(wb, `dashboard_report_${new Date().toISOString().split("T")[0]}.xlsx`)
    }
  }

  return (
    <div className="flex-1 w-full space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Session
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeSessionCount}</div>
            <p className="text-xs text-muted-foreground">+2 from last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">78</div>
            <p className="text-xs text-muted-foreground">+20% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">NPR 4,231</div>
            <p className="text-xs text-muted-foreground">+15% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shoe Inventory</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {availableShoes}/{totalShoes}
            </div>
            <Progress value={(availableShoes / totalShoes) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">{availableShoes} pairs available</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Session Overview</CardTitle>
            <p className="text-sm text-muted-foreground">Session distribution throughout the day</p>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[250px] flex items-end justify-between gap-2">
              {[40, 25, 30, 60, 80, 70, 55, 65, 75, 50, 30, 25].map((height, i) => (
                <div key={i} className="relative h-full w-full">
                  <div
                    className="absolute bottom-0 w-full bg-primary rounded-md"
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <div>9AM</div>
              <div>12PM</div>
              <div>3PM</div>
              <div>6PM</div>
              <div>9PM</div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
            <p className="text-sm text-muted-foreground">Currently active skaters</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Alex Smith", time: "1h 23m", shoeSize: "42", status: "skating" },
                { name: "Maya Johnson", time: "45m", shoeSize: "38", status: "skating" },
                { name: "Raj Patel", time: "2h 05m", shoeSize: "43", status: "skating" },
                { name: "Sarah Lee", time: "30m", shoeSize: "37", status: "skating" },
              ].map((session, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="font-medium">{session.name}</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-muted-foreground">{session.time}</div>
                    <div className="text-sm text-muted-foreground">Size: {session.shoeSize}</div>
                    <Badge>{session.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Sessions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
