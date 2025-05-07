"use client"

import { useState, useMemo } from "react"
import { FileDown, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResponsiveTable } from "@/components/responsive-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import * as XLSX from "xlsx"
import type { DateRange } from "react-day-picker"
import { format, subDays, isToday, isSameDay, parseISO, addDays } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Define types for our data
interface Session {
  id: number
  date: string
  name: string
  type: "individual" | "group"
  participants: number
  startTime: string
  endTime: string
  duration: string
  shoeSizes: string
  revenue: number
}

interface DailyRevenue {
  date: string
  totalRevenue: number
  totalSkaters: number
  notes: string
}

interface CombinedDailySummary {
  date: string
  totalRevenue: number
  totalSkaters: number
  sessionCount: number
  averageSessionDuration: string
  notes: string
}

export default function AnalyticsPage() {
  // Date range state
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "year" | "custom">("week")
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })

  // Format currency function
  const formatCurrency = (value: number) => {
    return `NPR ${value.toLocaleString()}`
  }

  // Generate dates for the selected range
  const dateRangeArray = useMemo(() => {
    const dates = []
    let startDate
    let endDate = new Date()

    switch (dateRange) {
      case "today":
        startDate = new Date()
        break
      case "week":
        startDate = subDays(new Date(), 7)
        break
      case "month":
        startDate = subDays(new Date(), 30)
        break
      case "year":
        startDate = subDays(new Date(), 365)
        break
      case "custom":
        if (customDateRange?.from) {
          startDate = customDateRange.from
          if (customDateRange.to) {
            endDate = customDateRange.to
          }
        } else {
          startDate = subDays(new Date(), 7)
        }
        break
    }

    let currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      dates.push(format(currentDate, "yyyy-MM-dd"))
      currentDate = addDays(currentDate, 1)
    }

    return dates
  }, [dateRange, customDateRange])

  // Sample session data
  const sessionData: Session[] = [
    {
      id: 1,
      date: "2023-06-14",
      name: "Alex Smith",
      type: "individual",
      participants: 1,
      startTime: "10:30 AM",
      endTime: "11:30 AM",
      duration: "1h",
      shoeSizes: "42",
      revenue: 500,
    },
    {
      id: 2,
      date: "2023-06-14",
      name: "Maya Johnson",
      type: "individual",
      participants: 1,
      startTime: "11:15 AM",
      endTime: "12:15 PM",
      duration: "1h",
      shoeSizes: "38",
      revenue: 500,
    },
    {
      id: 3,
      date: "2023-06-13",
      name: "Raj Patel",
      type: "individual",
      participants: 1,
      startTime: "09:55 AM",
      endTime: "11:55 AM",
      duration: "2h",
      shoeSizes: "43",
      revenue: 800,
    },
    {
      id: 4,
      date: "2023-06-13",
      name: "Sarah Lee",
      type: "individual",
      participants: 1,
      startTime: "12:30 PM",
      endTime: "1:30 PM",
      duration: "1h",
      shoeSizes: "37",
      revenue: 500,
    },
    {
      id: 5,
      date: "2023-06-12",
      name: "Tom Wilson",
      type: "individual",
      participants: 1,
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      duration: "2h",
      shoeSizes: "44",
      revenue: 800,
    },
    {
      id: 6,
      date: "2023-06-12",
      name: "Emma Davis",
      type: "individual",
      participants: 1,
      startTime: "11:45 AM",
      endTime: "1:00 PM",
      duration: "1h 15m",
      shoeSizes: "39",
      revenue: 600,
    },
    {
      id: 7,
      date: "2023-06-11",
      name: "Skate Club",
      type: "group",
      participants: 3,
      startTime: "01:30 PM",
      endTime: "2:30 PM",
      duration: "1h",
      shoeSizes: "45, 38, 43",
      revenue: 1200,
    },
    {
      id: 8,
      date: "2023-06-10",
      name: "Garcia Family",
      type: "group",
      participants: 3,
      startTime: "02:15 PM",
      endTime: "3:15 PM",
      duration: "1h",
      shoeSizes: "36, 44, 38",
      revenue: 1200,
    },
    {
      id: 9,
      date: "2023-06-09",
      name: "Beginners Class",
      type: "group",
      participants: 5,
      startTime: "09:00 AM",
      endTime: "10:30 AM",
      duration: "1h 30m",
      shoeSizes: "37, 38, 40, 42, 39",
      revenue: 2000,
    },
    {
      id: 10,
      date: "2023-06-08",
      name: "Advanced Workshop",
      type: "group",
      participants: 4,
      startTime: "04:00 PM",
      endTime: "06:00 PM",
      duration: "2h",
      shoeSizes: "41, 43, 44, 42",
      revenue: 2000,
    },
    // Additional data for more dates
    {
      id: 11,
      date: "2023-06-07",
      name: "John Doe",
      type: "individual",
      participants: 1,
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      duration: "1h",
      shoeSizes: "42",
      revenue: 500,
    },
    {
      id: 12,
      date: "2023-06-07",
      name: "Jane Smith",
      type: "individual",
      participants: 1,
      startTime: "11:30 AM",
      endTime: "12:30 PM",
      duration: "1h",
      shoeSizes: "38",
      revenue: 500,
    },
    {
      id: 13,
      date: "2023-06-06",
      name: "Youth Group",
      type: "group",
      participants: 6,
      startTime: "02:00 PM",
      endTime: "04:00 PM",
      duration: "2h",
      shoeSizes: "36, 37, 38, 39, 40, 41",
      revenue: 2400,
    },
    {
      id: 14,
      date: "2023-06-05",
      name: "Mike Johnson",
      type: "individual",
      participants: 1,
      startTime: "09:00 AM",
      endTime: "10:00 AM",
      duration: "1h",
      shoeSizes: "44",
      revenue: 500,
    },
    {
      id: 15,
      date: "2023-06-05",
      name: "Lisa Chen",
      type: "individual",
      participants: 1,
      startTime: "10:30 AM",
      endTime: "11:30 AM",
      duration: "1h",
      shoeSizes: "37",
      revenue: 500,
    },
  ]

  // Filter data based on selected date range
  const filteredSessionData = useMemo(() => {
    return sessionData.filter((session) => {
      // For "today", only show today's sessions
      if (dateRange === "today") {
        return isToday(parseISO(session.date))
      }

      // For other ranges, check if the session date is within the range
      if (dateRange === "custom" && customDateRange?.from) {
        const sessionDate = parseISO(session.date)
        if (customDateRange.to) {
          return sessionDate >= customDateRange.from && sessionDate <= customDateRange.to
        }
        return isSameDay(sessionDate, customDateRange.from)
      }

      // For week/month/year, check if the session date is in our dateRangeArray
      return dateRangeArray.includes(session.date)
    })
  }, [sessionData, dateRange, customDateRange, dateRangeArray])

  // Calculate combined daily summary
  const combinedDailySummary = useMemo(() => {
    // Group sessions by day
    const groupedData: Record<string, Session[]> = {}
    filteredSessionData.forEach((session) => {
      if (!groupedData[session.date]) {
        groupedData[session.date] = []
      }
      groupedData[session.date].push(session)
    })

    // Create summary for each day
    return Object.entries(groupedData)
      .map(([date, sessions]) => {
        const totalParticipants = sessions.reduce((sum, session) => sum + session.participants, 0)
        const totalRevenue = sessions.reduce((sum, session) => sum + session.revenue, 0)

        // Calculate average session duration (simplified for this example)
        const sessionCount = sessions.length
        let averageDuration = "1h" // Default

        // Just a simple example of calculating average duration
        if (sessionCount > 0) {
          const hasLongerSessions = sessions.some((s) => s.duration.includes("2h"))
          averageDuration = hasLongerSessions ? "1h 30m" : "1h"
        }

        return {
          date,
          totalRevenue,
          totalSkaters: totalParticipants,
          sessionCount,
          averageSessionDuration: averageDuration,
          notes: sessionCount > 3 ? "Busy day" : "",
        }
      })
      .sort((a, b) => b.date.localeCompare(a.date)) // Sort by date descending
  }, [filteredSessionData])

  // Combined summary table columns
  const combinedColumns = [
    {
      key: "date",
      title: "Date",
      render: (value: string) => <div>{format(parseISO(value), "MMM dd, yyyy")}</div>,
    },
    {
      key: "sessionCount",
      title: "Sessions",
      render: (value: number) => <div className="font-medium">{value}</div>,
    },
    {
      key: "totalSkaters",
      title: "Total Skaters",
      render: (value: number) => <div className="font-medium">{value}</div>,
    },
    {
      key: "totalRevenue",
      title: "Total Revenue",
      render: (value: number) => <div className="font-medium">{formatCurrency(value)}</div>,
    },
    {
      key: "averageSessionDuration",
      title: "Avg. Duration",
      render: (value: string) => <div>{value}</div>,
    },
    {
      key: "notes",
      title: "Notes",
      render: (value: string) => <div className="text-sm text-muted-foreground">{value || "—"}</div>,
    },
  ]

  // Session details table columns
  const sessionColumns = [
    {
      key: "date",
      title: "Date",
      render: (value: string) => <div>{format(parseISO(value), "MMM dd, yyyy")}</div>,
    },
    {
      key: "name",
      title: "Name",
      render: (value: string, item: Session) => (
        <div>
          <span className="font-medium">{value}</span>
          {item.type === "group" && (
            <Badge variant="outline" className="ml-2">
              Group
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "participants",
      title: "Participants",
      render: (value: number) => <div className="text-sm">{value}</div>,
    },
    {
      key: "startTime",
      title: "Start Time",
    },
    {
      key: "endTime",
      title: "End Time",
    },
    {
      key: "duration",
      title: "Duration",
    },
    {
      key: "revenue",
      title: "Revenue",
      render: (value: number) => <div className="font-medium">{formatCurrency(value)}</div>,
    },
  ]

  // Export data function
  const exportData = (format: string) => {
    const summaryData = combinedDailySummary
    const detailData = filteredSessionData

    if (format === "csv") {
      // CSV export - Summary
      const summaryHeaders = ["Date", "Sessions", "Total Skaters", "Total Revenue", "Avg. Duration", "Notes"]
      const summaryRows = summaryData.map((item) => [
        format(parseISO(item.date), "MMM dd, yyyy"),
        item.sessionCount,
        item.totalSkaters,
        formatCurrency(item.totalRevenue),
        item.averageSessionDuration,
        item.notes,
      ])

      // CSV export - Details
      const detailHeaders = ["Date", "Name", "Type", "Participants", "Start Time", "End Time", "Duration", "Revenue"]
      const detailRows = detailData.map((item) => [
        format(parseISO(item.date), "MMM dd, yyyy"),
        item.name,
        item.type,
        item.participants,
        item.startTime,
        item.endTime,
        item.duration,
        formatCurrency(item.revenue),
      ])

      const csvContent = [
        [`Analytics Report - ${dateRange === "custom" ? "Custom Range" : dateRange}`, new Date().toLocaleString()],
        [""],
        ["SUMMARY"],
        summaryHeaders,
        ...summaryRows,
        [""],
        ["DETAILS"],
        detailHeaders,
        ...detailRows,
      ]
        .map((row) => row.join(","))
        .join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `analytics_report_${dateRange}_${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (format === "xlsx") {
      // XLSX export
      const wb = XLSX.utils.book_new()

      // Summary worksheet
      const summaryWsData = [
        ["Date", "Sessions", "Total Skaters", "Total Revenue", "Avg. Duration", "Notes"],
        ...summaryData.map((item) => [
          format(parseISO(item.date), "MMM dd, yyyy"),
          item.sessionCount,
          item.totalSkaters,
          formatCurrency(item.totalRevenue),
          item.averageSessionDuration,
          item.notes,
        ]),
      ]
      const summaryWs = XLSX.utils.aoa_to_sheet(summaryWsData)
      XLSX.utils.book_append_sheet(wb, summaryWs, "Summary")

      // Details worksheet
      const detailsWsData = [
        ["Date", "Name", "Type", "Participants", "Start Time", "End Time", "Duration", "Revenue"],
        ...detailData.map((item) => [
          format(parseISO(item.date), "MMM dd, yyyy"),
          item.name,
          item.type,
          item.participants,
          item.startTime,
          item.endTime,
          item.duration,
          formatCurrency(item.revenue),
        ]),
      ]
      const detailsWs = XLSX.utils.aoa_to_sheet(detailsWsData)
      XLSX.utils.book_append_sheet(wb, detailsWs, "Details")

      XLSX.writeFile(wb, `analytics_report_${dateRange}_${new Date().toISOString().split("T")[0]}.xlsx`)
    }
  }

  // Calculate totals for the selected period
  const periodTotals = useMemo(() => {
    const totalSessions = filteredSessionData.length
    const totalSkaters = filteredSessionData.reduce((sum, session) => sum + session.participants, 0)
    const totalRevenue = filteredSessionData.reduce((sum, session) => sum + session.revenue, 0)

    return {
      totalSessions,
      totalSkaters,
      totalRevenue,
    }
  }, [filteredSessionData])

  return (
    <div className="flex-1 w-full space-y-6 p-4 md:p-6 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>

        {/* Date range selector */}
        <div className="flex flex-wrap items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {dateRange === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {customDateRange?.from ? (
                    customDateRange.to ? (
                      <>
                        {format(customDateRange.from, "LLL dd, y")} - {format(customDateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(customDateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={customDateRange?.from}
                  selected={customDateRange}
                  onSelect={setCustomDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportData("csv")}>
                <FileDown className="mr-2 h-4 w-4" />
                <span>CSV</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportData("xlsx")}>
                <FileDown className="mr-2 h-4 w-4" />
                <span>Excel (XLSX)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Period Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{periodTotals.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              For{" "}
              {dateRange === "today"
                ? "today"
                : dateRange === "week"
                  ? "the last 7 days"
                  : dateRange === "month"
                    ? "this month"
                    : dateRange === "year"
                      ? "this year"
                      : "the selected period"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Skaters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{periodTotals.totalSkaters}</div>
            <p className="text-xs text-muted-foreground">
              For{" "}
              {dateRange === "today"
                ? "today"
                : dateRange === "week"
                  ? "the last 7 days"
                  : dateRange === "month"
                    ? "this month"
                    : dateRange === "year"
                      ? "this year"
                      : "the selected period"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(periodTotals.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              For{" "}
              {dateRange === "today"
                ? "today"
                : dateRange === "week"
                  ? "the last 7 days"
                  : dateRange === "month"
                    ? "this month"
                    : dateRange === "year"
                      ? "this year"
                      : "the selected period"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Combined Daily Summary Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Daily Summary</CardTitle>
            <CardDescription>Combined session and revenue data by day</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {combinedDailySummary.length > 0 ? (
            <ResponsiveTable data={combinedDailySummary} columns={combinedColumns} keyField="date" />
          ) : (
            <ResponsiveTable
              data={[
                {
                  date: format(new Date(), "yyyy-MM-dd"),
                  sessionCount: 5,
                  totalSkaters: 10,
                  totalRevenue: 5000,
                  averageSessionDuration: "1h 15m",
                  notes: "Sample data",
                },
                {
                  date: format(subDays(new Date(), 1), "yyyy-MM-dd"),
                  sessionCount: 4,
                  totalSkaters: 8,
                  totalRevenue: 4000,
                  averageSessionDuration: "1h",
                  notes: "Example entry",
                },
              ]}
              columns={combinedColumns}
              keyField="date"
            />
          )}
        </CardContent>
      </Card>

      {/* Session Details Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Session Details</CardTitle>
            <CardDescription>Individual session records</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSessionData.length > 0 ? (
            <ResponsiveTable data={filteredSessionData} columns={sessionColumns} keyField="id" />
          ) : (
            <ResponsiveTable
              data={[
                {
                  id: "dummy-1",
                  date: format(new Date(), "yyyy-MM-dd"),
                  name: "Sample Skater",
                  type: "individual",
                  participants: 1,
                  startTime: "10:00 AM",
                  endTime: "11:00 AM",
                  duration: "1h",
                  shoeSizes: "42",
                  revenue: 500,
                },
                {
                  id: "dummy-2",
                  date: format(new Date(), "yyyy-MM-dd"),
                  name: "Demo Group",
                  type: "group",
                  participants: 3,
                  startTime: "2:00 PM",
                  endTime: "3:30 PM",
                  duration: "1h 30m",
                  shoeSizes: "38, 40, 43",
                  revenue: 1500,
                },
              ]}
              columns={sessionColumns}
              keyField="id"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
