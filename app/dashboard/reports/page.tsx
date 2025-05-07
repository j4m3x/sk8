"use client"

import { useState } from "react"
import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Chart } from "@/components/ui/chart"
import {
  BarChart,
  LineChart,
  PieChart,
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  Pie,
  Cell,
} from "recharts"

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("week")

  const dailyData = [
    { name: "Mon", visitors: 45, revenue: 1200 },
    { name: "Tue", visitors: 52, revenue: 1350 },
    { name: "Wed", visitors: 48, revenue: 1280 },
    { name: "Thu", visitors: 61, revenue: 1450 },
    { name: "Fri", visitors: 78, revenue: 1800 },
    { name: "Sat", visitors: 94, revenue: 2200 },
    { name: "Sun", visitors: 85, revenue: 2000 },
  ]

  const monthlyData = [
    { name: "Jan", visitors: 1200, revenue: 32000 },
    { name: "Feb", visitors: 1350, revenue: 36000 },
    { name: "Mar", visitors: 1450, revenue: 38000 },
    { name: "Apr", visitors: 1200, revenue: 32000 },
    { name: "May", visitors: 1600, revenue: 42000 },
    { name: "Jun", visitors: 1800, revenue: 48000 },
  ]

  const shoeSizeData = [
    { name: "36-38", value: 15 },
    { name: "39-41", value: 35 },
    { name: "42-44", value: 30 },
    { name: "45+", value: 20 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  const downloadReport = (format: string) => {
    // Create a simple CSV report
    const reportData = [
      ["Skate Park Analytics Report", new Date().toLocaleString()],
      ["Time Range", timeRange],
      [""],
      ["Date", "Visitors", "Revenue"],
    ]

    // Add the data rows
    const data = timeRange === "month" ? monthlyData : dailyData
    data.forEach((item) => {
      reportData.push([item.name, item.visitors.toString(), `$${item.revenue.toString()}`])
    })

    // Add summary
    const totalVisitors = data.reduce((sum, item) => sum + item.visitors, 0)
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)

    reportData.push([""])
    reportData.push(["Total", totalVisitors.toString(), `$${totalRevenue.toString()}`])

    const csvContent = reportData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `skatepark_report_${timeRange}_${new Date().toISOString().split("T")[0]}.${format.toLowerCase()}`,
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => downloadReport("CSV")}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full sm:w-auto flex flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Visitor Trends</CardTitle>
                <CardDescription>Number of visitors over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Chart>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={timeRange === "month" ? monthlyData : dailyData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="visitors" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Chart>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
                <CardDescription>Revenue generated over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Chart>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timeRange === "month" ? monthlyData : dailyData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </Chart>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Recently generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Monthly Revenue Report - June 2023", date: "July 1, 2023", type: "CSV" },
                    { name: "Visitor Analytics - Q2 2023", date: "June 30, 2023", type: "CSV" },
                    { name: "Inventory Status Report", date: "June 28, 2023", type: "CSV" },
                    { name: "Staff Performance Review", date: "June 25, 2023", type: "CSV" },
                  ].map((report, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm text-muted-foreground">{report.date}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => downloadReport(report.type)}>
                        <Download className="h-4 w-4 mr-2" />
                        {report.type}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shoe Size Distribution</CardTitle>
                <CardDescription>Most popular shoe sizes</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Chart>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={shoeSizeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {shoeSizeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Chart>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
