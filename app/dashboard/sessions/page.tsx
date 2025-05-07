"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Clock, Edit, FileDown, Plus, Undo, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResponsiveTable } from "@/components/responsive-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import * as XLSX from "xlsx"
import { Textarea } from "@/components/ui/textarea"

// Define types for our data structure
interface Participant {
  name: string
  shoeSize: string
}

interface Session {
  id: number
  name: string
  isGroup: boolean
  participants: Participant[]
  startTime: string
  endTime: string
  duration: string
  status: string
  notes: string
  createdBy: string
}

export default function SessionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const { toast } = useToast()

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      // Check for sessions that need to be ended
      checkSessionEndTimes()
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  // Function to parse time string to Date object
  const parseTimeString = (timeStr: string) => {
    const today = new Date()
    const [time, period] = timeStr.split(" ")
    let [hours, minutes] = time.split(":").map(Number)

    if (period === "PM" && hours < 12) {
      hours += 12
    } else if (period === "AM" && hours === 12) {
      hours = 0
    }

    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes)
  }

  // Function to calculate end time based on start time and duration
  const calculateEndTime = (startTimeStr: string, durationStr: string) => {
    const startTime = parseTimeString(startTimeStr)

    let hours = 0
    let minutes = 0

    if (durationStr.includes("h")) {
      const parts = durationStr.split("h")
      hours = Number.parseInt(parts[0], 10)

      if (parts[1] && parts[1].includes("m")) {
        minutes = Number.parseInt(parts[1].trim().replace("m", ""), 10)
      }
    } else if (durationStr.includes("m")) {
      minutes = Number.parseInt(durationStr.replace("m", ""), 10)
    }

    const endTime = new Date(startTime)
    endTime.setHours(endTime.getHours() + hours)
    endTime.setMinutes(endTime.getMinutes() + minutes)

    return endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Initial sessions data with calculated end times
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 1,
      name: "Alex Smith",
      isGroup: false,
      participants: [{ name: "Alex Smith", shoeSize: "42" }],
      startTime: "10:30 AM",
      endTime: "11:30 AM", // 1 hour duration
      duration: "1h",
      status: "active",
      notes: "",
      createdBy: "Admin User",
    },
    {
      id: 2,
      name: "Maya Johnson",
      isGroup: false,
      participants: [{ name: "Maya Johnson", shoeSize: "38" }],
      startTime: "11:15 AM",
      endTime: "12:15 PM", // 1 hour duration
      duration: "1h",
      status: "active",
      notes: "",
      createdBy: "Admin User",
    },
    {
      id: 3,
      name: "Raj Patel",
      isGroup: false,
      participants: [{ name: "Raj Patel", shoeSize: "43" }],
      startTime: "09:55 AM",
      endTime: "11:55 AM", // 2 hour duration
      duration: "2h",
      status: "active",
      notes: "",
      createdBy: "Admin User",
    },
    {
      id: 4,
      name: "Sarah Lee",
      isGroup: false,
      participants: [{ name: "Sarah Lee", shoeSize: "37" }],
      startTime: "12:30 PM",
      endTime: "1:30 PM", // 1 hour duration
      duration: "1h",
      status: "active",
      notes: "",
      createdBy: "Admin User",
    },
    {
      id: 5,
      name: "Tom Wilson",
      isGroup: false,
      participants: [{ name: "Tom Wilson", shoeSize: "44" }],
      startTime: "10:00 AM",
      endTime: "12:00 PM", // 2 hour duration
      duration: "2h",
      status: "completed",
      notes: "",
      createdBy: "Admin User",
    },
    {
      id: 6,
      name: "Emma Davis",
      isGroup: false,
      participants: [{ name: "Emma Davis", shoeSize: "39" }],
      startTime: "11:45 AM",
      endTime: "1:00 PM", // 1h 15m duration
      duration: "1h 15m",
      status: "completed",
      notes: "",
      createdBy: "Admin User",
    },
    {
      id: 7,
      name: "Skate Club",
      isGroup: true,
      participants: [
        { name: "Michael Brown", shoeSize: "45" },
        { name: "Jessica Taylor", shoeSize: "38" },
        { name: "David Wilson", shoeSize: "43" },
      ],
      startTime: "01:30 PM",
      endTime: "2:30 PM", // 1 hour duration
      duration: "1h",
      status: "active",
      notes: "Weekly club meeting",
      createdBy: "Admin User",
    },
    {
      id: 8,
      name: "Garcia Family",
      isGroup: true,
      participants: [
        { name: "Sophia Garcia", shoeSize: "36" },
        { name: "Carlos Garcia", shoeSize: "44" },
        { name: "Elena Garcia", shoeSize: "38" },
      ],
      startTime: "02:15 PM",
      endTime: "3:15 PM", // 1 hour duration
      duration: "1h",
      status: "active",
      notes: "Family session",
      createdBy: "Admin User",
    },
  ])

  // Check for sessions that need to be ended
  const checkSessionEndTimes = () => {
    const now = new Date()
    const updatedSessions = sessions.map((session) => {
      if (session.status === "active") {
        const endTime = parseTimeString(session.endTime)
        if (now > endTime) {
          return { ...session, status: "completed" }
        }
      }
      return session
    })

    // Only update state if there are changes
    if (JSON.stringify(updatedSessions) !== JSON.stringify(sessions)) {
      setSessions(updatedSessions)

      // Find sessions that were just completed
      const justCompleted = updatedSessions.filter(
        (session, index) => session.status === "completed" && sessions[index].status === "active",
      )

      if (justCompleted.length > 0) {
        toast({
          title: "Sessions Completed",
          description: `${justCompleted.length} session(s) have been automatically marked as completed.`,
        })
      }
    }
  }

  const [newSessionOpen, setNewSessionOpen] = useState(false)
  const [newSessionData, setNewSessionData] = useState({
    name: "",
    isGroup: false,
    participants: [{ name: "", shoeSize: "" }],
    notes: "",
    sessionType: "standard",
    duration: "1h",
  })

  // For editing sessions
  const [editSessionOpen, setEditSessionOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<Session | null>(null)

  // Store the last ended session for undo functionality
  const [lastEndedSession, setLastEndedSession] = useState<{ id: number; previousStatus: string } | null>(null)

  const filteredSessions = sessions.filter(
    (session) =>
      session.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.participants.some(
        (p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.shoeSize.includes(searchQuery),
      ),
  )

  const getStatusBadge = (status: string, endTimeStr: string) => {
    const endTime = parseTimeString(endTimeStr)
    const now = new Date()

    if (status === "active" && now > endTime) {
      return <Badge variant="destructive">Time Out</Badge>
    }

    switch (status) {
      case "active":
        return <Badge>Active</Badge>
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const endSession = (id: number) => {
    const sessionToEnd = sessions.find((session) => session.id === id)
    if (sessionToEnd) {
      setLastEndedSession({ id, previousStatus: sessionToEnd.status })

      setSessions(sessions.map((session) => (session.id === id ? { ...session, status: "completed" } : session)))

      toast({
        title: "Session Ended",
        description: `${sessionToEnd.name}'s session has been marked as completed.`,
        action: (
          <ToastAction altText="Undo" onClick={undoEndSession}>
            <Undo className="mr-1 h-4 w-4" /> Undo
          </ToastAction>
        ),
      })
    }
  }

  const undoEndSession = () => {
    if (lastEndedSession) {
      setSessions(
        sessions.map((session) =>
          session.id === lastEndedSession.id ? { ...session, status: lastEndedSession.previousStatus } : session,
        ),
      )
      setLastEndedSession(null)

      toast({
        title: "Action Undone",
        description: "The session has been restored to active status.",
      })
    }
  }

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault()

    // Filter out empty participants
    const validParticipants = newSessionData.participants.filter((p) => p.name.trim() !== "" && p.shoeSize !== "")

    if (validParticipants.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one participant with name and shoe size.",
        variant: "destructive",
      })
      return
    }

    // Get current time for start time
    const now = new Date()
    const startTimeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    // Set duration based on session type
    let duration = "1h" // default
    switch (newSessionData.sessionType) {
      case "standard":
        duration = "1h"
        break
      case "extended":
        duration = "2h"
        break
      case "half-day":
        duration = "4h"
        break
      case "full-day":
        duration = "8h"
        break
    }

    // Calculate end time
    const endTimeString = calculateEndTime(startTimeString, duration)

    // Create a new session with the form data
    const newSession: Session = {
      id: sessions.length + 1,
      name: newSessionData.name,
      isGroup: newSessionData.isGroup || validParticipants.length > 1,
      participants: validParticipants,
      startTime: startTimeString,
      endTime: endTimeString,
      duration: duration,
      status: "active",
      notes: newSessionData.notes,
      createdBy: "Admin User",
    }

    setSessions([newSession, ...sessions])
    setNewSessionOpen(false)
    setNewSessionData({
      name: "",
      isGroup: false,
      participants: [{ name: "", shoeSize: "" }],
      notes: "",
      sessionType: "standard",
      duration: "1h",
    })
  }

  const handleEditSession = (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingSession) return

    // Filter out empty participants
    const validParticipants = editingSession.participants.filter((p) => p.name.trim() !== "" && p.shoeSize !== "")

    if (validParticipants.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one participant with name and shoe size.",
        variant: "destructive",
      })
      return
    }

    // Calculate new end time if duration has changed
    let newEndTime = editingSession.endTime
    if (editingSession.duration !== editingSession._originalDuration) {
      newEndTime = calculateEndTime(editingSession.startTime, editingSession.duration)
    }

    // Update the session
    setSessions(
      sessions.map((session) =>
        session.id === editingSession.id
          ? {
              ...editingSession,
              isGroup: editingSession.isGroup || validParticipants.length > 1,
              participants: validParticipants,
              endTime: newEndTime,
            }
          : session,
      ),
    )

    setEditSessionOpen(false)
    setEditingSession(null)

    toast({
      title: "Session Updated",
      description: "The session details have been updated successfully.",
    })
  }

  const startEditSession = (id: number) => {
    const sessionToEdit = sessions.find((session) => session.id === id)
    if (sessionToEdit) {
      // Store original duration for comparison
      setEditingSession({
        ...sessionToEdit,
        _originalDuration: sessionToEdit.duration,
      })
      setEditSessionOpen(true)
    }
  }

  const addParticipant = (isNewSession: boolean) => {
    if (isNewSession) {
      setNewSessionData({
        ...newSessionData,
        participants: [...newSessionData.participants, { name: "", shoeSize: "" }],
      })
    } else if (editingSession) {
      setEditingSession({
        ...editingSession,
        participants: [...editingSession.participants, { name: "", shoeSize: "" }],
      })
    }
  }

  const removeParticipant = (index: number, isNewSession: boolean) => {
    if (isNewSession) {
      if (newSessionData.participants.length > 1) {
        const updatedParticipants = [...newSessionData.participants]
        updatedParticipants.splice(index, 1)
        setNewSessionData({
          ...newSessionData,
          participants: updatedParticipants,
        })
      }
    } else if (editingSession) {
      if (editingSession.participants.length > 1) {
        const updatedParticipants = [...editingSession.participants]
        updatedParticipants.splice(index, 1)
        setEditingSession({
          ...editingSession,
          participants: updatedParticipants,
        })
      }
    }
  }

  const updateParticipant = (index: number, field: "name" | "shoeSize", value: string, isNewSession: boolean) => {
    if (isNewSession) {
      const updatedParticipants = [...newSessionData.participants]
      updatedParticipants[index] = {
        ...updatedParticipants[index],
        [field]: value,
      }
      setNewSessionData({
        ...newSessionData,
        participants: updatedParticipants,
      })
    } else if (editingSession) {
      const updatedParticipants = [...editingSession.participants]
      updatedParticipants[index] = {
        ...updatedParticipants[index],
        [field]: value,
      }
      setEditingSession({
        ...editingSession,
        participants: updatedParticipants,
      })
    }
  }

  const exportData = (format: string) => {
    if (format === "csv") {
      // CSV export
      const csvContent = [
        [
          "ID",
          "Name",
          "Group",
          "Participants",
          "Shoe Sizes",
          "Start Time",
          "End Time",
          "Duration",
          "Status",
          "Notes",
          "Created By",
        ],
        ...filteredSessions.map((session) => [
          session.id,
          session.name,
          session.isGroup ? "Yes" : "No",
          session.participants.map((p) => p.name).join(", "),
          session.participants.map((p) => p.shoeSize).join(", "),
          session.startTime,
          session.endTime,
          session.duration,
          session.status,
          session.notes,
          session.createdBy,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `sessions_${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (format === "xlsx") {
      // XLSX export
      const data = [
        [
          "ID",
          "Name",
          "Group",
          "Participants",
          "Shoe Sizes",
          "Start Time",
          "End Time",
          "Duration",
          "Status",
          "Notes",
          "Created By",
        ],
        ...filteredSessions.map((session) => [
          session.id,
          session.name,
          session.isGroup ? "Yes" : "No",
          session.participants.map((p) => p.name).join(", "),
          session.participants.map((p) => p.shoeSize).join(", "),
          session.startTime,
          session.endTime,
          session.duration,
          session.status,
          session.notes,
          session.createdBy,
        ]),
      ]

      const ws = XLSX.utils.aoa_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Sessions")
      XLSX.writeFile(wb, `sessions_${new Date().toISOString().split("T")[0]}.xlsx`)
    }
  }

  const columns = [
    {
      key: "name",
      title: "Name",
      render: (value: string, item: Session) => (
        <div>
          <span className="font-medium">{value}</span>
          {item.isGroup && (
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
      render: (_: any, item: Session) => (
        <div className="text-sm">
          {item.participants.length > 1 ? <span>{item.participants.length} people</span> : <span>Individual</span>}
        </div>
      ),
    },
    {
      key: "shoeSizes",
      title: "Shoe Sizes",
      render: (_: any, item: Session) => (
        <div className="text-sm">{item.participants.map((p) => p.shoeSize).join(", ")}</div>
      ),
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
      render: (value: string) => (
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          {value}
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (value: string, item: Session) => getStatusBadge(value, item.endTime),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_: any, item: Session) => (
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => startEditSession(item.id)}>
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>

          {item.status !== "completed" && (
            <Button variant="outline" size="sm" onClick={() => endSession(item.id)}>
              End Session
            </Button>
          )}

          {item.status === "completed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => undoEndSession()}
              disabled={lastEndedSession?.id !== item.id}
            >
              <Undo className="mr-1 h-4 w-4" /> Undo
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="flex-1 w-full space-y-4 p-4 md:p-6 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Sessions</h2>
        <div className="flex gap-2">
          <Dialog open={newSessionOpen} onOpenChange={setNewSessionOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setNewSessionOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Session
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <form onSubmit={handleCreateSession}>
                <DialogHeader>
                  <DialogTitle>Create New Session</DialogTitle>
                  <DialogDescription>Enter the details to start a new skating session.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Session Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter name (individual or group)"
                      value={newSessionData.name}
                      onChange={(e) => setNewSessionData({ ...newSessionData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <Label>Participants</Label>
                      <Button type="button" variant="outline" size="sm" onClick={() => addParticipant(true)}>
                        <Plus className="h-4 w-4 mr-1" /> Add Participant
                      </Button>
                    </div>

                    {newSessionData.participants.map((participant, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <div className="flex-1">
                          <Input
                            placeholder="Participant name"
                            value={participant.name}
                            onChange={(e) => updateParticipant(index, "name", e.target.value, true)}
                          />
                        </div>
                        <div className="w-24">
                          <Select
                            value={participant.shoeSize}
                            onValueChange={(value) => updateParticipant(index, "shoeSize", value, true)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Size" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 15 }, (_, i) => i + 36).map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {newSessionData.participants.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeParticipant(index, true)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="session-type">Session Type</Label>
                    <Select
                      value={newSessionData.sessionType}
                      onValueChange={(value) => setNewSessionData({ ...newSessionData, sessionType: value })}
                    >
                      <SelectTrigger id="session-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (1 hour)</SelectItem>
                        <SelectItem value="extended">Extended (2 hours)</SelectItem>
                        <SelectItem value="half-day">Half Day (4 hours)</SelectItem>
                        <SelectItem value="full-day">Full Day (8 hours)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional information about this session"
                      value={newSessionData.notes}
                      onChange={(e) => setNewSessionData({ ...newSessionData, notes: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Start Session</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Session Dialog */}
          <Dialog open={editSessionOpen} onOpenChange={setEditSessionOpen}>
            <DialogContent className="max-w-2xl">
              {editingSession && (
                <form onSubmit={handleEditSession}>
                  <DialogHeader>
                    <DialogTitle>Edit Session</DialogTitle>
                    <DialogDescription>Update the session details.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-name">Session Name</Label>
                      <Input
                        id="edit-name"
                        placeholder="Enter name (individual or group)"
                        value={editingSession.name}
                        onChange={(e) => setEditingSession({ ...editingSession, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <Label>Participants</Label>
                        <Button type="button" variant="outline" size="sm" onClick={() => addParticipant(false)}>
                          <Plus className="h-4 w-4 mr-1" /> Add Participant
                        </Button>
                      </div>

                      {editingSession.participants.map((participant, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <div className="flex-1">
                            <Input
                              placeholder="Participant name"
                              value={participant.name}
                              onChange={(e) => updateParticipant(index, "name", e.target.value, false)}
                            />
                          </div>
                          <div className="w-24">
                            <Select
                              value={participant.shoeSize}
                              onValueChange={(value) => updateParticipant(index, "shoeSize", value, false)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Size" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 15 }, (_, i) => i + 36).map((size) => (
                                  <SelectItem key={size} value={size.toString()}>
                                    {size}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {editingSession.participants.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeParticipant(index, false)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="edit-duration">Duration</Label>
                      <Select
                        value={editingSession.duration}
                        onValueChange={(value) => setEditingSession({ ...editingSession, duration: value })}
                      >
                        <SelectTrigger id="edit-duration">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1h">1 hour</SelectItem>
                          <SelectItem value="2h">2 hours</SelectItem>
                          <SelectItem value="4h">4 hours</SelectItem>
                          <SelectItem value="8h">8 hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Changing the duration will update the end time automatically.
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="edit-notes">Notes</Label>
                      <Textarea
                        id="edit-notes"
                        placeholder="Additional information about this session"
                        value={editingSession.notes}
                        onChange={(e) => setEditingSession({ ...editingSession, notes: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Start Time</Label>
                        <Input value={editingSession.startTime} disabled />
                      </div>
                      <div className="grid gap-2">
                        <Label>Current End Time</Label>
                        <Input value={editingSession.endTime} disabled />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Status</Label>
                      <Input value={editingSession.status} disabled />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Update Session</Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
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

      <Card>
        <CardHeader>
          <CardTitle>Active & Recent Sessions</CardTitle>
          <CardDescription>Manage ongoing and recently completed skating sessions</CardDescription>
          <div className="flex w-full max-w-sm items-center space-x-2 mt-2">
            <Input
              placeholder="Search by name or shoe size..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
            {searchQuery && (
              <Button variant="ghost" size="icon" onClick={() => setSearchQuery("")} className="h-9 w-9">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveTable data={filteredSessions} columns={columns} keyField="id" />
        </CardContent>
      </Card>
    </div>
  )
}
