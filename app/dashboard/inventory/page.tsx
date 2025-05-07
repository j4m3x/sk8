"use client"

import type React from "react"

import { useState } from "react"
import { Edit, FileDown, Plus, Search, ShoppingBag } from "lucide-react"
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
import { Progress } from "@/components/ui/progress"
import { ResponsiveTable } from "@/components/responsive-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import * as XLSX from "xlsx"

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [newInventoryOpen, setNewInventoryOpen] = useState(false)
  const [newInventoryData, setNewInventoryData] = useState({
    size: "",
    quantity: "1",
    condition: "new",
    notes: "",
  })

  const inventory = [
    { id: 1, size: "36", total: 3, available: 2, status: "available" },
    { id: 2, size: "37", total: 4, available: 3, status: "available" },
    { id: 3, size: "38", total: 5, available: 2, status: "available" },
    { id: 4, size: "39", total: 5, available: 4, status: "available" },
    { id: 5, size: "40", total: 6, available: 3, status: "available" },
    { id: 6, size: "41", total: 6, available: 5, status: "available" },
    { id: 7, size: "42", total: 5, available: 2, status: "available" },
    { id: 8, size: "43", total: 5, available: 3, status: "available" },
    { id: 9, size: "44", total: 4, available: 2, status: "available" },
    { id: 10, size: "45", total: 3, available: 1, status: "low" },
    { id: 11, size: "46", total: 2, available: 0, status: "out" },
    { id: 12, size: "47", total: 2, available: 1, status: "low" },
  ]

  const filteredInventory = inventory.filter((item) => item.size.includes(searchQuery))

  const totalShoes = inventory.reduce((acc, item) => acc + item.total, 0)
  const availableShoes = inventory.reduce((acc, item) => acc + item.available, 0)
  const availabilityPercentage = Math.round((availableShoes / totalShoes) * 100)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Available
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Low Stock
          </Badge>
        )
      case "out":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Out of Stock
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleAddInventory = (e: React.FormEvent) => {
    e.preventDefault()

    // Find the existing inventory item
    const existingItemIndex = inventory.findIndex((item) => item.size === newInventoryData.size)

    if (existingItemIndex >= 0) {
      // Update existing inventory
      const updatedInventory = [...inventory]
      const item = updatedInventory[existingItemIndex]
      const newQuantity = Number.parseInt(newInventoryData.quantity)

      updatedInventory[existingItemIndex] = {
        ...item,
        total: item.total + newQuantity,
        available: item.available + newQuantity,
        status: item.available + newQuantity === 0 ? "out" : item.available + newQuantity <= 1 ? "low" : "available",
      }

      // This would update state in a real app
      // setInventory(updatedInventory)
    }

    setNewInventoryOpen(false)
    setNewInventoryData({
      size: "",
      quantity: "1",
      condition: "new",
      notes: "",
    })
  }

  const exportData = (format: string) => {
    if (format === "csv") {
      // CSV export
      const csvContent = [
        ["ID", "Size", "Total", "Available", "In Use", "Status"],
        ...filteredInventory.map((item) => [
          item.id,
          item.size,
          item.total,
          item.available,
          item.total - item.available,
          item.status,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `inventory_${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (format === "xlsx") {
      // XLSX export
      const data = [
        ["ID", "Size", "Total", "Available", "In Use", "Status"],
        ...filteredInventory.map((item) => [
          item.id,
          item.size,
          item.total,
          item.available,
          item.total - item.available,
          item.status,
        ]),
      ]

      const ws = XLSX.utils.aoa_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Inventory")
      XLSX.writeFile(wb, `inventory_${new Date().toISOString().split("T")[0]}.xlsx`)
    }
  }

  const columns = [
    {
      key: "size",
      title: "Size",
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      key: "total",
      title: "Total",
    },
    {
      key: "available",
      title: "Available",
    },
    {
      key: "inUse",
      title: "In Use",
      render: (_: any, item: any) => item.total - item.available,
    },
    {
      key: "status",
      title: "Status",
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: "actions",
      title: "Actions",
      render: () => (
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="flex-1 w-full space-y-4 p-4 md:p-6 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Shoe Inventory</h2>
        <div className="flex gap-2">
          <Dialog open={newInventoryOpen} onOpenChange={setNewInventoryOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setNewInventoryOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Inventory
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleAddInventory}>
                <DialogHeader>
                  <DialogTitle>Add Inventory</DialogTitle>
                  <DialogDescription>Add new shoes to the inventory.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="shoe-size">Shoe Size</Label>
                      <Select
                        value={newInventoryData.size}
                        onValueChange={(value) => setNewInventoryData({ ...newInventoryData, size: value })}
                      >
                        <SelectTrigger id="shoe-size">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 36).map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        placeholder="Enter quantity"
                        value={newInventoryData.quantity}
                        onChange={(e) => setNewInventoryData({ ...newInventoryData, quantity: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select
                      value={newInventoryData.condition}
                      onValueChange={(value) => setNewInventoryData({ ...newInventoryData, condition: value })}
                    >
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      placeholder="Additional information"
                      value={newInventoryData.notes}
                      onChange={(e) => setNewInventoryData({ ...newInventoryData, notes: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add to Inventory</Button>
                </DialogFooter>
              </form>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shoes</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShoes}</div>
            <p className="text-xs text-muted-foreground">Across {inventory.length} different sizes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Shoes</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableShoes}</div>
            <Progress value={availabilityPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{availabilityPercentage}% availability</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.filter((item) => item.status === "low").length}</div>
            <p className="text-xs text-muted-foreground">Sizes that need restocking soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.filter((item) => item.status === "out").length}</div>
            <p className="text-xs text-muted-foreground">Sizes that need immediate restocking</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Management</CardTitle>
          <CardDescription>Manage your shoe inventory across all sizes</CardDescription>
          <div className="flex w-full max-w-sm items-center space-x-2 mt-2">
            <Input
              placeholder="Search by size..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
            <Button variant="secondary" size="sm" className="h-9">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveTable data={filteredInventory} columns={columns} keyField="id" />
        </CardContent>
      </Card>
    </div>
  )
}
