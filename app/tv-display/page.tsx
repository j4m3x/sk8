"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"

// Sample data for ended sessions
const endedSessionsData = [
  {
    id: 1,
    name: "Alex Smith",
    type: "Individual",
    startTime: "10:30 AM",
    endTime: "11:30 AM",
    duration: "1h",
  },
  {
    id: 2,
    name: "Garcia Family",
    type: "Group",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
    duration: "1h",
  },
  {
    id: 3,
    name: "Skate Club",
    type: "Group",
    startTime: "12:30 PM",
    endTime: "1:30 PM",
    duration: "1h",
  },
  {
    id: 4,
    name: "Sarah Lee",
    type: "Individual",
    startTime: "1:00 PM",
    endTime: "2:00 PM",
    duration: "1h",
  },
  {
    id: 5,
    name: "Tom Wilson",
    type: "Individual",
    startTime: "2:30 PM",
    endTime: "3:30 PM",
    duration: "1h",
  },
]

export default function TVDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [lastRefreshed, setLastRefreshed] = useState(new Date())
  const [endedSessions, setEndedSessions] = useState(endedSessionsData)

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Refresh data every minute (simulated)
  useEffect(() => {
    const refreshTimer = setInterval(() => {
      // In a real app, this would fetch new data from an API
      // For this demo, we'll just update the last refreshed time
      setLastRefreshed(new Date())

      // Simulate new data by shuffling the existing data
      setEndedSessions([...endedSessions].sort(() => Math.random() - 0.5))
    }, 60000) // 1 minute

    return () => clearInterval(refreshTimer)
  }, [endedSessions])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="p-6 border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 md:mb-0">⏰ Skaters – Session Time Ended</h1>
          <div className="text-2xl md:text-3xl font-mono">{format(currentTime, "h:mm:ss a")}</div>
        </div>
        <div className="container mx-auto mt-2 text-xl text-gray-400">{format(currentTime, "EEEE, MMMM d, yyyy")}</div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="container mx-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b-2 border-red-800">
                <th className="p-4 text-3xl">Skater / Group</th>
                <th className="p-4 text-3xl">Type</th>
                <th className="p-4 text-3xl">Start Time</th>
                <th className="p-4 text-3xl">End Time</th>
                <th className="p-4 text-3xl">Duration</th>
              </tr>
            </thead>
            <tbody>
              {endedSessions.map((session) => (
                <tr
                  key={session.id}
                  className="border-b border-gray-800 bg-gradient-to-r from-red-900/20 to-transparent"
                >
                  <td className="p-4 text-2xl font-bold">{session.name}</td>
                  <td className="p-4 text-2xl">{session.type}</td>
                  <td className="p-4 text-2xl">{session.startTime}</td>
                  <td className="p-4 text-2xl">{session.endTime}</td>
                  <td className="p-4 text-2xl">{session.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-gray-800 bg-gray-900 text-gray-400">
        <div className="container mx-auto text-center">Last updated: {format(lastRefreshed, "h:mm:ss a")}</div>
      </footer>
    </div>
  )
}
